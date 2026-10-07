import { describe, expect, it } from 'vitest';
import { squareById } from '../game/src/core/squares.js';
import { createVisit, stepVisit, visitAt } from '../game/src/core/visit.js';

const palace = squareById('crystalPalace');
const base = { dialYear: 1851, dialResting: true, thisYear: 2026, lookTarget: 0 };
const run = (visit, ms, input) => { const got = []; for (let t = 0; t < ms; t += 20) got.push(...stepVisit(visit, 20, input)); return got; };

describe('a visit to a daytime square', () => {
  it('fills the day one second after arriving on the event year', () => {
    const v = createVisit(palace);
    expect(run(v, 980, base)).toEqual([]);
    expect(run(v, 40, base)).toEqual(['day']);
    expect(v.dots).toEqual({ day: true, sky: false, remains: false });
  });
  it('fills the sky only after the clock has flowed to night, and flows back when the head comes down', () => {
    const v = createVisit(palace); run(v, 1100, base);
    expect(run(v, 1000, { ...base, lookTarget: 1 })).toEqual([]);
    expect(v.night).toBe(0);
    expect(run(v, 3500, { ...base, lookTarget: 1 })).toEqual(['sky']);
    expect(v.night).toBe(1);
    run(v, 2500, base);
    expect(v.night).toBe(0);
    expect(v.look).toBeLessThan(0.01);
    expect(v.dots.sky).toBe(true);
  });
  it('fills what remains when the dial comes to rest on this year, and nothing on the way back', () => {
    const v = createVisit(palace); run(v, 1100, base);
    expect(run(v, 100, { ...base, dialYear: 1950 })).toEqual([]);
    expect(run(v, 100, { ...base, dialYear: 2026, dialResting: false })).toEqual([]);
    expect(run(v, 100, { ...base, dialYear: 2026 })).toEqual(['remains']);
    expect(run(v, 100, base)).toEqual([]);
    expect(run(v, 100, { ...base, dialYear: 2026 })).toEqual([]);
  });
  it('fills nothing while the dial is not on the event year, not even on this year', () => {
    const v = createVisit(palace);
    expect(run(v, 3000, { ...base, dialYear: 1800 })).toEqual([]);
    expect(run(v, 100, { ...base, dialYear: 2026 })).toEqual([]);
    expect(run(v, 100, base)).toEqual(['day']);
  });
});

describe('a visit to a night square', () => {
  it('fills the sky after a second and a half of looking up, and never moves the clock', () => {
    const v = createVisit(squareById('lunar1504'));
    const got = run(v, 2200, { dialYear: 1504, dialResting: true, thisYear: 2026, lookTarget: 1 });
    expect(got).toEqual(['day', 'sky']);
    expect(v.night).toBe(0);
  });
  it('starts the count again if the head comes down early', () => {
    const v = createVisit(squareById('lunar1504'));
    const input = { dialYear: 1504, dialResting: true, thisYear: 2026, lookTarget: 1 };
    run(v, 1200, input); run(v, 600, { ...input, lookTarget: 0 });
    expect(run(v, 1200, input)).toEqual([]);
    expect(run(v, 1000, input)).toEqual(['sky']);
  });
});

describe('visitAt', () => {
  it('says whether the dial is on the day, on today, or elsewhere', () => {
    const v = createVisit(palace);
    expect(visitAt(v, { dialYear: 1851, thisYear: 2026 })).toBe('then');
    expect(visitAt(v, { dialYear: 2026, thisYear: 2026 })).toBe('today');
    expect(visitAt(v, { dialYear: 1900, thisYear: 2026 })).toBe('other');
  });
});
