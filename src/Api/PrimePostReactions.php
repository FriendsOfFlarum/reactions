<?php

/*
 * This file is part of fof/reactions.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Reactions\Api;

use Flarum\Api\Controller\AbstractSerializeController;
use Flarum\Database\AbstractModel;
use Flarum\Http\RequestUtil;
use Flarum\Post\Post;
use FoF\Reactions\PostReactionsLoader;
use Psr\Http\Message\ServerRequestInterface;

/**
 * Before any API response is serialized, loads reactions for every post in it
 * (listed posts and posts in loaded relationships, such as a discussion's posts or
 * mentioned posts) in one batch, instead of one set of queries per post.
 */
class PrimePostReactions
{
    /** Relationship levels to follow; deep enough for e.g. discussion.posts.mentionedBy. */
    private const MAX_DEPTH = 4;

    /** @var PostReactionsLoader */
    protected $reactions;

    public function __construct(PostReactionsLoader $reactions)
    {
        $this->reactions = $reactions;
    }

    /**
     * @param mixed $data
     */
    public function __invoke(AbstractSerializeController $controller, $data, ServerRequestInterface $request): void
    {
        $posts = [];
        $seen = [];
        $this->collect($data, $posts, $seen, 0);

        if ($posts) {
            $this->reactions->prime($posts, RequestUtil::getActor($request), $request);
        }
    }

    /**
     * @param mixed           $value
     * @param Post[]          $posts
     * @param array<int,true> $seen
     */
    private function collect($value, array &$posts, array &$seen, int $depth): void
    {
        if ($depth > self::MAX_DEPTH) {
            return;
        }

        if ($value instanceof AbstractModel) {
            if (isset($seen[spl_object_id($value)])) {
                return;
            }

            $seen[spl_object_id($value)] = true;

            if ($value instanceof Post) {
                $posts[] = $value;
            }

            foreach ($value->getRelations() as $related) {
                $this->collect($related, $posts, $seen, $depth + 1);
            }
        } elseif (is_iterable($value)) {
            foreach ($value as $item) {
                $this->collect($item, $posts, $seen, $depth);
            }
        }
    }
}
