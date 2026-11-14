<?php

/*
 * This file is part of fof/reactions.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Reactions\Notification;

use Flarum\Notification\Notification;
use Flarum\Post\Post;

class PostReactedNotifications
{
    /**
     * Marks deleted every reaction notification the users caused on the post, whichever reaction it
     * names. Matches on the user and post rather than the reaction, because core's blueprint matching
     * compares the stored data: it can't find a notification for a reaction that has since changed,
     * nor one stored in the format earlier versions used (the whole reaction model as a string).
     *
     * @param int|int[] $userIds
     */
    public function withdraw(Post $post, int|array $userIds): void
    {
        $userIds = (array) $userIds;

        if (!$post->user_id || empty($userIds)) {
            return;
        }

        Notification::query()
            ->where('user_id', $post->user_id)
            ->whereIn('from_user_id', $userIds)
            ->where('type', PostReactedBlueprint::getType())
            ->where('subject_id', $post->id)
            ->where('is_deleted', false)
            ->update(['is_deleted' => true]);
    }
}
