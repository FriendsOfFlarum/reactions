import Post from 'flarum/common/models/Post';
import Reaction from 'src/common/models/Reaction';

declare module 'flarum/common/models/Post' {
  export default interface Post {
    reactions(): Reaction[];
    reactionsCount(): number;
  }
}
