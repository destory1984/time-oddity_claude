// A place in three dimensions: the Colosseum, built in code from core/colosseum.js and
// drawn by Babylon.js on a canvas of its own, clear where the sky is so that the computed
// sky (render/skyCanvas.js) shows behind it. Every part knows the years it stands; as the
// dial turns, parts come down and go up before the eye instead of one picture melting
// into another. Flat faces in a few colours, like cut paper.
import { Engine } from '@babylonjs/core/Engines/engine.js';
import { Scene } from '@babylonjs/core/scene.js';
import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera.js';
import { Mesh } from '@babylonjs/core/Meshes/mesh.js';
import '@babylonjs/core/Meshes/instancedMesh.js';
import { VertexData } from '@babylonjs/core/Meshes/mesh.vertexData.js';
import { CreateBox } from '@babylonjs/core/Meshes/Builders/boxBuilder.js';
import { CreateCylinder } from '@babylonjs/core/Meshes/Builders/cylinderBuilder.js';
import { CreateSphere } from '@babylonjs/core/Meshes/Builders/sphereBuilder.js';
import { CreateGround } from '@babylonjs/core/Meshes/Builders/groundBuilder.js';
import { TransformNode } from '@babylonjs/core/Meshes/transformNode.js';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial.js';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight.js';
import { DirectionalLight } from '@babylonjs/core/Lights/directionalLight.js';
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color.js';
import { Vector3 } from '@babylonjs/core/Maths/math.vector.js';
import { frameZoom } from '../ui/shell.js';
import {
  ARENA, BAYS, BUTTRESS_BORN, COLOSSUS_GONE, DECK_BORN, FATES, FLOOR_EARTH_GONE, FLOOR_WOOD_GONE, FOREVER, LEVELS, PIT,
  PODIUM, RING2, STANDS_WITHIN, TIERS, TURN_DEG, bayMiddle, bayStart, onRing, stands,
} from '../core/colosseum.js';

const RAD = Math.PI / 180;
const STEP = (Math.PI * 2) / BAYS;
const BAY_WIDE = 7.4;        // the width the arch is modelled at; each bay stretches it to its own
const WALL_DEEP = 2.4;
const FALL_MS = 700;         // a part comes down over this long
const RISE_MS = 450;         // and stands up again over this
const SUN_AZ = 300;          // the light comes low from where the sun went down

const hex = (c) => Color3.FromHexString(c);

// Gathers flat faces into one mesh. Corners are not shared, so every face is lit as one
// flat piece.
function faces() {
  const positions = [];
  const indices = [];
  const colors = [];
  // shade: how light the face is painted, 1 the colour itself. Faces that would lie in
  // shadow (the inside of an arch, the front of a step) are painted darker, so that the
  // shape reads in any light.
  const tri = (a, b, c, shade = 1) => {
    const n = positions.length / 3;
    positions.push(...a, ...b, ...c); indices.push(n, n + 1, n + 2);
    for (let i = 0; i < 3; i += 1) colors.push(shade, shade, shade, 1);
  };
  const quad = (a, b, c, d, shade = 1) => { tri(a, b, c, shade); tri(a, c, d, shade); };
  function mesh(name, scene, material, parent) {
    const made = new Mesh(name, scene);
    const data = new VertexData();
    const normals = [];
    VertexData.ComputeNormals(positions, indices, normals);
    data.positions = positions; data.indices = indices; data.normals = normals; data.colors = colors;
    data.applyToMesh(made);
    made.material = material;
    if (parent) made.parent = parent;
    return made;
  }
  return { tri, quad, mesh };
}

// One bay of an arcade: two piers, the arch between them, the cornice above. Its own
// axes: x across (BAY_WIDE), y up from its foot, z through the wall (out is +).
function archPanel(h) {
  const f = faces();
  const W = BAY_WIDE / 2;
  const D = WALL_DEEP / 2;
  const open = 2.45;
  const spring = h * 0.5;
  const ARC = 8;
  const arc = Array.from({ length: ARC + 1 }, (_, i) => { const a = Math.PI - (Math.PI * i) / ARC; return [open * Math.cos(a), spring + open * Math.sin(a)]; });
  for (const z of [D, -D]) {
    const shade = z > 0 ? 0.93 : 0.8;
    f.quad([-W, 0, z], [-open, 0, z], [-open, h, z], [-W, h, z], shade);
    f.quad([open, 0, z], [W, 0, z], [W, h, z], [open, h, z], shade);
    for (let i = 0; i < ARC; i += 1) f.quad([arc[i][0], arc[i][1], z], [arc[i + 1][0], arc[i + 1][1], z], [arc[i + 1][0], h, z], [arc[i][0], h, z], shade);
  }
  // The inside of the opening.
  f.quad([-open, 0, D], [-open, 0, -D], [-open, spring, -D], [-open, spring, D], 0.6);
  f.quad([open, 0, D], [open, 0, -D], [open, spring, -D], [open, spring, D], 0.6);
  for (let i = 0; i < ARC; i += 1) f.quad([arc[i][0], arc[i][1], D], [arc[i][0], arc[i][1], -D], [arc[i + 1][0], arc[i + 1][1], -D], [arc[i + 1][0], arc[i + 1][1], D], 0.55);
  // The ends and the top, seen when a neighbour is gone.
  f.quad([-W, 0, D], [-W, 0, -D], [-W, h, -D], [-W, h, D], 0.72);
  f.quad([W, 0, D], [W, 0, -D], [W, h, -D], [W, h, D], 0.72);
  f.quad([-W, h, D], [W, h, D], [W, h, -D], [-W, h, -D]);
  // The cornice, standing a little proud of the wall.
  const c = D + 0.4;
  f.quad([-W, h - 0.9, c], [W, h - 0.9, c], [W, h, c], [-W, h, c]);
  f.quad([-W, h - 0.9, D], [W, h - 0.9, D], [W, h - 0.9, c], [-W, h - 0.9, c], 0.6);
  f.quad([-W, h, D], [W, h, D], [W, h, c], [-W, h, c]);
  return f;
}

export function createSite(canvas) {
  const engine = new Engine(canvas, true, { stencil: false, alpha: true, premultipliedAlpha: false });
  const scene = new Scene(engine);
  scene.clearColor = new Color4(0, 0, 0, 0);
  scene.skipPointerMovePicking = true;
  const camera = new FreeCamera('eye', new Vector3(0, 1.7, 0), scene);
  camera.minZ = 0.3; camera.maxZ = 12000;

  const skyLight = new HemisphericLight('sky', new Vector3(0, 1, 0), scene);
  skyLight.intensity = 0.95;
  skyLight.diffuse = new Color3(1, 0.93, 0.86);
  skyLight.groundColor = new Color3(0.5, 0.44, 0.5);
  skyLight.specular = Color3.Black();
  const low = new DirectionalLight('low', new Vector3(-Math.sin(SUN_AZ * RAD) * 0.97, -0.22, -Math.cos(SUN_AZ * RAD) * 0.97), scene);
  low.intensity = 0.7;
  low.diffuse = new Color3(1, 0.7, 0.48);
  low.specular = Color3.Black();

  const paint = (name, colour, twoSided = true) => {
    const m = new StandardMaterial(name, scene);
    m.diffuseColor = hex(colour);
    m.specularColor = Color3.Black();
    if (twoSided) { m.backFaceCulling = false; m.twoSidedLighting = true; }
    return m;
  };
  const STONE_NEW = hex('#eadcc0');
  const STONE_OLD = hex('#b6a17c');
  const INNER_NEW = hex('#dcc9a6');
  const INNER_OLD = hex('#a38a64');
  const stone = paint('stone', '#eadcc0');
  const inner = paint('inner', '#dcc9a6');
  const brick = paint('brick', '#a87b56');
  const marble = paint('marble', '#f1eadb');
  marble.emissiveColor = hex('#2b2721');   // the white seats keep a little light of their own at dusk
  const wood = paint('wood', '#8a5f38');
  const earth = paint('earth', '#c9ae7c');
  const dark = paint('dark', '#3a2c22');
  const red = paint('red', '#b4483c');
  // Cloth lets the light through: its underside is not left dark.
  red.emissiveColor = hex('#5a2019');
  const bronze = paint('bronze', '#7d6a35');
  const pineGreen = paint('pine', '#2f5a3c');
  const trunk = paint('trunk', '#5a4330');
  const land = paint('land', '#a59673', false);
  const paving = paint('paving', '#c2b392');

  // The building is turned to lie as it lies in Rome.
  const root = new TransformNode('colosseum', scene);
  root.rotation.y = TURN_DEG * RAD;

  // Every part that comes or goes: { node, born, gone, v, apply(v) }.
  const parts = [];
  const part = (node, born, gone, apply) => { parts.push({ node, born, gone, v: -1, apply }); return node; };
  // A part placed on its own foot (an arch, a mast): it sinks to the ground as it shrinks.
  const falls = (node, footY) => (v) => { node.scaling.y = Math.max(0.001, v); node.position.y = footY * v * v; };
  // A part modelled in the building's own axes (a stand, a floor): it settles downward.
  const settles = (node) => (v) => { node.scaling.y = Math.max(0.001, v); };

  const at = (t, d, y) => { const p = onRing(t, d); return [p.x, y, p.z]; };
  const widthAt = (t, d) => { const a = onRing(t - STEP / 2, d); const b = onRing(t + STEP / 2, d); return Math.hypot(a.x - b.x, a.z - b.z); };
  // Puts a thing at a bay, d metres in, facing out.
  function place(node, t, d, y) {
    const p = onRing(t, d);
    node.parent = root;
    node.position.set(p.x, y, p.z);
    node.rotation.y = Math.atan2(p.nx, p.nz);
    return node;
  }

  // The two arcaded walls.
  const outerArch = LEVELS.slice(0, 3).map((level, i) => archPanel(level.h).mesh(`arch${i}`, scene, stone));
  const innerArch = LEVELS.slice(0, 3).map((level, i) => archPanel(level.h).mesh(`innerArch${i}`, scene, inner));
  const attic = CreateBox('attic', { width: BAY_WIDE, height: LEVELS[3].h, depth: WALL_DEEP - 0.3 }, scene);
  attic.material = stone;
  const mast = CreateBox('mast', { width: 0.4, height: 8, depth: 0.4 }, scene);
  mast.material = wood;
  const statue = CreateBox('statue', { width: 1, height: 3.2, depth: 0.7 }, scene);
  statue.material = marble;
  const wallBox = CreateBox('radial', { size: 1 }, scene);
  wallBox.material = brick;
  for (const source of [...outerArch, ...innerArch, attic, mast, statue, wallBox]) source.setEnabled(false);

  for (let bay = 0; bay < BAYS; bay += 1) {
    const t = bayMiddle(bay);
    LEVELS.slice(0, 3).forEach((level, i) => {
      const a = place(outerArch[i].createInstance(`o${bay}-${i}`), t, 0, level.y);
      a.scaling.x = (widthAt(t, 0) / BAY_WIDE) * 1.01;
      part(a, -FOREVER, FATES.outer[bay][i], falls(a, level.y));
      const b = place(innerArch[i].createInstance(`i${bay}-${i}`), t, RING2, level.y);
      b.scaling.x = (widthAt(t, RING2) / BAY_WIDE) * 1.01;
      part(b, -FOREVER, FATES.ring2[bay][i], falls(b, level.y));
      if (i > 0) {
        const s = place(statue.createInstance(`s${bay}-${i}`), t, 0, level.y + 2);
        part(s, -FOREVER, FATES.statues[bay * 2 + i - 1], falls(s, level.y + 2));
      }
    });
    const top = LEVELS[3];
    const box = place(attic.createInstance(`a${bay}`), t, 0, top.y + top.h / 2);
    box.scaling.x = (widthAt(t, 0) / BAY_WIDE) * 1.01;
    part(box, -FOREVER, FATES.outer[bay][3], falls(box, top.y + top.h / 2));
    for (let k = 0; k < 3; k += 1) {
      const pole = place(mast.createInstance(`m${bay}-${k}`), t + (k - 1) * (STEP / 3), -1.5, 45.5);
      part(pole, -FOREVER, FATES.masts[bay * 3 + k], falls(pole, 45.5));
    }
    // What holds the stands up, and is all that is left of them: walls running in toward
    // the arena, lower as they go.
    TIERS.forEach((tier, k) => {
      const mid = (tier.from + tier.to) / 2;
      const high = (tier.top + tier.foot) / 2 * 0.55 * FATES.jitter[bay * 3 + k];
      const w = place(wallBox.createInstance(`r${bay}-${k}`), bayStart(bay), mid, high / 2);
      w.scaling.set(1.3, high, tier.to - tier.from);
      w.freezeWorldMatrix();
    });
  }

  // The stands: three tiers of steps, in ten lengths each, and the roofed gallery on top.
  const CHUNK = 8;
  for (let chunk = 0; chunk < BAYS / CHUNK; chunk += 1) {
    const t0 = bayStart(chunk * CHUNK);
    const t1 = bayStart((chunk + 1) * CHUNK);
    TIERS.forEach((tier, k) => {
      const f = faces();
      const stepDeep = (tier.to - tier.from) / tier.steps;
      const stepHigh = (tier.top - tier.foot) / tier.steps;
      for (let b = 0; b < CHUNK; b += 1) {
        const a = t0 + b * STEP;
        const c = a + STEP;
        for (let s = 0; s < tier.steps; s += 1) {
          const d0 = tier.from + s * stepDeep;
          const d1 = d0 + stepDeep;
          const y = tier.top - s * stepHigh;
          f.quad(at(a, d0, y), at(c, d0, y), at(c, d1, y), at(a, d1, y));
          f.quad(at(a, d1, y), at(c, d1, y), at(c, d1, y - stepHigh), at(a, d1, y - stepHigh), 0.68);
        }
        if (k === 2) {
          // The podium and its wall down to the arena.
          f.quad(at(a, tier.to, PODIUM), at(c, tier.to, PODIUM), at(c, ARENA, PODIUM), at(a, ARENA, PODIUM));
          f.quad(at(a, ARENA, PODIUM), at(c, ARENA, PODIUM), at(c, ARENA, 0), at(a, ARENA, 0), 0.74);
        }
      }
      for (const end of [t0, t1]) {
        for (let s = 0; s < tier.steps; s += 1) {
          const d0 = tier.from + s * stepDeep;
          const y = tier.top - s * stepHigh;
          f.quad(at(end, d0, y), at(end, d0 + stepDeep, y), at(end, d0 + stepDeep, 0), at(end, d0, 0), 0.76);
        }
      }
      const seats = f.mesh(`seats${k}-${chunk}`, scene, marble, root);
      part(seats, -FOREVER, FATES.seats[k][chunk], settles(seats));
    });
    const g = faces();
    const a = faces();
    for (let b = 0; b < CHUNK; b += 1) {
      const p = t0 + b * STEP;
      const q = p + STEP;
      g.quad(at(p, 0.6, 36), at(q, 0.6, 36), at(q, RING2, 36), at(p, RING2, 36));
      g.quad(at(p, RING2, 36), at(q, RING2, 36), at(q, RING2, 33), at(p, RING2, 33), 0.7);
      // The awning: cloth sloping in from the masts. It reaches only over the top seats
      // (the real one reached further), so that from the arena the sky and the rim are seen.
      a.quad(at(p, -0.5, 46.5), at(q, -0.5, 46.5), at(q, 16, 42), at(p, 16, 42));
    }
    const gallery = g.mesh(`gallery${chunk}`, scene, inner, root);
    part(gallery, -FOREVER, FATES.gallery[chunk], settles(gallery));
    const cloth = a.mesh(`awning${chunk}`, scene, red, root);
    part(cloth, -FOREVER, FATES.awning[chunk], settles(cloth));
  }

  // The low walls that ring the ruin, always there under the stands.
  const rings = faces();
  for (let bay = 0; bay < BAYS; bay += 1) {
    const p = bayStart(bay);
    const q = p + STEP;
    for (const [d, high] of [[24, 12], [40, 5.5], [ARENA, 2.2]]) rings.quad(at(p, d, 0), at(q, d, 0), at(q, d, high), at(p, d, high), 0.85);
    // The side of the pit under the arena.
    rings.quad(at(p, ARENA + 0.3, -PIT), at(q, ARENA + 0.3, -PIT), at(q, ARENA + 0.3, 0), at(p, ARENA + 0.3, 0), 0.7);
  }
  rings.mesh('rings', scene, brick, root).freezeWorldMatrix();

  // The arena: a wooden floor, earth under it once the games had ended, and beneath both
  // the rooms and passages that were dug out in the nineteenth century.
  const fan = (y, keep = () => true, hub = [0, y, 0]) => {
    const f = faces();
    for (let bay = 0; bay < BAYS; bay += 1) {
      const p = at(bayStart(bay), ARENA + 0.2, y);
      const q = at(bayStart(bay + 1), ARENA + 0.2, y);
      if (keep(p) && keep(q)) f.tri(hub, p, q);
    }
    return f;
  };
  fan(-PIT).mesh('pitFloor', scene, dark, root).freezeWorldMatrix();
  for (const z of [-17, -11.5, -6, -2, 2, 6, 11.5, 17]) {
    const long = 2 * 41.5 * Math.sqrt(1 - (z / 25.5) ** 2) - 4;
    const w = CreateBox(`under${z}`, { width: long, height: PIT - 0.4, depth: 0.9 }, scene);
    w.material = brick; w.parent = root;
    w.position.set(0, -PIT / 2 - 0.2, z);
    w.freezeWorldMatrix();
  }
  const sinks = (node, y) => (v) => { node.position.y = y - (1 - v) * (PIT + 0.5); };
  const earthFloor = fan(0).mesh('earthFloor', scene, earth, root);
  part(earthFloor, -FOREVER, FLOOR_EARTH_GONE, sinks(earthFloor, 0));
  const woodFloor = fan(0.08).mesh('woodFloor', scene, wood, root);
  part(woodFloor, -FOREVER, FLOOR_WOOD_GONE, sinks(woodFloor, 0));
  const deck = fan(0.06, (p) => p[0] > 20, [31, 0.06, 0]).mesh('deck', scene, wood, root);
  part(deck, DECK_BORN, FOREVER, sinks(deck, 0));

  // The brick buttresses that hold the two broken ends of the outer wall.
  const standing = (bay) => (Math.acos(Math.max(-1, Math.min(1, onRing(bayMiddle(bay)).nz))) / RAD) <= STANDS_WITHIN;
  let buttress = 0;
  for (let bay = 0; bay < BAYS; bay += 1) {
    const next = (bay + 1) % BAYS;
    if (standing(bay) === standing(next)) continue;
    const way = standing(bay) ? 1 : -1;               // toward the side that is gone
    const from = bayStart(next);
    const f = faces();
    const LONG = 3;
    for (let j = 0; j < LONG; j += 1) {
      const a = from + way * j * STEP;
      const c = a + way * STEP;
      const ha = 44 * (1 - j / LONG);
      const hc = 44 * (1 - (j + 1) / LONG);
      f.quad(at(a, -0.7, 0), at(c, -0.7, 0), at(c, -0.7, hc), at(a, -0.7, ha));
      f.quad(at(a, 2.4, 0), at(c, 2.4, 0), at(c, 2.4, hc), at(a, 2.4, ha), 0.8);
      f.quad(at(a, -0.7, ha), at(c, -0.7, hc), at(c, 2.4, hc), at(a, 2.4, ha));
    }
    const made = f.mesh(`buttress${buttress}`, scene, brick, root);
    part(made, BUTTRESS_BORN[buttress % 2], FOREVER, settles(made));
    buttress += 1;
  }

  // The bronze giant that stood beside it and gave it its name.
  const giant = new TransformNode('colossus', scene);
  giant.parent = root; giant.position.set(-62, 0, 112);
  const base = CreateBox('giantBase', { width: 9, height: 7, depth: 9 }, scene);
  base.material = paving; base.parent = giant; base.position.y = 3.5;
  const body = CreateCylinder('giantBody', { height: 24, diameterTop: 3.4, diameterBottom: 6, tessellation: 7 }, scene);
  body.material = bronze; body.parent = giant; body.position.y = 19; body.convertToFlatShadedMesh();
  const head = CreateSphere('giantHead', { diameter: 5, segments: 3 }, scene);
  head.material = bronze; head.parent = giant; head.position.y = 33; head.convertToFlatShadedMesh();
  part(giant, -FOREVER, COLOSSUS_GONE, falls(giant, 0));

  // The ground, the paving round the building, and umbrella pines.
  const ground = CreateGround('land', { width: 12000, height: 12000 }, scene);
  ground.material = land; ground.position.y = -0.05; ground.freezeWorldMatrix();
  // Not under the arena: the pit is there.
  const apronMesh = faces();
  for (let bay = 0; bay < BAYS; bay += 1) apronMesh.quad(at(bayStart(bay), -32, 0), at(bayStart(bay + 1), -32, 0), at(bayStart(bay + 1), ARENA + 0.3, 0), at(bayStart(bay), ARENA + 0.3, 0));
  apronMesh.mesh('paving', scene, paving, root).freezeWorldMatrix();
  const crown = CreateSphere('crown', { diameter: 1, segments: 3 }, scene);
  crown.material = pineGreen; crown.convertToFlatShadedMesh(); crown.setEnabled(false);
  const stem = CreateCylinder('stem', { height: 1, diameter: 1, tessellation: 5 }, scene);
  stem.material = trunk; stem.setEnabled(false);
  for (let i = 0; i < 22; i += 1) {
    const around = i * 2.399963;               // the golden angle: scattered, never in a row
    const far = 165 + ((i * 53) % 190);
    const tall = 14 + ((i * 7) % 8);
    const x = Math.cos(around) * far;
    const z = Math.sin(around) * far;
    const s = stem.createInstance(`stem${i}`);
    s.position.set(x, tall / 2, z); s.scaling.set(0.9, tall, 0.9); s.freezeWorldMatrix();
    const c = crown.createInstance(`crown${i}`);
    c.position.set(x, tall + 1.5, z); c.scaling.set(13, 5, 13); c.freezeWorldMatrix();
  }

  let shownYear = null;
  // year: where the dial stands. Parts whose time has come or gone move toward it.
  function update(year, dtMs) {
    if (year !== shownYear) {
      shownYear = year;
      // The stone darkens with the centuries, most of it by 1600.
      const age = Math.max(0, Math.min(1, (year - 80) / 1500));
      Color3.LerpToRef(STONE_NEW, STONE_OLD, age, stone.diffuseColor);
      Color3.LerpToRef(INNER_NEW, INNER_OLD, age, inner.diffuseColor);
    }
    for (const p of parts) {
      const want = stands(year, p.born, p.gone) ? 1 : 0;
      if (p.v === want) continue;
      // The first time, a part simply is or is not.
      if (p.v < 0) p.v = want;
      else p.v = want > p.v ? Math.min(1, p.v + dtMs / RISE_MS) : Math.max(0, p.v - dtMs / FALL_MS);
      const shown = p.v > 0.01;
      if (p.node.isEnabled() !== shown) p.node.setEnabled(shown);
      if (shown) p.apply(p.v * p.v * (3 - 2 * p.v));
    }
  }

  let fovY = 1;
  function resize() {
    engine.setHardwareScalingLevel(1 / ((window.devicePixelRatio || 1) * frameZoom()));
    engine.resize();
    const box = canvas.getBoundingClientRect();
    // A tall screen sees wide up and down so that it sees enough from side to side.
    fovY = box.width < box.height ? 1.12 : 0.95;
    camera.fov = fovY;
  }

  // flier: { x, y, z, yaw, pitch } (core/fly.js), in the world: x east, z north.
  function render(flier) {
    camera.position.set(flier.x, flier.y, flier.z);
    camera.rotation.set(-flier.pitch * RAD, flier.yaw * RAD, 0);
    scene.render();
  }

  return { resize, update, render, fovY: () => fovY, parts: () => parts.length };
}
