<?php

namespace FoF\Reactions;

use Flarum\Database\AbstractModel;

class PostReaction extends AbstractModel
{
    /**
     * {@inheritdoc}
     */
    protected $table = 'post_reactions';
}
