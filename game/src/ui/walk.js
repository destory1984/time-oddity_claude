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
import { worth } from '../core/walk.js';

const FOOT = 0.8;             // feet stand at this share of the screen's height
const SORA_TALL = 176;        // she is this tall on a 812 px high screen, walking or standing
const STEP_MS = 150;          // a frame of her walking, and of her standing, lasts this long
const IDLE_MS = 260;
const IDLE_ROOM = 256 / 244;  // her standing picture is this much taller than she is in it
const IDLE_FOOT = 6 / 244;    // and her shoes end this far above its foot

const $ = (id) => document.getElementById(id);

// onPerson(id): a person was touched. onWay(way): a finger went down on the left (-1) or
// right (1) of the scene, or lifted (0).
export function createWalkView({ onPerson, onWay, onLook = () => {} }) {
  const root = $('walk');
  const scroll = $('walkScene');
  const picture = $('walkPicture');
  const piecesEl = $('walkPieces');
  const behindEl = $('walkBehind');
  const peopleEl = $('walkPeople');
  const talk = $('walkTalk');
  const face = $('walkFace');
  const sora = $('walkSora');
  const badge = $('walkBadge');
  const shown = $('walkTalkShow');
  const remarkEl = $('walkTalkSora');
  const memoEl = $('walkTalkMemo');
  const card = $('walkShow');
  const say = $('walkSay');
  const soraSay = $('walkSoraSay');
  let place = null;
  let scene = null;
  let nodes = new Map();      // person id → { img, person, left, top, wide, tall }
  let moving = new Map();     // piece id → { img, box: what hides the rest of it, or null }
  let looks = [];             // things in the picture that are looked at closely: { look, button }
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
  const POSES = ['taste-yum', 'taste-sour', 'taste-yuck', 'taste-hmm', 'bite-1', 'bite-2', 'turn-away'];
  for (const pose of POSES) has(pose);
  for (const face of ['yum', 'sour', 'yuck', 'hmm']) has(`badge-${face}`);
  const FRAMES = [1, 2, 3, 4];

  function measure() {
    const h = root.clientHeight;
    const w = root.clientWidth;
    size = { w, h, unit: h / 812, wide: scene ? (scene.aspect ?? 1.5) * scene.zoom * h : w };
  }

  function layout() {
    if (!scene) return;
    measure();
    const { h, wide, unit } = size;
    scroll.style.width = `${wide}px`;
    picture.style.height = `${scene.zoom * h}px`;
    picture.style.top = `${(FOOT - scene.ground * scene.zoom) * h}px`;
    // What is looked at closely lies over its place in the picture (a scene's `looks`).
    for (const { look, button } of looks) {
      const [x0, y0, x1, y1] = look.box;
      button.style.left = `${x0 * wide}px`;
      button.style.width = `${(x1 - x0) * wide}px`;
      button.style.top = `${(FOOT - scene.ground * scene.zoom + y0 * scene.zoom) * h}px`;
      button.style.height = `${(y1 - y0) * scene.zoom * h}px`;
    }
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
      if (node.mark) { node.mark.style.left = `${person.x * wide}px`; node.mark.style.top = `${node.top - 8 * unit}px`; }
    }
  }

  function showScene(walkPlace, index) {
    place = walkPlace;
    scene = place.scenes[index];
    picture.src = `./walks/${place.dir}/${scene.id}.webp`;
    peopleEl.replaceChildren();
    nodes = new Map();
    // A thing in the picture that may be touched for more of it (the user, 2026.10.8, of the
    // painting on the refectory wall: "그림을 클릭하면, 조금 더 자세한 정보를 보여주자").
    for (const { button } of looks) button.remove();
    looks = (scene.looks ?? []).map((look) => {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'look';
      button.setAttribute('aria-label', `${look.name} 자세히 보기`);
      button.innerHTML = '<i>자세히 보기</i>';
      button.addEventListener('pointerdown', (e) => e.stopPropagation());
      button.addEventListener('click', () => onLook(look));
      scroll.append(button);
      return { look, button };
    });
    for (const person of scene.people) {
      const img = document.createElement('img');
      img.src = `./walks/${place.dir}/${person.id}.png`;
      img.alt = person.name; img.draggable = false;
      img.className = 'person';
      // One drawn looking away from what they speak of is turned to face it.
      if (person.flip) img.style.scale = '-1 1';
      // Each sways in a time of its own, so that the street does not move as one.
      img.style.animationDelay = `${-((person.x * 7919) % 1600)}ms`;
      img.addEventListener('pointerdown', (e) => { e.stopPropagation(); onPerson(person.id); });
      peopleEl.append(img);
      // Over the head of one who has a thing to show, that thing small in a ring of gold,
      // until she has seen it: such a one is easily walked past (the user, 2026.10.8:
      // "도시락 아주머니를 눌러야할지 .. 그냥 넘어가기 딱 좋은데").
      // Those an errand asks for, and those with a thing to try, are marked the same way
      // with a "!" (the user, of one an errand asked for: "얘도 그냥 넘어갈 뻔 함"). Whoever
      // has no mark can be walked past.
      let mark = null;
      if (worth({ place }, person)) {
        mark = document.createElement('i');
        mark.className = 'mark';
        if (person.show) mark.style.backgroundImage = `url(./walks/${place.dir}/show-${person.show}.webp)`;
        else { mark.classList.add('bang'); mark.textContent = '!'; }
        // Touching the mark is touching them (the user, 2026.10.8: "저거 눌러도 대화 시작하게").
        mark.addEventListener('pointerdown', (e) => { e.stopPropagation(); onPerson(person.id); });
        peopleEl.append(mark);
      }
      nodes.set(person.id, { img, mark, person, left: 0, top: 0, wide: 0, tall: 0 });
    }
    // What she may put on here, and how she stands on trying something, is fetched on arriving.
    for (const person of scene.people) {
      if (person.show) { const img = new Image(); img.src = `./walks/${place.dir}/show-${person.show}.webp`; }
      if (person.try?.pose) has(person.try.pose);
      if (person.pose) has(person.pose);
      if (person.try?.trips) for (const i of FRAMES.slice(0, person.try.trips)) has(`${person.try.outfit}-trip-${i}`);
      if (person.try?.outfit) for (const i of FRAMES) { has(`${person.try.outfit}-idle-${i}`); has(`${person.try.outfit}-walk-${i}`); }
    }
    for (const spot of scene.spots) if (spot.pose) has(spot.pose);
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
    // Over the speaker's head, kept inside what the eye sees. It is centred by the width it
    // really has: by the widest it may be, a short word hung far to the left of whoever
    // said it (the user, 2026.10.8, of a child's "훌쩍…": "NPC 대화가 너무 멀어").
    // What runs past 25 letters is given more of the screen, so that it ends on its second line.
    const long = text.length > 25;
    const wide = Math.min(size.w * (long ? 0.9 : 0.7), (long ? 330 : 250) * size.unit + 40);
    const key = `${text}|${Math.round(wide)}`;
    if (el.dataset.key !== key) {
      el.dataset.key = key;
      // Two sentences in one balloon stand on a line each.
      el.textContent = long ? text.replace(/([.!?…]) /, '$1\n') : text;
      el.style.maxWidth = `${wide}px`;
      el.style.left = `${camera}px`;      // measured where nothing squeezes it
      el.classList.add('on');
      el.dataset.wide = String(el.offsetWidth || wide);
    }
    el.classList.add('on');
    const real = Number(el.dataset.wide);
    const left = Math.max(camera + 8, Math.min(camera + size.w - real - 8, x - real / 2));
    el.style.left = `${left}px`;
    el.style.bottom = `${size.h - top + 6}px`;
  }
  const boxOf = (el) => ({ left: parseFloat(el.style.left), wide: Number(el.dataset.wide), bottom: parseFloat(el.style.bottom), tall: el.offsetHeight });

  // walk: core/walk.js's state. soraLine: what she is saying now, or null. t: seconds
  // since she came down here (what moves in the scene goes by it). pose: a picture of hers
  // (public/sora/<pose>.png) for how she takes what she has just tried, while it shows;
  // stride: one shown in place of a step while she walks (treading on her hem). held: a
  // thing held up for her to see as she tries it (a person's `show`), or null.
  function update(walk, now, soraLine, t = 0, pose = null, stride = null, held = null) {
    if (!scene) return;
    movePieces(t);
    const { w, h, wide, unit } = size;
    const x = walk.x * wide;
    camera = Math.max(0, Math.min(wide - w, x - w / 2));
    scroll.style.transform = `translateX(${-camera.toFixed(1)}px)`;
    // The word on a thing that may be looked at closely stays in sight as the scene slides:
    // the thing itself is often wider than the screen.
    for (const { button } of looks) {
      const left = parseFloat(button.style.left); const boxWide = parseFloat(button.style.width);
      const tag = button.firstChild; const half = tag.offsetWidth / 2;
      tag.style.left = `${Math.max(8, Math.min(boxWide - half * 2 - 8, camera + w / 2 - left - half))}px`;
    }

    // Standing she is her usual picture (192 x 256 with room round her); walking, one of
    // four steps, each cut to her own outline. Both are shown the same height, feet on the street.
    const walking = walk.moving;
    const frame = 1 + (Math.floor(now / (walking ? STEP_MS : IDLE_MS)) % 4);
    // In an outfit her clothes must not change for a moment and change back (the user,
    // 2026.10.8), and an outfit is drawn standing and walking only, so that one more does
    // not cost a picture for everything she does (the user chose this of three: "나"로
    // 해보자). In one she stays as she stands, and how a thing tasted is told by a small
    // face in a bubble beside her head (badge-<face>.png, the same four for every outfit).
    const own = pose && walk.wearing && pose.startsWith(`${walk.wearing}-`);
    const posed = !walk.wearing || own ? pose : null;
    const tasting = !walking && posed && has(posed);
    const mood = !walking && pose && walk.wearing && pose.startsWith('taste-') ? `badge-${pose.slice(6)}` : null;
    const tripping = walking && stride && has(stride);
    const worn = walk.wearing && has(`${walk.wearing}-${walking ? 'walk' : 'idle'}-${frame}`) ? `${walk.wearing}-` : '';
    const src = tasting ? `./sora/${posed}.png` : tripping ? `./sora/${stride}.png` : `./sora/${worn}${walking ? 'walk' : 'idle'}-${frame}.png`;
    if (sora.dataset.src !== src) { sora.dataset.src = src; sora.src = src; }
    const soraTall = SORA_TALL * unit;
    // Her standing picture has empty rows above her crown and below her shoes.
    // (The four steps were cut from one sheet, the tallest of them 320 px high.)
    // (Standing in a tall hat her picture is higher than 256 px: it is shown that much higher.)
    const shownTall = walking ? (soraTall * (sora.naturalHeight || 320)) / 320 : soraTall * IDLE_ROOM * (tasting || !worn ? 1 : (sora.naturalHeight || 256) / 256);
    const soraWide = sora.naturalHeight > 0 ? (shownTall * sora.naturalWidth) / sora.naturalHeight : shownTall * 0.75;
    const top = FOOT * h + 8 * unit - shownTall + (walking ? 0 : soraTall * IDLE_FOOT);
    sora.style.height = `${shownTall}px`;
    sora.style.width = `${soraWide}px`;
    sora.style.left = `${x - soraWide / 2}px`;
    sora.style.top = `${top}px`;
    // The walking frames face right; standing she faces the eye.
    sora.style.transform = walking && walk.facing < 0 ? 'scaleX(-1)' : '';
    if (mood && has(mood)) {
      const side = 84 * unit;
      if (badge.dataset.src !== mood) { badge.dataset.src = mood; badge.src = `./sora/${mood}.png`; }
      badge.style.height = `${side}px`;
      badge.style.left = `${x + soraTall * 0.26}px`;
      badge.style.top = `${FOOT * h - soraTall * 0.92}px`;
      badge.classList.add('on');
    } else { badge.classList.remove('on'); badge.dataset.src = ''; }

    for (const node of nodes.values()) {
      // Only those worth stopping for light up: gold all round until she has been to them,
      // and brighter while she stands by them.
      const fresh = Boolean(node.mark) && !((walk.said[node.person.id] ?? 0) > 0 || (node.person.try && walk.tried.includes(node.person.try.id)));
      node.img.classList.toggle('worth', fresh);
      node.img.classList.toggle('near', Boolean(node.mark) && Math.abs(node.person.x - walk.x) <= 0.05);
      node.img.classList.toggle('speaking', walk.heard?.id === node.person.id);
      // The mark gives way to what they are saying, and is gone for good once she has seen the thing.
      // The mark stays while they speak (the user: "근처에 가면, 머리 위에 있던 아이콘이 없어짐"):
      // what they say goes above it.
      node.mark?.classList.toggle('off', !fresh);
      node.over = fresh && node.mark ? node.mark.offsetHeight + 12 * unit : 0;
    }
    const heard = walk.heard && nodes.has(walk.heard.id) ? nodes.get(walk.heard.id) : null;
    const panel = Boolean(heard) && place.talk === 'face';
    // What someone says unasked as she passes is over their head, unless she is speaking
    // herself (the two would lie one over the other).
    const passing = !heard && !soraLine && walk.passing && nodes.has(walk.passing.id) ? nodes.get(walk.passing.id) : null;
    if (heard && !panel) bubble(say, walk.heard.line, heard.left + heard.wide / 2, heard.top - heard.over);
    else if (passing) bubble(say, walk.passing.line, passing.left + passing.wide / 2, passing.top - passing.over);
    else say.classList.remove('on');
    if (panel) {
      const src = `./walks/${place.dir}/face-${walk.heard.id}.png`;
      if (face.dataset.src !== src) { face.dataset.src = src; face.src = src; }
      $('walkTalkName').textContent = heard.person.name;
      $('walkTalkLine').textContent = walk.heard.line;
    }
    // What they open or hold up to show her is under their words, large.
    // Where they speak in a bubble, or she is trying the thing, it is a card of its own.
    const showing = heard?.person.show ?? held;
    const big = showing ? `./walks/${place.dir}/show-${showing}.webp` : '';
    const show = panel && heard.person.show ? big : '';
    if (shown.dataset.src !== show) { shown.dataset.src = show; if (show) shown.src = show; talk.classList.toggle('showing', Boolean(show)); }
    // What she says of it, in the panel under it.
    const remark = panel && walk.remark?.id === walk.heard.id ? walk.remark.text : '';
    if (remarkEl.textContent !== remark) { remarkEl.textContent = remark; remarkEl.classList.toggle('on', Boolean(remark)); }
    // And what grandmother wrote of it, on a slip of her paper.
    const slip = panel && show ? heard.person.memo ?? '' : '';
    // (A panel with a picture hangs from under the top buttons, so that it cannot run off
    // the top of the screen; with a slip as well its picture is a little lower.)
    if (memoEl.textContent !== slip) { memoEl.textContent = slip; memoEl.classList.toggle('on', Boolean(slip)); talk.classList.toggle('noted', Boolean(slip)); }
    const apart = show ? '' : big;
    if (card.dataset.src !== apart) { card.dataset.src = apart; if (apart) card.src = apart; card.classList.toggle('on', Boolean(apart)); }
    talk.classList.toggle('on', panel);
    // Her own words go over her head, and above the mark of anyone she stands by.
    let lift = 0;
    for (const node of nodes.values()) if (node.over && Math.abs(node.person.x * wide - x) < 90 * unit) lift = Math.max(lift, FOOT * h - soraTall - (node.top - node.over));
    // (In a tall hat her words go above the hat.)
    if (soraLine) bubble(soraSay, soraLine, x, Math.min(FOOT * h - soraTall, top + 14 * unit) - Math.max(0, lift));
    else soraSay.classList.remove('on');
    // Where her words and theirs would lie one over the other, hers go above theirs (the
    // user, 2026.10.8: "소라의 대화와 NPC의 대화가 겹침"); and a thing held up to be seen
    // moves up out of the way of both.
    let high = 0;
    if (say.classList.contains('on')) {
      const theirs = boxOf(say);
      high = theirs.bottom + theirs.tall;
      if (soraLine) {
        const hers = boxOf(soraSay);
        const apart = hers.left + hers.wide < theirs.left || theirs.left + theirs.wide < hers.left || hers.bottom + hers.tall < theirs.bottom || theirs.bottom + theirs.tall < hers.bottom;
        if (!apart) soraSay.style.bottom = `${theirs.bottom + theirs.tall + 6}px`;
      }
    }
    if (soraLine) { const hers = boxOf(soraSay); high = Math.max(high, hers.bottom + hers.tall); }
    card.style.bottom = card.classList.contains('on') && high + 10 > h * 0.53 ? `${high + 10}px` : '';
    // Grandmother's slip for the thing on the card (main.js) lies just above the card, and
    // the slip of errands makes room for it: under the card it could not be read.
    const noted = card.classList.contains('on') && Boolean(heard?.person.memo);
    root.classList.toggle('carded', noted);
    if (noted) root.parentElement.style.setProperty('--cardTop', `${Math.max(h * 0.53, high + 10) + card.offsetHeight + 8}px`);
    else root.parentElement.style.removeProperty('--cardTop');
  }

  // How a thing tasted, in a word that springs up beside her head: with or without an
  // outfit on, it is plain at once whether it was good (the user, 2026.10.8: "맛있다~ 또는
  // 맛없다 표현").
  const TASTES = { yum: '맛있다!', sour: '아이, 셔!', yuck: '으엑, 맛없어!', hmm: '음… 묘한데?' };
  function taste(face) {
    if (!TASTES[face]) return;
    const word = document.createElement('i');
    word.className = `taste ${face}`;
    word.textContent = TASTES[face];
    word.style.left = `${parseFloat(sora.style.left) + parseFloat(sora.style.width) / 2}px`;
    word.style.top = `${parseFloat(sora.style.top) + parseFloat(sora.style.height) * 0.45}px`;
    scroll.append(word);
    setTimeout(() => word.remove(), 2400);
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

  // The whole scene jolts a little, four times, as the wheels go over a joint in the rails.
  function clack() { scroll.classList.remove('clack'); scroll.getBoundingClientRect(); scroll.classList.add('clack'); }

  // Gold flies up round her: all of grandmother's errands are done.
  function cheer() {
    const left = parseFloat(sora.style.left) + parseFloat(sora.style.width) / 2;
    const foot = parseFloat(sora.style.top) + parseFloat(sora.style.height);
    for (let i = 0; i < 18; i += 1) {
      const spark = document.createElement('i');
      spark.className = 'spark';
      spark.style.left = `${left}px`; spark.style.top = `${foot - 40}px`;
      spark.style.setProperty('--dx', `${(Math.random() * 2 - 1) * 120}px`);
      spark.style.setProperty('--dy', `${-(90 + Math.random() * 170)}px`);
      spark.style.animationDelay = `${Math.random() * 350}ms`;
      scroll.append(spark);
      setTimeout(() => spark.remove(), 2200);
    }
    // And it is said across the middle of the screen, over whatever else is up (the slip
    // itself may lie under the panel of the one she has just spoken to).
    const banner = document.createElement('div');
    banner.className = 'cheer';
    banner.textContent = '할머니의 심부름을 다 했다!';
    root.append(banner);
    setTimeout(() => banner.remove(), 3600);
  }

  return {
    showScene, layout, update, nudge, clack, cheer, taste,
    teleport: (ms) => passage('leaving', ms),
    arrive: () => { sora.classList.remove('leaving'); return passage('arriving'); },
  };
}
