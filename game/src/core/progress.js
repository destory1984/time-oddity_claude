// What the player has filled in the notebook: for each square its three dots (the day,
// the sky, what remains), whether its question was answered and whether what has changed
// there was found. Records are never
// changed in place: each function gives back a new one (or the same one when nothing
// changed), so that keeping it is a matter of writing whatever came back.
const DOTS = ['day', 'sky', 'remains'];
const blank = () => ({ day: false, sky: false, remains: false, quiz: false, find: false });

import { sanitizeTale } from './tale.js';

export const emptyProgress = () => ({ squares: {}, notes: [] });

const of = (progress, id) => progress.squares[id] ?? blank();

function set(progress, id, key) {
  if (of(progress, id)[key]) return progress;
  return { ...progress, squares: { ...progress.squares, [id]: { ...of(progress, id), [key]: true } } };
}

// dot: 'day', 'sky' or 'remains'.
export const fillDot = (progress, id, dot) => (DOTS.includes(dot) ? set(progress, id, dot) : progress);
export const solveQuiz = (progress, id) => set(progress, id, 'quiz');
export const dotsOf = (progress, id) => { const { day, sky, remains } = of(progress, id); return { day, sky, remains }; };
export const quizSolved = (progress, id) => of(progress, id).quiz;
export const solveFind = (progress, id) => set(progress, id, 'find');
export const findSolved = (progress, id) => of(progress, id).find;
export const isComplete = (progress, id) => DOTS.every((dot) => of(progress, id)[dot]);
export const isVisited = (progress, id) => of(progress, id).day;

// For testing what comes after: every square with its three dots and its question
// answered, every note read (the test button, main.js).
export const fullProgress = (ids, noteIds) => ({
  squares: Object.fromEntries(ids.map((id) => [id, { day: true, sky: true, remains: true, quiz: true, find: true }])),
  notes: [...noteIds],
});

// ids: the squares that exist. Gives how many have each dot, how many have all three.
export function countProgress(progress, ids) {
  const count = (key) => ids.filter((id) => of(progress, id)[key]).length;
  return {
    day: count('day'), sky: count('sky'), remains: count('remains'), quiz: count('quiz'),
    complete: ids.filter((id) => isComplete(progress, id)).length, total: ids.length,
  };
}

// What she has eaten, worn or used in a place that is walked about (core/walk.js), by id.
export const triedOf = (progress, id) => progress.squares[id]?.tried ?? [];
export function markTried(progress, id, what) {
  if (triedOf(progress, id).includes(what)) return progress;
  return { ...progress, squares: { ...progress.squares, [id]: { ...of(progress, id), tried: [...triedOf(progress, id), what] } } };
}

// The scenes of a walked place she has been in, by id: one she has been in can be gone
// to again at a touch.
export const beenOf = (progress, id) => progress.squares[id]?.been ?? [];
export function markBeen(progress, id, scene) {
  if (beenOf(progress, id).includes(scene)) return progress;
  return { ...progress, squares: { ...progress.squares, [id]: { ...of(progress, id), been: [...beenOf(progress, id), scene] } } };
}

// What stays done in a walked place when she leaves it and comes again (the user,
// 2026.10.8: "이벤트 3개 모두 하고, 지구본으로 나갔다가, 다시 들어오니까 이벤트 다 한게 없어"):
// the errands done, and the people she has spoken to (whose marks are then gone), by id.
export const errandsOf = (progress, id) => progress.squares[id]?.errands ?? [];
// How far a place's tale has been told (core/tale.js), or null where it has not begun.
export const taleOf = (progress, id) => progress.squares[id]?.tale ?? null;
export function markTale(progress, id, tale) {
  return { ...progress, squares: { ...progress.squares, [id]: { ...(progress.squares[id] ?? { day: false, sky: false, remains: false, quiz: false, find: false }), tale } } };
}
export const metOf = (progress, id) => progress.squares[id]?.met ?? [];
function markIn(progress, id, key, what, had) {
  const fresh = what.filter((one) => !had.includes(one));
  if (fresh.length === 0) return progress;
  return { ...progress, squares: { ...progress.squares, [id]: { ...of(progress, id), [key]: [...had, ...fresh] } } };
}
export const markErrands = (progress, id, errands) => markIn(progress, id, 'errands', errands, errandsOf(progress, id));
export const markMet = (progress, id, person) => markIn(progress, id, 'met', [person], metOf(progress, id));

// Grandmother's notes that have been read (core/notes.js), by id.
export const notesRead = (progress) => progress.notes ?? [];
export const markNoteRead = (progress, id) => (notesRead(progress).includes(id) ? progress : { ...progress, notes: [...notesRead(progress), id] });

// What was kept, read back: only squares that exist and only true-or-false marks survive.
// Anything that cannot be read is an empty notebook, never an error.
// noteIds: the notes that exist.
export function sanitizeProgress(raw, ids, noteIds = []) {
  let kept;
  try { kept = JSON.parse(raw); } catch { return emptyProgress(); }
  if (!kept || typeof kept !== 'object' || Array.isArray(kept) || !kept.squares || typeof kept.squares !== 'object') return emptyProgress();
  const squares = {};
  for (const id of ids) {
    const was = kept.squares[id];
    if (!was || typeof was !== 'object') continue;
    squares[id] = { day: was.day === true, sky: was.sky === true, remains: was.remains === true, quiz: was.quiz === true, find: was.find === true };
    // What a walked place remembers of her: what she tried, the scenes she has been in, the
    // errands done, the people spoken to.
    for (const key of ['tried', 'been', 'errands', 'met']) {
      const list = Array.isArray(was[key]) ? [...new Set(was[key].filter((what) => typeof what === 'string' && what.length <= 40))].slice(0, 60) : [];
      if (list.length > 0) squares[id][key] = list;
    }
    // And how far its tale has been told: a record that is not one is left out, not mended.
    const tale = sanitizeTale(was.tale);
    if (tale) squares[id].tale = tale;
  }
  const notes = Array.isArray(kept.notes) ? noteIds.filter((id) => kept.notes.includes(id)) : [];
  return { squares, notes };
}
