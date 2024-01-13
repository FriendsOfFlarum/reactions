import { extend } from 'flarum/common/extend';
import app from 'flarum/forum/app';
import Forum from 'flarum/common/models/Forum';
import Discussion from 'flarum/common/models/Discussion';
import Post from 'flarum/common/models/Post';
import Model from 'flarum/common/Model';
import NotificationGrid from 'flarum/forum/components/NotificationGrid';

import PostReactedNotification from './components/PostReactedNotification';
import Reaction from '../common/models/Reaction';
import PostReaction from './models/PostReaction';

import addPusher from './addPusher';
import addReactionAction from './addReactionAction';

export * from './components';
export * from './models';
export * from './utils';
export * from '../common/components';
export * from '../common/models';
export * from '../common/util';

app.initializers.add('fof/reactions', () => {
  app.store.models.reactions = Reaction;
  app.store.models.post_reactions = PostReaction;

  app.notificationComponents.postReacted = PostReactedNotification;

  Post.prototype.canReact = Model.attribute('canReact');
  Post.prototype.canDeletePostReactions = Model.attribute('canDeletePostReactions');
  Post.prototype.reactionCounts = Model.attribute('reactionCounts');
  Post.prototype.userReaction = Model.attribute('userReaction');

  Forum.prototype.reactions = Model.hasMany('reactions');

  Discussion.prototype.canSeeReactions = Model.attribute('canSeeReactions');

  addReactionAction();
  addPusher();

  extend(NotificationGrid.prototype, 'notificationTypes', (items) => {
    items.add('postReacted', {
      name: 'postReacted',
      icon: 'far fa-smile',
      label: app.translator.trans('fof-reactions.forum.settings.notify_post_reacted_label'),
    });
  });
});
