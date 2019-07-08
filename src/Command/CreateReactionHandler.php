<?php

/*
 * This file is part of fof/reactions.
 *
 * Copyright (c) 2019 FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Reactions\Command;

use Flarum\User\AssertPermissionTrait;
use Flarum\User\Exception\PermissionDeniedException;
use FoF\Reactions\Reaction;
use FoF\Reactions\Validator\ReactionValidator;

class CreateReactionHandler
{
    use AssertPermissionTrait;

    /**
     * @var ReactionValidator
     */
    protected $validator;

    /**
     * @param ReactionValidator $validator
     */
    public function __construct(ReactionValidator $validator)
    {
        $this->validator = $validator;
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

        $this->assertAdmin($actor);

        $reaction = Reaction::build(
            array_get($data, 'identifier'),
            array_get($data, 'type')
        );

        $this->validator->assertValid($reaction->getAttributes());

        $reaction->save();

        return $reaction;
    }
}
