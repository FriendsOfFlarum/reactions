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

        // Name the columns: a UNION matches them by position, and anonymous rows
        // need to be told apart from registered ones.
        $query = PostReaction::query()
            ->select(['id', 'post_id', 'user_id', 'reaction_id'])
            ->selectRaw('0 as anonymous')
            ->where('post_id', $post->id)
            ->whereNotNull('reaction_id');

        if ($this->settings->get('fof-reactions.anonymousReactions')) {
            $query->unionAll(
                PostAnonymousReaction::query()
                    ->select(['id', 'post_id', 'guest_id as user_id', 'reaction_id'])
                    ->selectRaw('1 as anonymous')
                    ->where('post_id', $post->id)
                    ->whereNotNull('reaction_id')
                    ->toBase()
            );
        }

        $reactions = $query->get();

        $reactions->load('reaction');

        // Only registered rows have a user. Loading one for a guest id would also
        // match a real user, as MySQL compares '2f9c…' with an integer id as 2.
        $registered = $reactions->filter(function (PostReaction $reaction) {
            return !$reaction->anonymous;
        });
        $registered->load('user');

        foreach ($reactions as $reaction) {
            if ($reaction->anonymous) {
                $reaction->setRelation('user', null);
            }
        }

        return $reactions;
    }
}
