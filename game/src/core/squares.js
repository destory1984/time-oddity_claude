// The four squares of the first slice. date is a historical date in the square's own
// calendar; hourLocal is local mean time at the square's longitude (no time zones).
// facingAz is the way the ground picture looks: 0 north, 90 east. nightOnLook squares
// are daytime events whose sky is shown at 9 pm that day when the player looks up.
// Lines marked (placeholder) were written for this slice and are not in the design
// documents yet.
export const SQUARES = [
  {
    no: 1, id: 'khufu', name: '대피라미드', dateLabel: '기원전 2560년경', place: '기자, 이집트',
    lat: 29.979, lon: 31.134,
    // The day is not recorded. 2560 BC April 11 (Julian) is that year's spring equinox,
    // by computation; with the picture looking north, Thuban stands over the pyramid.
    date: { year: -2560, month: 4, day: 11 }, calendar: 'julian', hourLocal: 21,
    facingAz: 0, nightOnLook: false,
    memo: '돌을 다 쌓음. 겉이 새하얗다.', sora: '지금이 새것일 때구나. 하얗다!',
    memoToday: '남은 것: 피라미드. 겉돌은 벗겨짐.', soraToday: '누렇게 됐네. 그래도 서 있다.', // (placeholder)
  },
  {
    no: 39, id: 'lunar1504', name: '콜럼버스의 월식', dateLabel: '1504.2.29', place: '세인트앤스 만, 자메이카',
    lat: 18.44, lon: -77.20,
    // 19.52 h local is 1504.3.1 00:40 UT, the middle of the eclipse.
    date: { year: 1504, month: 2, day: 29 }, calendar: 'julian', hourLocal: 19.52,
    facingAz: 90, nightOnLook: false,
    memo: '월식을 미리 안 사람. 달은 보름.', sora: '달이 진짜 빨개졌어! 근데 좀 치사하다.',
    memoToday: '남은 것: 세인트앤스 만. 배는 없음.', soraToday: '배는 없고 바다만 있네.', // (placeholder)
  },
  {
    no: 64, id: 'crystalPalace', name: '수정궁', dateLabel: '1851.5.1', place: '하이드파크, 런던',
    lat: 51.503, lon: -0.170,
    date: { year: 1851, month: 5, day: 1 }, calendar: 'gregorian', hourLocal: 12,
    facingAz: 180, nightOnLook: true,
    memo: '만국박람회 열림. 유리로 지은 집.', sora: '유리로 지은 집이다. 반짝반짝.',
    memoToday: '남은 것: 없음. 잔디밭뿐.', soraToday: '없어졌네. 옮겨 갔대.',
  },
  {
    no: 82, id: 'kittyHawk', name: '12초의 비행', dateLabel: '1903.12.17', place: '키티호크, 노스캐롤라이나',
    lat: 36.014, lon: -75.668,
    date: { year: 1903, month: 12, day: 17 }, calendar: 'gregorian', hourLocal: 10.5833,
    facingAz: 0, nightOnLook: true,
    memo: '사람이 12초 동안 하늘에 뜸.', sora: '12초래. 나도 그만큼은 뛰겠다.',
    memoToday: '남은 것: 언덕 위의 기념비.', soraToday: '언덕 위에 돌탑이 생겼어.', // (placeholder)
  },
];

export const squareById = (id) => SQUARES.find((s) => s.id === id);
