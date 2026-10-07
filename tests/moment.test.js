import { describe, expect, it } from 'vitest';
import { dateFromJd, jdFromDate } from '../game/src/core/when.js';
import { SQUARES, squareById } from '../game/src/core/squares.js';
import { momentJd } from '../game/src/core/moment.js';

const today = { year: 2026, month: 10, day: 7 };
const at = (id, dial) => momentJd(squareById(id), dial, today);

describe('the four squares', () => {
  it('come in the order of their numbers', () => {
    expect(SQUARES.map((s) => s.no)).toEqual([0, 1, 2, 9, 10, 16, 20, 34, 39, 46, 47, 54, 64, 74, 75, 82, 104, 110]);
  });
  it('keep the memo and Sora lines within 25 characters', () => {
    for (const s of SQUARES) {
      for (const line of [s.memo, s.sora, s.memoToday, s.soraToday]) {
        expect(line.length).toBeGreaterThan(0);
        expect(line.length).toBeLessThanOrEqual(25);
      }
    }
  });
});

describe('momentJd', () => {
  it('is the event itself when the dial stands on the event year', () => {
    expect(at('khufu', { year: -2560 })).toBeCloseTo(786484.2885, 3);
    expect(at('lunar1504', { year: 1504 })).toBeCloseTo(2270453.5278, 3);
    expect(at('crystalPalace', { year: 1851 })).toBeCloseTo(2397244.0005, 3);
    expect(at('kittyHawk', { year: 1903 })).toBeCloseTo(2416466.1512, 3);
  });
  it('flows to 9 pm of the same day as night goes from 0 to 1', () => {
    expect(at('crystalPalace', { year: 1851, night: 1 })).toBeCloseTo(2397244.3755, 3);
    expect(at('kittyHawk', { year: 1903, night: 1 })).toBeCloseTo(2416466.5852, 3);
    expect(at('crystalPalace', { year: 1851, night: 0.5 })).toBeCloseTo(2397244.188, 3);
  });
  it('is today at the same local clock time when the dial stands on this year', () => {
    expect(at('crystalPalace', { year: 2026 })).toBeCloseTo(jdFromDate({ ...today, hour: 12 + 0.17 / 15 }, 'gregorian'), 6);
  });
  it('keeps the month and day in any other year', () => {
    expect(at('crystalPalace', { year: 1700 })).toBeCloseTo(jdFromDate({ year: 1700, month: 5, day: 1, hour: 12 + 0.17 / 15 }, 'gregorian'), 6);
    expect(at('crystalPalace', { year: 1500 })).toBeCloseTo(jdFromDate({ year: 1500, month: 5, day: 1, hour: 12 + 0.17 / 15 }, 'julian'), 6);
  });
  it('falls back to 28 February in a year without a 29th', () => {
    expect(dateFromJd(at('lunar1504', { year: 1505 }) - 0.5, 'julian')).toMatchObject({ month: 2, day: 28 });
    expect(dateFromJd(at('lunar1504', { year: 1508 }) - 0.5, 'julian')).toMatchObject({ month: 2, day: 29 });
  });
});
