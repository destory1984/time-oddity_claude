// Fingers. Where a finger first lands decides what it does until it lifts: the bottom
// 140 px is the dial (sideways), anything above is the sky look (up and down) on the
// ground or the globe (any way) above the Earth. Buttons take their own taps.
const DIAL_HEIGHT = 140;

export function createTouch(el, {
  mode, onDialGrab, onDialDrag, onDialRelease, onLookDrag, onLookEnd, onGlobeDrag, onGlobeEnd,
}) {
  let held = null;   // { id, zone, x, y, t, v }

  el.addEventListener('pointerdown', (e) => {
    if (held || e.target.closest('button')) return;
    const box = el.getBoundingClientRect();
    const zone = e.clientY > box.bottom - DIAL_HEIGHT ? 'dial' : mode() === 'ground' ? 'look' : mode() === 'globe' ? 'globe' : null;
    if (!zone) return;
    el.setPointerCapture(e.pointerId);
    held = { id: e.pointerId, zone, x: e.clientX, y: e.clientY, t: performance.now(), v: 0, height: box.height };
    if (zone === 'dial') onDialGrab();
  });

  el.addEventListener('pointermove', (e) => {
    if (!held || e.pointerId !== held.id) return;
    const now = performance.now();
    const dt = Math.max(4, now - held.t);
    const dx = e.clientX - held.x;
    const dy = e.clientY - held.y;
    if (held.zone === 'dial') {
      held.v += (dx / dt - held.v) * 0.35;
      onDialDrag(dx);
    } else if (held.zone === 'look') {
      onLookDrag(dy / held.height);
    } else {
      onGlobeDrag(dx, dy);
    }
    held.x = e.clientX; held.y = e.clientY; held.t = now;
  });

  // A cancelled touch (the finger left the screen, a call came in) is a lift.
  const lift = (e) => {
    if (!held || e.pointerId !== held.id) return;
    const { zone } = held;
    // A finger that stood still before lifting has no speed left to give.
    const still = performance.now() - held.t > 70;
    const v = e.type === 'pointercancel' || still ? 0 : held.v;
    held = null;
    if (zone === 'dial') onDialRelease(v);
    else if (zone === 'look') onLookEnd();
    else onGlobeEnd();
  };
  el.addEventListener('pointerup', lift);
  el.addEventListener('pointercancel', lift);
}
