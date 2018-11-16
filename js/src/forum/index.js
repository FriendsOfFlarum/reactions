import { extend } from 'flarum/extend';
import app from 'flarum/app';
import Forum from 'flarum/models/Forum';
import Post from 'flarum/models/Post';
import Model from 'flarum/Model';
import NotificationGrid from 'flarum/components/NotificationGrid';
import addReactionAction from './addReactionAction';
import PostReactedNotification from './components/PostReactedNotification';
import Reaction from '../common/models/Reaction';

app.initializers.add('reflar-reactions', () => {
    app.store.models.reactions = Reaction;

    app.notificationComponents.postReacted = PostReactedNotification;

    Post.prototype.canReact = Model.attribute('canReact');
    Post.prototype.reactions = Model.hasMany('reactions');

    Forum.prototype.reactions = Model.hasMany('reactions');

    addReactionAction();

    extend(NotificationGrid.prototype, 'notificationTypes', items => {
        items.add('postReacted', {
            name: 'postReacted',
            icon: 'eye',
            label: app.translator.trans('reflar-reactions.forum.settings.notify_post_reacted_label'),
        });
    });
});
