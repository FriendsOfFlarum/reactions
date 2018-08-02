import { extend } from 'flarum/extend';
import app from 'flarum/app';
import PermissionGrid from 'flarum/components/PermissionGrid';

import addSettingsPage from './addSettingsPage';
import Reaction from '../common/models/Reaction';

app.initializers.add('reflar-reactions', () => {
  app.store.models.reactions = Reaction;

  extend(PermissionGrid.prototype, 'replyItems', (items) => {
    items.add('reactPosts', {
      icon: 'thumbs-o-up',
      label: app.translator.trans('reflar-reactions.admin.permissions.react_posts_label'),
      permission: 'discussion.reactPosts',
    });
  });

  addSettingsPage();
});
