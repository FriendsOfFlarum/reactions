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
use FoF\Reactions\PostAnonymousReaction;
use FoF\Reactions\PostReaction;
use FoF\Reactions\Reaction;

class PostWasReacted
{
    /**
     * @var Post
     */
    public $post;

    /**
     * @var PostReaction|PostAnonymousReaction
     */
    public $postReaction;

    /**
     * @var User
     */
    public $user;

    /**
     * @var Reaction
     */
    public $reaction;

    /**
     * @var bool
     */
    public $changed;

    /**
     * PostWasReacted constructor.
     *
     * @param Post                               $post
     * @param PostReaction|PostAnonymousReaction $postReaction
     * @param User                               $user
     * @param Reaction                           $reaction
     * @param bool                               $changed
     */
    public function __construct(Post $post, $postReaction, User $user, Reaction $reaction, $changed = false)
    {
        $this->post = $post;
        $this->postReaction = $postReaction;
        $this->user = $user;
        $this->reaction = $reaction;
        $this->changed = $changed;
    }
}
