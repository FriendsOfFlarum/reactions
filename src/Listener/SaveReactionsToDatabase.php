<?php

/*
 * This file is part of datitisev/flarum-ext-reactions
 *
 * (c) David Sevilla Martín <dsevilla192@icloud.com>
 *
 * For the full copyright and license information, please view the MIT license
 */

namespace Datitisev\Reactions\Listener;

use Datitisev\Reactions\Event\PostWasReacted;
use Datitisev\Reactions\Event\PostWasUnreacted;
use Flarum\Core\Access\AssertPermissionTrait;
use Flarum\Event\PostWasDeleted;
use Flarum\Event\PostWillBeSaved;
use Illuminate\Contracts\Events\Dispatcher;

class SaveReactionsToDatabase
{
    use AssertPermissionTrait;

    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(PostWillBeSaved::class, [$this, 'whenPostWillBeSaved']);
        $events->listen(PostWasDeleted::class, [$this, 'whenPostWasDeleted']);
    }

    /**
     * @param PostWillBeSaved $event
     */
    public function whenPostWillBeSaved(PostWillBeSaved $event)
    {
        $post = $event->post;
        $data = $event->data;

        if ($post->exists && isset($data['attributes']['reaction'])) {
            $actor = $event->actor;
            $reacted = (bool) $data['attributes']['reaction'];
            $reaction = $data['attributes']['reaction'];

            $this->assertCan($actor, 'react', $post);

            $currentlyReacted = $post->reactions()->where('user_id', $actor->id)->exists();

            if ($reacted && !$currentlyReacted) {
                $post->reactions()->attach($actor->id, ['reaction' => $reaction]);

                $post->raise(new PostWasReacted($post, $actor, $reaction));
            } elseif ($currentlyReacted) {
                $post->reactions()->detach($actor->id);

                $post->raise(new PostWasUnreacted($post, $actor));
            }
        }
    }

    /**
     * @param PostWasDeleted $event
     */
    public function whenPostWasDeleted(PostWasDeleted $event)
    {
        $event->post->reactions()->detach();
    }
}
