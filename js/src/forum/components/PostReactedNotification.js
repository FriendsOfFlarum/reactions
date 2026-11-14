import app from 'flarum/forum/app';
import Notification from 'flarum/forum/components/Notification';
import Icon from 'flarum/common/components/Icon';

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
    // Newer notifications store { identifier, type }. Earlier versions stored the reaction model as a JSON
    // string, which the API sends wrapped in a one-element array.
    const content = notification.content();
    const { identifier, type } = Array.isArray(content) ? JSON.parse(content[0]) : content;
    const user = notification.fromUser();

    const reaction = type === 'emoji' ? <img src={emoji(identifier).url} loading="lazy" height="14px" /> : <Icon name={identifier} />;

    return app.translator.trans('fof-reactions.forum.notification', {
      user,
      reaction,
    });
  }

  excerpt() {
    return this.attrs.notification.subject().contentPlain();
  }
}
