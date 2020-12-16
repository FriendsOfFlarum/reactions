import app from 'flarum/app';
import Forum from 'flarum/models/Forum';
import Model from 'flarum/Model';

import SettingsPage from './components/SettingsPage';
import Reaction from '../common/models/Reaction';

app.initializers.add('fof/reactions', () => {
    app.store.models.reactions = Reaction;

    Forum.prototype.reactions = Model.hasMany('reactions');

    app.extensionData.for('fof-reactions')
        .registerPermission(
            {
                icon: 'far fa-thumbs-up',
                label: app.translator.trans('fof-reactions.admin.permissions.react_posts_label'),
                permission: 'discussion.reactPosts',
            }, 'reply'
        )
        .registerPermission(
            {
                icon: 'fas fa-info-circle',
                label: app.translator.trans('fof-reactions.admin.permissions.see_reactions_label'),
                permission: 'discussion.canSeeReactions',
            }, 'view'
        )
        .registerPage(SettingsPage);
});
