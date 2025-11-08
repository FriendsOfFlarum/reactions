import Modal, { IInternalModalAttrs } from 'flarum/common/components/Modal';
import type Mithril from 'mithril';
import Post from 'flarum/common/models/Post';
import User from 'flarum/common/models/User';
import Reaction from '../../common/models/Reaction';
interface ReactionsModalAttrs extends IInternalModalAttrs {
    post: Post;
}
interface ReactionGroup {
    reaction: Reaction;
    users: Record<string, User>;
    anonymousCount: number;
}
export default class ReactionsModal extends Modal<ReactionsModalAttrs> {
    reactions: ReactionGroup[];
    loading: boolean;
    deletingSpecific: Record<string, boolean>;
    deletingType: Record<string, boolean>;
    className(): string;
    title(): string | any[];
    oninit(vnode: Mithril.Vnode<ReactionsModalAttrs>): void;
    content(): Mithril.Children;
    buildReactionSection(reaction: Reaction, users: Record<string, User>, anonymousCount: number): Mithril.Children;
    load(): Promise<void>;
    deletePostReaction(postReactionId: string | false, reactionId: string): Promise<void>;
}
export {};
