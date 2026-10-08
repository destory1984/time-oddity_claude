// A place that is walked about, on the screen: the scene's picture three or four screens
// wide, the people standing in it, Sora walking along the street, and what is said.
// She walks here: among people she does not fly (the user, 2026.10.8: "여기서는 소라가
// 날아다니면 안 되잖아").
// The eye follows her. core/walk.js says where everyone is; this only draws it and tells
// what was touched.
// A place may have another look (place.look 'paper', the second of the two tried in
// docs/기획서-v4-사는-때로.md section 4): its picture and people are flat drawings, pieces
// cut out on their own move in it (core/pieces.js), and whoever is spoken to answers in
// a panel with their face in pixels (place.talk 'face') instead of a bubble overhead.
import { piecesAt } from '../core/pieces.js';

const FOOT = 0.8;             // feet stand at this share of the screen's height
const SORA_TALL = 176;        // she is this tall on a 812 px high screen, walking or standing
const STEP_MS = 150;          // a frame of her walking, and of her standing, lasts this long
const IDLE_MS = 260;
const IDLE_ROOM = 256 / 244;  // her standing picture is this much taller than she is in it
const IDLE_FOOT = 6 / 244;    // and her shoes end this far above its foot

const $ = (id) => document.getElementById(id);

// onPerson(id): a person was touched. onWay(way): a finger went down on the left (-1) or
// right (1) of the scene, or lifted (0).
export function createWalkView({ onPerson, onWay }) {
  const root = $('walk');
  const scroll = $('walkScene');
  const picture = $('walkPicture');
  const piecesEl = $('walkPieces');
  const behindEl = $('walkBehind');
  const peopleEl = $('walkPeople');
  const talk = $('walkTalk');
  const face = $('walkFace');
  const sora = $('walkSora');
  const say = $('walkSay');
  const soraSay = $('walkSoraSay');
  let place = null;
  let scene = null;
  let nodes = new Map();      // person id → { img, person, left, top, wide, tall }
  let moving = new Map();     // piece id → { img, box: what hides the rest of it, or null }
  let size = { w: 1, h: 1, wide: 1, unit: 1 };
  let camera = 0;

  // Her frames are fetched at the start so that none flickers in late.
  for (const sheet of ['walk', 'idle']) for (let i = 1; i <= 4; i += 1) { const img = new Image(); img.src = `./sora/${sheet}-${i}.png`; }
  // Her other pictures (a face on tasting something, the frames of an outfit) are asked
  // for when first wanted and used only once they have come: until then she is as usual.
  const art = new Map();      // name → whether it has come
  function has(name) {
    if (!art.has(name)) {
      art.set(name, false);
      const img = new Image();
      img.onload = () => art.set(name, true);
      img.src = `./sora/${name}.png`;
    }
    return art.get(name);
  }
  for (const face of ['yum', 'sour', 'yuck', 'hmm']) has(`taste-${face}`);

  function measure() {
    const h = root.clientHeight;
    const w = root.clientWidth;
    size = { w, h, unit: h / 812, wide: scene ? 1.5 * scene.zoom * h : w };
  }

  function layout() {
    if (!scene) return;
    measure();
    const { h, wide, unit } = size;
    scroll.style.width = `${wide}px`;
    picture.style.height = `${scene.zoom * h}px`;
    picture.style.top = `${(FOOT - scene.ground * scene.zoom) * h}px`;
    // People stand along the street, those further right a little nearer the eye in turn,
    // so that two who stand close do not hide each other's feet.
    let lane = 0;
    for (const node of nodes.values()) {
      const { person } = node;
      node.wide = person.w * scene.scale * unit;
      node.tall = person.h * scene.scale * unit;
      node.left = person.x * wide - node.wide / 2;
      node.top = FOOT * h + (lane % 3) * 7 * unit - node.tall;
      lane += 1;
      node.img.style.width = `${node.wide}px`;
      node.img.style.left = `${node.left}px`;
      node.img.style.top = `${node.top}px`;
      node.img.style.zIndex = String(10 + (lane % 3));
    }
  }

  function showScene(walkPlace, index) {
    place = walkPlace;
    scene = place.scenes[index];
    picture.src = `./walks/${place.dir}/${scene.id}.webp`;
    peopleEl.replaceChildren();
    nodes = new Map();
    for (const person of scene.people) {
      const img = document.createElement('img');
      img.src = `./walks/${place.dir}/${person.id}.png`;
      img.alt = person.name; img.draggable = false;
      img.className = 'person';
      // Each sways in a time of its own, so that the street does not move as one.
      img.style.animationDelay = `${-((person.x * 7919) % 1600)}ms`;
      img.addEventListener('pointerdown', (e) => { e.stopPropagation(); onPerson(person.id); });
      peopleEl.append(img);
      nodes.set(person.id, { img, person, left: 0, top: 0, wide: 0, tall: 0 });
    }
    root.dataset.look = place.look ?? 'pixel';
    root.dataset.night = place.night ? '1' : '';
    piecesEl.replaceChildren();
    behindEl.replaceChildren();
    moving = new Map();
    say.classList.remove('on');
    talk.classList.remove('on');
    layout();
  }

  // A piece that moves: made the first time it is asked for. One seen only between two
  // ends (a line of people coming out from behind one thing and going in behind another)
  // is put in a box that hides the rest of it.
  function pieceNode(piece) {
    let node = moving.get(piece.id);
    if (node) return node;
    const img = document.createElement('img');
    img.src = `./walks/${place.dir}/${piece.src}.png`;
    img.alt = ''; img.draggable = false; img.className = 'piece';
    // What goes by behind the picture is seen through the holes cut in it.
    const layer = piece.behind ? behindEl : piecesEl;
    let parent = layer;
    if (piece.clip) {
      const key = piece.clip.join('-');
      parent = [...layer.children].find((el) => el.dataset.clip === key);
      if (!parent) {
        parent = document.createElement('div');
        parent.className = 'clip'; parent.dataset.clip = key;
        layer.append(parent);
      }
    }
    parent.append(img);
    node = { img, box: piece.clip ? parent : null };
    moving.set(piece.id, node);
    return node;
  }

  function movePieces(t) {
    const { h, wide } = size;
    const tall = scene.zoom * h;
    const top = (FOOT - scene.ground * scene.zoom) * h;
    const seen = new Set();
    for (const piece of piecesAt(scene, t)) {
      const { img, box } = pieceNode(piece);
      seen.add(piece.id);
      let left = piece.x * wide;
      if (box) {
        box.style.left = `${piece.clip[0] * wide}px`;
        box.style.width = `${(piece.clip[1] - piece.clip[0]) * wide}px`;
        left -= piece.clip[0] * wide;
      }
      img.style.display = '';
      img.style.height = `${piece.tall * tall}px`;
      img.style.opacity = String(piece.alpha);
      const lift = piece.anchor === 'foot' ? '-100%' : '-50%';
      img.style.transform = `translate(${left.toFixed(1)}px,${(top + piece.y * tall).toFixed(1)}px) translate(-50%,${lift})`
        + (piece.turn ? ` rotate(${piece.turn.toFixed(4)}rad)` : '') + (piece.flip ? ' scaleX(-1)' : '');
    }
    for (const [id, node] of moving) if (!seen.has(id)) node.img.style.display = 'none';
  }

  // A finger on the scene itself walks her that way for as long as it is held.
  root.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button')) return;
    root.setPointerCapture?.(e.pointerId);
    onWay(e.clientX < root.getBoundingClientRect().left + size.w / 2 ? -1 : 1);
  });
  for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) root.addEventListener(name, () => onWay(0));

  function bubble(el, text, x, top) {
    el.textContent = text;
    el.classList.add('on');
    // Over the speaker's head, kept inside what the eye sees.
    const wide = Math.min(size.w * 0.7, 250 * size.unit + 40);
    el.style.maxWidth = `${wide}px`;
    const left = Math.max(camera + 8, Math.min(camera + size.w - wide - 8, x - wide / 2));
    el.style.left = `${left}px`;
    el.style.bottom = `${size.h - top + 6}px`;
  }

  // walk: core/walk.js's state. soraLine: what she is saying now, or null. t: seconds
  // since she came down here (what moves in the scene goes by it). face: how what she has
  // just eaten tasted, while it shows.
  function update(walk, now, soraLine, t = 0, face = null) {
    if (!scene) return;
    movePieces(t);
    const { w, h, wide, unit } = size;
    const x = walk.x * wide;
    camera = Math.max(0, Math.min(wide - w, x - w / 2));
    scroll.style.transform = `translateX(${-camera.toFixed(1)}px)`;

    // Standing she is her usual picture (192 x 256 with room round her); walking, one of
    // four steps, each cut to her own outline. Both are shown the same height, feet on the street.
    const walking = walk.moving;
    const frame = 1 + (Math.floor(now / (walking ? STEP_MS : IDLE_MS)) % 4);
    const tasting = !walking && face && has(`taste-${face}`);
    const worn = walk.wearing && has(`${walk.wearing}-${walking ? 'walk' : 'idle'}-${frame}`) ? `${walk.wearing}-` : '';
    const src = tasting ? `./sora/taste-${face}.png` : `./sora/${worn}${walking ? 'walk' : 'idle'}-${frame}.png`;
    if (sora.dataset.src !== src) { sora.dataset.src = src; sora.src = src; }
    const soraTall = SORA_TALL * unit;
    // Her standing picture has empty rows above her crown and below her shoes.
    // (The four steps were cut from one sheet, the tallest of them 320 px high.)
    const shownTall = walking ? (soraTall * (sora.naturalHeight || 320)) / 320 : soraTall * IDLE_ROOM;
    const soraWide = sora.naturalHeight > 0 ? (shownTall * sora.naturalWidth) / sora.naturalHeight : shownTall * 0.75;
    const top = FOOT * h + 8 * unit - shownTall + (walking ? 0 : soraTall * IDLE_FOOT);
    sora.style.height = `${shownTall}px`;
    sora.style.width = `${soraWide}px`;
    sora.style.left = `${x - soraWide / 2}px`;
    sora.style.top = `${top}px`;
    // The walking frames face right; standing she faces the eye.
    sora.style.transform = walking && walk.facing < 0 ? 'scaleX(-1)' : '';

    for (const node of nodes.values()) {
      node.img.classList.toggle('near', Math.abs(node.person.x - walk.x) <= 0.05);
      node.img.classList.toggle('speaking', walk.heard?.id === node.person.id);
    }
    const heard = walk.heard && nodes.has(walk.heard.id) ? nodes.get(walk.heard.id) : null;
    const panel = Boolean(heard) && place.talk === 'face';
    if (heard && !panel) bubble(say, walk.heard.line, heard.left + heard.wide / 2, heard.top);
    else say.classList.remove('on');
    if (panel) {
      const src = `./walks/${place.dir}/face-${walk.heard.id}.png`;
      if (face.dataset.src !== src) { face.dataset.src = src; face.src = src; }
      $('walkTalkName').textContent = heard.person.name;
      $('walkTalkLine').textContent = walk.heard.line;
    }
    talk.classList.toggle('on', panel);
    if (soraLine) bubble(soraSay, soraLine, x, FOOT * h - soraTall);
    else soraSay.classList.remove('on');
  }

  // Leaving, a ring of gold rises from her feet and she is gone where it has passed
  // (the user chose it of four, 2026.10.8: "4번으로 하자"); arriving, she is set down in
  // a shaft of light. ms: how long it takes (leaving lasts as long as the notes of the
  // jump climb).
  const ARRIVE_MS = 620;
  function passage(kind, ms = ARRIVE_MS) {
    const left = parseFloat(sora.style.left);
    const wide = parseFloat(sora.style.width);
    const tall = parseFloat(sora.style.height);
    const extra = document.createElement('i');
    if (kind === 'leaving') {
      const ringWide = wide * 1.15;
      extra.className = 'ring';
      extra.style.left = `${left + wide / 2 - ringWide / 2}px`;
      extra.style.top = `${parseFloat(sora.style.top) + tall - 13}px`;
      extra.style.width = `${ringWide}px`;
      extra.style.height = '26px';
      extra.style.setProperty('--rise', `${-tall}px`);
    } else {
      extra.className = 'beam arriving';
      extra.style.left = sora.style.left;
      extra.style.width = sora.style.width;
    }
    extra.style.animationDuration = `${ms}ms`;
    sora.style.animationDuration = `${ms}ms`;
    scroll.append(extra);
    sora.classList.remove('leaving', 'arriving');
    sora.getBoundingClientRect();
    sora.classList.add(kind);
    return new Promise((resolve) => {
      setTimeout(() => { extra.remove(); if (kind === 'arriving') sora.classList.remove(kind); resolve(); }, ms);
    });
  }

  // Whoever handed her something to try gives a little start.
  function nudge(id) {
    const img = nodes.get(id)?.img;
    if (!img) return;
    img.classList.remove('tried');
    img.getBoundingClientRect();
    img.classList.add('tried');
  }

  return {
    showScene, layout, update, nudge,
    teleport: (ms) => passage('leaving', ms),
    arrive: () => { sora.classList.remove('leaving'); return passage('arriving'); },
  };
}
