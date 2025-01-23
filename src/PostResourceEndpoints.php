<?php

namespace FoF\Reactions;

use Flarum\Api\Context;
use Flarum\Api\Endpoint\Endpoint;
use Flarum\Post\Post;
use Laminas\Diactoros\Response\EmptyResponse;

class PostResourceEndpoints
{
    public function __invoke(): array
    {
        return [
            Endpoint::make('reactions.specific.delete')
                ->route('DELETE', '/{id}/reactions/specific/{postReactionId}')
                ->action($this->action(...))
                ->response(fn () => new EmptyResponse(204)),
            Endpoint::make('reactions.type.delete')
                ->route('DELETE', '/{id}/reactions/type/{reactionId}')
                ->action($this->action(...))
                ->response(fn () => new EmptyResponse(204)),
        ];
    }

    protected function action(Context $context): null
    {
        $actor = $context->getActor();

        /** @var Post $post */
        $post = $context->model;

        $postReactionId = $context->queryParam('postReactionId');
        $reactionId = $context->queryParam('reactionId');

        if ($reactionId) {
            // Delete all post_reactions of a specific type (i.e. `reaction_id`)
            $actor->assertCan('deleteReactions', $post);

            PostReaction::query()->where('post_id', $post->id)->where('reaction_id', $reactionId)->delete();
            PostAnonymousReaction::query()->where('post_id', $post->id)->where('reaction_id', $reactionId)->delete();
        } elseif ($postReactionId) {
            // Delete a specific post_reaction for the post
            /**
             * @var PostReaction $reaction
             */
            $reaction = PostReaction::query()->where('post_id', $post->id)->where('id', $postReactionId)->firstOrFail();

            // If the post is not the actor's, they must have permission to delete reactions
            if ($reaction->user_id != $actor->id) {
                $actor->assertCan('deleteReactions', $post);
            } else {
                $actor->assertCan('react', $post);
            }

            $reaction->delete();
        }

        // TODO should this send pusher updates? would need new type for non-specific, otherwise could spam pusher events

        return null;
    }
}
