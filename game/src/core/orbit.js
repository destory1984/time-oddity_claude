// Looking a place over without having to fly it. The eye is either carried round the
// place on a circle that always faces its middle (drag to go round and over, come closer
// or draw back), or stands at one of a few named spots and only turns its head. It can
// not be steered into a wall or lost, because it is never steered at all.
//
// The first try gave volume 1's free flight, and the user kept ending up inside the
// stone (2026.10.8: "조종도 너무 어려워서, 계속 건물 안으로 들어갔다가.. 여긴 우주공간이
// 아니라서, 이렇게 자유도가 높은 비행을 하라고 하면 안 되"). Space is empty; a building is not.
//
// World axes: x east, z north, y up, metres. Angles in degrees: `around` is the azimuth
// the eye stands at as seen from the middle (0 north, 90 east), `tilt` how high above the
// level of the middle, `far` its distance from the middle.
const RAD = Math.PI / 180;
export const TILT_LEAST = 4;
export const TILT_MOST = 85;
const EASE_MS = 220;          // the eye comes to where it is wanted over about this long
const PITCH_MOST = 80;

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const wrap = (deg) => ((deg % 360) + 360) % 360;
const nearer = (from, to) => from + ((((to - from) % 360) + 540) % 360) - 180;

// round: { x, y, z (the middle looked at), around, tilt, far, least, most (how close and
// how far) }. spots: [{ id, x, y, z, yaw, pitch }] where the eye may stand.
export function createView({ round, spots = [] }) {
  const view = { round: { ...round }, spots, at: 'round', head: { yaw: 0, pitch: 0 }, eye: null };
  view.eye = wanted(view);
  return view;
}

// Where the eye should be now: { x, y, z, yaw, pitch }, facing the middle when it goes round.
export function wanted(view) {
  if (view.at !== 'round') {
    const spot = view.spots.find((s) => s.id === view.at);
    return { x: spot.x, y: spot.y, z: spot.z, yaw: wrap(view.head.yaw), pitch: view.head.pitch };
  }
  const { x, y, z, around, tilt, far } = view.round;
  const flat = Math.cos(tilt * RAD) * far;
  return {
    x: x + Math.sin(around * RAD) * flat, y: y + Math.sin(tilt * RAD) * far, z: z + Math.cos(around * RAD) * flat,
    yaw: wrap(around + 180), pitch: -tilt,
  };
}

// Goes to stand at a spot, or back to going round ('round').
export function standAt(view, id) {
  if (id !== 'round' && !view.spots.some((s) => s.id === id)) return;
  view.at = id;
  if (id !== 'round') { const spot = view.spots.find((s) => s.id === id); view.head = { yaw: spot.yaw, pitch: spot.pitch }; }
}

// A drag. Going round, the scene is turned as if held: dragged right it turns right (the
// eye goes round to the left), dragged down the eye rises to look from above. Standing,
// the head turns the same way.
export function turnView(view, rightDeg, downDeg) {
  if (view.at === 'round') {
    view.round.around = wrap(view.round.around - rightDeg);
    view.round.tilt = clamp(view.round.tilt + downDeg, TILT_LEAST, TILT_MOST);
  } else {
    view.head.yaw = wrap(view.head.yaw - rightDeg);
    view.head.pitch = clamp(view.head.pitch + downDeg, -PITCH_MOST, PITCH_MOST);
  }
}

// Closer (below zero) or farther, in metres. Standing, there is no nearer or farther.
export function nearView(view, metres) {
  if (view.at !== 'round') return;
  view.round.far = clamp(view.round.far + metres, view.round.least, view.round.most);
}

// The eye moves toward where it is wanted: no jump when a spot is chosen.
export function stepView(view, dtMs) {
  const to = wanted(view);
  const k = Math.min(1, dtMs / EASE_MS);
  const eye = view.eye;
  eye.x += (to.x - eye.x) * k;
  eye.y += (to.y - eye.y) * k;
  eye.z += (to.z - eye.z) * k;
  eye.yaw = wrap(eye.yaw + (nearer(eye.yaw, to.yaw) - eye.yaw) * k);
  eye.pitch += (to.pitch - eye.pitch) * k;
  return eye;
}
