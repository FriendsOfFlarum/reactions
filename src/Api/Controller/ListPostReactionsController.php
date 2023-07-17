<?php

namespace FoF\Reactions\Api\Controller;

use Flarum\Api\Controller\AbstractListController;
use Flarum\Post\PostRepository;
use FoF\Reactions\Api\Serializer\PostReactionSerializer;
use FoF\Reactions\PostReaction;
use FoF\Reactions\PostAnonymousReaction;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Flarum\Settings\SettingsRepositoryInterface;

class ListPostReactionsController extends AbstractListController
{
    public $serializer = PostReactionSerializer::class;

    public $include = ['reaction'];

    public $optionalInclude = ['user', 'post'];

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
        $postId = Arr::get($request->getQueryParams(), 'id');
        $post = $this->posts->findOrFail($postId, $request->getAttribute('actor'));

        if ($this->settings->get('fof-reactions.allow-anonymous')) {
            // If anonymous reactions are allowed, we union reactions from registered users and anonymous users
            $query = PostReaction::where('post_id', $post->id)
                ->whereNotNull('reaction_id')
                ->unionAll(
                    PostAnonymousReaction::where('post_id', $post->id)
                        ->whereNotNull('reaction_id')
                );
        } else {
            // If anonymous reactions are not allowed, we just get reactions from registered users.
            $query = PostReaction::where('post_id', $post->id)
                ->whereNotNull('reaction_id');
        }

        // Execute the query and return the result.
        return $query->get();
    }
}
