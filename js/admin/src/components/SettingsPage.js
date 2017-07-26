// import Alert from 'flarum/components/Alert';
import Page from 'flarum/components/Page';
// import Button from "flarum/components/Button";
// import UploadImageButton from 'flarum/components/UploadImageButton';
// import saveSettings from "flarum/utils/saveSettings";
// import Switch from "flarum/components/Switch";

export default class SettingsPage extends Page {

  init() {

    this.reactions = app.store.all('reactions');

    this.settingsPrefix = 'reflar.reactions';

    const settings = app.data.settings;

    this.newReaction = {
      identifier: m.prop(''),
      type: m.prop(''),
      // image: m.prop('')
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
              <div className="Reactions--Container">
                {this.reactions.map(reaction => {
                  return [
                    <div>
                      <input
                        className="FormControl Reactions-identifier"
                        type="text"
                        value={reaction.identifier()}
                        placeholder={app.translator.trans('reflar-reactions.admin.page.reactions.help.identifier')}
                        oninput={m.withAttr('value', this.updateIdentifier.bind(this, reaction))} />
                    </div>
                  ]
                })}
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    )
  }

  updateIdentifier() {}

  onsubmit() {}

}
