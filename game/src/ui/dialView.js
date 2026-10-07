// Draws the year dial: the top of a large disc at the bottom of the screen, with a tick
// for every year and a fixed needle. An ink-navy plate in a worn brass rim: the look
// settled with an outside art director's notes on 2026.10.7 (docs/dial-상의.md), after
// the user found the first one, a flat navy disc with a gold line, cheap.
import { PX_PER_YEAR } from '../core/dial.js';
import { formatYear, yearFromIndex, yearIndex } from '../core/when.js';

const UI = '"Pretendard Variable", Pretendard, "Malgun Gothic", sans-serif';
const HAND = '"Nanum Pen Script", "Gowun Batang", cursive';
const PLATE_TOP = '#252a35';
const PLATE_FOOT = '#171c26';
const BRASS = '#a58a56';
const BRASS_LIT = '#c7ae77';
const BRASS_SHADE = '#62513a';
const BRASS_BRIGHT = '#e8c97a';   // the marks: the one thing on the dial that should catch the eye
const INK = '#ddd5c4';
const TAG = '#1b2030';
const APEX_FROM_FOOT = 96;        // the top of the arc, in px above the bottom of the screen
const KICK_MS = 80;               // the needle dips this long when a tick passes

export function createDialView(canvas) {
  const c = canvas.getContext('2d');
  let w = 0;
  let h = 0;
  let kickedAt = -1000;

  function resize() {
    const box = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    w = box.width; h = box.height;
    canvas.width = Math.round(w * ratio); canvas.height = Math.round(h * ratio);
    c.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  // The needle answers each tick with a small dip.
  function tick() { kickedAt = performance.now(); }

  function ring(cx, cy, radius, colour, width, alpha = 1) {
    c.globalAlpha = alpha;
    c.strokeStyle = colour; c.lineWidth = width;
    c.beginPath(); c.arc(cx, cy, radius, 0, Math.PI * 2); c.stroke();
    c.globalAlpha = 1;
  }

  // A four-pointed star: there is something to see in this year.
  function star(x, y, size) {
    c.beginPath();
    for (let i = 0; i < 8; i += 1) {
      const r = i % 2 === 0 ? size : size * 0.32;
      const a = (i * Math.PI) / 4 - Math.PI / 2;
      c.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
    }
    c.closePath(); c.fill();
  }

  // A small ink-navy tag with brass edge and lettering.
  function tag(text, x, y, font, pad = 7, height = 22) {
    c.font = font;
    const wide = Math.max(34, c.measureText(text).width + pad * 2);
    c.fillStyle = TAG; c.strokeStyle = BRASS; c.lineWidth = 1;
    c.beginPath(); c.roundRect(x - wide / 2, y - height / 2, wide, height, 4); c.fill(); c.stroke();
    c.fillStyle = BRASS_BRIGHT; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText(text, x, y + 1);
    return wide;
  }

  // marks: [{ year, label }], the years with something to see.
  function draw(dial, marks = []) {
    c.clearRect(0, 0, w, h);
    const radius = w * 1.15;
    const cx = w / 2;
    const apex = h - APEX_FROM_FOOT;
    const cy = apex + radius;

    // The plate, with a soft shadow on the ground above its rim.
    c.save();
    c.shadowColor = 'rgba(0,0,0,.4)'; c.shadowBlur = 8; c.shadowOffsetY = -1;
    const plate = c.createLinearGradient(0, apex, 0, h);
    plate.addColorStop(0, PLATE_TOP); plate.addColorStop(1, PLATE_FOOT);
    c.fillStyle = plate; c.globalAlpha = 0.97;
    c.beginPath(); c.arc(cx, cy, radius, 0, Math.PI * 2); c.fill();
    c.restore();
    // The rim: a lit top edge, the brass body, a dark inner edge.
    ring(cx, cy, radius - 2, BRASS, 4);
    ring(cx, cy, radius - 0.4, BRASS_LIT, 0.8, 0.7);
    ring(cx, cy, radius - 4.5, BRASS_SHADE, 1);
    ring(cx, cy, radius - 30, BRASS_SHADE, 0.6, 0.5);

    // Ticks: one a year, longer every fifth, longest every tenth with its year, upright.
    const at = (i, depth) => {
      const a = ((i - dial.offset) * PX_PER_YEAR) / radius;
      return { x: cx + Math.sin(a) * (radius - depth), y: cy - Math.cos(a) * (radius - depth) };
    };
    const reach = Math.ceil((radius * 0.7) / PX_PER_YEAR);
    const first = Math.max(dial.min, Math.round(dial.offset) - reach);
    const last = Math.min(dial.max, Math.round(dial.offset) + reach);
    c.strokeStyle = INK; c.fillStyle = INK;
    c.font = `500 12px ${UI}`; c.textAlign = 'center'; c.textBaseline = 'middle';
    for (let i = first; i <= last; i += 1) {
      const year = yearFromIndex(i);
      const long = year % 10 === 0 ? 17 : year % 5 === 0 ? 11 : 7;
      const from = at(i, 8);
      const to = at(i, 8 + long);
      c.globalAlpha = long === 17 ? 0.9 : long === 11 ? 0.7 : 0.5;
      c.lineWidth = long === 17 ? 1.5 : 1;
      c.beginPath(); c.moveTo(from.x, from.y); c.lineTo(to.x, to.y); c.stroke();
      if (long === 17) {
        const p = at(i, 8 + 17 + 13);
        c.globalAlpha = 0.92;
        c.fillText(formatYear(year), p.x, p.y);
      }
    }
    c.globalAlpha = 1;

    // Marked years: a brass tick, a star over the rim and a tag in grandmother's hand, so
    // that nobody has to know the year to find it.
    let older = null;
    let newer = null;
    for (const mark of marks) {
      const i = yearIndex(mark.year);
      const away = i - dial.offset;
      if (Math.abs(away) * PX_PER_YEAR > w / 2 - 30) {
        if (away < 0 && (!older || i > yearIndex(older.year))) older = mark;
        if (away > 0 && (!newer || i < yearIndex(newer.year))) newer = mark;
        continue;
      }
      const from = at(i, 6);
      const to = at(i, 8 + 21);
      c.strokeStyle = BRASS_BRIGHT; c.lineWidth = 2;
      c.beginPath(); c.moveTo(from.x, from.y); c.lineTo(to.x, to.y); c.stroke();
      const top = at(i, -13);
      c.save();
      c.shadowColor = 'rgba(232,201,122,.9)'; c.shadowBlur = 8;
      c.fillStyle = BRASS_BRIGHT;
      star(top.x, top.y, 7);
      c.restore();
      // The tag stands clear of the needle when the mark is under it.
      const near = Math.abs(away) * PX_PER_YEAR < 26;
      const label = at(i, -36);
      tag(mark.label, label.x + (near ? (away < 0 ? -30 : 30) : 0), label.y, `17px ${HAND}`);
    }
    // A tag at each end points to the nearest marked year off the screen; tapping that side
    // of the dial rolls there (see main.js).
    const endY = h - 84;
    if (older) { c.font = `600 12px ${UI}`; tag(`‹  ${older.label}`, 12 + Math.max(34, c.measureText(`‹  ${older.label}`).width + 16) / 2, endY, `600 12px ${UI}`, 8, 24); }
    if (newer) { c.font = `600 12px ${UI}`; tag(`${newer.label}  ›`, w - 12 - Math.max(34, c.measureText(`${newer.label}  ›`).width + 16) / 2, endY, `600 12px ${UI}`, 8, 24); }

    // The needle: a thin brass tongue fixed over the rim, dipping 1 px as a tick passes.
    const dip = performance.now() - kickedAt < KICK_MS ? 1 : 0;
    const tip = apex + 6 + dip;
    c.save();
    c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowBlur = 3; c.shadowOffsetY = 1;
    c.fillStyle = BRASS_LIT;
    c.beginPath(); c.moveTo(cx - 5, tip - 17); c.lineTo(cx + 5, tip - 17); c.lineTo(cx + 5, tip - 9); c.lineTo(cx, tip); c.lineTo(cx - 5, tip - 9); c.closePath(); c.fill();
    c.restore();
    c.strokeStyle = BRASS_SHADE; c.lineWidth = 1;
    c.beginPath(); c.moveTo(cx, tip - 15); c.lineTo(cx, tip - 2); c.stroke();
    c.strokeStyle = '#f3e3b4'; c.globalAlpha = 0.8;
    c.beginPath(); c.moveTo(cx - 4.5, tip - 16.5); c.lineTo(cx - 4.5, tip - 9); c.stroke();
    c.globalAlpha = 1;
  }

  return { resize, draw, tick };
}
