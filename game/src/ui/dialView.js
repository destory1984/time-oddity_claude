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

// The Big Dipper, the figure inside the glass (the user, 2026.10.7: "다이얼 안에 들어가는
// 별자리는 북두칠성으로 해줘"). Each star by where it really stands: degrees east (to the
// left, as the sky is seen) and north of the middle of the figure, worked out from its
// right ascension and declination. Megrez, where handle meets bowl, is the faint one;
// Alcor is Mizar's small companion.
const DIPPER = [
  { name: 'Dubhe', east: -11.5, north: 6.75, bright: true },
  { name: 'Merak', east: -11.8, north: 1.38, bright: true },
  { name: 'Phecda', east: -4.3, north: -1.31, bright: true },
  { name: 'Megrez', east: -1.2, north: 2.03, bright: false },
  { name: 'Alioth', east: 4.3, north: 0.96, bright: true },
  { name: 'Mizar', east: 8.6, north: -0.07, bright: true },
  { name: 'Alkaid', east: 12.0, north: -5.69, bright: true },
];
const ALCOR = { east: 9.1, north: 0.35 };
// The bowl (closed) and the handle, as pairs of stars to join.
const DIPPER_LINES = [[0, 1], [1, 2], [2, 3], [3, 0], [3, 4], [4, 5], [5, 6]];
// Only the top 96 px of the disc shows, the year numbers take the first 50, and the
// figure must fit in what is left.
const DIPPER_PX_PER_DEG = 3.6;    // the figure is 86 px wide and 45 px tall
const DIPPER_DEPTH = 74;          // its middle, in px inside the rim
const DIPPER_EVERY = 20;          // one figure every 20 years of the dial (240 px)

// Sparkles that come as the dial is turned (the user, 2026.10.7: "다이얼을 돌릴 때에 유리가
// 반짝반짝하는 느낌의 효과를 추가해 줘"): small stars of light that flash on the glass where
// it is passing and are gone in a third of a second.
const SPARK_MS = 340;
const SPARKS_PER_TICK = 1.6;
const SPARKS_AT_MOST = 40;

// A number from 0 to 1 that is always the same for the same two whole numbers.
function chance(a, b) {
  let x = (a * 374761393 + b * 668265263) | 0;
  x = Math.imul(x ^ (x >>> 13), 1274126177);
  return ((x ^ (x >>> 16)) >>> 0) / 4294967296;
}

// Looks of the glass to choose between, with the buttons that ?dial in the address puts
// on the screen (0 is the plain one). Fourth round, 2026.10.7. Settled so far, round by
// round: thick glass, a softly glowing edge, a vivid star chart with star dust, and
// sparks of light that twinkle on the rim. The user then asked for the colour a little
// darker: these five differ only in how dark the navy is and which way it leans.
// bevel: how wide the band of light inside the rim is (the thickness of the glass).
// glow: the colour of the light at the edge ('r,g,b') and how strong. chart: how many
// stars (the share of years that carry one), how bright its lines, dots and large stars
// are, their colour, and whether fine star dust lies behind them. shine: how the light
// plays (see draw()).
const VIVID = { share: 0.44, line: 0.75, dot: 0.95, big: 1, colour: GOLD_BRIGHT, dust: true };
const SPARKS = { bevel: 9, glow: { rgb: '255,236,180', strength: 0.85 }, chart: VIVID, shine: 'glints' };
const GLASS = {
  0: { top: GLASS_TOP, foot: GLASS_FOOT, bevel: 0, glow: null, chart: { share: 0.3, line: 0.3, dot: 0.5, big: 0.75, colour: GOLD_LIT, dust: false }, shine: null },
  1: { top: '#0c1442', foot: '#04061e', ...SPARKS },   // one step darker than round three (#101a52 to #050828)
  2: { top: '#090f34', foot: '#020416', ...SPARKS },   // two steps darker
  3: { top: '#070b28', foot: '#010210', ...SPARKS },   // a blue-black night
  4: { top: '#100f40', foot: '#05041c', ...SPARKS },   // one step darker, leaning to violet
  5: { top: '#101a52', foot: '#010210', ...SPARKS },   // the same at the rim, falling to black below
};

export function createDialView(canvas, firstStyle = 0) {
  let style = firstStyle;
  const c = canvas.getContext('2d');
  let w = 0;
  let h = 0;
  let kickedAt = -1000;
  let sparks = [];           // { tick, depth, size, born }: fixed to the glass, so they turn with it
  let lastOffset = null;
  let owed = 0;

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
    const look = GLASS[style] ?? GLASS[0];
    c.save();
    c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowBlur = 9; c.shadowOffsetY = -1;
    const glass = c.createLinearGradient(0, apex, 0, h);
    glass.addColorStop(0, look.top); glass.addColorStop(1, look.foot);
    c.fillStyle = glass;
    disc(); c.fill();
    c.restore();

    // Inside the glass, a star chart that turns with the dial: dashed circles, star dust
    // and the Big Dipper. It is ornament, not the computed sky.
    const { chart } = look;
    c.save();
    disc(); c.clip();
    ring(cx, cy, radius - 52, GOLD, 0.8, 0.35 + chart.line * 0.2, [5, 6]);
    ring(cx, cy, radius - 92, GOLD, 0.8, 0.25 + chart.line * 0.2, [2, 7]);
    const span = Math.ceil(w / 2 / PX_PER_YEAR) + 6;
    const middle = Math.round(dial.offset);
    if (chart.dust) {
      c.fillStyle = '#ffffff';
      for (let i = middle - span; i <= middle + span; i += 1) {
        for (let k = 0; k < 2; k += 1) {
          if (chance(i, 20 + k) > 0.55) continue;
          const p = at(i + chance(i, 30 + k) - 0.5, 44 + chance(i, 40 + k) * 90);
          c.globalAlpha = 0.18 + chance(i, 50 + k) * 0.3;
          c.beginPath(); c.arc(p.x, p.y, 0.7, 0, Math.PI * 2); c.fill();
        }
      }
    }
    // The Big Dipper, again and again round the disc, turning with the dial.
    const firstFigure = Math.floor((middle - span) / DIPPER_EVERY) - 1;
    const lastFigure = Math.floor((middle + span) / DIPPER_EVERY) + 1;
    for (let n = firstFigure; n <= lastFigure; n += 1) {
      const centre = n * DIPPER_EVERY + DIPPER_EVERY / 2;
      // East is to the left, which on the dial is toward earlier years.
      const spot = ({ east, north }) => at(centre - (east * DIPPER_PX_PER_DEG) / PX_PER_YEAR, DIPPER_DEPTH - north * DIPPER_PX_PER_DEG);
      const stars = DIPPER.map(spot);
      c.strokeStyle = chart.colour; c.lineWidth = chart.line > 0.6 ? 1 : 0.7; c.globalAlpha = chart.line;
      c.beginPath();
      for (const [from, to] of DIPPER_LINES) { c.moveTo(stars[from].x, stars[from].y); c.lineTo(stars[to].x, stars[to].y); }
      c.stroke();
      c.fillStyle = chart.colour;
      DIPPER.forEach((one, k) => {
        const p0 = stars[k];
        c.save();
        c.globalAlpha = one.bright ? chart.big : chart.dot;
        if (one.bright && chart.big >= 0.95) { c.shadowColor = chart.colour; c.shadowBlur = 5; }
        if (one.bright) { star(p0.x, p0.y, chart.big >= 1 ? 5.5 : 4.5); c.fill(); } else { c.beginPath(); c.arc(p0.x, p0.y, 1.8, 0, Math.PI * 2); c.fill(); }
        c.restore();
      });
      const alcor = spot(ALCOR);
      c.globalAlpha = chart.dot * 0.8;
      c.beginPath(); c.arc(alcor.x, alcor.y, 0.9, 0, Math.PI * 2); c.fill();
    }
    c.globalAlpha = 1;
    // A sheen across the top of the glass.
    const sheen = c.createLinearGradient(0, apex, 0, apex + 46);
    sheen.addColorStop(0, 'rgba(160,180,255,.14)'); sheen.addColorStop(1, 'rgba(160,180,255,0)');
    c.fillStyle = sheen;
    c.fillRect(0, apex, w, 46);
    const arc = (r, from, to, colour, width, blur = 0) => {
      c.save();
      c.strokeStyle = colour; c.lineWidth = width; c.lineCap = 'round';
      if (blur) { c.shadowColor = colour; c.shadowBlur = blur; }
      c.beginPath(); c.arc(cx, cy, r, -Math.PI / 2 + from, -Math.PI / 2 + to); c.stroke();
      c.restore();
    };
    if (look.bevel > 0) {
      // The thickness of the glass: a band of light just inside the rim, a dark line where
      // the bevel ends, a hairline of light under that, and two short reflections.
      const band = look.bevel;
      ring(cx, cy, radius - 8 - band / 2, 'rgba(190,210,255,1)', band, 0.15);
      if (band > 12) ring(cx, cy, radius - 8 - band * 0.28, 'rgba(225,235,255,1)', band * 0.3, 0.12);
      ring(cx, cy, radius - 9 - band, 'rgba(0,0,16,1)', 2.5, 0.55);
      ring(cx, cy, radius - 11.5 - band, 'rgba(170,195,255,1)', 1, 0.3);
      arc(radius - 8 - band / 2, -0.3, -0.08, 'rgba(255,255,255,.5)', Math.min(3, band / 3.5), 6);
      arc(radius - 8 - band / 2, 0.15, 0.21, 'rgba(255,255,255,.35)', 2, 4);
    }
    const now = performance.now();
    if (look.shine) {
      // The further the dial has turned since the last frame, the more sparkles are lit.
      const turned = lastOffset === null ? 0 : Math.abs(dial.offset - lastOffset);
      owed = Math.min(6, owed + turned * SPARKS_PER_TICK);
      while (owed >= 1 && sparks.length < SPARKS_AT_MOST) {
        owed -= 1;
        sparks.push({ tick: dial.offset + (Math.random() - 0.5) * (w / PX_PER_YEAR), depth: 4 + Math.random() * 86, size: 2.5 + Math.random() * 3.5, born: now });
      }
      sparks = sparks.filter((spark) => now - spark.born < SPARK_MS);
      for (const spark of sparks) {
        const p0 = at(spark.tick, spark.depth);
        const life = (now - spark.born) / SPARK_MS;
        c.save();
        c.globalAlpha = Math.sin(life * Math.PI);
        c.shadowColor = 'rgba(255,255,255,.95)'; c.shadowBlur = 8;
        c.fillStyle = '#ffffff';
        star(p0.x, p0.y, spark.size * (0.6 + 0.4 * Math.sin(life * Math.PI))); c.fill();
        c.restore();
      }
    }
    lastOffset = dial.offset;
    if (look.shine === 'glints') {
      // Sparks where the rim catches the light; they twinkle slowly, each in its own time.
      for (const [angle, size, beat] of [[-0.24, 6, 0], [0.11, 4.5, 1.9], [0.31, 5, 3.7], [-0.06, 3.5, 2.8]]) {
        const twinkle = 0.55 + 0.45 * Math.sin(now / 900 + beat);
        const x = cx + Math.sin(angle) * (radius - 3);
        const y = cy - Math.cos(angle) * (radius - 3);
        c.save();
        c.globalAlpha = twinkle;
        c.shadowColor = 'rgba(255,255,255,.95)'; c.shadowBlur = 10;
        c.fillStyle = '#ffffff';
        star(x, y, size); c.fill();
        c.restore();
      }
      arc(radius - 12, -0.32, -0.04, 'rgba(255,255,255,.55)', 2.5, 8);
    }
    const band = (x, wide, alpha) => {
      const g = c.createLinearGradient(x, 0, x + wide, 0);
      g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, `rgba(235,242,255,${alpha})`); g.addColorStop(1, 'rgba(255,255,255,0)');
      c.fillStyle = g; c.fillRect(x, -260, wide, 520);
    };
    if (look.shine === 'streaks') {
      // Light falling across polished glass: slanting streaks, brightest near the rim.
      c.save();
      c.translate(cx - 60, apex + 30); c.rotate(-0.5);
      band(-40, 54, 0.26); band(30, 18, 0.18); band(170, 80, 0.13);
      c.restore();
      arc(radius - 12, -0.34, -0.06, 'rgba(255,255,255,.6)', 2.5, 8);
    }
    if (look.shine === 'sweep') {
      // A gleam crosses the glass in a second and a half, every six seconds.
      const t = (now % 6000) / 1500;
      if (t < 1) {
        c.save();
        c.translate(-90 + t * (w + 180), apex + 40); c.rotate(-0.5);
        band(-30, 60, 0.34 * Math.sin(t * Math.PI)); band(34, 16, 0.2 * Math.sin(t * Math.PI));
        c.restore();
      }
      arc(radius - 12, -0.3, -0.08, 'rgba(255,255,255,.45)', 2.5, 6);
    }
    if (look.shine === 'turning') {
      // The lamp stays where it is and the glass turns under it: the reflections slide a
      // little against the turning, and a soft patch of light drifts with them.
      const slide = Math.sin(dial.offset * 0.45);
      const patch = c.createRadialGradient(cx - 50 + slide * 46, apex + 30, 0, cx - 50 + slide * 46, apex + 30, 120);
      patch.addColorStop(0, 'rgba(205,222,255,.3)'); patch.addColorStop(1, 'rgba(205,222,255,0)');
      c.fillStyle = patch; c.fillRect(0, apex - 4, w, h - apex + 4);
      arc(radius - 12, -0.3 + slide * 0.07, -0.1 + slide * 0.07, 'rgba(255,255,255,.65)', 2.8, 8);
      arc(radius - 12, 0.14 - slide * 0.05, 0.2 - slide * 0.05, 'rgba(255,255,255,.4)', 2, 5);
    }
    if (look.shine === 'inner') {
      // Lit from within: the glass itself glows, strongest under the needle, and breathes.
      const breath = 0.85 + 0.15 * Math.sin(now / 1400);
      const lit = c.createRadialGradient(cx, apex + 64, 0, cx, apex + 64, 230);
      lit.addColorStop(0, `rgba(120,175,255,${0.34 * breath})`); lit.addColorStop(0.6, `rgba(90,140,255,${0.1 * breath})`); lit.addColorStop(1, 'rgba(90,140,255,0)');
      c.fillStyle = lit; c.fillRect(0, apex - 4, w, h - apex + 4);
      arc(radius - 12, -0.3, -0.06, 'rgba(255,255,255,.55)', 2.5, 8);
      arc(radius - 46, 0.05, 0.28, 'rgba(190,215,255,.1)', 5, 14);
    }
    if (look.glow) {
      // The edge gathers light: a soft band of it just inside the rim.
      ring(cx, cy, radius - 7, `rgba(${look.glow.rgb},1)`, 12, 0.13 * look.glow.strength / 0.6);
    }
    c.restore();
    if (look.glow) {
      // And a little of it spills over the rim.
      c.save();
      c.shadowColor = `rgba(${look.glow.rgb},${look.glow.strength})`; c.shadowBlur = 12;
      ring(cx, cy, radius - 1, `rgba(${look.glow.rgb},.9)`, 1.5);
      c.restore();
    }

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

  // Changes the look of the glass on the spot, for choosing between them.
  function setStyle(next) { style = next; }

  return { resize, draw, tick, setStyle };
}
