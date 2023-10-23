<?php

/*
 * This file is part of fof/reactions.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Reactions\Listener;

use Flarum\Extension\ExtensionManager;
use Flarum\Foundation\ValidationException;
use Flarum\Likes\Event\PostWasLiked;
use Flarum\Post\Event\Saving;
use Flarum\Post\Post;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\User;
use FoF\Gamification\Listeners\SaveVotesToDatabase;
use FoF\Reactions\Event\PostWasReacted;
use FoF\Reactions\Event\PostWasUnreacted;
use FoF\Reactions\Event\WillReactToPost;
use FoF\Reactions\PostAnonymousReaction;
use FoF\Reactions\PostReaction;
use FoF\Reactions\Reaction;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Pusher;
use Symfony\Contracts\Translation\TranslatorInterface;

class SaveReactionsToDatabase
{
    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    /**
     * @var TranslatorInterface
     */
    protected $translator;

    /**
     * @var ExtensionManager
     */
    protected $extensions;

    /**
     * @var Dispatcher
     */
    protected $events;

    public function __construct(SettingsRepositoryInterface $settings, TranslatorInterface $translator, ExtensionManager $extensions, Dispatcher $events)
    {
        $this->settings = $settings;
        $this->translator = $translator;
        $this->extensions = $extensions;
        $this->events = $events;
    }

    /**
     * @param Saving $event
     *
     * @throws \Flarum\User\Exception\PermissionDeniedException
     * @throws \Flarum\Foundation\ValidationException
     */
    public function handle(Saving $event)
    {
        $post = $event->post;
        $data = $event->data;

        if ($post->exists && Arr::has($data, 'attributes.reaction')) {
            $actor = $event->actor;

            $reactionId = Arr::get($data, 'attributes.reaction');

            $actor->assertCan('react', $post);

            $reaction = !is_null($reactionId) ? Reaction::where('id', $reactionId)->first() : null;

            $this->events->dispatch(new WillReactToPost($post, $actor, $reaction));

            $gamification = $this->isExtensionEnabled('fof-gamification');
            $likes = $this->isExtensionEnabled('flarum-likes');

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

                    $post->raise(new PostWasLiked($post, $actor));
                }
            } else {
                $guestId = $this->getSessionId();
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
                    }

                    $post->raise(new PostWasUnreacted($post, $postReaction, $actor));
                } else {
                    $this->validateReaction($reactionId);

                    if ($postReaction) {
                        $postReaction->reaction_id = $reaction->id;
                        $postReaction->save();
                    } else {
                        $isGuest = $actor->isGuest();
                        $postReaction = $isGuest ? new PostAnonymousReaction() : new PostReaction();

                        $postReaction->post_id = $post->id;

                        if ($isGuest) {
                            $postReaction->guest_id = $guestId;
                        } else {
                            $postReaction->user_id = $actor->id;
                        }

                        $postReaction->reaction_id = $reaction->id;

                        $postReaction->save();
                    }

                    // We'll maintain current behaviour and only push to Pusher if the reaction is not anonymous
                    if ($postReaction instanceof PostReaction) {
                        $this->push('newReaction', $postReaction, $reaction, $actor, $post);
                    }

                    $post->raise(new PostWasReacted($post, $postReaction, $actor, $reaction));
                }
            }
        }
    }

    /**
     * @param              $event
     * @param PostReaction $postReaction
     * @param Reaction     $reaction
     * @param User         $actor
     * @param Post         $post
     */
    public function push($event, PostReaction $postReaction, Reaction $reaction, User $actor, Post $post)
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

    protected function validateReaction($reactionId)
    {
        if (is_null($reactionId)) {
            return;
        }

        $reaction = Reaction::find($reactionId);

        if (!$reaction || !$reaction->enabled) {
            throw new ValidationException([
                'reaction' => $this->translator->trans('fof-reactions.forum.disabled-reaction'),
            ]);
        }
    }

    protected function isExtensionEnabled(string $extension): bool
    {
        return $this->extensions->isEnabled($extension);
    }

    protected function getSessionId(): ?string
    {
        /** @var ServerRequestInterface $request */
        $request = resolve('fof-reactions.request');
        $session = $request->getAttribute('session');

        return $session ? $session->getId() : null;
    }
}
