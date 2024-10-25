import app from 'flarum/forum/app';
import Modal, { IInternalModalAttrs } from 'flarum/common/components/Modal';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import Avatar from 'flarum/common/components/Avatar';
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
import Button from 'flarum/common/components/Button';

interface ReactionsModalAttrs extends IInternalModalAttrs {
  post: Post;
}

interface ReactionGroup {
  reaction: Reaction;
  users: Record<string, User>; // map the post reaction id to the user
  anonymousCount: number;
}

export default class ReactionsModal extends Modal<ReactionsModalAttrs> {
  reactions: ReactionGroup[] = [];
  loading: boolean = false;

  deletingSpecific: Record<string, boolean> = {};
  deletingType: Record<string, boolean> = {};

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

          {!this.reactions.length && <p>{app.translator.trans('fof-reactions.forum.modal.no_reactions')}</p>}
        </ul>
      </div>
    );
  }

  buildReactionSection(reaction: Reaction, users: Record<string, User>, anonymousCount: number): Mithril.Children {
    const post = this.attrs.post;

    // The user can delete the reaction if they can delete reactions on the post, or
    // if they can react (i.e. modify their reaction) and it's their own reaction
    const canDeleteReaction = (user: User) => post.canDeletePostReactions() || (post.canReact() && user === app.session.user);

    return (
      <div className="ReactionsModal-group">
        <legend>
          <ReactionComponent reaction={reaction} className={'ReactionModal-reaction'} />
          <label className="ReactionsModal-display">{reaction.display() || reaction.identifier()}</label>
          {post.canDeletePostReactions() && (
            <Button
              icon="fas fa-minus-circle"
              className="Button Button--icon Button--link"
              loading={this.deletingType[reaction.id()!]}
              onclick={this.deletePostReaction.bind(this, false, reaction.id()!)}
            />
          )}
        </legend>
        <hr className="ReactionsModal-delimiter" />
        {Object.entries(users).map(([postReactionId, user]: [string, User], index: number) => (
          <li key={user.id()} data-post-reaction-id={postReactionId} data-user-id={user.id()}>
            <Link className="ReactionsModal-user" href={app.route.user(user)}>
              <Avatar user={user} loading="lazy" />
              {username(user)}
            </Link>
            {canDeleteReaction(user) && (
              <Button
                icon="fas fa-minus-circle"
                className="Button Button--icon Button--link"
                loading={this.deletingSpecific[postReactionId]}
                onclick={this.deletePostReaction.bind(this, postReactionId, reaction.id()!)}
              />
            )}
          </li>
        ))}
        {anonymousCount > 0 && <li>{app.translator.trans('fof-reactions.forum.modal.anonymous_count', { count: anonymousCount })}</li>}
      </div>
    );
  }

  async load(): Promise<void> {
    this.loading = true;

    const response = await app.store.find<ApiResponsePlural<PostReaction>>(`/posts_reactions`, {
      include: 'user,reaction',
      filter: { post: this.attrs.post.id() },
    });

    const groupedReactions = groupBy(response, (r: PostReaction) => r.reactionId());
    const reactions: ReactionGroup[] = [];

    for (let reactionId in groupedReactions) {
      const reaction = app.store.getById<Reaction>('reactions', reactionId);

      if (!reaction) {
        continue;
      }

      const users: Record<string, User> = {};
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
            users[reactionInstance.id()!] = user;
          }
        }
      }

      reactions.push({ reaction, users, anonymousCount });
    }

    this.reactions = reactions;
    this.loading = false;

    m.redraw();
  }

  async deletePostReaction(postReactionId: string | false, reactionId: string): Promise<void> {
    const isSpecific = postReactionId !== false;
    const loadingArr = isSpecific ? this.deletingSpecific : this.deletingType;
    const id = isSpecific ? postReactionId : reactionId;

    loadingArr[id] = true;

    await app.request({
      method: 'DELETE',
      url: `${app.forum.attribute('apiUrl')}/posts/${this.attrs.post.id()}/reactions/${isSpecific ? 'specific' : 'type'}/${id}`,
    });

    // Filter out the deleted reaction type
    const reaction = this.reactions.find((reaction) => reaction.reaction.id() === reactionId);

    if (isSpecific) {
      // Remove only the specific post_reaction
      const postReaction = app.store.getById('post_reactions', postReactionId);

      if (reaction) {
        delete reaction.users[postReactionId];

        // Remove reaction group if there are no more reactions of this type
        if (!Object.keys(reaction.users).length && !reaction.anonymousCount) {
          this.reactions = this.reactions.filter((r) => r.reaction.id() !== reactionId);
        }
      }

      if (postReaction) app.store.remove(postReaction);

      this.attrs.post.reactionCounts()[reactionId]--;
    } else {
      // Remove all reactions of this type
      this.reactions = this.reactions.filter((r) => r.reaction.id() !== reactionId);

      if (reaction) {
        for (const postReactionId in reaction.users) {
          const postReaction = app.store.getById('post_reactions', postReactionId);
          if (postReaction) app.store.remove(postReaction);
        }
      }

      this.attrs.post.reactionCounts()[reactionId] = 0;
    }

    delete loadingArr[id];

    m.redraw();
  }
}
