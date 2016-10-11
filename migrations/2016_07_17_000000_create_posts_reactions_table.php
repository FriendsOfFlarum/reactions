<?php

/*
 * This file is part of datitisev/flarum-ext-reactions
 *
 * © David Sevilla Martín <dsevilla192@icloud.com>
 *
 * For the full copyright and license information, please view the MIT license
 */


use Flarum\Database\Migration;
use Illuminate\Database\Schema\Blueprint;

return Migration::createTable(
    'posts_reactions',
    function (Blueprint $table) {
        $table->integer('post_id')->unsigned();
        $table->integer('user_id')->unsigned();
        $table->string('reaction');
        $table->primary(['post_id', 'user_id']);
    }
);
