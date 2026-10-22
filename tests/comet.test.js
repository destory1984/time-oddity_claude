import { describe, expect, it } from 'vitest';
import { cometAt, skyAt } from '../game/src/core/sky.js';

// JD 2363514.5 is 1758-12-25 0h UT (JPL Horizons' rows for that day).
const CHRISTMAS_1758 = 2363514.5;
const PROHLIS = { lat: 51.01, lon: 13.80 };

describe("Halley's comet", () => {
  it('is in the sky only on the days it came', () => {
    expect(cometAt(CHRISTMAS_1758)).not.toBeNull();
    expect(cometAt(2451545)).toBeNull();
  });

  it('is up in the evening of Christmas 1758 near Dresden, faint, with a short tail', () => {
    const sky = skyAt(CHRISTMAS_1758 + 18 / 24, PROHLIS);
    const [comet] = sky.comets;
    expect(sky.sun.alt).toBeLessThan(-12);
    expect(comet.alt).toBeGreaterThan(15);
    expect(comet.mag).toBeGreaterThan(6.5);
    expect(comet.tailDeg).toBeLessThan(3);
  });

  it('points its tail away from the sun', () => {
    const sky = skyAt(CHRISTMAS_1758 + 18 / 24, PROHLIS);
    const [comet] = sky.comets;
    // The sun is down in the south-west to west; the tail leans the other way from it.
    const headToSun = (sky.sun.az - comet.az + 540) % 360 - 180;
    const headToTail = (comet.tailAz - comet.az + 540) % 360 - 180;
    expect(Math.sign(headToTail)).not.toBe(Math.sign(headToSun));
  });
});
