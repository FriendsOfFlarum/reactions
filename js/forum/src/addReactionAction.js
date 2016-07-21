import { extend } from 'flarum/extend';
import app from 'flarum/app';
import CommentPost from 'flarum/components/CommentPost';
import PostReactAction from 'datitisev/reactions/components/PostReactAction';

export default () => {

    extend(CommentPost.prototype, 'actionItems', function (items) {

       const post = this.props.post;

        if (post.isHidden() || !post.canReact()) return;


        // TODO Get actual reaction, not boolean
        let reaction = app.session.user && post.reactions().some(user => user === app.session.user);

        items.add('react', PostReactAction.component({
          post: post,
          reaction: reaction
        }));

    });

}
