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
import User from 'flarum/common/models/User';
import Reaction from '../../common/models/Reaction';
import Button from 'flarum/common/components/Button';
import Icon from 'flarum/common/components/Icon';
import Form from 'flarum/common/components/Form';
import ReactionsModalState from '../states/ReactionsModalState';
import Tooltip from 'flarum/common/components/Tooltip';
import extractText from 'flarum/common/utils/extractText';

interface ReactionsModalAttrs extends IInternalModalAttrs {
  post: Post;
}

interface ReactionGroup {
  reaction: Reaction;
  users: Record<string, User>; // postReactionId -> User
  anonymousCount: number;
}

export default class ReactionsModal extends Modal<ReactionsModalAttrs, ReactionsModalState> {
  state!: ReactionsModalState;

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

    this.state = new ReactionsModalState({
      filter: { post: this.attrs.post.id()! },
    });

    this.state.refresh();
  }

  /**
   * Build grouped reaction data from all loaded pages.
   */
  getGroups(): ReactionGroup[] {
    const allReactions = this.state.getPages().flatMap((page) => page.items as PostReaction[]);
    const grouped = groupBy(allReactions, (r: PostReaction) => r.reactionId());
    const groups: ReactionGroup[] = [];

    for (const reactionId in grouped) {
      const reaction = app.store.getById<Reaction>('reactions', reactionId);
      if (!reaction) continue;

      const users: Record<string, User> = {};
      let anonymousCount = 0;

      for (const instance of grouped[reactionId]) {
        const userId = instance.userId() as unknown as string | null;
        if (userId === null) {
          anonymousCount++;
        } else {
          const user = app.store.getById<User>('users', userId);
          if (user) users[instance.id()!] = user;
        }
      }

      groups.push({ reaction, users, anonymousCount });
    }

    return groups;
  }

  content(): Mithril.Children {
    if (this.state.isInitialLoading()) {
      return (
        <div className="Modal-body">
          <LoadingIndicator />
        </div>
      );
    }

    const groups = this.getGroups();

    if (!groups.length) {
      return (
        <div className="Modal-body ReactionsModal-empty">
          <p>{app.translator.trans('fof-reactions.forum.modal.no_reactions')}</p>
        </div>
      );
    }

    return (
      <>
        <div className="Modal-body">
          {groups.map(({ reaction, users, anonymousCount }) => this.buildReactionSection(reaction, users, anonymousCount))}
        </div>
        {this.state.hasNext() && (
          <div className="Modal-footer">
            <Form className="Form--centered">
              <div className="Form-group">
                <Button className="Button Button--block" onclick={() => this.state.loadNext()} loading={this.state.isLoadingNext()}>
                  {app.translator.trans('fof-reactions.forum.modal.load_more')}
                </Button>
              </div>
            </Form>
          </div>
        )}
      </>
    );
  }

  buildReactionSection(reaction: Reaction, users: Record<string, User>, anonymousCount: number): Mithril.Children {
    const post = this.attrs.post;
    const canDeleteReaction = (user: User) => post.canDeletePostReactions() || (post.canReact() && user === app.session.user);
    const displayName = reaction.display() || reaction.identifier();

    // Total from post counts vs how many we've loaded — gives us the overflow number
    const totalCount = (post.reactionCounts() as Record<string, number>)[reaction.id()!] ?? 0;
    const loadedCount = Object.keys(users).length + anonymousCount;
    const othersCount = totalCount - loadedCount;

    return (
      <div className="ReactionsModal-group" key={reaction.id()}>
        <div className="ReactionsModal-groupHeader">
          <ReactionComponent reaction={reaction} className="ReactionsModal-reactionIcon" />
          <span className="ReactionsModal-reactionName">{displayName}</span>
          <span className="ReactionsModal-reactionCount">{totalCount}</span>
          {post.canDeletePostReactions() && (
            <Tooltip
              text={app.translator.trans('fof-reactions.forum.modal.remove_all_reaction_type', {
                reaction: displayName,
              })}
            >
              <Button
                className="Button Button--icon Button--link ReactionsModal-deleteAll"
                loading={this.deletingType[reaction.id()!]}
                onclick={this.deletePostReaction.bind(this, false, reaction, undefined)}
                icon="fas fa-trash-alt"
              />
            </Tooltip>
          )}
        </div>

        <ul className="ReactionsModal-users">
          {Object.entries(users).map(([postReactionId, user]: [string, User]) => (
            <li key={user.id()} className="ReactionsModal-user">
              <Link href={app.route.user(user)}>
                <Avatar user={user} loading="lazy" />
                <span className="ReactionsModal-username">{username(user)}</span>
              </Link>
              {canDeleteReaction(user) && (
                <Tooltip text={app.translator.trans('fof-reactions.forum.modal.remove_user_reaction')}>
                  <Button
                    className="Button Button--icon Button--link ReactionsModal-deleteOne"
                    loading={this.deletingSpecific[postReactionId]}
                    onclick={this.deletePostReaction.bind(this, postReactionId, reaction, user)}
                    aria-label={app.translator.trans('fof-reactions.forum.modal.remove_user_reaction')}
                    icon="fas fa-times"
                  />
                </Tooltip>
              )}
            </li>
          ))}
          {anonymousCount > 0 && (
            <li className="ReactionsModal-anonymous">
              <Icon name="fas fa-user-secret" />
              <span>{app.translator.trans('fof-reactions.forum.modal.anonymous_count', { count: anonymousCount })}</span>
            </li>
          )}
          {othersCount > 0 && !this.state.hasNext() && (
            <li className="ReactionsModal-others">{app.translator.trans('fof-reactions.forum.modal.others_count', { count: othersCount })}</li>
          )}
        </ul>
      </div>
    );
  }

  async deletePostReaction(postReactionId: string | false, reaction: Reaction, user?: User): Promise<void> {
    const reactionId = reaction.id()!;
    const isSpecific = postReactionId !== false;
    const loadingArr = isSpecific ? this.deletingSpecific : this.deletingType;
    const id = isSpecific ? (postReactionId as string) : reactionId;

    const confirmationKey = isSpecific ? 'confirm_remove_user_reaction' : 'confirm_remove_all_reaction_type';

    if (
      !confirm(
        extractText(
          app.translator.trans(`fof-reactions.forum.modal.${confirmationKey}`, {
            reaction: reaction.display() || reaction.identifier(),
            user: user ?? null,
          })
        )
      )
    ) {
      return;
    }

    loadingArr[id] = true;

    const endpoint = isSpecific ? `posts/${this.attrs.post.id()}/reactions/specific/${id}` : `posts/${this.attrs.post.id()}/reactions/type/${id}`;

    await app.request({
      method: 'DELETE',
      url: `${app.forum.attribute('apiUrl')}/${endpoint}`,
    });

    // Reload from scratch so groups reflect the deletion accurately
    await this.state.refresh();

    const reactionCounts = this.attrs.post.reactionCounts() as Record<string, number>;

    if (isSpecific) {
      const postReaction = app.store.getById('post_reactions', postReactionId as string);
      if (postReaction) app.store.remove(postReaction);
      reactionCounts[reactionId] = Math.max(0, (reactionCounts[reactionId] ?? 1) - 1);
    } else {
      reactionCounts[reactionId] = 0;
    }

    delete loadingArr[id];

    m.redraw();
  }
}
