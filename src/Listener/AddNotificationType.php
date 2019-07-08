<?php

/*
 * This file is part of fof/reactions.
 *
 * Copyright (c) 2019 FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Reactions\Listener;

use Flarum\Api\Serializer\BasicPostSerializer;
use Flarum\Event\ConfigureNotificationTypes;
use FoF\Reactions\Notification\PostReactedBlueprint;

class AddNotificationType
{
    public function handle(ConfigureNotificationTypes $event)
    {
        $event->add(PostReactedBlueprint::class, BasicPostSerializer::class, ['alert']);
    }
}
