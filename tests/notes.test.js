import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { NOTES, dueNote, noteById, notePages } from '../game/src/core/notes.js';
import { SQUARES } from '../game/src/core/squares.js';
import { emptyProgress, fillDot, isComplete, markNoteRead, notesRead, sanitizeProgress } from '../game/src/core/progress.js';

describe('grandmother\'s notes', () => {
  it('belong to squares that exist and keep Sora to 25 characters', () => {
    for (const note of NOTES) {
      if (note.square) expect(SQUARES.some((s) => s.id === note.square), note.id).toBe(true);
      else expect(note.after === 'all' || note.after > 0, note.id).toBe(true);
      expect(existsSync(`game/public/opening/${note.image}`), note.image).toBe(true);
      expect(note.says.length).toBe(note.text.length + 1);
      for (const say of note.says) expect(say.length, say).toBeLessThanOrEqual(25);
    }
  });
  it('are told over pages: the picture first, then her words a paragraph a page', () => {
    const pages = notePages(noteById('y1969'));
    expect(pages.length).toBe(4);
    expect(pages[0]).toMatchObject({ kind: 'scene', image: 'note-1969.png', say: '어, 뭐가 떨어졌네?' });
    expect(pages.slice(1).every((p) => p.kind === 'note')).toBe(true);
    expect(pages[2].say).toBe('맞아. 달은 그냥 떠 있었어.');
    expect(pages[3].say).toBe('');
  });
  it('fall when their square is complete, once', () => {
    let p = emptyProgress();
    const due = (progress) => dueNote((id) => isComplete(progress, id), notesRead(progress));
    expect(due(p)).toBe(null);
    for (const dot of ['day', 'sky']) p = fillDot(p, 'yard1969', dot);
    expect(due(p)).toBe(null);
    p = fillDot(p, 'yard1969', 'remains');
    expect(due(p).id).toBe('y1969');
    p = markNoteRead(p, 'y1969');
    expect(due(p)).toBe(null);
    expect(markNoteRead(p, 'y1969')).toBe(p);
  });
  it('fall later for places done: one in Seoul, one after five, the last leaf after all', () => {
    const places = ['a', 'b', 'c', 'd', 'e', 'seoul88', 'g'];
    const due = (done, read = ['y1969']) => dueNote((id) => done.includes(id), read, places)?.id ?? null;
    expect(due(['a', 'b', 'c', 'd'])).toBe(null);
    expect(due(['a', 'seoul88'])).toBe('y1988');
    expect(due(['a', 'b', 'c', 'd', 'e'])).toBe('y1989');
    expect(due(places, ['y1969', 'y1988', 'y1989'])).toBe('last');
    expect(due(places, ['y1969', 'y1988', 'y1989', 'last'])).toBe(null);
    expect(dueNote(() => false, [])).toBe(null);
  });
  it('are remembered with the rest of the notebook, and only the ones that exist', () => {
    const p = markNoteRead(fillDot(emptyProgress(), 'khufu', 'day'), 'y1969');
    const back = sanitizeProgress(JSON.stringify(p), SQUARES.map((s) => s.id), NOTES.map((n) => n.id));
    expect(notesRead(back)).toEqual(['y1969']);
    expect(back.squares.khufu.day).toBe(true);
    const odd = sanitizeProgress(JSON.stringify({ squares: {}, notes: ['y1969', 'nope', 7] }), [], ['y1969']);
    expect(notesRead(odd)).toEqual(['y1969']);
    expect(notesRead(sanitizeProgress('{"squares":{}}', [], ['y1969']))).toEqual([]);
  });
});
