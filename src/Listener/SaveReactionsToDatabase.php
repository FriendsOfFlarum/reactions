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

use Flarum\Likes\Event\PostWasLiked;
use Flarum\Post\Event\Saving;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\AssertPermissionTrait;
use FoF\Reactions\Event\PostWasReacted;
use FoF\Reactions\Event\PostWasUnreacted;
use FoF\Reactions\PostReaction;
use FoF\Reactions\Reaction;
use Illuminate\Contracts\Events\Dispatcher;

class SaveReactionsToDatabase
{
    use AssertPermissionTrait;

    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    /**
     * @param SettingsRepositoryInterface $settings
     */
    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
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
     */
    public function whenSaving(Saving $event)
    {
        $post = $event->post;
        $data = $event->data;

        if ($post->exists && isset($data['attributes']['reaction'])) {
            $actor = $event->actor;
            $reactionType = $data['attributes']['reaction'];

            $this->assertCan($actor, 'react', $post);

            if (class_exists('FoF\Gamification\Listeners\SaveVotesToDatabase') && $reactionType == $this->settings->get('fof-reactions.convertToUpvote')) {
                app()->make('FoF\Gamification\Listeners\SaveVotesToDatabase')->vote($post, $isDownvoted = false,
                    $isUpvoted = true, $actor, $post->user);
            } elseif (class_exists('FoF\Gamification\Listeners\SaveVotesToDatabase') && $reactionType == $this->settings->get('fof-reactions.convertToDownvote')) {
                app()->make('FoF\Gamification\Listeners\SaveVotesToDatabase')->vote($post, $isDownvoted = true,
                    $isUpvoted = false, $actor, $post->user);
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
                        $post->raise(new PostWasReacted($post, $actor, $reaction, true));
                    } else {
                        $oldReaction->reaction_id = null;
                        $oldReaction->save();

                        $post->raise(new PostWasUnreacted($post, $actor));
                    }
                } else {
                    $post->reactions()->attach($reaction, ['user_id' => $actor->id, 'reaction_id' => $reaction->id]);
                    $post->raise(new PostWasReacted($post, $actor, $reaction));
                }
            }
        }
    }
}
