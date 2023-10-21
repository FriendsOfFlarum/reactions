<?php

/*
 * This file is part of fof/reactions.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Reactions\Command;

use Flarum\User\Exception\PermissionDeniedException;
use FoF\Reactions\Event\Deleted;
use FoF\Reactions\Event\Deleting;
use FoF\Reactions\Reaction;
use Illuminate\Contracts\Events\Dispatcher;

class DeleteReactionHandler
{
    /**
     * @var Dispatcher
     */
    protected $events;

    /**
     * @param Dispatcher $events
     */
    public function __construct(Dispatcher $events)
    {
        $this->events = $events;
    }

    /**
     * @param DeleteReaction $command
     *
     * @throws PermissionDeniedException
     *
     * @return void
     */
    public function handle(DeleteReaction $command)
    {
        $actor = $command->actor;

        $actor->assertAdmin();

        $reaction = Reaction::where('id', $command->reactionId)->first();

        $this->events->dispatch(new Deleting($reaction, $actor));

        $reaction->delete();

        $this->events->dispatch(new Deleted($reaction, $actor));
    }
}
