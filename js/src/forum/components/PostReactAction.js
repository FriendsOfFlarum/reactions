import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import ItemList from 'flarum/common/utils/ItemList';
import Button from 'flarum/common/components/Button';
import listItems from 'flarum/common/helpers/listItems';
import LogInModal from 'flarum/forum/components/LogInModal';

import groupBy from '../utils/groupBy';
import ReactionComponent from '../../common/components/ReactionComponent';
import icon from 'flarum/common/helpers/icon';

export default class PostReactAction extends Component {
  oninit(vnode) {
    super.oninit(vnode);

    this.post = this.attrs.post;

    this.loading = {};

    this.updateChosenReaction();
  }

  oncreate(vnode) {
    super.oncreate(vnode);
    if ('ontouchstart' in window) {
      $('.Reactions')
        .unbind()
        .on('touchend', function () {
          $(this).find('.CommentPost--Reactions').toggleClass('mobile-show');
        });
      $(document).click(function (e) {
        var target = e.target;
        if (!$(target).is('.Reactions') && !$(target).parents().is('.Reactions')) {
          $('.CommentPost--Reactions').removeClass('mobile-show');
        }
      });
    }
  }

  getReactions() {
    const items = new ItemList();

    app.forum.reactions().forEach((reaction) => {
      if (!reaction.enabled()) {
        return;
      }
      items.add(
        reaction.identifier().replace(/fa.? fa-/, ''),
        <Button
          className="Button Button--link"
          type="button"
          title={reaction.display() || reaction.identifier()}
          onclick={this.react.bind(this, reaction)}
          data-reaction={reaction.identifier()}
          loading={this.loading[reaction.id()]}
        >
          <ReactionComponent className={reaction.type()} reaction={reaction} />
        </Button>
      );
    });

    return items;
  }

  view() {
    const reactionCounts = this.post.reactionCounts();
    const canReact = this.post.canReact();

    return (
      <div style="margin-right: 7px" className="Reactions">
        <div className="Reactions--reactions">
          {Object.keys(reactionCounts).map((id) => {
            const reaction = app.store.getById('reactions', id);
            const count = reactionCounts[id];

            if (count === 0) return;

            const spanClass = reaction.type() === 'icon' ? `${reaction.identifier()} emoji button-emoji reaction-icon` : '';
            const icon = <ReactionComponent reaction={reaction} className={spanClass} data-reaction={reaction.identifier()} />;

            return Button.component(
              {
                className: `Button Button--flat Button-emoji-parent ${
                  this.post.userReaction() && this.post.userReaction() == reaction.id() && 'active'
                }`,
                onclick: canReact ? this.react.bind(this, reaction) : '',
                'data-reaction': reaction.identifier(),
                disabled: !canReact,
                loading: this.loading[reaction.id()],
              },
              <span>
                {icon} {count > 1 ? <span className="count">{count}</span> : ''}
              </span>
            );
          })}
        </div>

        {(!Object.keys(this.loading).length || this.loading[null]) && !this.post.userReaction() && canReact && (
          <div className="Reactions--react">
            {this.reactButton()}

            <div className="CommentPost--Reactions" style={this.post.number() === 1 ? '' : 'left: -28%;'}>
              <ul className="Reactions--Ul">{listItems(this.getReactions().toArray())}</ul>
            </div>
          </div>
        )}
      </div>
    );
  }

  reactButton() {
    return (
      <Button
        className="Button Button--link Reactions--ShowReactions"
        type="Button"
        title={app.translator.trans('fof-reactions.forum.react_button_label')}
        loading={this.loading[null]}
      >
        <span className="Button-label">
          <svg class="button-react" width="20px" height="20px" viewBox="0 0 18 18">
            <g id="Reaction" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g id="ic_reactions_grey">
                <g id="Group-2">
                  <g id="0:0:0:0">
                    <rect id="Rectangle-5" x="0" y="0" width="18" height="18" />
                    <g id="emoticon" />
                    <path
                      d="M14.6332705,7.33333333 C14.6554304,7.55389388 14.6666667,7.77636769 14.6666667,8 C14.6666667,11.6818983 11.6818983,14.6666667 8,14.6666667 C6.23189007,14.6666667 4.53619732,13.9642877 3.28595479,12.7140452 C2.03571227,11.4638027 1.33333333,9.76810993 1.33333333,8 C1.33333333,4.33333333 4.31333333,1.33333333 8,1.33333333 L8,1.33333333 C8.22363231,1.33333333 8.44610612,1.3445696 8.66666667,1.36672949 L8.66666667,2.70847693 C8.44668912,2.68076722 8.22407146,2.66666667 8,2.66666667 C5.05448133,2.66666667 2.66666667,5.05448133 2.66666667,8 C2.66666667,10.9455187 5.05448133,13.3333333 8,13.3333333 C10.9455187,13.3333333 13.3333333,10.9455187 13.3333333,8 C13.3333333,7.77592854 13.3192328,7.55331088 13.2915231,7.33333333 L14.6332705,7.33333333 Z M8,11.6666667 C9.55333333,11.6666667 10.8666667,10.6933333 11.4066667,9.33333333 L4.59333333,9.33333333 C5.12666667,10.6933333 6.44666667,11.6666667 8,11.6666667 Z M10.3333333,7.33333333 C10.8856181,7.33333333 11.3333333,6.88561808 11.3333333,6.33333333 C11.3333333,5.78104858 10.8856181,5.33333333 10.3333333,5.33333333 C9.78104858,5.33333333 9.33333333,5.78104858 9.33333333,6.33333333 C9.33333333,6.88561808 9.78104858,7.33333333 10.3333333,7.33333333 L10.3333333,7.33333333 Z M5.66666667,7.33333333 C6.21895142,7.33333333 6.66666667,6.88561808 6.66666667,6.33333333 C6.66666667,5.78104858 6.21895142,5.33333333 5.66666667,5.33333333 C5.11438192,5.33333333 4.66666667,5.78104858 4.66666667,6.33333333 C4.66666667,6.88561808 5.11438192,7.33333333 5.66666667,7.33333333 Z"
                      id="Combined-Shape"
                      fill="#667c99"
                    />
                  </g>
                  <g id="Group-15" transform="translate(10.666667, 0.000000)" fill="#667c99">
                    <polygon
                      id="Path"
                      points="3.33333333 2 3.33333333 0 2 0 2 2 0 2 0 3.33333333 2 3.33333333 2 5.33333333 3.33333333 5.33333333 3.33333333 3.33333333 5.33333333 3.33333333 5.33333333 2"
                    />
                  </g>
                </g>
              </g>
            </g>
          </svg>
        </span>
      </Button>
    );
  }

  react(reaction, e) {
    e.target.blur();

    const allowAnonymous = app.forum.attribute('fofReactionsAllowAnonymous');

    if (!app.session.user && !allowAnonymous) {
      app.modal.show(LogInModal);
      return;
    }

    if (!this.post.canReact()) {
      return app.alerts.show({ type: 'error' }, app.translator.trans('core.lib.error.permission_denied_message'));
    }

    const id = !reaction ? null : reaction.id();
    const originalPostReactions = this.post.reactionCounts();

    this.loading[id] = true;

    return this.post
      .save({ reaction: id })
      .then((post) => {
        delete this.loading[id];

        for (const reactionId in originalPostReactions) {
          if (!post.reactionCounts().hasOwnProperty(reactionId)) {
            app.store.remove(app.store.getById('reactions', reactionId));
          }
        }

        this.updateChosenReaction();

        if (
          (app.forum.data.relationships.ranks !== undefined &&
            (app.forum.attribute('ReactionConverts')[0] === reaction || app.forum.attribute('ReactionConverts')[1] === reaction)) ||
          (this.post.data.relationships.likes !== undefined && app.forum.attribute('ReactionConverts')[2] === reaction)
        ) {
          app.alerts.show(
            { type: 'warning' },
            app.translator.trans('fof-reactions.forum.warning', {
              reaction,
            })
          );
        }

        m.redraw();
      })
      .catch((err) => {
        delete this.loading[id];

        $('body').append(err);

        m.redraw();
      });
  }

  updateChosenReaction() {
    return (this.reaction = this.post.userReaction());
  }
}
