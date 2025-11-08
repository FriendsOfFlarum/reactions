import Extend from 'flarum/common/extenders';
import commonExtend from '../common/extend';
import Post from 'flarum/common/models/Post';
import PostReacttion from './models/PostReaction';
import Forum from 'flarum/common/models/Forum';
import Discussion from 'flarum/common/models/Discussion';
import PostReactedNotification from './components/PostReactedNotification';

export default [
  ...commonExtend,

  new Extend.Store() //
    .add('post_reactions', PostReacttion),

  new Extend.Model(Post) //
    .attribute('canReact')
    .attribute('canDeletePostReactions')
    .attribute('reactionCounts')
    .attribute('userReaction'),

  new Extend.Model(Forum) //
    .hasMany('reactions'),

  new Extend.Model(Discussion) //
    .attribute('canSeeReactions'),

  new Extend.Notification() //
    .add('postReacted', PostReactedNotification),
];
