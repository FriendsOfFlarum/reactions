<?php

namespace FoF\Reactions\Api\Resource;

use Flarum\Api\Context;
use Flarum\Api\Endpoint;
use Flarum\Api\Resource;
use Flarum\Api\Schema;
use Flarum\Api\Sort\SortColumn;
use Flarum\Http\RequestUtil;
use Flarum\Post\Post;
use FoF\Reactions\PostAnonymousReaction;
use FoF\Reactions\PostReaction;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Arr;
use Laminas\Diactoros\Response\EmptyResponse;
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
            Endpoint\Endpoint::make('delete_reactions')
                ->route('DELETE', '/delete')
                ->action(function (Context $context) {
                    $actor = $context->getActor();
                    $data = $context->body();

                    $postId = Arr::get($data, 'postId');
                    $isSpecific = Arr::get($data, 'isSpecific');
                    $reactionOrPostReactionId = Arr::get($data, 'reactionOrPostReactionId');

                    $post = Post::whereVisibleTo($actor)->findOrFail($postId);

                    if (! $isSpecific) {
                        $reactionId = $reactionOrPostReactionId;

                        // Delete all post_reactions of a specific type (i.e. `reaction_id`)
                        $actor->assertCan('deleteReactions', $post);

                        PostReaction::query()->where('post_id', $postId)->where('reaction_id', $reactionId)->delete();
                        PostAnonymousReaction::query()->where('post_id', $postId)->where('reaction_id', $reactionId)->delete();
                    } elseif ($reactionOrPostReactionId) {
                        $postReactionId = $reactionOrPostReactionId;

                        // Delete a specific post_reaction for the post
                        /**
                         * @var PostReaction $reaction
                         */
                        $reaction = PostReaction::query()->where('post_id', $postId)->where('id', $postReactionId)->firstOrFail();

                        // If the post is not the actor's, they must have permission to delete reactions
                        if ($reaction->user_id != $actor->id) {
                            $actor->assertCan('deleteReactions', $post);
                        } else {
                            $actor->assertCan('react', $post);
                        }

                        $reaction->delete();
                    }
                })
                ->response(fn (OriginalContext $context) => new EmptyResponse(204)),
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
