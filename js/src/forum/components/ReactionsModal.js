import app from 'flarum/forum/app';
import Modal from 'flarum/common/components/Modal';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import avatar from 'flarum/common/helpers/avatar';
import username from 'flarum/common/helpers/username';
import Link from 'flarum/common/components/Link';
import ReactionComponent from '../../common/components/ReactionComponent';
import groupBy from '../utils/groupBy';

export default class ReactionsModal extends Modal {
  className() {
    return 'ReactionsModal Modal--small';
  }

  title() {
    return app.translator.trans('fof-reactions.forum.modal.title');
  }

  oninit(vnode) {
    super.oninit(vnode);
    this.loading = true;

    this.load();
  }

  content() {
    if (this.loading) {
      return (
        <div className="Modal-body">
          <LoadingIndicator />
        </div>
      );
    }

    return (
      <div className="Modal-body">
        <ul className="ReactionsModal-list">
          {this.reactions.map(({ reaction, users, anonymousCount }) => (
            <div className="ReactionsModal-group">
              <legend>
                <ReactionComponent reaction={reaction} className={'ReactionModal-reaction'} />

                <label className="ReactionsModal-display">{reaction.display() || reaction.identifier()}</label>
              </legend>

              <hr className="ReactionsModal-delimiter" />

              {users.filter(Boolean).map((user) => (
                <li>
                  <Link className="ReactionsModal-user" href={app.route.user(user)}>
                    {avatar(user, { loading: 'lazy' })}
                    {username(user)}
                  </Link>
                </li>
              ))}

              {anonymousCount > 0 && <li>{app.translator.trans('fof-reactions.forum.modal.anonymous_count', { count: anonymousCount })}</li>}
            </div>
          ))}
        </ul>
      </div>
    );
  }

  load() {
    return app
      .request({
        method: 'GET',
        url: app.forum.attribute('apiUrl') + this.attrs.post.apiEndpoint() + '/reactions',
        params: { include: 'user' },
      })
      .then((response) => {
        this.reactions = this.processResponse(response);
        this.loading = false;
        m.redraw();
      });
  }

  processResponse(response) {
    const reactions = [];

    const groupedReactions = groupBy(response.data, (r) => r.attributes.reactionId);

    for (let reactionId in groupedReactions) {
      const reaction = app.store.getById('reactions', reactionId);
      const users = [];
      let anonymousCount = 0;

      for (let reaction of groupedReactions[reactionId]) {
        const userId = reaction.attributes.userId;
        if (userId === null) {
          // Check for null userId
          anonymousCount++;
        } else {
          const user = app.store.getById('users', userId);
          if (user) {
            // Check for null user
            users.push(user);
          }
        }
      }

      reactions.push({ reaction, users, anonymousCount });
    }

    return reactions;
  }
}
