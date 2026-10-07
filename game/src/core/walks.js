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
// Paris, to be checked: the tower opened to the public on 15 May 1889 with its lifts not
// yet running (they began late in May), over three hundred steps to the first floor, a
// franc to enter the fair, thirty-five countries, the artists' protest of 1887, the Forth
// Bridge then being built, four restaurants on the first floor, two years and two months
// of building, eighteen thousand pieces of iron, Edison's phonograph heard through tubes
// in the Gallery of Machines, and its roof standing with no pillar.
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
          { id: 'ticket', name: '표 파는 사람', x: 0.1, w: 138, h: 277, lines: ['입장은 1프랑! 탑은 따로 받아요.', '오늘부터 탑에 올라갈 수 있소.'] },
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
};
