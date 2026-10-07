import { describe, expect, it } from 'vitest';
import { NEAR, SLOW, flyPose, pinUnder, pointerTo } from '../game/src/core/flight.js';
import { guideLine } from '../game/src/core/guide.js';
import { soraPose } from '../game/src/core/sora.js';

// A pin as the globe reports it: x right and y up from the middle of the Earth's disc, in
// Earth radii; z below zero on the side that faces the eye.
const pin = (id, x, y, z = -1) => ({ id, x, y, z });

describe('what lies under Sora', () => {
  it('is the pin within about four degrees of the middle, on the near side', () => {
    expect(NEAR).toBeCloseTo(0.07, 6);
    expect(pinUnder([pin('a', 0.05, 0.03)])).toBe('a');
    expect(pinUnder([pin('a', 0.08, 0)])).toBe(null);
    expect(pinUnder([pin('a', 0.01, 0, 0.9)])).toBe(null);
    expect(pinUnder([])).toBe(null);
  });
  it('is the nearest when two are close', () => {
    expect(pinUnder([pin('far', 0.06, 0), pin('near', 0.01, 0.01)])).toBe('near');
  });
  it('is the square she is flying to when that one is under her too, however near another is', () => {
    // Two squares at one place (as the neighbour's yard and the palace were, both in Seoul, until the yard moved).
    const both = [pin('yard', 0.001, 0), pin('palace', 0.004, 0.002)];
    expect(pinUnder(both)).toBe('yard');
    expect(pinUnder(both, 'palace')).toBe('palace');
    expect(pinUnder(both, 'elsewhere')).toBe('yard');
    expect(pinUnder([pin('yard', 0.001, 0), pin('palace', 0.2, 0)], 'palace')).toBe('yard');
  });
  it('slows from farther out than it lands', () => {
    expect(SLOW).toBeGreaterThan(NEAR * 2);
  });
});

describe('the arrow to the square she is flying to', () => {
  it('points the way on the screen, clockwise from straight up, in degrees', () => {
    expect(pointerTo(pin('a', 0, 0.5)).turn).toBeCloseTo(0, 6);
    expect(pointerTo(pin('a', 0.5, 0)).turn).toBeCloseTo(90, 6);
    expect(pointerTo(pin('a', 0, -0.5)).turn).toBeCloseTo(180, 6);
    expect(pointerTo(pin('a', -0.5, 0)).turn).toBeCloseTo(-90, 6);
  });
  it('still points when the square is on the far side', () => {
    expect(pointerTo(pin('a', 0.3, 0.3, 0.8)).turn).toBeCloseTo(45, 6);
    expect(pointerTo(pin('a', 0.3, 0.3, 0.8)).near).toBe(false);
  });
  it('is put away once she is over it, and when there is no square', () => {
    expect(pointerTo(pin('a', 0.02, 0.02)).near).toBe(true);
    // Right behind the Earth: the middle of the disc, but not under her.
    expect(pointerTo(pin('a', 0.02, 0.02, 0.99)).near).toBe(false);
    expect(pointerTo(null)).toBe(null);
  });
});

describe('which way she flies', () => {
  it('is against the ground: the ground dragged right, she flies left', () => {
    expect(flyPose(6, 1)).toBe('left');
    expect(flyPose(-6, 1)).toBe('right');
    expect(flyPose(1, 6)).toBe('up');
    expect(flyPose(1, -6)).toBe('down');
  });
  it('is nowhere when the ground hardly moves', () => {
    expect(flyPose(0.2, -0.1)).toBe(null);
    expect(flyPose(0, 0)).toBe(null);
  });
});

describe('Sora in flight', () => {
  it('shows the sheet of the way she flies, four frames round', () => {
    const frames = [0, 170, 340, 510].map((now) => soraPose({ now, hushAt: null, flying: 'left' }));
    expect(frames.every((p) => p.sheet === 'left' && p.saying === null)).toBe(true);
    expect(new Set(frames.map((p) => p.frame))).toEqual(new Set([1, 2, 3, 4]));
  });
  it('comes down when landing, whatever way she was flying', () => {
    expect(soraPose({ now: 100, hushAt: null, flying: 'left', landing: true }).sheet).toBe('land-descend');
  });
  it('hushes first of all', () => {
    expect(soraPose({ now: 100, hushAt: 0, flying: 'left', landing: true }).sheet).toBe('see-hush');
  });
  it('idles as before when told nothing of flight', () => {
    expect(soraPose({ now: 100, hushAt: null }).sheet).toBe('idle');
  });
});

describe('guidance for flying', () => {
  const globe = (over) => guideLine({ where: 'globe', complete: 0, visited: 1, total: 4, ...over });
  it('sends her toward the shining place, then asks her down', () => {
    expect(globe({ target: true })).toBe('빛나는 자리 쪽으로 날아 보렴');
    expect(globe({ target: true, over: true })).toBe('다 왔으면 내려앉으렴');
  });
  it('lets her come down on any square she happens to be over', () => {
    expect(globe({ over: true })).toBe('여기 내려앉아도 된단다');
  });
  it('is as before with neither', () => {
    expect(globe({})).toBe('수첩이나 금색 점으로 다음 날에 가 보렴');
  });
  it('never runs past 25 characters', () => {
    for (const line of [globe({ target: true }), globe({ target: true, over: true }), globe({ over: true })]) expect(line.length, line).toBeLessThanOrEqual(25);
  });
});
