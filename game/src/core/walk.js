// Walking about a place where people live: two to four scenes joined end to end, each
// about three screens wide, with people who say a line when spoken to and three errands
// from grandmother to go looking for (docs/기획서-v4-사는-때로.md section 3). Two things can
// be done: walk left and right, and speak to whoever is near. Nothing here draws.
// Plan v5 (docs/기획서-v5-완성판.md section 4) adds what she does with her own body: what
// someone sells or keeps can be eaten, worn or used (a person's `try`).
//
// Along a scene, x runs from 0 at its left end to 1 at its right.
// place: { scenes: [{ id, name, people: [{ id, name, x, lines }], spots: [{ id, from, to, memo?, sora? }] }],
//          errands: [{ id, text, at: [ids of people, spots or things tried, any one of which does it] }] }
// A person's try: { id, verb: 'eat' | 'wear' | 'use', name, sora: what she says of it,
//   memo?: what grandmother wrote, face?: how it tasted ('yum', 'sour', 'yuck', 'hmm'),
//   outfit?: what she has on afterwards, pose?: how she stands for a moment on trying it
//   (a picture of hers, public/sora/<pose>.png), trips?: how many frames there are of her
//   treading on its hem as she walks (<outfit>-trip-N.png) }. Something that is not a person (a water clock)
// has a try and no lines.
export const VERBS = { eat: '먹어 볼래', wear: '입어 볼래', use: '써 볼래' };
export const FACES = ['yum', 'sour', 'yuck', 'hmm'];
export const SPEED = 0.11;        // of a scene's width a second: nine seconds from end to end
export const REACH = 0.05;        // she can speak to someone this near
const EDGE = 0.02;                // she stops this far from a scene's end
const ARRIVE = 0.012;             // near enough to where she was sent

// tried: what she has tried here on earlier visits, by id.
export function createWalk(place, { scene = 0, x = 0.08, tried = [] } = {}) {
  return {
    place, scene, x, facing: 1, moving: false, goal: null,
    said: {},            // how many times each person has been spoken to
    heard: null,         // { id, line }: what was last said to her, while it is shown
    done: [],            // the errands done, by id
    seen: [],            // the spots she has stood at, by id
    told: [],            // the scenes she has said her line in, by id
    tried: [...tried],   // what she has eaten, worn or used, by id
    wearing: null,       // the outfit she has on, until she leaves
    trips: 0,            // how many frames it has of her treading on its hem
  };
}

export const sceneOf = (walk) => walk.place.scenes[walk.scene];

// Whoever is nearest within reach, or null.
export function nearby(walk) {
  let best = null;
  for (const person of sceneOf(walk).people) {
    const far = Math.abs(person.x - walk.x);
    if (far <= REACH && (!best || far < Math.abs(best.x - walk.x))) best = person;
  }
  return best;
}

// The spot she stands in, or null.
export const spotAt = (walk) => sceneOf(walk).spots.find((spot) => walk.x >= spot.from && walk.x <= spot.to) ?? null;

function finish(walk, id) {
  const fresh = [];
  for (const errand of walk.place.errands) {
    if (errand.at.includes(id) && !walk.done.includes(errand.id)) { walk.done.push(errand.id); fresh.push(errand.id); }
  }
  return fresh;
}

// Speaks to whoever is near. Returns { person, line, errands: [ids done just now] }, or
// null when nobody is. A person says a first line, then another, then the two in turn.
// id: the one meant, when several stand near.
export function speak(walk, id = null) {
  const meant = id ? sceneOf(walk).people.find((p) => p.id === id && Math.abs(p.x - walk.x) <= REACH) : null;
  const person = meant ?? nearby(walk);
  if (!person?.lines) return null;
  const count = walk.said[person.id] ?? 0;
  const line = person.lines[count % person.lines.length];
  walk.said[person.id] = count + 1;
  walk.heard = { id: person.id, line };
  walk.goal = null;
  walk.facing = person.x >= walk.x ? 1 : -1;
  return { person, line, errands: finish(walk, person.id) };
}

// Tries what whoever is near has to offer. Returns { person, it: the person's try,
// first: not tried before, errands: [ids done just now] }, or null when there is nothing.
export function tryIt(walk, id = null) {
  const meant = id ? sceneOf(walk).people.find((p) => p.id === id && Math.abs(p.x - walk.x) <= REACH) : null;
  const person = meant ?? nearby(walk);
  if (!person?.try) return null;
  const it = person.try;
  const first = !walk.tried.includes(it.id);
  if (first) walk.tried.push(it.id);
  if (it.verb === 'wear') { walk.wearing = it.outfit ?? null; walk.trips = it.trips ?? 0; }
  walk.heard = null;
  walk.goal = null;
  return { person, it, first, errands: finish(walk, it.id) };
}

// Everything that can be tried in a place, in the order it is walked past.
export const triesOf = (place) => place.scenes.flatMap((scene) => scene.people.filter((p) => p.try).map((p) => p.try));

// Sends her to a place along the scene (a person touched from afar); she walks there.
export function sendTo(walk, x) {
  walk.goal = Math.max(EDGE, Math.min(1 - EDGE, x));
}

// One step. way: -1 left, 1 right, 0 neither (then she goes on to where she was sent).
// Returns { scene: the scene changed (-1 or 1), arrived: she got to where she was sent,
// spot: a spot stood at for the first time, errands: [ids done just now] }.
export function stepWalk(walk, dtMs, way = 0) {
  const out = { scene: 0, arrived: false, spot: null, errands: [] };
  let dir = way;
  if (dir !== 0) walk.goal = null;
  else if (walk.goal !== null) {
    if (Math.abs(walk.goal - walk.x) <= ARRIVE) { walk.goal = null; out.arrived = true; }
    else dir = Math.sign(walk.goal - walk.x);
  }
  walk.moving = dir !== 0;
  if (dir !== 0) {
    walk.facing = dir;
    walk.heard = null;
    const next = walk.x + (dir * SPEED * dtMs) / 1000;
    const scenes = walk.place.scenes.length;
    // Walking off an end goes on into the scene beside it, coming in at its near end.
    if (way > 0 && next > 1 - EDGE && walk.scene < scenes - 1) { walk.scene += 1; walk.x = EDGE * 2; walk.goal = null; out.scene = 1; }
    else if (way < 0 && next < EDGE && walk.scene > 0) { walk.scene -= 1; walk.x = 1 - EDGE * 2; walk.goal = null; out.scene = -1; }
    else walk.x = Math.max(EDGE, Math.min(1 - EDGE, next));
  }
  const spot = spotAt(walk);
  if (spot && !walk.seen.includes(spot.id)) {
    walk.seen.push(spot.id);
    out.spot = spot;
    out.errands = finish(walk, spot.id);
  }
  return out;
}

export const errandsLeft = (walk) => walk.place.errands.filter((errand) => !walk.done.includes(errand.id)).length;
export const allDone = (walk) => errandsLeft(walk) === 0;
