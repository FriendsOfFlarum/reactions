import { extend } from 'flarum/extend';
import app from 'flarum/app';
import Forum from 'flarum/models/Forum';
import Post from 'flarum/models/Post';
import Model from 'flarum/Model';
import NotificationGrid from 'flarum/components/NotificationGrid';
import CommentPost from 'flarum/components/CommentPost';
import addReactionAction from './addReactionAction';
import PostReactedNotification from './components/PostReactedNotification';
import Reaction from '../common/models/Reaction';

app.initializers.add('fof/reactions', () => {
    app.store.models.reactions = Reaction;

    app.notificationComponents.postReacted = PostReactedNotification;

    Post.prototype.canReact = Model.attribute('canReact');
    Post.prototype.reactions = Model.hasMany('reactions');

    Forum.prototype.reactions = Model.hasMany('reactions');

    addReactionAction();

    extend(CommentPost.prototype, 'config', function(x, isInitialized, context) {
        if (isInitialized) return;

        if (app.pusher) {
            app.pusher.then(channels => {
                channels.main.bind('newReaction', data => {
                    var userId = parseInt(data.userId);

                    if (userId == app.session.user.id()) return;

                    if (parseInt(this.props.post.id()) === parseInt(data.postId)) {
                        m.startComputation();

                        let reaction = {};
                        Object.keys(data.reaction).map(key => {
                            reaction[key] = m.prop(data.reaction[key]);
                        });
                        reaction['identifier'] = m.prop(data.identifier);

                        let newReactions = this.props.post.reactions();
                        newReactions.push(reaction);

                        this.props.post.reactions = m.prop(newReactions);

                        m.redraw.strategy('all');

                        m.endComputation();
                    }
                });

                extend(context, 'onunload', () => channels.main.unbind('newReaction'));
            });
        }
    });

    extend(NotificationGrid.prototype, 'notificationTypes', items => {
        items.add('postReacted', {
            name: 'postReacted',
            icon: 'eye',
            label: app.translator.trans('fof-reactions.forum.settings.notify_post_reacted_label'),
        });
    });
});
