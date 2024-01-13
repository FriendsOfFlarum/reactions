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
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\User;
use Psr\Http\Message\ServerRequestInterface;

class PostAttributes
{
    /** @var SettingsRepositoryInterface */
    protected $settings;

    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    public function __invoke(PostSerializer $serializer, Post $post, array $attributes): array
    {
        $actor = $serializer->getActor();

        $attributes['canReact'] = (bool) $actor->can('react', $post);
        $attributes['canDeletePostReactions'] = (bool) $actor->can('deleteReactions', $post);

        // Get reaction counts for the post.
        $reactionCounts = $this->getReactionCountsForPost($post);

        // Get user's reaction to the post.
        $userReaction = $this->getActorReactionForPost($actor, $post, $serializer->getRequest());

        // Add custom attributes.
        $attributes['reactionCounts'] = $reactionCounts;
        $attributes['userReactionIdentifier'] = $userReaction;

        return $attributes;
    }

    protected function getReactionCountsForPost(Post $post): array
    {
        // Initialize counts array
        $counts = [];

        // Query for reactions from registered users
        $registeredReactions = PostReaction::where('post_id', $post->id)
            ->groupBy('reaction_id')
            ->selectRaw('reaction_id, COUNT(*) as count')
            ->pluck('count', 'reaction_id');

        // Query for anonymous reactions if allowed
        $anonymousReactions = collect([]);
        if ($this->settings->get('fof-reactions.anonymousReactions')) {
            $anonymousReactions = PostAnonymousReaction::where('post_id', $post->id)
                ->groupBy('reaction_id')
                ->selectRaw('reaction_id, COUNT(*) as count')
                ->pluck('count', 'reaction_id');
        }

        // Merge the registered and anonymous reactions
        $reactions = Reaction::all();
        foreach ($reactions as $reaction) {
            $counts[$reaction->id] = $registeredReactions->get($reaction->id, 0) + $anonymousReactions->get($reaction->id, 0);
        }

        return $counts;
    }

    protected function getActorReactionForPost(User $actor, Post $post, ServerRequestInterface $request): ?int
    {
        if ($actor->isGuest()) {
            $session = $request->getAttribute('session');

            if ($session === null) {
                return null;
            }

            return PostAnonymousReaction::where('post_id', $post->id)
                ->where('guest_id', $session->getId())
                ->value('reaction_id');
        }

        return PostReaction::where('post_id', $post->id)
            ->where('user_id', $actor->id)
            ->value('reaction_id');
    }
}
