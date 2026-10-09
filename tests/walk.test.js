import { existsSync } from 'node:fs';
import { beenOf, emptyProgress, errandsOf, markBeen, markErrands, markMet, metOf, sanitizeProgress } from '../game/src/core/progress.js';
import { describe, expect, it } from 'vitest';
import { piecesAt } from '../game/src/core/pieces.js';
import { squareById } from '../game/src/core/squares.js';
import { WALKS } from '../game/src/core/walks.js';
import { centuryLabel, centuryOf, centuryStart, centuryStops } from '../game/src/core/century.js';
import { FACES, HEAR, REACH, VERBS, canSpeak, hop, talkedOut, worth, allDone, createWalk, errandsLeft, nearby, sceneOf, sendTo, speak, spotAt, stepWalk, triesOf, tryIt, withWhom, outfitsOf, linesOf, stepOf } from '../game/src/core/walk.js';
import { createDial, drag, grab, release, stepDial } from '../game/src/core/dial.js';

describe('centuries', () => {
  it('counts them as historians do, with no century 0', () => {
    expect(centuryOf(80)).toBe(1);
    expect(centuryOf(100)).toBe(1);
    expect(centuryOf(101)).toBe(2);
    expect(centuryOf(1889)).toBe(19);
    expect(centuryOf(1969)).toBe(20);
    expect(centuryOf(-585)).toBe(-6);
    expect(centuryOf(-1)).toBe(-1);
  });
  it('names them and knows their first year', () => {
    expect(centuryLabel(1)).toBe('1세기');
    expect(centuryLabel(-6)).toBe('기원전 6세기');
    expect(centuryStart(1)).toBe(1);
    expect(centuryStart(19)).toBe(1801);
    expect(centuryStart(-6)).toBe(-600);
  });
  it('has a stop only where there is somewhere to go, in order of time', () => {
    const stops = centuryStops([
      { id: 'b', date: { year: 1889 } }, { id: 'a', date: { year: 80 } }, { id: 'c', date: { year: 1851 } }, { id: 'd', date: { year: -585 } },
    ]);
    expect(stops.map((s) => s.label)).toEqual(['기원전 6세기', '1세기', '19세기']);
    expect(stops[2].ids).toEqual(['b', 'c']);
  });
  it('turns on a dial whose stops are far apart, and rests on one', () => {
    const d = createDial({ year: 2, minYear: 1, maxYear: 3, px: 120 });
    grab(d); drag(d, 70); release(d, 0);
    for (let t = 0; t < 2000; t += 16) stepDial(d, 16);
    expect(d.year).toBe(1);
    expect(d.resting).toBe(true);
    grab(d); drag(d, 500); release(d, 0);
    for (let t = 0; t < 2000; t += 16) stepDial(d, 16);
    expect(d.year).toBe(1);
  });
});

const place = {
  scenes: [
    { id: 'one', name: '하나', people: [{ id: 'ann', name: '앤', x: 0.3, lines: ['안녕', '또 왔네'] }, { id: 'bob', name: '밥', x: 0.33, lines: ['어이'] }], spots: [] },
    { id: 'two', name: '둘', people: [], spots: [{ id: 'king', from: 0.4, to: 0.6, memo: '왕이란다' }] },
  ],
  errands: [{ id: 'e1', text: '앤을 찾아라', at: ['ann'] }, { id: 'e2', text: '왕을 봐라', at: ['king'] }],
};
const run = (walk, ms, way = 0) => { const outs = []; for (let t = 0; t < ms; t += 16) outs.push(stepWalk(walk, 16, way)); return outs; };

describe('walking about a place', () => {
  it('walks right and left and stops at the ends of the last scenes', () => {
    const walk = createWalk(place, { x: 0.5 });
    run(walk, 1000, 1);
    expect(walk.x).toBeGreaterThan(0.58);
    expect(walk.facing).toBe(1);
    expect(walk.moving).toBe(true);
    run(walk, 16, 0);
    expect(walk.moving).toBe(false);
    run(walk, 20000, -1);
    expect(walk.scene).toBe(0);
    expect(walk.x).toBeCloseTo(0.02, 9);
  });
  it('goes on into the scene beside it at an end, coming in at the near side', () => {
    const walk = createWalk(place, { x: 0.9 });
    const outs = run(walk, 3000, 1);
    expect(walk.scene).toBe(1);
    expect(outs.some((o) => o.scene === 1)).toBe(true);
    expect(walk.x).toBeLessThan(0.4);
    run(walk, 3000, -1);
    expect(walk.scene).toBe(0);
    expect(walk.x).toBeGreaterThan(0.5);
  });
  it('speaks to whoever is nearest, who says one line and then the other', () => {
    const walk = createWalk(place, { x: 0.29 });
    expect(nearby(walk).id).toBe('ann');
    const first = speak(walk);
    expect(first.line).toBe('안녕');
    expect(first.errands).toEqual(['e1']);
    expect(walk.heard).toEqual({ id: 'ann', line: '안녕' });
    expect(speak(walk).line).toBe('또 왔네');
    expect(speak(walk).errands).toEqual([]);
    expect(errandsLeft(walk)).toBe(1);
  });
  it('speaks to the one meant when two stand near, and to nobody when nobody is', () => {
    const walk = createWalk(place, { x: 0.31 });
    expect(speak(walk, 'bob').person.id).toBe('bob');
    const far = createWalk(place, { x: 0.8 });
    expect(nearby(far)).toBe(null);
    expect(speak(far)).toBe(null);
    expect(Math.abs(0.3 - 0.36)).toBeGreaterThan(REACH);
  });
  it('goes where she is sent and says when she is there', () => {
    const walk = createWalk(place, { x: 0.1 });
    sendTo(walk, 0.3);
    const outs = run(walk, 4000);
    expect(outs.some((o) => o.arrived)).toBe(true);
    expect(walk.x).toBeCloseTo(0.3, 1);
    expect(walk.moving).toBe(false);
  });
  it('puts away what was said when she walks on', () => {
    const walk = createWalk(place, { x: 0.3 });
    speak(walk);
    run(walk, 100, 1);
    expect(walk.heard).toBe(null);
  });
  it('does an errand by standing where the one to be seen is seen from, once', () => {
    const walk = createWalk(place, { scene: 1, x: 0.2 });
    const outs = run(walk, 3000, 1);
    const at = outs.filter((o) => o.spot);
    expect(at.length).toBe(1);
    expect(at[0].errands).toEqual(['e2']);
    expect(spotAt(createWalk(place, { scene: 1, x: 0.5 })).memo).toBe('왕이란다');
    expect(allDone(walk)).toBe(false);
  });
  it('is done when all the errands are', () => {
    const walk = createWalk(place, { x: 0.3 });
    speak(walk);
    walk.scene = 1; walk.x = 0.5;
    stepWalk(walk, 16, 0);
    expect(allDone(walk)).toBe(true);
  });
});

describe('eating, wearing and using what people have', () => {
  const market = {
    scenes: [{ id: 'm', name: '장', spots: [], people: [
      { id: 'fish', name: '생선 장수', x: 0.3, lines: ['사쇼'], try: { id: 'eat-fish', verb: 'eat', name: '생선', face: 'yuck', sora: '으엑' } },
      { id: 'cloth', name: '옷 장수', x: 0.5, lines: ['입어 보쇼'], try: { id: 'wear-toga', verb: 'wear', name: '토가', outfit: 'toga', sora: '무거워' } },
      { id: 'clock', name: '물시계', x: 0.7, try: { id: 'use-clock', verb: 'use', name: '물시계', sora: '똑, 똑' } },
      { id: 'idler', name: '구경꾼', x: 0.9, lines: ['흠'] },
    ] }],
    errands: [{ id: 'e', text: '생선을 먹어 보렴', at: ['eat-fish'] }],
  };
  it('tries what whoever is near has, once for the record, and does the errand by it', () => {
    const walk = createWalk(market, { x: 0.3 });
    expect(speak(walk).errands).toEqual([]);
    const did = tryIt(walk);
    expect(did.it.id).toBe('eat-fish');
    expect(did.first).toBe(true);
    expect(did.errands).toEqual(['e']);
    expect(walk.heard).toBe(null);
    // Eaten once, it is not offered again on this visit; on the next it is, and is not new.
    expect(tryIt(walk)).toBe(null);
    expect(walk.tried).toEqual(['eat-fish']);
    const again = createWalk(market, { x: 0.3, tried: walk.tried });
    expect(tryIt(again).first).toBe(false);
    expect(again.tried).toEqual(['eat-fish']);
  });
  it('has nothing to try where nobody offers anything, or nobody is', () => {
    expect(tryIt(createWalk(market, { x: 0.9 }))).toBe(null);
    expect(tryIt(createWalk(market, { x: 0.1 }))).toBe(null);
  });
  it('keeps on what she put on, and uses a thing that cannot be spoken to', () => {
    const walk = createWalk(market, { x: 0.5 });
    expect(walk.wearing).toBe(null);
    tryIt(walk);
    expect(walk.wearing).toBe('toga');
    walk.x = 0.7;
    expect(speak(walk)).toBe(null);
    expect(tryIt(walk, 'clock').it.verb).toBe('use');
    expect(walk.wearing).toBe('toga');
  });
  it('remembers what was tried on an earlier visit, and lists all there is', () => {
    const walk = createWalk(market, { x: 0.3, tried: ['eat-fish'] });
    expect(tryIt(walk).first).toBe(false);
    expect(triesOf(market).map((it) => it.id)).toEqual(['eat-fish', 'wear-toga', 'use-clock']);
  });
  it('has a wardrobe: an outfit to put on in eight of the places, each by its own name', () => {
    const all = outfitsOf(WALKS);
    expect(all.map((o) => o.outfit).sort()).toEqual(['armor', 'fedora', 'gat', 'ivy', 'sangmo', 'tapa', 'toga', 'tophat']);
    expect(new Set(all.map((o) => o.name)).size).toBe(all.length);
    // Every place has something to eat or to use as well, so that none is only looked at.
    for (const [id, place] of Object.entries(WALKS)) expect(triesOf(place).length, id).toBeGreaterThanOrEqual(2);
  });
  it('is written within the limits: a name, a line of 25, a memo of 60, a face for what is eaten', () => {
    for (const [id, place] of Object.entries(WALKS)) {
      const all = triesOf(place);
      expect(new Set(all.map((it) => it.id)).size, id).toBe(all.length);
      for (const it of all) {
        expect(Object.keys(VERBS), it.id).toContain(it.verb);
        expect(it.name.length, it.id).toBeGreaterThan(0);
        expect(it.sora.length, it.id).toBeLessThanOrEqual(25);
        if (it.memo) expect(it.memo.length, it.id).toBeLessThanOrEqual(60);
        if (it.verb === 'eat') expect(FACES, it.id).toContain(it.face);
        if (it.verb === 'wear') expect(typeof it.outfit, it.id).toBe('string');
      }
    }
  });
});

describe('the places that are walked about', () => {
  it('are squares, with two to four scenes and three errands that can be done', () => {
    for (const [id, walk] of Object.entries(WALKS)) {
      expect(squareById(id), id).toBeTruthy();
      expect(walk.scenes.length, id).toBeGreaterThanOrEqual(2);
      expect(walk.scenes.length, id).toBeLessThanOrEqual(4);
      expect(walk.errands.length, id).toBe(3);
      const ids = walk.scenes.flatMap((scene) => [...scene.people.map((p) => p.id), ...scene.spots.map((s) => s.id), ...scene.people.filter((p) => p.try).map((p) => p.try.id)]);
      expect(new Set(ids).size, id).toBe(ids.length);
      for (const errand of walk.errands) expect(errand.at.every((at) => ids.includes(at)), errand.id).toBe(true);
      expect(walk.reply.length, id).toBeLessThanOrEqual(60);
    }
  });
  it('have six to ten people a scene, each with two things to say of 40 characters at most', () => {
    for (const walk of Object.values(WALKS)) {
      for (const scene of walk.scenes) {
        expect(scene.people.length, scene.id).toBeGreaterThanOrEqual(6);
        expect(scene.people.length, scene.id).toBeLessThanOrEqual(10);
        if (scene.sora) expect(scene.sora.length, scene.id).toBeLessThanOrEqual(25);
        expect(typeof scene.air, scene.id).toBe('string');
        expect(['stone', 'dirt', 'wood'], scene.id).toContain(scene.floor ?? 'stone');
        for (const person of scene.people) {
          expect(person.x > 0.03 && person.x < 0.97, person.id).toBe(true);
          if (!person.lines) { expect(person.try, person.id).toBeTruthy(); continue; }
          expect(person.lines.length, person.id).toBe(2);
          for (const line of person.lines) expect(line.length, `${person.id}: ${line}`).toBeLessThanOrEqual(40);
        }
        for (const spot of scene.spots) {
          expect(spot.from < spot.to, spot.id).toBe(true);
          if (spot.sora) expect(spot.sora.length, spot.id).toBeLessThanOrEqual(25);
        }
      }
    }
  });
  it('can be walked from end to end doing all three errands', () => {
    for (const [id, place] of Object.entries(WALKS)) {
      // A place told as a tale is not done by walking through it: tests/tale.test.js walks its ways.
      if (place.tale) continue;
      const walk = createWalk(place);
      for (const scene of place.scenes) {
        for (const person of scene.people) { walk.x = person.x; speak(walk, person.id); tryIt(walk, person.id); }
        for (let x = 0.03; x < 0.97; x += 0.01) { walk.x = x; stepWalk(walk, 16, 0); }
        if (walk.scene < place.scenes.length - 1) { walk.scene += 1; walk.x = 0.05; }
      }
      expect(sceneOf(walk).id, id).toBe(place.scenes.at(-1).id);
      expect(allDone(walk), id).toBe(true);
    }
  });
  it('are in two centuries with a place each, and the first leaf in a third', () => {
    expect(centuryOf(squareById('eiffel').date.year)).toBe(19);
    expect(squareById('eiffel').dateLabel).toBe('AD 1889.5.15');
  });
  it('have a picture for everyone spoken to, by the names the screen asks for', () => {
    const here = (file) => existsSync(new URL(`../game/public/walks/${file}`, import.meta.url));
    for (const place of Object.values(WALKS)) {
      for (const scene of place.scenes) {
        expect(here(`${place.dir}/${scene.id}.webp`), scene.id).toBe(true);
        for (const person of scene.people) {
          expect(here(`${place.dir}/${person.id}.png`), person.id).toBe(true);
          if (place.talk === 'face' && person.lines) expect(here(`${place.dir}/face-${person.id}.png`), `face of ${person.id}`).toBe(true);
        }
        for (const piece of piecesAt(scene, 0)) expect(here(`${place.dir}/${piece.src}.png`), piece.src).toBe(true);
        // What may be looked at closely has its photograph, a box inside the picture and whose it is.
        for (const look of scene.looks ?? []) {
          expect(here(`${place.dir}/${look.photo}`), look.id).toBe(true);
          expect(look.box.every((v) => v >= 0 && v <= 1) && look.box[0] < look.box[2] && look.box[1] < look.box[3], look.id).toBe(true);
          expect(look.credit.length, look.id).toBeGreaterThan(0);
        }
      }
    }
  });
});

describe('what is heard in passing and what is shown', () => {
  const place = {
    scenes: [{ id: 'a', name: 'a', people: [
      { id: 'idle', name: 'idle', x: 0.5, pass: 'hm', lines: ['one', 'two'] },
      { id: 'seller', name: 'seller', x: 0.8, pass: 'come and see', lines: ['look', 'again'], show: 'thing' },
    ], spots: [] }],
    errands: [],
  };
  it('brings up what a person says unasked as she comes near, and puts it away as she goes', () => {
    const walk = createWalk(place, { x: 0.65 });
    stepWalk(walk, 16, 0);
    expect(walk.passing).toBe(null);
    walk.x = 0.5 + HEAR / 2;
    stepWalk(walk, 16, 0);
    expect(walk.passing).toEqual({ id: 'idle', line: 'hm' });
    walk.x = 0.65;
    stepWalk(walk, 16, 0);
    expect(walk.passing).toBe(null);
    walk.x = 0.8;
    stepWalk(walk, 16, 0);
    expect(walk.passing).toEqual({ id: 'seller', line: 'come and see' });
  });
  it('is quiet when a talk has been ended, until she walks on', () => {
    const walk = createWalk(place, { x: 0.5 + REACH / 2 });
    stepWalk(walk, 16, 0);
    expect(walk.passing?.id).toBe('idle');
    speak(walk); speak(walk);
    expect(speak(walk).over).toBe(true);
    stepWalk(walk, 16, 0);
    expect(walk.passing).toBe(null);
    stepWalk(walk, 16, -1);
    expect(walk.passing?.id).toBe('idle');
  });
  it('gives what can be done to the one she is hearing, not to whoever is nearest', () => {
    const two = { scenes: [{ id: 'a', name: 'a', people: [
      { id: 'seller', name: 'seller', x: 0.5, lines: ['buy'], try: { id: 'eat-it', verb: 'eat', name: 'it', sora: 'mm' } },
      { id: 'lady', name: 'lady', x: 0.57, lines: ['one', 'two'] },
    ], spots: [] }], errands: [] };
    const walk = createWalk(two, { x: 0.53 });
    expect(withWhom(walk).id).toBe('seller');
    speak(walk, 'lady');
    expect(withWhom(walk).id).toBe('lady');
  });
  it('says their lines one at a touch, ends the talk at the next, and begins again after', () => {
    const walk = createWalk(place, { x: 0.5 });
    const idle = place.scenes[0].people[0];
    expect(worth(walk, idle)).toBe(false);
    expect(speak(walk).line).toBe('one');
    expect(talkedOut(walk, idle)).toBe(false);
    expect(speak(walk).line).toBe('two');
    expect(talkedOut(walk, idle)).toBe(true);
    const end = speak(walk);
    expect(end.over).toBe(true);
    expect(end.line).toBe(null);
    expect(walk.heard).toBe(null);
    expect(speak(walk).line).toBe('one');
    expect(canSpeak(walk, idle)).toBe(true);
    walk.x = 0.8;
    walk.heard = null;
    expect(worth(walk, place.scenes[0].people[1])).toBe(true);
    expect([speak(walk).line, speak(walk).line, speak(walk).over, speak(walk).line]).toEqual(['look', 'again', true, 'look']);
  });
  it('says three when they have three', () => {
    const three = { scenes: [{ id: 'a', name: 'a', people: [{ id: 'p', name: 'p', x: 0.5, pass: 'hm', lines: ['1', '2', '3'] }], spots: [] }], errands: [] };
    const walk = createWalk(three, { x: 0.5 });
    expect([speak(walk).line, speak(walk).line, speak(walk).line, speak(walk).over, speak(walk).line]).toEqual(['1', '2', '3', true, '1']);
  });
  it('goes on from where they were when she walked off in the middle', () => {
    const walk = createWalk(place, { x: 0.5 });
    expect(speak(walk).line).toBe('one');
    walk.heard = null;
    expect(speak(walk).line).toBe('two');
    walk.heard = null;
    expect(speak(walk).line).toBe('one');
  });
  // The user, 2026.10.8: "지구본으로 나갔다가, 다시 들어오니까 이벤트 다 한게 없어".
  it('comes again to a place with its errands still done and those she spoke to still met', () => {
    const tokyo = WALKS.shinkansen;
    const walk = createWalk(tokyo, { done: ['took', 'gave', 'speed'], met: ['bento'] });
    expect(allDone(walk)).toBe(true);
    expect(walk.said.bento).toBeGreaterThan(0);
    walk.x = tokyo.scenes[0].people.find((p) => p.id === 'bento').x;
    expect(speak(walk).line).toBe(tokyo.scenes[0].people.find((p) => p.id === 'bento').lines[0]);
  });
  // The user, 2026.10.8: "그냥 팝업되는 대화 1개, 클릭해서 나오는 대화 2개. 총 3개야".
  // What is said when she asks may run to a second line in its balloon (the user, the same
  // day: "응 두 줄까지 쓰게 해"): 40 letters. What is said in passing stays at 25.
  it('gives everyone who speaks three things to say: 25 letters in passing, 40 when asked', () => {
    for (const [id, walked] of Object.entries(WALKS)) for (const scene of walked.scenes) for (const person of scene.people) {
      if (!person.lines) continue;
      expect(person.lines.length, `${id}/${scene.id}/${person.id}`).toBe(2);
      expect(typeof person.pass, `${id}/${scene.id}/${person.id}`).toBe('string');
      expect(person.pass.length, person.pass).toBeLessThanOrEqual(25);
      for (const line of person.lines) expect(line.length, line).toBeLessThanOrEqual(40);
    }
  });
  // The user, 2026.10.8: "매 장면마다 적어도 하나씩은 만들어놔야함".
  it('has in every scene someone with a thing to show, its picture there and a line of hers for it', () => {
    for (const [id, walked] of Object.entries(WALKS)) {
      for (const scene of walked.scenes) {
        const showing = scene.people.filter((p) => p.show);
        expect(showing.length, `${id}/${scene.id}`).toBeGreaterThan(0);
        for (const person of showing) {
          expect(existsSync(`game/public/walks/${walked.dir}/show-${person.show}.webp`), `${walked.dir}/show-${person.show}`).toBe(true);
          if (person.sora) expect(person.sora.length).toBeLessThanOrEqual(25);
          if (person.pose) expect(existsSync(`game/public/sora/${person.pose}.png`), person.pose).toBe(true);
        }
      }
    }
  });
});

// The user, 2026.10.8: "워프나 장면이 바뀔 때에 소라나 나타나는 곳에는 NPC 배치 금지".
describe('where she appears', () => {
  it('has nobody standing: not where she is set down, nor where she comes in from the scene beside', () => {
    for (const [id, walked] of Object.entries(WALKS)) {
      walked.scenes.forEach((scene, i) => {
        // She and one of them, side by side, take about 125 px of a screen 812 px high.
        const clear = 125 / ((scene.aspect ?? 1.5) * scene.zoom * 812);
        const arrivals = [i === 0 ? createWalk(walked).x : 0.04, ...(i < walked.scenes.length - 1 ? [0.96] : [])];
        for (const person of scene.people) for (const at of arrivals) {
          expect(Math.abs(person.x - at), `${id}/${scene.id}/${person.id}`).toBeGreaterThanOrEqual(clear - 0.001);
        }
      });
    }
  });
});

// The user, 2026.10.8: "한 번 가본 곳은 저거만 누르면, 다음 장면으로 이동시켜줘".
describe('going at a touch to a scene she has been in', () => {
  it('does not go where she has not been, and goes at once where she has', () => {
    const place = WALKS.shinkansen;
    const walk = createWalk(place, { been: ['front'] });
    expect(hop(walk, 1)).toBe(false);
    expect(walk.scene).toBe(0);
    walk.been.push('platform');
    expect(hop(walk, 1)).toBe(true);
    expect(walk.scene).toBe(1);
    expect(walk.x).toBeLessThan(0.1);
    expect(hop(walk, -1)).toBe(true);
    expect(walk.scene).toBe(0);
    expect(walk.x).toBeGreaterThan(0.9);
    expect(hop(walk, -1)).toBe(false);
  });
});

describe('what a walked place remembers', () => {
  it('is still there when the saved record is read again', () => {
    let progress = emptyProgress();
    progress = markBeen(progress, 'eiffel', 'gate');
    progress = markErrands(progress, 'eiffel', ['under', 'lift']);
    progress = markMet(progress, 'eiffel', 'news');
    const again = sanitizeProgress(JSON.stringify(progress), ['eiffel']);
    expect(beenOf(again, 'eiffel')).toEqual(['gate']);
    expect(errandsOf(again, 'eiffel')).toEqual(['under', 'lift']);
    expect(metOf(again, 'eiffel')).toEqual(['news']);
    expect(markMet(again, 'eiffel', 'news')).toBe(again);
  });
});

// A place may tell one tale (the user, 2026.10.8: "기승전결이 있으면 좋겠어"): its errands are
// then steps done in their order, people have other things to say as it goes on, and its
// end is hers to choose.
describe('a place with a story', () => {
  const milan = WALKS.cenacolo;
  it('does its steps in their order and no sooner', () => {
    const walk = createWalk(milan);
    walk.scene = 1; walk.x = milan.scenes[1].people.find((p) => p.id === 'waterboy').x;
    expect(speak(walk, 'waterboy').errands).toEqual([]);      // the second step, before the first
    walk.scene = 0; walk.x = milan.scenes[0].people.find((p) => p.id === 'messenger').x;
    expect(stepOf(walk).id).toBe('letter');
    expect(speak(walk, 'messenger').errands).toEqual(['letter']);
    expect(stepOf(walk).id).toBe('trail');
  });
  it('gives people other lines once a step is done', () => {
    const walk = createWalk(milan);
    const salai = milan.scenes[0].people.find((p) => p.id === 'salai');
    expect(linesOf(walk, salai)).toBe(salai.lines);
    walk.done.push('letter');
    expect(linesOf(walk, salai)).toBe(salai.then[0].lines);
  });
  it('is written within the limits, with two ends and an answer to each', () => {
    for (const place of Object.values(WALKS)) {
      for (const scene of place.scenes) for (const person of scene.people) for (const t of person.then ?? []) {
        expect(place.errands.map((e) => e.id), person.id).toContain(t.after);
        expect(t.lines.length, person.id).toBe(2);
        for (const line of t.lines) expect(line.length, line).toBeLessThanOrEqual(40);
      }
      for (const errand of place.errands) if (errand.sora) expect(errand.sora.length, errand.id).toBeLessThanOrEqual(25);
      if (!place.story) continue;
      expect(place.story.ask.length).toBeLessThanOrEqual(25);
      expect(place.story.choice.options.length).toBe(2);
      for (const option of place.story.choice.options) {
        expect(option.label.length, option.id).toBeLessThanOrEqual(16);
        expect(option.sora.length, option.id).toBeLessThanOrEqual(25);
        expect(option.reply.length, option.id).toBeLessThanOrEqual(60);
      }
    }
  });
});
