<?php

/**
 *  This file is part of reflar/reactions.
 *
 *  Copyright (c) ReFlar.
 *
 *  http://reflar.io
 *
 *  For the full copyright and license information, please view the license.md
 *  file that was distributed with this source code.
 */

namespace Reflar\Reactions\Listener;

use Flarum\Api\Controller;
use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Api\Serializer\PostBasicSerializer;
use Flarum\Api\Serializer\PostSerializer;
use Flarum\Core\Post;
use Flarum\Event\ConfigureApiController;
use Flarum\Event\GetApiRelationship;
use Flarum\Event\GetModelRelationship;
use Flarum\Event\PrepareApiAttributes;
use Flarum\Event\PrepareApiData;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Events\Dispatcher;
use Reflar\Reactions\Api\Serializer\PostReactionSerializer;
use Reflar\Reactions\Api\Serializer\ReactionSerializer;
use Reflar\Reactions\Reaction;

class AddPostReactionsRelationship
{
    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(GetModelRelationship::class, [$this, 'getModelRelationship']);
        $events->listen(PrepareApiData::class, [$this, 'loadReactionsRelationship']);
        $events->listen(GetApiRelationship::class, [$this, 'getApiAttributes']);
        $events->listen(PrepareApiAttributes::class, [$this, 'prepareApiAttributes']);
        $events->listen(ConfigureApiController::class, [$this, 'includeReactions']);
    }

    /**
     * @param GetModelRelationship $event
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany|null
     */
    public function getModelRelationship(GetModelRelationship $event)
    {
        if ($event->isRelationship(Post::class, 'reactions')) {
            return $event->model->belongsToMany(Reaction::class, 'posts_reactions', 'post_id')->withPivot('reaction_id',
                'user_id');
        }
    }

    /**
     * @param GetApiRelationship $event
     *
     * @return \Tobscure\JsonApi\Relationship|null
     */
    public function getApiAttributes(GetApiRelationship $event)
    {
        if ($event->isRelationship(PostBasicSerializer::class, 'reactions')) {
            return $event->serializer->hasMany($event->model, PostReactionSerializer::class, 'reactions');
        }
        if ($event->isRelationship(ForumSerializer::class, 'reactions')) {
            return $event->serializer->hasMany($event->model, ReactionSerializer::class, 'reactions');
        }
    }

    /**
     * @param PrepareApiData $event
     */
    public function loadReactionsRelationship(PrepareApiData $event)
    {
        if ($event->isController(Controller\ShowForumController::class)) {
            $event->data['reactions'] = Reaction::get();
        }
    }

    /**
     * @param PrepareApiAttributes $event
     */
    public function prepareApiAttributes(PrepareApiAttributes $event)
    {
        if ($event->isSerializer(PostSerializer::class)) {
            $event->attributes['canReact'] = (bool) $event->actor->can('react', $event->model);
        }
        if ($event->isSerializer(ForumSerializer::class)) {
            $event->attributes['ReactionConverts'] = [
                $this->settings->get('reflar.reactions.convertToUpvote'),
                $this->settings->get('reflar.reactions.convertToDownvote'),
                $this->settings->get('reflar.reactions.convertToLike'),
            ];
        }
    }

    /**
     * @param ConfigureApiController $event
     */
    public function includeReactions(ConfigureApiController $event)
    {
        if ($event->isController(Controller\ShowDiscussionController::class)) {
            $event->addInclude('posts.reactions');
        }

        if ($event->isController(Controller\ListPostsController::class)
            || $event->isController(Controller\ShowPostController::class)
            || $event->isController(Controller\CreatePostController::class)
            || $event->isController(Controller\UpdatePostController::class)) {
            $event->addInclude('reactions');
        }

        if ($event->isController(Controller\ShowForumController::class)) {
            $event->addInclude('reactions');
        }
    }
}
