import { describe, expect, it } from 'vitest';
import { HINT_MS, SEEK_BAR, hintOf, isSought, leftIn, soughtIn } from '../game/src/core/seek.js';
import { allDone, barred, canHop, createWalk, speak, stepWalk, touch, worth } from '../game/src/core/walk.js';
import { WALKS } from '../game/src/core/walks.js';

const place = {
  seek: true,
  scenes: [
    { id: 'a', name: 'a', people: [{ id: 'ann', name: '앤', x: 0.3, lines: ['1', '2'] }, { id: 'bob', name: '밥', x: 0.6, lines: ['1', '2'] }], spots: [],
      taps: [{ id: 'flag', name: '깃발', box: [0.8, 0.1, 0.9, 0.3], sora: ['깃발이다!'] }] },
    { id: 'b', name: 'b', people: [{ id: 'cat', name: '캣', x: 0.5, lines: ['1', '2'] }], spots: [] },
  ],
  errands: [
    { id: 'e1', scene: 'a', text: '앤', at: ['ann'] },
    { id: 'e2', scene: 'a', text: '깃발', at: ['flag'] },
    { id: 'e3', scene: 'b', text: '캣', at: ['cat'] },
  ],
};

describe('a place where things are found', () => {
  it('counts what is left in each scene', () => {
    expect(soughtIn(place, 'a').map((e) => e.id)).toEqual(['e1', 'e2']);
    expect(leftIn(place, ['e1'], 'a')).toBe(1);
    expect(leftIn(place, ['e1', 'e2'], 'a')).toBe(0);
    expect(soughtIn({ ...place, seek: false }, 'a')).toEqual([]);
  });
  it('knows what finds something', () => {
    expect(isSought(place, 'ann')).toBe(true);
    expect(isSought(place, 'flag')).toBe(true);
    expect(isSought(place, 'bob')).toBe(false);
  });
  it('finds a place in the picture by a touch, once', () => {
    const walk = createWalk(place);
    expect(touch(walk, 'flag')).toEqual(['e2']);
    expect(touch(walk, 'flag')).toEqual([]);
  });
  it('shuts the way on until the scene is cleared', () => {
    const walk = createWalk(place, { been: ['a', 'b'] });
    expect(barred(walk)).toBe(SEEK_BAR);
    expect(canHop(walk, 1)).toBe(false);
    walk.x = 0.97;
    expect(stepWalk(walk, 1000, 1).barred).toBe(SEEK_BAR);
    expect(walk.scene).toBe(0);
    walk.x = 0.3; speak(walk, 'ann'); touch(walk, 'flag');
    expect(barred(walk)).toBe(null);
    walk.x = 0.97;
    expect(stepWalk(walk, 1000, 1).scene).toBe(1);
    expect(allDone(walk)).toBe(false);
  });
  it('points at the nearest thing left, and which way when it is far', () => {
    expect(hintOf(place, place.scenes[0], [], 0.25)).toMatchObject({ id: 'ann', way: 0 });
    expect(hintOf(place, place.scenes[0], ['e1'], 0.25)).toMatchObject({ id: 'flag', way: 1 });
    expect(hintOf(place, place.scenes[0], ['e1', 'e2'], 0.25)).toBe(null);
    expect(HINT_MS).toBeGreaterThan(20000);
  });
  it('puts no mark over one who is to be found', () => {
    expect(worth({ place }, place.scenes[0].people[0])).toBe(false);
  });
});

describe('the places where things are found', () => {
  it('have three to find in every scene, each by something that is in that scene', () => {
    for (const [id, walk] of Object.entries(WALKS)) {
      if (!walk.seek) continue;
      for (const scene of walk.scenes) {
        const here = [...scene.people.flatMap((p) => [p.id, ...(p.try ? [p.try.id] : [])]), ...(scene.taps ?? []).map((tp) => tp.id)];
        const sought = soughtIn(walk, scene.id);
        expect(sought.length, `${id} ${scene.id}`).toBe(3);
        for (const errand of sought) {
          expect(errand.at.every((at) => here.includes(at)), errand.id).toBe(true);
          expect(errand.text.length, errand.id).toBeLessThanOrEqual(16);
        }
        for (const tap of scene.taps ?? []) expect(tap.box.every((v) => v >= 0 && v <= 1) && tap.box[0] < tap.box[2] && tap.box[1] < tap.box[3], tap.id).toBe(true);
      }
      expect(walk.errands.every((errand) => walk.scenes.some((scene) => scene.id === errand.scene)), id).toBe(true);
    }
  });
});
