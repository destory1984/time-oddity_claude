import { describe, expect, it } from 'vitest';
import { createLook, dragLook, endLook, resetLook } from '../game/src/core/look.js';

describe('the finger that raises the head', () => {
  it('raises the head as the finger moves up a quarter of the screen', () => {
    const look = createLook();
    dragLook(look, -0.125);
    expect(look.target).toBeCloseTo(0.5, 5);
    dragLook(look, -0.5);
    expect(look.target).toBe(1);
  });
  it('stays up or down where it was left', () => {
    const look = createLook();
    dragLook(look, -0.2); endLook(look);
    expect(look.target).toBe(1);
    dragLook(look, 0.2); endLook(look);
    expect(look.target).toBe(0);
  });
  it('does not swing up on a plain tap after arriving somewhere new with the head left up', () => {
    const look = createLook();
    dragLook(look, -0.3); endLook(look);
    resetLook(look);
    endLook(look);   // a tap: finger down and up without moving
    expect(look.target).toBe(0);
  });
});
