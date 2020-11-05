import { extend } from 'flarum/extend';
import AdminNav from 'flarum/components/AdminNav';
import AdminLinkButton from 'flarum/components/AdminLinkButton';
import SettingsPage from './components/SettingsPage';

export default function () {
    app.routes['fof-reactions'] = {
        path: '/fof/reactions',
        component: SettingsPage,
    };

    app.extensionSettings['fof-reactions'] = () => m.route.set(app.route('fof-reactions'));

    extend(AdminNav.prototype, 'items', (items) => {
        items.add(
            'fof-reactions',
            AdminLinkButton.component({
                href: app.route('fof-reactions'),
                icon: 'fa fa-heart',
                description: app.translator.trans('fof-reactions.admin.nav.desc'),
            }, 'Reactions')
        );
    });
}
