import Notification from 'flarum/common/components/Notification';
import icon from 'flarum/common/helpers/icon';

import emoji from '../../common/util/emoji';

export default class PostReactedNotification extends Notification {
    icon() {
        return 'fas fa-heart';
    }

    href() {
        return app.route.post(this.attrs.notification.subject());
    }

    content() {
        const notification = this.attrs.notification;
        const { identifier, type } = JSON.parse(notification.content());
        const user = notification.fromUser();

        const reaction = type === 'emoji' ? <img src={emoji(identifier).url} loading="lazy" height="14px" /> : icon(identifier);

        return app.translator.trans('fof-reactions.forum.notification', {
            user,
            reaction,
        });
    }

    excerpt() {
        return this.attrs.notification.subject().contentPlain();
    }
}
