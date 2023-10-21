<?php

/*
 * This file is part of fof/reactions.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Reactions\tests\integration\api;

use Flarum\Testing\integration\TestCase;

class ForumTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-reactions');
    }

    /**
     * @test
     */
    public function forum_relations_are_included()
    {
        $response = $this->send(
            $this->request('GET', '/api')
        );

        $this->assertEquals(200, $response->getStatusCode());

        $body = (string) $response->getBody();
        $json = json_decode($body, true);

        $this->assertArrayHasKey('data', $json);
        $this->assertArrayHasKey('relationships', $json['data']);
        $this->assertArrayHasKey('reactions', $json['data']['relationships']);
        $this->assertArrayHasKey('data', $json['data']['relationships']['reactions']);
        $this->assertIsArray($json['data']['relationships']['reactions']['data']);

        // there should be 6 reactions defined in the database by default
        $this->assertCount(6, $json['data']['relationships']['reactions']['data']);
    }
}
