<?php

namespace FoF\Reactions\Api;

use Flarum\Discussion\Discussion;
use Flarum\Http\RequestUtil;
use Flarum\Post\Post;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Query\Expression;
use Psr\Http\Message\ServerRequestInterface;

class LoadReactionsRelationship
{
    public static $maxReactions = 4;

    public static function mutateRelation(HasMany $query, ServerRequestInterface $request): HasMany
    {
        $actor = RequestUtil::getActor($request);

        $grammar = $query->getQuery()->getGrammar();

        return $query
            // So that we can tell if the current user has reacted to the post.
            ->orderBy(new Expression($grammar->wrap('user_id').' = '.$actor->id), 'desc')
            // Limiting a relationship results is only possible because
            // the PostReaction model uses the \Staudenmeir\EloquentEagerLimit\HasEagerLimit
            // trait.
            ->limit(self::$maxReactions);
    }

    /**
     * Called using the @see ApiController::prepareDataForSerialization extender.
     */
    public static function countRelation($controller, $data): void
    {
        $loadable = null;

        if ($data instanceof Discussion) {
            // @phpstan-ignore-next-line
            $loadable = $data->newCollection($data->posts)->filter(function ($post) {
                return $post instanceof Post;
            });
        } elseif ($data instanceof Collection) {
            $loadable = $data;
        } elseif ($data instanceof Post) {
            $loadable = $data->newCollection([$data]);
        }

        if ($loadable) {
            $loadable->loadCount('reactions');
        }
    }
}
