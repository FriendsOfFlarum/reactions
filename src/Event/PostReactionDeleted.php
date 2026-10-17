<?php

/*
 * This file is part of fof/reactions.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Reactions\Event;

use Flarum\Post\Post;
use Flarum\User\User;
use FoF\Reactions\PostReaction;

/**
 * One user's reaction row was deleted from a post, by that user or by a moderator.
 */
class PostReactionDeleted
{
    public function __construct(
        public Post $post,
        public PostReaction $postReaction,
        public User $actor
    ) {
    }
}
