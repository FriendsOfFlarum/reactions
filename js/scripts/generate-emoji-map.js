/**
 * Adapted from flarum/flarum-ext-emoji#16
 * Originally by sijad & tobscure
 */

const fs = require('fs');
const path = require('path');
const twemoji = require('twemoji/2/twemoji.npm');

const outputPath = './src/common/generated/emojis.json';
const data = require('emojibase-data/en/data.json');
const twemojiFileNames = fs.readdirSync('./node_modules/twemoji/2/svg')
    .map(name => path.basename(name, '.svg'));

const alternative = {
    "👁️‍🗨️" : "👁‍🗨",
};
const shortnames = {
    "1f697": ["car"]
};

const emojis = {};

for (let e of data) {
    const emoji = alternative[e.emoji] || e.emoji;
    const emojiCode = getEmojiIconCode(emoji);

    if (!checkExistanceInTwemoji(emojiCode)) {
        console.error('Can not find', emoji, emojiCode);
        continue;
    }

    emojis[emojiCode] = e.shortcodes.concat(shortnames[emojiCode] || []);
}

const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

fs.writeFileSync(outputPath, JSON.stringify(emojis));

function checkExistanceInTwemoji(code) {
    return twemojiFileNames.indexOf(code) !== -1;
}

function getEmojiIconCode(emoji) {
    const U200D = String.fromCharCode(0x200D);
    return twemoji.convert.toCodePoint(emoji.indexOf(U200D) < 0 ?
        emoji.replace(/\uFE0F/g, '') :
        emoji
    );
}
