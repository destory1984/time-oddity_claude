// "What has changed": on today's picture of a square, the things that history changed
// there are found by touching them, and each one found tells what happened to it. The
// story of the square is found piece by piece instead of being read off a card.
//
// The things were chosen by eye, a few to a square, and only what matters: the roof a
// powder store blew off, not the houses the painter happened to draw differently (the
// user, 2026.10.8, of the first try, whose places a tool had picked: "아래 민가들은 대세에 큰
// 영향 없는 애들 아니냐?", "굳이 고르라고 한 이유를 모르겠어").
//
// name: what the thing is, a word or two. line: what happened to it, 40 characters at
// most, in the story card's voice. at: where it is on the picture, one circle or several
// (the four towers are one thing): [x, y, r], x and y the middle as shares of the
// picture's width and height, r the radius as a share of the width.
// The facts are from memory, like the cards' (docs/넘김.md section 4).
export const FINDS = {
  parthenon: [
    { name: '지붕', line: '1687년, 안에 쌓아 둔 화약이 터져 날아갔다.', at: [[0.44, 0.465, 0.03]] },
    { name: '칠과 조각', line: '붉고 푸른 칠은 벗겨지고, 조각은 박물관으로 갔다.', at: [[0.47, 0.535, 0.03]] },
    { name: '기중기', line: '흩어진 돌을 맞춰 지금도 고치는 중이다.', at: [[0.595, 0.5, 0.035]] },
  ],
  hagiaSophia: [
    { name: '뾰족한 탑', line: '1453년 뒤 모스크가 되면서 넷을 세웠다.', at: [[0.36, 0.36, 0.03], [0.395, 0.42, 0.03], [0.617, 0.42, 0.03], [0.663, 0.36, 0.03]] },
    { name: '버팀벽', line: '큰 지붕이 벽을 밀어내, 두꺼운 벽을 덧댔다.', at: [[0.437, 0.51, 0.03], [0.577, 0.51, 0.03]] },
    { name: '앞마당', line: '기둥이 늘어선 마당은 사라지고 공원이 됐다.', at: [[0.505, 0.61, 0.05]] },
  ],
  colosseum: [
    { name: '차양', line: '햇빛을 가리던 천과 장대는 남지 않았다.', at: [[0.42, 0.47, 0.04]] },
    { name: '바깥벽', line: '지진에 무너졌고, 떨어진 돌은 딴 건물에 쓰였다.', at: [[0.6, 0.53, 0.05]] },
    { name: '조각상', line: '아치마다 서 있던 조각상은 하나도 남지 않았다.', at: [[0.45, 0.6, 0.04]] },
  ],
};

const ASPECT = 1.5;   // the pictures are 3:2

export const findsOf = (id) => FINDS[id] ?? [];

export function createFind(things) {
  return { things, found: things.map(() => false), misses: 0 };
}

// A touch at (x, y), shares of the picture. least: the smallest radius a circle is given,
// as a share of the width (a finger's breadth on that screen). Returns the thing found
// just now (its index), or -1: nothing there, or found already.
export function touchFind(find, x, y, least = 0) {
  let best = -1;
  let bestFar = Infinity;
  find.things.forEach((thing, i) => {
    for (const [cx, cy, r] of thing.at) {
      const far = Math.hypot(x - cx, (y - cy) / ASPECT);
      if (far <= Math.max(r, least) && far < bestFar) { best = i; bestFar = far; }
    }
  });
  if (best < 0 || find.found[best]) { if (best < 0) find.misses += 1; return -1; }
  find.found[best] = true;
  find.misses = 0;
  return best;
}

export const foundCount = (find) => find.found.filter(Boolean).length;
export const foundAll = (find) => find.found.every(Boolean);
// A thing not found yet, to be hinted at; -1 when none is left.
export const nextUnfound = (find) => find.found.indexOf(false);
