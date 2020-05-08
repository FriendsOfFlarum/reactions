import Modal from 'flarum/components/Modal';
import avatar from 'flarum/helpers/avatar';
import username from 'flarum/helpers/username';
import emoji from '../../common/util/emoji';
import icon from 'flarum/helpers/icon';




export default class ReactionsModal extends Modal {
    className() {
        return 'ReactionsModal Modal--small';
    }

    title() {
        return app.translator.trans('fof-reactions.forum.modal.title');
    }

    init() {
        this.idToReaction = app.forum.reactions()
        .filter(x => x['data']['attributes']['display'])
        .reduce((a, x) => ({...a, [Number(x['data']['id'])]: x['data']['attributes']['display']}), {});

        this.groupedReactions = this.groupReactions(this.props.post.reactions());
        this.groupedReactions.forEach(g => {
            g.forEach(r => {
                app.store.find('users', r['userId']).then(user => {
                    r['modalUser'].push(
                        <li>
                            <a className="ModalUser" href={app.route.user(user)} config={m.route}>
                                {avatar(user)} {username(user)}
                            </a>
                        </li>
                    );

                    m.redraw();
                })
            })
        });
    }

    
    content() {
        return (
            <div className="Modal-body">
                <ul className="ReactionsModal-list">
                    {
                        this.groupedReactions.map(g => {
                            return (
                                <div className="ReactionGroup">
                                <legend>{g[0]['legend']}</legend>
                                <hr/>
                                {
                                    g.map(r =>  r['modalUser'])
                                }
                                </div>
                            )
                        })
                    }
                </ul>
            </div>
        );
    }

    groupReactions(reactions) {
        // Recreate reactions to only have useful data
        const informativeReactions = reactions.map(x => {
            let toReturn = {};
    
            toReturn['id'] = Number(x['data']['id'].split('-')[0])
    
            const tType = x['data']['attributes']['type'];
            const tIdentifier = x['data']['attributes']['identifier']

            let appendage = this.idToReaction[toReturn['id']] || ""
    
            if(tType === "emoji") {
            toReturn['legend'] = [<img className="reaction-emoji" src={emoji(tIdentifier).url} />, <label>{appendage}</label>]
            }
            else if(tType === "icon") {
                toReturn['legend'] = <i className={`fa fa-${tIdentifier} reaction-icon`} data-reaction={tIdentifier} />;
            }
            else {
                toReturn['legend'] = tIdentifier;
            }
    
            toReturn['userId'] = Number(x['data']['attributes']['user_id'])
            toReturn['modalUser'] = [];
            toReturn['modalLegend'] = []
    
            return toReturn;
        });
    
        // Group extensions by id, sort them by the id
        const groupedReactions = Object.values(
            informativeReactions.reduce((rv, x) => {
                (rv[x['id']] = rv[x['id']] || []).push(x);
                return rv
            }, {})
        ).sort((l, r) => r['id'] - l['id']);
    
        return groupedReactions;
    }
}