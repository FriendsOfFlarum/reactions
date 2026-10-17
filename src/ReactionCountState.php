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

use Illuminate\Support\Collection;

/**
 * What ReactionCountResolver has loaded for one API request.
 *
 * @internal
 */
final class ReactionCountState
{
    /** @var array<int, array<int, int>> postId => [reactionId => count] */
    public array $counts = [];

    /** @var array<int, int|null> postId => actor's reaction id (or null) */
    public array $userReaction = [];

    /** @var Collection<int, Reaction>|null Reaction types, loaded once per request. */
    public ?Collection $reactionTypes = null;

    /** @var array<int, true> Posts whose counts a deferred field value is waiting for. */
    public array $pendingCounts = [];

    /** @var array<int, true> Posts whose user reaction a deferred field value is waiting for. */
    public array $pendingUserReactions = [];
}
