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
use FoF\Reactions\Reaction;

/**
 * Every reaction of one type, from users and guests, was deleted from a post. Only dispatched when
 * at least one was deleted.
 */
class PostReactionsCleared
{
    public function __construct(
        public Post $post,
        public Reaction $reaction,
        public int $count,
        public User $actor
    ) {
    }
}
