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
use Flarum\Realtime\Extend\Realtime as RealtimeExtend;
use Flarum\Search\Database\DatabaseSearchDriver;
use FoF\Reactions\Notification\PostReactedBlueprint;
use FoF\Reactions\Search\Filter\PostFilter;
use FoF\Reactions\Search\PostReactionSearcher;

return [
    (new Extend\ServiceProvider())
        ->register(Provider\ResolverProvider::class),

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
        // Prewarm the reaction-count cache for the whole page of posts in one
        // batch, so the per-post field getters hit the memo instead of querying
        // individually. Keyed by post id (not model instance) so it is robust
        // against the instance churn of JSON:API include resolution.
        ->endpoint(Endpoint\Index::class, function (Endpoint\Index $endpoint) {
            return $endpoint->beforeSerialization(function (Context $context, array $results) {
                $ids = [];
                foreach ($results['models'] as $post) {
                    $ids[] = $post->id;
                }
                resolve(ReactionCountResolver::class)->load($ids, $context->getActor(), $context->request);
            });
        }),

    (new Extend\ApiResource(Resource\DiscussionResource::class))
        ->fields(fn (): array => [
            Schema\Boolean::make('canSeeReactions')
                ->get(fn (Discussion $discussion, Context $context) => $context->getActor()->can('canSeeReactions', $discussion)),
        ])
        // The list serializes reactions for each discussion's firstPost and
        // lastPost. Prewarm both in one batch using the id columns on the
        // discussion rows — no post relation load, no instance dependency.
        ->endpoint([Endpoint\Index::class, Endpoint\Show::class], function ($endpoint) {
            return $endpoint->beforeSerialization(function (Context $context, $results) {
                /** @var Discussion[] $discussions */
                $discussions = is_array($results) ? $results['models'] : [$results];

                $ids = [];
                foreach ($discussions as $discussion) {
                    $ids[] = $discussion->first_post_id;
                    $ids[] = $discussion->last_post_id;
                }

                $ids = array_values(array_unique(array_filter($ids)));
                resolve(ReactionCountResolver::class)->load($ids, $context->getActor(), $context->request);
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
