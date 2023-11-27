<?php

/*
 * This file is part of fof/reactions.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Reactions\Content;

use Flarum\Frontend\Document;
use Flarum\Settings\SettingsRepositoryInterface;

class AddReactionCdn
{
    protected $settings;

    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    public function __invoke(Document $document)
    {
        $document->payload['fof-reactions.cdnUrl'] = $this->settings->get('fof-reactions.cdnUrl');
    }
}
