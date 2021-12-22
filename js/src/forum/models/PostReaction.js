import Model from 'flarum/common/Model';
import mixin from 'flarum/common/utils/mixin';

export default class PostReaction extends mixin(Model, {
  reaction: Model.hasOne('reaction'),

  userId: Model.attribute('userId'),
  postId: Model.attribute('postId'),
  reactionId: Model.attribute('reactionId'),

  user: Model.hasOne('user'),
  post: Model.hasOne('post'),
}) {}
