<?php

/*
 * This file is part of fof/reactions.
 *
 * Copyright (c) 2019 FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Reactions\Event;

use Flarum\Post\Post;
use Flarum\User\User;

class PostWasReacted
{
    /**
     * @var Post
     */
    public $post;

    /**
     * @var User
     */
    public $user;

    /**
     * @var string
     */
    public $reaction;

    /**
     * @var bool
     */
    public $changed;

    /**
     * PostWasReacted constructor.
     *
     * @param Post $post
     * @param User $user
     * @param $reaction
     * @param bool $changed
     */
    public function __construct(Post $post, User $user, $reaction, $changed = false)
    {
        $this->post = $post;
        $this->user = $user;
        $this->reaction = $reaction;
        $this->changed = $changed;
    }
}
