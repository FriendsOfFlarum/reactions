<?php

/*
 * This file is part of fof/reactions.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        $db = $schema->getConnection();

        $keys = ['convertToUpvote', 'convertToDownvote', 'convertToLike'];

        foreach ($keys as $key) {
            $db->table('settings')
                ->where('key', "reflar.reactions.$key")
                ->update(['key' => "fof-reactions.$key"]);
        }
    },
    'down' => function () {
        //
    },
];
