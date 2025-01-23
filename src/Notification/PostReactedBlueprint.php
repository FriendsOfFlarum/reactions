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

use Flarum\Database\AbstractModel;
use Flarum\Notification\AlertableInterface;
use Flarum\Notification\Blueprint\BlueprintInterface;
use Flarum\Post\Post;
use Flarum\User\User;

class PostReactedBlueprint implements BlueprintInterface, AlertableInterface
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
     * @param Post $post
     * @param User $user
     */
    public function __construct(Post $post, User $user, string $reaction)
    {
        $this->post = $post;
        $this->user = $user;
        $this->reaction = $reaction;
    }

    /**
     * {@inheritdoc}
     */
    public static function getType(): string
    {
        return 'postReacted';
    }

    /**
     * {@inheritdoc}
     */
    public static function getSubjectModel(): string
    {
        return Post::class;
    }

    /**
     * {@inheritdoc}
     */
    public function getSubject(): ?AbstractModel
    {
        return $this->post;
    }

    /**
     * {@inheritdoc}
     */
    public function getFromUser(): ?User
    {
        return $this->user;
    }

    /**
     * Get reaction type.
     *
     * @return string
     */
    public function getReactionType()
    {
        return $this->reaction;
    }

    /**
     * {@inheritdoc}
     */
    public function getData(): mixed
    {
        return $this->reaction;
    }
}
