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
        $schema->table('post_reactions', function (Blueprint $table) {
            // Recreate single-column foreign-key index (post_id foreign index) that was automatically dropped by DB when
            // the multi-column indexes were created. Otherwise, we hit a FK constraint error.
            $table->index(['post_id'], 'post_reactions_post_id_foreign');

            $table->dropIndex('post_reactions_post_id_user_id_index');
            $table->dropIndex('post_reactions_post_id_reaction_id_index');
        });

        $schema->table('post_anonymous_reactions', function (Blueprint $table) {
            // Same as above
            $table->index(['post_id'], 'post_anonymous_reactions_post_id_foreign');

            $table->dropIndex('post_anonymous_reactions_post_id_guest_id_index');
            $table->dropIndex('post_anonymous_reactions_post_id_reaction_id_index');
        });
    },
];
