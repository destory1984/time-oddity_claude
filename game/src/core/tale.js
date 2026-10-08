// A place told as a tale with a try in the middle of it (the plan the user brought on
// 2026.10.8, "6개 도시 개발 인계 세부 기획", sections 2 and 3; Tokyo is the place tried this
// way). Someone asks a thing of her; she hears two people out, in either order; she
// chooses one of two ways; she is told how it went and may change her way, once; and at
// the end she chooses one of two ends. Nothing is lost by any of it and nothing is timed.
//
// The states: S0 asked, S1 hearing the two out, S2 choosing a way, S3 told how it went,
// S4 choosing the end, S5 done. A record is never changed in place: each step gives back
// a new one, or the same one when the step is not to be taken now.
//
// A place's `tale` (core/walks.js): { ask, giver, offer, clues: [{ id, actor, line }], chooser, weigh,
// routes: { A, B: { label, gain, loss, actor, result, holds, record } },
// resolver, close, endings: { E1, E2: { label, says, reply, record } }, goals: { S0…S5 } }.
export const STATES = ['S0', 'S1', 'S2', 'S3', 'S4', 'S5'];
const ROUTES = ['A', 'B'];
const ENDS = ['E1', 'E2'];

export const emptyTale = () => ({ state: 'S0', clues: [], route: null, revisionUsed: false, attempts: [], endingId: null });

export const accept = (t) => (t.state === 'S0' ? { ...t, state: 'S1' } : t);

// Hearing one of the two out. The same one twice is one; the second of the two opens the choice.
export function hear(t, tale, clueId) {
  if (t.state !== 'S1' || t.clues.includes(clueId) || !tale.clues.some((c) => c.id === clueId)) return t;
  const clues = [...t.clues, clueId];
  return { ...t, clues, state: clues.length >= tale.clues.length ? 'S2' : 'S1' };
}

export const choose = (t, route) => (t.state === 'S2' && ROUTES.includes(route) ? { ...t, state: 'S3', route, attempts: [route], revisionUsed: false } : t);

// Told how it went, she goes on as she is, or takes the other way: once in a tale.
export const keepOn = (t) => (t.state === 'S3' ? { ...t, state: 'S4' } : t);
export function revise(t) {
  if (t.state !== 'S3' || t.revisionUsed) return t;
  const route = t.route === 'A' ? 'B' : 'A';
  return { ...t, route, attempts: [...t.attempts, route], revisionUsed: true };
}

export const end = (t, endingId) => (t.state === 'S4' && ENDS.includes(endingId) ? { ...t, state: 'S5', endingId } : t);

// What someone is to the tale just now: 'giver', 'clue', 'result', 'resolver', or null.
export function roleOf(tale, t, personId) {
  if (t.state === 'S0') return personId === tale.giver ? 'giver' : null;
  // The two heard, it is the one who asked that the way is settled with, not whoever spoke
  // last (the user, 2026.10.8, the choice having come up on the second of them: "이 말은 꽃 든
  // 아가씨를 클릭하면 나와야하는거 아님?").
  if (t.state === 'S2' && personId === tale.chooser) return 'chooser';
  if (t.state === 'S1' || t.state === 'S2') return tale.clues.some((c) => c.actor === personId) ? 'clue' : null;
  if (t.state === 'S3') return personId === tale.routes[t.route].actor ? 'result' : null;
  if (t.state === 'S4') return personId === tale.resolver ? 'resolver' : null;
  return personId === tale.resolver ? 'after' : null;
}

// What they say in that part, or null when they have their own things to say.
export function lineOf(tale, t, personId) {
  const role = roleOf(tale, t, personId);
  if (role === 'giver') return tale.offer;
  if (role === 'clue') return tale.clues.find((c) => c.actor === personId).line;
  if (role === 'chooser') return tale.weigh;
  if (role === 'result') return tale.routes[t.route].result;
  if (role === 'resolver') return tale.close;
  if (role === 'after') return tale.endings[t.endingId].says;
  return null;
}

// Who is to be spoken to now: they are marked over their heads until it is done.
export function calledOf(tale, t) {
  if (t.state === 'S0') return [tale.giver];
  if (t.state === 'S1') return tale.clues.filter((c) => !t.clues.includes(c.id)).map((c) => c.actor);
  if (t.state === 'S2') return [tale.chooser];
  if (t.state === 'S3') return [tale.routes[t.route].actor];
  if (t.state === 'S4') return [tale.resolver];
  return [];
}

export const goalOf = (tale, t) => tale.goals[t.state];
// What is in whose hands, in a line (there is no bag to open).
export const holdsOf = (tale, t) => (t.state === 'S5' ? tale.endings[t.endingId].holds : t.route ? tale.routes[t.route].holds : tale.holds) ?? null;
// What she did, in order, for the notebook: the ways tried, then the end.
export const recordOf = (tale, t) => [...t.attempts.map((r) => tale.routes[r].record), ...(t.endingId ? [tale.endings[t.endingId].record] : [])];

// Whether someone is to be seen where they are placed: a person's `when` names the states.
export const present = (t, person) => !person.when || person.when.includes(t?.state ?? 'S0');

// A kept record read back: anything that is not one is an empty one.
export function sanitizeTale(raw) {
  if (!raw || typeof raw !== 'object' || !STATES.includes(raw.state)) return null;
  const clues = Array.isArray(raw.clues) ? [...new Set(raw.clues.filter((c) => typeof c === 'string' && c.length <= 8))].slice(0, 4) : [];
  const attempts = Array.isArray(raw.attempts) ? raw.attempts.filter((r) => ROUTES.includes(r)).slice(0, 2) : [];
  const route = ROUTES.includes(raw.route) ? raw.route : null;
  const endingId = ENDS.includes(raw.endingId) ? raw.endingId : null;
  // A record that does not hang together (a way with no state for it) begins again.
  if ((raw.state === 'S3' || raw.state === 'S4') && !route) return null;
  if (raw.state === 'S5' && (!route || !endingId)) return null;
  return { state: raw.state, clues, route, revisionUsed: raw.revisionUsed === true, attempts, endingId };
}
