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

System.register('datitisev/reactions/components/PostReactAction', ['flarum/Component', 'flarum/utils/ItemList', 'flarum/helpers/listItems'], function (_export, _context) {
  "use strict";

  var Component, ItemList, listItems, PostReactAction;
  return {
    setters: [function (_flarumComponent) {
      Component = _flarumComponent.default;
    }, function (_flarumUtilsItemList) {
      ItemList = _flarumUtilsItemList.default;
    }, function (_flarumHelpersListItems) {
      listItems = _flarumHelpersListItems.default;
    }],
    execute: function () {
      PostReactAction = function (_Component) {
        babelHelpers.inherits(PostReactAction, _Component);

        function PostReactAction() {
          babelHelpers.classCallCheck(this, PostReactAction);
          return babelHelpers.possibleConstructorReturn(this, (PostReactAction.__proto__ || Object.getPrototypeOf(PostReactAction)).apply(this, arguments));
        }

        babelHelpers.createClass(PostReactAction, [{
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
          key: 'getReactions',
          value: function getReactions() {
            var _this2 = this;

            var items = new ItemList();

            items.add('thumbsup', m(
              'button',
              {
                className: 'Button Button--link',
                type: 'button',
                title: '+1',
                onclick: function onclick(el) {
                  return _this2.react(el);
                },
                'data-reaction': '+1'
              },
              m(
                'span',
                { className: 'Button-label' },
                m('img', {
                  alt: ':+1:',
                  className: 'emoji',
                  draggable: 'false',
                  src: 'http://cdn.jsdelivr.net/emojione/assets/png/1f44d.png',
                  'data-reaction': '+1'
                })
              )
            ));
            items.add('thumbsdown', m(
              'button',
              {
                className: 'Button Button--link',
                type: 'button',
                title: '-1',
                onclick: function onclick(el) {
                  return _this2.react(el);
                },
                'data-reaction': '-1'
              },
              m(
                'span',
                { className: 'Button-label' },
                m('img', {
                  alt: ':-1:',
                  className: 'emoji',
                  draggable: 'false',
                  src: 'https://cdn.jsdelivr.net/emojione/assets/png/1f44e.png',
                  'data-reaction': '-1'
                })
              )
            ));
            items.add('laugh', m(
              'button',
              {
                className: 'Button Button--link',
                type: 'button',
                title: 'laugh',
                onclick: function onclick(el) {
                  return _this2.react(el);
                },
                'data-reaction': 'laugh'
              },
              m(
                'span',
                { className: 'Button-label' },
                m('img', {
                  alt: ':smile:',
                  className: 'emoji',
                  draggable: 'false',
                  src: 'https://cdn.jsdelivr.net/emojione/assets/png/1f604.png',
                  'data-reaction': 'laugh'
                })
              )
            ));
            items.add('confused', m(
              'button',
              {
                className: 'Button Button--link',
                type: 'button',
                title: 'confused',
                onclick: function onclick(el) {
                  return _this2.react(el);
                },
                'data-reaction': 'confused'
              },
              m(
                'span',
                { className: 'Button-label' },
                m('img', {
                  alt: ':confused:',
                  className: 'emoji',
                  draggable: 'false',
                  src: 'https://cdn.jsdelivr.net/emojione/assets/png/1f615.png',
                  'data-reaction': 'confused'
                })
              )
            ));
            items.add('heart', m(
              'button',
              {
                className: 'Button Button--link',
                type: 'button',
                title: 'heart',
                onclick: function onclick(el) {
                  return _this2.react(el);
                },
                'data-reaction': 'heart'
              },
              m(
                'span',
                { className: 'Button-label' },
                m('img', {
                  alt: ':heart:',
                  className: 'emoji',
                  draggable: 'false',
                  src: 'https://cdn.jsdelivr.net/emojione/assets/png/2764.png',
                  'data-reaction': 'heart'
                })
              )
            ));
            items.add('tada', m(
              'button',
              {
                className: 'Button Button--link',
                type: 'button',
                title: 'tada',
                onclick: function onclick(el) {
                  return _this2.react(el);
                },
                'data-reaction': 'tada'
              },
              m(
                'span',
                { className: 'Button-label' },
                m('img', {
                  alt: ':tada:',
                  className: 'emoji',
                  draggable: 'false',
                  src: 'https://cdn.jsdelivr.net/emojione/assets/png/1f389.png',
                  'data-reaction': 'tada'
                })
              )
            ));

            return items;
          }
        }, {
          key: 'init',
          value: function init() {
            this.post = this.props.post;

            // FIXME: this.props.reaction is a boolean, not a string (reaction)
            this.reaction = this.props.reaction;
            this.isReacted = !!this.reaction;
          }
        }, {
          key: 'view',
          value: function view() {
            var _this3 = this;

            return m(
              'button',
              {
                className: 'Button Button--link Reactions--ShowReactions',
                type: 'Button',
                title: 'React'
              },
              !this.isReacted ? m(
                'span',
                { className: 'Button-label' },
                m(
                  'svg',
                  {
                    'aria-hidden': 'true',
                    className: 'octicon octicon-plus-small add-reaction-plus-icon',
                    height: '16',
                    version: '1.1',
                    viewBox: '0 0 7 16',
                    width: '7'
                  },
                  m('path', { d: 'M4 7V4H3v3H0v1h3v3h1V8h3V7H4z' })
                ),
                'x',
                m('svg', {
                  'aria-hidden': 'true',
                  className: 'octicon octicon-smiley',
                  height: '16',
                  version: '1.1',
                  viewBox: '0 0 16 16',
                  width: '16'
                })
              ) : m(
                'button',
                { onclick: function onclick() {
                    return _this3.react();
                  } },
                'You reacted, but idk how you feel'
              ),
              !this.isReacted ? m(
                'div',
                { className: 'CommentPost--Reactions' },
                m(
                  'ul',
                  { className: 'Reactions--Ul' },
                  listItems(this.getReactions().toArray())
                )
              ) : null
            );
          }
        }, {
          key: 'react',
          value: function react(el) {
            this.isReacted = !this.isReacted;
            this.reaction = el ? el.srcElement.attributes['data-reaction'].value : '';

            this.post.save({ reaction: this.reaction }).catch(function (err) {
              return $('body').append(err);
            });

            /**
             * We've saved the fact that we have or haven't reacted to the post,
             * but in order to provide instantaneous feedback to the user, we'll
             * need to add or remove the reaction from the relationship data
             * manually
             */
            var data = this.post.data.relationships.reactions.data;
            data.some(function (reaction, i) {
              if (reaction.id === app.session.user.id()) {
                data.splice(i, 1);
                return true;
              }
              return false;
            });

            if (this.isReacted) {
              data.unshift({
                type: 'users',
                id: app.session.user.id()
              });
            }
          }
        }]);
        return PostReactAction;
      }(Component);

      _export('default', PostReactAction);
    }
  };
});;
'use strict';

System.register('datitisev/reactions/components/PostReactedNotification', ['flarum/components/Notification', 'flarum/helpers/username'], function (_export, _context) {
  "use strict";

  var Notification, username, PostReactedNotification;
  return {
    setters: [function (_flarumComponentsNotification) {
      Notification = _flarumComponentsNotification.default;
    }, function (_flarumHelpersUsername) {
      username = _flarumHelpersUsername.default;
    }],
    execute: function () {
      PostReactedNotification = function (_Notification) {
        babelHelpers.inherits(PostReactedNotification, _Notification);

        function PostReactedNotification() {
          babelHelpers.classCallCheck(this, PostReactedNotification);
          return babelHelpers.possibleConstructorReturn(this, (PostReactedNotification.__proto__ || Object.getPrototypeOf(PostReactedNotification)).apply(this, arguments));
        }

        babelHelpers.createClass(PostReactedNotification, [{
          key: 'icon',
          value: function icon() {
            return 'eye';
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
            var reaction = notification.content();
            var user = notification.sender();

            return username(user).children + ' reacted ' + reaction + ' to your post';
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