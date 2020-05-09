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
use Flarum\Extension\ExtensionManager;
use Flarum\Foundation\ValidationException;
use Flarum\Likes\Event\PostWasLiked;
use Flarum\Post\Event\Saving;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\AssertPermissionTrait;
use FoF\Gamification\Listeners\SaveVotesToDatabase;
use FoF\Reactions\Event\PostWasReacted;
use FoF\Reactions\Event\PostWasUnreacted;
use FoF\Reactions\PostReaction;
use FoF\Reactions\Reaction;
use Illuminate\Support\Arr;
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
     * @var ExtensionManager
     */
    protected $extensions;

    public function __construct(SettingsRepositoryInterface $settings, TranslatorInterface $translator, ExtensionManager $extensions)
    {
        $this->settings = $settings;
        $this->translator = $translator;
        $this->extensions = $extensions;
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
            $reactionIdentifier = null;

            $this->assertCan($actor, 'react', $post);

            if ($actor->id === $post->user_id) {
                throw new ValidationException([
                    'message' => $this->translator->trans('fof-reactions.forum.reacting-own-post'),
                ]);
            }

            $this->validateReaction($reactionId);

            $reaction = Reaction::where('id', $reactionId)->firstOrFail();

            $gamification = $this->extensions->isEnabled('fof-gamification');
            $likes = $this->extensions->isEnabled('flarum-likes');

            $gamificationUpvote = $this->settings->get('fof-reactions.convertToUpvote');
            $gamificationDownvote = $this->settings->get('fof-reactions.convertToDownvote');

            if ($gamification && class_exists(SaveVotesToDatabase::class) && $reaction && $reaction->identifier == $gamificationUpvote) {
                app()->make(SaveVotesToDatabase::class)->vote(
                    $post,
                    false,
                    true,
                    $actor,
                    $post->user
                );
            } else if ($gamification && class_exists(SaveVotesToDatabase::class) && $reaction && $reaction->identifier == $gamificationDownvote) {
                app()->make(SaveVotesToDatabase::class)->vote(
                    $post,
                    true,
                    false,
                    $actor,
                    $post->user
                );
            } elseif ($likes && $reaction && $reaction->identifier == $this->settings->get('fof-reactions.convertToLike')) {
                $liked = $post->likes()->where('user_id', $actor->id)->exists();

                if ($liked) {
                    return;
                } else {
                    $post->likes()->attach($actor->id);

                    $post->raise(new PostWasLiked($post, $actor));
                }
            } else {
                $oldReaction = PostReaction::where([['user_id', $actor->id], ['post_id', $post->id]])->first();

                $removeReaction = ($oldReaction && !is_null($oldReaction->reaction_id)) || is_null($reactionId);

                if ($removeReaction) {
                    if ($oldReaction) {
                        $oldReaction->reaction_id = null;
                        $oldReaction->save();
                    }

                    $this->pushRemovedReaction($reaction, $actor, $post);

                    $post->raise(new PostWasUnreacted($post, $actor));
                } else {
                    if ($oldReaction) {
                        $oldReaction->reaction_id = $reaction->id;
                        $oldReaction->save();
                    } else {
                        $post->reactions()->attach($reaction, ['user_id' => $actor->id, 'reaction_id' => $reaction->id, 'created_at' => Carbon::now()]);
                    }

                    $this->pushNewReaction($reaction, $actor, $post);

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
     *
     * @throws \Pusher\PusherException
     */
    public function pushNewReaction($reaction, $actor, $post)
    {
        if ($pusher = $this->getPusher()) {
            $pusher->trigger('public', 'newReaction', [
                'reactionId' => $reaction->id,
                'postId'     => $post->id,
                'userId'     => $actor->id,
            ]);
        }
    }

    /**
     * @param $reaction
     * @param $actor
     * @param $post
     */
    public function pushRemovedReaction($reaction, $actor, $post)
    {
        if ($pusher = $this->getPusher()) {
            $pusher->trigger('public', 'removedReaction', [
                'reactionId' => $reaction->id,
                'postId'     => $post->id,
                'userId'     => $actor->id,
            ]);
        }
    }

    /**
     * @throws \Pusher\PusherException
     *
     * @return bool|\Illuminate\Foundation\Application|mixed|Pusher
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

    protected function validateReaction($reactionId)
    {
        if (is_null($reactionId)) return;

        $reaction = Reaction::find($reactionId);

        if (!$reaction || !$reaction->enabled) {
            throw new ValidationException([
                'message' => $this->translator->trans('fof-reactions.forum.disabled-reaction'),
            ]);
        }
    }
}
