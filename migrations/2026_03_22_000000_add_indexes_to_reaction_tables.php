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

return [
    'up' => static function (Builder $schema) {
        $schema->table('post_reactions', function (Blueprint $table) {
            // Speeds up getActorReactionForPost() and setReaction() lookups
            $table->index(['post_id', 'user_id'], 'post_reactions_post_id_user_id_index');
            // Speeds up getReactionCountsForPost() GROUP BY query
            $table->index(['post_id', 'reaction_id'], 'post_reactions_post_id_reaction_id_index');
        });

        $schema->table('post_anonymous_reactions', function (Blueprint $table) {
            // Speeds up anonymous actor reaction lookup
            $table->index(['post_id', 'guest_id'], 'post_anonymous_reactions_post_id_guest_id_index');
            // Speeds up getReactionCountsForPost() GROUP BY query
            $table->index(['post_id', 'reaction_id'], 'post_anonymous_reactions_post_id_reaction_id_index');
        });
    },

    'down' => static function (Builder $schema) {
        $dropIndexIfExists = static function (Blueprint $table, array $indices, string $indexName) {
            if (in_array($indexName, $indices, true)) {
                $table->dropIndex($indexName);
            }
        };

        $schema->table('post_reactions', function (Blueprint $table) use ($dropIndexIfExists, $schema) {
            $indices = $schema->getIndexListing('post_reactions');

            // Recreate single-column foreign-key index (post_id foreign index) that was automatically dropped by DB when
            // the multi-column indexes were created. Otherwise, we hit a FK constraint error.
            if (!in_array($foreignIndex = 'post_reactions_post_id_foreign', $indices)) {
                $table->index(['post_id'], 'post_reactions_post_id_foreign');
            }

            // In case errors occurred, only drop indices if they exist to avoid "index not found" errors.
            $dropIndexIfExists($table, $indices, 'post_reactions_post_id_user_id_index');
            $dropIndexIfExists($table, $indices, 'post_reactions_post_id_reaction_id_index');
        });

        $schema->table('post_anonymous_reactions', function (Blueprint $table) use ($dropIndexIfExists, $schema) {
            $indices = $schema->getIndexListing('post_anonymous_reactions');

            // Same as above, but for anonymous reactions.
            if (!in_array($foreignIndex = 'post_anonymous_reactions_post_id_foreign', $indices, true)) {
                $table->index(['post_id'], $foreignIndex);
            }

            $dropIndexIfExists($table, $indices, 'post_anonymous_reactions_post_id_guest_id_index');
            $dropIndexIfExists($table, $indices, 'post_anonymous_reactions_post_id_reaction_id_index');
        });
    },
];
