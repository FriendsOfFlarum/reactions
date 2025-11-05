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

use Flarum\User\Access\AbstractPolicy;
use Flarum\User\User;
use FoF\Reactions\PostReaction;

class PostReactionPolicy extends AbstractPolicy
{
    public function canSeeReactions(User $actor, PostReaction $postReaction): ?string
    {
        $discussion = $postReaction->post->discussion;

        if ($actor->can('canSeeReactions', $discussion)) {
            return $this->allow();
        }

        return null;
    }
}
