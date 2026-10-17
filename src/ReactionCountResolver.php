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

use Closure;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\User;
use Psr\Http\Message\ServerRequestInterface;
use WeakMap;

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
 * instance is serialized) and memoizes per API request.
 *
 * The post fields don't look their value up straight away: each registers its
 * post and returns a closure, which the serializer resolves once the current
 * level of the response is complete. The first of those closures then loads
 * every registered post in one batch. That covers listed and included posts
 * alike (first/last posts, mentions, ...) on every endpoint, and posts that
 * aren't serialized are never loaded.
 *
 * The memo is kept per request object rather than for the container's lifetime,
 * because one container can serve many API requests: queue workers, and
 * flarum/realtime's payload generator, which serializes a post through the API
 * client once per recipient. Each of those requests gets its own state, so no
 * recipient sees another's reaction or counts cached before a change. The state
 * is released with its request.
 */
class ReactionCountResolver
{
    /**
     * @var WeakMap<ServerRequestInterface, ReactionCountState>
     */
    protected WeakMap $states;

    public function __construct(
        protected SettingsRepositoryInterface $settings
    ) {
        $this->states = new WeakMap();
    }

    /**
     * Field value for a post's counts: registers the post for the next batch and
     * returns a closure for the serializer to resolve.
     */
    public function deferCounts(int $postId, ServerRequestInterface $request): Closure
    {
        $this->state($request)->pendingCounts[$postId] = true;

        return fn () => $this->countsFor($postId, $request);
    }

    /**
     * Field value for the actor's own reaction to a post: registers the post for
     * the next batch and returns a closure for the serializer to resolve.
     */
    public function deferUserReaction(int $postId, User $actor, ServerRequestInterface $request): Closure
    {
        $this->state($request)->pendingUserReactions[$postId] = true;

        return fn () => $this->userReactionFor($postId, $actor, $request);
    }

    /**
     * Reaction counts for a post, as a [reactionId => count] map covering every
     * registered reaction type (0 where none) — matching the previous behaviour.
     *
     * @return array<int, int>
     */
    public function countsFor(int $postId, ServerRequestInterface $request): array
    {
        if (!array_key_exists($postId, $this->state($request)->counts)) {
            $this->load([$postId], null, $request);
        }

        return $this->state($request)->counts[$postId];
    }

    /**
     * The actor's own reaction id for a post, or null. The actor is fixed for the
     * lifetime of a request, so this is keyed by post id within it.
     */
    public function userReactionFor(int $postId, User $actor, ServerRequestInterface $request): ?int
    {
        if (!array_key_exists($postId, $this->state($request)->userReaction)) {
            $this->load([$postId], $actor, $request);
        }

        return $this->state($request)->userReaction[$postId];
    }

    /**
     * Batch-load counts (and, when an actor is given, that actor's reactions) for
     * the given post ids and every post a deferred field value is waiting for,
     * skipping any already cached for this request. Safe to call repeatedly.
     *
     * @param int[] $postIds
     */
    public function load(array $postIds, ?User $actor, ServerRequestInterface $request): void
    {
        $state = $this->state($request);

        $missingCounts = $this->missing([...$postIds, ...array_keys($state->pendingCounts)], $state->counts);
        $state->pendingCounts = [];

        if (!empty($missingCounts)) {
            $this->loadCounts($state, $missingCounts);
        }

        if ($actor !== null) {
            $missingUser = $this->missing([...$postIds, ...array_keys($state->pendingUserReactions)], $state->userReaction);
            $state->pendingUserReactions = [];

            if (!empty($missingUser)) {
                $this->loadUserReactions($state, $missingUser, $actor, $request);
            }
        }
    }

    /**
     * Drop any cached data for a post. Call after mutating its reactions within a
     * request so a subsequent read in the same request (e.g. the response to a
     * react/unreact) reflects the new state rather than the memoized old one.
     */
    public function forget(int $postId, ServerRequestInterface $request): void
    {
        $state = $this->state($request);

        unset($state->counts[$postId], $state->userReaction[$postId]);
    }

    /**
     * @param int[]             $postIds
     * @param array<int, mixed> $cached
     *
     * @return int[]
     */
    protected function missing(array $postIds, array $cached): array
    {
        return array_values(array_unique(array_filter($postIds, fn ($id) => !array_key_exists($id, $cached))));
    }

    protected function state(ServerRequestInterface $request): ReactionCountState
    {
        return $this->states[$request] ??= new ReactionCountState();
    }

    /**
     * @param int[] $postIds
     */
    protected function loadCounts(ReactionCountState $state, array $postIds): void
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

        $types = $state->reactionTypes ??= Reaction::all();

        foreach ($postIds as $postId) {
            $postRegistered = $registered->get($postId, collect())->keyBy('reaction_id');
            $postAnonymous = $anonymous->get($postId, collect())->keyBy('reaction_id');

            $counts = [];
            foreach ($types as $reaction) {
                $r = $postRegistered->get($reaction->id);
                $a = $postAnonymous->get($reaction->id);
                $counts[$reaction->id] = ($r ? $r->count : 0) + ($a ? $a->count : 0);
            }

            $state->counts[$postId] = $counts;
        }
    }

    /**
     * @param int[] $postIds
     */
    protected function loadUserReactions(ReactionCountState $state, array $postIds, User $actor, ServerRequestInterface $request): void
    {
        $reactions = collect();

        if (!$actor->isGuest()) {
            $reactions = PostReaction::whereIn('post_id', $postIds)
                ->where('user_id', $actor->id)
                ->whereNotNull('reaction_id')
                ->get(['post_id', 'reaction_id'])
                ->mapWithKeys(fn ($row) => [$row->post_id => $row->reaction_id]);
        } else {
            $guestId = $request->getAttribute('session')?->getId();

            if ($guestId) {
                $reactions = PostAnonymousReaction::whereIn('post_id', $postIds)
                    ->where('guest_id', $guestId)
                    ->whereNotNull('reaction_id')
                    ->get(['post_id', 'reaction_id'])
                    ->mapWithKeys(fn ($row) => [$row->post_id => $row->reaction_id]);
            }
        }

        foreach ($postIds as $postId) {
            $state->userReaction[$postId] = $reactions->get($postId);
        }
    }
}
