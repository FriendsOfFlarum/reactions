<?php

namespace FoF\Reactions\Api\Resource;

use Flarum\Api\Context;
use Flarum\Api\Endpoint;
use Flarum\Api\Resource;
use Flarum\Api\Schema;
use Flarum\Api\Sort\SortColumn;
use FoF\Reactions\PostReaction;
use Illuminate\Database\Eloquent\Builder;
use Tobyz\JsonApiServer\Context as OriginalContext;

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
            Endpoint\Delete::make()
                ->can('delete'),
            Endpoint\Index::make()
                ->paginate(),
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
