<?php

namespace FoF\Reactions\Search;

use Flarum\Search\Database\AbstractSearcher;
use Flarum\Search\Filter\FilterManager;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\User;
use FoF\Reactions\PostAnonymousReaction;
use FoF\Reactions\PostReaction;
use Illuminate\Database\Eloquent\Builder;

class PostReactionSearcher extends AbstractSearcher
{
    public function __construct(
        FilterManager $filters,
        array $mutators,
        protected SettingsRepositoryInterface $settings
    ) {
        parent::__construct($filters, $mutators);
    }

    public function getQuery(User $actor): Builder
    {
        $query = PostReaction::query()
            ->whereNotNull('reaction_id')
            ->whereVisibleTo($actor);

        if ($this->settings->get('fof-reactions.anonymousReactions')) {
            $query->unionAll(
                PostAnonymousReaction::query()
                    ->whereNotNull('reaction_id')
                    ->whereVisibleTo($actor)
                    ->toBase()
            );
        }

        return $query;
    }
}
