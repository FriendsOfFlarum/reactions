<?php

/**
 *  This file is part of fof/reactions.
 *
 *  Copyright (c) FriendsOfFlarum.
 *
 *  For the full copyright and license information, please view the license.md
 *  file that was distributed with this source code.
 */

namespace FoF\Reactions;

use Flarum\Extend;
use Illuminate\Contracts\Events\Dispatcher;
use FoF\Reactions\Api\Controller;

return [
    (new Extend\Frontend('admin'))
        ->css(__DIR__.'/resources/less/admin.less')
        ->js(__DIR__.'/js/dist/admin.js'),
    (new Extend\Frontend('forum'))
        ->css(__DIR__.'/resources/less/forum.less')
        ->js(__DIR__.'/js/dist/forum.js'),
    new Extend\Locales(__DIR__.'/resources/locale'),
    (new Extend\Routes('api'))
        ->get('/reactions', 'reactions.index', Controller\ListReactionsController::class)
        ->post('/reactions', 'reactions.create', Controller\CreateReactionController::class)
        ->patch('/reactions/{id}', 'reactions.update', Controller\UpdateReactionController::class)
        ->delete('/reactions/{id}', 'reactions.delete', Controller\DeleteReactionController::class),
    function (Dispatcher $events) {
        $events->subscribe(Listener\AddPostReactionsRelationship::class);
        $events->subscribe(Listener\SaveReactionsToDatabase::class);
        $events->subscribe(Listener\SendNotificationWhenPostIsReacted::class);
    },
];
