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

use Flarum\User\User;

class DeleteReaction
{
    /**
     * The ID of the reaction to delete.
     *
     * @var int
     */
    public $reactionId;

    /**
     * The user performing the action.
     *
     * @var User
     */
    public $actor;

    /**
     * Any other reaction input associated with the action. This is unused by
     * default, but may be used by extensions.
     *
     * @var array
     */
    public $data;

    /**
     * @param int   $reactionId The ID of the reaction to delete.
     * @param User  $actor      The user performing the action.
     * @param array $data       Any other reaction input associated with the action. This
     *                          is unused by default, but may be used by extensions.
     */
    public function __construct($reactionId, User $actor, array $data = [])
    {
        $this->reactionId = $reactionId;
        $this->actor = $actor;
        $this->data = $data;
    }
}
