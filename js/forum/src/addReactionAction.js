import { extend } from 'flarum/extend';
import app from 'flarum/app';
import Button from 'flarum/components/Button';
import CommentPost from 'flarum/components/CommentPost';

export default () => {

    extend(CommentPost.prototype, 'actionItems', function (items) {

       const post = this.props.post;

        if (post.isHidden() || !post.canReact()) return;

        let isReacted = app.session.user && post.reactions().some(user => user === app.session.user);

        items.add('react', Button.component({
            children: isReacted ? 'Reacted!' : 'React',
            className: 'Button Button--link',
            onclick: () => {
                isReacted = !isReacted;

                post.save({isReacted});

                // We've saved the fact that we have or haven't reacted to the post,
                // but in order to provide instantaneous feedback to the user, we'll
                // need to add or remove the reaction from the relationship data
                // manually
                const data = post.data.relationships.reactions.data;
                data.some((reaction, i) => {
                    if (reaction.id == app.session.user.id()) {
                        data.splice(i, 1);
                        return true
                    };
                });

                if (isReacted) {
                    data.unshift({
                        type: 'users',
                        id: app.session.user.id()
                    });
                }

            }
        }))

    });

}
