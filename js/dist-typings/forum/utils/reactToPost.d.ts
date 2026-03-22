/**
 * React to a post with the given reaction, or unreact if already reacted with it.
 *
 * @param {import('flarum/common/models/Post').default} post
 * @param {object} reaction  Reaction model instance, or null to remove
 * @param {object} loading   Mutable loading-state map keyed by reaction id (or null)
 */
export default function reactToPost(post: import('flarum/common/models/Post').default, reaction: object, loading: object): number | Promise<void> | undefined;
