import { describe, expect, it } from 'vitest';
import { ZOOM_MAX, ZOOM_MIN, ZOOM_STEP, zoomBy } from '../game/src/core/zoom.js';

describe('the globe\'s zoom', () => {
  it('starts whole and grows by a factor', () => {
    expect(ZOOM_MIN).toBe(1);
    expect(zoomBy(1, 2)).toBe(2);
    expect(zoomBy(2, 0.5)).toBe(1);
  });
  it('stays between the whole Earth and eight times that', () => {
    expect(ZOOM_MAX).toBe(8);
    expect(zoomBy(1, 0.5)).toBe(1);
    expect(zoomBy(5, 2)).toBe(8);
    expect(zoomBy(8, 1.01)).toBe(8);
  });
  it('reaches the closest view in three presses of the button and comes back in three', () => {
    let z = 1;
    for (let i = 0; i < 3; i++) z = zoomBy(z, ZOOM_STEP);
    expect(z).toBeCloseTo(8, 6);
    for (let i = 0; i < 3; i++) z = zoomBy(z, 1 / ZOOM_STEP);
    expect(z).toBeCloseTo(1, 6);
  });
  it('ignores a factor that is not a positive number', () => {
    for (const bad of [0, -1, NaN, Infinity, undefined]) expect(zoomBy(2, bad)).toBe(2);
  });
});
