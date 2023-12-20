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

class EditReactionTest extends TestCase
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

    protected function addNewReaction(): int
    {
        $response = $this->send(
            $this->request('POST', '/api/reactions', [
                'authenticatedAs' => 1,
                'json'            => [
                    'data' => [
                        'attributes' => [
                            'identifier' => 'test',
                            'type'       => 'emoji',
                        ],
                    ],
                ],
            ])
        );

        $this->assertEquals(201, $response->getStatusCode());

        $response = json_decode($response->getBody()->getContents(), true);

        return $response['data']['id'];
    }

    /**
     * @test
     */
    public function admin_can_edit_reaction()
    {
        $this->app();

        $id = $this->addNewReaction();

        $response = $this->send(
            $this->request('PATCH', '/api/reactions/'.$id, [
                'authenticatedAs' => 1,
                'json'            => [
                    'attributes' => [
                        'identifier' => 'test2',
                        'type'       => 'icon',
                        'enabled'    => true,
                        'display'    => 'Test 2',
                    ],
                ],
            ])
        );

        $this->assertEquals(200, $response->getStatusCode());

        $response = json_decode($response->getBody()->getContents(), true);

        $this->assertEquals('test2', $response['data']['attributes']['identifier']);
        $this->assertEquals('icon', $response['data']['attributes']['type']);
        $this->assertEquals('Test 2', $response['data']['attributes']['display']);
        $this->assertTrue($response['data']['attributes']['enabled']);

        $reaction = Reaction::find($id);

        $this->assertNotNull($reaction);
        $this->assertEquals('test2', $reaction->identifier);
        $this->assertEquals('icon', $reaction->type);
        $this->assertEquals('Test 2', $reaction->display);
        $this->assertTrue($reaction->enabled);
    }

    /**
     * @test
     */
    public function normal_user_cannot_edit_reaction()
    {
        $id = $this->addNewReaction();

        $response = $this->send(
            $this->request('PATCH', '/api/reactions/'.$id, [
                'authenticatedAs' => 2,
                'json'            => [
                    'attributes' => [
                        'identifier' => 'test2',
                        'type'       => 'emoji',
                    ],
                ],
            ])
        );

        $this->assertEquals(403, $response->getStatusCode());
    }

    /**
     * @test
     */
    public function cannot_edit_reaction_with_invalid_type()
    {
        $id = $this->addNewReaction();

        $response = $this->send(
            $this->request('PATCH', '/api/reactions/'.$id, [
                'authenticatedAs' => 1,
                'json'            => [
                    'attributes' => [
                        'type' => 'invalid',
                    ],
                ],
            ])
        );

        $this->assertEquals(422, $response->getStatusCode());
    }

    /**
     * @test
     */
    public function cannot_edit_non_existent_reaction()
    {
        $response = $this->send(
            $this->request('PATCH', '/api/reactions/110', [
                'authenticatedAs' => 1,
                'json'            => [
                    'attributes' => [
                        'identifier' => 'test2',
                        'type'       => 'emoji',
                    ],
                ],
            ])
        );

        $this->assertEquals(404, $response->getStatusCode());
    }
}
