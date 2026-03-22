import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import ReactionComponent from '../../common/components/ReactionComponent';
import reactToPost from '../utils/reactToPost';

export default class PostReactionCounts extends Component {
  oninit(vnode) {
    super.oninit(vnode);
    this.loading = {};
  }

  view() {
    const post = this.attrs.post;
    const reactionCounts = post.reactionCounts();
    const canReact = post.canReact();

    const counts = Object.keys(reactionCounts)
      .map((id) => {
        const reaction = app.store.getById('reactions', id);
        const count = reactionCounts[id];

        if (count === 0) return;

        const isActive = post.userReaction() == reaction.id();
        const spanClass = reaction.type() === 'icon' ? `${reaction.identifier()} emoji button-emoji reaction-icon` : '';
        const icon = <ReactionComponent reaction={reaction} className={spanClass} data-reaction={reaction.identifier()} />;

        return Button.component(
          {
            className: `Button Button--flat Button-emoji-parent ${isActive ? 'active' : ''}`,
            // Clicking an active reaction removes it; clicking another switches to it
            onclick: canReact
              ? () => reactToPost(post, isActive ? null : reaction, this.loading)
              : () => app.modal.show(() => import('./ReactionsModal'), { post }),
            'data-reaction': reaction.identifier(),
            loading: canReact ? this.loading[reaction.id()] : false,
            'aria-label': app.translator.trans('fof-reactions.forum.reacted_with_label', {
              reaction: reaction.display() || reaction.identifier(),
              count,
            }),
          },
          <span>
            {icon} {count > 1 ? <span className="count">{count}</span> : ''}
          </span>
        );
      })
      .filter(Boolean);

    if (!counts.length) return null;

    return (
      <div className="Reactions">
        <div className="Reactions--reactions">{counts}</div>
      </div>
    );
  }
}
