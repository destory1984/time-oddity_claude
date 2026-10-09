// The squares so far: the four of the first slice, three more, ten more and the solar eclipse, all of 2026.10.7. date is a historical date in the square's own
// calendar; hourLocal is local mean time at the square's longitude (no time zones).
// facingAz is the way the ground picture looks: 0 north, 90 east. nightOnLook squares
// are daytime events whose sky is shown at 9 pm that day when the player looks up.
// Lines marked (placeholder) were written for this slice and are not in the design
// documents yet.
//
// memo is the slip on the screen (25 characters); noteMemo is grandmother's fuller memo in
// the notebook (60). card is the story card: three sentences in a newspaper voice. quiz:
// the answer is said in the card (proof is the card's own words for it) and the wrong
// choices are not; it asks what or why or where, never a number. reply is what
// grandmother writes back when a postcard of the square reaches her: the heart of it, in
// her way of speaking, 60 characters at most.
export const SQUARES = [
  {
    // The first leaf: not one of the 120 squares but the day of grandmother's first note.
    // She was fifteen, in a neighbour's yard, watching the Moon landing on television.
    // The scene is set at about 9 pm that evening (a rebroadcast): the yard is dark, the
    // crescent moon is in the west, and the two men are still on the Moon. Where the yard
    // was: in what is now Sejong City (Yeongi county then; the user, 2026.10.7: "세종시로 옮기자").
    // Until then Seoul stood in for it, right on the palace of the Hunminjeongeum square. The yard itself is made up, the one
    // exception to "what remains is real". hourLocal 20.5 is 9 pm Korean time.
    no: 0, id: 'yard1969', name: '이웃집 마당', dateLabel: 'AD 1969.7.21', place: '할머니의 마을',
    // By Busan, not in the middle of the country: there its pin lay under Seoul's (the user,
    // 2026.10.8: "할머니 집 이동.. 부산으로.. (누르기가 너무 힘들어)").
    lat: 35.18, lon: 129.08,
    date: { year: 1969, month: 7, day: 21 }, calendar: 'gregorian', hourLocal: 20.5,
    // 228 rather than straight at the moon (240): it then stands right of the middle, clear of Sora.
    facingAz: 228, nightOnLook: false,
    memo: '이웃집 마당. 다 같이 달을 봤다.', sora: '저기 뒤에 앉은 애가 할머니야?',
    soraSky: '저 달에 지금 사람이 있는 거야?',
    memoToday: '남은 것: 그 마당 자리의 오늘.', soraToday: '텔레비전도 평상도 없네.', // (placeholder)
    noteMemo: '1969.7.21. 이웃집 마당에서 텔레비전으로 봤다. 그날 달은 초승에서 반달 사이.',
    card: '1969년 7월 21일, 아폴로 11호의 두 사람이 달에 내려 걸었습니다. 한국에서는 텔레비전이 있는 집 마당에 이웃이 모여 그 모습을 함께 보았습니다. 그날 밤에도 두 사람은 달 위에 머물렀고, 이튿날 새벽에 달을 떠났습니다.', // (placeholder)
    reply: '그 마당이구나. 맨 뒤에 앉은 애가 나란다.', // (placeholder)
    quiz: { question: '이웃들은 달에 간 사람들을 어떻게 보았나?', answer: '텔레비전으로', proof: '텔레비전', wrong: ['망원경으로', '신문 사진으로'] }, // (placeholder)
  },
  {
    no: 1, id: 'khufu', name: '대피라미드', dateLabel: 'BC 2560년경', place: '기자, 이집트',
    lat: 29.979, lon: 31.134,
    // The day is not recorded. 2560 BC April 11 (Julian) is that year's spring equinox,
    // by computation; with the picture looking north, Thuban stands over the pyramid.
    date: { year: -2560, month: 4, day: 11 }, calendar: 'julian', hourLocal: 21,
    facingAz: 0, nightOnLook: false,
    memo: '돌을 다 쌓음. 겉이 새하얗다.', sora: '지금이 새것일 때구나. 하얗다!',
    memoToday: '남은 것: 피라미드. 겉돌은 벗겨짐.', soraToday: '누렇게 됐네. 그래도 서 있다.', // (placeholder)
    noteMemo: '기원전 2560년경. 왕의 무덤을 다 쌓았다고 책에서 읽음. 그날 밤 북쪽 별은 투반.', // (placeholder)
    card: '기원전 2560년 무렵, 이집트 기자에 쿠푸 왕의 대피라미드가 다 지어졌습니다. 겉은 흰 석회암으로 매끈하게 덮여 햇빛에 빛났습니다. 겉돌은 훗날 벗겨져 다른 건물에 쓰였고, 지금은 계단 같은 속돌이 드러나 있습니다.', // (placeholder)
    reply: '새하얀 것을 봤구나. 나는 누런 것만 사진으로 봤단다.', // (placeholder)
    quiz: { question: '새로 지은 피라미드의 겉은 어땠나?', answer: '흰 돌로 매끈했다', proof: '흰 석회암으로 매끈하게', wrong: ['금으로 덮였다', '붉게 칠했다'] }, // (placeholder)
  },
  {
    no: 10, id: 'pharos', name: '파로스의 등대', dateLabel: 'BC 280년경', place: '알렉산드리아, 이집트',
    lat: 31.214, lon: 29.885,
    // The day is not recorded. An evening near the autumn equinox of 280 BC stands in for it.
    date: { year: -280, month: 9, day: 23 }, calendar: 'julian', hourLocal: 21,
    facingAz: 350, nightOnLook: false,
    // All of this square's lines are placeholders, and its facts are from memory.
    memo: '바다 끝에 높은 등대를 세움.', sora: '탑 꼭대기에서 연기가 나. 등대래!',
    memoToday: '남은 것: 없음. 그 자리에 성채.', soraToday: '등대는 없고 성이 있네.',
    noteMemo: '기원전 280년경. 섬 끝에 높은 등대를 세웠다고 책에서 읽음. 날을 몰라 달은 못 적음.',
    card: '기원전 280년 무렵, 알렉산드리아 앞 파로스 섬에 높은 등대가 세워졌습니다. 등대는 천오백 년 넘게 배들에게 길을 알려 주다가 지진으로 무너졌습니다. 지금 그 자리에는 등대의 돌로 쌓았다는 성채가 서 있습니다.',
    reply: '없어진 등대를 네가 보고 왔구나. 고맙다.', // (placeholder)
    quiz: { question: '등대는 왜 사라졌나?', answer: '지진으로 무너졌다', proof: '지진으로 무너졌습니다', wrong: ['불에 탔다', '바다에 잠겼다'] },
  },
  {
    no: 39, id: 'lunar1504', name: '콜럼버스의 월식', dateLabel: 'AD 1504.2.29', place: '세인트앤스 만, 자메이카',
    lat: 18.44, lon: -77.20,
    // 19.52 h local is 1504.3.1 00:40 UT, the middle of the eclipse.
    date: { year: 1504, month: 2, day: 29 }, calendar: 'julian', hourLocal: 19.52,
    facingAz: 90, nightOnLook: false,
    memo: '월식을 미리 안 사람. 달은 보름.', sora: '달이 진짜 빨개졌어! 근데 좀 치사하다.',
    memoToday: '남은 것: 세인트앤스 만. 배는 없음.', soraToday: '배는 없고 바다만 있네.', // (placeholder)
    noteMemo: '1504.2.29. 콜럼버스가 월식을 미리 알고 먹을 것을 얻었다고 책에서 읽음. 그날 달은 보름.',
    card: '1504년 2월 29일 저녁, 자메이카에 발이 묶인 콜럼버스는 달이 가려질 것을 천문표에서 미리 알았습니다. 그는 섬사람들에게 달이 사라질 것이라 말했고, 달은 붉게 변했습니다. 섬사람들은 다시 먹을 것을 가져다주었습니다.',
    reply: '달력표 한 장이 그렇게 쓰였단다. 아는 것은 그렇게도 쓰이는구나.',
    quiz: { question: '콜럼버스는 월식을 무엇에서 미리 알았나?', answer: '천문표', proof: '천문표', wrong: ['망원경', '꿈'] },
  },
  {
    no: 64, id: 'crystalPalace', name: '수정궁', dateLabel: 'AD 1851.5.1', place: '하이드파크, 런던',
    lat: 51.503, lon: -0.170,
    date: { year: 1851, month: 5, day: 1 }, calendar: 'gregorian', hourLocal: 12,
    facingAz: 180, nightOnLook: true,
    memo: '만국박람회 열림. 유리로 지은 집.', sora: '유리로 지은 집이다. 반짝반짝.',
    memoToday: '남은 것: 없음. 잔디밭뿐.', soraToday: '없어졌네. 옮겨 갔대.',
    noteMemo: '1851.5.1. 유리와 쇠로만 지은 전시관을 책에서 읽음. 그날 밤은 달이 뜨지 않음.',
    card: '1851년 5월 1일, 런던 하이드파크에서 첫 만국박람회가 열렸습니다. 전시관은 유리와 쇠로만 지어 "수정궁"이라 불렸고, 길이가 564m였습니다. 박람회가 끝나자 건물은 헐려 런던 남쪽 시드넘으로 옮겨졌고, 1936년에 불탔습니다.',
    reply: '없어진 것도 네가 보고 왔으니 이제 있는 거란다.',
    quiz: { question: '수정궁은 무엇으로 지었나?', answer: '유리와 쇠', proof: '유리와 쇠', wrong: ['돌과 나무', '벽돌'] },
  },
  {
    no: 75, id: 'eiffel', name: '에펠탑', dateLabel: 'AD 1889.5.15', place: '파리, 프랑스',
    lat: 48.858, lon: 2.294,
    date: { year: 1889, month: 5, day: 15 }, calendar: 'gregorian', hourLocal: 13.5,
    facingAz: 315, nightOnLook: true,
    // All of this square's lines are placeholders, and its facts are from memory.
    // The day is the one the tower was opened to people (it was finished on 3.31): the
    // place is walked about on that day (core/walks.js).
    memo: '쇠로 지은 높은 탑에 사람들이 처음 오름.', sora: '쇠로 뜬 레이스 같아. 엄청 높다!',
    memoToday: '남은 것: 에펠탑. 그대로 서 있음.', soraToday: '둘레 건물만 없고 탑은 그대로네.',
    noteMemo: '1889.5.15. 파리에서 쇠로 지은 탑에 사람들이 처음 올랐다고 책에서 읽음. 그날 달은 보름.',
    card: '1889년 5월 15일, 파리의 에펠탑이 사람들에게 문을 열었습니다. 만국박람회의 문으로 세운 이 탑은 스무 해 뒤에 헐기로 되어 있었습니다. 탑은 전파를 보내는 안테나로 쓸모를 얻어 헐리지 않았고, 지금도 그 자리에 서 있습니다.',
    reply: '헐릴 뻔한 것이 제일 오래 남았구나.', // (placeholder)
    quiz: { question: '헐기로 했던 탑이 왜 남았나?', answer: '전파를 보내는 데 쓰여서', proof: '전파를 보내는 안테나로', wrong: ['너무 무거워서', '왕이 아껴서'] },
  },
  {
    no: 82, id: 'kittyHawk', name: '12초의 비행', dateLabel: 'AD 1903.12.17', place: '키티호크, 노스캐롤라이나',
    lat: 36.014, lon: -75.668,
    date: { year: 1903, month: 12, day: 17 }, calendar: 'gregorian', hourLocal: 10.5833,
    facingAz: 0, nightOnLook: true,
    memo: '사람이 12초 동안 하늘에 뜸.', sora: '12초래. 나도 그만큼은 뛰겠다.',
    memoToday: '남은 것: 언덕 위의 기념비.', soraToday: '언덕 위에 돌탑이 생겼어.', // (placeholder)
    noteMemo: '1903.12.17. 형제가 만든 비행기가 12초를 날았다고 책에서 읽음. 그날 달은 그믐.',
    card: '1903년 12월 17일 아침, 오빌 라이트가 탄 비행기가 12초 동안 37m를 날았습니다. 형제는 그날 네 번 날았고, 마지막에는 윌버가 59초 동안 260m를 갔습니다. 그 비행기는 지금 워싱턴의 스미스소니언 박물관에 걸려 있습니다.',
    reply: '그 12초에서 달까지 예순여섯 해란다. 내가 본 것이 그 끝이구나.',
    quiz: { question: '그 비행기는 지금 어디에 있나?', answer: '워싱턴의 박물관', proof: '워싱턴의 스미스소니언 박물관', wrong: ['바닷가의 헛간', '형제의 집'] },
  },
  {
    no: 104, id: 'sputnik', name: '첫 인공위성', dateLabel: 'AD 1957.10.4', place: '바이코누르, 카자흐스탄',
    lat: 45.920, lon: 63.342,
    // 23.70 h local is 19:28 UT, the launch. The picture looks south-west, where the moon stood.
    date: { year: 1957, month: 10, day: 4 }, calendar: 'gregorian', hourLocal: 23.70,
    facingAz: 215, nightOnLook: false,
    // All of this square's lines are placeholders, and its facts are from memory.
    memo: '첫 인공위성을 쏘아 올림.', sora: '로켓이 서 있어. 곧 쏘나 봐!',
    memoToday: '남은 것: 발사대.', soraToday: '로켓은 떠나고 받침만 남았네.',
    noteMemo: '1957.10.4. 사람이 만든 첫 별을 쏘아 올렸다고 책에서 읽음. 그날 달은 거의 찬 달.',
    card: '1957년 10월 4일 밤, 카자흐스탄의 초원에서 로켓 한 대가 올랐습니다. 로켓은 비치볼만 한 쇠공 스푸트니크를 지구 둘레의 길에 올려놓았습니다. 사람이 만든 첫 인공위성이었고, 그 발사대는 지금도 남아 있습니다.',
    reply: '그 쇠공이 돌 때 나는 세 살이었단다. 기억에는 없지.', // (placeholder)
    quiz: { question: '스푸트니크는 무엇이었나?', answer: '첫 인공위성', proof: '첫 인공위성', wrong: ['첫 우주 비행사', '달에 간 로켓'] },
  },
  {
    // The eclipse Herodotus says Thales foretold. Where the armies stood is not known; the
    // square stands on the Halys at the Osmancik reach, where the computed eclipse is total
    // for 223 seconds (from the Cankiri reach to the mouth it is total, further upstream it is
    // not: see docs/하늘-계산-확인.md 5.1). 17.459 h local is 15:08 UT, the middle of it:
    // the sun stands 17.6 degrees up at azimuth 282, with Mercury, Jupiter and Mars above it.
    // leadMin: arriving, the clock runs up to the moment from that many minutes before
    // (core/moment.js), so that the sun is seen going out.
    no: 7, id: 'thales', name: '탈레스의 일식', dateLabel: 'BC 585.5.28', place: '할리스 강, 터키',
    lat: 40.97, lon: 34.80,
    date: { year: -585, month: 5, day: 28 }, calendar: 'julian', hourLocal: 17.459,
    // 274 rather than straight at the sun (282): it then stands right of the middle, clear of Sora.
    facingAz: 274, nightOnLook: false, leadMin: 30,
    memo: '해 질 녘에 해가 사라짐. 싸움이 멈춤.', sora: '낮인데 캄캄해. 다들 멈췄어.',
    soraSky: '까만 해 둘레에 하얀 빛이 있어!', // (placeholder)
    memoToday: '남은 것: 강. 이름은 크즐으르마크.', soraToday: '아무도 없네. 강만 그대로 흘러.', // (placeholder)
    noteMemo: '기원전 585.5.28. 탈레스가 미리 말했다는 일식을 책에서 읽음. 그날 달은 해 앞에.',
    card: '기원전 585년 5월 28일, 리디아와 메디아가 할리스 강가에서 싸우던 해 질 녘에 해가 가려졌습니다. 헤로도토스는 탈레스가 이 일식을 미리 말했다고 적었습니다. 두 나라는 싸움을 멈추고 화해했습니다.',
    reply: '하늘이 어두워지니 칼을 내렸다지. 고마운 그늘이구나.',
    quiz: { question: '해가 가려진 뒤 두 나라는 어떻게 했나?', answer: '화해했다', proof: '화해했습니다', wrong: ['더 크게 싸웠다', '강을 건넜다'] },
  },
  // --- Ten squares added on 2026.10.7 (the user: "10개 더 하자"). Every line of theirs is a
  // placeholder. Squares without a known day stand at noon on a day chosen for the season;
  // facingAz was chosen from the computed sky so that something is up at 9 pm where the
  // real view allows it (the palace hall and the Taj Mahal are seen looking north).
  {
    no: 2, id: 'stonehenge', name: '스톤헨지', dateLabel: 'BC 2500년경', place: '솔즈베리, 영국',
    lat: 51.179, lon: -1.826,
    date: { year: -2500, month: 7, day: 12 }, calendar: 'julian', hourLocal: 12,
    facingAz: 170, nightOnLook: true,
    memo: '큰 돌을 끌어다 둥글게 세움.', sora: '돌 위에 돌을 어떻게 올렸지?',
    memoToday: '남은 것: 돌의 절반쯤.', soraToday: '많이 쓰러졌네. 그래도 서 있어.',
    noteMemo: '기원전 2500년경. 큰 돌을 끌어다 둥글게 세웠다고 책에서 읽음. 날을 몰라 달은 못 적음.',
    card: '기원전 2500년 무렵, 영국 솔즈베리 평원에 큰 돌을 둥글게 세운 스톤헨지가 지어졌습니다. 큰 돌은 30km쯤 떨어진 곳에서, 작은 푸른 돌은 240km쯤 떨어진 웨일스에서 끌어왔습니다. 돌들은 한여름 해가 뜨는 쪽과 한겨울 해가 지는 쪽에 맞추어 놓였습니다.',
    reply: '글자도 없던 때에 해 뜨는 쪽을 돌로 적어 둔 거란다.',
    quiz: { question: '작은 푸른 돌은 어디에서 끌어왔나?', answer: '웨일스', proof: '웨일스', wrong: ['프랑스', '아일랜드'] },
  },
  {
    no: 9, id: 'parthenon', name: '파르테논', dateLabel: 'BC 432년경', place: '아테네, 그리스',
    lat: 37.9715, lon: 23.7267,
    date: { year: -432, month: 7, day: 1 }, calendar: 'julian', hourLocal: 12,
    facingAz: 115, nightOnLook: true,
    memo: '언덕 위에 흰 돌 신전을 다 지음.', sora: '색칠이 돼 있어! 흰색이 아니네.',
    memoToday: '남은 것: 기둥. 지붕은 없음.', soraToday: '지붕이 없어. 하늘이 다 보여.',
    noteMemo: '기원전 432년경. 언덕 위에 흰 대리석 신전을 다 지었다고 책에서 읽음. 날을 몰라 달은 못 적음.',
    card: '기원전 432년 무렵, 아테네의 아크로폴리스 언덕에 아테나 여신의 신전 파르테논이 다 지어졌습니다. 흰 대리석 기둥 위의 조각에는 붉고 푸른 칠이 되어 있었습니다. 1687년 전쟁 때 안에 쌓아 둔 화약이 터져 지붕과 벽이 무너졌습니다.',
    reply: '지붕이 없으니 별이 잘 보이겠구나. 신전이 천문대가 됐네.',
    quiz: { question: '파르테논의 지붕은 왜 무너졌나?', answer: '화약이 터져서', proof: '화약이 터져', wrong: ['지진이 나서', '큰불이 나서'] },
  },
  {
    no: 16, id: 'colosseum', name: '콜로세움', dateLabel: 'AD 80년', place: '로마, 이탈리아',
    lat: 41.890, lon: 12.492,
    date: { year: 80, month: 6, day: 1 }, calendar: 'julian', hourLocal: 12,
    facingAz: 290, nightOnLook: true,
    memo: '둥근 큰 경기장이 열림.', sora: '천막 지붕이 있어! 엄청 커.',
    memoToday: '남은 것: 바깥벽의 절반.', soraToday: '한쪽 벽이 없네. 돌을 가져갔대.',
    noteMemo: '80년. 로마에 오만 명이 앉는 둥근 경기장이 열렸다고 책에서 읽음. 날을 몰라 달은 못 적음.',
    card: '서기 80년, 로마에서 티투스 황제가 콜로세움의 문을 열었습니다. 오만 명쯤이 앉는 둥근 경기장이었고, 햇빛을 가리는 천 차양이 꼭대기에 걸렸습니다. 뒷날 지진으로 바깥벽 한쪽이 무너졌고, 떨어진 돌은 다른 건물을 짓는 데 쓰였습니다.',
    reply: '절반만 남아도 다들 알아보지. 큰 것은 그렇단다.',
    quiz: { question: '꼭대기에 건 천 차양은 무엇을 가렸나?', answer: '햇빛', proof: '햇빛을 가리는', wrong: ['빗물', '모래바람'] },
  },
  {
    no: 20, id: 'cheomseongdae', name: '첨성대', dateLabel: 'AD 640년경', place: '경주, 신라',
    lat: 35.8347, lon: 129.219,
    date: { year: 640, month: 9, day: 1 }, calendar: 'julian', hourLocal: 12,
    facingAz: 170, nightOnLook: true,
    memo: '별을 보는 돌탑을 쌓음.', sora: '병처럼 생겼어. 창으로 들어가나 봐.',
    memoToday: '남은 것: 첨성대. 그대로.', soraToday: '그대로야! 천사백 년이나 됐는데.',
    noteMemo: '640년경. 선덕여왕 때 별을 보는 돌탑을 쌓았다고 책에서 읽음. 날을 몰라 달은 못 적음.',
    card: '신라 선덕여왕 때인 640년 무렵, 서라벌에 별을 보는 돌탑 첨성대가 세워졌습니다. 다듬은 돌을 스물일곱 단 둥글게 쌓았고, 가운데에 남쪽으로 창을 하나 냈습니다. 첨성대는 천사백 년 가까이 그 자리에 그대로 서 있습니다.',
    reply: '천사백 년 동안 같은 하늘을 본 돌이란다. 부럽지.',
    quiz: { question: '첨성대의 창은 어느 쪽으로 나 있나?', answer: '남쪽', proof: '남쪽으로', wrong: ['북쪽', '서쪽'] },
  },
  {
    // 1446, the ninth lunar month: 30 September in the Julian calendar is the tenth day
    // of that month, the day Hangul Day (9 October) is reckoned from. The hall is seen
    // looking north, with the mountain behind it. The hall standing today was rebuilt in 1867.
    no: 34, id: 'hunminjeongeum', name: '훈민정음', dateLabel: 'AD 1446년 가을', place: '한양, 조선',
    lat: 37.5796, lon: 126.977,
    date: { year: 1446, month: 9, day: 30 }, calendar: 'julian', hourLocal: 12,
    facingAz: 0, nightOnLook: true,
    memo: '세종대왕님이 한글을 처음 알린 날.', sora: '지금 내가 쓰는 글자가 이날 나왔어?',
    memoToday: '남은 것: 책. 간송미술관에 있음.', soraToday: '집은 다시 지은 거래. 글자는 그대로.',
    noteMemo: '1446년 가을. 세종대왕님이 한글을 책으로 펴내 알렸다고 읽음. 그날 달은 반달을 지나 차는 중.',
    card: '1446년 가을, 세종대왕님은 새로 만든 글자 스물여덟 자를 "훈민정음"이라는 책으로 펴냈습니다. 글자를 만든 까닭과 쓰는 법을 풀이한 이 책은 1940년에 안동에서 다시 발견되었습니다. 지금은 서울의 간송미술관이 간직하고 있습니다.',
    reply: '내가 이 수첩을 쓸 수 있는 것도 그날 덕이란다.',
    quiz: { question: '훈민정음 책은 지금 어디에 있나?', answer: '간송미술관', proof: '간송미술관', wrong: ['경복궁', '국립중앙박물관'] },
  },
  {
    // 7 pm: Jupiter stands 51 degrees up in the east-south-east, ten degrees from a
    // nearly full moon. A night square, so the clock does not flow.
    no: 46, id: 'galileo', name: '목성의 달', dateLabel: 'AD 1610.1.7', place: '파도바, 이탈리아',
    lat: 45.406, lon: 11.877,
    date: { year: 1610, month: 1, day: 7 }, calendar: 'gregorian', hourLocal: 19,
    facingAz: 110, nightOnLook: false,
    memo: '망원경으로 목성 곁의 별을 봄.', sora: '저 밝은 게 목성이야? 달 옆에 있네.',
    memoToday: '남은 것: 망원경. 피렌체 박물관.', soraToday: '망원경은 박물관에 갔대.',
    noteMemo: '1610.1.7. 갈릴레오가 망원경으로 목성 곁의 작은 별을 봤다고 읽음. 그날 달은 보름 가까이.',
    card: '1610년 1월 7일 밤, 파도바의 갈릴레오는 손수 만든 망원경으로 목성 곁에 늘어선 작은 별 셋을 보았습니다. 며칠 뒤 별은 넷이 되었고, 그는 그것들이 목성 둘레를 도는 달이라는 것을 알아냈습니다. 하늘의 모든 것이 지구를 도는 것은 아니라는 첫 증거였습니다.',
    reply: '1권에서 네가 본 그 달 넷이란다. 그날 처음 들킨 거지.',
    quiz: { question: '목성 곁의 작은 별들은 무엇이었나?', answer: '목성의 달', proof: '목성 둘레를 도는 달', wrong: ['혜성', '먼 행성'] },
  },
  {
    // The Taj Mahal while it was building (begun 1631 or 1632, the tomb itself done by 1648,
    // all of it by 1653): a morning of about 1640 is taken, the year the French jeweller
    // Tavernier first came to Agra. The place is walked about (core/walks.js).
    no: 47, id: 'tajMahal', name: '흰 무덤을 짓는 날', dateLabel: 'AD 1640년쯤', place: '아그라, 인도',
    lat: 27.175, lon: 78.042,
    date: { year: 1640, month: 3, day: 1 }, calendar: 'gregorian', hourLocal: 9,
    facingAz: 0, nightOnLook: true,
    memo: '황후의 흰 돌 무덤을 짓는 중.', sora: '하얗다. 아직 짓는 중이야!',
    memoToday: '남은 것: 타지마할. 그대로.', soraToday: '나무가 줄었네. 건물은 그대로.',
    noteMemo: '1640년쯤. 황제가 황후를 위해 스무 해 넘게 흰 돌 무덤을 지었다고 읽음. 날을 몰라 달은 못 적음.',
    card: '1640년쯤, 인도 아그라에서는 흰 대리석 무덤 타지마할을 한창 짓고 있었습니다. 무굴의 황제 샤자한이 먼저 떠난 황후 뭄타즈 마할을 위해 스무 해 넘게 지은 것입니다. 흰 벽에는 색색의 돌을 꽃 모양으로 박아 넣었고, 건물은 지금도 그대로 서 있습니다.',
    reply: '그 꽃은 지금도 그 벽에 피어 있단다. 흰 무덤은 그 뒤로도 여러 해를 더 지었지.',
    quiz: { question: '타지마할은 누구를 위해 지었나?', answer: '황후', proof: '황후 뭄타즈 마할을 위해', wrong: ['황제의 어머니', '전쟁에서 진 장군'] },
  },
  {
    no: 54, id: 'montgolfier', name: '첫 열기구', dateLabel: 'AD 1783.11.21', place: '파리, 프랑스',
    lat: 48.861, lon: 2.269,
    date: { year: 1783, month: 11, day: 21 }, calendar: 'gregorian', hourLocal: 14,
    facingAz: 190, nightOnLook: true,
    memo: '열기구로 사람이 처음 하늘에 뜸.', sora: '떴다! 불을 때서 뜨는 거래.',
    memoToday: '남은 것: 없음. 공원뿐.', soraToday: '성도 기구도 없어. 공원이야.',
    noteMemo: '1783.11.21. 두 사람이 종이와 천으로 만든 기구로 하늘에 떴다고 읽음. 그날 달은 그믐달.',
    card: '1783년 11월 21일, 파리 서쪽 라 뮈에트 성의 정원에서 두 사람을 태운 열기구가 떠올랐습니다. 몽골피에 형제가 종이와 천으로 만든 기구였고, 짚을 태운 더운 공기로 떴습니다. 기구는 25분쯤 날아 9km쯤 떨어진 곳에 내렸습니다.',
    reply: '1권의 로켓도 여기서 시작했단다. 처음엔 종이였지.',
    quiz: { question: '열기구는 무엇의 힘으로 떴나?', answer: '더운 공기', proof: '더운 공기', wrong: ['수소', '큰 날개'] },
  },
  {
    no: 74, id: 'liberty', name: '자유의 여신상', dateLabel: 'AD 1886.10.28', place: '뉴욕, 미국',
    lat: 40.689, lon: -74.045,
    date: { year: 1886, month: 10, day: 28 }, calendar: 'gregorian', hourLocal: 15,
    facingAz: 240, nightOnLook: true,
    memo: '바다 건너온 큰 조각상을 세움.', sora: '초록색이 아니야! 구릿빛이야.',
    memoToday: '남은 것: 여신상. 초록이 됨.', soraToday: '초록색 됐다. 녹이 슨 거래.',
    noteMemo: '1886.10.28. 프랑스가 보낸 구리 조각상을 뉴욕 항에 세웠다고 읽음. 그날 달은 초승.',
    card: '1886년 10월 28일, 뉴욕 항의 작은 섬에서 자유의 여신상을 세운 것을 기념하는 식이 열렸습니다. 프랑스 사람들이 선물로 보낸 이 구리 조각상은 조각조각 나뉘어 배로 바다를 건너왔습니다. 붉은 갈색이던 구리는 서른 해쯤 지나며 녹이 슬어 지금의 청록색이 되었습니다.',
    reply: '녹도 옷이 되는구나. 나이 드는 것도 나쁘지 않단다.',
    quiz: { question: '여신상은 왜 청록색이 되었나?', answer: '구리에 녹이 슬어서', proof: '녹이 슬어', wrong: ['페인트를 칠해서', '이끼가 껴서'] },
  },
  {
    // The southern sky: the first square south of the equator.
    no: 110, id: 'sydneyOpera', name: '오페라하우스', dateLabel: 'AD 1973.10.20', place: '시드니, 오스트레일리아',
    lat: -33.857, lon: 151.215,
    date: { year: 1973, month: 10, day: 20 }, calendar: 'gregorian', hourLocal: 15,
    facingAz: 270, nightOnLook: true,
    memo: '조개 같은 지붕의 극장이 열림.', sora: '돛단배 같아. 배도 엄청 많아!',
    soraSky: '별이 다 처음 보는 거야. 남쪽 하늘!',
    memoToday: '남은 것: 오페라하우스. 그대로.', soraToday: '건물이 훨씬 많아졌네.',
    noteMemo: '1973.10.20. 열네 해 걸려 지은 조개 지붕 극장이 문을 열었다고 읽음. 그날 달은 그믐에 가까움.',
    card: '1973년 10월 20일, 시드니 항의 곶 끝에서 오페라하우스가 문을 열었습니다. 덴마크의 건축가 예른 웃손이 설계했고, 조개껍데기 같은 지붕을 짓는 법을 찾느라 열네 해가 걸렸습니다. 이 건물은 2007년에 유네스코 세계유산이 되었습니다.',
    reply: '거기는 별자리가 거꾸로란다. 올려다봤니?',
    quiz: { question: '오페라하우스의 지붕은 무엇을 닮았나?', answer: '조개껍데기', proof: '조개껍데기 같은 지붕', wrong: ['왕관', '물고기'] },
  },
  // --- Ten more squares, also of 2026.10.7 (the user: "1번 하자. 10개 더"). Chosen so that
  // every continent has one: the first in South America, in West Africa, in South-East
  // Asia, in China and at the South Pole, and a second solar eclipse. Every line is a
  // placeholder and every fact is from memory (docs/넘김.md section 4). Squares without a
  // known day stand at noon on a day chosen for the season.
  {
    no: 8, id: 'persepolis', name: '페르세폴리스', dateLabel: 'BC 518년경', place: '페르세폴리스, 이란',
    lat: 29.935, lon: 52.891,
    date: { year: -518, month: 4, day: 1 }, calendar: 'julian', hourLocal: 12,
    // Looking east: the terrace with the mountain behind it.
    facingAz: 90, nightOnLook: true,
    memo: '높은 돌단 위에 궁을 짓기 시작.', sora: '아직 짓는 중이야. 기둥이 엄청 커!',
    memoToday: '남은 것: 기둥과 돌계단.', soraToday: '지붕이 없어. 기둥만 남았네.',
    noteMemo: '기원전 518년경. 다리우스 왕이 돌단 위에 큰 궁을 짓기 시작했다고 읽음. 날을 몰라 달은 못 적음.',
    card: '기원전 518년 무렵, 페르시아의 다리우스 왕이 높은 돌단 위에 새 궁 페르세폴리스를 짓기 시작했습니다. 여러 나라의 사신이 선물을 들고 오르는 모습이 돌계단 벽에 새겨졌습니다. 기원전 330년에 알렉산드로스의 군대가 궁을 불태웠고, 지금은 돌기둥과 계단이 남아 있습니다.',
    reply: '불에 타도 돌은 남는구나. 그 계단을 네가 올랐니.',
    quiz: { question: '돌계단 벽에는 무엇이 새겨졌나?', answer: '선물을 든 사신들', proof: '사신이 선물을 들고', wrong: ['싸우는 병사들', '밤하늘의 별자리'] },
  },
  {
    no: 18, id: 'teotihuacan', name: '태양의 피라미드', dateLabel: 'AD 200년경', place: '테오티우아칸, 멕시코',
    lat: 19.6925, lon: -98.8438,
    date: { year: 200, month: 5, day: 1 }, calendar: 'julian', hourLocal: 12,
    // The pyramid's stair faces west; it is seen from the avenue, looking east.
    facingAz: 90, nightOnLook: true,
    memo: '해의 피라미드를 다 쌓음.', sora: '빨갛게 칠했어! 계단이 끝이 없네.',
    memoToday: '남은 것: 피라미드. 칠은 벗겨짐.', soraToday: '돌색이 됐네. 꼭대기 집도 없어.',
    noteMemo: '200년경. 멕시코 고원의 큰 도시에 해의 피라미드를 다 쌓았다고 읽음. 날을 몰라 달은 못 적음.',
    card: '서기 200년 무렵, 멕시코 고원의 큰 도시에 태양의 피라미드가 다 지어졌습니다. 겉에는 회반죽을 바르고 붉게 칠했으며, 꼭대기에는 신전이 있었습니다. 도시는 몇백 년 뒤 버려졌고, 훗날 이곳에 온 아스테카 사람들이 테오티우아칸이라는 이름을 붙였습니다.',
    reply: '지은 사람들의 이름은 아무도 모른단다. 돌만 알지.',
    quiz: { question: '테오티우아칸이라는 이름은 누가 붙였나?', answer: '아스테카 사람들', proof: '아스테카 사람들이', wrong: ['도시를 지은 사람들', '스페인 사람들'] },
  },
  {
    // 27 December 537 (Julian): a waxing gibbous moon, 65 degrees up in the south-west at
    // 9 pm. The picture looks that way, from the north-east.
    no: 19, id: 'hagiaSophia', name: '하기아 소피아', dateLabel: 'AD 537.12.27', place: '콘스탄티노플 (이스탄불)',
    lat: 41.0086, lon: 28.9802,
    date: { year: 537, month: 12, day: 27 }, calendar: 'julian', hourLocal: 12,
    facingAz: 215, nightOnLook: true,
    memo: '둥근 지붕의 큰 성당이 열림.', sora: '지붕이 하늘처럼 둥글어. 크다!',
    memoToday: '남은 것: 건물. 탑이 넷 생김.', soraToday: '뾰족한 탑이 넷이나 생겼네.',
    noteMemo: '537.12.27. 다섯 해 만에 지은 큰 돔 성당이 문을 열었다고 읽음. 그날 달은 반달을 지나 차는 중.',
    card: '537년 12월 27일, 콘스탄티노플에서 유스티니아누스 황제가 새 성당 하기아 소피아의 문을 열었습니다. 큰 둥근 지붕을 얹은 이 건물은 천 년 가까이 세상에서 가장 큰 성당이었습니다. 1453년 뒤로 건물 둘레에 뾰족한 탑 넷이 세워졌고, 지금도 그 자리에 서 있습니다.',
    reply: '천오백 해를 서 있는 지붕이란다. 올려다보니 어떻더냐.',
    quiz: { question: '뒷날 건물 둘레에 무엇이 세워졌나?', answer: '뾰족한 탑 넷', proof: '뾰족한 탑 넷', wrong: ['높은 성벽', '둥근 지붕 하나 더'] },
  },
  {
    no: 21, id: 'borobudur', name: '보로부두르', dateLabel: 'AD 825년경', place: '자바, 인도네시아',
    lat: -7.608, lon: 110.204,
    date: { year: 825, month: 6, day: 1 }, calendar: 'julian', hourLocal: 12,
    facingAz: 270, nightOnLook: true,
    memo: '돌로 쌓은 큰 절을 다 지음.', sora: '종 같은 탑이 잔뜩 있어!',
    memoToday: '남은 것: 보로부두르. 그대로.', soraToday: '돌이 까매졌네. 모양은 그대로.',
    noteMemo: '825년경. 자바 섬에 돌을 층층이 쌓은 큰 절을 다 지었다고 읽음. 날을 몰라 달은 못 적음.',
    card: '825년 무렵, 자바 섬에 돌을 층층이 쌓아 올린 불교 사원 보로부두르가 다 지어졌습니다. 꼭대기의 둥근 단에는 종 모양의 돌탑 일흔두 개가 둘러서 있습니다. 사원은 화산재와 숲에 묻혀 잊혔다가 1814년에 다시 알려졌습니다.',
    reply: '천 년을 숲이 덮어 줬구나. 그래서 남았지.',
    quiz: { question: '사원은 무엇에 묻혀 잊혔나?', answer: '화산재와 숲', proof: '화산재와 숲', wrong: ['바닷물', '모래 언덕'] },
  },
  {
    // Cairo in the summer of 1324, when Mansa Musa of Mali came through on his way to Mecca
    // and his people changed so much gold that its price fell (al-Umari). The day is not on
    // record: a noon of July is taken. The place is walked about (core/walks.js).
    no: 28, id: 'musa1324', name: '금을 뿌린 임금', dateLabel: 'AD 1324년 여름', place: '카이로, 이집트',
    lat: 30.045, lon: 31.262,
    date: { year: 1324, month: 7, day: 15 }, calendar: 'julian', hourLocal: 12,
    facingAz: 180, nightOnLook: true,
    memo: '말리의 임금이 금을 나눠 줌.', sora: '저 낙타들, 다 금을 실었어?',
    memoToday: '남은 것: 지도 속 그의 그림.', soraToday: '지도에 임금님이 그려져 있대!',
    noteMemo: '1324년 여름. 금을 너무 많이 나눠 줘서 금값이 떨어졌다고 읽음. 날을 몰라 달은 못 적음.',
    card: '1324년 여름, 서아프리카 말리의 임금 만사 무사가 메카로 가는 길에 카이로에 들렀습니다. 그는 궁정의 벼슬아치마다 금을 나눠 주었고, 일행이 금을 너무 많이 바꾸어 이집트의 금값이 떨어졌습니다. 뒷날 유럽의 지도에는 금덩이를 든 그의 모습이 그려졌습니다.',
    reply: '그 임금은 뒷날 지도에 금덩이를 든 모습으로 그려졌단다. 이집트의 금값은 여러 해 제자리로 못 돌아왔지.',
    quiz: { question: '금이 너무 많이 풀리자 어떻게 되었나?', answer: '금값이 떨어졌다', proof: '금값이 떨어졌습니다', wrong: ['금값이 올랐다', '금이 사라졌다'] },
  },
  {
    no: 29, id: 'timbuktu', name: '진흙 모스크', dateLabel: 'AD 1327년', place: '팀북투, 말리',
    lat: 16.7713, lon: -3.010,
    date: { year: 1327, month: 1, day: 15 }, calendar: 'julian', hourLocal: 12,
    facingAz: 80, nightOnLook: true,
    memo: '진흙으로 큰 모스크를 지음.', sora: '흙으로 지었어! 막대가 삐죽삐죽.',
    memoToday: '남은 것: 모스크. 해마다 덧바름.', soraToday: '그대로야. 흙을 계속 바른대.',
    noteMemo: '1327년. 사막 끝 도시 팀북투에 진흙으로 큰 모스크를 지었다고 읽음. 날을 몰라 달은 못 적음.',
    card: '1327년, 사하라 사막 남쪽 끝의 도시 팀북투에 징게레베르 모스크가 지어졌습니다. 말리의 왕 만사 무사가 메카에 다녀온 뒤 짓게 한 것으로, 진흙과 나무로 지었습니다. 비에 씻긴 벽을 사람들이 해마다 진흙으로 덧발라 지금까지 서 있습니다.',
    reply: '해마다 다 같이 바른다지. 그게 칠백 해란다.',
    quiz: { question: '진흙 모스크는 어떻게 지금까지 서 있나?', answer: '해마다 진흙으로 덧발라서', proof: '해마다 진흙으로 덧발라', wrong: ['돌로 다시 지어서', '비가 오지 않아서'] },
  },
  {
    // The great hall is seen looking north, as the palace hall of Hunminjeongeum is.
    no: 32, id: 'forbiddenCity', name: '자금성', dateLabel: 'AD 1420년', place: '베이징, 명',
    lat: 39.916, lon: 116.397,
    date: { year: 1420, month: 10, day: 1 }, calendar: 'julian', hourLocal: 12,
    facingAz: 0, nightOnLook: true,
    memo: '황제의 큰 궁을 다 지음.', sora: '마당이 운동장보다 넓어!',
    memoToday: '남은 것: 자금성. 박물관이 됨.', soraToday: '줄 선 사람 대신 구경꾼이네.',
    noteMemo: '1420년. 베이징에 황제의 궁 자금성을 열네 해 걸려 다 지었다고 읽음. 날을 몰라 달은 못 적음.',
    card: '1420년, 명나라의 영락제가 베이징에 새 궁 자금성을 다 지었습니다. 열네 해가 걸렸고, 그 뒤 오백 년 동안 황제 스물네 명이 이곳에서 살았습니다. 1925년부터는 누구나 들어갈 수 있는 박물관이 되었습니다.',
    reply: '아무나 못 들어가던 데를 네가 들어갔구나.',
    quiz: { question: '자금성은 지금 무엇이 되었나?', answer: '박물관', proof: '박물관', wrong: ['대학교', '호텔'] },
  },
  {
    // Seen from above the terraces looking north-north-west, with the peak behind the city.
    no: 35, id: 'machuPicchu', name: '마추픽추', dateLabel: 'AD 1450년경', place: '마추픽추, 페루',
    lat: -13.163, lon: -72.545,
    date: { year: 1450, month: 6, day: 21 }, calendar: 'julian', hourLocal: 12,
    facingAz: 340, nightOnLook: true,
    memo: '산꼭대기에 돌의 도시를 세움.', sora: '구름보다 높은 데 집이 있어!',
    memoToday: '남은 것: 돌벽. 지붕은 없음.', soraToday: '지붕이 다 없어졌네. 라마다!',
    noteMemo: '1450년경. 잉카 사람들이 높은 산등성이에 돌의 도시를 세웠다고 읽음. 날을 몰라 달은 못 적음.',
    card: '1450년 무렵, 잉카의 왕 파차쿠티가 안데스의 높은 산등성이에 돌의 도시 마추픽추를 세웠습니다. 돌을 틈 없이 맞물려 쌓았고, 비탈에는 계단밭을 만들었습니다. 백 해쯤 뒤 사람들이 떠났고, 도시는 1911년에야 바깥세상에 널리 알려졌습니다.',
    reply: '산이 숨겨 줘서 남은 도시란다. 숨이 차지 않더냐.',
    quiz: { question: '비탈에는 무엇을 만들었나?', answer: '계단밭', proof: '계단밭', wrong: ['큰 연못', '나무다리'] },
  },
  {
    // The pole itself has no azimuth, so the square stands a little off it; lon 0 makes
    // hourLocal universal time (about 3 pm, when they arrived). The sun goes round at 23
    // degrees and does not set, so the clock is not run on to "that night".
    no: 84, id: 'amundsen', name: '남극점', dateLabel: 'AD 1911.12.14', place: '남극점',
    lat: -89.98, lon: 0,
    date: { year: 1911, month: 12, day: 14 }, calendar: 'gregorian', hourLocal: 15,
    // 306 rather than straight at the sun (314): it stands right of the middle.
    facingAz: 306, nightOnLook: false,
    memo: '사람이 처음 남극점에 닿음.', sora: '다 하얘. 여기가 지구 맨 아래래!',
    soraSky: '해가 안 진대. 옆으로만 돈대!',
    memoToday: '남은 것: 없음. 곁에 기지가 섬.', soraToday: '천막은 눈 밑에 있대. 깃발이 많네.',
    noteMemo: '1911.12.14. 아문센과 네 사람이 개썰매로 남극점에 처음 닿았다고 읽음. 그날은 해가 지지 않음.',
    card: '1911년 12월 14일, 노르웨이의 아문센과 네 사람이 개썰매를 타고 남극점에 처음 닿았습니다. 그들은 천막을 치고 깃발을 꽂았으며, 뒤에 올 사람에게 편지를 남겼습니다. 천막은 눈에 묻혀 보이지 않고, 지금 그 곁에는 과학 기지가 있습니다.',
    reply: '거기는 여름 내내 해가 안 진단다. 잠은 어찌 잤을꼬.',
    quiz: { question: '아문센 일행은 무엇을 타고 갔나?', answer: '개썰매', proof: '개썰매', wrong: ['조랑말', '눈 자동차'] },
  },
  {
    // The second solar eclipse. Roca Sundy on Principe, where Eddington set up: total for
    // 310 seconds by computation; 14.7551 h local is 14:16 UT, the middle of it. The sun is
    // 44.5 degrees up at azimuth 299, with Mars and Mercury beside it and the Hyades around.
    no: 86, id: 'eddington', name: '휘는 별빛', dateLabel: 'AD 1919.5.29', place: '프린시페 섬',
    lat: 1.67, lon: 7.39,
    date: { year: 1919, month: 5, day: 29 }, calendar: 'gregorian', hourLocal: 14.7551,
    // 280 rather than straight at the sun: it stands well right of the middle, clear of the line of guidance.
    facingAz: 280, nightOnLook: false, leadMin: 30,
    memo: '일식 때 별빛이 휘는지 잼.', sora: '또 해가 가려져! 사진을 찍나 봐.',
    soraSky: '해 옆에 별이 보여. 저걸 찍는 거야.',
    memoToday: '남은 것: 농장 집과 기념비.', soraToday: '망원경은 없고 돌이 하나 있어.',
    noteMemo: '1919.5.29. 에딩턴이 일식 때 해 곁의 별을 찍어 빛이 휘는 것을 쟀다고 읽음. 그날 달은 해 앞에.',
    card: '1919년 5월 29일, 영국의 천문학자 에딩턴은 아프리카 서쪽의 프린시페 섬에서 해가 다 가려진 몇 분 동안 해 곁의 별들을 사진에 담았습니다. 별들은 제자리에서 조금 비켜 찍혔습니다. 무거운 해 곁에서 빛이 휜다는 아인슈타인의 생각이 맞았던 것입니다.',
    reply: '구름이 잠깐 비켜 줘서 찍었단다. 하늘이 도운 거지.',
    quiz: { question: '사진 속 별들은 어떻게 찍혔나?', answer: '제자리에서 조금 비켜', proof: '제자리에서 조금 비켜', wrong: ['평소보다 밝게', '둘로 갈라져'] },
  },
  {
    // Seen from the hills north of the strait, looking south-south-east to the city.
    no: 94, id: 'goldenGate', name: '금문교', dateLabel: 'AD 1937.5.27', place: '샌프란시스코, 미국',
    lat: 37.8199, lon: -122.4783,
    date: { year: 1937, month: 5, day: 27 }, calendar: 'gregorian', hourLocal: 12,
    facingAz: 150, nightOnLook: true,
    memo: '바다 위 긴 다리가 열림.', sora: '다리 위에 사람이 가득해!',
    memoToday: '남은 것: 금문교. 그대로.', soraToday: '다리는 그대로, 빌딩이 생겼네.',
    noteMemo: '1937.5.27. 바다 어귀의 붉은 다리가 열려 첫날은 걸어서 건넜다고 읽음. 그날 달은 보름을 막 지남.',
    card: '1937년 5월 27일, 샌프란시스코에서 금문교가 문을 열었습니다. 첫날은 차가 다니지 않아 이십만 명쯤이 걸어서 다리를 건넜습니다. 탑과 탑 사이가 1,280m로, 그때 세상에서 가장 긴 매달린 다리였습니다.',
    reply: '안개 속에서도 보이라고 그 색이란다. 잘 보이더냐.',
    quiz: { question: '첫날 사람들은 다리를 어떻게 건넜나?', answer: '걸어서', proof: '걸어서', wrong: ['배를 타고', '기차를 타고'] },
  },
  {
    // The first of the fast trains left Tokyo at six that morning. The place is walked
    // about (core/walks.js); its lines here are placeholders and its facts from memory
    // (the hour, four hours to Osaka, 210 km an hour).
    no: 107, id: 'shinkansen', name: '첫 고속 열차', dateLabel: 'AD 1964.10.1', place: '도쿄, 일본',
    lat: 35.681, lon: 139.767,
    date: { year: 1964, month: 10, day: 1 }, calendar: 'gregorian', hourLocal: 7,
    facingAz: 100, nightOnLook: true,
    memo: '세상에서 가장 빠른 기차가 떠남.', sora: '코가 둥글어! 비행기 같아.',
    memoToday: '남은 것: 그 기찻길. 지금도 달림.', soraToday: '기차는 바뀌었는데 길은 그대로래.',
    noteMemo: '1964.10.1. 도쿄에서 세상에서 가장 빠른 기차가 처음 떠났다고 읽음. 그날 달은 그믐에 가까움.',
    card: '1964년 10월 1일 아침 6시, 도쿄역에서 새 고속 열차가 처음 떠났습니다. 한 시간에 210km를 달려, 여섯 시간 반이 걸리던 오사카까지를 네 시간에 갔습니다. 아흐레 뒤 도쿄에서 올림픽이 열렸습니다.',
    reply: '네 시간이라니. 나 때는 하루가 걸렸단다.',
    quiz: { question: '새 기차는 오사카까지 얼마나 걸렸나?', answer: '네 시간', proof: '네 시간에', wrong: ['열 시간', '이틀'] },
  },
  {
    // The opening of the Games of Seoul at the Olympic Stadium in Jamsil, a Saturday. It
    // began at 10:30; the boy with the hoop crossed the grass about an hour and a half in,
    // after the flame was lit. The place is walked about (core/walks.js); the first plan's
    // lines here (the card, the question) are not shown where a place is walked.
    no: 113, id: 'seoul88', name: '굴렁쇠 소년', dateLabel: 'AD 1988.9.17', place: '서울, 대한민국',
    lat: 37.5158, lon: 127.0728,
    date: { year: 1988, month: 9, day: 17 }, calendar: 'gregorian', hourLocal: 12,
    facingAz: 180, nightOnLook: true,
    memo: '서울에서 올림픽이 열림.', sora: '경기장이 물결 같아!',
    memoToday: '남은 것: 그 경기장. 그대로.', soraToday: '경기장은 그대로 있네.',
    noteMemo: '1988.9.17. 잠실에서 올림픽이 열렸다. 텔레비전으로 본 날. 그날 달은 초승에서 반달 사이.',
    card: '1988년 9월 17일 오전, 서울 잠실의 올림픽주경기장에서 스물네 번째 올림픽이 문을 열었습니다. 160개 나라가 왔습니다. 태권도 시범이 끝난 뒤 텅 빈 잔디 위를 국민학교 1학년 아이 하나가 굴렁쇠를 굴리며 가로질렀습니다.',
    reply: '굴렁쇠 아이를 봤구나. 그날 온 나라가 숨을 죽였단다.',
    quiz: { question: '텅 빈 잔디를 가로지른 것은?', answer: '굴렁쇠를 굴리는 아이', proof: '굴렁쇠를 굴리며', wrong: ['말을 탄 기수', '흰 비둘기 떼'] },
  },
  {
    // Tahiti on the day Venus crossed the Sun, timed from the fort Cook's people had built on
    // the point at the east end of Matavai Bay (Point Venus, as it is still called). The
    // place is walked about (core/walks.js). The transit took the middle of the day.
    no: 50, id: 'venus1769', name: '해를 지나는 금성', dateLabel: 'AD 1769.6.3', place: '타히티, 남태평양',
    lat: -17.495, lon: -149.494,
    date: { year: 1769, month: 6, day: 3 }, calendar: 'gregorian', hourLocal: 12,
    facingAz: 0, nightOnLook: true,
    memo: '금성이 해 앞을 지나감.', sora: '다들 해만 쳐다보고 있어!',
    memoToday: '남은 것: 그 곶의 이름. 비너스 곶.', soraToday: '곶 이름이 아직도 비너스래!',
    noteMemo: '1769.6.3. 금성이 해 앞을 지나갔다고 읽음. 그날 해에 까만 점 하나가 있었다고.',
    card: '1769년 6월 3일, 금성이 해 앞을 지나갔습니다. 영국의 쿡 대위와 천문학자 그린은 그 시각을 재려고 배로 일곱 달 반을 걸려 남태평양 타히티섬에 왔고, 곶에 작은 요새를 짓고 망원경을 세웠습니다. 그 곶은 지금도 비너스 곶이라고 부릅니다.',
    reply: '그날 잰 시각으로 해까지의 거리를 셈하려 했단다. 금성은 105년 뒤에야 다시 해를 지났지.',
    quiz: { question: '그날 해 앞을 지나간 것은?', answer: '금성', proof: '금성이 해 앞을', wrong: ['수성', '혜성'] },
  },
  {
    // Kaifeng, the Song capital, on the morning a new star was seen in the east at daybreak
    // (the supernova whose remains are the Crab Nebula). The place is walked about
    // (core/walks.js); its sky is in the pictures, which are in ink.
    no: 25, id: 'guest1054', name: '낮에 뜬 별', dateLabel: 'AD 1054.7.4', place: '개봉, 중국',
    lat: 34.797, lon: 114.307,
    date: { year: 1054, month: 7, day: 4 }, calendar: 'julian', hourLocal: 5,
    facingAz: 90, nightOnLook: true,
    memo: '없던 별이 하늘에 나타남.', sora: '저 별, 엄청 밝아!',
    memoToday: '남은 것: 그 별의 자취. 게성운.', soraToday: '그 별이 구름이 됐대!',
    noteMemo: '1054.7.4. 없던 별이 나타났다고 읽음. 그 별은 낮에도 보였다고.',
    card: '1054년 7월 4일 새벽, 송나라의 서울 개봉에서 천문 관원 양유덕이 동쪽 하늘에 없던 별이 나타난 것을 적었습니다. 금성보다 밝았고 스무사흘 동안 낮에도 보였습니다. 그 자리에는 지금 게성운이 있습니다.',
    reply: '그 별은 스무사흘 동안 낮에도 보였단다. 지금은 게 모양 구름이 되어 그 자리에 있지.',
    quiz: { question: '그 별은 얼마 동안 낮에도 보였나?', answer: '스무사흘', proof: '스무사흘 동안 낮에도', wrong: ['이틀', '한 해'] },
  },
  {
    // Milan while Leonardo was painting the Last Supper in the refectory of Santa Maria
    // delle Grazie. The day is not on record: a noon of high summer in 1497 is taken (the
    // duke's letter urging him on is of 29 June; Bandello writes of the sun in Leo; the
    // wall was done early in 1498). The place is walked about (core/walks.js).
    no: 36, id: 'cenacolo', name: '최후의 만찬', dateLabel: 'AD 1497년 여름', place: '밀라노, 이탈리아',
    lat: 45.466, lon: 9.171,
    date: { year: 1497, month: 7, day: 25 }, calendar: 'julian', hourLocal: 12,
    facingAz: 180, nightOnLook: true,
    memo: '레오나르도가 "최후의 만찬"을 그림.', sora: '저 큰 그림을 한 사람이 그려?',
    memoToday: '남은 것: 그 그림. 그 벽에 그대로.', soraToday: '그림이 아직 그 벽에 있대!',
    noteMemo: '1497년 여름. 레오나르도가 수도원 식당 벽에 그림을 그렸다고 읽음. 그날 달은 그믐으로 기우는 눈썹달.',
    card: '1497년 여름, 레오나르도 다빈치는 밀라노의 산타 마리아 델레 그라치에 수도원 식당 벽에 "최후의 만찬"을 그리고 있었습니다. 젖은 회벽에 빨리 그리는 법 대신 마른 벽에 천천히 그렸습니다. 그림은 이듬해에 끝났고 지금도 그 벽에 있습니다.',
    reply: '그 화가를 봤구나. 그 그림은 지금도 그 벽에 있단다.',
    quiz: { question: '"최후의 만찬"은 어디에 그려졌나?', answer: '수도원 식당 벽', proof: '수도원 식당 벽', wrong: ['대성당 천장', '궁전의 나무 판'] },
  },
// Kept in the order of the notebook, whatever order they were written in above.
].sort((a, b) => a.no - b.no);

export const squareById = (id) => SQUARES.find((s) => s.id === id);

// How a square is named on screen: its name alone. Its number (its place among the
// notebook's 120) only keeps the order; shown, it read as a riddle (the user asked what it
// meant, 2026.10.7). The yard of 1969 was called "첫 장" until the game began in Rome
// instead (2026.10.8).
export const squareTitle = (square) => square.name;

// Its name on the Earth, where the pins of many times lie side by side: the year after it
// (the user, 2026.10.9: "도시 이름 뒤에 연도 표기").
export const pinTitle = (square) => `${square.name} AD ${square.date.year}`;

// What grandmother wrote of that day's sky: the last sentence of her memo ("그날 달은 보름.",
// or that she could not note it for want of the day). It is shown while Sora looks up,
// so that it is plain what the sky is there for: the thing grandmother could only read of.
export const skyMemoOf = (square) => square.noteMemo.slice(square.noteMemo.lastIndexOf('. ', square.noteMemo.length - 2) + 2);
