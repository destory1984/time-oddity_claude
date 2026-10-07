// The globe: the Earth turned by a finger, with a pin on each square. Babylon.js draws
// the sphere; the pins are HTML buttons moved to where their place is each frame.
import { zoomBy } from '../core/zoom.js';
import { NEAR, SLOW, pinUnder, pointerTo } from '../core/flight.js';
import { Engine } from '@babylonjs/core/Engines/engine.js';
import { Scene } from '@babylonjs/core/scene.js';
import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera.js';
import { Camera } from '@babylonjs/core/Cameras/camera.js';
import { CreateSphere } from '@babylonjs/core/Meshes/Builders/sphereBuilder.js';
import { TransformNode } from '@babylonjs/core/Meshes/transformNode.js';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial.js';
import { Texture } from '@babylonjs/core/Materials/Textures/texture.js';
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color.js';
import { Vector3 } from '@babylonjs/core/Maths/math.vector.js';
import { squareTitle } from '../core/squares.js';

const RAD = Math.PI / 180;
const GLOBE_WIDTH = 0.8;      // the Earth's diameter as a share of the screen's width (of `span` on a wide window)
const TALL = 0.6;             // a window wider than this share of its height counts as this wide
const MAX_TILT = 89 * RAD;   // far enough to bring the South Pole under her (a square stands there)
const COAST_MS = 160;         // after a drag the spin falls by 1/e in this long

// Where a latitude and longitude lie on Babylon's sphere, whose texture runs from
// longitude -180 at u = 0 round to +180 at u = 1.
function onSphere(lat, lon) {
  const around = (lon + 180) * RAD;
  return new Vector3(Math.cos(lat * RAD) * Math.cos(around), Math.sin(lat * RAD), Math.cos(lat * RAD) * Math.sin(around));
}

const smooth = (t) => t * t * (3 - 2 * t);
const wrapPi = (a) => Math.atan2(Math.sin(a), Math.cos(a));

export function createGlobe(canvas, pinsEl, { squares, onPick }) {
  const engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: false });
  const scene = new Scene(engine);
  scene.clearColor = new Color4(0.008, 0.004, 0.11, 1);
  const camera = new FreeCamera('camera', new Vector3(0, 0, -5), scene);
  camera.setTarget(Vector3.Zero());
  camera.mode = Camera.ORTHOGRAPHIC_CAMERA;

  // The tilt turns about the screen's sideways axis; the Earth spins inside it.
  const tilter = new TransformNode('tilter', scene);
  const earth = CreateSphere('earth', { diameter: 2, segments: 64 }, scene);
  earth.parent = tilter;
  const material = new StandardMaterial('earth', scene);
  // Not inverted in y: Babylon's sphere runs v from the north pole down.
  material.emissiveTexture = new Texture('./earth-day.jpg', scene, false, false);
  // Seen from outside, Babylon's sphere runs u westward; turn it so that east is to the right.
  material.emissiveTexture.uScale = -1;
  material.disableLighting = true;
  material.specularColor = Color3.Black();
  earth.material = material;

  const pins = squares.map((square) => {
    const node = new TransformNode(`pin-${square.id}`, scene);
    node.parent = earth;
    node.position = onSphere(square.lat, square.lon);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'pin';
    button.innerHTML = `<span>${squareTitle(square)}</span>`;
    button.addEventListener('click', () => onPick(square.id));
    pinsEl.append(button);
    return { square, node, button, label: squareTitle(square) };
  });

  let w = 1;
  let h = 1;
  let active = true;
  let span = 1;                          // the width the Earth is sized by, in px
  let zoom = 1;                          // how close: 1 the whole Earth (core/zoom.js)
  let targetId = null;                   // the square she is flying to (it shines)
  let shownIds = null;                   // the squares whose pins are shown; null for all
  let underId = null;                    // the square under her, at the middle
  let views = [];                        // every pin as seen now: { id, x, y, z } (core/flight.js)
  let moved = { dx: 0, dy: 0 };          // how far the ground has moved on screen since last asked, px
  let spin = { yaw: 0, tilt: 0 };       // finger speed, rad per ms
  let held = false;
  let glide = null;                      // a timed turn to a place

  function resize() {
    const box = canvas.getBoundingClientRect();
    w = box.width; h = box.height;
    engine.resize();
    frameCamera();
  }

  // Sizes the Earth for the zoom it stands at (without measuring the canvas again).
  function frameCamera() {
    span = Math.min(w, h * TALL) * zoom;
    const half = w / span / GLOBE_WIDTH; // half the screen's width, in Earth radii
    camera.orthoLeft = -half; camera.orthoRight = half;
    camera.orthoTop = (half * h) / w; camera.orthoBottom = (-half * h) / w;
  }

  // Where a point of the Earth is now, in the world: x right, y up, z away from the eye.
  function worldOf(node) {
    tilter.computeWorldMatrix(true);
    earth.computeWorldMatrix(true);
    node.computeWorldMatrix(true);
    return node.getAbsolutePosition();
  }

  // The yaw and tilt that bring a place to the middle of the screen, found on the mesh
  // itself so that it cannot disagree with what is drawn.
  function anglesFacing(node) {
    const keep = { yaw: earth.rotation.y, tilt: tilter.rotation.x };
    let best = null;
    const local = node.position;
    const around = Math.atan2(local.x, -local.z);
    const up = Math.asin(Math.max(-1, Math.min(1, local.y)));
    for (const yaw of [around, -around]) {
      for (const tilt of [up, -up]) {
        earth.rotation.y = yaw; tilter.rotation.x = tilt;
        const at = worldOf(node);
        const miss = at.x * at.x + at.y * at.y + (at.z + 1) * (at.z + 1);
        if (!best || miss < best.miss) best = { yaw, tilt, miss };
      }
    }
    earth.rotation.y = keep.yaw; tilter.rotation.x = keep.tilt;
    return best;
  }

  // Which way the surface moves on screen for a positive yaw and a positive tilt, so
  // that a drag carries the ground with the finger.
  const probe = new TransformNode('probe', scene);
  probe.parent = earth;
  probe.position = new Vector3(0, 0, -1);
  earth.rotation.y = 0.01;
  const yawSign = Math.sign(worldOf(probe).x) || 1;
  earth.rotation.y = 0;
  tilter.rotation.x = 0.01;
  const tiltSign = Math.sign(worldOf(probe).y) || 1;
  tilter.rotation.x = 0;

  function clampTilt() {
    tilter.rotation.x = Math.max(-MAX_TILT, Math.min(MAX_TILT, tilter.rotation.x));
  }

  function drag(dx, dy) {
    // A timed turn to a square is not interrupted: whoever asked for it is waiting on it.
    if (glide) return;
    held = true;
    const { yaw, tilt } = turnBy(dx, dy);
    spin = { yaw: yaw / 16, tilt: tilt / 16 };
  }

  // Moves the ground by (dx, dy) pixels on the screen (y down); returns the turn made.
  function turnBy(dx, dy) {
    const perPx = 1 / (GLOBE_WIDTH * span * 0.5);   // radians of turn per pixel at the middle
    const yaw = dx * perPx * yawSign;
    const tilt = dy * perPx * -tiltSign;         // screen y runs down
    earth.rotation.y += yaw;
    tilter.rotation.x += tilt;
    clampTilt();
    moved.dx += dx; moved.dy += dy;
    return { yaw, tilt };
  }

  function release() { held = false; }

  // Comes closer or steps back by a factor; returns the zoom it ends at.
  function zoomByFactor(factor) {
    const next = zoomBy(zoom, factor);
    if (next !== zoom) { zoom = next; frameCamera(); }
    return zoom;
  }
  function setZoom(next) { zoom = zoomBy(1, next); frameCamera(); }

  // A spare point of the Earth to aim at any latitude and longitude.
  const aim = new TransformNode('aim', scene);
  aim.parent = earth;
  function anglesFacingPlace(lat, lon) {
    aim.position = onSphere(lat, lon);
    return anglesFacing(aim);
  }

  // toZoom: when given, the Earth also comes that close on the way (coming down onto a square).
  function spinTo(lat, lon, seconds, toZoom = undefined) {
    const to = anglesFacingPlace(lat, lon);
    return new Promise((resolve) => {
      glide = {
        fromYaw: earth.rotation.y, byYaw: wrapPi(to.yaw - earth.rotation.y),
        fromTilt: tilter.rotation.x, byTilt: Math.max(-MAX_TILT, Math.min(MAX_TILT, to.tilt)) - tilter.rotation.x,
        fromZoom: zoom, byZoom: (toZoom ?? zoom) - zoom,
        elapsed: 0, total: seconds * 1000, resolve,
      };
      spin = { yaw: 0, tilt: 0 };
    });
  }

  function faceNow(lat, lon) {
    const to = anglesFacingPlace(lat, lon);
    earth.rotation.y = to.yaw; tilter.rotation.x = to.tilt; clampTilt();
  }

  function setActive(on) { active = on; }

  function render(dtMs) {
    if (!active) return;
    if (glide) {
      glide.elapsed += dtMs;
      const t = smooth(Math.min(1, glide.elapsed / glide.total));
      earth.rotation.y = glide.fromYaw + glide.byYaw * t;
      tilter.rotation.x = glide.fromTilt + glide.byTilt * t;
      if (glide.byZoom !== 0) { zoom = glide.fromZoom + glide.byZoom * t; frameCamera(); }
      if (glide.elapsed >= glide.total) { const done = glide.resolve; glide = null; done(); }
    } else if (!held && (Math.abs(spin.yaw) > 1e-6 || Math.abs(spin.tilt) > 1e-6)) {
      earth.rotation.y += spin.yaw * dtMs;
      tilter.rotation.x += spin.tilt * dtMs;
      clampTilt();
      {
        const perPx = 1 / (GLOBE_WIDTH * span * 0.5);
        moved.dx += (spin.yaw * dtMs * yawSign) / perPx; moved.dy += (spin.tilt * dtMs * -tiltSign) / perPx;
      }
      const keep = Math.exp(-dtMs / COAST_MS);
      spin = { yaw: spin.yaw * keep, tilt: spin.tilt * keep };
    }
    const pxPerUnit = (GLOBE_WIDTH * span) / 2;
    // Left alone near a square, the ground eases under her until the square is at the
    // middle: she slows by herself and may come down (core/flight.js).
    if (!held && !glide && Math.abs(spin.yaw) < 2e-5 && Math.abs(spin.tilt) < 2e-5) {
      let near = null;
      for (const v of views) {
        const d = Math.hypot(v.x, v.y);
        // The square she is flying to draws her from farther out than the others do.
        if (v.z >= 0 || d > (v.id === targetId ? SLOW : SLOW * 0.6) || d < NEAR * 0.1) continue;
        if (v.id === targetId) { near = v; break; }
        if (!near || d < Math.hypot(near.x, near.y)) near = v;
      }
      if (near) {
        const k = 1 - Math.exp(-dtMs / 260);
        turnBy(-near.x * pxPerUnit * k, near.y * pxPerUnit * k);
      }
    }
    scene.render();
    // Names are laid out so that none lies on another: to the right of its pin if there
    // is room, else to the left, else a line or two lower or higher. Widths are judged from the letters.
    const taken = [];
    const hits = (box) => taken.some((t) => box.left < t.right && box.right > t.left && box.top < t.bottom && box.bottom > t.top);
    const shown = [];
    views = [];
    for (const pin of pins) {
      // A pin of another century is not there: not seen, not flown to, not come down on.
      if (shownIds && !shownIds.includes(pin.square.id)) { pin.button.style.display = 'none'; continue; }
      const at = worldOf(pin.node);
      views.push({ id: pin.square.id, x: at.x, y: at.y, z: at.z });
      const front = at.z < -0.12;
      pin.button.style.display = front ? '' : 'none';
      if (!front) continue;
      const x = w / 2 + at.x * pxPerUnit;
      const y = h / 2 - at.y * pxPerUnit;
      pin.button.style.left = `${x.toFixed(1)}px`;
      pin.button.style.top = `${y.toFixed(1)}px`;
      shown.push({ pin, x, y });
      taken.push({ left: x - 9, right: x + 9, top: y - 9, bottom: y + 9 });
    }
    for (const { pin, x, y } of shown) {
      const wide = pin.label.length * 11.5 + 6;
      const boxAt = (side, drop) => (side > 0
        ? { left: x + 12, right: x + 12 + wide, top: y - 8 + drop, bottom: y + 8 + drop }
        : { left: x - 12 - wide, right: x - 12, top: y - 8 + drop, bottom: y + 8 + drop });
      const tries = [[1, 0], [-1, 0], [1, 17], [-1, 17], [1, -17], [-1, -17], [1, 34], [-1, 34], [1, -34], [-1, -34]];
      const free = tries.find(([sd, dp]) => !hits(boxAt(sd, dp)));
      // Where pins crowd (Europe) a name with no room is left out; its pin and the notebook still lead there.
      pin.button.classList.toggle('bare', !free);
      if (!free) continue;
      const [side, drop] = free;
      pin.button.classList.toggle('left', side < 0);
      pin.button.style.setProperty('--drop', `${drop}px`);
      taken.push(boxAt(side, drop));
    }
    underId = pinUnder(views, targetId);
    for (const pin of pins) {
      pin.button.classList.toggle('target', pin.square.id === targetId);
      pin.button.classList.toggle('under', pin.square.id === underId);
    }
  }

  // The ground's motion on the screen since this was last asked, for her flying pose.
  function motion() { const m = moved; moved = { dx: 0, dy: 0 }; return m; }

  return {
    resize, setActive, drag, release, zoomBy: zoomByFactor, zoom: () => zoom, setZoom, spinTo, faceNow, render, motion,
    // The square she is flying to (null for none), the one under her, and the arrow to the first.
    setTarget(id) { targetId = id; },
    setShown(ids) { shownIds = ids; },
    under: () => underId,
    pointer: () => pointerTo(views.find((v) => v.id === targetId) ?? null),
  };
}
