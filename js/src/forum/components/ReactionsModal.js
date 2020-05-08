import Modal from 'flarum/components/Modal';
import avatar from 'flarum/helpers/avatar';
import username from 'flarum/helpers/username';
import emoji from '../../common/util/emoji';

export default class ReactionsModal extends Modal {
    className() {
        return 'ReactionsModal Modal--small';
    }

    title() {
        return app.translator.trans('fof-reactions.forum.modal.title');
    }

    init() {
        this.idToReaction = app.forum.reactions()
        .filter(x => x.display())
        .reduce((a, x) => ({...a, [Number(x.id())]: x.display()}), {});

        this.groupToPreloaded = {};

        this.groupedReactions = this.groupReactions(this.props.post.reactions());
        this.groupedReactions.forEach(g => {
            g.forEach(r => {
                app.store.find('users', r['userId']).then(user => {
                    this.groupToPreloaded[r['id']]['modalUsers'].push(
                        <li>
                            <a className='ReactionsModal-user' href={app.route.user(user)} config={m.route}>
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
            <div className='Modal-body'>
                <ul className='ReactionsModal-list'>
                    {
                        this.groupedReactions.map(g => {
                            let preloadedGroup = this.groupToPreloaded[g[0]['id']];

                            return (
                                <div className='ReactionsModal-group'>
                                <legend>{preloadedGroup['legend']}</legend>
                                <hr className='ReactionsModal-delimiter'/>
                                { preloadedGroup['modalUsers'] }
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
        const informativeReactions = reactions.map(r => {
            let t = {};

            t['id'] = Number(r.id().split('-')[0]);
            t['userId'] = Number(r.user_id());

            /*
             *  This is pre-calculated HTML for each reaction.
             *  We only load it if the legend is empty, since we need
             *  to load it only once per reaction group.
             */
            if(!(t['id'] in this.groupToPreloaded))
            {
                this.groupToPreloaded[t['id']] = {'legend': [], 'modalUsers': []};

                if(r.type() === 'emoji') {
                    this.groupToPreloaded[t['id']]['legend'].push(
                    <img className='ReactionsModal-emoji' src={emoji(r.identifier()).url} />
                    );
                }
                else if (r.type() === 'icon') {
                    this.groupToPreloaded[t['id']]['legend'].push(
                    <i className={`fa fa-${r.identifier()} ReactionsModal-icon`} data-reaction={r.identifier()} />
                    );
                }

                /*
                *  Always fallback to the identifier for unknown identifiers,
                *  otherwise use the display name as a reaction label,
                *  or keep it empty if there is no display value.
                */
                this.groupToPreloaded[t['id']]['legend'].push(
                    <label className="ReactionsModal-display">
                    {
                        this.groupToPreloaded[t['id']]['legend'].length === 0
                        ? r.identifier()
                        : this.idToReaction[t['id']] || ''
                    }
                    </label>
                );
            }
    
            return t;
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