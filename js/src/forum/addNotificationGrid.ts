import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import NotificationGrid from 'flarum/forum/components/NotificationGrid';

export default function addNotificationGrid() {
  extend(NotificationGrid.prototype, 'notificationTypes', (items) => {
    items.add('postReacted', {
      name: 'postReacted',
      icon: 'far fa-smile',
      label: app.translator.trans('fof-reactions.forum.settings.notify_post_reacted_label'),
    });
  });
}
