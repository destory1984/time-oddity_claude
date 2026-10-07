// The keys at a place. What they ask for is told in flight's words (drive, strafe, rise,
// turn), as they were first made for volume 1's free flight; the game now reads them as
// nearer and farther (W and S), round to the left and right (A and D, Q and E, the left
// and right arrows) and higher and lower (the up and down arrows). Two buttons on the
// screen do nearer and farther for a hand that has only a mouse or a thumb.
const KEYS = ['KeyW', 'KeyS', 'KeyA', 'KeyD', 'KeyQ', 'KeyE', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'KeyC', 'ShiftLeft', 'ShiftRight'];

export function createFlyKeys({ active, forwardButton, backButton }) {
  const held = new Set();
  const pressed = { forward: false, back: false };
  const typing = (e) => e.target instanceof HTMLElement && (e.target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName));

  window.addEventListener('keydown', (e) => {
    if (!active() || typing(e) || e.ctrlKey || e.altKey || e.metaKey || !KEYS.includes(e.code)) return;
    held.add(e.code);
    e.preventDefault();
  });
  window.addEventListener('keyup', (e) => held.delete(e.code));
  window.addEventListener('blur', () => held.clear());

  const hold = (button, name) => {
    button.addEventListener('pointerdown', (e) => { button.setPointerCapture?.(e.pointerId); pressed[name] = true; });
    for (const ev of ['pointerup', 'pointercancel', 'lostpointercapture']) button.addEventListener(ev, () => { pressed[name] = false; });
  };
  hold(forwardButton, 'forward');
  hold(backButton, 'back');

  const on = (...codes) => (codes.some((code) => held.has(code)) ? 1 : 0);
  return {
    clear() { held.clear(); pressed.forward = false; pressed.back = false; },
    // What she is asked to do now (core/fly.js).
    intent: () => ({
      drive: Math.max(on('KeyW'), pressed.forward ? 1 : 0) - Math.max(on('KeyS'), pressed.back ? 1 : 0),
      strafe: on('KeyD', 'ArrowRight') - on('KeyA', 'ArrowLeft'),
      rise: on('ArrowUp', 'Space') - on('ArrowDown', 'KeyC'),
      turn: on('KeyE') - on('KeyQ'),
      fast: on('ShiftLeft', 'ShiftRight') === 1,
    }),
  };
}
