// Makes game/src/data/stars.json: every star of magnitude 4.5 or brighter from the Yale
// Bright Star Catalogue, 5th edition (public data), as [raHours, decDeg, mag] at J2000,
// brightest first.
// Run from the repository root: node tools/make-stars.mjs
import { gunzipSync } from 'node:zlib';
import { writeFileSync } from 'node:fs';

const SOURCE = 'https://cdsarc.cds.unistra.fr/ftp/cats/V/50/catalog.gz';
const FAINTEST = 4.5;

const response = await fetch(SOURCE);
if (!response.ok) throw new Error(`Could not fetch the catalogue: HTTP ${response.status}`);
const text = gunzipSync(Buffer.from(await response.arrayBuffer())).toString('latin1');

// Fixed-width lines; columns are 1-based in the catalogue's ReadMe.
const field = (line, from, to) => line.slice(from - 1, to).trim();
const stars = [];
for (const line of text.split('\n')) {
  const raH = field(line, 76, 77);
  const mag = field(line, 103, 107);
  if (!raH || !mag) continue;   // a few entries are novae or removed objects without a position
  const ra = Number(raH) + Number(field(line, 78, 79)) / 60 + Number(field(line, 80, 83)) / 3600;
  const sign = field(line, 84, 84) === '-' ? -1 : 1;
  const dec = sign * (Number(field(line, 85, 86)) + Number(field(line, 87, 88)) / 60 + Number(field(line, 89, 90)) / 3600);
  if (Number(mag) <= FAINTEST) stars.push([Number(ra.toFixed(4)), Number(dec.toFixed(3)), Number(Number(mag).toFixed(2))]);
}
stars.sort((a, b) => a[2] - b[2]);
writeFileSync('game/src/data/stars.json', `[\n${stars.map((s) => JSON.stringify(s)).join(',\n')}\n]\n`);
console.log(`${stars.length} stars of magnitude ${FAINTEST} or brighter`);
