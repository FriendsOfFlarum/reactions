import { extend } from 'flarum/extend';

import DiscussionPage from 'flarum/components/DiscussionPage';

export default () => {
    extend(DiscussionPage.prototype, 'config', function (x, isInitialized, context) {
        if (isInitialized) return;

        if (app.pusher) {
            app.pusher.then((channels) => {
                channels.main.bind('newReaction', ({ id, userId, postId, reactionId }) => {
                    const reaction = app.store.getById('reactions', reactionId);
                    const post = app.store.getById('posts', postId);

                    if (!reaction || !post) return;

                    app.store.pushObject({
                        type: 'post_reactions',
                        id,
                        attributes: {
                            userId,
                            postId,
                            reactionId,
                        },
                        relationships: {
                            user: {
                                data: {
                                    type: 'users',
                                    id: userId,
                                },
                            },
                            reaction: {
                                data: {
                                    type: 'reactions',
                                    id: reactionId,
                                },
                            },
                            post: {
                                data: {
                                    type: 'posts',
                                    id: postId,
                                },
                            },
                        },
                    });

                    if (!post.data.relationships) post.data.relationships = {};
                    if (!post.data.relationships.post_reactions) post.data.relationships.post_reactions = { data: [] };

                    post.data.relationships.post_reactions.data.push({
                        type: 'post_reactions',
                        id,
                    });

                    app.store.pushObject(post.data);

                    m.redraw();
                });

                channels.main.bind('removedReaction', ({ userId, postId, reactionId }) => {
                    const postReaction = app.store
                        .all('post_reactions')
                        .filter((r) => r.userId() == userId && r.postId() == postId && r.reactionId() == reactionId)[0];

                    if (!postReaction) return;

                    app.store.remove(postReaction);

                    m.redraw();
                });

                extend(context, 'onunload', () => channels.main.unbind('newReaction'));
                extend(context, 'onunload', () => channels.main.unbind('removedReaction'));
            });
        }
    });
};
