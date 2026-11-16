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

use Flarum\Discussion\Discussion;
use Flarum\User\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Query\Builder as QueryBuilder;

class ScopePostReactionVisibility
{
    public function __invoke(User $actor, Builder $query): void
    {
        $query->whereHas('post', function (Builder $query) use ($actor) {
            $query->whereVisibleTo($actor);

            // Without the global permission, extensions such as Tags may grant it per discussion. Holders of the
            // global permission skip this, as in core and Approval: on Flarum 2.0, Tags' ability scoping drops
            // untagged and unrestricted discussions for them. Known gap until Tags is fixed: they also see
            // reactions in restricted tags that do not grant the permission (filter[post] still refuses those).
            if (!$actor->hasPermission('discussion.canSeeReactions')) {
                $query->whereIn('posts.discussion_id', function (QueryBuilder $query) use ($actor) {
                    $query->select('discussions.id')
                        ->from('discussions')
                        // The 1=0 seed keeps this empty when nothing grants the ability per discussion.
                        ->where(function (QueryBuilder $query) use ($actor) {
                            $query->whereRaw('1=0')
                                ->orWhere(function (QueryBuilder $query) use ($actor) {
                                    Discussion::query()->setQuery($query)->whereVisibleTo($actor, 'canSeeReactions');
                                });
                        });
                });
            }
        });
    }
}
