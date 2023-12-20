import app from 'flarum/forum/app';
import Modal, { IInternalModalAttrs } from 'flarum/common/components/Modal';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import avatar from 'flarum/common/helpers/avatar';
import username from 'flarum/common/helpers/username';
import Link from 'flarum/common/components/Link';
import ReactionComponent from '../../common/components/ReactionComponent';
import groupBy from '../utils/groupBy';
import type Mithril from 'mithril';
import PostReaction from '../models/PostReaction';
import Post from 'flarum/common/models/Post';
import { ApiResponsePlural } from 'flarum/common/Store';
import User from 'flarum/common/models/User';
import Reaction from '../../common/models/Reaction';

interface ReactionsModalAttrs extends IInternalModalAttrs {
  post: Post;
}

interface ReactionGroup {
  reaction: Reaction;
  users: User[];
  anonymousCount: number;
}

export default class ReactionsModal extends Modal<ReactionsModalAttrs> {
  reactions: ReactionGroup[] = [];
  loading: boolean = false;

  className() {
    return 'ReactionsModal Modal--small';
  }

  title() {
    return app.translator.trans('fof-reactions.forum.modal.title');
  }

  oninit(vnode: Mithril.Vnode<ReactionsModalAttrs>) {
    super.oninit(vnode);
    this.load();
  }

  content(): Mithril.Children {
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
          {this.reactions.map(({ reaction, users, anonymousCount }) => this.buildReactionSection(reaction, users, anonymousCount))}
        </ul>
      </div>
    );
  }

  buildReactionSection(reaction: Reaction, users: User[], anonymousCount: number): Mithril.Children {
    return (
      <div className="ReactionsModal-group">
        <legend>
          <ReactionComponent reaction={reaction} className={'ReactionModal-reaction'} />
          <label className="ReactionsModal-display">{reaction.display() || reaction.identifier()}</label>
        </legend>

        <hr className="ReactionsModal-delimiter" />

        {users.map((user: User) => (
          <li key={user.id()}>
            <Link className="ReactionsModal-user" href={app.route.user(user)}>
              {avatar(user, { loading: 'lazy' })}
              {username(user)}
            </Link>
          </li>
        ))}

        {anonymousCount > 0 && <li>{app.translator.trans('fof-reactions.forum.modal.anonymous_count', { count: anonymousCount })}</li>}
      </div>
    );
  }

  async load(): Promise<void> {
    this.loading = true;

    const response = await app.store.find<ApiResponsePlural<PostReaction>>(`/posts/${this.attrs.post.id()}/reactions`, { include: 'user,reaction' });

    const groupedReactions = groupBy(response, (r: PostReaction) => r.reactionId());
    const reactions: ReactionGroup[] = [];

    for (let reactionId in groupedReactions) {
      const reaction = app.store.getById<Reaction>('reactions', reactionId);

      if (!reaction) {
        continue;
      }

      const users: User[] = [];
      let anonymousCount = 0;

      for (let reactionInstance of groupedReactions[reactionId]) {
        const userId = reactionInstance.userId() as unknown as string | null;
        if (userId === null) {
          // Check for null userId
          anonymousCount++;
        } else {
          const user = app.store.getById<User>('users', userId);
          if (user) {
            // Check for null user
            users.push(user);
          }
        }
      }

      reactions.push({ reaction, users, anonymousCount });
    }

    this.reactions = reactions;
    this.loading = false;

    m.redraw();
  }
}
