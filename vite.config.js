import { existsSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { defineConfig } from 'vitest/config';
import { WALKS } from './game/src/core/walks.js';

const { version } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));
const built = new Date();

// The game lives in game/ so that GitHub Pages, which serves the repository root as it
// is, never serves an unbuilt index.html. The built game goes to play/ and is committed.
export default defineConfig({
  root: 'game',
  base: './',
  // Shown at the head of the settings: the version (one step up with every commit, as in
  // volume 1) and the day this was built.
  define: {
    __APP_VERSION__: JSON.stringify(version),
    __APP_UPDATED__: JSON.stringify(`${built.getFullYear()}.${built.getMonth() + 1}.${built.getDate()}`),
  },
  build: { outDir: '../play', emptyOutDir: true },
  plugins: [{
    // A scene of three depths is drawn from its -near and -far pictures; the one picture it was
    // cut from is not asked for by the game and is left out of what is built (20MB and more).
    // It stays in game/public: the tests and the tools that cut the depths read it there.
    name: 'leave-out-uncut-scenes',
    apply: 'build',
    closeBundle() {
      let n = 0;
      for (const place of Object.values(WALKS)) for (const scene of place.scenes) {
        const whole = new URL(`./play/walks/${place.dir}/${scene.id}.webp`, import.meta.url);
        if (scene.far && existsSync(whole)) { rmSync(whole); n += 1; }
      }
      console.log(`left out ${n} uncut scene pictures`);
      // The people, the things and Sora are asked for as WebP (tools/webp.py writes one beside
      // each PNG); the PNG is the original and is left out too (the user, 2026.10.13: the
      // originals stay in the repository for now).
      let png = 0;
      for (const top of ['walks', 'sora']) {
        const dir = new URL(`./play/${top}/`, import.meta.url);
        for (const name of readdirSync(dir, { recursive: true })) {
          const file = String(name);
          if (!file.endsWith('.png')) continue;
          if (existsSync(new URL(`${file.slice(0, -4)}.webp`.replaceAll(String.fromCharCode(92), '/'), dir))) { rmSync(new URL(file.replaceAll(String.fromCharCode(92), '/'), dir)); png += 1; }
        }
      }
      console.log(`left out ${png} PNG originals`);
    },
  }],
  test: { root: '.', include: ['tests/**/*.test.js'] },
});
