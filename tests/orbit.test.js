import { describe, expect, it } from 'vitest';
import { SITES } from '../game/src/core/sites.js';
import { WALL_TOP, inWall, ringPlace, toLocal } from '../game/src/core/colosseum.js';
import { TILT_LEAST, TILT_MOST, createView, nearView, standAt, stepView, turnView, wanted } from '../game/src/core/orbit.js';

const round = { x: 0, y: 10, z: 0, around: 180, tilt: 0, far: 100, least: 50, most: 200 };
const spots = [{ id: 'in', x: 1, y: 2, z: 3, yaw: 90, pitch: 10 }];

describe('going round a place', () => {
  it('stands on a circle about the middle and faces it', () => {
    const eye = wanted(createView({ round, spots }));
    expect(eye.x).toBeCloseTo(0, 9);
    expect(eye.z).toBeCloseTo(-100, 9);   // south of the middle
    expect(eye.y).toBeCloseTo(10, 9);
    expect(eye.yaw).toBeCloseTo(0, 9);    // looking north, at it
    expect(eye.pitch).toBeCloseTo(0, 9);
  });
  it('looks down at the middle from as high as it has risen', () => {
    const view = createView({ round: { ...round, tilt: 30 }, spots });
    const eye = wanted(view);
    expect(eye.y).toBeCloseTo(60, 9);
    expect(eye.pitch).toBe(-30);
    expect(Math.hypot(eye.x, eye.z)).toBeCloseTo(100 * Math.cos(Math.PI / 6), 9);
  });
  it('turns the scene the way it is dragged, and rises when dragged down', () => {
    const view = createView({ round, spots });
    turnView(view, 30, 20);
    expect(view.round.around).toBe(150);
    expect(view.round.tilt).toBe(20);
    turnView(view, 0, -500);
    expect(view.round.tilt).toBe(TILT_LEAST);
    turnView(view, 0, 500);
    expect(view.round.tilt).toBe(TILT_MOST);
  });
  it('comes no closer and draws no farther back than the place allows', () => {
    const view = createView({ round, spots });
    nearView(view, -500);
    expect(view.round.far).toBe(50);
    nearView(view, 500);
    expect(view.round.far).toBe(200);
  });
  it('stands at a spot and only turns its head there', () => {
    const view = createView({ round, spots });
    standAt(view, 'in');
    expect(wanted(view)).toEqual({ x: 1, y: 2, z: 3, yaw: 90, pitch: 10 });
    turnView(view, 20, 5);
    nearView(view, -40);
    expect(wanted(view)).toEqual({ x: 1, y: 2, z: 3, yaw: 70, pitch: 15 });
    standAt(view, 'nowhere');
    expect(view.at).toBe('in');
    standAt(view, 'round');
    expect(wanted(view).z).toBeCloseTo(-100, 9);
  });
  it('is carried to where it is wanted, not thrown there', () => {
    const view = createView({ round, spots });
    standAt(view, 'in');
    const first = { ...stepView(view, 16) };
    expect(first.z).toBeLessThan(-80);
    for (let t = 0; t < 3000; t += 16) stepView(view, 16);
    expect(view.eye.x).toBeCloseTo(1, 3);
    expect(view.eye.yaw).toBeCloseTo(90, 2);
  });
});

describe('the eye at the Colosseum', () => {
  const { round: ring, spots: stand } = SITES.colosseum;
  it('is never inside the stone, however it goes round', () => {
    for (const far of [ring.least, ring.far, ring.most]) {
      for (let tilt = TILT_LEAST; tilt <= TILT_MOST; tilt += 3) {
        for (let around = 0; around < 360; around += 15) {
          const eye = wanted(createView({ round: { ...ring, far, tilt, around }, spots: stand }));
          const local = toLocal(eye.x, eye.z);
          const outside = ringPlace(local.x, local.z).d < -20;
          expect(outside || eye.y > WALL_TOP + 2, `${far} ${tilt} ${around}`).toBe(true);
        }
      }
    }
  });
  it('has spots that are in the open air', () => {
    for (const spot of stand) {
      const local = toLocal(spot.x, spot.z);
      expect(inWall(local.x, local.z, spot.y, 80), spot.id).toBe(false);
      expect(spot.label.length, spot.id).toBeLessThanOrEqual(6);
    }
  });
});
