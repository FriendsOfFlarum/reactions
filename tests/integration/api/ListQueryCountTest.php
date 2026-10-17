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
 * Regression tests for the reaction-count N+1.
 *
 * reactionCounts/userReaction are serialized for every post in a response:
 * listed posts and posts included through relationships alike (a discussion's
 * firstPost/lastPost, a post's discussion.lastPost, mentions, ...). The field
 * getters defer their value, so each level of the response resolves its posts'
 * reactions in one batch rather than one query per post.
 *
 * Each test measures the first request in the test's process, so nothing is
 * served from an earlier request.
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
            // By another user, so a list of the admin's posts can include it without listing it.
            $posts[] = ['id' => $lastPostId, 'number' => 2, 'discussion_id' => $discussionId, 'created_at' => $now->copy()->addSeconds($i), 'user_id' => 2, 'type' => 'comment', 'content' => '<t><p>last</p></t>'];

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

    /**
     * Queries against either reaction table, whatever their where clause: a per-post fallback is
     * `post_id in (?)` with a single id, so matching on `post_id = ?` would miss it.
     */
    private function reactionQueries(array $log): int
    {
        return $this->countMatching($log, '/from [`"]post_(anonymous_)?reactions[`"]/i');
    }

    private function reactionTypeLoads(array $log): int
    {
        return $this->countMatching($log, '/^select \* from [`"]reactions[`"]\s*$/i');
    }

    /**
     * @return array<int, array{query: string}>
     */
    private function queriesFor(string $path, array $query): array
    {
        $db = $this->database();
        $db->enableQueryLog();

        $response = $this->send(
            $this->request('GET', $path, ['authenticatedAs' => 1])->withQueryParams($query)
        );

        $this->assertEquals(200, $response->getStatusCode());

        $log = $db->getQueryLog();
        $db->flushQueryLog();

        return $log;
    }

    #[Test]
    public function discussion_list_resolves_reactions_in_a_bounded_number_of_queries()
    {
        $log = $this->queriesFor('/api/discussions', ['page' => ['limit' => self::DISCUSSION_COUNT], 'include' => 'firstPost,lastPost']);

        // firstPost and lastPost are included at the same level, so all 30 posts resolve in one
        // batch: one grouped count and one query for the actor's own reactions.
        $reactionQueries = $this->reactionQueries($log);

        $this->assertLessThanOrEqual(
            2,
            $reactionQueries,
            "Discussion list issued $reactionQueries reaction queries for ".(self::DISCUSSION_COUNT * 2).' posts; they should resolve in one batch.'
        );

        $this->assertLessThanOrEqual(1, $this->reactionTypeLoads($log), 'The reaction types table should be loaded at most once per request, not per post.');
    }

    #[Test]
    public function discussion_list_without_posts_runs_no_reaction_queries()
    {
        $log = $this->queriesFor('/api/discussions', ['page' => ['limit' => self::DISCUSSION_COUNT], 'include' => 'user']);

        $this->assertSame(0, $this->reactionQueries($log), 'No post is serialized, so no reactions should be loaded.');
        $this->assertSame(0, $this->reactionTypeLoads($log));
    }

    #[Test]
    public function post_list_resolves_reactions_for_included_posts_in_a_bounded_number_of_queries()
    {
        // The admin's 15 first posts are listed; the other user's 15 last posts are only included.
        $log = $this->queriesFor('/api/posts', [
            'filter'  => ['author' => 'admin'],
            'page'    => ['limit' => self::DISCUSSION_COUNT],
            'include' => 'discussion.lastPost',
        ]);

        // One batch for the listed posts and one for the included ones, two levels down: at most
        // two grouped counts and two queries for the actor's own reactions.
        $reactionQueries = $this->reactionQueries($log);

        $this->assertLessThanOrEqual(
            4,
            $reactionQueries,
            "Post list issued $reactionQueries reaction queries for ".(self::DISCUSSION_COUNT * 2).' posts, half of them included; included posts are being resolved one at a time.'
        );

        $this->assertLessThanOrEqual(1, $this->reactionTypeLoads($log));
    }
}
