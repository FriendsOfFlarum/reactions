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
use Flarum\Api\Client;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\Testing\integration\TestCase;
use Flarum\User\Guest;
use Flarum\User\User;
use PHPUnit\Framework\Attributes\Test;

/**
 * Long-running processes (queue workers, realtime's payload generator) serialize posts through the
 * API client many times in one container, once per recipient. Reaction state must be worked out
 * for each of those requests, not carried over from an earlier one.
 */
class ReactionStatePerRequestTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-reactions');

        $password = '$2y$10$LO59tiT7uggl6Oe23o/O6.utnF6ipngYjvMvaxo1TciKqBttDNKim';

        $this->prepareDatabase([
            'users' => [
                $this->normalUser(),
                ['id' => 3, 'username' => 'Acme', 'email' => 'acme@machine.local', 'is_email_confirmed' => 1, 'password' => $password],
                ['id' => 4, 'username' => 'Acme2', 'email' => 'acme2@machine.local', 'is_email_confirmed' => 1, 'password' => $password],
                ['id' => 5, 'username' => 'Acme3', 'email' => 'acme3@machine.local', 'is_email_confirmed' => 1, 'password' => $password],
            ],
            'discussions' => [
                ['id' => 1, 'title' => __CLASS__, 'created_at' => Carbon::now(), 'last_posted_at' => Carbon::now(), 'user_id' => 2, 'first_post_id' => 1, 'comment_count' => 1, 'slug' => 'reaction-state-per-request-test'],
            ],
            'posts' => [
                ['id' => 1, 'number' => 1, 'discussion_id' => 1, 'created_at' => Carbon::now(), 'user_id' => 2, 'type' => 'comment', 'content' => '<t><p>something</p></t>'],
            ],
            'post_reactions' => [
                ['id' => 1, 'post_id' => 1, 'user_id' => 3, 'reaction_id' => 1],
                ['id' => 2, 'post_id' => 1, 'user_id' => 4, 'reaction_id' => 2],
            ],
        ]);
    }

    protected function postAs(User $actor): array
    {
        $client = $this->app()->getContainer()->make(Client::class);

        $response = $client->withActor($actor)->get('/posts/1');

        $this->assertEquals(200, $response->getStatusCode());

        return json_decode((string) $response->getBody(), true)['data']['attributes'];
    }

    #[Test]
    public function each_recipient_gets_their_own_reaction(): void
    {
        $this->app();

        $this->assertEquals(1, $this->postAs(User::find(3))['userReaction']);
        $this->assertEquals(2, $this->postAs(User::find(4))['userReaction']);
        $this->assertNull($this->postAs(User::find(5))['userReaction']);
        $this->assertNull($this->postAs(new Guest())['userReaction']);
    }

    #[Test]
    public function counts_include_reactions_saved_since_an_earlier_request(): void
    {
        $this->app();

        $this->assertEquals(1, $this->postAs(User::find(3))['reactionCounts'][1]);

        // Saved by another process, so nothing in this one calls forget().
        $this->database()->table('post_reactions')->insert(['post_id' => 1, 'user_id' => 5, 'reaction_id' => 1]);

        $this->assertEquals(2, $this->postAs(User::find(3))['reactionCounts'][1]);
    }
}
