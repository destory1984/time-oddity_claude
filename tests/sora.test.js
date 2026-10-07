import { describe, expect, it } from 'vitest';
import { HUSH_S, soraPose } from '../game/src/core/sora.js';

describe('Sora', () => {
  it('idles through her four frames when nothing is happening', () => {
    const frames = [0, 300, 600, 900, 1200, 1500].map((now) => soraPose({ now, hushAt: null }));
    expect(frames.every((p) => p.sheet === 'idle')).toBe(true);
    expect(new Set(frames.map((p) => p.frame))).toEqual(new Set([1, 2, 3, 4]));
  });
  it('puts a finger to her lips once, holds it, and says hush for three seconds', () => {
    expect(HUSH_S).toBe(3);
    const at = (ms) => soraPose({ now: 10000 + ms, hushAt: 10000 });
    expect(at(0)).toEqual({ sheet: 'see-hush', frame: 1, saying: '쉬잇~' });
    expect(at(400).frame).toBeGreaterThan(1);
    expect(at(1500)).toEqual({ sheet: 'see-hush', frame: 4, saying: '쉬잇~' });
    expect(at(2900)).toEqual({ sheet: 'see-hush', frame: 4, saying: '쉬잇~' });
  });
  it('goes back to idling afterwards', () => {
    const pose = soraPose({ now: 13100, hushAt: 10000 });
    expect(pose.sheet).toBe('idle');
    expect(pose.saying).toBe(null);
  });
});
