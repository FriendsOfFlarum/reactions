import { extend } from 'flarum/common/extend';
import app from 'flarum/forum/app';
import UserPage from 'flarum/forum/components/UserPage';
import LinkButton from 'flarum/common/components/LinkButton';
import ItemList from 'flarum/common/utils/ItemList';
import type Mithril from 'mithril';

export default function addReactionsTabToUserProfile() {
  extend(UserPage.prototype, 'navItems', function (items: ItemList<Mithril.Children>) {
    const user = this.user;
    items.add(
      'reactions',
      <LinkButton href={app.route('user.reactions', { username: user?.slug() })} icon="far fa-heart">
        {app.translator.trans('fof-reactions.forum.user.reactions_link')}
      </LinkButton>,
      85
    );
  });
}
