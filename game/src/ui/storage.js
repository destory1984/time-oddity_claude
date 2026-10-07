// What is kept between visits, in localStorage under 'timeoddity.<name>.v1'. Every call
// is wrapped: a browser in private mode or with storage switched off must not stop the
// game, and what is read back is checked before it is used.
import { sanitizeProgress } from '../core/progress.js';
import { textSizeFrom } from '../core/textSize.js';

const KEY = {
  muted: 'timeoddity.muted.v1', music: 'timeoddity.music.v1', text: 'timeoddity.text.v1', progress: 'timeoddity.progress.v1',
};

function read(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}
function write(key, value) {
  try { localStorage.setItem(key, value); } catch { /* not kept this time */ }
}

export const loadMuted = () => read(KEY.muted) === '1';
export const saveMuted = (muted) => write(KEY.muted, muted ? '1' : '0');
// Background music is on unless the player turned it off.
export const loadMusic = () => read(KEY.music) !== '0';
export const saveMusic = (on) => write(KEY.music, on ? '1' : '0');
// The notebook. ids: the squares that exist now; a record of one that no longer does is dropped.
export const loadProgress = (ids) => sanitizeProgress(read(KEY.progress), ids);
export const saveProgress = (progress) => write(KEY.progress, JSON.stringify(progress));
export const loadTextSize = () => textSizeFrom(read(KEY.text));
export const saveTextSize = (size) => write(KEY.text, String(size));
