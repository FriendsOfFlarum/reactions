import Extend from 'flarum/common/extenders';
import Reaction from './models/Reaction';
import Forum from 'flarum/common/models/Forum';

export default [
  new Extend.Store() //
    .add('reactions', Reaction),

  new Extend.Model(Forum) //
    .hasMany('reactions'),
];
