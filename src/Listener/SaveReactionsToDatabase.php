<?php

/*
 * This file is part of fof/reactions.
 *
 * Copyright (c) 2019 FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Reactions\Listener;

use Carbon\Carbon;
use Flarum\Foundation\ValidationException;
use Flarum\Likes\Event\PostWasLiked;
use Flarum\Post\Event\Saving;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\AssertPermissionTrait;
use FoF\Reactions\Event\PostWasReacted;
use FoF\Reactions\Event\PostWasUnreacted;
use FoF\Reactions\PostReaction;
use FoF\Reactions\Reaction;
use Illuminate\Contracts\Events\Dispatcher;
use Pusher\Pusher;
use Symfony\Component\Translation\TranslatorInterface;

class SaveReactionsToDatabase
{
    use AssertPermissionTrait;

    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    /**
     * @var TranslatorInterface
     */
    protected $translator;

    /**
     * @param SettingsRepositoryInterface $settings
     */
    public function __construct(SettingsRepositoryInterface $settings, TranslatorInterface $translator)
    {
        $this->settings = $settings;
        $this->translator = $translator;
    }

    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(Saving::class, [$this, 'whenSaving']);
    }

    /**
     * @param Saving $event
     *
     * @throws \Flarum\User\Exception\PermissionDeniedException
     * @throws \Flarum\Foundation\ValidationException
     */
    public function whenSaving(Saving $event)
    {
        $post = $event->post;
        $data = $event->data;

        if ($post->exists && isset($data['attributes']['reaction'])) {
            $actor = $event->actor;
            $reactionType = $data['attributes']['reaction'];

            $this->assertCan($actor, 'react', $post);

            if ($actor->id === $post->user_id) {
                throw new ValidationException([
                    'message' => $this->translator->trans('fof-reactions.forum.reacting-own-post'),
                ]);
            }

            $this->validateReaction($reactionType);

            if (class_exists('FoF\Gamification\Listeners\SaveVotesToDatabase') && $reactionType == $this->settings->get('fof-reactions.convertToUpvote')) {
                app()->make('FoF\Gamification\Listeners\SaveVotesToDatabase')->vote(
                    $post,
                    $isDownvoted = false,
                    $isUpvoted = true,
                    $actor,
                    $post->user
                );
            } elseif (class_exists('FoF\Gamification\Listeners\SaveVotesToDatabase') && $reactionType == $this->settings->get('fof-reactions.convertToDownvote')) {
                app()->make('FoF\Gamification\Listeners\SaveVotesToDatabase')->vote(
                    $post,
                    $isDownvoted = true,
                    $isUpvoted = false,
                    $actor,
                    $post->user
                );
            } elseif (class_exists('Flarum\Likes\Listener\SaveLikesToDatabase') && $reactionType == $this->settings->get('fof-reactions.convertToLike')) {
                $liked = $post->likes()->where('user_id', $actor->id)->exists();
                if ($liked) {
                    return;
                } else {
                    $post->likes()->attach($actor->id);

                    $post->raise(new PostWasLiked($post, $actor));
                }
            } else {
                $oldReaction = PostReaction::where([['user_id', $actor->id], ['post_id', $post->id]])->first();
                $reaction = Reaction::where('identifier', $reactionType)->firstOrFail();

                if ($oldReaction) {
                    if ($oldReaction->reaction_id === null) {
                        $oldReaction->reaction_id = $reaction->id;
                        $oldReaction->save();

                        $this->pushNewReaction($oldReaction, $actor, $post, $reactionType);

                        $post->raise(new PostWasReacted($post, $actor, $reaction, true));
                    } else {
                        $oldReaction->reaction_id = null;
                        $oldReaction->save();

                        $post->raise(new PostWasUnreacted($post, $actor));
                    }
                } else {
                    $post->reactions()->attach($reaction, ['user_id' => $actor->id, 'reaction_id' => $reaction->id, 'created_at' => Carbon::now()]);

                    $this->pushNewReaction($reaction, $actor, $post, $reactionType);

                    $post->raise(new PostWasReacted($post, $actor, $reaction));
                }
            }
        }
    }

    /**
     * @param $reaction
     * @param $actor
     * @param $post
     * @param $identifier
     * @throws \Pusher\PusherException
     */
    public function pushNewReaction($reaction, $actor, $post, $identifier)
    {
        if ($pusher = $this->getPusher()) {

            $pusher->trigger('public', 'newReaction', [
                'reaction' => $reaction,
                'postId' => $post->id,
                'userId' => $actor->id,
                'identifier' => $identifier,
            ]);
        }
    }

    /**
     * @return bool|\Illuminate\Foundation\Application|mixed|Pusher
     * @throws \Pusher\PusherException
     */
    private function getPusher()
    {
        if (!class_exists(Pusher::class)) {
            return false;
        }

        if (app()->bound(Pusher::class)) {
            return app(Pusher::class);
        } else {
            $settings = app('flarum.settings');

            $options = [];

            if ($cluster = $settings->get('flarum-pusher.app_cluster')) {
                $options['cluster'] = $cluster;
            }

            return new Pusher(
                $settings->get('flarum-pusher.app_key'),
                $settings->get('flarum-pusher.app_secret'),
                $settings->get('flarum-pusher.app_id'),
                $options
            );
        }
    }

    protected function validateReaction($identifier)
    {
        $reaction = Reaction::where('identifier', $identifier)->first();

        if (!$reaction->enabled) {
            throw new ValidationException([
                'message' => $this->translator->trans('fof-reactions.forum.disabled-reaction'),
            ]);
        }
    }
}
