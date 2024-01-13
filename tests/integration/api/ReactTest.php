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
use Flarum\Group\Group;
use Flarum\Post\Post;
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
            'groups' => [
                ['id' => 5, 'name_singular' => 'Acme', 'name_plural' => 'Acme', 'is_hidden' => 0],
                ['id' => 6, 'name_singular' => 'Acme1', 'name_plural' => 'Acme1', 'is_hidden' => 0],
            ],
            'group_user' => [
                ['user_id' => 1, 'group_id' => 5],
                ['user_id' => 2, 'group_id' => 5],
                ['user_id' => 3, 'group_id' => 5],
                ['user_id' => 4, 'group_id' => 5],
                ['user_id' => 6, 'group_id' => 5],
                ['user_id' => 6, 'group_id' => Group::MODERATOR_ID],
            ],
            'group_permission' => [
                ['permission' => 'discussion.deleteReactionsPosts', 'group_id' => Group::MODERATOR_ID],
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

    protected function disableReactionId(int $reactionId): void
    {
        $this->database()->table('reactions')->where('id', $reactionId)->update(['enabled' => false]);
    }

    /**
     * @test
     */
    public function user_cannot_react_to_a_post_if_reaction_disabled()
    {
        $this->disableReactionId(1);

        $response = $this->sendReactRequest(1, 1, 3);

        $this->assertEquals(422, $response->getStatusCode());

        $body = json_decode((string) $response->getBody(), true);

        // check the error pointer
        $this->assertEquals('/data/attributes/reaction', $body['errors'][0]['source']['pointer']);

        $postReaction = PostReaction::query()->where('post_id', 1)->where('user_id', 3)->first();
        $this->assertNull($postReaction, 'Reaction was saved to database');
    }

    /**
     * @test
     */
    public function guest_cannot_react_to_a_post_when_feature_is_enabled_but_reaction_disabled()
    {
        $this->setting('fof-reactions.anonymousReactions', true);
        $this->disableReactionId(1);

        $response = $this->sendReactRequest(1, 1);

        $this->assertEquals(422, $response->getStatusCode());

        $body = json_decode((string) $response->getBody(), true);

        // check the error pointer
        $this->assertEquals('/data/attributes/reaction', $body['errors'][0]['source']['pointer']);

        $postReaction = PostAnonymousReaction::query()->where('post_id', 1)->where('reaction_id', 1)->first();
        $this->assertNull($postReaction, 'Anonymous reaction was saved to database');
    }

    /**
     * @dataProvider deleteSpecificPostReactionUsersData
     *
     * @test
     */
    public function user_can_delete_own_post_reaction_by_id($reactionAs, $authAs, $message, $statusCode)
    {
        $this->sendReactRequest(1, 1, $reactionAs);

        $postReaction = PostReaction::query()->where('post_id', 1)->where('user_id', $reactionAs)->first();

        $this->assertNotNull($postReaction, "Reaction was not saved to database -- unable to react as user $reactionAs");

        if (is_null($authAs)) {
            $initial = $this->send(
                $this->request('GET', '/')
            );

            $token = $initial->getHeaderLine('X-CSRF-Token');
        }

        $request = $this->request('DELETE', "/api/posts/1/reactions/specific/{$postReaction->id}", [
            'authenticatedAs' => $authAs,
            'cookiesFrom'     => $initial ?? null,
        ]);

        if (is_null($authAs)) {
            $request = $request->withHeader('X-CSRF-Token', $token);
        }

        $response = $this->send($request);

        $this->assertEquals($statusCode, $response->getStatusCode(), $message);

        if ($statusCode === 204) {
            $this->expectException(\Illuminate\Database\Eloquent\ModelNotFoundException::class);
        }

        $postReaction->refresh();

        if ($statusCode === 204) {
            $this->assertFalse($postReaction->exists(), 'Reaction was not deleted from database');
        } else {
            $this->assertTrue($postReaction->exists(), 'Reaction should not have been deleted from database');
        }
    }

    public function deleteSpecificPostReactionUsersData()
    {
        return [
            // [$reactionAs, $authAs, $message, $statusCode]
            [3, 1, 'Admin can delete any post reaction', 204],
            [2, 6, 'User with permission can delete other post reaction', 204],
            [5, 5, 'User with permission can delete own post reaction', 204],
            [5, 4, 'User without permission cannot delete other post reaction', 403],
            [3, null, 'Guest cannot delete any post reaction', 403],
        ];
    }

    /**
     * @test
     */
    public function user_with_permission_can_react_and_is_converted_to_like_when_likes_is_enabled()
    {
        $this->extension('flarum-likes');
        $this->setting('fof-reactions.convertToLike', 'thumbsup');

        $response = $this->sendReactRequest(1, 1, 3);

        $this->assertEquals(200, $response->getStatusCode());

        $body = json_decode((string) $response->getBody(), true);

        $this->assertEquals(0, $body['data']['attributes']['reactionCounts'][1]);

        $likes = Post::query()->where('id', 1)->first()->likes()->get();

        $this->assertCount(1, $likes);

        $this->assertTrue($likes->contains(3), 'User is in the collection of users who liked the post');
    }

    /**
     * @test
     */
    public function user_with_permission_can_react_and_not_have_it_converted_to_a_like()
    {
        $this->extension('flarum-likes');
        $this->setting('fof-reactions.convertToLike', 'thumbsup');

        $response = $this->sendReactRequest(1, 2, 3);

        $this->assertEquals(200, $response->getStatusCode());

        $body = json_decode((string) $response->getBody(), true);

        $this->assertEquals(1, $body['data']['attributes']['reactionCounts'][2]);

        $likes = Post::query()->where('id', 1)->first()->likes()->get();

        $this->assertCount(0, $likes);
    }

    /**
     * @test
     */
    public function empty_string_as_convert_like_setting_does_nothing()
    {
        $this->extension('flarum-likes');
        $this->setting('fof-reactions.convertToLike', '');

        $response = $this->sendReactRequest(1, 1, 3);

        $this->assertEquals(200, $response->getStatusCode());

        $body = json_decode((string) $response->getBody(), true);

        $this->assertEquals(1, $body['data']['attributes']['reactionCounts'][1]);

        $likes = Post::query()->where('id', 1)->first()->likes()->get();

        $this->assertCount(0, $likes);
    }
}
