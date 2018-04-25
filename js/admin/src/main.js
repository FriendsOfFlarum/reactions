import {extend} from 'flarum/extend';
import app from 'flarum/app';
import Forum from 'flarum/models/Forum';
import Model from 'flarum/Model';
import PermissionGrid from 'flarum/components/PermissionGrid';

import addSettingsPage from 'reflar/reactions/addSettingsPage';
import Reaction from 'reflar/reactions/models/Reaction';

app.initializers.add('reflar-reactions', () => {
    app.store.models.reactions = Reaction;

    Forum.prototype.reactions = Model.hasMany('reactions');

    extend(PermissionGrid.prototype, 'replyItems', (items) => {
        items.add('reactPosts', {
            icon: 'thumbs-o-up',
            label: app.translator.trans('reflar-reactions.admin.permissions.react_posts_label'),
            permission: 'discussion.reactPosts',
        });
    });

    addSettingsPage();
});
