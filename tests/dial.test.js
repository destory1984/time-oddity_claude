import { describe, expect, it } from 'vitest';
import { yearIndex } from '../game/src/core/when.js';
import { PX_PER_YEAR, createDial, drag, grab, release, rollTo, stepDial } from '../game/src/core/dial.js';

const run = (dial, ms, dt = 16) => { const seen = []; for (let t = 0; t < ms; t += dt) seen.push(...stepDial(dial, dt)); return seen; };
const fresh = (year) => createDial({ year, maxYear: 2026 });

describe('dragging', () => {
  it('goes back one year for every 12 pixels dragged to the right', () => {
    expect(PX_PER_YEAR).toBe(12);
    const d = fresh(1851); grab(d); drag(d, 60);
    expect(d.year).toBe(1846);
    drag(d, -120);
    expect(d.year).toBe(1856);
  });
  it('reports each year it passes', () => {
    const d = fresh(1851); grab(d); drag(d, 30);
    expect(run(d, 16)).toEqual([1850, 1849]);
  });
  it('skips year 0', () => {
    const d = fresh(2); grab(d); drag(d, 36);
    expect(d.year).toBe(-2);
  });
  it('is not resting while held', () => {
    const d = fresh(1851); grab(d);
    expect(d.resting).toBe(false);
  });
});

describe('letting go', () => {
  it('glides on, then rests exactly on a tick', () => {
    const d = fresh(1851); grab(d); drag(d, 60); release(d, 1.0); run(d, 5000);
    expect(d.resting).toBe(true);
    expect(d.offset).toBe(yearIndex(d.year));
    expect(d.year).toBeLessThan(1846);
  });
  it('has stopped within 2 seconds of a 1 px/ms flick', () => {
    const d = fresh(1851); grab(d); release(d, 1.0); run(d, 2000);
    const year = d.year; run(d, 1000);
    expect(d.year).toBe(year);
    expect(d.resting).toBe(true);
  });
  it('rests on the nearest tick when let go with no speed, as when the touch is cancelled', () => {
    const d = fresh(1851); grab(d); drag(d, 7); release(d, 0); run(d, 1000);
    expect(d.resting).toBe(true);
    expect(d.year).toBe(1850);
    expect(d.offset).toBe(1850);
  });
  it('stops at both ends of its range however hard it is flung', () => {
    let d = fresh(2025); grab(d); release(d, -9); run(d, 4000);
    expect(d.year).toBe(2026);
    expect(d.offset).toBe(2026);
    expect(d.resting).toBe(true);
    d = fresh(-2599); grab(d); release(d, 9); run(d, 4000);
    expect(d.year).toBe(-2600);
    expect(Number.isFinite(d.offset)).toBe(true);
    expect(d.resting).toBe(true);
  });
});

describe('rollTo', () => {
  it('lands on the year at the given time and reports every tick on the way', () => {
    const d = fresh(1851); rollTo(d, 2026, 3);
    const seen = run(d, 2990);
    expect(d.rolling).toBe(true);
    seen.push(...run(d, 32));
    expect(d.year).toBe(2026);
    expect(d.rolling).toBe(false);
    expect(d.resting).toBe(true);
    expect(seen.length).toBe(175);
    expect(seen.at(-1)).toBe(2026);
  });
  it('starts slowly and ends slowly', () => {
    const d = fresh(1851); rollTo(d, 2026, 3);
    run(d, 256); const early = d.year - 1851;
    run(d, 2496); const late = 2026 - d.year;
    expect(early).toBeLessThan(15);
    expect(late).toBeLessThan(15);
  });
  it('crosses 4,586 years in the same 3 seconds', () => {
    const d = fresh(-2560); rollTo(d, 2026, 3); run(d, 3020);
    expect(d.year).toBe(2026);
  });
  it('rolls backwards too', () => {
    const d = fresh(2026); rollTo(d, 1851, 1.5); run(d, 1520);
    expect(d.year).toBe(1851);
    expect(d.resting).toBe(true);
  });
  it('hands over to the finger when grabbed mid-roll', () => {
    const d = fresh(1851); rollTo(d, 2026, 3); run(d, 1500); grab(d);
    expect(d.rolling).toBe(false);
    const year = d.year; release(d, 0); run(d, 1000);
    expect(Math.abs(d.year - year)).toBeLessThanOrEqual(1);
    expect(d.resting).toBe(true);
  });
});
