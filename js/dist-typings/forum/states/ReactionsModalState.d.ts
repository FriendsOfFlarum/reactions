import PaginatedListState, { PaginatedListParams } from 'flarum/common/states/PaginatedListState';
import PostReaction from '../models/PostReaction';
export interface ReactionsModalParams extends PaginatedListParams {
    filter: {
        post: string;
    };
}
export default class ReactionsModalState extends PaginatedListState<PostReaction, ReactionsModalParams> {
    constructor(params: ReactionsModalParams);
    get type(): string;
    protected requestParams(): {
        include: string;
        filter: {
            post: string;
        };
    };
}
