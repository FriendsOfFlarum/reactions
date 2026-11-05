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
use Psr\Http\Message\ServerRequestInterface;

/**
 * Reaction counts and the actor's own reaction for the posts being serialized.
 *
 * Api\PrimePostReactions primes every post in a response with a fixed number of
 * queries; a post that was not primed (loaded later, or serialized outside a
 * request) is loaded on its own.
 *
 * Results are kept only for the request being serialized: a different (or no)
 * request starts from scratch, so long-running processes never see stale counts.
 */
class PostReactionsLoader
{
    /** @var SettingsRepositoryInterface */
    protected $settings;

    /** @var ServerRequestInterface|null */
    protected $request;

    /** @var int[]|null */
    protected $reactionIds;

    /** @var array<int, array<int, int>> post id => [reaction id => count] */
    protected $counts = [];

    /** @var array<string, int|null> "actor|post" => reaction id */
    protected $actorReactions = [];

    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    /**
     * @param Post[] $posts
     */
    public function prime(array $posts, User $actor, ?ServerRequestInterface $request): void
    {
        $this->useRequest($request);

        $postIds = [];
        foreach ($posts as $post) {
            if ($post->id !== null) {
                $postIds[(int) $post->id] = (int) $post->id;
            }
        }

        $this->loadCounts(array_values(array_diff_key($postIds, $this->counts)));

        $actorKey = $this->actorKey($actor, $request);

        if ($actorKey !== null) {
            $missing = array_filter($postIds, function ($postId) use ($actorKey) {
                return !array_key_exists($actorKey.'|'.$postId, $this->actorReactions);
            });

            $this->loadActorReactions($actor, $actorKey, array_values($missing));
        }
    }

    /**
     * @return array<int, int> reaction id => count, for every reaction type
     */
    public function countsFor(Post $post, ?ServerRequestInterface $request): array
    {
        $this->useRequest($request);

        $postId = (int) $post->id;

        if (!isset($this->counts[$postId])) {
            $this->loadCounts([$postId]);
        }

        $counts = [];

        foreach ($this->reactionIds() as $reactionId) {
            $counts[$reactionId] = $this->counts[$postId][$reactionId] ?? 0;
        }

        return $counts;
    }

    public function actorReactionFor(User $actor, Post $post, ?ServerRequestInterface $request): ?int
    {
        $this->useRequest($request);

        $actorKey = $this->actorKey($actor, $request);

        if ($actorKey === null) {
            return null;
        }

        $key = $actorKey.'|'.$post->id;

        if (!array_key_exists($key, $this->actorReactions)) {
            $this->loadActorReactions($actor, $actorKey, [(int) $post->id]);
        }

        return $this->actorReactions[$key];
    }

    /**
     * @param int[] $postIds
     */
    protected function loadCounts(array $postIds): void
    {
        if (empty($postIds)) {
            return;
        }

        foreach ($postIds as $postId) {
            $this->counts[$postId] = [];
        }

        $queries = [PostReaction::query()];

        if ($this->settings->get('fof-reactions.anonymousReactions')) {
            $queries[] = PostAnonymousReaction::query();
        }

        foreach ($queries as $query) {
            $rows = $query
                ->whereIn('post_id', $postIds)
                ->whereNotNull('reaction_id')
                ->groupBy('post_id', 'reaction_id')
                ->selectRaw('post_id, reaction_id, COUNT(*) as count')
                ->toBase()
                ->get();

            foreach ($rows as $row) {
                $postId = (int) $row->post_id;
                $reactionId = (int) $row->reaction_id;
                $this->counts[$postId][$reactionId] = ($this->counts[$postId][$reactionId] ?? 0) + (int) $row->count;
            }
        }
    }

    /**
     * @param int[] $postIds
     */
    protected function loadActorReactions(User $actor, string $actorKey, array $postIds): void
    {
        if (empty($postIds)) {
            return;
        }

        foreach ($postIds as $postId) {
            $this->actorReactions[$actorKey.'|'.$postId] = null;
        }

        $query = $actor->isGuest()
            ? PostAnonymousReaction::query()->where('guest_id', substr($actorKey, strlen('guest:')))
            : PostReaction::query()->where('user_id', $actor->id);

        $rows = $query->whereIn('post_id', $postIds)->toBase()->get(['post_id', 'reaction_id']);

        foreach ($rows as $row) {
            $this->actorReactions[$actorKey.'|'.$row->post_id] = $row->reaction_id === null ? null : (int) $row->reaction_id;
        }
    }

    /**
     * Who the "own reaction" belongs to: a user, a guest's session, or nobody.
     */
    protected function actorKey(User $actor, ?ServerRequestInterface $request): ?string
    {
        if (!$actor->isGuest()) {
            return 'user:'.$actor->id;
        }

        $session = $request ? $request->getAttribute('session') : null;

        return $session ? 'guest:'.$session->getId() : null;
    }

    /**
     * @return int[]
     */
    protected function reactionIds(): array
    {
        if ($this->reactionIds === null) {
            $this->reactionIds = Reaction::query()->pluck('id')->map(function ($id) {
                return (int) $id;
            })->all();
        }

        return $this->reactionIds;
    }

    protected function useRequest(?ServerRequestInterface $request): void
    {
        if ($request === null || $request !== $this->request) {
            $this->request = $request;
            $this->reactionIds = null;
            $this->counts = $this->actorReactions = [];
        }
    }
}
