// Fingers. Where a finger first lands decides what it does until it lifts: the bottom
// 140 px is the dial (sideways), anything above is the sky look (up and down) on the
// ground or the globe (any way) above the Earth; a second finger on the globe pinches
// it closer or farther. At a place in three dimensions (mode 'site') one finger above the
// dial turns the view; two fingers slide her about, and parting them lifts her.
// Buttons take their own taps.
const DIAL_HEIGHT = 140;

export function createTouch(el, {
  mode, onDialGrab, onDialDrag, onDialRelease, onDialTap, onLookDrag, onLookEnd, onGlobeDrag, onGlobeEnd, onGlobeZoom,
  onSiteLook = () => {}, onSiteSlide = () => {}, onSiteLift = () => {},
}) {
  let held = null;   // { id, zone, x, y, t, v }
  let second = null; // a second finger on the globe: { id, x, y }; the two pinch
  const apart = () => Math.hypot(held.x - second.x, held.y - second.y);

  el.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button')) return;
    if (held) {
      if ((held.zone === 'globe' || held.zone === 'site') && !second) {
        el.setPointerCapture(e.pointerId);
        second = { id: e.pointerId, x: e.clientX, y: e.clientY };
      }
      return;
    }
    const box = el.getBoundingClientRect();
    // While travelling to a square or leaving one, nothing is held: a finger on the dial
    // would stop the roll that is taking the player there.
    const now = mode();
    if (now !== 'ground' && now !== 'globe' && now !== 'site') return;
    const zone = e.clientY > box.bottom - DIAL_HEIGHT ? 'dial' : now === 'ground' ? 'look' : now === 'site' ? 'site' : 'globe';
    if (!zone) return;
    el.setPointerCapture(e.pointerId);
    held = {
      id: e.pointerId, zone, x: e.clientX, y: e.clientY, t: performance.now(), v: 0, height: box.height,
      downAt: performance.now(), moved: 0, side: e.clientX < box.left + box.width / 3 ? -1 : e.clientX > box.right - box.width / 3 ? 1 : 0,
    };
    if (zone === 'dial') onDialGrab();
  });

  el.addEventListener('pointermove', (e) => {
    if (held && second && (e.pointerId === held.id || e.pointerId === second.id)) {
      // Two fingers: the globe comes closer as they part, and does not turn meanwhile.
      const before = apart();
      const finger = e.pointerId === held.id ? held : second;
      const dx = e.clientX - finger.x;
      const dy = e.clientY - finger.y;
      finger.x = e.clientX; finger.y = e.clientY;
      if (held.zone === 'site') { onSiteSlide(dx / 2, dy / 2); onSiteLift(apart() - before); }
      else if (before > 0) onGlobeZoom(apart() / before);
      held.t = performance.now();
      return;
    }
    if (!held || e.pointerId !== held.id) return;
    const now = performance.now();
    const dt = Math.max(4, now - held.t);
    const dx = e.clientX - held.x;
    const dy = e.clientY - held.y;
    held.moved += Math.abs(dx) + Math.abs(dy);
    if (held.zone === 'dial') {
      held.v += (dx / dt - held.v) * 0.35;
      onDialDrag(dx);
    } else if (held.zone === 'look') {
      onLookDrag(dy / held.height);
    } else if (held.zone === 'site') {
      onSiteLook(dx, dy);
    } else {
      onGlobeDrag(dx, dy);
    }
    held.x = e.clientX; held.y = e.clientY; held.t = now;
  });

  // A cancelled touch (the finger left the screen, a call came in) is a lift.
  const lift = (e) => {
    if (held && second && (e.pointerId === held.id || e.pointerId === second.id)) {
      // One of the two lifts: the other goes on turning the globe.
      if (e.pointerId === held.id) { held.id = second.id; held.x = second.x; held.y = second.y; }
      held.t = performance.now();
      second = null;
      return;
    }
    if (!held || e.pointerId !== held.id) return;
    const { zone } = held;
    // A short touch that hardly moved, on the left or right third of the dial, is a tap
    // toward the marked year on that side.
    const tap = zone === 'dial' && e.type === 'pointerup' && held.moved < 8 && performance.now() - held.downAt < 400 ? held.side : 0;
    // A finger that stood still before lifting has no speed left to give.
    const still = performance.now() - held.t > 70;
    const v = e.type === 'pointercancel' || still ? 0 : held.v;
    held = null;
    if (zone === 'dial') { onDialRelease(v); if (tap !== 0) onDialTap(tap); }
    else if (zone === 'look') onLookEnd();
    else if (zone !== 'site') onGlobeEnd();
  };
  el.addEventListener('pointerup', lift);
  el.addEventListener('pointercancel', lift);
}
