import { extend } from 'flarum/extend';
import app from 'flarum/app';
import Forum from 'flarum/models/Forum';
import Model from 'flarum/Model';
import PermissionGrid from 'flarum/components/PermissionGrid';

import addSettingsPage from './addSettingsPage';
import Reaction from '../common/models/Reaction';

app.initializers.add('fof/reactions', () => {
    app.store.models.reactions = Reaction;

    Forum.prototype.reactions = Model.hasMany('reactions');

    extend(PermissionGrid.prototype, 'replyItems', items => {
        items.add('reactPosts', {
            icon: 'far fa-thumbs-up',
            label: app.translator.trans('fof-reactions.admin.permissions.react_posts_label'),
            permission: 'discussion.reactPosts',
        });
    });

    extend(PermissionGrid.prototype, 'viewItems', items => {
        items.add('canSeeReactions', {
            icon: 'fas fa-info-circle',
            label: app.translator.trans('fof-reactions.admin.permissions.see_reactions_label'),
            permission: 'post.canSeeReactions'
        });
    });

    addSettingsPage();
});
