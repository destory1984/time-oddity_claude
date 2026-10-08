// What the player has filled in the notebook: for each square its three dots (the day,
// the sky, what remains), whether its question was answered and whether what has changed
// there was found. Records are never
// changed in place: each function gives back a new one (or the same one when nothing
// changed), so that keeping it is a matter of writing whatever came back.
const DOTS = ['day', 'sky', 'remains'];
const blank = () => ({ day: false, sky: false, remains: false, quiz: false, find: false });

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
    const tried = Array.isArray(was.tried) ? [...new Set(was.tried.filter((what) => typeof what === 'string' && what.length <= 40))].slice(0, 60) : [];
    if (tried.length > 0) squares[id].tried = tried;
  }
  const notes = Array.isArray(kept.notes) ? noteIds.filter((id) => kept.notes.includes(id)) : [];
  return { squares, notes };
}
