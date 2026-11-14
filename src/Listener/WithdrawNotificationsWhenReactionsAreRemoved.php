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

use FoF\Reactions\Event\PostReactionDeleted;
use FoF\Reactions\Event\PostReactionsCleared;
use FoF\Reactions\Notification\PostReactedNotifications;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Reactions removed from the reactions list, by their owner or a moderator, take their notifications
 * with them, as unreacting does.
 */
class WithdrawNotificationsWhenReactionsAreRemoved
{
    public function __construct(
        protected PostReactedNotifications $postReactedNotifications
    ) {
    }

    public function subscribe(Dispatcher $events): void
    {
        $events->listen(PostReactionDeleted::class, [$this, 'whenDeleted']);
        $events->listen(PostReactionsCleared::class, [$this, 'whenCleared']);
    }

    public function whenDeleted(PostReactionDeleted $event): void
    {
        $this->postReactedNotifications->withdraw($event->post, (int) $event->postReaction->user_id);
    }

    public function whenCleared(PostReactionsCleared $event): void
    {
        $this->postReactedNotifications->withdraw($event->post, $event->userIds);
    }
}
