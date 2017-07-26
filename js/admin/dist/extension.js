"use strict";

System.register("reflar/reactions/addSettingsPage", ["flarum/extend", "flarum/components/AdminNav", "flarum/components/AdminLinkButton", "reflar/reactions/components/SettingsPage"], function (_export, _context) {
  "use strict";

  var extend, AdminNav, AdminLinkButton, SettingsPage;

  _export("default", function () {
    app.routes['reflar-reactions'] = { path: '/reflar/reactions', component: SettingsPage.component() };

    app.extensionSettings['reflar-reactions'] = function () {
      return m.route(app.route('reflar-reactions'));
    };

    extend(AdminNav.prototype, 'items', function (items) {
      items.add('reflar-reactions', AdminLinkButton.component({
        href: app.route('reflar-reactions'),
        icon: 'thumbs-up',
        children: 'Reactions',
        description: app.translator.trans('reflar-reactions.admin.nav.desc')
      }));
    });
  });

  return {
    setters: [function (_flarumExtend) {
      extend = _flarumExtend.extend;
    }, function (_flarumComponentsAdminNav) {
      AdminNav = _flarumComponentsAdminNav.default;
    }, function (_flarumComponentsAdminLinkButton) {
      AdminLinkButton = _flarumComponentsAdminLinkButton.default;
    }, function (_reflarReactionsComponentsSettingsPage) {
      SettingsPage = _reflarReactionsComponentsSettingsPage.default;
    }],
    execute: function () {}
  };
});;
'use strict';

System.register('reflar/reactions/components/SettingsPage', ['flarum/components/Page'], function (_export, _context) {
  "use strict";

  var Page, SettingsPage;
  return {
    setters: [function (_flarumComponentsPage) {
      Page = _flarumComponentsPage.default;
    }],
    execute: function () {
      SettingsPage = function (_Page) {
        babelHelpers.inherits(SettingsPage, _Page);

        function SettingsPage() {
          babelHelpers.classCallCheck(this, SettingsPage);
          return babelHelpers.possibleConstructorReturn(this, (SettingsPage.__proto__ || Object.getPrototypeOf(SettingsPage)).apply(this, arguments));
        }

        babelHelpers.createClass(SettingsPage, [{
          key: 'init',
          value: function init() {

            this.reactions = app.store.all('reactions');

            this.settingsPrefix = 'reflar.reactions';

            var settings = app.data.settings;

            this.newReaction = {
              identifier: m.prop(''),
              type: m.prop('')
            };
          }
        }, {
          key: 'view',
          value: function view() {
            var _this2 = this;

            return m(
              'div',
              { className: 'SettingsPage' },
              m(
                'div',
                { className: 'container' },
                m(
                  'form',
                  { onsubmit: this.onsubmit.bind(this) },
                  m(
                    'fieldset',
                    { className: 'SettingsPage-reactions' },
                    m(
                      'legend',
                      null,
                      app.translator.trans('reflar-reactions.admin.page.reactions.title')
                    ),
                    m(
                      'label',
                      null,
                      app.translator.trans('reflar-reactions.admin.page.reactions.reactions')
                    ),
                    m(
                      'div',
                      { className: 'Reactions--Container' },
                      this.reactions.map(function (reaction) {
                        return [m(
                          'div',
                          null,
                          m('input', {
                            className: 'FormControl Reactions-identifier',
                            type: 'text',
                            value: reaction.identifier(),
                            placeholder: app.translator.trans('reflar-reactions.admin.page.reactions.help.identifier'),
                            oninput: m.withAttr('value', _this2.updateIdentifier.bind(_this2, reaction)) })
                        )];
                      })
                    )
                  )
                )
              )
            );
          }
        }, {
          key: 'updateIdentifier',
          value: function updateIdentifier() {}
        }, {
          key: 'onsubmit',
          value: function onsubmit() {}
        }]);
        return SettingsPage;
      }(Page);

      _export('default', SettingsPage);
    }
  };
});;
'use strict';

System.register('reflar/reactions/main', ['flarum/extend', 'flarum/app', 'flarum/components/PermissionGrid', 'reflar/reactions/addSettingsPage', 'reflar/reactions/models/Reaction'], function (_export, _context) {
  "use strict";

  var extend, app, PermissionGrid, addSettingsPage, Reaction;
  return {
    setters: [function (_flarumExtend) {
      extend = _flarumExtend.extend;
    }, function (_flarumApp) {
      app = _flarumApp.default;
    }, function (_flarumComponentsPermissionGrid) {
      PermissionGrid = _flarumComponentsPermissionGrid.default;
    }, function (_reflarReactionsAddSettingsPage) {
      addSettingsPage = _reflarReactionsAddSettingsPage.default;
    }, function (_reflarReactionsModelsReaction) {
      Reaction = _reflarReactionsModelsReaction.default;
    }],
    execute: function () {

      app.initializers.add('reflar-reactions', function () {
        app.store.models.reactions = Reaction;

        extend(PermissionGrid.prototype, 'replyItems', function (items) {
          items.add('reactPosts', {
            icon: 'thumbs-o-up',
            label: app.translator.trans('reflar-reactions.admin.permissions.react_posts_label'),
            permission: 'discussion.reactPosts'
          });
        });

        addSettingsPage();
      });
    }
  };
});