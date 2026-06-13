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

use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\User;
use Illuminate\Support\Collection;
use Psr\Http\Message\ServerRequestInterface;

/**
 * Resolves per-post reaction counts and the actor's own reaction without an N+1.
 *
 * The reactionCounts/userReaction fields are serialized for every post —
 * including posts loaded as `included` resources from another endpoint
 * (firstPost/lastPost on the discussion list, post streams, search, etc.).
 *
 * Decorating model instances before serialization (the previous approach) does
 * not survive that path: the serializer renders Post instances resolved through
 * JSON:API include loading, which are different objects from the ones a
 * beforeSerialization hook can reach — so the primed attributes were never read
 * and every post fell back to per-post queries.
 *
 * This resolver instead keys everything by post id (always available on whatever
 * instance is serialized) and memoizes per request. It is bound as a singleton,
 * so in Flarum's per-request container the cache is request-scoped: the first
 * lookup for a batch of posts issues a few grouped queries, and subsequent
 * lookups for those posts are free.
 */
class ReactionCountResolver
{
    /** @var array<int, array<int, int>> postId => [reactionId => count] */
    protected array $counts = [];

    /** @var array<int, int|null> postId => actor's reaction id (or null) */
    protected array $userReaction = [];

    /** Reaction types, loaded once per request. */
    protected ?Collection $reactionTypes = null;

    public function __construct(
        protected SettingsRepositoryInterface $settings
    ) {
    }

    /**
     * Reaction counts for a post, as a [reactionId => count] map covering every
     * registered reaction type (0 where none) — matching the previous behaviour.
     *
     * @return array<int, int>
     */
    public function countsFor(int $postId): array
    {
        if (!array_key_exists($postId, $this->counts)) {
            $this->load([$postId], null, null);
        }

        return $this->counts[$postId];
    }

    /**
     * The actor's own reaction id for a post, or null. Keyed per request by post
     * id; the actor is fixed for the lifetime of the request.
     */
    public function userReactionFor(int $postId, User $actor, ?ServerRequestInterface $request): ?int
    {
        if (!array_key_exists($postId, $this->userReaction)) {
            $this->load([$postId], $actor, $request);
        }

        return $this->userReaction[$postId];
    }

    /**
     * Batch-load counts (and, when an actor is given, that actor's reactions) for
     * any of the given post ids not already cached. Safe to call repeatedly; only
     * the missing ids are queried.
     *
     * @param int[] $postIds
     */
    public function load(array $postIds, ?User $actor, ?ServerRequestInterface $request): void
    {
        $missingCounts = array_values(array_filter($postIds, fn ($id) => !array_key_exists($id, $this->counts)));

        if (!empty($missingCounts)) {
            $this->loadCounts($missingCounts);
        }

        if ($actor !== null) {
            $missingUser = array_values(array_filter($postIds, fn ($id) => !array_key_exists($id, $this->userReaction)));

            if (!empty($missingUser)) {
                $this->loadUserReactions($missingUser, $actor, $request);
            }
        }
    }

    /**
     * @param int[] $postIds
     */
    protected function loadCounts(array $postIds): void
    {
        $registered = PostReaction::whereIn('post_id', $postIds)
            ->whereNotNull('reaction_id')
            ->groupBy(['post_id', 'reaction_id'])
            ->selectRaw('post_id, reaction_id, COUNT(*) as count')
            ->get()
            ->groupBy('post_id');

        $anonymous = collect();
        if ($this->settings->get('fof-reactions.anonymousReactions')) {
            $anonymous = PostAnonymousReaction::whereIn('post_id', $postIds)
                ->whereNotNull('reaction_id')
                ->groupBy(['post_id', 'reaction_id'])
                ->selectRaw('post_id, reaction_id, COUNT(*) as count')
                ->get()
                ->groupBy('post_id');
        }

        $types = $this->reactionTypes();

        foreach ($postIds as $postId) {
            $postRegistered = $registered->get($postId, collect())->keyBy('reaction_id');
            $postAnonymous = $anonymous->get($postId, collect())->keyBy('reaction_id');

            $counts = [];
            foreach ($types as $reaction) {
                $r = $postRegistered->get($reaction->id);
                $a = $postAnonymous->get($reaction->id);
                $counts[$reaction->id] = ($r ? $r->count : 0) + ($a ? $a->count : 0);
            }

            $this->counts[$postId] = $counts;
        }
    }

    /**
     * @param int[] $postIds
     */
    protected function loadUserReactions(array $postIds, User $actor, ?ServerRequestInterface $request): void
    {
        $reactions = collect();

        if (!$actor->isGuest()) {
            $reactions = PostReaction::whereIn('post_id', $postIds)
                ->where('user_id', $actor->id)
                ->whereNotNull('reaction_id')
                ->get(['post_id', 'reaction_id'])
                ->mapWithKeys(fn ($row) => [$row->post_id => $row->reaction_id]);
        } else {
            $guestId = $request?->getAttribute('session')?->getId();

            if ($guestId) {
                $reactions = PostAnonymousReaction::whereIn('post_id', $postIds)
                    ->where('guest_id', $guestId)
                    ->whereNotNull('reaction_id')
                    ->get(['post_id', 'reaction_id'])
                    ->mapWithKeys(fn ($row) => [$row->post_id => $row->reaction_id]);
            }
        }

        foreach ($postIds as $postId) {
            $this->userReaction[$postId] = $reactions->get($postId);
        }
    }

    /**
     * Drop any cached data for a post. Call after mutating its reactions within a
     * request so a subsequent read in the same request (e.g. the response to a
     * react/unreact) reflects the new state rather than the memoized old one.
     */
    public function forget(int $postId): void
    {
        unset($this->counts[$postId], $this->userReaction[$postId]);
    }

    protected function reactionTypes(): Collection
    {
        return $this->reactionTypes ??= Reaction::all();
    }
}
