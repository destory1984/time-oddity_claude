// What moves in a scene that is walked about, the way volume 1 plays its days on the
// Moon again (oddity/src/core/moonScenes.js): a few pieces cut out on their own, and for
// every moment where each one stands. Nothing here draws; ui/walk.js puts the pieces
// where this says (docs/기획서-v4-사는-때로.md section 4, the second look).
//
// A scene's `moving` is a list of these:
// - drift: one long strip (people walking) slid along the street between two ends,
//   several copies of it one after another so that the line never breaks. It is seen
//   only between `from` and `to` (it comes out from behind one thing and goes in behind
//   another). speed is in scene widths a second, less than 0 to go left; flip: the strip
//   is turned to face left; behind: it goes by behind the scene's picture, seen through
//   what is cut out of it (the land outside a carriage's windows).
//   { kind, id, src, from, to, foot, tall, wide, gap, speed, bob, flip, behind }
// - climb: several small figures going along a path of straight stretches (a stair),
//   one after another, round and round. { kind, id, srcs, path: [[x, y], ...], tall, seconds, step }
// - spin: a wheel turning where it stands. { kind, id, src, x, y, tall, rpm }
//
// Along the scene x runs 0 → 1; y and `tall` are shares of the picture's height, y from
// its top; `wide` is a strip's width in shares of the scene's width.
// Returns [{ id, src, x, y, tall, turn, alpha, anchor: 'foot' | 'centre', flip, behind, clip: [from, to] | null }].
const TAU = Math.PI * 2;
const clamp = (n) => Math.max(0, Math.min(1, n));
const wrap = (n) => ((n % 1) + 1) % 1;

function drift(m, t) {
  const copies = Math.max(2, Math.ceil((m.to - m.from + m.wide) / (m.wide + m.gap)) + 1);
  const lap = copies * (m.wide + m.gap);
  const out = [];
  for (let i = 0; i < copies; i += 1) {
    // Its left edge, from one strip's width before the near end to past the far one.
    const left = m.from - m.wide + wrap((t * m.speed) / lap + i / copies) * lap;
    if (left > m.to) continue;
    // The whole line steps together, a little: paper figures on one stick.
    const bob = m.bob * Math.abs(Math.sin((t * Math.PI) / 0.55 + i));
    out.push({ id: `${m.id}-${i}`, src: m.src, x: left + m.wide / 2, y: m.foot - bob, tall: m.tall, turn: 0, alpha: 1, anchor: 'foot', flip: Boolean(m.flip), behind: Boolean(m.behind), clip: [m.from, m.to] });
  }
  return out;
}

// Where along a path of straight stretches a share u (0 → 1) of its length lies.
export function along(path, u) {
  const lengths = [];
  let total = 0;
  for (let i = 1; i < path.length; i += 1) {
    const far = Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]);
    lengths.push(far); total += far;
  }
  let left = clamp(u) * total;
  for (let i = 0; i < lengths.length; i += 1) {
    if (left <= lengths[i] || i === lengths.length - 1) {
      const v = lengths[i] > 0 ? Math.min(1, left / lengths[i]) : 0;
      return { x: path[i][0] + (path[i + 1][0] - path[i][0]) * v, y: path[i][1] + (path[i + 1][1] - path[i][1]) * v, way: Math.sign(path[i + 1][0] - path[i][0]) };
    }
    left -= lengths[i];
  }
  return { x: path[0][0], y: path[0][1], way: 1 };
}

function climb(m, t) {
  return m.srcs.map((src, i) => {
    const u = wrap(t / m.seconds + i / m.srcs.length);
    const at = along(m.path, u);
    // A step at a time: up a little and down again.
    const step = m.step * Math.abs(Math.sin((t * Math.PI) / 0.45 + i * 1.7));
    // They come in at the foot and are lost to sight at the top.
    const alpha = clamp(u / 0.06) * clamp((1 - u) / 0.06);
    // The figures are drawn facing left.
    return { id: `${m.id}-${i}`, src, x: at.x, y: at.y - step, tall: m.tall, turn: 0, alpha, anchor: 'foot', flip: at.way > 0, behind: false, clip: null };
  });
}

const spin = (m, t) => [{ id: m.id, src: m.src, x: m.x, y: m.y, tall: m.tall, turn: wrap((t * m.rpm) / 60) * TAU, alpha: 1, anchor: 'centre', flip: false, behind: false, clip: null }];

const KINDS = { drift, climb, spin };

// scene: one of core/walks.js's. t: seconds since she came into it.
export function piecesAt(scene, t) {
  return (scene.moving ?? []).flatMap((m) => KINDS[m.kind](m, t));
}
