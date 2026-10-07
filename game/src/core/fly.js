// Flying about a place: where the flier is, which way she looks, and one step of her
// flight. She goes the way she looks (W and S), slides sideways (A and D) and straight up
// and down, turns (Q and E, or a drag), and is kept out of stone and above the ground by
// what the place says of itself. World axes: x east, z north, y up, metres; yaw is the
// azimuth she faces in degrees (0 north, 90 east), pitch is up from level.
const RAD = Math.PI / 180;
export const SPEED = 16;          // metres a second
export const FAST = 3;            // times that, with the fast key held
const EASE_MS = 180;              // her speed comes up and falls away over about this long
const TURN_RATE = 70;             // degrees a second for the turning keys
const LIFT_MS = 110;              // how fast she is lifted over what rises under her
export const PITCH_MOST = 85;
export const CEILING = 400;

export function createFlier({ x = 0, y = 1.7, z = 0, yaw = 0, pitch = 0 } = {}) {
  return { x, y, z, yaw, pitch, vx: 0, vy: 0, vz: 0 };
}

// A drag of the view, in degrees.
export function lookBy(flier, yawDeg, pitchDeg) {
  flier.yaw = (flier.yaw + yawDeg + 360) % 360;
  flier.pitch = Math.max(-PITCH_MOST, Math.min(PITCH_MOST, flier.pitch + pitchDeg));
}

// intent: { drive, strafe, rise, turn } each -1 to 1, fast (true or false).
// place: { floorAt(x, z, y): the lowest her eye may be there, inWall(x, z, y): stone }.
export function stepFlier(flier, dtMs, intent, place) {
  const dt = dtMs / 1000;
  if (dt <= 0) return;
  if (intent.turn) lookBy(flier, intent.turn * TURN_RATE * dt, 0);
  const yaw = flier.yaw * RAD;
  const pitch = flier.pitch * RAD;
  const speed = SPEED * (intent.fast ? FAST : 1);
  // Ahead is where she looks; sideways stays level.
  const wantX = (Math.sin(yaw) * Math.cos(pitch) * intent.drive + Math.cos(yaw) * intent.strafe) * speed;
  const wantZ = (Math.cos(yaw) * Math.cos(pitch) * intent.drive - Math.sin(yaw) * intent.strafe) * speed;
  const wantY = (Math.sin(pitch) * intent.drive + intent.rise) * speed;
  const ease = Math.min(1, dtMs / EASE_MS);
  flier.vx += (wantX - flier.vx) * ease;
  flier.vy += (wantY - flier.vy) * ease;
  flier.vz += (wantZ - flier.vz) * ease;

  // Stone stops her; she slides along it on whichever axis is free.
  const nx = flier.x + flier.vx * dt;
  const nz = flier.z + flier.vz * dt;
  let ny = Math.min(CEILING, flier.y + flier.vy * dt);
  if (!place.inWall(nx, nz, ny)) { flier.x = nx; flier.z = nz; }
  else if (!place.inWall(nx, flier.z, ny)) { flier.x = nx; flier.vz = 0; }
  else if (!place.inWall(flier.x, nz, ny)) { flier.z = nz; flier.vx = 0; }
  else if (place.inWall(flier.x, flier.z, ny)) { ny = flier.y; flier.vy = 0; flier.vx = 0; flier.vz = 0; }
  else { flier.vx = 0; flier.vz = 0; }
  // What rises under her lifts her; she never sinks into it.
  const floor = place.floorAt(flier.x, flier.z, ny);
  if (ny < floor) { ny += (floor - ny) * Math.min(1, dtMs / LIFT_MS); if (flier.vy < 0) flier.vy = 0; }
  flier.y = ny;
}

// Moves her by so many metres ahead, sideways and up at once (two fingers, the wheel),
// by the same rules: stone stops her, the floor holds her up.
export function nudgeFlier(flier, ahead, sideways, up, place) {
  const yaw = flier.yaw * RAD;
  const nx = flier.x + Math.sin(yaw) * ahead + Math.cos(yaw) * sideways;
  const nz = flier.z + Math.cos(yaw) * ahead - Math.sin(yaw) * sideways;
  const ny = Math.min(CEILING, flier.y + up);
  if (!place.inWall(nx, nz, ny)) { flier.x = nx; flier.z = nz; }
  if (!place.inWall(flier.x, flier.z, ny)) flier.y = Math.max(ny, place.floorAt(flier.x, flier.z, ny));
}

export const farFrom = (flier, x = 0, z = 0) => Math.hypot(flier.x - x, flier.z - z);
