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
use Flarum\Post\Post;
use Flarum\User\User;
use Staudenmeir\EloquentHasManyDeep\HasRelationships;

/**
 * @property string identifier
 * @property string display
 * @property string type
 * @property bool enabled
 */
class Reaction extends AbstractModel
{
    use HasRelationships;

    /**
     * {@inheritdoc}
     */
    protected $table = 'reactions';

    /**
     * Create a reaction.
     *
     * @param $identifier
     * @param $type
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

    public function user() {
        return $this->hasOneDeep(User::class, [PostReactions::class])
            ->latest();
    }

    public function post() {
        return $this->hasOneDeep(Post::class, [PostReactions::class])
            ->latest();
    }
}
