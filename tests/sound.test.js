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
