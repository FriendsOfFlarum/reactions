<?php

/*
 * This file is part of fof/reactions.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Reactions\Search;

use Flarum\Search\Database\AbstractSearcher;
use Flarum\User\User;
use FoF\Reactions\PostReaction;
use Illuminate\Database\Eloquent\Builder;

class PostReactionSearcher extends AbstractSearcher
{

    public function getQuery(User $actor): Builder
    {
        // Only return registered user reactions via the API
        // Anonymous reactions are aggregated in the post's reactionCounts attribute
        return PostReaction::query()
            ->whereNotNull('reaction_id')
            ->whereVisibleTo($actor);
    }
}
