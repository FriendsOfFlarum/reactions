<?php

namespace FoF\Reactions\tests\integration\api;

use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\Testing\integration\TestCase;
use FoF\Reactions\Reaction;

class DeleteReactionTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('fof-reactions');

        $this->prepareDatabase([
            'users' => [
                $this->normalUser(),
            ]
            ]);
    }

    /**
     * @test
     */
    public function admin_can_delete_reaction()
    {
        $this->app();
        
        $this->assertNotNull(Reaction::find(5));
        
        $response = $this->send(
            $this->request('DELETE', '/api/reactions/5', [
                'authenticatedAs' => 1,
            ])
        );

        $this->assertEquals(204, $response->getStatusCode());

        $this->assertNull(Reaction::find(5));
    }

    /**
     * @test
     */
    public function normal_user_cannot_delete_reaction()
    {
        $response = $this->send(
            $this->request('DELETE', '/api/reactions/5', [
                'authenticatedAs' => 2,
            ])
        );

        $this->assertEquals(403, $response->getStatusCode());
    }
}
