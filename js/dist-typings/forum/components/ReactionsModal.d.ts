import Modal, { IInternalModalAttrs } from 'flarum/common/components/Modal';
import type Mithril from 'mithril';
import Post from 'flarum/common/models/Post';
import User from 'flarum/common/models/User';
import Reaction from '../../common/models/Reaction';
import ReactionsModalState from '../states/ReactionsModalState';
interface ReactionsModalAttrs extends IInternalModalAttrs {
    post: Post;
}
interface ReactionGroup {
    reaction: Reaction;
    users: Record<string, User>;
    anonymousCount: number;
}
export default class ReactionsModal extends Modal<ReactionsModalAttrs, ReactionsModalState> {
    state: ReactionsModalState;
    deletingSpecific: Record<string, boolean>;
    deletingType: Record<string, boolean>;
    className(): string;
    title(): string | any[];
    oninit(vnode: Mithril.Vnode<ReactionsModalAttrs>): void;
    /**
     * Build grouped reaction data from all loaded pages.
     */
    getGroups(): ReactionGroup[];
    content(): Mithril.Children;
    buildReactionSection(reaction: Reaction, users: Record<string, User>, anonymousCount: number): Mithril.Children;
    deletePostReaction(postReactionId: string | false, reactionId: string): Promise<void>;
}
export {};
