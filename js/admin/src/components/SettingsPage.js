// import Alert from 'flarum/components/Alert';
import Page from 'flarum/components/Page';
import Model from 'flarum/Model';
import mixin from 'flarum/utils/mixin';
import Button from "flarum/components/Button";
import saveSettings from "flarum/utils/saveSettings";
import Dropdown from "flarum/components/Dropdown";

class Reaction extends mixin(Model, {
  identifier: Model.attribute('identifier'),
  type: Model.attribute('type'),
  icon: Model.attribute('icon')
}) {}


export default class SettingsPage extends Page {

  init() {

    this.reactions = app.forum.attribute('reactions');

    this.settingsPrefix = 'reflar.reactions';

    const settings = app.data.settings;

    this.newReaction = {
      identifier: m.prop(''),
      type: m.prop(''),
      icon: m.prop(''),
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
              <br />
              <div className="Reactions--Container">
                {this.reactions.map(reaction => {
                  return [
                    <div>
                      <input
                        className="FormControl Reactions-identifier"
                        type="text"
                        value={reaction.identifier}
                        placeholder={app.translator.trans('reflar-reactions.admin.page.reactions.help.identifier')}
                        oninput={m.withAttr('value', this.updateIdentifier.bind(this, reaction))} />
                      {Dropdown.component({
                        buttonClassName: 'Select-input FormControl',
                        label: reaction.type,
                        caretIcon: 'sort',
                        children: ['emoji', 'icon'].map(label => {
                          const active = label === reaction.type;

                          return Button.component({
                            active,
                            children: label,
                            icon: active && 'check',
                            onclick: this.updateType.bind(this, reaction),
                          })
                        }),
                      })}
                    </div>
                  ]
                })}
                <div>
                  <input
                    className="FormControl Reactions-identifier"
                    type="text"
                    placeholder={app.translator.trans('reflar-reactions.admin.page.reactions.help.identifier')}
                    oninput={m.withAttr('value', this.newReaction.identifier)} />
                </div>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    )
  }

  updateIdentifier(reaction, value) {}

  updateType(reaction, value) {}

  onsubmit(reaction) {}

}
