import { describe, expect, it } from 'vitest';
import { WALKS } from '../game/src/core/walks.js';
import { accept, calledOf, choose, emptyTale, end, goalOf, hear, holdsOf, keepOn, lineOf, present, recordOf, revise, roleOf, sanitizeTale } from '../game/src/core/tale.js';
import { createWalk, linesOf, peopleOf, speak } from '../game/src/core/walk.js';
import { emptyProgress, markTale, sanitizeProgress, taleOf } from '../game/src/core/progress.js';

// The plan the user brought on 2026.10.8 (sections 2, 3 and 11.4), for the place tried: Tokyo.
const place = WALKS.shinkansen;
const tale = place.tale;
const heardBoth = (order = ['c1', 'c2']) => order.reduce((t, id) => hear(t, tale, id), accept(emptyTale()));

describe('a tale with a try in the middle of it', () => {
  it('begins when it is taken up, and not before', () => {
    expect(hear(emptyTale(), tale, 'c1').state).toBe('S0');
    expect(accept(emptyTale()).state).toBe('S1');
  });
  it('counts the same one heard twice as one, and takes the two in either order (QA01, QA02)', () => {
    const once = hear(hear(accept(emptyTale()), tale, 'c1'), tale, 'c1');
    expect(once.state).toBe('S1');
    expect(once.clues).toEqual(['c1']);
    expect(heardBoth(['c1', 'c2']).state).toBe('S2');
    expect(heardBoth(['c2', 'c1']).state).toBe('S2');
  });
  it('is told how the way chosen went by the one that way names (QA03)', () => {
    for (const route of ['A', 'B']) {
      const t = choose(heardBoth(), route);
      expect(t.state).toBe('S3');
      expect(calledOf(tale, t)).toEqual([tale.routes[route].actor]);
      expect(lineOf(tale, t, tale.routes[route].actor)).toBe(tale.routes[route].result);
      expect(holdsOf(tale, t)).toBe(tale.routes[route].holds);
      expect(keepOn(t).state).toBe('S4');
    }
  });
  it('may change its way once, keeps both in their order, and not twice (QA04)', () => {
    const once = revise(choose(heardBoth(), 'A'));
    expect(once.route).toBe('B');
    expect(once.attempts).toEqual(['A', 'B']);
    expect(once.state).toBe('S3');
    expect(revise(once)).toBe(once);
    expect(keepOn(once).state).toBe('S4');
  });
  it('comes to both ends by all four ways: eight in all (QA05)', () => {
    const ways = [(t) => keepOn(choose(t, 'A')), (t) => keepOn(choose(t, 'B')), (t) => keepOn(revise(choose(t, 'A'))), (t) => keepOn(revise(choose(t, 'B')))];
    for (const way of ways) for (const ending of ['E1', 'E2']) {
      const t = end(way(heardBoth()), ending);
      expect(t.state).toBe('S5');
      expect(recordOf(tale, t).at(-1)).toBe(tale.endings[ending].record);
      expect(recordOf(tale, t).length).toBe(t.attempts.length + 1);
      expect(goalOf(tale, t)).toBe(tale.goals.S5);
    }
  });
  it('cannot be ended before its time (QA20)', () => {
    for (const t of [emptyTale(), accept(emptyTale()), heardBoth(), choose(heardBoth(), 'A')]) expect(end(t, 'E1')).toBe(t);
  });
  it('is kept and read back as it was, and a record that is none is left out (QA06, QA12)', () => {
    const t = revise(choose(heardBoth(), 'A'));
    const kept = sanitizeProgress(JSON.stringify(markTale(emptyProgress(), 'shinkansen', t)), ['shinkansen']);
    expect(taleOf(kept, 'shinkansen')).toEqual(t);
    expect(sanitizeTale({ state: 'S3' })).toBe(null);
    expect(sanitizeTale({ state: 'S9', route: 'A' })).toBe(null);
    expect(sanitizeTale('S1')).toBe(null);
  });
  it('has the one who asks in one place at a time', () => {
    const before = createWalk(place);
    expect(peopleOf(before).map((p) => p.id)).toContain('flowers0');
    const after = createWalk(place, { tale: accept(emptyTale()) });
    expect(peopleOf(after).map((p) => p.id)).not.toContain('flowers0');
    after.scene = 1;
    expect(peopleOf(after).map((p) => p.id)).toContain('flowers');
    before.scene = 1;
    expect(peopleOf(before).map((p) => p.id)).not.toContain('flowers');
  });
  it('gives whoever has a part their line of the tale, and the others their own', () => {
    const walk = createWalk(place);
    const giver = place.scenes[0].people.find((p) => p.id === tale.giver);
    expect(roleOf(tale, walk.tale, giver.id)).toBe('giver');
    expect(linesOf(walk, giver)).toEqual([tale.offer]);
    const bento = place.scenes[0].people.find((p) => p.id === 'bento');
    expect(linesOf(walk, bento)).toBe(bento.lines);
    walk.x = giver.x;
    expect(speak(walk, giver.id).line).toBe(tale.offer);
  });
  it('is written within the limits and names people who are there', () => {
    const ids = place.scenes.flatMap((scene) => scene.people.map((p) => p.id));
    expect(tale.ask.length).toBeLessThanOrEqual(25);
    for (const id of [tale.giver, tale.resolver, ...tale.clues.map((c) => c.actor), tale.routes.A.actor, tale.routes.B.actor]) expect(ids).toContain(id);
    for (const line of [tale.offer, tale.close, ...tale.clues.map((c) => c.line), tale.routes.A.result, tale.routes.B.result, tale.endings.E1.says, tale.endings.E2.says]) expect(line.length, line).toBeLessThanOrEqual(40);
    for (const ending of Object.values(tale.endings)) expect(ending.reply.length, ending.reply).toBeLessThanOrEqual(60);
    for (const state of ['S0', 'S1', 'S2', 'S3', 'S4', 'S5']) expect(typeof tale.goals[state]).toBe('string');
    expect(present(emptyTale(), { when: ['S0'] })).toBe(true);
    expect(present(accept(emptyTale()), { when: ['S0'] })).toBe(false);
  });
});
