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

class WillReactToPost
{
    /**
     * @var Post
     */
    public $post;

    /**
     * @var User
     */
    public $actor;

    /**
     * @var Reaction
     */
    public $reaction;

    /**
     * @var bool
     */
    public $changed;

    /**
     * WillReactToPost constructor.
     *
     * @param Post $post
     * @param User $user
     * @param      $reaction
     * @param bool $changed
     */
    public function __construct(Post $post, User $user, Reaction $reaction, $changed = false)
    {
        $this->post = $post;
        $this->actor = $user;
        $this->reaction = $reaction;
        $this->changed = $changed;
    }
}
