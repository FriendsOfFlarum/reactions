<?php

namespace FoF\Reactions\Api\Resource;

use Flarum\Api\Context;
use Flarum\Api\Endpoint;
use Flarum\Api\Resource;
use Flarum\Api\Schema;
use Flarum\Api\Sort\SortColumn;
use FoF\Reactions\Event\Created;
use FoF\Reactions\Event\Creating;
use FoF\Reactions\Event\Deleted;
use FoF\Reactions\Event\Deleting;
use FoF\Reactions\Reaction;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Arr;
use Tobyz\JsonApiServer\Context as OriginalContext;

/**
 * @extends Resource\AbstractDatabaseResource<Reaction>
 */
class ReactionResource extends Resource\AbstractDatabaseResource
{
    public function type(): string
    {
        return 'reactions';
    }

    public function model(): string
    {
        return Reaction::class;
    }

    public function scope(Builder $query, OriginalContext $context): void
    {
        $query->whereVisibleTo($context->getActor());
    }

    public function endpoints(): array
    {
        return [
            Endpoint\Create::make()
                ->admin(),
            Endpoint\Update::make()
                ->admin(),
            Endpoint\Delete::make()
                ->admin(),
            Endpoint\Index::make(),
        ];
    }

    public function fields(): array
    {
        return [

            Schema\Str::make('identifier')
                ->requiredOnCreate()
                ->maxLength(255)
                ->unique('reactions', 'identifier')
                ->writable(),
            Schema\Str::make('display')
                ->maxLength(255)
                ->nullable()
                ->writableOnUpdate(),
            Schema\Str::make('type')
                ->requiredOnCreate()
                ->maxLength(255)
                ->regex('/icon|emoji/i')
                ->writable(),
            Schema\Boolean::make('enabled')
                ->nullable()
                ->writable(),

        ];
    }

    public function sorts(): array
    {
        return [
            // SortColumn::make('createdAt'),
        ];
    }

    /**
     * @inheritDoc
     */
    public function creating(object $model, OriginalContext $context): ?object
    {
        $this->events->dispatch(new Creating($model, $context->getActor(), Arr::get($context->body(), 'data.attributes', $context->body())));

        return parent::creating($model, $context);
    }

    /**
     * @inheritDoc
     */
    public function created(object $model, OriginalContext $context): ?object
    {
        $this->events->dispatch(new Created($model, $context->getActor()));

        return parent::created($model, $context);
    }

    /**
     * @inheritDoc
     */
    public function deleting(object $model, OriginalContext $context): void
    {
        $this->events->dispatch(new Deleting($model, $context->getActor()));

        parent::deleting($model, $context);
    }

    /**
     * @inheritDoc
     */
    public function deleted(object $model, OriginalContext $context): void
    {
        $this->events->dispatch(new Deleted($model, $context->getActor()));

        parent::deleted($model, $context);
    }
}
