<?php

/**
 *  This file is part of reflar/reactions.
 *
 *  Copyright (c) ReFlar.
 *
 *  http://reflar.io
 *
 *  For the full copyright and license information, please view the license.md
 *  file that was distributed with this source code.
 */

namespace Reflar\Reactions\Event;

use Flarum\Core\Post;
use Flarum\Core\User;

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
     * @param Post   $post
     * @param User   $user
     * @param string $reaction
     */
    public function __construct(Post $post, User $user, $reaction)
    {
        $this->post = $post;
        $this->user = $user;
        $this->reaction = $reaction;
    }
}
