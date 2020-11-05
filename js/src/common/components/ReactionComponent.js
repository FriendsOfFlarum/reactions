import Component from 'flarum/Component';
import extract from 'flarum/utils/extract';

import emoji from '../util/emoji';

export default class ReactionComponent extends Component {
    view() {
        const attrs = { ...this.attrs };
        const reaction = extract(attrs, 'reaction');
        const className = extract(attrs, 'className');

        if (!reaction) return <span />;

        const display = reaction.display() || reaction.identifier();

        if (!attrs.title) attrs.title = display;

        if (reaction.type() === 'emoji') {
            const { url } = emoji(reaction.identifier());

            return <img className={`${className} emoji`} src={url} loading="lazy" draggable="false" alt={display} {...attrs} />;
        } else {
            return <i className={`${className} icon`} aria-hidden {...attrs} />;
        }
    }
}
