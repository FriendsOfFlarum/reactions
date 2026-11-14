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
use FoF\Reactions\Reaction;

class PostReactedBlueprint implements BlueprintInterface, AlertableInterface
{
    public function __construct(
        public Post $post,
        public User $user,
        public Reaction $reaction
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

    /**
     * Only what the notification shows, so the stored data doesn't change when the reaction's other
     * attributes (display name, enabled) do.
     *
     * @return array{identifier: string, type: string}
     */
    public function getData(): array
    {
        return [
            'identifier' => $this->reaction->identifier,
            'type'       => $this->reaction->type,
        ];
    }
}
