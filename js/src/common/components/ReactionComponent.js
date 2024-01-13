import Component from 'flarum/common/Component';
import extract from 'flarum/common/utils/extract';
import classList from 'flarum/common/utils/classList';

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

      return <img className={classList(className, 'emoji')} src={url} loading="lazy" draggable="false" alt={display} {...attrs} />;
    } else {
      return <i className={classList(className, reaction.identifier(), 'icon')} aria-hidden {...attrs} />;
    }
  }
}
