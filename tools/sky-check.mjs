// Checks whether astronomy-engine can compute the sky of this game's dates, back to 2560 BC.
// Run from the repository root:
//   npm i --no-save astronomy-engine
//   node tools/sky-check.mjs
// Results of the 2026.10.7 run are in docs/하늘-계산-확인.md.
import * as A from 'astronomy-engine';
import fs from 'node:fs';

// Julian or Gregorian calendar date (astronomical year: 0 = 1 BC) -> JD
function jd(y, m, d, julian) {
  if (m <= 2) { y -= 1; m += 12; }
  const b = julian ? 0 : 2 - Math.floor(y / 100) + Math.floor(Math.floor(y / 100) / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + b - 1524.5;
}
const T = (j) => A.MakeTime(j - 2451545.0);
// JD -> Julian calendar string
function julStr(j) {
  const z = Math.floor(j + 0.5), f = j + 0.5 - z;
  const b = z + 1524, c = Math.floor((b - 122.1) / 365.25), dd = Math.floor(365.25 * c);
  const e = Math.floor((b - dd) / 30.6001);
  const day = b - dd - Math.floor(30.6001 * e) + f;
  const mon = e < 14 ? e - 1 : e - 13, yr = mon > 2 ? c - 4716 : c - 4715;
  const h = (day % 1) * 24;
  return `${yr}.${mon}.${Math.floor(day)} ${String(Math.floor(h)).padStart(2, '0')}:${String(Math.floor((h % 1) * 60)).padStart(2, '0')} UT (Julian cal, astro year)`;
}
const tjd = (t) => t.ut + 2451545.0;
const phaseName = (deg) => `${deg.toFixed(1)}deg, lit ${(50 * (1 - Math.cos(deg * Math.PI / 180))).toFixed(0)}%`;
const out = (...a) => console.log(...a);

out('== 1. Thales eclipse, 585 BC May 28 (Julian) ==');
{
  const g = A.SearchGlobalSolarEclipse(T(jd(-584, 5, 1, true)));
  out(' global:', g.kind, julStr(tjd(g.peak)), 'lat', g.latitude?.toFixed(1), 'lon', g.longitude?.toFixed(1));
  for (const [name, lat, lon] of [['Halys mid (40N,35E)', 40, 35], ['Halys mouth (41.7N,36E)', 41.7, 36], ['Kirikkale (39.8N,33.5E)', 39.8, 33.5]]) {
    const l = A.SearchLocalSolarEclipse(T(jd(-584, 5, 1, true)), new A.Observer(lat, lon, 0));
    out(` local ${name}:`, l.kind, 'obscuration', l.obscuration.toFixed(3), 'peak', julStr(tjd(l.peak.time)), 'sun alt', l.peak.altitude.toFixed(1));
  }
  out(' deltaT (s):', (A.DeltaT_EspenakMeeus(T(jd(-584, 5, 28, true)).ut)).toFixed(0));
}

out('== 2. Columbus lunar eclipse, 1504 Feb 29 (Julian) ==');
{
  const e = A.SearchLunarEclipse(T(jd(1504, 2, 20, true)));
  out(' ', e.kind, 'peak', julStr(tjd(e.peak)), 'total semi-duration min', e.sd_total.toFixed(0), 'partial', e.sd_partial.toFixed(0));
  const obs = new A.Observer(18.44, -77.2, 0); // St Ann's Bay
  const hor = A.Horizon(e.peak, obs, ...(() => { const q = A.Equator(A.Body.Moon, e.peak, obs, true, true); return [q.ra, q.dec]; })(), 'normal');
  out('  moon altitude at peak from St Ann\'s Bay:', hor.altitude.toFixed(1), ' local mean time offset h:', (-77.2 / 15).toFixed(2));
}

out('== 3. "That day\'s moon" ==');
for (const [name, y, m, d, jul, hUT] of [
  ['1582.10.4 Rome (Julian) 19UT', 1582, 10, 4, true, 19],
  ['1582.10.15 Rome (Gregorian) 19UT', 1582, 10, 15, false, 19],
  ['1851.5.1 London 20UT', 1851, 5, 1, false, 20],
  ['1903.12.17 Kitty Hawk 15:35UT', 1903, 12, 17, false, 15.58],
  ['1969.7.21 02:56UT (Armstrong)', 1969, 7, 21, false, 2.93],
  ['1054.7.4 Kaifeng (Julian) 21UT(dawn 7.5)', 1054, 7, 4, true, 21],
]) {
  const t = T(jd(y, m, d, jul) + hUT / 24);
  out(` ${name}: moon phase ${phaseName(A.MoonPhase(t))}, JD ${tjd(t).toFixed(2)}`);
}
out(' JD(1582.10.15 G) - JD(1582.10.4 J) =', jd(1582, 10, 15, false) - jd(1582, 10, 4, true), 'day');
out(' weekday 1582.10.4 J:', ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][Math.floor(jd(1582, 10, 4, true) + 0.5) % 7],
  '/ 1582.10.15 G:', ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][Math.floor(jd(1582, 10, 15, false) + 0.5) % 7]);

out('== 4. Seoul 1969.7.21 (KST = UT+9) ==');
{
  const seoul = new A.Observer(37.57, 126.98, 0);
  const start = T(jd(1969, 7, 20, false) + 15 / 24); // 7.21 00:00 KST
  const kst = (t) => { const h = ((tjd(t) + 0.5 + 9 / 24) % 1) * 24; return `${Math.floor(h)}:${String(Math.round((h % 1) * 60)).padStart(2, '0')} KST`; };
  out('  sunrise', kst(A.SearchRiseSet(A.Body.Sun, seoul, +1, start, 1)), ' sunset', kst(A.SearchRiseSet(A.Body.Sun, seoul, -1, start, 1)));
  out('  moonrise', kst(A.SearchRiseSet(A.Body.Moon, seoul, +1, start, 1)), ' moonset', kst(A.SearchRiseSet(A.Body.Moon, seoul, -1, start, 1)));
  for (const [label, h] of [['05:17 KST landing', 20.3 - 24], ['11:56 KST first step', 2.93]]) {
    const t = T(jd(1969, 7, 21, false) + h / 24);
    const alt = (b) => { const q = A.Equator(b, t, seoul, true, true); return A.Horizon(t, seoul, q.ra, q.dec, 'normal').altitude.toFixed(1); };
    out(`  ${label}: sun alt ${alt(A.Body.Sun)}, moon alt ${alt(A.Body.Moon)}, phase ${phaseName(A.MoonPhase(t))}`);
  }
}

out('== 5. Planets far back: Jupiter-Saturn triple conjunction of 7 BC ==');
{
  const lon = (b, t) => A.Ecliptic(A.GeoVector(b, t, true)).elon;
  let prev = null;
  for (let j = jd(-6, 1, 1, true); j < jd(-5, 3, 1, true); j += 0.25) {
    const t = T(j); let d = lon(A.Body.Jupiter, t) - lon(A.Body.Saturn, t); d = ((d + 540) % 360) - 180;
    if (prev !== null && Math.sign(d) !== Math.sign(prev)) out('  longitude conjunction near', julStr(j), 'Jupiter lon(J2000)', lon(A.Body.Jupiter, t).toFixed(1));
    prev = d;
  }
  out('  (literature: 7 BC May 29, Sep 29/Oct 1, Dec 4/5, in Pisces)');
}

out('== 6. Other sky events on the list ==');
{
  const tr = A.SearchTransit(A.Body.Venus, T(jd(1769, 1, 1, false)));
  out('  Venus transit:', tr.start.date.toISOString(), '->', tr.finish.date.toISOString());
  const e1919 = A.SearchGlobalSolarEclipse(T(jd(1919, 5, 1, false)));
  out('  1919 eclipse:', e1919.kind, e1919.peak.date.toISOString(), 'lat', e1919.latitude.toFixed(1), 'lon', e1919.longitude.toFixed(1));
  const pr = A.SearchLocalSolarEclipse(T(jd(1919, 5, 1, false)), new A.Observer(1.67, 7.39, 0));
  out('  at Principe (Roca Sundy):', pr.kind, 'obscuration', pr.obscuration.toFixed(3), pr.peak.time.date.toISOString());
  // Galileo 1610.1.7 (Gregorian; Italy already used it): Jupiter and its moons
  const t = T(jd(1610, 1, 7, false) + 18 / 24);
  const jm = A.JupiterMoons(t);
  out('  1610.1.7 18UT Jupiter moons x (1e-3 AU):', ['io', 'europa', 'ganymede', 'callisto'].map((k) => `${k} ${(jm[k].x * 1e3).toFixed(2)}`).join(', '));
  out('  Jupiter constellation:', A.Constellation(A.Equator(A.Body.Jupiter, t, new A.Observer(45.4, 11.9, 0), false, true).ra, A.Equator(A.Body.Jupiter, t, new A.Observer(45.4, 11.9, 0), false, true).dec).name);
}

out('== 7. Precession: distance of Thuban and Polaris from the pole of date ==');
{
  const stars = { Thuban: [14.0732, 64.3758], Polaris: [2.5303, 89.2641] };
  for (const yr of [-2800, -2500, -2000, -1000, 0, 1000, 2000]) {
    const t = T(jd(yr, 1, 1, true));
    const rot = A.Rotation_EQJ_EQD(t);
    const row = Object.entries(stars).map(([n, [ra, dec]]) => {
      const v = A.VectorFromSphere(new A.Spherical(dec, ra * 15, 1), t);
      const s = A.SphereFromVector(A.RotateVector(rot, v));
      return `${n} ${(90 - s.lat).toFixed(2)}deg`;
    });
    out(`  year ${yr}: ${row.join(', ')}`);
  }
  out('  (literature: Thuban closest to the pole about 2800 BC, within ~0.2deg; no proper motion applied here)');
}

out('== 8. Range and speed ==');
{
  for (const yr of [-2560, -5000, -10000]) {
    try { const t = T(jd(yr, 6, 1, true)); out(`  year ${yr}: moon phase ${A.MoonPhase(t).toFixed(1)}, Jupiter lon ${A.Ecliptic(A.GeoVector(A.Body.Jupiter, t, true)).elon.toFixed(1)}, deltaT ${(t.tt - t.ut) * 86400 | 0}s`); } catch (e) { out(`  year ${yr}: ERROR ${e.message}`); }
  }
  const obs = new A.Observer(51.5, -0.17, 0); const bodies = [A.Body.Sun, A.Body.Moon, A.Body.Mercury, A.Body.Venus, A.Body.Mars, A.Body.Jupiter, A.Body.Saturn];
  const n = 2000, t0 = performance.now();
  for (let i = 0; i < n; i++) { const t = T(jd(1851, 5, 1, false) + i * 3.7 - 500000); for (const b of bodies) { const q = A.Equator(b, t, obs, true, true); A.Horizon(t, obs, q.ra, q.dec, 'normal'); } A.MoonPhase(t); }
  out(`  one full sky (sun, moon, 5 planets, alt/az + phase): ${((performance.now() - t0) / n).toFixed(3)} ms in Node`);
  const dir = 'node_modules/astronomy-engine/';
  for (const f of ['astronomy.browser.min.js', 'esm/astronomy.js']) { const b = fs.readFileSync(dir + f); out(`  ${f}: ${(b.length / 1024).toFixed(0)} KB`); }
  out('  version', JSON.parse(fs.readFileSync(dir + 'package.json')).version, 'license', JSON.parse(fs.readFileSync(dir + 'package.json')).license);
}
