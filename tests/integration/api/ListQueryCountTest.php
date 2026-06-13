<?php

/*
 * This file is part of fof/reactions.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Reactions\tests\integration\api;

use Carbon\Carbon;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\Testing\integration\TestCase;
use PHPUnit\Framework\Attributes\Test;

/**
 * Regression test for the reaction-count N+1 on the discussion list.
 *
 * reactionCounts/userReaction are serialized for every post on the page —
 * firstPost AND lastPost of each listed discussion. Previously these were
 * resolved per post (a `select * from reactions` plus a grouped count per
 * table, per post), because the batch primed model instances the serializer
 * didn't end up using. With the request-scoped resolver primed by post id,
 * the whole page resolves in a bounded handful of queries.
 *
 * This seeds many discussions, each with a distinct firstPost and lastPost
 * that both carry reactions, and asserts the per-post reaction queries do not
 * scale with the number of discussions.
 */
class ListQueryCountTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    private const DISCUSSION_COUNT = 15;

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-reactions');

        $users = [$this->normalUser()];
        $discussions = [];
        $posts = [];
        $reactions = [];
        $reactionId = 1;
        $now = Carbon::now();

        for ($i = 0; $i < self::DISCUSSION_COUNT; $i++) {
            $discussionId = 100 + $i;
            $firstPostId = 1000 + $i;
            $lastPostId = 2000 + $i;

            $discussions[] = [
                'id'             => $discussionId,
                'title'          => "Discussion $discussionId",
                'slug'           => "discussion-$discussionId",
                'created_at'     => $now,
                'last_posted_at' => $now->copy()->addSeconds($i),
                'user_id'        => 1,
                'first_post_id'  => $firstPostId,
                'last_post_id'   => $lastPostId,
                'comment_count'  => 2,
            ];
            $posts[] = ['id' => $firstPostId, 'number' => 1, 'discussion_id' => $discussionId, 'created_at' => $now, 'user_id' => 1, 'type' => 'comment', 'content' => '<t><p>first</p></t>'];
            $posts[] = ['id' => $lastPostId, 'number' => 2, 'discussion_id' => $discussionId, 'created_at' => $now->copy()->addSeconds($i), 'user_id' => 1, 'type' => 'comment', 'content' => '<t><p>last</p></t>'];

            // A reaction on each post so the count path has real data to resolve.
            $reactions[] = ['id' => $reactionId++, 'post_id' => $firstPostId, 'reaction_id' => 1, 'user_id' => 1];
            $reactions[] = ['id' => $reactionId++, 'post_id' => $lastPostId, 'reaction_id' => 1, 'user_id' => 1];
        }

        $this->prepareDatabase([
            'users'          => $users,
            'discussions'    => $discussions,
            'posts'          => $posts,
            'post_reactions' => $reactions,
        ]);
    }

    private function countMatching(array $log, string $pattern): int
    {
        return count(array_filter($log, fn (array $q) => preg_match($pattern, $q['query']) === 1));
    }

    #[Test]
    public function discussion_list_resolves_reactions_in_a_bounded_number_of_queries()
    {
        $db = $this->database();
        $db->enableQueryLog();

        $response = $this->send(
            $this->request('GET', '/api/discussions', ['authenticatedAs' => 1])
                ->withQueryParams(['page' => ['limit' => self::DISCUSSION_COUNT], 'include' => 'firstPost,lastPost'])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $log = $db->getQueryLog();
        $db->flushQueryLog();

        // Per-post fallbacks have a `where post_id = ?` (single id); the batch path
        // uses `where post_id in (...)`. The reaction-type table should also load
        // at most once, not once per post. With 15 discussions x 2 posts = 30
        // posts, the unfixed code issued ~30 of each of these.
        $perPostCounts = $this->countMatching($log, '/from [`"]post_reactions[`"] where [`"]post_id[`"] = \?/i');
        $reactionTypeLoads = $this->countMatching($log, '/^select \* from [`"]reactions[`"]\s*$/i');

        $this->assertLessThanOrEqual(
            2,
            $perPostCounts,
            "Discussion list issued $perPostCounts per-post reaction-count queries for ".(self::DISCUSSION_COUNT * 2).
            ' posts. This is the reaction N+1 — counts are being resolved per post instead of batched by the resolver.'
        );

        $this->assertLessThanOrEqual(
            1,
            $reactionTypeLoads,
            "The reaction types table was loaded $reactionTypeLoads times; it should be loaded at most once per request, not per post."
        );
    }
}
