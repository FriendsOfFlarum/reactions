<?php

/*
 * This file is part of fof/reactions.
 *
 * Copyright (c) 2019 FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Reactions\Listener;

use Flarum\Api\Controller;
use Flarum\Api\Event\Serializing;
use Flarum\Api\Event\WillGetData;
use Flarum\Api\Event\WillSerializeData;
use Flarum\Api\Serializer\BasicPostSerializer;
use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Api\Serializer\PostSerializer;
use Flarum\Event\GetApiRelationship;
use Flarum\Event\GetModelRelationship;
use Flarum\Post\Post;
use Flarum\Settings\SettingsRepositoryInterface;
use FoF\Reactions\Api\Serializer\PostReactionSerializer;
use FoF\Reactions\Api\Serializer\ReactionSerializer;
use FoF\Reactions\Reaction;
use Illuminate\Contracts\Events\Dispatcher;

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
        $events->listen(WillSerializeData::class, [$this, 'loadReactionsRelationship']);
        $events->listen(GetApiRelationship::class, [$this, 'getApiAttributes']);
        $events->listen(Serializing::class, [$this, 'prepareApiAttributes']);
        $events->listen(WillGetData::class, [$this, 'includeReactions']);
    }

    /**
     * @param GetModelRelationship $event
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany|null
     */
    public function getModelRelationship(GetModelRelationship $event)
    {
        if ($event->isRelationship(Post::class, 'reactions')) {
            return $event->model->belongsToMany(Reaction::class, 'post_reactions', 'post_id')->withPivot('reaction_id',
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
        if ($event->isRelationship(BasicPostSerializer::class, 'reactions')) {
            return $event->serializer->hasMany($event->model, PostReactionSerializer::class, 'reactions');
        }
        if ($event->isRelationship(ForumSerializer::class, 'reactions')) {
            return $event->serializer->hasMany($event->model, ReactionSerializer::class, 'reactions');
        }
    }

    /**
     * @param WillSerializeData $event
     */
    public function loadReactionsRelationship(WillSerializeData $event)
    {
        if ($event->isController(Controller\ShowForumController::class)) {
            $event->data['reactions'] = Reaction::get();
        }
    }

    /**
     * @param Serializing $event
     */
    public function prepareApiAttributes(Serializing $event)
    {
        if ($event->isSerializer(PostSerializer::class)) {
            $event->attributes['canReact'] = (bool) $event->actor->can('react', $event->model);
        }
        if ($event->isSerializer(ForumSerializer::class)) {
            $event->attributes['ReactionConverts'] = [
                $this->settings->get('fof-reactions.convertToUpvote'),
                $this->settings->get('fof-reactions.convertToDownvote'),
                $this->settings->get('fof-reactions.convertToLike'),
            ];
        }
    }

    /**
     * @param WillGetData $event
     */
    public function includeReactions(WillGetData $event)
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
