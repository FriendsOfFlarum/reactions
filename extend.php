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
use Flarum\Database\Eloquent\Collection;
use Flarum\Discussion\Discussion;
use Flarum\Extend;
use Flarum\Post\Event\Deleted;
use Flarum\Post\Post;
use Flarum\Realtime\Extend\Realtime as RealtimeExtend;
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
        ->js(__DIR__.'/js/dist/forum.js')
        ->jsDirectory(__DIR__.'/js/dist/forum'),

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
        })
        ->endpoint(Endpoint\Index::class, function (Endpoint\Index $endpoint) {
            return $endpoint->beforeSerialization(function (Context $context, array $results) {
                $loader = resolve(LoadReactionCounts::class);
                /** @var array<Post> $models */
                $models = $results['models'];
                $loader->forPosts(
                    Collection::make($models),
                    $context->getActor(),
                    $context->request
                );
            });
        })
        ->endpoint(Endpoint\Show::class, function (Endpoint\Show $endpoint) {
            return $endpoint->beforeSerialization(function (Context $context, object $model) {
                $loader = resolve(LoadReactionCounts::class);
                $loader->forPosts(
                    Collection::make([$model]),
                    $context->getActor(),
                    $context->request
                );
            });
        }),

    (new Extend\ApiResource(Resource\DiscussionResource::class))
        ->fields(fn (): array => [
            Schema\Boolean::make('canSeeReactions')
                ->get(fn (Discussion $discussion, Context $context) => $context->getActor()->can('canSeeReactions', $discussion)),
        ])
        ->endpoint(Endpoint\Index::class, function (Endpoint\Index $endpoint) {
            return $endpoint->beforeSerialization(function (Context $context, array $results) {
                $loader = resolve(LoadReactionCounts::class);
                /** @var Collection<int, Discussion> $discussions */
                $discussions = Collection::make($results['models']);
                $posts = $discussions
                    ->map(fn (Discussion $d) => $d->firstPost)
                    ->filter()
                    ->values();
                if ($posts->isNotEmpty()) {
                    $loader->forPosts($posts, $context->getActor(), $context->request);
                }
            });
        })
        ->endpoint(Endpoint\Show::class, function (Endpoint\Show $endpoint) {
            return $endpoint->beforeSerialization(function (Context $context, object $discussion) {
                $loader = resolve(LoadReactionCounts::class);
                /** @var Discussion $discussion */
                $posts = Collection::make(array_values(array_filter([$discussion->firstPost, $discussion->lastPost])));
                if ($posts->isNotEmpty()) {
                    $loader->forPosts($posts, $context->getActor(), $context->request);
                }
            });
        }),

    (new Extend\SearchDriver(DatabaseSearchDriver::class))
        ->addSearcher(PostReaction::class, PostReactionSearcher::class)
        ->addFilter(PostReactionSearcher::class, PostFilter::class),

    (new Extend\Settings())
        ->default('fof-reactions.react_own_post', false)
        ->default('fof-reactions.anonymousReactions', false)
        ->serializeToForum('fofReactionsAllowAnonymous', 'fof-reactions.anonymousReactions', 'boolVal')
        ->serializeToForum('fofReactionsCdnUrl', 'fof-reactions.cdnUrl', 'strval'),

    (new Extend\Conditional())
        ->whenExtensionEnabled('flarum-realtime', fn () => [
            (new RealtimeExtend())
                ->broadcastModelEvent(
                    [Event\PostWasReacted::class, Event\PostWasUnreacted::class],
                    fn ($event) => $event->post,
                    fn ($event) => $event->user,
                    'reactionMutation'
                ),
        ]),

    (new Extend\Policy())
        ->modelPolicy(Post::class, Access\ReactPostPolicy::class)
        ->modelPolicy(PostReaction::class, Access\PostReactionPolicy::class),
];
