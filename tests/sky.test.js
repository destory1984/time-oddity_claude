import { describe, expect, it } from 'vitest';
import stars from '../game/src/data/stars.json';
import { squareById } from '../game/src/core/squares.js';
import { leadDays, momentJd } from '../game/src/core/moment.js';
import { skyAt, skyLight } from '../game/src/core/sky.js';

const today = { year: 2026, month: 10, day: 7 };
const sky = (id, dial) => skyAt(momentJd(squareById(id), dial, today), squareById(id));

describe('the star list', () => {
  it('holds the stars of magnitude 4.5 or brighter', () => {
    expect(stars.length).toBeGreaterThan(700);
    expect(stars.length).toBeLessThan(1100);
    expect(Math.max(...stars.map((s) => s[2]))).toBeLessThanOrEqual(4.5);
  });
  it('has Sirius and Thuban where they are', () => {
    const near = (ra, dec) => stars.find(([r, d]) => Math.abs(r - ra) < 0.01 && Math.abs(d - dec) < 0.05);
    expect(near(6.7525, -16.716)[2]).toBeCloseTo(-1.46, 1);
    expect(near(14.0732, 64.376)[2]).toBeCloseTo(3.65, 1);
  });
});

describe('skyAt', () => {
  it('puts Thuban over the north point at Giza in 2560 BC', () => {
    const khufu = sky('khufu', { year: -2560 });
    expect(khufu.sun.alt).toBeCloseTo(-36.2, 0);
    const pole = khufu.stars.filter((s) => s.alt > 29 && s.alt < 33 && (s.az < 3 || s.az > 357));
    expect(pole.length).toBeGreaterThan(0);
    expect(khufu.stars.length).toBe(stars.length);
  });
  it('shows a totally eclipsed full moon low in the east over Jamaica in 1504', () => {
    const { moon } = sky('lunar1504', { year: 1504 });
    expect(moon.alt).toBeCloseTo(19.4, 0);
    expect(moon.az).toBeCloseTo(92.2, 0);
    expect(moon.eclipse).toBe(1);
    expect(moon.lit).toBeGreaterThan(0.99);
  });
  it('is partly eclipsed an hour before the middle of the eclipse', () => {
    const { moon } = skyAt(2270453.5278 - 60 / 1440, squareById('lunar1504'));
    expect(moon.eclipse).toBeGreaterThan(0);
    expect(moon.eclipse).toBeLessThan(1);
  });
  it('has no moon to speak of on the day the Crystal Palace opened', () => {
    const noon = sky('crystalPalace', { year: 1851 });
    expect(noon.sun.alt).toBeCloseTo(53.5, 0);
    expect(noon.moon.lit).toBeLessThan(0.01);
    expect(noon.moon.eclipse).toBe(0);
  });
  it('has Jupiter in the south-east over London that night', () => {
    const night = sky('crystalPalace', { year: 1851, night: 1 });
    expect(night.sun.alt).toBeCloseTo(-12.6, 0);
    const jupiter = night.planets.find((p) => p.id === 'jupiter');
    expect(jupiter.name).toBe('목성');
    expect(jupiter.alt).toBeCloseTo(31.2, 0);
    expect(jupiter.az).toBeCloseTo(155.9, 0);
    expect(night.planets.map((p) => p.id)).toEqual(['mercury', 'venus', 'mars', 'jupiter', 'saturn']);
  });
  it('has a thin waning moon on the morning of the first flight', () => {
    const { moon } = sky('kittyHawk', { year: 1903 });
    expect(moon.lit).toBeCloseTo(0.017, 2);
    expect(moon.waxing).toBe(false);
  });
  it('points the lit side of the moon toward the sun', () => {
    // 1969.7.21 02:56 UT over Seoul: the sun is high and to the right of a moon just risen in the east.
    const { moon, sun } = skyAt(2440423.6222, { lat: 37.57, lon: 126.98 });
    expect(sun.alt).toBeGreaterThan(moon.alt);
    expect(Math.sin(moon.towardSun)).toBeGreaterThan(0);
  });
});

describe('skyLight', () => {
  it('is day above the horizon and night below -12 degrees', () => {
    expect(skyLight(5)).toEqual({ day: 1, stars: 0 });
    expect(skyLight(-20)).toEqual({ day: 0, stars: 1 });
  });
  it('fades between', () => {
    expect(skyLight(-6).day).toBeCloseTo(0.5, 5);
    expect(skyLight(-6).stars).toBe(0);
    expect(skyLight(-9).stars).toBeCloseTo(0.5, 5);
  });
});

describe('a partial lunar eclipse', () => {
  it('is never painted as deep as a total one', () => {
    // 2023.10.28 20:14 UT: 12% of the moon in the umbra at most.
    const { moon } = skyAt(2460246.343, { lat: 51.5, lon: -0.17 });
    expect(moon.eclipse).toBeGreaterThan(0);
    expect(moon.eclipse).toBeLessThan(0.7);
  });
});

describe('the moon before the sun', () => {
  const thales = squareById('thales');
  it('hides all of the sun over the Halys at the moment of the square', () => {
    const { sun } = sky('thales', { year: -585 });
    expect(sun.cover).toBe(1);
    expect(sun.alt).toBeCloseTo(17.6, 0);
    expect(sun.az).toBeCloseTo(282, 0);
    expect(sun.moonSize).toBeGreaterThan(1);
    expect(Math.hypot(sun.moonX, sun.moonY)).toBeLessThan(sun.moonSize - 1);
  });
  it('has taken a bite half an hour before, from the lower right', () => {
    const { sun } = skyAt(momentJd(thales, { year: -585 }, today) + leadDays(thales, 0), thales);
    expect(sun.cover).toBeGreaterThan(0.3);
    expect(sun.cover).toBeLessThan(0.8);
    expect(Math.hypot(sun.moonX, sun.moonY)).toBeGreaterThan(0.5);
  });
  it('is not total further up the river, by the same computation', () => {
    const { sun } = skyAt(1507900.13222, { lat: 38.72, lon: 34.85 });
    expect(sun.cover).toBeGreaterThan(0.95);
    expect(sun.cover).toBeLessThan(1);
  });
  it('was total on Principe in 1919', () => {
    // 1919.5.29 14:15 UT.
    expect(skyAt(2422108.0938, { lat: 1.67, lon: 7.39 }).sun.cover).toBe(1);
  });
  it('covers nothing on an ordinary new moon', () => {
    expect(sky('crystalPalace', { year: 1851 }).sun.cover).toBe(0);
  });
  it('darkens the day to a deep dusk and lets the bright stars out only at the end', () => {
    expect(skyLight(17, 0.5)).toEqual({ day: 1, stars: 0 });
    expect(skyLight(17, 0.9).day).toBeGreaterThan(0.4);
    expect(skyLight(17, 0.9).stars).toBe(0);
    expect(skyLight(17, 1).day).toBeCloseTo(0.3, 5);
    expect(skyLight(17, 1).stars).toBeCloseTo(0.5, 5);
    expect(skyLight(-20, 1)).toEqual({ day: 0, stars: 1 });
  });
});

describe('leadDays', () => {
  const thales = squareById('thales');
  it('starts the square thirty minutes early and has caught up by 6.5 seconds', () => {
    expect(leadDays(thales, 0)).toBeCloseTo(-30 / 1440, 9);
    expect(leadDays(thales, 3750)).toBeCloseTo(-15 / 1440, 9);
    expect(leadDays(thales, 6500)).toBeCloseTo(0, 12);
    expect(leadDays(thales, 60000)).toBeCloseTo(0, 12);
  });
  it('is nothing for a square without a lead', () => {
    expect(leadDays(squareById('khufu'), 0)).toBe(0);
  });
});
