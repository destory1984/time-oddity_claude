import { describe, expect, it } from 'vitest';
import { squareById } from '../game/src/core/squares.js';
import { WALKS } from '../game/src/core/walks.js';
import { centuryLabel, centuryOf, centuryStart, centuryStops } from '../game/src/core/century.js';
import { REACH, allDone, createWalk, errandsLeft, nearby, sceneOf, sendTo, speak, spotAt, stepWalk } from '../game/src/core/walk.js';
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

describe('the places that are walked about', () => {
  it('are squares, with two to four scenes and three errands that can be done', () => {
    for (const [id, walk] of Object.entries(WALKS)) {
      expect(squareById(id), id).toBeTruthy();
      expect(walk.scenes.length, id).toBeGreaterThanOrEqual(2);
      expect(walk.scenes.length, id).toBeLessThanOrEqual(4);
      expect(walk.errands.length, id).toBe(3);
      const ids = walk.scenes.flatMap((scene) => [...scene.people.map((p) => p.id), ...scene.spots.map((s) => s.id)]);
      expect(new Set(ids).size, id).toBe(ids.length);
      for (const errand of walk.errands) expect(errand.at.every((at) => ids.includes(at)), errand.id).toBe(true);
      expect(walk.reply.length, id).toBeLessThanOrEqual(60);
    }
  });
  it('have six to ten people a scene, each with two lines of 25 characters at most', () => {
    for (const walk of Object.values(WALKS)) {
      for (const scene of walk.scenes) {
        expect(scene.people.length, scene.id).toBeGreaterThanOrEqual(6);
        expect(scene.people.length, scene.id).toBeLessThanOrEqual(10);
        if (scene.sora) expect(scene.sora.length, scene.id).toBeLessThanOrEqual(25);
        for (const person of scene.people) {
          expect(person.x > 0.03 && person.x < 0.97, person.id).toBe(true);
          expect(person.lines.length, person.id).toBe(2);
          for (const line of person.lines) expect(line.length, `${person.id}: ${line}`).toBeLessThanOrEqual(25);
        }
        for (const spot of scene.spots) {
          expect(spot.from < spot.to, spot.id).toBe(true);
          if (spot.sora) expect(spot.sora.length, spot.id).toBeLessThanOrEqual(25);
        }
      }
    }
  });
  it('can be walked from end to end doing all three errands', () => {
    const walk = createWalk(WALKS.colosseum);
    for (const scene of WALKS.colosseum.scenes) {
      for (const person of scene.people) { walk.x = person.x; speak(walk, person.id); }
      for (let x = 0.03; x < 0.97; x += 0.01) { walk.x = x; stepWalk(walk, 16, 0); }
      if (walk.scene < WALKS.colosseum.scenes.length - 1) { walk.scene += 1; walk.x = 0.05; }
    }
    expect(sceneOf(walk).id).toBe('inside');
    expect(allDone(walk)).toBe(true);
  });
});
