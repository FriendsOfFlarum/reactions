<?php

/*
 * This file is part of fof/reactions.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Reactions\Tests\Integration\Api;

use Carbon\Carbon;
use Flarum\Group\Group;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\Testing\integration\TestCase;
use PHPUnit\Framework\Attributes\Test;

/**
 * Regression tests for https://github.com/FriendsOfFlarum/reactions/issues/82
 *
 * The bug: when post_reactions and post_anonymous_reactions share the same auto-increment
 * ID (e.g. both have id=1), the API response mixed them together as the same type
 * (post_reactions), causing the frontend to overwrite one record with the other.
 * The result was wrong reaction counts and missing user relationships.
 *
 * In 2.x, anonymous reactions are never returned by the /api/post_reactions endpoint —
 * they are aggregated server-side into the post's reactionCounts attribute instead.
 * These tests assert that the collision scenario is fully resolved.
 */
class IdCollisionTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-reactions');

        // Deliberately set up overlapping IDs between the two reaction tables.
        // post_reactions id=1 and post_anonymous_reactions id=1 both exist for the
        // same post with the same reaction type — the exact collision from issue #82.
        $this->prepareDatabase([
            'users' => [
                $this->normalUser(),
                ['id' => 3, 'username' => 'Acme', 'email' => 'acme@machine.local', 'is_email_confirmed' => 1, 'password' => '$2y$10$LO59tiT7uggl6Oe23o/O6.utnF6ipngYjvMvaxo1TciKqBttDNKim'],
            ],
            'discussions' => [
                ['id' => 1, 'title' => __CLASS__, 'created_at' => Carbon::now(), 'last_posted_at' => Carbon::now(), 'user_id' => 1, 'first_post_id' => 1, 'comment_count' => 1, 'slug' => 'id-collision-test'],
            ],
            'posts' => [
                ['id' => 1, 'number' => 1, 'discussion_id' => 1, 'created_at' => Carbon::now(), 'user_id' => 1, 'type' => 'comment', 'content' => '<t><p>something</p></t>'],
            ],
            // Two registered user reactions: id=1 (reaction 1) and id=2 (reaction 2)
            'post_reactions' => [
                ['id' => 1, 'post_id' => 1, 'reaction_id' => 1, 'user_id' => 2],
                ['id' => 2, 'post_id' => 1, 'reaction_id' => 2, 'user_id' => 3],
            ],
            // Anonymous reaction with id=1 — same ID as the registered reaction above,
            // same reaction type — the collision scenario from the bug report.
            'post_anonymous_reactions' => [
                ['id' => 1, 'post_id' => 1, 'reaction_id' => 1, 'guest_id' => 'abc123'],
            ],
            'groups' => [
                ['id' => 5, 'name_singular' => 'Acme', 'name_plural' => 'Acme', 'is_hidden' => 0],
            ],
            'group_user' => [
                ['user_id' => 2, 'group_id' => 5],
                ['user_id' => 3, 'group_id' => 5],
            ],
            'group_permission' => [
                ['permission' => 'discussion.canSeeReactions', 'group_id' => Group::MEMBER_ID],
            ],
        ]);
    }

    #[Test]
    public function api_returns_only_registered_reactions_when_anonymous_reactions_disabled()
    {
        $response = $this->send(
            $this->request('GET', '/api/post_reactions', [
                'authenticatedAs' => 2,
            ])->withQueryParams([
                'include' => 'user,reaction',
                'filter'  => ['post' => 1],
            ])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $body = json_decode($response->getBody()->getContents(), true);

        // Only the 2 registered reactions should be returned — not the anonymous one
        $this->assertCount(2, $body['data'], 'Only registered user reactions should be returned');

        $ids = array_column($body['data'], 'id');
        $this->assertContains('1', $ids);
        $this->assertContains('2', $ids);

        // Every returned record must have a non-null userId (no anonymous leakage)
        foreach ($body['data'] as $item) {
            $this->assertNotNull($item['attributes']['userId'], 'userId should never be null in post_reactions API response');
        }
    }

    #[Test]
    public function api_returns_only_registered_reactions_when_anonymous_reactions_enabled()
    {
        $this->setting('fof-reactions.anonymousReactions', true);

        $response = $this->send(
            $this->request('GET', '/api/post_reactions', [
                'authenticatedAs' => 2,
            ])->withQueryParams([
                'include' => 'user,reaction',
                'filter'  => ['post' => 1],
            ])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $body = json_decode($response->getBody()->getContents(), true);

        // Still only 2 registered reactions — anonymous reactions are never exposed here
        $this->assertCount(2, $body['data'], 'Anonymous reactions must not appear in the post_reactions API response');

        foreach ($body['data'] as $item) {
            $this->assertNotNull($item['attributes']['userId'], 'userId should never be null in post_reactions API response');
        }
    }

    #[Test]
    public function reaction_counts_correctly_aggregate_both_registered_and_anonymous_when_enabled()
    {
        $this->setting('fof-reactions.anonymousReactions', true);

        $response = $this->send(
            $this->request('GET', '/api/posts/1', [
                'authenticatedAs' => 2,
            ])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $body = json_decode($response->getBody()->getContents(), true);

        $counts = $body['data']['attributes']['reactionCounts'];

        // reaction 1: 1 registered (user 2) + 1 anonymous = 2
        $this->assertEquals(2, $counts[1], 'Reaction 1 count should include both registered and anonymous');
        // reaction 2: 1 registered (user 3), no anonymous
        $this->assertEquals(1, $counts[2], 'Reaction 2 count should be 1');
    }

    #[Test]
    public function reaction_counts_exclude_anonymous_when_feature_disabled()
    {
        $response = $this->send(
            $this->request('GET', '/api/posts/1', [
                'authenticatedAs' => 2,
            ])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $body = json_decode($response->getBody()->getContents(), true);

        $counts = $body['data']['attributes']['reactionCounts'];

        // reaction 1: only 1 registered — anonymous reaction is not counted
        $this->assertEquals(1, $counts[1], 'Anonymous reaction should not be counted when feature is disabled');
        $this->assertEquals(1, $counts[2]);
    }

    #[Test]
    public function no_duplicate_ids_in_api_response_with_overlapping_table_ids()
    {
        $this->setting('fof-reactions.anonymousReactions', true);

        $response = $this->send(
            $this->request('GET', '/api/post_reactions', [
                'authenticatedAs' => 2,
            ])->withQueryParams([
                'include' => 'user,reaction',
                'filter'  => ['post' => 1],
            ])
        );

        $body = json_decode($response->getBody()->getContents(), true);

        $ids = array_column($body['data'], 'id');

        // Assert no duplicate IDs in the response — the original bug caused id=1 to
        // appear twice (once as a registered reaction, once overwritten by anonymous)
        $this->assertEquals(count($ids), count(array_unique($ids)), 'Response must not contain duplicate IDs');
    }
}
