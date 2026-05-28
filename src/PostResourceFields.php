<?php

/*
 * This file is part of fof/reactions.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Reactions;

use Flarum\Api\Context;
use Flarum\Api\Schema;
use Flarum\Extension\ExtensionManager;
use Flarum\Foundation\ValidationException;
use Flarum\Likes\Event\PostWasLiked;
use Flarum\Locale\TranslatorInterface;
use Flarum\Post\Post;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\User;
use FoF\Gamification\Listeners\SaveVotesToDatabase;
use FoF\Reactions\Event\PostWasReacted;
use FoF\Reactions\Event\PostWasUnreacted;
use FoF\Reactions\Event\WillReactToPost;
use Illuminate\Contracts\Events\Dispatcher;
use Psr\Http\Message\ServerRequestInterface;

class PostResourceFields
{
    public function __construct(
        protected SettingsRepositoryInterface $settings,
        protected Dispatcher $events,
        protected ExtensionManager $extensions,
        protected TranslatorInterface $translator
    ) {
    }

    public function __invoke(): array
    {
        return [
            Schema\Boolean::make('canReact')
                ->get(fn (Post $post, Context $context) => $context->getActor()->can('react', $post)),
            Schema\Boolean::make('canDeletePostReactions')
                ->get(fn (Post $post, Context $context) => $context->getActor()->can('deleteReactions', $post)),
            Schema\Arr::make('reactionCounts')
                ->get(fn (Post $post) => $post->getAttribute('_reactionCounts') ?? $this->getReactionCountsForPost($post)),
            Schema\Number::make('userReaction')
                ->get(fn (Post $post, Context $context) => $post->hasAttribute('_userReaction')
                    ? $post->getAttribute('_userReaction')
                    : $this->getActorReactionForPost($context->getActor(), $post, $context->request)),

            Schema\Str::make('reaction')
                ->hidden()
                ->nullable()
                ->writableOnUpdate()
                ->save($this->setReaction(...)),
        ];
    }

    /**
     * Fallback per-post query used when batch-loading was not performed (e.g. single-post Show endpoint
     * before the beforeSerialization hook has run, or in tests).
     */
    protected function getReactionCountsForPost(Post $post): array
    {
        $counts = [];

        $registeredReactions = PostReaction::where('post_id', $post->id)
            ->whereNotNull('reaction_id')
            ->groupBy('reaction_id')
            ->selectRaw('reaction_id, COUNT(*) as count')
            ->pluck('count', 'reaction_id');

        $anonymousReactions = collect([]);
        if ($this->settings->get('fof-reactions.anonymousReactions')) {
            $anonymousReactions = PostAnonymousReaction::where('post_id', $post->id)
                ->whereNotNull('reaction_id')
                ->groupBy('reaction_id')
                ->selectRaw('reaction_id, COUNT(*) as count')
                ->pluck('count', 'reaction_id');
        }

        foreach (Reaction::all() as $reaction) {
            $counts[$reaction->id] = $registeredReactions->get($reaction->id, 0) + $anonymousReactions->get($reaction->id, 0);
        }

        return $counts;
    }

    protected function getActorReactionForPost(User $actor, Post $post, ServerRequestInterface $request): ?int
    {
        if ($actor->isGuest()) {
            $session = $request->getAttribute('session');

            if ($session === null) {
                return null;
            }

            return PostAnonymousReaction::where('post_id', $post->id)
                ->where('guest_id', $session->getId())
                ->whereNotNull('reaction_id')
                ->value('reaction_id');
        }

        return PostReaction::where('post_id', $post->id)
            ->where('user_id', $actor->id)
            ->whereNotNull('reaction_id')
            ->value('reaction_id');
    }

    protected function setReaction(Post $post, ?string $reactionId, Context $context): void
    {
        if ($post->exists) {
            $actor = $context->getActor();

            $actor->assertCan('react', $post);

            $reaction = !is_null($reactionId) ? Reaction::where('id', $reactionId)->first() : null;

            if ($reaction) {
                $this->events->dispatch(new WillReactToPost($post, $actor, $reaction));
            }

            $gamification = $this->extensions->isEnabled('fof-gamification');
            $likes = $this->extensions->isEnabled('flarum-likes');

            $gamificationUpvote = $this->settings->get('fof-reactions.convertToUpvote');
            $gamificationDownvote = $this->settings->get('fof-reactions.convertToDownvote');

            if ($gamification && class_exists(SaveVotesToDatabase::class) && $reaction && $reaction->identifier == $gamificationUpvote) {
                resolve(SaveVotesToDatabase::class)->vote(
                    $post,
                    false,
                    true,
                    $actor,
                    $post->user
                );
            } elseif ($gamification && class_exists(SaveVotesToDatabase::class) && $reaction && $reaction->identifier == $gamificationDownvote) {
                resolve(SaveVotesToDatabase::class)->vote(
                    $post,
                    true,
                    false,
                    $actor,
                    $post->user
                );
            } elseif ($likes && $reaction && $reaction->identifier == $this->settings->get('fof-reactions.convertToLike')) {
                /** @phpstan-ignore-next-line */
                $liked = $post->likes()->where('user_id', $actor->id)->exists();

                if ($liked) {
                    return;
                } else {
                    // TODO: we should probably start checking permission to like here
                    //$actor->assertCan('like', $post);

                    /** @phpstan-ignore-next-line */
                    $post->likes()->attach($actor->id);

                    $this->events->dispatch(new PostWasLiked($post, $actor));
                }
            } else {
                $guestId = $context->request->getAttribute('session')?->getId();

                /**
                 * @var PostReaction|PostAnonymousReaction|null $postReaction
                 */
                if ($actor->isGuest()) {
                    $postReaction = PostAnonymousReaction::where([['guest_id', $guestId], ['post_id', $post->id]])->first();
                } else {
                    $postReaction = PostReaction::where([['user_id', $actor->id], ['post_id', $post->id]])->first();
                }

                $removeReaction = is_null($reactionId) || ($postReaction && $postReaction->reaction_id == $reactionId);

                if ($removeReaction) {
                    if ($postReaction) {
                        // We'll maintain current behaviour and only push to Pusher if the reaction is not anonymous
                        if ($postReaction instanceof PostReaction) {
                            $this->push('removedReaction', $postReaction, $reaction ?: $postReaction->reaction, $actor, $post);
                        }

                        $postReaction->reaction_id = null;
                        $postReaction->save();

                        // Only dispatch event if a post reaction actually existed (anonymous or not).
                        // We can treat this as a no-op since the end result is the same as if a reaction existed and had been removed.
                        $this->events->dispatch(new PostWasUnreacted($post, $postReaction, $actor));
                    }
                } else {
                    $this->validateReaction($reaction, $reactionId);

                    if (!$postReaction) {
                        $isGuest = $actor->isGuest();
                        $postReaction = $isGuest ? new PostAnonymousReaction() : new PostReaction();

                        $postReaction->post_id = $post->id;

                        if ($isGuest) {
                            $postReaction->guest_id = $guestId;
                        } else {
                            $postReaction->user_id = $actor->id;
                        }
                    }

                    $postReaction->reaction_id = $reaction->id;
                    $postReaction->save();

                    // We'll maintain current behaviour and only push to Pusher if the reaction is not anonymous
                    if ($postReaction instanceof PostReaction) {
                        $this->push('newReaction', $postReaction, $reaction, $actor, $post);
                    }

                    $this->events->dispatch(new PostWasReacted($post, $postReaction, $actor, $reaction));
                }
            }
        }
    }

    public function push(string $event, PostReaction $postReaction, Reaction $reaction, User $actor, Post $post): void
    {
        if ($pusher = $this->getPusher()) {
            $pusher->trigger('public', $event, [
                'id'         => (string) $postReaction->id,
                'reactionId' => $reaction->id,
                'postId'     => $post->id,
                'userId'     => $actor->id,
            ]);
        }
    }

    /**
     * @return bool|\Illuminate\Foundation\Application|mixed|Pusher
     */
    private function getPusher()
    {
        if (class_exists(Pusher::class) && resolve('container')->bound(Pusher::class)) {
            return resolve(Pusher::class);
        }

        return false;
    }

    protected function validateReaction(?Reaction $reaction, ?string $reactionId): void
    {
        if (is_null($reactionId)) {
            return;
        }

        if (!$reaction || !$reaction->enabled) {
            throw new ValidationException([
                'reaction' => $this->translator->trans('fof-reactions.forum.disabled-reaction'),
            ]);
        }
    }
}
