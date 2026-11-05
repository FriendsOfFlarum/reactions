<?php

/*
 * This file is part of fof/reactions.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Reactions;

use Flarum\Api\Serializer\PostSerializer;
use Flarum\Post\Post;

class PostAttributes
{
    /** @var PostReactionsLoader */
    protected $reactions;

    public function __construct(PostReactionsLoader $reactions)
    {
        $this->reactions = $reactions;
    }

    public function __invoke(PostSerializer $serializer, Post $post, array $attributes): array
    {
        $actor = $serializer->getActor();
        $request = $serializer->getRequest();

        $attributes['canReact'] = (bool) $actor->can('react', $post);
        $attributes['canDeletePostReactions'] = (bool) $actor->can('deleteReactions', $post);

        // Counts and the actor's reaction are loaded per discussion, not per post.
        $attributes['reactionCounts'] = $this->reactions->countsFor($post, $request);
        $attributes['userReactionIdentifier'] = $this->reactions->actorReactionFor($actor, $post, $request);

        return $attributes;
    }
}
