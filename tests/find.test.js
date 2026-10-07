import { describe, expect, it } from 'vitest';
import { SQUARES, squareById } from '../game/src/core/squares.js';
import { FINDS, createFind, findsOf, foundAll, foundCount, nextUnfound, touchFind } from '../game/src/core/find.js';
import { emptyProgress, findSolved, sanitizeProgress, solveFind } from '../game/src/core/progress.js';

const things = [
  { name: 'a', line: 'x', at: [[0.5, 0.6, 0.05]] },
  { name: 'b', line: 'y', at: [[0.7, 0.6, 0.03], [0.2, 0.3, 0.03]] },
];

describe('what has changed', () => {
  it('finds a thing touched inside its circle, once', () => {
    const find = createFind(things);
    expect(touchFind(find, 0.52, 0.61)).toBe(0);
    expect(foundCount(find)).toBe(1);
    expect(touchFind(find, 0.5, 0.6)).toBe(-1);
    expect(foundAll(find)).toBe(false);
    expect(nextUnfound(find)).toBe(1);
  });
  it('measures up and down in the same px as across, on a 3:2 picture', () => {
    const find = createFind(things);
    // 0.06 of the height is 0.04 of the width: inside a circle of 0.05.
    expect(touchFind(find, 0.5, 0.66)).toBe(0);
  });
  it('gives a small circle a finger\'s breadth', () => {
    const find = createFind(things);
    expect(touchFind(find, 0.76, 0.6)).toBe(-1);
    expect(find.misses).toBe(1);
    expect(touchFind(find, 0.76, 0.6, 0.08)).toBe(1);
    expect(find.misses).toBe(0);
  });
  it('finds a thing by any of its circles', () => {
    const find = createFind(things);
    expect(touchFind(find, 0.2, 0.3)).toBe(1);
    expect(touchFind(find, 0.7, 0.6)).toBe(-1);
  });
  it('is done when every thing is found', () => {
    const find = createFind(things);
    touchFind(find, 0.5, 0.6); touchFind(find, 0.7, 0.6);
    expect(foundAll(find)).toBe(true);
    expect(nextUnfound(find)).toBe(-1);
  });
  it('is kept in the notebook', () => {
    const p = solveFind(emptyProgress(), 'khufu');
    expect(findSolved(p, 'khufu')).toBe(true);
    expect(findSolved(p, 'thales')).toBe(false);
    expect(findSolved(sanitizeProgress(JSON.stringify(p), ['khufu']), 'khufu')).toBe(true);
  });
});

describe('the things to be found', () => {
  it('belong to squares that exist, two to four a square', () => {
    for (const [id, list] of Object.entries(FINDS)) {
      expect(squareById(id), id).toBeTruthy();
      expect(list.length, id).toBeGreaterThanOrEqual(2);
      expect(list.length, id).toBeLessThanOrEqual(4);
    }
    expect(findsOf('nowhere')).toEqual([]);
    expect(SQUARES.filter((s) => findsOf(s.id).length > 0).length).toBe(Object.keys(FINDS).length);
  });
  it('have a short name, a line of 40 characters at most and circles inside the picture', () => {
    for (const [id, list] of Object.entries(FINDS)) {
      for (const thing of list) {
        expect(thing.name.length, `${id}: ${thing.name}`).toBeLessThanOrEqual(8);
        expect(thing.line.length, `${id}: ${thing.line}`).toBeLessThanOrEqual(40);
        expect(thing.line.endsWith('.'), `${id}: ${thing.line}`).toBe(true);
        expect(thing.at.length, id).toBeGreaterThan(0);
        for (const [x, y, r] of thing.at) expect(x > 0.3 && x < 0.7 && y > 0.1 && y < 0.85 && r >= 0.02 && r <= 0.08, `${id}: ${thing.name}`).toBe(true);
      }
    }
  });
});
