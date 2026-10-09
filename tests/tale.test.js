import { describe, expect, it } from 'vitest';
import { WALKS } from '../game/src/core/walks.js';
import { advance, calledOf, callOf, emptyTale, endingOf, goalOf, holdsOf, isTold, partOf, present, sanitizeTale, stepOf, textOf } from '../game/src/core/tale.js';
import { createWalk, linesOf, peopleOf, speak, stepWalk, talkedOut } from '../game/src/core/walk.js';
import { emptyProgress, markTale, sanitizeProgress, taleOf } from '../game/src/core/progress.js';

// Tokyo, told as a thing carried (the user, 2026.10.9: "아가씨한테 꽃과 말을 전달받고,
// 기관사한테 가서 전달하고, 이러는게 미션 아님?").
const place = WALKS.shinkansen;
const tale = place.tale;
const upTo = (n) => { let t = emptyTale(); for (let i = 0; i < n; i += 1) t = advance(tale, t, 'E1'); return t; };
const told = (ending) => { let t = emptyTale(); for (let i = 0; i < tale.steps.length; i += 1) t = advance(tale, t, ending); return t; };
const person = (id) => place.scenes.flatMap((scene) => scene.people).find((p) => p.id === id);
const sceneWith = (id) => place.scenes.findIndex((scene) => scene.people.some((p) => p.id === id));

describe('a tale of a thing carried', () => {
  it('goes a step at a time, with one person to go to at each', () => {
    let t = emptyTale();
    for (const step of tale.steps) {
      expect(stepOf(tale, t)).toBe(step);
      expect(calledOf(tale, t)).toEqual([step.who]);
      expect(goalOf(tale, t)).toBe(step.goal);
      t = advance(tale, t, 'E1');
    }
    expect(isTold(tale, t)).toBe(true);
    expect(calledOf(tale, t)).toEqual([]);
    expect(goalOf(tale, t)).toBe(tale.done);
    expect(holdsOf(tale, t)).toBe(tale.held);
    expect(advance(tale, t, 'E1')).toBe(t);
  });
  it('is not ended without one of the two things to say being chosen', () => {
    const last = upTo(tale.steps.length - 1);
    expect(advance(tale, last)).toBe(last);
    expect(advance(tale, last, 'E9')).toBe(last);
    for (const id of ['E1', 'E2']) expect(endingOf(tale, told(id)).id).toBe(id);
  });
  it('never sends her back: each step is in the scene she is in or one further on', () => {
    let scene = 0;
    for (const step of tale.steps) {
      expect(sceneWith(step.who)).toBeGreaterThanOrEqual(scene);
      scene = sceneWith(step.who);
    }
  });
  it('has the flowers in her hands from the taking up to the handing over', () => {
    expect(holdsOf(tale, upTo(0))).toContain('아가씨');
    for (let n = 1; n < tale.steps.length; n += 1) expect(holdsOf(tale, upTo(n))).toContain('소라');
    expect(tale.held).toContain('기관사');
  });
  it('has the one who asks before the station until it is done, and on the platform after', () => {
    for (let n = 0; n < tale.steps.length; n += 1) {
      const walk = createWalk(place, { tale: upTo(n) });
      expect(peopleOf(walk).map((p) => p.id)).toContain('flowers0');
      walk.scene = 1;
      expect(peopleOf(walk).map((p) => p.id)).not.toContain('flowers');
    }
    const after = createWalk(place, { tale: told('E1'), scene: 1 });
    expect(peopleOf(after).map((p) => p.id)).toContain('flowers');
  });
  it('says a step out line by line from the first, though she has met them before', () => {
    const giver = person(tale.steps[0].who);
    const walk = createWalk(place, { met: [giver.id] });
    walk.x = giver.x;
    const lines = tale.steps[0].lines;
    lines.forEach((line, n) => {
      const said = speak(walk, giver.id);
      expect(said.line).toBe(line);
      expect(said.role).toBe('step');
      expect(said.last).toBe(n === lines.length - 1);
    });
    expect(talkedOut(walk, giver)).toBe(true);
    expect(speak(walk, giver.id).over).toBe(true);
    expect(speak(walk, giver.id).line).toBe(lines[0]);
  });
  it('lets another answer for the one she goes to, and still counts it theirs', () => {
    const walk = createWalk(place, { tale: upTo(1), scene: 1 });
    const driver = person('driver');
    walk.x = driver.x;
    const said = speak(walk, 'driver');
    expect(said.line).toBe(textOf(tale.steps[1].lines[0]));
    expect(walk.heard.id).toBe('master');
    expect(walk.heard.of).toBe('driver');
    expect(speak(walk, 'driver').last).toBe(true);
  });
  it('has whoever is called for call out to her as she comes near', () => {
    const walk = createWalk(place, { tale: upTo(2), scene: 1 });
    walk.x = person('fan').x;
    stepWalk(walk, 16, 0);
    expect(walk.passing.line).toBe(tale.steps[2].call);
    expect(callOf(tale, upTo(0), 'fan')).toBe(null);
    const before = createWalk(place, { scene: 1 });
    before.x = person('fan').x;
    stepWalk(before, 16, 0);
    expect(before.passing.line).toBe(person('fan').pass);
  });
  it('gives those with no part their own lines, and those waiting their aside', () => {
    const walk = createWalk(place);
    expect(linesOf(walk, person('bento'))).toBe(person('bento').lines);
    expect(partOf(tale, upTo(1), 'flowers0').role).toBe('aside');
    expect(partOf(tale, upTo(1), 'driver').role).toBe('step');
    expect(partOf(tale, upTo(2), 'driver')).toBe(null);
    expect(partOf(tale, told('E1'), 'flowers').role).toBe('aside');
  });
  it('is kept and read back as it was, and a record of the first shape begins again', () => {
    const t = upTo(2);
    const kept = sanitizeProgress(JSON.stringify(markTale(emptyProgress(), 'shinkansen', t)), ['shinkansen']);
    expect(taleOf(kept, 'shinkansen')).toEqual(t);
    expect(sanitizeTale({ state: 'S3', route: 'A', clues: ['c1', 'c2'], attempts: ['A'], revisionUsed: false, endingId: null })).toBe(null);
    expect(sanitizeTale({ v: 2, state: 'S99' })).toBe(null);
    expect(sanitizeTale('S1')).toBe(null);
  });
  it('is written within the limits, names people who are there and marks the three errands', () => {
    const ids = place.scenes.flatMap((scene) => scene.people.map((p) => p.id));
    expect(tale.ask.length).toBeLessThanOrEqual(25);
    const said = [...tale.steps.flatMap((s) => s.lines), ...tale.asides.flatMap((a) => a.lines), ...tale.after.map((a) => a.line)];
    for (const line of said) expect(textOf(line).length, textOf(line)).toBeLessThanOrEqual(40);
    for (const step of tale.steps) {
      expect(ids).toContain(step.who);
      for (const line of step.lines) if (typeof line !== 'string') expect(ids).toContain(line.by);
      if (step.call) expect(step.call.length).toBeLessThanOrEqual(25);
      if (step.sora) expect(step.sora.length, step.sora).toBeLessThanOrEqual(40);
    }
    for (const who of [...tale.asides.map((a) => a.who), ...tale.after.map((a) => a.who)]) expect(ids).toContain(who);
    const choice = tale.steps.at(-1).choice;
    expect(choice.options.map((o) => o.id)).toEqual(['E1', 'E2']);
    for (const option of choice.options) for (const line of [option.sora, option.says]) expect(line.length, line).toBeLessThanOrEqual(40);
    expect(tale.steps.map((s) => s.errand).filter(Boolean)).toEqual(place.errands.map((e) => e.id));
    expect(place.reply.length).toBeLessThanOrEqual(60);
    expect(present(emptyTale(), { when: ['S0'] })).toBe(true);
    expect(present(upTo(1), { when: ['S0'] })).toBe(false);
  });
});
