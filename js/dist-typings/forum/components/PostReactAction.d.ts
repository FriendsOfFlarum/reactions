export default class PostReactAction extends Component<any, undefined> {
    constructor();
    oninit(vnode: any): void;
    post: any;
    loading: {} | undefined;
    oncreate(vnode: any): void;
    getReactions(): ItemList<any>;
    view(): JSX.Element;
    reactButton(): JSX.Element;
    react(reaction: any, e: any): any;
    updateChosenReaction(): any;
    reaction: any;
}
import Component from "flarum/common/Component";
import ItemList from "flarum/common/utils/ItemList";
