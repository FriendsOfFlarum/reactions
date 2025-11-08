import app from 'flarum/admin/app';
import Extend from 'flarum/common/extenders';
import SettingsPage from './components/SettingsPage';
import commonExtend from '../common/extend';

export default [
  ...commonExtend,

  new Extend.Admin()
    .permission(
      () => ({
        icon: 'far fa-thumbs-up',
        label: app.translator.trans('fof-reactions.admin.permissions.react_posts_label'),
        permission: 'discussion.reactPosts',
      }),
      'reply'
    )
    .permission(
      () => ({
        icon: 'fas fa-info-circle',
        label: app.translator.trans('fof-reactions.admin.permissions.see_reactions_label'),
        permission: 'discussion.canSeeReactions',
        allowGuest: true,
      }),
      'view'
    )
    .permission(
      () => ({
        icon: 'fas fa-trash',
        label: app.translator.trans('fof-reactions.admin.permissions.delete_post_reactions_label'),
        permission: 'discussion.deleteReactionsPosts',
      }),
      'moderate'
    )
    .page(SettingsPage),
];
