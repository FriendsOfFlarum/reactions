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
    public function __construct(
        public Post $post,
        public User $user,
        public string $reaction
    ) {
    }

    public static function getType(): string
    {
        return 'postReacted';
    }

    public static function getSubjectModel(): string
    {
        return Post::class;
    }

    public function getSubject(): ?AbstractModel
    {
        return $this->post;
    }

    public function getFromUser(): ?User
    {
        return $this->user;
    }

    public function getData(): mixed
    {
        return $this->reaction;
    }
}
