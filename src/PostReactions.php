<?php


namespace FoF\Reactions;


use Flarum\Post\Post;
use Flarum\User\User;
use Illuminate\Database\Eloquent\Relations\Pivot;

class PostReactions extends Pivot
{
    protected $table = 'post_reactions';

    public function reaction() {
        return $this->belongsTo(Reaction::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function post() {
        return $this->belongsTo(Post::class);
    }
}
