// The Colosseum as a place: its shape, the parts it is made of, the year each part
// comes and goes, and where a flier may not be. Nothing here draws; render/site.js
// builds the parts and core/fly.js keeps the flier out of the stone.
// (docs/기획서-v2-열두-자리.md section 6: the first test of "a square is a place".)
//
// The building's own axes: x along the long axis, z across it, y up, metres. Every ring
// of the building is the outer wall's ellipse moved inward along its normal by d metres,
// so that the stands are everywhere as deep. The outline is right; the detail is not
// meant to be. The years are from memory and in four broad steps (80, 1349, 1750, today).
export const SEMI_LONG = 94;      // the outer wall: 188 m by 156 m
export const SEMI_SHORT = 78;
export const TURN_DEG = 20;       // the long axis runs to azimuth 110: the building is turned this far
export const BAYS = 80;           // arches round the outer wall
export const LEVELS = [           // the outer wall: three arcades and the attic, 48 m in all
  { y: 0, h: 10.5 }, { y: 10.5, h: 11.85 }, { y: 22.35, h: 11.6 }, { y: 33.95, h: 14.05 },
];
export const WALL_TOP = 48;
export const RING2 = 9;           // the second wall, this far in
export const ARENA = 52.5;        // the arena's edge, this far in
export const PIT = 6;             // the rooms under the arena are this deep
export const EYE = 1.7;
export const YEARS = [80, 1349, 1750, 2026];
export const FOREVER = Infinity;

const TAU = Math.PI * 2;
const STEP = TAU / BAYS;

// The point d metres inside the outer wall at the ellipse's parameter t, with the
// outward normal there.
export function onRing(t, d = 0) {
  const nx0 = SEMI_SHORT * Math.cos(t);
  const nz0 = SEMI_LONG * Math.sin(t);
  const len = Math.hypot(nx0, nz0);
  const nx = nx0 / len;
  const nz = nz0 / len;
  return { x: SEMI_LONG * Math.cos(t) - d * nx, z: SEMI_SHORT * Math.sin(t) - d * nz, nx, nz };
}
export const bayMiddle = (bay) => (bay + 0.5) * STEP;
export const bayStart = (bay) => bay * STEP;

// Where a point lies by the rings: which bay it is in and how far inside the outer wall
// (below zero: outside). Near enough for keeping a flier out of walls.
export function ringPlace(x, z) {
  const t = (Math.atan2(z / SEMI_SHORT, x / SEMI_LONG) + TAU) % TAU;
  const p = onRing(t);
  return { bay: Math.min(BAYS - 1, Math.floor(t / STEP)), d: (p.x - x) * p.nx + (p.z - z) * p.nz, t };
}

// A small seeded generator, so that the ruin is the same ruin every time.
function seeded(seed) {
  let a = seed;
  return () => {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// How far a bay faces from the building's north side (its +z), in degrees. The north side
// of the outer wall is the part that stands today.
const fromNorth = (bay) => (Math.acos(Math.max(-1, Math.min(1, onRing(bayMiddle(bay)).nz))) * 180) / Math.PI;
export const STANDS_WITHIN = 70;   // of the north: 32 bays of the 80
const FELL_BEYOND = 110;           // the south side came down in the earthquake of 1349

function fates() {
  const rnd = seeded(80);
  const outer = [];    // [bay][level]: the year that part of the outer wall is gone
  const ring2 = [];    // [bay][level]: the second wall, three levels
  for (let bay = 0; bay < BAYS; bay += 1) {
    const turn = fromNorth(bay);
    let base = FOREVER;
    // Down by the time the dial stands on 1349: the fall is seen in the years just before.
    if (turn >= FELL_BEYOND) base = 1343 + rnd() * 4;
    else if (turn > STANDS_WITHIN) base = 1400 + rnd() * 300;   // quarried away, stone by stone
    // The top goes first where stone was carried off; in the earthquake all went together.
    outer.push(LEVELS.map((_, level) => (base === FOREVER ? FOREVER : turn >= FELL_BEYOND ? base + rnd() * 2 : base + (3 - level) * 12)));
    // The second wall keeps its two arcades; most of its third level is gone.
    ring2.push([FOREVER, FOREVER, rnd() < 0.3 ? FOREVER : 1349 + rnd() * 400]);
  }
  const chunks = BAYS / 8;
  const seats = [0, 1, 2].map((tier) => Array.from({ length: chunks }, () => [650, 950, 1150][tier] + rnd() * [700, 650, 600][tier]));
  const gallery = Array.from({ length: chunks }, (_, chunk) => {
    const turn = fromNorth(chunk * 8 + 4);
    return turn >= FELL_BEYOND ? 1344 + rnd() * 4 : 1400 + rnd() * 300;
  });
  const awning = Array.from({ length: chunks }, () => 420 + rnd() * 140);
  const masts = Array.from({ length: BAYS * 3 }, () => 430 + rnd() * 170);
  const statues = Array.from({ length: BAYS * 2 }, () => 500 + rnd() * 300);
  const jitter = Array.from({ length: BAYS * 3 }, () => 0.75 + rnd() * 0.5);
  return { outer, ring2, seats, gallery, awning, masts, statues, jitter };
}
export const FATES = fates();

// The stands, from the second wall down to the arena: three tiers and the podium.
export const TIERS = [
  { from: RING2, to: 24, top: 33, foot: 22, steps: 5 },
  { from: 24, to: 40, top: 22, foot: 10, steps: 6 },
  { from: 40, to: 49, top: 10, foot: 4, steps: 4 },
];
export const PODIUM = 4;
export function standHeight(d) {
  for (const tier of TIERS) if (d <= tier.to) return tier.top + ((tier.foot - tier.top) * (d - tier.from)) / (tier.to - tier.from);
  return PODIUM;
}
const tierAt = (d) => (d <= TIERS[0].to ? 0 : d <= TIERS[1].to ? 1 : 2);
const RUIN = 0.55;          // what is left under the seats stands this high beside them

export const FLOOR_WOOD_GONE = 523;     // the last games; after them earth filled the arena
export const FLOOR_EARTH_GONE = 1874;   // dug out: the rooms beneath come to light
export const DECK_BORN = 2000;          // a part of the floor laid again
export const BUTTRESS_BORN = [1807, 1826];
export const COLOSSUS_GONE = 1000;      // when the bronze giant went is not known

export const stands = (year, born, gone) => year >= born && year < gone;

// The top of the outer wall at a bay in a year: the levels fall from the top down.
export function outerTop(bay, year) {
  let top = 0;
  LEVELS.forEach((level, i) => { if (year < FATES.outer[bay][i]) top = Math.max(top, level.y + level.h); });
  return top;
}
export function ring2Top(bay, year) {
  let top = 0;
  for (let i = 0; i < 3; i += 1) if (year < FATES.ring2[bay][i]) top = Math.max(top, LEVELS[i].y + LEVELS[i].h);
  return top;
}

// The lowest a flier's eye may be at a place in the building's own axes: over the
// stands, the ruin under them, and the roof of the top gallery when above it.
export function floorAt(x, z, y, year) {
  const { bay, d } = ringPlace(x, z);
  if (d < 0 || d >= ARENA) return EYE;
  const chunk = Math.floor(bay / 8);
  if (d < RING2) return y > 30 && year < FATES.gallery[chunk] ? 36 + EYE : EYE;
  const h = standHeight(d);
  return (year < FATES.seats[tierAt(d)][chunk] ? h : h * RUIN) + EYE;
}

const WALL_HALF = 1.7;      // half a wall's thickness, with room for the eye
const ARCH_CLEAR = 8;       // under this the ground arcade is walked through
// Whether a place is inside standing stone: the outer wall and the second wall, above
// the ground arches.
export function inWall(x, z, y, year) {
  if (y < ARCH_CLEAR) return false;
  const { bay, d } = ringPlace(x, z);
  if (Math.abs(d) < WALL_HALF) return y < outerTop(bay, year);
  if (Math.abs(d - RING2) < WALL_HALF) return y < ring2Top(bay, year);
  return false;
}

// From the world (x east, z north) into the building's own axes and back.
const TURN = (TURN_DEG * Math.PI) / 180;
export const toLocal = (x, z) => ({ x: x * Math.cos(TURN) - z * Math.sin(TURN), z: x * Math.sin(TURN) + z * Math.cos(TURN) });
export const toWorld = (x, z) => ({ x: x * Math.cos(TURN) + z * Math.sin(TURN), z: -x * Math.sin(TURN) + z * Math.cos(TURN) });
