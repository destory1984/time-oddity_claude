import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { CHANGES, STARTED, changesUntil, dayLabel, startedLine } from '../game/src/core/changes.js';
import { TEXT_SIZES, canResize, nextTextSize, textSizeFrom } from '../game/src/core/textSize.js';

describe('the changes page', () => {
  it('has one plain line each, 10 to 70 characters, none twice', () => {
    for (const { text } of CHANGES) {
      expect(text.length, text).toBeGreaterThanOrEqual(10);
      expect(text.length, text).toBeLessThanOrEqual(70);
      expect(text.endsWith('니다.') || text.endsWith('니다'), text).toBe(true);
    }
    expect(new Set(CHANGES.map((c) => c.text)).size).toBe(CHANGES.length);
  });
  // The same lines are kept for reading on GitHub (the user, 2026.10.9: "게임에도 당연히
  // 넣지만, 깃헙에도 남겨놔야지"). tools/changes-doc.py writes them; tools/release.py runs it.
  it('is written out in docs/바뀐-것들.md, every line of it', () => {
    const doc = readFileSync(new URL('../docs/바뀐-것들.md', import.meta.url), 'utf8');
    for (const { text } of CHANGES) expect(doc.includes(`- ${text}
`), text).toBe(true);
  });
  it('runs from the newest day back to the day the making began', () => {
    const days = CHANGES.map((c) => c.day);
    expect([...days].sort().reverse()).toEqual(days);
    expect(days.at(-1)).toBe(STARTED);
    for (const day of days) expect(day).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
  it('does not show a change dated after today', () => {
    const list = [{ day: '2026-10-09', text: 'x' }, { day: '2026-10-07', text: 'y' }];
    expect(changesUntil('2026-10-08', list)).toEqual([list[1]]);
    expect(changesUntil('2026-10-09', list)).toEqual(list);
  });
  it('labels a day and counts the days since the making began', () => {
    expect(dayLabel('2026-10-07')).toBe('10.7');
    expect(startedLine('2026-10-07')).toBe('만들기 시작한 날: 2026년 10월 7일\n시간 여행 오늘로 1일째');
    expect(startedLine('2026-10-16')).toContain('오늘로 10일째');
  });
});

describe('text size', () => {
  it('has five sizes and falls back to 1 for anything else', () => {
    expect(TEXT_SIZES).toEqual([0.85, 1, 1.15, 1.3, 1.5]);
    expect(textSizeFrom('1.3')).toBe(1.3);
    expect(textSizeFrom('7')).toBe(1);
    expect(textSizeFrom(null)).toBe(1);
  });
  it('steps one size at a time and stops at the ends', () => {
    expect(nextTextSize(1, 1)).toBe(1.15);
    expect(nextTextSize(1, -1)).toBe(0.85);
    expect(nextTextSize(1.5, 1)).toBe(1.5);
    expect(canResize(1.5, 1)).toBe(false);
    expect(canResize(0.85, -1)).toBe(false);
    expect(canResize(1, 1)).toBe(true);
  });
});
