<?php

namespace FoF\Reactions;

use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Settings\SettingsRepositoryInterface;

class ReactionsForumAttributes
{
    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;
    
    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    public function __invoke(ForumSerializer $serializer): array
    {
        $attributes['ReactionConverts'] = [
            $this->settings->get('fof-reactions.convertToUpvote'),
            $this->settings->get('fof-reactions.convertToDownvote'),
            $this->settings->get('fof-reactions.convertToLike'),
        ];

        return $attributes;
    }
}
