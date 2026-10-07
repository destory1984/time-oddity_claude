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
// The ordinary people are made up; their lines are what such a person might have said.
// Every fact in them is from memory and to be checked (the hundred days of games, the
// sailors of the fleet at Misenum who worked the awning, the numbered entrances and the
// tokens, free entry, the seats by rank with women at the top, Nero's lake).
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
        id: 'inside', name: '경기장 안', zoom: 1.3, ground: 0.775, scale: SHEET.inside,
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
};
