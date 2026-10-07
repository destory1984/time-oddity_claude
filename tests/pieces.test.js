import { describe, expect, it } from 'vitest';
import { along, piecesAt } from '../game/src/core/pieces.js';
import { WALKS } from '../game/src/core/walks.js';

const strip = { kind: 'drift', id: 'crowd', src: 'crowd', from: 0.1, to: 0.5, foot: 0.78, tall: 0.2, wide: 0.3, gap: 0.02, speed: 0.02, bob: 0.004 };
const stair = { kind: 'climb', id: 'up', srcs: ['a', 'b', 'c'], path: [[0.8, 0.7], [0.7, 0.4], [0.75, 0.2]], tall: 0.05, seconds: 30, step: 0.004 };
const wheel = { kind: 'spin', id: 'w', src: 'wheel', x: 0.3, y: 0.5, tall: 0.4, rpm: 12 };

describe('the pieces that move in a scene', () => {
  it('moves nothing in a scene that has none', () => {
    expect(piecesAt({}, 3)).toEqual([]);
  });
  it('slides a strip of people along the street without a break, seen only between its ends', () => {
    for (let t = 0; t < 200; t += 0.7) {
      const pieces = piecesAt({ moving: [strip] }, t);
      const edges = pieces.map((p) => [p.x - strip.wide / 2, p.x + strip.wide / 2]).sort((a, b) => a[0] - b[0]);
      // From end to end there is always a strip, or the small gap between two.
      expect(edges[0][0], `t ${t}`).toBeLessThanOrEqual(strip.from + strip.gap + 1e-9);
      expect(edges.at(-1)[1], `t ${t}`).toBeGreaterThanOrEqual(strip.to - strip.gap - 1e-9);
      for (let i = 1; i < edges.length; i += 1) expect(edges[i][0] - edges[i - 1][1], `t ${t}`).toBeCloseTo(strip.gap, 9);
      for (const p of pieces) { expect(p.clip).toEqual([0.1, 0.5]); expect(p.anchor).toBe('foot'); }
    }
  });
  it('can send a strip by behind the picture, and turned to face left', () => {
    const [p] = piecesAt({ moving: [{ ...strip, behind: true, flip: true, speed: -0.1 }] }, 3);
    expect(p.behind).toBe(true);
    expect(p.flip).toBe(true);
    expect(piecesAt({ moving: [strip] }, 3)[0].behind).toBe(false);
  });
  it('slides it the way of its speed', () => {
    const at = (t) => piecesAt({ moving: [strip] }, t).find((p) => p.id === 'crowd-0').x;
    expect(at(1.1) - at(1)).toBeCloseTo(0.002, 9);
  });
  it('finds a place along a path by the share of its length', () => {
    const path = [[0, 0], [3, 4], [3, 14]];
    expect(along(path, 0)).toMatchObject({ x: 0, y: 0 });
    expect(along(path, 1 / 3)).toMatchObject({ x: 3, y: 4 });
    expect(along(path, 1).y).toBeCloseTo(14, 9);
    expect(along(path, 2 / 3).y).toBeCloseTo(9, 9);
  });
  it('sends climbers up a stair one after another, round and round', () => {
    const now = piecesAt({ moving: [stair] }, 4);
    expect(now.length).toBe(3);
    expect(new Set(now.map((p) => p.src)).size).toBe(3);
    // A third of the way apart, and the same again a lap later.
    const later = piecesAt({ moving: [stair] }, 34);
    now.forEach((p, i) => { expect(later[i].x).toBeCloseTo(p.x, 6); });
    // Faint at the foot and at the top, plain between; facing the way the stair goes.
    const first = piecesAt({ moving: [stair] }, 0.01)[0];
    expect(first.alpha).toBeLessThan(0.1);
    expect(first.flip).toBe(false);
    expect(piecesAt({ moving: [stair] }, 12)[0].alpha).toBe(1);
    expect(piecesAt({ moving: [stair] }, 28)[0].flip).toBe(true);
  });
  it('turns a wheel where it stands', () => {
    const [a] = piecesAt({ moving: [wheel] }, 0);
    const [b] = piecesAt({ moving: [wheel] }, 1.25);
    expect(a).toMatchObject({ x: 0.3, y: 0.5, turn: 0, anchor: 'centre' });
    expect(b.turn).toBeCloseTo(Math.PI / 2, 9);
  });
  it('is given well-formed in the places that are walked about', () => {
    for (const walk of Object.values(WALKS)) {
      for (const scene of walk.scenes) {
        for (const p of piecesAt(scene, 7.3)) {
          expect(Number.isFinite(p.x) && Number.isFinite(p.y) && p.tall > 0, `${scene.id}: ${p.id}`).toBe(true);
          expect(typeof p.src, p.id).toBe('string');
        }
      }
    }
  });
});
