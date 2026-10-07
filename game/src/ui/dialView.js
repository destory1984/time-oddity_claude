// Draws the year dial: a large arc at the bottom of the screen with a tick for every
// year and a gold needle. The look is sample 3 of docs/ui-samples.html as tuned in
// docs/dial-proto.html.
import { PX_PER_YEAR, isDecade } from '../core/dial.js';
import { formatYear, yearFromIndex, yearIndex } from '../core/when.js';

const GOLD = '#f6b951';

export function createDialView(canvas) {
  const c = canvas.getContext('2d');
  let w = 0;
  let h = 0;

  function resize() {
    const box = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    w = box.width; h = box.height;
    canvas.width = Math.round(w * ratio); canvas.height = Math.round(h * ratio);
    c.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  // A pill at the dial's edge that points to a marked year off the screen. Tapping that
  // side of the dial rolls there (see main.js).
  function chip(text, side) {
    c.font = 'bold 12px "Malgun Gothic", system-ui, sans-serif';
    const wide = c.measureText(text).width + 20;
    const x = side < 0 ? 8 : w - 8 - wide;
    const y = h - 96;
    c.fillStyle = 'rgba(5,3,48,.85)';
    c.strokeStyle = GOLD; c.lineWidth = 1.5;
    c.beginPath(); c.roundRect(x, y, wide, 26, 13); c.fill(); c.stroke();
    c.fillStyle = GOLD; c.textAlign = 'left'; c.textBaseline = 'middle';
    c.fillText(text, x + 10, y + 13.5);
  }

  // marks: [{ year, label }], the years with something to see.
  function draw(dial, marks = []) {
    c.clearRect(0, 0, w, h);
    const radius = w * 1.15;
    const cx = w / 2;
    const cy = h - 100 + radius;
    c.fillStyle = 'rgba(5,3,48,.78)';
    c.beginPath(); c.arc(cx, cy, radius, 0, Math.PI * 2); c.fill();
    c.strokeStyle = '#f6b951'; c.lineWidth = 2; c.stroke();

    c.font = '11px "Malgun Gothic", system-ui, sans-serif';
    c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillStyle = 'rgba(251,248,249,.9)';
    const reach = Math.ceil((radius * 0.7) / PX_PER_YEAR);
    const first = Math.max(dial.min, Math.round(dial.offset) - reach);
    const last = Math.min(dial.max, Math.round(dial.offset) + reach);
    for (let i = first; i <= last; i += 1) {
      const year = yearFromIndex(i);
      const big = isDecade(year);
      c.save();
      c.translate(cx, cy);
      c.rotate(((i - dial.offset) * PX_PER_YEAR) / radius);
      c.fillRect(-(big ? 1 : 0.5), -radius + 2, big ? 2 : 1, big ? 18 : 9);
      if (big) c.fillText(formatYear(year), 0, -radius + 34);
      c.restore();
    }
    // Marked years: a gold tick with a bead and a name over it, so that nobody has to know
    // the year to find it.
    let older = null;
    let newer = null;
    for (const mark of marks) {
      const i = yearIndex(mark.year);
      const away = i - dial.offset;
      if (Math.abs(away) * PX_PER_YEAR > w / 2 - 34) {
        if (away < 0 && (!older || i > yearIndex(older.year))) older = mark;
        if (away > 0 && (!newer || i < yearIndex(newer.year))) newer = mark;
        continue;
      }
      c.save();
      c.translate(cx, cy);
      c.rotate((away * PX_PER_YEAR) / radius);
      c.fillStyle = GOLD;
      c.fillRect(-1.5, -radius + 2, 3, 22);
      c.beginPath(); c.arc(0, -radius - 8, 5, 0, Math.PI * 2); c.fill();
      c.font = 'bold 12px "Malgun Gothic", system-ui, sans-serif';
      c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText(mark.label, 0, -radius - 24);
      c.restore();
    }
    if (older) chip(`◀ ${older.label}`, -1);
    if (newer) chip(`${newer.label} ▶`, 1);

    c.fillStyle = GOLD;
    c.beginPath(); c.moveTo(cx - 8, h - 114); c.lineTo(cx + 8, h - 114); c.lineTo(cx, h - 98); c.fill();
  }

  return { resize, draw };
}
