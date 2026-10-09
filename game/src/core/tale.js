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
// The state is 'S0' for the first step, 'S1' for the second, and one past the last when
// the tale is told. A record is never changed in place.
export const STATES = ['S0', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9'];
const SHAPE = 2;      // records of the first shape (a way, a change, attempts) begin again

export const emptyTale = () => ({ v: SHAPE, state: 'S0', endingId: null });

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
  return { ...t, state: STATES[at(t) + 1], endingId: step.choice ? chosen : t.endingId };
}

// What someone has to say for the tale just now: { role: 'step' | 'aside', lines }, or null
// when they have only their own things to say.
export function partOf(tale, t, personId) {
  const step = stepOf(tale, t);
  if (step?.who === personId) return { role: 'step', lines: step.lines, show: Boolean(step.show) };
  const aside = (tale.asides ?? []).find((a) => a.who === personId && a.when.includes(t.state));
  return aside ? { role: 'aside', lines: aside.lines } : null;
}
export const textOf = (line) => (typeof line === 'string' ? line : line.text);
export const speakerOf = (line, personId) => (typeof line === 'string' ? personId : line.by ?? personId);

// Who is to be spoken to now: marked over their head until it is done.
export const calledOf = (tale, t) => { const step = stepOf(tale, t); return step ? [step.who] : []; };
// Who asked her (the first step's) and has something to say now that the tale is told, or
// null: they wait where they were with their thanks (the user, 2026.10.10, thanked in Agra:
// "다른 도시에서도 미션 끝내면, 감사하다는 인사 하던가").
export function thankerOf(tale, t) {
  if (!isTold(tale, t)) return null;
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
  return { v: SHAPE, state: raw.state, endingId };
}
