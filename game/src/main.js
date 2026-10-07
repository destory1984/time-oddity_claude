// Wires core, render and ui together and runs the frame loop. The first slice: a globe
// with four pins, and on the ground of each square the year dial, the computed sky and
// the picture that changes from the day to today.
// Timings are from docs/상세-기획-2-칸-하나의-흐름.md section 3.
import './style.css';
import { SQUARES, squareById } from './core/squares.js';
import { momentJd } from './core/moment.js';
import { skyAt, skyLight } from './core/sky.js';
import { formatDate, formatYear, todayDate } from './core/when.js';
import { createDial, drag, grab, release, rollTo, stepDial } from './core/dial.js';
import { createVisit, stepVisit, visitAt } from './core/visit.js';
import { createSkyCanvas } from './render/skyCanvas.js';
import { createGround } from './render/ground.js';
import { createGlobe } from './render/globe.js';
import { createDialView } from './ui/dialView.js';
import { createHud } from './ui/hud.js';
import { createTouch } from './ui/touch.js';
import { createSound } from './ui/sound.js';

const RISE_MS = 800;
const MEMO_AT_MS = 1200;
const SORA_FROM_MS = 2500;
const SORA_FOR_MS = 4000;
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

let mode = 'globe';        // 'globe' | 'travel' | 'ground' | 'leaving'
let square = null;
let visit = null;
let lookTarget = 0;
let lookDrag = 0;
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
  visit = createVisit(sq);
  lookTarget = 0; blend = 0; roll = null; silhouette = 0; restingOtherMs = 0; dim = 0;
  bubble = null; remainsAtMs = null; glowSky = 0; glowToday = 0;
  ground.show(sq);
  globe.setActive(false);
  stage.className = 'on-ground';
  mode = 'ground';
  sound.paper();
  setTimeout(() => sound.paper(), 200);
  setTimeout(() => sound.paper(), 400);
}

async function travel(sq) {
  if (mode !== 'globe') return;
  sound.wake();
  mode = 'travel';
  await globe.spinTo(sq.lat, sq.lon, TRAVEL_SPIN_S);
  if (dial.year !== sq.date.year) {
    rollTo(dial, sq.date.year, TRAVEL_ROLL_S);
    await wait(TRAVEL_ROLL_S * 1000 + 50);
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
  $('fade').classList.remove('on');
}

hud.leaveBtn.addEventListener('click', leave);
hud.todayBtn.addEventListener('click', () => {
  if (mode !== 'ground' || dial.rolling) return;
  sound.wake();
  const toToday = dial.year !== today.year;
  roll = { from: blend, to: toToday ? 1 : 0 };
  rollTo(dial, toToday ? today.year : square.date.year, toToday ? TO_TODAY_S : TO_THEN_S);
});

createTouch(stage, {
  mode: () => mode,
  onDialGrab: () => { sound.wake(); roll = null; grab(dial); },
  onDialDrag: (dx) => drag(dial, dx),
  onDialRelease: (v) => release(dial, v),
  // Pushing the finger up raises the head; it stays where it was left, up or down.
  onLookDrag: (dyShare) => { lookDrag = clamp01(lookDrag - dyShare / 0.25); lookTarget = lookDrag; },
  onLookEnd: () => { lookTarget = lookDrag > 0.5 ? 1 : 0; lookDrag = lookTarget; },
  onGlobeDrag: (dx, dy) => globe.drag(dx, dy),
  onGlobeEnd: () => globe.release(),
});

function tickSounds(years) {
  if (years.length === 0) return;
  if (years.length > 2) sound.tick(false, true);
  else for (const year of years) sound.tick(year % 10 === 0, false);
}

function dateOnGlobe() {
  return { dateText: `${formatYear(dial.year)}년`, placeText: '지구 위', subText: '' };
}

function frameGround(dt) {
  const input = { dialYear: dial.year, dialResting: dial.resting, thisYear: today.year, lookTarget };
  const filled = stepVisit(visit, dt, input);
  const at = visitAt(visit, input);
  for (const name of filled) {
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
  ground.set({ rise, blend, silhouette, look: visit.look, day: light.day });

  // Words.
  if (visit.t >= SORA_FROM_MS && visit.t - dt < SORA_FROM_MS && at === 'then') bubble = { text: square.sora, until: visit.t + SORA_FOR_MS };
  if (remainsAtMs !== null && visit.t >= remainsAtMs + 1200 && visit.t - dt < remainsAtMs + 1200) bubble = { text: square.soraToday, until: visit.t + SORA_FOR_MS };
  if (bubble && visit.t > bubble.until) bubble = null;
  if (!visit.dots.sky && visit.t >= HINT_SKY_AT_MS && visit.t - dt < HINT_SKY_AT_MS) glowSky += 1;
  if (!visit.dots.remains && visit.t >= HINT_TODAY_AT_MS && visit.t - dt < HINT_TODAY_AT_MS) glowToday += 1;

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
    dots: visit.dots, memo, bubble: bubble && visit.look < 0.5 ? bubble.text : null,
    todayLabel: at === 'today' ? '그날로' : '오늘로', showToday: true, showLeave: true,
    hint: '', soraFade: clamp01(visit.look * 1.6), glowSky, glowToday,
  });
}

function frameGlobe(dt) {
  globe.render(dt);
  hud.set({
    name: '시간 한량 · 첫 토막', ...dateOnGlobe(), dots: { day: false, sky: false, remains: false },
    memo: null, bubble: null, todayLabel: '오늘로', showToday: false, showLeave: false,
    hint: mode === 'globe' ? '지구를 돌려 금색 점을 눌러 보렴' : '', soraFade: 0, glowSky: 0, glowToday: 0,
  });
}

let last = performance.now();
function frame(now) {
  const dt = Math.min(50, now - last);
  last = now;
  tickSounds(stepDial(dial, dt));
  if (visit && (mode === 'ground' || mode === 'leaving')) frameGround(dt);
  else frameGlobe(dt);
  dialView.draw(dial);
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
  if (shot[2] === 'sky') { lookTarget = 1; lookDrag = 1; for (let t = 0; t < 5000; t += 20) stepVisit(visit, 20, { ...input, lookTarget: 1 }); }
  if (shot[2] === 'today') { blend = 1; for (let t = 0; t < 200; t += 20) stepVisit(visit, 20, { ...input, dialYear: today.year }); }
}

stage.className = 'on-globe';
layout();
globe.faceNow(41, 20);
still();
requestAnimationFrame(frame);
