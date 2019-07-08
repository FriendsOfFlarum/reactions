<?php


namespace FoF\Reactions\Listener;


use Flarum\Api\Serializer\BasicPostSerializer;
use Flarum\Event\ConfigureNotificationTypes;
use FoF\Reactions\Notification\PostReactedBlueprint;

class AddNotificationType
{
    public function handle(ConfigureNotificationTypes $event) {
        $event->add(PostReactedBlueprint::class, BasicPostSerializer::class, ['alert']);
    }
}
