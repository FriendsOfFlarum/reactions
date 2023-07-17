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
use Flarum\Api\Serializer\BasicPostSerializer;
use Flarum\Api\Serializer\BasicUserSerializer;
use Illuminate\Support\Str;

class PostReactionSerializer extends AbstractSerializer
{
    /**
     * {@inheritdoc}
     */
    protected $type = 'post_reactions';

    /**
     * {@inheritdoc}
     */
    protected function getDefaultAttributes($postReaction)
    {
        if (Str::length($postReaction->user_id) === 40) {
            $userId = null;
        } else {
            $userId = $postReaction->user_id;
        }
        
        return [
            'userId'     => $userId,
            'postId'     => $postReaction->post_id,
            'reactionId' => $postReaction->reaction_id,
        ];
    }

    public function reaction($postReaction)
    {
        return $this->hasOne($postReaction, ReactionSerializer::class);
    }

    public function user($postReaction)
    {
        return $this->hasOne($postReaction, BasicUserSerializer::class);
    }

    public function post($postReaction)
    {
        return $this->hasOne($postReaction, BasicPostSerializer::class);
    }
}
