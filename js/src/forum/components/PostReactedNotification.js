import Notification from 'flarum/components/Notification';
import icon from 'flarum/helpers/icon';

import emoji from '../../common/util/emoji';

export default class PostReactedNotification extends Notification {
    icon() {
        return 'fas fa-heart';
    }

    href() {
        return app.route.post(this.props.notification.subject());
    }

    content() {
        const notification = this.props.notification;
        const { identifier, type } = JSON.parse(notification.content());
        const user = notification.fromUser();

        const reaction = type === 'emoji' ? <img src={emoji(identifier).url} height="14px" /> : icon(identifier);

        return app.translator.trans('fof-reactions.forum.notification', {
            user,
            reaction,
        });
    }

    excerpt() {
        return this.props.notification.subject().contentPlain();
    }
}
