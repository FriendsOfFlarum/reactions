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

class PostReaction extends AbstractModel
{
    /**
     * {@inheritdoc}
     */
    protected $table = 'post_reactions';
    public $timestamps = true;
    public $dates = ['created_at', 'updated_at'];
}
