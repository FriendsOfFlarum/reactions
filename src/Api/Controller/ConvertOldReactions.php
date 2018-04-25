<?php

/**
 * This file is part of reflar/reactions.
 *
 * Copyright (c) ReFlar.
 *
 * http://reflar.io
 *
 * For the full copyright and license information, please view the license.md
 * file that was distributed with this source code.
 */

namespace Reflar\Reactions\Api\Controller;

use Flarum\Core\Access\AssertPermissionTrait;
use Flarum\Http\Controller\ControllerInterface;
use Flarum\Settings\SettingsRepositoryInterface;
use Psr\Http\Message\ServerRequestInterface;
use Reflar\Reactions\PostReaction;
use Reflar\Reactions\Reaction;
use Zend\Diactoros\Response\JsonResponse;

class ConvertOldReactions implements ControllerInterface
{
    use AssertPermissionTrait;

    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    /**
     * @param SettingsRepositoryInterface $settings
     */
    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    /**
     * @param ServerRequestInterface $request
     *
     * @return int
     */
    public function handle(ServerRequestInterface $request)
    {
        $actor = $request->getAttribute('actor');

        if (null !== $actor && $actor->isAdmin() && 'POST' === $request->getMethod() && false == $this->settings->get('reflar.reactions.convertedReactions')) {
            $reactions = PostReaction::get();

            $this->settings->set('reflar.reactions.convertedReactions', 'converting');

            $counter = 0;

            foreach ($reactions as $reaction) {
                if (is_numeric($reaction)) {
                    $counter = 0;
                    break;
                }
                $newReaction = Reaction::where('identifier', $reaction->reaction_id)->first();
                $reaction->reaction_id = $newReaction->id;

                $reaction->save();

                $counter++;
            }

            $this->settings->set('reflar.reactions.convertedReactions', $counter);

            return new JsonResponse($counter, 200);
        }
    }
}
