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
    public function __construct(
        public Reaction $reaction,
        public User $actor,
        public array $data
    ) {
    }
}
