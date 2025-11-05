<?php

/*
 * This file is part of fof/reactions.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Reactions\Access;

use Flarum\User\User;
use Illuminate\Database\Eloquent\Builder;

class ScopePostReactionVisibility
{
    public function __invoke(User $actor, Builder $query): void
    {
        // Filter to only reactions on posts that are visible
        $query->whereHas('post', function (Builder $query) use ($actor) {
            $query->whereVisibleTo($actor)
                // Also check that the actor can see reactions on the discussion
                ->whereHas('discussion', function (Builder $query) use ($actor) {
                    $query->whereVisibleTo($actor);

                    // Check if user has the canSeeReactions permission
                    if (!$actor->hasPermission('discussion.canSeeReactions')) {
                        // If they don't have the global permission, hide all reactions
                        $query->whereRaw('0 = 1');
                    }
                });
        });
    }
}
