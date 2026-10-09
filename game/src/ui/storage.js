// What is kept between visits, in localStorage under 'timeoddity.<name>.v1'. Every call
// is wrapped: a browser in private mode or with storage switched off must not stop the
// game, and what is read back is checked before it is used.
import { sanitizeCards } from '../core/postcard.js';
import { sanitizeProgress } from '../core/progress.js';
import { textSizeFrom } from '../core/textSize.js';
import { LANG_KEY } from '../core/i18n.js';

const KEY = {
  opened: 'timeoddity.opened.v1', muted: 'timeoddity.muted.v1', cards: 'timeoddity.postcards.v1', music: 'timeoddity.music.v1', repeat: 'timeoddity.repeat.v1', text: 'timeoddity.text.v1', progress: 'timeoddity.progress.v1', screen: 'timeoddity.screen.v1',
};

function read(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}
function write(key, value) {
  try { localStorage.setItem(key, value); } catch { /* not kept this time */ }
}

// Whether the opening has been seen (or skipped) on this device.
export const loadOpened = () => read(KEY.opened) === '1';
export const saveOpened = () => write(KEY.opened, '1');
export const loadMuted = () => read(KEY.muted) === '1';
export const saveMuted = (muted) => write(KEY.muted, muted ? '1' : '0');
// Background music is on unless the player turned it off.
// The language chosen in the settings (core/i18n.js reads it at the start).
export const saveLanguage = (lang) => write(LANG_KEY, lang);
export const loadMusic = () => read(KEY.music) !== '0';
export const saveMusic = (on) => write(KEY.music, on ? '1' : '0');
// One tune over and over, if the player asked for that.
export const loadRepeat = () => read(KEY.repeat) === '1';
export const saveRepeat = (on) => write(KEY.repeat, on ? '1' : '0');
// The notebook. ids: the squares that exist now; a record of one that no longer does is dropped.
export const loadProgress = (ids, noteIds) => sanitizeProgress(read(KEY.progress), ids, noteIds);
export const saveProgress = (progress) => write(KEY.progress, JSON.stringify(progress));
// Postcards, pictures and all. If the device has no room for them the newest is simply not kept.
export const loadCards = (ids) => sanitizeCards(read(KEY.cards), ids);
export const saveCards = (cards) => write(KEY.cards, JSON.stringify(cards));
export const loadTextSize = () => textSizeFrom(read(KEY.text));
export const saveTextSize = (size) => write(KEY.text, String(size));
// On a PC: the phone-shaped frame (the default) or the whole window.
export const loadScreen = () => (read(KEY.screen) === 'wide' ? 'wide' : 'phone');
export const saveScreen = (choice) => write(KEY.screen, choice === 'wide' ? 'wide' : 'phone');
// What she has on from the wardrobe (an outfit's name, or none), until she leaves the place.
export const loadOutfit = () => { const name = read('timeoddity.outfit.v1'); return name && /^[a-z0-9-]+$/.test(name) ? name : null; };
export const saveOutfit = (name) => write('timeoddity.outfit.v1', name ?? '');
// The test buttons (main.js, the maker's machine only). The opening is shown again after a wipe.
export const forgetOpened = () => { try { localStorage.removeItem(KEY.opened); } catch { /* nothing to forget */ } };
// The notebook as it was before "all done", kept under one more key to be put back by hand.
export const keepProgressAside = () => write('timeoddity.progress.before-all', read(KEY.progress) ?? '');
