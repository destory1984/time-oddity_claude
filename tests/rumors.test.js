import { describe, expect, it } from 'vitest';
import { HIDDEN, RUMORS, isOpen, rumorOf, rumorsDone, rumorsHeard, shownPlaces } from '../game/src/core/rumors.js';
import { WALKS } from '../game/src/core/walks.js';
import { emptyProgress, keysOf, markKey, markMet, metOf, sanitizeProgress } from '../game/src/core/progress.js';

const metIn = (progress) => (id) => metOf(progress, id);

describe("the comet's rumours", () => {
  it('are each said by someone who stands in that place', () => {
    for (const r of RUMORS) {
      const people = WALKS[r.at]?.scenes.flatMap((scene) => scene.people) ?? [];
      expect(people.some((p) => p.id === r.who), `${r.at} ${r.who}`).toBe(true);
    }
  });

  it('ask only for rumours that exist', () => {
    const ids = RUMORS.map((r) => r.id);
    for (const h of HIDDEN) for (const need of h.needs) expect(ids, h.id).toContain(need);
  });

  it('are heard by speaking to the one who has them', () => {
    let p = emptyProgress();
    expect(rumorsHeard(metIn(p))).toEqual([]);
    p = markMet(p, 'crystalPalace', 'lensman');
    expect(rumorsHeard(metIn(p)).map((r) => r.id)).toEqual(['y1682']);
    expect(rumorOf('crystalPalace', 'oldman').id).toBe('every76');
    expect(rumorOf('crystalPalace', 'baker')).toBeNull();
  });

  it('keep a hidden place hidden until its rumours are heard and its year found', () => {
    const dresden = HIDDEN.find((h) => h.id === 'dresden1758');
    let p = emptyProgress();
    const ids = ['babylon575', 'dresden1758'];
    expect(shownPlaces(ids, metIn(p), keysOf(p))).toEqual(['babylon575']);
    p = markMet(markMet(p, 'crystalPalace', 'lensman'), 'crystalPalace', 'oldman');
    expect(rumorsDone(dresden, metIn(p))).toBe(true);
    expect(isOpen(dresden, metIn(p), keysOf(p))).toBe(false);
    p = markKey(p, 'dresden1758');
    expect(shownPlaces(ids, metIn(p), keysOf(p))).toEqual(['babylon575', 'dresden1758']);
  });

  it('ask a year that is among the choices', () => {
    for (const h of HIDDEN) if (h.sum) expect(h.sum.choices).toContain(h.sum.year);
  });

  it('keep the years found when the record is read back', () => {
    const p = markKey(emptyProgress(), 'khufu');
    expect(sanitizeProgress(JSON.stringify(p), ['khufu']).keys).toEqual(['khufu']);
    expect(sanitizeProgress(JSON.stringify({ squares: {}, keys: ['nowhere'] }), ['khufu']).keys).toEqual([]);
  });
});
