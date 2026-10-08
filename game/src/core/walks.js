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
    dir: 'rome',
    scenes: [
      {
        id: 'market', name: '로마 시장 거리', zoom: 1.25, ground: 0.765, scale: SHEET.market, air: 'market',
        sora: '사람이 엄청 많아! 냄새도 나.',
        people: [
          { id: 'baker', pass: '빵이오! 갓 구운 빵!', name: '빵 장수', x: 0.163, w: 123, h: 284, lines: ['갓 구웠어요. 여덟 쪽으로 갈라 드셔요.', '경기장 덕에 오늘은 벌써 동났네.'] },
          { id: 'boy', pass: '비켜요, 비켜! 바빠요!', name: '심부름 소년', x: 0.228, w: 132, h: 248, lines: ['주인님 빵 받으러 왔어. 늦으면 혼나.', '나도 경기장 가 보고 싶다.'] },
          { id: 'garum', pass: '생선 소스! 구경하고 가쇼!', show: 'garum', pose: 'see-peer', name: '생선 소스 장수', x: 0.31, w: 150, h: 299, lines: ['히스파니아에서 배로 온 거요. 한 국자?', '냄새는 지독해도 맛은 황제 것이오.'],
            try: { id: 'eat-garum', verb: 'eat', name: '생선 소스', face: 'yuck', sora: '으엑! 생선 썩은 맛이야!', memo: '로마의 간장이란다. 냄새는 지독한데 없으면 못 살았대.' } },
          { id: 'dormouse', pass: '귀한 구이요! 보고 가쇼.', show: 'dormouse', pose: 'see-gasp', name: '겨울잠쥐 장수', x: 0.39, w: 219, h: 290, lines: ['항아리에서 살찌운 놈이오.', '꿀 발라 구웠소. 귀한 손님상 거요.'],
            try: { id: 'eat-dormouse', verb: 'eat', name: '겨울잠쥐 구이', face: 'hmm', sora: '쥐… 쥐라고? 닭고기 맛인데.', memo: '쥐를 항아리에서 살찌워 먹었단다. 귀한 손님상에 올랐지.' } },
          { id: 'lady', pass: '어머, 사람이 왜 이리 많니.', name: '귀부인', x: 0.47, w: 133, h: 320, lines: ['새 경기장? 자리는 신분대로 앉는단다.', '여자 자리는 맨 뒤쪽이라지 뭐니.'] },
          { id: 'maid', pass: '아이고, 무거워라.', name: '하녀', x: 0.535, w: 123, h: 276, lines: ['마님 짐이 무거워요. 구경은 가요!', '뒤에서도 잘 보인대요.'] },
          { id: 'reader', pass: '소식이오, 오늘의 소식!', name: '글 읽는 노인', x: 0.635, w: 165, h: 296, lines: ['오늘의 소식! 새 경기장이 문을 연다!', '글 모르는 이는 내게 오시오. 한 닢.'] },
          { id: 'dog', pass: '킁킁.', name: '개', x: 0.74, w: 101, h: 153, lines: ['멍!', '(꼬리를 흔든다)'] },
          // Honeyed wine cooled with snow is what was sold; for a child it is honey water.
          { id: 'snow', pass: '눈이오, 진짜 눈! 보고 가쇼.', show: 'snow', pose: 'see-wow', name: '눈 장수', x: 0.812, w: 187, h: 290, lines: ['산에서 지고 온 눈이오!', '한 잔에 눈값이 반이지.'],
            try: { id: 'eat-snow', verb: 'eat', name: '눈 넣은 꿀물', face: 'yum', sora: '차가워! 더운 날에 얼음이라니.', memo: '냉장고가 없으니 산의 눈을 지게로 날랐단다.' } },
          { id: 'draper', pass: '토가 한번 걸쳐 보겠소?', name: '옷 가게 주인', x: 0.877, w: 196, h: 290, lines: ['혼자는 못 입어요. 둘은 붙어야지.', '시민만 입는 옷이라오.'],
            try: { id: 'wear-toga', verb: 'wear', name: '토가', outfit: 'toga', pose: 'toga-fuss', trips: 2, sora: '무거워! 자꾸 흘러내려.', memo: '시민만 입을 수 있었고, 무거워서 평소엔 다들 튜닉이었대.' } },
        ],
        spots: [],
      },
      {
        id: 'plaza', name: '로마 콜로세움 앞 광장', short: '콜로세움 앞 광장', zoom: 1.6, ground: 0.79, scale: SHEET.plaza, air: 'court',
        sora: '와, 진짜 새것이다. 하얘!',
        people: [
          { id: 'water', pass: '목마르지 않소? 보고 가쇼.', show: 'posca', pose: 'see-peer', name: '물 장수', x: 0.11, w: 130, h: 265, lines: ['식초 탄 물이오! 병정들이 마시는 거요.', '백 날을 한다니 백 날을 팔아야지.'],
            try: { id: 'eat-posca', verb: 'eat', name: '식초 물', face: 'sour', sora: '으, 셔! 이걸 물 대신 마셔?', memo: '군인의 물이란다. 식초를 타서 잘 안 상했대.' } },
          { id: 'ticket', pass: '어디 보자, 내 문이…', name: '구경 온 아저씨', x: 0.26, w: 149, h: 289, lines: ['이 조각에 문 번호가 있지. 공짜야!', '황제가 여는 잔치라 돈을 안 받아.'],
            try: { id: 'use-token', verb: 'use', name: '입장 조각', sora: '스물셋… 스물셋 문은 저쪽이다!', memo: '입구에 번호가 있어서 오만 명이 금방 들어갔단다.' } },
          { id: 'wife', pass: '세상에, 저게 다 돌이야?', name: '아주머니', x: 0.33, w: 135, h: 278, lines: ['저 높이 좀 봐. 목이 아프네.', '아치마다 조각상이 서 있어.'] },
          // Not a person: it is used, not spoken to.
          { id: 'clock', show: 'clock', name: '물시계', x: 0.415, w: 83, h: 200,
            try: { id: 'use-clock', verb: 'use', name: '물시계', sora: '똑, 똑… 물로 시간을 재네.', memo: '낮을 열둘로 나눴으니 여름 한 시간이 더 길었단다.' } },
          { id: 'old', pass: '허허, 많이도 변했구먼.', name: '할아버지', x: 0.5, w: 137, h: 261, lines: ['여긴 황제의 연못이던 자리야, 암.', '물을 빼고 열 해 만에 이걸 세웠지.'] },
          { id: 'child', pass: '훌쩍…', name: '우는 아이', x: 0.63, w: 119, h: 182, lines: ['엄마가 없어졌어…', '스물셋이랬는데. 스물셋이 어디야?'] },
          { id: 'guard', pass: '줄을 서시오, 줄!', show: 'rednumbers', pose: 'see-aha', sora: '번호가 빨개서 멀리서도 보여!', memo: '문 번호를 돌에 새기고 붉게 칠했단다. 지금은 칠이 다 벗겨졌지.', name: '경비병', x: 0.8, w: 184, h: 320, lines: ['번호 봐요, 번호. 스물셋은 저쪽.', '밀지 마시오. 문은 여든 개요.'] },
        ],
        spots: [],
      },
      {
        id: 'inside', name: '로마 콜로세움 안', short: '콜로세움 안', zoom: 1.3, ground: 0.775, scale: SHEET.inside, air: 'arena',
        sora: '우와… 끝까지 다 사람이야.',
        people: [
          { id: 'usher', pass: '표를 보여 주시오.', name: '자리 안내원', x: 0.17, w: 125, h: 300, lines: ['앞줄은 원로원 자리요. 저 위로.', '자리는 옷을 보고 정하오.'] },
          { id: 'nuts', pass: '콩이요, 콩! 보고 가요!', name: '견과 파는 소년', x: 0.29, w: 143, h: 264, lines: ['볶은 콩 있어요! 구운 밤!', '싸움 시작하면 못 팔아. 지금 사.'],
            try: { id: 'eat-beans', verb: 'eat', name: '볶은 콩', face: 'yum', sora: '고소해! 하나만 더 먹을래.' } },
          { id: 'clap', pass: '와아! 공이다, 공!', show: 'balls', pose: 'see-gasp', sora: '공에 적힌 걸 진짜 주는 거야?!', memo: '황제가 던진 나무 공에 옷, 그릇, 말 같은 상품이 적혀 있었단다.', name: '관중 아저씨', x: 0.4, w: 138, h: 320, lines: ['황제가 나무 공을 던졌어! 잡았지.', '공에 적힌 걸 준대. 나는 옷이야!'] },
          { id: 'cheer', pass: '꺄아, 멋지다!', name: '관중 아가씨', x: 0.7, w: 149, h: 291, lines: ['저기 행진 온다! 반짝반짝해.', '천을 흔들면 황제가 본대.'] },
          { id: 'sailor1', pass: '영차, 줄 당겨라!', name: '뱃사람', x: 0.82, w: 167, h: 280, lines: ['미세눔에서 왔소. 돛 당기던 손이지.', '이 차양이 돛 천이오. 줄쯤이야.'] },
          { id: 'sailor2', pass: '영차! 조금만 더!', name: '젊은 뱃사람', x: 0.89, w: 150, h: 300, lines: ['해가 돌면 차양도 돌려야 하오.', '바람 센 날이 제일 무섭지.'] },
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
    dir: 'tokyo', look: 'paper', talk: 'face',
    scenes: [
      {
        id: 'front', name: '도쿄역 앞', zoom: 1.3, ground: 0.75, scale: 0.66, air: 'street',
        sora: '벽돌 역이다! 깃발이 많아.',
        moving: [
          { kind: 'drift', id: 'in', src: 'crowd', from: 0, to: 1, foot: 0.746, tall: 0.17, wide: 0.388, gap: 0.1, speed: 0.032, bob: 0.003 },
        ],
        people: [
          { id: 'news', pass: '조간이오, 조간!', show: 'postcards', pose: 'see-gasp', sora: '엽서가 산더미야!', memo: '기차 이름을 지어 보낸 엽서가 오십육만 통이었단다. 일등이 히카리, 빛이야.', name: '신문 파는 아저씨', x: 0.159, w: 139, h: 320, lines: ['기차 이름은 온 나라가 지었소.', '아흐레 뒤엔 올림픽이오. 바쁘다!'] },
          { id: 'taxi', pass: '택시 타실 분!', name: '택시 기사', x: 0.3, w: 112, h: 296, lines: ['역까지 손님이 끊이질 않아요.', '오사카를 당일로 다녀온다니.'] },
          { id: 'student', pass: '와, 드디어 오늘이야.', name: '여학생', x: 0.44, w: 108, h: 276, lines: ['수학여행은 저 기차로 가고 싶어.', '창밖이 휙휙 지나간대요.'] },
          { id: 'salary', pass: '어이쿠, 늦겠네.', name: '회사원', x: 0.56, w: 116, h: 313, lines: ['아침에 가서 저녁에 돌아온다네.', '전에는 여섯 시간 반이 걸렸지.'] },
          // Spoken to, she opens a box and shows what is in it (the user, 2026.10.8: "아주머니가
          // 도시락을 열어서 내용물을 보여주는걸로 하자"). What is in it was looked up on 2026.10.8
          // (the user: "진짜지?"): the 150-yen lunch sold on the new trains in 1964, as it was
          // made again in 2002, had white rice with one pickled plum, fried white fish, beef
          // stewed dark, rolled egg and fish cake (kfm.sakura.ne.jp/ekiben, as a search
          // told it; the page itself came through garbled). The stewed roots, the yellow
          // pickle and the thin wooden box are from memory.
          { id: 'bento', pass: '도시락 구경하고 가세요!', name: '도시락 아주머니', x: 0.72, w: 108, h: 277, lines: ['차 안에서 먹는 도시락이에요.', '역에서 파니까 에키벤이라 해요.'],
            try: { id: 'eat-ekiben', verb: 'eat', name: '기차 도시락', face: 'yum', sora: '식었는데도 맛있어!' } },
          { id: 'tourist', pass: '와, 역이 정말 크네요.', name: '먼 데서 온 여행자', x: 0.88, w: 110, h: 308, lines: ['올림픽 보러 왔어요. 기차도 타요!', '시속 210km? 믿을 수 없어요.'] },
        ],
        spots: [],
      },
      {
        id: 'platform', name: '도쿄역 승강장', zoom: 1.3, ground: 0.693, scale: 0.66, air: 'station',
        sora: '우와, 진짜 온다! 코가 둥글어.',
        // The train comes out from behind the stall and is gone behind the stair, again and again.
        moving: [
          { kind: 'drift', id: 'train', src: 'train', from: 0.156, to: 0.86, foot: 0.682, tall: 0.38, wide: 1.63, gap: 2.5, speed: 0.16, bob: 0 },
        ],
        people: [
          { id: 'fan', pass: '우와, 진짜 왔다! 코 좀 봐!', show: 'nose', pose: 'see-wow', sora: '코가 등불처럼 빛나!', memo: '코가 반투명이라 불빛이 새어 나왔단다. 속에는 연결 고리가 들어 있지.', name: '기차 좋아하는 소년', x: 0.12, w: 96, h: 239, lines: ['꿈의 초특급이다! 코가 비행기 같아.', '새벽 세 시에 일어나서 왔어.'] },
          { id: 'reporter', pass: '하나, 둘, 마이크 시험.', name: '방송 기자', x: 0.26, w: 103, h: 299, lines: ['여기는 도쿄역, 역사적인 아침입니다.', '세계에서 가장 빠른 열차입니다!'] },
          { id: 'flowers', pass: '아이, 떨려라.', name: '꽃다발 든 아가씨', x: 0.4, w: 122, h: 290, lines: ['기관사님께 드릴 꽃다발이에요.', '떨려서 꽃이 다 흔들려요.'] },
          { id: 'driver', pass: '출발 준비 완료!', name: '기관사', x: 0.52, w: 112, h: 299, lines: ['시속 210km입니다. 손이 떨려요.', '선로가 눈앞으로 빨려 들어와요.'] },
          { id: 'master', pass: '물러서 주십시오!', name: '역장', x: 0.66, w: 106, h: 320, lines: ['여섯 시 정각, 히카리 1호 출발!', '일 초도 늦으면 안 됩니다.'] },
          { id: 'banzai', pass: '만세! 만세!', name: '신이 난 회사원', x: 0.82, w: 155, h: 304, lines: ['테이프 끊는 걸 봤어! 박수가 터졌어!', '만세! 우리가 해냈다고!'] },
        ],
        spots: [],
      },
      {
        // The carriage was drawn twice too large for those in it (the user, 2026.10.8: "의자가
        // 너무 커", "전체적으로 사람이 너무 작네"): its door stood 2.2 times as tall as a man.
        // The picture is shown at 0.62 of that, with the roof and the sky over it, so it is
        // narrower than the others (aspect) and she crosses it at the same pace on the screen.
        id: 'car', name: '달리는 신칸센 안', zoom: 1.012, ground: 0.7944, aspect: 1.1963, pace: 1.6, scale: 0.66, air: 'train', floor: 'wood',
        sora: '안 흔들려! 창밖이 휙휙 가.',
        // The land goes by behind the picture, seen through its six windows.
        moving: [
          { kind: 'drift', id: 'land', src: 'view', from: 0.105, to: 0.885, foot: 0.6440, tall: 0.1515, wide: 0.38, gap: 0, speed: -0.09, bob: 0, behind: true },
        ],
        people: [
          { id: 'conductor', pass: '실례하겠습니다.', name: '차장', x: 0.168, w: 112, h: 316, lines: ['표 좀 보여 주시겠습니까.', '신오사카까지 네 시간입니다.'] },
          { id: 'dozer', pass: '쿨… 쿨…', name: '조는 대학생', x: 0.24, w: 94, h: 289, lines: ['…음냐. 벌써 시즈오카예요?', '너무 조용해서 잠이 와요.'],
            try: { id: 'wear-ivy', verb: 'wear', name: '아이비룩', outfit: 'ivy', sora: '단추가 금빛이야. 멋쟁이다!', memo: '그 무렵 도쿄 젊은이들 사이에 유행한 대학생 차림이란다.' } },
          { id: 'eater', pass: '우물우물.', name: '도시락 먹는 아저씨', x: 0.38, w: 117, h: 306, lines: ['빨라서 도시락 먹을 틈이 없네.', '(우물우물) 그래도 맛은 좋아.'] },
          { id: 'kid', pass: '우와, 빠르다!', show: 'cup', pose: 'see-aha', sora: '봉투에 물을 받아 마시네!', memo: '이 기차에 맞춰 만든 종이컵이란다. 납작하게 접혀 있었지.', name: '신난 꼬마', x: 0.52, w: 128, h: 218, lines: ['물은 봉투에 받아 마시는 거야!', '나 커서 기관사 될 거야!'] },
          { id: 'granny', pass: '아이고, 벌써 여기야.', name: '창가의 할머니', x: 0.68, w: 134, h: 284, lines: ['저기 봐, 후지산이야! 벌써 여기야.', '옛날엔 걸어서 보름 길이었단다.'] },
          { id: 'buffet', pass: '어서 오세요! 속도계 보고 가세요.', show: 'speedometer', pose: 'see-gasp', sora: '1964년에 시속 210km?!', name: '뷔페 칸 종업원', x: 0.9, w: 121, h: 320, lines: ['속도계 보세요. 지금 시속 210km!', '커피가 안 쏟아지는 게 자랑이죠.'],
            try: { id: 'use-speed', verb: 'use', name: '속도계', sora: '바늘이 이백십에서 안 내려와!' } },
        ],
        spots: [],
      },
    ],
    errands: [
      { id: 'tape', text: '첫 차 떠나는 걸 본 사람을 찾아보렴.', at: ['banzai'] },
      { id: 'speed', text: '얼마나 빠른지 속도계를 보고 오렴.', at: ['buffet'] },
      { id: 'fuji', text: '창밖으로 후지산이 보이는지 보렴.', at: ['granny'] },
    ],
    reply: '시속 210km라니. 후지산이 금세 지나갔겠구나.',
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
          { id: 'tourist', pass: '오우, 어디로 가지…', name: '외국인 관광객', x: 0.18, w: 148, h: 320, lines: ['백육십 나라가 왔대요. 나도 왔죠!', '동쪽 서쪽이 다 모였어요.'] },
          { id: 'caller', pass: '여보세요? 나야, 나.', name: '전화 거는 회사원', x: 0.28, w: 132, h: 307, lines: ['집에 걸었어. 텔레비전 켜 두라고.', '컬러 방송이 여덟 해째거든.'] },
          { id: 'gimbap', pass: '김밥이요, 김밥!', show: 'clock', pose: 'see-aha', sora: '시계를 한 시간 앞으로 돌렸네!', memo: '그해에는 온 나라가 시계를 한 시간 앞당겨 썼단다.', name: '김밥 장수', x: 0.42, w: 145, h: 297, lines: ['열 시 반에 벌써 시작했어.', '올해는 시계를 한 시간 당겨 쓰잖아.'],
            try: { id: 'eat-gimbap', verb: 'eat', name: '김밥', face: 'yum', sora: '참기름 냄새! 한 줄 다 먹을래.' } },
          { id: 'vendor', pass: '호돌이 사 가세요, 호돌이!', show: 'hodori', pose: 'see-wow', sora: '상모 쓴 호랑이네! 귀엽다.', memo: '상모의 긴 끈은 서울의 S란다. 이름은 이천이백 통에서 뽑았지. 짝은 호순이야.', name: '기념품 장수', x: 0.58, w: 177, h: 319, lines: ['호돌이요. 상모 쓴 아기 호랑이.', '이름은 온 국민이 지어 보냈다오.'],
            try: { id: 'wear-sangmo', verb: 'wear', name: '상모', outfit: 'sangmo', sora: '고개를 돌리면 띠가 빙글빙글!', memo: '농악에서 쓰는 모자란다. 호돌이도 이걸 썼지.' } },
          { id: 'flagboy', pass: '대한민국! 짝짝짝!', name: '깃발 든 아이', x: 0.69, w: 133, h: 276, lines: ['버스 타고 왔어. 나는 칠십 원!', '토큰 말고 회수권 냈어.'] },
          { id: 'guide', pass: '경기장은 이쪽이에요!', name: '자원봉사 누나', x: 0.78, w: 159, h: 299, lines: ['길 안내를 맡았어요. 저쪽이에요.', '봉사자가 이만 칠천 명이에요.'] },
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
};
