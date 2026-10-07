// The progress of one visit to a square: which of its three dots are filled, how far the
// head is raised, and how far the clock has flowed to night. Timings are from
// docs/상세-기획-2-칸-하나의-흐름.md section 3.
const DAY_AFTER_MS = 1000;      // the day fills this long after arriving on the event year
const LOOK_RATE = 0.01;         // share of the way to the finger's target covered per ms
const LOOKING_UP = 0.95;        // the head counts as raised from here
const LOOK_HOLD_MS = 1500;      // looking up this long fills the sky, or starts the night
const NIGHT_FLOW_MS = 2000;     // the clock takes this long to reach 9 pm, and to come back

// dots: what the notebook already holds for this square; a dot filled on an earlier visit
// stays filled and is not announced again.
export function createVisit(square, dots = { day: false, sky: false, remains: false }) {
  return {
    square, t: 0, dots: { ...dots },
    look: 0, lookHeld: 0, night: 0, seenThen: false,
  };
}

export function visitAt(visit, { dialYear, thisYear }) {
  if (dialYear === visit.square.date.year) return 'then';
  if (dialYear === thisYear) return 'today';
  return 'other';
}

// lookTarget: 0 to 1, where the finger wants the head. Returns the names of the dots
// filled during this step: 'day', 'sky', 'remains'.
export function stepVisit(visit, dtMs, { dialYear, dialResting, thisYear, lookTarget }) {
  const filled = [];
  const fill = (name) => { if (!visit.dots[name]) { visit.dots[name] = true; filled.push(name); } };
  const at = visitAt(visit, { dialYear, thisYear });
  visit.t += dtMs;

  if (at === 'then' && dialResting) {
    visit.seenThen = true;
    if (visit.t >= DAY_AFTER_MS) fill('day');
  }

  visit.look += (lookTarget - visit.look) * Math.min(1, dtMs * LOOK_RATE);
  if (visit.look < 0.001) visit.look = 0;
  const lookingUp = visit.look >= LOOKING_UP;
  visit.lookHeld = lookingUp ? visit.lookHeld + dtMs : 0;

  if (visit.square.nightOnLook) {
    const toNight = lookingUp && visit.lookHeld >= LOOK_HOLD_MS;
    const step = dtMs / NIGHT_FLOW_MS;
    visit.night = Math.max(0, Math.min(1, visit.night + (toNight ? step : lookingUp ? 0 : -step)));
    if (visit.night > 0.9999) visit.night = 1;
    if (visit.night === 1) fill('sky');
  } else if (visit.lookHeld >= LOOK_HOLD_MS) {
    fill('sky');
  }

  if (at === 'today' && dialResting && visit.seenThen) fill('remains');
  return filled;
}
