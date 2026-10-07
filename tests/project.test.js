import { describe, expect, it } from 'vitest';
import { maxPitchDeg, project } from '../game/src/core/project.js';

const view = { facingAz: 180, pitch: 0, w: 375, h: 812 };

describe('project', () => {
  it('puts the horizon straight ahead at 60% of the height', () => {
    const p = project(0, 180, view);
    expect(p.front).toBe(true);
    expect(p.x).toBeCloseTo(187.5, 1);
    expect(p.y).toBeCloseTo(487.2, 1);
  });
  it('shows 60 degrees across, with more azimuth to the right', () => {
    expect(project(0, 210, view).x).toBeCloseTo(375, 0);
    expect(project(0, 150, view).x).toBeCloseTo(0, 0);
  });
  it('lowers the horizon to 85% when the head is fully raised', () => {
    expect(project(0, 180, { ...view, pitch: 1 }).y).toBeCloseTo(690.2, 1);
    expect(maxPitchDeg(375, 812)).toBeCloseTo(32.0, 0);
  });
  it('puts higher things higher and marks what is behind', () => {
    expect(project(30, 180, view).y).toBeLessThan(487);
    expect(project(10, 0, view).front).toBe(false);
  });
  it('wraps azimuth through north', () => {
    const north = { ...view, facingAz: 0 };
    expect(project(0, 350, north).x).toBeLessThan(187.5);
    expect(project(0, 10, north).x).toBeGreaterThan(187.5);
    expect(project(0, 350, north).front).toBe(true);
  });
  it('keeps the same proportions on another screen', () => {
    const wide = { facingAz: 180, pitch: 0, w: 800, h: 600 };
    expect(project(0, 180, wide).y).toBeCloseTo(360, 1);
    expect(project(0, 210, wide).x).toBeCloseTo(800, 0);
    expect(project(0, 180, { ...wide, pitch: 1 }).y).toBeCloseTo(510, 1);
  });
});
