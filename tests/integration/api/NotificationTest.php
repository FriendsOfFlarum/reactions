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
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\Testing\integration\TestCase;
use PHPUnit\Framework\Attributes\Test;

class NotificationTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-reactions');

        $this->prepareDatabase([
            'users' => [
                $this->normalUser(),
                ['id' => 3, 'username' => 'Acme', 'email' => 'acme@machine.local', 'is_email_confirmed' => 1, 'password' => '$2y$10$LO59tiT7uggl6Oe23o/O6.utnF6ipngYjvMvaxo1TciKqBttDNKim'],
                ['id' => 4, 'username' => 'Acme2', 'email' => 'acme2@machine.local', 'is_email_confirmed' => 1, 'password' => '$2y$10$LO59tiT7uggl6Oe23o/O6.utnF6ipngYjvMvaxo1TciKqBttDNKim'],
                ['id' => 6, 'username' => 'Moderator', 'email' => 'moderator@machine.local', 'is_email_confirmed' => 1, 'password' => '$2y$10$LO59tiT7uggl6Oe23o/O6.utnF6ipngYjvMvaxo1TciKqBttDNKim'],
            ],
            'group_user' => [
                ['user_id' => 6, 'group_id' => Group::MODERATOR_ID],
            ],
            'group_permission' => [
                ['permission' => 'discussion.reactPosts', 'group_id' => Group::MEMBER_ID],
                ['permission' => 'discussion.deleteReactionsPosts', 'group_id' => Group::MODERATOR_ID],
            ],
            'discussions' => [
                ['id' => 1, 'title' => __CLASS__, 'created_at' => Carbon::now(), 'last_posted_at' => Carbon::now(), 'user_id' => 2, 'first_post_id' => 1, 'comment_count' => 1, 'slug' => 'fof-reactions-notification-test'],
            ],
            'posts' => [
                ['id' => 1, 'number' => 1, 'discussion_id' => 1, 'created_at' => Carbon::now(), 'user_id' => 2, 'type' => 'comment', 'content' => '<t><p>something</p></t>'],
            ],
        ]);
    }

    protected function react(?string $reactionId, int $authenticatedAs = 3): void
    {
        $response = $this->send($this->request('PATCH', '/api/posts/1', [
            'authenticatedAs' => $authenticatedAs,
            'json'            => ['data' => ['type' => 'posts', 'id' => '1', 'attributes' => ['reaction' => $reactionId]]],
        ]));

        $this->assertEquals(200, $response->getStatusCode(), (string) $response->getBody());
    }

    /**
     * The post author's reaction notifications, oldest first.
     */
    protected function notifications(): array
    {
        return $this->database()->table('notifications')
            ->where('type', 'postReacted')
            ->where('user_id', 2)
            ->orderBy('id')
            ->get(['from_user_id', 'subject_id', 'data', 'is_deleted'])
            ->map(fn ($row) => [
                'from'    => (int) $row->from_user_id,
                'subject' => (int) $row->subject_id,
                'data'    => json_decode($row->data, true),
                'deleted' => (bool) $row->is_deleted,
            ])
            ->all();
    }

    protected function live(): array
    {
        return array_values(array_filter($this->notifications(), fn ($n) => !$n['deleted']));
    }

    protected function liveFrom(): array
    {
        return array_column($this->live(), 'from');
    }

    protected function deleteReaction(string $path, int $authenticatedAs): void
    {
        $response = $this->send($this->request('DELETE', "/api/posts/1/reactions/$path", ['authenticatedAs' => $authenticatedAs]));

        $this->assertEquals(204, $response->getStatusCode(), (string) $response->getBody());
    }

    protected function postReactionId(int $userId): int
    {
        return (int) $this->database()->table('post_reactions')->where('post_id', 1)->where('user_id', $userId)->value('id');
    }

    #[Test]
    public function reacting_notifies_the_author_with_the_reaction()
    {
        $this->react('1');

        $this->assertEquals([
            ['from' => 3, 'subject' => 1, 'data' => ['identifier' => 'thumbsup', 'type' => 'emoji'], 'deleted' => false],
        ], $this->notifications());
    }

    #[Test]
    public function unreacting_withdraws_the_notification()
    {
        $this->react('1');
        $this->react(null);

        $this->assertCount(1, $this->notifications());
        $this->assertEquals([], $this->live());
    }

    #[Test]
    public function reacting_again_with_the_same_reaction_unreacts_and_withdraws_the_notification()
    {
        $this->react('1');
        $this->react('1');

        $this->assertEquals([], $this->live());
    }

    #[Test]
    public function switching_reaction_leaves_only_the_new_reaction_notified()
    {
        $this->react('1');
        $this->react('2');

        $this->assertEquals([
            ['from' => 3, 'subject' => 1, 'data' => ['identifier' => 'thumbsdown', 'type' => 'emoji'], 'deleted' => false],
        ], $this->live());
    }

    #[Test]
    public function reacting_again_after_unreacting_restores_a_single_notification()
    {
        $this->react('1');
        $this->react(null);
        $this->react('1');

        $this->assertCount(1, $this->notifications());
        $this->assertCount(1, $this->live());
    }

    #[Test]
    public function unreacting_withdraws_a_notification_stored_in_the_old_format()
    {
        // Earlier versions stored the whole reaction model, JSON-encoded, as a string.
        $this->database()->table('post_reactions')->insert(['post_id' => 1, 'user_id' => 3, 'reaction_id' => 1]);
        $this->database()->table('notifications')->insert([
            'user_id'      => 2,
            'from_user_id' => 3,
            'type'         => 'postReacted',
            'subject_id'   => 1,
            'data'         => json_encode('{"id":1,"identifier":"thumbsup","type":"emoji","enabled":true,"display":null}'),
            'created_at'   => Carbon::now(),
            'is_deleted'   => false,
        ]);

        $this->react(null);

        $this->assertEquals([], $this->live());
    }

    #[Test]
    public function the_notification_api_returns_the_reaction_identifier_and_type()
    {
        $this->react('1');

        $response = $this->send($this->request('GET', '/api/notifications', ['authenticatedAs' => 2]));

        $this->assertEquals(200, $response->getStatusCode());

        $body = json_decode((string) $response->getBody(), true);

        $this->assertCount(1, $body['data']);
        $this->assertEquals('postReacted', $body['data'][0]['attributes']['contentType']);
        $this->assertEquals(['identifier' => 'thumbsup', 'type' => 'emoji'], $body['data'][0]['attributes']['content']);
    }

    #[Test]
    public function the_notification_api_sends_an_old_format_notification_as_its_json_string_in_an_array()
    {
        // The forum's PostReactedNotification decodes this shape; keep the two in step.
        $legacy = '{"id":1,"identifier":"thumbsup","type":"emoji","enabled":true,"display":null}';

        $this->database()->table('notifications')->insert([
            'user_id'      => 2,
            'from_user_id' => 3,
            'type'         => 'postReacted',
            'subject_id'   => 1,
            'data'         => json_encode($legacy),
            'created_at'   => Carbon::now(),
            'is_deleted'   => false,
        ]);

        $response = $this->send($this->request('GET', '/api/notifications', ['authenticatedAs' => 2]));

        $this->assertEquals(200, $response->getStatusCode());

        $body = json_decode((string) $response->getBody(), true);

        $this->assertEquals([$legacy], $body['data'][0]['attributes']['content']);
    }

    #[Test]
    public function removing_your_own_reaction_from_the_reactions_list_withdraws_the_notification()
    {
        $this->react('1', 3);
        $this->react('1', 4);

        $this->deleteReaction('specific/'.$this->postReactionId(3), 3);

        $this->assertEquals([4], $this->liveFrom());
    }

    #[Test]
    public function a_moderator_removing_a_reaction_withdraws_its_notification()
    {
        $this->react('1', 3);
        $this->react('1', 4);

        $this->deleteReaction('specific/'.$this->postReactionId(3), 6);

        $this->assertEquals([4], $this->liveFrom());
    }

    #[Test]
    public function a_moderator_clearing_a_reaction_type_withdraws_only_those_notifications()
    {
        $this->react('1', 3);
        $this->react('1', 4);
        $this->react('2', 6);

        $this->deleteReaction('type/1', 6);

        $this->assertEquals([6], $this->liveFrom());
    }

    #[Test]
    public function reacting_to_your_own_post_sends_no_notification()
    {
        $this->setting('fof-reactions.react_own_post', true);

        $this->react('1', 2);

        $this->assertEquals([], $this->notifications());
    }
}
