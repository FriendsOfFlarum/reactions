'use strict';

System.register('datitisev/reactions/addReactionAction', ['flarum/extend', 'flarum/app', 'flarum/components/Button', 'flarum/components/CommentPost'], function (_export, _context) {
    "use strict";

    var extend, app, Button, CommentPost;
    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumComponentsButton) {
            Button = _flarumComponentsButton.default;
        }, function (_flarumComponentsCommentPost) {
            CommentPost = _flarumComponentsCommentPost.default;
        }],
        execute: function () {
            _export('default', function () {

                extend(CommentPost.prototype, 'actionItems', function (items) {

                    var post = this.props.post;

                    if (post.isHidden() || !post.canReact()) return;

                    var isReacted = app.session.user && post.reactions().some(function (user) {
                        return user === app.session.user;
                    });

                    items.add('react', Button.component({
                        children: isReacted ? 'Reacted!' : 'React',
                        className: 'Button Button--link',
                        onclick: function onclick() {
                            isReacted = !isReacted;

                            post.save({ isReacted: isReacted });

                            // We've saved the fact that we have or haven't reacted to the post,
                            // but in order to provide instantaneous feedback to the user, we'll
                            // need to add or remove the reaction from the relationship data
                            // manually
                            var data = post.data.relationships.reactions.data;
                            data.some(function (reaction, i) {
                                if (reaction.id == app.session.user.id()) {
                                    data.splice(i, 1);
                                    return true;
                                };
                            });

                            if (isReacted) {
                                data.unshift({
                                    type: 'users',
                                    id: app.session.user.id()
                                });
                            }
                        }
                    }));
                });
            });
        }
    };
});;
'use strict';

System.register('datitisev/reactions/components/PostReactedNotification', ['flarum/components/Notification', 'flarum/helpers/username', 'flarum/helpers/punctuateSeries'], function (_export, _context) {
  "use strict";

  var Notification, username, punctuateSeries, PostReactedNotification;
  return {
    setters: [function (_flarumComponentsNotification) {
      Notification = _flarumComponentsNotification.default;
    }, function (_flarumHelpersUsername) {
      username = _flarumHelpersUsername.default;
    }, function (_flarumHelpersPunctuateSeries) {
      punctuateSeries = _flarumHelpersPunctuateSeries.default;
    }],
    execute: function () {
      PostReactedNotification = function (_Notification) {
        babelHelpers.inherits(PostReactedNotification, _Notification);

        function PostReactedNotification() {
          babelHelpers.classCallCheck(this, PostReactedNotification);
          return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(PostReactedNotification).apply(this, arguments));
        }

        babelHelpers.createClass(PostReactedNotification, [{
          key: 'icon',
          value: function icon() {
            return 'smile-o';
          }
        }, {
          key: 'href',
          value: function href() {
            return app.route.post(this.props.notification.subject());
          }
        }, {
          key: 'content',
          value: function content() {
            var notification = this.props.notification;
            var user = notification.sender();
            var auc = notification.additionalUnreadCount();

            console.log(notification);

            // return app.translator.transChoice('flarum-likes.forum.notifications.post_likes_text', auc + 1, {
            //   user,
            //   username: auc ? punctuateSeries([
            //     username(user),
            //     app.translator.transChoice('flarum-likes.forum.notifications.others_text', auc, {count: auc})
            //   ]) : undefined
            // });

            return user.username() + ' reacted to your post';
          }
        }, {
          key: 'excerpt',
          value: function excerpt() {
            return this.props.notification.subject().contentPlain();
          }
        }]);
        return PostReactedNotification;
      }(Notification);

      _export('default', PostReactedNotification);
    }
  };
});;
'use strict';

System.register('datitisev/reactions/main', ['flarum/extend', 'flarum/app', 'flarum/models/Post', 'flarum/Model', 'flarum/components/NotificationGrid', 'datitisev/reactions/addReactionAction', 'datitisev/reactions/components/PostReactedNotification'], function (_export, _context) {
  "use strict";

  var extend, app, Post, Model, NotificationGrid, addReactionAction, PostReactedNotification;
  return {
    setters: [function (_flarumExtend) {
      extend = _flarumExtend.extend;
    }, function (_flarumApp) {
      app = _flarumApp.default;
    }, function (_flarumModelsPost) {
      Post = _flarumModelsPost.default;
    }, function (_flarumModel) {
      Model = _flarumModel.default;
    }, function (_flarumComponentsNotificationGrid) {
      NotificationGrid = _flarumComponentsNotificationGrid.default;
    }, function (_datitisevReactionsAddReactionAction) {
      addReactionAction = _datitisevReactionsAddReactionAction.default;
    }, function (_datitisevReactionsComponentsPostReactedNotification) {
      PostReactedNotification = _datitisevReactionsComponentsPostReactedNotification.default;
    }],
    execute: function () {
      // import addLikesList from 'datitisev/reactions/addLikesList';

      app.initializers.add('datitisev-reactions', function () {

        app.notificationComponents.postReacted = PostReactedNotification;

        Post.prototype.canReact = Model.attribute('canReact');
        Post.prototype.reactions = Model.hasMany('reactions');

        addReactionAction();

        extend(NotificationGrid.prototype, 'notificationTypes', function (items) {
          items.add('postReacted', {
            name: 'postReacted',
            icon: 'smile-o',
            label: app.translator.trans('flarum-likes.forum.settings.notify_post_reacted_label')
          });
        });
      });
    }
  };
});