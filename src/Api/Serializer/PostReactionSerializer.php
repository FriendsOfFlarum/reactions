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

class PostReactionSerializer extends AbstractSerializer
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
            'user_id'    => (int) $reaction->pivot->user_id,
            'post_id'    => (int) $reaction->pivot->post_id,
        ];
    }

    /**
     * @param $reaction
     *
     * @return string
     */
    public function getId($reaction)
    {
        return $reaction->id.'-'.$reaction->pivot->user_id.'.'.$reaction->pivot->post_id;
    }
}
