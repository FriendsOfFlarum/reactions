import { extend } from 'flarum/common/extend';
import app from 'flarum/forum/app';
import CommentPost from 'flarum/forum/components/CommentPost';
import PostReactAction from './components/PostReactAction';
import PostReactionCounts from './components/PostReactionCounts';
import PostControls from 'flarum/forum/utils/PostControls';
import Button from 'flarum/common/components/Button';

export default () => {
  extend(CommentPost.prototype, 'footerItems', function (items) {
    const post = this.attrs.post;

    if (post.isHidden()) return;

    const reactionCounts = post.reactionCounts();
    const hasReactions = reactionCounts && Object.values(reactionCounts).some((c) => c > 0);

    if (!hasReactions) return;

    items.add('reactionCounts', PostReactionCounts.component({ post }), 10);
  });

  extend(CommentPost.prototype, 'actionItems', function (items) {
    const post = this.attrs.post;

    if (post.isHidden()) return;

    items.add('react', PostReactAction.component({ post }), 5);
  });

  extend(PostControls, 'moderationControls', function (items, post) {
    const reactionCounts = post.reactionCounts();
    const hasReactions = reactionCounts && Object.keys(reactionCounts).length > 0;

    if (post.discussion().canSeeReactions() && hasReactions) {
      items.add(
        'viewReactions',
        <Button icon="fas fa-heart" onclick={() => app.modal.show(() => import('./components/ReactionsModal'), { post })}>
          {app.translator.trans('fof-reactions.forum.mod_item')}
        </Button>
      );
    }
  });
};
