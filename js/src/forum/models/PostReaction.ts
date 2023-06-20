import Model from 'flarum/common/Model';
import Post from 'flarum/common/models/Post';
import User from 'flarum/common/models/User';
import Reaction from 'src/common/models/Reaction';

export default class PostReaction extends Model {
  userId() {
    return Model.attribute<number>('userId');
  }

  postId() {
    return Model.attribute<number>('postId');
  }

  reactionId() {
    return Model.attribute<number>('reactionId');
  }

  user() {
    return Model.hasOne<User>('user');
  }

  post() {
    return Model.hasOne<Post>('post');
  }

  reaction() {
    return Model.hasOne<Reaction>('reaction');
  }
}
