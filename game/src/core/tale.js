// A place told as a tale of a thing carried: someone asks her to take something to
// someone else, she is stopped on the way, somebody tells her how it may be done, and she
// hands it over, choosing what to say as she does. Tokyo is the place told this way.
//
// It was first written with a try in the middle of it (a way chosen out of two, and changed
// once), after a plan the user brought on 2026.10.8. The user, having tried that on
// 2026.10.9: of the box of two ways, "이건 없애줘. 의미가 없음"; of the slip, "저 가이드가
// 없으면, 게임을 제대로 못 하고 헤매게 되네"; and of the end, which was only talk with the one
// who asked, "아가씨한테 꽃과 말을 전달받고, 기관사한테 가서 전달하고, 이러는게 미션 아님?".
// So: the steps come one after another, each with one person to go to; what is said at the
// end of a step names where to go next; and the only choice is at the handing over.
//
// A place's `tale` (core/walks.js):
// { ask, steps: [{ who, lines, call?, offer?, choice?, sora?, errand?, goal, holds? }],
//   asides: [{ who, when: [states], lines }], done, held? }
// A step's `after` is [{ who, line }], said one after another once it is done; `show`: what
// its person holds up is shown with their lines (else they are said plainly).
// A step is done when the last of its lines has been said to her by `who` (and its offer
// taken, or one of its choice chosen). A line is a string, or { by, text } when someone
// else says it (the station master stepping in before the driver).
// `gate` is { scene, open, sora }: the way on from that scene is shut until the step of
// that number is reached (whoever turns her away does turn her away), and `sora` is what
// she says on coming up against it.
// A step's `riddle` (the user, 2026.10.12: "조금 더 게임성을 투여해보자. 어드벤처 게임처럼", and of
// how: clues are gathered and held out to whoever is in the way) is { ask, none, more, clues:
// [{ id, from, label, sora, says, right? }] }: while she is on that step a clue is hers once
// its `from` has been heard out (a person, by an aside of theirs for that state) or touched
// (a place in the picture). Spoken to, the step's `who` is held out one of the clues she has
// (`label`; she says `sora`, they answer `says`), and the step is done by the one that is
// `right`. What a wrong one is answered with says what is wanting. `none` is what she says
// with no clue to hold out, `more` the button that puts it off.
// A tale of the work of the day (`work: true`; the user, 2026.10.15, of tales that were all
// one shape: "이야기 패턴이 너무 단순한데", and of the way chosen: the work of that day itself,
// done with her own hands) has no thing carried and nobody to thank. Its steps may be:
// a `round`, [{ who, lines, sora? }], with `tally`, how far it has come as a sentence ({n} of {all}): several people to go to in any order, each heard out
// once (those standing on the line are asked to step back); it is done when all have been.
// A `play`, { kind, tally, ask, label, hits, zone: [from, to], speed, good, miss, show? }:
// once `who` has said their lines a box asks her to do it `hits` times, with `good` and
// `miss` said in turn (main.js). The kind: 'aim', press as a mark sweeping across a bar is
// within the zone (`speed` sweeps a second); 'fill', hold down as the bar fills (`speed`
// of it a second) and let go within the zone; 'mash', press fast, each press filling an
// eighth or so of a bar that sinks back by `speed` a second; 'beat', press as the last of
// four lights is on (`speed` lights a second). `show` is the picture held up when it is
// done. It is done by advance(.., 'played').
// The state is 'S0' for the first step, 'S1' for the second, and one past the last when
// the tale is told. A record is never changed in place.
export const STATES = ['S0', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9'];
const SHAPE = 2;      // records of the first shape (a way, a change, attempts) begin again

export const emptyTale = () => ({ v: SHAPE, state: 'S0', endingId: null, clues: [], got: [] });

const at = (t) => STATES.indexOf(t?.state ?? 'S0');
// The step she is on, or null once the tale is told.
export const stepOf = (tale, t) => tale.steps[at(t)] ?? null;
export const isTold = (tale, t) => at(t) >= tale.steps.length;
const choiceOf = (tale) => tale.steps.find((step) => step.choice)?.choice ?? null;
// What she chose at the handing over, or null.
export const endingOf = (tale, t) => choiceOf(tale)?.options.find((o) => o.id === t.endingId) ?? null;

// The step she is on is done. Where it ends in a choice, `chosen` is the id of what she chose.
export function advance(tale, t, chosen = null) {
  const step = stepOf(tale, t);
  if (!step) return t;
  if (step.choice && !step.choice.options.some((o) => o.id === chosen)) return t;
  if (step.riddle && !cluesOf(tale, t).some((clue) => clue.right && clue.id === chosen)) return t;
  if (step.round && roundLeft(tale, t).length > 0) return t;
  if (step.play && chosen !== 'played') return t;
  return { ...t, state: STATES[at(t) + 1], endingId: step.choice ? chosen : t.endingId, got: [] };
}

// Who a step sends her to: its one person, or the first of a round.
export const whoOf = (step) => step.who ?? step.round?.[0]?.who ?? null;
// Those of the round she is on still to be gone to, in the order they are written.
export const roundLeft = (tale, t) => (stepOf(tale, t)?.round ?? []).filter((r) => !(t.got ?? []).includes(r.who));
// One of the round has been heard out.
export function roundGot(tale, t, who) {
  return roundLeft(tale, t).some((r) => r.who === who) ? { ...t, got: [...(t.got ?? []), who] } : t;
}

// The riddle she is asked just now, or null.
export const riddleOf = (tale, t) => stepOf(tale, t)?.riddle ?? null;
// The clues to it she has, in the order they are written.
export const cluesOf = (tale, t) => (riddleOf(tale, t)?.clues ?? []).filter((clue) => (t.clues ?? []).includes(clue.id));
// The clue this person or place in the picture has for her and she has not yet, or null.
export const sourceOf = (tale, t, from) => (riddleOf(tale, t)?.clues ?? []).find((clue) => clue.from === from && !(t.clues ?? []).includes(clue.id)) ?? null;
// Their clue is hers.
export function gain(tale, t, from) {
  const clue = sourceOf(tale, t, from);
  return clue ? { ...t, clues: [...(t.clues ?? []), clue.id] } : t;
}
// Where to look next while a riddle is asked: toward the nearest in the scene with a clue she
// has not, or, with the right one in hand, to the one who asked; as { id, x, way: -1 or 1
// when it is far off, else 0 }, or null (a thing that goes by cannot be pointed at).
const FAR = 0.14;
export function hintOf(tale, t, scene, x) {
  const riddle = riddleOf(tale, t);
  if (!riddle) return null;
  const whereOf = (id) => {
    const person = scene.people.find((p) => p.id === id);
    const tap = (scene.taps ?? []).find((tp) => tp.id === id);
    return person ? person.x : tap?.box ? (tap.box[0] + tap.box[2]) / 2 : tap?.x ?? null;
  };
  const solved = cluesOf(tale, t).some((clue) => clue.right);
  const ids = solved ? [stepOf(tale, t).who] : riddle.clues.filter((clue) => !t.clues.includes(clue.id)).map((clue) => clue.from);
  let best = null;
  for (const id of ids) {
    const at = whereOf(id);
    if (at !== null && (!best || Math.abs(at - x) < Math.abs(best.x - x))) best = { id, x: at };
  }
  return best && { ...best, way: Math.abs(best.x - x) > FAR ? Math.sign(best.x - x) : 0 };
}

// What someone has to say for the tale just now: { role: 'step' | 'aside', lines }, or null
// when they have only their own things to say.
export function partOf(tale, t, personId) {
  const step = stepOf(tale, t);
  if (step?.who === personId) return { role: 'step', lines: step.lines, show: Boolean(step.show) };
  const round = roundLeft(tale, t).find((r) => r.who === personId);
  if (round) return { role: 'step', lines: round.lines, show: false };
  const aside = (tale.asides ?? []).find((a) => a.who === personId && a.when.includes(t.state));
  return aside ? { role: 'aside', lines: aside.lines, show: Boolean(aside.show) } : null;
}
export const textOf = (line) => (typeof line === 'string' ? line : line.text);
export const speakerOf = (line, personId) => (typeof line === 'string' ? personId : line.by ?? personId);

// Who is to be spoken to now: marked over their head until it is done.
export const calledOf = (tale, t) => { const step = stepOf(tale, t); return !step ? [] : step.round ? roundLeft(tale, t).map((r) => r.who) : [step.who]; };
// Who asked her (the first step's) and has something to say now that the tale is told, or
// null: they wait where they were with their thanks (the user, 2026.10.10, thanked in Agra:
// "다른 도시에서도 미션 끝내면, 감사하다는 인사 하던가").
export function thankerOf(tale, t) {
  if (!isTold(tale, t) || tale.work) return null;
  const who = tale.steps[0].who;
  return (tale.asides ?? []).some((a) => a.who === who && a.when.includes(t.state)) ? who : null;
}
// What the one called for calls out as she comes near, or null.
export const callOf = (tale, t, personId) => { const step = stepOf(tale, t); return step?.who === personId ? step.call ?? null : null; };

export const goalOf = (tale, t) => stepOf(tale, t)?.goal ?? tale.done;
// What is in whose hands, in a line (there is no bag to open). Once it is handed over the
// line is gone: the errand struck through says as much (the user, 2026.10.9, of the line
// left on the slip when all was done: "이게 남아있네").
export const holdsOf = (tale, t) => (isTold(tale, t) ? tale.held : stepOf(tale, t).holds) ?? null;

// What she says on finding the way on from a scene shut, or null when it is open (the user,
// 2026.10.9, told by Tahiti's sentry that nobody goes in and walking in past him: "아무도 못
// 들어간다고 했는데, 오른쪽으로 그냥 들어가는데?").
export const barOf = (tale, t, sceneId) => (tale.gate && tale.gate.scene === sceneId && at(t) < tale.gate.open ? tale.gate.sora : null);

// Whether the thing of the tale is in her hands: from the step after the one that offers it
// until the step that ends in the choice (the handing over) is done.
export function carrying(tale, t) {
  const took = tale.steps.findIndex((step) => step.offer);
  const gave = tale.steps.findIndex((step) => step.choice);
  return took >= 0 && at(t) > took && (gave < 0 || at(t) <= gave);
}

// Whether someone is to be seen where they are placed: a person's `when` names the states.
export const present = (t, person) => !person.when || person.when.includes(t?.state ?? 'S0');

// A kept record read back: anything that is not one of this shape is left out.
export function sanitizeTale(raw) {
  if (!raw || typeof raw !== 'object' || raw.v !== SHAPE || !STATES.includes(raw.state)) return null;
  const endingId = typeof raw.endingId === 'string' && raw.endingId.length <= 8 ? raw.endingId : null;
  const ids = (list) => (Array.isArray(list) ? list.filter((id) => typeof id === 'string' && id.length <= 12) : []);
  return { v: SHAPE, state: raw.state, endingId, clues: ids(raw.clues), got: ids(raw.got) };
}
