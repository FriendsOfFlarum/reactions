import app from 'flarum/common/app';
import emojis from 'simple-emoji-map';
import FuzzySet from 'fuzzyset';

const flatten = (arr, depth = 1) => arr.reduce((a, v) => a.concat(depth > 1 && Array.isArray(v) ? flatten(v, depth - 1) : v), []);
const shortnames = flatten(Object.values(emojis));
const entries = Object.entries(emojis);
const getEmoji = (identifier) => entries.find(([, value]) => value.includes(identifier));
const toUnicodeEmoji = (codePoint) => String.fromCodePoint(...codePoint.split('-').map((e) => `0x${e}`));

const emojiCache = new Map();
const fuzzySet = new FuzzySet(shortnames);

export const DEFAULT_CDN_URL = "'https://cdnjs.cloudflare.com/ajax/libs/twemoji/16.0.1/72x72/[codepoint].png'";

const search = (query) => {
  const results = fuzzySet.get(query);

  if (!results) return null;

  const [score, item] = results[0];

  return {
    score,
    item,
  };
};

export default function emoji(reactionOrIdentifier) {
  if (!reactionOrIdentifier) return {};

  let identifier = reactionOrIdentifier.identifier || reactionOrIdentifier;

  if (emojiCache.has(identifier)) return emojiCache.get(identifier);

  let score;

  if (!shortnames.includes(identifier)) {
    const match = search(identifier);

    identifier = match?.item;
    score = match?.score;
  }

  const emoji = getEmoji(identifier);
  const codePoint = emoji?.[0];

  const cdnUrl = app.forum.attribute('fofReactionsCdnUrl') || DEFAULT_CDN_URL;

  const output = codePoint
    ? {
        identifier,
        score,
        uc: toUnicodeEmoji(codePoint),
        url: cdnUrl.replace('[codepoint]', codePoint.toLowerCase()),
        type: 'emoji',
      }
    : {};

  emojiCache.set(reactionOrIdentifier, output);

  return output || {};
}
