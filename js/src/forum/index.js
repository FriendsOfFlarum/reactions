import { extend } from 'flarum/extend';
import app from 'flarum/app';
import Forum from 'flarum/models/Forum';
import Discussion from 'flarum/models/Discussion';
import Post from 'flarum/models/Post';
import Model from 'flarum/Model';
import NotificationGrid from 'flarum/components/NotificationGrid';

import PostReactedNotification from './components/PostReactedNotification';
import Reaction from '../common/models/Reaction';
import PostReaction from './models/PostReaction';

import addPusher from './addPusher';
import addReactionAction from './addReactionAction';

app.initializers.add('fof/reactions', () => {
    app.store.models.reactions = Reaction;
    app.store.models.post_reactions = PostReaction;

    app.notificationComponents.postReacted = PostReactedNotification;

    Post.prototype.canReact = Model.attribute('canReact');
    Post.prototype.reactions = Model.hasMany('reactions');

    Forum.prototype.reactions = Model.hasMany('reactions');

    Discussion.prototype.canSeeReactions = Model.attribute('canSeeReactions');

    addReactionAction();
    addPusher();

    extend(NotificationGrid.prototype, 'notificationTypes', (items) => {
        items.add('postReacted', {
            name: 'postReacted',
            icon: 'far fa-smile',
            label: app.translator.trans('fof-reactions.forum.settings.notify_post_reacted_label'),
        });
    });
});
