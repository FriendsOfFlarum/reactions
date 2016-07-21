import Notification from 'flarum/components/Notification';
import username from 'flarum/helpers/username';
import punctuateSeries from 'flarum/helpers/punctuateSeries';

export default class PostReactedNotification extends Notification {
  icon() {
    return 'smile-o';
  }

  href() {
    return app.route.post(this.props.notification.subject());
  }

  content() {
    const notification = this.props.notification;
    const user = notification.sender();
    const auc = notification.additionalUnreadCount();

    // return app.translator.transChoice('flarum-likes.forum.notifications.post_likes_text', auc + 1, {
    //   user,
    //   username: auc ? punctuateSeries([
    //     username(user),
    //     app.translator.transChoice('flarum-likes.forum.notifications.others_text', auc, {count: auc})
    //   ]) : undefined
    // });

    return `${username(user).children} reacted to your post`;
  }

  excerpt() {
    return this.props.notification.subject().contentPlain();
  }
}
