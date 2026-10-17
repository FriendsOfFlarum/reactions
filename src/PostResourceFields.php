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

class PostResourceFields
{
    public function __construct(
        protected SettingsRepositoryInterface $settings,
        protected Dispatcher $events,
        protected ExtensionManager $extensions,
        protected TranslatorInterface $translator,
        protected ReactionCountResolver $resolver
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
                ->get(fn (Post $post, Context $context) => $this->resolver->countsFor($post->id, $context->request)),
            Schema\Number::make('userReaction')
                ->get(fn (Post $post, Context $context) => $this->resolver->userReactionFor($post->id, $context->getActor(), $context->request)),

            Schema\Str::make('reaction')
                ->hidden()
                ->nullable()
                ->writableOnUpdate()
                ->save($this->setReaction(...)),
        ];
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
                // The actor's one row for this post, backed by a unique index on these columns.
                $key = $actor->isGuest()
                    ? ['post_id' => $post->id, 'guest_id' => $context->request->getAttribute('session')?->getId()]
                    : ['post_id' => $post->id, 'user_id' => $actor->id];

                $query = $actor->isGuest() ? PostAnonymousReaction::query() : PostReaction::query();

                /** @var PostReaction|PostAnonymousReaction|null $postReaction */
                $postReaction = (clone $query)->where($key)->first();

                $removeReaction = is_null($reactionId) || ($postReaction && $postReaction->reaction_id == $reactionId);

                if ($removeReaction) {
                    // An unreact keeps the row with a null reaction_id, so a repeated unreact finds it again.
                    // Only a reaction that was actually there is removed, pushed and dispatched.
                    if ($postReaction && $postReaction->reaction_id !== null) {
                        // We'll maintain current behaviour and only push to Pusher if the reaction is not anonymous
                        if ($postReaction instanceof PostReaction) {
                            $this->push('removedReaction', $postReaction, $reaction ?: $postReaction->reaction, $actor, $post);
                        }

                        $postReaction->reaction_id = null;
                        $postReaction->save();

                        $this->events->dispatch(new PostWasUnreacted($post, $postReaction, $actor));
                    }
                } else {
                    $this->validateReaction($reaction, $reactionId);

                    // A concurrent request (double click, retry) can insert the row between the lookup above and
                    // this insert. createOrFirst() then catches the unique violation and returns that row instead.
                    /** @var PostReaction|PostAnonymousReaction $postReaction */
                    $postReaction ??= $query->createOrFirst($key, ['reaction_id' => $reaction->id]);

                    $postReaction->reaction_id = $reaction->id;
                    $changed = $postReaction->wasRecentlyCreated || $postReaction->isDirty('reaction_id');
                    $postReaction->save();

                    // A lost race that found this same reaction already saved changes nothing, so it isn't
                    // pushed or dispatched a second time.
                    if ($changed) {
                        // We'll maintain current behaviour and only push to Pusher if the reaction is not anonymous
                        if ($postReaction instanceof PostReaction) {
                            $this->push('newReaction', $postReaction, $reaction, $actor, $post);
                        }

                        $this->events->dispatch(new PostWasReacted($post, $postReaction, $actor, $reaction));
                    }
                }
            }

            // Reactions for this post changed in this request; drop any memoized
            // counts/userReaction so the response reflects the new state.
            $this->resolver->forget($post->id, $context->request);
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
