<?php

/*
 * This file is part of fof/reactions.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Reactions\Api\Controller;

use Flarum\Api\Controller\AbstractListController;
use Flarum\Http\RequestUtil;
use Flarum\Post\PostRepository;
use Flarum\Settings\SettingsRepositoryInterface;
use FoF\Reactions\Api\Serializer\PostReactionSerializer;
use FoF\Reactions\PostAnonymousReaction;
use FoF\Reactions\PostReaction;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class ListPostReactionsController extends AbstractListController
{
    public $serializer = PostReactionSerializer::class;

    public $include = ['reaction', 'user'];

    public $optionalInclude = ['post'];

    /**
     * @var PostRepository
     */
    protected $posts;

    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    public function __construct(PostRepository $posts, SettingsRepositoryInterface $settings)
    {
        $this->posts = $posts;
        $this->settings = $settings;
    }

    /**
     * @param ServerRequestInterface $request
     * @param Document               $document
     *
     * @return mixed
     */
    protected function data(ServerRequestInterface $request, Document $document)
    {
        $actor = RequestUtil::getActor($request);

        $postId = Arr::get($request->getQueryParams(), 'id');
        $post = $this->posts->findOrFail($postId, $actor);

        $actor->assertCan('canSeeReactions', $post->discussion);

        $query = PostReaction::query()
            ->where('post_id', $post->id)
            ->whereNotNull('reaction_id');

        if ($this->settings->get('fof-reactions.anonymousReactions')) {
            $query->unionAll(
                PostAnonymousReaction::query()->where('post_id', $post->id)
                    ->whereNotNull('reaction_id')->toBase()
            );
        }

        return $query->get();
    }
}
