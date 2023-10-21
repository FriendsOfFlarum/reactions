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
            ],
            'discussions' => [
                ['id' => 1, 'title' => __CLASS__, 'created_at' => Carbon::now(), 'last_posted_at' => Carbon::now(), 'user_id' => 1, 'first_post_id' => 1, 'comment_count' => 2],
            ],
            'posts' => [
                ['id' => 1, 'number' => 1, 'discussion_id' => 1, 'created_at' => Carbon::now(), 'user_id' => 1, 'type' => 'comment', 'content' => '<t><p>something</p></t>'],
                ['id' => 3, 'number' => 2, 'discussion_id' => 1, 'created_at' => Carbon::now(), 'user_id' => 2, 'type' => 'comment', 'content' => '<t><p>something</p></t>'],
                ['id' => 5, 'number' => 3, 'discussion_id' => 1, 'created_at' => Carbon::now(), 'user_id' => 3, 'type' => 'discussionRenamed', 'content' => '<t><p>something</p></t>'],
                ['id' => 6, 'number' => 4, 'discussion_id' => 1, 'created_at' => Carbon::now(), 'user_id' => 1, 'type' => 'comment', 'content' => '<t><p>something</p></t>'],
            ],
        ]);
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

        $response = $this->sendReactRequest($postId, $reactionId, $authenticatedAs);

        $body = json_decode((string) $response->getBody(), true);

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertEquals(1, $body['data']['attributes']['reactionCounts'][1], $message);
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

        $response = $this->sendReactRequest($postId, $reactionId, $authenticatedAs);

        $this->assertEquals(403, $response->getStatusCode(), $message);
    }

    public function allowedUsersToReact(): array
    {
        return [
            // [$postId, $authAs, $reactionId, $message, $canReactOwnPost]
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
            // [$postId, $authAs, $reactionId, $message, $canReactOwnPost]
            [1, 1, 1, 'Admin cannot react own post by default'],
            [5, 3, 1, 'User with permission cannot react own post by default'],
            [1, null, 1, 'Guests cannot react by default'],
            [1, null, 1, 'Guests cannot react when setting off', null, false],
            // [1, 2, 'User without permission cannot like any post'],
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
