import debounce from 'lodash.debounce';

import { extend } from 'flarum/common/extend';
import DiscussionPage from 'flarum/common/components/DiscussionPage';

const fetch = (postId) => app.store.find('posts', postId, { include: 'reactions' }).then(() => m.redraw());
const debounced = [];
const update = (postId) => {
    let func = debounced[postId];

    if (func) return func(postId);

    func = debounced[postId] = debounce(fetch, 1500);

    return func(postId);
};

export default () => {
    extend(DiscussionPage.prototype, 'config', function (x, isInitialized, context) {
        if (isInitialized) return;

        if (app.pusher) {
            app.pusher.then((channels) => {
                channels.main.bind('newReaction', ({ postId, reactionId }) => {
                    const reaction = app.store.getById('reactions', reactionId);
                    const post = app.store.getById('posts', postId);

                    if (!reaction || !post) return;

                    update(postId);
                });

                channels.main.bind('removedReaction', ({ userId, postId, reactionId }) => {
                    const postReaction = app.store
                        .all('post_reactions')
                        .filter((r) => r.userId() == userId && r.postId() == postId && r.reactionId() == reactionId)[0];

                    if (!postReaction) return;

                    app.store.remove(postReaction);

                    update(postId);

                    m.redraw();
                });

                extend(context, 'onunload', () => channels.main.unbind('newReaction'));
                extend(context, 'onunload', () => channels.main.unbind('removedReaction'));
            });
        }
    });
};
