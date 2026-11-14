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

use FoF\Reactions\Event\PostWasUnreacted;
use FoF\Reactions\Notification\PostReactedNotifications;
use FoF\Reactions\PostAnonymousReaction;

class SendNotificationWhenPostIsUnreacted
{
    public function __construct(
        protected PostReactedNotifications $postReactedNotifications
    ) {
    }

    public function handle(PostWasUnreacted $event): void
    {
        // Don't process anonymous reactions
        if ($event->postReaction instanceof PostAnonymousReaction) {
            return;
        }

        $this->postReactedNotifications->withdraw($event->post, $event->user->id);
    }
}
