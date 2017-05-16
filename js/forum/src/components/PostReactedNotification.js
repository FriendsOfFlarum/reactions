import Notification from 'flarum/components/Notification';
import username from 'flarum/helpers/username';

export default class PostReactedNotification extends Notification {
  icon() {
    return 'eye';
  }

  href() {
    return app.route.post(this.props.notification.subject());
  }

  content() {
    const notification = this.props.notification;
    const reaction = notification.content();
    const user = notification.sender();

    return `${username(user).children} reacted ${reaction} to your post`;
  }

  excerpt() {
    return this.props.notification.subject().contentPlain();
  }
}
