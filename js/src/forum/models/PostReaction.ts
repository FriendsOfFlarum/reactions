import Model from 'flarum/common/Model';
import Post from 'flarum/common/models/Post';
import User from 'flarum/common/models/User';
import Reaction from 'src/common/models/Reaction';

export default class PostReaction extends Model {
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
    return Model.hasOne<User>('user').call(this);
  }

  post() {
    return Model.hasOne<Post>('post').call(this);
  }

  reaction() {
    return Model.hasOne<Reaction>('reaction').call(this);
  }
}
