<?php

/*
 * This file is part of fof/reactions.
 *
 * Copyright (c) FriendsOfFlarum.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FoF\Reactions;

use Flarum\Audit\AuditLogger;
use FoF\Reactions\Event\PostReactionDeleted;
use FoF\Reactions\Event\PostReactionsCleared;
use Illuminate\Contracts\Container\Container;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * What flarum/audit records: admin changes to the reaction types, and moderators removing reactions
 * from posts. Reacting and unreacting are left out; there are far too many to be useful.
 *
 * Wired in through the Flarum\Audit\Extend\Audit extender's `using()`, behind an Extend\Conditional,
 * so it's only active when flarum-audit is enabled.
 *
 * The labels use the payload's own `reaction` and `count` keys, which the audit browser fills from
 * flarum/audit 2.0.2 on. Older versions show those placeholders unfilled.
 */
class AuditIntegration
{
    /**
     * @var string[]
     */
    public static array $actions = [
        'fof-reactions.reaction_created',
        'fof-reactions.reaction_updated',
        'fof-reactions.reaction_enabled',
        'fof-reactions.reaction_disabled',
        'fof-reactions.reaction_deleted',
        'fof-reactions.post_reaction_removed',
        'fof-reactions.post_reactions_removed',
    ];

    public function __invoke(Container $container): void
    {
        $events = $container->make(Dispatcher::class);

        // Reaction types have no update event, so all three lifecycle changes come from the model.
        $events->listen('eloquent.created: '.Reaction::class, [$this, 'reactionCreated']);
        $events->listen('eloquent.updated: '.Reaction::class, [$this, 'reactionUpdated']);
        $events->listen('eloquent.deleted: '.Reaction::class, [$this, 'reactionDeleted']);

        $events->listen(PostReactionDeleted::class, [$this, 'postReactionDeleted']);
        $events->listen(PostReactionsCleared::class, [$this, 'postReactionsCleared']);
    }

    public function reactionCreated(Reaction $reaction): void
    {
        AuditLogger::log('fof-reactions.reaction_created', [
            'reaction_id' => $reaction->id,
            'reaction'    => $reaction->identifier,
        ]);
    }

    public function reactionUpdated(Reaction $reaction): void
    {
        // The admin page saves one field per request; each changed field gets its own entry so the
        // log reads as a sentence. In the `updated` event the original still holds the old values.
        foreach (array_keys($reaction->getChanges()) as $key) {
            if ($key === 'enabled') {
                AuditLogger::log('fof-reactions.reaction_'.($reaction->enabled ? 'enabled' : 'disabled'), [
                    'reaction_id' => $reaction->id,
                    'reaction'    => $reaction->identifier,
                ]);
            } elseif (in_array($key, ['identifier', 'display', 'type'], true)) {
                AuditLogger::log('fof-reactions.reaction_updated', [
                    'reaction_id' => $reaction->id,
                    'reaction'    => $reaction->identifier,
                    'key'         => $key,
                    'old_value'   => $reaction->getOriginal($key),
                    'new_value'   => $reaction->getAttribute($key),
                ]);
            }
        }
    }

    public function reactionDeleted(Reaction $reaction): void
    {
        AuditLogger::log('fof-reactions.reaction_deleted', [
            'reaction_id' => $reaction->id,
            'reaction'    => $reaction->identifier,
        ]);
    }

    public function postReactionDeleted(PostReactionDeleted $event): void
    {
        // Deleting your own reaction is just unreacting, and a row whose reaction was already removed
        // shows nothing to anyone. Neither is a moderation action.
        if ($event->postReaction->user_id == $event->actor->id || $event->postReaction->reaction_id === null) {
            return;
        }

        AuditLogger::log('fof-reactions.post_reaction_removed', [
            'discussion_id' => (int) $event->post->discussion_id,
            'post_id'       => (int) $event->post->id,
            'user_id'       => (int) $event->postReaction->user_id,
            'reaction'      => $event->postReaction->reaction?->identifier,
        ]);
    }

    public function postReactionsCleared(PostReactionsCleared $event): void
    {
        AuditLogger::log('fof-reactions.post_reactions_removed', [
            'discussion_id' => (int) $event->post->discussion_id,
            'post_id'       => (int) $event->post->id,
            'reaction_id'   => $event->reaction->id,
            'reaction'      => $event->reaction->identifier,
            'count'         => $event->count,
        ]);
    }
}
