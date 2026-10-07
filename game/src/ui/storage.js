// What is kept between visits, in localStorage under 'timeoddity.<name>.v1'. Every call
// is wrapped: a browser in private mode or with storage switched off must not stop the
// game, and what is read back is checked before it is used.
import { textSizeFrom } from '../core/textSize.js';

const KEY = { muted: 'timeoddity.muted.v1', text: 'timeoddity.text.v1' };

function read(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}
function write(key, value) {
  try { localStorage.setItem(key, value); } catch { /* not kept this time */ }
}

export const loadMuted = () => read(KEY.muted) === '1';
export const saveMuted = (muted) => write(KEY.muted, muted ? '1' : '0');
export const loadTextSize = () => textSizeFrom(read(KEY.text));
export const saveTextSize = (size) => write(KEY.text, String(size));
