// Writes game/src/core/layers.js from the pictures that are there: for each scene of a place,
// whether its picture is cut in two (<scene>-near.webp, <scene>-far.webp) and what stands
// nearest the eye (fore-<scene>-t1.webp, -t2 hung from above, -f1, -f2 stood on their foot).
// Run from the repository root after adding such pictures: node tools/layers.mjs
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';

// How wide a far picture is to its height (the far goes by the more slowly the narrower it is):
// read from the head of the file (a plain lossy WebP), else 1.
function aspectOf(path) {
  const b = readFileSync(path);
  if (b.toString('latin1', 12, 16) !== 'VP8 ') return 1;
  const w = b.readUInt16LE(26) & 0x3fff, h = b.readUInt16LE(28) & 0x3fff;
  return h ? Math.round((w / h) * 1000) / 1000 : 1;
}

const root = 'game/public/walks/';
const out = {};
for (const dir of readdirSync(root).sort()) {
  const files = new Set(readdirSync(root + dir));
  const scenes = [...files].filter((f) => f.endsWith('-near.webp')).map((f) => f.slice(0, -10));
  for (const f of files) { const m = f.match(/^fore-(.+)-[tf]\d\.webp$/); if (m && !scenes.includes(m[1])) scenes.push(m[1]); }
  for (const scene of scenes.sort()) {
    const entry = {};
    if (files.has(`${scene}-near.webp`) && files.has(`${scene}-far.webp`)) entry.far = { aspect: aspectOf(`${root}${dir}/${scene}-far.webp`) };
    const tops = [1, 2].map((i) => `fore-${scene}-t${i}`).filter((n) => files.has(`${n}.webp`));
    const feet = [1, 2].map((i) => `fore-${scene}-f${i}`).filter((n) => files.has(`${n}.webp`));
    if (tops.length && feet.length) {
      const t = (i) => tops[i % tops.length], f = (i) => feet[i % feet.length];
      entry.fore = [
        { src: t(0), webp: true, x: 0.1, at: 'top', tall: 0.38 }, { src: f(0), webp: true, x: 0.27, at: 'foot', tall: 0.21 },
        { src: t(1), webp: true, x: 0.45, at: 'top', tall: 0.36 }, { src: f(1), webp: true, x: 0.62, at: 'foot', tall: 0.18 },
        { src: t(0), webp: true, x: 0.8, at: 'top', tall: 0.34 }, { src: f(0), webp: true, x: 0.95, at: 'foot', tall: 0.19 },
      ];
    }
    if (entry.far || entry.fore) out[`${dir}/${scene}`] = entry;
  }
}
const body = Object.entries(out).map(([k, v]) => `  '${k}': ${JSON.stringify(v).replace(/"(\w+)":/g, '$1: ').replace(/"/g, "'").replace(/,(?=\S)/g, ', ')},`).join('\n');
writeFileSync('game/src/core/layers.js', `// Written by tools/layers.mjs from the pictures in public/walks: not by hand.
// For each scene (by '<dir>/<scene id>'): its far (ui/walk.js) and what stands nearest the eye.
// A scene that gives its own \`far\` or \`fore\` in core/walks.js keeps that.
export const LAYERS = {
${body}
};
`);
console.log(Object.keys(out).length, 'scenes');
