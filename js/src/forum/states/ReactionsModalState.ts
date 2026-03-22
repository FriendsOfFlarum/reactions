import PaginatedListState, { PaginatedListParams } from 'flarum/common/states/PaginatedListState';
import PostReaction from '../models/PostReaction';

export interface ReactionsModalParams extends PaginatedListParams {
  filter: {
    post: string;
  };
}

export default class ReactionsModalState extends PaginatedListState<PostReaction, ReactionsModalParams> {
  constructor(params: ReactionsModalParams) {
    super(params, 1, 20);
  }

  get type(): string {
    return 'post_reactions';
  }

  protected requestParams() {
    return {
      include: 'user,reaction',
      filter: this.params.filter,
    };
  }
}
