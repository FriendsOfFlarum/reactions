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
use FoF\Reactions\PostAnonymousReaction;
use FoF\Reactions\PostReaction;
use Psr\Http\Message\ResponseInterface;

class ReactTest extends TestCase
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
            'groups' => [
                ['id' => 5, 'name_singular' => 'Acme', 'name_plural' => 'Acme', 'is_hidden' => 0],
                ['id' => 6, 'name_singular' => 'Acme1', 'name_plural' => 'Acme1', 'is_hidden' => 0],
            ],
            'group_user' => [
                ['user_id' => 1, 'group_id' => 5],
                ['user_id' => 2, 'group_id' => 5],
                ['user_id' => 3, 'group_id' => 5],
                ['user_id' => 4, 'group_id' => 5],
            ],
        ]);
    }

    protected function rewriteDefaultPermissionsAfterBoot()
    {
        $this->database()->table('group_permission')->where('permission', 'discussion.reactPosts')->delete();
        $this->database()->table('group_permission')->insert(['permission' => 'discussion.reactPosts', 'group_id' => 5]);
    }

    /**
     * @dataProvider allowedUsersToReact
     *
     * @test
     */
    public function can_react_to_a_post_if_allowed(int $postId, ?int $authenticatedAs, int $reactionId, string $message, bool $canReactOwnPost = null, bool $guestReactionsEnabled = null)
    {
        if (!is_null($canReactOwnPost)) {
            $this->setting('fof-reactions.react_own_post', $canReactOwnPost);
        }

        if (!is_null($guestReactionsEnabled)) {
            $this->setting('fof-reactions.anonymousReactions', $guestReactionsEnabled);
        }

        $this->rewriteDefaultPermissionsAfterBoot();

        $response = $this->sendReactRequest($postId, $reactionId, $authenticatedAs);

        $this->assertEquals(200, $response->getStatusCode());

        $body = json_decode((string) $response->getBody(), true);

        $this->assertEquals(1, $body['data']['attributes']['reactionCounts'][$reactionId], $message);

        if ($authenticatedAs) {
            $postReaction = PostReaction::query()->where('post_id', $postId)->where('user_id', $authenticatedAs)->first();
            $this->assertNotNull($postReaction, 'Reaction was not saved to database');
            $this->assertEquals($postId, $postReaction->post_id);
            $this->assertEquals($authenticatedAs, $postReaction->user_id);
            $this->assertEquals($reactionId, $postReaction->reaction_id);
            $this->assertNotNull($postReaction->created_at, 'Created at timestamp not set');
            $this->assertNotNull($postReaction->updated_at, 'Updated at timestamp not set');
        } else {
            $postReaction = PostAnonymousReaction::query()->where('post_id', $postId)->where('reaction_id', $reactionId)->first();
            $this->assertNotNull($postReaction, 'Anonymous reaction was not saved to database');
            $this->assertEquals($postId, $postReaction->post_id);
            $this->assertEquals($reactionId, $postReaction->reaction_id);
            $this->assertNotNull($postReaction->created_at, 'Created at timestamp not set');
            $this->assertNotNull($postReaction->updated_at, 'Updated at timestamp not set');
            $this->assertNotNull($postReaction->guest_id, 'Guest ID not set');
            $this->assertNotEmpty($postReaction->guest_id, 'Guest ID not set');
        }
    }

    /**
     * @dataProvider unallowedUsersToReact
     *
     * @test
     */
    public function cannot_react_to_a_post_if_not_allowed(int $postId, ?int $authenticatedAs, int $reactionId, string $message, bool $canReactOwnPost = null, bool $guestReactionsEnabled = null)
    {
        if (!is_null($canReactOwnPost)) {
            $this->setting('fof-reactions.react_own_post', $canReactOwnPost);
        }

        if (!is_null($guestReactionsEnabled)) {
            $this->setting('fof-reactions.anonymousReactions', $guestReactionsEnabled);
        }

        $this->rewriteDefaultPermissionsAfterBoot();

        $response = $this->sendReactRequest($postId, $reactionId, $authenticatedAs);

        $this->assertEquals(403, $response->getStatusCode(), $message);

        if ($authenticatedAs) {
            $postReaction = PostReaction::query()->where('post_id', $postId)->where('user_id', $authenticatedAs)->first();
            $this->assertNull($postReaction, 'Reaction was saved to database');
        } else {
            $postReaction = PostAnonymousReaction::query()->where('post_id', $postId)->where('reaction_id', $reactionId)->first();
            $this->assertNull($postReaction, 'Anonymous reaction was saved to database');
        }
    }

    public function allowedUsersToReact(): array
    {
        return [
            // [$postId, $authAs, $reactionId, $message, $canReactOwnPost, $guestReactionsEnabled]
            [1, 1, 1, 'Admin can react any post when anypost enabled', true],
            [1, 3, 1, 'User with permission can react other posts'],
            [5, 3, 1, 'User with permission can react own post when anypost enabled', true],
            [1, null, 1, 'Guest can react when feature enabled', null, true],
            [1, 4, 2, 'User with permission can react when guest reacting is also enabled', false, true],
            [5, 4, 1, 'User with permission can react own post when anypost and guest reacting enabled', true, true],
        ];
    }

    public function unallowedUsersToReact(): array
    {
        return [
            // [$postId, $authAs, $reactionId, $message, $canReactOwnPost, $guestReactionsEnabled]
            [1, 1, 1, 'Admin cannot react own post by default'],
            [5, 3, 1, 'User with permission cannot react own post by default'],
            [1, null, 1, 'Guests cannot react by default'],
            [1, null, 1, 'Guests cannot react when setting off', null, false],
            [1, 5, 3, 'User without permission cannot react any post'],
            [5, 5, 3, 'User without permission cannot react own post'],
            [5, 5, 3, 'User without permission cannot react own post when own post enabled', true],
            [5, 5, 3, 'User without permission cannot react own post when own post and guest reacting enabled', true, true],
            [5, 3, 3, 'User with permission cannot react own post if setting off', false],
            [1, 1, 3, 'Admin cannot like own post if setting off', false],
        ];
    }

    protected function sendReactRequest(int $postId, int $reactionId, ?int $authenticatedAs = null): ResponseInterface
    {
        if (!isset($authenticatedAs)) {
            $initial = $this->send(
                $this->request('GET', '/')
            );

            $token = $initial->getHeaderLine('X-CSRF-Token');
        }

        $request = $this->request('PATCH', "/api/posts/$postId", [
            'authenticatedAs' => $authenticatedAs,
            'cookiesFrom'     => $initial ?? null,
            'json'            => [
                'data' => [
                    'attributes' => [
                        'reaction' => $reactionId,
                    ],
                ],
            ],
        ]);

        if (!isset($authenticatedAs)) {
            $request = $request->withHeader('X-CSRF-Token', $token);
        }

        return $this->send($request);
    }
}
