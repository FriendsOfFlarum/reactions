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

use Flarum\Notification\NotificationSyncer;
use FoF\Reactions\Event\PostWasUnreacted;
use FoF\Reactions\Notification\PostReactedBlueprint;
use FoF\Reactions\PostAnonymousReaction;

class SendNotificationWhenPostIsUnreacted
{
    public function __construct(
        protected NotificationSyncer $notifications
    ) {
    }

    public function handle(PostWasUnreacted $event): void
    {
        // Don't process anonymous reactions
        if ($event->postReaction instanceof PostAnonymousReaction) {
            return;
        }

        $post = $event->post;
        $user = $event->user;

        // Remove the notification when unreacted
        if ($post->user && $post->user->id != $user->id) {
            $this->notifications->sync(
                new PostReactedBlueprint($post, $user, ''),
                []
            );
        }
    }
}
