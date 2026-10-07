import { readFileSync } from 'node:fs';
import { defineConfig } from 'vitest/config';

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
  test: { root: '.', include: ['tests/**/*.test.js'] },
});
