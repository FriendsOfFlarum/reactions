import PostReaction from '../forum/models/PostReaction';
import Reaction from '../common/models/Reaction';

declare module 'flarum/common/models/Post' {
  export default interface Post {
    reactionCounts(): Record<string, number>;
    userReaction(): number | undefined;

    canReact(): boolean;
    canDeletePostReactions(): boolean;
  }
}

declare module 'flarum/common/models/Discussion' {
  export default interface Discussion {
    canSeeReactions(): boolean;
  }
}

declare module 'flarum/forum/models/Forum' {
  export default interface Forum {
    reactions(): Reaction[];
  }
}
