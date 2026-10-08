import { describe, expect, it } from 'vitest';
import { SQUARES } from '../game/src/core/squares.js';
import { countProgress, emptyProgress, fillDot, isComplete, markTried, sanitizeProgress, solveQuiz, triedOf } from '../game/src/core/progress.js';

const ids = SQUARES.map((s) => s.id);

describe('progress', () => {
  it('starts with nothing filled', () => {
    const p = emptyProgress();
    expect(countProgress(p, ids)).toEqual({ day: 0, sky: 0, remains: 0, complete: 0, quiz: 0, total: SQUARES.length });
  });
  it('fills a dot of a square and counts it, without changing what it was given', () => {
    const start = emptyProgress();
    const p = fillDot(fillDot(start, 'khufu', 'day'), 'khufu', 'sky');
    expect(start).toEqual(emptyProgress());
    expect(p.squares.khufu).toEqual({ day: true, sky: true, remains: false, quiz: false, find: false });
    expect(countProgress(p, ids)).toMatchObject({ day: 1, sky: 1, remains: 0, complete: 0 });
    expect(isComplete(p, 'khufu')).toBe(false);
    expect(isComplete(fillDot(p, 'khufu', 'remains'), 'khufu')).toBe(true);
  });
  it('returns the very same record when the dot was already filled', () => {
    const p = fillDot(emptyProgress(), 'khufu', 'day');
    expect(fillDot(p, 'khufu', 'day')).toBe(p);
  });
  it('remembers what was eaten, worn or used in a place, each once, and reads it back', () => {
    const start = fillDot(emptyProgress(), 'colosseum', 'day');
    const p = markTried(markTried(start, 'colosseum', 'eat-garum'), 'colosseum', 'use-token');
    expect(triedOf(start, 'colosseum')).toEqual([]);
    expect(triedOf(p, 'colosseum')).toEqual(['eat-garum', 'use-token']);
    expect(markTried(p, 'colosseum', 'eat-garum')).toBe(p);
    expect(p.squares.colosseum.day).toBe(true);
    const back = sanitizeProgress(JSON.stringify({ squares: { colosseum: { day: true, tried: ['eat-garum', 3, 'eat-garum', null] } } }), ids);
    expect(triedOf(back, 'colosseum')).toEqual(['eat-garum']);
  });
  it('remembers a solved quiz', () => {
    const p = solveQuiz(emptyProgress(), 'lunar1504');
    expect(p.squares.lunar1504.quiz).toBe(true);
    expect(countProgress(p, ids).quiz).toBe(1);
  });
  it('keeps only what it knows when reading a record back', () => {
    const raw = JSON.stringify({ squares: { khufu: { day: true, sky: 'yes', extra: 1 }, atlantis: { day: true }, lunar1504: null } });
    const p = sanitizeProgress(raw, ids);
    expect(p.squares).toEqual({ khufu: { day: true, sky: false, remains: false, quiz: false, find: false } });
  });
  it('starts afresh from a record that cannot be read', () => {
    for (const raw of [null, '', 'not json', '[]', '{"squares":7}', '42']) expect(sanitizeProgress(raw, ids)).toEqual(emptyProgress());
  });
});

describe('what a square tells', () => {
  it('has a story card of three sentences in the newspaper voice', () => {
    for (const s of SQUARES) {
      const sentences = s.card.split('니다.').filter((part) => part.trim() !== '');
      expect(sentences.length, s.id).toBe(3);
      expect(s.card.endsWith('니다.'), s.id).toBe(true);
    }
  });
  it('asks a question whose proof is in the card word for word and whose wrong choices are not', () => {
    for (const s of SQUARES) {
      expect(s.quiz.question.endsWith('?'), s.id).toBe(true);
      expect(s.quiz.question.length, s.id).toBeLessThanOrEqual(40);
      expect(s.card.includes(s.quiz.proof), s.id).toBe(true);
      expect(s.quiz.wrong.length, s.id).toBe(2);
      for (const wrong of s.quiz.wrong) expect(s.card.includes(wrong), `${s.id}: ${wrong}`).toBe(false);
    }
  });
  it('does not ask for a number', () => {
    for (const s of SQUARES) for (const choice of [s.quiz.answer, ...s.quiz.wrong]) expect(/\d/.test(choice), `${s.id}: ${choice}`).toBe(false);
  });
  it('has a notebook memo by grandmother of at most 60 characters', () => {
    for (const s of SQUARES) {
      expect(s.noteMemo.length, s.id).toBeGreaterThan(10);
      expect(s.noteMemo.length, s.id).toBeLessThanOrEqual(60);
    }
  });
});
