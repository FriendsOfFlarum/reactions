<?php

/*
 * This file is part of fof/reactions.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Reactions\Command;

use Flarum\User\Exception\PermissionDeniedException;
use FoF\Reactions\Event\Created;
use FoF\Reactions\Event\Creating;
use FoF\Reactions\Reaction;
use FoF\Reactions\Validator\ReactionValidator;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\Arr;

class CreateReactionHandler
{
    /**
     * @var ReactionValidator
     */
    protected $validator;

    /**
     * @var Dispatcher
     */
    protected $events;

    /**
     * @param ReactionValidator $validator
     * @param Dispatcher        $events
     */
    public function __construct(ReactionValidator $validator, Dispatcher $events)
    {
        $this->validator = $validator;
        $this->events = $events;
    }

    /**
     * @param CreateReaction $command
     *
     * @throws PermissionDeniedException
     *
     * @return Reaction
     */
    public function handle(CreateReaction $command)
    {
        $actor = $command->actor;
        $data = $command->data;

        $actor->assertAdmin();

        $reaction = Reaction::build(
            Arr::get($data, 'identifier'),
            Arr::get($data, 'type')
        );

        $this->events->dispatch(new Creating($reaction, $actor, $data));

        $this->validator->assertValid($reaction->getAttributes());

        $reaction->save();

        $this->events->dispatch(new Created($reaction, $actor));

        return $reaction;
    }
}
