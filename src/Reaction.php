<?php

/*
 * This file is part of fof/reactions.
 *
 * Copyright (c) 2019 FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Reactions;

use Flarum\Database\AbstractModel;

class Reaction extends AbstractModel
{
    /**
     * {@inheritdoc}
     */
    protected $table = 'reactions';

    /**
     * Create a reaction.
     *
     * @param int    $post_id
     * @param int    $user_id
     * @param string $reaction
     *
     * @return static
     */
    public static function build($identifier, $type)
    {
        $reaction = new static();
        $reaction->identifier = $identifier;
        $reaction->type = $type;

        return $reaction;
    }
}
