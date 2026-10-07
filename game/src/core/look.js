// The finger that raises the head on the ground. Pushing up a quarter of the screen
// raises it fully; when the finger lifts, the head stays up or goes back down, whichever
// is nearer. target is where the head should go, 0 to 1 (visit.js eases toward it).
const FULL_PUSH = 0.25;   // share of the screen's height

export function createLook() {
  return { target: 0, held: 0 };
}

// dyShare: how far the finger moved, as a share of the screen's height (down positive).
export function dragLook(look, dyShare) {
  look.held = Math.max(0, Math.min(1, look.held - dyShare / FULL_PUSH));
  look.target = look.held;
}

export function endLook(look) {
  look.target = look.held > 0.5 ? 1 : 0;
  look.held = look.target;
}

export function resetLook(look) {
  look.target = 0;
  look.held = 0;
}
