import app from 'flarum/forum/app';
import haptic from 'flarum/common/utils/haptic';

/**
 * React to a post with the given reaction, or unreact if already reacted with it.
 *
 * @param {import('flarum/common/models/Post').default} post
 * @param {object} reaction  Reaction model instance, or null to remove
 * @param {object} loading   Mutable loading-state map keyed by reaction id (or null)
 */
export default function reactToPost(post, reaction, loading) {
  const allowAnonymous = app.forum.attribute('fofReactionsAllowAnonymous');

  if (!app.session.user && !allowAnonymous) {
    app.modal.show(() => import('flarum/forum/components/LogInModal'));
    return;
  }

  if (!post.canReact()) {
    return app.alerts.show({ type: 'error' }, app.translator.trans('core.lib.error.permission_denied_message'));
  }

  if (reaction) haptic('success');

  const id = !reaction ? null : reaction.id();
  const originalPostReactions = post.reactionCounts();

  loading[id] = true;

  return post
    .save({ reaction: id })
    .then((saved) => {
      delete loading[id];

      for (const reactionId in originalPostReactions) {
        if (!saved.reactionCounts().hasOwnProperty(reactionId)) {
          app.store.remove(app.store.getById('reactions', reactionId));
        }
      }

      if (
        (app.forum.data.relationships.ranks !== undefined &&
          (app.forum.attribute('ReactionConverts')[0] === reaction || app.forum.attribute('ReactionConverts')[1] === reaction)) ||
        (post.data.relationships.likes !== undefined && app.forum.attribute('ReactionConverts')[2] === reaction)
      ) {
        app.alerts.show({ type: 'warning' }, app.translator.trans('fof-reactions.forum.warning', { reaction }));
      }

      m.redraw();
    })
    .catch((err) => {
      delete loading[id];
      $('body').append(err);
      m.redraw();
    });
}
