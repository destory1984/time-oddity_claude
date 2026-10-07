// Wires core, render and ui together and runs the frame loop. The first slice: a globe
// with four pins, and on the ground of each square the year dial, the computed sky and
// the picture that changes from the day to today.
// Timings are from docs/상세-기획-2-칸-하나의-흐름.md section 3.
import './style.css';
import { SQUARES, skyMemoOf, squareById, squareTitle } from './core/squares.js';
import { momentJd } from './core/moment.js';
import { skyAt, skyLight } from './core/sky.js';
import { formatDate, formatYear, todayDate } from './core/when.js';
import { createDial, drag, grab, isDecade, nextMark, release, rollTo, setMarks, stepDial } from './core/dial.js';
import { createLook, dragLook, endLook, resetLook } from './core/look.js';
import { soraPose } from './core/sora.js';
import { guideLine } from './core/guide.js';
import { countProgress, dotsOf, emptyProgress, fillDot, fullProgress, isComplete, markNoteRead, notesRead, quizSolved, solveQuiz } from './core/progress.js';
import { project } from './core/project.js';
import { createVisit, stepVisit, visitAt } from './core/visit.js';
import { createSkyCanvas } from './render/skyCanvas.js';
import { createGround } from './render/ground.js';
import { createGlobe } from './render/globe.js';
import { createDialView } from './ui/dialView.js';
import { createHud } from './ui/hud.js';
import { createTouch } from './ui/touch.js';
import { ZOOM_MAX, ZOOM_MIN, ZOOM_STEP } from './core/zoom.js';
import { flyPose } from './core/flight.js';
import { isLocalHost } from './core/host.js';
import { createSound } from './ui/sound.js';
import { createSettings } from './ui/settings.js';
import { createMusic } from './ui/music.js';
import { createJournal } from './ui/journal.js';
import { createCard } from './ui/card.js';
import { createPhoto } from './ui/photo.js';
import { readReply, sendCard, takeCard } from './core/postcard.js';
import { createPager } from './ui/opening.js';
import { OPENING } from './core/opening.js';
import { NOTES, dueNote, noteById, notePages } from './core/notes.js';
import { forgetOpened, keepProgressAside,
  loadCards, loadMusic, loadMuted, loadOpened, loadProgress, saveCards, saveMusic, saveMuted, saveOpened, saveProgress,
} from './ui/storage.js';

const RISE_MS = 800;
const MEMO_AT_MS = 1200;
const SORA_FROM_MS = 2500;
const SORA_FOR_MS = 4000;
const CHIPS_AT_MS = 3000;
const GUIDE_AT_MS = 4500;        // the guidance waits until the arrival has played out
const HINT_SKY_AT_MS = 9000;
const HINT_TODAY_AT_MS = 15000;
const TO_TODAY_S = 3;
const TO_THEN_S = 1.5;
const TRAVEL_SPIN_S = 1;
const TRAVEL_ROLL_S = 1;
const LEAVE_MS = 600;
const FADE_MS = 200;
const NO_PICTURE_AFTER_MS = 1000;   // resting this long on a year with no picture shows the silhouette
const NO_PICTURE_FADE_MS = 400;
const DIM_BACK_MS = 400;
const LABELS_AFTER_MS = 1000;       // names appear this long after the head is fully raised

const $ = (id) => document.getElementById(id);
const clamp01 = (v) => Math.max(0, Math.min(1, v));
const smoothstep = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const wait = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });

const stage = $('stage');
const today = todayDate();
const sound = createSound();
const skyCanvas = createSkyCanvas($('sky'));
const ground = createGround($('ground'));
const dialView = createDialView($('dial'));
const hud = createHud($('hud'));
const dial = createDial({ year: today.year, maxYear: today.year });

// The notebook: what has been filled, kept on this device.
let progress = loadProgress(SQUARES.map((sq) => sq.id), NOTES.map((note) => note.id));
function keep(next) {
  if (next === progress) return;
  progress = next;
  saveProgress(progress);
  journal.showCount();
}

// The postcards: one a square, the picture with it, kept on this device.
let cards = loadCards(SQUARES.map((sq) => sq.id));
function keepCards(next) {
  if (next === cards) return;
  cards = next;
  saveCards(cards);
  journal.showCount();
}
const dayToday = () => { const now = todayDate(); return `${now.year}-${String(now.month).padStart(2, '0')}-${String(now.day).padStart(2, '0')}`; };

let mode = 'globe';        // 'globe' | 'travel' | 'ground' | 'leaving'
let square = null;
let visit = null;
const look = createLook();
let blend = 0;             // 0 the day, 1 today
let roll = null;           // { from, to }: the picture's blend over a timed roll
let silhouette = 0;
let restingOtherMs = 0;
let dim = 0;
let leavingMs = 0;
let bubble = null;         // { text, until }
let remainsAtMs = null;
let glowSky = 0;
let glowToday = 0;
let hushAt = null;      // when Sora last put a finger to her lips

// The years with something to see, shown on the dial. Above the Earth: every square.
// On the ground: this square's day and today.
let marks = [];
function mark(list) {
  marks = list;
  setMarks(dial, list.map((m) => m.year));
}
const globeMarks = () => [...SQUARES.map((sq) => ({ year: sq.date.year, label: sq.name })), { year: today.year, label: '오늘' }];

// The pager tells the opening (once, the first time; again from the settings) and
// grandmother's notes.
const pager = createPager();
const opening = {
  open: () => pager.open({ pages: OPENING, lastLabel: '수첩 펴기', skip: true, onDone: () => saveOpened() }),
  isOpen: () => pager.isOpen(),
};
// A note is read; when it is folded Sora says her line, if she is on the ground to say it.
function readNote(note) {
  pager.open({
    pages: notePages(note), lastLabel: '쪽지를 접는다', skip: false,
    onDone: () => {
      keep(markNoteRead(progress, note.id));
      if (visit) bubble = { text: note.says[note.says.length - 1], until: visit.t + SORA_FOR_MS };
    },
  });
}
const NOTE_AFTER_MS = 6000;      // a note falls this long after the square's last dot, once Sora has had her say
let noteDueAtMs = null;

// Sound: one switch, kept between visits, worked by the speaker button and by the settings.
const soundSwitch = {
  muted: () => sound.muted(),
  setMuted(on) {
    if (on && !sound.muted()) hushAt = performance.now();
    sound.setMuted(on);
    saveMuted(on);
    $('soundButton').classList.toggle('off', on);
    $('soundButton').title = on ? '소리 켜기' : '소리 끄기';
  },
};
// What was kept is put back quietly: no finger to her lips for a switch nobody pressed.
sound.setMuted(loadMuted());
soundSwitch.setMuted(sound.muted());
$('soundButton').addEventListener('click', () => { sound.wake(); soundSwitch.setMuted(!sound.muted()); });

// Background music: twenty tunes of this game's own, with a switch of its own.
const music = createMusic({ context: () => sound.context(), on: loadMusic() });
const musicSwitch = {
  on: () => music.on(),
  another() { sound.wake(); music.another(); },
  setOn(on) {
    if (!on && music.on()) hushAt = performance.now();
    music.setOn(on);
    saveMusic(on);
    $('musicButton').classList.toggle('off', !on);
    $('musicButton').title = on ? '배경 음악 끄기' : '배경 음악 켜기';
  },
};
musicSwitch.setOn(music.on());
$('musicButton').addEventListener('click', () => { sound.wake(); musicSwitch.setOn(!music.on()); });
// Any first touch wakes the sound, so that the music can begin without a button.
window.addEventListener('pointerdown', () => sound.wake(), { once: true, capture: true });

const journal = createJournal({
  squares: SQUARES,
  progress: () => progress,
  onGo: (id) => pick(squareById(id)),
  onSolve: (id) => { sound.stamp(); keep(solveQuiz(progress, id)); },
  here: () => (visit && mode === 'ground' ? square.id : null),
  notes: () => notesRead(progress).map((id) => noteById(id)).filter(Boolean),
  onNote: (id) => readNote(noteById(id)),
  cards: () => cards,
  today: dayToday,
  onSend: (id) => { sound.page(); keepCards(sendCard(cards, id, dayToday())); },
  onReply: (id) => keepCards(readReply(cards, id, dayToday())),
  canGo: () => mode === 'globe' || mode === 'ground',
});
const card = createCard({
  solved: (id) => quizSolved(progress, id),
  onSolve: (id) => { sound.stamp(); keep(solveQuiz(progress, id)); },
});
// Taking a picture: what is in the frame becomes that square's postcard.
const photo = createPhoto({
  stage,
  skyCanvas: $('sky'),
  paintGround: (ctx, frameBox, scale) => ground.paint(ctx, frameBox, scale),
  onMode: () => {},
  onShot: (image) => {
    sound.shutter();
    const at = visitAt(visit, { dialYear: dial.year, thisYear: today.year });
    const label = at === 'today' ? formatDate(today) : at === 'then' ? square.dateLabel : `${formatYear(dial.year)}년`;
    keepCards(takeCard(cards, square.id, { image, at: at === 'today' ? 'today' : 'then', label }, dayToday()));
    bubble = { text: '찍었다! 엽서는 수첩에 넣었어.', until: visit.t + SORA_FOR_MS };
  },
});

$('cardChip').addEventListener('click', () => { if (mode === 'ground') card.open(square, false); });
$('quizChip').addEventListener('click', () => { if (mode === 'ground') card.open(square, true); });

const pad = (n) => String(n).padStart(2, '0');
// The game is held while the settings are open (see frame()).
const settings = createSettings({
  onOpen: () => {},
  onClose: () => {},
  today: () => { const now = todayDate(); return `${now.year}-${pad(now.month)}-${pad(now.day)}`; },
  sound: soundSwitch,
  music: musicSwitch,
  onReplay: () => opening.open(),
  // Emptied while standing on a square: that visit starts afresh too, or its dots would
  // be written straight back into the empty notebook.
  onReset: () => {
    keep(emptyProgress());
    keepCards({});
    if (visit) { visit = createVisit(square); remainsAtMs = null; bubble = null; }
  },
  version: `v${__APP_VERSION__} · ${__APP_UPDATED__}`,
});

const globe = createGlobe($('globe'), $('pins'), { squares: SQUARES, onPick: (id) => pick(squareById(id)) });

function layout() {
  skyCanvas.resize();
  dialView.resize();
  globe.resize();
}
// The stage, not the window: a phone's bars and a turned screen change it without a window resize.
new ResizeObserver(layout).observe(stage);

function showGround(sq) {
  square = sq;
  visit = createVisit(sq, dotsOf(progress, sq.id));
  resetLook(look); blend = 0; roll = null; silhouette = 0; restingOtherMs = 0; dim = 0;
  bubble = null; remainsAtMs = null; glowSky = 0; glowToday = 0; noteDueAtMs = null;
  ground.show(sq);
  mark([{ year: sq.date.year, label: '그날' }, { year: today.year, label: '오늘' }]);
  globe.setActive(false);
  stage.className = 'on-ground';
  mode = 'ground';
  sound.paper();
  setTimeout(() => sound.paper(), 200);
  setTimeout(() => sound.paper(), 400);
}

async function travel(sq) {
  if (mode !== 'globe' && mode !== 'ground') return;
  if (mode === 'ground' && square === sq) return;
  sound.wake();
  if (mode === 'ground') {
    // From one square to another through the notebook: straight across, behind a fade.
    mode = 'travel';
    $('fade').classList.add('on');
    await wait(FADE_MS);
    globe.faceNow(sq.lat, sq.lon);
    rollTo(dial, sq.date.year, 0.001);
    while (dial.rolling) await wait(30);
    showGround(sq);
    $('fade').classList.remove('on');
    return;
  }
  mode = 'travel';
  await globe.spinTo(sq.lat, sq.lon, TRAVEL_SPIN_S);
  if (dial.year !== sq.date.year) {
    rollTo(dial, sq.date.year, TRAVEL_ROLL_S);
    // By the frames, not the clock: on a slow phone the roll takes longer than its second.
    while (dial.rolling) await wait(30);
  }
  $('fade').classList.add('on');
  await wait(FADE_MS);
  showGround(sq);
  $('fade').classList.remove('on');
}

// Flying (core/flight.js). A square she has not been to is not gone to at a touch: it
// shines, an arrow shows the way, and she flies there (the globe dragged under her) and
// comes down by the button. A square she has been to is gone to straight away (settled
// 2026.10.7: "한 번 가본 곳은 쉽게 갈 수 있게 해").
const LAND_S = 1.2;
let target = null;          // the square she is flying to, or null
let landing = false;
let flyWay = null;          // the sheet of the way she last flew
let flyUntil = 0;           // she keeps that pose until then (ms on performance.now)

function aim(sq) {
  target = sq;
  globe.setTarget(sq.id);
  sound.wake();
  if (dial.year !== sq.date.year && !dial.rolling) rollTo(dial, sq.date.year, TRAVEL_ROLL_S);
}

function pick(sq) {
  if (mode !== 'globe' && mode !== 'ground') return;
  if (dotsOf(progress, sq.id).day) { target = null; globe.setTarget(null); travel(sq); return; }
  if (mode === 'ground') { if (square !== sq) leave().then(() => aim(sq)); return; }
  if (globe.under() === sq.id) land(sq);
  else aim(sq);
}

// Comes down onto the square under her: the Earth comes close, then the ground.
async function land(sq) {
  if (mode !== 'globe') return;
  sound.wake();
  mode = 'travel';
  landing = true;
  const zoomWas = globe.zoom();
  if (dial.year !== sq.date.year) rollTo(dial, sq.date.year, TRAVEL_ROLL_S);
  await globe.spinTo(sq.lat, sq.lon, LAND_S, ZOOM_MAX);
  while (dial.rolling) await wait(30);
  $('fade').classList.add('on');
  await wait(FADE_MS);
  target = null;
  globe.setTarget(null);
  landing = false;
  showGround(sq);
  globe.setZoom(zoomWas);
  showZoom(zoomWas);
  $('fade').classList.remove('on');
}
$('landButton').addEventListener('click', () => { const id = globe.under(); if (id) land(squareById(id)); });

async function leave() {
  if (mode !== 'ground') return;
  if (photo.isOn()) photo.leave();
  mode = 'leaving';
  leavingMs = 0;
  await wait(LEAVE_MS);
  $('fade').classList.add('on');
  await wait(FADE_MS);
  globe.setActive(true);
  stage.className = 'on-globe';
  mode = 'globe';
  visit = null;
  mark(globeMarks());
  $('fade').classList.remove('on');
}

hud.leaveBtn.addEventListener('click', leave);
// Rolls the dial to a year by itself. On the ground the picture melts along the way.
function goTo(year) {
  if (dial.rolling || year === dial.year || (mode !== 'ground' && mode !== 'globe')) return;
  sound.wake();
  if (mode === 'ground') roll = { from: blend, to: year === today.year ? 1 : year === square.date.year ? 0 : blend };
  rollTo(dial, year, mode === 'ground' && year === today.year ? TO_TODAY_S : TO_THEN_S);
}
hud.todayBtn.addEventListener('click', () => {
  if (mode === 'ground') goTo(dial.year !== today.year ? today.year : square.date.year);
});

createTouch(stage, {
  mode: () => mode,
  onDialGrab: () => { sound.wake(); roll = null; grab(dial); },
  onDialDrag: (dx) => drag(dial, dx),
  onDialRelease: (v) => release(dial, v),
  onDialTap: (side) => { const year = nextMark(dial, side); if (year !== null) goTo(year); },
  // Pushing the finger up raises the head; it stays where it was left, up or down.
  onLookDrag: (dyShare) => { if (photo.isOn()) photo.drag(dyShare); else dragLook(look, dyShare); },
  onLookEnd: () => { if (!photo.isOn()) endLook(look); },
  onGlobeDrag: (dx, dy) => globe.drag(dx, dy),
  onGlobeEnd: () => globe.release(),
  onGlobeZoom: (factor) => showZoom(globe.zoomBy(factor)),
});

// Closer and farther: two fingers, the wheel, or the two buttons at the right.
function showZoom(zoom) {
  $('zoomIn').disabled = zoom >= ZOOM_MAX;
  $('zoomOut').disabled = zoom <= ZOOM_MIN;
}
$('zoomIn').addEventListener('click', () => showZoom(globe.zoomBy(ZOOM_STEP)));
$('zoomOut').addEventListener('click', () => showZoom(globe.zoomBy(1 / ZOOM_STEP)));
stage.addEventListener('wheel', (e) => {
  if (mode !== 'globe' || e.target.closest('dialog')) return;
  e.preventDefault();
  showZoom(globe.zoomBy(e.deltaY < 0 ? 1.15 : 1 / 1.15));
}, { passive: false });
showZoom(1);

function tickSounds(years) {
  if (years.length === 0) return;
  dialView.tick();
  if (years.length > 2) sound.tick(false, true);
  else for (const year of years) sound.tick(isDecade(year), false);
}

function dateOnGlobe() {
  return { dateText: `${formatYear(dial.year)}년`, placeText: '지구 위', subText: '' };
}

function frameGround(dt) {
  const input = { dialYear: dial.year, dialResting: dial.resting, thisYear: today.year, lookTarget: look.target };
  const filled = stepVisit(visit, dt, input);
  const at = visitAt(visit, input);
  for (const name of filled) {
    keep(fillDot(progress, square.id, name));
    if (name === 'day') sound.stamp();
    if (name === 'sky') { sound.bell(); if (square.soraSky) bubble = { text: square.soraSky, until: visit.t + SORA_FOR_MS + 600, lookingUp: true }; }
    if (name === 'remains') { sound.page(); remainsAtMs = visit.t; }
    if (isComplete(progress, square.id) && dueNote((id) => isComplete(progress, id), notesRead(progress))) noteDueAtMs = visit.t + NOTE_AFTER_MS;
  }

  // The picture. Over a timed roll it melts across the middle of the roll; by hand it
  // follows where the dial comes to rest.
  if (dial.rolling && roll && dial.roll) {
    const share = dial.roll.elapsed / dial.roll.total;
    blend = roll.from + (roll.to - roll.from) * smoothstep(0.2, 0.8, share);
  } else {
    if (roll && !dial.rolling) { blend = roll.to; roll = null; }
    const target = at === 'today' ? 1 : at === 'then' ? 0 : blend;
    blend += Math.max(-dt / 600, Math.min(dt / 600, target - blend));
  }
  restingOtherMs = at === 'other' && dial.resting ? restingOtherMs + dt : 0;
  const wantSilhouette = restingOtherMs > NO_PICTURE_AFTER_MS ? 1 : 0;
  silhouette += Math.max(-dt / 200, Math.min(dt / NO_PICTURE_FADE_MS, wantSilhouette - silhouette));
  dim = dial.rolling ? 1 : Math.max(0, dim - dt / DIM_BACK_MS);

  let rise = clamp01(visit.t / RISE_MS);
  if (mode === 'leaving') { leavingMs += dt; rise = 1 - clamp01(leavingMs / LEAVE_MS); }

  const sky = skyAt(momentJd(square, { year: dial.year, night: visit.night }, today), square);
  const light = skyLight(sky.sun.alt);
  skyCanvas.draw(sky, {
    facingAz: square.facingAz, pitch: visit.look, dim, labels: clamp01((visit.lookHeld - LABELS_AFTER_MS) / 300),
  });
  const stageBox = { w: stage.clientWidth, h: stage.clientHeight };
  const level = project(0, square.facingAz, { facingAz: square.facingAz, pitch: 0, ...stageBox }).y;
  const raised = project(0, square.facingAz, { facingAz: square.facingAz, pitch: visit.look, ...stageBox }).y;
  ground.set({ rise, blend, silhouette, dropPx: raised - level, day: light.day });

  // A note that is due falls once the words about the last dot have been said.
  if (noteDueAtMs !== null && visit.t >= noteDueAtMs && mode === 'ground' && !dial.rolling) {
    noteDueAtMs = null;
    const note = dueNote((id) => isComplete(progress, id), notesRead(progress));
    if (note && note.square === square.id) { sound.page(); readNote(note); }
  }

  // Words.
  if (visit.t >= SORA_FROM_MS && visit.t - dt < SORA_FROM_MS && at === 'then') bubble = { text: square.sora, until: visit.t + SORA_FOR_MS };
  if (remainsAtMs !== null && visit.t >= remainsAtMs + 1200 && visit.t - dt < remainsAtMs + 1200) bubble = { text: square.soraToday, until: visit.t + SORA_FOR_MS };
  if (bubble && visit.t > bubble.until) bubble = null;
  if (!visit.dots.sky && visit.t >= HINT_SKY_AT_MS && visit.t - dt < HINT_SKY_AT_MS) glowSky += 1;
  if (!visit.dots.remains && visit.t >= HINT_TODAY_AT_MS && visit.t - dt < HINT_TODAY_AT_MS) glowToday += 1;

  const pose = soraPose({ now: performance.now(), hushAt });
  let memo = null;
  // The slip is put away while she looks up: the sky is what there is to see, and the
  // slip would lie over the low moon.
  // Looking up on the day itself, the slip carries what she wrote of that sky instead.
  const memoSky = mode === 'ground' && visit.look >= 0.5 && at === 'then';
  if (memoSky) memo = skyMemoOf(square);
  else if (visit.t >= MEMO_AT_MS && mode === 'ground' && visit.look < 0.5) {
    if (silhouette > 0.5) memo = '이 해는 적어 둔 게 없구나';
    else if (at === 'today' && visit.dots.remains && visit.t >= remainsAtMs + 200) memo = square.memoToday;
    else memo = square.memo;
  }
  const dateText = at === 'then' ? square.dateLabel : at === 'today' ? formatDate(today) : `${formatYear(dial.year)}년`;
  hud.set({
    name: squareTitle(square), dateText, placeText: square.place,
    // While she looks up it says whose sky this is: computed for that day and that place.
    subText: visit.look >= 0.5
      ? (at === 'today' ? '오늘 이 자리의 하늘' : visit.night > 0.5 ? '그날 밤 9시, 이 자리의 하늘' : at === 'then' ? '그날 이 자리의 하늘' : '그해 이 자리의 하늘')
      : visit.night > 0.5 ? '그날 밤 9시' : '',
    dots: visit.dots, memo, memoPlain: memo === square.memoToday, memoSky,
    chips: mode === 'ground' && visit.t >= CHIPS_AT_MS && visit.look < 0.5,
    bubble: pose.saying ?? (bubble && (bubble.lookingUp || visit.look < 0.5) ? bubble.text : null), sora: pose,
    todayLabel: at === 'today' ? '그날로' : '오늘로', showToday: true, showLeave: true,
    hint: mode === 'ground' && visit.t >= GUIDE_AT_MS && dial.resting && !(bubble && visit.look < 0.5)
      ? guideLine({ where: 'ground', dots: visit.dots, at, lookingUp: visit.look > 0.5, quizSolved: quizSolved(progress, square.id), hasCard: Boolean(cards[square.id]) })
      : null,
    soraFade: pose.saying || (bubble && bubble.lookingUp) ? 0 : clamp01(visit.look * 1.6), glowSky, glowToday,
  });
}

const squareIds = SQUARES.map((sq) => sq.id);
function globeCount() {
  const count = countProgress(progress, squareIds);
  return { complete: count.complete, visited: count.day, total: count.total };
}

function frameGlobe(dt) {
  globe.render(dt);
  const now = performance.now();
  const moved = globe.motion();
  const way = mode === 'globe' ? flyPose(moved.dx, moved.dy) : null;
  if (way) { flyWay = way; flyUntil = now + 240; }
  const pose = soraPose({ now, hushAt, flying: now < flyUntil ? flyWay : null, landing });
  const overId = mode === 'globe' ? globe.under() : null;
  $('landButton').classList.toggle('on', Boolean(overId));
  // The button names the square, so that it is plain where she would come down.
  if (overId && $('landButton').dataset.id !== overId) {
    $('landButton').dataset.id = overId;
    $('landButton').textContent = `${squareById(overId).name}에 내려앉기`;
  }
  const arrow = target && mode === 'globe' ? globe.pointer() : null;
  $('flyArrow').classList.toggle('on', Boolean(arrow) && !arrow.near);
  if (arrow) $('flyArrow').style.setProperty('--turn', `${arrow.turn.toFixed(1)}deg`);
  hud.set({
    name: '', ...dateOnGlobe(), dots: { day: false, sky: false, remains: false },
    memo: null, memoPlain: false, chips: false, bubble: pose.saying, sora: pose, todayLabel: '오늘로', showToday: false, showLeave: false,
    hint: mode === 'globe' && !pose.saying ? guideLine({ where: 'globe', ...globeCount(), target: Boolean(target), over: target ? overId === target.id : Boolean(overId) }) : null, soraFade: 0, glowSky: 0, glowToday: 0,
  });
}

let last = performance.now();
function frame(now) {
  const held = settings.isOpen() || journal.isOpen() || card.isOpen() || opening.isOpen();
  const dt = held ? 0 : Math.min(50, now - last);
  last = now;
  tickSounds(stepDial(dial, dt));
  if (visit && mode !== 'globe') frameGround(dt);
  else frameGlobe(dt);
  dialView.draw(dial, marks);
  music.step(visit ? 'surface' : 'near');
  requestAnimationFrame(frame);
}

// The test buttons, as in volume 1 (the user, 2026.10.7: "우주 한량처럼, 화면 위에 저 버튼
// 만들어줘. 이건 테스트 버전에서만 보이는거"). Only the maker sees them: on the dev server,
// not on the public site or in the store app. The settings (sound, music, text size,
// screen shape) stay as they are.
$('testBar').hidden = !isLocalHost(location.hostname);
$('testReset').addEventListener('click', () => {
  saveProgress(emptyProgress());
  saveCards({});
  forgetOpened();
  location.reload();
});
// And its opposite, for testing what comes after: every square done, every note read.
$('testAll').addEventListener('click', () => {
  keepProgressAside();
  saveProgress(fullProgress(SQUARES.map((sq) => sq.id), NOTES.map((note) => note.id)));
  saveOpened();
  location.reload();
});

// Stills for screenshots: #shot=globe, or #shot=<id>,<then|sky|today>. #go=<id> starts
// on that square.
function still() {
  const shot = location.hash.match(/^#shot=(\w+)(?:,(then|sky|today))?$/);
  const go = location.hash.match(/^#go=(\w+)$/);
  if (go && squareById(go[1])) {
    const sq = squareById(go[1]);
    globe.faceNow(sq.lat, sq.lon);
    rollTo(dial, sq.date.year, 0.001); stepDial(dial, 10);
    showGround(sq);
    return;
  }
  if (!shot) return;
  if (shot[1] === 'globe') { globe.faceNow(41, 20); return; }
  const sq = squareById(shot[1]);
  if (!sq) return;
  globe.faceNow(sq.lat, sq.lon);
  rollTo(dial, shot[2] === 'today' ? today.year : sq.date.year, 0.001); stepDial(dial, 10);
  showGround(sq);
  // Run the visit forward without waiting: arrive, and for 'sky' hold the head up.
  const input = { dialYear: sq.date.year, dialResting: true, thisYear: today.year, lookTarget: 0 };
  for (let t = 0; t < 1200; t += 20) stepVisit(visit, 20, input);
  if (shot[2] === 'sky') { dragLook(look, -1); endLook(look); for (let t = 0; t < 5000; t += 20) stepVisit(visit, 20, { ...input, lookTarget: 1 }); }
  if (shot[2] === 'today') { blend = 1; for (let t = 0; t < 200; t += 20) stepVisit(visit, 20, { ...input, dialYear: today.year }); }
}

stage.className = 'on-globe';
mark(globeMarks());
layout();
globe.faceNow(41, 20);
still();
// A first visit begins with the opening; a link straight to a square or a still does not.
if (!loadOpened() && !location.hash) opening.open();
requestAnimationFrame(frame);
// The first picture is on its way: the loading screen is put away.
document.getElementById('loading').hidden = true;
