// Flying over the Earth. Sora hovers at the middle of the globe; dragging the globe is
// her flying, the ground moving under her. A square is "under" her when its pin is within
// about four degrees of the middle, and there she may come down.
//
// A pin is given as the globe sees it: { id, x, y, z }, x right and y up from the middle
// of the Earth's disc in Earth radii, z below zero on the side that faces the eye.

// How far from the middle a pin may be and still be under her (sin 4 degrees).
export const NEAR = 0.07;
// From this far out the coasting globe slows and is drawn toward the pin.
export const SLOW = 0.22;

const far = (pin) => Math.hypot(pin.x, pin.y);

// The id of the square under her, or null.
export function pinUnder(pins) {
  let best = null;
  for (const pin of pins) {
    if (pin.z >= 0 || far(pin) > NEAR) continue;
    if (!best || far(pin) < far(best)) best = pin;
  }
  return best ? best.id : null;
}

// The arrow toward the square she is flying to: { turn, near }. turn is degrees clockwise
// from straight up on the screen; a square on the far side lies the same way round. near:
// she is over it and the arrow is put away.
export function pointerTo(pin) {
  if (!pin) return null;
  return { turn: (Math.atan2(pin.x, pin.y) * 180) / Math.PI, near: pin.z < 0 && far(pin) <= NEAR };
}

// The sprite sheet for the way she flies when the ground moves by (dx, dy) pixels on the
// screen (y down) in a frame: against the ground. null when it hardly moves.
export function flyPose(dx, dy) {
  if (Math.hypot(dx, dy) < 0.5) return null;
  if (Math.abs(dx) >= Math.abs(dy)) return dx > 0 ? 'left' : 'right';
  return dy > 0 ? 'up' : 'down';
}
