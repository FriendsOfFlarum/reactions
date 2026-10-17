<?php

/*
 * This file is part of fof/reactions.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Reactions\Provider;

use Flarum\Foundation\AbstractServiceProvider;
use FoF\Reactions\ReactionCountResolver;

class ResolverProvider extends AbstractServiceProvider
{
    public function register(): void
    {
        // Singleton so every field getter and prewarm hook in a request shares
        // one memo, turning the per-post reaction lookups during serialization
        // into a few batched queries cached by post id. The memo itself is kept
        // per API request inside the resolver, since a long-running process
        // serves many requests from this one instance.
        $this->container->singleton(ReactionCountResolver::class);
    }
}
