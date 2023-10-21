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

use Flarum\Database\AbstractModel;

/**
 * @property int    $id
 * @property string $identifier
 * @property string $display
 * @property string $type
 * @property bool   $enabled
 */
class Reaction extends AbstractModel
{
    protected $table = 'reactions';

    protected $casts = [
        'enabled' => 'bool',
    ];

    /**
     * Create a reaction.
     *
     * @param      $identifier
     * @param      $type
     * @param bool $enabled
     *
     * @return static
     */
    public static function build($identifier, $type, $enabled = true)
    {
        $reaction = new static();
        $reaction->identifier = $identifier;
        $reaction->type = $type;
        $reaction->enabled = $enabled;

        return $reaction;
    }
}
