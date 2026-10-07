// Wires core, render and ui together and runs the frame loop. The first slice: a globe
// with four pins, and on the ground of each square the year dial, the computed sky and
// the picture that changes from the day to today.
// Timings are from docs/상세-기획-2-칸-하나의-흐름.md section 3.
import './style.css';
import { SQUARES, squareById } from './core/squares.js';
import { momentJd } from './core/moment.js';
import { skyAt, skyLight } from './core/sky.js';
import { formatDate, formatYear, todayDate } from './core/when.js';
import { createDial, drag, grab, isDecade, nextMark, release, rollTo, setMarks, stepDial } from './core/dial.js';
import { createLook, dragLook, endLook, resetLook } from './core/look.js';
import { soraPose } from './core/sora.js';
import { guideLine } from './core/guide.js';
import { countProgress, dotsOf, emptyProgress, fillDot, quizSolved, solveQuiz } from './core/progress.js';
import { project } from './core/project.js';
import { createVisit, stepVisit, visitAt } from './core/visit.js';
import { createSkyCanvas } from './render/skyCanvas.js';
import { createGround } from './render/ground.js';
import { createGlobe } from './render/globe.js';
import { createDialView } from './ui/dialView.js';
import { createHud } from './ui/hud.js';
import { createTouch } from './ui/touch.js';
import { createSound } from './ui/sound.js';
import { createSettings } from './ui/settings.js';
import { createMusic } from './ui/music.js';
import { createJournal } from './ui/journal.js';
import { createCard } from './ui/card.js';
import { loadMusic, loadMuted, loadProgress, saveMusic, saveMuted, saveProgress } from './ui/storage.js';

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
// ?dial=1..5 tries one of the glass looks of the dial (ui/dialView.js) until one is chosen.
const dialView = createDialView($('dial'), Number(new URLSearchParams(location.search).get('dial')) || 0);
const hud = createHud($('hud'));
const dial = createDial({ year: today.year, maxYear: today.year });

// The notebook: what has been filled, kept on this device.
let progress = loadProgress(SQUARES.map((sq) => sq.id));
function keep(next) {
  if (next === progress) return;
  progress = next;
  saveProgress(progress);
  journal.showCount();
}

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

// Background music: volume 1's eleven tunes, with a switch of its own.
const music = createMusic({ context: () => sound.context(), on: loadMusic() });
const musicSwitch = {
  on: () => music.on(),
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
  onGo: (id) => travel(squareById(id)),
  onSolve: (id) => { sound.stamp(); keep(solveQuiz(progress, id)); },
  here: () => (visit && mode === 'ground' ? square.id : null),
  canGo: () => mode === 'globe' || mode === 'ground',
});
const card = createCard({
  solved: (id) => quizSolved(progress, id),
  onSolve: (id) => { sound.stamp(); keep(solveQuiz(progress, id)); },
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
  // Emptied while standing on a square: that visit starts afresh too, or its dots would
  // be written straight back into the empty notebook.
  onReset: () => {
    keep(emptyProgress());
    if (visit) { visit = createVisit(square); remainsAtMs = null; bubble = null; }
  },
  version: `v${__APP_VERSION__} · ${__APP_UPDATED__}`,
});

const globe = createGlobe($('globe'), $('pins'), { squares: SQUARES, onPick: (id) => travel(squareById(id)) });

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
  bubble = null; remainsAtMs = null; glowSky = 0; glowToday = 0;
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

async function leave() {
  if (mode !== 'ground') return;
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
  onLookDrag: (dyShare) => dragLook(look, dyShare),
  onLookEnd: () => endLook(look),
  onGlobeDrag: (dx, dy) => globe.drag(dx, dy),
  onGlobeEnd: () => globe.release(),
});

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
    if (name === 'sky') sound.bell();
    if (name === 'remains') { sound.page(); remainsAtMs = visit.t; }
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

  // Words.
  if (visit.t >= SORA_FROM_MS && visit.t - dt < SORA_FROM_MS && at === 'then') bubble = { text: square.sora, until: visit.t + SORA_FOR_MS };
  if (remainsAtMs !== null && visit.t >= remainsAtMs + 1200 && visit.t - dt < remainsAtMs + 1200) bubble = { text: square.soraToday, until: visit.t + SORA_FOR_MS };
  if (bubble && visit.t > bubble.until) bubble = null;
  if (!visit.dots.sky && visit.t >= HINT_SKY_AT_MS && visit.t - dt < HINT_SKY_AT_MS) glowSky += 1;
  if (!visit.dots.remains && visit.t >= HINT_TODAY_AT_MS && visit.t - dt < HINT_TODAY_AT_MS) glowToday += 1;

  const pose = soraPose({ now: performance.now(), hushAt });
  let memo = null;
  if (visit.t >= MEMO_AT_MS && mode === 'ground') {
    if (silhouette > 0.5) memo = '이 해는 적어 둔 게 없구나';
    else if (at === 'today' && visit.dots.remains && visit.t >= remainsAtMs + 200) memo = square.memoToday;
    else memo = square.memo;
  }
  const dateText = at === 'then' ? square.dateLabel : at === 'today' ? formatDate(today) : `${formatYear(dial.year)}년`;
  hud.set({
    name: `${square.no} ${square.name}`, dateText, placeText: square.place,
    subText: visit.night > 0.5 ? '그날 밤 9시' : '',
    dots: visit.dots, memo, memoPlain: memo === square.memoToday,
    chips: mode === 'ground' && visit.t >= CHIPS_AT_MS && visit.look < 0.5,
    bubble: pose.saying ?? (bubble && visit.look < 0.5 ? bubble.text : null), sora: pose,
    todayLabel: at === 'today' ? '그날로' : '오늘로', showToday: true, showLeave: true,
    hint: mode === 'ground' && visit.t >= GUIDE_AT_MS && dial.resting && !(bubble && visit.look < 0.5)
      ? guideLine({ where: 'ground', dots: visit.dots, at, lookingUp: visit.look > 0.5, quizSolved: quizSolved(progress, square.id) })
      : null,
    soraFade: pose.saying ? 0 : clamp01(visit.look * 1.6), glowSky, glowToday,
  });
}

const squareIds = SQUARES.map((sq) => sq.id);
function globeCount() {
  const count = countProgress(progress, squareIds);
  return { complete: count.complete, visited: count.day, total: count.total };
}

function frameGlobe(dt) {
  globe.render(dt);
  const pose = soraPose({ now: performance.now(), hushAt });
  hud.set({
    name: '시간 한량 · 첫 토막', ...dateOnGlobe(), dots: { day: false, sky: false, remains: false },
    memo: null, memoPlain: false, chips: false, bubble: pose.saying, sora: pose, todayLabel: '오늘로', showToday: false, showLeave: false,
    hint: mode === 'globe' && !pose.saying ? guideLine({ where: 'globe', ...globeCount() }) : null, soraFade: 0, glowSky: 0, glowToday: 0,
  });
}

let last = performance.now();
function frame(now) {
  const held = settings.isOpen() || journal.isOpen() || card.isOpen();
  const dt = held ? 0 : Math.min(50, now - last);
  last = now;
  tickSounds(stepDial(dial, dt));
  if (visit && mode !== 'globe') frameGround(dt);
  else frameGlobe(dt);
  dialView.draw(dial, marks);
  music.step(visit ? 'surface' : 'near');
  requestAnimationFrame(frame);
}

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
requestAnimationFrame(frame);
