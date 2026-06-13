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
        // Singleton so the per-post reaction-count memo is shared for the
        // lifetime of a request (Flarum rebuilds the container per request),
        // turning the per-post reaction lookups during serialization into a few
        // batched queries cached by post id.
        $this->container->singleton(ReactionCountResolver::class);
    }
}
