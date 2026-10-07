// The "what has changed" game on the screen: a layer over today's picture that takes the
// touches, a gold ring on every place found, and a bar with the count, a button that
// shows the day while it is held, and a way out.
import { createFind, foundAll, foundCount, nextUnfound, touchFind } from '../core/find.js';

const FINGER_PX = 30;        // a place is never smaller than this to the touch
const HINT_AFTER_MS = 12000; // this long without a find, one place left glimmers
const DONE_FOR_MS = 1800;    // the rings stay this long once all are found

const $ = (id) => document.getElementById(id);

// stage: the game's element. pictureBox(): where today's picture lies on the screen.
// onPeek(on): the day is to be shown, or today again. onFound(all): a place was found.
// onMiss(): a touch found nothing. onMode(on): the game was entered or left.
export function createFindGame({ stage, pictureBox, onPeek, onFound, onMiss, onMode }) {
  const layer = $('findLayer');
  let find = null;
  let lastFoundAt = 0;
  let timer = null;
  let closing = null;

  const count = () => { $('findCount').textContent = foundAll(find) ? '다 찾았구나!' : `달라진 곳 ${foundCount(find)} / ${find.spots.length}`; };

  // A mark at a place of the picture, in the layer's own px.
  function markAt(x, y, sizePx, kind) {
    const box = pictureBox();
    const own = layer.getBoundingClientRect();
    const node = document.createElement('i');
    node.className = kind;
    node.style.left = `${box.left - own.left + x * box.width}px`;
    node.style.top = `${box.top - own.top + y * box.height}px`;
    node.style.width = `${sizePx}px`; node.style.height = `${sizePx}px`;
    layer.append(node);
    return node;
  }
  const ringSize = (spot) => 2 * Math.max(FINGER_PX, spot.r * pictureBox().width);

  function peek(on) {
    if (!find) return;
    layer.classList.toggle('peeking', on);
    onPeek(on);
  }

  function leave() {
    if (!find) return;
    clearInterval(timer); clearTimeout(closing);
    peek(false);
    find = null;
    layer.replaceChildren();
    stage.classList.remove('finding');
    onMode(false);
  }

  function enter(spots) {
    if (find || spots.length === 0) return;
    find = createFind(spots);
    lastFoundAt = performance.now();
    stage.classList.add('finding');
    count();
    onMode(true);
    timer = setInterval(() => {
      if (!find || performance.now() - lastFoundAt < HINT_AFTER_MS) return;
      const i = nextUnfound(find);
      if (i < 0) return;
      lastFoundAt = performance.now();
      const hint = markAt(find.spots[i].x, find.spots[i].y, ringSize(find.spots[i]), 'hint');
      setTimeout(() => hint.remove(), 1600);
    }, 500);
  }

  layer.addEventListener('pointerdown', (e) => {
    if (!find || foundAll(find)) return;
    const box = pictureBox();
    const x = (e.clientX - box.left) / box.width;
    const y = (e.clientY - box.top) / box.height;
    const i = touchFind(find, x, y, FINGER_PX / box.width);
    if (i < 0) {
      const miss = markAt(x, y, 36, 'miss');
      setTimeout(() => miss.remove(), 500);
      onMiss();
      return;
    }
    lastFoundAt = performance.now();
    markAt(find.spots[i].x, find.spots[i].y, ringSize(find.spots[i]), 'ring');
    count();
    const all = foundAll(find);
    onFound(all);
    if (all) closing = setTimeout(leave, DONE_FOR_MS);
  });

  const hold = $('findPeek');
  hold.addEventListener('pointerdown', (e) => { hold.setPointerCapture?.(e.pointerId); peek(true); });
  for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) hold.addEventListener(name, () => peek(false));
  $('findStop').addEventListener('click', leave);

  return { enter, leave, isOn: () => Boolean(find) };
}
