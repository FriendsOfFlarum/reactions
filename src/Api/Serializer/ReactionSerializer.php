<?php

/*
 * This file is part of fof/reactions.
 *
 * Copyright (c) 2019 FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Reactions\Api\Serializer;

use Flarum\Api\Serializer\AbstractSerializer;

class ReactionSerializer extends AbstractSerializer
{
    /**
     * {@inheritdoc}
     */
    protected $type = 'reactions';

    /**
     * {@inheritdoc}
     */
    protected function getDefaultAttributes($reaction)
    {
        return [
            'identifier' => $reaction->identifier,
            'type'       => $reaction->type,
        ];
    }
}
