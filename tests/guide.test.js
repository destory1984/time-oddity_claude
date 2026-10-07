import { describe, expect, it } from 'vitest';
import { guideLine } from '../game/src/core/guide.js';

const none = { day: false, sky: false, remains: false };
const ground = (over) => guideLine({ where: 'ground', dots: none, at: 'then', lookingUp: false, quizSolved: false, complete: 0, visited: 0, total: 4, ...over });
const globe = (over) => guideLine({ where: 'globe', complete: 0, visited: 0, total: 4, ...over });

describe('the one line of guidance', () => {
  it('points to the pins on a first look at the globe, and to the notebook after that', () => {
    expect(globe({})).toBe('지구를 돌려 금색 점을 눌러 보렴');
    expect(globe({ visited: 1 })).toBe('수첩이나 금색 점으로 다음 날에 가 보렴');
    expect(globe({ visited: 4, complete: 4 })).toBe('수첩을 다 채웠구나. 고맙다');
  });
  it('teaches one thing at a time on the ground, in the order of the three dots', () => {
    expect(ground({})).toBe(null);
    expect(ground({ dots: { ...none, day: true } })).toBe('화면을 위로 밀어 하늘을 보렴');
    expect(ground({ dots: { ...none, day: true }, lookingUp: true })).toBe('그대로 잠깐 올려다보렴');
    expect(ground({ dots: { day: true, sky: true, remains: false } })).toBe('오늘은 어떤지, 오늘로 돌려 보렴');
    expect(ground({ dots: { day: true, sky: true, remains: true }, at: 'today' })).toBe('이야기 카드도 읽어 보렴');
    expect(ground({ dots: { day: true, sky: true, remains: true }, at: 'today', quizSolved: true })).toBe('수첩을 펴서 다른 날로 가 보렴');
  });
  it('shows the way back when the dial stands on a year with nothing to see', () => {
    expect(ground({ at: 'other' })).toBe('다이얼 끝의 이름표를 눌러 보렴');
    expect(ground({ at: 'other', dots: { day: true, sky: true, remains: true }, quizSolved: true })).toBe('다이얼 끝의 이름표를 눌러 보렴');
  });
  it('says nothing while the head is up and the sky is already filled', () => {
    expect(ground({ dots: { day: true, sky: true, remains: false }, lookingUp: true })).toBe(null);
  });
  it('never runs past 25 characters', () => {
    const all = [globe({}), globe({ visited: 1 }), globe({ visited: 4, complete: 4 }), ground({ at: 'other' }),
      ground({ dots: { ...none, day: true } }), ground({ dots: { ...none, day: true }, lookingUp: true }),
      ground({ dots: { day: true, sky: true, remains: false } }), ground({ dots: { day: true, sky: true, remains: true } }),
      ground({ dots: { day: true, sky: true, remains: true }, quizSolved: true })];
    for (const line of all) expect(line.length, line).toBeLessThanOrEqual(25);
  });
});
