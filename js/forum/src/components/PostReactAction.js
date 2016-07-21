import { extend } from 'flarum/extend';
import app from 'flarum/app';
import icon from 'flarum/helpers/icon';
import Component from 'flarum/Component';
import ItemList from 'flarum/utils/ItemList';
import listItems from 'flarum/helpers/listItems';
import Button from 'flarum/components/Button';

export default class PostReactAction extends Component {

  init() {

    this.post = this.props.post;
    this.reaction = this.props.reaction;
    this.isReacted = !!this.reaction;

    // FIXME: this.props.reaction is a boolean, not a string (reaction)

  }

  view() {

    return (<button className="Button Button--link Reactions--ShowReactions" type="Button" title="React">
      {!this.isReacted ? (
        <span className="Button-label">
          <svg aria-hidden="true" class="octicon octicon-plus-small add-reaction-plus-icon" height="16" version="1.1" viewBox="0 0 7 16" width="7"><path d="M4 7V4H3v3H0v1h3v3h1V8h3V7H4z"></path></svg>
          <svg aria-hidden="true" class="octicon octicon-smiley" height="16" version="1.1" viewBox="0 0 16 16" width="16">
            <path d="M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm4.81 12.81a6.72 6.72 0 0 1-2.17 1.45c-.83.36-1.72.53-2.64.53-.92 0-1.81-.17-2.64-.53-.81-.34-1.55-.83-2.17-1.45a6.773 6.773 0 0 1-1.45-2.17A6.59 6.59 0 0 1 1.21 8c0-.92.17-1.81.53-2.64.34-.81.83-1.55 1.45-2.17.62-.62 1.36-1.11 2.17-1.45A6.59 6.59 0 0 1 8 1.21c.92 0 1.81.17 2.64.53.81.34 1.55.83 2.17 1.45.62.62 1.11 1.36 1.45 2.17.36.83.53 1.72.53 2.64 0 .92-.17 1.81-.53 2.64-.34.81-.83 1.55-1.45 2.17zM4 6.8v-.59c0-.66.53-1.19 1.2-1.19h.59c.66 0 1.19.53 1.19 1.19v.59c0 .67-.53 1.2-1.19 1.2H5.2C4.53 8 4 7.47 4 6.8zm5 0v-.59c0-.66.53-1.19 1.2-1.19h.59c.66 0 1.19.53 1.19 1.19v.59c0 .67-.53 1.2-1.19 1.2h-.59C9.53 8 9 7.47 9 6.8zm4 3.2c-.72 1.88-2.91 3-5 3s-4.28-1.13-5-3c-.14-.39.23-1 .66-1h8.59c.41 0 .89.61.75 1z">
            </path>
          </svg>
        </span>
      ) : (
        <span onclick={() => this.react()}>You reacted, but I don't know how you feel :(</span>
      )}
      {!this.isReacted ? (
        <div className="CommentPost--Reactions">
          <ul class="Reactions--Ul">
            {listItems(this.getReactions().toArray())}
          </ul>
        </div>
      ) : null}
    </button>);

  }

  config(isInitialized) {
    if (isInitialized) return;

    $('.Reactions--ShowReactions').hover(() => {
      $('.Reactions--ShowReactions .CommentPost--Reactions').addClass('Reactions--Show');
    }, () => {
      $('.Reactions--ShowReactions .CommentPost--Reactions').removeClass('Reactions--Show');
    });
  }

  react(element) {
    this.isReacted = !this.isReacted;
    element = element ? element.srcElement : '';
    let reaction = element ? element.attributes["data-reaction"].value : '';

    this.post.save({ reaction }).catch(err => console.error(err));


    // We've saved the fact that we have or haven't reacted to the post,
    // but in order to provide instantaneous feedback to the user, we'll
    // need to add or remove the reaction from the relationship data
    // manually
    const data = this.post.data.relationships.reactions.data;
    data.some((reaction, i) => {
      if (reaction.id == app.session.user.id()) {
        data.splice(i, 1);
        return true
      };
    });

    if (this.isReacted) {
      data.unshift({
        type: 'users',
        id: app.session.user.id()
      });
    }

  }

  getReactions() {
    const items = new ItemList();

    items.add('thumbsup', (
      <button className="Button Button--link" type="button" title="+1" onclick={(el) => this.react(el)} data-reaction="+1">
        <span className="Button-label">
          <img alt=":+1:" class="emoji" draggable="false" src="//cdn.jsdelivr.net/emojione/assets/png/1f44d.png" data-reaction="+1" />
        </span>
      </button>
    ));
    items.add('thumbsdown', (
      <button className="Button Button--link" type="button" title="-1" onclick={(el) => this.react(el)} data-reaction="-1">
        <span className="Button-label">
          <img alt=":-1:" class="emoji" draggable="false" src="//cdn.jsdelivr.net/emojione/assets/png/1f44e.png" data-reaction="-1" />
        </span>
      </button>
    ));
    items.add('laugh', (
      <button className="Button Button--link" type="button" title="laugh" onclick={(el) => this.react(el)} data-reaction="laugh">
        <span className="Button-label">
          <img alt=":smile:" class="emoji" draggable="false" src="//cdn.jsdelivr.net/emojione/assets/png/1f604.png" data-reaction="laugh" />
        </span>
      </button>
    ));
    items.add('confused', (
      <button className="Button Button--link" type="button" title="confused" onclick={(el) => this.react(el)} data-reaction="confused">
        <span className="Button-label">
          <img alt=":confused:" class="emoji" draggable="false" src="//cdn.jsdelivr.net/emojione/assets/png/1f615.png" data-reaction="confused" />
        </span>
      </button>
    ));
    items.add('heart', (
      <button className="Button Button--link" type="button" title="heart" onclick={(el) => this.react(el)} data-reaction="heart">
        <span className="Button-label">
          <img alt=":heart:" class="emoji" draggable="false" src="//cdn.jsdelivr.net/emojione/assets/png/2764.png" data-reaction="heart" />
        </span>
      </button>
    ));
    items.add('tada', (
      <button className="Button Button--link" type="button" title="tada" onclick={(el) => this.react(el)} data-reaction="tada">
        <span className="Button-label">
          <img alt=":tada:" class="emoji" draggable="false" src="//cdn.jsdelivr.net/emojione/assets/png/1f389.png" data-reaction="tada" />
        </span>
      </button>
    ));

    return items;
  }


}
