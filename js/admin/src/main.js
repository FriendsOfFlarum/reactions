import { extend } from 'flarum/extend';
import app from 'flarum/app';
import PermissionGrid from 'flarum/components/PermissionGrid';

app.initializers.add('datitisev-reactions', () => {
  extend(PermissionGrid.prototype, 'replyItems', (items) => {
    items.add('reactPosts', {
      icon: 'thumbs-o-up',
      label: app.translator.trans('datitisev-reactions.admin.permissions.react_posts_label'),
      permission: 'discussion.reactPosts',
    });
  });
});
