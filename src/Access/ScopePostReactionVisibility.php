<?php

namespace FoF\Reactions\Access;

use Flarum\User\User;
use Illuminate\Database\Eloquent\Builder;

class ScopePostReactionVisibility
{
    public function __invoke(User $actor, Builder $query): void
    {
        $query->whereHas('post', function (Builder $query) use ($actor) {
            $query->whereVisibleTo($actor);
        });
    }
}
