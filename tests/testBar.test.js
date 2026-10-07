import { describe, expect, it } from 'vitest';
import { isLocalHost } from '../game/src/core/host.js';
import { countProgress, fullProgress, isComplete, notesRead, quizSolved, sanitizeProgress } from '../game/src/core/progress.js';

describe('the maker\'s own machine', () => {
  it('is the dev server on this computer or a device on the same home network', () => {
    for (const hostname of ['localhost', '127.0.0.1', '[::1]', 'app.localhost', 'old.test', '192.168.0.12', '10.0.0.5', '172.16.4.1', '172.31.255.9']) expect(isLocalHost(hostname), hostname).toBe(true);
  });
  it('is never the public site', () => {
    for (const hostname of ['destory1984.github.io', '', undefined, '172.32.0.1', '8.8.8.8', '192.169.0.1', 'localhost.example.com']) expect(isLocalHost(hostname), String(hostname)).toBe(false);
  });
});

describe('a notebook filled for testing', () => {
  const ids = ['khufu', 'eiffel', 'yard1969'];
  const noteIds = ['y1969'];
  it('has every dot of every square, every question answered and every note read', () => {
    const full = fullProgress(ids, noteIds);
    expect(countProgress(full, ids)).toEqual({ day: 3, sky: 3, remains: 3, quiz: 3, complete: 3, total: 3 });
    for (const id of ids) { expect(isComplete(full, id)).toBe(true); expect(quizSolved(full, id)).toBe(true); }
    expect(notesRead(full)).toEqual(noteIds);
  });
  it('reads back unchanged from storage', () => {
    const full = fullProgress(ids, noteIds);
    expect(sanitizeProgress(JSON.stringify(full), ids, noteIds)).toEqual(full);
  });
});
