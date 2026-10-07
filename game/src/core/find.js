// "What has changed": on today's picture of a square, the places that differ from the
// picture of the day are found by touching them. The places come from the two pictures
// themselves (tools/find-spots.py → data/spots.json): x and y are a place's middle as
// shares of the picture's width and height, r its radius as a share of the width.
// Nothing is lost by touching the wrong place.
import SPOTS from '../data/spots.json';

const ASPECT = 1.5;   // the pictures are 3:2

export const spotsOf = (id) => SPOTS[id] ?? [];

export function createFind(spots) {
  return { spots, found: spots.map(() => false), misses: 0 };
}

// A touch at (x, y), shares of the picture. least: the smallest radius a place is given,
// as a share of the width (a finger's breadth on that screen). Returns the place found
// just now (its index), or -1: nothing there, or found already.
export function touchFind(find, x, y, least = 0) {
  let best = -1;
  let bestFar = Infinity;
  find.spots.forEach((spot, i) => {
    const far = Math.hypot(x - spot.x, (y - spot.y) / ASPECT);
    if (far <= Math.max(spot.r, least) && far < bestFar) { best = i; bestFar = far; }
  });
  if (best < 0 || find.found[best]) { if (best < 0) find.misses += 1; return -1; }
  find.found[best] = true;
  find.misses = 0;
  return best;
}

export const foundCount = (find) => find.found.filter(Boolean).length;
export const foundAll = (find) => find.found.every(Boolean);
// A place not found yet, to be hinted at; -1 when none is left.
export const nextUnfound = (find) => find.found.indexOf(false);
