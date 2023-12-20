import Model from 'flarum/common/Model';
import Post from 'flarum/common/models/Post';
import User from 'flarum/common/models/User';

export default class PostReaction extends Model {
  reaction() {
    return Model.attribute<string>('reaction').call(this);
  }

  userId() {
    return Model.attribute<number>('userId').call(this);
  }

  postId() {
    return Model.attribute<number>('postId').call(this);
  }

  reactionId() {
    return Model.attribute<number>('reactionId').call(this);
  }

  user() {
    return Model.hasOne<User>('user');
  }

  post() {
    return Model.hasOne<Post>('post');
  }
}
