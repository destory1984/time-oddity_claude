// The squares so far: the four of the first slice, three more and then ten more, all of 2026.10.7. date is a historical date in the square's own
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
    lat: 36.48, lon: 127.29,
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
    no: 75, id: 'eiffel', name: '에펠탑', dateLabel: 'AD 1889.3.31', place: '파리, 프랑스',
    lat: 48.858, lon: 2.294,
    date: { year: 1889, month: 3, day: 31 }, calendar: 'gregorian', hourLocal: 13.5,
    facingAz: 315, nightOnLook: true,
    // All of this square's lines are placeholders, and its facts are from memory.
    memo: '쇠로 지은 높은 탑을 다 세움.', sora: '쇠로 뜬 레이스 같아. 엄청 높다!',
    memoToday: '남은 것: 에펠탑. 그대로 서 있음.', soraToday: '둘레 건물만 없고 탑은 그대로네.',
    noteMemo: '1889.3.31. 파리에 쇠로 지은 탑을 다 세웠다고 책에서 읽음. 그날 밤은 달이 뜨지 않음.',
    card: '1889년 3월 31일, 파리에서 에펠탑이 다 지어졌습니다. 만국박람회의 문으로 세운 이 탑은 스무 해 뒤에 헐기로 되어 있었습니다. 탑은 전파를 보내는 안테나로 쓸모를 얻어 헐리지 않았고, 지금도 그 자리에 서 있습니다.',
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
  // --- Ten squares added on 2026.10.7 (the user: "10개 더 하자"). Every line of theirs is a
  // placeholder. Squares without a known day stand at noon on a day chosen for the season;
  // facingAz was chosen from the computed sky so that something is up at 9 pm where the
  // real view allows it (the palace hall and the Taj Mahal are seen looking north).
  {
    no: 2, id: 'stonehenge', name: '스톤헨지', dateLabel: 'BC 2500년경', place: '솔즈베리, 영국',
    lat: 51.179, lon: -1.826,
    date: { year: -2500, month: 7, day: 12 }, calendar: 'julian', hourLocal: 12,
    facingAz: 170, nightOnLook: true,
    memo: '큰 돌을 둥글게 세웠다고 읽음.', sora: '돌 위에 돌을 어떻게 올렸지?',
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
    memo: '흰 돌 신전을 다 지었다고 읽음.', sora: '색칠이 돼 있어! 흰색이 아니네.',
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
    memo: '큰 경기장이 문을 열었다고 읽음.', sora: '천막 지붕이 있어! 엄청 커.',
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
    memo: '별을 보는 돌탑을 쌓았다고 읽음.', sora: '병처럼 생겼어. 창으로 들어가나 봐.',
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
    no: 34, id: 'hunminjeongeum', name: '훈민정음', dateLabel: 'AD 1446년 가을', place: '경복궁, 한양',
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
    no: 47, id: 'tajMahal', name: '타지마할', dateLabel: 'AD 1653년', place: '아그라, 인도',
    lat: 27.175, lon: 78.042,
    date: { year: 1653, month: 3, day: 1 }, calendar: 'gregorian', hourLocal: 12,
    facingAz: 0, nightOnLook: true,
    memo: '흰 돌 무덤을 다 지었다고 읽음.', sora: '하얗다. 물에도 비쳐.',
    memoToday: '남은 것: 타지마할. 그대로.', soraToday: '나무가 줄었네. 건물은 그대로.',
    noteMemo: '1653년. 황제가 황후를 위해 스물두 해 걸려 흰 돌 무덤을 지었다고 읽음. 날을 몰라 달은 못 적음.',
    card: '1653년 무렵, 인도 아그라에 흰 대리석 무덤 타지마할이 다 지어졌습니다. 무굴의 황제 샤자한이 먼저 떠난 황후 뭄타즈 마할을 위해 스물두 해에 걸쳐 지은 것입니다. 건물은 그대로 남았고, 과일나무가 빽빽하던 정원은 뒷날 잔디밭으로 바뀌었습니다.',
    reply: '보고 싶은 마음을 돌로 쌓으면 그렇게 되는구나.',
    quiz: { question: '타지마할은 누구를 위해 지었나?', answer: '황후', proof: '황후 뭄타즈 마할을 위해', wrong: ['황제의 어머니', '전쟁에서 진 장군'] },
  },
  {
    no: 54, id: 'montgolfier', name: '첫 열기구', dateLabel: 'AD 1783.11.21', place: '파리, 프랑스',
    lat: 48.861, lon: 2.269,
    date: { year: 1783, month: 11, day: 21 }, calendar: 'gregorian', hourLocal: 14,
    facingAz: 190, nightOnLook: true,
    memo: '사람이 처음 하늘에 떴다고 읽음.', sora: '떴다! 불을 때서 뜨는 거래.',
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
// Kept in the order of the notebook, whatever order they were written in above.
].sort((a, b) => a.no - b.no);

export const squareById = (id) => SQUARES.find((s) => s.id === id);

// How a square is named on screen: its name alone. Its number (its place among the
// notebook's 120) only keeps the order; shown, it read as a riddle (the user asked what it
// meant, 2026.10.7). The first leaf says that it is the first leaf.
export const squareTitle = (square) => (square.no === 0 ? `첫 장 ${square.name}` : square.name);

// What grandmother wrote of that day's sky: the last sentence of her memo ("그날 달은 보름.",
// or that she could not note it for want of the day). It is shown while Sora looks up,
// so that it is plain what the sky is there for: the thing grandmother could only read of.
export const skyMemoOf = (square) => square.noteMemo.slice(square.noteMemo.lastIndexOf('. ', square.noteMemo.length - 2) + 2);
