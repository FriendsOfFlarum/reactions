import Model from 'flarum/common/Model';

export default class Reaction extends Model {
  identifier() {
    return Model.attribute<string>('identifier').call(this);
  }

  display() {
    return Model.attribute<string>('display').call(this);
  }

  type() {
    return Model.attribute<string>('type').call(this);
  }

  enabled() {
    return Model.attribute<boolean>('enabled').call(this);
  }

  user_id() {
    return Model.attribute<number>('user_id').call(this);
  }

  post_id() {
    return Model.attribute<number>('post_id').call(this);
  }

  reaction_id() {
    return Model.attribute<number>('reaction_id').call(this);
  }
}
