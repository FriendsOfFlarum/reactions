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

use Carbon\Carbon;
use Flarum\Group\Group;
use Flarum\Likes\Event\PostWasLiked;
use Flarum\Likes\Event\PostWasUnliked;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\Testing\integration\TestCase;
use Illuminate\Contracts\Events\Dispatcher;
use PHPUnit\Framework\Attributes\Test;
use Psr\Http\Message\ResponseInterface;

/**
 * A reaction mapped to a like (fof-reactions.convertToLike) records a like only for someone who may like
 * the post; anyone else gets the plain reaction.
 */
class LikeConversionTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    /** @var string[] */
    protected array $dispatched = [];

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('flarum-likes', 'fof-reactions');

        $this->setting('fof-reactions.convertToLike', 'thumbsup');

        $this->prepareDatabase([
            'users' => [
                $this->normalUser(),
                ['id' => 3, 'username' => 'Acme', 'email' => 'acme@machine.local', 'is_email_confirmed' => 1, 'password' => '$2y$10$LO59tiT7uggl6Oe23o/O6.utnF6ipngYjvMvaxo1TciKqBttDNKim'],
            ],
            'discussions' => [
                ['id' => 1, 'title' => __CLASS__, 'created_at' => Carbon::now(), 'last_posted_at' => Carbon::now(), 'user_id' => 2, 'first_post_id' => 1, 'comment_count' => 1, 'slug' => 'fof-reactions-like-conversion-test'],
            ],
            'posts' => [
                ['id' => 1, 'number' => 1, 'discussion_id' => 1, 'created_at' => Carbon::now(), 'user_id' => 2, 'type' => 'comment', 'content' => '<t><p>something</p></t>'],
            ],
        ]);
    }

    protected function permissions(bool $canLike): void
    {
        $this->database()->table('group_permission')->whereIn('permission', ['discussion.reactPosts', 'discussion.likePosts'])->delete();
        $this->database()->table('group_permission')->insert(['permission' => 'discussion.reactPosts', 'group_id' => Group::MEMBER_ID]);

        if ($canLike) {
            $this->database()->table('group_permission')->insert(['permission' => 'discussion.likePosts', 'group_id' => Group::MEMBER_ID]);
        }
    }

    protected function listenForLikeEvents(): void
    {
        $events = $this->app()->getContainer()->make(Dispatcher::class);

        $events->listen(PostWasLiked::class, fn () => $this->dispatched[] = 'liked');
        $events->listen(PostWasUnliked::class, fn () => $this->dispatched[] = 'unliked');
    }

    protected function react(?string $reactionId, ?int $authenticatedAs = 3): ResponseInterface
    {
        if ($authenticatedAs === null) {
            $initial = $this->send($this->request('GET', '/'));
        }

        $request = $this->request('PATCH', '/api/posts/1', [
            'authenticatedAs' => $authenticatedAs,
            'cookiesFrom'     => $initial ?? null,
            'json'            => ['data' => ['type' => 'posts', 'id' => '1', 'attributes' => ['reaction' => $reactionId]]],
        ]);

        if (isset($initial)) {
            $request = $request->withHeader('X-CSRF-Token', $initial->getHeaderLine('X-CSRF-Token'));
        }

        return $this->send($request);
    }

    protected function likedBy(): array
    {
        return $this->database()->table('post_likes')->where('post_id', 1)->pluck('user_id')->map(fn ($id) => (int) $id)->all();
    }

    protected function reactions(string $table = 'post_reactions'): array
    {
        return $this->database()->table($table)->where('post_id', 1)->whereNotNull('reaction_id')->pluck('reaction_id')->map(fn ($id) => (int) $id)->all();
    }

    #[Test]
    public function a_member_who_may_like_gets_a_like()
    {
        $this->permissions(true);
        $this->listenForLikeEvents();

        $this->assertEquals(200, $this->react('1')->getStatusCode());

        $this->assertEquals([3], $this->likedBy());
        $this->assertEquals([], $this->reactions());
        $this->assertEquals(['liked'], $this->dispatched);
    }

    #[Test]
    public function choosing_the_mapped_reaction_again_unlikes()
    {
        $this->permissions(true);
        $this->listenForLikeEvents();

        $this->react('1');
        $this->assertEquals(200, $this->react('1')->getStatusCode());

        $this->assertEquals([], $this->likedBy());
        $this->assertEquals([], $this->reactions());
        $this->assertEquals(['liked', 'unliked'], $this->dispatched);
    }

    #[Test]
    public function a_member_who_may_not_like_gets_the_plain_reaction()
    {
        $this->permissions(false);
        $this->listenForLikeEvents();

        $this->assertEquals(200, $this->react('1')->getStatusCode());

        $this->assertEquals([], $this->likedBy());
        $this->assertEquals([1], $this->reactions());
        $this->assertEquals([], $this->dispatched);
    }

    #[Test]
    public function liking_your_own_post_follows_the_likes_setting()
    {
        $this->setting('fof-reactions.react_own_post', true);
        $this->setting('flarum-likes.like_own_post', false);
        $this->permissions(true);

        $this->assertEquals(200, $this->react('1', 2)->getStatusCode());

        $this->assertEquals([], $this->likedBy());
        $this->assertEquals([1], $this->reactions());
    }

    #[Test]
    public function a_guest_gets_the_plain_anonymous_reaction()
    {
        $this->setting('fof-reactions.anonymousReactions', true);
        $this->permissions(true);

        $this->assertEquals(200, $this->react('1', null)->getStatusCode());

        $this->assertEquals([], $this->likedBy());
        $this->assertEquals([1], $this->reactions('post_anonymous_reactions'));
    }

    #[Test]
    public function a_guest_gets_the_plain_anonymous_reaction_even_when_guests_may_like()
    {
        $this->setting('fof-reactions.anonymousReactions', true);
        $this->permissions(true);
        $this->database()->table('group_permission')->insert(['permission' => 'discussion.likePosts', 'group_id' => Group::GUEST_ID]);

        $this->assertEquals(200, $this->react('1', null)->getStatusCode());

        $this->assertEquals([], $this->likedBy());
        $this->assertEquals([1], $this->reactions('post_anonymous_reactions'));
    }

    #[Test]
    public function a_disabled_mapped_reaction_is_refused()
    {
        $this->permissions(true);
        $this->database()->table('reactions')->where('id', 1)->update(['enabled' => false]);

        $this->assertEquals(422, $this->react('1')->getStatusCode());

        $this->assertEquals([], $this->likedBy());
        $this->assertEquals([], $this->reactions());
    }

    #[Test]
    public function a_like_can_be_removed_with_the_mapped_reaction_after_it_was_disabled()
    {
        $this->permissions(true);
        $this->listenForLikeEvents();

        $this->react('1');
        $this->database()->table('reactions')->where('id', 1)->update(['enabled' => false]);

        $this->assertEquals(200, $this->react('1')->getStatusCode());

        $this->assertEquals([], $this->likedBy());
        $this->assertEquals([], $this->reactions());
        $this->assertEquals(['liked', 'unliked'], $this->dispatched);
    }
}
