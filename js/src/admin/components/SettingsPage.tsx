import app from 'flarum/admin/app';
import Button from 'flarum/common/components/Button';
import emoji from '../../common/util/emoji';
import ExtensionPage from 'flarum/admin/components/ExtensionPage';
import Select from 'flarum/common/components/Select';
import saveSettings from 'flarum/admin/utils/saveSettings';
import Switch from 'flarum/common/components/Switch';
import Stream from 'flarum/common/utils/Stream';
import extractText from 'flarum/common/utils/extractText';
import Tooltip from 'flarum/common/components/Tooltip';
import type Mithril from 'mithril';
import type Reaction from '../../common/models/Reaction';

export default class SettingsPage extends ExtensionPage {
  fields: string[] = ['convertToUpvote', 'convertToDownvote', 'convertToLike', 'cdnUrl'];
  switches: string[] = ['react_own_post', 'anonymousReactions'];
  values: Record<string, Stream<string | boolean>> = {};
  reactions!: Reaction[];
  settingsPrefix: string = 'fof-reactions';
  newReaction!: {
    identifier: Stream<string>;
    type: Stream<string>;
  };
  addLoading: boolean = false;
  successAlert: any = null;

  oninit(vnode: Mithril.Vnode) {
    super.oninit(vnode);

    this.reactions = app.store.all<Reaction>('reactions').slice();

    const settings = app.data.settings;

    this.newReaction = {
      identifier: Stream(''),
      type: Stream('emoji'),
    };

    this.fields.forEach((key) => (this.values[key] = Stream(settings[this.addPrefix(key)] || '')));
    this.switches.forEach((key) => (this.values[key] = Stream(!!Number(settings[this.addPrefix(key)]))));
  }

  content() {
    return (
      <div className="SettingsPage--reactions">
        <div className="container">
          <form>
            <fieldset>
              <legend>{app.translator.trans('fof-reactions.admin.page.reactions.title')}</legend>
              <label>{app.translator.trans('fof-reactions.admin.page.reactions.reactions')}</label>
              <div className="helpText">{app.translator.trans('fof-reactions.admin.page.reactions.Helptext')}</div>
              <div className="Reactions--Container">
                <div className="Reactions--Container--header">
                  <label>{app.translator.trans('fof-reactions.admin.page.reactions.header.display')}</label>
                  <label>{app.translator.trans('fof-reactions.admin.page.reactions.header.identifier')}</label>
                  <label>{app.translator.trans('fof-reactions.admin.page.reactions.header.type')}</label>
                  <label>{app.translator.trans('fof-reactions.admin.page.reactions.header.enabled')}</label>
                  <label>{app.translator.trans('fof-reactions.admin.page.reactions.header.action')}</label>
                  <label>{app.translator.trans('fof-reactions.admin.page.reactions.header.preview')}</label>
                </div>

                {this.reactions.map((reaction) => {
                  const spanClass = reaction.type() === 'icon' && `fas fa-${reaction.identifier()} Reactions-demo`;
                  const data = emoji(reaction.identifier());
                  const demos = [];

                  if (reaction.type() === 'icon') {
                    demos.push(
                      <i className={spanClass || ''} aria-hidden="true">
                        &nbsp;
                      </i>
                    );
                  }

                  if (data.uc) {
                    demos.push(
                      <>
                        <img
                          alt={data.identifier}
                          className={reaction.type() !== 'emoji' ? 'emoji-non-primary' : ''}
                          draggable={false}
                          src={data.url}
                          width="30"
                        />

                        {data.score && reaction.type() === 'emoji' && (
                          <p className="Reactions-demo-identifier">
                            (<code>{data.identifier}</code>)
                          </p>
                        )}
                      </>
                    );
                  }

                  return [
                    <div className="Reactions--item" data-id={reaction.id()}>
                      <input
                        className="FormControl Reactions-input"
                        value={reaction.display() || ''}
                        data-1p-ignore
                        placeholder={app.translator.trans('fof-reactions.admin.page.reactions.help.display')}
                        oninput={(e: InputEvent) => {
                          const target = e.target as HTMLInputElement;
                          this.update(reaction, 'display', target.value);
                        }}
                      />
                      <input
                        className="FormControl Reactions-input"
                        type="text"
                        data-1p-ignore
                        value={reaction.identifier()}
                        placeholder={app.translator.trans('fof-reactions.admin.page.reactions.help.identifier')}
                        oninput={(e: InputEvent) => {
                          const target = e.target as HTMLInputElement;
                          this.update(reaction, 'identifier', target.value);
                        }}
                      />
                      <Select
                        options={{ emoji: 'emoji', icon: 'icon' }}
                        value={reaction.type()}
                        onchange={(val: string) => this.update(reaction, 'type', val)}
                      />
                      <Switch
                        className="Reactions-switch"
                        state={reaction.enabled()}
                        onchange={(val: boolean) => this.update(reaction, 'enabled', val)}
                      />
                      <Tooltip text={app.translator.trans('fof-reactions.admin.page.reactions.delete_reaction_button')}>
                        <Button
                          type="button"
                          className="Button Button--warning Button--icon Reactions-button"
                          icon="fas fa-times"
                          onclick={() => this.deleteReaction(reaction)}
                        />
                      </Tooltip>

                      <div className="Reactions-demo">{demos}</div>
                    </div>,
                  ];
                })}
                <div className="full-row"></div>
                <div className="Reactions--item Reactions--item--new">
                  <label>{app.translator.trans('fof-reactions.admin.page.reactions.add_reaction_label')}</label>
                  <input
                    className="FormControl Reactions-input"
                    type="text"
                    placeholder={app.translator.trans('fof-reactions.admin.page.reactions.help.identifier')}
                    oninput={(e: InputEvent) => {
                      const target = e.target as HTMLInputElement;
                      this.newReaction.identifier(target.value);
                    }}
                  />
                  <Select
                    options={{ emoji: 'emoji', icon: 'icon' }}
                    disabled={this.addLoading}
                    value={this.newReaction.type()}
                    onchange={(val: string) => this.newReaction.type(val)}
                  />
                  <div />
                  <Tooltip text={app.translator.trans('fof-reactions.admin.page.reactions.add_reaction_button')}>
                    <Button
                      type="button"
                      className="Button Button--warning Button--icon Reactions-button"
                      icon={this.addLoading ? '' : 'fas fa-plus'}
                      loading={this.addLoading}
                      onclick={() => this.addReaction()}
                    />
                  </Tooltip>
                  <div className="Reactions-demo">
                    {this.newReaction.type() === 'icon' ? (
                      <i className={`fas fa-${this.newReaction.identifier()} Reactions-demo`} aria-hidden="true">
                        &nbsp;
                      </i>
                    ) : (
                      ''
                    )}
                    {emoji(this.newReaction.identifier()).uc ? (
                      <img
                        alt={this.newReaction.identifier()}
                        className={this.newReaction.type() !== 'emoji' ? 'emoji-non-primary' : ''}
                        draggable={false}
                        src={emoji(this.newReaction.identifier()).url}
                        width="30"
                      />
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              </div>
            </fieldset>

            <fieldset>
              <div className="Reaction-settings">
                <div>
                  <Switch
                    state={this.values.react_own_post() as boolean}
                    onchange={(val: boolean) => this.values.react_own_post(val)}
                    className="reactions-settings-switch"
                  >
                    {app.translator.trans('fof-reactions.admin.page.settings.react_own_posts_label')}
                  </Switch>
                  <div className="helpText">{app.translator.trans('fof-reactions.admin.page.settings.react_own_posts_help')}</div>
                </div>
                <div>
                  <Switch
                    state={this.values.anonymousReactions() as boolean}
                    onchange={(val: boolean) => this.values.anonymousReactions(val)}
                    className="reactions-settings-switch"
                  >
                    {app.translator.trans('fof-reactions.admin.page.settings.allow-anonymous')}
                  </Switch>
                  <div className="helpText">{app.translator.trans('fof-reactions.admin.page.settings.allow-anonymous-help')}</div>
                </div>
              </div>
            </fieldset>
            {(this.isExtEnabled('fof-gamification') || this.isExtEnabled('flarum-likes')) && (
              <fieldset class="Reaction-settings">
                <legend>{app.translator.trans('fof-reactions.admin.page.settings.integrations.legend')}</legend>

                {this.isExtEnabled('fof-gamification') ? (
                  <div>
                    <legend>{app.translator.trans('fof-reactions.admin.page.settings.integrations.gamification.legend')}</legend>
                    <label>{app.translator.trans('fof-reactions.admin.page.settings.integrations.gamification.upvoteLabel')}</label>
                    <div className="helpText">
                      {app.translator.trans('fof-reactions.admin.page.settings.integrations.gamification.upvoteHelptext')}
                    </div>
                    <input
                      className="FormControl reactions-settings-input"
                      value={(this.values.convertToUpvote() as string) || ''}
                      placeholder="thumbsup"
                      oninput={(e: InputEvent) => {
                        const target = e.target as HTMLInputElement;
                        this.values.convertToUpvote(target.value);
                      }}
                    />
                    <label>{app.translator.trans('fof-reactions.admin.page.settings.integrations.gamification.downvoteLabel')}</label>
                    <div className="helpText">
                      {app.translator.trans('fof-reactions.admin.page.settings.integrations.gamification.downvoteHelptext')}
                    </div>
                    <input
                      className="FormControl reactions-settings-input"
                      value={(this.values.convertToDownvote() as string) || ''}
                      placeholder="thumbsdown"
                      oninput={(e: InputEvent) => {
                        const target = e.target as HTMLInputElement;
                        this.values.convertToDownvote(target.value);
                      }}
                    />
                  </div>
                ) : (
                  ''
                )}
                {this.isExtEnabled('flarum-likes') ? (
                  <div>
                    <legend>{app.translator.trans('fof-reactions.admin.page.settings.integrations.likes.legend')}</legend>
                    <label>{app.translator.trans('fof-reactions.admin.page.settings.integrations.likes.Label')}</label>
                    <div className="helpText">{app.translator.trans('fof-reactions.admin.page.settings.integrations.likes.Helptext')}</div>
                    <input
                      className="FormControl reactions-settings-input"
                      value={(this.values.convertToLike() as string) || ''}
                      placeholder="thumbsup"
                      oninput={(e: InputEvent) => {
                        const target = e.target as HTMLInputElement;
                        this.values.convertToLike(target.value);
                      }}
                    />
                  </div>
                ) : (
                  ''
                )}
              </fieldset>
            )}
            <fieldset>
              <legend>{app.translator.trans('fof-reactions.admin.page.cdn.title')}</legend>
              <p className="helpText">{app.translator.trans('fof-reactions.admin.page.cdn.help')}</p>
              <label>{app.translator.trans('fof-reactions.admin.page.cdn.label')}</label>
              <p className="helpText">
                {app.translator.trans('fof-reactions.admin.page.cdn.default-url', {
                  url: <code>https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/[codepoint].png</code>,
                })}
              </p>
              <input
                className="FormControl reactions-settings-input"
                value={this.values.cdnUrl() as string}
                oninput={(e: InputEvent) => {
                  const target = e.target as HTMLInputElement;
                  this.values.cdnUrl(target.value);
                }}
                placeholder="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/[codepoint].png"
              />
            </fieldset>
            {this.submitButton()}
          </form>
        </div>
      </div>
    );
  }

  isChanged(): number {
    const fieldsCheck = this.fields.some((key) => this.values[key]() !== (app.data.settings[this.addPrefix(key)] || ''));
    const switchesCheck = this.switches.some((key) => this.values[key]() !== app.data.settings[this.addPrefix(key)]);

    return fieldsCheck || switchesCheck ? 1 : 0;
  }

  addReaction(): void {
    const reaction = app.store.createRecord<Reaction>('reactions');

    this.addLoading = true;

    reaction
      .save({
        identifier: this.newReaction.identifier(),
        type: this.newReaction.type(),
      })
      .then((savedReaction) => {
        this.reactions.push(savedReaction);

        this.newReaction.identifier('');
        this.newReaction.type('emoji');

        this.addLoading = false;

        m.redraw();
      })
      .catch(() => {
        this.addLoading = false;

        m.redraw();
      });
  }

  update(reaction: Reaction, key: string, value: string | boolean): void {
    app.request({
      method: 'PATCH',
      url: `${app.forum.attribute('apiUrl')}/reactions/${reaction.id()}`,
      body: {
        data: {
          attributes: {
            [key]: value,
          },
        },
      },
    });

    this.reactions.some((r) => {
      if (r.id() === reaction.id()) {
        reaction.pushAttributes({ [key]: value });
        return true;
      }
      return false;
    });
  }

  deleteReaction(reactionToDelete: Reaction): void {
    if (!confirm(extractText(app.translator.trans('fof-reactions.admin.page.reactions.delete_confirmation')))) return;

    app.request({
      method: 'DELETE',
      url: `${app.forum.attribute('apiUrl')}/reactions/${reactionToDelete.id()}`,
    });
    this.reactions.some((reaction, i) => {
      if (reaction.id() === reactionToDelete.id()) {
        this.reactions.splice(i, 1);
        return true;
      }
      return false;
    });
  }

  async saveSettings(e: SubmitEvent): Promise<void> {
    e.preventDefault();

    if (this.loading) return;

    this.loading = true;

    app.alerts.dismiss(this.successAlert);

    try {
      await saveSettings(this.prepareSubmissionData());
      this.successAlert = app.alerts.show(
        {
          type: 'success',
        },
        app.translator.trans('core.admin.settings.saved_message')
      );
    } catch {}
    this.loading = false;
    m.redraw();
  }

  isExtEnabled(name: string): boolean {
    const enabled = JSON.parse(app.data.settings.extensions_enabled);

    return enabled.indexOf(name) !== -1;
  }

  addPrefix(key: string): string {
    return `${this.settingsPrefix}.${key}`;
  }

  prepareSubmissionData(): Record<string, string | boolean> {
    const settings: Record<string, string | boolean> = {};

    this.switches.forEach((key) => (settings[this.addPrefix(key)] = this.values[key]() as boolean));
    this.fields.forEach((key) => (settings[this.addPrefix(key)] = this.values[key]() as string));

    return settings;
  }
}
