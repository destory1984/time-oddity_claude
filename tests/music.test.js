import { test } from 'vitest';
import assert from 'node:assert/strict';
import {
  BAR_S, BARS_PER_TUNE, TUNES, barPlan, moodFor, tuneFor, nextTuneBar, tuneOrder, barInOrder,
} from '../game/src/core/music.js';

const BARS = BARS_PER_TUNE * TUNES.length;

const NAMES = [
  '다이얼', '모래시계', '해시계', '첫 장', '마당', '수첩', '옛 편지', '돌탑', '등대', '유리 집',
  '초승달', '북두칠성', '먼 옛날', '물시계', '종소리', '달력', '열기구', '항구', '망원경', '그믐',
];
// Volume 1's eleven, which this game no longer plays (the user, 2026.10.7: "우주 한량에서 가져온
// BGM을 모두 지우고, 비슷한 풍으로 20개 만들어줘").
const OLD_IDS = ['box', 'dawn', 'sea', 'lullaby', 'stars', 'night', 'drift', 'rain', 'gayageum', 'aurora', 'carousel'];
const OLD_NAMES = ['오르골', '새벽', '먼 바다', '자장가', '별무리', '깊은 밤', '유영', '빗방울', '가야금', '오로라', '회전목마'];

test('a bar lasts eight seconds and the four chords come round in order', () => {
  assert.equal(BAR_S, 8);
  const first = TUNES[0];
  for (let bar = 0; bar < 8; bar++) assert.deepEqual(barPlan(bar, 'near').pad, first.chords[bar % 4].pad);
  // The first tune is the dial: A, F sharp minor, D, E under A major's five notes.
  assert.deepEqual(first.chords.map((c) => c.bass), [110, 92.5, 73.42, 82.41]);
  assert.deepEqual(first.chords[0].pad, [220, 277.18, 329.63]);
  assert.deepEqual(first.melody, [440, 493.88, 554.37, 659.26, 739.99, 880, 987.77, 1108.73]);
});

test('twenty tunes of this game\'s own take turns, sixteen bars each, and come round again', () => {
  assert.equal(TUNES.length, 20);
  assert.equal(BARS_PER_TUNE, 16);
  assert.deepEqual(TUNES.map((t) => t.name), NAMES);
  assert.equal(new Set(TUNES.map((t) => t.id)).size, 20);
  for (const t of TUNES) {
    assert.equal(OLD_IDS.includes(t.id), false, t.id);
    assert.equal(OLD_NAMES.includes(t.name), false, t.name);
  }
  assert.equal(tuneFor(0).id, 'dial');
  assert.equal(tuneFor(15).id, 'dial');
  assert.equal(tuneFor(16).id, 'hourglass');
  assert.equal(tuneFor(BARS - 1).id, 'darkMoon');
  assert.equal(tuneFor(BARS).id, 'dial');
  // Skipping ahead lands on the first bar of the following tune.
  assert.equal(nextTuneBar(0), 16);
  assert.equal(nextTuneBar(15), 16);
  assert.equal(nextTuneBar(16), 32);
  assert.equal(tuneFor(nextTuneBar(BARS - 3)).id, 'dial');
});

test('none of the twenty has the chords and the scale of one of volume 1\'s eleven', () => {
  // Volume 1's marks, as [bass of each chord, first and last melody note], rounded.
  const old = [
    [[110, 87.31, 130.81, 98], 440, 1174.66], [[130.81, 110, 87.31, 98], 523.25, 1318.51],
    [[73.42, 98, 130.81, 110], 587.33, 1567.98], [[87.31, 73.42, 116.54, 130.81], 523.25, 1396.91],
    [[82.41, 130.81, 98, 73.42], 659.26, 1760], [[73.42, 110, 116.54, 87.31], 293.66, 783.99],
    [[98, 82.41, 130.81, 73.42], 392, 987.77], [[123.47, 98, 73.42, 110], 587.33, 1479.98],
    [[98, 130.81, 98, 73.42], 293.66, 783.99], [[73.42, 123.47, 98, 110], 440, 1174.66],
    [[116.54, 98, 77.78, 87.31], 466.16, 1174.66],
  ].map((m) => JSON.stringify(m));
  for (const t of TUNES) {
    const mark = JSON.stringify([t.chords.map((c) => c.bass), t.melody[0], t.melody[7]]);
    assert.equal(old.includes(mark), false, t.id);
  }
});

test('every tune has four chords, eight melody notes of its own and a bell', () => {
  for (const tune of TUNES) {
    assert.equal(tune.chords.length, 4, tune.id);
    for (const c of tune.chords) {
      assert.ok(c.bass > 70 && c.bass < 135, `${tune.id} bass ${c.bass}`);
      assert.equal(c.pad.length, 3);
      for (const f of c.pad) assert.ok(f >= 170 && f <= 370, `${tune.id} pad ${f}`);
    }
    assert.equal(tune.melody.length, 8, tune.id);
    assert.deepEqual(tune.melody, [...tune.melody].sort((a, b) => a - b));
    assert.ok(tune.melody[0] >= 290 && tune.melody[7] <= 1760, tune.id);
    assert.deepEqual(tune.slots, [...tune.slots].sort((a, b) => a - b));
    assert.ok(tune.slots[0] === 0 && tune.slots[tune.slots.length - 1] <= 7, tune.id);
    assert.ok(tune.bell.length >= 0.8 && tune.bell.length <= 3 && tune.bell.overtone >= 2 && tune.bell.overtoneVolume <= 0.3, tune.id);
  }
  // No two tunes share both their chords and their scale.
  const marks = TUNES.map((t) => JSON.stringify([t.chords, t.melody]));
  assert.equal(new Set(marks).size, TUNES.length);
});

test('a tune with a figure walks along it; the notes of a bar are not all the same', () => {
  const withFigure = TUNES.filter((t) => t.motif);
  assert.deepEqual(withFigure.map((t) => t.id), ['dial', 'hourglass', 'firstLeaf', 'yard', 'letter', 'lighthouse', 'crescent', 'dipper', 'bells', 'calendar', 'balloon', 'darkMoon']);
  for (const tune of withFigure) {
    assert.ok(tune.motif.length >= 8 && tune.motif.every((n) => Number.isInteger(n) && n >= 0 && n < 8), tune.id);
    // Neighbours in the figure are never the same note twice.
    tune.motif.forEach((n, i) => assert.notEqual(n, tune.motif[(i + 1) % tune.motif.length], tune.id));
    const first = TUNES.indexOf(tune) * BARS_PER_TUNE;
    const heard = new Set();
    for (let bar = first; bar < first + BARS_PER_TUNE; bar++) for (const note of barPlan(bar, 'near').notes) heard.add(note.freq);
    assert.ok(heard.size >= 5, `${tune.id} ${heard.size}`);
  }
  assert.equal(TUNES.filter((t) => t.bell.wave).every((t) => t.bell.wave === 'triangle'), true);
});

test('the same bar always sounds the same', () => {
  assert.deepEqual(barPlan(13, 'near'), barPlan(13, 'near'));
  assert.notDeepEqual(barPlan(13, 'near').notes, barPlan(14, 'near').notes);
});

test("melody notes come from the tune's five-note scale, inside the bar, and stay quiet", () => {
  for (let bar = 0; bar < BARS; bar++) {
    const tune = tuneFor(bar);
    for (const mood of ['near', 'deep', 'surface']) {
      const { notes, pad, bass, bell } = barPlan(bar, mood);
      assert.ok(pad.length === 3 && bass > 35 && bass < 140);
      assert.equal(bell, tune.bell);
      for (const note of notes) {
        assert.ok(tune.melody.includes(note.freq), `${note.freq}`);
        assert.ok(note.at >= 0 && note.at < BAR_S - 0.5);
        assert.ok(note.volume > 0 && note.volume <= 0.05);
      }
      const times = notes.map((n) => n.at);
      assert.deepEqual(times, [...times].sort((a, b) => a - b));
    }
  }
});

test('near a world each tune is busier than in deep space; on the ground it rests', () => {
  TUNES.forEach((tune, i) => {
    const count = (mood) => {
      let total = 0;
      // Four turns of this tune.
      for (let turn = 0; turn < 4; turn++) {
        for (let k = 0; k < BARS_PER_TUNE; k++) total += barPlan(turn * BARS + i * BARS_PER_TUNE + k, mood).notes.length;
      }
      return total;
    };
    assert.ok(count('near') > count('deep') * 1.5, tune.id);
    assert.ok(count('deep') > 0, tune.id);
    assert.equal(count('surface'), 0);
    // Two to five notes a bar near a world: never crowded, never empty for long.
    const perBar = count('near') / (4 * BARS_PER_TUNE);
    assert.ok(perBar >= 2 && perBar <= 5, `${tune.id}: ${perBar}`);
  });
  // Deep space drops the pad an octave.
  assert.deepEqual(barPlan(0, 'deep').pad, TUNES[0].chords[0].pad.map((f) => f / 2));
});

test('the mood follows where the traveler is', () => {
  assert.equal(moodFor({ restingOn: 'moon', surfaceKm: 0 }), 'surface');
  assert.equal(moodFor({ restingOn: null, surfaceKm: 9000 }), 'near');
  assert.equal(moodFor({ restingOn: null, surfaceKm: 300000 }), 'near');
  assert.equal(moodFor({ restingOn: null, surfaceKm: 300001 }), 'deep');
});

test('each sitting the tunes go round in a chance order, every tune once a round', () => {
  // A stand-in for chance: always the last place, then the first.
  assert.deepEqual(tuneOrder(() => 0.999), TUNES.map((_, i) => i));
  const turned = tuneOrder(() => 0);
  assert.deepEqual([...turned].sort((a, b) => a - b), TUNES.map((_, i) => i));
  assert.notDeepEqual(turned, TUNES.map((_, i) => i));
  const firsts = new Set();
  for (let k = 0; k < 200; k++) firsts.add(tuneOrder()[0]);
  assert.ok(firsts.size >= 8, `${firsts.size}`);

  const order = [3, 0, 10, 1, 2, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19];
  assert.equal(tuneFor(barInOrder(0, order)).id, TUNES[3].id);
  assert.equal(tuneFor(barInOrder(15, order)).id, TUNES[3].id);
  assert.equal(tuneFor(barInOrder(16, order)).id, TUNES[0].id);
  assert.equal(tuneFor(barInOrder(32, order)).id, TUNES[10].id);
  // Skipping to the next tune lands on its first bar.
  assert.equal(barInOrder(nextTuneBar(5), order) % BARS_PER_TUNE, 0);
  // A round later the same tune comes back, with other notes.
  const again = TUNES.length * BARS_PER_TUNE;
  assert.equal(tuneFor(barInOrder(again, order)).id, TUNES[3].id);
  assert.notEqual(barInOrder(again, order), barInOrder(0, order));
  const heard = new Set();
  for (let p = 0; p < again; p += BARS_PER_TUNE) heard.add(tuneFor(barInOrder(p, order)).id);
  assert.equal(heard.size, TUNES.length);
});
