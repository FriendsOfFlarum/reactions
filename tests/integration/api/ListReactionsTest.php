<?php

/*
 * This file is part of fof/reactions.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Reactions\Tests\Integration\Api;

use Flarum\Testing\integration\TestCase;
use FoF\Reactions\Reaction;

class ListReactionsTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-reactions');
    }

    /**
     * @test
     */
    public function it_returns_all_reactions()
    {
        $response = $this->send(
            $this->request('GET', '/api/reactions')
        );

        $this->assertEquals(200, $response->getStatusCode());

        $body = json_decode($response->getBody());

        $this->assertEquals(6, count($body->data));

        $reaction = Reaction::find(1);

        $this->assertEquals($reaction->id, $body->data[0]->id);
        $this->assertEquals($reaction->identifier, $body->data[0]->attributes->identifier);
        $this->assertEquals($reaction->display, $body->data[0]->attributes->display);
        $this->assertEquals($reaction->type, $body->data[0]->attributes->type);
        $this->assertEquals($reaction->enabled, $body->data[0]->attributes->enabled);
    }
}
