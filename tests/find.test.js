import { describe, expect, it } from 'vitest';
import { SQUARES } from '../game/src/core/squares.js';
import { SCENES } from '../game/src/art/scenes.js';
import { createFind, foundAll, foundCount, nextUnfound, spotsOf, touchFind } from '../game/src/core/find.js';
import { emptyProgress, findSolved, sanitizeProgress, solveFind } from '../game/src/core/progress.js';

const spots = [{ x: 0.5, y: 0.6, r: 0.05 }, { x: 0.7, y: 0.6, r: 0.03 }];

describe('what has changed', () => {
  it('finds a place touched inside its ring, once', () => {
    const find = createFind(spots);
    expect(touchFind(find, 0.52, 0.61)).toBe(0);
    expect(foundCount(find)).toBe(1);
    expect(touchFind(find, 0.5, 0.6)).toBe(-1);
    expect(foundAll(find)).toBe(false);
    expect(nextUnfound(find)).toBe(1);
  });
  it('measures up and down in the same px as across, on a 3:2 picture', () => {
    const find = createFind(spots);
    // 0.06 of the height is 0.04 of the width: inside a ring of 0.05.
    expect(touchFind(find, 0.5, 0.66)).toBe(0);
  });
  it('gives a small place a finger\'s breadth', () => {
    const find = createFind(spots);
    expect(touchFind(find, 0.76, 0.6)).toBe(-1);
    expect(find.misses).toBe(1);
    expect(touchFind(find, 0.76, 0.6, 0.08)).toBe(1);
    expect(find.misses).toBe(0);
  });
  it('is done when every place is found', () => {
    const find = createFind(spots);
    touchFind(find, 0.5, 0.6); touchFind(find, 0.7, 0.6);
    expect(foundAll(find)).toBe(true);
    expect(nextUnfound(find)).toBe(-1);
  });
  it('has places only for squares that exist, at most four, inside the picture', () => {
    for (const s of SQUARES) {
      expect(SCENES[s.id], s.id).toBeTruthy();
      const list = spotsOf(s.id);
      expect(list.length, s.id).toBeLessThanOrEqual(4);
      for (const p of list) {
        expect(p.x > 0 && p.x < 1 && p.y > 0 && p.y < 1, s.id).toBe(true);
        expect(p.r, s.id).toBeGreaterThan(0.02);
      }
    }
    expect(SQUARES.filter((s) => spotsOf(s.id).length > 0).length).toBeGreaterThanOrEqual(25);
    expect(spotsOf('nowhere')).toEqual([]);
  });
  it('is kept in the notebook', () => {
    const p = solveFind(emptyProgress(), 'khufu');
    expect(findSolved(p, 'khufu')).toBe(true);
    expect(findSolved(p, 'thales')).toBe(false);
    expect(findSolved(sanitizeProgress(JSON.stringify(p), ['khufu']), 'khufu')).toBe(true);
  });
});
