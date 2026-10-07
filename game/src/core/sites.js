// The squares that are places in three dimensions, looked over from any side
// (docs/기획서-v2-열두-자리.md). For now the one: the Colosseum, the first test.
//
// hourLocal: the one hour the place is always seen at, whatever the year (local mean
// time; here half an hour after sunset on the day of the square). round: the circle the
// eye is carried on (core/orbit.js), in the axes of the world (x east, z north, y up,
// metres from the middle of the place): where she first sees it from, and how close and
// how far she may come. spots: where she may stand instead and turn her head, each with
// the name on its button. marks: the years the dial is marked at, with the name
// shown on the dial and, where the slip changes there, what grandmother wrote (25
// characters at most; placeholders, and the years are from memory). The mark of the
// square's own year and the last use the lines the square already has. Before the first
// mark there is no slip.
export const SITES = {
  colosseum: {
    hourLocal: 20,
    // First seen from the south-west, a little above the top of the wall: the side that
    // comes down is in front and the evening light is behind it.
    round: { x: 0, y: 14, z: 0, around: 215, tilt: 14, far: 285, least: 175, most: 480 },
    spots: [
      // In the middle of the arena, looking along it to the west end.
      { id: 'arena', label: '아레나에서', x: 0, y: 1.7, z: 0, yaw: 290, pitch: 14 },
      // High in the north stands, under the wall that still stands, looking across to the south.
      { id: 'seats', label: '관람석에서', x: 21.9, y: 31, z: 60.1, yaw: 200, pitch: -14 },
    ],
    marks: [
      { year: 64, label: '연못', memo: '아직 없다. 황제의 연못이 있던 자리.' },
      { year: 72, label: '첫 돌', memo: '연못의 물을 빼고 짓기 시작함.' },
      { year: 80, label: '그날' },
      { year: 1349, label: '지진', memo: '큰 지진에 남쪽 벽이 무너짐.' },
      { year: 1750, label: '뜯긴 돌', memo: '무너진 돌을 뜯어 딴 집을 지음.' },
      { year: 'today', label: '오늘' },
    ],
  },
};
