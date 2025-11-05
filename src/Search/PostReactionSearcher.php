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
use Flarum\Search\Filter\FilterManager;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\User;
use FoF\Reactions\PostAnonymousReaction;
use FoF\Reactions\PostReaction;
use Illuminate\Database\Eloquent\Builder;

class PostReactionSearcher extends AbstractSearcher
{
    public function __construct(
        FilterManager $filters,
        array $mutators,
        protected SettingsRepositoryInterface $settings
    ) {
        parent::__construct($filters, $mutators);
    }

    public function getQuery(User $actor): Builder
    {
        $query = PostReaction::query()
            ->whereNotNull('reaction_id')
            ->whereVisibleTo($actor);

        if ($this->settings->get('fof-reactions.anonymousReactions')) {
            // For anonymous reactions, manually apply the same visibility scoping as PostReaction
            $anonymousQuery = PostAnonymousReaction::query()
                ->whereNotNull('reaction_id')
                ->whereHas('post', function (Builder $query) use ($actor) {
                    $query->whereVisibleTo($actor)
                        ->whereHas('discussion', function (Builder $query) use ($actor) {
                            $query->whereVisibleTo($actor);

                            if (!$actor->hasPermission('discussion.canSeeReactions')) {
                                $query->whereRaw('0 = 1');
                            }
                        });
                });

            $query->unionAll($anonymousQuery->toBase());
        }

        return $query;
    }
}
