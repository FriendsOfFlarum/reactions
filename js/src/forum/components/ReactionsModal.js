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

    this.groupedReactions = groupBy(this.attrs.post.reactions().filter(Boolean), (r) => r.reactionId());

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
          {Object.keys(this.groupedReactions).map((id) => {
            const reaction = app.store.getById('reactions', id);
            const postReactions = this.groupedReactions[id];

            if (!postReactions.length) return;

            return (
              <div className="ReactionsModal-group">
                <legend>
                  <ReactionComponent reaction={reaction} className={'ReactionModal-reaction'} />

                  <label className="ReactionsModal-display">{reaction.display() || reaction.identifier()}</label>
                </legend>

                <hr className="ReactionsModal-delimiter" />

                {postReactions
                  .filter((r) => r.user())
                  .map((r) => (
                    <li>
                      <Link className="ReactionsModal-user" href={app.route.user(r.user())}>
                        {avatar(r.user(), { loading: 'lazy' })}
                        {username(r.user())}
                      </Link>
                    </li>
                  ))}
              </div>
            );
          })}
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
      .then((response) => app.store.pushPayload(response))
      .then(this.loaded.bind(this), this.loaded.bind(this));
  }
}
