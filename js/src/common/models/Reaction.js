import Model from 'flarum/Model';
import mixin from 'flarum/utils/mixin';

export default class Reaction extends mixin(Model, {
    identifier: Model.attribute('identifier'),
    display: Model.attribute('display'),
    type: Model.attribute('type'),
    user_id: Model.attribute('user_id'),
    post_id: Model.attribute('post_id'),
    enabled: Model.attribute('enabled'),
}) {}
