// Dates. The one place where calendars are converted: everything else in the game
// keeps time as a Julian Day (JD).
//
// Years here are historical years: negative is BC and there is no year 0, so -1 (1 BC)
// is followed by 1. Astronomers count a year 0; yearIndex() gives that gapless count.
// Dates before 1582.10.15 are written in the Julian calendar, later ones in the
// Gregorian. A JavaScript Date stretches the Gregorian calendar back for ever, so it is
// used for nothing but asking what day it is today.
import { MakeTime } from 'astronomy-engine';

// JD of 1582.10.15 (Gregorian), the day after 1582.10.4 (Julian).
const GREGORIAN_STARTS_JD = 2299160.5;
const J2000_JD = 2451545.0;

export function yearIndex(year) {
  if (year === 0) throw new RangeError('There is no year 0: 1 BC is -1 and is followed by 1.');
  return year < 0 ? year + 1 : year;
}

export function yearFromIndex(index) {
  return index <= 0 ? index - 1 : index;
}

export function isLeap(year, calendar) {
  const y = yearIndex(year);
  if (calendar === 'julian') return y % 4 === 0;
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

export function calendarOf(jd) {
  return jd < GREGORIAN_STARTS_JD ? 'julian' : 'gregorian';
}

// hour is universal time and may run past 24 into the next day. (Meeus, ch. 7.)
export function jdFromDate({ year, month, day, hour = 0 }, calendar) {
  let y = yearIndex(year);
  let m = month;
  if (m <= 2) { y -= 1; m += 12; }
  const century = Math.floor(y / 100);
  const b = calendar === 'julian' ? 0 : 2 - century + Math.floor(century / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524.5 + hour / 24;
}

export function dateFromJd(jd, calendar = calendarOf(jd)) {
  const z = Math.floor(jd + 0.5);
  const fraction = jd + 0.5 - z;
  let a = z;
  if (calendar === 'gregorian') {
    const alpha = Math.floor((z - 1867216.25) / 36524.25);
    a = z + 1 + alpha - Math.floor(alpha / 4);
  }
  const b = a + 1524;
  const c = Math.floor((b - 122.1) / 365.25);
  const d = Math.floor(365.25 * c);
  const e = Math.floor((b - d) / 30.6001);
  const day = b - d - Math.floor(30.6001 * e);
  const month = e < 14 ? e - 1 : e - 13;
  const index = month > 2 ? c - 4716 : c - 4715;
  return { year: yearFromIndex(index), month, day, hour: fraction * 24 };
}

export const formatYear = (year) => (year < 0 ? `BC ${-year}` : `AD ${year}`);

export const formatDate = ({ year, month, day }) => `${formatYear(year)}.${month}.${day}`;

// Local mean time at a longitude (east positive) to universal time, in hours.
export const utHour = (localHour, lon) => localHour - lon / 15;

export const astroTime = (jd) => MakeTime(jd - J2000_JD);

export function todayDate(now = new Date()) {
  return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
}
