import { defineConfig } from 'vitest/config';

// The game lives in game/ so that GitHub Pages, which serves the repository root as it
// is, never serves an unbuilt index.html. The built game goes to play/ and is committed.
export default defineConfig({
  root: 'game',
  base: './',
  build: { outDir: '../play', emptyOutDir: true },
  test: { root: '.', include: ['tests/**/*.test.js'] },
});
