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

/**
 * The "who reacted" list must load each row's reaction and user in batches, and an
 * anonymous row must never be linked to a registered user.
 */
class ListPostReactionsQueryCountTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    private const USERS = 8;

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-reactions');

        $users = [$this->normalUser()];
        $reactions = [];
        for ($n = 0; $n < self::USERS; $n++) {
            $id = 3 + $n;
            $users[] = ['id' => $id, 'username' => "reactor$id", 'email' => "reactor$id@machine.local", 'is_email_confirmed' => 1];
            $reactions[] = ['id' => $n + 1, 'post_id' => 1, 'reaction_id' => 1 + ($n % 4), 'user_id' => $id];
        }

        $this->prepareDatabase([
            'users'       => $users,
            'discussions' => [
                ['id' => 1, 'title' => __CLASS__, 'created_at' => Carbon::now(), 'last_posted_at' => Carbon::now(), 'user_id' => 1, 'first_post_id' => 1, 'comment_count' => 1],
            ],
            'posts' => [
                ['id' => 1, 'number' => 1, 'discussion_id' => 1, 'created_at' => Carbon::now(), 'user_id' => 1, 'type' => 'comment', 'content' => '<t><p>something</p></t>'],
            ],
            'post_reactions'           => $reactions,
            'post_anonymous_reactions' => [
                // Session ids are 40 characters; MySQL compares '2f9c…' with an integer id as 2.
                ['id' => 1, 'post_id' => 1, 'reaction_id' => 1, 'guest_id' => '2f9c5e1d7a3b4c6d8e0f1a2b3c4d5e6f7a8b9c0d'],
                ['id' => 2, 'post_id' => 1, 'reaction_id' => 2, 'guest_id' => '3a1b2c3d4e5f60718293a4b5c6d7e8f901234567'],
                ['id' => 3, 'post_id' => 1, 'reaction_id' => 3, 'guest_id' => 'b7e1c2d3e4f5061728394a5b6c7d8e9f00112233'],
            ],
        ]);

        $this->setting('fof-reactions.anonymousReactions', true);
    }

    /**
     * @return array{0: array<string, mixed>, 1: int}
     */
    private function listReactions(): array
    {
        $queries = 0;
        $this->app()->getContainer()->make(ConnectionInterface::class)->listen(function ($query) use (&$queries) {
            if (preg_match('/from `?\w*(reactions|users)`? where `?\w*(reactions|users)`?\.`id`/', $query->sql)) {
                $queries++;
            }
        });

        $response = $this->send(
            $this->request('GET', '/api/posts/1/reactions', ['authenticatedAs' => 1])
        );

        $this->assertEquals(200, $response->getStatusCode(), (string) $response->getBody());

        return [json_decode((string) $response->getBody(), true), $queries];
    }

    /**
     * @test
     */
    public function reactions_and_users_are_loaded_in_batches()
    {
        [$body, $queries] = $this->listReactions();

        $this->assertCount(self::USERS + 3, $body['data']);
        $this->assertLessThanOrEqual(3, $queries, "$queries reaction/user lookups for ".count($body['data']).' rows');
    }

    /**
     * @test
     */
    public function anonymous_reactions_are_never_linked_to_a_user()
    {
        [$body] = $this->listReactions();

        $registered = $anonymous = 0;
        foreach ($body['data'] as $row) {
            if ($row['attributes']['userId'] === null) {
                $anonymous++;
                $this->assertNull($row['relationships']['user']['data'] ?? null, 'anonymous row '.$row['id'].' is linked to a user');
            } else {
                $registered++;
                $this->assertEquals('users', $row['relationships']['user']['data']['type']);
                $this->assertEquals((string) $row['attributes']['userId'], $row['relationships']['user']['data']['id']);
            }

            $this->assertEquals('reactions', $row['relationships']['reaction']['data']['type']);
            $this->assertEquals((string) $row['attributes']['reactionId'], $row['relationships']['reaction']['data']['id']);
        }

        $this->assertEquals(self::USERS, $registered);
        $this->assertEquals(3, $anonymous);
    }
}
