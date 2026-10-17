<?php

/*
 * This file is part of fof/reactions.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

/*
 * An actor has one reaction row per post. Concurrent react requests (double click, retry) could
 * both miss the existing-row lookup and insert, leaving duplicate rows that inflate the counts and
 * outlive an unreact. Remove those duplicates, then make the lookup indexes unique so the database
 * rejects the losing insert.
 *
 * Only PostgreSQL rolls back failed DDL, so each index change checks the current state first and
 * a run that stopped partway can be resumed.
 */
return [
    'up' => static function (Builder $schema) {
        $db = $schema->getConnection();

        foreach (['post_reactions' => 'user_id', 'post_anonymous_reactions' => 'guest_id'] as $tableName => $actorColumn) {
            $pairs = $db->table($tableName)
                ->select('post_id', $actorColumn)
                ->groupBy('post_id', $actorColumn)
                ->havingRaw('COUNT(*) > 1')
                ->get();

            foreach ($pairs as $pair) {
                $rows = $db->table($tableName)
                    ->where('post_id', $pair->post_id)
                    ->where($actorColumn, $pair->$actorColumn)
                    ->get(['id', 'updated_at'])
                    ->all();

                // Keep the most recently updated row: later changes are written to an existing row,
                // so it holds the actor's latest reaction. A missing timestamp counts as oldest; the
                // newest row wins a tie. Sorted here because databases disagree on where NULLs sort.
                usort($rows, fn ($a, $b) => [(string) $b->updated_at, (int) $b->id] <=> [(string) $a->updated_at, (int) $a->id]);
                array_shift($rows);

                $db->table($tableName)->whereIn('id', array_map(fn ($row) => $row->id, $rows))->delete();
            }

            $schema->table($tableName, function (Blueprint $table) use ($schema, $tableName, $actorColumn) {
                $unique = "{$tableName}_post_id_{$actorColumn}_unique";
                $index = "{$tableName}_post_id_{$actorColumn}_index";

                if (!$schema->hasIndex($tableName, $unique)) {
                    $table->unique(['post_id', $actorColumn], $unique);
                }

                // Dropped only after the unique index exists, so post_id's foreign key is never left
                // without an index (MySQL and MariaDB refuse to drop the only index a foreign key uses).
                if ($schema->hasIndex($tableName, $index)) {
                    $table->dropIndex($index);
                }
            });
        }
    },

    'down' => static function (Builder $schema) {
        // Removed duplicates are not restored; only the indexes revert.
        foreach (['post_reactions' => 'user_id', 'post_anonymous_reactions' => 'guest_id'] as $tableName => $actorColumn) {
            $schema->table($tableName, function (Blueprint $table) use ($schema, $tableName, $actorColumn) {
                $unique = "{$tableName}_post_id_{$actorColumn}_unique";
                $index = "{$tableName}_post_id_{$actorColumn}_index";

                // Added back before the unique index goes, for the same foreign key reason as in up.
                if (!$schema->hasIndex($tableName, $index)) {
                    $table->index(['post_id', $actorColumn], $index);
                }

                if ($schema->hasIndex($tableName, $unique)) {
                    $table->dropUnique($unique);
                }
            });
        }
    },
];
