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
use Flarum\Discussion\Discussion;
use Flarum\Extend;
use Flarum\Post\Post;
use Flarum\Search\Database\DatabaseSearchDriver;
use FoF\Reactions\Notification\PostReactedBlueprint;
use Flarum\Api\Resource;
use Flarum\Api\Endpoint;
use Flarum\Api\Schema;
use FoF\Reactions\Search\Filter\PostFilter;
use FoF\Reactions\Search\PostReactionSearcher;

return [
    (new Extend\Frontend('admin'))
        ->css(__DIR__.'/resources/less/admin.less')
        ->js(__DIR__.'/js/dist/admin.js')
        ->content(Content\AddReactionCdn::class),

    (new Extend\Frontend('forum'))
        ->css(__DIR__.'/resources/less/forum.less')
        ->js(__DIR__.'/js/dist/forum.js')
        ->content(Content\AddReactionCdn::class),

    new Extend\Locales(__DIR__.'/resources/locale'),

    (new Extend\ModelVisibility(PostReaction::class))
        ->scope(Access\ScopePostReactionVisibility::class),

    (new Extend\Event())
        ->subscribe(Listener\SendNotifications::class),

    (new Extend\Notification())
        ->type(PostReactedBlueprint::class, ['alert']),

    new Extend\ApiResource(Api\Resource\PostReactionResource::class),

    new Extend\ApiResource(Api\Resource\ReactionResource::class),

    (new Extend\ApiResource(Resource\ForumResource::class))
        ->fields(ForumResourceFields::class)
        ->endpoint(Endpoint\Show::class, fn (Endpoint\Show $show) => $show->addDefaultInclude(['reactions'])),

    (new Extend\ApiResource(Resource\PostResource::class))
        ->fields(PostResourceFields::class),

    (new Extend\ApiResource(Resource\DiscussionResource::class))
        ->fields(fn (): array => [
            Schema\Boolean::make('canSeeReactions')
                ->get(fn (Discussion $discussion, Context $context) => $context->getActor()->can('canSeeReactions', $discussion))
        ]),

    (new Extend\SearchDriver(DatabaseSearchDriver::class))
        ->addSearcher(PostReaction::class, PostReactionSearcher::class)
        ->addFilter(PostReactionSearcher::class, PostFilter::class),

    (new Extend\Settings())
        ->default('fof-reactions.react_own_post', false)
        ->default('fof-reactions.anonymousReactions', false)
        ->default('fof-reactions.cdnUrl', 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/[codepoint].png')
        ->serializeToForum('fofReactionsAllowAnonymous', 'fof-reactions.anonymousReactions', 'boolVal')
        ->serializeToForum('fofReactionsCdnUrl', 'fof-reactions.cdnUrl', 'strval'),

    (new Extend\Policy())
        ->modelPolicy(Post::class, Access\ReactPostPolicy::class),

    (new Extend\Middleware('api'))
        ->add(Middleware\BindRequestToContainer::class),
];
