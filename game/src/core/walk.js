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
export const HEAR = 0.1;          // and hears in passing what those this near are saying
const EDGE = 0.02;                // she stops this far from a scene's end
const ARRIVE = 0.012;             // near enough to where she was sent

// From earlier visits, by id: tried: what she has tried here. been: the scenes she has been
// in. done: the errands done. met: the people she has spoken to.
export function createWalk(place, { scene = 0, x = 0.08, tried = [], been = [], done = [], met = [] } = {}) {
  return {
    place, scene, x, facing: 1, moving: false, goal: null,
    // How many times each person has been spoken to. One met on an earlier visit has said
    // both lines, and begins again with the first.
    said: Object.fromEntries(met.map((id) => [id, 2])),
    heard: null,         // { id, line }: what was last said to her, while it is shown
    passing: null,       // { id, line }: what someone she is passing says, unasked, while she is near
    hush: false,         // a talk has just been ended: nobody calls out to her until she walks on
    done: [...done],     // the errands done, by id
    seen: [],            // the spots she has stood at, by id
    told: [],            // the scenes she has said her line in, by id
    tried: [...tried],   // what she has eaten, worn or used, by id
    triedNow: [],        // what she has eaten or used on this visit, by id: it is not offered again until she comes back
    been: [...been],     // the scenes she has been in, by id
    remark: null,        // { id, text }: what she says of the thing that person is showing her, while it shows
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

// Everyone has three things to say (the user, 2026.10.8: "그냥 팝업되는 대화 1개, 클릭해서
// 나오는 대화 2개. 총 3개야"). One (`pass`) nobody has to press anything for: it comes up
// over their head as she passes and is gone when she has walked on ("들어도 그만 안 들어도
// 그만인 대사는 소라가 지나갈 때에 자동적으로 팝업됐다가, 멀리가면 없어지는 식으로"). Two (`lines`)
// are said when they are spoken to, the first, then the second, then the first again.
// Who is worth coming back to: they have a thing to show her or for her to try, or an
// errand asks for them. These say their two lines in turn for as long as she asks.
export const worth = (walk, person) => Boolean(person.show || person.try || walk.place.errands.some((errand) => errand.at.includes(person.id)));

// Whether the one she is hearing has said the last of their lines: the next touch ends the talk.
export const talkedOut = (walk, person) => walk.heard?.id === person.id && (walk.said[person.id] ?? 0) > 0 && (walk.said[person.id] ?? 0) % person.lines.length === 0;

// Whether they can be spoken to. Anyone who speaks can, as often as she likes: one who fell
// silent after two lines seemed broken ("클릭은 계속 되어야지..또 듣고 싶을 수도 있잖아").
export const canSpeak = (walk, person) => Boolean(person?.lines);

// The nearest of those within hearing, or null.
function overheard(walk) {
  let best = null;
  for (const person of sceneOf(walk).people) {
    const far = Math.abs(person.x - walk.x);
    if (far <= HEAR && person.pass && (!best || far < Math.abs(best.x - walk.x))) best = person;
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
// null when nobody is. Each time, the next of their lines; spoken to once more when the
// last has been said, they end the talk (line: null, over: true); spoken to after that,
// they begin again with the first (the user, 2026.10.8: "2개라면, 2개를 출력한 후에 대화를
// 종료한다. 3개면 3개까지", "다시 NPC를 클릭하면, 2를 반복한다").
// id: the one meant, when several stand near.
export function speak(walk, id = null) {
  const meant = id ? sceneOf(walk).people.find((p) => p.id === id && Math.abs(p.x - walk.x) <= REACH) : null;
  const person = meant ?? nearby(walk);
  if (!canSpeak(walk, person)) return null;
  const count = walk.said[person.id] ?? 0;
  if (talkedOut(walk, person)) {
    // The talk is over and it is quiet: the one beside them does not call out at once, as
    // if the talk went on (the user, 2026.10.8, of Rome's market).
    walk.heard = null; walk.passing = null; walk.hush = true;
    return { person, line: null, over: true, errands: [] };
  }
  const line = person.lines[count % person.lines.length];
  walk.said[person.id] = count + 1;
  walk.heard = { id: person.id, line };
  walk.goal = null;
  walk.facing = person.x >= walk.x ? 1 : -1;
  return { person, line, errands: finish(walk, person.id) };
}

// The one she is with: whoever she is hearing, else whoever is nearest. What can be done at
// the foot of the screen is theirs (the user, 2026.10.8, having touched a lady and been
// offered the dormouse of the man beside her: "이 사람 눌렀는데, 쥐 먹어보라고 나온다").
export const withWhom = (walk) => (walk.heard ? sceneOf(walk).people.find((p) => p.id === walk.heard.id) : null) ?? nearby(walk);

// What a person has for her to eat, wear or use now, or null. What she has on is not
// offered again ("이미 입고 있는데, 버튼이 계속 보임"), nor what she has eaten or used on this
// visit (the user, 2026.10.8, at the melon stall: "멜론을 계속 먹을 수 있네").
export function offerOf(walk, person) {
  const it = person?.try ?? null;
  if (!it) return null;
  if (it.verb === 'wear') return walk.wearing && walk.wearing === it.outfit ? null : it;
  return walk.triedNow.includes(it.id) ? null : it;
}

// Tries what whoever is near has to offer. Returns { person, it: the person's try,
// first: not tried before, errands: [ids done just now] }, or null when there is nothing.
export function tryIt(walk, id = null) {
  const meant = id ? sceneOf(walk).people.find((p) => p.id === id && Math.abs(p.x - walk.x) <= REACH) : null;
  const person = meant ?? nearby(walk);
  const it = offerOf(walk, person);
  if (!it) return null;
  const first = !walk.tried.includes(it.id);
  if (first) walk.tried.push(it.id);
  if (it.verb !== 'wear') walk.triedNow.push(it.id);
  if (it.verb === 'wear') { walk.wearing = it.outfit ?? null; walk.trips = it.trips ?? 0; }
  walk.heard = null;
  walk.goal = null;
  return { person, it, first, errands: finish(walk, it.id) };
}

// The wardrobe: every outfit there is to put on, over all the places, as { outfit, name,
// id: the try's, trips }. What she has put on once she may take out again anywhere (plan
// v5, section 9: "옷장. 입어 본 옷이 모인다").
export const outfitsOf = (places) => Object.values(places).flatMap((place) => triesOf(place))
  .filter((it) => it.verb === 'wear').map((it) => ({ outfit: it.outfit, name: it.name, id: it.id, trips: it.trips ?? 0 }));

// Everything that can be tried in a place, in the order it is walked past.
export const triesOf = (place) => place.scenes.flatMap((scene) => scene.people.filter((p) => p.try).map((p) => p.try));

// Goes at once into the scene beside this one (way: -1 or 1) if she has been in it before:
// a street once walked need not be walked again to get past it (the user, 2026.10.8: "한
// 번 가본 곳은 저거만 누르면, 다음 장면으로 이동시켜줘"). Returns whether she went.
export const canHop = (walk, way) => { const next = walk.place.scenes[walk.scene + way]; return Boolean(next) && walk.been.includes(next.id); };
export function hop(walk, way) {
  if (!canHop(walk, way)) return false;
  walk.scene += way;
  walk.x = way > 0 ? EDGE * 2 : 1 - EDGE * 2;
  walk.facing = way;
  walk.moving = false; walk.goal = null; walk.heard = null; walk.passing = null;
  return true;
}

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
    walk.heard = null; walk.hush = false;
    const next = walk.x + (dir * SPEED * (sceneOf(walk).pace ?? 1) * dtMs) / 1000;
    const scenes = walk.place.scenes.length;
    // Walking off an end goes on into the scene beside it, coming in at its near end.
    if (way > 0 && next > 1 - EDGE && walk.scene < scenes - 1) { walk.scene += 1; walk.x = EDGE * 2; walk.goal = null; out.scene = 1; }
    else if (way < 0 && next < EDGE && walk.scene > 0) { walk.scene -= 1; walk.x = 1 - EDGE * 2; walk.goal = null; out.scene = -1; }
    else walk.x = Math.max(EDGE, Math.min(1 - EDGE, next));
  }
  const by = walk.hush ? null : overheard(walk);
  if ((by?.id ?? null) !== (walk.passing?.id ?? null)) walk.passing = by ? { id: by.id, line: by.pass } : null;
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
