import { describe, expect, it } from 'vitest';
import {
  calendarOf, dateFromJd, formatDate, formatYear, isLeap, jdFromDate, todayDate, utHour, yearFromIndex, yearIndex,
} from '../game/src/core/when.js';

describe('jdFromDate', () => {
  it('gives the Julian Day of known dates in both calendars', () => {
    expect(jdFromDate({ year: -585, month: 5, day: 28 }, 'julian')).toBe(1507899.5);
    expect(jdFromDate({ year: 1504, month: 2, day: 29 }, 'julian')).toBe(2270452.5);
    expect(jdFromDate({ year: 1582, month: 10, day: 4 }, 'julian')).toBe(2299159.5);
    expect(jdFromDate({ year: 1582, month: 10, day: 15 }, 'gregorian')).toBe(2299160.5);
    expect(jdFromDate({ year: 1851, month: 5, day: 1 }, 'gregorian')).toBe(2397243.5);
  });
  it('has no year zero: 1 BC is followed by AD 1', () => {
    expect(jdFromDate({ year: 1, month: 1, day: 1 }, 'julian') - jdFromDate({ year: -1, month: 12, day: 31 }, 'julian')).toBe(1);
    expect(() => jdFromDate({ year: 0, month: 1, day: 1 }, 'julian')).toThrow(RangeError);
  });
  it('takes hours past 24 into the next day', () => {
    expect(jdFromDate({ year: 1504, month: 2, day: 29, hour: 24 + 40 / 60 }, 'julian')).toBeCloseTo(2270453.5278, 4);
  });
});

describe('dateFromJd', () => {
  it('reads a date back in the calendar of its time', () => {
    expect(dateFromJd(1507899.5)).toMatchObject({ year: -585, month: 5, day: 28 });
    expect(dateFromJd(2299160.5)).toMatchObject({ year: 1582, month: 10, day: 15 });
    expect(dateFromJd(2299159.5)).toMatchObject({ year: 1582, month: 10, day: 4 });
    expect(calendarOf(2299159.5)).toBe('julian');
    expect(calendarOf(2299160.5)).toBe('gregorian');
  });
  it('gives the hour of the day', () => {
    expect(dateFromJd(2397243.5 + 0.75).hour).toBeCloseTo(18, 6);
  });
});

describe('years', () => {
  it('maps historical years to a gapless index and back', () => {
    expect(yearIndex(-585)).toBe(-584);
    expect(yearIndex(1)).toBe(1);
    expect(yearFromIndex(0)).toBe(-1);
    expect(yearFromIndex(1)).toBe(1);
    expect(yearFromIndex(-584)).toBe(-585);
  });
  it('knows leap years in each calendar', () => {
    expect(isLeap(1504, 'julian')).toBe(true);
    expect(isLeap(1900, 'julian')).toBe(true);
    expect(isLeap(1900, 'gregorian')).toBe(false);
    expect(isLeap(2000, 'gregorian')).toBe(true);
    expect(isLeap(-1, 'julian')).toBe(true);
    expect(isLeap(1505, 'julian')).toBe(false);
  });
});

describe('words and clocks', () => {
  it('writes years and dates with AD and BC', () => {
    expect(formatYear(-585)).toBe('BC 585');
    expect(formatYear(1851)).toBe('AD 1851');
    expect(formatDate({ year: -585, month: 5, day: 28 })).toBe('BC 585.5.28');
    expect(formatDate({ year: 1851, month: 5, day: 1 })).toBe('AD 1851.5.1');
  });
  it('turns local mean time into universal time by longitude', () => {
    expect(utHour(21, 31.134)).toBeCloseTo(18.9244, 4);
    expect(utHour(12, -0.17)).toBeCloseTo(12.01133, 4);
  });
  it('reads today from a Date', () => {
    expect(todayDate(new Date(2026, 9, 7, 13, 0))).toEqual({ year: 2026, month: 10, day: 7 });
  });
});
