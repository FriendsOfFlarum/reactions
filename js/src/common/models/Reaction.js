import Model from 'flarum/Model';
import mixin from 'flarum/utils/mixin';

export default class Reaction extends mixin(Model, {
    identifier: Model.attribute('identifier'),
    display: Model.attribute('display'),
    type: Model.attribute('type'),
    enabled: Model.attribute('enabled'),

    user_id: Model.attribute('user_id'),
    post_id: Model.attribute('post_id'),
    reaction_id: Model.attribute('reaction_id'),
}) {}
