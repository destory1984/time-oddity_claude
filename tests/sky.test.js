import { describe, expect, it } from 'vitest';
import stars from '../game/src/data/stars.json';
import { squareById } from '../game/src/core/squares.js';
import { momentJd } from '../game/src/core/moment.js';
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
