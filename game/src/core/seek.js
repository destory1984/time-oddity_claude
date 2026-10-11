// A place whose errands are things to find (a place's `seek: true`; the user, 2026.10.12:
// "간단한 퍼즐 게임은 어때? 뭐뭐를 화면을 눌러서 찾으면 스테이지 클리어", and of the three ways
// offered to put it in: "3. 샌프란을 그렇게 만들어보자"). Each scene is a stage: three of
// the errands name it (`scene`), each is found by touching what does it (a person, or a
// place in the picture: a scene's `taps`), and the way on is shut until all three are found.
// Nothing here draws.

// She is told where to look when nothing has been found for this long (the user, of 20
// seconds: "너무 짧지않나").
export const HINT_MS = 45000;
// What she says at the end of a scene with something still to find in it: that it is why
// she cannot go on (the user, of "아직 다 못 찾았어.": "넘어갈 수 없다는 뉘앙스가 없잖아").
export const SEEK_BAR = '셋을 다 찾아야 건너갈 수 있어.';
// A thing further from her than this is likely out of sight: she is told which way to go.
const FAR = 0.14;

// What is to be found in a scene, and how many of them are left.
export const soughtIn = (place, sceneId) => (place.seek ? place.errands.filter((errand) => errand.scene === sceneId) : []);
export const leftIn = (place, done, sceneId) => soughtIn(place, sceneId).filter((errand) => !done.includes(errand.id)).length;

// Whether touching this person, try or place in the picture finds something.
export const isSought = (place, id) => Boolean(place.seek) && place.errands.some((errand) => errand.at.includes(id));

// Where to look next: of what is left in the scene, whatever is nearest her, as { errand,
// id: the person or tap to light up, x, way: -1 or 1 when it is far off, else 0 }, or null.
export function hintOf(place, scene, done, x) {
  let best = null;
  for (const errand of soughtIn(place, scene.id)) {
    if (done.includes(errand.id)) continue;
    for (const id of errand.at) {
      const person = scene.people.find((p) => p.id === id);
      const tap = (scene.taps ?? []).find((tp) => tp.id === id);
      const at = person ? person.x : tap ? (tap.box[0] + tap.box[2]) / 2 : null;
      if (at === null) continue;
      if (!best || Math.abs(at - x) < Math.abs(best.x - x)) best = { errand, id, x: at };
    }
  }
  return best && { ...best, way: Math.abs(best.x - x) > FAR ? Math.sign(best.x - x) : 0 };
}
