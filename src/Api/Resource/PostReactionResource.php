<?php

/*
 * This file is part of fof/reactions.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Reactions\Api\Resource;

use Flarum\Api\Endpoint;
use Flarum\Api\Resource;
use Flarum\Api\Schema;
use Flarum\Api\Sort\SortColumn;
use FoF\Reactions\PostReaction;

/**
 * @extends Resource\AbstractDatabaseResource<PostReaction>
 */
class PostReactionResource extends Resource\AbstractDatabaseResource
{
    public function type(): string
    {
        return 'post_reactions';
    }

    public function model(): string
    {
        return PostReaction::class;
    }

    public function endpoints(): array
    {
        return [
            Endpoint\Index::make()
                ->paginate()
                ->visible(fn () => true),
        ];
    }

    public function fields(): array
    {
        return [

            Schema\Integer::make('userId'),
            Schema\Integer::make('postId'),
            Schema\Integer::make('reactionId'),

            Schema\Relationship\ToOne::make('reaction')
                ->includable()
                ->type('reactions'),
            Schema\Relationship\ToOne::make('user')
                ->includable()
                ->type('users'),
            Schema\Relationship\ToOne::make('post')
                ->includable()
                ->type('posts'),
        ];
    }

    public function sorts(): array
    {
        return [
            // SortColumn::make('createdAt'),
        ];
    }
}
