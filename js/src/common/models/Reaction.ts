import Model from 'flarum/common/Model';

export default class Reaction extends Model {
  identifier() {
    return Model.attribute<string>('identifier');
  }

  display() {
    return Model.attribute<string>('display');
  }

  type() {
    return Model.attribute<string>('type');
  }

  enabled() {
    return Model.attribute<boolean>('enabled');
  }

  user_id() {
    return Model.attribute<number>('user_id');
  }

  post_id() {
    return Model.attribute<number>('post_id');
  }

  reaction_id() {
    return Model.attribute<number>('reaction_id');
  }
}
