import Model from 'flarum/common/Model';
export default class Reaction extends Model {
    identifier(): string;
    display(): string;
    type(): string;
    enabled(): boolean;
    user_id(): number;
    post_id(): number;
    reaction_id(): number;
}
