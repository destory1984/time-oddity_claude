import { describe, expect, it } from 'vitest';
import { createSound } from '../game/src/ui/sound.js';

const playAll = (sound) => { sound.wake(); sound.tick(true, false); sound.tick(false, true); sound.paper(); sound.dust(true, 700); sound.dust(false, 900); sound.hand(); sound.stamp(); sound.bell(); sound.page(); sound.phonograph(); sound.step('stone', 0); sound.step('dirt', 1); sound.step('wood', 2); sound.air('market'); sound.airStep(60000); sound.air('masons'); sound.airStep(60000); sound.air('works'); sound.airStep(60000); sound.air(null); sound.airStep(16); };

describe('createSound', () => {
  it('stays silent without throwing when the browser has no AudioContext', () => {
    expect(() => playAll(createSound(undefined))).not.toThrow();
  });
  it('stays silent without throwing when the AudioContext cannot be made', () => {
    const sound = createSound(class { constructor() { throw new Error('blocked'); } });
    expect(() => playAll(sound)).not.toThrow();
  });
  it('makes its AudioContext only when woken', () => {
    let made = 0;
    const sound = createSound(class { constructor() { made += 1; throw new Error('stop here'); } });
    sound.tick(false, false);
    expect(made).toBe(0);
    sound.wake();
    expect(made).toBe(1);
  });
});

describe('muting', () => {
  it('remembers whether it is muted', () => {
    const sound = createSound(undefined);
    expect(sound.muted()).toBe(false);
    sound.setMuted(true);
    expect(sound.muted()).toBe(true);
  });
  it('makes no sound nodes while muted', () => {
    let nodes = 0;
    const param = { setValueAtTime() {}, exponentialRampToValueAtTime() {}, value: 0 };
    const node = () => ({ connect() {}, start() {}, stop() {}, frequency: param, gain: param, Q: param });
    class Fake {
      constructor() { this.sampleRate = 100; this.currentTime = 0; this.state = 'running'; this.destination = {}; }
      createBuffer() { return { getChannelData: () => new Float32Array(30) }; }
      createBufferSource() { nodes += 1; return node(); }
      createBiquadFilter() { return node(); }
      createGain() { return node(); }
      createOscillator() { nodes += 1; return node(); }
    }
    const sound = createSound(Fake);
    sound.wake();
    sound.stamp();
    expect(nodes).toBeGreaterThan(0);
    // Star dust's sprinkle (till its recording has come, a hiss stands in).
    const quiet = nodes;
    sound.dust(true, 700);
    expect(nodes).toBeGreaterThan(quiet);
    // A place's own sounds come now and then, and footfalls as she walks.
    for (const kind of ['court', 'street', 'masons', 'chisels', 'arena', 'works', 'palace', 'bridge', 'station', 'train', 'night', 'tv']) {
      const had = nodes;
      sound.air(kind);
      sound.airStep(60000);
      expect(nodes, kind).toBeGreaterThan(had);
    }
    // A market has no sound of its own (no birds, coins or knocking on wood), nor has a place unknown.
    for (const kind of ['market', 'nowhere']) {
      sound.air(kind);
      const had = nodes;
      sound.airStep(60000);
      expect(nodes, kind).toBe(had);
    }
    const still = nodes;
    sound.step('stone', 0);
    expect(nodes).toBeGreaterThan(still);
    sound.air('court');
    const before = nodes;
    sound.setMuted(true);
    sound.stamp(); sound.bell(); sound.page(); sound.dust(false, 900); sound.step('wood', 1); sound.airStep(60000);
    expect(nodes).toBe(before);
  });
});
