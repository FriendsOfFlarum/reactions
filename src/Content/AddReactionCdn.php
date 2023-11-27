<?php

namespace FoF\Reactions\Content;

use Flarum\Frontend\Document;
use Flarum\Settings\SettingsRepositoryInterface;

class AddReactionCdn
{
    protected $settings;
    
    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }
    
    public function __invoke(Document $document)
    {
        $document->payload['fof-reactions.cdnUrl'] = $this->settings->get('fof-reactions.cdnUrl');
    }
}
