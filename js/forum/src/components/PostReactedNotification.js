import Notification from 'flarum/components/Notification';
import username from 'flarum/helpers/username';

export default class PostReactedNotification extends Notification {
  icon() {
    return 'heart';
  }

  href() {
    return app.route.post(this.props.notification.subject());
  }

  content() {
    const notification = this.props.notification;
    const identifier = notification.content();
    const user = notification.sender();

    return `${username(user).children} reacted ${identifier} to your post`;
  }

  excerpt() {
    return this.props.notification.subject().contentPlain();
  }
}
