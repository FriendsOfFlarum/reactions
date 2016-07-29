'use strict';

System.register('datitisev/reactions/addReactionAction', ['flarum/extend', 'flarum/app', 'flarum/components/CommentPost', 'datitisev/reactions/components/PostReactAction'], function (_export, _context) {
    "use strict";

    var extend, app, CommentPost, PostReactAction;
    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumComponentsCommentPost) {
            CommentPost = _flarumComponentsCommentPost.default;
        }, function (_datitisevReactionsComponentsPostReactAction) {
            PostReactAction = _datitisevReactionsComponentsPostReactAction.default;
        }],
        execute: function () {
            _export('default', function () {

                extend(CommentPost.prototype, 'actionItems', function (items) {

                    var post = this.props.post;

                    if (post.isHidden() || !post.canReact()) return;

                    // TODO Get actual reaction, not boolean
                    var reaction = app.session.user && post.reactions().some(function (user) {
                        return user === app.session.user;
                    });

                    items.add('react', PostReactAction.component({
                        post: post,
                        reaction: reaction
                    }));
                });
            });
        }
    };
});;
'use strict';

System.register('datitisev/reactions/components/PostReactAction', ['flarum/extend', 'flarum/app', 'flarum/helpers/icon', 'flarum/Component', 'flarum/utils/ItemList', 'flarum/helpers/listItems', 'flarum/components/Button'], function (_export, _context) {
  "use strict";

  var extend, app, icon, Component, ItemList, listItems, Button, PostReactAction;
  return {
    setters: [function (_flarumExtend) {
      extend = _flarumExtend.extend;
    }, function (_flarumApp) {
      app = _flarumApp.default;
    }, function (_flarumHelpersIcon) {
      icon = _flarumHelpersIcon.default;
    }, function (_flarumComponent) {
      Component = _flarumComponent.default;
    }, function (_flarumUtilsItemList) {
      ItemList = _flarumUtilsItemList.default;
    }, function (_flarumHelpersListItems) {
      listItems = _flarumHelpersListItems.default;
    }, function (_flarumComponentsButton) {
      Button = _flarumComponentsButton.default;
    }],
    execute: function () {
      PostReactAction = function (_Component) {
        babelHelpers.inherits(PostReactAction, _Component);

        function PostReactAction() {
          babelHelpers.classCallCheck(this, PostReactAction);
          return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(PostReactAction).apply(this, arguments));
        }

        babelHelpers.createClass(PostReactAction, [{
          key: 'init',
          value: function init() {

            this.post = this.props.post;
            this.reaction = this.props.reaction;
            this.isReacted = !!this.reaction;

            // FIXME: this.props.reaction is a boolean, not a string (reaction)
          }
        }, {
          key: 'view',
          value: function view() {
            var _this2 = this;

            return m(
              'button',
              { className: 'Button Button--link Reactions--ShowReactions', type: 'Button', title: 'React' },
              !this.isReacted ? m(
                'span',
                { className: 'Button-label' },
                m(
                  'svg',
                  { 'aria-hidden': 'true', 'class': 'octicon octicon-plus-small add-reaction-plus-icon', height: '16', version: '1.1', viewBox: '0 0 7 16', width: '7' },
                  m('path', { d: 'M4 7V4H3v3H0v1h3v3h1V8h3V7H4z' })
                ),
                m(
                  'svg',
                  { 'aria-hidden': 'true', 'class': 'octicon octicon-smiley', height: '16', version: '1.1', viewBox: '0 0 16 16', width: '16' },
                  m('path', { d: 'M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm4.81 12.81a6.72 6.72 0 0 1-2.17 1.45c-.83.36-1.72.53-2.64.53-.92 0-1.81-.17-2.64-.53-.81-.34-1.55-.83-2.17-1.45a6.773 6.773 0 0 1-1.45-2.17A6.59 6.59 0 0 1 1.21 8c0-.92.17-1.81.53-2.64.34-.81.83-1.55 1.45-2.17.62-.62 1.36-1.11 2.17-1.45A6.59 6.59 0 0 1 8 1.21c.92 0 1.81.17 2.64.53.81.34 1.55.83 2.17 1.45.62.62 1.11 1.36 1.45 2.17.36.83.53 1.72.53 2.64 0 .92-.17 1.81-.53 2.64-.34.81-.83 1.55-1.45 2.17zM4 6.8v-.59c0-.66.53-1.19 1.2-1.19h.59c.66 0 1.19.53 1.19 1.19v.59c0 .67-.53 1.2-1.19 1.2H5.2C4.53 8 4 7.47 4 6.8zm5 0v-.59c0-.66.53-1.19 1.2-1.19h.59c.66 0 1.19.53 1.19 1.19v.59c0 .67-.53 1.2-1.19 1.2h-.59C9.53 8 9 7.47 9 6.8zm4 3.2c-.72 1.88-2.91 3-5 3s-4.28-1.13-5-3c-.14-.39.23-1 .66-1h8.59c.41 0 .89.61.75 1z' })
                )
              ) : m(
                'span',
                { onclick: function onclick() {
                    return _this2.react();
                  } },
                'You reacted, but I don\'t know how you feel :('
              ),
              !this.isReacted ? m(
                'div',
                { className: 'CommentPost--Reactions' },
                m(
                  'ul',
                  { 'class': 'Reactions--Ul' },
                  listItems(this.getReactions().toArray())
                )
              ) : null
            );
          }
        }, {
          key: 'config',
          value: function config(isInitialized) {
            if (isInitialized) return;

            $('.Reactions--ShowReactions').hover(function () {
              $('.Reactions--ShowReactions .CommentPost--Reactions').addClass('Reactions--Show');
            }, function () {
              $('.Reactions--ShowReactions .CommentPost--Reactions').removeClass('Reactions--Show');
            });
          }
        }, {
          key: 'react',
          value: function react(element) {
            this.isReacted = !this.isReacted;
            element = element ? element.srcElement : '';
            var reaction = element ? element.attributes["data-reaction"].value : '';

            this.post.save({ reaction: reaction }).catch(function (err) {
              return console.error(err);
            });

            // We've saved the fact that we have or haven't reacted to the post,
            // but in order to provide instantaneous feedback to the user, we'll
            // need to add or remove the reaction from the relationship data
            // manually
            var data = this.post.data.relationships.reactions.data;
            data.some(function (reaction, i) {
              if (reaction.id == app.session.user.id()) {
                data.splice(i, 1);
                return true;
              };
            });

            if (this.isReacted) {
              data.unshift({
                type: 'users',
                id: app.session.user.id()
              });
            }
          }
        }, {
          key: 'getReactions',
          value: function getReactions() {
            var _this3 = this;

            var items = new ItemList();

            items.add('thumbsup', m(
              'button',
              { className: 'Button Button--link', type: 'button', title: '+1', onclick: function onclick(el) {
                  return _this3.react(el);
                }, 'data-reaction': '+1' },
              m(
                'span',
                { className: 'Button-label' },
                m('img', { alt: ':+1:', 'class': 'emoji', draggable: 'false', src: '//cdn.jsdelivr.net/emojione/assets/png/1f44d.png', 'data-reaction': '+1' })
              )
            ));
            items.add('thumbsdown', m(
              'button',
              { className: 'Button Button--link', type: 'button', title: '-1', onclick: function onclick(el) {
                  return _this3.react(el);
                }, 'data-reaction': '-1' },
              m(
                'span',
                { className: 'Button-label' },
                m('img', { alt: ':-1:', 'class': 'emoji', draggable: 'false', src: '//cdn.jsdelivr.net/emojione/assets/png/1f44e.png', 'data-reaction': '-1' })
              )
            ));
            items.add('laugh', m(
              'button',
              { className: 'Button Button--link', type: 'button', title: 'laugh', onclick: function onclick(el) {
                  return _this3.react(el);
                }, 'data-reaction': 'laugh' },
              m(
                'span',
                { className: 'Button-label' },
                m('img', { alt: ':smile:', 'class': 'emoji', draggable: 'false', src: '//cdn.jsdelivr.net/emojione/assets/png/1f604.png', 'data-reaction': 'laugh' })
              )
            ));
            items.add('confused', m(
              'button',
              { className: 'Button Button--link', type: 'button', title: 'confused', onclick: function onclick(el) {
                  return _this3.react(el);
                }, 'data-reaction': 'confused' },
              m(
                'span',
                { className: 'Button-label' },
                m('img', { alt: ':confused:', 'class': 'emoji', draggable: 'false', src: '//cdn.jsdelivr.net/emojione/assets/png/1f615.png', 'data-reaction': 'confused' })
              )
            ));
            items.add('heart', m(
              'button',
              { className: 'Button Button--link', type: 'button', title: 'heart', onclick: function onclick(el) {
                  return _this3.react(el);
                }, 'data-reaction': 'heart' },
              m(
                'span',
                { className: 'Button-label' },
                m('img', { alt: ':heart:', 'class': 'emoji', draggable: 'false', src: '//cdn.jsdelivr.net/emojione/assets/png/2764.png', 'data-reaction': 'heart' })
              )
            ));
            items.add('tada', m(
              'button',
              { className: 'Button Button--link', type: 'button', title: 'tada', onclick: function onclick(el) {
                  return _this3.react(el);
                }, 'data-reaction': 'tada' },
              m(
                'span',
                { className: 'Button-label' },
                m('img', { alt: ':tada:', 'class': 'emoji', draggable: 'false', src: '//cdn.jsdelivr.net/emojione/assets/png/1f389.png', 'data-reaction': 'tada' })
              )
            ));

            return items;
          }
        }]);
        return PostReactAction;
      }(Component);

      _export('default', PostReactAction);
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

            return username(user).children + ' reacted to your post';
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