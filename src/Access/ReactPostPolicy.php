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

use Flarum\Post\Post;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\Access\AbstractPolicy;
use Flarum\User\User;

class ReactPostPolicy extends AbstractPolicy
{
    public function __construct(
        protected SettingsRepositoryInterface $settings
    ) {
    }

    public function react(User $actor, Post $post): ?string
    {
        if ($actor->id === $post->user_id && !(bool) $this->settings->get('fof-reactions.react_own_post')) {
            return $this->deny();
        }

        if ($actor->isGuest() && (bool) $this->settings->get('fof-reactions.anonymousReactions')) {
            return $this->allow();
        }

        return null;
    }
}
