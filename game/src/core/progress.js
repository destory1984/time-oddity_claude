// What the player has filled in the notebook: for each square its three dots (the day,
// the sky, what remains) and whether its question was answered. Records are never
// changed in place: each function gives back a new one (or the same one when nothing
// changed), so that keeping it is a matter of writing whatever came back.
const DOTS = ['day', 'sky', 'remains'];
const blank = () => ({ day: false, sky: false, remains: false, quiz: false });

export const emptyProgress = () => ({ squares: {} });

const of = (progress, id) => progress.squares[id] ?? blank();

function set(progress, id, key) {
  if (of(progress, id)[key]) return progress;
  return { squares: { ...progress.squares, [id]: { ...of(progress, id), [key]: true } } };
}

// dot: 'day', 'sky' or 'remains'.
export const fillDot = (progress, id, dot) => (DOTS.includes(dot) ? set(progress, id, dot) : progress);
export const solveQuiz = (progress, id) => set(progress, id, 'quiz');
export const dotsOf = (progress, id) => { const { day, sky, remains } = of(progress, id); return { day, sky, remains }; };
export const quizSolved = (progress, id) => of(progress, id).quiz;
export const isComplete = (progress, id) => DOTS.every((dot) => of(progress, id)[dot]);
export const isVisited = (progress, id) => of(progress, id).day;

// ids: the squares that exist. Gives how many have each dot, how many have all three.
export function countProgress(progress, ids) {
  const count = (key) => ids.filter((id) => of(progress, id)[key]).length;
  return {
    day: count('day'), sky: count('sky'), remains: count('remains'), quiz: count('quiz'),
    complete: ids.filter((id) => isComplete(progress, id)).length, total: ids.length,
  };
}

// What was kept, read back: only squares that exist and only true-or-false marks survive.
// Anything that cannot be read is an empty notebook, never an error.
export function sanitizeProgress(raw, ids) {
  let kept;
  try { kept = JSON.parse(raw); } catch { return emptyProgress(); }
  if (!kept || typeof kept !== 'object' || Array.isArray(kept) || !kept.squares || typeof kept.squares !== 'object') return emptyProgress();
  const squares = {};
  for (const id of ids) {
    const was = kept.squares[id];
    if (!was || typeof was !== 'object') continue;
    squares[id] = { day: was.day === true, sky: was.sky === true, remains: was.remains === true, quiz: was.quiz === true };
  }
  return { squares };
}
