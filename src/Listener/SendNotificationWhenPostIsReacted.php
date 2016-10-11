<?php

/*
 * This file is part of datitisev/flarum-ext-reactions
 *
 * © David Sevilla Martín <dsevilla192@icloud.com>
 *
 * For the full copyright and license information, please view the MIT license
 */


namespace Datitisev\Reactions\Listener;

use Datitisev\Reactions\Event\PostWasReacted;
use Datitisev\Reactions\Event\PostWasUnreacted;
use Datitisev\Reactions\Notification\PostReactedBlueprint;
use Flarum\Api\Serializer\PostBasicSerializer;
use Flarum\Core\Notification\NotificationSyncer;
use Flarum\Core\Post;
use Flarum\Core\User;
use Flarum\Event\ConfigureNotificationTypes;
use Illuminate\Contracts\Events\Dispatcher;

class SendNotificationWhenPostIsReacted
{
    /**
     * @var NotificationSyncer
     */
    protected $notifications;

    /**
     * @param NotificationSyncer $notifications
     */
    public function __construct(NotificationSyncer $notifications)
    {
        $this->notifications = $notifications;
    }

    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(ConfigureNotificationTypes::class, [$this, 'registerNotificationType']);
        $events->listen(PostWasReacted::class, [$this, 'whenPostWasReacted']);
        $events->listen(PostWasUnreacted::class, [$this, 'whenPostWasUnreacted']);
    }

    /**
     * @param ConfigureNotificationTypes $event
     */
    public function registerNotificationType(ConfigureNotificationTypes $event)
    {
        $event->add(PostReactedBlueprint::class, PostBasicSerializer::class, ['alert']);
    }

    /**
     * @param PostWasReacted $event
     */
    public function whenPostWasReacted(PostWasReacted $event)
    {
        $this->sync($event->post, $event->user, $event->reaction, [$event->post->user]);
    }

    /**
     * @param PostWasUnreacted $event
     */
    public function whenPostWasUnreacted(PostWasUnreacted $event)
    {
        $this->sync($event->post, $event->user, '', []);
    }

    /**
     * @param Post  $post
     * @param User  $user
     * @param array $recipients
     */
    public function sync(Post $post, User $user, string $reaction, array $recipients)
    {
        if ($post->user->id != $user->id) {
            $this->notifications->sync(
                new PostReactedBlueprint($post, $user, $reaction),
                $recipients
            );
        }
    }
}
