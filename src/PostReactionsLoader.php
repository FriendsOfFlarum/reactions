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
use Illuminate\Database\Query\Builder;
use Psr\Http\Message\ServerRequestInterface;

/**
 * Loads reaction counts and the actor's own reactions for a whole discussion at
 * once, so serializing a page of posts costs a fixed number of queries instead
 * of several per post.
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

    /** @var array<int, true> discussion id => primed */
    protected $countsPrimed = [];

    /** @var array<int, array<int, int>> post id => [reaction id => count] */
    protected $counts = [];

    /** @var array<string, true> "discussion:actor" => primed */
    protected $actorPrimed = [];

    /** @var array<string, int|null> "post:actor" => reaction id */
    protected $actorReactions = [];

    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    /**
     * @return array<int, int> reaction id => count, for every reaction type
     */
    public function countsFor(Post $post, ?ServerRequestInterface $request): array
    {
        $this->useRequest($request);

        $discussionId = (int) $post->discussion_id;

        if (!isset($this->countsPrimed[$discussionId])) {
            $this->countsPrimed[$discussionId] = true;
            $this->loadCounts($this->scope($post, $request));
        }

        $postCounts = $this->counts[(int) $post->id] ?? [];
        $counts = [];

        foreach ($this->reactionIds() as $reactionId) {
            $counts[$reactionId] = $postCounts[$reactionId] ?? 0;
        }

        return $counts;
    }

    public function actorReactionFor(User $actor, Post $post, ?ServerRequestInterface $request): ?int
    {
        $this->useRequest($request);

        if ($actor->isGuest()) {
            $session = $request ? $request->getAttribute('session') : null;

            if ($session === null) {
                return null;
            }

            $actorKey = 'guest:'.$session->getId();
            $query = PostAnonymousReaction::query()->where('guest_id', $session->getId());
        } else {
            $actorKey = 'user:'.$actor->id;
            $query = PostReaction::query()->where('user_id', $actor->id);
        }

        $discussionId = (int) $post->discussion_id;
        $primeKey = $discussionId.':'.$actorKey;

        if (!isset($this->actorPrimed[$primeKey])) {
            $this->actorPrimed[$primeKey] = true;

            $rows = $query
                ->whereIn('post_id', $this->scope($post, $request))
                ->toBase()
                ->get(['post_id', 'reaction_id']);

            foreach ($rows as $row) {
                $this->actorReactions[$row->post_id.':'.$actorKey] = $row->reaction_id === null ? null : (int) $row->reaction_id;
            }
        }

        return $this->actorReactions[$post->id.':'.$actorKey] ?? null;
    }

    /**
     * @param \Closure|int[] $postIds
     */
    protected function loadCounts($postIds): void
    {
        $tables = [PostReaction::query()];

        if ($this->settings->get('fof-reactions.anonymousReactions')) {
            $tables[] = PostAnonymousReaction::query();
        }

        foreach ($tables as $query) {
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
     * Within a request, load the whole discussion so the other posts on the page
     * are already covered. Without one (e.g. a notification), load just this post.
     *
     * @return \Closure|int[]
     */
    protected function scope(Post $post, ?ServerRequestInterface $request)
    {
        if ($request === null) {
            return [(int) $post->id];
        }

        $discussionId = (int) $post->discussion_id;

        return function (Builder $query) use ($discussionId) {
            $query->select('id')->from('posts')->where('discussion_id', $discussionId);
        };
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
            $this->countsPrimed = $this->counts = $this->actorPrimed = $this->actorReactions = [];
        }
    }
}
