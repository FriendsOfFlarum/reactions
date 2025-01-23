<?php

namespace FoF\Reactions\Search\Filter;

use Flarum\Post\Post;
use Flarum\Post\PostRepository;
use Flarum\Search\Database\DatabaseSearchState;
use Flarum\Search\Filter\FilterInterface;
use Flarum\Search\SearchState;
use Flarum\Search\ValidateFilterTrait;

/**
 * @implements FilterInterface<DatabaseSearchState>
 */
class PostFilter implements FilterInterface
{
    use ValidateFilterTrait;

    public function __construct(
        protected PostRepository $posts
    ) {
    }

    public function getFilterKey(): string
    {
        return 'post';
    }

    public function filter(SearchState $state, string|array $value, bool $negate): void
    {
        $value = $this->asInt($value);

        $post = $this->posts->findOrFail($value, $state->getActor());

        $state->getActor()->assertCan('canSeeReactions', $post->discussion);

        $state->getQuery()->where('post_id', $negate ? '!=' : '=', $value);
    }
}
