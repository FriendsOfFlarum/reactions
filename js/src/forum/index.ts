import { extend } from 'flarum/common/extend';
import app from 'flarum/forum/app';

import addPusher from './addPusher';
import addReactionAction from './addReactionAction';
import extendRealtime from './extendRealtime';

export { default as extend } from './extend';

app.initializers.add('fof/reactions', () => {
  addReactionAction();

  if ('flarum-pusher' in flarum.extensions) {
    addPusher();
  }

  if ('flarum-realtime' in flarum.extensions) {
    extendRealtime();
  }

  extend('flarum/forum/components/NotificationGrid', 'notificationTypes', (items) => {
    items.add('postReacted', {
      name: 'postReacted',
      icon: 'far fa-smile',
      label: app.translator.trans('fof-reactions.forum.settings.notify_post_reacted_label'),
    });
  });
});
