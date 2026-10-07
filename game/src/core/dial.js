// The year dial's motion. Pure arithmetic stepped by time: no screen, no sound. The
// numbers are the ones settled by hand in docs/dial-proto.html.
//
// Inside, the dial counts a gapless year index (see when.js), so year 0 is skipped
// without a special case. offset is where the dial is drawn, in ticks; year is the tick
// it stands on. Dragging to the right brings older years.
import { yearFromIndex, yearIndex } from './when.js';

export const PX_PER_YEAR = 12;

// Every tenth year has a long tick and a lower sound. By the year, not by the dial's
// gapless count, so that 2560 BC is one of them.
export const isDecade = (year) => year % 10 === 0;
const MAX_SPEED = 2.5;        // px per ms
const GLIDE_MS = 500;         // the speed falls by 1/e in this long
const STOP_SPEED = 0.015;     // px per ms; below this the glide is over
const SETTLE_RATE = 0.012;    // share of the gap to the tick closed per ms
const MARK_PULL = 2;          // a dial coming to rest this many ticks from a marked year lands on it

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

export function createDial({ year, minYear = -2600, maxYear }) {
  const at = yearIndex(year);
  return {
    year, offset: at, resting: true, rolling: false,
    min: yearIndex(minYear), max: yearIndex(maxYear),
    held: false, speed: 0, reported: at, roll: null, marks: [],
  };
}

// The years that have something to see. A player is not expected to know them: the dial
// shows them (ui/dialView.js) and comes to rest on one when it stops close by.
export function setMarks(dial, years) {
  dial.marks = years.map(yearIndex).sort((a, b) => a - b);
}

// The marked year next to the one the dial stands on: way -1 older, +1 newer. null if none.
export function nextMark(dial, way) {
  const at = Math.round(dial.offset);
  const beyond = dial.marks.filter((m) => (way < 0 ? m < at : m > at));
  if (beyond.length === 0) return null;
  return yearFromIndex(way < 0 ? beyond[beyond.length - 1] : beyond[0]);
}

function restingTick(dial) {
  const near = dial.marks.filter((m) => Math.abs(m - dial.offset) <= MARK_PULL + 0.5);
  if (near.length === 0) return Math.round(dial.offset);
  return near.reduce((best, m) => (Math.abs(m - dial.offset) < Math.abs(best - dial.offset) ? m : best));
}

function moveTo(dial, offset) {
  dial.offset = clamp(offset, dial.min, dial.max);
  dial.year = yearFromIndex(Math.round(dial.offset));
}

export function grab(dial) {
  dial.held = true;
  dial.resting = false;
  dial.rolling = false;
  dial.roll = null;
  dial.speed = 0;
}

export function drag(dial, dxPx) {
  if (!dial.held) return;
  moveTo(dial, dial.offset - dxPx / PX_PER_YEAR);
}

// vPxPerMs is the finger's speed as it left; 0 when the touch was cancelled.
export function release(dial, vPxPerMs) {
  dial.held = false;
  dial.speed = clamp(vPxPerMs, -MAX_SPEED, MAX_SPEED);
}

// Rolls to the year in exactly this many seconds: speeding up over the first sixth,
// slowing over the last third.
export function rollTo(dial, year, seconds) {
  dial.held = false;
  dial.speed = 0;
  dial.resting = false;
  dial.rolling = true;
  dial.roll = { from: dial.offset, to: clamp(yearIndex(year), dial.min, dial.max), elapsed: 0, total: seconds * 1000 };
}

// Distance covered, 0 to 1, at time u (0 to 1) under a speed that rises linearly for
// the first 1/6, holds, and falls linearly over the last 1/3.
function rollProgress(u) {
  const up = 1 / 6;
  const down = 1 / 3;
  const peak = 1 / (1 - up / 2 - down / 2);
  if (u < up) return (peak * u * u) / (2 * up);
  if (u < 1 - down) return peak * (u - up / 2);
  const left = 1 - u;
  return 1 - (peak * left * left) / (2 * down);
}

// Advances the dial by dtMs. Returns the years of the ticks it came to stand on during
// this step, in order, for the sound and the date.
export function stepDial(dial, dtMs) {
  if (dial.rolling) {
    const { roll } = dial;
    roll.elapsed += dtMs;
    if (roll.elapsed >= roll.total) {
      moveTo(dial, roll.to);
      dial.rolling = false;
      dial.roll = null;
      dial.resting = true;
    } else {
      moveTo(dial, roll.from + (roll.to - roll.from) * rollProgress(roll.elapsed / roll.total));
    }
  } else if (!dial.held && !dial.resting) {
    if (Math.abs(dial.speed) > STOP_SPEED) {
      const before = dial.offset;
      moveTo(dial, dial.offset - (dial.speed * dtMs) / PX_PER_YEAR);
      dial.speed *= Math.exp(-dtMs / GLIDE_MS);
      // Against an end of the range there is nowhere left to glide.
      if (dial.offset === before || dial.offset === dial.min || dial.offset === dial.max) dial.speed = 0;
    } else {
      dial.speed = 0;
      const tick = restingTick(dial);
      const gap = tick - dial.offset;
      if (Math.abs(gap) < 0.002) {
        moveTo(dial, tick);
        dial.resting = true;
      } else {
        moveTo(dial, dial.offset + gap * Math.min(1, dtMs * SETTLE_RATE));
      }
    }
  }
  return passed(dial);
}

function passed(dial) {
  const now = Math.round(dial.offset);
  const seen = [];
  const way = Math.sign(now - dial.reported);
  for (let i = dial.reported + way; way !== 0 && i !== now + way; i += way) seen.push(yearFromIndex(i));
  dial.reported = now;
  return seen;
}
