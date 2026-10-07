import { describe, expect, it } from 'vitest';
import { createSound } from '../game/src/ui/sound.js';

const playAll = (sound) => { sound.wake(); sound.tick(true, false); sound.tick(false, true); sound.paper(); sound.stamp(); sound.bell(); sound.page(); };

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
    const before = nodes;
    sound.setMuted(true);
    sound.stamp(); sound.bell(); sound.page();
    expect(nodes).toBe(before);
  });
});
