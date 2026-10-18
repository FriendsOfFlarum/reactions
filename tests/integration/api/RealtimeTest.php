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

use Flarum\Post\Post;
use Flarum\Realtime\Push\RealtimeRegistry;
use Flarum\Testing\integration\TestCase;
use Flarum\User\User;
use FoF\Reactions\Event\PostReactionDeleted;
use FoF\Reactions\Event\PostReactionsCleared;
use FoF\Reactions\Event\PostWasReacted;
use FoF\Reactions\Event\PostWasUnreacted;
use FoF\Reactions\PostReaction;
use FoF\Reactions\Reaction;
use PHPUnit\Framework\Attributes\Test;

class RealtimeTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();

        $this->extension('flarum-realtime', 'fof-reactions');
    }

    /**
     * @return array<string, array{getModel: callable, getActor: callable|null, eventName: string|null}>
     */
    protected function broadcastsByEvent(): array
    {
        $byEvent = [];

        foreach ($this->app()->getContainer()->make(RealtimeRegistry::class)->getModelEvents() as $registration) {
            foreach ($registration['events'] as $event) {
                $byEvent[$event] = $registration;
            }
        }

        return $byEvent;
    }

    #[Test]
    public function reacting_and_unreacting_are_broadcast_to_the_discussion_stream(): void
    {
        $broadcasts = $this->broadcastsByEvent();

        foreach ([PostWasReacted::class, PostWasUnreacted::class] as $event) {
            $this->assertArrayHasKey($event, $broadcasts);
            $this->assertSame('reactionMutation', $broadcasts[$event]['eventName']);
        }
    }

    #[Test]
    public function removed_reactions_are_broadcast_with_the_remover_as_actor(): void
    {
        $broadcasts = $this->broadcastsByEvent();

        $post = new Post();
        $moderator = new User();
        $reaction = new Reaction();

        $events = [
            PostReactionDeleted::class  => new PostReactionDeleted($post, new PostReaction(), $moderator),
            PostReactionsCleared::class => new PostReactionsCleared($post, $reaction, 3, $moderator),
        ];

        foreach ($events as $class => $event) {
            $this->assertArrayHasKey($class, $broadcasts, "$class is not broadcast, so other viewers keep showing removed reactions until they reload");
            $this->assertSame('reactionMutation', $broadcasts[$class]['eventName']);
            $this->assertSame($post, ($broadcasts[$class]['getModel'])($event));

            // Realtime leaves the actor out of the broadcast; the remover's own page already shows the change.
            $this->assertSame($moderator, ($broadcasts[$class]['getActor'])($event));
        }
    }
}
