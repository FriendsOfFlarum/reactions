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
use Flarum\Audit\AuditLog;
use Flarum\Audit\AuditLogger;
use Flarum\Group\Group;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\Testing\integration\TestCase;
use PHPUnit\Framework\Attributes\Test;

class AuditTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    public function setUp(): void
    {
        parent::setUp();

        // Keeps audit from logging its own enablement, so each test starts from an empty log.
        AuditLogger::$testMode = true;

        $this->extension('flarum-audit', 'fof-reactions');

        $password = '$2y$10$LO59tiT7uggl6Oe23o/O6.utnF6ipngYjvMvaxo1TciKqBttDNKim';

        $this->prepareDatabase([
            'audit_log' => [],
            'users'     => [
                $this->normalUser(),
                ['id' => 3, 'username' => 'Acme', 'email' => 'acme@machine.local', 'is_email_confirmed' => 1, 'password' => $password],
                ['id' => 4, 'username' => 'Acme2', 'email' => 'acme2@machine.local', 'is_email_confirmed' => 1, 'password' => $password],
                ['id' => 5, 'username' => 'Acme3', 'email' => 'acme3@machine.local', 'is_email_confirmed' => 1, 'password' => $password],
                ['id' => 6, 'username' => 'Moderator', 'email' => 'moderator@machine.local', 'is_email_confirmed' => 1, 'password' => $password],
            ],
            'group_user' => [
                ['user_id' => 6, 'group_id' => Group::MODERATOR_ID],
            ],
            'group_permission' => [
                ['permission' => 'discussion.reactPosts', 'group_id' => Group::MEMBER_ID],
                ['permission' => 'discussion.deleteReactionsPosts', 'group_id' => Group::MODERATOR_ID],
            ],
            'discussions' => [
                ['id' => 1, 'title' => __CLASS__, 'created_at' => Carbon::now(), 'last_posted_at' => Carbon::now(), 'user_id' => 2, 'first_post_id' => 1, 'comment_count' => 1, 'slug' => 'fof-reactions-audit-test'],
            ],
            'posts' => [
                ['id' => 1, 'number' => 1, 'discussion_id' => 1, 'created_at' => Carbon::now(), 'user_id' => 2, 'type' => 'comment', 'content' => '<t><p>something</p></t>'],
            ],
            'post_reactions' => [
                ['id' => 1, 'post_id' => 1, 'user_id' => 3, 'reaction_id' => 1],
                ['id' => 2, 'post_id' => 1, 'user_id' => 4, 'reaction_id' => 1],
            ],
            'post_anonymous_reactions' => [
                ['id' => 1, 'post_id' => 1, 'guest_id' => 'guest-a', 'reaction_id' => 1],
            ],
        ]);
    }

    protected function logged(string $action): array
    {
        return AuditLog::query()->where('action', "fof-reactions.$action")->orderBy('id')->get()
            ->map(fn (AuditLog $log) => ['actor' => (int) $log->actor_id, 'payload' => $log->payload])
            ->all();
    }

    protected function reactionRequest(string $method, string $path, int $authenticatedAs, array $attributes = []): int
    {
        $response = $this->send($this->request($method, $path, [
            'authenticatedAs' => $authenticatedAs,
            'json'            => $attributes ? ['data' => ['type' => 'reactions', 'attributes' => $attributes]] : null,
        ]));

        if ($method === 'POST') {
            $this->assertEquals(201, $response->getStatusCode());

            return (int) json_decode((string) $response->getBody(), true)['data']['id'];
        }

        $this->assertContains($response->getStatusCode(), [200, 204], (string) $response->getBody());

        return 0;
    }

    #[Test]
    public function admin_changes_to_reaction_types_are_logged(): void
    {
        $id = $this->reactionRequest('POST', '/api/reactions', 1, ['identifier' => 'audited', 'type' => 'emoji', 'enabled' => true]);

        $this->assertEquals([['actor' => 1, 'payload' => ['reaction_id' => $id, 'reaction' => 'audited']]], $this->logged('reaction_created'));

        $this->reactionRequest('PATCH', "/api/reactions/$id", 1, ['display' => 'Audited']);

        $this->assertEquals([['actor' => 1, 'payload' => [
            'reaction_id' => $id,
            'reaction'    => 'audited',
            'key'         => 'display',
            'old_value'   => null,
            'new_value'   => 'Audited',
        ]]], $this->logged('reaction_updated'));

        $this->reactionRequest('PATCH', "/api/reactions/$id", 1, ['enabled' => false]);
        $this->reactionRequest('PATCH', "/api/reactions/$id", 1, ['enabled' => true]);

        $this->assertEquals([['actor' => 1, 'payload' => ['reaction_id' => $id, 'reaction' => 'audited']]], $this->logged('reaction_disabled'));
        $this->assertEquals([['actor' => 1, 'payload' => ['reaction_id' => $id, 'reaction' => 'audited']]], $this->logged('reaction_enabled'));
        $this->assertCount(1, $this->logged('reaction_updated'), 'Toggling enabled is logged as enabled/disabled, not as an update');

        $this->reactionRequest('DELETE', "/api/reactions/$id", 1);

        $this->assertEquals([['actor' => 1, 'payload' => ['reaction_id' => $id, 'reaction' => 'audited']]], $this->logged('reaction_deleted'));
    }

    #[Test]
    public function a_moderator_removing_a_users_reaction_is_logged(): void
    {
        $response = $this->send($this->request('DELETE', '/api/posts/1/reactions/specific/1', ['authenticatedAs' => 6]));

        $this->assertEquals(204, $response->getStatusCode());

        $this->assertEquals([['actor' => 6, 'payload' => [
            'discussion_id' => 1,
            'post_id'       => 1,
            'user_id'       => 3,
            'reaction'      => 'thumbsup',
        ]]], $this->logged('post_reaction_removed'));
    }

    #[Test]
    public function removing_your_own_reaction_is_not_logged(): void
    {
        $response = $this->send($this->request('DELETE', '/api/posts/1/reactions/specific/1', ['authenticatedAs' => 3]));

        $this->assertEquals(204, $response->getStatusCode());
        $this->assertSame([], $this->logged('post_reaction_removed'));
    }

    #[Test]
    public function clearing_a_reaction_type_from_a_post_is_logged_when_something_was_removed(): void
    {
        $response = $this->send($this->request('DELETE', '/api/posts/1/reactions/type/1', ['authenticatedAs' => 6]));

        $this->assertEquals(204, $response->getStatusCode());

        // Clearing it again removes nothing, so nothing more is logged.
        $this->send($this->request('DELETE', '/api/posts/1/reactions/type/1', ['authenticatedAs' => 6]));

        $this->assertEquals([['actor' => 6, 'payload' => [
            'discussion_id' => 1,
            'post_id'       => 1,
            'reaction_id'   => 1,
            'reaction'      => 'thumbsup',
            'count'         => 3,
        ]]], $this->logged('post_reactions_removed'));
    }

    #[Test]
    public function reacting_and_unreacting_are_not_logged(): void
    {
        foreach (['1', null] as $reaction) {
            $response = $this->send($this->request('PATCH', '/api/posts/1', [
                'authenticatedAs' => 5,
                'json'            => ['data' => ['type' => 'posts', 'id' => '1', 'attributes' => ['reaction' => $reaction]]],
            ]));

            $this->assertEquals(200, $response->getStatusCode());
        }

        $this->assertSame(0, AuditLog::query()->where('action', 'like', 'fof-reactions.%')->count());
    }
}
