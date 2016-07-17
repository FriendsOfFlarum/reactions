'use strict';

System.register('datitisev/reactions/main', ['flarum/extend', 'flarum/app', 'flarum/components/PermissionGrid'], function (_export, _context) {
  "use strict";

  var extend, app, PermissionGrid;
  return {
    setters: [function (_flarumExtend) {
      extend = _flarumExtend.extend;
    }, function (_flarumApp) {
      app = _flarumApp.default;
    }, function (_flarumComponentsPermissionGrid) {
      PermissionGrid = _flarumComponentsPermissionGrid.default;
    }],
    execute: function () {

      app.initializers.add('datitisev-reactions', function () {
        extend(PermissionGrid.prototype, 'replyItems', function (items) {
          items.add('reactPosts', {
            icon: 'thumbs-o-up',
            label: app.translator.trans('datitisev-reactions.admin.permissions.react_posts_label'),
            permission: 'discussion.reactPosts'
          });
        });
      });
    }
  };
});