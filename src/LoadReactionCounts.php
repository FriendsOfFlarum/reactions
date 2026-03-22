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

use Flarum\Post\Post;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\User;
use Illuminate\Database\Eloquent\Collection;
use Psr\Http\Message\ServerRequestInterface;

class LoadReactionCounts
{
    public function __construct(
        protected SettingsRepositoryInterface $settings
    ) {
    }

    /**
     * Batch-load reaction counts and the actor's reaction for a collection of posts.
     * Attaches results as model attributes to avoid per-post queries during serialization.
     */
    public function forPosts(Collection $posts, User $actor, ?ServerRequestInterface $request = null): void
    {
        if ($posts->isEmpty()) {
            return;
        }

        $postIds = $posts->pluck('id')->all();

        // Single query: registered reaction counts grouped by post + reaction type
        $registeredCounts = PostReaction::whereIn('post_id', $postIds)
            ->whereNotNull('reaction_id')
            ->groupBy(['post_id', 'reaction_id'])
            ->selectRaw('post_id, reaction_id, COUNT(*) as count')
            ->get()
            ->groupBy('post_id');

        // Single query: anonymous reaction counts (only when enabled)
        $anonymousCounts = collect();
        if ($this->settings->get('fof-reactions.anonymousReactions')) {
            $anonymousCounts = PostAnonymousReaction::whereIn('post_id', $postIds)
                ->whereNotNull('reaction_id')
                ->groupBy(['post_id', 'reaction_id'])
                ->selectRaw('post_id, reaction_id, COUNT(*) as count')
                ->get()
                ->groupBy('post_id');
        }

        // Single query: the actor's own reactions across all posts
        $actorReactions = collect();
        if (!$actor->isGuest()) {
            /** @var \Illuminate\Support\Collection<int, int> $actorReactions */
            $actorReactions = PostReaction::whereIn('post_id', $postIds)
                ->where('user_id', $actor->id)
                ->whereNotNull('reaction_id')
                ->get(['post_id', 'reaction_id'])
                ->mapWithKeys(fn ($row) => [$row->post_id => $row->reaction_id]);
        } elseif ($request !== null) {
            $guestId = $request->getAttribute('session')?->getId();
            if ($guestId) {
                /** @var \Illuminate\Support\Collection<int, int> $actorReactions */
                $actorReactions = PostAnonymousReaction::whereIn('post_id', $postIds)
                    ->where('guest_id', $guestId)
                    ->whereNotNull('reaction_id')
                    ->get(['post_id', 'reaction_id'])
                    ->mapWithKeys(fn ($row) => [$row->post_id => $row->reaction_id]);
            }
        }

        // Fetch all reaction types once and cache on the collection
        $allReactions = Reaction::all();

        // Attach pre-computed data to each post model instance
        /** @var Post $post */
        foreach ($posts as $post) {
            $postRegistered = $registeredCounts->get($post->id, collect())->keyBy('reaction_id');
            $postAnonymous  = $anonymousCounts->get($post->id, collect())->keyBy('reaction_id');

            $counts = [];
            foreach ($allReactions as $reaction) {
                $registered = $postRegistered->get($reaction->id);
                $anonymous  = $postAnonymous->get($reaction->id);

                $counts[$reaction->id] = ($registered ? $registered->count : 0) + ($anonymous ? $anonymous->count : 0);
            }

            $post->setAttribute('_reactionCounts', $counts);
            $post->setAttribute('_userReaction', $actorReactions->get($post->id));
        }
    }
}
