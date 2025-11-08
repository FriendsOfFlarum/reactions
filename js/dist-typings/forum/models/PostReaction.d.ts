import Model from 'flarum/common/Model';
import Post from 'flarum/common/models/Post';
import User from 'flarum/common/models/User';
export default class PostReaction extends Model {
    reaction(): string;
    userId(): number;
    postId(): number;
    reactionId(): number;
    user(): () => false | User;
    post(): () => false | Post;
}
