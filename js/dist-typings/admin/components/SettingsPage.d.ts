import ExtensionPage from 'flarum/admin/components/ExtensionPage';
import Stream from 'flarum/common/utils/Stream';
import type Mithril from 'mithril';
import type Reaction from '../../common/models/Reaction';
export default class SettingsPage extends ExtensionPage {
    fields: string[];
    switches: string[];
    values: Record<string, Stream<string | boolean>>;
    reactions: Reaction[];
    settingsPrefix: string;
    newReaction: {
        identifier: Stream<string>;
        type: Stream<string>;
    };
    addLoading: boolean;
    successAlert: any;
    oninit(vnode: Mithril.Vnode): void;
    content(): JSX.Element;
    changed(): boolean;
    addReaction(): void;
    update(reaction: Reaction, key: string, value: string | boolean): void;
    deleteReaction(reactionToDelete: Reaction): void;
    onsubmit(e: SubmitEvent): void;
    isExtEnabled(name: string): boolean;
    addPrefix(key: string): string;
    prepareSubmissionData(): Record<string, string | boolean>;
}
