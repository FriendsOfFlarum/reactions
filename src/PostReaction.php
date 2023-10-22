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
use Flarum\Post\Post;
use Flarum\User\User;

/**
 * @property int            $id
 * @property int            $post_id
 * @property int            $reaction_id
 * @property string         $user_id
 * @property string         $ip_address
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property Post           $post
 * @property Reaction       $reaction
 * @property User           $user
 */
class PostReaction extends AbstractModel
{
    protected $table = 'post_reactions';

    public $timestamps = true;

    public $dates = ['created_at', 'updated_at'];

    public function reaction()
    {
        return $this->belongsTo(Reaction::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function post()
    {
        return $this->belongsTo(Post::class);
    }
}
