<?php

/*
 * This file is part of fof/reactions.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Reactions;

use Flarum\Api\Context;
use Flarum\Api\Endpoint;
use Flarum\Api\Resource;
use Flarum\Api\Schema;
use Flarum\Discussion\Discussion;
use Flarum\Extend;
use Flarum\Post\Event\Deleted;
use Flarum\Post\Post;
use Flarum\Search\Database\DatabaseSearchDriver;
use FoF\Reactions\Notification\PostReactedBlueprint;
use FoF\Reactions\Search\Filter\PostFilter;
use FoF\Reactions\Search\PostReactionSearcher;

return [
    (new Extend\Frontend('admin'))
        ->css(__DIR__.'/resources/less/admin.less')
        ->js(__DIR__.'/js/dist/admin.js'),

    (new Extend\Frontend('forum'))
        ->css(__DIR__.'/resources/less/forum.less')
        ->js(__DIR__.'/js/dist/forum.js'),

    new Extend\Locales(__DIR__.'/resources/locale'),

    (new Extend\ModelVisibility(PostReaction::class))
        ->scope(Access\ScopePostReactionVisibility::class),

    (new Extend\Event())
        ->listen(Event\PostWasReacted::class, Listener\SendNotificationWhenPostIsReacted::class)
        ->listen(Event\PostWasUnreacted::class, Listener\SendNotificationWhenPostIsUnreacted::class)
        ->listen(Deleted::class, function (Deleted $event) {
            PostReaction::where('post_id', $event->post->id)->delete();
            PostAnonymousReaction::where('post_id', $event->post->id)->delete();
        }),

    (new Extend\Notification())
        ->type(PostReactedBlueprint::class, ['alert']),

    new Extend\ApiResource(Api\Resource\PostReactionResource::class),

    new Extend\ApiResource(Api\Resource\ReactionResource::class),

    (new Extend\ApiResource(Resource\ForumResource::class))
        ->fields(ForumResourceFields::class)
        ->endpoint(Endpoint\Show::class, fn (Endpoint\Show $show) => $show->addDefaultInclude(['reactions'])),

    (new Extend\ApiResource(Resource\PostResource::class))
        ->fields(PostResourceFields::class)
        ->endpoints(PostResourceEndpoints::class)
        ->endpoint(Endpoint\Update::class, function (Endpoint\Update $endpoint) {
            return $endpoint->authenticated(false);
        }),

    (new Extend\ApiResource(Resource\DiscussionResource::class))
        ->fields(fn (): array => [
            Schema\Boolean::make('canSeeReactions')
                ->get(fn (Discussion $discussion, Context $context) => $context->getActor()->can('canSeeReactions', $discussion)),
        ]),

    (new Extend\SearchDriver(DatabaseSearchDriver::class))
        ->addSearcher(PostReaction::class, PostReactionSearcher::class)
        ->addFilter(PostReactionSearcher::class, PostFilter::class),

    (new Extend\Settings())
        ->default('fof-reactions.react_own_post', false)
        ->default('fof-reactions.anonymousReactions', false)
        ->default('fof-reactions.cdnUrl', 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/16.0.1/72x72/[codepoint].png')
        ->serializeToForum('fofReactionsAllowAnonymous', 'fof-reactions.anonymousReactions', 'boolVal')
        ->serializeToForum('fofReactionsCdnUrl', 'fof-reactions.cdnUrl', 'strval'),

    (new Extend\Policy())
        ->modelPolicy(Post::class, Access\ReactPostPolicy::class)
        ->modelPolicy(PostReaction::class, Access\PostReactionPolicy::class),
];
