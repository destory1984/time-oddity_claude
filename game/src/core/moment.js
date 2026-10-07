// Which moment is shown: the square, the year the dial stands on and how far the clock
// has flowed toward night give one Julian Day.
import { isLeap, jdFromDate, utHour } from './when.js';

const NIGHT_HOUR = 21;

// dial: { year, night = 0 }. year is the historical year on the dial; night runs 0 to 1
// as the clock flows from the event's hour to 9 pm. today: { year, month, day }.
export function momentJd(square, { year, night = 0 }, today) {
  let date;
  let calendar;
  if (year === square.date.year) {
    date = square.date;
    calendar = square.calendar;
  } else if (year === today.year) {
    date = today;
    calendar = 'gregorian';
  } else {
    // Another year keeps the event's month and day, so a night square stays a night.
    calendar = year < 1583 ? 'julian' : 'gregorian';
    const { month } = square.date;
    let { day } = square.date;
    if (month === 2 && day === 29 && !isLeap(year, calendar)) day = 28;
    date = { year, month, day };
  }
  const hourLocal = square.hourLocal + (NIGHT_HOUR - square.hourLocal) * night;
  return jdFromDate({ ...date, hour: utHour(hourLocal, square.lon) }, calendar);
}
