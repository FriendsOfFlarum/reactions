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

class ListPostReactionsTest extends TestCase
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
            'groups' => [
                ['id' => 5, 'name_singular' => 'Acme', 'name_plural' => 'Acme', 'is_hidden' => 0],
                ['id' => 6, 'name_singular' => 'Acme1', 'name_plural' => 'Acme1', 'is_hidden' => 0],
            ],
            'group_user' => [
                ['user_id' => 1, 'group_id' => 5],
                ['user_id' => 2, 'group_id' => 5],
                ['user_id' => 3, 'group_id' => 5],
                ['user_id' => 4, 'group_id' => 5],
                ['user_id' => 5, 'group_id' => 5],
            ],
            'group_permission' => [
                ['permission' => 'discussion.canSeeReactions', 'group_id' => 5],
            ],
        ]);
    }

    protected function addGuestViewPermission()
    {
        $this->database()->table('group_permission')->insert([
            ['permission' => 'discussion.canSeeReactions', 'group_id' => Group::GUEST_ID],
        ]);
    }

    /**
     * @test
     */
    public function guest_cannot_see_reactions_when_permission_not_given_on_a_post_when_guest_reacting_is_off()
    {
        $response = $this->send(
            $this->request('GET', '/api/posts/1/reactions', [
            ])
        );

        $this->assertEquals(403, $response->getStatusCode());
    }

    /**
     * @test
     */
    public function guest_can_see_reactions_when_permission_given_on_a_post_when_guest_reacting_is_off()
    {
        $this->addGuestViewPermission();

        $response = $this->send(
            $this->request('GET', '/api/posts/1/reactions', [
            ])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $response = json_decode($response->getBody()->getContents(), true);

        $this->assertEquals(4, count($response['data']));

        $this->assertEquals(1, $response['data'][0]['attributes']['reactionId']);
        $this->assertEquals(1, $response['data'][1]['attributes']['reactionId']);
        $this->assertEquals(2, $response['data'][2]['attributes']['reactionId']);
        $this->assertEquals(4, $response['data'][3]['attributes']['reactionId']);

        $this->assertEquals(2, $response['data'][0]['attributes']['userId']);
        $this->assertEquals(3, $response['data'][1]['attributes']['userId']);
        $this->assertEquals(4, $response['data'][2]['attributes']['userId']);
        $this->assertEquals(5, $response['data'][3]['attributes']['userId']);

        $this->assertEquals(1, $response['data'][0]['attributes']['postId']);
        $this->assertEquals(1, $response['data'][1]['attributes']['postId']);
        $this->assertEquals(1, $response['data'][2]['attributes']['postId']);
        $this->assertEquals(1, $response['data'][3]['attributes']['postId']);

        $this->assertEquals('reactions', $response['data'][0]['relationships']['reaction']['data']['type']);
        $this->assertEquals('reactions', $response['data'][1]['relationships']['reaction']['data']['type']);
        $this->assertEquals('reactions', $response['data'][2]['relationships']['reaction']['data']['type']);
        $this->assertEquals('reactions', $response['data'][3]['relationships']['reaction']['data']['type']);

        $this->assertEquals('users', $response['data'][0]['relationships']['user']['data']['type']);
        $this->assertEquals('users', $response['data'][1]['relationships']['user']['data']['type']);
        $this->assertEquals('users', $response['data'][2]['relationships']['user']['data']['type']);
        $this->assertEquals('users', $response['data'][3]['relationships']['user']['data']['type']);
    }

    /**
     * @test
     */
    public function guest_can_see_reactions_on_a_post_when_guest_reacting_is_on()
    {
        $this->setting('fof-reactions.anonymousReactions', true);
        $this->addGuestViewPermission();

        $response = $this->send(
            $this->request('GET', '/api/posts/1/reactions', [
            ])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $response = json_decode($response->getBody()->getContents(), true);

        $this->assertEquals(8, count($response['data']));
    }

    /**
     * @test
     */
    public function user_with_view_permission_can_see_reactions_on_a_post_when_guest_reacting_is_off()
    {
        $response = $this->send(
            $this->request('GET', '/api/posts/1/reactions', [
                'authenticatedAs' => 2,
            ])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $response = json_decode($response->getBody()->getContents(), true);

        $this->assertEquals(4, count($response['data']));

        $this->assertEquals(1, $response['data'][0]['attributes']['reactionId']);
        $this->assertEquals(1, $response['data'][1]['attributes']['reactionId']);
        $this->assertEquals(2, $response['data'][2]['attributes']['reactionId']);
        $this->assertEquals(4, $response['data'][3]['attributes']['reactionId']);

        $this->assertEquals(2, $response['data'][0]['attributes']['userId']);
        $this->assertEquals(3, $response['data'][1]['attributes']['userId']);
        $this->assertEquals(4, $response['data'][2]['attributes']['userId']);
        $this->assertEquals(5, $response['data'][3]['attributes']['userId']);

        $this->assertEquals(1, $response['data'][0]['attributes']['postId']);
        $this->assertEquals(1, $response['data'][1]['attributes']['postId']);
        $this->assertEquals(1, $response['data'][2]['attributes']['postId']);
        $this->assertEquals(1, $response['data'][3]['attributes']['postId']);

        $this->assertEquals('reactions', $response['data'][0]['relationships']['reaction']['data']['type']);
        $this->assertEquals('reactions', $response['data'][1]['relationships']['reaction']['data']['type']);
        $this->assertEquals('reactions', $response['data'][2]['relationships']['reaction']['data']['type']);
        $this->assertEquals('reactions', $response['data'][3]['relationships']['reaction']['data']['type']);

        $this->assertEquals('users', $response['data'][0]['relationships']['user']['data']['type']);
        $this->assertEquals('users', $response['data'][1]['relationships']['user']['data']['type']);
        $this->assertEquals('users', $response['data'][2]['relationships']['user']['data']['type']);
        $this->assertEquals('users', $response['data'][3]['relationships']['user']['data']['type']);
    }

    /**
     * @test
     */
    public function user_with_view_permission_can_see_reactions_on_a_post_when_guest_reacting_is_on()
    {
        $this->setting('fof-reactions.anonymousReactions', true);

        $response = $this->send(
            $this->request('GET', '/api/posts/1/reactions?include=user', [
                'authenticatedAs' => 2,
            ])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $response = json_decode($response->getBody()->getContents(), true);

        $this->assertEquals(8, count($response['data']));
    }

    /**
     * @test
     */
    public function user_without_view_permission_cannot_see_reactions_on_a_post_when_guest_reacting_is_off()
    {
        $response = $this->send(
            $this->request('GET', '/api/posts/1/reactions', [
                'authenticatedAs' => 6,
            ])
        );

        $this->assertEquals(403, $response->getStatusCode());
    }

    /**
     * @test
     */
    public function user_without_view_permission_cannot_see_reactions_on_a_post_when_guest_reacting_is_on()
    {
        $this->setting('fof-reactions.anonymousReactions', true);

        $response = $this->send(
            $this->request('GET', '/api/posts/1/reactions', [
                'authenticatedAs' => 6,
            ])
        );

        $this->assertEquals(403, $response->getStatusCode());
    }
}
