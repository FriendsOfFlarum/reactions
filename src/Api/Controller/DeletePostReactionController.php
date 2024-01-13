<?php

/*
 * This file is part of fof/reactions.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Reactions\Api\Controller;

use Flarum\Api\Controller\AbstractDeleteController;
use Flarum\Http\RequestUtil;
use Flarum\Post\Post;
use Flarum\User\Exception\PermissionDeniedException;
use FoF\Reactions\PostAnonymousReaction;
use FoF\Reactions\PostReaction;
use Illuminate\Support\Arr;
use Laminas\Diactoros\Response\EmptyResponse;
use Psr\Http\Message\ServerRequestInterface;

class DeletePostReactionController extends AbstractDeleteController
{
    /**
     * @throws PermissionDeniedException
     */
    protected function delete(ServerRequestInterface $request): EmptyResponse
    {
        $actor = RequestUtil::getActor($request);
        $params = $request->getQueryParams();

        $postId = Arr::get($params, 'id');
        $postReactionId = Arr::get($params, 'postReactionId');
        $reactionId = Arr::get($params, 'reactionId');

        $post = Post::whereVisibleTo($actor)->findOrFail($postId);

        if ($reactionId) {
            // Delete all post_reactions of a specific type (i.e. `reaction_id`)
            $actor->assertCan('deleteReactions', $post);

            PostReaction::query()->where('post_id', $postId)->where('reaction_id', $reactionId)->delete();
            PostAnonymousReaction::query()->where('post_id', $postId)->where('reaction_id', $reactionId)->delete();
        } elseif ($postReactionId) {
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

        // TODO should this send pusher updates? would need new type for non-specific, otherwise could spam pusher events

        return new EmptyResponse(204);
    }
}
