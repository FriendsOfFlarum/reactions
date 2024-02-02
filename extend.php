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

use Flarum\Api\Controller as ApiController;
use Flarum\Api\Serializer;
use Flarum\Api\Serializer\BasicPostSerializer;
use Flarum\Database\AbstractModel;
use Flarum\Extend;
use Flarum\Post\Event\Saving;
use Flarum\Post\Post;
use FoF\Reactions\Api\Controller;
use FoF\Reactions\Api\Serializer\ReactionSerializer;
use FoF\Reactions\Notification\PostReactedBlueprint;

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

    (new Extend\Routes('api'))
        ->get('/posts/{id}/reactions', 'post.reactions.index', Controller\ListPostReactionsController::class)
        ->delete('/posts/{id}/reactions/specific/{postReactionId}', 'post.reactions.specific.delete', Controller\DeletePostReactionController::class)
        ->delete('/posts/{id}/reactions/type/{reactionId}', 'post.reactions.type.delete', Controller\DeletePostReactionController::class)
        ->get('/reactions', 'reactions.index', Controller\ListReactionsController::class)
        ->post('/reactions', 'reactions.create', Controller\CreateReactionController::class)
        ->patch('/reactions/{id}', 'reactions.update', Controller\UpdateReactionController::class)
        ->delete('/reactions/{id}', 'reactions.delete', Controller\DeleteReactionController::class),

    (new Extend\Event())
        ->listen(Saving::class, Listener\SaveReactionsToDatabase::class)
        ->subscribe(Listener\SendNotifications::class),

    (new Extend\Notification())
        ->type(PostReactedBlueprint::class, BasicPostSerializer::class, ['alert']),

    (new Extend\ApiSerializer(Serializer\ForumSerializer::class))
        ->hasMany('reactions', ReactionSerializer::class)
        ->attributes(ReactionsForumAttributes::class),

    (new Extend\ApiSerializer(Serializer\PostSerializer::class))
        ->attributes(PostAttributes::class),

    (new Extend\ApiSerializer(Serializer\DiscussionSerializer::class))
        ->attributes(function (Serializer\DiscussionSerializer $serializer, AbstractModel $discussion, array $attributes): array {
            $attributes['canSeeReactions'] = (bool) $serializer->getActor()->can('canSeeReactions', $discussion);

            return $attributes;
        }),

    (new Extend\ApiController(ApiController\ShowForumController::class))
        ->prepareDataForSerialization(function (ApiController\ShowForumController $controller, &$data) {
            $data['reactions'] = Reaction::get();
        }),

    (new Extend\ApiController(ApiController\ShowForumController::class))
        ->addInclude('reactions'),

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
