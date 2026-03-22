<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
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

    'down' => function (Builder $schema) {
        $schema->table('post_reactions', function (Blueprint $table) {
            $table->dropIndex('post_reactions_post_id_user_id_index');
            $table->dropIndex('post_reactions_post_id_reaction_id_index');
        });

        $schema->table('post_anonymous_reactions', function (Blueprint $table) {
            $table->dropIndex('post_anonymous_reactions_post_id_guest_id_index');
            $table->dropIndex('post_anonymous_reactions_post_id_reaction_id_index');
        });
    },
];
