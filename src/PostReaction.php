<?php

namespace Reflar\Reactions;

use Flarum\Database\AbstractModel;

class PostReaction extends AbstractModel
{
    /**
     * {@inheritdoc}
     */
    protected $table = 'posts_reactions';
}
