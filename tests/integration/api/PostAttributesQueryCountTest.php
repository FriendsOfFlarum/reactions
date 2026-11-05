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
use Illuminate\Database\ConnectionInterface;
use Illuminate\Support\Arr;

/**
 * Serializing a page of posts must not query the reaction tables once per post.
 */
class PostAttributesQueryCountTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    private const POSTS = 12;

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-reactions');

        $posts = [];
        for ($n = 1; $n <= self::POSTS; $n++) {
            $posts[] = ['id' => $n, 'number' => $n, 'discussion_id' => 1, 'created_at' => Carbon::now(), 'user_id' => 1, 'type' => 'comment', 'content' => '<t><p>post '.$n.'</p></t>'];
        }

        $this->prepareDatabase([
            'users' => [
                $this->normalUser(),
                ['id' => 3, 'username' => 'Acme', 'email' => 'acme@machine.local', 'is_email_confirmed' => 1],
            ],
            'discussions' => [
                ['id' => 1, 'title' => __CLASS__, 'created_at' => Carbon::now(), 'last_posted_at' => Carbon::now(), 'user_id' => 1, 'first_post_id' => 1, 'comment_count' => self::POSTS, 'last_post_number' => self::POSTS],
            ],
            'posts' => $posts,
            'post_reactions' => [
                ['id' => 1, 'post_id' => 1, 'reaction_id' => 1, 'user_id' => 2],
                ['id' => 2, 'post_id' => 1, 'reaction_id' => 1, 'user_id' => 3],
                ['id' => 3, 'post_id' => 2, 'reaction_id' => 2, 'user_id' => 2],
                ['id' => 4, 'post_id' => 3, 'reaction_id' => 3, 'user_id' => 3],
                ['id' => 5, 'post_id' => 3, 'reaction_id' => null, 'user_id' => 2],
            ],
            'post_anonymous_reactions' => [
                ['id' => 1, 'post_id' => 2, 'reaction_id' => 2, 'guest_id' => 'abc'],
                ['id' => 2, 'post_id' => 4, 'reaction_id' => 4, 'guest_id' => 'def'],
            ],
        ]);
    }

    /**
     * @return array{0: array<int, array<string, mixed>>, 1: int}
     */
    private function listPostsCountingReactionQueries(?int $userId): array
    {
        $reactionQueries = 0;
        $this->app()->getContainer()->make(ConnectionInterface::class)->listen(function ($query) use (&$reactionQueries) {
            if (preg_match('/\b(post_reactions|post_anonymous_reactions|reactions)\b/', $query->sql)) {
                $reactionQueries++;
            }
        });

        $response = $this->send(
            $this->request('GET', '/api/posts', $userId ? ['authenticatedAs' => $userId] : [])
                ->withQueryParams(['filter' => ['discussion' => 1], 'page' => ['limit' => 50]])
        );

        $this->assertEquals(200, $response->getStatusCode(), (string) $response->getBody());

        $posts = [];
        foreach (json_decode((string) $response->getBody(), true)['data'] as $post) {
            $posts[(int) $post['id']] = $post['attributes'];
        }

        $this->assertCount(self::POSTS, $posts);

        return [$posts, $reactionQueries];
    }

    /**
     * @test
     */
    public function reaction_queries_do_not_grow_with_the_number_of_posts_for_users()
    {
        $this->setting('fof-reactions.anonymousReactions', true);

        [, $queries] = $this->listPostsCountingReactionQueries(2);

        $this->assertLessThanOrEqual(4, $queries, "$queries reaction queries for ".self::POSTS.' posts');
    }

    /**
     * @test
     */
    public function reaction_queries_do_not_grow_with_the_number_of_posts_for_guests()
    {
        $this->setting('fof-reactions.anonymousReactions', true);

        [, $queries] = $this->listPostsCountingReactionQueries(null);

        $this->assertLessThanOrEqual(4, $queries, "$queries reaction queries for ".self::POSTS.' posts');
    }

    /**
     * @test
     */
    public function each_post_gets_its_own_counts_and_the_actors_own_reaction()
    {
        $this->setting('fof-reactions.anonymousReactions', true);

        [$posts] = $this->listPostsCountingReactionQueries(2);

        $this->assertEquals(2, $posts[1]['reactionCounts'][1]);
        $this->assertEquals(0, $posts[1]['reactionCounts'][2]);
        $this->assertEquals(2, $posts[2]['reactionCounts'][2], 'registered + anonymous');
        $this->assertEquals(1, $posts[3]['reactionCounts'][3]);
        $this->assertEquals(1, $posts[4]['reactionCounts'][4], 'anonymous only');
        $this->assertEquals([0], array_values(array_unique($posts[5]['reactionCounts'])), 'no reactions');

        $this->assertEquals(1, $posts[1]['userReactionIdentifier']);
        $this->assertEquals(2, $posts[2]['userReactionIdentifier']);
        $this->assertNull($posts[3]['userReactionIdentifier'], 'a null reaction is not a reaction');
        $this->assertNull($posts[4]['userReactionIdentifier']);
    }

    /**
     * @test
     */
    public function anonymous_counts_are_left_out_when_anonymous_reactions_are_disabled()
    {
        [$posts] = $this->listPostsCountingReactionQueries(2);

        $this->assertEquals(1, $posts[2]['reactionCounts'][2]);
        $this->assertEquals(0, Arr::get($posts[4]['reactionCounts'], 4));
    }
}
