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

use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\Testing\integration\TestCase;
use FoF\Reactions\Reaction;

class CreateReactionTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-reactions');

        $this->prepareDatabase([
            'users' => [
                $this->normalUser(),
            ],
        ]);
    }

    /**
     * @test
     */
    public function admin_can_create_reaction()
    {
        $response = $this->send(
            $this->request('POST', '/api/reactions', [
                'authenticatedAs' => 1,
                'json'            => [
                    'data' => [
                        'attributes' => [
                            'identifier' => 'like',
                            'type'       => 'emoji',
                            'enabled'    => true,
                            'display'    => 'Like',
                        ],
                    ],
                ],
            ])
        );

        $this->assertEquals(201, $response->getStatusCode());

        $json = json_decode($response->getBody(), true);

        $this->assertArrayHasKey('data', $json);
        $this->assertArrayHasKey('attributes', $json['data']);
        $this->assertArrayHasKey('identifier', $json['data']['attributes']);
        $this->assertEquals('like', $json['data']['attributes']['identifier']);
        $this->assertEquals('emoji', $json['data']['attributes']['type']);

        $reactionId = $json['data']['id'];

        $this->assertNotNull($reactionId);

        $reaction = Reaction::find($reactionId);

        $this->assertNotNull($reaction);

        $this->assertEquals('like', $reaction->identifier);
        $this->assertEquals('emoji', $reaction->type);
    }

    /**
     * @test
     */
    public function normal_user_cannot_create_reaction()
    {
        $response = $this->send(
            $this->request('POST', '/api/reactions', [
                'authenticatedAs' => 2,
                'json'            => [
                    'data' => [
                        'attributes' => [
                            'identifier' => 'like',
                            'type'       => 'emoji',
                            'enabled'    => true,
                            'display'    => 'Like',
                        ],
                    ],
                ],
            ])
        );

        $this->assertEquals(403, $response->getStatusCode());
    }

    /**
     * @test
     */
    public function cannot_create_reaction_without_identifier()
    {
        $response = $this->send(
            $this->request('POST', '/api/reactions', [
                'authenticatedAs' => 1,
                'json'            => [
                    'data' => [
                        'attributes' => [
                            'type'    => 'emoji',
                            'enabled' => true,
                            'display' => 'Like',
                        ],
                    ],
                ],
            ])
        );

        $this->assertEquals(422, $response->getStatusCode());

        $json = json_decode($response->getBody(), true);

        $this->assertArrayHasKey('errors', $json);
        $this->assertEquals('/data/attributes/identifier', $json['errors'][0]['source']['pointer']);
    }

    /**
     * @test
     */
    public function cannot_create_reaction_without_type()
    {
        $response = $this->send(
            $this->request('POST', '/api/reactions', [
                'authenticatedAs' => 1,
                'json'            => [
                    'data' => [
                        'attributes' => [
                            'identifier' => 'like',
                            'enabled'    => true,
                            'display'    => 'Like',
                        ],
                    ],
                ],
            ])
        );

        $this->assertEquals(422, $response->getStatusCode());

        $json = json_decode($response->getBody(), true);

        $this->assertArrayHasKey('errors', $json);
        $this->assertEquals('/data/attributes/type', $json['errors'][0]['source']['pointer']);
    }

    /**
     * @test
     */
    public function cannot_create_reaction_with_invalid_type()
    {
        $response = $this->send(
            $this->request('POST', '/api/reactions', [
                'authenticatedAs' => 1,
                'json'            => [
                    'data' => [
                        'attributes' => [
                            'identifier' => 'like',
                            'type'       => 'invalid',
                        ],
                    ],
                ],
            ])
        );

        $this->assertEquals(422, $response->getStatusCode());

        $json = json_decode($response->getBody(), true);

        $this->assertArrayHasKey('errors', $json);
        $this->assertEquals('/data/attributes/type', $json['errors'][0]['source']['pointer']);
    }
}
