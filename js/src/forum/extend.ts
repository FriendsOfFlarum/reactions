import Extend from 'flarum/common/extenders';
import Post from 'flarum/common/models/Post';
import PostReaction from './models/PostReaction';
import Reaction from '../common/models/Reaction';
import Discussion from 'flarum/common/models/Discussion';
import Forum from 'flarum/common/models/Forum';

export default [
  new Extend.Store() //
    .add('reactions', Reaction)
    .add('post_reactions', PostReaction),

  new Extend.Model(Post) //
    .hasMany<PostReaction>('reactions')
    .attribute<number>('reactionsCount')
    .attribute<boolean>('canReact'),

  new Extend.Model(Discussion) //
    .attribute<boolean>('canSeeReactions'),

  new Extend.Model(Forum) //
    .hasMany<Reaction>('reactions'),
];
