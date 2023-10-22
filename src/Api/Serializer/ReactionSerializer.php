<?php

/*
 * This file is part of fof/reactions.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Reactions\Api\Serializer;

use Flarum\Api\Serializer\AbstractSerializer;
use FoF\Reactions\Reaction;

class ReactionSerializer extends AbstractSerializer
{
    protected $type = 'reactions';

    /**
     * @param Reaction $reaction
     *
     * @return array
     */
    protected function getDefaultAttributes($reaction)
    {
        return [
            'identifier' => $reaction->identifier,
            'display'    => $reaction->display,
            'type'       => $reaction->type,
            'enabled'    => $reaction->enabled,
        ];
    }
}
