// Draws the year dial: the top of a large disc at the bottom of the screen, with a tick
// for every year and a fixed needle. A disc of notebook paper in a thin brass rim, ticks
// and years in navy ink: "paper and brass", the look the user chose on 2026.10.7 from
// four (docs/dial-상의.md) after finding the first one, a flat navy disc with a gold
// line, cheap. The years are in the screen's type, not handwriting: they must read.
import { PX_PER_YEAR, isDecade } from '../core/dial.js';
import { formatYear, yearFromIndex, yearIndex } from '../core/when.js';

const UI = '"Pretendard Variable", Pretendard, "Malgun Gothic", sans-serif';
const PAPER_TOP = '#f2e6c8';
const PAPER_FOOT = '#e2d2ab';
const STAIN = '#b08a4a';
const INK = '#26295c';
const BRASS = '#a58a56';
const BRASS_LIT = '#d9c28a';
const BRASS_SHADE = '#62513a';
const BRASS_BRIGHT = '#f0cf78';   // the marks: the one thing on the dial that should catch the eye
const NIGHT = '10,12,44';         // laid over the paper by night so that it does not glare
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
    c.closePath();
  }

  // A small paper tag lettered in ink, like a bookmark slipped into the notebook.
  function tag(text, x, y, pad = 8, height = 22) {
    c.font = `600 12px ${UI}`;
    const wide = Math.max(36, c.measureText(text).width + pad * 2);
    c.save();
    c.shadowColor = 'rgba(0,0,0,.35)'; c.shadowBlur = 4; c.shadowOffsetY = 1;
    c.fillStyle = PAPER_TOP;
    c.beginPath(); c.roundRect(x - wide / 2, y - height / 2, wide, height, 3); c.fill();
    c.restore();
    c.strokeStyle = BRASS; c.lineWidth = 1;
    c.beginPath(); c.roundRect(x - wide / 2, y - height / 2, wide, height, 3); c.stroke();
    c.fillStyle = INK; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText(text, x, y + 0.5);
  }
  const tagWidth = (text, pad = 8) => { c.font = `600 12px ${UI}`; return Math.max(36, c.measureText(text).width + pad * 2); };

  // marks: [{ year, label }], the years with something to see. day: 1 by day, 0 by night.
  function draw(dial, marks = [], day = 1) {
    c.clearRect(0, 0, w, h);
    const radius = w * 1.15;
    const cx = w / 2;
    const apex = h - APEX_FROM_FOOT;
    const cy = apex + radius;
    const disc = () => { c.beginPath(); c.arc(cx, cy, radius, 0, Math.PI * 2); };

    // The paper, with a soft shadow on the ground above its rim.
    c.save();
    c.shadowColor = 'rgba(0,0,0,.4)'; c.shadowBlur = 8; c.shadowOffsetY = -1;
    const paper = c.createLinearGradient(0, apex, 0, h);
    paper.addColorStop(0, PAPER_TOP); paper.addColorStop(1, PAPER_FOOT);
    c.fillStyle = paper;
    disc(); c.fill();
    c.restore();
    // Old paper: a few faint stains, and by night a veil so that it does not glare.
    c.save();
    disc(); c.clip();
    for (const [sx, sy, sr] of [[0.12, 30, 70], [0.82, 62, 90], [0.55, 96, 60]]) {
      const stain = c.createRadialGradient(sx * w, apex + sy, 0, sx * w, apex + sy, sr);
      stain.addColorStop(0, STAIN); stain.addColorStop(1, 'rgba(176,138,74,0)');
      c.globalAlpha = 0.1; c.fillStyle = stain;
      c.fillRect(0, apex - 10, w, h - apex + 10);
    }
    c.globalAlpha = 1;
    c.fillStyle = `rgba(${NIGHT},${((1 - day) * 0.38).toFixed(3)})`;
    c.fillRect(0, apex - 10, w, h - apex + 10);
    c.restore();
    // The brass rim: a lit top edge, the body, a dark inner edge, and a hairline inside.
    ring(cx, cy, radius - 2.5, BRASS, 5);
    ring(cx, cy, radius - 0.5, BRASS_LIT, 1, 0.85);
    ring(cx, cy, radius - 5.5, BRASS_SHADE, 1, 0.8);
    ring(cx, cy, radius - 8, BRASS, 0.8, 0.7);

    // Ticks in ink: one a year, longer every fifth, longest every tenth with its year, upright.
    const at = (i, depth) => {
      const a = ((i - dial.offset) * PX_PER_YEAR) / radius;
      return { x: cx + Math.sin(a) * (radius - depth), y: cy - Math.cos(a) * (radius - depth) };
    };
    const reach = Math.ceil((radius * 0.7) / PX_PER_YEAR);
    const first = Math.max(dial.min, Math.round(dial.offset) - reach);
    const last = Math.min(dial.max, Math.round(dial.offset) + reach);
    c.strokeStyle = INK; c.fillStyle = INK; c.lineCap = 'round';
    c.font = `600 12px ${UI}`; c.textAlign = 'center'; c.textBaseline = 'middle';
    for (let i = first; i <= last; i += 1) {
      const year = yearFromIndex(i);
      const long = isDecade(year) ? 18 : year % 5 === 0 ? 12 : 8;
      const from = at(i, 12);
      const to = at(i, 12 + long);
      c.globalAlpha = long === 18 ? 0.95 : long === 12 ? 0.75 : 0.55;
      c.lineWidth = long === 18 ? 2.2 : 1.2;
      c.beginPath(); c.moveTo(from.x, from.y); c.lineTo(to.x, to.y); c.stroke();
      if (long === 18) {
        const p = at(i, 12 + 18 + 13);
        c.globalAlpha = 0.95;
        c.fillText(formatYear(year), p.x, p.y);
      }
    }
    c.globalAlpha = 1;

    // Marked years: a heavy ink tick, a gold star over the rim and a paper tag, so that
    // nobody has to know the year to find it.
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
      const from = at(i, 11);
      const to = at(i, 12 + 22);
      c.strokeStyle = INK; c.lineWidth = 3.2;
      c.beginPath(); c.moveTo(from.x, from.y); c.lineTo(to.x, to.y); c.stroke();
      const top = at(i, -13);
      c.save();
      c.shadowColor = 'rgba(240,207,120,.95)'; c.shadowBlur = 9;
      c.fillStyle = BRASS_BRIGHT;
      star(top.x, top.y, 7.5); c.fill();
      c.restore();
      c.strokeStyle = BRASS_SHADE; c.lineWidth = 0.8;
      star(top.x, top.y, 7.5); c.stroke();
      // The tag stands clear of the needle when the mark is under it.
      const near = Math.abs(away) * PX_PER_YEAR < 26;
      const label = at(i, -36);
      tag(mark.label, label.x + (near ? (away < 0 ? -30 : 30) : 0), label.y);
    }
    // A tag at each end points to the nearest marked year off the screen; tapping that side
    // of the dial rolls there (see main.js).
    const endY = h - 84;
    if (older) { const text = `‹  ${older.label}`; tag(text, 12 + tagWidth(text) / 2, endY, 8, 24); }
    if (newer) { const text = `${newer.label}  ›`; tag(text, w - 12 - tagWidth(text) / 2, endY, 8, 24); }

    // The needle: a brass clip fixed over the rim, dipping 1 px as a tick passes.
    const dip = performance.now() - kickedAt < KICK_MS ? 1 : 0;
    const tip = apex + 9 + dip;
    c.save();
    c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowBlur = 3; c.shadowOffsetY = 1;
    c.fillStyle = BRASS_LIT;
    c.beginPath(); c.moveTo(cx - 6, tip - 20); c.lineTo(cx + 6, tip - 20); c.lineTo(cx + 6, tip - 10); c.lineTo(cx, tip); c.lineTo(cx - 6, tip - 10); c.closePath(); c.fill();
    c.restore();
    c.strokeStyle = BRASS_SHADE; c.lineWidth = 1;
    c.beginPath(); c.moveTo(cx - 6, tip - 20); c.lineTo(cx + 6, tip - 20); c.lineTo(cx + 6, tip - 10); c.lineTo(cx, tip); c.lineTo(cx - 6, tip - 10); c.closePath(); c.stroke();
    c.beginPath(); c.moveTo(cx, tip - 17); c.lineTo(cx, tip - 3); c.stroke();
    c.strokeStyle = '#fff3cf'; c.globalAlpha = 0.85;
    c.beginPath(); c.moveTo(cx - 4.5, tip - 18.5); c.lineTo(cx - 4.5, tip - 10.5); c.stroke();
    c.globalAlpha = 1;
  }

  return { resize, draw, tick };
}
