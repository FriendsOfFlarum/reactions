import { extend } from 'flarum/common/extend';
import app from 'flarum/forum/app';
import CommentPost from 'flarum/forum/components/CommentPost';
import PostReactAction from './components/PostReactAction';
import PostControls from 'flarum/forum/utils/PostControls';
import Button from 'flarum/common/components/Button';
import ReactionsModal from './components/ReactionsModal';

export default () => {
  extend(CommentPost.prototype, 'actionItems', function (items) {
    const post = this.attrs.post;

    if (post.isHidden()) return;

    const hasReacted = app.session.user && post.userReaction() !== null;

    items.add(
      'react',
      PostReactAction.component({
        post,
        hasReacted,
      }),
      5
    );
  });

  extend(PostControls, 'moderationControls', function (items, post) {
    const reactionCounts = post.reactionCounts();
    const hasReactions = reactionCounts && Object.keys(reactionCounts).length > 0;

    if (post.discussion().canSeeReactions() && hasReactions) {
      items.add(
        'viewReactions',
        <Button icon="fas fa-heart" onclick={() => app.modal.show(ReactionsModal, { post })}>
          {app.translator.trans('fof-reactions.forum.mod_item')}
        </Button>
      );
    }
  });
};
