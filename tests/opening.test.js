import { describe, expect, it } from 'vitest';
import { OPENING } from '../game/src/core/opening.js';
import { SQUARES, squareTitle } from '../game/src/core/squares.js';

describe('the opening', () => {
  it('is five pages, each with a picture, a line and a word from Sora', () => {
    expect(OPENING.length).toBe(5);
    for (const page of OPENING) {
      expect(page.image).toMatch(/^[a-z0-9-]+\.png$/);
      expect(page.text.length).toBeGreaterThan(5);
      expect(['scene', 'note']).toContain(page.kind);
    }
  });
  it('keeps Sora to 25 characters a line', () => {
    for (const page of OPENING) {
      expect(page.say.length, page.say).toBeGreaterThan(0);
      expect(page.say.length, page.say).toBeLessThanOrEqual(25);
    }
  });
  it('says nothing of volume 1, so that it stands alone', () => {
    for (const page of OPENING) for (const word of ['1권', '우주', '달에 갔', '수첩이 한 권 더']) expect(`${page.text} ${page.say}`.includes(word), word).toBe(false);
  });
});

describe('the first leaf', () => {
  it('is the yard of 1969, ahead of the numbered squares and named without a number', () => {
    expect(SQUARES[0].id).toBe('yard1969');
    // The yard is in what is now Sejong City (the user, 2026.10.7: "세종시로 옮기자"), a
    // hundred kilometres south of the palace of the Hunminjeongeum square.
    expect([SQUARES[0].lat, SQUARES[0].lon]).toEqual([36.48, 127.29]);
    expect(SQUARES[0].no).toBe(0);
    expect(squareTitle(SQUARES[0])).toBe('첫 장 이웃집 마당');
    expect(squareTitle(SQUARES[1])).toBe('대피라미드');
  });
  it('has a line for Sora when she looks up at the moon', () => {
    expect(SQUARES[0].soraSky).toBe('저 달에 지금 사람이 있는 거야?');
    for (const s of SQUARES) if (s.soraSky) expect(s.soraSky.length).toBeLessThanOrEqual(25);
  });
});
