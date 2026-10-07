// Draws the year dial: the top of a large disc at the bottom of the screen, with a tick
// for every year and a fixed needle. A disc of deep-blue glass like a star chart, with
// fine gold ticks and two gold rims: "night-sky glass", the third row of the concept
// sheet in docs/dial-상의.md, which the user chose on 2026.10.7 after finding the first
// dial, a flat navy disc with one gold line, cheap. The years are in the screen's type.
import { PX_PER_YEAR, isDecade } from '../core/dial.js';
import { formatYear, yearFromIndex, yearIndex } from '../core/when.js';

const UI = '"Pretendard Variable", Pretendard, "Malgun Gothic", sans-serif';
const GLASS_TOP = '#16246a';
const GLASS_FOOT = '#080d3a';
const GOLD = '#d8b866';
const GOLD_LIT = '#f3dc9a';
const GOLD_SHADE = '#8a6f34';
const GOLD_BRIGHT = '#ffe9a8';    // the marks: the one thing on the dial that should catch the eye
const TAG = '#0d1546';
const APEX_FROM_FOOT = 96;        // the top of the arc, in px above the bottom of the screen
const KICK_MS = 80;               // the needle dips this long when a tick passes

// A number from 0 to 1 that is always the same for the same two whole numbers.
function chance(a, b) {
  let x = (a * 374761393 + b * 668265263) | 0;
  x = Math.imul(x ^ (x >>> 13), 1274126177);
  return ((x ^ (x >>> 16)) >>> 0) / 4294967296;
}

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

  function ring(cx, cy, radius, colour, width, alpha = 1, dash = null) {
    c.globalAlpha = alpha;
    c.strokeStyle = colour; c.lineWidth = width;
    if (dash) c.setLineDash(dash);
    c.beginPath(); c.arc(cx, cy, radius, 0, Math.PI * 2); c.stroke();
    c.setLineDash([]);
    c.globalAlpha = 1;
  }

  // A four-pointed star.
  function star(x, y, size) {
    c.beginPath();
    for (let i = 0; i < 8; i += 1) {
      const r = i % 2 === 0 ? size : size * 0.3;
      const a = (i * Math.PI) / 4 - Math.PI / 2;
      c.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
    }
    c.closePath();
  }

  // A small tag of the same glass, edged and lettered in gold.
  const tagWidth = (text, pad = 8) => { c.font = `600 12px ${UI}`; return Math.max(36, c.measureText(text).width + pad * 2); };
  function tag(text, x, y, pad = 8, height = 22) {
    const wide = tagWidth(text, pad);
    c.save();
    c.shadowColor = 'rgba(0,0,0,.4)'; c.shadowBlur = 4; c.shadowOffsetY = 1;
    c.fillStyle = TAG;
    c.beginPath(); c.roundRect(x - wide / 2, y - height / 2, wide, height, 4); c.fill();
    c.restore();
    c.strokeStyle = GOLD; c.lineWidth = 1;
    c.beginPath(); c.roundRect(x - wide / 2, y - height / 2, wide, height, 4); c.stroke();
    c.fillStyle = GOLD_LIT; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText(text, x, y + 0.5);
  }

  // marks: [{ year, label }], the years with something to see.
  function draw(dial, marks = []) {
    c.clearRect(0, 0, w, h);
    const radius = w * 1.15;
    const cx = w / 2;
    const apex = h - APEX_FROM_FOOT;
    const cy = apex + radius;
    const disc = () => { c.beginPath(); c.arc(cx, cy, radius, 0, Math.PI * 2); };
    // Where year index i lies, `depth` px inside the rim.
    const at = (i, depth) => {
      const a = ((i - dial.offset) * PX_PER_YEAR) / radius;
      return { x: cx + Math.sin(a) * (radius - depth), y: cy - Math.cos(a) * (radius - depth) };
    };

    // The glass, with a soft shadow on the ground above its rim.
    c.save();
    c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowBlur = 9; c.shadowOffsetY = -1;
    const glass = c.createLinearGradient(0, apex, 0, h);
    glass.addColorStop(0, GLASS_TOP); glass.addColorStop(1, GLASS_FOOT);
    c.fillStyle = glass;
    disc(); c.fill();
    c.restore();

    // Inside the glass, a star chart that turns with the dial: dashed circles, and small
    // stars strung into figures. They are ornament, not the computed sky.
    c.save();
    disc(); c.clip();
    ring(cx, cy, radius - 52, GOLD, 0.8, 0.35, [5, 6]);
    ring(cx, cy, radius - 92, GOLD, 0.8, 0.25, [2, 7]);
    const span = Math.ceil(w / 2 / PX_PER_YEAR) + 6;
    const middle = Math.round(dial.offset);
    let last = null;
    for (let i = middle - span; i <= middle + span; i += 1) {
      if (chance(i, 1) > 0.3) { if (chance(i, 4) > 0.6) last = null; continue; }
      const p = at(i, 58 + chance(i, 2) * 52);
      const big = chance(i, 3) > 0.72;
      if (last && chance(i, 5) > 0.35) {
        c.strokeStyle = GOLD; c.lineWidth = 0.7; c.globalAlpha = 0.3;
        c.beginPath(); c.moveTo(last.x, last.y); c.lineTo(p.x, p.y); c.stroke();
      }
      c.fillStyle = GOLD_LIT; c.globalAlpha = big ? 0.75 : 0.5;
      if (big) { star(p.x, p.y, 4.5); c.fill(); } else { c.beginPath(); c.arc(p.x, p.y, 1.1, 0, Math.PI * 2); c.fill(); }
      last = p;
    }
    c.globalAlpha = 1;
    // A sheen across the top of the glass.
    const sheen = c.createLinearGradient(0, apex, 0, apex + 46);
    sheen.addColorStop(0, 'rgba(160,180,255,.16)'); sheen.addColorStop(1, 'rgba(160,180,255,0)');
    c.fillStyle = sheen;
    c.fillRect(0, apex, w, 46);
    c.restore();

    // Two gold rims with the glass between them.
    ring(cx, cy, radius - 1.2, GOLD, 2.4);
    ring(cx, cy, radius - 0.3, GOLD_LIT, 0.7, 0.9);
    ring(cx, cy, radius - 6, GOLD, 1.2, 0.9);
    ring(cx, cy, radius - 7, GOLD_SHADE, 0.6, 0.8);

    // Ticks in fine gold: one a year, longer every fifth, longest every tenth with its
    // year, upright.
    const reach = Math.ceil((radius * 0.7) / PX_PER_YEAR);
    const first = Math.max(dial.min, middle - reach);
    const final = Math.min(dial.max, middle + reach);
    c.strokeStyle = GOLD_LIT; c.fillStyle = GOLD_LIT; c.lineCap = 'butt';
    c.font = `600 12px ${UI}`; c.textAlign = 'center'; c.textBaseline = 'middle';
    for (let i = first; i <= final; i += 1) {
      const year = yearFromIndex(i);
      const long = isDecade(year) ? 18 : year % 5 === 0 ? 12 : 8;
      const from = at(i, 11);
      const to = at(i, 11 + long);
      c.globalAlpha = long === 18 ? 1 : long === 12 ? 0.75 : 0.5;
      c.lineWidth = long === 18 ? 2 : 1;
      c.beginPath(); c.moveTo(from.x, from.y); c.lineTo(to.x, to.y); c.stroke();
      if (long === 18) {
        const p = at(i, 11 + 18 + 13);
        c.globalAlpha = 1;
        c.fillText(formatYear(year), p.x, p.y);
      }
    }
    c.globalAlpha = 1;

    // Marked years: a bright tick, a shining star over the rim and a tag, so that nobody
    // has to know the year to find it.
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
      const from = at(i, 10);
      const to = at(i, 11 + 22);
      c.strokeStyle = GOLD_BRIGHT; c.lineWidth = 3;
      c.beginPath(); c.moveTo(from.x, from.y); c.lineTo(to.x, to.y); c.stroke();
      const top = at(i, -13);
      c.save();
      c.shadowColor = 'rgba(255,233,168,.95)'; c.shadowBlur = 10;
      c.fillStyle = GOLD_BRIGHT;
      star(top.x, top.y, 8); c.fill();
      c.restore();
      // The tag stands clear of the needle when the mark is under it.
      const near = Math.abs(away) * PX_PER_YEAR < 26;
      const label = at(i, -37);
      tag(mark.label, label.x + (near ? (away < 0 ? -30 : 30) : 0), label.y);
    }
    // A tag at each end points to the nearest marked year off the screen; tapping that side
    // of the dial rolls there (see main.js).
    const endY = h - 84;
    if (older) { const text = `‹  ${older.label}`; tag(text, 12 + tagWidth(text) / 2, endY, 8, 24); }
    if (newer) { const text = `${newer.label}  ›`; tag(text, w - 12 - tagWidth(text) / 2, endY, 8, 24); }

    // The needle: a gold arrowhead fixed over the rim, dipping 1 px as a tick passes.
    const dip = performance.now() - kickedAt < KICK_MS ? 1 : 0;
    const tip = apex + 3 + dip;
    const head = () => { c.beginPath(); c.moveTo(cx - 9, tip - 16); c.lineTo(cx + 9, tip - 16); c.lineTo(cx, tip); c.closePath(); };
    c.save();
    c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 4; c.shadowOffsetY = 1;
    const gold = c.createLinearGradient(cx - 9, 0, cx + 9, 0);
    gold.addColorStop(0, GOLD_LIT); gold.addColorStop(0.5, GOLD); gold.addColorStop(1, GOLD_SHADE);
    c.fillStyle = gold;
    head(); c.fill();
    c.restore();
    c.strokeStyle = GOLD_SHADE; c.lineWidth = 0.8;
    head(); c.stroke();
  }

  return { resize, draw, tick };
}
