// The places where people live, walked about scene by scene (core/walk.js;
// docs/기획서-v4-사는-때로.md section 4). The key is the square's id.
//
// A scene: its picture (public/walks/<dir>/<id>.webp, 3:2, the sky keyed out), how
// large it is shown (zoom: the picture's height in screen heights), where in the picture
// feet stand (ground: share of its height from the top), the name shown as the place, and
// what Sora says on first coming into it.
// A person: where along the scene (x, 0 to 1), the picture (<id>.png, w and h its size
// in px), what the "speak" button calls them, and two lines, 25 characters at most each.
// A spot: a stretch of the scene (from, to); standing in it shows what grandmother wrote
// (memo) or makes Sora say something (sora). A named person of history is only ever a
// spot: seen from afar, never spoken to, and what is said of them is on record.
// Errands: grandmother's three; `at` is the people or spots any one of which does it.
// A scene's `air` is what is heard there now and then (ui/sound.js AIRS) and `floor` what
// her feet sound on: 'stone' (if not given), 'dirt' or 'wood'.
//
// A place has one of two looks (the plan's section 4 tries one each). Rome is all pixels.
// Paris is `look: 'paper'`: flat drawings, with pieces that move on their own (a scene's
// `moving`, core/pieces.js) the way volume 1 plays its days on the Moon; and
// `talk: 'face'`: whoever is spoken to answers in a panel with a face in pixels
// (face-<id>.png). A person's `sound` is one of ui/sound.js's, heard when they speak.
//
// The ordinary people are made up; their lines are what such a person might have said.
// Every fact in them is from memory and to be checked (the hundred days of games, the
// sailors of the fleet at Misenum who worked the awning, the numbered entrances and the
// tokens, free entry, the seats by rank with women at the top, Nero's lake).
// Paris. Looked up on 2026.10.8 and found so: the tower opened to the public on 15 May
// 1889 with its lifts not yet running (from 26 May or from June, the sources differ), 360
// steps to the first floor, about thirty-five countries, Edison's phonograph heard
// through ear tubes in the Gallery of Machines. What it cost to enter the fair the sources
// give differently (40 centimes, a franc), so the ticket seller names no sum. Still from
// memory: the artists' protest of 1887, the Forth Bridge then being built, four
// restaurants on the first floor, two years and two months of building, eighteen
// thousand pieces of iron, the hall's roof standing with no pillar.
const SHEET = { market: 0.6, plaza: 0.66, inside: 0.62 };   // how large a sheet's figures are shown, of their px on a 812 px screen

export const WALKS = {
  colosseum: {
    dir: 'rome', look: 'paper',
    scenes: [
      {
        id: 'market', name: '로마 시장 거리', zoom: 1.25, ground: 0.765, scale: SHEET.market, air: 'market',
        sora: '사람이 엄청 많아! 냄새도 나.',
        people: [
          { id: 'baker', pass: '빵이오! 갓 구운 빵!', name: '빵 장수', x: 0.163, w: 118, h: 304, lines: ['갓 구웠어요. 여덟 쪽으로 갈라 드셔요.', '경기장 덕에 오늘은 벌써 동났네.'] },
          { id: 'boy', pass: '비켜요, 비켜! 바빠요!', name: '심부름 소년', x: 0.228, w: 131, h: 287, lines: ['주인님 빵 받으러 왔어. 늦으면 혼나.', '나도 경기장 가 보고 싶다.'] },
          { id: 'garum', pass: '생선 소스! 구경하고 가쇼!', show: 'garum', pose: 'see-peer', name: '생선 소스 장수', x: 0.31, w: 123, h: 314, lines: ['히스파니아에서 배로 온 거요. 한 국자?', '냄새는 지독해도 맛은 황제 것이오.'],
            try: { id: 'eat-garum', verb: 'eat', name: '생선 소스', face: 'yuck', sora: '으엑! 생선 썩은 맛이야!', memo: '로마의 간장이란다. 냄새는 지독한데 없으면 못 살았대.' } },
          { id: 'dormouse', pass: '귀한 구이요! 보고 가쇼.', show: 'dormouse', pose: 'see-gasp', name: '겨울잠쥐 장수', x: 0.39, w: 170, h: 298, lines: ['항아리에서 살찌운 놈이오.', '꿀 발라 구웠소. 귀한 손님상 거요.'],
            try: { id: 'eat-dormouse', verb: 'eat', name: '겨울잠쥐 구이', face: 'hmm', sora: '쥐… 쥐라고? 닭고기 맛인데.', memo: '쥐를 항아리에서 살찌워 먹었단다. 귀한 손님상에 올랐지.' } },
          { id: 'lady', pass: '어머, 사람이 왜 이리 많니.', name: '귀부인', x: 0.47, w: 104, h: 320, lines: ['새 경기장? 자리는 신분대로 앉는단다.', '여자 자리는 맨 뒤쪽이라지 뭐니.'] },
          { id: 'maid', pass: '아이고, 무거워라.', name: '하녀', x: 0.535, w: 99, h: 281, lines: ['마님 짐이 무거워요. 구경은 가요!', '뒤에서도 잘 보인대요.'] },
          { id: 'reader', pass: '소식이오, 오늘의 소식!', name: '글 읽는 노인', x: 0.635, w: 133, h: 320, lines: ['오늘의 소식! 새 경기장이 문을 연다!', '글 모르는 이는 내게 오시오. 한 닢.'] },
          { id: 'dog', pass: '킁킁.', name: '개', x: 0.74, w: 96, h: 163, lines: ['멍!', '(꼬리를 흔든다)'] },
          // Honeyed wine cooled with snow is what was sold; for a child it is honey water.
          { id: 'snow', pass: '눈이오, 진짜 눈! 보고 가쇼.', show: 'snow', pose: 'see-wow', name: '눈 장수', x: 0.812, w: 158, h: 320, lines: ['산에서 지고 온 눈이오!', '한 잔에 눈값이 반이지.'],
            try: { id: 'eat-snow', verb: 'eat', name: '눈 넣은 꿀물', face: 'yum', sora: '차가워! 더운 날에 얼음이라니.', memo: '냉장고가 없으니 산의 눈을 지게로 날랐단다.' } },
          { id: 'draper', pass: '토가 한번 걸쳐 보겠소?', name: '옷 가게 주인', x: 0.877, w: 153, h: 305, lines: ['혼자는 못 입어요. 둘은 붙어야지.', '시민만 입는 옷이라오.'],
            try: { id: 'wear-toga', verb: 'wear', name: '토가', outfit: 'toga', pose: 'toga-fuss', trips: 2, sora: '무거워! 자꾸 흘러내려.', memo: '시민만 입을 수 있었고, 무거워서 평소엔 다들 튜닉이었대.' } },
        ],
        spots: [],
      },
      {
        id: 'plaza', name: '로마 콜로세움 앞 광장', short: '콜로세움 앞 광장', zoom: 1.6, ground: 0.79, scale: SHEET.plaza, air: 'court',
        sora: '와, 진짜 새것이다. 하얘!',
        people: [
          { id: 'water', pass: '목마르지 않소? 보고 가쇼.', show: 'posca', pose: 'see-peer', name: '물 장수', x: 0.11, w: 85, h: 268, lines: ['식초 탄 물이오! 병정들이 마시는 거요.', '백 날을 한다니 백 날을 팔아야지.'],
            try: { id: 'eat-posca', verb: 'eat', name: '식초 물', face: 'sour', sora: '으, 셔! 이걸 물 대신 마셔?', memo: '군인의 물이란다. 식초를 타서 잘 안 상했대.' } },
          { id: 'ticket', pass: '어디 보자, 내 문이…', name: '구경 온 아저씨', x: 0.26, w: 100, h: 309, lines: ['이 조각에 문 번호가 있지. 공짜야!', '황제가 여는 잔치라 돈을 안 받아.'],
            try: { id: 'use-token', verb: 'use', name: '입장 조각', sora: '스물셋… 스물셋 문은 저쪽이다!', memo: '입구에 번호가 있어서 오만 명이 금방 들어갔단다.' } },
          { id: 'wife', pass: '세상에, 저게 다 돌이야?', name: '아주머니', x: 0.33, w: 108, h: 270, lines: ['저 높이 좀 봐. 목이 아프네.', '아치마다 조각상이 서 있어.'] },
          // Not a person: it is used, not spoken to.
          { id: 'clock', show: 'clock', name: '물시계', x: 0.415, w: 83, h: 212,
            try: { id: 'use-clock', verb: 'use', name: '물시계', sora: '똑, 똑… 물로 시간을 재네.', memo: '낮을 열둘로 나눴으니 여름 한 시간이 더 길었단다.' } },
          { id: 'old', pass: '허허, 많이도 변했구먼.', name: '할아버지', x: 0.5, w: 97, h: 275, lines: ['여긴 황제의 연못이던 자리야, 암.', '물을 빼고 열 해 만에 이걸 세웠지.'] },
          { id: 'child', pass: '훌쩍…', name: '우는 아이', x: 0.63, w: 63, h: 170, lines: ['엄마가 없어졌어…', '스물셋이랬는데. 스물셋이 어디야?'] },
          { id: 'guard', pass: '줄을 서시오, 줄!', show: 'rednumbers', pose: 'see-aha', sora: '번호가 빨개서 멀리서도 보여!', memo: '문 번호를 돌에 새기고 붉게 칠했단다. 지금은 칠이 다 벗겨졌지.', name: '경비병', x: 0.8, w: 133, h: 320, lines: ['번호 봐요, 번호. 스물셋은 저쪽.', '밀지 마시오. 문은 여든 개요.'] },
        ],
        spots: [],
      },
      {
        id: 'inside', name: '로마 콜로세움 안', short: '콜로세움 안', zoom: 1.3, ground: 0.775, scale: SHEET.inside, air: 'arena',
        sora: '우와… 끝까지 다 사람이야.',
        people: [
          { id: 'usher', pass: '표를 보여 주시오.', name: '자리 안내원', x: 0.17, w: 84, h: 263, lines: ['앞줄은 원로원 자리요. 저 위로.', '자리는 옷을 보고 정하오.'] },
          { id: 'nuts', pass: '콩이요, 콩! 보고 가요!', name: '견과 파는 소년', x: 0.29, w: 99, h: 247, lines: ['볶은 콩 있어요! 구운 밤!', '싸움 시작하면 못 팔아. 지금 사.'],
            try: { id: 'eat-beans', verb: 'eat', name: '볶은 콩', face: 'yum', sora: '고소해! 하나만 더 먹을래.' } },
          { id: 'clap', pass: '와아! 공이다, 공!', show: 'balls', pose: 'see-gasp', sora: '공에 적힌 걸 진짜 주는 거야?!', memo: '황제가 던진 나무 공에 옷, 그릇, 말 같은 상품이 적혀 있었단다.', name: '관중 아저씨', x: 0.4, w: 101, h: 320, lines: ['황제가 나무 공을 던졌어! 잡았지.', '공에 적힌 걸 준대. 나는 옷이야!'] },
          { id: 'cheer', pass: '꺄아, 멋지다!', name: '관중 아가씨', x: 0.7, w: 89, h: 289, lines: ['저기 행진 온다! 반짝반짝해.', '천을 흔들면 황제가 본대.'] },
          { id: 'sailor1', pass: '영차, 줄 당겨라!', name: '뱃사람', x: 0.82, w: 108, h: 254, lines: ['미세눔에서 왔소. 돛 당기던 손이지.', '이 차양이 돛 천이오. 줄쯤이야.'] },
          { id: 'sailor2', pass: '영차! 조금만 더!', name: '젊은 뱃사람', x: 0.89, w: 92, h: 273, lines: ['해가 돌면 차양도 돌려야 하오.', '바람 센 날이 제일 무섭지.'] },
        ],
        spots: [
          // The emperor in his box across the sand: seen, not spoken to.
          { id: 'titus', from: 0.47, to: 0.63, memo: '저 사람이 티투스란다. 아버지가 짓기 시작한 걸 아들이 열었지.' },
          // The fighting itself is not seen: she watches the march and no more.
          { id: 'march', from: 0.2, to: 0.36, sora: '행진까지만 볼래. 싸움은 안 볼 거야.', pose: 'turn-away' },
        ],
      },
    ],
    errands: [
      { id: 'garum', text: '시장에서 생선 소스 좀 찍어 먹어 보렴. 냄새가 지독하다더라.', at: ['eat-garum'] },
      { id: 'toga', text: '토가라는 옷 좀 입어 보렴. 혼자는 못 입는다던데.', at: ['wear-toga'] },
      { id: 'sailors', text: '경기장 지붕을 뱃사람들이 당긴다던데 정말인지.', at: ['sailor1', 'sailor2'] },
    ],
    reply: '그 지독한 걸 먹어 봤구나! 토가는 무겁더냐. 뱃사람 얘기가 정말이었네.',
  },
  eiffel: {
    dir: 'paris', look: 'paper', talk: 'face',
    scenes: [
      {
        id: 'gate', name: '파리 만국박람회 입구', short: '박람회 입구', zoom: 1.3, ground: 0.752, scale: 0.66, air: 'street',
        sora: '깃발이 잔뜩! 저 끝에 탑이야.',
        // People pour in at the middle arch from both sides, and are lost behind its pillars.
        moving: [
          { kind: 'drift', id: 'in', src: 'crowd', from: 0, to: 0.555, foot: 0.748, tall: 0.17, wide: 0.381, gap: 0.03, speed: 0.03, bob: 0.003 },
          { kind: 'drift', id: 'out', src: 'crowd', from: 0.59, to: 1, foot: 0.748, tall: 0.17, wide: 0.381, gap: 0.03, speed: -0.026, bob: 0.003, flip: true },
        ],
        people: [
          { id: 'ticket', pass: '표 사시오! 줄은 이쪽이오.', show: 'train', pose: 'see-wow', sora: '기차 앞을 사람이 걸어가!', memo: '박람회장을 도는 꼬마 기차란다. 깃발 든 사람이 앞서 걸었지.', name: '표 파는 사람', x: 0.159, w: 138, h: 277, lines: ['꼬마 기차도 타 보시오. 저기요.', '오늘부터 탑에 올라갈 수 있소.'] },
          { id: 'news', pass: '호외요! 이 그림 좀 봐요!', name: '신문팔이 소년', x: 0.224, w: 107, h: 269, lines: ['탑 꼭대기 삼백 미터! 세계 제일!', '다른 탑은 죄다 절반이오!'] },
          { id: 'flower', pass: '꽃 사세요, 꽃!', name: '꽃 파는 소녀', x: 0.31, w: 112, h: 255, lines: ['은방울꽃 사세요! 오월의 꽃이에요.', '오늘은 다들 탑만 올려다봐요.'] },
          { id: 'parasol', pass: '어머, 볕이 따갑네.', name: '양산 든 부인', x: 0.44, w: 148, h: 320, lines: ['백 년 전 혁명을 기리는 잔치란다.', '서른다섯 나라가 왔다지 뭐니.'] },
          { id: 'tophat', pass: '흠, 저게 예술이라고?', name: '실크해트 신사', x: 0.66, w: 119, h: 312, lines: ['쇠로 탑이라니. 난 반대했었소.', '…그래도 표는 샀소. 궁금해서.'],
            try: { id: 'wear-tophat', verb: 'wear', name: '실크해트', outfit: 'tophat', sora: '모자가 굴뚝만 해! 휘청휘청.' } },
          { id: 'kilt', pass: '허, 크긴 크구먼.', name: '먼 데서 온 아저씨', x: 0.86, w: 125, h: 286, lines: ['스코틀랜드에서 배 타고 왔다네.', '우리도 쇠로 큰 다리를 놓는 중이지.'] },
        ],
        spots: [],
      },
      {
        id: 'tower', name: '파리 에펠탑 아래', short: '에펠탑 아래', zoom: 1.2, ground: 0.733, scale: 0.62, air: 'court', floor: 'dirt',
        sora: '우와, 다리 하나가 집채만 해.',
        // The stair in the east leg, three flights of it: people go up one after another.
        moving: [
          { kind: 'climb', id: 'up', srcs: ['climb-1', 'climb-2', 'climb-3', 'climb-4', 'climb-5', 'climb-6'],
            path: [[0.962, 0.566], [0.841, 0.379], [0.913, 0.354], [0.809, 0.195], [0.874, 0.161], [0.778, 0.015]],
            tall: 0.062, seconds: 42, step: 0.004 },
        ],
        people: [
          { id: 'down', pass: '아, 다리 아파. 그래도 좋았어!', show: 'press', pose: 'see-gasp', sora: '탑 위에서 신문을 찍어?!', memo: '탑 안에 신문사가 들어와 날마다 신문을 찍었단다. 오늘이 첫 호야.', name: '내려온 아가씨', x: 0.13, w: 106, h: 306, lines: ['탑 위에서 신문을 찍고 있어요!', '두 해 두 달 만에 다 지었대요.'] },
          { id: 'painter', pass: '어이, 내 그림 좀 보고 가오.', name: '화가', x: 0.27, w: 148, h: 314, lines: ['내 그림 보겠소? 탑은 붉은 갈색이지.', '흉물이라던 이들이 다 올라가더군.'] },
          { id: 'kid', pass: '우와아, 높다!', name: '올려다보는 아이', x: 0.38, w: 77, h: 199, lines: ['꼭대기가 구름에 닿을 것 같아!', '아빠가 나는 다음에 올라가래.'] },
          { id: 'photo', pass: '자, 여기 보시오!', name: '사진사', x: 0.68, w: 150, h: 320, lines: ['움직이지 마시오! 하나, 둘…', '탑이 커서 한 장에 다 안 들어가.'] },
          { id: 'puff', pass: '헉, 헉…', name: '숨 고르는 아저씨', x: 0.79, w: 151, h: 303, lines: ['헉, 헉… 1층만 갔다 왔네.', '위에서 보니 파리가 손바닥만 해.'] },
          { id: 'stairs', pass: '계단은 이쪽입니다!', name: '계단 안내원', x: 0.874, w: 120, h: 316, lines: ['엘리베이터는 아직이에요. 계단으로!', '1층까지 삼백 계단이 넘어요.'] },
        ],
        spots: [
          // Right under the middle of the arch, looking straight up.
          { id: 'under', from: 0.45, to: 0.56, sora: '우와… 다리가 후들거려.', memo: '쇠 조각 만팔천 개를 리벳으로 이어 세운 탑이란다.' },
        ],
      },
      {
        id: 'hall', name: '파리 만국박람회 기계관', short: '박람회 기계관', zoom: 1.3, ground: 0.664, scale: 0.66, air: 'works', floor: 'wood',
        sora: '쿵쿵쿵! 바퀴가 진짜 돌아가.',
        // The two flywheels, cut out of the picture itself (tools/walk-art.py disc), turn where they lie.
        moving: [
          { kind: 'spin', id: 'red', src: 'wheel-red', x: 0.2754, y: 0.5205, tall: 0.2139, rpm: 15 },
          { kind: 'spin', id: 'blue', src: 'wheel-blue', x: 0.6725, y: 0.5205, tall: 0.2139, rpm: 15 },
        ],
        people: [
          { id: 'reporter', pass: '어디 보자, 받아 적어야지.', name: '기자', x: 0.119, w: 106, h: 320, lines: ['기둥 하나 없이 이 넓이라니.', '쇠와 유리. 새 시대가 온 거요.'] },
          { id: 'engineer', pass: '손대지 마시오! 도는 중이오.', name: '기술자', x: 0.4, w: 166, h: 320, lines: ['이 바퀴가 벨트로 기계를 다 돌려.', '기름을 안 치면 금세 멈추지.'] },
          { id: 'ears', pass: '으아, 시끄러워!', name: '귀 막은 아이', x: 0.53, w: 107, h: 222, lines: ['너무 시끄러워! 귀가 멍멍해.', '(귀를 막고 고개를 젓는다)'] },
          { id: 'student', pass: '우와, 다 쇠로 만들었네.', name: '학생', x: 0.76, w: 122, h: 300, lines: ['에디슨이라는 미국 사람 거래요.', '전구도 그 사람이 만들었대요.'] },
          { id: 'queue', pass: '아이고, 줄이 안 줄어.', name: '줄 선 아주머니', x: 0.825, w: 121, h: 310, lines: ['한 시간째 줄이야. 그래도 들어야지.', '기계가 말을 한다니 믿어지니?'] },
          { id: 'phono', pass: '말하는 기계요! 보고 가시오.', show: 'phonograph', pose: 'see-peer', sora: '밀랍 통에 소리를 새겼구나!', name: '말하는 기계 지기', x: 0.92, w: 153, h: 317, sound: 'phonograph', lines: ['통 속에 사람 목소리가 들었소.', '관을 귀에 대 봐요. 노래가 나오지.'],
            try: { id: 'use-phono', verb: 'use', name: '말하는 기계', sora: '관에서 노래가 나와! 신기해.' } },
        ],
        spots: [],
      },
    ],
    errands: [
      { id: 'under', text: '탑 밑에서 올려다보고 다리가 후들거리는지 보렴.', at: ['under'] },
      { id: 'lift', text: '엘리베이터가 돈다던데 타 보렴.', at: ['stairs'] },
      { id: 'phono', text: '말하는 기계 소리를 들어 보렴.', at: ['phono'] },
    ],
    reply: '엘리베이터는 못 탔구나. 그래도 말하는 기계 소리는 들었네.',
  },
  // Three more in Paris's look (the user, 2026.10.8: "파리식으로 한양 포함해서 3개 더 만들어").
  // Hanyang in the autumn of 1446, when the new letters were given out. That a notice
  // was read aloud in the market street is made up. Looked up on 2026.10.8 and found so:
  // twenty-eight letters, given out in the ninth month of 1446, "a clever man learns them
  // before the morning is out, a dull one in ten days" (the gist of the book's afterword),
  // the ministers' one memorial against them (1444). Still from memory: the letters drawn
  // after the shapes of the mouth, the king's failing eyes, the bowl sundial of his reign.
  hunminjeongeum: {
    dir: 'hanyang', look: 'paper', talk: 'face',
    scenes: [
      {
        id: 'market', name: '한양 저잣거리', zoom: 1.3, ground: 0.674, scale: 0.66, air: 'market', floor: 'dirt',
        sora: '감이 주렁주렁! 시끌시끌해.',
        moving: [
          { kind: 'drift', id: 'by', src: 'crowd', from: 0, to: 1, foot: 0.67, tall: 0.17, wide: 0.4115, gap: 0.12, speed: 0.028, bob: 0.003 },
        ],
        people: [
          { id: 'cloth', pass: '무명이오, 고운 무명!', show: 'jongnu', pose: 'see-aha', sora: '집 밑으로 길이 지나가네!', memo: '밤에 종을 스물여덟 번 치면 성문이 닫혔단다. 새벽 서른세 번에 열렸지.', name: '포목 장수', x: 0.159, w: 141, h: 299, lines: ['저 종루 밑으로 길이 났지요.', '밤 종이 울리면 성문이 닫힌다오.'] },
          { id: 'pots', pass: '독 사려! 독 안도 구경하시오!', show: 'kimchi', pose: 'see-gasp', sora: '김치가 하얘! 고추가 없었구나.',
            // Looked up on 2026.10.8 (the user asked for the year and the way it came): the
            // first word of it here is in a book of 1614, which says it came from Japan; that
            // it came about the war of 1592 is the common account, and some dispute it.
            memo: '고추는 임진왜란(1592년) 무렵 일본을 거쳐 들어왔다고들 한단다. 본디는 바다 건너 아메리카의 열매야.', name: '옹기 장수', x: 0.3, w: 128, h: 289, lines: ['독 안을 보시오. 김치가 하얗지요?', '고추? 그런 건 들어 본 적 없소.'],
            try: { id: 'eat-kimchi', verb: 'eat', name: '하얀 김치', face: 'yum', sora: '안 매워! 시원하고 짭짤해.' } },
          { id: 'reader', pass: '방이 붙었소! 다들 들으시오.', name: '방 읽어 주는 선비', x: 0.43, w: 141, h: 312, lines: ['새 글자 스물여덟 자가 나왔다오.', '슬기로우면 아침나절에 배운다오.'],
            try: { id: 'wear-gat', verb: 'wear', name: '갓과 도포', outfit: 'gat', sora: '어험! 선비가 된 것 같아.' } },
          { id: 'woodboy', pass: '나무 사려! 장작이오!', name: '나무꾼 소년', x: 0.52, w: 119, h: 225, lines: ['저게 글자야? 그림 같은데.', '가, 나, 다… 나도 따라 했어!'] },
          { id: 'tteok', pass: '떡 사려, 따끈한 떡!', name: '떡 파는 할머니', x: 0.77, w: 109, h: 257, lines: ['시루떡 따끈해요. 하나 드시우.', '열흘이면 배운다니 나도 해 볼까.'],
            try: { id: 'eat-tteok', verb: 'eat', name: '떡', face: 'yum', sora: '쫀득쫀득! 자꾸 손이 가.' } },
          { id: 'water', pass: '아이고, 물동이 무거워라.', name: '물동이 인 아낙', x: 0.881, w: 110, h: 320, lines: ['친정에 편지 한 장 못 썼다우.', '이제는 쓸 수 있으려나.'] },
        ],
        spots: [],
      },
      {
        id: 'gate', name: '한양 광화문 앞', short: '광화문 앞', zoom: 1.3, ground: 0.703, scale: 0.78, air: 'court', floor: 'dirt',
        sora: '문이 엄청 커! 지붕이 두 층이야.',
        moving: [
          { kind: 'drift', id: 'parade', src: 'parade', from: 0, to: 1, foot: 0.7, tall: 0.2, wide: 0.3183, gap: 0.55, speed: 0.032, bob: 0.003 },
        ],
        people: [
          { id: 'farmer', flip: true, pass: '허어, 문이 산만 하구먼.', name: '시골 농부', x: 0.14, w: 116, h: 246, lines: ['대궐이 이리 큰 줄 몰랐소.', '억울한 일을 글로 적을 수 있다던데.'] },
          { id: 'bearer', pass: '영차, 영차!', name: '가마꾼', x: 0.3, w: 113, h: 253, lines: ['아이고 어깨야. 대감은 무겁다니까.', '글자? 가마 멜 때는 쓸 데 없지.'] },
          { id: 'guard', pass: '물렀거라!', name: '수문장', x: 0.42, w: 123, h: 320, lines: ['멈추시오. 여기는 대궐 문이오.', '광화문이오. 스무 해 전에 얻은 이름이지.'] },
          { id: 'elder', pass: '에헴!', name: '늙은 대신', x: 0.58, w: 107, h: 267, lines: ['한문이 있는데 새 글자가 웬 말이오.', '…허나 임금의 뜻이 굳으시오.'] },
          { id: 'official', pass: '새 글자요. 한번 보고 가시오.', show: 'letters', pose: 'see-aha', sora: '지금은 안 쓰는 글자가 넷이구나!', name: '젊은 관리', x: 0.7, w: 115, h: 263, lines: ['새 글자 스물여덟 자요. 보시오.', '소리 나는 대로 적으니 참 쉽소.'] },
          { id: 'girl', pass: '늦었다, 늦었어!', name: '심부름 가는 소녀', x: 0.86, w: 101, h: 230, lines: ['마님 심부름 가요. 바빠요!', '언니가 새 글자를 가르쳐 준댔어.'] },
        ],
        spots: [],
      },
      {
        id: 'hall', name: '경복궁 집현전 뜰', short: '집현전 뜰', zoom: 1.2, ground: 0.762, scale: 0.64, air: 'palace',
        sora: '책이 마당 가득이야. 조용해.',
        moving: [
          { kind: 'drift', id: 'books', src: 'scholars', from: 0, to: 1, foot: 0.758, tall: 0.17, wide: 0.282, gap: 0.6, speed: 0.026, bob: 0.003 },
        ],
        people: [
          { id: 'books', pass: '볕이 좋구먼.', name: '책 말리는 아저씨', x: 0.2, w: 110, h: 311, lines: ['볕 좋은 날 책을 말려야 하오.', '좀이 슬면 큰일이라오.'] },
          { id: 'sleepy', pass: '하암… 졸려라.', name: '졸린 학사', x: 0.32, w: 125, h: 313, lines: ['밤새 풀이를 썼소. 하암…', '임금님이 더 늦게 주무신다오.'] },
          { id: 'scholar', pass: '흠, 이 소리는 어찌 적을꼬.', name: '집현전 학사', x: 0.41, w: 132, h: 320, lines: ['글자마다 입 모양을 본떴다오.', '이 글자는 혀뿌리가 막힌 모양이지.'] },
          { id: 'tea', pass: '차 식어요. 비켜 주세요.', show: 'ongnu', pose: 'see-gasp', sora: '인형이 스스로 종을 쳐?!', memo: '종이로 만든 산을 금빛 해가 하루 한 바퀴 돌았단다. 때마다 인형이 종을 쳤지.', name: '차 나르는 궁녀', x: 0.66, w: 111, h: 301, lines: ['흠경각에는 인형 시계가 있답니다.', '종이 산을 금빛 해가 돌아요.'] },
          { id: 'child', pass: '가, 나, 다, 라…', name: '글자 쓰는 아이', x: 0.75, w: 83, h: 204, lines: ['이거 봐! 내 이름이야. 내가 썼어!', '어제 배웠는데 벌써 다 써.'],
            try: { id: 'use-letters', verb: 'use', name: '새 글자', sora: 'ㅅ, ㅗ, ㄹ, ㅏ… 소라! 썼다!' } },
          { id: 'sundial', pass: '해시계 구경하고 가시오.', name: '해시계 보는 관원', x: 0.87, w: 129, h: 309, lines: ['혜정교 것과 같은 해시계라오.', '글 몰라도 그림으로 때를 알지.'],
            try: { id: 'use-sundial', verb: 'use', name: '해시계', sora: '그림자 끝이 지금 시각이야!' } },
        ],
        spots: [
          // The king at his books, deep in the middle bay: seen, not spoken to. She stands a little to his right, so as not to hide him.
          { id: 'sejong', from: 0.545, to: 0.605, memo: '저 안에 앉은 분이 세종대왕님이란다. 백성이 쉽게 쓰라고 만드셨지.' },
        ],
      },
    ],
    errands: [
      { id: 'news', text: '저잣거리에서 새 글자 소문을 들어 보렴.', at: ['reader'] },
      { id: 'king', text: '임금님을 멀리서라도 뵙고 오렴.', at: ['sejong'] },
      { id: 'name', text: '제 이름을 처음 써 본 사람을 찾아보렴.', at: ['child'] },
    ],
    reply: '제 이름을 처음 쓴 아이를 만났구나. 그 글자로 이 수첩을 쓴단다.',
  },
  // San Francisco, 27 May 1937: the bridge was opened to people on foot for a day. Looked
  // up on 2026.10.8 and found so: the gates at six, about two hundred thousand, people
  // vying to be first across in some odd way, a sprinter the first across the whole span.
  // The toll is given as 25 cents by some and 5 by a paper of the day, so the toll man
  // names no sum. Still from memory: the first on skates and the first walking backward,
  // the net that saved nineteen, four years of building, 67 m from the water, 1,280 m
  // between the towers.
  goldenGate: {
    dir: 'sf', look: 'paper', talk: 'face',
    scenes: [
      {
        id: 'plaza', name: '샌프란시스코 금문교 어귀', short: '금문교 어귀', zoom: 1.3, ground: 0.735, scale: 0.66, air: 'street',
        sora: '다리가 빨개! 엄청 길다.',
        moving: [
          { kind: 'drift', id: 'in', src: 'crowd', from: 0, to: 1, foot: 0.731, tall: 0.17, wide: 0.396, gap: 0.05, speed: 0.03, bob: 0.003 },
        ],
        people: [
          { id: 'hotdog', pass: '핫도그! 따끈한 핫도그 보고 가쇼!', name: '핫도그 장수', x: 0.159, w: 119, h: 320, lines: ['핫도그요! 오늘 오만 개는 나가겠소.', '다리 구경엔 핫도그가 딱이지.'],
            try: { id: 'eat-hotdog', verb: 'eat', name: '핫도그', face: 'yum', sora: '겨자가 톡 쏴! 맛있다.' } },
          { id: 'sleepy', pass: '하암… 드디어 열렸네.', name: '밤새 기다린 청년', x: 0.224, w: 120, h: 320, lines: ['어젯밤부터 줄 섰어요. 하암…', '맨 먼저 건너고 싶었거든요.'] },
          { id: 'toll', pass: '한 줄로! 한 줄로 서요!', name: '요금 받는 사람', x: 0.36, w: 101, h: 311, lines: ['걸어서 건너는 값은 동전 한 닢이오.', '오늘은 사람만! 차는 내일부터요.'] },
          { id: 'scout', pass: '길 잃은 분 안 계세요?', name: '보이스카우트 소년', x: 0.52, w: 112, h: 249, lines: ['아침 여섯 시에 문이 열렸어요.', '길 잃은 아이를 찾아 주는 중이에요.'] },
          { id: 'badge', pass: '기념 배지 있어요!', name: '기념품 아주머니', x: 0.74, w: 120, h: 301, lines: ['기념 배지 사세요! 오늘뿐이에요.', '손주한테 줄 거라고들 사 가요.'],
            try: { id: 'wear-fedora', verb: 'wear', name: '중절모', outfit: 'fedora', sora: '다들 모자를 썼네. 나도!' } },
          { id: 'camera', pass: '자, 찍습니다! 치즈!', show: 'stilts', pose: 'see-gasp', sora: '죽마로 다리를 건넌다고?!', memo: '호텔에서 일하던 사람이 죽마를 타고 건너갔다 돌아왔단다.', name: '사진기 든 아가씨', x: 0.88, w: 100, h: 303, lines: ['방금 찍었어요. 죽마 탄 사람!', '저마다 처음이 되려고 야단이에요.'] },
        ],
        spots: [],
      },
      {
        id: 'deck', name: '샌프란시스코 금문교 위', short: '금문교 위', zoom: 1.2, ground: 0.8, scale: 0.64, air: 'bridge',
        sora: '차가 없으니까 운동장 같아.',
        // The crowd goes over on foot, and now and then those who cross some odd way.
        moving: [
          { kind: 'drift', id: 'over', src: 'crowd', from: 0, to: 1, foot: 0.794, tall: 0.17, wide: 0.396, gap: 0.08, speed: 0.03, bob: 0.003 },
          { kind: 'drift', id: 'odd', src: 'stunts', from: 0, to: 1, foot: 0.8, tall: 0.17, wide: 0.304, gap: 0.9, speed: 0.06, bob: 0.004 },
        ],
        people: [
          { id: 'mother', pass: '바람이 시원하네, 아가.', name: '유모차 미는 어머니', x: 0.126, w: 214, h: 307, lines: ['아기도 오늘을 기억하면 좋겠어요.', '배 타고 건너던 길을 걸어서 가네.'] },
          { id: 'grandpa', pass: '허허, 살다 보니 별일이야.', name: '할아버지', x: 0.25, w: 121, h: 319, lines: ['이 물목에 다리는 못 놓는다 했지.', '살아서 걸어 건널 줄이야.'] },
          { id: 'worker', pass: '어이, 그물 구경해 볼 테요?', show: 'net', pose: 'see-gasp', sora: '다리 밑에 그물을 쳤구나!', name: '다리 일꾼', x: 0.42, w: 139, h: 320, lines: ['짓는 동안 밑에 그물을 쳤소. 보시오.', '그 그물에 떨어져 열아홉이 살았소.'] },
          { id: 'skate', pass: '비켜요, 비켜! 지나가요!', name: '롤러스케이트 소녀', x: 0.57, w: 163, h: 249, lines: ['롤러스케이트로 건너는 중이야!', '끝까지 가면 내가 일등일걸.'] },
          { id: 'backward', pass: '뒤로 가요, 뒤로!', name: '뒤로 걷는 남자', x: 0.71, w: 115, h: 315, lines: ['뒤로 걸어 건넌 건 내가 처음이오.', '신문에 나려면 별나야지.'] },
          { id: 'harmonica', pass: '뿌우, 뿌!', name: '하모니카 소년', x: 0.86, w: 97, h: 246, lines: ['(하모니카를 분다) 뿌우 뿌!', '다리 건너며 한 곡 다 불 거야.'] },
        ],
        spots: [],
      },
      {
        id: 'mid', name: '샌프란시스코 금문교 한가운데', short: '금문교 한가운데', zoom: 1.25, ground: 0.755, scale: 0.74, air: 'bridge',
        sora: '바람이 세! 바다가 저 밑이야.',
        moving: [
          { kind: 'drift', id: 'east', src: 'crowd', from: 0, to: 1, foot: 0.74, tall: 0.16, wide: 0.373, gap: 0.3, speed: -0.025, bob: 0.003, flip: true },
          { kind: 'drift', id: 'west', src: 'crowd', from: 0, to: 1, foot: 0.751, tall: 0.17, wide: 0.396, gap: 0.2, speed: 0.03, bob: 0.003 },
        ],
        people: [
          { id: 'runner', pass: '헉헉, 조금만 더!', name: '달리기 선수', x: 0.123, w: 98, h: 231, lines: ['헉헉. 끝에서 끝까지 뛰어왔어요.', '탑 사이가 천이백팔십 미터래요.'] },
          { id: 'hat', pass: '어머, 내 모자!', name: '모자 잡는 아가씨', x: 0.26, w: 121, h: 248, lines: ['앗, 모자! 바람이 너무 세요.', '다리가 조금씩 흔들리는 것 같아요.'] },
          { id: 'scope', pass: '우와, 다 보인다!', name: '멀리 보는 소년', x: 0.39, w: 90, h: 204, lines: ['저기 섬이 감옥이래. 알카트라즈.', '배가 다리 밑으로 지나가!'],
            try: { id: 'use-scope', verb: 'use', name: '망원경', sora: '저 섬에 건물이 보여!', memo: '저 섬은 알카트라즈란다. 그때는 감옥이었지.' } },
          { id: 'painter', pass: '이 다리 색 얘기 들어 봤소?', show: 'stripes', pose: 'see-aha', sora: '줄무늬 다리가 될 뻔했구나!', name: '칠장이', x: 0.64, w: 113, h: 268, lines: ['해군은 노란 줄무늬를 하자 했소.', '이 주황은 안개 속에서도 보이라고.'] },
          { id: 'sailor', pass: '바람 좋다!', name: '수병', x: 0.77, w: 122, h: 261, lines: ['군함이 이 밑으로 지나다닌다오.', '물에서 다리까지 예순일곱 미터.'] },
          { id: 'piggy', pass: '꽉 잡아라, 얘야.', show: 'cable', pose: 'see-aha', sora: '줄 하나가 철사 다발이었구나!', memo: '철사가 이만 칠천 가닥이란다. 다 이으면 지구를 세 바퀴 돌지.', name: '목말 태운 아버지', x: 0.9, w: 106, h: 320, lines: ['저 굵은 줄 속이 다 철사란다.', '이십만 명이 건넜다니 대단하지.'] },
        ],
        spots: [
          { id: 'middle', from: 0.47, to: 0.57, sora: '우와… 발밑이 다 바다야.', memo: '그때 세상에서 가장 긴 매달린 다리였단다.' },
        ],
      },
    ],
    errands: [
      { id: 'toll', text: '다리 건너는 값이 얼마인지 물어보렴.', at: ['toll'] },
      { id: 'skate', text: '바퀴 달린 신을 신고 건넌 아이가 있다던데.', at: ['skate'] },
      { id: 'middle', text: '다리 한가운데서 바다를 내려다보렴.', at: ['middle'] },
    ],
    reply: '동전 한 닢에 바다 위를 걸었구나. 나도 한번 걸어 보고 싶네.',
  },
  // Tokyo, 1 October 1964: the first of the fast trains left at six. Looked up on
  // 2026.10.8 and found so: the day, six in the morning (one train from each end), four
  // hours to Osaka, 210 km an hour. Still from memory: the train's number, the gilt ball
  // and tape at the leaving, six and a half hours before, the speed dial in the buffet
  // car, the Games nine days after.
  shinkansen: {
    // In the manner of Nintendo's first 8-bit games since 2026.10.9 (the user, of four tries:
    // "1"): pixels again, the sky in the pictures, and people speaking in balloons (their
    // faces in a panel went with the flat look this place had).
    dir: 'tokyo',
    scenes: [
      {
        id: 'front', name: '도쿄역 앞', zoom: 1.3, ground: 0.765, scale: 0.66, air: 'street',
        sora: '벽돌 역이다! 깃발이 많아.',
        moving: [
          { kind: 'drift', id: 'in', src: 'crowd', from: 0, to: 1, foot: 0.745, tall: 0.17, wide: 0.451, gap: 0.1, speed: 0.032, bob: 0.003 },
        ],
        people: [
          { id: 'news', pass: '조간이오, 조간!', show: 'postcards', pose: 'see-gasp', sora: '엽서가 산더미야!', memo: '기차 이름을 지어 보낸 엽서가 오십육만 통이었단다. 일등이 히카리, 빛이야.', name: '신문 파는 아저씨', x: 0.159, w: 158, h: 320, lines: ['기차 이름은 온 나라가 지었소.', '아흐레 뒤엔 올림픽이오. 바쁘다!'] },
          { id: 'taxi', pass: '택시 타실 분!', name: '택시 기사', x: 0.3, w: 115, h: 291, lines: ['역까지 손님이 끊이질 않아요.', '오사카를 당일로 다녀온다니.'] },
          { id: 'salary', pass: '어이쿠, 늦겠네.', name: '회사원', x: 0.56, w: 130, h: 314, lines: ['아침에 가서 저녁에 돌아온다네.', '전에는 여섯 시간 반이 걸렸지.'] },
          // Spoken to, she opens a box and shows what is in it (the user, 2026.10.8: "아주머니가
          // 도시락을 열어서 내용물을 보여주는걸로 하자"). What is in it was looked up on 2026.10.8
          // (the user: "진짜지?"): the 150-yen lunch sold on the new trains in 1964, as it was
          // made again in 2002, had white rice with one pickled plum, fried white fish, beef
          // stewed dark, rolled egg and fish cake (kfm.sakura.ne.jp/ekiben, as a search
          // told it; the page itself came through garbled). The stewed roots, the yellow
          // pickle and the thin wooden box are from memory.
          { id: 'bento', pass: '도시락 구경하고 가세요!', name: '도시락 아주머니', x: 0.72, w: 140, h: 287, lines: ['차 안에서 먹는 도시락이에요.', '역에서 파니까 에키벤이라 해요.'],
            try: { id: 'eat-ekiben', verb: 'eat', name: '기차 도시락', face: 'yum', sora: '식었는데도 맛있어!' } },
          // The one who asks. She stays where she is and waits (the user, 2026.10.9, of her
          // standing on the platform all at once when the flowers were handed over: "이 아가씨는 원래
          // 있던 자리에서 기다리라고 해").
          { id: 'flowers0', pass: '아이, 떨려라.', name: '꽃다발 든 아가씨', x: 0.8, w: 124, h: 308, lines: ['첫 기차에 드릴 꽃다발이에요.', '떨려서 꽃이 다 흔들려요.'] },
          { id: 'tourist', pass: '와, 역이 정말 크네요.', name: '먼 데서 온 여행자', x: 0.88, w: 133, h: 316, lines: ['올림픽 보러 왔어요. 기차도 타요!', '시속 210km? 믿을 수 없어요.'] },
        ],
        spots: [],
      },
      {
        id: 'platform', name: '도쿄역 승강장', zoom: 1.3, ground: 0.83, scale: 0.76, air: 'station',
        sora: '우와, 진짜 온다! 코가 둥글어.',
        // The train runs along the track from one end of the platform to the other, again and again.
        moving: [
          { kind: 'drift', id: 'train', src: 'train', from: 0, to: 1, foot: 0.752, tall: 0.2, wide: 0.759, gap: 2.5, speed: 0.16, bob: 0 },
        ],
        people: [
          { id: 'fan', pass: '우와, 진짜 왔다! 코 좀 봐!', show: 'nose', pose: 'see-wow', sora: '코가 등불처럼 빛나!', memo: '코가 반투명이라 불빛이 새어 나왔단다. 속에는 연결 고리가 들어 있지.', name: '기차 좋아하는 소년', x: 0.12, w: 121, h: 243, lines: ['꿈의 초특급이다! 코가 비행기 같아.', '새벽 세 시에 일어나서 왔어.'] },
          { id: 'reporter', pass: '하나, 둘, 마이크 시험.', name: '방송 기자', x: 0.26, w: 112, h: 267, lines: ['여기는 도쿄역, 역사적인 아침입니다.', '세계에서 가장 빠른 열차입니다!'] },
          // (She stood before the station until 2026.10.9: she has the place the woman with the flowers had here.)
          { id: 'student', pass: '와, 드디어 오늘이야.', name: '여학생', x: 0.4, w: 99, h: 244, lines: ['수학여행은 저 기차로 가고 싶어.', '창밖이 휙휙 지나간대요.'] },
          { id: 'driver', pass: '출발 준비 완료!', name: '기관사', x: 0.52, w: 114, h: 269, lines: ['시속 210km입니다. 손이 떨려요.', '선로가 눈앞으로 빨려 들어와요.'] },
          { id: 'master', pass: '물러서 주십시오!', name: '역장', x: 0.66, w: 120, h: 320, lines: ['여섯 시 정각, 히카리 1호 출발!', '일 초도 늦으면 안 됩니다.'] },
          { id: 'banzai', pass: '만세! 만세!', name: '신이 난 회사원', x: 0.82, w: 147, h: 266, lines: ['테이프 끊는 걸 봤어! 박수가 터졌어!', '만세! 우리가 해냈다고!'] },
        ],
        spots: [],
      },
      {
        id: 'car', name: '달리는 신칸센 안', zoom: 1.3, ground: 0.72, scale: 0.66, air: 'train', floor: 'wood',
        sora: '안 흔들려! 창밖이 휙휙 가.',
        // The land goes by behind the picture, seen through its six windows.
        moving: [
          { kind: 'drift', id: 'land', src: 'view', from: 0.13, to: 0.87, foot: 0.50, tall: 0.24, wide: 0.48, gap: 0, speed: -0.09, bob: 0, behind: true },
        ],
        people: [
          { id: 'conductor', pass: '실례하겠습니다.', name: '차장', x: 0.168, w: 158, h: 315, lines: ['표 좀 보여 주시겠습니까.', '신오사카까지 네 시간입니다.'] },
          { id: 'dozer', pass: '쿨… 쿨…', name: '조는 대학생', x: 0.24, w: 133, h: 309, lines: ['…음냐. 벌써 시즈오카예요?', '너무 조용해서 잠이 와요.'],
            try: { id: 'wear-ivy', verb: 'wear', name: '아이비룩', outfit: 'ivy', sora: '단추가 금빛이야. 멋쟁이다!', memo: '그 무렵 도쿄 젊은이들 사이에 유행한 대학생 차림이란다.' } },
          { id: 'eater', pass: '우물우물.', name: '도시락 먹는 아저씨', x: 0.38, w: 160, h: 311, lines: ['빨라서 도시락 먹을 틈이 없네.', '(우물우물) 그래도 맛은 좋아.'] },
          { id: 'kid', pass: '우와, 빠르다!', show: 'cup', pose: 'see-aha', sora: '봉투에 물을 받아 마시네!', memo: '이 기차에 맞춰 만든 종이컵이란다. 납작하게 접혀 있었지.', name: '신난 꼬마', x: 0.52, w: 146, h: 214, lines: ['물은 봉투에 받아 마시는 거야!', '나 커서 기관사 될 거야!'] },
          { id: 'granny', pass: '아이고, 벌써 여기야.', name: '창가의 할머니', x: 0.68, w: 181, h: 280, lines: ['저기 봐, 후지산이야! 벌써 여기야.', '옛날엔 걸어서 보름 길이었단다.'] },
          { id: 'buffet', pass: '어서 오세요! 속도계 보고 가세요.', show: 'speedometer', pose: 'see-gasp', sora: '1964년에 시속 210km?!', name: '뷔페 칸 종업원', x: 0.9, w: 136, h: 320, lines: ['속도계 보세요. 지금 시속 210km!', '커피가 안 쏟아지는 게 자랑이죠.'],
            try: { id: 'use-speed', verb: 'use', name: '속도계', sora: '바늘이 이백십에서 안 내려와!' } },
        ],
        spots: [],
      },
    ],
    // "Twenty minutes to go" (core/tale.js): a young woman before the station gives her the
    // flowers and a word for the driver of the first train; on the platform the station
    // master turns her away; the boy who has watched since three tells her when the driver
    // will stand at the door; she hands them over, choosing what to say; and the driver asks
    // her to ride and look at the speed dial in the buffet car. Told so after
    // the user had tried the first telling on 2026.10.9 and said of its end, which was talk
    // with the woman and no more: "아가씨한테 꽃과 말을 전달받고, 기관사한테 가서 전달하고,
    // 이러는게 미션 아님?". What each one says last names where to go next, so that the slip
    // need not be read ("저 가이드가 없으면, 게임을 제대로 못 하고 헤매게 되네").
    // Looked up on 2026.10.9 and found so: the train stood at platform 19 from 05:40 and
    // the leaving was held there; it left at six and came in at ten to the minute; the line
    // was five and a half years in the building (ground broken 20 April 1959).
    // Made up: the woman, her father, the flowers, the master turning her away, the boy's
    // word, what the driver says. She goes on through the scenes and is never sent back.
    tale: {
      ask: '이 꽃은 누구에게 가는 걸까?',
      steps: [
        {
          who: 'flowers0', goal: '도쿄역 앞의 꽃다발 든 아가씨에게 가 보렴.', holds: '꽃다발: 아가씨가 들고 있음',
          lines: ['저기, 부탁 하나만 들어줄래요?', '이 꽃을 첫 기차 기관사님께 드리고 싶어요.', '아버지가 다섯 해 반 동안 이 철길을 놓으셨거든요.', '그런데 사람이 너무 많아서 못 들어가겠어요.'],
          offer: { ask: '아가씨의 꽃을 전해 줄까?', label: '내가 전해 줄게요' },
          errand: 'took',
        },
        {
          who: 'driver', goal: '도쿄역 승강장의 기관사에게 꽃을 전하렴.', holds: '꽃다발: 소라가 들고 있음',
          lines: [{ by: 'master', text: '물러서 주십시오! 출발 이십 분 전이오.' }, { by: 'master', text: '기관사는 점검 중이라 아무도 못 만납니다.' }],
          sora: '꽃만 전하면 되는데… 어? 저 소년이 불러!',
        },
        {
          who: 'fan', call: '누나, 이리 와 봐! 방법이 있어!', goal: '기차 좋아하는 소년이 부른다. 가 보렴.', holds: '꽃다발: 소라가 들고 있음',
          lines: ['새벽 세 시부터 여기서 다 봤거든.', '점검이 끝나면 기관사님이 문 앞에 잠깐 서.', '봐, 지금이야! 얼른 가!'],
          sora: '지금이래! 기관사님께 가자!',
        },
        {
          who: 'driver', goal: '지금이야! 기관사에게 꽃을 전하렴.', holds: '꽃다발: 소라가 들고 있음',
          lines: ['점검 끝. 응? 나한테 볼일이 있니?'],
          choice: {
            ask: '꽃을 건네며 뭐라고 할까?',
            options: [
              { id: 'E1', label: '아가씨의 말만 전한다', sora: '"아버지 몫까지 잘 달려 주세요", 래요.', says: '…그 철길이군요. 일 초도 안 늦겠습니다.' },
              { id: 'E2', label: '내 말도 보탠다', sora: '잘 달려 주세요! 이 기차, 육십 년 뒤에도 달려요!', says: '하하, 육십 년이라. 첫날부터 잘 달려야겠군.' },
            ],
          },
          // What follows the handing over: he asks a thing of her in turn, and the train is sent off.
          after: [{ who: 'driver', line: '타고 가 보렴. 뷔페 칸 속도계가 210인지 봐 주겠니?' }, { who: 'master', line: '여섯 시 정각, 히카리 1호 출발! 어서 타요!' }],
          sora: '탈래요! 속도계는 뷔페 칸이랬지?',
          errand: 'gave',
        },
        {
          // The tale does not end on the platform: the train is to be ridden (the user,
          // 2026.10.9: "신칸센 안에 안 들어가도 시나리오 끝나잖아. 속도계 보는 미션도 같이 넣어").
          who: 'buffet', show: true, goal: '달리는 신칸센에 타서 뷔페 칸의 속도계를 보렴.',
          lines: ['어서 오세요! 기관사님 부탁이라고요?', '속도계 보세요. 바늘이 딱 210이죠!'],
          sora: '진짜 210이야! 기관사님, 약속 지켰어요!',
          errand: 'speed',
        },
      ],
      // What those with a part say when it is not their turn.
      asides: [
        { who: 'flowers0', when: ['S1', 'S2', 'S3'], lines: ['"아버지 몫까지 잘 달려 주세요" 하고 전해 줘요.', '기관사님은 19번 승강장에 계세요. 오른쪽이에요.'] },
        { who: 'flowers0', when: ['S4', 'S5'], lines: ['꽃을 전해 주셨군요! 정말 고마워요.', '아버지께도 꼭 말씀드릴게요.'] },
      ],
      done: '꽃을 전하고, 시속 210km를 눈으로 보았다.',
    },
    // The tale's three marks in the notebook. Nobody does them by being spoken to (`at` is
    // empty): the tale does (main.js, a step's `errand`).
    errands: [
      { id: 'took', text: '아가씨의 꽃을 받는다.', at: [] },
      { id: 'gave', text: '기관사에게 꽃을 전한다.', at: [] },
      { id: 'speed', text: '달리는 기차에서 속도계를 본다.', at: [] },
    ],
    reply: '그 기차는 열 시 정각에 오사카에 닿았단다. 그날 달린 예순 편이 모두 제시각이었지.',
  },
  // Constantinople, 27 December 537: the new Hagia Sophia is opened. Carved as an ivory
  // panel of that century (the user, 2026.10.9, of five tries: "콘스탄티노플 4번으로 가자"):
  // one colour for the walls, and the people with more of their old paint left on them.
  // Looked up on 2026.10.9 and found so: dedicated on this day, five years after it was
  // begun in 532; built by Anthemius and Isidore, men of mathematics and machines; the round
  // dome carried on a square by four curved triangles; its vaults all gold mosaic with no
  // figures; the walls of marble slabs sawn thin and opened like a book, brought from many
  // lands; the dome fell after the earthquake of 558 and was raised again. By tradition the
  // emperor went in before the patriarch. From memory: gold leaf between two layers of
  // glass, the lamps hung in rings, the windows round the foot of the first dome.
  // Made up: the errand of the gold pieces, the guard, the deacon and the side door.
  hagiaSophia: {
    dir: 'byz537', look: 'paper', pale: true,
    scenes: [
      {
        id: 'square', name: '동로마 콘스탄티노플 성당 앞 광장', short: '성당 앞 광장', zoom: 1.06, ground: 0.8, scale: 0.62, air: 'court', floor: 'dirt',
        sora: '우와, 지붕이 산처럼 커!',
        people: [
          { id: 'candle', pass: '초 사세요, 새 성당 초!', name: '초 파는 할머니', x: 0.18, w: 125, h: 301, lines: ['오늘 새 성당이 문을 여는 날이란다.', '초 하나 켜 보련?'],
            try: { id: 'use-candle', verb: 'use', name: '초', sora: '후, 안 꺼지게 조심조심.' } },
          { id: 'mason', pass: '깡, 깡. 다 됐다, 다 됐어.', show: 'tesserae', pose: 'see-gasp', sora: '유리 속에 금이 들었어!', memo: '얇은 유리 두 겹 사이에 금박을 끼운 조각이란다. 그걸 지붕 가득 붙였지.', name: '석공', x: 0.27, w: 121, h: 303, lines: ['돌은 내가 깎고, 금빛은 저 조각이 낸단다.', '손톱만 한 조각을 지붕 가득 붙였지.'] },
          { id: 'porter', pass: '영차! 마지막 기둥이다.', name: '기둥 나르는 일꾼', x: 0.37, w: 153, h: 307, lines: ['이 돌기둥은 바다 건너에서 왔어.', '굴림대 없이는 꿈쩍도 안 해.'] },
          { id: 'pilgrim', pass: '세상에, 저 지붕 좀 봐.', name: '먼 데서 온 순례자', x: 0.47, w: 134, h: 320, lines: ['먼 시골에서 걸어서 왔단다.', '저렇게 큰 둥근 지붕은 처음 봐.'] },
          { id: 'child', pass: '우와, 하늘만큼 커!', name: '구경 나온 아이', x: 0.56, w: 94, h: 239, lines: ['지붕이 꼭 뒤집은 그릇 같아.', '안은 금빛이래. 보고 싶다!'] },
          { id: 'glass', pass: '반짝반짝, 잘 구워졌군.', name: '유리 굽는 장인', x: 0.67, w: 115, h: 313, lines: ['유리 사이에 금을 끼워 굽는단다.', '그걸 잘게 쪼개 벽에 붙이지.'] },
          { id: 'baker', pass: '갓 구운 빵이오!', name: '빵 장수', x: 0.8, w: 175, h: 301, lines: ['일꾼들이 새벽부터 줄을 섰지.', '고리 빵 하나 먹어 보련?'],
            try: { id: 'eat-ringbread', verb: 'eat', name: '고리 빵', face: 'yum', sora: '쫄깃쫄깃하고 따뜻해!' } },
        ],
        spots: [],
      },
      {
        id: 'narthex', name: '동로마 콘스탄티노플 성당 문간', short: '성당 문간', zoom: 1.06, ground: 0.8, scale: 0.66, air: 'hush', floor: 'wood',
        sora: '문이 엄청 커! 다 닫혀 있네.',
        people: [
          { id: 'oiler', pass: '졸졸졸, 한 방울도 안 흘려.', name: '등잔에 기름 붓는 일꾼', x: 0.18, w: 113, h: 271, lines: ['등잔마다 기름을 채우는 중이야.', '밤에도 환하게 밝힐 거란다.'] },
          { id: 'singer', pass: '아아아, 목이 잘 풀렸다.', name: '성가대 소년', x: 0.28, w: 80, h: 238, lines: ['오늘 처음으로 여기서 노래해.', '소리가 지붕까지 올라갔다 내려와.'] },
          { id: 'lady', pass: '어머, 귀여운 아이구나.', name: '귀족 부인', x: 0.38, w: 88, h: 274, lines: ['폐하를 기다리는 중이란다.', '우리 딸 나들이옷이 맞겠구나. 입어 보련?'],
            try: { id: 'wear-byz', verb: 'wear', name: '동로마 나들이옷', outfit: 'byz', sora: '망토가 어깨에서 찰랑거려!', memo: '어깨에서 핀으로 여미는 망토는 동로마 사람들의 나들이옷이란다.' } },
          { id: 'guard', pass: '물러서라. 폐하의 문이다.', name: '황제의 근위병', x: 0.5, w: 114, h: 320, lines: ['이 문은 폐하만 드나드신다.', '나는 여기서 꼼짝 않는다.'] },
          { id: 'polisher', pass: '쓱쓱, 거울 같아졌군.', show: 'marble', pose: 'see-aha', sora: '무늬가 양쪽이 똑같아!', memo: '돌 한 덩이를 얇게 켜서 책처럼 펼쳐 붙였단다. 그래서 무늬가 마주 보지.', name: '대리석 닦는 장인', x: 0.64, w: 110, h: 270, lines: ['이 돌판의 무늬를 가만히 보렴.', '한 덩이를 켜서 책처럼 펼친 거란다.'] },
          { id: 'scribe', pass: '오늘 날짜를 적어야지.', name: '받아 적는 서기', x: 0.75, w: 92, h: 262, lines: ['오늘 일을 빠짐없이 적는단다.', '훗날 사람들이 읽을 테니까.'] },
          { id: 'deacon', pass: '향이 잘 타는구나.', name: '향로 든 부제', x: 0.85, w: 110, h: 274, lines: ['향 연기가 위로 곧게 올라가지.', '오늘은 다들 마음이 바쁘단다.'] },
        ],
        spots: [],
      },
      {
        id: 'nave', name: '동로마 콘스탄티노플 돔 아래', short: '돔 아래', zoom: 1.06, ground: 0.8, scale: 0.78, air: 'hush', floor: 'wood',
        sora: '안이 이렇게 넓어? 목이 아파.',
        people: [
          { id: 'carpenter', pass: '비계를 걷어야 하는데.', name: '비계 푸는 목수', x: 0.19, w: 92, h: 269, lines: ['다섯 해 만에 다 지었단다.', '마지막 한 줌이 모자라 비계를 못 걷어.'] },
          { id: 'lighter', pass: '하나, 둘, 불 들어간다.', show: 'lamps', pose: 'see-wow', sora: '등잔이 고리에 조르르!', memo: '기름 등잔을 고리에 여럿 꽂아 높이 매달았단다.', name: '등잔 켜는 사람', x: 0.31, w: 75, h: 320, lines: ['고리 하나에 등잔이 여럿이란다.', '긴 장대로 하나씩 불을 붙이지.'] },
          { id: 'emperor', pass: '다 지었도다!', name: '황제 유스티니아누스', x: 0.44, w: 103, h: 248, lines: ['다섯 해 만에 이 집을 다 지었노라.', '이런 지붕은 세상에 처음이니라.'] },
          { id: 'patriarch', pass: '오늘은 큰 날이로다.', name: '총대주교', x: 0.53, w: 88, h: 232, lines: ['폐하께서 먼저 들어와 계셨구나.', '이제 문을 열 차례란다.'] },
          { id: 'master', pass: '한 줌만 더 있으면…', show: 'dome', pose: 'see-wow', sora: '지붕이 빛 위에 떠 있어!', memo: '지붕 밑동에 창을 빙 둘러 뚫었단다. 빛이 들면 지붕이 떠 보이지.', name: '모자이크 장인', x: 0.63, w: 87, h: 228, lines: ['지붕 안쪽은 온통 금빛 조각이란다.', '하나하나 손으로 눌러 붙였지.'] },
          { id: 'isidore', pass: '네모 위에 동그라미라…', show: 'triangle', pose: 'see-aha', sora: '세모난 벽이 지붕을 받쳐!', memo: '네모난 방 위에 둥근 지붕을 얹으려고 휜 세모 벽 넷을 끼웠단다.', name: '수학자 이시도로스', x: 0.74, w: 84, h: 233, lines: ['네모난 방에 둥근 지붕을 어찌 얹을까?', '모서리마다 휜 세모를 끼우면 된단다.'] },
          { id: 'sweeper', pass: '쓱싹쓱싹, 반짝반짝.', name: '바닥 닦는 아이', x: 0.85, w: 68, h: 176, lines: ['바닥이 넓어서 끝이 없어.', '위를 보다가 자꾸 손이 멈춰.'] },
        ],
        spots: [],
      },
    ],
    // "The house with the sky on it" (core/tale.js; the user, 2026.10.9, of the storyboard:
    // "이대로 지어"): a handful of gold pieces is taken from the glass-maker in the square to
    // the mosaic master under the dome; the emperor's guard will let nobody in by the great
    // door; a deacon shows her the side door; she hands them over, choosing what to say;
    // and she looks up at the dome.
    tale: {
      ask: '저 큰 지붕은 왜 안 떨어질까?',
      steps: [
        {
          who: 'glass', goal: '성당 앞 광장의 유리 굽는 장인에게 가 보렴.', holds: '금빛 조각: 장인이 들고 있음',
          lines: ['얘야, 부탁 하나만 들어주련?', '지붕 밑에 붙일 금빛 조각이 모자란대.', '이 한 줌을 스승님께 갖다 드려 줄래?'],
          offer: { ask: '금빛 조각을 갖다 드릴까?', label: '내가 갖다 드릴게요' },
          errand: 'took',
        },
        {
          who: 'guard', goal: '성당 문간의 큰 문으로 가 보렴.', holds: '금빛 조각: 소라가 들고 있음',
          lines: ['멈춰라! 오늘은 폐하께서 먼저 드신다.', '이 문으로는 아무도 못 들어간다.'],
          sora: '어쩌지… 어? 저기서 누가 불러!',
        },
        {
          who: 'deacon', call: '얘야, 이쪽이란다.', goal: '향로 든 부제가 부른다. 가 보렴.', holds: '금빛 조각: 소라가 들고 있음',
          lines: ['일하는 사람은 옆문으로 다닌단다.', '저 끝의 작은 문이야. 따라오렴.'],
          sora: '옆문이 있었어! 들어가자!',
        },
        {
          who: 'master', goal: '돔 아래의 모자이크 장인에게 조각을 전하렴.', holds: '금빛 조각: 소라가 들고 있음',
          lines: ['오, 그 꾸러미는… 기다리던 것이구나!'],
          choice: {
            ask: '조각을 건네며 뭐라고 할까?',
            options: [
              { id: 'E1', label: '"늦어서 미안해요"', sora: '늦어서 미안해요. 문이 막혀서요.', says: '아니다, 꼭 맞게 왔단다. 고맙구나.' },
              { id: 'E2', label: '"지붕이 떠 있는 것 같아요"', sora: '저 지붕, 꼭 떠 있는 것 같아요!', says: '허허, 그렇게 보이라고 지은 거란다.' },
            ],
          },
          errand: 'gave',
        },
        {
          who: 'master', show: true, goal: '장인과 함께 지붕을 올려다보렴.',
          lines: ['이제 다 됐다. 고개를 들어 보렴.', '창으로 빛이 들면 지붕이 떠 보인단다.'],
          sora: '진짜야! 빛 위에 얹혀 있어!',
          errand: 'saw',
        },
      ],
      asides: [
        { who: 'glass', when: ['S1', 'S2', 'S3', 'S4'], lines: ['스승님은 큰 지붕 밑에 계신단다.', '성당 안으로 쭉 들어가면 돼.'] },
        { who: 'glass', when: ['S5'], lines: ['전해 주었구나! 고맙다.', '이제 저 지붕도 다 된 거란다.'] },
      ],
      done: '금빛 조각을 전하고, 떠 있는 지붕을 보았다.',
    },
    errands: [
      { id: 'took', text: '금빛 조각을 받는다.', at: [] },
      { id: 'gave', text: '모자이크 장인에게 조각을 전한다.', at: [] },
      { id: 'saw', text: '빛 위에 뜬 지붕을 본다.', at: [] },
    ],
    reply: '그 지붕은 스무 해쯤 뒤 지진에 무너져 다시 올렸단다. 다시 올린 것이 지금도 그 자리에 있지.',
  },
  // Cairo, the summer of 1324: Mansa Musa of Mali is in the city on his way to Mecca, and
  // there is so much of his gold about that it is worth less than it was. Painted as the
  // Arab manuscripts of that century were (the user, 2026.10.9, of five tries: "카이로 : 1").
  // Looked up on 2026.10.9 and found so: he came through in the pilgrimage of 1324; there
  // was no officer of the court he did not give gold to, and his people changed so much of
  // it that its price fell (al-Umari: the mithqal had not gone under 25 dirhams, and after
  // did not pass 22, still so years later); salt cut into slabs in the desert and carried
  // south for gold; scholars went home with him; the Catalan Atlas of 1375 shows him
  // enthroned with a round thing of gold in his hand. The numbers told of his train (sixty
  // thousand people, eighty camels of gold) are of later telling and are not said.
  // Made up: the water-seller and his piece of gold, the guard, the interpreter, the king's words.
  musa1324: {
    dir: 'cairo1324', look: 'paper', pale: true,
    scenes: [
      {
        id: 'gate', name: '이집트 카이로 성문 앞 시장', short: '성문 앞 시장', zoom: 1.06, ground: 0.8, scale: 0.62, air: 'market', floor: 'dirt',
        sora: '낙타가 줄줄이 들어와! 무슨 날이야?',
        people: [
          { id: 'datewoman', pass: '대추야자요, 꿀맛이오!', name: '대추야자 파는 아주머니', x: 0.18, w: 108, h: 320, lines: ['사막을 건너는 이들이 먹는 열매란다.', '하나 먹어 보련?'],
            try: { id: 'eat-date', verb: 'eat', name: '대추야자', face: 'yum', sora: '쫀득쫀득! 꿀처럼 달아.' } },
          { id: 'spice', pass: '후추요, 계피요!', name: '향신료 장수', x: 0.27, w: 111, h: 297, lines: ['오늘은 손님들이 금으로 값을 치르네.', '금이 이렇게 흔한 날은 처음이야.'] },
          { id: 'child', pass: '낙타가 끝이 안 보여!', name: '구경하는 아이', x: 0.36, w: 97, h: 207, lines: ['저 줄이 아침부터 들어오고 있어.', '임금님은 금빛 양산 밑에 계셨어!'] },
          { id: 'porter', pass: '어이쿠, 무겁다.', name: '짐꾼', x: 0.46, w: 117, h: 305, lines: ['짐 자루가 왜 이리 무겁나 했더니.', '속에 든 게 금가루라지 뭐야.'] },
          { id: 'camelboy', pass: '워워, 다 왔다!', show: 'caravan', pose: 'see-wow', sora: '줄이 끝이 없어!', memo: '서아프리카 말리에서 사막을 건너온 임금의 행렬이란다. 메카로 가는 길이었지.', name: '낙타 몰이 소년', x: 0.58, w: 103, h: 306, lines: ['말리에서 사막을 건너왔어.', '몇 달을 걸었는지 몰라.'] },
          { id: 'pilgrim', pass: '나도 메카로 간다네.', name: '순례 가는 노인', x: 0.7, w: 109, h: 299, lines: ['저 임금님도 메카로 가는 길이라오.', '같은 길을 가는 길동무지.'] },
          { id: 'water', pass: '시원한 물이오!', name: '물 파는 할아버지', x: 0.84, w: 114, h: 300, lines: ['물 한 잔이면 더위가 가신단다.', '오늘은 별일을 다 겪는구나.'] },
        ],
        spots: [],
      },
      {
        id: 'souk', name: '이집트 카이로 금 시장 골목', short: '금 시장 골목', zoom: 1.06, ground: 0.8, scale: 0.62, air: 'market', floor: 'dirt',
        sora: '가게마다 금이 번쩍번쩍해!',
        people: [
          { id: 'changer', pass: '어제는 스물다섯이었는데…', show: 'scale', pose: 'see-aha', sora: '금이 흔해져서 값이 내렸구나!', memo: '금이 한꺼번에 너무 많이 풀리면 금값이 떨어진단다. 그해 카이로가 그랬지.', name: '환전상', x: 0.18, w: 107, h: 272, lines: ['금 한 닢이 은 스물다섯 닢이었단다.', '오늘은 스물둘도 안 쳐 줘. 금이 넘쳐서.'] },
          { id: 'goldsmith', pass: '땅, 땅. 금이 남아도네.', name: '금 세공사', x: 0.29, w: 90, h: 271, lines: ['금이 싸져서 일감이 밀려든다오.', '망치 한번 잡아 보겠니?'],
            try: { id: 'use-hammer', verb: 'use', name: '세공 망치', sora: '땅, 땅! 금이 얇게 펴져.' } },
          { id: 'saltman', pass: '소금이오, 사막 소금!', show: 'salt', pose: 'see-gasp', sora: '소금이 돌판 같아!', memo: '사막에서 캔 소금을 판으로 잘라 낙타에 실었단다. 소금을 주고 금을 받았지.', name: '소금 장수', x: 0.4, w: 99, h: 292, lines: ['사막 한가운데서 캔 소금이야.', '우리 고장에선 소금이 아주 귀해.'] },
          { id: 'tailor', pass: '고운 옷 보고 가요!', name: '옷 가게 주인', x: 0.51, w: 119, h: 257, lines: ['말리 손님들 옷이 참 넉넉하지요.', '아이 것도 있단다. 입어 보련?'],
            try: { id: 'wear-mali', verb: 'wear', name: '말리의 옷', outfit: 'mali', sora: '소매가 날개처럼 펄럭여!', memo: '품이 넓어 바람이 잘 통하는 서아프리카의 옷이란다.' } },
          { id: 'bookseller', pass: '귀한 책이오, 귀한 책!', show: 'books', pose: 'see-aha', sora: '책 표지에 금무늬가 있어!', memo: '그 임금이 돌아갈 때 여러 학자가 함께 말리로 갔단다.', name: '책 장수', x: 0.62, w: 102, h: 271, lines: ['임금님 일행이 책을 많이 사 갔다오.', '금보다 책을 더 반기는 분이라지.'] },
          { id: 'interp', pass: '이 책도 사 가야겠군.', name: '임금의 통역', x: 0.73, w: 103, h: 277, lines: ['임금님의 말을 옮기는 일을 한단다.', '카이로는 책이 많아 좋구나.'] },
          { id: 'guard', pass: '여기부터는 임금님의 천막이다.', name: '임금의 호위병', x: 0.85, w: 124, h: 320, lines: ['임금님의 천막을 지킨단다.', '사막에서도 한 번도 졸지 않았지.'] },
        ],
        spots: [],
      },
      {
        id: 'camp', name: '이집트 카이로 성 밖 임금의 천막', short: '임금의 천막', zoom: 1.06, ground: 0.8, scale: 0.62, air: 'court', floor: 'dirt',
        sora: '천막이 집보다 커! 북소리도 나.',
        people: [
          { id: 'attendant', pass: '지팡이를 높이, 높이!', name: '금 지팡이 든 시종', x: 0.19, w: 79, h: 300, lines: ['임금님 앞에서 금 지팡이를 든단다.', '햇빛을 받으면 눈이 부시지.'] },
          { id: 'drummer', pass: '둥, 둥, 두둥!', name: '북 치는 사람', x: 0.3, w: 105, h: 267, lines: ['임금님이 나서실 때 북을 친단다.', '사막에서도 날마다 쳤지.'] },
          { id: 'griot', pass: '옛날 옛적 말리에…', name: '이야기꾼', x: 0.39, w: 111, h: 272, lines: ['임금님들의 이야기를 노래로 전한단다.', '오늘 일도 노래가 될 거야.'] },
          { id: 'king', pass: '허허, 좋은 날이로다.', show: 'map', pose: 'see-wow', sora: '지도에 임금님이 그려졌어!', memo: '쉰 해쯤 뒤 유럽의 지도에 금덩이를 든 이 임금이 그려졌단다.', name: '말리의 임금 만사 무사', x: 0.5, w: 136, h: 320, lines: ['먼 길을 가는 중이란다.', '가진 것은 나눠야 가벼워지지.'] },
          { id: 'scholar', pass: '흠, 이 대목이 좋구나.', name: '말리의 학자', x: 0.61, w: 119, h: 289, lines: ['임금님은 배운 이를 귀하게 여기신다.', '돌아갈 때는 책이 한 짐일 게다.'] },
          { id: 'cook', pass: '밥 다 됐다, 밥!', name: '밥 짓는 아주머니', x: 0.74, w: 100, h: 263, lines: ['이 많은 식구 밥을 날마다 짓는단다.', '사막에선 물이 금보다 귀했지.'] },
          { id: 'envoy', pass: '술탄의 편지를 가져왔소.', name: '술탄의 사신', x: 0.85, w: 107, h: 315, lines: ['술탄께서 임금님을 궁으로 청하셨소.', '이런 손님은 카이로에 처음이라오.'] },
        ],
        spots: [],
      },
    ],
    // "The king who scattered gold" (core/tale.js; the user, 2026.10.9, of the storyboard:
    // "이대로 지어"): the water-seller was paid a piece of gold for a cup of water and
    // would give it back; the king's guard turns her away; the king's interpreter takes her
    // in; she holds it out to the king, choosing what to say; and he shows her his gold.
    tale: {
      ask: '금이 너무 많으면 어떻게 될까?',
      steps: [
        {
          who: 'water', goal: '성문 앞 시장의 물 파는 할아버지에게 가 보렴.', holds: '금 조각: 할아버지가 들고 있음',
          lines: ['얘야, 이것 좀 보렴.', '물 한 잔 값으로 금 한 조각을 받았단다.', '이건 너무 많아. 돌려드려 줄래?'],
          offer: { ask: '금 조각을 돌려드릴까?', label: '내가 돌려드릴게요' },
          errand: 'took',
        },
        {
          who: 'guard', goal: '금 시장 골목 끝의 천막 어귀로 가 보렴.', holds: '금 조각: 소라가 들고 있음',
          lines: ['멈춰라. 임금님은 아무나 못 뵌다.', '무슨 일인지 나는 들은 바 없다.'],
          sora: '돌려드리러 온 건데… 어? 누가 불러!',
        },
        {
          who: 'interp', call: '얘야, 무슨 일이니?', goal: '임금의 통역이 부른다. 가 보렴.', holds: '금 조각: 소라가 들고 있음',
          lines: ['금을 돌려주러 왔다고? 기특하구나.', '정직한 사람은 임금님이 만나 주신단다.', '나와 함께 가자.'],
          after: [{ who: 'guard', line: '통역님의 손님이군. 지나가거라.' }],
          sora: '들어가도 된대! 임금님께 가자!',
        },
        {
          who: 'king', goal: '성 밖 천막의 임금에게 금 조각을 돌려드리렴.', holds: '금 조각: 소라가 들고 있음',
          lines: ['어서 오너라. 내게 줄 것이 있다고?'],
          choice: {
            ask: '금 조각을 내밀며 뭐라고 할까?',
            options: [
              { id: 'E1', label: '"할아버지가 너무 많대요"', sora: '물 한 잔 값으로는 너무 많대요.', says: '허허, 준 것은 돌려받지 않는단다.' },
              { id: 'E2', label: '"금이 정말 많으시네요"', sora: '임금님은 금이 정말 많으시네요!', says: '허허, 많으니 나누는 것이란다.' },
            ],
          },
          errand: 'gave',
        },
        {
          who: 'king', show: true, goal: '임금님이 보여 주는 것을 보렴.',
          lines: ['정직한 아이로구나. 이걸 보렴.', '내 땅에는 금이 이만큼 난단다.'],
          sora: '주먹만 한 금덩이야! 눈이 부셔.',
          errand: 'saw',
        },
      ],
      asides: [
        { who: 'water', when: ['S1', 'S2', 'S3', 'S4'], lines: ['임금님은 성 밖 천막에 계신다더구나.', '금 시장 골목을 지나면 나온단다.'] },
        { who: 'water', when: ['S5'], lines: ['돌려받지 않으셨다고? 허허.', '그럼 오늘 물은 다 그냥 나눠야겠구나.'] },
      ],
      done: '금 조각을 들고 가서, 금덩이 든 임금을 보았다.',
    },
    errands: [
      { id: 'took', text: '금 조각을 받는다.', at: [] },
      { id: 'gave', text: '임금에게 금 조각을 내민다.', at: [] },
      { id: 'saw', text: '임금의 금덩이를 본다.', at: [] },
    ],
    reply: '그 임금은 뒷날 지도에 금덩이를 든 모습으로 그려졌단다. 이집트의 금값은 여러 해 제자리로 못 돌아왔지.',
  },
  // Kaifeng, 4 July 1054: a star nobody had seen before stood in the east at daybreak and
  // stayed in sight after the sun was up. In ink (the user, 2026.10.9, of five tries: "3"):
  // the sky is the paper of the picture, so the computed sky is not behind it.
  // Looked up on 2026.10.9 and found so: the guest star first seen at daybreak in the east
  // on 4 July 1054 and set down by the astronomer Yang Weide; a little brighter than Venus
  // and in sight by day for 23 days; the Crab Nebula what is left of it. The bridge over the
  // Bian with no piers, of great timbers curved like a rainbow; books printed from carved
  // blocks, Kaifeng one of the places they were printed; tea ground to powder and whisked
  // with a bamboo whisk; officials' black hats with long straight wings.
  // The streets are as the scroll "Along the River at Qingming" shows them, which is of the
  // next century. From memory: masts lowered to pass the bridge and the rice of the south
  // coming up the canal, markets by night, the water clock, the armillary sphere, steamed buns.
  // Made up: the apprentice and his note, the gatekeeper, the fortune-teller, what they say.
  guest1054: {
    dir: 'kaifeng1054', look: 'paper', pale: true,
    scenes: [
      {
        id: 'bridge', name: '중국 개봉 변하 무지개 다리 어귀', short: '무지개 다리', zoom: 1.06, ground: 0.8, scale: 0.62, air: 'market', floor: 'dirt',
        sora: '아직 새벽이야. 저 별 좀 봐!',
        people: [
          { id: 'tea', pass: '차 한 사발 하고 가요!', name: '찻집 아주머니', x: 0.18, w: 117, h: 278, lines: ['가루 낸 차에 더운물을 붓고 저어요.', '거품이 고울수록 잘 탄 차랍니다.'],
            try: { id: 'use-whisk', verb: 'use', name: '차 젓는 솔', sora: '휘휘휘! 거품이 뽀얗게 올라와!', memo: '송나라에서는 차를 가루 내어 대나무 솔로 저어 마셨단다.' } },
          { id: 'bun', pass: '따끈한 만두요, 만두!', name: '만두 장수', x: 0.28, w: 152, h: 276, lines: ['새벽부터 쪄서 김이 펄펄 나지.', '배 타는 사람들이 제일 먼저 사 가오.'],
            try: { id: 'eat-mantou', verb: 'eat', name: '찐 만두', face: 'yum', sora: '호호, 뜨거워! 폭신폭신해.' } },
          { id: 'carpenter', pass: '어디 보자, 여기도 멀쩡하군.', show: 'bridge', pose: 'see-wow', sora: '기둥이 하나도 없어!', memo: '통나무를 무지개처럼 휘어 강을 건넌 다리란다. 기둥이 없어 배가 걸리지 않았지.', name: '다리 고치는 목수', x: 0.39, w: 135, h: 279, lines: ['이 다리는 물속에 기둥이 없소.', '통나무를 무지개처럼 엮어 올렸지.'] },
          { id: 'boatman', pass: '돛대 눕혀라, 다리다!', name: '뱃사공', x: 0.5, w: 130, h: 320, lines: ['다리 밑을 지날 땐 돛대를 눕힌다오.', '남쪽 쌀이 이 물길로 다 올라오지.'] },
          { id: 'apprentice', pass: '저 별… 어제는 없었는데.', name: '별 보는 생도', x: 0.62, w: 114, h: 280, lines: ['하늘 보는 일을 배우는 중이야.', '밤을 꼬박 새웠더니 눈이 감겨.'] },
          { id: 'porter', pass: '영차, 영차.', name: '짐꾼', x: 0.74, w: 176, h: 279, lines: ['새벽 장에 댈 채소라오.', '이 도시는 밤에도 장이 선다오.'] },
          { id: 'child', pass: '하아암…', name: '졸린 아이', x: 0.85, w: 93, h: 203, lines: ['형아가 밤새 하늘만 봤어.', '나도 별 봤어. 엄청 밝았어!'] },
        ],
        spots: [],
      },
      {
        id: 'street', name: '중국 개봉 성 안 큰 거리', short: '큰 거리', zoom: 1.06, ground: 0.8, scale: 0.62, air: 'street', floor: 'dirt',
        sora: '해가 떴어. 그런데 저 별은 그대로야!',
        people: [
          { id: 'peddler', pass: '딸랑딸랑, 구경하세요!', name: '방물장수', x: 0.18, w: 158, h: 310, lines: ['부채, 빗, 바람개비, 없는 게 없소.', '온 거리를 지고 다닌다오.'] },
          { id: 'printer', pass: '새 책 나왔소, 새 책!', show: 'print', pose: 'see-aha', sora: '글자가 거꾸로 새겨져 있어!', memo: '나무판에 글자를 뒤집어 새기고 먹을 발라 찍었단다. 판 하나로 수백 장을 찍었지.', name: '책 가게 주인', x: 0.28, w: 128, h: 313, lines: ['판 하나를 새기면 몇백 장을 찍소.', '손으로 베끼던 때는 지났지.'] },
          { id: 'cloth', pass: '옷 구경하고 가요!', name: '옷 가게 주인', x: 0.39, w: 145, h: 304, lines: ['아이 옷도 곱게 지어 놨어요.', '한번 걸쳐 보겠니?'],
            try: { id: 'wear-song', verb: 'wear', name: '송나라 옷', outfit: 'song', sora: '치마가 사락사락해!', memo: '송나라 아이들이 입던 저고리와 주름치마란다.' } },
          { id: 'scholar', pass: '공자 왈, 맹자 왈…', name: '글 읽는 선비', x: 0.5, w: 153, h: 310, lines: ['과거 시험이 코앞이라오.', '찍어 낸 책 덕에 공부할 맛이 나오.'] },
          { id: 'monk', pass: '나무아미타불.', name: '스님', x: 0.6, w: 115, h: 284, lines: ['새벽 예불을 마치고 오는 길이오.', '오늘 하늘이 심상치 않구려.'] },
          { id: 'fortune', pass: '오늘 운세 보고 가시오.', show: 'daystar', pose: 'see-wow', sora: '낮인데 별이 보여!', memo: '금성보다 밝아서 스무사흘 동안 낮에도 보였단다.', name: '점쟁이', x: 0.72, w: 143, h: 305, lines: ['별을 보면 앞일이 보인다오.', '오늘 저 별은 나도 처음 보오.'] },
          { id: 'guard', pass: '아함… 졸리다.', name: '천문대 문지기', x: 0.85, w: 128, h: 320, lines: ['여기는 나라의 천문대다.', '아무나 못 들어간다.'] },
        ],
        spots: [],
      },
      {
        id: 'yard', name: '중국 개봉 천문대 마당', short: '천문대', zoom: 1.06, ground: 0.8, scale: 0.62, air: 'hush', floor: 'dirt',
        sora: '고리가 겹겹인 저건 뭐지?',
        people: [
          { id: 'clockman', pass: '똑… 똑… 똑…', name: '물시계 지키는 관원', x: 0.18, w: 125, h: 305, lines: ['떨어지는 물로 시각을 잰단다.', '때가 되면 북을 쳐서 알리지.'] },
          { id: 'sweeper', pass: '쓱싹, 쓱싹.', name: '마당 쓰는 아이', x: 0.27, w: 90, h: 248, lines: ['어른들이 오늘은 하늘만 봐요.', '빗자루질도 안 시켜요. 히히.'] },
          { id: 'armil', pass: '고리를 이쪽으로…', show: 'armillary', pose: 'see-gasp', sora: '고리가 겹겹이야!', memo: '고리를 돌려 별이 하늘 어디에 있는지 재는 기구란다.', name: '혼천의 보는 관원', x: 0.47, w: 131, h: 316, lines: ['이 대롱으로 별을 겨눈단다.', '고리의 눈금을 읽으면 별의 자리가 나오지.'] },
          { id: 'old', pass: '허어, 평생 처음이로다.', name: '늙은 관원', x: 0.37, w: 151, h: 311, lines: ['육십 평생 저런 별은 처음이오.', '해가 떴는데도 지지를 않소.'] },
          { id: 'yang', pass: '천관 별 곁이라…', show: 'chart', pose: 'see-aha', sora: '별 그림에 빨간 점을 찍었어!', memo: '그날 적어 둔 덕분에 먼 훗날 사람들이 그 별의 자취를 찾아냈단다.', name: '천문 관원 양유덕', x: 0.69, w: 135, h: 320, lines: ['하늘에 없던 별은 손님별이라 한단다.', '언제 와서 언제 가는지 다 적어 두지.'] },
          { id: 'scribe', pass: '사각사각.', name: '받아 적는 서리', x: 0.78, w: 95, h: 301, lines: ['날짜와 시각을 빠짐없이 적는다.', '훗날 누가 읽을지 모르니까.'] },
          { id: 'messenger', pass: '준비됐습니다!', name: '궁으로 갈 전령', x: 0.86, w: 115, h: 283, lines: ['적은 것을 궁궐로 들고 뛸 사람이오.', '임금님도 하늘 일은 꼭 들으신다오.'] },
        ],
        spots: [],
      },
    ],
    // "The star that rose by day" (core/tale.js; the user, 2026.10.9, of the storyboard:
    // "이대로 지어"): the apprentice who has watched all night gives her a note for his
    // master; the gatekeeper of the observatory will not hear of a star by day; the
    // fortune-teller shows her, and him, that it is still there; she hands the note over,
    // choosing what to say; and the astronomer sets the star down on his chart.
    tale: {
      ask: '해가 떠도 안 지는 별이 있을까?',
      steps: [
        {
          who: 'apprentice', goal: '무지개 다리 어귀의 별 보는 생도에게 가 보렴.', holds: '쪽지: 생도가 들고 있음',
          lines: ['밤새 하늘을 봤는데, 없던 별이 떴어.', '해가 떠도 보이는지 지켜봐야 해.', '이 쪽지를 스승님께 전해 줄래?'],
          offer: { ask: '쪽지를 전해 줄까?', label: '내가 전해 줄게요' },
          errand: 'took',
        },
        {
          who: 'guard', goal: '큰 거리 끝의 천문대 문으로 가 보렴.', holds: '쪽지: 소라가 들고 있음',
          lines: ['낮에 별이라니, 잠꼬대 말아라.', '해가 떴는데 별이 어디 있느냐.'],
          sora: '진짜인데… 어? 점쟁이 할아버지가 불러!',
        },
        {
          who: 'fortune', show: true, call: '얘야, 저 하늘 좀 보렴.', goal: '점쟁이 할아버지가 부른다. 가 보렴.', holds: '쪽지: 소라가 들고 있음',
          lines: ['손으로 해를 가리고 저쪽을 보렴.', '보이지? 낮인데도 별이 떠 있단다.'],
          after: [{ who: 'guard', line: '어디… 어이쿠, 정말이네! 들어가라.' }],
          sora: '문지기 아저씨도 봤어! 들어가자!',
        },
        {
          who: 'yang', goal: '천문대 마당의 천문 관원에게 쪽지를 전하렴.', holds: '쪽지: 소라가 들고 있음',
          lines: ['무슨 일이냐. 쪽지라고?'],
          choice: {
            ask: '쪽지를 건네며 뭐라고 할까?',
            options: [
              { id: 'E1', label: '"제자가 밤새 봤대요"', sora: '제자가 밤새 지켜보고 적은 거예요.', says: '기특하구나. 어디 보자… 과연!' },
              { id: 'E2', label: '"낮에도 보여요!"', sora: '그 별, 해가 떴는데도 보여요!', says: '낮에도? 이건 꼭 적어 둬야겠구나.' },
            ],
          },
          errand: 'gave',
        },
        {
          who: 'yang', show: true, goal: '천문 관원이 별 그림에 적는 것을 보렴.',
          lines: ['이리 와서 보렴. 여기가 그 자리란다.', '손님별이라 적고, 붉은 점을 찍어 두마.'],
          sora: '빨간 점이 찍혔어! 오늘이 적힌 거야.',
          errand: 'saw',
        },
      ],
      asides: [
        { who: 'apprentice', when: ['S1', 'S2', 'S3', 'S4'], lines: ['스승님은 천문대에 계셔.', '큰 거리 끝까지 가면 문이 보여.'] },
        { who: 'apprentice', when: ['S5'], lines: ['전해 줬구나! 정말 고마워.', '이제 눈 좀 붙여야겠어. 하암.'] },
      ],
      done: '쪽지를 전하고, 별이 적히는 것을 보았다.',
    },
    errands: [
      { id: 'took', text: '생도의 쪽지를 받는다.', at: [] },
      { id: 'gave', text: '천문 관원에게 쪽지를 전한다.', at: [] },
      { id: 'saw', text: '별이 적히는 것을 본다.', at: [] },
    ],
    reply: '그 별은 스무사흘 동안 낮에도 보였단다. 지금은 게 모양 구름이 되어 그 자리에 있지.',
  },
  // Agra, about 1640: the Taj Mahal is building. Painted as the miniatures of the Mughal
  // court were (the user, 2026.10.9, of five tries: "아그라 : 1"). The day is not on record.
  // Looked up on 2026.10.9 and found so: begun 1631 or 1632, the tomb itself done by 1648,
  // all of it by 1653; white marble from Makrana; elephants hauled the stone; the writing
  // round the arches by Amanat Khan (he signed it in 1638), its letters made larger the
  // higher they stand so that they look one size from below; the flowers made by cutting a
  // hollow in the marble and setting thin pieces of coloured stone into it, some tens of
  // pieces to a flower; the French jeweller Tavernier came to Agra in 1640. From memory:
  // the two sides alike as in a mirror, the garden in four parts with water between, the
  // blue stone flecked with gold. Not found, and so not said: scaffolding of brick, the
  // length of the ramp, how many kinds of stone, twenty thousand workers.
  // Made up: the errand of the red stone, the overseer, that the calligrapher takes her up.
  tajMahal: {
    dir: 'agra1640', look: 'paper', pale: true,
    scenes: [
      {
        id: 'site', name: '인도 아그라 강가 공사터', short: '강가 공사터', zoom: 1.06, ground: 0.8, scale: 0.62, air: 'works', floor: 'dirt',
        sora: '하얀 지붕이 발판에 싸여 있어!',
        people: [
          { id: 'mason', pass: '깡, 깡. 흰 돌가루 날린다.', name: '돌 깎는 석공', x: 0.19, w: 85, h: 275, lines: ['이 흰 돌은 먼 마크라나에서 왔단다.', '먼 길을 실려 온 귀한 돌이지.'] },
          { id: 'clerk', pass: '오늘 품삯이… 어디 보자.', name: '장부 적는 서기', x: 0.28, w: 114, h: 282, lines: ['일꾼이 하도 많아 이름 적기도 벅차.', '벌써 여러 해째 짓고 있단다.'] },
          { id: 'mahout', pass: '영차, 우리 코끼리 힘내라!', show: 'elephant', pose: 'see-wow', sora: '코끼리가 돌을 끌어!', memo: '무거운 대리석은 코끼리가 끌어 올렸단다.', name: '코끼리 몰이꾼', x: 0.4, w: 103, h: 297, lines: ['큰 돌은 우리 코끼리가 끈단다.', '비탈길을 하루에도 몇 번씩 오르지.'] },
          { id: 'mango', pass: '달디단 망고요!', name: '망고 파는 아주머니', x: 0.52, w: 118, h: 262, lines: ['일하다 목마르면 망고가 제일이지.', '하나 먹어 보련?'],
            try: { id: 'eat-mango', verb: 'eat', name: '망고', face: 'yum', sora: '달콤하고 물이 줄줄 흘러!' } },
          { id: 'girl', pass: '물 가져왔어요, 물!', name: '물 나르는 소녀', x: 0.63, w: 97, h: 264, lines: ['강에서 물을 길어다 날라.', '돌을 켤 때도 물이 많이 든대.'] },
          { id: 'boatman', pass: '돌 왔소, 돌!', name: '돌 싣고 온 뱃사공', x: 0.75, w: 80, h: 320, lines: ['무거운 돌은 강물로 실어 온다오.', '저 흰 지붕이 날마다 조금씩 자라지.'] },
          { id: 'jeweller', pass: '어디 보자, 한 알이 비네.', name: '보석 장수', x: 0.85, w: 97, h: 296, lines: ['먼 나라에서 온 돌을 판단다.', '빛깔마다 고향이 다르지.'] },
        ],
        spots: [],
      },
      {
        id: 'yard', name: '인도 아그라 돌 다듬는 마당', short: '돌 다듬는 마당', zoom: 1.06, ground: 0.8, scale: 0.62, air: 'works', floor: 'dirt',
        sora: '돌 켜는 소리가 쓱쓱 나!',
        people: [
          { id: 'cutter', pass: '쓱, 쓱. 물 좀 부어라.', show: 'saw', pose: 'see-aha', sora: '돌을 꽃잎 모양으로 잘라!', memo: '색돌을 얇게 켜고 갈아서, 흰 돌에 판 홈에 꼭 맞게 박았단다.', name: '돌 켜는 장인', x: 0.19, w: 112, h: 274, lines: ['색돌을 꽃잎 모양으로 켠단다.', '머리카락만큼만 어긋나도 안 맞아.'] },
          { id: 'sorter', pass: '이건 파랑, 이건 초록.', show: 'stones', pose: 'see-gasp', sora: '돌 빛깔이 이렇게 많아?', memo: '파란 돌, 초록 돌, 붉은 돌. 꽃 한 송이에 여러 빛깔 돌이 들어갔단다.', name: '보석 고르는 아이', x: 0.29, w: 86, h: 216, lines: ['빛깔대로 그릇에 나눠 담아.', '파란 돌에는 금빛 점이 박혀 있어.'] },
          { id: 'tailor', pass: '터번 천 보고 가시오!', name: '옷 파는 아저씨', x: 0.4, w: 125, h: 281, lines: ['이 고장 나들이옷이란다.', '아이 것도 있지. 입어 보련?'],
            try: { id: 'wear-mughal', verb: 'wear', name: '무굴 나들이옷', outfit: 'mughal', sora: '숄이 나비 날개 같아!', memo: '무굴 사람들이 입던 긴 겉옷과 얇은 숄이란다.' } },
          { id: 'calligrapher', pass: '위로 갈수록 크게, 크게.', show: 'letters', pose: 'see-aha', sora: '위쪽 글씨가 더 커!', memo: '높은 곳의 글씨를 더 크게 썼단다. 그래야 밑에서 보면 크기가 같아 보이지.', name: '글씨 쓰는 서예가', x: 0.56, w: 113, h: 285, lines: ['문 둘레의 글씨는 내가 쓴단다.', '높은 데 것은 일부러 더 크게 쓰지.'] },
          { id: 'baker', pass: '빵 다 구워졌다!', name: '빵 굽는 아주머니', x: 0.67, w: 106, h: 255, lines: ['일꾼들 점심을 굽는 중이란다.', '하루에 몇 장인지 세다가 잊었어.'] },
          { id: 'carpenter', pass: '장대 지나가요!', name: '발판 엮는 목수', x: 0.76, w: 96, h: 277, lines: ['발판 엮는 일을 한단다.', '저 꼭대기까지 올라가 봤지.'] },
          { id: 'foreman', pass: '거기, 조심해라!', name: '기단 지키는 감독관', x: 0.85, w: 110, h: 320, lines: ['이 위는 내가 지킨단다.', '돌 하나 떨어져도 큰일이지.'] },
        ],
        spots: [],
      },
      {
        id: 'tomb', name: '인도 아그라 흰 무덤 위', short: '흰 무덤 위', zoom: 1.06, ground: 0.8, scale: 0.62, air: 'hush', floor: 'wood',
        sora: '벽이 온통 하얘! 꽃이 새겨져 있어.',
        people: [
          { id: 'apprentice', pass: '스승님, 그릇 여기요.', name: '상감 견습생', x: 0.19, w: 87, h: 244, lines: ['꽃 한 송이 박는 데 여러 날이 걸려.', '나는 아직 돌 고르기만 배워.'] },
          { id: 'inlayer', pass: '한 알이 모자라는구나…', show: 'flower', pose: 'see-wow', sora: '돌로 만든 꽃이야!', memo: '흰 돌에 홈을 파고 색돌 조각을 꼭 맞게 박았단다. 꽃 한 송이에 조각이 수십 개지.', name: '꽃을 박는 장인', x: 0.3, w: 104, h: 270, lines: ['돌로 꽃을 피우는 일을 한단다.', '시들지 않는 꽃이지.'] },
          { id: 'carver', pass: '톡, 톡. 숨을 참고.', name: '꽃 새기는 조각가', x: 0.42, w: 113, h: 261, lines: ['이 꽃은 돌을 깎아 도드라지게 했단다.', '한 번 잘못 치면 처음부터지.'] },
          { id: 'architect', pass: '왼쪽과 오른쪽이 똑같아야지.', name: '으뜸 건축가', x: 0.53, w: 149, h: 320, lines: ['이 집은 왼쪽과 오른쪽이 똑같단다.', '거울에 비춘 것처럼 지었지.'] },
          { id: 'polisher', pass: '쓱쓱, 반들반들.', name: '대리석 닦는 일꾼', x: 0.65, w: 98, h: 270, lines: ['고운 모래로 문질러 윤을 낸단다.', '해가 뜨면 벽이 눈부시게 빛나지.'] },
          { id: 'visitor', pass: '오, 이럴 수가!', name: '먼 나라에서 온 보석상', x: 0.75, w: 128, h: 293, lines: ['프랑스에서 온 보석 장수요.', '이런 솜씨는 어디서도 못 봤소.'] },
          { id: 'gardener', pass: '나무야, 쑥쑥 자라라.', name: '뜰 가꾸는 정원사', x: 0.85, w: 135, h: 276, lines: ['무덤 앞에 큰 뜰을 꾸밀 거란다.', '물길을 내어 네 쪽으로 나눌 거야.'] },
        ],
        spots: [],
      },
    ],
    // "The day the white tomb was building" (core/tale.js; the user, 2026.10.9, of the
    // storyboard: "이대로 지어"): a red stone left behind is taken from the jeweller at the
    // landing to the master who sets flowers of stone; the overseer will let only workers
    // up; the calligrapher has her carry his inkpot as his helper; she hands the stone
    // over, choosing what to say; and the last petal is set.
    tale: {
      ask: '돌로 꽃을 피울 수 있을까?',
      steps: [
        {
          who: 'jeweller', goal: '강가 나루의 보석 장수에게 가 보렴.', holds: '붉은 돌: 보석 장수가 들고 있음',
          lines: ['얘야, 부탁 하나만 들어주련?', '붉은 돌 한 알이 빠진 채로 올라갔구나.', '꽃잎 하나가 비어 있을 게다. 전해 주련?'],
          offer: { ask: '붉은 돌을 전해 줄까?', label: '내가 전해 줄게요' },
          errand: 'took',
        },
        {
          who: 'foreman', goal: '돌 다듬는 마당 끝의 계단으로 가 보렴.', holds: '붉은 돌: 소라가 들고 있음',
          lines: ['멈춰라. 이 위는 일꾼만 올라간다.', '아이가 다니다 다치면 큰일이지.'],
          sora: '돌만 전하면 되는데… 어? 누가 불러!',
        },
        {
          who: 'calligrapher', call: '얘야, 이리 와 보렴.', goal: '글씨 쓰는 서예가가 부른다. 가 보렴.', holds: '붉은 돌: 소라가 들고 있음',
          lines: ['위에 볼일이 있다고? 그럼 이렇게 하자.', '내 먹통을 들어 주렴. 그러면 내 조수란다.'],
          after: [{ who: 'foreman', line: '서예가 어른의 조수로군. 올라가거라.' }],
          sora: '조수가 됐어! 올라가자!',
        },
        {
          who: 'inlayer', goal: '흰 무덤 위의 꽃을 박는 장인에게 돌을 전하렴.', holds: '붉은 돌: 소라가 들고 있음',
          lines: ['누구냐… 그 손에 든 것은?'],
          choice: {
            ask: '붉은 돌을 건네며 뭐라고 할까?',
            options: [
              { id: 'E1', label: '"한 알이 빠졌대요"', sora: '보석 장수 아저씨가 한 알이 빠졌대요.', says: '오, 이걸 찾고 있었단다. 고맙구나.' },
              { id: 'E2', label: '"돌로 꽃을 만들어요?"', sora: '정말 돌로 꽃을 만들어요?', says: '그럼. 마침 꽃잎 하나가 비었단다.' },
            ],
          },
          errand: 'gave',
        },
        {
          who: 'inlayer', show: true, goal: '장인이 꽃을 다 피우는 것을 보렴.',
          lines: ['자, 빈자리에 꼭 맞게 넣는다.', '보렴. 이제 꽃 한 송이가 다 피었지.'],
          sora: '진짜 꽃이 됐어! 안 시드는 꽃이야.',
          errand: 'saw',
        },
      ],
      asides: [
        { who: 'jeweller', when: ['S1', 'S2', 'S3', 'S4'], lines: ['장인은 저 흰 무덤 위에 계신단다.', '돌 다듬는 마당을 지나 올라가렴.'] },
        { who: 'jeweller', when: ['S5'], lines: ['전해 주었구나! 고맙다.', '이제 그 꽃도 다 피었겠구나.'] },
      ],
      done: '붉은 돌을 전하고, 돌꽃이 피는 것을 보았다.',
    },
    errands: [
      { id: 'took', text: '붉은 돌을 받는다.', at: [] },
      { id: 'gave', text: '꽃을 박는 장인에게 돌을 전한다.', at: [] },
      { id: 'saw', text: '돌로 핀 꽃을 본다.', at: [] },
    ],
    reply: '그 꽃은 지금도 그 벽에 피어 있단다. 흰 무덤은 그 뒤로도 여러 해를 더 지었지.',
  },
  // Tahiti, 3 June 1769: Venus crossed the Sun and Cook's people timed it from the fort on
  // the point. Painted after Gauguin's oils and not in pixels (the user, 2026.10.9, having
  // seen nine tries: "좋아 8번"): the sand is coral pink and the sky is in the picture, so
  // the computed sky is not behind it. The point's sand is in truth black.
  // Looked up on 2026.10.9 and found so: the ship in Matavai Bay from 12 April; the fort
  // and the observatory on the point; the day clear and the thermometer in the sun higher
  // than they had yet seen it; coconuts given for a nail; the quadrant stolen on 2 May,
  // taken to pieces and got back with the help of the chief Tubourai Tamaide; the flies
  // that kept the artist Parkinson from his work, and his being marked on the arm by the
  // islanders with a sharpened bone and blue-black dye; the three who watched timing the
  // contacts differently. Looked up later that day: "tattoo" is from the island's "tatau"
  // and is first written in English in the journals of this voyage; the cloth of bark soaked
  // and beaten, mostly by women, and worn with a hole for the head; breadfruit roasted, tasting
  // of bread crumb; iron prized there; a gap of 105 years and a half to the next transit.
  // Not found, and so not said: that the island had no iron at all, how many hours the
  // transit took. Kept out on purpose: the tale of sailors drawing the nails out of their
  // ship (told of the Dolphin in 1767, of a trade not for children, and called a myth).
  // Made up: the errand of the coconut, the chief taking her in, the astronomer letting her look.
  venus1769: {
    dir: 'tahiti1769', look: 'paper',
    scenes: [
      {
        id: 'beach', name: '타히티 마타바이 만 바닷가', short: '마타바이 만', zoom: 1.06, ground: 0.8, scale: 0.62, air: 'market', floor: 'dirt',
        sora: '모래가 따끈따끈해! 저 배는 뭐지?',
        people: [
          { id: 'fisher', pass: '오늘 바다는 잔잔하군.', name: '카누 타는 어부', x: 0.19, w: 118, h: 320, lines: ['저 큰 배는 두 달 가까이 저기 서 있어.', '우리 카누는 옆에 팔이 달려서 안 뒤집혀.'],
            try: { id: 'use-paddle', verb: 'use', name: '카누의 노', sora: '영차! 어, 자꾸 옆으로만 가!' } },
          { id: 'tapa', pass: '탁, 탁, 탁.', name: '천 두드리는 아주머니', x: 0.31, w: 113, h: 282, lines: ['나무껍질을 두드려서 천을 만들어.', '두드릴수록 넓고 얇아진단다.'],
            try: { id: 'wear-tapa', verb: 'wear', name: '나무껍질 옷', outfit: 'tapa', sora: '가볍고 바삭바삭해!', memo: '나무껍질을 물에 불려 두드려 만든 천이란다.' } },
          { id: 'tattoo', pass: '톡, 톡. 가만히 있거라.', show: 'tattoo', pose: 'see-gasp', sora: '뼈로 만든 빗이야!', memo: '이 섬 말로 "타타우"란다. 문신을 뜻하는 "타투"가 여기서 온 말이지.', name: '무늬 새기는 할아버지', x: 0.42, w: 107, h: 309, lines: ['뼈 빗에 검은 물을 묻혀 톡톡 친단다.', '배에서 온 젊은이도 팔에 새기고 갔지.'] },
          { id: 'coconut', pass: '코코넛 있어요!', name: '코코넛 파는 아주머니', x: 0.53, w: 98, h: 280, lines: ['코코넛 물은 더울 때 제일이야.', '못 하나면 한 아름 준단다.'] },
          { id: 'breadboy', pass: '앗 뜨거, 앗 뜨거!', name: '열매 굽는 소년', x: 0.63, w: 85, h: 244, lines: ['빵나무 열매야. 불에 구워 먹어.', '속이 하얗고 폭신폭신해.'],
            try: { id: 'eat-breadfruit', verb: 'eat', name: '구운 빵나무 열매', face: 'yum', sora: '갓 구운 빵 같아! 고구마 같기도 해.' } },
          { id: 'sailor', pass: '히히, 못 하나로 이만큼!', show: 'nail', pose: 'see-aha', sora: '못 하나에 이걸 다 줘?', memo: '이 섬에서는 쇠가 아주 귀했단다. 그래서 못 하나가 보물이었지.', name: '못을 든 선원', x: 0.74, w: 116, h: 311, lines: ['여기선 못이 돈이야.', '단추 하나로도 과일 한 바구니를 줘.'] },
          { id: 'shipboy', pass: '와, 모래가 뜨거워!', name: '배의 심부름 소년', x: 0.85, w: 89, h: 287, lines: ['대위님은 오늘 요새에서 해를 보신대.', '금성이 해 앞을 지나간다나 봐.'] },
        ],
        spots: [],
      },
      {
        id: 'gate', name: '타히티 포트 비너스 문 앞', short: '요새 문 앞', zoom: 1.06, ground: 0.8, scale: 0.62, air: 'court', floor: 'dirt',
        sora: '말뚝 담이다! 요새인가 봐.',
        people: [
          { id: 'painter', pass: '저리 가, 파리들아!', show: 'flies', pose: 'see-gasp', sora: '파리가 그림을 먹었어!', memo: '파리 떼가 물감을 갉아 먹어서 화가가 애를 먹었단다.', name: '배의 화가', x: 0.14, w: 85, h: 276, lines: ['이 섬의 풀과 꽃을 다 그리는 중이야.', '칠하자마자 파리가 물감을 먹어 버려.'] },
          { id: 'botanist', pass: '오, 이것도 처음 보는 풀!', name: '풀 모으는 학자', x: 0.23, w: 104, h: 271, lines: ['이 섬의 풀은 거의 다 처음 본다네.', '말려서 종이 사이에 끼워 가져가지.'] },
          { id: 'smith', pass: '깡, 깡. 못 나가요!', name: '배의 대장장이', x: 0.34, w: 90, h: 266, lines: ['배에서 쓸 못과 쇠를 벼린다오.', '섬사람들이 쇠라면 눈을 못 떼지.'] },
          { id: 'galley', pass: '어휴, 덥다 더워.', name: '배의 요리사', x: 0.46, w: 103, h: 260, lines: ['오늘은 불 앞에 서기가 싫구먼.', '온도계가 이렇게 오른 건 처음이래.'] },
          { id: 'girl', pass: '안에 뭐가 있을까?', name: '궁금한 소녀', x: 0.57, w: 59, h: 207, lines: ['어른들이 긴 통으로 해를 봐.', '해를 보면 눈 아프다고 했는데.'] },
          { id: 'chief', pass: '허허, 오늘은 다들 바쁘구먼.', name: '타히티의 족장', x: 0.68, w: 102, h: 304, lines: ['이 사람들과 나는 친구란다.', '과일과 돼지를 보내 주곤 하지.'] },
          { id: 'sentry', pass: '멈춰라! 누구냐!', name: '문 지키는 보초', x: 0.85, w: 87, h: 320, lines: ['요새는 내가 지킨다.', '땀이 비 오듯 하는구나.'] },
        ],
        spots: [],
      },
      {
        id: 'fort', name: '타히티 포트 비너스 관측 터', short: '관측 터', zoom: 1.06, ground: 0.8, scale: 0.62, air: 'hush', floor: 'dirt',
        sora: '망원경이다! 다들 하늘만 봐.',
        people: [
          { id: 'caller', pass: '똑, 딱, 똑, 딱.', name: '시계 읽는 선원', x: 0.15, w: 96, h: 318, lines: ['시계가 몇 초인지 소리쳐 주는 일이야.', '한 번이라도 틀리면 큰일이지.'] },
          { id: 'captain', pass: '시각을 정확히 적게.', show: 'quadrant', pose: 'see-aha', sora: '놋쇠로 만든 부채 같아!', memo: '한 달 전에 도둑맞았다가 조각난 채로 되찾은 기구란다.', name: '쿡 대위', x: 0.26, w: 101, h: 320, lines: ['이 기구로 별의 높이를 잰다.', '이게 없으면 여기까지 온 보람이 없지.'] },
          { id: 'kid', pass: '나도 볼래, 나도!', name: '망원경이 궁금한 아이', x: 0.36, w: 71, h: 201, lines: ['저 통에 눈을 대면 해가 커진대.', '아저씨들이 종일 저것만 봐.'] },
          { id: 'green', pass: '저 점이… 지금!', show: 'transit', pose: 'see-wow', sora: '해에 까만 점이 있어!', memo: '저 점이 금성이란다. 해 앞을 한나절에 걸쳐 지나갔지.', name: '천문학자 그린', x: 0.47, w: 101, h: 303, lines: ['금성이 해 앞을 지나는 날이란다.', '끝날 때까지 눈을 뗄 수가 없어.'] },
          { id: 'clerk', pass: '사각사각.', name: '받아 적는 서기', x: 0.6, w: 93, h: 302, lines: ['부르시는 시각을 다 받아 적어.', '세 분이 본 시각이 조금씩 달라.'] },
          { id: 'priest', pass: '흠, 낮에 별을 본다고?', name: '타히티의 길잡이', x: 0.72, w: 109, h: 306, lines: ['우리도 별을 보고 바다를 건넌단다.', '저 사람들은 통으로 별을 보는구나.'] },
          { id: 'water', pass: '물이오, 물!', name: '물 나르는 선원', x: 0.85, w: 120, h: 291, lines: ['모래가 달아서 발이 익겠어.', '통에 든 물도 미지근해졌어.'] },
        ],
        spots: [],
      },
    ],
    // "The people who only look at the Sun" (core/tale.js; the user, 2026.10.9, of the
    // storyboard: "이대로 지어"): a coconut is taken from the woman on the beach to the
    // astronomer who has not left his telescope; the sentry turns her away because the
    // quadrant was stolen a month ago; the chief who got it back takes her in; she hands it
    // over, choosing what to say; and he lets her look.
    tale: {
      ask: '저 사람들은 왜 해만 볼까?',
      steps: [
        {
          who: 'coconut', goal: '바닷가의 코코넛 파는 아주머니에게 가 보렴.', holds: '코코넛: 아주머니가 들고 있음',
          lines: ['저 낯선 사람들, 아침부터 해만 쳐다봐.', '이 더위에 물 한 모금 안 마신단다.', '이 코코넛 좀 갖다 줄래?'],
          offer: { ask: '코코넛을 갖다줄까?', label: '내가 갖다줄게요' },
          errand: 'took',
        },
        {
          who: 'sentry', goal: '오른쪽 곶의 요새 문으로 가 보렴.', holds: '코코넛: 소라가 들고 있음',
          lines: ['멈춰라! 오늘은 아무도 못 들어간다.', '한 달 전에 큰 놋쇠 기구를 도둑맞았거든.'],
          sora: '코코넛만 주면 되는데… 어? 족장님이 불러!',
        },
        {
          who: 'chief', call: '얘야, 이리 와 보렴.', goal: '타히티의 족장이 부른다. 가 보렴.', holds: '코코넛: 소라가 들고 있음',
          lines: ['그 기구는 내가 찾아 주었단다.', '조각조각 나 있었지만 다 돌아왔지.', '나와 함께라면 문을 열어 줄 게다.'],
          after: [{ who: 'sentry', line: '족장님의 손님이군. 들어가라!' }],
          sora: '문이 열렸어! 안으로 가자!',
        },
        {
          who: 'green', goal: '요새 안의 천문학자에게 코코넛을 전하렴.', holds: '코코넛: 소라가 들고 있음',
          lines: ['누구냐… 코코넛? 아이고, 살았다!'],
          choice: {
            ask: '코코넛을 건네며 뭐라고 할까?',
            options: [
              { id: 'E1', label: '"천천히 드세요"', sora: '천천히 드세요. 바닷가 아주머니가 보냈어요.', says: '고맙구나. 답례로 좋은 걸 보여 주마.' },
              { id: 'E2', label: '"뭘 그렇게 보세요?"', sora: '아침부터 뭘 그렇게 보세요?', says: '하하, 궁금하지? 너도 한번 보렴.' },
            ],
          },
          errand: 'gave',
        },
        {
          who: 'green', show: true, goal: '천문학자의 망원경을 들여다보렴.',
          lines: ['이 통에 눈을 대 보렴.', '해 위의 까만 점, 저게 금성이란다.'],
          sora: '해에 점이 있어! 저게 별이라고?',
          errand: 'saw',
        },
      ],
      asides: [
        { who: 'coconut', when: ['S1', 'S2', 'S3', 'S4'], lines: ['해를 보는 사람들은 요새 안에 있어.', '요새는 오른쪽 곶에 있단다.'] },
        { who: 'coconut', when: ['S5'], lines: ['다 마셨다니 다행이구나!', '해에 점이 있었다고? 신기하네.'] },
      ],
      done: '코코넛을 전하고, 해를 지나는 금성을 보았다.',
    },
    errands: [
      { id: 'took', text: '코코넛을 받는다.', at: [] },
      { id: 'gave', text: '천문학자에게 코코넛을 전한다.', at: [] },
      { id: 'saw', text: '해를 지나는 금성을 본다.', at: [] },
    ],
    reply: '그날 잰 시각으로 해까지의 거리를 셈하려 했단다. 금성은 105년 뒤에야 다시 해를 지났지.',
  },
  // The first leaf: grandmother's village on the night of 21 July 1969, the one day in
  // the notebook she saw herself (the user, 2026.10.8, of the places made in Paris's
  // look: "할머니의 마을을 안 바꿨네"). It is night (`night`): the people are dimmed a
  // little and the computed sky, with that night's moon, stands over the roofs.
  // The girl with bobbed hair at the end of the bench is grandmother: seen, not spoken to.
  // To be checked: that it was shown again that evening, four days' flight, that the
  // two were still on the Moon at nine (they left at 02:54 on the 22nd, Korean time).
  yard1969: {
    dir: 'yard', look: 'paper', talk: 'face', night: true,
    scenes: [
      {
        id: 'lane', name: '할머니의 마을 길', short: '마을 길', zoom: 1.3, ground: 0.698, scale: 0.66, air: 'night', floor: 'dirt',
        sora: '밤인데 다들 어디로 가?',
        // Children run along the lane and in at the open gate.
        moving: [
          { kind: 'drift', id: 'kids', src: 'kids', from: 0, to: 0.645, foot: 0.695, tall: 0.13, wide: 0.379, gap: 0.9, speed: 0.07, bob: 0.006 },
        ],
        people: [
          { id: 'shop', pass: '어여 와라. 시원한 거 있다.', name: '구멍가게 아주머니', x: 0.159, w: 129, h: 297, lines: ['사이다 한 병 줄까? 찬물에 담가 놨다.', '다들 테레비 보러 가서 가게가 비었네.'],
            try: { id: 'eat-cider', verb: 'eat', name: '사이다', face: 'yum', sora: '톡 쏴! 진짜 차갑다.' } },
          { id: 'kettle', pass: '어이쿠, 넘치겠네.', name: '주전자 든 아저씨', x: 0.26, w: 137, h: 320, lines: ['막걸리 받아 가는 길이여.', '달나라 구경에 술이 빠지면 쓰나.'] },
          { id: 'grandpa', pass: '허허, 덥구먼.', name: '부채 든 할아버지', x: 0.38, w: 155, h: 314, lines: ['살다 살다 달에 사람이 가는구먼.', '계수나무는 어찌 됐나 물어봐야지.'] },
          { id: 'dog', pass: '컹!', name: '누렁이', x: 0.47, w: 84, h: 125, lines: ['멍멍!', '(꼬리를 흔든다)'] },
          { id: 'runboy', pass: '빨리, 빨리!', show: 'rabbit', pose: 'see-gasp', sora: '토끼가… 없어?', memo: '그날 아이들이 방송국에 전화를 걸었단다. 달에 토끼가 안 보인다고.', name: '뛰어가는 아이', x: 0.57, w: 113, h: 213, lines: ['빨리 와! 테레비에 달 나온대!', '근데 토끼가 안 보인대!'] },
          { id: 'sister', pass: '자장자장…', name: '동생 업은 누나', x: 0.8, w: 118, h: 269, lines: ['동생 재우고 가야 하는데.', '업고라도 가서 볼 거야.'] },
        ],
        spots: [],
      },
      {
        id: 'yard', name: '마을 이웃집 마당', short: '이웃집 마당', zoom: 1.3, ground: 0.7, scale: 0.66, air: 'tv', floor: 'dirt',
        sora: '다들 텔레비전만 봐. 조용해.',
        moving: [
          { kind: 'drift', id: 'in', src: 'villagers', from: 0, to: 1, foot: 0.696, tall: 0.17, wide: 0.29, gap: 0.8, speed: 0.024, bob: 0.003 },
        ],
        people: [
          { id: 'owner', pass: '어여 와. 테레비 구경하고 가.', show: 'tv', pose: 'see-peer', sora: '어? 화면이 거꾸로야!', memo: '달에서 온 첫 화면은 거꾸로였단다. 사진기가 거꾸로 달려 있었거든.', name: '집주인 아저씨', x: 0.119, w: 105, h: 308, lines: ['마루 끝에 내놨지. 다들 보라고.', '동네에 한 대뿐인 테레비여.'] },
          { id: 'melon', pass: '수박 먹어라, 수박.', name: '수박 든 아주머니', x: 0.3, w: 110, h: 292, lines: ['수박 먹고들 봐요. 우물에 담갔던 거야.', '낮에도 봤는데 또 봐도 신기해.'],
            try: { id: 'eat-melon', verb: 'eat', name: '수박', face: 'yum', sora: '우물에 담가서 시원해!' } },
          { id: 'corn', pass: '냠냠.', name: '옥수수 먹는 아이', x: 0.44, w: 87, h: 214, lines: ['저 아저씨들 통통 뛰어다녀!', '달에서는 몸이 가볍대.'] },
          { id: 'chief', pass: '조용, 조용! 나온다!', name: '이장님', x: 0.56, w: 134, h: 320, lines: ['서울 남산에선 큰 화면으로 본다네.', '온 세상이 같이 보고 있다는구먼.'] },
          { id: 'soldier', pass: '충성! …아, 버릇이네요.', name: '휴가 나온 군인', x: 0.816, w: 97, h: 303, lines: ['휴가 나왔다가 이걸 다 보네요.', '로켓이 나흘을 날아갔답니다.'] },
          { id: 'sleepy', pass: '하암…', name: '졸린 꼬마', x: 0.881, w: 78, h: 198, lines: ['졸려… 그래도 다 볼 거야.', '(눈을 비빈다)'] },
        ],
        spots: [
          // She stands a little to the girl's right, so as not to hide her.
          { id: 'girl', from: 0.715, to: 0.8, sora: '저 애가… 할머니야?', memo: '그래, 평상 끝의 그 단발머리가 나란다.' },
        ],
      },
      {
        id: 'bank', name: '마을 냇가 둑길', short: '냇가 둑길', zoom: 1.25, ground: 0.74, scale: 0.86, air: 'night', floor: 'dirt',
        sora: '달이 떴어. 조용하다.',
        moving: [
          { kind: 'drift', id: 'stroll', src: 'villagers', from: 0, to: 1, foot: 0.736, tall: 0.17, wide: 0.29, gap: 1.4, speed: -0.02, bob: 0.003, flip: true },
        ],
        people: [
          { id: 'radio', pass: '쉿, 중계 나와요. 들어 봐요.', show: 'radio', pose: 'see-aha', sora: '건전지를 고무줄로 묶었구나!', name: '라디오 든 청년', x: 0.123, w: 95, h: 249, lines: ['라디오로도 중계를 해 줘요. 볼래요?', '지금도 둘은 달 위에 있대요.'],
            try: { id: 'use-radio', verb: 'use', name: '라디오', sora: '지지직… 사람 목소리가 나와.' } },
          { id: 'schoolgirl', pass: '달이 참 예쁘다.', name: '여학생', x: 0.21, w: 74, h: 200, lines: ['나도 커서 달에 가 보고 싶어.', '선생님이 꼭 보라고 하셨어.'] },
          { id: 'granny', pass: '세상 참 좋아졌어.', name: '달 보는 할머니', x: 0.34, w: 99, h: 217, lines: ['저 달에 사람이 갔다니, 원.', '토끼는 놀라 달아났겠구먼.'] },
          { id: 'point', pass: '저기야, 저기!', name: '달을 가리키는 아이', x: 0.63, w: 72, h: 192, lines: ['저기! 저기 사람이 있대!', '손 흔들면 보일까?'] },
          { id: 'angler', pass: '쉿, 고기 달아나.', name: '낚시하는 아저씨', x: 0.73, w: 115, h: 320, lines: ['고기는 안 물고 달만 밝네.', '물에도 달이 하나 떠 있구먼.'] },
          { id: 'hut', pass: '수박 서리하면 혼난다!', name: '원두막 아저씨', x: 0.88, w: 100, h: 245, lines: ['수박밭 지키다 달 구경하네.', '오늘 달은 반쪽도 안 돼.'] },
        ],
        spots: [
          { id: 'moon', from: 0.42, to: 0.56, sora: '저 달에 지금 사람이 있는 거야?', memo: '지금 저 위에 두 사람이 있단다. 읽은 게 아니라 내가 본 날이지.' },
        ],
      },
    ],
    errands: [
      { id: 'tv', text: '텔레비전이 어디 놓였던지 보고 오렴. 마루 끝이었지 싶다.', at: ['owner'] },
      { id: 'girl', text: '평상 끝에 앉은 단발머리를 찾아보렴.', at: ['girl'] },
      { id: 'moon', text: '둑에 나가 달을 올려다보렴. 지금 저기 사람이 있단다.', at: ['moon'] },
    ],
    reply: '다 보고 왔구나. 그날 밤이 지금도 눈에 선하단다.',
  },
  // Seoul, 17 September 1988, a Saturday: the opening of the Games at the Olympic Stadium in
  // Jamsil, in pixels like Rome. Looked up on 2026.10.8 before a word was written (the
  // sources: the National Archives, newspapers of the day, encyclopaedias): it began at
  // 10:30 under a sky without a cloud; boats on the Han came first; the teams came in in
  // the order of the Korean alphabet, Greece first and Korea last; 160 countries; 2,400
  // doves as the flag went up; Sohn Kee-chung, 76, brought the flame in and three people
  // rode a lift up to light it together; thirty parachutists drew the five rings in the
  // sky; and when the taekwondo display had left the grass a boy in his first year of
  // school crossed it alone with a hoop, stopped in the middle and waved. He was born on
  // 30 September 1981, the day Seoul was chosen. Hodori's name was chosen from 2,295 sent
  // in; 27,221 volunteers; a child's bus fare was 70 won, paid with a paper ticket; colour
  // television since December 1980. More than seventy thousand watched (Korean papers say
  // a hundred thousand). Not found, and so not said: the price of anything sold in the
  // street, what the volunteers wore, the colour of the telephones and the buses.
  // Grandmother was thirty-four and saw it on television.
  seoul88: {
    dir: 'seoul88',
    scenes: [
      {
        id: 'road', name: '서울 잠실 올림픽로', short: '올림픽로', zoom: 1.08, ground: 0.72, scale: 0.62, air: 'street',
        sora: '가게마다 호랑이 인형이야!',
        people: [
          { id: 'tourist', pass: '오우, 어디로 가지…', name: '외국인 관광객', x: 0.18, w: 148, h: 320, lines: ['160개국에서 참여했대요. 나도 왔죠!', '동쪽 서쪽이 다 모였어요.'] },
          { id: 'caller', pass: '여보세요? 나야, 나.', name: '전화 거는 회사원', x: 0.28, w: 132, h: 307, lines: ['집에 걸었어. 텔레비전 켜 두라고.', '컬러 방송이 여덟 해째거든.'] },
          { id: 'gimbap', pass: '김밥이요, 김밥!', show: 'clock', pose: 'see-aha', sora: '시계를 한 시간 앞으로 돌렸네!', memo: '그해에는 온 나라가 시계를 한 시간 앞당겨 썼단다.', name: '김밥 장수', x: 0.42, w: 145, h: 297, lines: ['열 시 반에 벌써 시작했어.', '올해는 시계를 한 시간 당겨 쓰잖아. 썸머 타임이라고 하던가?'],
            try: { id: 'eat-gimbap', verb: 'eat', name: '김밥', face: 'yum', sora: '참기름 냄새! 한 줄 다 먹을래.' } },
          { id: 'vendor', pass: '호돌이 사 가세요, 호돌이!', show: 'hodori', pose: 'see-wow', sora: '상모 쓴 호랑이네! 귀엽다.', memo: '상모의 긴 끈은 서울의 S란다. 이름은 이천이백 통에서 뽑았지. 짝은 호순이야.', name: '기념품 장수', x: 0.58, w: 177, h: 319, lines: ['호돌이요. 상모 쓴 아기 호랑이.', '이름은 온 국민이 지어 보냈다오.'],
            try: { id: 'wear-sangmo', verb: 'wear', name: '상모', outfit: 'sangmo', sora: '고개를 돌리면 띠가 빙글빙글!', memo: '농악에서 쓰는 모자란다. 호돌이도 이걸 썼지.' } },
          { id: 'flagboy', pass: '대한민국! 짝짝짝!', name: '깃발 든 아이', x: 0.69, w: 133, h: 276, lines: ['버스 타고 왔어. 나는 칠십 원!', '토큰 말고 회수권 냈어.'] },
          { id: 'guide', pass: '경기장은 이쪽이에요!', name: '자원봉사 누나', x: 0.78, w: 159, h: 299, lines: ['길 안내를 맡았어요. 저쪽이에요.', '자원봉사자가 이만 칠천 명이에요.'] },
          { id: 'traffic', pass: '삐익! 이쪽으로, 이쪽!', name: '교통 정리 아저씨', x: 0.86, w: 183, h: 310, lines: ['천천히, 밀지 말고 가시오.', '칠만 명이 넘게 왔다니, 원.'] },
        ],
        spots: [],
      },
      {
        id: 'gate', name: '서울 잠실 올림픽주경기장 앞', short: '주경기장 앞', zoom: 1.2, ground: 0.75, scale: 0.66, air: 'court',
        sora: '우와, 지붕이 물결 같아.',
        people: [
          { id: 'hanbok', pass: '어서 오세요, 환영합니다.', name: '한복 입은 도우미', x: 0.15, w: 132, h: 288, lines: ['선수들은 가나다 차례로 들어왔어요.', '그리스가 맨 앞, 우리가 맨 끝이죠.'] },
          { id: 'grandpa', pass: '허허, 살다 보니 이런 날이.', name: '신문 든 할아버지', x: 0.25, w: 155, h: 311, lines: ['손기정 선수가 성화를 들고 뛰었어!', '일흔여섯에 그리 뛰다니, 원.'] },
          { id: 'balloon', pass: '풍선아, 날아가지 마.', name: '풍선 든 아이', x: 0.35, w: 123, h: 320, lines: ['아까 비둘기가 엄청 많이 날았어!', '하얀 새가 하늘을 다 덮었어.'] },
          { id: 'photo', pass: '사진 한 장 보고 가요!', show: 'rings', pose: 'see-gasp', sora: '사람이 하늘에 그린 거야?!', memo: '낙하산 탄 서른 명이 다섯 빛깔로 하늘에 오륜을 그렸단다.', name: '즉석 사진사', x: 0.45, w: 126, h: 296, lines: ['방금 찍었소. 하늘의 동그라미 다섯!', '낙하산 탄 서른 명이 그린 거요.'] },
          { id: 'usher', pass: '표 보여 주세요!', name: '표 받는 안내원', x: 0.57, w: 115, h: 300, lines: ['표는 반을 찢어 드려요.', '벌써 한창이에요. 얼른 들어가요!'] },
          { id: 'reporter', pass: '네, 여기는 잠실입니다!', name: '방송 기자', x: 0.7, w: 146, h: 302, lines: ['맨 처음은 한강의 배 행렬이었습니다.', '하늘엔 구름 한 점 없습니다!'] },
          { id: 'water', pass: '물 드세요, 시원한 물!', name: '물 주는 청년', x: 0.82, w: 118, h: 299, lines: ['목마르면 드세요. 그냥 드려요.', '경기장이 백자 항아리를 닮았대요.'] },
        ],
        spots: [],
      },
      {
        id: 'stand', name: '서울 잠실 올림픽주경기장 안', short: '주경기장 안', zoom: 1.06, ground: 0.8, scale: 0.62, air: 'hush',
        sora: '어? 왜 이렇게 조용해?',
        people: [
          { id: 'granny', pass: '아이고, 좋은 날이다.', name: '눈물 닦는 할머니', x: 0.14, w: 140, h: 300, lines: ['내 생전에 이런 걸 다 보는구나.', '온 세상 사람이 우리 집에 왔어.'] },
          { id: 'drinks', pass: '(작게) 음료수 있어요…', name: '음료 파는 아이', x: 0.24, w: 150, h: 311, lines: ['지금은 조용히 팔아야 해요.', '태권도 때는 다들 소리쳤는데.'] },
          { id: 'binoc', pass: '쉿… 저 아이 좀 봐.', show: 'hoop', pose: 'see-peer', sora: '혼자야. 저 넓은 데를 혼자.', memo: '서울이 올림픽을 따낸 날 태어난 아이란다. 나는 텔레비전으로 봤지.', name: '쌍안경 든 아가씨', x: 0.37, w: 154, h: 314, lines: ['국민학교 일학년이래. 혼자 나왔어.', '한가운데서 손을 흔들었어!'],
            try: { id: 'use-binoc', verb: 'use', name: '쌍안경', sora: '손을 흔들어! 나도 흔들래.' } },
          { id: 'hush', pass: '(숨을 죽인다)', name: '숨죽인 아이', x: 0.6, w: 106, h: 262, lines: ['쉿! 지금은 조용히 하는 거래.', '아까는 태권도 형들이 천 명이었어.'] },
          { id: 'official', pass: '뷰티풀… 원더풀.', name: '외국 선수단 임원', x: 0.69, w: 130, h: 320, lines: ['아이 하나에 온 경기장이 조용하오.', '이런 개회식은 처음 보오.'] },
          { id: 'fan', pass: '저기 봐, 저 불!', show: 'cauldron', pose: 'see-wow', sora: '세 사람이 같이 붙였구나!', memo: '선생님, 달리기 선수, 춤추는 학생. 세 사람이 함께 붙였단다.', name: '부채 든 아저씨', x: 0.8, w: 148, h: 317, lines: ['성화는 세 사람이 같이 붙였어.', '승강기를 타고 저 위로 올라갔지.'] },
          { id: 'radio', pass: '라디오도 숨을 죽이네.', name: '라디오 듣는 아저씨', x: 0.9, w: 148, h: 314, lines: ['끝에는 다 같이 노래를 한대.', '손에 손잡고, 그 노래 말이야.'] },
        ],
        spots: [
          // The boy with the hoop, far out on the grass: seen, not spoken to.
          { id: 'hoopboy', from: 0.44, to: 0.54, sora: '굴렁쇠가 또르르… 정말 조용해.', memo: '잔디 위에 아이 하나뿐이었단다. 다들 숨을 죽였지.' },
        ],
      },
    ],
    errands: [
      { id: 'hodori', text: '호돌이를 찾아보렴. 상모 쓴 아기 호랑이란다.', at: ['vendor'] },
      { id: 'rings', text: '하늘에 그린 동그라미 다섯을 본 사람을 찾아보렴.', at: ['photo'] },
      { id: 'hoop', text: '굴렁쇠 굴리는 아이를 보고 오렴. 나는 텔레비전으로만 봤단다.', at: ['hoopboy', 'binoc'] },
    ],
    reply: '굴렁쇠 아이를 봤구나. 그날 온 나라가 숨을 죽였단다.',
  },
  // Milan in the summer of 1497, about noon: Leonardo is painting the Last Supper on the
  // refectory wall of Santa Maria delle Grazie (the user, 2026.10.8: "최후의 만찬 그리던 날로
  // 가볼까"). The three scenes are the walk Matteo Bandello saw him take: from the Corte
  // Vecchia, where the clay horse stood, across the town at midday to the convent, to give
  // the wall a stroke or two and go. Looked up on 2026.10.8 and found so (docs/신기한-사실.md
  // section 10): Bandello's account (from dawn to dusk without eating; three or four days
  // without touching it, looking for an hour or two; the walk at noon with the sun in Leo);
  // the duke's letter of 29 June 1497 to Marchesino Stanga urging that the work be finished;
  // the nail hole at Christ's temple and the lines struck from it; the eel and the slices of
  // orange on the painted table; tempera on a dry wall; Montorfano's Crucifixion on the wall
  // opposite, dated 1495; the clay horse of more than seven metres and the bronze sent to
  // Ferrara for cannon in 1494; Pacioli's book and Leonardo's drawings of solids for it; the
  // memo to board up the upper room and try the machine from the roof where the men on the
  // cathedral would not see; his writing from right to left; melon among what his household
  // bought; the cathedral begun in 1386, its marble brought by water from Candoglia free of
  // tolls and marked AUF; Milan's armourers. Bandello entered the convent as a boy (his
  // birth is given as 1484 or 1485): he is the novice, and unnamed. Leonardo is a spot.
  // Made up: everyone's words, the duke's messenger in the yard, that Leonardo passed the dock.
  cenacolo: {
    dir: 'milan1497',
    scenes: [
      {
        id: 'court', name: '밀라노 코르테 베키아 뜰', short: '코르테 베키아', zoom: 1.02, ground: 0.8, scale: 0.62, air: 'court',
        sora: '옛 궁전 뜰이래. 저 말 좀 봐!',
        people: [
          { id: 'salai', pass: '헤헤, 스승님 공책이다.', name: '화가의 제자', x: 0.18, w: 149, h: 300, lines: ['스승님은 글씨를 거꾸로 써.', '거울에 비춰야 읽혀. 볼래?'],
            then: [{ after: 'letter', lines: ['스승님? 방금 나가셨어.', '대성당 뒤 나루 쪽으로 가셨을걸.'] }],
            try: { id: 'use-mirror', verb: 'use', name: '거울', sora: '오, 거울 속에선 똑바로야!', memo: '레오나르도는 글씨를 오른쪽에서 왼쪽으로 썼단다.' } },
          { id: 'clayboy', pass: '영차, 갈라진 데 메워야지!', name: '진흙 나르는 견습생', x: 0.26, w: 116, h: 276, lines: ['이 말은 전부 흙으로 빚었어.', '어른 키의 네 배가 넘는대.'] },
          { id: 'founder', pass: '에휴, 내 쇳물…', name: '쇠 녹이는 장인', x: 0.34, w: 126, h: 319, lines: ['청동을 부어 굳히려던 말이오.', '그 청동은 대포 만들러 가 버렸소.'] },
          { id: 'pacioli', pass: '모서리가 몇 개인고…', show: 'solid', pose: 'see-aha', sora: '속이 다 들여다보여!', memo: '수학 선생의 책에 레오나르도가 그림을 그려 주었단다.', name: '수학 선생 수도사', x: 0.64, w: 145, h: 319, lines: ['내 책의 그림은 그 친구가 그렸네.', '뼈대만 그려서 뒤쪽까지 보이지.'] },
          { id: 'mechanic', pass: '쉿, 위층은 비밀이오.', show: 'wing', pose: 'see-gasp', sora: '날개잖아! 사람이 타는 거야?', memo: '지붕에서 날아 볼 궁리를 했단다. 성당 일꾼들 눈을 피해서.', name: '기계 만드는 조수', x: 0.72, w: 156, h: 312, lines: ['위층 방은 널빤지로 막아 놨소.', '대성당 일꾼들이 못 보게 말이오.'] },
          { id: 'messenger', pass: '공작님의 분부요!', name: '공작의 심부름꾼', x: 0.79, w: 143, h: 320, lines: ['"그림을 어서 끝내라"는 편지요.', '화가 양반이 없구려. 네가 전해 주련?'],
            then: [{ after: 'letter', lines: ['고맙다! 나는 숨 좀 돌리겠소.', '공작님은 성미가 급하시다오.'] }] },
          { id: 'lutist', pass: '랄라, 한낮의 노래~', name: '류트 타는 악사', x: 0.86, w: 153, h: 312, lines: ['한낮엔 다들 그늘에서 쉬지요.', '저 말 앞에서 타면 소리가 울려요.'] },
        ],
        spots: [
          { id: 'horse', from: 0.42, to: 0.56, sora: '말이 집보다 커! 전부 흙이래.', memo: '청동으로 만들려던 말이란다. 끝내 흙으로만 남았지.' },
        ],
      },
      {
        id: 'dock', name: '밀라노 대성당 뒤 나루', short: '대성당 나루', zoom: 1.12, ground: 0.8, scale: 0.62, air: 'market',
        sora: '성당을 아직 짓는 중이네!',
        people: [
          { id: 'armourer', pass: '땅, 땅! 밀라노 갑옷이오!', name: '갑옷 장인', x: 0.17, w: 168, h: 308, lines: ['밀라노 갑옷은 먼 나라에서도 사 가오.', '한번 입어 보겠소? 꽤 무겁소.'],
            try: { id: 'wear-armor', verb: 'wear', name: '밀라노 갑옷', outfit: 'armor', sora: '철컹철컹! 걷기 힘들어.', memo: '그때 밀라노는 갑옷으로 이름난 도시였단다.' } },
          { id: 'melon', pass: '멜론이오, 단 멜론!', name: '멜론 파는 아주머니', x: 0.28, w: 170, h: 291, lines: ['한낮엔 멜론이 제일이지.', '화가 양반 댁도 멜론을 사 간다우.'],
            try: { id: 'eat-melon', verb: 'eat', name: '멜론', face: 'yum', sora: '달고 시원해! 꿀 같아.' } },
          { id: 'waterboy', pass: '물이오, 비켜요!', name: '물 긷는 소년', x: 0.37, w: 160, h: 272, lines: ['화가 아저씨? 방금 지나갔어.', '땡볕에 수도원 쪽으로 걸어갔어.'] },
          { id: 'boatman', pass: '돌 왔소, 성당 돌!', show: 'marble', pose: 'see-aha', sora: '돌에 글자가 있어. A, U, F?', memo: '"성당 짓는 데 쓴다"는 라틴말의 첫 글자란다. 이 표시가 있으면 뱃길에서 돈을 안 냈지.', name: '대리석 배 뱃사공', x: 0.5, w: 158, h: 320, lines: ['먼 호숫가 산에서 물길로 왔소.', '성당 돌은 뱃길에서 돈을 안 내오.'] },
          { id: 'mason', pass: '깡, 깡. 돌가루 조심!', name: '대성당 석공', x: 0.76, w: 135, h: 304, lines: ['이 성당은 백 년 넘게 짓고 있소.', '내 손자 때나 다 될는지, 원.'] },
          { id: 'laundress', pass: '아이, 볕이 따갑기도 하지.', name: '빨래하는 처녀', x: 0.63, w: 153, h: 295, lines: ['이 물길로 배가 도시 안까지 와요.', '돌도 장작도 다 배로 온답니다.'] },
          { id: 'silk', pass: '비단이오, 고운 비단!', name: '비단 장수', x: 0.86, w: 167, h: 317, lines: ['수도원은 서쪽 성문 쪽이라오.', '식당 벽 그림이 몇 해째라지요.'] },
        ],
        spots: [],
      },
      {
        id: 'hall', name: '밀라노 그라치에 수도원 식당', short: '수도원 식당', zoom: 1.12, ground: 0.77, scale: 0.62, air: 'hush',
        // The painting on the wall may be touched: a photograph of it as it is today
        // (Wikimedia Commons, "Última Cena - Da Vinci 5.jpg", in the public domain) and what
        // is known of it. box: left, top, right, bottom, as shares of the scene's picture.
        looks: [
          { id: 'supper', box: [0.245, 0.195, 0.758, 0.53], photo: 'photo-supper.webp', name: '최후의 만찬', when: '레오나르도 다빈치 · 1495년쯤 시작해 1498년에 끝냄',
            text: [
              '가로 8.8미터, 세로 4.6미터입니다. 식당의 벽 한 면이 통째로 그림입니다.',
              '젖은 회벽에 빨리 그리는 법 대신 마른 벽에 달걀 물감으로 천천히 그렸습니다. 그래서 스무 해 만에 벗겨지기 시작했습니다.',
              '아래 한가운데의 네모난 자국은 1652년에 낸 문입니다. 그림이 알아보기 어려울 만큼 흐려진 때였습니다.',
              '1978년부터 스물한 해 동안 손질해 1999년에 마쳤습니다. 지금도 밀라노의 그 식당 벽에 있습니다.',
            ],
            credit: '사진: 위키미디어 공용, 공개 저작물' },
        ],
        sora: '벽 한가득 그림이야.',
        people: [
                    { id: 'gentleman', pass: '허, 살아 있는 것 같군.', name: '구경 온 신사', x: 0.17, w: 145, h: 320, lines: ['맞은편 벽 그림은 두 해 전에 끝났소.', '빨리 끝났지. 그런데 다들 이쪽만 보오.'] },
          { id: 'prior', pass: '흠, 그림은 언제 끝나나.', name: '수도원장', x: 0.25, w: 139, h: 299, lines: ['사흘 나흘씩 붓도 안 댈 때가 있소.', '게으른 게요! 공작님께 일렀소.'] },
          { id: 'grinder', pass: '쓱쓱, 곱게 갈아야지.', name: '물감 개는 조수', x: 0.33, w: 136, h: 308, lines: ['마른 벽에 달걀 물감으로 그려요.', '그래서 며칠 뒤에도 고칠 수 있죠.'] },
          { id: 'carpenter', pass: '실이 팽팽해야 하오.', show: 'nail', pose: 'see-peer', sora: '못 하나에서 줄이 다 나와!', memo: '한가운데 못을 박고 실을 당겨 줄을 그었단다. 못 자국이 지금도 있지.', name: '발판 세운 목수', x: 0.41, w: 160, h: 303, lines: ['한가운데 못에 실을 매어 당겼소.', '그림 속 줄이 다 그리로 모이오.'] },
          { id: 'cook', pass: '오늘 저녁은 장어라오.', show: 'eel', pose: 'see-wow', sora: '그림 속 접시에 장어가 있어!', memo: '구운 장어와 오렌지. 그때 귀하게 치던 요리를 그려 넣었단다.', name: '부엌 수도사', x: 0.5, w: 163, h: 273, lines: ['식탁 그림에 우리 음식이 있다오.', '구운 장어에 오렌지 조각이지.'] },
          { id: 'novice', pass: '(위를 올려다본다)', name: '어린 수련 수도사', x: 0.8, w: 122, h: 268, lines: ['한 번 그으려고 한 시간을 보세요.', '그리는 날은 밥도 잊고 저물 때까지요.'] },
          { id: 'secretary', pass: '공작님이 또 물으시오.', name: '공작의 비서', x: 0.87, w: 147, h: 306, lines: ['유월에도 재촉하는 편지가 왔소.', '또 보내셨다니, 공작님도 참.'] },
        ],
        spots: [
          // Leonardo on the scaffold: seen, not spoken to.
          { id: 'leonardo', from: 0.6, to: 0.74, sora: '찾았다! …붓을 들고 보기만 해.', memo: '붓질 한두 번만 하고 가 버리는 날도 있었단다. 그 그림이 "최후의 만찬"이야.' },
        ],
      },
    ],
    // The tale (the user, 2026.10.8: "하나하나가 옴니버스 이야기가 되는데, 기승전결이 있으면
    // 좋겠어. 할머니의 쪽지는 좀 약한 것 같아"; Milan is the first place tried this way). She is
    // handed the duke's letter (begin), follows the painter across the town (go on), finds
    // him doing nothing, as it seems, and is told what he is doing (turn), and chooses
    // whether to hand him the letter (end). That the duke urged him by letter is on record
    // (29 June 1497, to his secretary); that a letter was carried to the wall is made up.
    story: {
      ask: '그 화가는 왜 그리 늦었을까?',
      choice: {
        ask: '재촉하는 편지를 전할까?',
        options: [
          { id: 'give', label: '편지를 발판에 올려 둔다', sora: '편지 왔어요! …쳐다보지도 않네.', reply: '재촉해도 소용없었단다. 한 번 긋자고 한 시간을 보던 사람이니까. 그림은 이듬해에 끝났지.' },
          { id: 'keep', label: '전하지 않고 기다린다', sora: '지금은 방해하면 안 될 것 같아.', reply: '잘했다. 한 번 긋자고 한 시간을 보던 사람이란다. 그림은 이듬해에 끝났고 지금도 그 벽에 있지.' },
        ],
      },
    },
    errands: [
      { id: 'letter', text: '뜰에서 쩔쩔매는 사람을 도와주렴.', at: ['messenger'], sora: '제가 전해 줄게요! 화가는 어디 있지?' },
      { id: 'trail', text: '화가가 어디로 갔는지 나루에서 물어보렴.', at: ['waterboy'], sora: '수도원이래. 얼른 따라가자!' },
      { id: 'supper', text: '화가가 왜 붓을 안 대는지 알아보렴.', at: ['novice'], sora: '게으른 게 아니었어. 보고 있었던 거야.' },
    ],
    reply: '그 화가를 봤구나. 그 그림은 지금도 그 벽에 있단다.',
  },
};
