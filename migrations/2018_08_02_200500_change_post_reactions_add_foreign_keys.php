<?php

/**
 *  This file is part of reflar/reactions.
 *
 *  Copyright (c) ReFlar.
 *
 *  http://reflar.io
 *
 *  For the full copyright and license information, please view the license.md
 *  file that was distributed with this source code.
 */
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        // Delete rows with non-existent entities so that we will be able to create
        // foreign keys without any issues.
        $schema->getConnection()
            ->table('post_reactions')
            ->whereNotExists(function ($query) {
                $query->selectRaw(1)->from('posts')->whereColumn('id', 'post_id');
            })
            ->orWhereNotExists(function ($query) {
                $query->selectRaw(1)->from('users')->whereColumn('id', 'user_id');
            })
            ->orWhereNotExists(function ($query) {
                $query->selectRaw(1)->from('reactions')->whereColumn('id', 'reaction_id');
            })
            ->delete();

        $schema->table('post_reactions', function (Blueprint $table) {
            $table->foreign('post_id')->references('id')->on('posts')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->integer('reaction_id')->nullable()->change();
        });
    },

    'down' => function (Builder $schema) {
        $schema->table('post_reactions', function (Blueprint $table) {
            $table->dropForeign(['post_id', 'user_id', 'reaction_id']);
        });
    },
];
