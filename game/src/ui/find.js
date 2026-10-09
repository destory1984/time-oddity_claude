// The "what has changed" game on the screen: a layer over today's picture that takes the
// touches, a gold ring on every thing found and a line that tells what happened to it,
// and a bar with the count, a button that shows the day while it is held, and a way out.
import { createFind, foundAll, foundCount, nextUnfound, touchFind } from '../core/find.js';
import { t } from '../core/i18n.js';

const FINGER_PX = 30;        // a circle is never smaller than this to the touch
const HINT_AFTER_MS = 12000; // this long without a find, one thing left glimmers

const $ = (id) => document.getElementById(id);

// stage: the game's element. pictureBox(): where today's picture lies on the screen.
// onPeek(on): the day is to be shown, or today again. onFound(all): a thing was found.
// onMiss(): a touch found nothing. onMode(on): the game was entered or left.
export function createFindGame({ stage, pictureBox, onPeek, onFound, onMiss, onMode }) {
  const layer = $('findLayer');
  const lines = $('findLines');
  let find = null;
  let lastFoundAt = 0;
  let timer = null;

  function count() {
    const all = foundAll(find);
    $('findCount').textContent = all ? '다 찾았구나!' : t`달라진 것 ${foundCount(find)} / ${find.things.length}`;
    $('findStop').textContent = all ? '다 봤어' : '그만';
    $('findPeek').hidden = false;
  }

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
  // Every circle of a thing gets the mark.
  const markThing = (thing, kind) => thing.at.map(([x, y, r]) => markAt(x, y, 2 * Math.max(FINGER_PX, r * pictureBox().width), kind));

  function peek(on) {
    if (!find) return;
    layer.classList.toggle('peeking', on);
    onPeek(on);
  }

  function leave() {
    if (!find) return;
    clearInterval(timer);
    peek(false);
    find = null;
    layer.replaceChildren();
    lines.replaceChildren();
    stage.classList.remove('finding');
    onMode(false);
  }

  function enter(things) {
    if (find || things.length === 0) return;
    find = createFind(things);
    lastFoundAt = performance.now();
    stage.classList.add('finding');
    count();
    onMode(true);
    timer = setInterval(() => {
      if (!find || performance.now() - lastFoundAt < HINT_AFTER_MS) return;
      const i = nextUnfound(find);
      if (i < 0) return;
      lastFoundAt = performance.now();
      const hints = markThing(find.things[i], 'hint');
      setTimeout(() => hints.forEach((hint) => hint.remove()), 1600);
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
    const thing = find.things[i];
    markThing(thing, 'ring');
    // What happened to it, on a slip that stays: the story gathers as the things are found.
    const slip = document.createElement('li');
    const name = document.createElement('b');
    name.textContent = thing.name;
    slip.append(name, ` ${thing.line}`);
    lines.append(slip);
    count();
    onFound(foundAll(find));
  });

  const hold = $('findPeek');
  hold.addEventListener('pointerdown', (e) => { hold.setPointerCapture?.(e.pointerId); peek(true); });
  for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) hold.addEventListener(name, () => peek(false));
  $('findStop').addEventListener('click', leave);

  return { enter, leave, isOn: () => Boolean(find) };
}
