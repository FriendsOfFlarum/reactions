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

/**
 * @property int            $id
 * @property int            $post_id
 * @property int            $guest_id
 * @property ?int           $reaction_id
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property Post           $post
 * @property Reaction       $reaction
 */
class PostAnonymousReaction extends AbstractModel
{
    protected $table = 'post_anonymous_reactions';

    public $timestamps = true;

    public $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $fillable = ['post_id', 'guest_id', 'reaction_id'];

    public function reaction()
    {
        return $this->belongsTo(Reaction::class);
    }

    public function post()
    {
        return $this->belongsTo(Post::class);
    }
}
