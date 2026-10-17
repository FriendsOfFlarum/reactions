<?php

/*
 * This file is part of fof/reactions.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Reactions\Tests\integration\db;

use Carbon\Carbon;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\Testing\integration\TestCase;
use PHPUnit\Framework\Attributes\Test;

class UniqueReactionIndexesMigrationTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-reactions');

        $this->prepareDatabase([
            'users' => [
                $this->normalUser(),
            ],
            'discussions' => [
                ['id' => 1, 'title' => __CLASS__, 'created_at' => Carbon::now(), 'last_posted_at' => Carbon::now(), 'user_id' => 1, 'first_post_id' => 1, 'comment_count' => 1, 'slug' => 'unique-reaction-indexes-migration-test'],
            ],
            'posts' => [
                ['id' => 1, 'number' => 1, 'discussion_id' => 1, 'created_at' => Carbon::now(), 'user_id' => 1, 'type' => 'comment', 'content' => '<t><p>something</p></t>'],
            ],
        ]);
    }

    #[Test]
    public function it_removes_duplicate_reactions_and_makes_the_actor_indexes_unique(): void
    {
        $migration = include __DIR__.'/../../../migrations/2026_10_17_000000_add_unique_indexes_to_reaction_tables.php';

        $db = $this->database();
        $schema = $db->getSchemaBuilder();

        // Back to the earlier non-unique indexes, so duplicates can be seeded the way the race left them.
        $migration['down']($schema);

        try {
            $db->table('post_reactions')->insert([
                // User 1: the most recently updated row is kept, whatever its id.
                ['id' => 1, 'post_id' => 1, 'user_id' => 1, 'reaction_id' => 1, 'updated_at' => '2026-01-01 00:00:00'],
                ['id' => 2, 'post_id' => 1, 'user_id' => 1, 'reaction_id' => 2, 'updated_at' => '2026-02-01 00:00:00'],
                ['id' => 3, 'post_id' => 1, 'user_id' => 1, 'reaction_id' => 3, 'updated_at' => null],
                // User 2: same timestamp, so the newest row is kept.
                ['id' => 4, 'post_id' => 1, 'user_id' => 2, 'reaction_id' => 1, 'updated_at' => '2026-01-01 00:00:00'],
                ['id' => 5, 'post_id' => 1, 'user_id' => 2, 'reaction_id' => 3, 'updated_at' => '2026-01-01 00:00:00'],
            ]);

            $db->table('post_anonymous_reactions')->insert([
                ['id' => 1, 'post_id' => 1, 'guest_id' => 'guest-a', 'reaction_id' => 1, 'updated_at' => '2026-02-01 00:00:00'],
                ['id' => 2, 'post_id' => 1, 'guest_id' => 'guest-a', 'reaction_id' => 2, 'updated_at' => '2026-01-01 00:00:00'],
                ['id' => 3, 'post_id' => 1, 'guest_id' => 'guest-b', 'reaction_id' => 1, 'updated_at' => '2026-01-01 00:00:00'],
            ]);

            $migration['up']($schema);

            $this->assertSame([2, 5], $this->ids('post_reactions'));
            $this->assertSame([1, 3], $this->ids('post_anonymous_reactions'));

            $this->assertTrue($schema->hasIndex('post_reactions', ['post_id', 'user_id'], 'unique'));
            $this->assertTrue($schema->hasIndex('post_anonymous_reactions', ['post_id', 'guest_id'], 'unique'));
            $this->assertFalse($schema->hasIndex('post_reactions', 'post_reactions_post_id_user_id_index'));
            $this->assertFalse($schema->hasIndex('post_anonymous_reactions', 'post_anonymous_reactions_post_id_guest_id_index'));
        } finally {
            // MySQL and MariaDB commit implicitly on DDL, so this test's rows would outlive its rollback.
            $db->table('post_reactions')->where('post_id', 1)->delete();
            $db->table('post_anonymous_reactions')->where('post_id', 1)->delete();
            $db->table('posts')->where('id', 1)->delete();
            $db->table('discussions')->where('id', 1)->delete();
            $db->table('users')->where('id', 2)->delete();
        }
    }

    #[Test]
    public function its_down_migration_restores_the_non_unique_indexes(): void
    {
        $migration = include __DIR__.'/../../../migrations/2026_10_17_000000_add_unique_indexes_to_reaction_tables.php';

        $schema = $this->database()->getSchemaBuilder();

        try {
            $migration['down']($schema);

            $this->assertTrue($schema->hasIndex('post_reactions', 'post_reactions_post_id_user_id_index'));
            $this->assertTrue($schema->hasIndex('post_anonymous_reactions', 'post_anonymous_reactions_post_id_guest_id_index'));
            $this->assertFalse($schema->hasIndex('post_reactions', ['post_id', 'user_id'], 'unique'));
            $this->assertFalse($schema->hasIndex('post_anonymous_reactions', ['post_id', 'guest_id'], 'unique'));

            // Running it again must not fail: only PostgreSQL rolls back DDL, so a stopped run can be repeated.
            $migration['down']($schema);
        } finally {
            // Leave the schema migrated for the tests that follow (MySQL and MariaDB keep DDL past the rollback).
            $migration['up']($schema);
        }

        $this->assertTrue($schema->hasIndex('post_reactions', ['post_id', 'user_id'], 'unique'));
    }

    /**
     * @return int[]
     */
    protected function ids(string $table): array
    {
        return $this->database()->table($table)->orderBy('id')->pluck('id')->map(fn ($id) => (int) $id)->all();
    }
}
