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
        id: 'market', name: '시장 거리', zoom: 1.25, ground: 0.765, scale: SHEET.market,
        sora: '사람이 엄청 많아! 냄새도 나.',
        people: [
          { id: 'baker', name: '빵 장수', x: 0.11, w: 123, h: 284, lines: ['갓 구웠어요. 여덟 쪽으로 갈라 드셔요.', '경기장 덕에 오늘은 벌써 동났네.'] },
          { id: 'boy', name: '심부름 소년', x: 0.2, w: 132, h: 248, lines: ['주인님 빵 받으러 왔어. 늦으면 혼나.', '나도 경기장 가 보고 싶다.'] },
          { id: 'garum', name: '생선 소스 장수', x: 0.31, w: 150, h: 299, lines: ['히스파니아에서 배로 온 거요. 한 국자?', '냄새는 지독해도 맛은 황제 것이오.'] },
          { id: 'lady', name: '귀부인', x: 0.47, w: 133, h: 320, lines: ['새 경기장? 자리는 신분대로 앉는단다.', '여자 자리는 맨 꼭대기라지 뭐니.'] },
          { id: 'maid', name: '하녀', x: 0.535, w: 123, h: 276, lines: ['마님 짐이 무거워요. 구경은 가요!', '꼭대기에서도 잘 보인대요.'] },
          { id: 'reader', name: '글 읽는 노인', x: 0.635, w: 165, h: 296, lines: ['오늘의 소식! 새 경기장이 문을 연다!', '글 모르는 이는 내게 오시오. 한 닢.'] },
          { id: 'dog', name: '개', x: 0.74, w: 101, h: 153, lines: ['멍!', '(꼬리를 흔든다)'] },
        ],
        spots: [],
      },
      {
        id: 'plaza', name: '콜로세움 앞 광장', zoom: 1.6, ground: 0.79, scale: SHEET.plaza,
        sora: '와, 진짜 새것이다. 하얘!',
        people: [
          { id: 'water', name: '물 장수', x: 0.11, w: 130, h: 265, lines: ['시원한 물이오! 안은 덥소.', '백 날을 한다니 백 날을 팔아야지.'] },
          { id: 'ticket', name: '구경 온 아저씨', x: 0.26, w: 149, h: 289, lines: ['이 조각에 문 번호가 있지. 공짜야!', '황제가 여는 잔치라 돈을 안 받아.'] },
          { id: 'wife', name: '아주머니', x: 0.33, w: 135, h: 278, lines: ['저 높이 좀 봐. 목이 아프네.', '아치마다 조각상이 서 있어.'] },
          { id: 'old', name: '할아버지', x: 0.5, w: 137, h: 261, lines: ['여긴 황제의 연못이던 자리야, 암.', '물을 빼고 열 해 만에 이걸 세웠지.'] },
          { id: 'child', name: '우는 아이', x: 0.63, w: 119, h: 182, lines: ['엄마가 없어졌어…', '스물셋이랬는데. 스물셋이 어디야?'] },
          { id: 'guard', name: '경비병', x: 0.8, w: 184, h: 320, lines: ['번호 봐요, 번호. 스물셋은 저쪽.', '밀지 마시오. 문은 여든 개요.'] },
        ],
        spots: [],
      },
      {
        id: 'inside', name: '경기장 안', zoom: 1.3, ground: 0.775, scale: SHEET.inside, murmur: 1,
        sora: '우와… 끝까지 다 사람이야.',
        people: [
          { id: 'usher', name: '자리 안내원', x: 0.17, w: 125, h: 300, lines: ['앞줄은 원로원 자리요. 저 위로.', '자리는 옷을 보고 정하오.'] },
          { id: 'nuts', name: '견과 파는 소년', x: 0.29, w: 143, h: 264, lines: ['볶은 콩 있어요! 구운 밤!', '싸움 시작하면 못 팔아. 지금 사.'] },
          { id: 'clap', name: '관중 아저씨', x: 0.4, w: 138, h: 320, lines: ['백 날을 한다잖아. 오늘은 사냥이래.', '황제 만세! 티투스 만세!'] },
          { id: 'cheer', name: '관중 아가씨', x: 0.7, w: 149, h: 291, lines: ['저기 행진 온다! 반짝반짝해.', '천을 흔들면 황제가 본대.'] },
          { id: 'sailor1', name: '뱃사람', x: 0.82, w: 167, h: 280, lines: ['미세눔에서 왔소. 돛 당기던 손이지.', '이 차양이 돛 천이오. 줄쯤이야.'] },
          { id: 'sailor2', name: '젊은 뱃사람', x: 0.89, w: 150, h: 300, lines: ['해가 돌면 차양도 돌려야 하오.', '바람 센 날이 제일 무섭지.'] },
        ],
        spots: [
          // The emperor in his box across the sand: seen, not spoken to.
          { id: 'titus', from: 0.47, to: 0.63, memo: '저 사람이 티투스란다. 아버지가 짓기 시작한 걸 아들이 열었지.' },
          // The fighting itself is not seen: she watches the march and no more.
          { id: 'march', from: 0.2, to: 0.36, sora: '행진까지만 볼래. 싸움은 안 볼 거야.' },
        ],
      },
    ],
    errands: [
      { id: 'garum', text: '시장에서 생선 소스 파는 데 좀 찾아보렴. 냄새가 지독하다더라.', at: ['garum'] },
      { id: 'titus', text: '황제 얼굴 좀 보고 오렴.', at: ['titus'] },
      { id: 'sailors', text: '경기장 지붕을 뱃사람들이 당긴다던데 정말인지.', at: ['sailor1', 'sailor2'] },
    ],
    reply: '지독한 냄새도 맡고 황제도 봤구나. 뱃사람 얘기가 정말이었네.',
  },
  eiffel: {
    dir: 'paris', look: 'paper', talk: 'face',
    scenes: [
      {
        id: 'gate', name: '박람회 입구', zoom: 1.3, ground: 0.752, scale: 0.66,
        sora: '깃발이 잔뜩! 저 끝에 탑이야.',
        // People pour in at the middle arch from both sides, and are lost behind its pillars.
        moving: [
          { kind: 'drift', id: 'in', src: 'crowd', from: 0, to: 0.555, foot: 0.748, tall: 0.17, wide: 0.381, gap: 0.03, speed: 0.03, bob: 0.003 },
          { kind: 'drift', id: 'out', src: 'crowd', from: 0.59, to: 1, foot: 0.748, tall: 0.17, wide: 0.381, gap: 0.03, speed: -0.026, bob: 0.003, flip: true },
        ],
        people: [
          { id: 'ticket', name: '표 파는 사람', x: 0.1, w: 138, h: 277, lines: ['표 한 장이면 박람회를 다 봐요.', '오늘부터 탑에 올라갈 수 있소.'] },
          { id: 'news', name: '신문팔이 소년', x: 0.19, w: 107, h: 269, lines: ['탑 꼭대기 삼백 미터! 세계 제일!', '호외요! 오늘 탑이 문을 열어요!'] },
          { id: 'flower', name: '꽃 파는 소녀', x: 0.31, w: 112, h: 255, lines: ['은방울꽃 사세요! 오월의 꽃이에요.', '오늘은 다들 탑만 올려다봐요.'] },
          { id: 'parasol', name: '양산 든 부인', x: 0.44, w: 148, h: 320, lines: ['백 년 전 혁명을 기리는 잔치란다.', '서른다섯 나라가 왔다지 뭐니.'] },
          { id: 'tophat', name: '실크해트 신사', x: 0.66, w: 119, h: 312, lines: ['쇠로 탑이라니. 난 반대했었소.', '…그래도 표는 샀소. 궁금해서.'] },
          { id: 'kilt', name: '먼 데서 온 아저씨', x: 0.86, w: 125, h: 286, lines: ['스코틀랜드에서 배 타고 왔다네.', '우리도 쇠로 큰 다리를 놓는 중이지.'] },
        ],
        spots: [],
      },
      {
        id: 'tower', name: '탑 아래', zoom: 1.2, ground: 0.733, scale: 0.62,
        sora: '우와, 다리 하나가 집채만 해.',
        // The stair in the east leg, three flights of it: people go up one after another.
        moving: [
          { kind: 'climb', id: 'up', srcs: ['climb-1', 'climb-2', 'climb-3', 'climb-4', 'climb-5', 'climb-6'],
            path: [[0.962, 0.566], [0.841, 0.379], [0.913, 0.354], [0.809, 0.195], [0.874, 0.161], [0.778, 0.015]],
            tall: 0.062, seconds: 42, step: 0.004 },
        ],
        people: [
          { id: 'down', name: '내려온 아가씨', x: 0.13, w: 106, h: 306, lines: ['1층에 식당이 넷이나 있어요!', '두 해 두 달 만에 다 지었대요.'] },
          { id: 'painter', name: '화가', x: 0.27, w: 148, h: 314, lines: ['흉물이라던 이들이 다 올라가더군.', '쇠 사이로 하늘이 비쳐. 그릴 만해.'] },
          { id: 'kid', name: '올려다보는 아이', x: 0.38, w: 77, h: 199, lines: ['꼭대기가 구름에 닿을 것 같아!', '아빠가 나는 다음에 올라가래.'] },
          { id: 'photo', name: '사진사', x: 0.68, w: 150, h: 320, lines: ['움직이지 마시오! 하나, 둘…', '탑이 커서 한 장에 다 안 들어가.'] },
          { id: 'puff', name: '숨 고르는 아저씨', x: 0.79, w: 151, h: 303, lines: ['헉, 헉… 1층만 갔다 왔네.', '위에서 보니 파리가 손바닥만 해.'] },
          { id: 'stairs', name: '계단 안내원', x: 0.9, w: 120, h: 316, lines: ['엘리베이터는 아직이에요. 계단으로!', '1층까지 삼백 계단이 넘어요.'] },
        ],
        spots: [
          // Right under the middle of the arch, looking straight up.
          { id: 'under', from: 0.45, to: 0.56, sora: '우와… 다리가 후들거려.', memo: '쇠 조각 만팔천 개를 못으로 이어 세운 탑이란다.' },
        ],
      },
      {
        id: 'hall', name: '기계관', zoom: 1.3, ground: 0.664, scale: 0.66, murmur: 0.4, engine: 1,
        sora: '쿵쿵쿵! 바퀴가 진짜 돌아가.',
        // The two flywheels, cut out of the picture itself (tools/walk-art.py disc), turn where they lie.
        moving: [
          { kind: 'spin', id: 'red', src: 'wheel-red', x: 0.2754, y: 0.5205, tall: 0.2139, rpm: 15 },
          { kind: 'spin', id: 'blue', src: 'wheel-blue', x: 0.6725, y: 0.5205, tall: 0.2139, rpm: 15 },
        ],
        people: [
          { id: 'reporter', name: '기자', x: 0.11, w: 106, h: 320, lines: ['기둥 하나 없이 이 넓이라니.', '쇠와 유리. 새 시대가 온 거요.'] },
          { id: 'engineer', name: '기술자', x: 0.4, w: 166, h: 320, lines: ['이 바퀴가 벨트로 기계를 다 돌려.', '기름을 안 치면 금세 멈추지.'] },
          { id: 'ears', name: '귀 막은 아이', x: 0.53, w: 107, h: 222, lines: ['너무 시끄러워! 귀가 멍멍해.', '(귀를 막고 고개를 젓는다)'] },
          { id: 'student', name: '학생', x: 0.76, w: 122, h: 300, lines: ['에디슨이라는 미국 사람 거래요.', '전구도 그 사람이 만들었대요.'] },
          { id: 'queue', name: '줄 선 아주머니', x: 0.82, w: 121, h: 310, lines: ['한 시간째 줄이야. 그래도 들어야지.', '기계가 말을 한다니 믿어지니?'] },
          { id: 'phono', name: '말하는 기계 지기', x: 0.92, w: 153, h: 317, sound: 'phonograph', lines: ['통 속에 사람 목소리가 들었소.', '관을 귀에 대 봐요. 노래가 나오지.'] },
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
        id: 'market', name: '저잣거리', zoom: 1.3, ground: 0.674, scale: 0.66,
        sora: '감이 주렁주렁! 시끌시끌해.',
        moving: [
          { kind: 'drift', id: 'by', src: 'crowd', from: 0, to: 1, foot: 0.67, tall: 0.17, wide: 0.4115, gap: 0.12, speed: 0.028, bob: 0.003 },
        ],
        people: [
          { id: 'cloth', name: '포목 장수', x: 0.12, w: 141, h: 299, lines: ['무명 한 필 보고 가시오. 곱지요?', '글자를 알면 장부 쓰기 좋겠구먼.'] },
          { id: 'pots', name: '옹기 장수', x: 0.3, w: 128, h: 289, lines: ['독 사려! 김장독 사려!', '새 글자? 난 내 이름도 못 쓰는데.'] },
          { id: 'reader', name: '방 읽어 주는 선비', x: 0.43, w: 141, h: 312, lines: ['새 글자 스물여덟 자가 나왔다오.', '슬기로우면 아침나절에 배운다오.'] },
          { id: 'woodboy', name: '나무꾼 소년', x: 0.52, w: 119, h: 225, lines: ['저게 글자야? 그림 같은데.', '기역, 니은… 나도 따라 했어!'] },
          { id: 'tteok', name: '떡 파는 할머니', x: 0.77, w: 109, h: 257, lines: ['시루떡 따끈해요. 하나 드시우.', '열흘이면 배운다니 나도 해 볼까.'] },
          { id: 'water', name: '물동이 인 아낙', x: 0.9, w: 110, h: 320, lines: ['친정에 편지 한 장 못 썼다우.', '이제는 쓸 수 있으려나.'] },
        ],
        spots: [],
      },
      {
        id: 'gate', name: '광화문 앞', zoom: 1.3, ground: 0.703, scale: 0.78,
        sora: '문이 엄청 커! 지붕이 두 층이야.',
        moving: [
          { kind: 'drift', id: 'parade', src: 'parade', from: 0, to: 1, foot: 0.7, tall: 0.2, wide: 0.3183, gap: 0.55, speed: 0.032, bob: 0.003 },
        ],
        people: [
          { id: 'farmer', name: '시골 농부', x: 0.14, w: 116, h: 246, lines: ['대궐이 이리 큰 줄 몰랐소.', '억울한 일을 글로 적을 수 있다던데.'] },
          { id: 'bearer', name: '가마꾼', x: 0.3, w: 113, h: 253, lines: ['아이고 어깨야. 대감은 무겁다니까.', '글자? 가마 멜 때는 쓸 데 없지.'] },
          { id: 'guard', name: '수문장', x: 0.42, w: 123, h: 320, lines: ['멈추시오. 여기는 대궐 문이오.', '임금님은 저 안 깊이 계시오.'] },
          { id: 'elder', name: '늙은 대신', x: 0.58, w: 107, h: 267, lines: ['한문이 있는데 새 글자가 웬 말이오.', '…허나 임금의 뜻이 굳으시오.'] },
          { id: 'official', name: '젊은 관리', x: 0.7, w: 115, h: 263, lines: ['새 글자로 쓴 책을 나르는 길이오.', '소리 나는 대로 적으니 참 쉽소.'] },
          { id: 'girl', name: '심부름 가는 소녀', x: 0.86, w: 101, h: 230, lines: ['마님 심부름 가요. 바빠요!', '언니가 새 글자를 가르쳐 준댔어.'] },
        ],
        spots: [],
      },
      {
        id: 'hall', name: '집현전 뜰', zoom: 1.2, ground: 0.762, scale: 0.64,
        sora: '책이 마당 가득이야. 조용해.',
        moving: [
          { kind: 'drift', id: 'books', src: 'scholars', from: 0, to: 1, foot: 0.758, tall: 0.17, wide: 0.282, gap: 0.6, speed: 0.026, bob: 0.003 },
        ],
        people: [
          { id: 'books', name: '책 말리는 아저씨', x: 0.2, w: 110, h: 311, lines: ['볕 좋은 날 책을 말려야 하오.', '좀이 슬면 큰일이라오.'] },
          { id: 'sleepy', name: '졸린 학사', x: 0.32, w: 125, h: 313, lines: ['밤새 풀이를 썼소. 하암…', '임금님이 더 늦게 주무신다오.'] },
          { id: 'scholar', name: '집현전 학사', x: 0.41, w: 132, h: 320, lines: ['글자마다 입 모양을 본떴다오.', '기역은 혀뿌리가 막히는 모양이지.'] },
          { id: 'tea', name: '차 나르는 궁녀', x: 0.66, w: 111, h: 301, lines: ['임금님 눈이 많이 나빠지셨대요.', '그래도 책을 놓지 않으세요.'] },
          { id: 'child', name: '글자 쓰는 아이', x: 0.75, w: 83, h: 204, lines: ['이거 봐! 내 이름이야. 내가 썼어!', '어제 배웠는데 벌써 다 써.'] },
          { id: 'sundial', name: '해시계 보는 관원', x: 0.87, w: 129, h: 309, lines: ['해 그림자로 때를 아는 시계라오.', '이것도 임금님 때 만든 것이지.'] },
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
        id: 'plaza', name: '다리 어귀', zoom: 1.3, ground: 0.735, scale: 0.66,
        sora: '다리가 빨개! 엄청 길다.',
        moving: [
          { kind: 'drift', id: 'in', src: 'crowd', from: 0, to: 1, foot: 0.731, tall: 0.17, wide: 0.396, gap: 0.05, speed: 0.03, bob: 0.003 },
        ],
        people: [
          { id: 'hotdog', name: '핫도그 장수', x: 0.1, w: 119, h: 320, lines: ['핫도그요! 오늘 벌써 천 개 팔았소.', '다리 구경엔 핫도그가 딱이지.'] },
          { id: 'sleepy', name: '밤새 기다린 청년', x: 0.22, w: 120, h: 320, lines: ['어젯밤부터 줄 섰어요. 하암…', '맨 먼저 건너고 싶었거든요.'] },
          { id: 'toll', name: '요금 받는 사람', x: 0.36, w: 101, h: 311, lines: ['걸어서 건너는 값은 동전 한 닢이오.', '오늘은 사람만! 차는 내일부터요.'] },
          { id: 'scout', name: '보이스카우트 소년', x: 0.52, w: 112, h: 249, lines: ['아침 여섯 시에 문이 열렸어요.', '길 잃은 아이를 찾아 주는 중이에요.'] },
          { id: 'badge', name: '기념품 아주머니', x: 0.74, w: 120, h: 301, lines: ['기념 배지 사세요! 오늘뿐이에요.', '손주한테 줄 거라고들 사 가요.'] },
          { id: 'camera', name: '사진기 든 아가씨', x: 0.88, w: 100, h: 303, lines: ['안개가 걷혀야 탑이 찍힐 텐데.', '사 년 만에 다 지었대요.'] },
        ],
        spots: [],
      },
      {
        id: 'deck', name: '다리 위', zoom: 1.2, ground: 0.8, scale: 0.64,
        sora: '차가 없으니까 운동장 같아.',
        // The crowd goes over on foot, and now and then those who cross some odd way.
        moving: [
          { kind: 'drift', id: 'over', src: 'crowd', from: 0, to: 1, foot: 0.794, tall: 0.17, wide: 0.396, gap: 0.08, speed: 0.03, bob: 0.003 },
          { kind: 'drift', id: 'odd', src: 'stunts', from: 0, to: 1, foot: 0.8, tall: 0.17, wide: 0.304, gap: 0.9, speed: 0.06, bob: 0.004 },
        ],
        people: [
          { id: 'mother', name: '유모차 미는 어머니', x: 0.12, w: 214, h: 307, lines: ['아기도 오늘을 기억하면 좋겠어요.', '배 타고 건너던 길을 걸어서 가네.'] },
          { id: 'grandpa', name: '할아버지', x: 0.25, w: 121, h: 319, lines: ['이 물목에 다리는 못 놓는다 했지.', '살아서 걸어 건널 줄이야.'] },
          { id: 'worker', name: '다리 일꾼', x: 0.42, w: 139, h: 320, lines: ['저 케이블, 내가 꼰 거요.', '밑에 그물을 쳐서 열아홉이 살았소.'] },
          { id: 'skate', name: '롤러스케이트 소녀', x: 0.57, w: 163, h: 249, lines: ['롤러스케이트로 건너는 중이야!', '끝까지 가면 내가 일등일걸.'] },
          { id: 'backward', name: '뒤로 걷는 남자', x: 0.71, w: 115, h: 315, lines: ['뒤로 걸어 건넌 건 내가 처음이오.', '신문에 나려면 별나야지.'] },
          { id: 'harmonica', name: '하모니카 소년', x: 0.86, w: 97, h: 246, lines: ['(하모니카를 분다) 뿌우 뿌!', '다리 건너며 한 곡 다 불 거야.'] },
        ],
        spots: [],
      },
      {
        id: 'mid', name: '다리 한가운데', zoom: 1.25, ground: 0.755, scale: 0.74,
        sora: '바람이 세! 바다가 저 밑이야.',
        moving: [
          { kind: 'drift', id: 'east', src: 'crowd', from: 0, to: 1, foot: 0.74, tall: 0.16, wide: 0.373, gap: 0.3, speed: -0.025, bob: 0.003, flip: true },
          { kind: 'drift', id: 'west', src: 'crowd', from: 0, to: 1, foot: 0.751, tall: 0.17, wide: 0.396, gap: 0.2, speed: 0.03, bob: 0.003 },
        ],
        people: [
          { id: 'runner', name: '달리기 선수', x: 0.12, w: 98, h: 231, lines: ['헉헉. 끝에서 끝까지 뛰어왔어요.', '탑 사이가 천이백팔십 미터래요.'] },
          { id: 'hat', name: '모자 잡는 아가씨', x: 0.26, w: 121, h: 248, lines: ['앗, 모자! 바람이 너무 세요.', '다리가 조금씩 흔들리는 것 같아요.'] },
          { id: 'scope', name: '멀리 보는 소년', x: 0.39, w: 90, h: 204, lines: ['저기 섬이 감옥이래. 알카트라즈.', '배가 다리 밑으로 지나가!'] },
          { id: 'painter', name: '칠장이', x: 0.64, w: 113, h: 268, lines: ['이 색? 안개 속에서도 잘 보이라고.', '칠은 끝이 없소. 다 하면 또 처음.'] },
          { id: 'sailor', name: '수병', x: 0.77, w: 122, h: 261, lines: ['군함이 이 밑으로 지나다닌다오.', '물에서 다리까지 예순일곱 미터.'] },
          { id: 'piggy', name: '목말 태운 아버지', x: 0.9, w: 106, h: 320, lines: ['얘야, 저기가 태평양이란다.', '이십만 명이 건넜다니 대단하지.'] },
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
        id: 'front', name: '도쿄역 앞', zoom: 1.3, ground: 0.75, scale: 0.66,
        sora: '벽돌 역이다! 깃발이 많아.',
        moving: [
          { kind: 'drift', id: 'in', src: 'crowd', from: 0, to: 1, foot: 0.746, tall: 0.17, wide: 0.388, gap: 0.1, speed: 0.032, bob: 0.003 },
        ],
        people: [
          { id: 'news', name: '신문 파는 아저씨', x: 0.09, w: 139, h: 320, lines: ['조간이오! 새 기차 오늘 첫 출발!', '아흐레 뒤엔 올림픽이오. 바쁘다!'] },
          { id: 'taxi', name: '택시 기사', x: 0.3, w: 112, h: 296, lines: ['역까지 손님이 끊이질 않아요.', '오사카를 당일로 다녀온다니.'] },
          { id: 'student', name: '여학생', x: 0.44, w: 108, h: 276, lines: ['수학여행은 저 기차로 가고 싶어.', '창밖이 휙휙 지나간대요.'] },
          { id: 'salary', name: '회사원', x: 0.56, w: 116, h: 313, lines: ['아침에 가서 저녁에 돌아온다네.', '전에는 여섯 시간 반이 걸렸지.'] },
          { id: 'bento', name: '도시락 아주머니', x: 0.72, w: 108, h: 277, lines: ['도시락 사세요! 기차에서 드세요.', '네 시간이면 한 끼로 충분해요.'] },
          { id: 'tourist', name: '먼 데서 온 여행자', x: 0.88, w: 110, h: 308, lines: ['올림픽 보러 왔어요. 기차도 타요!', '시속 이백십? 믿을 수 없어요.'] },
        ],
        spots: [],
      },
      {
        id: 'platform', name: '승강장', zoom: 1.3, ground: 0.693, scale: 0.66,
        sora: '우와, 진짜 온다! 코가 둥글어.',
        // The train comes out from behind the stall and is gone behind the stair, again and again.
        moving: [
          { kind: 'drift', id: 'train', src: 'train', from: 0.156, to: 0.86, foot: 0.682, tall: 0.38, wide: 1.63, gap: 2.5, speed: 0.16, bob: 0 },
        ],
        people: [
          { id: 'fan', name: '기차 좋아하는 소년', x: 0.12, w: 96, h: 239, lines: ['꿈의 초특급이다! 코가 비행기 같아.', '새벽 세 시에 일어나서 왔어.'] },
          { id: 'reporter', name: '방송 기자', x: 0.26, w: 103, h: 299, lines: ['여기는 도쿄역, 역사적인 아침입니다.', '세계에서 가장 빠른 열차입니다!'] },
          { id: 'flowers', name: '꽃다발 든 아가씨', x: 0.4, w: 122, h: 290, lines: ['기관사님께 드릴 꽃다발이에요.', '떨려서 꽃이 다 흔들려요.'] },
          { id: 'driver', name: '기관사', x: 0.52, w: 112, h: 299, lines: ['이백십 킬로미터. 손이 떨립니다.', '선로가 눈앞으로 빨려 들어와요.'] },
          { id: 'master', name: '역장', x: 0.66, w: 106, h: 320, lines: ['여섯 시 정각, 히카리 1호 출발!', '일 초도 늦으면 안 됩니다.'] },
          { id: 'banzai', name: '신이 난 회사원', x: 0.82, w: 155, h: 304, lines: ['테이프 끊는 걸 봤어! 박도 터졌어!', '만세! 우리가 해냈다고!'] },
        ],
        spots: [],
      },
      {
        id: 'car', name: '달리는 차 안', zoom: 1.3, ground: 0.645, scale: 0.66, murmur: 0.3, engine: 0.45,
        sora: '안 흔들려! 창밖이 휙휙 가.',
        // The land goes by behind the picture, seen through its six windows.
        moving: [
          { kind: 'drift', id: 'land', src: 'view', from: 0.105, to: 0.885, foot: 0.456, tall: 0.19, wide: 0.38, gap: 0, speed: -0.09, bob: 0, behind: true },
        ],
        people: [
          { id: 'conductor', name: '차장', x: 0.1, w: 112, h: 316, lines: ['표 좀 보여 주시겠습니까.', '신오사카까지 네 시간입니다.'] },
          { id: 'dozer', name: '조는 대학생', x: 0.24, w: 94, h: 289, lines: ['…음냐. 벌써 시즈오카예요?', '너무 조용해서 잠이 와요.'] },
          { id: 'eater', name: '도시락 먹는 아저씨', x: 0.38, w: 117, h: 306, lines: ['빨라서 도시락 먹을 틈이 없네.', '(우물우물) 그래도 맛은 좋아.'] },
          { id: 'kid', name: '신난 꼬마', x: 0.52, w: 128, h: 218, lines: ['전봇대가 줄넘기처럼 지나가!', '나 커서 기관사 될 거야!'] },
          { id: 'granny', name: '창가의 할머니', x: 0.68, w: 134, h: 284, lines: ['저기 봐, 후지산이야! 벌써 여기야.', '옛날엔 걸어서 보름 길이었단다.'] },
          { id: 'buffet', name: '식당 칸 종업원', x: 0.9, w: 121, h: 320, lines: ['속도계 보세요. 지금 이백십!', '커피가 안 쏟아지는 게 자랑이죠.'] },
        ],
        spots: [],
      },
    ],
    errands: [
      { id: 'tape', text: '첫 차 떠나는 걸 본 사람을 찾아보렴.', at: ['banzai'] },
      { id: 'speed', text: '얼마나 빠른지 속도계를 보고 오렴.', at: ['buffet'] },
      { id: 'fuji', text: '창밖으로 후지산이 보이는지 보렴.', at: ['granny'] },
    ],
    reply: '이백십이라니. 후지산이 금세 지나갔겠구나.',
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
        id: 'lane', name: '마을 길', zoom: 1.3, ground: 0.698, scale: 0.66, murmur: 0.2,
        sora: '밤인데 다들 어디로 가?',
        // Children run along the lane and in at the open gate.
        moving: [
          { kind: 'drift', id: 'kids', src: 'kids', from: 0, to: 0.645, foot: 0.695, tall: 0.13, wide: 0.379, gap: 0.9, speed: 0.07, bob: 0.006 },
        ],
        people: [
          { id: 'shop', name: '구멍가게 아주머니', x: 0.12, w: 129, h: 297, lines: ['사이다 한 병 줄까? 시원하다.', '다들 테레비 보러 가서 가게가 비었네.'] },
          { id: 'kettle', name: '주전자 든 아저씨', x: 0.26, w: 137, h: 320, lines: ['막걸리 받아 가는 길이여.', '달나라 구경에 술이 빠지면 쓰나.'] },
          { id: 'grandpa', name: '부채 든 할아버지', x: 0.38, w: 155, h: 314, lines: ['살다 살다 달에 사람이 가는구먼.', '계수나무는 어찌 됐나 물어봐야지.'] },
          { id: 'dog', name: '누렁이', x: 0.47, w: 84, h: 125, lines: ['멍멍!', '(꼬리를 흔든다)'] },
          { id: 'runboy', name: '뛰어가는 아이', x: 0.57, w: 113, h: 213, lines: ['빨리 와! 테레비에 달 나온대!', '사람이 달에서 걸어 다닌대!'] },
          { id: 'sister', name: '동생 업은 누나', x: 0.8, w: 118, h: 269, lines: ['동생 재우고 가야 하는데.', '업고라도 가서 볼 거야.'] },
        ],
        spots: [],
      },
      {
        id: 'yard', name: '이웃집 마당', zoom: 1.3, ground: 0.7, scale: 0.66, murmur: 0.35,
        sora: '다들 텔레비전만 봐. 조용해.',
        moving: [
          { kind: 'drift', id: 'in', src: 'villagers', from: 0, to: 1, foot: 0.696, tall: 0.17, wide: 0.29, gap: 0.8, speed: 0.024, bob: 0.003 },
        ],
        people: [
          { id: 'owner', name: '집주인 아저씨', x: 0.07, w: 105, h: 308, lines: ['마루 끝에 내놨지. 다들 보라고.', '동네에 한 대뿐인 테레비여.'] },
          { id: 'melon', name: '수박 든 아주머니', x: 0.3, w: 110, h: 292, lines: ['수박 먹고들 봐요. 우물에 담갔던 거야.', '낮에도 봤는데 또 봐도 신기해.'] },
          { id: 'corn', name: '옥수수 먹는 아이', x: 0.44, w: 87, h: 214, lines: ['저 아저씨들 통통 뛰어다녀!', '달에서는 몸이 가볍대.'] },
          { id: 'chief', name: '이장님', x: 0.56, w: 134, h: 320, lines: ['낮에 본 걸 밤에 또 틀어 주는 거여.', '온 세상이 같이 보고 있다는구먼.'] },
          { id: 'soldier', name: '휴가 나온 군인', x: 0.86, w: 97, h: 303, lines: ['휴가 나왔다가 이걸 다 보네요.', '로켓이 나흘을 날아갔답니다.'] },
          { id: 'sleepy', name: '졸린 꼬마', x: 0.94, w: 78, h: 198, lines: ['졸려… 그래도 다 볼 거야.', '(눈을 비빈다)'] },
        ],
        spots: [
          // She stands a little to the girl's right, so as not to hide her.
          { id: 'girl', from: 0.715, to: 0.8, sora: '저 애가… 할머니야?', memo: '그래, 평상 끝의 그 단발머리가 나란다.' },
        ],
      },
      {
        id: 'bank', name: '냇가 둑길', zoom: 1.25, ground: 0.74, scale: 0.86, murmur: 0.1,
        sora: '달이 떴어. 조용하다.',
        moving: [
          { kind: 'drift', id: 'stroll', src: 'villagers', from: 0, to: 1, foot: 0.736, tall: 0.17, wide: 0.29, gap: 1.4, speed: -0.02, bob: 0.003, flip: true },
        ],
        people: [
          { id: 'radio', name: '라디오 든 청년', x: 0.1, w: 95, h: 249, lines: ['라디오로도 중계를 해 줘요.', '지금도 둘은 달 위에 있대요.'] },
          { id: 'schoolgirl', name: '여학생', x: 0.21, w: 74, h: 200, lines: ['나도 커서 달에 가 보고 싶어.', '선생님이 꼭 보라고 하셨어.'] },
          { id: 'granny', name: '달 보는 할머니', x: 0.34, w: 99, h: 217, lines: ['저 달에 사람이 갔다니, 원.', '토끼는 놀라 달아났겠구먼.'] },
          { id: 'point', name: '달을 가리키는 아이', x: 0.63, w: 72, h: 192, lines: ['저기! 저기 사람이 있대!', '손 흔들면 보일까?'] },
          { id: 'angler', name: '낚시하는 아저씨', x: 0.73, w: 115, h: 320, lines: ['고기는 안 물고 달만 밝네.', '물에도 달이 하나 떠 있구먼.'] },
          { id: 'hut', name: '원두막 아저씨', x: 0.88, w: 100, h: 245, lines: ['수박밭 지키다 달 구경하네.', '오늘 달은 반쪽도 안 돼.'] },
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
};
