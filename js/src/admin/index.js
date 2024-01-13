import app from 'flarum/admin/app';
import Forum from 'flarum/common/models/Forum';
import Model from 'flarum/common/Model';

import SettingsPage from './components/SettingsPage';
import Reaction from '../common/models/Reaction';

export * from './components';
export * from '../common/components';
export * from '../common/models';
export * from '../common/util';

app.initializers.add('fof/reactions', () => {
  app.store.models.reactions = Reaction;

  Forum.prototype.reactions = Model.hasMany('reactions');

  app.extensionData
    .for('fof-reactions')
    .registerPermission(
      {
        icon: 'far fa-thumbs-up',
        label: app.translator.trans('fof-reactions.admin.permissions.react_posts_label'),
        permission: 'discussion.reactPosts',
      },
      'reply'
    )
    .registerPermission(
      {
        icon: 'fas fa-info-circle',
        label: app.translator.trans('fof-reactions.admin.permissions.see_reactions_label'),
        permission: 'discussion.canSeeReactions',
        allowGuest: true,
      },
      'view'
    )
    .registerPermission(
      {
        icon: 'fas fa-trash',
        label: app.translator.trans('fof-reactions.admin.permissions.delete_post_reactions_label'),
        permission: 'discussion.deletePostReactions',
      },
      'moderate'
    )
    .registerPage(SettingsPage);
});
