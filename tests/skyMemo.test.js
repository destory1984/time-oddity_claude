import { describe, expect, it } from 'vitest';
import { SQUARES, skyMemoOf, squareById } from '../game/src/core/squares.js';

describe('what grandmother wrote of the sky', () => {
  it('is the last sentence of her memo in the notebook', () => {
    expect(skyMemoOf(squareById('yard1969'))).toBe('그날 달은 초승에서 반달 사이.');
    expect(skyMemoOf(squareById('lunar1504'))).toBe('그날 달은 보름.');
    expect(skyMemoOf(squareById('khufu'))).toBe('그날 밤 북쪽 별은 투반.');
    expect(skyMemoOf(squareById('stonehenge'))).toBe('날을 몰라 달은 못 적음.');
  });
  it('speaks of the moon or a star for every square, short enough for the slip', () => {
    for (const s of SQUARES) {
      const line = skyMemoOf(s);
      expect(/달|별/.test(line), `${s.id}: ${line}`).toBe(true);
      expect(line.length, `${s.id}: ${line}`).toBeLessThanOrEqual(25);
      expect(line.endsWith('.'), s.id).toBe(true);
      expect(s.noteMemo.endsWith(line), s.id).toBe(true);
    }
  });
});
