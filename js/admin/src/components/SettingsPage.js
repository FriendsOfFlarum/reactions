// import Alert from 'flarum/components/Alert';
import Page from 'flarum/components/Page';
import Button from "flarum/components/Button";
import Select from "flarum/components/Select";

export default class SettingsPage extends Page {

    init() {
        this.reactions = app.forum.attribute('reactions');

        this.settingsPrefix = 'reflar.reactions';

        const settings = app.data.settings;

        this.newReaction = {
            identifier: m.prop(''),
            type: m.prop('icon'),
        }

    }

    /**
     * @returns {*}
     */
    view() {
        return (
            <div className="SettingsPage">
                <div className="container">
                    <form onsubmit={this.onsubmit.bind(this)}>
                        <fieldset className="SettingsPage-reactions">
                            <legend>{app.translator.trans('reflar-reactions.admin.page.reactions.title')}</legend>
                            <label>{app.translator.trans('reflar-reactions.admin.page.reactions.reactions')}</label>
                            <br/>
                            <div className="Reactions--Container">
                                {this.reactions.map(reaction => {
                                    return [
                                        <div>
                                            <input
                                                className="FormControl Reactions-identifier"
                                                type="text"
                                                value={reaction.identifier}
                                                placeholder={app.translator.trans('reflar-reactions.admin.page.reactions.help.identifier')}
                                                oninput={m.withAttr('value', this.updateIdentifier.bind(this, reaction))}/>
                                            {Select.component({
                                                options: {emoji: 'emoji', icon: 'icon'},
                                                value: reaction.type,
                                                onchange: this.updateType.bind(this, reaction),
                                            })}
                                            {Button.component({
                                                type: 'button',
                                                className: 'Button Button--warning Reactions-button',
                                                icon: 'times',
                                                onclick: this.deleteReaction.bind(this, reaction)
                                            })}
                                        </div>
                                    ]
                                })}
                                <div>
                                    <input
                                        className="FormControl Reactions-identifier"
                                        type="text"
                                        placeholder={app.translator.trans('reflar-reactions.admin.page.reactions.help.identifier')}
                                        oninput={m.withAttr('value', this.newReaction.identifier)}/>
                                    {Select.component({
                                        options: {emoji: 'emoji', icon: 'icon'},
                                        value: this.newReaction.type(),
                                        oninput: m.withAttr('value', this.newReaction.type),
                                    })}
                                    {Button.component({
                                        type: 'button',
                                        className: 'Button Button--warning Reactions-button',
                                        icon: 'plus',
                                        onclick: this.addReaction.bind(this)
                                    })}
                                </div>
                            </div>
                        </fieldset>
                    </form>
                </div>
            </div>
        )
    }

    addReaction(reaction) {
        app.request({
            method: 'POST',
            url: app.forum.attribute('apiUrl') + '/reactions',
            data: {
                identifier: this.newReaction.identifier(),
                type: this.newReaction.type()
            }
        }).then(
            response => {
                this.reactions.push({
                    identifier: response.data.attributes.identifier,
                    type: response.data.attributes.type,
                    id: response.data.id
                });

                this.newReaction.identifier('');
                this.newReaction.type('icon');
                m.redraw();
            }
        );
    }

    updateIdentifier(reactionToUpdate, value) {
        app.request({
            method: 'PATCH',
            url: app.forum.attribute('apiUrl') + '/reactions/' + reactionToUpdate.id,
            data: {
                identifier: value
            }
        });
        this.reactions.some((reaction, i) => {
            if (reaction.id === reactionToUpdate.id) {
                reaction.identifier = value;
                return true;
            }
        })
    }

    updateType(reactionToUpdate, value) {
        app.request({
            method: 'PATCH',
            url: app.forum.attribute('apiUrl') + '/reactions/' + reactionToUpdate.id,
            data: {
                type: value
            }
        });
        this.reactions.some((reaction, i) => {
            if (reaction.id === reactionToUpdate.id) {
                reaction.type = value;
                return true;
            }
        })
    }

    deleteReaction(reactionToDelete) {
        app.request({
            method: 'DELETE',
            url: app.forum.attribute('apiUrl') + '/reactions/' + reactionToDelete.id
        });
        this.reactions.some((reaction, i) => {
            if (reaction.id === reactionToDelete.id) {
                this.reactions.splice(i, 1);
                return true;
            }
        })
    }

    onsubmit(reaction) {
    }
}
