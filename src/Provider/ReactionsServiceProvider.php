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
use FoF\Reactions\PostReactionsLoader;

class ReactionsServiceProvider extends AbstractServiceProvider
{
    public function register()
    {
        // Shared so every post serialized in a request reuses one batch load.
        $this->container->singleton(PostReactionsLoader::class);
    }
}
