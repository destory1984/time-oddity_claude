// The sky of one moment at one place, computed: sun, moon, the five naked-eye planets
// and the bright stars as altitude and azimuth in degrees (azimuth 0 north, 90 east).
// Nothing here is made up; see docs/하늘-계산-확인.md for what it was checked against.
import {
  AngleBetween, Body, Equator, Horizon, Illumination, MoonPhase, Observer, Rotation_EQD_HOR, Rotation_EQJ_EQD, CombineRotation,
  SearchLunarEclipse,
} from 'astronomy-engine';
import STAR_LIST from '../data/stars.json';
import { astroTime } from './when.js';

const RAD = Math.PI / 180;
const J2000_JD = 2451545.0;
const PARTIAL_DEPTH = 0.5;   // the deepest a partial lunar eclipse is painted
const KM_PER_AU = 149597870.7;
const SUN_KM = 695700;       // radii
const MOON_KM = 1737.4;

const PLANETS = [
  { id: 'mercury', name: '수성', body: Body.Mercury },
  { id: 'venus', name: '금성', body: Body.Venus },
  { id: 'mars', name: '화성', body: Body.Mars },
  { id: 'jupiter', name: '목성', body: Body.Jupiter },
  { id: 'saturn', name: '토성', body: Body.Saturn },
];

// Unit vectors of the stars in the J2000 equator, made once.
const STAR_VECTORS = STAR_LIST.map(([raHours, decDeg, mag]) => {
  const ra = raHours * 15 * RAD;
  const dec = decDeg * RAD;
  return { x: Math.cos(dec) * Math.cos(ra), y: Math.cos(dec) * Math.sin(ra), z: Math.sin(dec), mag };
});

const wrap180 = (deg) => ((deg + 540) % 360) - 180;

function place(body, time, observer) {
  const equator = Equator(body, time, observer, true, true);
  const { altitude, azimuth } = Horizon(time, observer, equator.ra, equator.dec, 'normal');
  return { alt: altitude, az: azimuth, vec: equator.vec, dist: equator.dist };
}

// The moon before the sun, as seen from the observer's own place (both were placed from
// there, so the moon's parallax is in): how much of the sun's disc is covered, 0 to 1 by
// area, how large the moon's disc is beside the sun's, and where its middle lies from the
// sun's on screen, in sun radii (x right, toward more azimuth; y up).
function sunCover(sun, moon) {
  const sunR = Math.asin(SUN_KM / (sun.dist * KM_PER_AU)) / RAD;
  const moonR = Math.asin(MOON_KM / (moon.dist * KM_PER_AU)) / RAD;
  const apart = AngleBetween(sun.vec, moon.vec);
  if (apart >= sunR + moonR) return { cover: 0, moonSize: moonR / sunR, moonX: 0, moonY: 0 };
  let cover;
  if (apart <= Math.abs(moonR - sunR)) cover = moonR >= sunR ? 1 : (moonR / sunR) ** 2;
  else {
    // The lens two circles share.
    const a = Math.acos((apart * apart + sunR * sunR - moonR * moonR) / (2 * apart * sunR));
    const b = Math.acos((apart * apart + moonR * moonR - sunR * sunR) / (2 * apart * moonR));
    cover = (sunR * sunR * (a - Math.sin(2 * a) / 2) + moonR * moonR * (b - Math.sin(2 * b) / 2)) / (Math.PI * sunR * sunR);
  }
  const right = wrap180(moon.az - sun.az) * Math.cos(sun.alt * RAD);
  const up = moon.alt - sun.alt;
  const length = Math.hypot(right, up) || 1;
  return { cover, moonSize: moonR / sunR, moonX: (right / length) * (apart / sunR), moonY: (up / length) * (apart / sunR) };
}

// Stars are turned from J2000 to the equator of the date (precession and nutation), then
// to the horizon, in one matrix. No proper motion and no refraction: over 4,600 years the
// fastest bright stars are off by a degree or two, and refraction only matters within a
// degree of the horizon.
function starsAt(time, observer) {
  const { rot } = CombineRotation(Rotation_EQJ_EQD(time), Rotation_EQD_HOR(time, observer));
  return STAR_VECTORS.map(({ x, y, z, mag }) => {
    // Horizontal axes: x north, y west, z zenith.
    const north = rot[0][0] * x + rot[1][0] * y + rot[2][0] * z;
    const west = rot[0][1] * x + rot[1][1] * y + rot[2][1] * z;
    const up = rot[0][2] * x + rot[1][2] * y + rot[2][2] * z;
    return { alt: Math.asin(Math.max(-1, Math.min(1, up))) / RAD, az: (Math.atan2(-west, north) / RAD + 360) % 360, mag };
  });
}

// How deep the moon is in the Earth's shadow: 0 until the partial phase begins, 1 from
// the start of totality to its end. Looked for only near full moon, and the eclipse
// found is remembered while the moment stays within a day of it.
let eclipseSeen = null;
function eclipseDepth(jd, time, phaseDeg) {
  if (Math.abs(phaseDeg - 180) > 10) return 0;
  if (!eclipseSeen || Math.abs(jd - eclipseSeen.searchedJd) > 1) {
    const found = SearchLunarEclipse(astroTime(jd - 1));
    eclipseSeen = {
      searchedJd: jd, peakJd: found.peak.ut + J2000_JD, partialMin: found.sd_partial, totalMin: found.sd_total,
    };
  }
  const { peakJd, partialMin, totalMin } = eclipseSeen;
  if (partialMin <= 0) return 0;
  const fromPeakMin = Math.abs(jd - peakJd) * 1440;
  if (fromPeakMin >= partialMin) return 0;
  if (fromPeakMin <= totalMin) return 1;
  const depth = (partialMin - fromPeakMin) / (partialMin - totalMin);
  // An eclipse that never becomes total never turns the whole moon red.
  return totalMin > 0 ? depth : depth * PARTIAL_DEPTH;
}

export function skyAt(jd, { lat, lon }) {
  const time = astroTime(jd);
  const observer = new Observer(lat, lon, 0);
  const sunPlace = place(Body.Sun, time, observer);
  const moonPlace = place(Body.Moon, time, observer);
  const sun = { alt: sunPlace.alt, az: sunPlace.az, ...sunCover(sunPlace, moonPlace) };
  const phaseDeg = MoonPhase(time);
  const moon = {
    alt: moonPlace.alt, az: moonPlace.az,
    lit: Illumination(Body.Moon, time).phase_fraction,
    waxing: phaseDeg < 180,
    // On screen, from the moon toward the sun: 0 is right (more azimuth), pi/2 is up.
    towardSun: Math.atan2(sun.alt - moonPlace.alt, wrap180(sun.az - moonPlace.az) * Math.cos(moonPlace.alt * RAD)),
    eclipse: eclipseDepth(jd, time, phaseDeg),
  };
  const planets = PLANETS.map(({ id, name, body }) => {
    const { alt, az } = place(body, time, observer);
    return { id, name, alt, az, mag: Illumination(body, time).mag };
  });
  return { sun, moon, planets, stars: starsAt(time, observer) };
}

const clamp01 = (v) => Math.max(0, Math.min(1, v));

const smoothstep = (lo, hi, v) => { const t = clamp01((v - lo) / (hi - lo)); return t * t * (3 - 2 * t); };
const TOTAL_DAY = 0.3;      // how light the sky stays under a wholly covered sun: a deep dusk
const TOTAL_STARS = 0.5;    // and how far the stars come out

// day: 1 with the sun up, 0 once it is 12 degrees down. stars: 0 until the sun is 6
// degrees down, 1 once it is 12 down. cover: how much of the sun the moon hides (0 to 1).
// The eye hardly notices until most of the sun is gone; then the light falls fast, and
// the planets and bright stars show only in the last moments.
export function skyLight(sunAlt, cover = 0) {
  const day = clamp01(1 + sunAlt / 12);
  const stars = clamp01((-6 - sunAlt) / 6);
  if (cover <= 0) return { day, stars };
  return {
    day: day * (1 - (1 - TOTAL_DAY) * smoothstep(0.55, 1, cover) ** 2),
    stars: Math.max(stars, day * TOTAL_STARS * smoothstep(0.985, 1, cover)),
  };
}
