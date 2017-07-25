'use strict';

System.register('reflar/reactions/addReactionAction', ['flarum/extend', 'flarum/app', 'flarum/components/CommentPost', 'reflar/reactions/components/PostReactAction'], function (_export, _context) {
  "use strict";

  var extend, app, CommentPost, PostReactAction;
  return {
    setters: [function (_flarumExtend) {
      extend = _flarumExtend.extend;
    }, function (_flarumApp) {
      app = _flarumApp.default;
    }, function (_flarumComponentsCommentPost) {
      CommentPost = _flarumComponentsCommentPost.default;
    }, function (_reflarReactionsComponentsPostReactAction) {
      PostReactAction = _reflarReactionsComponentsPostReactAction.default;
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
"use strict";

System.register("reflar/reactions/components/PostReactAction", ["flarum/Component", "flarum/utils/ItemList", "flarum/helpers/listItems"], function (_export, _context) {
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
                    key: "config",
                    value: function config(isInitialized) {
                        if (isInitialized) return;

                        $('.Reactions--ShowReactions').hover(function () {
                            $(this).find('.CommentPost--Reactions').addClass('Reactions--Show');
                        }, function () {
                            $(this).find('.CommentPost--Reactions').removeClass('Reactions--Show');
                        });
                    }
                }, {
                    key: "getReactions",
                    value: function getReactions() {
                        var _this2 = this;

                        var items = new ItemList();

                        items.add('thumbsup', m(
                            "button",
                            {
                                className: "Button Button--link",
                                type: "button",
                                title: "thumbsup",
                                onclick: function onclick(el) {
                                    return _this2.react(el);
                                },
                                "data-reaction": "thumbsup"
                            },
                            m(
                                "span",
                                { className: "Button-label" },
                                m("img", {
                                    alt: ":+1:",
                                    className: "emoji",
                                    draggable: "false",
                                    src: "http://cdn.jsdelivr.net/emojione/assets/png/1f44d.png",
                                    "data-reaction": "thumbsup"
                                })
                            )
                        ));
                        items.add('thumbsdown', m(
                            "button",
                            {
                                className: "Button Button--link",
                                type: "button",
                                title: "thumbsdown",
                                onclick: function onclick(el) {
                                    return _this2.react(el);
                                },
                                "data-reaction": "thumbsdown"
                            },
                            m(
                                "span",
                                { className: "Button-label" },
                                m("img", {
                                    alt: ":-1:",
                                    className: "emoji",
                                    draggable: "false",
                                    src: "https://cdn.jsdelivr.net/emojione/assets/png/1f44e.png",
                                    "data-reaction": "thumbsdown"
                                })
                            )
                        ));
                        items.add('laugh', m(
                            "button",
                            {
                                className: "Button Button--link",
                                type: "button",
                                title: "laugh",
                                onclick: function onclick(el) {
                                    return _this2.react(el);
                                },
                                "data-reaction": "laugh"
                            },
                            m(
                                "span",
                                { className: "Button-label" },
                                m("img", {
                                    alt: ":smile:",
                                    className: "emoji",
                                    draggable: "false",
                                    src: "https://cdn.jsdelivr.net/emojione/assets/png/1f604.png",
                                    "data-reaction": "laugh"
                                })
                            )
                        ));
                        items.add('confused', m(
                            "button",
                            {
                                className: "Button Button--link",
                                type: "button",
                                title: "confused",
                                onclick: function onclick(el) {
                                    return _this2.react(el);
                                },
                                "data-reaction": "confused"
                            },
                            m(
                                "span",
                                { className: "Button-label" },
                                m("img", {
                                    alt: ":confused:",
                                    className: "emoji",
                                    draggable: "false",
                                    src: "https://cdn.jsdelivr.net/emojione/assets/png/1f615.png",
                                    "data-reaction": "confused"
                                })
                            )
                        ));
                        items.add('heart', m(
                            "button",
                            {
                                className: "Button Button--link",
                                type: "button",
                                title: "heart",
                                onclick: function onclick(el) {
                                    return _this2.react(el);
                                },
                                "data-reaction": "heart"
                            },
                            m(
                                "span",
                                { className: "Button-label" },
                                m("img", {
                                    alt: ":heart:",
                                    className: "emoji",
                                    draggable: "false",
                                    src: "https://cdn.jsdelivr.net/emojione/assets/png/2764.png",
                                    "data-reaction": "heart"
                                })
                            )
                        ));
                        items.add('tada', m(
                            "button",
                            {
                                className: "Button Button--link",
                                type: "button",
                                title: "tada",
                                onclick: function onclick(el) {
                                    return _this2.react(el);
                                },
                                "data-reaction": "tada"
                            },
                            m(
                                "span",
                                { className: "Button-label" },
                                m("img", {
                                    alt: ":tada:",
                                    className: "emoji",
                                    draggable: "false",
                                    src: "https://cdn.jsdelivr.net/emojione/assets/png/1f389.png",
                                    "data-reaction": "tada"
                                })
                            )
                        ));

                        return items;
                    }
                }, {
                    key: "init",
                    value: function init() {
                        var _this3 = this;

                        this.post = this.props.post;

                        this.reaction = app.session.user && this.post.reactions().filter(function (reaction) {
                            return reaction.user_id() == app.session.user.data.id;
                        })[0];

                        this.reacted = {};

                        this.names = {
                            thumbsup: "1f44d.png",
                            thumbsdown: "1f44e.png",
                            laugh: "1f604.png",
                            confused: "1f615.png",
                            heart: "2764.png",
                            tada: "1f389.png"
                        };

                        var reactions = this.post.reactions();

                        Object.keys(this.names).forEach(function (reaction) {
                            _this3.reacted[reaction] = reactions.filter(function (e) {
                                return e.identifier() === reaction;
                            });
                        });
                    }
                }, {
                    key: "view",
                    value: function view() {
                        var _this4 = this;

                        return m(
                            "button",
                            {
                                className: "Button Button--link Reactions--ShowReactions",
                                type: "Button",
                                title: "React"
                            },
                            !this.reaction ? m(
                                "span",
                                { className: "Button-label" },
                                m(
                                    "svg",
                                    { "class": "button-react", width: "20px", height: "20px", viewBox: "0 0 18 18" },
                                    "/* Generator: Sketch 40.3 (33839) - http://www.bohemiancoding.com/sketch */",
                                    m(
                                        "g",
                                        { id: "Page-1", stroke: "none", "stroke-width": "1", fill: "none", "fill-rule": "evenodd" },
                                        m(
                                            "g",
                                            { id: "ic_reactions_grey_16px" },
                                            m(
                                                "g",
                                                { id: "Group-2" },
                                                m(
                                                    "g",
                                                    { id: "0:0:0:0" },
                                                    m("rect", { id: "Rectangle-5", x: "0", y: "0", width: "18", height: "18" }),
                                                    m("g", { id: "emoticon" }),
                                                    m("path", { d: "M14.6332705,7.33333333 C14.6554304,7.55389388 14.6666667,7.77636769 14.6666667,8 C14.6666667,11.6818983 11.6818983,14.6666667 8,14.6666667 C6.23189007,14.6666667 4.53619732,13.9642877 3.28595479,12.7140452 C2.03571227,11.4638027 1.33333333,9.76810993 1.33333333,8 C1.33333333,4.33333333 4.31333333,1.33333333 8,1.33333333 L8,1.33333333 C8.22363231,1.33333333 8.44610612,1.3445696 8.66666667,1.36672949 L8.66666667,2.70847693 C8.44668912,2.68076722 8.22407146,2.66666667 8,2.66666667 C5.05448133,2.66666667 2.66666667,5.05448133 2.66666667,8 C2.66666667,10.9455187 5.05448133,13.3333333 8,13.3333333 C10.9455187,13.3333333 13.3333333,10.9455187 13.3333333,8 C13.3333333,7.77592854 13.3192328,7.55331088 13.2915231,7.33333333 L14.6332705,7.33333333 Z M8,11.6666667 C9.55333333,11.6666667 10.8666667,10.6933333 11.4066667,9.33333333 L4.59333333,9.33333333 C5.12666667,10.6933333 6.44666667,11.6666667 8,11.6666667 Z M10.3333333,7.33333333 C10.8856181,7.33333333 11.3333333,6.88561808 11.3333333,6.33333333 C11.3333333,5.78104858 10.8856181,5.33333333 10.3333333,5.33333333 C9.78104858,5.33333333 9.33333333,5.78104858 9.33333333,6.33333333 C9.33333333,6.88561808 9.78104858,7.33333333 10.3333333,7.33333333 L10.3333333,7.33333333 Z M5.66666667,7.33333333 C6.21895142,7.33333333 6.66666667,6.88561808 6.66666667,6.33333333 C6.66666667,5.78104858 6.21895142,5.33333333 5.66666667,5.33333333 C5.11438192,5.33333333 4.66666667,5.78104858 4.66666667,6.33333333 C4.66666667,6.88561808 5.11438192,7.33333333 5.66666667,7.33333333 Z", id: "Combined-Shape", fill: "#667c99" })
                                                ),
                                                m(
                                                    "g",
                                                    { id: "Group-15", transform: "translate(10.666667, 0.000000)", fill: "#667c99" },
                                                    m("polygon", { id: "Path", points: "3.33333333 2 3.33333333 0 2 0 2 2 0 2 0 3.33333333 2 3.33333333 2 5.33333333 3.33333333 5.33333333 3.33333333 3.33333333 5.33333333 3.33333333 5.33333333 2" })
                                                )
                                            )
                                        )
                                    )
                                )
                            ) : '',
                            Object.keys(this.reacted).map(function (identifier) {
                                var count = _this4.reacted[identifier].length;

                                if (count === 0) return;

                                return [m(
                                    "span",
                                    { className: "Button-label " + _this4.realCount, onclick: function onclick(el) {
                                            return _this4.react(_this4.reaction ? identifier : el);
                                        }, "data-reaction": identifier },
                                    m("img", {
                                        alt: identifier,
                                        className: "emoji button-emoji",
                                        draggable: "false",
                                        src: "https://cdn.jsdelivr.net/emojione/assets/png/" + _this4.names[identifier],
                                        "data-reaction": identifier
                                    }),
                                    count > 1 ? count : ''
                                )];
                            }),
                            !this.reaction ? m(
                                "div",
                                { className: "CommentPost--Reactions" },
                                m(
                                    "ul",
                                    { className: "Reactions--Ul" },
                                    listItems(this.getReactions().toArray())
                                )
                            ) : null
                        );
                    }
                }, {
                    key: "react",
                    value: function react(el) {
                        var _this5 = this;

                        var isReacted = true;

                        if (typeof el === 'string') {
                            isReacted = false;
                        }

                        var reaction = el && el.srcElement && el.srcElement.attributes['data-reaction'] ? el.srcElement.attributes['data-reaction'].value : '';

                        if (reaction === "") {
                            reaction = el;
                        }

                        this.post.save({ reaction: reaction }).then(function () {
                            var identifier = _this5.reaction && _this5.reaction.identifier();
                            _this5.reaction = _this5.post.reactions().filter(function (r) {
                                return r.user_id() == app.session.user.data.id;
                            })[0];

                            /**
                             * We've saved the fact that we have or haven't reacted to the post,
                             * but in order to provide instantaneous feedback to the user, we'll
                             * need to add or remove the reaction from the current ones manually
                             */

                            if (isReacted) {
                                _this5.reacted[reaction].push(_this5.reaction);
                            } else {
                                _this5.reacted[identifier] = _this5.reacted[identifier].filter(function (r) {
                                    return r.user_id() != app.session.user.id();
                                });
                            }

                            m.redraw();
                        }).catch(function (err) {
                            return $('body').append(err);
                        });
                    }
                }]);
                return PostReactAction;
            }(Component);

            _export("default", PostReactAction);
        }
    };
});;
'use strict';

System.register('reflar/reactions/components/PostReactedNotification', ['flarum/components/Notification', 'flarum/helpers/username'], function (_export, _context) {
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

System.register('reflar/reactions/main', ['flarum/extend', 'flarum/app', 'flarum/models/Post', 'flarum/Model', 'flarum/components/NotificationGrid', 'reflar/reactions/addReactionAction', 'reflar/reactions/components/PostReactedNotification', 'reflar/reactions/models/Reaction'], function (_export, _context) {
  "use strict";

  var extend, app, Post, Model, NotificationGrid, addReactionAction, PostReactedNotification, Reaction;
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
    }, function (_reflarReactionsAddReactionAction) {
      addReactionAction = _reflarReactionsAddReactionAction.default;
    }, function (_reflarReactionsComponentsPostReactedNotification) {
      PostReactedNotification = _reflarReactionsComponentsPostReactedNotification.default;
    }, function (_reflarReactionsModelsReaction) {
      Reaction = _reflarReactionsModelsReaction.default;
    }],
    execute: function () {

      app.initializers.add('reflar-reactions', function () {
        app.store.models.reactions = Reaction;

        app.notificationComponents.postReacted = PostReactedNotification;

        Post.prototype.canReact = Model.attribute('canReact');
        Post.prototype.reactions = Model.hasMany('reactions');

        addReactionAction();

        extend(NotificationGrid.prototype, 'notificationTypes', function (items) {
          items.add('postReacted', {
            name: 'postReacted',
            icon: 'eye',
            label: app.translator.trans('flarum-likes.forum.settings.notify_post_reacted_label')
          });
        });
      });
      // import addLikesList from 'reflar/reactions/addLikesList';
    }
  };
});;
'use strict';

System.register('reflar/reactions/models/Reaction', ['flarum/Model', 'flarum/utils/mixin'], function (_export, _context) {
    "use strict";

    var Model, mixin, Reaction;
    return {
        setters: [function (_flarumModel) {
            Model = _flarumModel.default;
        }, function (_flarumUtilsMixin) {
            mixin = _flarumUtilsMixin.default;
        }],
        execute: function () {
            Reaction = function (_mixin) {
                babelHelpers.inherits(Reaction, _mixin);

                function Reaction() {
                    babelHelpers.classCallCheck(this, Reaction);
                    return babelHelpers.possibleConstructorReturn(this, (Reaction.__proto__ || Object.getPrototypeOf(Reaction)).apply(this, arguments));
                }

                return Reaction;
            }(mixin(Model, {
                identifier: Model.attribute('identifier'),
                type: Model.attribute('type'),
                user_id: Model.attribute('user_id'),
                post_id: Model.attribute('post_id')
            }));

            _export('default', Reaction);
        }
    };
});
