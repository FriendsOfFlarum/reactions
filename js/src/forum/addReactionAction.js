import { extend } from 'flarum/extend';
import app from 'flarum/app';
import CommentPost from 'flarum/components/CommentPost';
import PostReactAction from './components/PostReactAction';
import PostControls from 'flarum/utils/PostControls';
import Button from 'flarum/components/Button';
import ReactionsModal from './components/ReactionsModal';

export default () => {
    extend(CommentPost.prototype, 'actionItems', function(items) {
        const post = this.props.post;

        if (post.isHidden()) return;

        const reaction = app.session.user && Array.isArray(post.reactions()) && post.reactions().some(user => user === app.session.user);

        items.add(
            'react',
            PostReactAction.component({
                post,
                reaction,
            }),
            5
        );
    });

    extend(PostControls, 'moderationControls', function(items, post) {
        if (post.discussion().canSeeReactions()) {
            items.add('viewReactions', [
                m(Button,
                  {
                      icon: 'fas fa-heart',
                      onclick: () => {
                          app.modal.show(new ReactionsModal({post}));
                      },
                  },
                  app.translator.trans('fof-reactions.forum.mod_item')
                  )
            ]);
        }
        else
        {
            console.log(post.discussion());
        }
    });
};
