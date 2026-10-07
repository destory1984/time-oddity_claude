// The four squares of the first slice. date is a historical date in the square's own
// calendar; hourLocal is local mean time at the square's longitude (no time zones).
// facingAz is the way the ground picture looks: 0 north, 90 east. nightOnLook squares
// are daytime events whose sky is shown at 9 pm that day when the player looks up.
// Lines marked (placeholder) were written for this slice and are not in the design
// documents yet.
//
// memo is the slip on the screen (25 characters); noteMemo is grandmother's fuller memo in
// the notebook (60). card is the story card: three sentences in a newspaper voice. quiz:
// the answer is said in the card (proof is the card's own words for it) and the wrong
// choices are not; it asks what or why or where, never a number.
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
    noteMemo: '기원전 2560년경. 왕의 무덤을 다 쌓았다고 책에서 읽음. 그날 밤 북쪽 별은 투반.', // (placeholder)
    card: '기원전 2560년 무렵, 이집트 기자에 쿠푸 왕의 대피라미드가 다 지어졌습니다. 겉은 흰 석회암으로 매끈하게 덮여 햇빛에 빛났습니다. 겉돌은 훗날 벗겨져 다른 건물에 쓰였고, 지금은 계단 같은 속돌이 드러나 있습니다.', // (placeholder)
    quiz: { question: '새로 지은 피라미드의 겉은 어땠나?', answer: '흰 돌로 매끈했다', proof: '흰 석회암으로 매끈하게', wrong: ['금으로 덮였다', '붉게 칠했다'] }, // (placeholder)
  },
  {
    no: 39, id: 'lunar1504', name: '콜럼버스의 월식', dateLabel: '1504.2.29', place: '세인트앤스 만, 자메이카',
    lat: 18.44, lon: -77.20,
    // 19.52 h local is 1504.3.1 00:40 UT, the middle of the eclipse.
    date: { year: 1504, month: 2, day: 29 }, calendar: 'julian', hourLocal: 19.52,
    facingAz: 90, nightOnLook: false,
    memo: '월식을 미리 안 사람. 달은 보름.', sora: '달이 진짜 빨개졌어! 근데 좀 치사하다.',
    memoToday: '남은 것: 세인트앤스 만. 배는 없음.', soraToday: '배는 없고 바다만 있네.', // (placeholder)
    noteMemo: '1504.2.29. 콜럼버스가 월식을 미리 알고 먹을 것을 얻었다고 책에서 읽음. 그날 달은 보름.',
    card: '1504년 2월 29일 저녁, 자메이카에 발이 묶인 콜럼버스는 달이 가려질 것을 천문표에서 미리 알았습니다. 그는 섬사람들에게 달이 사라질 것이라 말했고, 달은 붉게 변했습니다. 섬사람들은 다시 먹을 것을 가져다주었습니다.',
    quiz: { question: '콜럼버스는 월식을 무엇에서 미리 알았나?', answer: '천문표', proof: '천문표', wrong: ['망원경', '꿈'] },
  },
  {
    no: 64, id: 'crystalPalace', name: '수정궁', dateLabel: '1851.5.1', place: '하이드파크, 런던',
    lat: 51.503, lon: -0.170,
    date: { year: 1851, month: 5, day: 1 }, calendar: 'gregorian', hourLocal: 12,
    facingAz: 180, nightOnLook: true,
    memo: '만국박람회 열림. 유리로 지은 집.', sora: '유리로 지은 집이다. 반짝반짝.',
    memoToday: '남은 것: 없음. 잔디밭뿐.', soraToday: '없어졌네. 옮겨 갔대.',
    noteMemo: '1851.5.1. 유리와 쇠로만 지은 전시관을 책에서 읽음. 그날 달은 없음(삭).',
    card: '1851년 5월 1일, 런던 하이드파크에서 첫 만국박람회가 열렸습니다. 전시관은 유리와 쇠로만 지어 "수정궁"이라 불렸고, 길이가 564m였습니다. 박람회가 끝나자 건물은 헐려 런던 남쪽 시드넘으로 옮겨졌고, 1936년에 불탔습니다.',
    quiz: { question: '수정궁은 무엇으로 지었나?', answer: '유리와 쇠', proof: '유리와 쇠', wrong: ['돌과 나무', '벽돌'] },
  },
  {
    no: 82, id: 'kittyHawk', name: '12초의 비행', dateLabel: '1903.12.17', place: '키티호크, 노스캐롤라이나',
    lat: 36.014, lon: -75.668,
    date: { year: 1903, month: 12, day: 17 }, calendar: 'gregorian', hourLocal: 10.5833,
    facingAz: 0, nightOnLook: true,
    memo: '사람이 12초 동안 하늘에 뜸.', sora: '12초래. 나도 그만큼은 뛰겠다.',
    memoToday: '남은 것: 언덕 위의 기념비.', soraToday: '언덕 위에 돌탑이 생겼어.', // (placeholder)
    noteMemo: '1903.12.17. 형제가 만든 비행기가 12초를 날았다고 책에서 읽음. 그날 달은 그믐.',
    card: '1903년 12월 17일 아침, 오빌 라이트가 탄 비행기가 12초 동안 37m를 날았습니다. 형제는 그날 네 번 날았고, 마지막에는 윌버가 59초 동안 260m를 갔습니다. 그 비행기는 지금 워싱턴의 스미스소니언 박물관에 걸려 있습니다.',
    quiz: { question: '그 비행기는 지금 어디에 있나?', answer: '워싱턴의 박물관', proof: '워싱턴의 스미스소니언 박물관', wrong: ['바닷가의 헛간', '형제의 집'] },
  },
];

export const squareById = (id) => SQUARES.find((s) => s.id === id);
