// The squares that are places in three dimensions, flown about instead of looked at
// (docs/기획서-v2-열두-자리.md). For now the one: the Colosseum, the first test.
//
// hourLocal: the one hour the place is always seen at, whatever the year (local mean
// time; here half an hour after sunset on the day of the square). start: where she comes
// down, in the axes of the world (x east, z north, y up, metres from the middle of the
// place) and which way she looks. marks: the years the dial is marked at, with the name
// shown on the dial and, where the slip changes there, what grandmother wrote (25
// characters at most; placeholders, and the years are from memory). The first and the
// last use the lines the square already has.
export const SITES = {
  colosseum: {
    hourLocal: 20,
    // In the middle of the arena, looking along it to the west end, where the light is.
    start: { x: 0, y: 1.7, z: 0, yaw: 290, pitch: 8 },
    marks: [
      { year: 80, label: '그날' },
      { year: 1349, label: '지진', memo: '큰 지진에 남쪽 벽이 무너짐.' },
      { year: 1750, label: '뜯긴 돌', memo: '무너진 돌을 뜯어 딴 집을 지음.' },
      { year: 'today', label: '오늘' },
    ],
  },
};
