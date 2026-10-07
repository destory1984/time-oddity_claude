// Where a point of the sky falls on the screen. A perspective view 60 degrees wide that
// looks toward facingAz; pitch 0 to 1 raises the head. The horizon straight ahead sits at
// 60% of the height with the head level and at 85% with it fully raised, on any screen.
const RAD = Math.PI / 180;
const HALF_WIDTH_DEG = 30;
const HORIZON_LEVEL = 0.60;
const HORIZON_RAISED = 0.85;

const focal = (w) => w / 2 / Math.tan(HALF_WIDTH_DEG * RAD);

// How far the head goes up, in degrees: about 32 on a 375 x 812 screen.
export function maxPitchDeg(w, h) {
  return Math.atan(((HORIZON_RAISED - HORIZON_LEVEL) * h) / focal(w)) / RAD;
}

// alt, az in degrees. Returns screen x, y and whether the point is in front of the eye.
export function project(alt, az, { facingAz, pitch, w, h }) {
  const f = focal(w);
  const tilt = pitch * maxPitchDeg(w, h) * RAD;
  const around = (az - facingAz) * RAD;
  const right = Math.cos(alt * RAD) * Math.sin(around);
  const up = Math.sin(alt * RAD);
  const ahead = Math.cos(alt * RAD) * Math.cos(around);
  // Tip the eye up by the tilt.
  const depth = ahead * Math.cos(tilt) + up * Math.sin(tilt);
  const height = up * Math.cos(tilt) - ahead * Math.sin(tilt);
  const front = depth > 1e-6;
  const d = front ? depth : 1e-6;
  return { x: w / 2 + (f * right) / d, y: HORIZON_LEVEL * h - (f * height) / d, front };
}
