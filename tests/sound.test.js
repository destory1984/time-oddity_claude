import { describe, expect, it } from 'vitest';
import { createSound } from '../game/src/ui/sound.js';

const playAll = (sound) => { sound.wake(); sound.tick(true, false); sound.tick(false, true); sound.paper(); sound.land(); sound.lift(); sound.hop(); sound.hand(); sound.stamp(); sound.bell(); sound.page(); sound.phonograph(); sound.step('stone', 0); sound.step('dirt', 1); sound.step('wood', 2); sound.air('market'); sound.airStep(60000); sound.air(null); sound.airStep(16); };

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
    // The jump brought over from volume 1: sixteen climbing bells, a chord of five, four chimes.
    const quiet = nodes;
    sound.warp();
    expect(nodes - quiet).toBeGreaterThan(50);
    // A place's own sounds come now and then, and footfalls as she walks.
    for (const kind of ['market', 'court', 'street', 'arena', 'works', 'palace', 'bridge', 'station', 'train', 'night', 'tv']) {
      const had = nodes;
      sound.air(kind);
      sound.airStep(60000);
      expect(nodes, kind).toBeGreaterThan(had);
    }
    sound.air('nowhere');
    const still = nodes;
    sound.airStep(60000);
    expect(nodes).toBe(still);
    sound.step('stone', 0);
    expect(nodes).toBeGreaterThan(still);
    sound.air('market');
    const before = nodes;
    sound.setMuted(true);
    sound.stamp(); sound.bell(); sound.page(); sound.warp(); sound.step('wood', 1); sound.airStep(60000);
    expect(nodes).toBe(before);
  });
});
