// The dial above the Earth turns by centuries, and only the centuries with somewhere to
// go have a stop: an empty century is passed over, so that wherever the dial rests a
// place on the globe is lit (docs/기획서-v4-사는-때로.md section 1).
//
// A century is counted as historians count it: AD 80 is in the 1st, 1889 in the 19th;
// 585 BC is in the 6th century BC, written as -6. There is no century 0.
export function centuryOf(year) {
  return year > 0 ? Math.ceil(year / 100) : -Math.ceil(-year / 100);
}

export const centuryLabel = (century) => (century > 0 ? `${century}세기` : `기원전 ${-century}세기`);

// The first year of a century: where the dial is put before it is drawn tight to the
// exact year of the place chosen.
export const centuryStart = (century) => (century > 0 ? (century - 1) * 100 + 1 : century * 100);

// squares: [{ id, date: { year } }]. Returns the stops in order of time:
// [{ century, label, ids }], one for each century that has a square.
export function centuryStops(squares) {
  const stops = new Map();
  for (const sq of squares) {
    const century = centuryOf(sq.date.year);
    if (!stops.has(century)) stops.set(century, { century, label: centuryLabel(century), ids: [] });
    stops.get(century).ids.push(sq.id);
  }
  return [...stops.values()].sort((a, b) => a.century - b.century);
}
