<?php

/*
 * This file is part of fof/reactions.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Reactions;

use Flarum\Api\Schema;
use Flarum\Settings\SettingsRepositoryInterface;

class ForumResourceFields
{
    public function __construct(
        protected SettingsRepositoryInterface $settings
    ){
    }

    public function __invoke(): array
    {
        return [
            Schema\Str::make('ReactionConverts')->get(fn () => [
                $this->settings->get('fof-reactions.convertToUpvote'),
                $this->settings->get('fof-reactions.convertToDownvote'),
                $this->settings->get('fof-reactions.convertToLike'),
            ]),

            Schema\Relationship\ToMany::make('reactions')
                ->includable()
                ->get(fn () => Reaction::all()),
        ];
    }
}
