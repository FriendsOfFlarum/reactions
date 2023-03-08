<?php

/*
 * This file is part of fof/reactions.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Reactions\Event;

use Flarum\User\User;
use FoF\Reactions\Reaction;

class Creating
{
    /**
     * @var Reaction
     */
    public Reaction $reaction;

    /**
     * @var User
     */
    public User $actor;

    /**
     * @var array
     */
    public array $data;

    /**
     * Creating constructor.
     *
     * @param Reaction $actor
     * @param User     $actor
     */
    public function __construct(Reaction $reaction, User $actor)
    {
        $this->reaction = $reaction;
        $this->actor = $actor;
    }
}
