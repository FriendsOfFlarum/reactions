import { extend } from 'flarum/extend';
import AdminNav from 'flarum/components/AdminNav';
import AdminLinkButton from 'flarum/components/AdminLinkButton';
import SettingsPage from './components/SettingsPage';

export default function() {
    app.routes['reflar-reactions'] = {
        path: '/reflar/reactions',
        component: SettingsPage.component(),
    };

    app.extensionSettings['reflar-reactions'] = () => m.route(app.route('reflar-reactions'));

    extend(AdminNav.prototype, 'items', items => {
        items.add(
            'reflar-reactions',
            AdminLinkButton.component({
                href: app.route('reflar-reactions'),
                icon: 'fa fa-heart',
                children: 'Reactions',
                description: app.translator.trans('reflar-reactions.admin.nav.desc'),
            })
        );
    });
}
