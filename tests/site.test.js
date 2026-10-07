import { describe, expect, it } from 'vitest';
import { squareById } from '../game/src/core/squares.js';
import { SITES } from '../game/src/core/sites.js';
import {
  ARENA, BAYS, EYE, FATES, FOREVER, LEVELS, RING2, SEMI_LONG, SEMI_SHORT, WALL_TOP, YEARS,
  floorAt, inWall, onRing, outerTop, ringPlace, standHeight, toLocal, toWorld,
} from '../game/src/core/colosseum.js';
import { createFlier, farFrom, lookBy, nudgeFlier, stepFlier } from '../game/src/core/fly.js';

describe('the Colosseum', () => {
  it('is 188 m by 156 m and 48 m high, with eighty arches round it', () => {
    expect(onRing(0).x).toBe(SEMI_LONG);
    expect(onRing(Math.PI / 2).z).toBeCloseTo(SEMI_SHORT, 9);
    expect(LEVELS[3].y + LEVELS[3].h).toBeCloseTo(WALL_TOP, 9);
    expect(BAYS).toBe(80);
  });
  it('has an arena about 83 m by 51 m inside the stands', () => {
    expect(onRing(0, ARENA).x).toBeCloseTo(41.5, 1);
    expect(onRing(Math.PI / 2, ARENA).z).toBeCloseTo(25.5, 1);
  });
  it('knows how far inside the wall a point is', () => {
    expect(ringPlace(SEMI_LONG - 10, 0).d).toBeCloseTo(10, 1);
    expect(ringPlace(SEMI_LONG + 5, 0).d).toBeCloseTo(-5, 1);
    expect(ringPlace(0, 0).d).toBeGreaterThan(ARENA);
  });
  it('is not there before it was built, and rises a level at a time', () => {
    expect(outerTop(0, -100)).toBe(0);
    expect(outerTop(0, 71)).toBe(0);
    expect(outerTop(0, 73)).toBeCloseTo(10.5, 9);
    expect(outerTop(0, 77)).toBeCloseTo(33.95, 9);
    expect(inWall(SEMI_LONG, 0, 20, -100)).toBe(false);
    expect(floorAt(SEMI_LONG - 24, 0, EYE, -100)).toBe(EYE);
    expect(floorAt(SEMI_LONG - 45, 0, EYE, 75)).toBeGreaterThan(EYE + 3);
  });
  it('stands whole in the year 80', () => {
    for (let bay = 0; bay < BAYS; bay += 1) expect(outerTop(bay, 80)).toBeCloseTo(WALL_TOP, 9);
  });
  it('loses its south side in 1349 and keeps 32 bays of its north side to this day', () => {
    const whole = (year) => Array.from({ length: BAYS }, (_, bay) => outerTop(bay, year)).filter((top) => top > 47).length;
    expect(whole(1340)).toBe(BAYS);
    expect(whole(1349)).toBeLessThan(60);
    expect(whole(1349)).toBeGreaterThan(40);
    expect(whole(2026)).toBe(32);
    expect(FATES.outer.flat().filter((gone) => gone !== FOREVER).every((gone) => gone >= 1343 && gone <= 1750)).toBe(true);
  });
  it('slopes down from the second wall to the arena', () => {
    expect(standHeight(RING2)).toBe(33);
    expect(standHeight(24)).toBe(22);
    expect(standHeight(49)).toBeCloseTo(4, 9);
    expect(standHeight(51)).toBe(4);
  });
  it('holds a flier above the stands and lets her stand on the arena floor', () => {
    expect(floorAt(0, 0, EYE, 80)).toBe(EYE);
    expect(floorAt(SEMI_LONG - 24, 0, EYE, 80)).toBeCloseTo(22 + EYE, 1);
    // The seats are gone by today; what held them up is lower.
    expect(floorAt(SEMI_LONG - 24, 0, EYE, 2026)).toBeLessThan(22);
    expect(floorAt(SEMI_LONG + 20, 0, EYE, 80)).toBe(EYE);
  });
  it('is stone above its ground arches, where the wall still stands', () => {
    expect(inWall(SEMI_LONG, 0, 20, 80)).toBe(true);
    expect(inWall(SEMI_LONG, 0, 5, 80)).toBe(false);
    expect(inWall(SEMI_LONG, 0, 60, 80)).toBe(false);
    expect(inWall(0, -SEMI_SHORT, 20, 2026)).toBe(false);   // the south side is gone
    expect(inWall(0, SEMI_SHORT, 20, 2026)).toBe(true);     // the north side stands
    expect(inWall(SEMI_LONG - 30, 0, 20, 80)).toBe(false);
  });
  it('turns between the world and its own axes and back', () => {
    const w = toWorld(10, 0);
    expect((Math.atan2(w.x, w.z) * 180) / Math.PI).toBeCloseTo(110, 6);   // the long axis runs to azimuth 110
    const back = toLocal(w.x, w.z);
    expect(back.x).toBeCloseTo(10, 9);
    expect(back.z).toBeCloseTo(0, 9);
  });
  it('is marked at four years', () => {
    expect(YEARS).toEqual([80, 1349, 1750, 2026]);
  });
});

describe('the places', () => {
  it('are squares, have a spot to stand on the ground and mark the first year and today', () => {
    for (const [id, def] of Object.entries(SITES)) {
      const sq = squareById(id);
      expect(sq, id).toBeTruthy();
      expect(def.spots.some((spot) => spot.y === EYE), id).toBe(true);
      expect(def.marks.some((m) => m.year === sq.date.year), id).toBe(true);
      expect(def.marks[def.marks.length - 1].year).toBe('today');
      for (const m of def.marks) {
        expect(m.label.length, m.label).toBeLessThanOrEqual(5);
        if (m.memo) expect(m.memo.length, m.memo).toBeLessThanOrEqual(25);
      }
    }
  });
});

describe('flying', () => {
  const open = { floorAt: () => 1.7, inWall: () => false };
  const run = (flier, ms, intent, place = open) => { for (let t = 0; t < ms; t += 16) stepFlier(flier, 16, { drive: 0, strafe: 0, rise: 0, turn: 0, fast: false, ...intent }, place); };
  it('goes the way she looks', () => {
    const north = createFlier({ yaw: 0 });
    run(north, 2000, { drive: 1 });
    expect(north.z).toBeGreaterThan(20);
    expect(Math.abs(north.x)).toBeLessThan(1e-6);
    const east = createFlier({ yaw: 90 });
    run(east, 2000, { drive: 1 });
    expect(east.x).toBeGreaterThan(20);
  });
  it('climbs when she looks up and goes ahead', () => {
    const f = createFlier({ pitch: 45 });
    run(f, 2000, { drive: 1 });
    expect(f.y).toBeGreaterThan(10);
  });
  it('slides to her right with D', () => {
    const f = createFlier({ yaw: 0 });
    run(f, 1000, { strafe: 1 });
    expect(f.x).toBeGreaterThan(5);
  });
  it('comes to rest when the keys are let go', () => {
    const f = createFlier();
    run(f, 1000, { drive: 1 });
    run(f, 2000, {});
    expect(Math.hypot(f.vx, f.vz)).toBeLessThan(0.01);
  });
  it('is stopped by stone and held up by the floor', () => {
    const walled = { floorAt: () => 1.7, inWall: (x, z) => z > 10 };
    const f = createFlier({ yaw: 0 });
    run(f, 4000, { drive: 1 }, walled);
    expect(f.z).toBeLessThanOrEqual(10);
    const raised = { floorAt: (x, z) => (z > 5 ? 20 : 1.7), inWall: () => false };
    const g = createFlier({ yaw: 0 });
    run(g, 3000, { drive: 1 }, raised);
    expect(g.y).toBeGreaterThan(19);
  });
  it('turns her head by a drag, never past straight up', () => {
    const f = createFlier({ yaw: 350 });
    lookBy(f, 20, 200);
    expect(f.yaw).toBeCloseTo(10, 9);
    expect(f.pitch).toBe(85);
  });
  it('is carried by two fingers and tells how far she is from the middle', () => {
    const f = createFlier({ yaw: 90 });
    nudgeFlier(f, 30, 0, 5, open);
    expect(f.x).toBeCloseTo(30, 9);
    expect(f.y).toBeCloseTo(6.7, 9);
    expect(farFrom(f)).toBeCloseTo(30, 9);
  });
});
