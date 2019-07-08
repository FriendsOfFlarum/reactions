<?php

/*
 * This file is part of fof/reactions.
 *
 * Copyright (c) 2019 FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Reactions\Command;

use Flarum\User\AssertPermissionTrait;
use Flarum\User\Exception\PermissionDeniedException;
use FoF\Reactions\Reaction;

class DeleteReactionHandler
{
    use AssertPermissionTrait;

    /**
     * @param DeleteReaction $command
     *
     * @throws PermissionDeniedException
     *
     * @return Reaction
     */
    public function handle(DeleteReaction $command)
    {
        $actor = $command->actor;

        $this->assertAdmin($actor);

        $reaction = Reaction::where('id', $command->reactionId)->first();

        $reaction->delete();
    }
}
