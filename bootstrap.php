<?php

/*
 * This file is part of datitisev/flarum-ext-reactions
 *
 * (c) David Sevilla Martín <dsevilla192@icloud.com>
 *
 * For the full copyright and license information, please view the MIT license
 */

namespace Datitisev\Reactions;

use Illuminate\Contracts\Events\Dispatcher;

return function (Dispatcher $events) {

    // add assets
    $events->subscribe(Listener\AddClientAssets::class);
    $events->subscribe(Listener\AddPostReactionsRelationship::class);
    $events->subscribe(Listener\SaveReactionsToDatabase::class);
//    $events->subscribe(Listener\SendNotificationWhenPostIsLiked::class);
};
