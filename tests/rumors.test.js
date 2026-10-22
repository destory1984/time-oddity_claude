import { describe, expect, it } from 'vitest';
import { HIDDEN, RUMORS, isOpen, rumorOf, rumorsDone, rumorsHeard, shownPlaces } from '../game/src/core/rumors.js';
import { WALKS } from '../game/src/core/walks.js';
import { emptyProgress, keysOf, markKey, markMet, markRumor, rumorsOf, sanitizeProgress } from '../game/src/core/progress.js';

describe("the comet's rumours", () => {
  it('are each said, in their own lines, by someone who stands in that place', () => {
    for (const r of RUMORS) {
      const people = WALKS[r.at]?.scenes.flatMap((scene) => scene.people) ?? [];
      const one = people.find((p) => p.id === r.who);
      expect(one, `${r.at} ${r.who}`).toBeTruthy();
      expect(one.lines?.length, `${r.at} ${r.who}`).toBe(2);
    }
  });

  it('ask only for rumours that exist', () => {
    const ids = RUMORS.map((r) => r.id);
    for (const h of HIDDEN) for (const need of h.needs) expect(ids, h.id).toContain(need);
  });

  it('are heard when written down, not from having met the one who has them', () => {
    let p = markMet(emptyProgress(), 'crystalPalace', 'lensman');
    expect(rumorsHeard(rumorsOf(p))).toEqual([]);
    p = markRumor(p, 'y1682');
    expect(rumorsHeard(rumorsOf(p)).map((r) => r.id)).toEqual(['y1682']);
    expect(rumorOf('crystalPalace', 'oldman').id).toBe('every76');
    expect(rumorOf('crystalPalace', 'baker')).toBeNull();
  });

  it('keep a hidden place hidden until its rumours are heard and its year found', () => {
    const dresden = HIDDEN.find((h) => h.id === 'dresden1758');
    let p = emptyProgress();
    const ids = ['babylon575', 'dresden1758'];
    expect(shownPlaces(ids, rumorsOf(p), keysOf(p))).toEqual(['babylon575']);
    p = markRumor(markRumor(p, 'y1682'), 'every76');
    expect(rumorsDone(dresden, rumorsOf(p))).toBe(true);
    expect(isOpen(dresden, rumorsOf(p), keysOf(p))).toBe(false);
    p = markKey(p, 'dresden1758');
    expect(shownPlaces(ids, rumorsOf(p), keysOf(p))).toEqual(['babylon575', 'dresden1758']);
  });

  it('ask a year that is among the choices', () => {
    for (const h of HIDDEN) if (h.sum) expect(h.sum.choices).toContain(h.sum.year);
  });

  it('keep the years found and the rumours heard when the record is read back', () => {
    const p = markRumor(markKey(emptyProgress(), 'khufu'), 'y1682');
    const back = sanitizeProgress(JSON.stringify(p), ['khufu']);
    expect(back.keys).toEqual(['khufu']);
    expect(back.rumors).toEqual(['y1682']);
    expect(sanitizeProgress(JSON.stringify({ squares: {}, keys: ['nowhere'], rumors: [7, 'x'.repeat(50)] }), ['khufu'])).toMatchObject({ keys: [], rumors: [] });
  });
});

describe("grandmother's rooftop of 1986", () => {
  it('stays hidden until her note of 1986 has been read', () => {
    const roof = HIDDEN.find((h) => h.id === 'roof1986');
    expect(isOpen(roof, [], [], [])).toBe(false);
    expect(isOpen(roof, [], [], ['y1986'])).toBe(true);
    expect(shownPlaces(['roof1986'], [], [], ['y1969'])).toEqual([]);
  });
});

describe('the other days the comet came', () => {
  it('open 1066 with two rumours, and 1910 with two rumours and its year', () => {
    const england = HIDDEN.find((h) => h.id === 'england1066');
    const york = HIDDEN.find((h) => h.id === 'newyork1910');
    expect(isOpen(england, ['again'], [])).toBe(false);
    expect(isOpen(england, ['again', 'tapestry'], [])).toBe(true);
    expect(isOpen(york, ['next76', 'twain'], [])).toBe(false);
    expect(isOpen(york, ['next76', 'twain'], ['newyork1910'])).toBe(true);
  });
});
