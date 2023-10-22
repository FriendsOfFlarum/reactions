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

class PostAttributesTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-reactions');

        $this->prepareDatabase([
            'users' => [
                $this->normalUser(),
                ['id' => 3, 'username' => 'Acme', 'email' => 'acme@machine.local', 'is_email_confirmed' => 1],
                ['id' => 4, 'username' => 'Acme2', 'email' => 'acme2@machine.local', 'is_email_confirmed' => 1],
                ['id' => 5, 'username' => 'Acme3', 'email' => 'acme3@machine.local', 'is_email_confirmed' => 1],
                ['id' => 6, 'username' => 'Acme4', 'email' => 'acme4@machine.local', 'is_email_confirmed' => 1],
            ],
            'discussions' => [
                ['id' => 1, 'title' => __CLASS__, 'created_at' => Carbon::now(), 'last_posted_at' => Carbon::now(), 'user_id' => 1, 'first_post_id' => 1, 'comment_count' => 2],
            ],
            'posts' => [
                ['id' => 1, 'number' => 1, 'discussion_id' => 1, 'created_at' => Carbon::now(), 'user_id' => 1, 'type' => 'comment', 'content' => '<t><p>something</p></t>'],
                ['id' => 3, 'number' => 2, 'discussion_id' => 1, 'created_at' => Carbon::now(), 'user_id' => 2, 'type' => 'comment', 'content' => '<t><p>something</p></t>'],
                ['id' => 5, 'number' => 3, 'discussion_id' => 1, 'created_at' => Carbon::now(), 'user_id' => 3, 'type' => 'discussionRenamed', 'content' => '<t><p>something</p></t>'],
                ['id' => 6, 'number' => 4, 'discussion_id' => 1, 'created_at' => Carbon::now(), 'user_id' => 1, 'type' => 'comment', 'content' => '<t><p>something</p></t>'],
                ['id' => 6, 'number' => 4, 'discussion_id' => 1, 'created_at' => Carbon::now(), 'user_id' => 5, 'type' => 'comment', 'content' => '<t><p>something</p></t>'],
            ],
            'post_reactions' => [
                ['id' => 1, 'post_id' => 1, 'reaction_id' => 1, 'user_id' => 2],
                ['id' => 2, 'post_id' => 1, 'reaction_id' => 1, 'user_id' => 3],
                ['id' => 3, 'post_id' => 1, 'reaction_id' => 2, 'user_id' => 4],
                ['id' => 4, 'post_id' => 1, 'reaction_id' => 4, 'user_id' => 5],
                ['id' => 5, 'post_id' => 1, 'reaction_id' => null, 'user_id' => 6],
            ],
            'post_anonymous_reactions' => [
                ['id' => 1, 'post_id' => 1, 'reaction_id' => 1, 'guest_id' => '1234567'],
                ['id' => 2, 'post_id' => 1, 'reaction_id' => 1, 'guest_id' => 'abfdb'],
                ['id' => 3, 'post_id' => 1, 'reaction_id' => 1, 'guest_id' => '123098'],
                ['id' => 4, 'post_id' => 1, 'reaction_id' => 1, 'guest_id' => 'gd'],
                ['id' => 5, 'post_id' => 1, 'reaction_id' => null, 'guest_id' => 'gsadasdd'],
            ],
        ]);
    }

    protected function arrayOfReactionCounts(int $anon = 0): array
    {
        return [
            '1' => 2 + $anon,
            '2' => 1,
            '3' => 0,
            '4' => 1,
            '5' => 0,
            '6' => 0,
        ];
    }

    /**
     * @test
     */
    public function user_has_correct_post_attributes_when_anonymous_reactions_disabled()
    {
        $response = $this->send(
            $this->request('GET', '/api/posts/1', [
                'authenticatedAs' => 2,
            ])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $body = json_decode($response->getBody(), true);

        $this->assertTrue($body['data']['attributes']['canReact'], 'User can react');
        $this->assertEquals($this->arrayOfReactionCounts(), $body['data']['attributes']['reactionCounts']);
        $this->assertEquals(1, $body['data']['attributes']['userReactionIdentifier'], 'User has reacted with reaction id 1');
    }

    /**
     * @test
     */
    public function guest_has_correct_post_attributes_when_anonymous_reactions_disabled()
    {
        $response = $this->send(
            $this->request('GET', '/api/posts/1', [
            ])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $body = json_decode($response->getBody(), true);

        $this->assertFalse($body['data']['attributes']['canReact'], 'User can react');
        $this->assertEquals($this->arrayOfReactionCounts(), $body['data']['attributes']['reactionCounts']);
        $this->assertEquals(null, $body['data']['attributes']['userReactionIdentifier'], 'User has reacted with reaction id 1');
    }

    /**
     * @test
     */
    public function user_has_correct_post_attributes_when_anonymous_reactions_enabled()
    {
        $this->setting('fof-reactions.anonymousReactions', true);

        $response = $this->send(
            $this->request('GET', '/api/posts/1', [
                'authenticatedAs' => 2,
            ])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $body = json_decode($response->getBody(), true);

        $this->assertTrue($body['data']['attributes']['canReact'], 'User can react');
        $this->assertEquals($this->arrayOfReactionCounts(4), $body['data']['attributes']['reactionCounts']);
        $this->assertEquals(1, $body['data']['attributes']['userReactionIdentifier'], 'User has reacted with reaction id 1');
    }

    /**
     * @test
     */
    public function guest_has_correct_post_attributes_when_anonymous_reactions_enabled()
    {
        $this->setting('fof-reactions.anonymousReactions', true);

        $response = $this->send(
            $this->request('GET', '/api/posts/1', [
            ])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $body = json_decode($response->getBody(), true);

        $this->assertTrue($body['data']['attributes']['canReact'], 'User can react');
        $this->assertEquals($this->arrayOfReactionCounts(4), $body['data']['attributes']['reactionCounts']);
        $this->assertEquals(null, $body['data']['attributes']['userReactionIdentifier'], 'User has reacted with reaction id 1');
    }
}
