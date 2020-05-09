import Model from 'flarum/Model';
import mixin from 'flarum/utils/mixin';

// const reaction = Model.hasOne('reaction');

export default class PostReaction extends mixin(Model, {
    reaction: Model.hasOne('reaction'),

    userId: Model.attribute('userId'),
    postId: Model.attribute('postId'),
    reactionId: Model.attribute('reactionId'),

    user: Model.hasOne('user'),
    post: Model.hasOne('post'),
}) {}
