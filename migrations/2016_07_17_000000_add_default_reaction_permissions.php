<?php

/*
 * This file is part of datitisev/flarum-ext-reactions
 *
 * © David Sevilla Martín <dsevilla192@icloud.com>
 *
 * For the full copyright and license information, please view the MIT license
 */


use Illuminate\Database\ConnectionInterface;

$permissionAttributes = [
    'group_id'   => 3, // Default group ID of members
    'permission' => 'discussion.reactPosts',
];

return [
    'up' => function (ConnectionInterface $db) use ($permissionAttributes) {
        $instance = $db->table('permissions')->where($permissionAttributes)->first();

        if (is_null($instance)) {
            $db->table('permissions')->insert($permissionAttributes);
        }
    },

    'down' => function (ConnectionInterface $db) use ($permissionAttributes) {
        $db->table('permissions')->where($permissionAttributes)->delete();
    },
];
