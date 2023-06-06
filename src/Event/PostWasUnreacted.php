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

class PostWasUnreacted
{
    /**
     * @var Post
     */
    public $post;

    /**
     * @var PostReaction
     */
    public $postReaction;

    /**
     * @var User
     */
    public $user;

    /**
     * @param Post         $post
     * @param PostReaction $postReaction
     * @param User         $user
     */
    public function __construct(Post $post, PostReaction $postReaction, User $user)
    {
        $this->post = $post;
        $this->postReaction = $postReaction;
        $this->user = $user;
    }
}
