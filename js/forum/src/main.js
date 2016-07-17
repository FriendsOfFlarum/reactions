import { extend } from 'flarum/extend';
import app from 'flarum/app';
import Post from 'flarum/models/Post';
import Model from 'flarum/Model';
import NotificationGrid from 'flarum/components/NotificationGrid';

import addReactionAction from 'datitisev/reactions/addReactionAction';
import PostReactedNotification from 'datitisev/reactions/components/PostReactedNotification';
// import addLikesList from 'datitisev/reactions/addLikesList';

app.initializers.add('datitisev-reactions', () => {

  app.notificationComponents.postReacted = PostReactedNotification;

  Post.prototype.canReact = Model.attribute('canReact');
  Post.prototype.reactions = Model.hasMany('reactions');

  addReactionAction();

  extend(NotificationGrid.prototype, 'notificationTypes', function (items) {
    items.add('postReacted', {
      name: 'postReacted',
      icon: 'smile-o',
      label: app.translator.trans('flarum-likes.forum.settings.notify_post_reacted_label')
    });
  });

});
