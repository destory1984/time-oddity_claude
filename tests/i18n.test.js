import { readFileSync } from 'node:fs';
import { afterEach, describe, expect, it } from 'vitest';
import { addWords, ordinal, pickLanguage, setLanguage, t, wordsOf } from '../game/src/core/i18n.js';
import { centuryLabel } from '../game/src/core/century.js';
import { offerLabel } from '../game/src/core/walk.js';

afterEach(() => setLanguage('ko'));

// The user, 2026.10.9: "설정 -> 옵션 -> 언어 바꾸는 버튼이 없네", and how far: "1권처럼 넷 다".
describe('the language', () => {
  it('is what the player chose, else the device\'s own among the four, else English', () => {
    expect(pickLanguage('ja', 'ko-KR')).toBe('ja');
    expect(pickLanguage(null, 'ko-KR')).toBe('ko');
    expect(pickLanguage(null, 'zh-CN')).toBe('zh');
    expect(pickLanguage(null, 'fr-FR')).toBe('en');
    expect(pickLanguage('xx', 'ja-JP')).toBe('ja');
  });
  it('leaves Korean as it is written', () => {
    expect(t('떠나기')).toBe('떠나기');
    expect(t`${3}개 남음`).toBe('3개 남음');
    expect(centuryLabel(6)).toBe('6세기');
    expect(centuryLabel(-6)).toBe('기원전 6세기');
    expect(offerLabel({ verb: 'eat', name: '고리 빵' })).toBe('고리 빵 먹어 볼래');
  });
  it('gives a sentence in the language in use, and the Korean where there is none yet', () => {
    addWords({ '떠나기': 'Leave', '{}에 내려앉기': 'Land at {0}', '첫 줄\n둘째 줄': 'One\nTwo' }, 'en');
    setLanguage('en');
    expect(t('떠나기')).toBe('Leave');
    expect(t('없는 문장')).toBe('없는 문장');
    expect(t`${'Rome'}에 내려앉기`).toBe('Land at Rome');
    expect(wordsOf('둘째 줄')).toBe('Two');
    setLanguage('ja');
    expect(t('떠나기')).toBe('떠나기');
  });
  it('counts the centuries in English as English does', () => {
    expect([1, 2, 3, 4, 11, 12, 13, 21, 22].map(ordinal)).toEqual(['1st', '2nd', '3rd', '4th', '11th', '12th', '13th', '21st', '22nd']);
    setLanguage('en');
    expect(centuryLabel(19)).toBe('19th century');
    expect(centuryLabel(-6)).toBe('6th century BC');
  });
});

describe('the three dictionaries', () => {
  for (const lang of ['en', 'ja', 'zh']) {
    const book = JSON.parse(readFileSync(new URL(`../game/src/i18n/${lang}.json`, import.meta.url), 'utf8'));
    it(`${lang}: keeps every value of a template and the line breaks, and is never empty`, () => {
      for (const [ko, own] of Object.entries(book)) {
        expect(own.trim().length, ko).toBeGreaterThan(0);
        for (let i = 0; i < ko.split('{}').length - 1; i += 1) expect(own.includes(`{${i}}`), ko).toBe(true);
        expect(own.split('\n').length, ko).toBe(ko.split('\n').length);
      }
    });
  }
});
