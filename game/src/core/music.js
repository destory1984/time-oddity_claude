// Background music, decided here and played by ui/music.js. No sound files: a slow pad
// of three notes per bar under a few bell notes, different every bar but always the
// same for a given bar number. Twenty tunes take turns, each with its own four chords,
// five-note scale, beat and bell. The way of making them is volume 1's (Space Oddity);
// the tunes themselves are this game's own.

export const BAR_S = 8;
// Each tune plays this many bars (about two minutes), then the next one starts.
export const BARS_PER_TUNE = 16;

const STEPS = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
// 'A4' → 440, 'Bb2' → 116.54, 'F#4' → 369.99.
function hz(name) {
  const [, letter, mark, octave] = name.match(/^([A-G])([#b]?)(\d)$/);
  const midi = 12 * (Number(octave) + 1) + STEPS[letter] + { '#': 1, b: -1, '': 0 }[mark];
  return Math.round(440 * 2 ** ((midi - 69) / 12) * 100) / 100;
}
const chord = (bass, ...pad) => ({ bass: hz(bass), pad: pad.map(hz) });
const scale = (names) => names.split(' ').map(hz);

// slots: where a melody note may fall inside a bar, in seconds.
// busy: the share of slots that sound above the Earth (on the ground the bells rest).
// bell: how long a note rings, and its overtone (a multiple of the note, and how loud);
//   wave: 'triangle' for a plucked sound (a sine, the music box, when left out).
// motif: a figure, as places in the melody; the notes that sound walk along it in
//   order instead of being picked by chance (which notes sound is still by chance).
//
// The twenty tunes are this game's own (the user, 2026.10.7: "우주 한량에서 가져온 BGM을 모두
// 지우고, 비슷한 풍으로 20개 만들어줘"). They are named after what the game is about: the
// dial, clocks and calendars, the notebook, and things seen on the way.
export const TUNES = [
  {
    // A major, even ticks: the dial turning a notch at a time.
    id: 'dial', name: '다이얼',
    chords: [chord('A2', 'A3', 'C#4', 'E4'), chord('F#2', 'F#3', 'A3', 'C#4'), chord('D2', 'A3', 'D4', 'F#4'), chord('E2', 'G#3', 'B3', 'E4')],
    melody: scale('A4 B4 C#5 E5 F#5 A5 B5 C#6'),
    slots: [0, 1, 2, 3, 4, 5, 6, 7], busy: 0.45,
    bell: { length: 1.2, overtone: 3, overtoneVolume: 0.18 },
    motif: [0, 2, 4, 2, 5, 4, 3, 1],
  },
  {
    // E minor, many short grains falling from the top of the scale to the bottom.
    id: 'hourglass', name: '모래시계',
    chords: [chord('E2', 'G3', 'B3', 'E4'), chord('D2', 'A3', 'D4', 'F#4'), chord('C3', 'G3', 'C4', 'E4'), chord('B2', 'F#3', 'B3', 'D4')],
    melody: scale('E5 G5 A5 B5 D6 E6 G6 A6'),
    slots: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7], busy: 0.22,
    bell: { length: 0.8, overtone: 4, overtoneVolume: 0.1, wave: 'triangle' },
    motif: [7, 6, 5, 4, 3, 2, 1, 0],
  },
  {
    // C with a raised fourth, bright and still: four long notes a bar, like a shadow moving.
    id: 'sundial', name: '해시계',
    chords: [chord('C3', 'G3', 'C4', 'E4'), chord('D2', 'A3', 'D4', 'F#4'), chord('E2', 'G3', 'B3', 'E4'), chord('G2', 'G3', 'B3', 'D4')],
    melody: scale('G4 A4 B4 D5 E5 G5 A5 B5'),
    slots: [0, 2, 4, 6], busy: 0.7,
    bell: { length: 2.4, overtone: 2, overtoneVolume: 0.2 },
  },
  {
    // F major, gentle: opening the notebook at its first leaf.
    id: 'firstLeaf', name: '첫 장',
    chords: [chord('F2', 'A3', 'C4', 'F4'), chord('C3', 'G3', 'C4', 'E4'), chord('D2', 'A3', 'D4', 'F4'), chord('Bb2', 'Bb3', 'D4', 'F4')],
    melody: scale('F4 G4 A4 C5 D5 F5 G5 A5'),
    slots: [0, 1, 2, 3, 4, 5, 6, 7], busy: 0.4,
    bell: { length: 1.5, overtone: 3, overtoneVolume: 0.15 },
    motif: [0, 2, 3, 5, 4, 3, 2, 1],
  },
  {
    // The five notes of a Korean tune on D, plucked, two close together and then a wait:
    // the neighbour's yard of 1969.
    id: 'yard', name: '마당',
    chords: [chord('D2', 'A3', 'D4', 'E4'), chord('G2', 'G3', 'B3', 'D4'), chord('D2', 'A3', 'B3', 'E4'), chord('A2', 'A3', 'D4', 'E4')],
    melody: scale('A4 B4 D5 E5 G5 A5 B5 D6'),
    slots: [0, 0.4, 2, 3, 3.4, 5, 6.4], busy: 0.5,
    bell: { length: 1.2, overtone: 2, overtoneVolume: 0.28, wave: 'triangle' },
    motif: [2, 3, 5, 4, 3, 2, 1, 2, 3, 5, 6, 5],
  },
  {
    // G major in threes: turning pages.
    id: 'notebook', name: '수첩',
    chords: [chord('G2', 'G3', 'B3', 'D4'), chord('C3', 'G3', 'C4', 'E4'), chord('E2', 'G3', 'B3', 'E4'), chord('D2', 'A3', 'D4', 'F#4')],
    melody: scale('D5 E5 G5 A5 B5 D6 E6 G6'),
    slots: [0, 1.33, 2.67, 4, 5.33, 6.67], busy: 0.55,
    bell: { length: 1.3, overtone: 4, overtoneVolume: 0.1 },
  },
  {
    // D minor, low, a line that sinks: grandmother's note.
    id: 'letter', name: '옛 편지',
    chords: [chord('D2', 'A3', 'D4', 'F4'), chord('Bb2', 'Bb3', 'D4', 'F4'), chord('F2', 'A3', 'C4', 'F4'), chord('C3', 'G3', 'C4', 'E4')],
    melody: scale('D4 F4 G4 A4 C5 D5 F5 G5'),
    slots: [0, 2, 3, 4, 6], busy: 0.65,
    bell: { length: 2.2, overtone: 2, overtoneVolume: 0.2 },
    motif: [4, 3, 1, 2, 5, 3, 1, 0],
  },
  {
    // E with a raised sixth, slow and heavy: stones laid one on another.
    id: 'stoneTower', name: '돌탑',
    chords: [chord('E2', 'G3', 'B3', 'E4'), chord('A2', 'A3', 'C#4', 'E4'), chord('D2', 'A3', 'D4', 'F#4'), chord('B2', 'F#3', 'B3', 'D4')],
    melody: scale('E4 F#4 A4 B4 D5 E5 F#5 A5'),
    slots: [0, 2.5, 4, 6.5], busy: 0.7,
    bell: { length: 2.8, overtone: 2, overtoneVolume: 0.15 },
  },
  {
    // A minor, up the whole scale and down again: a beam going round.
    id: 'lighthouse', name: '등대',
    chords: [chord('A2', 'A3', 'C4', 'E4'), chord('E2', 'G3', 'B3', 'E4'), chord('F2', 'A3', 'C4', 'F4'), chord('G2', 'G3', 'B3', 'D4')],
    melody: scale('A4 C5 D5 E5 G5 A5 C6 D6'),
    slots: [0, 1, 2, 3, 4, 5, 6, 7], busy: 0.38,
    bell: { length: 1.9, overtone: 3, overtoneVolume: 0.14 },
    motif: [0, 1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1],
  },
  {
    // E major, high and glassy: the Crystal Palace.
    id: 'glass', name: '유리 집',
    chords: [chord('E2', 'G#3', 'B3', 'E4'), chord('E2', 'G#3', 'C#4', 'E4'), chord('A2', 'A3', 'C#4', 'E4'), chord('B2', 'F#3', 'B3', 'D#4')],
    melody: scale('E5 F#5 G#5 B5 C#6 E6 F#6 G#6'),
    slots: [0, 0.5, 1, 2, 3, 4, 4.5, 5, 6, 7], busy: 0.33,
    bell: { length: 0.9, overtone: 2, overtoneVolume: 0.3 },
  },
  {
    // F sharp minor in fives: a thin moon, a slow climb and back.
    id: 'crescent', name: '초승달',
    chords: [chord('F#2', 'F#3', 'A3', 'C#4'), chord('D2', 'A3', 'D4', 'F#4'), chord('A2', 'A3', 'C#4', 'E4'), chord('E2', 'G#3', 'B3', 'E4')],
    melody: scale('F#4 A4 B4 C#5 E5 F#5 A5 B5'),
    slots: [0, 1.6, 3.2, 4.8, 6.4], busy: 0.6,
    bell: { length: 2.0, overtone: 2, overtoneVolume: 0.18 },
    motif: [0, 2, 3, 4, 6, 5, 3, 1],
  },
  {
    // G minor, seven places a bar for the seven stars: four for the bowl, three for the handle.
    id: 'dipper', name: '북두칠성',
    chords: [chord('G2', 'G3', 'Bb3', 'D4'), chord('Eb2', 'G3', 'Bb3', 'Eb4'), chord('Bb2', 'Bb3', 'D4', 'F4'), chord('F2', 'A3', 'C4', 'F4')],
    melody: scale('G4 Bb4 C5 D5 F5 G5 Bb5 C6'),
    slots: [0, 1.1, 2.2, 3.3, 4.4, 5.5, 6.6], busy: 0.55,
    bell: { length: 1.4, overtone: 3, overtoneVolume: 0.2 },
    motif: [0, 1, 3, 4, 6, 5, 7, 4],
  },
  {
    // C minor, low and slow: a day nobody wrote down.
    id: 'longAgo', name: '먼 옛날',
    chords: [chord('C3', 'G3', 'C4', 'Eb4'), chord('Ab2', 'Ab3', 'C4', 'Eb4'), chord('Eb2', 'G3', 'Bb3', 'Eb4'), chord('Bb2', 'Bb3', 'D4', 'F4')],
    melody: scale('G4 Bb4 C5 Eb5 F5 G5 Bb5 C6'),
    slots: [0, 2, 4, 6], busy: 0.65,
    bell: { length: 2.6, overtone: 2, overtoneVolume: 0.2 },
  },
  {
    // D major, short plucked drops at uneven moments: a water clock.
    id: 'waterClock', name: '물시계',
    chords: [chord('D2', 'A3', 'D4', 'F#4'), chord('G2', 'G3', 'B3', 'D4'), chord('B2', 'F#3', 'B3', 'D4'), chord('A2', 'A3', 'C#4', 'E4')],
    melody: scale('D5 E5 F#5 A5 B5 D6 E6 F#6'),
    slots: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7], busy: 0.22,
    bell: { length: 0.8, overtone: 4, overtoneVolume: 0.1, wave: 'triangle' },
  },
  {
    // B flat major, long ringing notes in a falling pattern, like bells rung in turn.
    id: 'bells', name: '종소리',
    chords: [chord('Bb2', 'Bb3', 'D4', 'F4'), chord('F2', 'A3', 'C4', 'F4'), chord('G2', 'G3', 'Bb3', 'D4'), chord('Eb2', 'G3', 'Bb3', 'Eb4')],
    melody: scale('Bb4 C5 D5 F5 G5 Bb5 C6 D6'),
    slots: [0, 1, 2, 4, 5, 6], busy: 0.5,
    bell: { length: 2.4, overtone: 3, overtoneVolume: 0.25 },
    motif: [7, 5, 4, 2, 5, 4, 2, 0, 4, 2, 1, 0],
  },
  {
    // C major in threes, a steady walk: one day after another.
    id: 'calendar', name: '달력',
    chords: [chord('C3', 'G3', 'C4', 'E4'), chord('F2', 'A3', 'C4', 'F4'), chord('A2', 'A3', 'C4', 'E4'), chord('G2', 'G3', 'B3', 'D4')],
    melody: scale('G4 A4 C5 D5 E5 G5 A5 C6'),
    slots: [0, 1.33, 2.67, 4, 5.33, 6.67], busy: 0.62,
    bell: { length: 1.1, overtone: 2, overtoneVolume: 0.22 },
    motif: [0, 2, 4, 1, 3, 5, 2, 4, 6, 5, 3, 1],
  },
  {
    // E flat major, wide, a line that keeps rising: the first balloon.
    id: 'balloon', name: '열기구',
    chords: [chord('Eb2', 'G3', 'Bb3', 'Eb4'), chord('C3', 'G3', 'C4', 'Eb4'), chord('Ab2', 'Ab3', 'C4', 'Eb4'), chord('Bb2', 'Bb3', 'D4', 'F4')],
    melody: scale('Bb4 C5 Eb5 F5 G5 Bb5 C6 Eb6'),
    slots: [0, 1, 2, 3, 4, 5, 6, 7], busy: 0.4,
    bell: { length: 2.2, overtone: 3, overtoneVolume: 0.12 },
    motif: [0, 1, 2, 4, 3, 4, 5, 7],
  },
  {
    // D with a raised sixth, a slow swell: boats at rest.
    id: 'harbour', name: '항구',
    chords: [chord('D2', 'A3', 'D4', 'F4'), chord('G2', 'G3', 'B3', 'D4'), chord('A2', 'A3', 'C4', 'E4'), chord('C3', 'G3', 'C4', 'E4')],
    melody: scale('D5 E5 G5 A5 C6 D6 E6 G6'),
    slots: [0, 1.5, 3, 4, 5.5, 7], busy: 0.5,
    bell: { length: 1.8, overtone: 3, overtoneVolume: 0.15 },
  },
  {
    // B minor, high and sparse: small points of light beside a planet.
    id: 'telescope', name: '망원경',
    chords: [chord('B2', 'F#3', 'B3', 'D4'), chord('G2', 'G3', 'B3', 'D4'), chord('E2', 'G3', 'B3', 'E4'), chord('F#2', 'F#3', 'A3', 'C#4')],
    melody: scale('B4 D5 E5 F#5 A5 B5 D6 E6'),
    slots: [0, 0.5, 1, 2, 3, 4, 4.5, 5, 6, 7], busy: 0.3,
    bell: { length: 1.0, overtone: 2, overtoneVolume: 0.28 },
  },
  {
    // A minor, three long notes a bar, the slowest of all: the night with no moon.
    id: 'darkMoon', name: '그믐',
    chords: [chord('A2', 'A3', 'C4', 'E4'), chord('D2', 'A3', 'D4', 'F4'), chord('F2', 'A3', 'C4', 'F4'), chord('E2', 'G3', 'B3', 'E4')],
    melody: scale('E4 G4 A4 C5 D5 E5 G5 A5'),
    slots: [0, 2.7, 5.3], busy: 0.85,
    bell: { length: 3.0, overtone: 2, overtoneVolume: 0.15 },
    motif: [4, 2, 1, 0, 2, 3, 5, 3],
  },
];

// How much of a tune's busyness is left in each mood.
const BUSY = { near: 1, deep: 0.36, surface: 0 };

// Steady numbers in 0..1 for (bar, n), the same every time.
function chance(bar, n) {
  let x = (Math.imul(bar + 1, 0x9e3779b1) ^ Math.imul(n + 1, 0x85ebca6b)) >>> 0;
  x = Math.imul(x ^ (x >>> 16), 0x85ebca6b);
  x = Math.imul(x ^ (x >>> 13), 0xc2b2ae35);
  return ((x ^ (x >>> 16)) >>> 0) / 4294967296;
}

// 'surface' while standing on a world, 'near' within 300,000 km of one, else 'deep'.
export function moodFor({ restingOn, surfaceKm }) {
  if (restingOn) return 'surface';
  return surfaceKm <= 300000 ? 'near' : 'deep';
}

// The tune that bar number `bar` belongs to.
export function tuneFor(bar) {
  return TUNES[Math.floor(bar / BARS_PER_TUNE) % TUNES.length];
}

// The first bar of the tune after the one `bar` is in.
export function nextTuneBar(bar) {
  return (Math.floor(bar / BARS_PER_TUNE) + 1) * BARS_PER_TUNE;
}

// The first bar of tune number `tune` (its place in TUNES) at or after the turn `bar` is in,
// when the tunes go round in `order`: where to go on from when that tune is asked for.
export function barOfTune(tune, bar, order) {
  let turn = Math.floor(bar / BARS_PER_TUNE);
  while (order[turn % order.length] !== tune) turn += 1;
  return turn * BARS_PER_TUNE;
}

// Where to go on from when a tune has just ended (`position` is the first bar after it) and
// the same one is to be heard again: its next turn, a round later, so its notes differ.
export const sameTuneAgain = (position, order) => position + (order.length - 1) * BARS_PER_TUNE;

// The tunes in a chance order for one sitting (random: a function giving 0..1), so the
// game does not open with the same tune every time. Every tune comes once a round.
export function tuneOrder(random = Math.random) {
  const order = TUNES.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

// The bar number to play at `position` (bars played so far in this sitting) when the
// tunes go round in `order`: the same place in the tune, in a later round each time
// round, so a tune's notes differ from its last turn.
export function barInOrder(position, order) {
  const turn = Math.floor(position / BARS_PER_TUNE);
  const round = Math.floor(turn / order.length);
  return (round * TUNES.length + order[turn % order.length]) * BARS_PER_TUNE + (position % BARS_PER_TUNE);
}

// What to play in bar number `bar`:
// { bass, pad: [3 Hz], notes: [{ freq, at, volume }], bell: { length, overtone, overtoneVolume } }.
export function barPlan(bar, mood) {
  const tune = tuneFor(bar);
  const { bass, pad } = tune.chords[bar % tune.chords.length];
  const octave = mood === 'deep' ? 0.5 : 1;
  const notes = [];
  tune.slots.forEach((slot, i) => {
    if (chance(bar, i) >= tune.busy * BUSY[mood]) return;
    notes.push({
      freq: tune.motif
        ? tune.melody[tune.motif[(bar * tune.slots.length + i) % tune.motif.length]]
        : tune.melody[Math.floor(chance(bar, i + 100) * tune.melody.length)],
      // A little off the beat, like a hand-wound music box.
      at: Math.min(BAR_S - 0.6, slot + chance(bar, i + 200) * 0.3),
      volume: 0.02 + chance(bar, i + 300) * 0.025,
    });
  });
  return { bass: bass * octave, pad: pad.map((f) => f * octave), notes, bell: tune.bell };
}
