// Wires core, render and ui together and runs the frame loop. The first slice: a globe
// with four pins, and on the ground of each square the year dial, the computed sky and
// the picture that changes from the day to today.
// Timings are from docs/상세-기획-2-칸-하나의-흐름.md section 3.
import './style.css';
import { SQUARES, skyMemoOf, squareById, squareTitle } from './core/squares.js';
import { leadDays, momentJd } from './core/moment.js';
import { skyAt, skyLight } from './core/sky.js';
import { formatDate, formatYear, todayDate } from './core/when.js';
import { createDial, drag, grab, isDecade, nextMark, release, rollTo, setMarks, stepDial } from './core/dial.js';
import { createLook, dragLook, endLook, resetLook } from './core/look.js';
import { soraPose } from './core/sora.js';
import { guideLine } from './core/guide.js';
import { countProgress, dotsOf, emptyProgress, fillDot, findSolved, fullProgress, isComplete, markBeen, markNoteRead, markTried, notesRead, quizSolved, solveFind, solveQuiz, triedOf, beenOf, errandsOf, metOf, markErrands, markMet, taleOf, markTale } from './core/progress.js';
import { findsOf } from './core/find.js';
import { createFindGame } from './ui/find.js';
import { project } from './core/project.js';
import { createVisit, stepVisit, visitAt } from './core/visit.js';
import { SITES } from './core/sites.js';
import { WALKS } from './core/walks.js';
import { REACH, VERBS, canHop, hop, allDone, createWalk, nearby, sceneOf, sendTo, speak, spotAt, stepWalk, triesOf, tryIt, withWhom, outfitsOf, offerOf, stepOf, peopleOf } from './core/walk.js';
import { advance, calledOf, endingOf, goalOf, holdsOf, isTold, present, stepOf as taleStep } from './core/tale.js';
import { createWalkView } from './ui/walk.js';
import { centuryOf, centuryStart, centuryStops } from './core/century.js';
import { createView, nearView, standAt, stepView, turnView } from './core/orbit.js';
import { createSite } from './render/site.js';
import { createFlyKeys } from './ui/flyKeys.js';
import { jdFromDate, utHour } from './core/when.js';
import { createSkyCanvas } from './render/skyCanvas.js';
import { createGround } from './render/ground.js';
import { createGlobe } from './render/globe.js';
import { createDialView } from './ui/dialView.js';
import { createHud } from './ui/hud.js';
import { createTouch } from './ui/touch.js';
import { ZOOM_MAX, ZOOM_MIN, ZOOM_STEP } from './core/zoom.js';
import { flyPose } from './core/flight.js';
import { isLocalHost } from './core/host.js';
import { WARP_CHORD_MS, createSound } from './ui/sound.js';
import { createSettings } from './ui/settings.js';
import { createMusic } from './ui/music.js';
import { createJournal } from './ui/journal.js';
import { createCard } from './ui/card.js';
import { createPhoto } from './ui/photo.js';
import { readReply, sendCard, takeCard } from './core/postcard.js';
import { createPager } from './ui/opening.js';
import { OPENING } from './core/opening.js';
import { NOTES, dueNote, noteById, notePages } from './core/notes.js';
import { keepProgressAside,
  loadCards, loadMusic, loadMuted, loadOpened, loadOutfit, saveOutfit, loadProgress, saveCards, saveMusic, saveMuted, saveOpened, saveProgress,
} from './ui/storage.js';

const RISE_MS = 800;
const MEMO_AT_MS = 1200;
const SORA_FROM_MS = 2500;
const SORA_FOR_MS = 6500;        // what she says stays this long (4 s was gone before it was read: the user, 2026.10.8)
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

let mode = 'globe';        // 'globe' | 'travel' | 'ground' | 'site' | 'walk' | 'leaving'

// Plan v4 (docs/기획서-v4-사는-때로.md): she goes to times when people live. The squares
// in play are the places that are walked about (core/walks.js) and the first leaf; the
// rest of the first plan's squares are switched off, not taken out. Above the Earth the
// dial turns by centuries, and only the centuries that have a place have a stop.
const LIVE = SQUARES.filter((sq) => WALKS[sq.id] || sq.no === 0);
const OUTFITS = outfitsOf(WALKS);
// The game is opened in her own clothes every time: what she had on when it was shut is
// not on her now (the user, 2026.10.8: "왜 옷을 자꾸 다르게 입혀?").
saveOutfit(null);
const PLACES = LIVE.map((sq) => sq.id);      // what grandmother's later notes count
const STOPS = centuryStops(LIVE);
// Where someone who has been nowhere yet begins: Rome, the oldest of the places, so that
// the notebook is gone through from the far end of time toward grandmother's own day (the
// user, 2026.10.8: "시작점을 로마로 바꿔"). Until then it was the yard of 1969.
// On the dev server the maker may begin somewhere else while a place is being tried (the
// user, walking San Francisco: "시작점도 여기로 수정"): localStorage `timeoddity.devStart`
// holds that place's id. The public game always begins in Rome.
function devStart() {
  if (!isLocalHost(location.hostname)) return null;
  try { const id = localStorage.getItem('timeoddity.devStart'); return id && WALKS[id] ? id : null; } catch { return null; }
}
const START = devStart() ?? 'colosseum';
const beenNowhere = () => LIVE.every((sq) => beenOf(progress, sq.id).length === 0);
// The dial stands at Rome's century every time the game is opened, not only the first
// (the user, again: "시작지점을 로마로 고쳐. 이건 지금").
const startStop = () => Math.max(0, STOPS.findIndex((stop) => stop.ids.includes(START)));
// Between two centuries there are ten empty ticks, so that the dial is felt to turn (the
// user, 2026.10.8: "돌리는 맛이 생기도록 각각 사이에 10칸씩 넣어줘"). It rests on a century only.
const ERA_GAP = 11;
const eraTick = (at) => 1 + at * ERA_GAP;                               // the tick of STOPS[at]
const eraAt = () => Math.max(0, Math.min(STOPS.length - 1, Math.round((eraDial.year - 1) / ERA_GAP)));   // the stop the dial is nearest
const eraDial = createDial({ year: eraTick(startStop()), minYear: 1, maxYear: eraTick(STOPS.length - 1), px: 12, onlyMarks: true });
setMarks(eraDial, STOPS.map((stop, at) => eraTick(at)));
eraDial.stops = STOPS.flatMap((stop, at) => (at === 0 ? [stop.label] : [...Array(ERA_GAP - 1).fill(null), stop.label]));
let onEra = true;          // above the Earth the century dial is up; once a place is chosen, the year dial
const overEarth = () => mode === 'globe' && onEra;
const GUIDE_ON = false;    // the one line of guidance is switched off in plan v4
const theDial = () => (overEarth() ? eraDial : dial);
const eraStop = () => STOPS[eraAt()];
let shownEra = null;           // the stop the Earth was last turned to show (none yet: it turns to the first at once)
const ERA_ASIDE_DEG = 24;      // a century's place comes into sight this far east of her
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
    pages: notePages(note), lastLabel: note.close ?? '쪽지를 접는다', skip: false,
    onDone: () => {
      keep(markNoteRead(progress, note.id));
      const last = note.says[note.says.length - 1];
      if (visit) bubble = { text: last, until: visit.t + SORA_FOR_MS };
      else if (walk) walkSora = { text: last, from: walkT, until: walkT + SORA_FOR_MS };
      // Another may be due at once (the last place done is also the fifth, or the last of all).
      if (walk && dueNote((id) => isComplete(progress, id), notesRead(progress), PLACES)) walkNoteAt = walkT + SORA_FOR_MS;
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
  squares: [...LIVE].sort((a, b) => a.date.year - b.date.year),
  progress: () => progress,
  tries: (id) => (WALKS[id] ? triesOf(WALKS[id]).map((it) => ({ verb: it.verb, name: it.name, done: triedOf(progress, id).includes(it.id) })) : []),
  errands: (id) => (WALKS[id] ? { done: WALKS[id].errands.filter((errand) => errandsOf(progress, id).includes(errand.id)).length, total: WALKS[id].errands.length } : null),
  onGo: (id) => pick(squareById(id)),
  onSolve: (id) => { sound.stamp(); keep(solveQuiz(progress, id)); },
  here: () => ((visit && mode === 'ground') || (walk && mode === 'walk') ? square.id : null),
  notes: () => notesRead(progress).map((id) => noteById(id)).filter(Boolean),
  onNote: (id) => readNote(noteById(id)),
  cards: () => cards,
  today: dayToday,
  onSend: (id) => { sound.page(); keepCards(sendCard(cards, id, dayToday())); },
  onReply: (id) => keepCards(readReply(cards, id, dayToday())),
  canGo: () => mode === 'globe' || mode === 'ground',
  // The wardrobe: what she has put on somewhere, and which of it she has on now.
  wardrobe: () => OUTFITS.filter((o) => LIVE.some((sq) => triedOf(progress, sq.id).includes(o.id))).map((o) => ({ ...o, on: loadOutfit() === o.outfit })),
  onWear: (outfit) => putOn(outfit),
});
// She puts on something from the wardrobe, or takes it off (null): at once if she is
// walking about, and until she leaves the place. Chosen above the Earth, it is on her at
// the next place she comes down to.
function putOn(outfit) {
  saveOutfit(outfit);
  if (!walk) return;
  walk.wearing = outfit;
  walk.trips = OUTFITS.find((o) => o.outfit === outfit)?.trips ?? 0;
}
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

// What has changed: on today's picture, the places that differ from the day's are touched.
let peekThen = false;      // the day's picture is shown while its button is held
const findGame = createFindGame({
  stage,
  pictureBox: () => ground.pictureBox(),
  onPeek: (on) => { peekThen = on; },
  onMode: (on) => { if (!on) peekThen = false; },
  onMiss: () => sound.tick(false, false),
  onFound: (all) => {
    if (!all) { sound.stamp(); return; }
    sound.bell();
    keep(solveFind(progress, square.id));
    bubble = { text: '다 찾았다! 이런 일이 있었구나.', until: visit.t + SORA_FOR_MS + 1800 };
  },
});
$('findChip').addEventListener('click', () => { if (mode === 'ground') { sound.wake(); findGame.enter(findsOf(square.id)); } });

$('cardChip').addEventListener('click', () => {
  if (mode !== 'ground' && mode !== 'site') return;
  card.open(square, false);
  // At a place the card is only read: its question is put away for now.
  $('cardQuiz').hidden = mode === 'site';
});
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
  onReset: () => startOver(),
  version: `v${__APP_VERSION__} · ${__APP_UPDATED__}`,
});

const globe = createGlobe($('globe'), $('pins'), { squares: LIVE, onPick: (id) => pick(squareById(id)) });

function layout() {
  skyCanvas.resize();
  if (siteView) siteView.resize();
  dialView.resize();
  globe.resize();
}
// The stage, not the window: a phone's bars and a turned screen change it without a window resize.
new ResizeObserver(layout).observe(stage);

// A square that is a place in three dimensions (core/sites.js) is looked over from any
// side instead of looked at in a picture: no dots, no looking up. The eye goes round it
// or stands at a spot (core/orbit.js); it is not flown. The first of them is the Colosseum
// (docs/기획서-v2-열두-자리.md section 6).
let site = null;            // { t, view, def } while she is at such a place
let siteView = null;        // its scene, built the first time it is needed
const flyKeys = createFlyKeys({ active: () => mode === 'site', forwardButton: $('flyForward'), backButton: $('flyBack') });
// The buttons that say where she looks from: going round outside, or one of the spots.
function showViewPad() {
  const pad = $('viewPad');
  pad.replaceChildren();
  for (const { id, label } of [{ id: 'round', label: '밖에서' }, ...site.def.spots]) {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'glass'; button.textContent = label;
    button.classList.toggle('on', site.view.at === id);
    button.addEventListener('click', () => { standAt(site.view, id); site.moved = true; showViewPad(); });
    pad.append(button);
  }
  stage.classList.toggle('standing', site.view.at !== 'round');
}
function showSite(sq) {
  const def = SITES[sq.id];
  square = sq;
  visit = null;
  if (!siteView) siteView = createSite($('site'));
  site = { t: 0, def, view: createView({ round: def.round, spots: def.spots }), moved: false };
  // On the maker's machine the eye can be put anywhere from the console, to look the model over.
  if (isLocalHost(location.hostname)) window.siteDebug = site;
  flyKeys.clear();
  bubble = null;
  mark(def.marks.map((m) => ({ year: m.year === 'today' ? today.year : m.year, label: m.label })));
  globe.setActive(false);
  stage.className = 'on-ground on-site';
  mode = 'site';
  showViewPad();
  siteView.resize();
  // Having stood here once, she comes straight back another time.
  keep(fillDot(progress, sq.id, 'day'));
  $('flyHelp').textContent = matchMedia('(pointer: coarse)').matches
    ? '끌어서 돌려 본다 · 두 손가락을 벌려 가까이'
    : '끌어서 돌려 본다 · 휠이나 ＋ － 로 가까이, 멀리';
  sound.paper();
}
// Standing on a square: on its ground picture, or at the place itself where there is one.
const arrive = (sq) => (WALKS[sq.id] ? showWalk(sq) : SITES[sq.id] ? showSite(sq) : showGround(sq));

// A place where people live, walked about (core/walk.js, ui/walk.js): scenes joined end
// to end, people who say a line, three errands from grandmother.
let walk = null;
let walkT = 0;
let walkWay = 0;            // the way a finger or a button holds her going: -1, 0, 1
let keyWay = 0;             // the same, by the keys
let walkWant = null;        // the person she was sent to speak to
let walkSora = null;        // { text, until }: what she says, while it shows
let replyUntil = 0;         // grandmother's answer shows until then
let errandsFoldAt = 0;      // the slip of errands folds itself then
let walkArrive = false;     // she is to be set down in a shaft of light on the next frame
let walkNoteAt = 0;         // a note of grandmother's that is due falls then (after her answer has been read)
let walkFace = null;        // { poses: [[picture of hers, until], ...] }: how she takes what she has just tried, one after another
let walkHemMs = 0;          // how long she has walked in what she put on since she last trod on its hem
let walkHeld = null;        // { show, until }: what was shown her, kept up while she tries it
let walkHopping = false;    // she is on her way to the scene beside this one in a ring of gold
const HOP_MS = 420;
let walkMemo = null;        // { text, until }: what grandmother wrote of what she has just tried
let walkStepMs = 0;         // how long she has walked since her last footfall
let walkSteps = 0;
const FOOTFALL_MS = 300;    // two frames of her walking (ui/walk.js STEP_MS)
const walkView = createWalkView({
  onPerson: (id) => {
    if (!walk) return;
    if (panelOpen()) return;
    const person = peopleOf(walk).find((p) => p.id === id);
    if (!person) return;
    if (Math.abs(person.x - walk.x) <= REACH) { if (person.lines) talk(id); else tryNear(id); return; }
    // Touched from afar: she goes to stand beside them, then speaks.
    sendTo(walk, person.x + (walk.x < person.x ? -1 : 1) * REACH * 0.6);
    walkWant = id;
  },
  onWay: (way) => { walkWay = panelOpen() ? 0 : way; if (way !== 0) walkWant = null; },
  onLook: (look) => openLook(look),
});
// A thing of the scene looked at closely: a photograph of it as it is today and what is
// known of it, on a sheet of its own. The game waits while it is open.
function openLook(look) {
  if (!walk) return;
  sound.wake(); sound.page();
  walkWay = 0; keyWay = 0; walkWant = null;
  $('lookPhoto').src = `./walks/${walk.place.dir}/${look.photo}`;
  $('lookPhoto').alt = look.name;
  $('lookName').textContent = look.name;
  $('lookWhen').textContent = look.when;
  $('lookText').replaceChildren(...look.text.map((line) => { const li = document.createElement('li'); li.textContent = line; return li; }));
  $('lookCredit').textContent = look.credit;
  $('lookSheet').showModal();
}
$('closeLook').addEventListener('click', () => $('lookSheet').close());
$('lookSheet').addEventListener('click', (e) => { if (e.target === $('lookSheet')) $('lookSheet').close(); });
function showErrands() {
  const list = $('errands');
  list.replaceChildren();
  const head = document.createElement('b');
  const left = walk.place.errands.length - walk.done.length;
  // Where the place has a story the slip is headed by what grandmother never found out, and
  // shows the steps as they come: what is done, what is to be done now, and no further.
  const story = walk.place.story;
  // A tale (core/tale.js): the question, what is to be done now, what is in whose hands,
  // and once it is told what she did, in order.
  if (walk.tale) {
    const told = walk.place.tale;
    head.textContent = `할머니의 물음 · ${told.ask}`;
    list.append(head);
    const row = (text, cls) => { const li = document.createElement('li'); li.textContent = text; if (cls) li.className = cls; list.append(li); };
    row(goalOf(told, walk.tale));
    if (holdsOf(told, walk.tale)) row(holdsOf(told, walk.tale), 'has');
    return;
  }
  if (story) head.textContent = `할머니의 물음 · ${story.ask}`;
  else head.textContent = left > 0 ? `할머니의 심부름 · ${left}개 남음` : '할머니의 심부름 · 다 했다';
  list.append(head);
  const now = stepOf(walk);
  for (const errand of walk.place.errands) {
    if (story && !walk.done.includes(errand.id) && errand !== now) continue;
    const row = document.createElement('li');
    row.textContent = errand.text;
    row.classList.toggle('done', walk.done.includes(errand.id));
    list.append(row);
  }
}
// The end of a place's story is hers to choose (`story.choice`): two buttons at the foot of
// the screen. What she chose is kept with what she has tried there (`chose-<id>`), and
// grandmother's answer is the one written for it.
// ---- A tale of a thing carried (core/tale.js; Tokyo) ----
// What is asked of her is put in the box at the foot of the screen: a line, perhaps a note
// under it, and two things to press. While it is up she stands still.
let panel = null;                    // what the box holds now, or null: { ask, note, options, back }
const panelOpen = () => panel !== null;
function openPanel(spec) {
  panel = spec;
  walkWay = 0; keyWay = 0; walkWant = null;
  const box = $('walkChoice');
  box.replaceChildren();
  box.hidden = false;
  const ask = document.createElement('span');
  ask.textContent = spec.ask;
  box.append(ask);
  if (spec.note) { const note = document.createElement('p'); note.textContent = spec.note; box.append(note); }
  let busy = false;
  for (const option of spec.options) {
    const button = document.createElement('button');
    button.type = 'button'; button.className = option.quiet ? 'glass quiet' : 'glass';
    button.textContent = option.label;
    if (option.sub) { const sub = document.createElement('small'); sub.textContent = option.sub; button.append(sub); }
    // One press does one thing: a second press, a key held down, the click a touch leaves
    // behind it do nothing more.
    button.addEventListener('click', (e) => { if (busy || e.detail > 1) return; busy = true; sound.wake(); sound.tick(true, false); option.pick(); });
    box.append(button);
  }
  box.querySelector('button')?.focus({ preventScroll: true });
}
function closePanel() {
  if (!panel) return;
  panel = null;
  $('walkChoice').hidden = true;
  $('walkChoice').replaceChildren();
}
// A step of the tale is taken: kept first, then shown.
function saveTale(next) {
  if (!walk || next === walk.tale) return false;
  walk.tale = next;
  keep(markTale(progress, square.id, next));
  showErrands();
  $('errands').classList.remove('folded');
  errandsFoldAt = walkT + 6000;
  return true;
}
function taleMark(id) {
  if (walk.done.includes(id)) return;
  walk.done.push(id);
  keep(markErrands(progress, square.id, walk.done));
}
// A step is done: it is kept, its mark is made in the notebook, and what follows is said
// one line after another, each long enough to read: what she says on handing the thing
// over and what she is answered (a choice), what those about say next (`after`), and last
// what she makes of it, which names where to go next. With the last step the slip is
// stamped and grandmother answers.
const AFTER_MS = 3200;
function stepDone(step, chosen = null) {
  const told = walk.place.tale;
  const was = walk;
  if (!saveTale(advance(told, walk.tale, chosen))) return false;
  closePanel();
  if (step.errand) taleMark(step.errand);
  const over = isTold(told, walk.tale);
  if (!over) sound.stamp();
  const ending = step.choice ? endingOf(told, walk.tale) : null;
  if (ending) { walkSora = { text: ending.sora, from: walkT + 100, until: walkT + 100 + AFTER_MS }; walk.heard = null; }
  const lines = [...(ending ? [{ who: step.who, line: ending.says }] : []), ...(step.after ?? [])];
  lines.forEach(({ who, line }, n) => setTimeout(() => { if (walk === was && !walk.moving) walk.heard = { id: who, line, of: who, plain: true }; }, AFTER_MS * (n + 1)));
  const last = () => {
    if (walk !== was) return;
    if (step.sora) walkSora = { text: step.sora, from: walkT + 300, until: walkT + 300 + SORA_FOR_MS };
    if (over) { for (const errand of walk.place.errands) taleMark(errand.id); errandsDone(); }
  };
  if (lines.length > 0) setTimeout(last, AFTER_MS * (lines.length + 1));
  else if (ending) setTimeout(last, AFTER_MS);
  else last();
  return true;
}
// She has heard the last line of the step she is on from the one it names.
function taleSpoke(person) {
  const step = taleStep(walk.place.tale, walk.tale);
  if (!step || step.who !== person.id) return;
  if (step.offer) {
    // (One thing to press: the tale goes one way and there is nothing to put off. The user,
    // 2026.10.9, of a second button that said "나중에": "어차피 시나리오는 하나야".)
    openPanel({ ask: step.offer.ask, back: closePanel, options: [
      { label: step.offer.label, pick: () => {
        if (!stepDone(step)) return;
        // What they say on being taken up follows at once: it is where she is sent next.
        walk.heard = null;
        speak(walk, person.id);
      } },
    ] });
  } else if (step.choice) {
    openPanel({ ask: step.choice.ask, back: closePanel, options: step.choice.options.map((option) => ({ label: option.label, pick: () => stepDone(step, option.id) })) });
  } else stepDone(step);
}

const chosenOf = () => walk?.place.story?.choice?.options.find((o) => walk.tried.includes(`chose-${o.id}`)) ?? null;
const replyOf = () => chosenOf()?.reply ?? walk.place.reply;
let choosing = false;
function showChoice(on) {
  choosing = on;
  const box = $('walkChoice');
  box.replaceChildren();
  box.hidden = !on;
  if (!on) return;
  const { choice } = walk.place.story;
  const ask = document.createElement('span');
  ask.textContent = choice.ask;
  box.append(ask);
  for (const option of choice.options) {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'glass'; button.textContent = option.label;
    button.addEventListener('click', () => choose(option));
    box.append(button);
  }
}
function choose(option) {
  if (!walk || !choosing) return;
  showChoice(false);
  sound.wake(); sound.tick(true, false);
  walk.tried.push(`chose-${option.id}`);
  keep(markTried(progress, square.id, `chose-${option.id}`));
  walkSora = { text: option.sora, from: walkT + 200, until: walkT + 200 + SORA_FOR_MS };
  setTimeout(() => { if (walk) { sound.bell(); replyUntil = walkT + 12000; walkNoteAt = walkT + NOTE_AFTER_MS; } }, 2600);
}
// The slip is read on arriving, then folds to its heading; a touch opens and folds it.
$('errands').addEventListener('click', () => $('errands').classList.toggle('folded'));
const ERRANDS_OPEN_MS = 7000;
function errandsDone() {
  keep(markErrands(progress, square.id, walk.done));
  showErrands();
  $('errands').classList.remove('folded');
  errandsFoldAt = walkT + 3500;
  sound.stamp();
  // What she says as a step of the story is done.
  const said = walk.place.errands.find((errand) => errand.id === walk.done.at(-1))?.sora;
  if (said) walkSora = { text: said, from: walkT + 900, until: walkT + 900 + SORA_FOR_MS };
  if (!allDone(walk)) return;
  // All three: the square is filled and grandmother writes back.
  for (const dot of ['sky', 'remains']) keep(fillDot(progress, square.id, dot));
  // The slip is stamped, gold flies up round her and she is glad (the user, 2026.10.8, of the
  // slip that only said so: "다 했으면, 뭔가 효과를..").
  errandsFoldAt = walkT + 9000;
  $('errands').classList.add('alldone');
  walkView.cheer();
  walkFace = { poses: [['see-wow', walkT + 3200]] };
  // A story ends with her choice, and grandmother answers that; elsewhere she answers at once.
  if (walk.place.story?.choice && !chosenOf()) { setTimeout(() => { if (walk && allDone(walk) && !chosenOf()) showChoice(true); }, said ? 900 + SORA_FOR_MS - 2500 : 1500); return; }
  setTimeout(() => { if (walk) { sound.bell(); replyUntil = walkT + 10000; walkNoteAt = walkT + NOTE_AFTER_MS; } }, 1200);
}
function talk(id = null) {
  if (!walk) return;
  if (panelOpen()) return;
  const whom = id ?? withWhom(walk)?.id ?? null;
  const said = speak(walk, whom);
  if (!said) return;
  sound.wake();
  sound.tick(true, false);
  if (said.over) return;
  if (said.person.sound) sound[said.person.sound]();
  keep(markMet(progress, square.id, said.person.id));
  // What is said for the tale is the tale's: nothing is held up and she makes nothing of it.
  if (said.role) { if (said.role === 'step' && said.last) taleSpoke(said.person); return; }
  // What she makes of a thing they show her, in word and face, the first time she sees it
  // only: startled twice at one thing, and the second time without a word, she looked odd
  // (the user, 2026.10.8).
  const saw = `saw-${said.person.id}`;
  if ((said.person.pose || said.person.sora) && !walk.told.includes(saw)) {
    walk.told.push(saw);
    if (said.person.pose) walkFace = { poses: [[said.person.pose, walkT + 900 + SORA_FOR_MS]] };
    // Where they speak in a panel her words go into it, under the thing shown, and stay as
    // long as it does: over her head they lay across the panel and were gone too soon to
    // read (the user, 2026.10.8).
    if (said.person.sora && walk.place.talk === 'face') walk.remark = { id: said.person.id, text: said.person.sora };
    else if (said.person.sora) walkSora = { text: said.person.sora, from: walkT + 900, until: walkT + 900 + SORA_FOR_MS };
  }
  if (said.errands.length > 0) errandsDone();
}
// Eating, wearing or using what whoever is near has (plan v5, section 4): she says what
// she makes of it, with a face if it was eaten, and grandmother's slip tells what it is.
const FACE_FOR_MS = 2600;
const SHOW_USE_MS = 4000;     // a thing she uses is held up this long
const TRY_MEMO_MS = 9000;
const BITE_MS = 420;         // each of the two pictures of her eating
const HEM_EVERY_MS = 5200;   // walking in a toga she treads on its hem this often,
const HEM_FIRST_MS = 1300;   // the first time this soon,
const HEM_FRAME_MS = 240;    // and each picture of it lasts this long
function tryNear(id = null) {
  if (!walk) return;
  const did = tryIt(walk, id ?? withWhom(walk)?.id ?? null);
  if (!did) return;
  const { it } = did;
  walkWay = 0; walkWant = null;
  sound.wake();
  sound.tick(true, false);
  walkView.nudge(did.person.id);
  // What is eaten is first held up and put in her mouth; then her face says how it was.
  const bite = it.verb === 'eat' && !walk.wearing ? BITE_MS : 0;
  const pose = it.face ? `taste-${it.face}` : it.pose ?? null;
  walkFace = pose ? { poses: [...(bite ? [['bite-1', walkT + bite], ['bite-2', walkT + bite * 2]] : []), [pose, walkT + (walk.wearing ? 300 + SORA_FOR_MS : bite * 2 + FACE_FOR_MS)]] } : null;   // in an outfit the small face by her head stays as long as her words
  walkSora = { text: it.sora, from: walkT + 300 + bite * 2, until: walkT + 300 + bite * 2 + SORA_FOR_MS };
  if (it.face) setTimeout(() => { if (walk) walkView.taste(it.face); }, bite * 2 + 120);
  // What they showed her stays up while she tries it.
  // (A thing that is used, not eaten, has no face of hers to wait for: it stays a little
  // longer, and then gives way to grandmother's slip, which lies under it.)
  walkHeld = did.person.show ? { show: did.person.show, until: walkT + (it.verb === 'eat' ? bite * 2 + FACE_FOR_MS : SHOW_USE_MS) } : null;
  if (it.verb === 'wear') { walkHemMs = HEM_EVERY_MS - HEM_FIRST_MS; saveOutfit(it.outfit ?? null); }
  walkMemo = it.memo ? { text: it.memo, until: walkT + TRY_MEMO_MS } : null;
  if (did.first) keep(markTried(progress, square.id, it.id));
  if (did.errands.length > 0) errandsDone();
}
function enterScene() {
  const scene = sceneOf(walk);
  walkView.showScene(walk.place, walk.scene);
  walkFace = null; walkMemo = null; walkHeld = null;
  walkSora = scene.sora && !walk.told.includes(scene.id) ? { text: scene.sora, until: walkT + 900 + SORA_FOR_MS, from: walkT + 900 } : null;
  if (!walk.told.includes(scene.id)) walk.told.push(scene.id);
  if (!walk.been.includes(scene.id)) { walk.been.push(scene.id); keep(markBeen(progress, square.id, scene.id)); }
  const before = walk.place.scenes[walk.scene - 1];
  const after = walk.place.scenes[walk.scene + 1];
  // Both ways can always be walked by the buttons at the foot: where no scene lies beyond,
  // the button is an arrow alone and takes her to this one's end (the user, 2026.10.8, of
  // the first scene, which had a button to the right only: "반대로 가는게 없네").
  // A doubled arrow where one touch takes her there (she has been in it before).
  // The button has the scene's shorter name: the whole of it is under the date.
  $('walkPrev').textContent = before ? `${walk.been.includes(before.id) ? '«' : '‹'} ${before.short ?? before.name}` : '‹';
  $('walkNext').textContent = after ? `${after.short ?? after.name} ${walk.been.includes(after.id) ? '»' : '›'}` : '›';
  sound.air(scene.air ?? null);
}
function showWalk(sq) {
  square = sq;
  visit = null; site = null;
  walk = createWalk(WALKS[sq.id], { tried: triedOf(progress, sq.id), been: beenOf(progress, sq.id), done: errandsOf(progress, sq.id), met: metOf(progress, sq.id), tale: taleOf(progress, sq.id) });
  closePanel();
  walkT = 0; walkWay = 0; keyWay = 0; walkWant = null; replyUntil = 0; walkNoteAt = 0;
  // What she chose from the wardrobe above the Earth is on her as she comes down.
  const worn = OUTFITS.find((o) => o.outfit === loadOutfit());
  if (worn) { walk.wearing = worn.outfit; walk.trips = worn.trips; }
  $('errands').classList.remove('folded');
  // Come again with all of them done, the slip is folded from the first, its stamp on it.
  $('errands').classList.toggle('alldone', allDone(walk));
  $('errands').classList.toggle('folded', allDone(walk));
  errandsFoldAt = allDone(walk) ? 0 : ERRANDS_OPEN_MS;
  showChoice(Boolean(walk.place.story?.choice) && allDone(walk) && !chosenOf());
  if (isLocalHost(location.hostname)) window.walkDebug = walk;
  globe.setActive(false);
  stage.className = 'on-ground on-walk';
  mode = 'walk';
  keep(fillDot(progress, sq.id, 'day'));
  showErrands();
  enterScene();
  walkArrive = true;
  sound.paper();
}
// The two buttons at the foot walk her on toward the scene beside this one while held.
for (const [id, way] of [['walkPrev', -1], ['walkNext', 1]]) {
  $(id).addEventListener('pointerdown', (e) => {
    walkWant = null;
    // She goes as she leaves a place, in a ring of gold, and is set down in the next (the
    // user, 2026.10.8: "버튼을 눌러서, 다음/이전 장소로 이동할 떄에는 효과를 넣어줘. 금빛 고리 효과").
    if (walkHopping) return;
    if (walk && canHop(walk, way)) {
      walkWay = 0; keyWay = 0; walkHopping = true;
      sound.wake(); sound.tick(true, false);
      walkView.teleport(HOP_MS).then(() => { walkHopping = false; if (!walk || mode !== 'walk') return; hop(walk, way); enterScene(); walkArrive = true; });
      return;
    }
    $(id).setPointerCapture?.(e.pointerId); walkWay = way;
  });
  for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) $(id).addEventListener(name, () => { walkWay = 0; });
}
$('tryButton').addEventListener('click', () => tryNear());
window.addEventListener('keydown', (e) => {
  if (mode !== 'walk' || e.ctrlKey || e.altKey || e.metaKey) return;
  // While something is asked of her the keys are the box's: Esc goes back, the rest is left to its buttons.
  if (panelOpen()) { if (e.code === 'Escape') { e.preventDefault(); panel.back?.(); } return; }
  if (e.code === 'ArrowLeft' || e.code === 'KeyA') { keyWay = -1; walkWant = null; e.preventDefault(); }
  else if (e.code === 'ArrowRight' || e.code === 'KeyD') { keyWay = 1; walkWant = null; e.preventDefault(); }
  else if (e.code === 'Space' && !e.repeat && !e.target.closest?.('button')) { talk(); e.preventDefault(); }
  else if (e.code === 'Enter' && !e.repeat && !e.target.closest?.('button')) { if (offerOf(walk, withWhom(walk))) tryNear(); else talk(); e.preventDefault(); }
});
window.addEventListener('keyup', (e) => {
  if ((e.code === 'ArrowLeft' || e.code === 'KeyA') && keyWay < 0) keyWay = 0;
  if ((e.code === 'ArrowRight' || e.code === 'KeyD') && keyWay > 0) keyWay = 0;
});
window.addEventListener('blur', () => { keyWay = 0; walkWay = 0; });

function frameWalk(dt) {
  walkT += dt;
  // Who the tale calls for, and who is not in this scene just now, for the picture (ui/walk.js).
  if (walk.tale) {
    // (The mark is not over the head of one she is hearing out, or answering.)
    walk.called = calledOf(walk.place.tale, walk.tale).filter((id) => !panelOpen() && (walk.heard?.of ?? walk.heard?.id) !== id);
    walk.absent = sceneOf(walk).people.filter((p) => !present(walk.tale, p)).map((p) => p.id);
  }
  const out = stepWalk(walk, dt, walkHopping || panelOpen() ? 0 : walkWay || keyWay);
  if (walk.remark && walk.heard?.id !== walk.remark.id) walk.remark = null;
  if (out.scene !== 0) enterScene();
  // Her footfalls, and the place's own sounds now and then.
  if (walk.moving) {
    walkStepMs += dt;
    if (walkStepMs >= FOOTFALL_MS) { walkStepMs -= FOOTFALL_MS; walkSteps += 1; sound.step(sceneOf(walk).floor ?? 'stone', walkSteps); }
  } else walkStepMs = FOOTFALL_MS * 0.6;
  // In the carriage the picture jolts with every clack of the rails (the user, 2026.10.8:
  // "기차 안에서 두둑두둑 소리가 날 때마다 미세하게 화면을 떨게").
  if (sound.airStep(dt).includes(sound.rails)) walkView.clack();
  if (out.arrived && walkWant) { talk(walkWant); walkWant = null; }
  if (out.spot?.sora) walkSora = { text: out.spot.sora, until: walkT + SORA_FOR_MS, from: walkT };
  if (out.spot?.pose) walkFace = { poses: [[out.spot.pose, walkT + SORA_FOR_MS]] };
  if (out.errands.length > 0) errandsDone();
  if (walkSora && walkT > walkSora.until) walkSora = null;
  if (walkHeld && (walk.moving || walkT > walkHeld.until)) walkHeld = null;
  // How she stands for a moment is put away when its time is up, or when she walks on
  // after it has been seen (one that came as she walked waits for her to stop).
  if (walkFace && !walk.moving) walkFace.seen = true;
  if (walkFace && ((walk.moving && walkFace.seen) || walkT > walkFace.poses.at(-1)[1])) walkFace = null;
  // In what trails on the ground she treads on the hem now and then as she walks.
  let stride = null;
  if (walk.moving && walk.trips > 0) {
    walkHemMs += dt;
    const into = walkHemMs - HEM_EVERY_MS;
    if (into >= walk.trips * HEM_FRAME_MS) walkHemMs = 0;
    else if (into >= 0) {
      stride = `${walk.wearing}-trip-${1 + Math.floor(into / HEM_FRAME_MS)}`;
      if (into < dt && !walk.told.includes('hem')) { walk.told.push('hem'); walkSora = { text: '어어, 밟았다!', from: walkT, until: walkT + SORA_FOR_MS }; }
    }
  }
  if (walkMemo && walkT > walkMemo.until) walkMemo = null;
  if (errandsFoldAt > 0 && walkT >= errandsFoldAt) { errandsFoldAt = 0; $('errands').classList.add('folded'); }
  // A note that is due (the first leaf's) falls once grandmother's answer has been read.
  if (walkNoteAt > 0 && walkT >= walkNoteAt) {
    walkNoteAt = 0;
    const note = dueNote((id) => isComplete(progress, id), notesRead(progress), PLACES);
    if (note && (!note.square || note.square === square.id)) { walkWay = 0; keyWay = 0; sound.page(); readNote(note); }
  }

  // The sky of that day and hour, as computed, behind the roofs.
  skyCanvas.draw(skyAt(momentJd(square, { year: square.date.year }, today), square), { facingAz: square.facingAz, pitch: 0 });
  walkView.update(walk, performance.now(), walkSora && walkT >= walkSora.from ? walkSora.text : null, walkT / 1000, walkFace?.poses.find(([, until]) => walkT <= until)?.[0] ?? null, stride, walkHeld?.show ?? null);
  if (walkArrive) { walkArrive = false; walkView.arrive(); }

  const near = walk.moving ? null : withWhom(walk);
  // There is no button to speak: touching a person is speaking to them (the user,
  // 2026.10.8: "내가 NPC 클릭하는게 말 걸기인데, 또 버튼을?"). Who is worth stopping for is
  // told by the gold round them and the mark over their head; Space still speaks.
  // What they have that she can eat, wear or use: the louder button the first time.
  // What she has on, or has eaten or used on this visit, is not offered again (core/walk.js).
  const offer = offerOf(walk, near);
  const offerLabel = offer ? `${offer.name} ${VERBS[offer.verb]}` : '';
  if ($('tryButton').hidden !== !offer) $('tryButton').hidden = !offer;
  if (offer && $('tryButton').textContent !== offerLabel) $('tryButton').textContent = offerLabel;
  if (offer) $('tryButton').classList.toggle('again', walk.tried.includes(offer.id));
  // Grandmother's slip: what she wrote of the one seen from afar, or her answer.
  // Where people speak in a bubble (the places in pixels) what she wrote of the thing being
  // shown is on the slip too: the panel of the other look has a slip of its own (ui/walk.js).
  // Until 2026.10.8 it was not shown there at all (the user, of the marble: "AUF 뜻을 나중에 알려줘?").
  const shower = walk.heard && walk.place.talk !== 'face' ? sceneOf(walk).people.find((p) => p.id === walk.heard.id) : null;
  const memo = (walkT < replyUntil ? replyOf() : null) ?? walkMemo?.text ?? (shower?.show ? shower.memo : null) ?? spotAt(walk)?.memo ?? null;
  hud.set({
    name: squareTitle(square), dateText: square.dateLabel, placeText: sceneOf(walk).name, subText: '',
    dots: { day: false, sky: false, remains: false }, memo, memoPlain: false, memoSky: false,
    // No story card here: what it told, the people now tell (the user, 2026.10.8: "이야기 카드 빼").
    chips: false, bubble: null, sora: soraPose({ now: performance.now(), hushAt }),
    todayLabel: '오늘로', showToday: false, showLeave: true, hint: null, soraFade: 1, glowSky: 0, glowToday: 0,
  });
}

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
    arrive(sq);
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
  arrive(sq);
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

// A place is chosen above the Earth: the century dial gives way to the year dial, set at
// the century's first year, and whatever rolls it on (aim, travel, land) draws it tight
// to the exact year, tick by tick.
function tighten(sq) {
  if (!overEarth()) return;
  onEra = false;
  rollTo(dial, centuryStart(centuryOf(sq.date.year)), 0.001);
  stepDial(dial, 10);
  mark([{ year: sq.date.year, label: sq.name }]);
}
// Back above the Earth with the century dial, at the century of the place she was at.
function loosen(sq = null) {
  onEra = true;
  target = null;
  globe.setTarget(null);
  if (sq) { const at = STOPS.findIndex((stop) => stop.ids.includes(sq.id)); if (at >= 0) { rollTo(eraDial, eraTick(at), 0.001); stepDial(eraDial, 10); } }
}

function pick(sq) {
  if (mode !== 'globe' && mode !== 'ground') return;
  // Above the Earth a place touched is gone to at once: there is no flying to it first.
  if (mode === 'globe') { land(sq); return; }
  if (dotsOf(progress, sq.id).day) { target = null; globe.setTarget(null); travel(sq); return; }
  if (mode === 'ground') { if (square !== sq) leave().then(() => aim(sq)); return; }
  if (globe.under() === sq.id) land(sq);
  else aim(sq);
}

// Comes down onto the square under her: the Earth comes close, then the ground.
// The dial is drawn tight to a year: it runs most of the way in one roll, then goes the
// last three years one at a time with a pause after each, a tick for each.
const SETTLE_YEARS = 3;
const SETTLE_ROLL_S = 0.9;
const SETTLE_STEP_MS = 110;
const SETTLE_PAUSE_MS = 240;
async function settleDial(year) {
  const way = Math.sign(year - dial.year);
  if (way === 0) return;
  const near = year - way * SETTLE_YEARS;
  if ((near - dial.year) * way > 0) { rollTo(dial, near, SETTLE_ROLL_S); while (dial.rolling) await wait(20); }
  while (dial.year !== year) {
    rollTo(dial, dial.year + way, SETTLE_STEP_MS / 1000);
    while (dial.rolling) await wait(16);
    await wait(SETTLE_PAUSE_MS);
  }
}

// Goes to a place from above the Earth (the user's order of things, 2026.10.8): the place
// is touched, the Earth turns it under her, the dial runs to its year and ticks slowly
// into place, then she grows small and goes down to it.
// She goes down for as long as the jump's notes climb, so that its chord sounds as the
// place appears (the dark between the two screens is part of that time).
const DESCEND_MS = WARP_CHORD_MS - FADE_MS;
async function land(sq) {
  if (mode !== 'globe') return;
  sound.wake();
  tighten(sq);
  mode = 'travel';
  target = sq;
  globe.setTarget(sq.id);
  await globe.spinTo(sq.lat, sq.lon, LAND_S);
  await settleDial(sq.date.year);
  landing = true;
  stage.classList.add('descending');
  sound.warp();
  await wait(DESCEND_MS);
  $('fade').classList.add('on');
  await wait(FADE_MS);
  target = null;
  globe.setTarget(null);
  landing = false;
  stage.classList.remove('descending');
  arrive(sq);
  $('fade').classList.remove('on');
}
$('landButton').addEventListener('click', () => { const id = globe.under(); if (id) land(squareById(id)); });

async function leave() {
  if (mode !== 'ground' && mode !== 'site' && mode !== 'walk') return;
  const fromSite = mode === 'site' || mode === 'walk';
  const fromWalk = mode === 'walk';
  sound.air(null);
  if (photo.isOn()) photo.leave();
  findGame.leave();
  flyKeys.clear();
  mode = 'leaving';
  leavingMs = 0;
  if (!fromSite) await wait(LEAVE_MS);
  // From among people a ring of gold takes her up.
  if (fromWalk) { sound.warp(); await walkView.teleport(WARP_CHORD_MS - FADE_MS); }
  $('fade').classList.add('on');
  await wait(FADE_MS);
  globe.setActive(true);
  stage.className = 'on-globe';
  mode = 'globe';
  visit = null;
  site = null;
  showChoice(false);
  closePanel();
  walk = null;
  // What she put on is left where it was put on: the next place sees her in her own clothes
  // (the user, 2026.10.8, in the yard of 1969 with Seoul's hat still on: "88년 벗어났으면, 옷은 원래대로").
  if (fromWalk) saveOutfit(null);
  loosen(square);
  mark(globeMarks());
  // She comes back out over the Earth, growing from a point.
  if (fromWalk) { stage.classList.add('returning'); setTimeout(() => stage.classList.remove('returning'), 600); }
  $('fade').classList.remove('on');
}

hud.leaveBtn.addEventListener('click', leave);
// Rolls the dial to a year by itself. On the ground the picture melts along the way.
function goTo(year) {
  if (dial.rolling || year === dial.year || (mode !== 'ground' && mode !== 'globe' && mode !== 'site')) return;
  sound.wake();
  if (mode === 'ground') roll = { from: blend, to: year === today.year ? 1 : year === square.date.year ? 0 : blend };
  rollTo(dial, year, mode === 'site' ? SITE_ROLL_S : mode === 'ground' && year === today.year ? TO_TODAY_S : TO_THEN_S);
}
hud.todayBtn.addEventListener('click', () => {
  if (mode === 'ground') goTo(dial.year !== today.year ? today.year : square.date.year);
});

createTouch(stage, {
  mode: () => mode,
  // Above the Earth it is the century dial that is turned. A hand on the dial while she
  // is on her way to a place calls that off and gives the centuries back.
  onDialGrab: () => { sound.wake(); roll = null; if (mode === 'globe' && !onEra) loosen(); grab(theDial()); },
  onDialDrag: (dx) => drag(theDial(), dx),
  onDialRelease: (v) => release(theDial(), v),
  onDialTap: (side) => {
    if (overEarth()) { const to = eraAt() + side; if (to >= 0 && to < STOPS.length) rollTo(eraDial, eraTick(to), 0.35); return; }
    const year = nextMark(dial, side); if (year !== null) goTo(year);
  },
  // Pushing the finger up raises the head; it stays where it was left, up or down.
  onLookDrag: (dyShare) => { if (photo.isOn()) photo.drag(dyShare); else dragLook(look, dyShare); },
  onLookEnd: () => { if (!photo.isOn()) endLook(look); },
  onGlobeDrag: (dx, dy) => globe.drag(dx, dy),
  onGlobeEnd: () => globe.release(),
  onGlobeZoom: (factor) => showZoom(globe.zoomBy(factor)),
  // At a place: a finger turns the scene as if it held it; two fingers parting bring it closer.
  onSiteLook: (dx, dy) => { if (site) { turnView(site.view, dx * LOOK_DEG_PER_PX, dy * LOOK_DEG_PER_PX); site.moved = true; } },
  onSiteLift: (px) => { if (site) { nearView(site.view, -px * PINCH_M_PER_PX); site.moved = true; } },
});
const SITE_ROLL_S = 3.5;         // the dial takes this long between two of a place's marked years
const LOOK_DEG_PER_PX = 0.3;
const PINCH_M_PER_PX = 1.2;
const WHEEL_M = 22;
const NEAR_M_PER_S = 130;        // the ＋ and － buttons and the keys bring the place nearer this fast
const TURN_DEG_PER_S = 60;       // the keys carry the eye round this fast

// Closer and farther: two fingers, the wheel, or the two buttons at the right.
function showZoom(zoom) {
  $('zoomIn').disabled = zoom >= ZOOM_MAX;
  $('zoomOut').disabled = zoom <= ZOOM_MIN;
}
$('zoomIn').addEventListener('click', () => showZoom(globe.zoomBy(ZOOM_STEP)));
$('zoomOut').addEventListener('click', () => showZoom(globe.zoomBy(1 / ZOOM_STEP)));
stage.addEventListener('wheel', (e) => {
  if (mode === 'site' && site && !e.target.closest('dialog')) { e.preventDefault(); nearView(site.view, e.deltaY < 0 ? -WHEEL_M : WHEEL_M); site.moved = true; return; }
  if (mode !== 'globe' || e.target.closest('dialog')) return;
  e.preventDefault();
  showZoom(globe.zoomBy(e.deltaY < 0 ? 1.15 : 1 / 1.15));
}, { passive: false });
showZoom(1);

function tickSounds(years) {
  if (years.length === 0) return;
  dialView.tick();
  if (years.length > 2) sound.tick(false, true);
  // On the century dial the low tick is a century's, the light ones the empty ticks between.
  else for (const year of years) sound.tick(overEarth() ? (year - 1) % ERA_GAP === 0 : isDecade(year), false);
}

let eraPlacesOf = null;        // the stop whose places are named now
let eraPlacesNew = null;       // whether they were named for someone who has been nowhere yet
function showEraPlaces(stop) {
  // Someone who has been nowhere yet is told where to begin: that place glows.
  const fresh = beenNowhere();
  globe.setBegin(fresh ? START : null);
  if (stop === eraPlacesOf && fresh === eraPlacesNew) return;
  eraPlacesOf = stop; eraPlacesNew = fresh;
  const list = $('eraPlaces');
  list.hidden = !stop;
  if (!stop) return;
  list.replaceChildren();
  // Only how many there are is told here. Until 2026.10.8 each was a button as well (the
  // user: "이 버튼들은 없애자"); a place is gone to by its pin on the Earth, and one on the far
  // side has its pin on the Earth's rim (render/globe.js).
  const first = fresh && stop.ids.includes(START);
  const head = document.createElement('span');
  head.textContent = first ? '로마부터 가 보자. 빛나는 곳을 누른다' : `이 세기에 갈 곳 ${stop.ids.length}`;
  head.classList.toggle('begin', first);
  list.append(head);
}

function dateOnGlobe() {
  return { dateText: overEarth() ? eraStop().label : `${formatYear(dial.year)}년`, placeText: '지구 위', subText: '' };
}

// One frame at a place in three dimensions: the eye goes where it is wanted, the parts
// follow the dial, the computed sky is drawn behind as the eye sees it.
function frameSite(dt) {
  const { view, def } = site;
  site.t += dt;
  // The keys and the two buttons do what a drag and the wheel do.
  const keys = flyKeys.intent();
  if (keys.drive || keys.strafe || keys.rise || keys.turn) site.moved = true;
  nearView(view, (-keys.drive * NEAR_M_PER_S * dt) / 1000);
  turnView(view, (-(keys.strafe + keys.turn) * TURN_DEG_PER_S * dt) / 1000, (keys.rise * TURN_DEG_PER_S * dt) / 1000);
  const flier = stepView(view, dt);
  siteView.update(dial.year, dt);
  // The hour is one and the same in every year: a little after sunset on the square's day.
  const jd = jdFromDate({ year: dial.year, month: square.date.month, day: square.date.day, hour: utHour(def.hourLocal, square.lon) }, dial.year < 1583 ? 'julian' : 'gregorian');
  skyCanvas.draw(skyAt(jd, square), { camera: { yaw: flier.yaw, pitch: flier.pitch, fovY: siteView.fovY() } });
  siteView.render(flier);

  if (site.t >= SORA_FROM_MS && site.t - dt < SORA_FROM_MS && dial.year === square.date.year) bubble = { text: square.sora, until: site.t + SORA_FOR_MS };
  // Her line is about the day itself: turned away from it, it is put away.
  if (bubble && (site.t > bubble.until || dial.year !== square.date.year)) bubble = null;
  // Grandmother's slip follows the dial: what she wrote of the latest marked year reached.
  let memo = null;
  if (site.t >= MEMO_AT_MS) for (const m of def.marks) if (dial.year >= (m.year === 'today' ? today.year : m.year)) memo = m.memo ?? (m.year === 'today' ? square.memoToday : square.memo);
  if (site.t >= MEMO_AT_MS && memo === null) memo = '이 해는 적어 둔 게 없구나';
  const pose = soraPose({ now: performance.now(), hushAt });
  $('flyHelp').classList.toggle('on', site.t > 1500 && (site.t < 12000 || !site.moved));
  hud.set({
    name: squareTitle(square),
    dateText: dial.year === square.date.year ? square.dateLabel : dial.year === today.year ? formatDate(today) : `${formatYear(dial.year)}년`,
    placeText: square.place, subText: '', dots: { day: false, sky: false, remains: false },
    memo, memoPlain: dial.year >= today.year, memoSky: false,
    chips: site.t >= CHIPS_AT_MS, bubble: pose.saying ?? (bubble ? bubble.text : null), sora: pose,
    todayLabel: '오늘로', showToday: false, showLeave: true, hint: null,
    // She is the one flying: once she has said her line she is put away, out of the view.
    soraFade: pose.saying || bubble ? 0 : clamp01((site.t - 6500) / 600), glowSky: 0, glowToday: 0,
  });
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

  const lead = at === 'then' ? leadDays(square, visit.t) : 0;
  const sky = skyAt(momentJd(square, { year: dial.year, night: visit.night }, today) + lead, square);
  const light = skyLight(sky.sun.alt, sky.sun.cover);
  skyCanvas.draw(sky, {
    facingAz: square.facingAz, pitch: visit.look, dim, labels: clamp01((visit.lookHeld - LABELS_AFTER_MS) / 300),
  });
  const stageBox = { w: stage.clientWidth, h: stage.clientHeight };
  const level = project(0, square.facingAz, { facingAz: square.facingAz, pitch: 0, ...stageBox }).y;
  const raised = project(0, square.facingAz, { facingAz: square.facingAz, pitch: visit.look, ...stageBox }).y;
  ground.set({ rise, blend: peekThen ? 0 : blend, silhouette, dropPx: raised - level, day: light.day });
  // What has changed can be looked for once she has seen both the day and today, standing on today.
  const canFind = at === 'today' && dial.resting && visit.dots.remains && findsOf(square.id).length > 0;
  if (!canFind && findGame.isOn()) findGame.leave();
  if ($('findChip').hidden === canFind) $('findChip').hidden = !canFind;
  const findLabel = findSolved(progress, square.id) ? '달라진 것 ✓' : '달라진 것 찾기';
  if ($('findChip').textContent !== findLabel) $('findChip').textContent = findLabel;

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
      ? guideLine({ where: 'ground', dots: visit.dots, at, lookingUp: visit.look > 0.5, quizSolved: quizSolved(progress, square.id), hasCard: Boolean(cards[square.id]), canFind: canFind && !findSolved(progress, square.id) })
      : null,
    soraFade: pose.saying || (bubble && bubble.lookingUp) ? 0 : clamp01(visit.look * 1.6), glowSky, glowToday,
  });
}

const squareIds = LIVE.map((sq) => sq.id);
function globeCount() {
  const count = countProgress(progress, squareIds);
  return { complete: count.complete, visited: count.day, total: count.total };
}

function frameGlobe(dt) {
  globe.render(dt);
  // She flies at the height of the place nearest her on the upright Earth.
  stage.style.setProperty('--hoverY', `${globe.hoverY().toFixed(1)}px`);
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
    hint: GUIDE_ON && mode === 'globe' && !pose.saying ? guideLine({ where: 'globe', ...globeCount(), target: Boolean(target), over: target ? overId === target.id : Boolean(overId) }) : null, soraFade: 0, glowSky: 0, glowToday: 0,
  });
}

let last = performance.now();
function frame(now) {
  const held = settings.isOpen() || journal.isOpen() || card.isOpen() || opening.isOpen() || $('lookSheet').open;
  const dt = held ? 0 : Math.min(50, now - last);
  last = now;
  tickSounds(stepDial(theDial(), dt));
  // When the dial comes to rest on another century the Earth turns until that century's
  // place is in sight, a little to one side of her: lit, but still to be flown to.
  if (overEarth() && eraDial.resting && shownEra !== eraAt()) {
    shownEra = eraAt();
    const first = squareById(eraStop().ids[0]);
    globe.spinTo(0, first.lon - ERA_ASIDE_DEG, 0.9);
  }
  // How many places it has is told beside the Earth: one on the far side of the globe is
  // not to be missed (the user, 2026.10.7: "뭐가 있는지 모르니까, 계속 돌리기만 해").
  showEraPlaces(overEarth() && !held ? eraStop() : null);
  // Only the places of the century the dial rests nearest are on the globe.
  globe.setShown(overEarth() ? eraStop().ids : target ? [target.id] : LIVE.map((sq) => sq.id));
  if (walk && mode === 'walk') frameWalk(dt);
  else if (site && mode === 'site') frameSite(dt);
  else if (visit && mode !== 'globe') frameGround(dt);
  else frameGlobe(dt);
  dialView.draw(theDial(), overEarth() ? [] : marks);
  music.step(visit ? 'surface' : 'near');
  requestAnimationFrame(frame);
}

// The notebook and the postcards are emptied and the game begins again where it begins,
// in Rome. The opening is not told again (the user, 2026.10.8, afternoon: "초기화 -> 할머니네
// 집으로 보내지마.. 그냥 기록만 초기화해"; that morning it had been asked for). It can be
// read again from the settings. An address that leads straight to a square (#go=…) is
// dropped, here and on the page around the phone frame.
function startOver() {
  saveProgress(emptyProgress());
  saveCards({});
  saveOutfit(null);
  for (const page of [window, window.top]) {
    try { page.history.replaceState(null, '', page.location.pathname + page.location.search); } catch { /* another site's page */ }
  }
  location.reload();
}

// The test buttons, as in volume 1 (the user, 2026.10.7: "우주 한량처럼, 화면 위에 저 버튼
// 만들어줘. 이건 테스트 버전에서만 보이는거"). Only the maker sees them: on the dev server,
// not on the public site or in the store app. The settings (sound, music, text size,
// screen shape) stay as they are.
$('testBar').hidden = !isLocalHost(location.hostname);
$('testReset').addEventListener('click', () => startOver());
// The maker tries one place's tale over and over (the user, 2026.10.8: "몇 번 더 해보고
// 결정하자"): the place she stands in is begun again, the others left as they are.
$('testAgain').addEventListener('click', (e) => {
  // (Left in focus, the button would be pressed again by the Space that speaks to someone.)
  e.currentTarget.blur();
  if (mode !== 'walk' || !square) return;
  const { [square.id]: gone, ...rest } = progress.squares;
  keep({ ...progress, squares: rest });
  closePanel();
  showWalk(square);
});
// And its opposite, for testing what comes after: every square done, every note read.
$('testAll').addEventListener('click', () => {
  keepProgressAside();
  // Every errand of every walked place as well, or the notebook's count stayed at 0/6.
  let all = fullProgress(SQUARES.map((sq) => sq.id), NOTES.map((note) => note.id));
  for (const [id, place] of Object.entries(WALKS)) {
    all = markErrands(all, id, place.errands.map((errand) => errand.id));
    for (const scene of place.scenes) all = markBeen(all, id, scene.id);
  }
  saveProgress(all);
  saveOpened();
  location.reload();
});

// She is set down on a square at once, without the globe.
function setDown(sq) {
  globe.faceNow(sq.lat, sq.lon);
  rollTo(dial, sq.date.year, 0.001); stepDial(dial, 10);
  arrive(sq);
}

// Stills for screenshots: #shot=globe, or #shot=<id>,<then|sky|today>. #go=<id> starts
// on that square.
function still() {
  const shot = location.hash.match(/^#shot=(\w+)(?:,(then|sky|today))?$/);
  const go = location.hash.match(/^#go=(\w+)$/);
  if (go && squareById(go[1])) { setDown(squareById(go[1])); return; }
  if (!shot) return;
  if (shot[1] === 'globe') { globe.faceNow(41, 20); return; }
  const sq = squareById(shot[1]);
  if (!sq) return;
  globe.faceNow(sq.lat, sq.lon);
  rollTo(dial, shot[2] === 'today' ? today.year : sq.date.year, 0.001); stepDial(dial, 10);
  arrive(sq);
  // A place in three dimensions has no stills of its own: she simply stands there.
  if (!visit) { if (shot[2] === 'today') { rollTo(dial, today.year, 0.001); stepDial(dial, 10); } return; }
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
// The game begins standing in Rome, not above the Earth (the user, 2026.10.8, three times:
// "시작점을 로마로 해줘"); the globe is first seen on leaving. A first visit begins with the
// opening and she is set down when it is closed; a link straight to a square or a still
// has neither.
if (!location.hash) {
  if (loadOpened()) setDown(squareById(START));
  else pager.open({ pages: OPENING, lastLabel: '수첩 펴기', skip: true, onDone: () => { saveOpened(); setDown(squareById(START)); } });
}
requestAnimationFrame(frame);
// The first picture is on its way: the loading screen is put away.
document.getElementById('loading').hidden = true;
