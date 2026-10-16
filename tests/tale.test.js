import { describe, expect, it } from 'vitest';
import { WALKS } from '../game/src/core/walks.js';
import { TOKYO_TALE } from './fixtures/tokyo-tale.js';
import { advance, calledOf, callOf, emptyTale, endingOf, goalOf, holdsOf, isTold, partOf, present, sanitizeTale, stepOf, textOf, carrying, thankerOf, cluesOf, gain, hintOf, riddleOf, sourceOf, roundGot, roundLeft, whoOf } from '../game/src/core/tale.js';
import { barred, canHop, createWalk, linesOf, peopleOf, speak, stepWalk, talkedOut } from '../game/src/core/walk.js';
import { emptyProgress, markTale, sanitizeProgress, taleOf } from '../game/src/core/progress.js';

// Tokyo as it was told until 2026.10.12 (tests/fixtures/tokyo-tale.js), a thing carried (the user, 2026.10.9: "아가씨한테 꽃과 말을 전달받고,
// 기관사한테 가서 전달하고, 이러는게 미션 아님?").
const place = TOKYO_TALE;
const tale = place.tale;
const upTo = (n) => { let t = emptyTale(); for (let i = 0; i < n; i += 1) t = advance(tale, t, 'E1'); return t; };
const told = (ending) => { let t = emptyTale(); for (let i = 0; i < tale.steps.length; i += 1) t = advance(tale, t, ending); return t; };
const person = (id) => place.scenes.flatMap((scene) => scene.people).find((p) => p.id === id);
// One step on in any tale: a riddle is answered with the clue that answers it, found first.
const onward = (told, t) => {
  const right = riddleOf(told, t)?.clues.find((clue) => clue.right);
  if (right) return advance(told, gain(told, t, right.from), right.id);
  const step = stepOf(told, t);
  if (step?.round) return advance(told, step.round.reduce((got, r) => roundGot(told, got, r.who), t));
  return advance(told, t, step?.play ? 'played' : 'E1');
};
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
    expect(holdsOf(tale, t)).toBe(null);
    expect(advance(tale, t, 'E1')).toBe(t);
  });
  it('does not go past the handing over without one of the two things to say being chosen', () => {
    const last = upTo(tale.steps.findIndex((s) => s.choice));
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
    const gave = tale.steps.findIndex((s) => s.choice);
    for (let n = 1; n <= gave; n += 1) expect(holdsOf(tale, upTo(n))).toContain('소라');
    expect(holdsOf(tale, upTo(gave + 1))).toBe(null);
  });
  it('has the one who asks wait where she is from first to last, with thanks at the end', () => {
    for (let n = 0; n <= tale.steps.length; n += 1) {
      const walk = createWalk(place, { tale: upTo(n) });
      expect(peopleOf(walk).map((p) => p.id)).toContain('flowers0');
      walk.scene = 1;
      expect(peopleOf(walk).map((p) => p.id).filter((id) => id.startsWith('flowers'))).toEqual([]);
    }
    expect(partOf(tale, told('E1'), 'flowers0').lines[0]).toContain('고마워요');
    expect(tale.steps[0].offer.later).toBe(undefined);
  });
  it('ends in the running train, at the speed dial, which is held up to be seen', () => {
    expect(sceneWith(tale.steps.at(-1).who)).toBe(place.scenes.length - 1);
    expect(partOf(tale, upTo(tale.steps.length - 1), 'buffet').show).toBe(true);
    const walk = createWalk(place, { tale: upTo(tale.steps.length - 1), scene: 2 });
    walk.x = person('buffet').x;
    expect(speak(walk, 'buffet').last).toBe(false);
    expect(walk.heard.plain).toBe(false);
    expect(speak(walk, 'buffet').last).toBe(true);
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
  });
  // The user, 2026.10.9, in Tahiti: "아무도 못 들어간다고 했는데, 오른쪽으로 그냥 들어가는데?"
  it('keeps the way on shut where she is turned away, until she is let in', () => {
    for (const [id, walked] of Object.entries(WALKS)) {
      if (!walked.tale) continue;
      const { gate, steps } = walked.tale;
      expect(gate, id).toBeTruthy();
      const scene = walked.scenes.findIndex((s) => s.id === gate.scene);
      expect(scene, id).toBeGreaterThanOrEqual(0);
      expect(scene, id).toBeLessThan(walked.scenes.length - 1);
      expect(gate.sora.length, gate.sora).toBeLessThanOrEqual(25);
      // Every step before it opens can be done without going past it; the first after it cannot.
      const sceneOfWho = (who) => walked.scenes.findIndex((s) => s.people.some((p) => p.id === who));
      for (let n = 0; n < gate.open; n += 1) expect(sceneOfWho(whoOf(steps[n])), `${id} step ${n}`).toBeLessThanOrEqual(scene);
      expect(sceneOfWho(whoOf(steps[gate.open])), id).toBeGreaterThan(scene);
      let t = emptyTale();
      for (let n = 0; n <= steps.length; n += 1) {
        const walk = createWalk(walked, { tale: t, scene, x: 0.975, been: walked.scenes.map((s) => s.id) });
        const shut = n < gate.open;
        expect(barred(walk), `${id} at ${n}`).toBe(shut ? gate.sora : null);
        expect(canHop(walk, 1), `${id} at ${n}`).toBe(!shut);
        const out = stepWalk(walk, 400, 1);
        expect(walk.scene, `${id} at ${n}`).toBe(shut ? scene : scene + 1);
        expect(out.barred, `${id} at ${n}`).toBe(shut ? gate.sora : null);
        t = onward(walked.tale, t);
      }
    }
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
    const after = tale.steps.flatMap((s) => s.after ?? []);
    const said = [...tale.steps.flatMap((s) => s.lines), ...tale.asides.flatMap((a) => a.lines), ...after.map((a) => a.line)];
    for (const line of said) expect(textOf(line).length, textOf(line)).toBeLessThanOrEqual(40);
    for (const step of tale.steps) {
      expect(ids).toContain(step.who);
      for (const line of step.lines) if (typeof line !== 'string') expect(ids).toContain(line.by);
      if (step.call) expect(step.call.length).toBeLessThanOrEqual(25);
      if (step.sora) expect(step.sora.length, step.sora).toBeLessThanOrEqual(40);
    }
    for (const who of [...tale.asides.map((a) => a.who), ...after.map((a) => a.who)]) expect(ids).toContain(who);
    const choice = tale.steps.find((s) => s.choice).choice;
    expect(choice.options.map((o) => o.id)).toEqual(['E1', 'E2']);
    for (const option of choice.options) for (const line of [option.sora, option.says]) expect(line.length, line).toBeLessThanOrEqual(40);
    expect(tale.steps.map((s) => s.errand).filter(Boolean)).toEqual(place.errands.map((e) => e.id));
    expect(place.reply.length).toBeLessThanOrEqual(60);
    expect(present(emptyTale(), { when: ['S0'] })).toBe(true);
    expect(present(upTo(1), { when: ['S0'] })).toBe(false);
  });
});

// The user, 2026.10.9, in Kaifeng: "쪽지를 주는 액션은 없었는데, 쪽지는 받았네".
describe('what is carried', () => {
  it('is in her hands from the taking of it until it is handed over, in every tale', () => {
    const tales = Object.values(WALKS).filter((place) => place.tale && !place.tale.work);
    expect(tales.length).toBeGreaterThanOrEqual(6);
    for (const { tale } of tales) {
      expect(tale.thing).toBe(true);
      const took = tale.steps.findIndex((step) => step.offer);
      const gave = tale.steps.findIndex((step) => step.choice);
      tale.steps.forEach((_, i) => expect(carrying(tale, { state: `S${i}` }), `S${i}`).toBe(i > took && i <= gave));
      expect(carrying(tale, { state: `S${tale.steps.length}` })).toBe(false);
    }
  });
});

// The user, 2026.10.10: "다른 도시에서도 미션 끝내면, 감사하다는 인사 하던가".
describe('the one who asked', () => {
  it('has thanks to give in every tale once the thing is handed over, and not before', () => {
    for (const { tale } of Object.values(WALKS).filter((place) => place.tale && !place.tale.work)) {
      const end = { state: `S${tale.steps.length}` };
      expect(thankerOf(tale, { state: 'S1' })).toBe(null);
      expect(thankerOf(tale, end)).toBe(tale.steps[0].who);
      const said = tale.asides.find((a) => a.who === tale.steps[0].who && a.when.includes(end.state)).lines.join(' ');
      expect(/고맙|고마워/.test(said), said).toBe(true);
    }
  });
});

// The user, 2026.10.12: "조금 더 게임성을 투여해보자. 어드벤처 게임처럼", and of how: clues are
// gathered and the right one is held out to whoever is in the way.
describe('a riddle in the way', () => {
  const place = WALKS.guest1054;
  const tale = place.tale;
  const at = tale.steps.findIndex((step) => step.riddle);
  const asked = () => { let t = emptyTale(); for (let n = 0; n < at; n += 1) t = onward(tale, t); return t; };
  const riddle = tale.steps[at].riddle;
  const right = riddle.clues.find((clue) => clue.right);
  const scene = place.scenes.find((s) => s.id === tale.gate.scene);

  it('is asked by the one who shuts the way, in the scene that is shut', () => {
    expect(at).toBeGreaterThan(0);
    expect(tale.gate.open).toBe(at + 1);
    expect(scene.people.map((p) => p.id)).toContain(tale.steps[at].who);
    expect(riddleOf(tale, emptyTale())).toBe(null);
    expect(riddleOf(tale, asked())).toBe(riddle);
  });
  it('gathers a clue from whoever has one, once, and only while it is asked', () => {
    expect(gain(tale, emptyTale(), right.from)).toEqual(emptyTale());
    let t = asked();
    expect(cluesOf(tale, t)).toEqual([]);
    expect(sourceOf(tale, t, right.from)).toBe(right);
    const got = gain(tale, t, right.from);
    expect(cluesOf(tale, got)).toEqual([right]);
    expect(sourceOf(tale, got, right.from)).toBe(null);
    expect(gain(tale, got, right.from)).toBe(got);
    expect(gain(tale, got, 'nobody')).toBe(got);
    for (const clue of riddle.clues) t = gain(tale, t, clue.from);
    expect(cluesOf(tale, t)).toEqual(riddle.clues);
  });
  it('is not answered by a clue that is wrong, nor by the right one not yet found', () => {
    let t = asked();
    expect(advance(tale, t, right.id)).toBe(t);
    for (const clue of riddle.clues) t = gain(tale, t, clue.from);
    for (const clue of riddle.clues) if (!clue.right) expect(advance(tale, t, clue.id)).toBe(t);
    const on = advance(tale, t, right.id);
    expect(on.state).toBe(`S${at + 1}`);
    expect(riddleOf(tale, on)).toBe(null);
  });
  it('has one right clue, to be had in the scene that is shut: she is never sent back', () => {
    expect(riddle.clues.filter((clue) => clue.right).length).toBe(1);
    expect(riddle.clues.length).toBeGreaterThanOrEqual(3);
    const here = [...scene.people.map((p) => p.id), ...(scene.taps ?? []).map((tap) => tap.id)];
    expect(here).toContain(right.from);
    const everywhere = place.scenes.flatMap((s) => [...s.people.map((p) => p.id), ...(s.taps ?? []).map((tap) => tap.id)]);
    for (const clue of riddle.clues) {
      expect(everywhere, clue.id).toContain(clue.from);
      // A person gives theirs by what they say while it is asked.
      const person = place.scenes.flatMap((s) => s.people).find((p) => p.id === clue.from);
      if (person) expect(partOf(tale, asked(), person.id)?.role, clue.id).toBe('aside');
      expect(clue.label.length, clue.label).toBeLessThanOrEqual(16);
      for (const line of [clue.sora, clue.says]) expect(line.length, line).toBeLessThanOrEqual(40);
    }
  });
  it('says where to look: toward a clue not yet found, and to the one who asked once it is', () => {
    const t = asked();
    const near = hintOf(tale, t, scene, 0.5);
    expect(riddle.clues.map((clue) => clue.from)).toContain(near.id);
    const far = hintOf(tale, t, scene, 0.02);
    expect(far.way).toBe(1);
    const guard = scene.people.find((p) => p.id === tale.steps[at].who);
    const got = gain(tale, t, right.from);
    expect(hintOf(tale, got, scene, guard.x).id).toBe(guard.id);
    expect(hintOf(tale, got, scene, guard.x).way).toBe(0);
    expect(hintOf(tale, emptyTale(), scene, 0.5)).toBe(null);
  });
  it('is kept with the clues found, and a record from before there were clues has none', () => {
    const t = gain(tale, asked(), right.from);
    const kept = sanitizeProgress(JSON.stringify(markTale(emptyProgress(), 'guest1054', t)), ['guest1054']);
    expect(taleOf(kept, 'guest1054')).toEqual(t);
    expect(sanitizeTale({ v: 2, state: 'S1', endingId: null }).clues).toEqual([]);
    expect(sanitizeTale({ v: 2, state: 'S1', endingId: null, clues: ['ok', 7, 'x'.repeat(20)] }).clues).toEqual(['ok']);
  });
});

// The user, 2026.10.15: "이야기 패턴이 너무 단순한데", then the work of the day itself, done with
// her own hands, tried first in Darlington.
describe('the work of the day', () => {
  const works = Object.entries(WALKS).filter(([, place]) => place.tale?.work);
  it('is tried in Darlington', () => {
    expect(works.map(([id]) => id)).toContain('darlington');
  });
  it('is done a round at a time, each of it heard out once, in any order', () => {
    const { tale } = WALKS.darlington;
    const step = tale.steps[0];
    let t = emptyTale();
    expect(calledOf(tale, t)).toEqual(step.round.map((r) => r.who));
    const [first, ...rest] = [...step.round].reverse();
    expect(partOf(tale, t, first.who)).toEqual({ role: 'step', lines: first.lines, show: false });
    t = roundGot(tale, t, first.who);
    expect(partOf(tale, t, first.who)).toBe(null);
    expect(roundLeft(tale, t).map((r) => r.who)).toEqual(rest.map((r) => r.who).reverse());
    expect(advance(tale, t)).toBe(t);
    for (const r of rest) t = roundGot(tale, t, r.who);
    expect(advance(tale, t).state).toBe('S1');
    expect(advance(tale, t).got).toEqual([]);
  });
  // The user, 2026.10.16: "미니 게임을 바꾸면 안 됨?": the plays are of more than one kind,
  // and no place has the same kind twice.
  it('plays more than one kind, and none twice in one place', () => {
    const kinds = new Set();
    for (const [id, walked] of Object.entries(WALKS)) {
      if (!walked.tale?.work) continue;
      const here = walked.tale.steps.filter((s) => s.play).map((s) => s.play.kind);
      expect(new Set(here).size, id).toBe(here.length);
      here.forEach((k) => kinds.add(k));
    }
    expect([...kinds].sort()).toEqual(['aim', 'beat', 'fill', 'mash']);
  });
  it('is played to the end before it goes on', () => {
    const { tale } = WALKS.darlington;
    const t = onward(tale, emptyTale());
    expect(stepOf(tale, t).play).toBeTruthy();
    expect(advance(tale, t, 'E1')).toBe(t);
    expect(advance(tale, t, 'played').state).toBe('S2');
  });
  it('is written within the limits, names people who are there, and thanks nobody', () => {
    for (const [id, place] of works) {
      const { tale } = place;
      const ids = place.scenes.flatMap((scene) => scene.people.map((p) => p.id));
      expect(tale.thing, id).toBeFalsy();
      expect(tale.ask.length).toBeLessThanOrEqual(25);
      for (const step of tale.steps) {
        const who = step.round ? step.round.map((r) => r.who) : [step.who];
        for (const one of who) expect(ids, id).toContain(one);
        const lines = [...(step.lines ?? []), ...(step.round ?? []).flatMap((r) => r.lines), ...(step.after ?? []).map((a) => a.line)];
        for (const line of lines) expect(textOf(line).length, textOf(line)).toBeLessThanOrEqual(40);
        if (step.sora) expect(step.sora.length, step.sora).toBeLessThanOrEqual(40);
        if (step.round) expect(step.tally, id).toMatch(/\{n\}.*다\.$|\{all\}.*\{n\}.*다\.$/);
        if (step.cheer) expect(step.cheer.length, step.cheer).toBeLessThanOrEqual(14);
        if (step.play) {
          const { play } = step;
          expect(['aim', 'fill', 'mash', 'beat']).toContain(play.kind);
          expect(play.ask.length, play.ask).toBeLessThanOrEqual(30);
          expect(play.hits).toBeGreaterThanOrEqual(1);
          expect(play.zone[0]).toBeGreaterThan(0);
          expect(play.zone[1]).toBeLessThan(1);
          expect(play.zone[1] - play.zone[0]).toBeGreaterThanOrEqual(0.1);
          expect(play.good.length * play.miss.length).toBeGreaterThan(0);
          expect(play.tally).toMatch(/\{all\}.*\{n\}.*다\.$/);
        }
      }
      expect(tale.steps.map((s) => s.errand).filter(Boolean)).toEqual(place.errands.map((e) => e.id));
      let t = emptyTale();
      for (const _ of tale.steps) t = onward(tale, t);
      expect(isTold(tale, t)).toBe(true);
      expect(thankerOf(tale, t)).toBe(null);
      expect(carrying(tale, t)).toBe(false);
    }
  });
  it('keeps who has been gone to of a round, and reads back an old record without it', () => {
    expect(sanitizeTale({ v: 2, state: 'S0', endingId: null, got: ['waver', 3] }).got).toEqual(['waver']);
    expect(sanitizeTale({ v: 2, state: 'S0', endingId: null }).got).toEqual([]);
  });
});
