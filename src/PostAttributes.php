<?php

namespace FoF\Reactions;

use Flarum\Api\Serializer\PostSerializer;
use Flarum\Post\Post;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\User;
use Psr\Http\Message\ServerRequestInterface;

class PostAttributes
{
    /** @var SettingsRepositoryInterface $settings */
    protected $settings;

    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    public function __invoke(PostSerializer $serializer, Post $post, array $attributes): array
    {
        $actor = $serializer->getActor();

        $attributes['canReact'] = (bool) $actor->can('react', $post);

        // Get reaction counts for the post.
        $reactionCounts = $this->getReactionCountsForPost($post);

        // Get user's reaction to the post.
        $userReaction = $this->getActorReactionForPost($actor, $post, $serializer->getRequest());

        // Add custom attributes.
        $attributes['reactionCounts'] = $reactionCounts;
        $attributes['userReactionIdentifier'] = $userReaction;

        return $attributes;
    }

    protected function getReactionCountsForPost(Post $post): array
    {
        // Initialize counts array
        $counts = [];

        // Query for reactions from registered users
        $registeredReactions = PostReaction::where('post_id', $post->id)
            ->groupBy('reaction_id')
            ->selectRaw('reaction_id, COUNT(*) as count')
            ->pluck('count', 'reaction_id');

        // Query for anonymous reactions if allowed
        $anonymousReactions = collect([]);
        if ($this->settings->get('fof-reactions.allow-anonymous')) {
            $anonymousReactions = PostAnonymousReaction::where('post_id', $post->id)
                ->groupBy('reaction_id')
                ->selectRaw('reaction_id, COUNT(*) as count')
                ->pluck('count', 'reaction_id');
        }

        // Merge the registered and anonymous reactions
        $reactions = Reaction::all();
        foreach ($reactions as $reaction) {
            $counts[$reaction->id] = $registeredReactions->get($reaction->id, 0) + $anonymousReactions->get($reaction->id, 0);
        }

        return $counts;
    }

    protected function getActorReactionForPost(User $actor, Post $post, ServerRequestInterface $request): ?int
    {
        if ($actor->isGuest()) {
            return PostAnonymousReaction::where('post_id', $post->id)
                ->where('guest_id', $request->getAttribute('session')->getId())
                ->value('reaction_id');
        }

        return PostReaction::where('post_id', $post->id)
            ->where('user_id', $actor->id)
            ->value('reaction_id');
    }
}
