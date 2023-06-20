import app from 'flarum/forum/app';
import PostReactedNotification from './components/PostReactedNotification';
import addPusher from './addPusher';
import addReactionAction from './addReactionAction';
import addNotificationGrid from './addNotificationGrid';

export * from './components';
export * from './models';
export * from './utils';
export * from '../common/components';
export * from '../common/models';
export * from '../common/util';
export { default as extend } from './extend';

app.initializers.add('fof/reactions', () => {
  app.notificationComponents.postReacted = PostReactedNotification;

  addReactionAction();
  addPusher();
  addNotificationGrid();
});
