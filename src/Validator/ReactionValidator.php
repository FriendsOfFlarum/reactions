<?php

/**
 *  This file is part of fof/reactions.
 *
 *  Copyright (c) FriendsOfFlarum.
 *
 *  For the full copyright and license information, please view the license.md
 *  file that was distributed with this source code.
 */

namespace FoF\Reactions\Validator;

use Flarum\Foundation\AbstractValidator;

class ReactionValidator extends AbstractValidator
{
    protected $rules = [
        'identifier' => [
            'required',
            'string',
            'unique:reactions',
        ],
        'type' => [
            'required',
            'string',
            'regex:/icon|emoji/i',
        ],
    ];
}
