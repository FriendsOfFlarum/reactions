<?php

namespace FoF\Reactions\Api\Controller;

use Flarum\Api\Controller\AbstractDeleteController;
use Flarum\Http\RequestUtil;
use Flarum\Post\Post;
use FoF\Reactions\PostReaction;
use Illuminate\Support\Arr;
use Laminas\Diactoros\Response\EmptyResponse;
use Psr\Http\Message\ServerRequestInterface;

class DeletePostReactionController extends AbstractDeleteController
{

    protected function delete(ServerRequestInterface $request)
    {
        $actor = RequestUtil::getActor($request);
        $postId = Arr::get($request->getQueryParams(), 'id');
        $postReactionId = Arr::get($request->getQueryParams(), 'reactionId');

        $post = Post::whereVisibleTo($actor)->findOrFail($postId);
        $reaction = PostReaction::query()->where('post_id', $postId)->where('id', $postReactionId)->firstOrFail();

        $actor->assertCan('react', $post);

        // If the post is not the actor's, they must have permission to delete reactions
        if ($reaction->user_id !== $actor->id) {
            $actor->assertCan('deletePostReactions', $post);
        }

        $reaction->delete();

        return new EmptyResponse(204);
    }
}
