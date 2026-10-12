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

// A place's `drawn` is a line of grandmother's on why the place looks as it does: whose
// pictures its own are made after. It was on her slip each time Sora was set down there, until
// 2026.10.12 (the user, of it large in the middle of the screen: "너무 뜸금 없는 얘기야."); it is
// in the notebook under the place (the user, 2026.10.10: "각 도시로 들어갈 때에 그림체를 그렇게
// 선택한 이유에 대해서 설명해볼까?", and to my offer of a line of grandmother's: "넣어.").
// The four places still in the first manner of the game have none.
// A place's `first` is what she writes of the day and of what is to be done there: on her slip
// the first time Sora is set down in the place, and not again (the user, 2026.10.12, of the
// slip coming up in a place all done: "모든 칸 완료했는데, 저건 왜 또 떠?").
// A scene's `spots` are where she stands to see something: [{ id, from, to, memo?, pose?,
// see? }]. Standing between `from` and `to` does the errand that names the spot. What is
// seen from it may be touched, and she then walks there: `see` is where it is in the
// picture (left, top, right, bottom as shares of it); without one, all of the picture
// above the spot answers.
// (A tap's `show` is a picture of the thing, show-<show>.webp, put on grandmother's slip with
// what she wrote of it. The user, 2026.10.12, of the paper cup: "이런건 보여줘야지".)
// A scene's `taps` are places in its picture that may be touched for a word from Sora:
// [{ id, name, box: left, top, right, bottom as shares of the picture, sora: [lines said in
// turn], pose? }] (the user, 2026.10.9, of the new star in Kaifeng's sky: "하늘을 누르면, 소리가
// 뭔가 얘기를 해주게 추가").
// A tale's `thing: true` says there is a picture of what is carried (walks/<dir>/thing.png):
// it flies to her when she takes it, is seen beside her while she has it, and flies on when
// she hands it over (the user, 2026.10.9: "쪽지를 주는 액션은 없었는데, 쪽지는 받았네").
// A place's `now` is { photo, name, when, text: [lines], credit }: a photograph of the place
// as it is today (or of what is left of the thing she came to see), shown on a sheet when
// all is done there (the user, 2026.10.9: "마지막에 현재 사진을 팝업으로 보여주고, 클릭하면,
// 다시 게임 화면으로"; asked whether at one place or all: "열세 자리 다"). The photographs are
// from Wikimedia Commons, each downloaded with the user's leave; README lists them. What the
// lines say was written from memory except Constantinople's, which was looked up.
import { LAYERS } from './layers.js';

export const WALKS = {
  colosseum: {
    first: '오늘은 콜로세움이 처음 문을 여는 날이란다. 심부름 셋을 해 보렴.',
    dir: 'rome', look: 'paper',
    drawn: '한 해 전 화산재에 묻힌 폼페이의 벽 그림처럼 그렸단다. 그때 로마의 집마다 있던 그림이지.',
    now: {
      photo: 'photo-now.webp', name: '콜로세움의 지금 모습', when: '이탈리아 로마 · 오늘날',
      text: [
        '지금도 로마 한가운데에 서 있습니다. 문을 연 지 1,900년이 넘었습니다.',
        '바깥 벽은 절반쯤만 남았습니다. 지진으로 무너진 돌을 가져다 다른 집을 지었습니다.',
        '해마다 수백만 명이 보러 옵니다.',
      ],
      credit: '사진: Anil Öztas, 위키미디어 공용, CC BY 4.0',
    },
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
          { id: 'ticket', pass: '어디 보자, 내 문이…', show: 'token', name: '구경 온 아저씨', x: 0.26, w: 100, h: 309, lines: ['이 조각에 문 번호가 있지. 공짜야!', '황제가 여는 잔치라 돈을 안 받아.'],
            try: { id: 'use-token', verb: 'use', name: '입장 조각', sora: '스물셋… 스물셋 문은 저쪽이다!', memo: '입구에 번호가 있어서 오만 명이 금방 들어갔단다.' } },
          { id: 'wife', pass: '세상에, 저게 다 돌이야?', name: '아주머니', x: 0.33, w: 108, h: 270, lines: ['저 높이 좀 봐. 목이 아프네.', '아치마다 조각상이 서 있어.'] },
          // Not a person: it is used, not spoken to.
          { id: 'clock', show: 'clock', name: '물시계', x: 0.415, w: 83, h: 212,
            try: { id: 'use-clock', verb: 'use', name: '물시계', label: '물시계 볼래', sora: '똑, 똑… 물로 시간을 재네.', memo: '낮을 열둘로 나눴으니 여름 한 시간이 더 길었단다.' } },
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
          { id: 'nuts', pass: '콩이요, 콩! 보고 가요!', show: 'beans', name: '견과 파는 소년', x: 0.29, w: 99, h: 247, lines: ['볶은 콩 있어요! 구운 밤!', '싸움 시작하면 못 팔아. 지금 사.'],
            try: { id: 'eat-beans', verb: 'eat', name: '볶은 콩', face: 'yum', sora: '고소해! 하나만 더 먹을래.' } },
          { id: 'clap', pass: '와아! 공이다, 공!', show: 'balls', pose: 'see-gasp', sora: '공에 적힌 걸 진짜 주는 거야?!', memo: '황제가 던진 나무 공에 옷, 그릇, 말 같은 상품이 적혀 있었단다.', name: '관중 아저씨', x: 0.4, w: 101, h: 320, lines: ['황제가 나무 공을 던졌어! 잡았지.', '공에 적힌 걸 준대. 나는 옷이야!'] },
          { id: 'cheer', pass: '꺄아, 멋지다!', name: '관중 아가씨', x: 0.7, w: 89, h: 289, lines: ['저기 행진 온다! 반짝반짝해.', '천을 흔들면 황제가 본대.'] },
          { id: 'sailor1', pass: '영차, 줄 당겨라!', name: '뱃사람', x: 0.82, w: 108, h: 254, lines: ['미세눔에서 왔소. 돛 당기던 손이지.', '이 차양이 돛 천이오. 줄쯤이야.'] },
          { id: 'sailor2', pass: '영차! 조금만 더!', name: '젊은 뱃사람', x: 0.89, w: 92, h: 273, lines: ['해가 돌면 차양도 돌려야 하오.', '바람 센 날이 제일 무섭지.'] },
        ],
        spots: [
          // The emperor in his box across the sand: seen, not spoken to.
          // (She says so and looks up, since 2026.10.9: the user, of the emperor's box: "티투스 앞을
          // 지나갈 때에 뭔가 리액션이 있어야겠어. 그냥 지나가네".)
          { id: 'titus', from: 0.47, to: 0.63, sora: '저기 황제다! 머리에 잎사귀 관을 썼어.', pose: 'see-wow', memo: '저 사람이 티투스란다. 아버지가 짓기 시작한 걸 아들이 열었지.' },
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
    first: '오늘은 에펠탑이 문을 연 날이란다. 박람회에 처음 나온 것들을 찾아보렴.',
    // Since 2026.10.12 a place where things are found (core/seek.js; the user, of San Francisco
    // and Tokyo made so: "파리도 이런 식으로 바꿔보자", and of the table of nine: "ㅇㅇ"): what was
    // first shown to the world at the fair, three of them things that go by (`moving` with `touch`).
    seek: true,
    // Drawn again in the manner of the Impressionists' oils of the streets of Paris (the
    // user, 2026.10.10: "그림체 바꾸자", and of five tries: "1"). The words and errands are
    // as they were. The sky is in the pictures (`pale`), and people speak in bubbles: the
    // faces of the panel were of the old manner. Looked up: Seurat's "Eiffel Tower" is of
    // about 1889, Monet's "Boulevard des Capucines" of 1873 → 1874, Pissarro's streets of
    // 1897: so "about then", not "that year".
    dir: 'paris', look: 'paper', pale: true,
    drawn: '그 무렵 파리의 화가들이 짧은 붓질로 빛을 그리던 것처럼 그렸단다.',
    now: {
      photo: 'photo-now.webp', name: '에펠탑의 지금 모습', when: '프랑스 파리 · 오늘날',
      text: [
        '박람회 스무 해 뒤에 헐기로 했으나, 꼭대기를 안테나로 쓰게 되어 남았습니다.',
        '지금 높이는 안테나까지 330미터입니다.',
        // The user, 2026.10.10: "보수 공사비 많이 들어가던데". Looked up at toureiffel.paris: painted twenty
        // times, about once in seven years, about 60 tonnes a time. What it costs differs by source and is left out.
        '녹슬지 않게 일곱 해쯤마다 페인트 60톤으로 다시 칠합니다.',
        // The user, 2026.10.10: "보수 비용이 얼마나 들어가는지도 적어. 어른들은 숫자(돈) 좋아해". Reuters, July
        // 2022, after the magazine Marianne: 60 million euros. The final sum was not found.
        '스무 번째 칠(2019년 시작)에는 6천만 유로가 든다고 보도되었습니다.',
      ],
      credit: '사진: Benh LIEU SONG, 위키미디어 공용, 공개 저작물',
    },
    scenes: [
      {
        id: 'gate', name: '파리 만국박람회 입구', short: '박람회 입구', zoom: 1.03, ground: 0.785, scale: 0.602, air: 'street',
        sora: '깃발이 잔뜩! 저 끝에 탑이야.',
        // The dome seen through the middle arch (the user, 2026.10.10, with a red ring about it: "누르면 설명
        // 추가"). Looked up (nga.gov, toureiffel.paris): the Dôme Central, the way into the Palais des
        // Industries Diverses, nearly 200 feet high, a statue of France 30 feet high on top.
        taps: [
          { id: 'dome', name: '중앙 돔', box: [0.456, 0.39, 0.612, 0.68], pose: 'see-wow', sora: ['저 둥근 지붕 좀 봐! 반짝반짝해.', '꼭대기에 누가 서 있어!'], memo: '박람회 한가운데에 선 중앙 돔이란다. 높이가 60미터쯤이고 꼭대기에 조각상이 섰지.' },
          { id: 'tall', show: 'tall', name: '세상에서 가장 높은 탑', box: [0.845, 0.03, 0.99, 0.56], pose: 'see-wow', sora: ['저 탑, 구름에 닿겠어!', '세상에서 제일 높대.'], memo: '높이 300미터, 그때 사람이 지은 것 가운데 가장 높았단다.' },
          { id: 'flag-0', show: 'flags', name: '백 년 잔치의 삼색 깃발', box: [0.277, 0.42, 0.31, 0.58], pose: 'see-aha', sora: ['빨강, 하양, 파랑! 깃발이 많아.', '무슨 잔치일까?'], memo: '프랑스 혁명 백 년을 기리는 박람회였단다. 그래서 온통 삼색 깃발이지.' },
          { id: 'flag-1', show: 'flags', name: '백 년 잔치의 삼색 깃발', box: [0.403, 0.35, 0.44, 0.58], pose: 'see-aha', sora: ['빨강, 하양, 파랑! 깃발이 많아.', '무슨 잔치일까?'], memo: '프랑스 혁명 백 년을 기리는 박람회였단다. 그래서 온통 삼색 깃발이지.' },
          { id: 'flag-2', show: 'flags', name: '백 년 잔치의 삼색 깃발', box: [0.615, 0.35, 0.652, 0.58], pose: 'see-aha', sora: ['빨강, 하양, 파랑! 깃발이 많아.', '무슨 잔치일까?'], memo: '프랑스 혁명 백 년을 기리는 박람회였단다. 그래서 온통 삼색 깃발이지.' },
          { id: 'flag-3', show: 'flags', name: '백 년 잔치의 삼색 깃발', box: [0.745, 0.42, 0.777, 0.58], pose: 'see-aha', sora: ['빨강, 하양, 파랑! 깃발이 많아.', '무슨 잔치일까?'], memo: '프랑스 혁명 백 년을 기리는 박람회였단다. 그래서 온통 삼색 깃발이지.' },
          // (The train is a piece of the scene's `moving`, which names it by `touch`: it has no box.)
          { id: 'train', show: 'train', name: '깃발 든 사람과 꼬마 기차', pose: 'see-wow', sora: ['꼬마 기차다! 깃발 든 아저씨가 앞서 걸어.', '걷는 것보다 조금 빠르네.'], memo: '박람회장을 도는 꼬마 기차란다. 깃발 든 사람이 앞서 걸었지.' },
        ],
        // People pour in at the middle arch from both sides, and are lost at its two pillars.
        moving: [
          // (The little train of the fair, a man with a flag walking before it, goes by to the left.)
          { kind: 'drift', id: 'train', touch: 'train', src: 'train', from: 0, to: 1, foot: 0.8, tall: 0.32, wide: 0.619, gap: 1.6, speed: -0.045, bob: 0 },
          { kind: 'drift', id: 'in', src: 'crowd', from: 0, to: 0.43, foot: 0.772, tall: 0.18, wide: 0.367, gap: 0.03, speed: 0.03, bob: 0.003 },
          { kind: 'drift', id: 'out', src: 'crowd', from: 0.633, to: 1, foot: 0.772, tall: 0.18, wide: 0.367, gap: 0.03, speed: -0.026, bob: 0.003, flip: true },
        ],
        people: [
          { id: 'ticket', pass: '표 사시오! 줄은 이쪽이오.', show: 'train', pose: 'see-wow', sora: '기차 앞을 사람이 걸어가!', memo: '박람회장을 도는 꼬마 기차란다. 깃발 든 사람이 앞서 걸었지.', name: '표 파는 사람', x: 0.185, w: 146, h: 286, lines: ['꼬마 기차도 타 보시오. 저기요.', '오늘부터 탑에 올라갈 수 있소.'] },
          { id: 'news', pass: '호외요! 이 그림 좀 봐요!', name: '신문팔이 소년', x: 0.265, w: 114, h: 275, lines: ['탑 꼭대기 삼백 미터! 세계 제일!', '다른 탑은 죄다 절반이오!'] },
          { id: 'flower', pass: '꽃 사세요, 꽃!', name: '꽃 파는 소녀', x: 0.345, w: 119, h: 259, lines: ['은방울꽃 사세요! 오월의 꽃이에요.', '오늘은 다들 탑만 올려다봐요.'] },
          { id: 'parasol', pass: '어머, 볕이 따갑네.', name: '양산 든 부인', x: 0.46, w: 152, h: 320, lines: ['백 년 전 혁명을 기리는 잔치란다.', '서른다섯 나라가 왔다지 뭐니.'] },
          { id: 'tophat', pass: '흠, 저게 예술이라고?', name: '실크해트 신사', x: 0.66, w: 126, h: 313, lines: ['쇠로 탑이라니. 난 반대했었소.', '…그래도 표는 샀소. 궁금해서.'],
            try: { id: 'wear-tophat', verb: 'wear', name: '실크해트', outfit: 'tophat', sora: '모자가 굴뚝만 해! 휘청휘청.' } },
          { id: 'kilt', pass: '허, 크긴 크구먼.', name: '먼 데서 온 아저씨', x: 0.855, w: 133, h: 291, lines: ['스코틀랜드에서 배 타고 왔다네.', '우리도 쇠로 큰 다리를 놓는 중이지.'] },
        ],
        spots: [],
      },
      {
        id: 'tower', name: '파리 에펠탑 아래', short: '에펠탑 아래', zoom: 1.09, ground: 0.735, scale: 0.638, air: 'court', floor: 'dirt',
        sora: '우와, 다리 하나가 집채만 해.',
        // The stair up the right leg, one straight flight of it: people go up one after another.
        moving: [
          { kind: 'climb', id: 'up', touch: 'climb', srcs: ['climb-1', 'climb-2', 'climb-3', 'climb-4', 'climb-5', 'climb-6'],
            path: [[0.983, 0.635], [0.751, 0]],
            tall: 0.075, seconds: 30, step: 0.004 },
        ],
        people: [
          { id: 'down', pass: '아, 다리 아파. 그래도 좋았어!', show: 'press', pose: 'see-gasp', sora: '탑 위에서 신문을 찍어?!', memo: '탑 안에 신문사가 들어와 날마다 신문을 찍었단다. 오늘이 첫 호야.', name: '내려온 아가씨', x: 0.14, w: 109, h: 307, lines: ['탑 위에서 신문을 찍고 있어요!', '두 해 두 달 만에 다 지었대요.'] },
          { id: 'painter', pass: '어이, 내 그림 좀 보고 가오.', name: '화가', x: 0.27, w: 152, h: 317, lines: ['내 그림 보겠소? 탑은 붉은 갈색이지.', '흉물이라던 이들이 다 올라가더군.'] },
          { id: 'kid', pass: '우와아, 높다!', name: '올려다보는 아이', x: 0.38, w: 82, h: 201, lines: ['꼭대기가 구름에 닿을 것 같아!', '아빠가 나는 다음에 올라가래.'] },
          { id: 'postcard', show: 'postcard', pass: '어머, 도장 좀 봐!', pose: 'see-aha', sora: '도장에도 탑이 있어!', memo: '탑 층마다 우체통이 있어 탑 그림 도장을 찍어 줬단다.', name: '엽서 든 아가씨', x: 0.6, w: 155, h: 294, lines: ['탑 위에서 부친 엽서예요.', '도장에 탑이 그려져 있지요?'] },
          { id: 'photo', pass: '자, 여기 보시오!', name: '사진사', x: 0.68, w: 156, h: 320, lines: ['움직이지 마시오! 하나, 둘…', '탑이 커서 한 장에 다 안 들어가.'] },
          { id: 'puff', pass: '헉, 헉…', name: '숨 고르는 아저씨', x: 0.775, w: 155, h: 305, lines: ['헉, 헉… 1층만 갔다 왔네.', '위에서 보니 파리가 손바닥만 해.'] },
          { id: 'stairs', pass: '계단은 이쪽입니다!', name: '계단 안내원', x: 0.865, w: 120, h: 317, lines: ['엘리베이터는 아직이에요. 계단으로!', '1층까지 삼백 계단이 넘어요.'] },
        ],
        spots: [
          // Right under the middle of the arch, looking straight up.
          { id: 'under', from: 0.45, to: 0.56, sora: '우와… 다리가 후들거려.', memo: '쇠 조각 만팔천 개를 리벳으로 이어 세운 탑이란다.' },
        ],
        taps: [
          // (Those going up the stair are pieces of the scene's `moving`: no box. `x` is for pointing her to them.)
          { id: 'climb', show: 'stairs', name: '계단을 걸어 오르는 사람들', x: 0.87, pose: 'see-gasp', sora: ['저 높은 데를 걸어서 올라가!', '다리 아프겠다.'], memo: '엘리베이터가 아직 안 돌아서 첫 주에 29,922명이 걸어 올랐단다.' },
        ],
      },
      {
        id: 'hall', name: '파리 만국박람회 기계관', short: '박람회 기계관', zoom: 1.16, ground: 0.69, scale: 0.678, air: 'works', floor: 'wood',
        sora: '쿵쿵쿵! 바퀴가 진짜 돌아가.',
        // The two flywheels may be touched (the user, 2026.10.10: "저 바퀴 설명도 넣어줘"). Looked up: a flywheel
        // takes up the surplus of the stroke that drives and gives it back in the others, so the shaft turns evenly.
        taps: [
          { id: 'table', show: 'phonograph', name: '말하는 기계', box: [0.8, 0.5, 0.975, 0.665], pose: 'see-aha', sora: ['통에서 목소리가 나온대!', '관을 귀에 대고 듣는 거구나.'], memo: '에디슨이 만든 말하는 기계란다. 밀랍 통에 소리를 새겼지.' },
          { id: 'bridge', show: 'bridge', name: '기계 위를 지나가는 다리', pose: 'see-wow', sora: ['다리가 굴러가! 사람이 잔뜩 탔어.', '기계를 위에서 구경하는구나.'], memo: '기계들 위로 지나가는 굴러가는 다리란다. 한 번에 백오십 명도 넘게 탔지.' },
          { id: 'red', name: '플라이휠', box: [0.171, 0.333, 0.389, 0.661], pose: 'see-wow', sora: ['바퀴가 나보다 훨씬 커! 빙글빙글.', '한번 돌면 잘 안 멈춘대.'], memo: '플라이휠이라는 무거운 바퀴란다. 증기가 밀 때 힘을 모았다가 돌려줘서 기계가 고르게 돌지.' },
          { id: 'blue', name: '플라이휠', box: [0.566, 0.333, 0.784, 0.661], pose: 'see-wow', sora: ['바퀴가 나보다 훨씬 커! 빙글빙글.', '한번 돌면 잘 안 멈춘대.'], memo: '플라이휠이라는 무거운 바퀴란다. 증기가 밀 때 힘을 모았다가 돌려줘서 기계가 고르게 돌지.' },
        ],
        // The two flywheels, cut out of the picture itself (tools/walk-art.py disc), turn where they lie.
        moving: [
          // (The rolling bridge of the hall goes by over the machines with those who ride it.)
          { kind: 'drift', id: 'bridge', touch: 'bridge', src: 'bridge', from: 0, to: 1, foot: 0.33, tall: 0.23, wide: 0.541, gap: 1.2, speed: 0.035, bob: 0 },
          { kind: 'spin', id: 'red', src: 'wheel-red', x: 0.2799, y: 0.4971, tall: 0.3291, rpm: 15 },
          { kind: 'spin', id: 'blue', src: 'wheel-blue', x: 0.6751, y: 0.4971, tall: 0.3291, rpm: 15 },
        ],
        people: [
          { id: 'reporter', pass: '어디 보자, 받아 적어야지.', name: '기자', x: 0.13, w: 107, h: 320, lines: ['기둥 하나 없이 이 넓이라니.', '쇠와 유리. 새 시대가 온 거요.'] },
          { id: 'engineer', pass: '손대지 마시오! 도는 중이오.', name: '기술자', x: 0.4, w: 167, h: 320, lines: ['이 바퀴가 벨트로 기계를 다 돌려.', '기름을 안 치면 금세 멈추지.'] },
          { id: 'ears', pass: '으아, 시끄러워!', name: '귀 막은 아이', x: 0.53, w: 107, h: 223, lines: ['너무 시끄러워! 귀가 멍멍해.', '(귀를 막고 고개를 젓는다)'] },
          { id: 'opera', show: 'theatrophone', pass: '쉿, 지금 노래 중이오.', pose: 'see-gasp', sora: '전화로 노래를 들어?', memo: '수화기를 귀에 대면 오페라 극장의 공연이 들렸단다. 테아트로폰이라 했지.', name: '수화기 든 신사', x: 0.645, w: 188, h: 301, lines: ['전화로 오페라 극장 소리를 듣는 중이오.', '가수가 바로 옆에 있는 것 같소!'] },
          { id: 'student', pass: '우와, 다 쇠로 만들었네.', name: '학생', x: 0.76, w: 125, h: 299, lines: ['에디슨이라는 미국 사람 거래요.', '전구도 그 사람이 만들었대요.'] },
          { id: 'queue', pass: '아이고, 줄이 안 줄어.', name: '줄 선 아주머니', x: 0.825, w: 125, h: 308, lines: ['한 시간째 줄이야. 그래도 들어야지.', '기계가 말을 한다니 믿어지니?'] },
          { id: 'phono', pass: '말하는 기계요! 보고 가시오.', show: 'phonograph', pose: 'see-peer', sora: '밀랍 통에 소리를 새겼구나!', name: '말하는 기계 지기', x: 0.92, w: 153, h: 315, sound: 'phonograph', lines: ['통 속에 사람 목소리가 들었소.', '관을 귀에 대 봐요. 노래가 나오지.'],
            try: { id: 'use-phono', verb: 'use', name: '말하는 기계', label: '말하는 기계 들어 볼래', sora: '관에서 노래가 나와! 신기해.' } },
        ],
        spots: [],
      },
    ],
    // Each is on record (docs/신기한-사실.md section 3). Of the rolling bridge it is on record that
    // the hall had two; whether they ran on this day was not found.
    errands: [
      { id: 'tall', scene: 'gate', text: '세상에서 가장 높은 탑', at: ['tall'] },
      { id: 'train', scene: 'gate', text: '깃발 든 사람과 꼬마 기차', at: ['train', 'ticket'] },
      { id: 'flags', scene: 'gate', text: '백 년 잔치의 삼색 깃발', at: ['flag-0', 'flag-1', 'flag-2', 'flag-3'] },
      { id: 'climb', scene: 'tower', text: '계단을 걸어 오르는 사람들', at: ['climb', 'stairs'] },
      { id: 'press', scene: 'tower', text: '탑 위에서 찍은 신문', at: ['down'] },
      { id: 'postcard', scene: 'tower', text: '탑 도장이 찍힌 엽서', at: ['postcard'] },
      { id: 'phono', scene: 'hall', text: '말하는 기계', at: ['table', 'phono', 'use-phono'] },
      { id: 'opera', scene: 'hall', text: '전화로 듣는 오페라', at: ['opera'] },
      { id: 'bridge', scene: 'hall', text: '기계 위를 지나가는 다리', at: ['bridge'] },
    ],
    reply: '엘리베이터 없이 그 높은 탑을 걸어 올랐다니. 처음 보는 것투성이였겠구나.',
  },
  // Three more in Paris's look (the user, 2026.10.8: "파리식으로 한양 포함해서 3개 더 만들어").
  // Hanyang in the autumn of 1446, when the new letters were given out. That a notice
  // was read aloud in the market street is made up. Looked up on 2026.10.8 and found so:
  // twenty-eight letters, given out in the ninth month of 1446, "a clever man learns them
  // before the morning is out, a dull one in ten days" (the gist of the book's afterword),
  // the ministers' one memorial against them (1444). Still from memory: the letters drawn
  // after the shapes of the mouth, the king's failing eyes, the bowl sundial of his reign.
  hunminjeongeum: {
    first: '새 글자 스물여덟 자가 세상에 나온 해란다. 심부름 셋을 해 보렴.',
    // Drawn again in the manner of the woodcuts of the Samgang haengsildo, printed under the
    // same king in 1434 (the user, 2026.10.10: "한양도 그림체 바꾸자.", and of four tries:
    // "1번으로 가자."). The words and errands are as they were. The sky is in the pictures
    // (`pale`), and people speak in bubbles: the faces of the panel were of the old manner.
    dir: 'hanyang', look: 'paper', pale: true,
    drawn: '세종 임금 때 나무판에 새겨 찍은 책의 그림처럼 그렸단다.',
    now: {
      photo: 'photo-now.webp', name: '집현전 자리의 지금 모습', when: '서울 경복궁 · 수정전',
      text: [
        '집현전이 있던 자리에 선 수정전입니다. 1867년에 다시 지었습니다.',
        '경복궁은 1592년 전쟁 때 불탔고 270년 넘게 빈터였습니다.',
        '그때 만든 글자를 지금 이 글에서 읽고 있습니다.',
      ],
      credit: '사진: De-Shao Liu, 위키미디어 공용, CC BY-SA 4.0',
    },
    scenes: [
      {
        id: 'market', name: '한양 저잣거리', zoom: 1.07, ground: 0.75, scale: 0.626, air: 'market', floor: 'dirt',
        sora: '감이 주렁주렁! 시끌시끌해.',
        moving: [
          { kind: 'drift', id: 'by', src: 'crowd', from: 0, to: 1, foot: 0.728, tall: 0.17, wide: 0.3853, gap: 0.12, speed: 0.028, bob: 0.003 },
        ],
        people: [
          { id: 'cloth', pass: '무명이오, 고운 무명!', show: 'jongnu', pose: 'see-aha', sora: '집 밑으로 길이 지나가네!', memo: '밤에 종을 스물여덟 번 치면 성문이 닫혔단다. 새벽 서른세 번에 열렸지.', name: '포목 장수', x: 0.18, w: 146, h: 303, lines: ['저 종루 밑으로 길이 났지요.', '밤 종이 울리면 성문이 닫힌다오.'] },
          { id: 'pots', pass: '독 사려! 독 안도 구경하시오!', show: 'kimchi', pose: 'see-gasp', sora: '김치가 하얘! 고추가 없었구나.',
            // Looked up on 2026.10.8 (the user asked for the year and the way it came): the
            // first word of it here is in a book of 1614, which says it came from Japan; that
            // it came about the war of 1592 is the common account, and some dispute it.
            memo: '고추는 임진왜란(1592년) 무렵 일본을 거쳐 들어왔다고들 한단다. 본디는 바다 건너 아메리카의 열매야.', name: '옹기 장수', x: 0.3, w: 129, h: 292, lines: ['독 안을 보시오. 김치가 하얗지요?', '고추? 그런 건 들어 본 적 없소.'],
            try: { id: 'eat-kimchi', verb: 'eat', name: '하얀 김치', face: 'yum', sora: '안 매워! 시원하고 짭짤해.' } },
          { id: 'reader', pass: '방이 붙었소! 다들 들으시오.', name: '방 읽어 주는 선비', x: 0.43, w: 144, h: 312, lines: ['새 글자 스물여덟 자가 나왔다오.', '슬기로우면 아침나절에 배운다오.'],
            try: { id: 'wear-gat', verb: 'wear', name: '갓과 도포', outfit: 'gat', sora: '어험! 선비가 된 것 같아.' } },
          { id: 'woodboy', pass: '나무 사려! 장작이오!', name: '나무꾼 소년', x: 0.52, w: 119, h: 226, lines: ['저게 글자야? 그림 같은데.', '가, 나, 다… 나도 따라 했어!'] },
          { id: 'tteok', pass: '떡 사려, 따끈한 떡!', show: 'tteok', name: '떡 파는 할머니', x: 0.77, w: 110, h: 257, lines: ['시루떡 따끈해요. 하나 드시우.', '열흘이면 배운다니 나도 해 볼까.'],
            try: { id: 'eat-tteok', verb: 'eat', name: '떡', face: 'yum', sora: '쫀득쫀득! 자꾸 손이 가.' } },
          { id: 'water', pass: '아이고, 물동이 무거워라.', name: '물동이 인 아낙', x: 0.862, w: 113, h: 320, lines: ['친정에 편지 한 장 못 썼다우.', '이제는 쓸 수 있으려나.'] },
        ],
        spots: [],
      },
      {
        id: 'gate', name: '한양 광화문 앞', short: '광화문 앞', zoom: 1.15, ground: 0.7, scale: 0.673, air: 'court', floor: 'dirt',
        sora: '문이 엄청 커! 지붕이 두 층이야.',
        moving: [
          { kind: 'drift', id: 'parade', src: 'parade', from: 0, to: 1, foot: 0.676, tall: 0.2, wide: 0.3169, gap: 0.55, speed: 0.032, bob: 0.003 },
        ],
        people: [
          { id: 'farmer', flip: true, pass: '허어, 문이 산만 하구먼.', name: '시골 농부', x: 0.14, w: 118, h: 242, lines: ['대궐이 이리 큰 줄 몰랐소.', '억울한 일을 글로 적을 수 있다던데.'] },
          { id: 'bearer', pass: '영차, 영차!', name: '가마꾼', x: 0.3, w: 115, h: 251, lines: ['아이고 어깨야. 대감은 무겁다니까.', '글자? 가마 멜 때는 쓸 데 없지.'] },
          { id: 'guard', pass: '물렀거라!', name: '수문장', x: 0.42, w: 123, h: 320, lines: ['멈추시오. 여기는 대궐 문이오.', '광화문이오. 스무 해 전에 얻은 이름이지.'] },
          { id: 'elder', pass: '에헴!', name: '늙은 대신', x: 0.58, w: 111, h: 267, lines: ['한문이 있는데 새 글자가 웬 말이오.', '…허나 임금의 뜻이 굳으시오.'] },
          { id: 'official', pass: '새 글자요. 한번 보고 가시오.', show: 'letters', pose: 'see-aha', sora: '지금은 안 쓰는 글자가 넷이구나!', name: '젊은 관리', x: 0.7, w: 118, h: 263, lines: ['새 글자 스물여덟 자요. 보시오.', '소리 나는 대로 적으니 참 쉽소.'] },
          { id: 'girl', pass: '늦었다, 늦었어!', name: '심부름 가는 소녀', x: 0.86, w: 103, h: 231, lines: ['마님 심부름 가요. 바빠요!', '언니가 새 글자를 가르쳐 준댔어.'] },
        ],
        spots: [],
      },
      {
        id: 'hall', name: '경복궁 집현전 뜰', short: '집현전 뜰', zoom: 1.09, ground: 0.74, scale: 0.638, air: 'palace',
        sora: '책이 마당 가득이야. 조용해.',
        moving: [
          { kind: 'drift', id: 'books', src: 'scholars', from: 0, to: 1, foot: 0.716, tall: 0.17, wide: 0.2807, gap: 0.6, speed: 0.026, bob: 0.003 },
        ],
        people: [
          { id: 'books', pass: '볕이 좋구먼.', name: '책 말리는 아저씨', x: 0.2, w: 114, h: 315, lines: ['볕 좋은 날 책을 말려야 하오.', '좀이 슬면 큰일이라오.'] },
          { id: 'sleepy', pass: '하암… 졸려라.', name: '졸린 학사', x: 0.32, w: 127, h: 313, lines: ['밤새 풀이를 썼소. 하암…', '임금님이 더 늦게 주무신다오.'] },
          { id: 'scholar', pass: '흠, 이 소리는 어찌 적을꼬.', name: '집현전 학사', x: 0.41, w: 134, h: 320, lines: ['글자마다 입 모양을 본떴다오.', '이 글자는 혀뿌리가 막힌 모양이지.'] },
          { id: 'tea', pass: '차 식어요. 비켜 주세요.', show: 'ongnu', pose: 'see-gasp', sora: '인형이 스스로 종을 쳐?!', memo: '종이로 만든 산을 금빛 해가 하루 한 바퀴 돌았단다. 때마다 인형이 종을 쳤지.', name: '차 나르는 궁녀', x: 0.66, w: 116, h: 302, lines: ['흠경각에는 인형 시계가 있답니다.', '종이 산을 금빛 해가 돌아요.'] },
          { id: 'child', pass: '가, 나, 다, 라…', show: 'brush', name: '글자 쓰는 아이', x: 0.75, w: 86, h: 206, lines: ['이거 봐! 내 이름이야. 내가 썼어!', '어제 배웠는데 벌써 다 써.'],
            try: { id: 'use-letters', verb: 'use', name: '새 글자', sora: 'ㅅ, ㅗ, ㄹ, ㅏ… 소라! 썼다!' } },
          { id: 'sundial', pass: '해시계 구경하고 가시오.', show: 'sundial', name: '해시계 보는 관원', x: 0.862, w: 130, h: 311, lines: ['혜정교 것과 같은 해시계라오.', '글 몰라도 그림으로 때를 알지.'],
            try: { id: 'use-sundial', verb: 'use', name: '해시계', label: '해시계 볼래', sora: '그림자 끝이 지금 시각이야!' } },
        ],
        spots: [
          // The king at his books, deep in the middle bay: seen, not spoken to. She stands a little to his right, so as not to hide him.
          { id: 'sejong', from: 0.51, to: 0.57, see: [0.45, 0.55, 0.505, 0.67], memo: '저 안에 앉은 분이 세종대왕님이란다. 백성이 쉽게 쓰라고 만드셨지.' },
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
  // The toll on foot that day was 25 cents, taken at coin turnstiles (looked up on 2026.10.12:
  // goldengate.org and the Library of Congress both say so; one paper of the day said 5). The
  // user, of "동전 한 닢": "센트 아님?". Still from memory: the first on skates and the first walking backward,
  // the net that saved nineteen, four years of building, 67 m from the water, 1,280 m
  // between the towers.
  goldenGate: {
    // Drawn again in the manner of the posters the WPA printed in America in those years (the
    // user, 2026.10.10, on being shown the place: "그림체는?", and of five tries: "샌프란은
    // 1번이야"). The words and errands are as they were. The sky is in the pictures (`pale`),
    // and people speak in bubbles: the faces of the panel were of the old manner.
    // Since 2026.10.12 what is done here is finding things (core/seek.js): three in each scene,
    // by touching the person or the place in the picture, and the way on opens when all three
    // are found (those who crossed some odd way: see its errands). Of the flag: the United States had 48 states from 1912 to 1959 (from memory).
    dir: 'sf', look: 'paper', pale: true, seek: true,
    drawn: '그 무렵 미국의 포스터처럼 평평한 색 몇 가지로 그렸단다.',
    first: '오늘은 금문교가 처음 열린 날이란다. 별나게 건너는 사람들을 찾아보렴.',
    now: {
      photo: 'photo-now.webp', name: '금문교의 지금 모습', when: '미국 샌프란시스코 · 오늘날',
      text: [
        '문을 연 날과 같은 주황빛입니다. 해마다 조금씩 다시 칠합니다.',
        '탑의 높이는 227미터입니다.',
        '1964년까지 세상에서 가운데 칸이 가장 긴 매단 다리였습니다.',
      ],
      credit: '사진: Frank Schulenburg, 위키미디어 공용, CC BY-SA 4.0',
    },
    scenes: [
      {
        id: 'plaza', name: '샌프란시스코 금문교 어귀', short: '금문교 어귀', zoom: 1.09, ground: 0.74, scale: 0.638, air: 'road',
        sora: '다리가 빨개! 엄청 길다.',
        moving: [
          { kind: 'drift', id: 'in', src: 'crowd', from: 0, to: 1, foot: 0.736, tall: 0.16, wide: 0.386, gap: 0.05, speed: 0.03, bob: 0.003 },
        ],
        people: [
          { id: 'hotdog', pass: '핫도그! 따끈한 핫도그 보고 가쇼!', show: 'hotdog', name: '핫도그 장수', x: 0.18, w: 122, h: 320, lines: ['핫도그요! 오늘 오만 개는 나가겠소.', '다리 구경엔 핫도그가 딱이지.'],
            try: { id: 'eat-hotdog', verb: 'eat', name: '핫도그', face: 'yum', sora: '겨자가 톡 쏴! 맛있다.' } },
          { id: 'sleepy', pass: '하암… 드디어 열렸네.', name: '밤새 기다린 청년', x: 0.263, w: 122, h: 319, lines: ['어젯밤부터 줄 섰어요. 하암…', '맨 먼저 건너고 싶었거든요.'] },
          { id: 'toll', pass: '한 줄로! 한 줄로 서요!', name: '요금 받는 사람', x: 0.341, w: 103, h: 310, lines: ['걸어서 건너는 값은 이십오 센트요.', '오늘은 사람만! 차는 내일부터요.'] },
          { id: 'nighters', pass: '아함, 잘 잤다.', pose: 'see-gasp', sora: '다리 밑에서 잤다고?!', memo: '두 아가씨가 맨 먼저 건너려고 전날 밤 다리 밑에서 잤단다.', name: '밤을 샌 두 아가씨', x: 0.443, w: 220, h: 303, lines: ['어젯밤 다리 밑에서 잤어요.', '맨 먼저 건너려고요!'] },
          { id: 'scout', pass: '길 잃은 분 안 계세요?', name: '보이스카우트 소년', x: 0.547, w: 115, h: 249, lines: ['아침 여섯 시에 문이 열렸어요.', '길 잃은 아이를 찾아 주는 중이에요.'] },
          { id: 'stilts', pass: '어이쿠, 비켜요, 비켜!', pose: 'see-gasp', sora: '키가 가로등만 해!', memo: '팰리스 호텔에서 일하던 플로렌틴 칼레제리가 죽마로 건너갔다 돌아왔단다.', name: '죽마 탄 사람', x: 0.63, w: 131, h: 404, lines: ['죽마로 건너갔다 돌아올 거요.', '호텔 일보다 이게 더 쉽소!'] },
          { id: 'runner', pass: '헉헉, 내가 일등!', pose: 'see-wow', sora: '벌써 갔다 온 거야?', memo: '끝까지 맨 먼저 건넌 사람은 대학 달리기 선수 도널드 브라이언이란다.', name: '달리기 선수', x: 0.71, w: 100, h: 233, lines: ['헉헉. 저 끝까지 뛰어갔다 왔어요.', '끝까지 건넌 건 내가 처음이래요!'] },
          { id: 'badge', pass: '기념 배지 있어요!', name: '기념품 아주머니', x: 0.787, w: 122, h: 302, lines: ['기념 배지 사세요! 오늘뿐이에요.', '손주한테 줄 거라고들 사 가요.'],
            try: { id: 'wear-fedora', verb: 'wear', name: '중절모', outfit: 'fedora', sora: '다들 모자를 썼네. 나도!' } },
          { id: 'camera', pass: '자, 찍습니다! 치즈!', name: '사진기 든 아가씨', x: 0.865, w: 101, h: 305, lines: ['별난 사람은 다 찍을 거예요.', '저마다 처음이 되려고 야단이에요.'] },
        ],
        spots: [],
        taps: [
          { id: 'gate', name: '동전 넣는 회전문', box: [0.245, 0.5, 0.7, 0.715], pose: 'see-aha', sora: ['동전을 넣으면 돌아가는 문이야!', '한 사람씩 돌려서 들어가네.'], memo: '걸어서 건너려면 이십오 센트를 넣었단다.' },
          { id: 'cart', name: '핫도그 수레', box: [0.036, 0.48, 0.165, 0.725], sora: ['김이 모락모락 나! 핫도그 수레다.', '소시지 삶는 냄새야.'] },
          { id: 'flag', name: '가로등에 걸린 큰 깃발', box: [0.212, 0.2, 0.262, 0.385], pose: 'see-aha', sora: ['깃발에 별이 마흔여덟 개야!', '지금은 쉰 개인데.'], memo: '그때 미국은 주가 마흔여덟이었단다. 지금은 쉰이지.' },
        ],
      },
      {
        id: 'deck', name: '샌프란시스코 금문교 위', short: '금문교 위', zoom: 1.12, ground: 0.722, scale: 0.655, air: 'bridge',
        sora: '차가 없으니까 운동장 같아.',
        // The crowd goes over on foot. (Those who cross some odd way went by in a line of their own
        // until 2026.10.12: they now stand among the people, to be found.)
        moving: [
          { kind: 'drift', id: 'over', src: 'crowd', from: 0, to: 1, foot: 0.716, tall: 0.16, wide: 0.386, gap: 0.08, speed: 0.03, bob: 0.003 },
        ],
        people: [
          { id: 'mother', pass: '바람이 시원하네, 아가.', name: '유모차 미는 어머니', x: 0.15, w: 217, h: 308, lines: ['아기도 오늘을 기억하면 좋겠어요.', '배 타고 건너던 길을 걸어서 가네.'] },
          { id: 'grandpa', pass: '허허, 살다 보니 별일이야.', name: '할아버지', x: 0.246, w: 123, h: 318, lines: ['이 물목에 다리는 못 놓는다 했지.', '살아서 걸어 건널 줄이야.'] },
          { id: 'tuba', pass: '뿜빠, 뿜빠!', pose: 'see-wow', sora: '저 큰 나팔을 불면서 걸어?', memo: '튜바를 불면서 건넌 사람도 있었단다.', name: '튜바 부는 아저씨', x: 0.338, w: 196, h: 355, lines: ['(튜바를 분다) 뿜빠 뿜빠!', '끝까지 불면서 갈 거요.'] },
          { id: 'worker', pass: '어이, 그물 구경해 볼 테요?', show: 'net', pose: 'see-gasp', sora: '다리 밑에 그물을 쳤구나!', name: '다리 일꾼', x: 0.433, w: 141, h: 320, lines: ['짓는 동안 밑에 그물을 쳤소. 보시오.', '그 그물에 떨어져 열아홉이 살았소.'] },
          { id: 'sisters', pass: '비켜요, 비켜! 지나가요!', pose: 'see-wow', sora: '바퀴 달린 신이다!', memo: '롤러스케이트로 처음 건넌 사람은 카르멘과 미니 페레스 자매란다.', name: '롤러스케이트 자매', x: 0.552, w: 294, h: 260, lines: ['롤러스케이트로 건너는 중이야!', '우리 자매가 일등일걸.'] },
          { id: 'backward', pass: '뒤로 가요, 뒤로!', name: '뒤로 걷는 남자', x: 0.665, w: 114, h: 315, lines: ['뒤로 걸어 건넌 건 내가 처음이오.', '신문에 나려면 별나야지.'] },
          { id: 'unicycle', pass: '어어, 길 좀 비켜요!', pose: 'see-gasp', sora: '바퀴가 하나뿐이야!', memo: '외발자전거로 건넌 사람도 있었단다.', name: '외발자전거 탄 사람', x: 0.767, w: 250, h: 313, lines: ['바퀴 하나로 건너는 중이오.', '멈추면 넘어져요, 하하!'] },
          { id: 'harmonica', pass: '뿌우, 뿌!', name: '하모니카 소년', x: 0.865, w: 98, h: 246, lines: ['(하모니카를 분다) 뿌우 뿌!', '다리 건너며 한 곡 다 불 거야.'] },
        ],
        spots: [],
      },
      {
        id: 'mid', name: '샌프란시스코 금문교 한가운데', short: '금문교 한가운데', zoom: 1.17, ground: 0.692, scale: 0.684, air: 'bridge',
        sora: '바람이 세! 바다가 저 밑이야.',
        moving: [
          { kind: 'drift', id: 'east', src: 'crowd', from: 0, to: 1, foot: 0.678, tall: 0.15, wide: 0.362, gap: 0.3, speed: -0.025, bob: 0.003, flip: true },
          { kind: 'drift', id: 'west', src: 'crowd', from: 0, to: 1, foot: 0.688, tall: 0.16, wide: 0.386, gap: 0.2, speed: 0.03, bob: 0.003 },
        ],
        people: [
          { id: 'cat', pass: '야옹.', pose: 'see-wow', sora: '고양이가 다리를 건너!', memo: '목줄을 맨 샴고양이도 걸어서 건넜단다.', name: '목줄 맨 샴고양이', x: 0.145, w: 273, h: 300, lines: ['우리 고양이도 걸어서 건넌답니다.', '샴고양이예요. 목줄도 했지요.'] },
          { id: 'hat', pass: '어머, 내 모자!', name: '모자 잡는 아가씨', x: 0.272, w: 125, h: 245, lines: ['앗, 모자! 바람이 너무 세요.', '다리가 조금씩 흔들리는 것 같아요.'] },
          { id: 'scope', pass: '우와, 다 보인다!', show: 'scope', name: '멀리 보는 소년', x: 0.356, w: 91, h: 204, lines: ['저기 섬이 감옥이래. 알카트라즈.', '배가 다리 밑으로 지나가!'],
            try: { id: 'use-scope', verb: 'use', name: '망원경', label: '망원경 들여다볼래', sora: '저 섬에 건물이 보여!', memo: '저 섬은 알카트라즈란다. 그때는 감옥이었지.' } },
          { id: 'tap', pass: '탁, 타닥, 탁!', pose: 'see-wow', sora: '발에서 소리가 나!', memo: '탭댄스를 추면서 건넌 사람도 있었단다.', name: '탭댄스 추는 사람', x: 0.46, w: 212, h: 308, lines: ['춤추면서 건너는 중이에요!', '탭댄스로는 내가 처음일걸요.'] },
          { id: 'painter', pass: '이 다리 색 얘기 들어 봤소?', show: 'stripes', pose: 'see-aha', sora: '줄무늬 다리가 될 뻔했구나!', name: '칠장이', x: 0.57, w: 114, h: 267, lines: ['해군은 노란 줄무늬를 하자 했소.', '이 주황은 안개 속에서도 보이라고.'] },
          { id: 'coal', pass: '무겁구나, 얘야.', pose: 'see-gasp', sora: '석탄을 들고 온 거야?', memo: '펜실베이니아에서 온 아버지와 딸이 고향 석탄 11킬로그램을 들고 건넜단다.', name: '석탄을 든 아버지와 딸', x: 0.69, w: 253, h: 300, lines: ['펜실베이니아에서 왔소. 고향 석탄이오.', '이걸 들고 건넌 건 우리가 처음이지.'] },
          { id: 'sailor', pass: '바람 좋다!', name: '수병', x: 0.812, w: 123, h: 258, lines: ['군함이 이 밑으로 지나다닌다오.', '물에서 다리까지 예순일곱 미터.'] },
          { id: 'piggy', pass: '꽉 잡아라, 얘야.', show: 'cable', pose: 'see-aha', sora: '줄 하나가 철사 다발이었구나!', memo: '철사가 이만 칠천 가닥이란다. 다 이으면 지구를 세 바퀴 돌지.', name: '목말 태운 아버지', x: 0.9, w: 111, h: 320, lines: ['저 굵은 줄 속이 다 철사란다.', '이십만 명이 건넜다니 대단하지.'] },
        ],
        spots: [
          // (What is touched to walk there is the sea under the island: the island itself is found.)
          { id: 'middle', from: 0.47, to: 0.57, see: [0.47, 0.48, 0.57, 0.53], sora: '우와… 발밑이 다 바다야.', memo: '그때 세상에서 가장 긴 매달린 다리였단다.' },
        ],
        taps: [
          { id: 'telescope', name: '망원경', box: [0.33, 0.48, 0.39, 0.665], sora: ['바다 쪽을 보는 망원경이다!', '소년한테 빌려 볼까?'] },
          { id: 'island', name: '감옥이 있는 섬', box: [0.455, 0.4, 0.615, 0.475], pose: 'see-gasp', sora: ['저 섬에 건물이 있어!', '저기가 감옥이라고?'], memo: '저 섬은 알카트라즈란다. 그때는 감옥이었지.' },
          { id: 'cable-l', name: '다리를 매단 굵은 줄', box: [0.05, 0.08, 0.24, 0.33], pose: 'see-aha', sora: ['이 줄이 다리를 들고 있구나!', '내 몸통보다 굵어.'], memo: '철사가 이만 칠천 가닥이란다. 다 이으면 지구를 세 바퀴 돌지.' },
          { id: 'cable-r', name: '다리를 매단 굵은 줄', box: [0.76, 0.08, 0.95, 0.33], pose: 'see-aha', sora: ['이 줄이 다리를 들고 있구나!', '내 몸통보다 굵어.'], memo: '철사가 이만 칠천 가닥이란다. 다 이으면 지구를 세 바퀴 돌지.' },
        ],
      },
    ],
    errands: [
// What is found is those who crossed some odd way to be the first to: the day was theirs (the
      // user, 2026.10.12: "샌프란 메인 이벤트와 관련이 있는 것을 찾는걸로 하자", then of nine things
      // chosen from the pictures there were: "소재에 조금 더 신경을 써보자", and of these: "이대로
      // 지어"). All nine are on record (docs/신기한-사실.md section 4; the runner, Donald Bryan of
      // San Francisco Junior College, and the sisters on skates looked up on 2026.10.12).
      { id: 'stilts', scene: 'plaza', text: '죽마 탄 사람', at: ['stilts'] },
      { id: 'nighters', scene: 'plaza', text: '다리 밑에서 밤샌 두 아가씨', at: ['nighters'] },
      { id: 'runner', scene: 'plaza', text: '맨 먼저 건넌 달리기 선수', at: ['runner'] },
      { id: 'sisters', scene: 'deck', text: '롤러스케이트 자매', at: ['sisters'] },
      { id: 'tuba', scene: 'deck', text: '튜바 부는 아저씨', at: ['tuba'] },
      { id: 'unicycle', scene: 'deck', text: '외발자전거 탄 사람', at: ['unicycle'] },
      { id: 'cat', scene: 'mid', text: '목줄 맨 샴고양이', at: ['cat'] },
      { id: 'coal', scene: 'mid', text: '석탄을 든 아버지와 딸', at: ['coal'] },
      { id: 'tap', scene: 'mid', text: '탭댄스 추는 사람', at: ['tap'] },
    ],
    reply: '별난 사람이 참 많았구나. 나도 뒤로 걸어서 건너 볼 걸 그랬네.',
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
    dir: 'tokyo', seek: true,
    drawn: '스무 해쯤 뒤 일본에서 나온 게임기의 네모 점 그림처럼 그렸단다.',
    first: '오늘은 첫 고속 열차가 떠나는 날이란다. 오늘 처음 생긴 것들을 찾아보렴.',
    now: {
      photo: 'photo-now.webp', name: '신칸센의 지금 모습', when: '일본 도쿄역 · N700S와 N700A',
      text: [
        '소라가 탄 첫 열차의 뒤를 이은 열차들입니다. 같은 도쿄역 승강장입니다.',
        '가장 빠른 속도가 시속 210킬로미터에서 285킬로미터가 되었습니다.',
        '도쿄에서 오사카까지 4시간이던 길이 2시간 반이 안 걸립니다.',
      ],
      credit: '사진: 電車(新幹線)でゴー！, 위키미디어 공용, CC BY-SA 4.0',
    },
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
          { id: 'ticket', show: 'ticket', pass: '샀다, 드디어 샀어!', pose: 'see-gasp', sora: '표 한 장이 그렇게 비싸?', memo: '오사카까지 2등 표가 2,480엔, 그때 이틀 치 품삯쯤이었단다.', name: '표를 산 아저씨', x: 0.43, w: 172, h: 299, lines: ['오사카까지 이천사백팔십 엔이오.', '이틀 치 품삯이지만 아깝지 않소!'] },
          { id: 'salary', pass: '어이쿠, 늦겠네.', name: '회사원', x: 0.56, w: 130, h: 314, lines: ['아침에 가서 저녁에 돌아온다네.', '전에는 여섯 시간 반이 걸렸지.'] },
          // Spoken to, she opens a box and shows what is in it (the user, 2026.10.8: "아주머니가
          // 도시락을 열어서 내용물을 보여주는걸로 하자"). What is in it was looked up on 2026.10.8
          // (the user: "진짜지?"): the 150-yen lunch sold on the new trains in 1964, as it was
          // made again in 2002, had white rice with one pickled plum, fried white fish, beef
          // stewed dark, rolled egg and fish cake (kfm.sakura.ne.jp/ekiben, as a search
          // told it; the page itself came through garbled). The stewed roots, the yellow
          // pickle and the thin wooden box are from memory.
          { id: 'bento', pass: '도시락 구경하고 가세요!', show: 'ekiben', name: '도시락 아주머니', x: 0.72, w: 140, h: 287, lines: ['차 안에서 먹는 도시락이에요.', '역에서 파니까 에키벤이라 해요.'],
            try: { id: 'eat-ekiben', verb: 'eat', name: '기차 도시락', face: 'yum', sora: '식었는데도 맛있어!' } },
          // The one who asks. She stays where she is and waits (the user, 2026.10.9, of her
          // standing on the platform all at once when the flowers were handed over: "이 아가씨는 원래
          // 있던 자리에서 기다리라고 해").
          { id: 'flowers0', pass: '아이, 떨려라.', name: '꽃다발 든 아가씨', x: 0.8, w: 124, h: 308, lines: ['첫 기차에 드릴 꽃다발이에요.', '떨려서 꽃이 다 흔들려요.'] },
          { id: 'tourist', pass: '와, 역이 정말 크네요.', name: '먼 데서 온 여행자', x: 0.88, w: 133, h: 316, lines: ['올림픽 보러 왔어요. 기차도 타요!', '시속 210km? 믿을 수 없어요.'] },
        ],
        spots: [],
        taps: [
          { id: 'banner', show: 'banner', name: '올림픽 현수막', box: [0.397, 0.385, 0.603, 0.45], pose: 'see-aha', sora: ['동그라미 다섯 개! 올림픽이야.', '온 도시가 손님맞이 중이네.'], memo: '아흐레 뒤가 도쿄 올림픽이었단다. 이 기차는 그날에 맞춰 열었지.' },
        ],
      },
      {
        id: 'platform', name: '도쿄역 승강장', zoom: 1.3, ground: 0.83, scale: 0.76, air: 'station',
        sora: '우와, 진짜 온다! 코가 둥글어.',
        // The train runs along the track from one end of the platform to the other, again and again.
        moving: [
          // (The clock and the number of the track stand on the platform as pieces of their own: those
          // in the picture hang above what the screen shows of it. They may be touched: `touch`.)
          { kind: 'spin', id: 'clock', touch: 'clock', src: 'clock', x: 0.6, y: 0.655, tall: 0.33, rpm: 0 },
          { kind: 'spin', id: 'track', touch: 'track', src: 'track', x: 0.19, y: 0.685, tall: 0.27, rpm: 0 },
          { kind: 'drift', id: 'train', touch: 'nose', src: 'train', from: 0, to: 1, foot: 0.752, tall: 0.2, wide: 0.759, gap: 2.5, speed: 0.16, bob: 0 },
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
        taps: [
          { id: 'clock', show: 'clock6', name: '여섯 시를 가리키는 시계', x: 0.6, pose: 'see-aha', sora: ['여섯 시 정각이야!', '일 초도 안 틀리려나 봐.'], memo: '첫 기차는 여섯 시 정각에 떠나 열 시 정각에 닿았단다. 그날 예순 편이 모두 제시각이었지.' },
          { id: 'track', show: 'track19', name: '19번 승강장 표지', x: 0.19, pose: 'see-aha', sora: ['여기가 십구 번 승강장이래.', '첫 기차가 서는 곳이야.'], memo: '첫 기차 히카리 1호는 도쿄역 19번 승강장에서 떠났단다.' },
          // (These three are pieces of the scene's `moving`, which names them by `touch`: they have no
          // box. `x` is where one that stands still is, for pointing her to it.)
          { id: 'nose', show: 'nose', name: '빛나는 둥근 코', pose: 'see-wow', sora: ['코가 등불처럼 빛나!', '둥글둥글, 꼭 비행기 같아.'], memo: '코가 반투명이라 불빛이 새어 나왔단다. 속에는 연결 고리가 들어 있지.' },
        ],
      },
      {
        id: 'car', name: '달리는 신칸센 안', zoom: 1.3, ground: 0.72, scale: 0.66, air: 'train', floor: 'wood',
        sora: '안 흔들려! 창밖이 휙휙 가.',
        // The land goes by behind the picture, seen through its six windows.
        moving: [
          { kind: 'drift', id: 'land', src: 'view', from: 0.13, to: 0.87, foot: 0.472, tall: 0.17, wide: 0.415, gap: 0, speed: -0.09, bob: 0, behind: true },
        ],
        people: [
          { id: 'conductor', pass: '실례하겠습니다.', name: '차장', x: 0.168, w: 158, h: 315, lines: ['표 좀 보여 주시겠습니까.', '신오사카까지 네 시간입니다.'] },
          { id: 'dozer', pass: '쿨… 쿨…', name: '조는 대학생', x: 0.24, w: 133, h: 309, lines: ['…음냐. 벌써 시즈오카예요?', '너무 조용해서 잠이 와요.'],
            try: { id: 'wear-ivy', verb: 'wear', name: '아이비룩', outfit: 'ivy', sora: '단추가 금빛이야. 멋쟁이다!', memo: '그 무렵 도쿄 젊은이들 사이에 유행한 대학생 차림이란다.' } },
          { id: 'eater', pass: '우물우물.', name: '도시락 먹는 아저씨', x: 0.38, w: 160, h: 311, lines: ['빨라서 도시락 먹을 틈이 없네.', '(우물우물) 그래도 맛은 좋아.'] },
          { id: 'kid', pass: '우와, 빠르다!', show: 'cup', pose: 'see-aha', sora: '봉투에 물을 받아 마시네!', memo: '이 기차에 맞춰 만든 종이컵이란다. 납작하게 접혀 있었지.', name: '신난 꼬마', x: 0.52, w: 146, h: 214, lines: ['물은 봉투에 받아 마시는 거야!', '나 커서 기관사 될 거야!'] },
          { id: 'granny', pass: '아이고, 벌써 여기야.', name: '창가의 할머니', x: 0.68, w: 181, h: 280, lines: ['저기 봐, 후지산이야! 벌써 여기야.', '옛날엔 걸어서 보름 길이었단다.'] },
          { id: 'buffet', pass: '어서 오세요! 속도계 보고 가세요.', show: 'speedometer', pose: 'see-gasp', sora: '1964년에 시속 210km?!', name: '뷔페 칸 종업원', x: 0.9, w: 136, h: 320, lines: ['속도계 보세요. 지금 시속 210km!', '커피가 안 쏟아지는 게 자랑이죠.'],
            try: { id: 'use-speed', verb: 'use', name: '속도계', label: '속도계 볼래', sora: '바늘이 이백십에서 안 내려와!' } },
        ],
        spots: [],
        taps: [
          { id: 'dial', show: 'speedometer', name: '속도계', box: [0.898, 0.244, 0.99, 0.386], pose: 'see-gasp', sora: ['바늘이 이백십이야!', '1964년에 시속 210km?!'], memo: '시속 210킬로미터, 그때 세상에서 가장 빠른 기차였단다.' },
          { id: 'cooler', show: 'cup', name: '봉투 종이컵과 냉수기', box: [0.9, 0.4, 0.997, 0.508], pose: 'see-aha', sora: ['컵이 봉투처럼 납작해!', '물을 받으면 벌어지네.'], memo: '이 기차에 맞춰 만든 종이컵이란다. 납작하게 접혀 있었지.' },
          { id: 'seat', show: 'seat', name: '등받이를 넘기는 의자', box: [0.114, 0.488, 0.872, 0.664], pose: 'see-aha', sora: ['의자 등받이가 넘어가네!', '가는 쪽을 보고 앉는 거구나.'], memo: '등받이를 앞뒤로 넘겨 앉는 쪽을 바꿨단다.' },
        ],
      },
    ],
    // What is found is what was new that day (the user, 2026.10.12, San Francisco having been
    // made so: "도쿄를 이런 식으로 다시 바꿔보자", and of this table: "이대로 지어"). Each is on
    // record (docs/신기한-사실.md section 5), but for the platform's number and the dial in the
    // buffet car, looked up on 2026.10.12: the leaving was from track 19, and the buffet cars had
    // a speed dial with a needle. The gilt ball over the platform is in the picture and is not
    // said to have been there: no record of it was found.
    errands: [
      { id: 'banner', scene: 'front', text: '올림픽 현수막', at: ['banner'] },
      { id: 'postcards', scene: 'front', text: '기차 이름 엽서 더미', at: ['news'] },
      { id: 'ticket', scene: 'front', text: '2,480엔짜리 표', at: ['ticket'] },
      { id: 'clock', scene: 'platform', text: '여섯 시를 가리키는 시계', at: ['clock'] },
      { id: 'nose', scene: 'platform', text: '빛나는 둥근 코', at: ['nose', 'fan'] },
      { id: 'track', scene: 'platform', text: '19번 승강장 표지', at: ['track'] },
      { id: 'dial', scene: 'car', text: '속도계', at: ['dial', 'buffet', 'use-speed'] },
      { id: 'cup', scene: 'car', text: '봉투 종이컵과 냉수기', at: ['cooler', 'kid'] },
      { id: 'seat', scene: 'car', text: '등받이를 넘기는 의자', at: ['seat'] },
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
    first: '오늘은 큰 성당이 문을 여는 날이란다. 금빛 조각을 전해 주렴.',
    // She is set down before the church, which stands whole across the square in the middle
    // of the picture (the user, 2026.10.9: "광장 에서 성당 전체 모습이 잘 드러나지 않는다. (돔이 잘
    // 안 보여)"): at the left end only the arcade was to be seen as she said how big the roof was.
    dir: 'byz537', look: 'paper', pale: true, start: 0.45,
    drawn: '그때 사람들이 코끼리 엄니를 깎아 만들던 조각 판처럼 그렸단다.',
    // Looked up on 2026.10.9: the first dome fell in 558 and the one there now was raised
    // higher by Isidore the Younger and finished in 562; a mosque from 1453, a museum from
    // 1935, a mosque again from July 2020; the minarets are Ottoman.
    // The photograph: Wikimedia Commons, "Hagia Sophia Mars 2013.jpg" by Arild Vågen
    // (CC BY-SA 3.0), made smaller.
    now: {
      photo: 'photo-now.webp', name: '하기아 소피아의 지금 모습', when: '튀르키예 이스탄불 · 오늘날',
      text: [
        '이 도시는 이제 이스탄불이라고 부릅니다. 성당은 1,500년 가까이 그 자리에 서 있습니다.',
        '소라가 본 첫 지붕은 스물한 해 뒤에 지진으로 무너졌습니다. 지금 지붕은 562년에 더 높게 다시 올린 것입니다.',
        '1453년부터 이슬람 사원으로 썼습니다. 둘레의 뾰족한 탑 넷은 그 뒤에 세운 것입니다.',
        '1935년에 박물관이 되었다가 2020년에 다시 이슬람 사원이 되었습니다.',
      ],
      credit: '사진: Arild Vågen, 위키미디어 공용, CC BY-SA 3.0',
    },
    scenes: [
      {
        id: 'square', name: '동로마 콘스탄티노플 성당 앞 광장', short: '성당 앞 광장', zoom: 1.06, ground: 0.8, scale: 0.62, air: 'court', floor: 'dirt',
        sora: '우와, 지붕이 산처럼 커!',
        people: [
          { id: 'candle', pass: '초 사세요, 새 성당 초!', show: 'candle', name: '초 파는 할머니', x: 0.14, w: 125, h: 301, lines: ['오늘 새 성당이 문을 여는 날이란다.', '초 하나 켜 보련?'],
            try: { id: 'use-candle', verb: 'use', name: '초', label: '초 켜 볼래', sora: '후, 안 꺼지게 조심조심.' } },
          { id: 'mason', pass: '깡, 깡. 다 됐다, 다 됐어.', show: 'tesserae', pose: 'see-gasp', sora: '유리 속에 금이 들었어!', memo: '얇은 유리 두 겹 사이에 금박을 끼운 조각이란다. 그걸 지붕 가득 붙였지.', name: '석공', x: 0.23, w: 121, h: 303, lines: ['돌은 내가 깎고, 금빛은 저 조각이 낸단다.', '손톱만 한 조각을 지붕 가득 붙였지.'] },
          { id: 'porter', pass: '영차! 마지막 기둥이다.', name: '기둥 나르는 일꾼', x: 0.33, w: 153, h: 307, lines: ['이 돌기둥은 바다 건너에서 왔어.', '굴림대 없이는 꿈쩍도 안 해.'] },
          { id: 'child', pass: '우와, 하늘만큼 커!', name: '구경 나온 아이', x: 0.56, w: 94, h: 239, lines: ['지붕이 꼭 뒤집은 그릇 같아.', '안은 금빛이래. 보고 싶다!'] },
          { id: 'pilgrim', pass: '세상에, 저 지붕 좀 봐.', name: '먼 데서 온 순례자', x: 0.645, w: 134, h: 320, lines: ['먼 시골에서 걸어서 왔단다.', '저렇게 큰 둥근 지붕은 처음 봐.'] },
          { id: 'glass', pass: '반짝반짝, 잘 구워졌군.', name: '유리 굽는 장인', x: 0.73, w: 115, h: 313, lines: ['유리 사이에 금을 끼워 굽는단다.', '그걸 잘게 쪼개 벽에 붙이지.'] },
          { id: 'baker', pass: '갓 구운 빵이오!', show: 'ringbread', name: '빵 장수', x: 0.83, w: 175, h: 301, lines: ['일꾼들이 새벽부터 줄을 섰지.', '고리 빵 하나 먹어 보련?'],
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
      thing: true,
      ask: '저 큰 지붕은 왜 안 떨어질까?',
      gate: { scene: 'narthex', open: 3, sora: '문이 다 닫혀 있어. 못 들어가.' },
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
    first: '금을 뿌리며 지나가는 임금이 온 여름이란다. 금 조각을 돌려주러 가렴.',
    dir: 'cairo1324', look: 'paper', pale: true,
    drawn: '그 무렵 아랍의 책에 그려 넣던 그림처럼 그렸단다.',
    now: {
      photo: 'photo-now.webp', name: '카이로 옛 성문의 지금 모습', when: '이집트 카이로 · 주웨일라 문',
      text: [
        '카이로 옛 성의 남쪽 문입니다. 1092년에 세웠으니 만사 무사가 왔을 때에도 서 있었습니다.',
        '문 위의 높은 탑 둘은 그보다 뒤인 1400년대에 올린 것입니다.',
        '지금도 문 아래로 사람들이 다니고 둘레에 시장이 섭니다.',
      ],
      credit: '사진: Richard Mortel, 위키미디어 공용, CC BY 2.0',
    },
    scenes: [
      {
        id: 'gate', name: '이집트 카이로 성문 앞 시장', short: '성문 앞 시장', zoom: 1.06, ground: 0.8, scale: 0.62, air: 'market', floor: 'dirt',
        sora: '낙타가 줄줄이 들어와! 무슨 날이야?',
        people: [
          { id: 'datewoman', pass: '대추야자요, 꿀맛이오!', show: 'dates', name: '대추야자 파는 아주머니', x: 0.18, w: 108, h: 320, lines: ['사막을 건너는 이들이 먹는 열매란다.', '하나 먹어 보련?'],
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
          { id: 'goldsmith', pass: '땅, 땅. 금이 남아도네.', show: 'hammer', name: '금 세공사', x: 0.29, w: 90, h: 271, lines: ['금이 싸져서 일감이 밀려든다오.', '망치 한번 잡아 보겠니?'],
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
      thing: true,
      ask: '금이 너무 많으면 어떻게 될까?',
      gate: { scene: 'souk', open: 3, sora: '호위병이 막고 있어. 못 들어가.' },
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
        { who: 'water', when: ['S5'], lines: ['돌려받지 않으셨다고? 고맙구나, 얘야.', '그럼 오늘 물은 다 그냥 나눠야겠구나.'] },
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
    first: '낮에도 지지 않는 새 별이 뜬 날이란다. 별 보는 생도의 쪽지를 전해 주렴.',
    dir: 'kaifeng1054', look: 'paper', pale: true,
    // The eye is a camera here, and things stand nearer it than the street (ui/walk.js; the
    // user, 2026.10.12: "Until Then 움직임 따라하자", "개봉만 그렇게 해보자").
    deep: true,
    drawn: '송나라 사람들이 먹과 붓으로 그리던 그림처럼 그렸단다.',
    now: {
      photo: 'photo-now.webp', name: '그 새 별의 지금 모습', when: '황소자리 게 성운 · 허블 우주 망원경이 찍음',
      text: [
        '1054년에 보인 새 별은 큰 별이 터지는 빛이었습니다. 이것은 그때 흩어진 구름입니다.',
        '이름은 게 성운입니다. 6,500광년쯤 떨어져 있고 지금도 퍼져 나가는 중입니다.',
        '작은 망원경으로도 황소자리의 뿔 끝에서 뿌옇게 보입니다.',
      ],
      credit: '사진: NASA, ESA, J. Hester, A. Loll (애리조나 주립대), 위키미디어 공용, 공개 저작물',
    },
    scenes: [
      {
        id: 'bridge', name: '중국 개봉 변하 무지개 다리 어귀', short: '무지개 다리', zoom: 1.06, ground: 0.8, scale: 0.62, air: 'market', floor: 'dirt',
        // The sky and the city far off are a picture of their own (as at Giza: the user, 2026.10.13,
        // "개봉도 그렇게 해보자"). The near is cut from the scene's picture by how dark its ink is, the
        // far was ordered for it: assets/codex/kaifeng-far/make.py. The new star is of the near picture.
        far: { aspect: 1.05 },
        // What stands nearest the eye (ui/walk.js): x along the scene, hung from the top of the
        // screen or stood on its foot, tall as a share of the screen's height.
        fore: [
          { src: 'fore-willow', x: 0.1, at: 'top', tall: 0.4 }, { src: 'fore-reeds', x: 0.27, at: 'foot', tall: 0.2 },
          { src: 'fore-lantern', x: 0.45, at: 'top', tall: 0.34 }, { src: 'fore-post', x: 0.62, at: 'foot', tall: 0.17 },
          { src: 'fore-willow', x: 0.8, at: 'top', tall: 0.36 }, { src: 'fore-reeds', x: 0.94, at: 'foot', tall: 0.18 },
        ],
        taps: [{ id: 'star', name: '새 별', box: [0.884, 0.165, 0.932, 0.241], pose: 'see-wow', sora: ['저 별 좀 봐! 날이 밝는데도 안 져.', '어제까지는 없던 별이래.'] }],
        sora: '아직 새벽이야. 저 별 좀 봐!',
        people: [
          { id: 'tea', pass: '차 한 사발 하고 가요!', show: 'tea', name: '찻집 아주머니', x: 0.18, w: 117, h: 278, lines: ['가루 낸 차에 더운물을 붓고 저어요.', '거품이 고울수록 잘 탄 차랍니다.'],
            try: { id: 'use-whisk', verb: 'use', name: '차 젓는 솔', label: '차 저어 볼래', sora: '휘휘휘! 거품이 뽀얗게 올라와!', memo: '송나라에서는 차를 가루 내어 대나무 솔로 저어 마셨단다.' } },
          { id: 'bun', pass: '따끈한 만두요, 만두!', show: 'mantou', name: '만두 장수', x: 0.28, w: 152, h: 276, lines: ['새벽부터 쪄서 김이 펄펄 나지.', '배 타는 사람들이 제일 먼저 사 가오.'],
            try: { id: 'eat-mantou', verb: 'eat', name: '찐 만두', face: 'yum', sora: '호호, 뜨거워! 폭신폭신해.' } },
          { id: 'carpenter', pass: '어디 보자, 여기도 멀쩡하군.', show: 'bridge', pose: 'see-wow', sora: '기둥이 하나도 없어!', memo: '통나무를 무지개처럼 휘어 강을 건넌 다리란다. 기둥이 없어 배가 걸리지 않았지.', name: '다리 고치는 목수', x: 0.39, w: 135, h: 279, lines: ['이 다리는 물속에 기둥이 없소.', '그래서 큰 배도 걸리지 않고 지나간다오.'] },
          { id: 'boatman', pass: '돛대 눕혀라, 다리다!', name: '뱃사공', x: 0.5, w: 130, h: 320, lines: ['다리 밑을 지날 땐 돛대를 눕힌다오.', '남쪽 쌀이 이 물길로 다 올라오지.'] },
          { id: 'apprentice', pass: '저 별… 어제는 없었는데.', name: '별 보는 생도', x: 0.62, w: 114, h: 280, lines: ['하늘 보는 일을 배우는 중이야.', '밤을 꼬박 새웠더니 눈이 감겨.'] },
          { id: 'porter', pass: '영차, 영차.', name: '짐꾼', x: 0.74, w: 176, h: 279, lines: ['새벽 장에 댈 채소라오.', '이 도시는 밤에도 장이 선다오.'] },
          { id: 'child', pass: '하아암…', name: '졸린 아이', x: 0.85, w: 93, h: 203, lines: ['형아가 밤새 하늘만 봤어.', '나도 별 봤어. 엄청 밝았어!'] },
        ],
        spots: [],
      },
      {
        id: 'street', name: '중국 개봉 성 안 큰 거리', short: '큰 거리', zoom: 1.06, ground: 0.8, scale: 0.62, air: 'street', floor: 'dirt',
        far: { aspect: 1.05 },
        fore: [
          { src: 'fore-banner', x: 0.1, at: 'top', tall: 0.4 }, { src: 'fore-cart', x: 0.26, at: 'foot', tall: 0.2 },
          { src: 'fore-eave', x: 0.44, at: 'top', tall: 0.32 }, { src: 'fore-baskets', x: 0.6, at: 'foot', tall: 0.19 },
          { src: 'fore-banner', x: 0.78, at: 'top', tall: 0.36 }, { src: 'fore-cart', x: 0.95, at: 'foot', tall: 0.18 },
        ],
        taps: [{ id: 'star', name: '새 별', box: [0.864, 0.050, 0.912, 0.126], pose: 'see-wow', sora: ['해가 떴는데 아직도 보여!', '손으로 해를 가리니까 더 잘 보여.'] }],
        sora: '해가 떴어. 그런데 저 별은 그대로야!',
        people: [
          { id: 'peddler', pass: '딸랑딸랑, 구경하세요!', name: '방물장수', x: 0.18, w: 158, h: 310, lines: ['부채, 빗, 바람개비, 없는 게 없소.', '온 거리를 지고 다닌다오.'] },
          { id: 'printer', pass: '새 책 나왔소, 새 책!', show: 'print', pose: 'see-aha', sora: '글자가 거꾸로 새겨져 있어!', memo: '나무판에 글자를 뒤집어 새기고 먹을 발라 찍었단다. 이 무렵 고려도 나무판에 대장경을 새기고 있었지.', name: '책 가게 주인', x: 0.28, w: 128, h: 313, lines: ['판 하나를 새기면 몇백 장을 찍소.', '손으로 베끼던 때는 지났지.'] },
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
        far: { aspect: 1.05 },
        fore: [
          { src: 'fore-pine', x: 0.1, at: 'top', tall: 0.36 }, { src: 'fore-rail', x: 0.27, at: 'foot', tall: 0.17 },
          { src: 'fore-bell', x: 0.45, at: 'top', tall: 0.32 }, { src: 'fore-burner', x: 0.61, at: 'foot', tall: 0.2 },
          { src: 'fore-pine', x: 0.8, at: 'top', tall: 0.34 }, { src: 'fore-rail', x: 0.95, at: 'foot', tall: 0.16 },
        ],
        taps: [{ id: 'star', name: '새 별', box: [0.829, 0.073, 0.877, 0.149], pose: 'see-wow', sora: ['낮에도 지지 않는 별이야.', '저 별을 오늘 처음 적는 거구나.'] }],
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
    // fortune-teller knows how it may be seen, which she has to find out and tell him; she hands the note over,
    // choosing what to say; and the astronomer sets the star down on his chart.
    tale: {
      thing: true,
      ask: '해가 떠도 안 지는 별이 있을까?',
      gate: { scene: 'street', open: 3, sora: '문지기가 막고 있어. 못 들어가.' },
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
          sora: '진짜인데… 어떻게 해야 믿어 줄까?',
        },
        // The riddle (the user, 2026.10.12, of the storyboard: "이대로 지어"): what will make
        // him believe it. Three things that are true and do not answer him, and one that does.
        {
          who: 'guard', goal: '문지기가 믿을 만한 말을 찾아보렴.', holds: '쪽지: 소라가 들고 있음',
          lines: ['내 눈에는 별이 안 보인다.'],
          riddle: {
            ask: '문지기에게 뭐라고 할까?', none: '아직 할 말이 없어. 사람들에게 물어보자.', more: '더 알아볼게요',
            clues: [
              { id: 'night', from: 'child', label: '"형아가 밤새 봤대요"', sora: '별 보는 형아가 밤새 봤대요.', says: '밤에 별 뜨는 거야 당연하지. 지금은 낮이다.' },
              { id: 'odd', from: 'monk', label: '"스님도 이상하대요"', sora: '스님도 오늘 하늘이 이상하대요.', says: '이상한 게 어디 한둘이냐. 어디 있느냐고 물었다.' },
              { id: 'east', from: 'scholar', label: '"저기 동쪽에 있어요"', sora: '저기요, 동쪽 하늘에 있어요!', says: '해가 눈이 부셔서 아무것도 안 보인다.' },
              { id: 'shade', from: 'fortune', right: true, label: '"해를 가려 보세요"', sora: '아저씨, 손으로 해를 가려 보세요!', says: '어디… 어이쿠, 정말이네! 들어가라.' },
            ],
          },
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
        // What those with a clue say while the gatekeeper's riddle is asked.
        { who: 'child', when: ['S2'], lines: ['형아가 밤새 하늘만 봤어.', '없던 별이 떴다고 좋아했어.'] },
        { who: 'monk', when: ['S2'], lines: ['새벽부터 하늘이 심상치 않았소.', '없던 것이 보이니 큰일이오.'] },
        { who: 'scholar', when: ['S2'], lines: ['그 별이라면 동쪽 하늘에 있었소.', '글 읽다 말고 한참 쳐다봤다오.'] },
        { who: 'fortune', when: ['S2'], show: true, lines: ['손으로 해를 가리고 저쪽을 보렴.', '보이지? 낮인데도 별이 떠 있단다.'] },
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
    first: '흰 돌 무덤을 한창 짓는 중이란다. 붉은 돌 한 알을 전해 주렴.',
    dir: 'agra1640', look: 'paper', pale: true,
    drawn: '무굴의 임금들이 아끼던 작고 꼼꼼한 그림처럼 그렸단다.',
    now: {
      photo: 'photo-now.webp', name: '타지마할의 지금 모습', when: '인도 아그라 · 오늘날',
      text: [
        '소라가 본 공사는 스무 해쯤 걸려 끝났습니다. 다 지은 흰 무덤입니다.',
        '가운데 둥근 지붕의 꼭대기까지 73미터입니다.',
        '1983년에 세계유산이 되었고 해마다 수백만 명이 보러 옵니다.',
      ],
      credit: '사진: Yann, King of Hearts, 위키미디어 공용, CC BY-SA 4.0',
    },
    scenes: [
      {
        id: 'site', name: '인도 아그라 강가 공사터', short: '강가 공사터', zoom: 1.06, ground: 0.8, scale: 0.62, air: 'masons', floor: 'dirt',
        sora: '하얀 지붕이 발판에 싸여 있어!',
        people: [
          { id: 'mason', pass: '깡, 깡. 흰 돌가루 날린다.', name: '돌 깎는 석공', x: 0.19, w: 85, h: 275, lines: ['이 흰 돌은 먼 마크라나에서 왔단다.', '먼 길을 실려 온 귀한 돌이지.'] },
          { id: 'clerk', pass: '오늘 품삯이… 어디 보자.', name: '장부 적는 서기', x: 0.28, w: 114, h: 282, lines: ['일꾼이 하도 많아 이름 적기도 벅차.', '벌써 여러 해째 짓고 있단다.'] },
          { id: 'mahout', pass: '영차, 우리 코끼리 힘내라!', show: 'elephant', pose: 'see-wow', sora: '코끼리가 돌을 끌어!', memo: '무거운 대리석은 코끼리가 끌어 올렸단다.', name: '코끼리 몰이꾼', x: 0.4, w: 103, h: 297, lines: ['큰 돌은 우리 코끼리가 끈단다.', '비탈길을 하루에도 몇 번씩 오르지.'] },
          { id: 'mango', pass: '달디단 망고요!', show: 'mango', name: '망고 파는 아주머니', x: 0.52, w: 118, h: 262, lines: ['일하다 목마르면 망고가 제일이지.', '하나 먹어 보련?'],
            try: { id: 'eat-mango', verb: 'eat', name: '망고', face: 'yum', sora: '달콤하고 물이 줄줄 흘러!' } },
          { id: 'girl', pass: '물 가져왔어요, 물!', name: '물 나르는 소녀', x: 0.63, w: 97, h: 264, lines: ['강에서 물을 길어다 날라.', '돌을 켤 때도 물이 많이 든대.'] },
          { id: 'boatman', pass: '돌 왔소, 돌!', name: '돌 싣고 온 뱃사공', x: 0.75, w: 80, h: 320, lines: ['무거운 돌은 강물로 실어 온다오.', '저 흰 지붕이 날마다 조금씩 자라지.'] },
          { id: 'jeweller', pass: '어디 보자, 한 알이 비네.', name: '보석 장수', x: 0.85, w: 97, h: 296, lines: ['먼 나라에서 온 돌을 판단다.', '빛깔마다 고향이 다르지.'] },
        ],
        spots: [],
      },
      {
        id: 'yard', name: '인도 아그라 돌 다듬는 마당', short: '돌 다듬는 마당', zoom: 1.06, ground: 0.8, scale: 0.62, air: 'masons', floor: 'dirt',
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
      thing: true,
      ask: '돌로 꽃을 피울 수 있을까?',
      gate: { scene: 'yard', open: 3, sora: '감독관이 막고 있어. 못 올라가.' },
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
    first: '오늘은 금성이 해 앞을 지나가는 날이란다. 코코넛을 전해 주렴.',
    dir: 'tahiti1769', look: 'paper',
    drawn: '백 년쯤 뒤 이 섬에 와서 살던 화가 고갱의 그림처럼 그렸단다.',
    now: {
      photo: 'photo-now.webp', name: '비너스 곶의 지금 모습', when: '프랑스령 폴리네시아 타히티 · 마타바이 만',
      text: [
        '지금도 이름이 비너스 곶입니다. 금성을 본 곳이라 붙은 이름입니다.',
        '화산섬이라 모래가 검습니다.',
        '요새는 남아 있지 않습니다. 곶에는 1867년에 세운 등대가 있습니다.',
      ],
      credit: '사진: Saga70, 위키미디어 공용, CC BY-SA 4.0',
    },
    scenes: [
      {
        id: 'beach', name: '타히티 마타바이 만 바닷가', short: '마타바이 만', zoom: 1.06, ground: 0.8, scale: 0.62, air: 'market', floor: 'dirt',
        sora: '모래가 따끈따끈해! 저 배는 뭐지?',
        people: [
          { id: 'fisher', pass: '오늘 바다는 잔잔하군.', show: 'paddle', name: '카누 타는 어부', x: 0.19, w: 118, h: 320, lines: ['저 큰 배는 두 달 가까이 저기 서 있어.', '우리 카누는 옆에 팔이 달려서 안 뒤집혀.'],
            try: { id: 'use-paddle', verb: 'use', name: '카누의 노', label: '노 저어 볼래', sora: '영차! 어, 자꾸 옆으로만 가!' } },
          { id: 'tapa', pass: '탁, 탁, 탁.', name: '천 두드리는 아주머니', x: 0.31, w: 113, h: 282, lines: ['나무껍질을 두드려서 천을 만들어.', '두드릴수록 넓고 얇아진단다.'],
            try: { id: 'wear-tapa', verb: 'wear', name: '나무껍질 옷', outfit: 'tapa', sora: '가볍고 바삭바삭해!', memo: '나무껍질을 물에 불려 두드려 만든 천이란다.' } },
          { id: 'tattoo', pass: '톡, 톡. 가만히 있거라.', show: 'tattoo', pose: 'see-gasp', sora: '뼈로 만든 빗이야!', memo: '이 섬 말로 "타타우"란다. 문신을 뜻하는 "타투"가 여기서 온 말이지.', name: '무늬 새기는 할아버지', x: 0.42, w: 107, h: 309, lines: ['뼈 빗에 검은 물을 묻혀 톡톡 친단다.', '배에서 온 젊은이도 팔에 새기고 갔지.'] },
          { id: 'coconut', pass: '코코넛 있어요!', name: '코코넛 파는 아주머니', x: 0.53, w: 98, h: 280, lines: ['코코넛 물은 더울 때 제일이야.', '못 하나면 한 아름 준단다.'] },
          { id: 'breadboy', pass: '앗 뜨거, 앗 뜨거!', show: 'breadfruit', name: '열매 굽는 소년', x: 0.63, w: 85, h: 244, lines: ['빵나무 열매야. 불에 구워 먹어.', '속이 하얗고 폭신폭신해.'],
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
      thing: true,
      ask: '저 사람들은 왜 해만 볼까?',
      gate: { scene: 'gate', open: 3, sora: '보초가 막고 있어. 못 들어가.' },
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
        { who: 'coconut', when: ['S5'], lines: ['다 마셨다니 다행이구나! 고맙다, 얘야.', '해에 점이 있었다고? 신기하네.'] },
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
    first: '오늘 밤 사람이 처음 달에 내린단다. 심부름 셋을 해 보렴.',
    dir: 'yard', look: 'paper', talk: 'face', night: true,
    now: {
      photo: 'photo-now.webp', name: '그날 그 달의 지금 모습', when: '달 고요의 바다 · 달 궤도선이 위에서 찍음',
      text: [
        '아폴로 11호가 내린 고요의 바다를 2009년에 달을 도는 탐사선이 찍었습니다.',
        '착륙선의 아랫부분은 지금도 그 자리에 있습니다.',
        '달에는 바람도 비도 없어 발자국이 오래 남습니다.',
      ],
      credit: '사진: NASA, GSFC, 애리조나 주립대, 위키미디어 공용, 공개 저작물',
    },
    scenes: [
      {
        id: 'lane', name: '할머니의 마을 길', short: '마을 길', zoom: 1.3, ground: 0.698, scale: 0.66, air: 'night', floor: 'dirt',
        sora: '밤인데 다들 어디로 가?',
        // Children run along the lane and in at the open gate.
        moving: [
          { kind: 'drift', id: 'kids', src: 'kids', from: 0, to: 0.645, foot: 0.695, tall: 0.13, wide: 0.379, gap: 0.9, speed: 0.07, bob: 0.006 },
        ],
        people: [
          { id: 'shop', pass: '어여 와라. 시원한 거 있다.', show: 'cider', name: '구멍가게 아주머니', x: 0.159, w: 129, h: 297, lines: ['사이다 한 병 줄까? 찬물에 담가 놨다.', '다들 테레비 보러 가서 가게가 비었네.'],
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
          { id: 'melon', pass: '수박 먹어라, 수박.', show: 'melon', name: '수박 든 아주머니', x: 0.3, w: 110, h: 292, lines: ['수박 먹고들 봐요. 우물에 담갔던 거야.', '낮에도 봤는데 또 봐도 신기해.'],
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
            try: { id: 'use-radio', verb: 'use', name: '라디오', label: '라디오 들어 볼래', sora: '지지직… 사람 목소리가 나와.' } },
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
    first: '오늘은 올림픽이 열리는 날이란다. 심부름 셋을 해 보렴.',
    dir: 'seoul88',
    now: {
      photo: 'photo-now.webp', name: '올림픽주경기장의 지금 모습', when: '서울 잠실 · 오늘날',
      text: [
        '1984년에 문을 열었습니다. 올림픽 뒤에도 경기와 큰 공연이 열렸습니다.',
        '지붕의 휜 선은 조선 백자 항아리의 선을 본떴습니다.',
      ],
      credit: '사진: Jeong seolah, 위키미디어 공용, CC0',
    },
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
            try: { id: 'use-binoc', verb: 'use', name: '쌍안경', label: '쌍안경 들여다볼래', sora: '손을 흔들어! 나도 흔들래.' } },
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
    first: '레오나르도가 벽에 큰 그림을 그리던 해란다. 화가를 찾아가 보렴.',
    // Drawn again in the manner of Leonardo's notebooks, pen and red chalk on yellowed paper
    // (the user, 2026.10.10, walking it in pixels: "그림체 바꾸자", and of five tries: "1번으로
    // 가자."). The words and the tale are as they were. The sky is the paper of the pictures.
    dir: 'milan1497', look: 'paper', pale: true,
    drawn: '그 화가 레오나르도가 공책에 펜으로 그리던 것처럼 그렸단다.',
    now: {
      photo: 'photo-now.webp', name: '그라치에 수도원의 지금 모습', when: '이탈리아 밀라노 · 산타 마리아 델레 그라치에 성당',
      text: [
        '벽화가 있는 식당은 이 성당 옆에 붙어 있습니다.',
        '1943년 전쟁 때 폭탄이 떨어져 식당 지붕이 무너졌습니다. 모래주머니로 막아 둔 벽화의 벽은 남았습니다.',
        '지금은 미리 표를 사야 하고 한 번에 15분만 볼 수 있습니다.',
      ],
      credit: '사진: Carlo Dell’Orto, 위키미디어 공용, CC BY-SA 3.0',
    },
    scenes: [
      {
        id: 'court', name: '밀라노 코르테 베키아 뜰', short: '코르테 베키아', zoom: 1.09, ground: 0.74, scale: 0.638, air: 'court',
        sora: '옛 궁전 뜰이래. 저 말 좀 봐!',
        people: [
          { id: 'salai', pass: '헤헤, 스승님 공책이다.', show: 'mirror', name: '화가의 제자', x: 0.18, w: 151, h: 302, lines: ['스승님은 글씨를 거꾸로 써.', '거울에 비춰야 읽혀. 볼래?'],
            then: [{ after: 'letter', lines: ['스승님? 방금 나가셨어.', '대성당 뒤 나루 쪽으로 가셨을걸.'] }],
            try: { id: 'use-mirror', verb: 'use', name: '거울', label: '거울 비춰 볼래', sora: '오, 거울 속에선 똑바로야!', memo: '레오나르도는 글씨를 오른쪽에서 왼쪽으로 썼단다.' } },
          { id: 'clayboy', pass: '영차, 갈라진 데 메워야지!', name: '진흙 나르는 견습생', x: 0.26, w: 116, h: 274, lines: ['이 말은 전부 흙으로 빚었어.', '어른 키의 네 배가 넘는대.'] },
          { id: 'founder', pass: '에휴, 내 쇳물…', name: '쇠 녹이는 장인', x: 0.34, w: 124, h: 318, lines: ['청동을 부어 굳히려던 말이오.', '그 청동은 대포 만들러 가 버렸소.'] },
          { id: 'pacioli', pass: '모서리가 몇 개인고…', show: 'solid', pose: 'see-aha', sora: '속이 다 들여다보여!', memo: '수학 선생의 책에 레오나르도가 그림을 그려 주었단다.', name: '수학 선생 수도사', x: 0.64, w: 142, h: 318, lines: ['내 책의 그림은 그 친구가 그렸네.', '뼈대만 그려서 뒤쪽까지 보이지.'] },
          { id: 'mechanic', pass: '쉿, 위층은 비밀이오.', show: 'wing', pose: 'see-gasp', sora: '날개잖아! 사람이 타는 거야?', memo: '지붕에서 날아 볼 궁리를 했단다. 성당 일꾼들 눈을 피해서.', name: '기계 만드는 조수', x: 0.72, w: 150, h: 310, lines: ['위층 방은 널빤지로 막아 놨소.', '대성당 일꾼들이 못 보게 말이오.'] },
          { id: 'messenger', pass: '공작님의 분부요!', name: '공작의 심부름꾼', x: 0.79, w: 149, h: 320, lines: ['"그림을 어서 끝내라"는 편지요.', '화가 양반이 없구려. 네가 전해 주련?'],
            then: [{ after: 'letter', lines: ['고맙다! 나는 숨 좀 돌리겠소.', '공작님은 성미가 급하시다오.'] }] },
          { id: 'lutist', pass: '랄라, 한낮의 노래~', name: '류트 타는 악사', x: 0.86, w: 154, h: 303, lines: ['한낮엔 다들 그늘에서 쉬지요.', '저 말 앞에서 타면 소리가 울려요.'] },
        ],
        spots: [
          { id: 'horse', from: 0.42, to: 0.56, see: [0.3, 0.0, 0.68, 0.62], sora: '말이 집보다 커! 전부 흙이래.', memo: '청동으로 만들려던 말이란다. 끝내 흙으로만 남았지.' },
        ],
      },
      {
        id: 'dock', name: '밀라노 대성당 뒤 나루', short: '대성당 나루', zoom: 1.07, ground: 0.76, scale: 0.626, air: 'market',
        sora: '성당을 아직 짓는 중이네!',
        people: [
          { id: 'armourer', pass: '땅, 땅! 밀라노 갑옷이오!', name: '갑옷 장인', x: 0.17, w: 165, h: 310, lines: ['밀라노 갑옷은 먼 나라에서도 사 가오.', '한번 입어 보겠소? 꽤 무겁소.'],
            try: { id: 'wear-armor', verb: 'wear', name: '밀라노 갑옷', outfit: 'armor', sora: '철컹철컹! 걷기 힘들어.', memo: '그때 밀라노는 갑옷으로 이름난 도시였단다.' } },
          { id: 'melon', pass: '멜론이오, 단 멜론!', show: 'cantaloupe', name: '멜론 파는 아주머니', x: 0.28, w: 167, h: 291, lines: ['한낮엔 멜론이 제일이지.', '화가 양반 댁도 멜론을 사 간다우.'],
            try: { id: 'eat-melon', verb: 'eat', name: '멜론', face: 'yum', sora: '달고 시원해! 꿀 같아.' } },
          { id: 'waterboy', pass: '물이오, 비켜요!', name: '물 긷는 소년', x: 0.37, w: 160, h: 273, lines: ['화가 아저씨? 방금 지나갔어.', '땡볕에 수도원 쪽으로 걸어갔어.'] },
          { id: 'boatman', pass: '돌 왔소, 성당 돌!', show: 'marble', pose: 'see-aha', sora: '돌에 글자가 있어. A, U, F?', memo: '"성당 짓는 데 쓴다"는 라틴말의 첫 글자란다. 이 표시가 있으면 뱃길에서 돈을 안 냈지.', name: '대리석 배 뱃사공', x: 0.5, w: 160, h: 320, lines: ['먼 호숫가 산에서 물길로 왔소.', '성당 돌은 뱃길에서 돈을 안 내오.'] },
          { id: 'mason', pass: '깡, 깡. 돌가루 조심!', name: '대성당 석공', x: 0.76, w: 135, h: 304, lines: ['이 성당은 백 년 넘게 짓고 있소.', '내 손자 때나 다 될는지, 원.'] },
          { id: 'laundress', pass: '아이, 볕이 따갑기도 하지.', name: '빨래하는 처녀', x: 0.63, w: 153, h: 292, lines: ['이 물길로 배가 도시 안까지 와요.', '돌도 장작도 다 배로 온답니다.'] },
          { id: 'silk', pass: '비단이오, 고운 비단!', name: '비단 장수', x: 0.86, w: 169, h: 318, lines: ['수도원은 서쪽 성문 쪽이라오.', '식당 벽 그림이 몇 해째라지요.'] },
        ],
        spots: [],
      },
      {
        id: 'hall', name: '밀라노 그라치에 수도원 식당', short: '수도원 식당', zoom: 1.15, ground: 0.7, scale: 0.673, air: 'hush',
        // The painting on the wall may be touched: a photograph of it as it is today
        // (Wikimedia Commons, "Última Cena - Da Vinci 5.jpg", in the public domain) and what
        // is known of it. box: left, top, right, bottom, as shares of the scene's picture.
        looks: [
          { id: 'supper', box: [0.222, 0.105, 0.775, 0.43], photo: 'photo-supper.webp', name: '최후의 만찬', when: '레오나르도 다빈치 · 1495년쯤 시작해 1498년에 끝냄',
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
                    { id: 'gentleman', pass: '허, 살아 있는 것 같군.', name: '구경 온 신사', x: 0.17, w: 149, h: 320, lines: ['맞은편 벽 그림은 두 해 전에 끝났소.', '빨리 끝났지. 그런데 다들 이쪽만 보오.'] },
          { id: 'prior', pass: '흠, 그림은 언제 끝나나.', name: '수도원장', x: 0.25, w: 142, h: 297, lines: ['사흘 나흘씩 붓도 안 댈 때가 있소.', '게으른 게요! 공작님께 일렀소.'] },
          { id: 'grinder', pass: '쓱쓱, 곱게 갈아야지.', name: '물감 개는 조수', x: 0.33, w: 138, h: 306, lines: ['마른 벽에 달걀 물감으로 그려요.', '그래서 며칠 뒤에도 고칠 수 있죠.'] },
          { id: 'carpenter', pass: '실이 팽팽해야 하오.', show: 'nail', pose: 'see-peer', sora: '못 하나에서 줄이 다 나와!', memo: '한가운데 못을 박고 실을 당겨 줄을 그었단다. 못 자국이 지금도 있지.', name: '발판 세운 목수', x: 0.41, w: 163, h: 303, lines: ['한가운데 못에 실을 매어 당겼소.', '그림 속 줄이 다 그리로 모이오.'] },
          { id: 'cook', pass: '오늘 저녁은 장어라오.', show: 'eel', pose: 'see-wow', sora: '그림 속 접시에 장어가 있어!', memo: '구운 장어와 오렌지. 그때 귀하게 치던 요리를 그려 넣었단다.', name: '부엌 수도사', x: 0.5, w: 165, h: 272, lines: ['식탁 그림에 우리 음식이 있다오.', '구운 장어에 오렌지 조각이지.'] },
          { id: 'novice', pass: '(위를 올려다본다)', name: '어린 수련 수도사', x: 0.8, w: 124, h: 268, lines: ['한 번 그으려고 한 시간을 보세요.', '그리는 날은 밥도 잊고 저물 때까지요.'] },
          { id: 'secretary', pass: '공작님이 또 물으시오.', name: '공작의 비서', x: 0.87, w: 150, h: 306, lines: ['유월에도 재촉하는 편지가 왔소.', '또 보내셨다니, 공작님도 참.'] },
        ],
        spots: [
          // Leonardo on the scaffold: seen, not spoken to.
          { id: 'leonardo', from: 0.58, to: 0.7, see: [0.6, 0.24, 0.672, 0.45], sora: '찾았다! …붓을 들고 보기만 해.', memo: '붓질 한두 번만 하고 가 버리는 날도 있었단다. 그 그림이 "최후의 만찬"이야.' },
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
  // Tenochtitlan, 8 November 1519: Moctezuma and Cortés meet on the causeway into the city on
  // the lake. Drawn as the Mexica carved and painted stone (the user, 2026.10.10, of five
  // tries: "테노치티틀란 4"). Looked up on 2026.10.10 and found so: the meeting on the
  // causeway that day, so full of people there was hardly room (Bernal Díaz); chinampas,
  // plots heaped up on the water; cacao beans for money (a bean for a tomato, thirty for a
  // rabbit, a hundred for a turkey hen in a list of 1545), and beans hollowed out and filled
  // to cheat; chocolate drunk unsweetened with chili, poured from a height to froth it; the
  // feather workers called amanteca; the two shrines on the great temple, blue stripes for
  // the rain god and red for Huitzilopochtli; the huipil; horses first called deer.
  // From memory: loads carried on the back, tortillas, the conch trumpet, the ground swept
  // before the ruler, inspectors of the market, garlands for the guests.
  // Made up: the grandmother and her garland, the overseer, the merchant, the steward.
  // Left out: sacrifice, and the war that followed.
  tenoch1519: {
    first: '호수 위의 도시에 낯선 손님이 온 날이란다. 꽃목걸이를 전해 주렴.',
    dir: 'tenoch1519', look: 'paper', pale: true,
    drawn: '아스테카 사람들이 돌에 새기고 색을 칠하던 것처럼 그렸단다.',
    scenes: [
      {
        id: 'canal', name: '테노치티틀란 물길 어귀', short: '물길 어귀', zoom: 1.12, ground: 0.715, scale: 0.655, air: 'market', floor: 'dirt',
        sora: '집이 물 위에 떠 있어!',
        people: [
          { id: 'canoe', pass: '밭에 다녀오는 길이오.', show: 'chinampa', pose: 'see-wow', sora: '밭이 물 위에 떠 있어!', memo: '호수 바닥의 진흙을 퍼 올려 물 위에 만든 밭이란다. 치남파라고 했지.', name: '카누 젓는 아저씨', x: 0.19, w: 147, h: 320, lines: ['우리 밭은 물 위에 있단다.', '진흙을 퍼 올려 쌓으면 밭이 되지.'] },
          { id: 'maize', pass: '옥수수 갈아요, 쓱쓱.', name: '옥수수 가는 아주머니', x: 0.3, w: 125, h: 306, lines: ['옥수수를 갈아 얇게 부쳐 먹는단다.', '아침마다 온 동네가 이 소리지.'] },
          { id: 'kid', pass: '물고기다, 물고기!', name: '물가의 아이', x: 0.4, w: 125, h: 228, lines: ['우리 집 앞이 바로 물길이야.', '카누 타고 어디든 가.'] },
          { id: 'weaver', pass: '한 줄, 또 한 줄.', name: '베 짜는 소녀', x: 0.51, w: 116, h: 288, lines: ['허리에 매고 짜는 베틀이야.', '내가 짠 옷이야. 입어 볼래?'],
            try: { id: 'wear-aztec', verb: 'wear', name: '아스테카의 옷', outfit: 'aztec', sora: '헐렁해서 시원해!', memo: '네모난 천을 이어 만든 윗옷이란다. 우이필이라고 했지.' } },
          { id: 'porter', pass: '영차, 길 좀 비켜 주오.', name: '짐꾼', x: 0.62, w: 140, h: 306, lines: ['짐은 사람이 등으로 나른단다.', '물길이 닿는 데는 카누로 가고.'] },
          { id: 'flower', pass: '꽃이 곱게 피었구나.', name: '꽃 엮는 할머니', x: 0.73, w: 121, h: 282, lines: ['우리 밭에서 딴 꽃이란다.', '오늘은 꽃이 아주 많이 쓰일 게다.'] },
          { id: 'fisher', pass: '오늘은 많이 잡혔네.', name: '어부', x: 0.85, w: 146, h: 298, lines: ['호수에서 잡은 물고기라오.', '이 도시는 호수가 먹여 살리지.'] },
        ],
        spots: [],
      },
      {
        id: 'market', name: '테노치티틀란 큰 시장', short: '큰 시장', zoom: 1.16, ground: 0.69, scale: 0.678, air: 'market',
        sora: '콩으로 물건을 사네?',
        people: [
          { id: 'choco', pass: '거품 낸 초콜릿 물이오!', show: 'chocolate', name: '초콜릿 물 파는 아주머니', x: 0.18, w: 114, h: 241, lines: ['높이서 부어야 거품이 인단다.', '한 모금 마셔 보련?'],
            try: { id: 'eat-chocolate', verb: 'eat', name: '초콜릿 물', face: 'hmm', sora: '써! 맵기까지 해!', memo: '그때 초콜릿은 달지 않았단다. 카카오 콩을 갈아 고추를 넣어 마셨지.' } },
          { id: 'feather', pass: '숨도 크게 못 쉰다오.', show: 'feather', pose: 'see-gasp', sora: '깃털로 그림을 그려!', memo: '깃털을 한 올씩 겹쳐 붙여 무늬를 만들었단다. 그 장인을 아만테카라 불렀지.', name: '깃털 장인', x: 0.29, w: 103, h: 264, lines: ['깃털을 한 올씩 붙여 무늬를 낸단다.', '초록 긴 깃은 먼 숲에서 온 거야.'] },
          { id: 'veg', pass: '토마토요, 고추요!', name: '채소 장수', x: 0.4, w: 113, h: 233, lines: ['토마토도 고추도 이 땅의 열매란다.', '호박이랑 아보카도도 있지.'] },
          { id: 'turkey', pass: '골골골, 살이 올랐소!', name: '칠면조 장수', x: 0.51, w: 113, h: 255, lines: ['칠면조 한 마리에 콩이 백 알이오.', '잔칫날에는 이놈이 빠질 수 없지.'] },
          { id: 'child', pass: '하나, 둘, 셋… 넷.', name: '심부름하는 아이', x: 0.62, w: 90, h: 185, lines: ['콩을 잘 세야 안 속아.', '속 빈 가짜 콩도 있대.'] },
          { id: 'pochteca', pass: '콩 세는 중이니 조용히.', show: 'cacao', pose: 'see-aha', sora: '콩이 돈이야!', memo: '카카오 콩을 돈처럼 썼단다. 한 알에 토마토 하나, 서른 알에 토끼 한 마리였지.', name: '카카오 콩 상인', x: 0.73, w: 123, h: 252, lines: ['이 콩이 여기서는 돈이란다.', '콩 한 알이면 토마토가 하나지.'] },
          { id: 'overseer', pass: '저울 속이는 자 없느냐!', name: '시장 감독관', x: 0.85, w: 141, h: 320, lines: ['시장의 값과 되를 살피는 일을 한다.', '속이는 자는 가만두지 않지.'] },
        ],
        spots: [],
      },
      {
        id: 'causeway', name: '테노치티틀란 호수 위 둑길', short: '호수 위 둑길', zoom: 1.15, ground: 0.7, scale: 0.673, air: 'court',
        sora: '길이 호수를 가로질러!',
        people: [
          { id: 'sweeper', pass: '쓱쓱, 깨끗이.', name: '길 쓰는 사람', x: 0.18, w: 126, h: 240, lines: ['임금님이 지나실 길을 쓴단다.', '먼지 하나 없어야 하지.'] },
          { id: 'conch', pass: '뿌우우우!', name: '소라 나팔 부는 사람', x: 0.29, w: 126, h: 247, lines: ['바다 소라로 만든 나팔이란다.', '네 이름도 소라라고? 허허!'] },
          { id: 'noble', pass: '어험, 줄을 맞춰라.', name: '깃털 부채 든 귀족', x: 0.4, w: 162, h: 320, lines: ['오늘 임금님을 모시고 나왔단다.', '이런 손님맞이는 나도 처음이야.'] },
          { id: 'steward', pass: '꽃이 모자라, 꽃이!', show: 'meeting', pose: 'see-wow', sora: '사슴 같은 걸 타고 왔어!', memo: '바다 건너온 이들이 탄 말을 이곳 사람들은 처음에 사슴이라 불렀단다.', name: '꽃 맡은 시종', x: 0.51, w: 129, h: 239, lines: ['손님들 목에 걸어 줄 꽃이란다.', '하나라도 모자라면 큰일이지.'] },
          { id: 'eagle', pass: '둑길은 내가 지킨다.', name: '독수리 옷 입은 무사', x: 0.62, w: 145, h: 284, lines: ['독수리처럼 날쌔다는 뜻의 옷이란다.', '오늘은 싸움이 아니라 손님맞이야.'] },
          { id: 'keeper', pass: '향을 올려야지.', show: 'temple', pose: 'see-wow', sora: '꼭대기에 집이 두 채야!', memo: '큰 신전 꼭대기의 사당 둘이란다. 파란 줄무늬는 비의 신, 붉은 것은 해와 싸움의 신 것이지.', name: '사당지기 할아버지', x: 0.73, w: 153, h: 255, lines: ['저 높은 신전이 보이느냐.', '꼭대기에 사당이 둘 나란히 있단다.'] },
          { id: 'girl', pass: '와, 사람이 끝도 없어!', name: '구경 나온 아이', x: 0.85, w: 89, h: 188, lines: ['둑길이 사람으로 꽉 찼어!', '호수에도 카누가 가득해.'] },
        ],
        spots: [],
      },
    ],
    // "The garland" (core/tale.js; the user, 2026.10.10, of the storyboard: "이대로 지어"): the
    // grandmother of the chinampa has strung a garland for the welcome and cannot walk so
    // far; the overseer of the market lets nobody out on the causeway; the cacao merchant
    // speaks for her; she hands it to the steward of the flowers, choosing what to say; and
    // he points to where the two meet.
    tale: {
      thing: true,
      ask: '꽃목걸이는 누구 목에 걸릴까?',
      gate: { scene: 'market', open: 3, sora: '감독관이 막고 있어. 못 가.' },
      steps: [
        {
          who: 'flower', goal: '물길 어귀의 꽃 엮는 할머니에게 가 보렴.', holds: '꽃목걸이: 할머니가 들고 있음',
          lines: ['얘야, 이 꽃목걸이 좀 보렴.', '오늘 손님맞이에 쓸 것인데 다리가 아프구나.', '둑길의 꽃 맡은 이에게 전해 줄래?'],
          offer: { ask: '꽃목걸이를 전해 줄까?', label: '내가 전해 줄게요' },
          errand: 'took',
        },
        {
          who: 'overseer', goal: '큰 시장 끝의 둑길 문으로 가 보렴.', holds: '꽃목걸이: 소라가 들고 있음',
          lines: ['멈춰라. 오늘 둑길은 아무나 못 나간다.', '귀한 손님이 오시는 날이다.'],
          sora: '꽃을 전해야 하는데… 어? 누가 불러!',
        },
        {
          who: 'pochteca', call: '얘야, 그 꽃은 뭐니?', goal: '카카오 콩 상인이 부른다. 가 보렴.', holds: '꽃목걸이: 소라가 들고 있음',
          lines: ['손님맞이 꽃이라고? 그럼 가야지.', '먼 길 다니는 장사꾼 말은 들어 주신단다.', '나와 같이 가서 말해 보자.'],
          after: [{ who: 'overseer', line: '손님맞이 꽃이군. 서둘러 지나가거라.' }],
          sora: '지나가도 된대! 둑길로 가자!',
        },
        {
          who: 'steward', goal: '호수 위 둑길의 꽃 맡은 시종에게 꽃목걸이를 전하렴.', holds: '꽃목걸이: 소라가 들고 있음',
          lines: ['아이고, 꽃이 모자라 애가 탔단다!'],
          choice: {
            ask: '꽃목걸이를 건네며 뭐라고 할까?',
            options: [
              { id: 'E1', label: '"할머니가 엮었어요"', sora: '물길 어귀 할머니가 엮으셨어요.', says: '그 할머니 솜씨구나. 곱기도 하지!' },
              { id: 'E2', label: '"누가 오는 거예요?"', sora: '오늘 누가 오는 거예요?', says: '바다 건너온 손님들이란다. 곧 보일 게다.' },
            ],
          },
          errand: 'gave',
        },
        {
          who: 'steward', show: true, goal: '시종이 가리키는 둑길 끝을 보렴.',
          lines: ['저기 보렴. 임금님이 나오신다.', '바다 건너온 손님들과 처음 만나시는 거란다.'],
          sora: '두 무리가 마주 섰어! 조용해졌어.',
          errand: 'saw',
        },
      ],
      asides: [
        { who: 'flower', when: ['S1', 'S2', 'S3', 'S4'], lines: ['꽃 맡은 이는 둑길에 있단다.', '큰 시장을 지나 호수 쪽으로 가렴.'] },
        { who: 'flower', when: ['S5'], lines: ['전해 주었다고? 고맙구나, 얘야.', '내 꽃이 임금님 곁에 갔구나.'] },
      ],
      done: '꽃목걸이를 전하고, 둑길의 만남을 보았다.',
    },
    errands: [
      { id: 'took', text: '꽃목걸이를 받는다.', at: [] },
      { id: 'gave', text: '시종에게 꽃목걸이를 전한다.', at: [] },
      { id: 'saw', text: '둑길의 만남을 본다.', at: [] },
    ],
    reply: '그날 처음 두 세상이 만났단다. 그 호수는 메워져 지금의 멕시코시티가 되었지.',
  },
  // Giza about 2560 BC: the pyramid of Khufu is building. Drawn as the tombs of that kingdom
  // were carved and painted (the user, 2026.10.10, of five tries: "기자 1"). The day is not on
  // record. Looked up on 2026.10.10 and found so: the logbook of the inspector Merer, found
  // in 2013 with the oldest papyri known, who with some forty men brought white limestone by
  // boat from Tura two or three times in ten days at the season of the flood, and reported
  // to Ankhhaf, the king's half-brother; about thirty blocks to a boat; the workers' town
  // with its tons of bread moulds in three sizes and its cattle, sheep and goats; the
  // workers came by turns and were not slaves, and their gangs had names ("Friends of
  // Khufu") written on the stones; some 2.3 million blocks, the casing of white Tura stone;
  // water poured on sand before a sledge halves the pull (measured in 2014; the painting of
  // it is some 700 years later); copper chisels and wooden mallets for limestone; the lock
  // of hair children wore. From memory: beer made of bread, rope, the knotted cord.
  // Made up: the errand of the tally, the foreman, the baker who speaks for her.
  khufu: {
    first: '큰 피라미드를 한창 쌓는 중이란다. 돌 조각을 전해 주렴.',
    dir: 'giza2560', look: 'paper', pale: true,
    // As Kaifeng: the eye is a camera and things stand nearer it than the street (the user,
    // 2026.10.12: "대피라미드만 개봉처럼 full로 다 해보자").
    deep: true,
    drawn: '그 무렵 이집트 무덤 벽에 새기고 칠하던 그림처럼 그렸단다.',
    scenes: [
      {
        id: 'harbour', name: '이집트 기자 물길의 나루', short: '물길의 나루', zoom: 1.09, ground: 0.745, scale: 0.638, air: 'court', floor: 'dirt',
        // The wall, the dune and the pyramid are a picture of their own behind the rest
        // (harbour-far, harbour-near: cut from harbour.webp by assets/codex/giza-far/make.py; the
        // other two scenes by make2.py).
        far: { aspect: 1 },
        fore: [
          { src: 'fore-dates', x: 0.1, at: 'top', tall: 0.38 }, { src: 'fore-papyrus', x: 0.27, at: 'foot', tall: 0.21 },
          { src: 'fore-fish', x: 0.45, at: 'top', tall: 0.36 }, { src: 'fore-post', x: 0.62, at: 'foot', tall: 0.18 },
          { src: 'fore-dates', x: 0.8, at: 'top', tall: 0.34 }, { src: 'fore-papyrus', x: 0.95, at: 'foot', tall: 0.19 },
        ],
        sora: '배에 돌을 싣고 왔어!',
        people: [
          { id: 'rower', pass: '영차, 다 왔다!', name: '뱃사공', x: 0.19, w: 127, h: 320, lines: ['강 건너 투라에서 흰 돌을 실어 왔지.', '열흘에 두세 번은 오간단다.'] },
          { id: 'roper', pass: '꼬고, 또 꼬고.', name: '밧줄 꼬는 사람', x: 0.3, w: 129, h: 302, lines: ['돌을 끌려면 밧줄이 굵어야 해.', '하루에도 몇 타래를 꼰단다.'] },
          { id: 'watergirl', pass: '물이오, 시원한 물!', name: '물 긷는 아이', x: 0.4, w: 84, h: 245, lines: ['강물이 넘치는 철이라 물길이 깊어.', '그래서 큰 배가 여기까지 와.'] },
          { id: 'hauler', pass: '하나, 둘, 영차!', name: '돌 내리는 일꾼', x: 0.51, w: 131, h: 304, lines: ['돌 하나가 황소 몇 마리 무게란다.', '지렛대와 굴림대로 내리지.'] },
          { id: 'linen', pass: '시원한 아마 옷이오.', name: '아마 옷 짓는 아주머니', x: 0.62, w: 118, h: 287, lines: ['풀 줄기로 짠 천이라 시원하단다.', '아이 옷도 있어. 입어 보련?'],
            try: { id: 'wear-egypt', verb: 'wear', name: '이집트의 옷', outfit: 'egypt', sora: '얇아서 바람이 솔솔!', memo: '아마라는 풀의 줄기로 짠 천이란다. 더운 나라에 딱 맞았지.' } },
          { id: 'merer', pass: '오늘도 적어 둬야지.', show: 'diary', pose: 'see-aha', sora: '날마다 한 일을 다 적었어!', memo: '이 사람이 날마다 적은 일지가 2013년에 발견됐단다. 가장 오래된 파피루스지.', name: '감독 메레르', x: 0.73, w: 118, h: 302, lines: ['돌을 몇 개 날랐는지 날마다 적는단다.', '적어 두지 않으면 다 잊히거든.'] },
          { id: 'fisher', pass: '오늘 저녁은 생선이다.', name: '어부', x: 0.85, w: 155, h: 302, lines: ['일꾼들 먹일 생선이라오.', '강이 넘치면 고기도 많이 잡히지.'] },
        ],
        spots: [],
      },
      {
        id: 'village', name: '이집트 기자 일꾼 마을', short: '일꾼 마을', zoom: 1.09, ground: 0.745, scale: 0.638, air: 'market', floor: 'dirt',
        // (The wall and the pyramid behind this street are the harbour's: they stand in the same place in both pictures.)
        far: { src: 'harbour-far', aspect: 1 },
        fore: [
          { src: 'fore-awning', x: 0.1, at: 'top', tall: 0.38 }, { src: 'fore-jars', x: 0.27, at: 'foot', tall: 0.21 },
          { src: 'fore-fronds', x: 0.45, at: 'top', tall: 0.36 }, { src: 'fore-bread', x: 0.62, at: 'foot', tall: 0.18 },
          { src: 'fore-awning', x: 0.8, at: 'top', tall: 0.34 }, { src: 'fore-jars', x: 0.95, at: 'foot', tall: 0.19 },
        ],
        sora: '빵 굽는 냄새가 나!',
        people: [
          { id: 'brewer', pass: '걸러라, 걸러.', name: '맥주 빚는 아주머니', x: 0.18, w: 94, h: 279, lines: ['보리빵을 물에 불려 걸러 빚는단다.', '이건 어른들 마실 거야.'] },
          { id: 'butcher', pass: '고기 왔소, 고기!', name: '고기 나누는 사람', x: 0.29, w: 158, h: 280, lines: ['일꾼들 먹일 소와 양이란다.', '힘쓰는 사람은 잘 먹어야지.'] },
          { id: 'painter', pass: '우리 조가 으뜸이지!', show: 'gang', pose: 'see-aha', sora: '돌에 이름을 써 놨어!', memo: '일꾼들은 조를 짜서 일했고 조마다 이름이 있었단다. "쿠푸의 벗들" 같은 이름이지.', name: '조 이름 쓰는 일꾼', x: 0.4, w: 133, h: 273, lines: ['우리 조 이름을 돌에 써 두는 거야.', '끌려온 게 아니란다. 철 따라 와서 일하지.'] },
          { id: 'potter', pass: '빵틀이 또 깨졌네.', name: '빵틀 빚는 옹기장이', x: 0.51, w: 129, h: 275, lines: ['빵틀은 크기가 세 가지란다.', '그래야 빵을 똑같이 나눠 주지.'] },
          { id: 'kid', pass: '양파 먹을래?', name: '마을 아이', x: 0.62, w: 107, h: 199, lines: ['아빠는 돌 끄는 조야.', '나는 크면 서기가 될 거야.'] },
          { id: 'baker', pass: '갓 구운 빵이오!', show: 'bread', name: '빵 굽는 아주머니', x: 0.73, w: 145, h: 280, lines: ['흙 틀에 넣어 숯불에 묻어 굽는단다.', '하나 먹어 보련?'],
            try: { id: 'eat-bread', verb: 'eat', name: '원뿔 빵', face: 'yum', sora: '겉은 딱딱, 속은 쫀득해!', memo: '이 마을 자리에서는 깨진 빵틀 조각이 산더미로 나왔단다.' } },
          { id: 'foreman', pass: '썰매 지나간다, 비켜라!', name: '일꾼 우두머리', x: 0.85, w: 160, h: 320, lines: ['돌 썰매가 다니는 길을 지킨단다.', '한눈팔면 큰일 나는 길이지.'] },
        ],
        spots: [],
      },
      {
        id: 'ramp', name: '이집트 기자 피라미드 발치', short: '피라미드 발치', zoom: 1.16, ground: 0.69, scale: 0.678, air: 'masons', floor: 'dirt',
        // (The ramp leans on the pyramid, so here the far goes by nearly as fast as the street: it is wide.)
        far: { aspect: 1.3 },
        fore: [
          { src: 'fore-shade', x: 0.1, at: 'top', tall: 0.38 }, { src: 'fore-block', x: 0.27, at: 'foot', tall: 0.21 },
          { src: 'fore-scaffold', x: 0.45, at: 'top', tall: 0.36 }, { src: 'fore-tools', x: 0.62, at: 'foot', tall: 0.18 },
          { src: 'fore-shade', x: 0.8, at: 'top', tall: 0.34 }, { src: 'fore-block', x: 0.95, at: 'foot', tall: 0.19 },
        ],
        sora: '우와, 산을 쌓고 있어!',
        people: [
          { id: 'pourer', pass: '물 붓는다, 끌어라!', name: '물 붓는 사람', x: 0.18, w: 124, h: 288, lines: ['썰매 앞 모래에 물을 붓는단다.', '그러면 썰매가 잘 미끄러지지.'] },
          { id: 'puller', pass: '영차! 영차!', name: '줄 끄는 일꾼', x: 0.29, w: 133, h: 273, lines: ['돌이 이백만 개가 넘게 든다더구나.', '하나씩 끌다 보면 산이 되지.'] },
          { id: 'mason', pass: '톡톡, 반듯하게.', show: 'casing', pose: 'see-wow', sora: '돌이 눈처럼 하얘!', memo: '겉은 강 건너 투라의 흰 돌로 매끈하게 덮었단다. 햇빛에 눈부셨지.', name: '겉돌 다듬는 석공', x: 0.4, w: 133, h: 295, lines: ['겉에 붙일 흰 돌을 다듬는단다.', '구리 정으로 톡톡 쳐 보겠니?'],
            try: { id: 'use-chisel', verb: 'use', name: '구리 정', sora: '톡, 톡! 돌가루가 날려.' } },
          { id: 'scribe', pass: '서른, 서른하나…', show: 'sled', pose: 'see-wow', sora: '물을 부으니까 쑥쑥 나가!', memo: '젖은 모래 위에서는 끄는 힘이 절반이면 된단다. 요즘 사람들이 재어 보았지.', name: '감독의 서기', x: 0.51, w: 130, h: 309, lines: ['들어온 돌을 하나하나 적는단다.', '적은 것은 안크하프 님께 올리지.'] },
          { id: 'surveyor', pass: '줄을 팽팽히!', name: '줄 재는 사람', x: 0.62, w: 105, h: 295, lines: ['매듭 지은 줄로 길이를 잰단다.', '조금만 틀려도 꼭대기가 안 맞아.'] },
          { id: 'ankhhaf', pass: '오늘은 몇 단을 올렸느냐.', name: '일터를 맡은 안크하프', x: 0.73, w: 154, h: 320, lines: ['임금님의 무덤 쌓는 일을 맡았단다.', '다 쌓으면 세상에서 가장 높을 게다.'] },
          { id: 'waterboy', pass: '물 왔어요, 물!', name: '물 나르는 아이', x: 0.85, w: 139, h: 229, lines: ['하루에 스무 번은 오르내려.', '물이 없으면 썰매가 안 나가거든.'] },
        ],
        spots: [],
      },
    ],
    // "The tally" (core/tale.js; the user, 2026.10.10, of the storyboard: "이대로 지어"): Merer
    // has written on a flake of stone how many blocks he brought today; the foreman keeps
    // her off the sledge road; the baker shows her the way the bread goes; she hands the
    // flake to the scribe, choosing what to say; and he shows her the stone going up.
    tale: {
      thing: true,
      ask: '돌은 어떻게 저 위로 올라갈까?',
      gate: { scene: 'village', open: 3, sora: '우두머리가 막고 있어. 못 가.' },
      steps: [
        {
          who: 'merer', goal: '물길의 나루에서 감독 메레르에게 가 보렴.', holds: '돌 조각: 메레르가 들고 있음',
          lines: ['얘야, 심부름 하나 해 주련?', '오늘 실어 온 돌의 수를 여기 적었단다.', '피라미드 발치의 서기에게 전해 주렴.'],
          offer: { ask: '돌 조각을 전해 줄까?', label: '내가 전해 줄게요' },
          errand: 'took',
        },
        {
          who: 'foreman', goal: '일꾼 마을 끝의 큰 문으로 가 보렴.', holds: '돌 조각: 소라가 들고 있음',
          lines: ['멈춰라. 돌 썰매가 지나가는 길이다.', '아이가 다닐 데가 아니야.'],
          sora: '전해야 하는데… 어? 누가 불러!',
        },
        {
          who: 'baker', call: '얘야, 이리 와 보렴.', goal: '빵 굽는 아주머니가 부른다. 가 보렴.', holds: '돌 조각: 소라가 들고 있음',
          lines: ['서기님께 가는 길이라고?', '빵 나르는 길로 가면 썰매를 안 만난단다.', '우두머리님께는 내가 말해 주마.'],
          after: [{ who: 'foreman', line: '빵 길로 가거라. 썰매 길은 안 된다.' }],
          sora: '빵 길로 가면 된대! 가자!',
        },
        {
          who: 'scribe', goal: '피라미드 발치의 서기에게 돌 조각을 전하렴.', holds: '돌 조각: 소라가 들고 있음',
          lines: ['어디 보자, 나루에서 온 거냐?'],
          choice: {
            ask: '돌 조각을 건네며 뭐라고 할까?',
            options: [
              { id: 'E1', label: '"메레르가 보냈어요"', sora: '메레르 아저씨가 보냈어요.', says: '투라의 흰 돌이 왔구나. 잘했다!' },
              { id: 'E2', label: '"돌이 몇 개예요?"', sora: '오늘 돌이 몇 개 왔어요?', says: '서른 개란다. 하나도 안 빠졌구나.' },
            ],
          },
          errand: 'gave',
        },
        {
          who: 'scribe', show: true, goal: '서기가 가리키는 비탈길을 보렴.',
          lines: ['저기 보렴. 오늘 온 돌이 올라간다.', '썰매 앞에 물을 부으면 잘 나간단다.'],
          sora: '다 같이 끄니까 돌이 올라가!',
          errand: 'saw',
        },
      ],
      asides: [
        { who: 'merer', when: ['S1', 'S2', 'S3', 'S4'], lines: ['서기는 피라미드 발치에 있단다.', '일꾼 마을을 지나면 나온다.'] },
        { who: 'merer', when: ['S5'], lines: ['전해 주었구나. 고맙다, 얘야.', '오늘 일지에 네 이야기도 적어야겠다.'] },
      ],
      done: '돌 조각을 전하고, 돌이 오르는 것을 보았다.',
    },
    errands: [
      { id: 'took', text: '돌 조각을 받는다.', at: [] },
      { id: 'gave', text: '서기에게 돌 조각을 전한다.', at: [] },
      { id: 'saw', text: '돌이 비탈길을 오르는 것을 본다.', at: [] },
    ],
    reply: '그 감독의 일지가 사천오백 해 뒤에 나왔단다. 적어 두면 남는 법이지.',
  },
  // Nara, the 9th of the 4th month of 752 (26 May): the eyes of the Great Buddha are painted
  // in. Drawn in ink on hemp, as the bodhisattva on hemp kept in the Shosoin (the user,
  // 2026.10.10, of five tries: "나라 4"). Looked up on 2026.10.10 and found so: the day; the
  // Indian monk Bodhisena dotted the eyes with a giant brush; the brush, the ink stick and a
  // blue silk cord of that day are in the Shosoin, with masks and costumes; some ten thousand
  // monks and four thousand musicians and dancers, troupes of Japan and of the mainland; the
  // statue some 16 m high at first. Commonly told but not found this time: that those present
  // held the cord (said here as "it is told"). From memory: the bronze lantern before the hall
  // is of that time and stands there still, the gilding was not finished on the day, petals
  // of paper scattered, tallies of wood, dress after the Tang.
  // Made up: the cord maker's errand, the gatekeeper, the drummer who takes her in.
  nara752: {
    first: '오늘은 큰 부처님의 눈을 그려 넣는 날이란다. 비단 끈을 전해 주렴.',
    dir: 'nara752', look: 'paper', pale: true,
    drawn: '그 무렵 나라 사람들이 삼베에 먹으로 그리던 그림처럼 그렸단다.',
    scenes: [
      {
        id: 'gate', name: '일본 나라 도다이지 문 앞', short: '절 문 앞', zoom: 1.13, ground: 0.715, scale: 0.661, air: 'street', floor: 'dirt',
        sora: '깃발이 하늘까지 닿겠어!',
        people: [
          { id: 'rice', pass: '김 나는 찐 쌀이오!', show: 'rice', name: '찐 쌀 파는 아주머니', x: 0.19, w: 145, h: 306, lines: ['먼 데서 온 이들이 많아 잘 팔린단다.', '하나 먹어 보련?'],
            try: { id: 'eat-rice', verb: 'eat', name: '찐 쌀 덩이', face: 'yum', sora: '쫀득쫀득, 꼭꼭 씹혀!' } },
          { id: 'farmer', pass: '허어, 크기도 하다.', name: '먼 고을에서 온 농부', x: 0.3, w: 134, h: 302, lines: ['열흘을 걸어서 왔다오.', '큰 부처님을 한 번은 뵈어야지.'] },
          { id: 'tiler', pass: '기와가 몇 장인지 아나?', name: '기와 굽는 장인', x: 0.4, w: 133, h: 310, lines: ['저 큰 집 지붕에 얹은 기와라오.', '굽고 또 구워도 모자랐지.'] },
          { id: 'child', pass: '탑이 구름에 닿았어!', name: '구경하는 아이', x: 0.51, w: 92, h: 187, lines: ['저 탑은 일곱 층이야. 세어 봤어.', '꼭대기는 고개가 아파서 못 봐.'] },
          { id: 'weaver', pass: '고운 옷 보고 가요.', name: '옷감 짜는 아주머니', x: 0.62, w: 130, h: 310, lines: ['바다 건너 당나라 옷을 본뜬 거란다.', '아이 옷도 있어. 입어 보련?'],
            try: { id: 'wear-nara', verb: 'wear', name: '나라의 옷', outfit: 'nara', sora: '치마가 가슴까지 올라와!', memo: '그 무렵 일본은 당나라의 옷과 집과 글을 많이 배워 왔단다.' } },
          { id: 'cord', pass: '한 올, 또 한 올.', name: '끈 꼬는 장인', x: 0.73, w: 128, h: 306, lines: ['비단실을 꼬아 끈을 만든단다.', '오늘 쓸 끈은 아주 길어야 해.'] },
          { id: 'official', pass: '만 명, 만 하고도…', name: '글 쓰는 관리', x: 0.85, w: 115, h: 320, lines: ['오늘 모인 스님만 만 명이란다.', '나무 조각에 다 적는 중이지.'] },
        ],
        spots: [],
      },
      {
        id: 'court', name: '일본 나라 도다이지 회랑 마당', short: '회랑 마당', zoom: 1.16, ground: 0.695, scale: 0.678, air: 'court', floor: 'dirt',
        sora: '탈이 잔뜩 걸려 있어!',
        people: [
          { id: 'mask', pass: '얼쑤, 코가 길지?', show: 'mask', pose: 'see-wow', sora: '코가 엄청 긴 탈이야!', memo: '그날 쓴 탈과 춤옷이 지금도 쇼소인이라는 창고에 남아 있단다.', name: '탈춤꾼', x: 0.18, w: 130, h: 293, lines: ['먼 서쪽 나라 사람을 본뜬 탈이란다.', '이걸 쓰고 줄지어 춤을 추지.'] },
          { id: 'biwa', pass: '둥, 디리링.', name: '비파 타는 악사', x: 0.29, w: 132, h: 277, lines: ['바다 건너에서 온 악기란다.', '오늘은 여러 나라 음악이 다 울려.'] },
          { id: 'tang', pass: '나무아미타불.', name: '당나라에서 온 스님', x: 0.4, w: 102, h: 278, lines: ['바다를 건너 이 나라에 왔다오.', '오늘 눈을 그리는 스님은 인도 분이지.'] },
          { id: 'petal', pass: '꽃잎 뿌려요, 꽃잎!', name: '꽃잎 뿌리는 동자', x: 0.51, w: 120, h: 230, lines: ['의식 때 하늘에 뿌릴 꽃잎이야.', '바구니가 벌써 세 개째야.'] },
          { id: 'flute', pass: '삐이, 삘릴리.', name: '피리 부는 악사', x: 0.62, w: 119, h: 282, lines: ['악사와 춤꾼이 사천 명이란다.', '이런 큰 잔치는 처음이야.'] },
          { id: 'drummer', pass: '둥! 둥! 북 나간다!', name: '큰 북 치는 악사', x: 0.73, w: 139, h: 285, lines: ['이 북은 사람 키보다 크단다.', '멀리까지 울리라고 힘껏 치지.'] },
          { id: 'keeper', pass: '줄을 맞춰 들어가시오.', name: '안문 지키는 사람', x: 0.85, w: 136, h: 320, lines: ['안마당은 의식 맡은 이만 든단다.', '스님들 줄이 아직 길구나.'] },
        ],
        spots: [],
      },
      {
        id: 'hall', name: '일본 나라 도다이지 큰 부처 집 앞', short: '큰 부처 집 앞', zoom: 1.16, ground: 0.695, scale: 0.678, air: 'hush', floor: 'dirt',
        sora: '부처님 손이 방만 해!',
        people: [
          { id: 'incense', pass: '향을 올립니다.', name: '향 올리는 스님', x: 0.18, w: 80, h: 304, lines: ['만 명이 함께 경을 읽는단다.', '소리가 산을 넘어가겠지.'] },
          { id: 'caster', pass: '내가 부은 부처님이지!', show: 'buddha', pose: 'see-wow', sora: '사람이 손가락보다 작아!', memo: '처음 만든 부처는 높이가 16미터쯤이었단다. 구리를 녹여 부어 만들었지.', name: '부처를 부은 장인', x: 0.29, w: 106, h: 297, lines: ['구리를 녹여 틀에 부어 만들었단다.', '여러 해가 걸린 큰일이었지.'] },
          { id: 'gilder', pass: '금이 아직 모자라.', name: '금 입히는 장인', x: 0.4, w: 79, h: 246, lines: ['부처님 몸에 금을 입히는 중이란다.', '아직 다 못 입혔어. 워낙 크셔서.'] },
          { id: 'ritual', pass: '끈이, 끈이 아직인가.', show: 'eyes', pose: 'see-wow', sora: '다 같이 끈을 잡았어!', memo: '붓에 긴 끈을 매어 모인 이들이 함께 잡았다고 전한단다. 다 같이 눈을 그린 셈이지.', name: '의식을 맡은 스님', x: 0.51, w: 104, h: 243, lines: ['오늘 부처님의 눈을 그려 넣는단다.', '눈을 그려야 비로소 부처님이 되시지.'] },
          { id: 'bodhi', pass: '붓이 묵직하구나.', show: 'brush', pose: 'see-aha', sora: '붓이 내 팔보다 길어!', memo: '인도에서 온 스님 보리선나가 이 붓으로 눈을 그렸단다. 붓은 지금도 남아 있지.', name: '인도에서 온 스님', x: 0.62, w: 95, h: 298, lines: ['먼 인도에서 바다를 건너왔단다.', '이 붓으로 눈동자를 찍을 게다.'] },
          { id: 'lamp', pass: '불을 밝혀야지.', show: 'lantern', pose: 'see-aha', sora: '등에 피리 부는 이가 있어!', memo: '이 청동 등은 지금도 큰 부처 집 앞 그 자리에 서 있단다.', name: '등 지키는 사람', x: 0.73, w: 90, h: 320, lines: ['이 등은 여덟 모로 지었단다.', '문짝마다 악기 든 보살이 계시지.'] },
          { id: 'granny', pass: '고맙습니다, 고맙습니다.', name: '절하는 할머니', x: 0.85, w: 88, h: 216, lines: ['살아서 이날을 보는구나.', '온 나라가 힘을 모아 지었단다.'] },
        ],
        spots: [],
      },
    ],
    // "The cord" (core/tale.js; the user, 2026.10.10, of the storyboard: "이대로 지어"): the cord
    // maker has the silk cord for the brush; the keeper of the inner gate lets only the monks
    // in; the drummer takes her round by the players' door; she hands it to the monk who
    // sees to the rite, choosing what to say; and the eyes are painted in.
    tale: {
      thing: true,
      ask: '부처의 눈은 누가 그릴까?',
      gate: { scene: 'court', open: 3, sora: '문 지키는 사람이 막아. 못 가.' },
      steps: [
        {
          who: 'cord', goal: '절 문 앞의 끈 꼬는 장인에게 가 보렴.', holds: '비단 끈: 장인이 들고 있음',
          lines: ['얘야, 이 끈을 좀 보렴.', '오늘 눈 그리는 붓에 맬 끈이란다.', '의식 맡은 스님께 전해 줄래?'],
          offer: { ask: '비단 끈을 전해 줄까?', label: '내가 전해 줄게요' },
          errand: 'took',
        },
        {
          who: 'keeper', goal: '회랑 마당 끝의 안문으로 가 보렴.', holds: '비단 끈: 소라가 들고 있음',
          lines: ['멈추어라. 스님들 줄이 들어가는 중이다.', '아이는 밖에서 기다려라.'],
          sora: '끈을 전해야 하는데… 어? 누가 불러!',
        },
        {
          who: 'drummer', call: '얘야, 그 끈은 뭐니?', goal: '큰 북 치는 악사가 부른다. 가 보렴.', holds: '비단 끈: 소라가 들고 있음',
          lines: ['붓에 맬 끈이라고? 큰일 날 뻔했구나.', '악사들이 드나드는 옆문이 있단다.', '나를 따라 북 뒤로 오렴.'],
          after: [{ who: 'keeper', line: '악사와 함께라면 지나가거라.' }],
          sora: '옆문으로 가면 된대! 가자!',
        },
        {
          who: 'ritual', goal: '큰 부처 집 앞의 의식 맡은 스님에게 끈을 전하렴.', holds: '비단 끈: 소라가 들고 있음',
          lines: ['오오, 끈이 이제야 왔구나!'],
          choice: {
            ask: '비단 끈을 건네며 뭐라고 할까?',
            options: [
              { id: 'E1', label: '"장인이 꼬았어요"', sora: '문 앞의 장인이 꼬았어요.', says: '곱게도 꼬았구나. 고맙다, 얘야.' },
              { id: 'E2', label: '"끈은 왜 매요?"', sora: '붓에 끈은 왜 매는 거예요?', says: '모두가 함께 잡으려고 맨단다.' },
            ],
          },
          errand: 'gave',
        },
        {
          who: 'ritual', show: true, goal: '스님이 가리키는 큰 부처를 보렴.',
          lines: ['이제 시작한다. 저 위를 보렴.', '끈을 잡은 모두가 함께 그리는 거란다.'],
          sora: '눈이 생겼어! 부처님이 보셔.',
          errand: 'saw',
        },
      ],
      asides: [
        { who: 'cord', when: ['S1', 'S2', 'S3', 'S4'], lines: ['의식 맡은 스님은 큰 부처 집 앞에 계신다.', '회랑 마당을 지나 안문으로 가렴.'] },
        { who: 'cord', when: ['S5'], lines: ['전해 주었구나. 고맙다, 얘야.', '내 끈이 그 붓에 매였다니 꿈만 같구나.'] },
      ],
      done: '비단 끈을 전하고, 눈 그리는 것을 보았다.',
    },
    errands: [
      { id: 'took', text: '비단 끈을 받는다.', at: [] },
      { id: 'gave', text: '스님에게 비단 끈을 전한다.', at: [] },
      { id: 'saw', text: '부처의 눈을 그려 넣는 것을 본다.', at: [] },
    ],
    reply: '그 붓과 끈은 천삼백 해 가까이 그 절의 창고에 그대로 있단다.',
  },
  // Athens about 432 BC: the Parthenon is just finished. Drawn as the potters of Athens
  // painted black figures on their jars (the user, 2026.10.10, of five tries: "아테네 2").
  // The day is not on record. Looked up on 2026.10.10 and found so: begun 447 BC, the
  // building done by 438 and its sculpture by 432; the Athena inside by Phidias, gold and
  // ivory over wood, some 12 m high, its gold made to come off; the sculptures were painted
  // (Egyptian blue found on them in 2023); the columns swell a little in the middle, some
  // 18 mm, and why is disputed (no reason is given here); the prize jars of the games held
  // oil of Athena's sacred olive trees, some 39 litres, and were painted in black figure
  // long after that manner had gone out; sherds with a name scratched on them were the
  // votes that sent a man away for ten years. From memory: the new robe brought to the
  // goddess, the owl of Athens, olives, figs, barley bread; that Socrates, then about
  // forty, went barefoot about the agora asking questions (he is not named).
  // Made up: the potter's errand, the gatekeeper, the mason who takes her up.
  parthenon: {
    first: '파르테논 신전을 막 다 지은 해란다. 기름병을 전해 주렴.',
    dir: 'athens432', look: 'paper', pale: true,
    drawn: '아테네 사람들이 항아리에 검은 그림을 그리던 것처럼 그렸단다.',
    scenes: [
      {
        id: 'agora', name: '그리스 아테네 아고라', short: '아고라', zoom: 1.15, ground: 0.715, scale: 0.673, air: 'market', floor: 'dirt',
        sora: '저 언덕 위에 신전이야!',
        people: [
          { id: 'olive', pass: '올리브요, 갓 딴 올리브!', show: 'olive', name: '올리브 파는 아주머니', x: 0.19, w: 151, h: 296, lines: ['올리브는 여신이 주신 나무란다.', '하나 먹어 보련?'],
            try: { id: 'eat-olive', verb: 'eat', name: '올리브', face: 'sour', sora: '짜고 떫어! 그래도 고소해.' } },
          { id: 'fish', pass: '오늘 잡은 생선이오!', name: '생선 장수', x: 0.3, w: 145, h: 291, lines: ['아침 배로 들어온 생선이오.', '종이 울리면 장이 열린다오.'] },
          { id: 'water', pass: '물 길어 가요.', name: '물 긷는 소녀', x: 0.4, w: 85, h: 320, lines: ['샘터에서 물을 긷는 중이야.', '사자 입에서 물이 나와.'] },
          { id: 'voter', pass: '누구 이름을 쓸까…', show: 'ostrakon', pose: 'see-aha', sora: '그릇 조각에 이름을 써!', memo: '깨진 그릇 조각에 이름을 긁어 투표했단다. 많이 적힌 사람은 열 해 동안 떠나야 했지.', name: '그릇 조각에 이름 쓰는 사람', x: 0.51, w: 123, h: 300, lines: ['너무 힘센 사람을 내보내는 투표란다.', '깨진 그릇 조각에 이름을 긁어 쓰지.'] },
          { id: 'asker', pass: '자네, 그게 무언지 아나?', name: '말 많은 할아버지', x: 0.62, w: 130, h: 289, lines: ['나는 아는 게 없어서 묻고 다닌단다.', '너는 무엇이 궁금하니?'] },
          { id: 'potter', pass: '붓끝을 가늘게, 가늘게.', name: '도기 가게 주인', x: 0.73, w: 132, h: 299, lines: ['흙을 빚어 검은 그림을 그려 굽는단다.', '구우면 흙은 붉고 그림은 검어지지.'] },
          { id: 'tailor', pass: '고운 옷 보고 가요.', name: '옷 짓는 아주머니', x: 0.85, w: 99, h: 292, lines: ['천 한 장을 핀으로 여며 입는단다.', '아이 옷도 있어. 입어 보련?'],
            try: { id: 'wear-chiton', verb: 'wear', name: '그리스의 옷', outfit: 'chiton', sora: '천 한 장인데 옷이 됐어!', memo: '네모난 천을 접어 어깨에서 핀으로 여며 입었단다.' } },
        ],
        spots: [],
      },
      {
        id: 'ascent', name: '그리스 아테네 언덕 오르는 길', short: '언덕 오르는 길', zoom: 1.2, ground: 0.68, scale: 0.702, air: 'court', floor: 'dirt',
        sora: '다들 줄지어 올라가!',
        people: [
          { id: 'jar', pass: '물이 출렁, 조심조심.', name: '물 항아리 멘 청년', x: 0.18, w: 133, h: 310, lines: ['여신께 올릴 물을 지고 간단다.', '한 방울도 흘리면 안 되지.'] },
          { id: 'basket', pass: '바구니가 흔들려.', name: '바구니 인 소녀', x: 0.29, w: 130, h: 320, lines: ['행렬 맨 앞에서 바구니를 인단다.', '뽑힌 것만도 큰 자랑이야.'] },
          { id: 'piper', pass: '삘릴리, 삘릴리.', name: '피리 부는 사람', x: 0.4, w: 119, h: 270, lines: ['행렬은 피리 소리에 맞춰 걷는단다.', '언덕 꼭대기까지 불어야 해.'] },
          { id: 'robe', pass: '구겨지면 안 돼.', name: '새 옷 든 아이', x: 0.51, w: 112, h: 240, lines: ['여신께 바칠 새 옷이야.', '아홉 달 동안 짰대.'] },
          { id: 'elder', pass: '천천히, 천천히.', name: '올리브 가지 든 노인', x: 0.62, w: 143, h: 271, lines: ['저 신전을 열다섯 해 지었단다.', '내 눈으로 다 지은 것을 보는구나.'] },
          { id: 'mason', pass: '톡톡, 반듯하게.', show: 'column', pose: 'see-aha', sora: '기둥 배가 볼록해!', memo: '신전의 기둥은 가운데가 손가락 한 마디쯤 볼록하단다. 왜 그랬는지는 아직도 다툰단다.', name: '석공', x: 0.73, w: 127, h: 269, lines: ['기둥은 곧게 깎지 않는단다.', '가운데를 아주 조금 볼록하게 하지.'] },
          { id: 'gatekeeper', pass: '행렬이 먼저요, 행렬이.', name: '문지기', x: 0.85, w: 153, h: 279, lines: ['언덕 위는 여신의 땅이란다.', '오늘은 행렬이 먼저 오른다.'] },
        ],
        spots: [],
      },
      {
        id: 'temple', name: '그리스 아테네 파르테논 앞', short: '파르테논 앞', zoom: 1.22, ground: 0.67, scale: 0.714, air: 'hush',
        sora: '우와, 기둥이 숲 같아!',
        people: [
          { id: 'painter', pass: '파랑이 모자라네.', show: 'colour', pose: 'see-wow', sora: '조각에 색을 칠해!', memo: '신전의 조각에는 파랗고 붉은 색이 칠해져 있었단다. 지금은 다 바랬지.', name: '색 칠하는 화가', x: 0.18, w: 155, h: 312, lines: ['조각은 깎고 나서 색을 입힌단다.', '옷은 파랗게, 머리는 붉게.'] },
          { id: 'phidias', pass: '흠, 금이 잘 붙었군.', name: '조각가 페이디아스', x: 0.29, w: 125, h: 319, lines: ['안의 여신상은 내가 만들었단다.', '금 옷은 떼어 낼 수 있게 했지.'] },
          { id: 'architect', pass: '줄을 팽팽히!', name: '기둥 재는 건축가', x: 0.4, w: 144, h: 319, lines: ['돌 하나하나를 재어 맞췄단다.', '틈에 머리카락 한 올도 안 들어가지.'] },
          { id: 'keeper', pass: '등잔 기름이 다 됐네.', show: 'athena', pose: 'see-wow', sora: '여신님이 집보다 커!', memo: '금과 상아로 만든 여신상이었단다. 높이가 12미터쯤이었는데 지금은 남아 있지 않지.', name: '제단지기', x: 0.51, w: 144, h: 316, lines: ['여신의 등잔을 지키는 일을 한단다.', '불이 꺼지면 안 되거든.'] },
          { id: 'runner', pass: '내가 이겼어, 내가!', show: 'prize', pose: 'see-aha', sora: '상이 기름 항아리야!', memo: '경기에서 이기면 여신의 올리브 기름을 항아리째 받았단다. 그 항아리엔 늘 검은 그림을 그렸지.', name: '달리기 이긴 청년', x: 0.62, w: 138, h: 320, lines: ['달리기에서 이겨 받은 상이란다.', '여신의 나무에서 짠 기름이지.'] },
          { id: 'visitor', pass: '허어, 듣던 대로구나.', name: '멀리서 온 구경꾼', x: 0.73, w: 135, h: 320, lines: ['배를 타고 사흘을 왔다오.', '이런 집은 세상에 또 없을 게요.'] },
          { id: 'owlkid', pass: '부엉, 부엉!', name: '부엉이 좋아하는 아이', x: 0.85, w: 96, h: 211, lines: ['부엉이는 여신님의 새야.', '우리 돈에도 부엉이가 있어.'] },
        ],
        spots: [],
      },
    ],
    // "The little jar of oil" (core/tale.js; the user, 2026.10.10, of the storyboard: "이대로
    // 지어"): the potter has a small jar of oil for the lamp of the goddess; the gatekeeper
    // lets the procession go first; the mason takes her up by the workmen's way; she hands
    // it to the keeper of the altar, choosing what to say; and is shown the goddess.
    tale: {
      thing: true,
      ask: '언덕 위 신전에는 누가 살까?',
      gate: { scene: 'ascent', open: 3, sora: '문지기가 막고 있어. 못 가.' },
      steps: [
        {
          who: 'potter', goal: '아고라의 도기 가게 주인에게 가 보렴.', holds: '기름병: 가게 주인이 들고 있음',
          lines: ['얘야, 심부름 하나 해 주련?', '여신의 등잔에 넣을 기름이란다.', '언덕 위 제단지기에게 전해 주렴.'],
          offer: { ask: '기름병을 전해 줄까?', label: '내가 전해 줄게요' },
          errand: 'took',
        },
        {
          who: 'gatekeeper', goal: '언덕 오르는 길 끝의 큰 문으로 가 보렴.', holds: '기름병: 소라가 들고 있음',
          lines: ['멈추어라. 행렬이 다 오를 때까지다.', '아이 혼자는 못 올라간다.'],
          sora: '기름을 전해야 하는데… 어? 누가 불러!',
        },
        {
          who: 'mason', call: '얘야, 그 병은 뭐니?', goal: '석공이 부른다. 가 보렴.', holds: '기름병: 소라가 들고 있음',
          lines: ['등잔 기름이라고? 그럼 급하겠구나.', '일꾼들이 돌 나르던 옆길이 있단다.', '나를 따라 오너라.'],
          after: [{ who: 'gatekeeper', line: '석공과 함께라면 올라가거라.' }],
          sora: '옆길로 가면 된대! 올라가자!',
        },
        {
          who: 'keeper', goal: '파르테논 앞의 제단지기에게 기름병을 전하렴.', holds: '기름병: 소라가 들고 있음',
          lines: ['마침 기름이 다 되어 가던 참이란다.'],
          choice: {
            ask: '기름병을 건네며 뭐라고 할까?',
            options: [
              { id: 'E1', label: '"도기 가게에서 왔어요"', sora: '아고라의 도기 가게에서 왔어요.', says: '그 집 기름병이구나. 고맙다, 얘야.' },
              { id: 'E2', label: '"안에 누가 있어요?"', sora: '신전 안에는 누가 있어요?', says: '여신 아테나가 계신단다. 보여 주마.' },
            ],
          },
          errand: 'gave',
        },
        {
          who: 'keeper', show: true, goal: '제단지기가 가리키는 신전 안을 보렴.',
          lines: ['문 안쪽을 올려다보렴.', '금과 상아로 지은 여신님이란다.'],
          sora: '금빛이야! 고개가 다 아파.',
          errand: 'saw',
        },
      ],
      asides: [
        { who: 'potter', when: ['S1', 'S2', 'S3', 'S4'], lines: ['제단지기는 신전 앞에 있단다.', '언덕 오르는 길을 끝까지 가렴.'] },
        { who: 'potter', when: ['S5'], lines: ['전해 주었구나. 고맙다, 얘야.', '오늘 밤 여신의 등잔은 내 기름으로 타겠구나.'] },
      ],
      done: '기름병을 전하고, 금빛 여신상을 보았다.',
    },
    errands: [
      { id: 'took', text: '기름병을 받는다.', at: [] },
      { id: 'gave', text: '제단지기에게 기름병을 전한다.', at: [] },
      { id: 'saw', text: '금빛 여신상을 본다.', at: [] },
    ],
    reply: '색이 칠해진 신전을 봤구나. 지금은 흰 기둥만 남았단다.',
  },
  // Angkor about 1150: Angkor Wat is all but built. Drawn as the low reliefs of its own
  // galleries (the user, 2026.10.10, of five tries: "앙코르 1"). The day is not on record.
  // Looked up on 2026.10.10 and found so: the state temple of Suryavarman II, of the first
  // half of the 12th century; its sandstone from some fifty quarries at the foot of Mount
  // Kulen, brought by canals some 35 km (a study of 2012); some 800 m of reliefs, among
  // them the Churning of the Sea of Milk with 88 demons and 92 gods pulling the serpent and
  // Vishnu as a turtle under the mountain; nearly 2,000 dancing figures with 37 ways of
  // dressing the hair; traces of paint and gold leaf, of what time is not known.
  // From memory: sugar-palm juice, the wrapped cloth, houses on stilts, the temple facing
  // west, that elephants hauled stone here.
  // Made up: the wife's errand of the chisel, the elephant driver, the child with the boat.
  angkor1150: {
    first: '큰 사원을 거의 다 지은 때란다. 쇠 정을 전해 주렴.',
    dir: 'angkor1150', look: 'paper', pale: true,
    drawn: '그 절의 벽에 얕게 새긴 돌 그림처럼 그렸단다.',
    scenes: [
      {
        id: 'moat', name: '크메르 앙코르 해자 앞', short: '해자 앞', zoom: 1.15, ground: 0.705, scale: 0.673, air: 'market', floor: 'dirt',
        sora: '탑이 연꽃 봉오리 같아!',
        people: [
          { id: 'fruit', pass: '망고요, 잘 익은 망고!', name: '과일 장수', x: 0.19, w: 153, h: 312, lines: ['절 짓는 이들이 사 먹는 과일이란다.', '일꾼이 많으니 장도 크게 서지.'] },
          { id: 'fishwife', pass: '큰 호수에서 온 생선!', name: '생선 파는 아주머니', x: 0.3, w: 135, h: 320, lines: ['큰 호수에서 잡아 말린 생선이란다.', '비 오는 철엔 호수가 몇 배로 커지지.'] },
          { id: 'carter', pass: '영차, 돌 나간다!', show: 'canal', pose: 'see-wow', sora: '돌이 뗏목을 타고 와!', memo: '돌은 쿨렌 산 기슭에서 캐어 물길로 실어 왔단다. 물길이 서른다섯 킬로미터쯤이었지.', name: '돌 수레 끄는 사람', x: 0.4, w: 144, h: 319, lines: ['이 돌은 먼 산에서 캐 온 거란다.', '물길에 뗏목을 띄워 실어 오지.'] },
          { id: 'child', pass: '연잎 우산이다!', name: '물장난하는 아이', x: 0.51, w: 135, h: 242, lines: ['해자가 강처럼 넓어.', '저기 탑이 다섯 개야. 세어 봐.'] },
          { id: 'weaver', pass: '고운 천 보고 가요.', name: '천 짜는 아주머니', x: 0.62, w: 137, h: 316, lines: ['천 한 장을 허리에 감아 입는단다.', '아이 것도 있어. 입어 보련?'],
            try: { id: 'wear-sampot', verb: 'wear', name: '크메르의 옷', outfit: 'sampot', sora: '감기만 했는데 치마야!', memo: '긴 천을 허리에 감아 여며 입는 옷이란다. 삼폿이라고 하지.' } },
          { id: 'wife', pass: '아이고, 이를 어쩌나.', name: '장인의 아내', x: 0.73, w: 109, h: 318, lines: ['우리 집 양반은 돌 새기는 장인이란다.', '새벽부터 회랑에서 일하지.'] },
          { id: 'palm', pass: '달콤한 야자 즙이오!', show: 'palm', name: '야자 즙 받는 아저씨', x: 0.85, w: 140, h: 315, lines: ['사탕야자 나무에서 받은 즙이란다.', '한 모금 마셔 보련?'],
            try: { id: 'eat-palm', verb: 'eat', name: '야자 즙', face: 'yum', sora: '달콤해! 꿀물 같아.' } },
        ],
        spots: [],
      },
      {
        id: 'causeway', name: '크메르 앙코르와트 둑길', short: '둑길', zoom: 1.17, ground: 0.695, scale: 0.684, air: 'court',
        sora: '난간이 뱀 모양이야!',
        people: [
          { id: 'monk', pass: '고맙습니다.', name: '탁발하는 스님', x: 0.18, w: 93, h: 269, lines: ['이 절은 비슈누 신께 바친 절이란다.', '해가 지는 서쪽을 보고 서 있지.'] },
          { id: 'lotus', pass: '연꽃이 곱게 피었네.', name: '연꽃 따는 아주머니', x: 0.29, w: 106, h: 277, lines: ['절에 올릴 연꽃을 따는 중이란다.', '해자에는 연꽃이 끝도 없지.'] },
          { id: 'porter', pass: '영차, 영차.', name: '돌 나르는 일꾼', x: 0.4, w: 177, h: 271, lines: ['깎고 남은 돌 부스러기란다.', '하루에도 수십 번을 나르지.'] },
          { id: 'dancer', pass: '하나, 둘, 손끝을 젖히고.', show: 'towers', pose: 'see-wow', sora: '탑이 물에도 비쳐!', memo: '가운데 탑과 네 귀의 탑, 모두 다섯이란다. 신들이 사는 산을 본떴다고 하지.', name: '춤 배우는 소녀', x: 0.51, w: 109, h: 291, lines: ['벽에 새긴 여신처럼 추는 춤이야.', '손가락을 이렇게 뒤로 젖혀.'] },
          { id: 'guard', pass: '둑길로 줄지어 가시오.', name: '문 지키는 병사', x: 0.62, w: 114, h: 320, lines: ['이 둑길은 해자를 건너 문까지 간단다.', '난간은 머리 일곱 달린 뱀이지.'] },
          { id: 'boatkid', pass: '배 타실 분, 배요!', name: '배 젓는 아이', x: 0.73, w: 123, h: 239, lines: ['연꽃 사이로 배를 저어 다녀.', '해자 건너편도 금방이야.'] },
          { id: 'mahout', pass: '코끼리 지나간다, 비켜라!', name: '코끼리 몰이꾼', x: 0.85, w: 114, h: 290, lines: ['코끼리가 돌을 끌고 다니는 길이란다.', '밟히면 큰일이니 물러서거라.'] },
        ],
        spots: [],
      },
      {
        id: 'gallery', name: '크메르 앙코르와트 회랑 앞', short: '회랑 앞', zoom: 1.15, ground: 0.71, scale: 0.673, air: 'masons',
        sora: '벽이 온통 그림이야!',
        people: [
          { id: 'polisher', pass: '쓱쓱, 돌 가루 날린다.', name: '돌 닦는 일꾼', x: 0.18, w: 114, h: 296, lines: ['새긴 자리의 돌 가루를 닦아 낸단다.', '닦아야 그림이 또렷해지지.'] },
          { id: 'drawer', pass: '선 하나 틀리면 큰일.', show: 'churn', pose: 'see-wow', sora: '다 같이 뱀을 당겨!', memo: '신과 마귀가 큰 뱀을 당겨 바다를 휘젓는 이야기란다. 양쪽을 합쳐 백여든이 당기지.', name: '밑그림 그리는 화공', x: 0.29, w: 106, h: 302, lines: ['숯으로 밑그림을 먼저 그린단다.', '이 벽 그림은 팔백 걸음을 이어지지.'] },
          { id: 'gilder', pass: '숨도 조심조심.', name: '금 입히는 사람', x: 0.4, w: 112, h: 299, lines: ['새긴 돌 위에 금을 입히기도 한단다.', '바람만 불어도 날아가는 금이야.'] },
          { id: 'carver', pass: '정이 무뎌졌구먼.', show: 'hair', pose: 'see-aha', sora: '머리 모양이 다 달라!', memo: '춤추는 여신이 이천쯤 새겨져 있단다. 머리 모양만 서른일곱 가지지.', name: '돌 새기는 장인', x: 0.51, w: 153, h: 314, lines: ['춤추는 여신을 새기는 중이란다.', '하나도 똑같이 새기지 않지.'] },
          { id: 'priest', pass: '꽃을 올려야지.', name: '사제', x: 0.62, w: 111, h: 320, lines: ['임금님이 신께 바치는 절이란다.', '다 지으려면 아직 몇 해 남았지.'] },
          { id: 'apprentice', pass: '톡, 톡… 어렵다.', name: '어린 제자', x: 0.73, w: 85, h: 227, lines: ['나는 아직 꽃잎만 새겨.', '스승님은 눈 감고도 새기신대.'] },
          { id: 'envoy', pass: '허어, 놀랍구려.', name: '먼 나라에서 온 사신', x: 0.85, w: 113, h: 313, lines: ['먼 북쪽 나라에서 왔다오.', '돌로 이런 것을 짓다니 놀랍소.'] },
        ],
        spots: [],
      },
    ],
    // "The chisel" (core/tale.js; the user, 2026.10.10, of the storyboard: "이대로 지어"): the
    // carver's wife has his new chisel, which he left at home; the elephant driver keeps her
    // off the causeway; the child with the boat rows her over the moat; she hands it to the
    // carver, choosing what to say; and he carves a dancer's hair with it.
    tale: {
      thing: true,
      ask: '돌에 새긴 여신은 몇이나 될까?',
      gate: { scene: 'causeway', open: 3, sora: '몰이꾼이 막고 있어. 못 가.' },
      steps: [
        {
          who: 'wife', goal: '해자 앞의 장인의 아내에게 가 보렴.', holds: '쇠 정: 아주머니가 들고 있음',
          lines: ['얘야, 부탁 하나 들어주련?', '우리 집 양반이 새 정을 두고 갔단다.', '회랑에서 돌 새기는 장인에게 전해 주렴.'],
          offer: { ask: '쇠 정을 전해 줄까?', label: '내가 전해 줄게요' },
          errand: 'took',
        },
        {
          who: 'mahout', goal: '둑길 끝의 서쪽 문으로 가 보렴.', holds: '쇠 정: 소라가 들고 있음',
          lines: ['멈춰라. 돌 끄는 코끼리가 지나간다.', '아이는 둑길로 못 간다.'],
          sora: '정을 전해야 하는데… 어? 누가 불러!',
        },
        {
          who: 'boatkid', call: '얘, 어디 가는데?', goal: '배 젓는 아이가 부른다. 가 보렴.', holds: '쇠 정: 소라가 들고 있음',
          lines: ['회랑에 간다고? 그럼 내 배를 타.', '연꽃 사이로 가면 코끼리를 안 만나.', '몰이꾼 아저씨, 배로 갈게요!'],
          after: [{ who: 'mahout', line: '배로 간다면 건너가거라.' }],
          sora: '배로 건너면 된대! 가자!',
        },
        {
          who: 'carver', goal: '회랑 앞의 돌 새기는 장인에게 쇠 정을 전하렴.', holds: '쇠 정: 소라가 들고 있음',
          lines: ['어이쿠, 무딘 정으로 애를 먹던 참이다.'],
          choice: {
            ask: '쇠 정을 건네며 뭐라고 할까?',
            options: [
              { id: 'E1', label: '"아주머니가 보냈어요"', sora: '해자 앞의 아주머니가 보내셨어요.', says: '집사람이 보냈구나. 고맙다, 얘야.' },
              { id: 'E2', label: '"뭘 새기세요?"', sora: '지금 무엇을 새기세요?', says: '춤추는 여신이란다. 보여 주마.' },
            ],
          },
          errand: 'gave',
        },
        {
          who: 'carver', show: true, goal: '장인이 새기는 것을 보렴.',
          lines: ['새 정이라 잘 먹는구나. 보렴.', '이 여신의 머리는 이렇게 올려 주마.'],
          sora: '돌에서 머리 모양이 나와!',
          errand: 'saw',
        },
      ],
      asides: [
        { who: 'wife', when: ['S1', 'S2', 'S3', 'S4'], lines: ['그 양반은 회랑 앞에 있단다.', '둑길을 건너 서쪽 문으로 가렴.'] },
        { who: 'wife', when: ['S5'], lines: ['전해 주었구나. 고맙다, 얘야.', '오늘은 일이 잘되겠구나.'] },
      ],
      done: '쇠 정을 전하고, 여신이 새겨지는 것을 보았다.',
    },
    errands: [
      { id: 'took', text: '쇠 정을 받는다.', at: [] },
      { id: 'gave', text: '장인에게 쇠 정을 전한다.', at: [] },
      { id: 'saw', text: '여신이 새겨지는 것을 본다.', at: [] },
    ],
    reply: '그 벽의 여신들은 머리 모양이 서른일곱 가지란다. 지금도 그대로 춤추고 있지.',
  },
  // Babylon about 575 BC, under Nebuchadnezzar II: the Ishtar Gate. Drawn as the glazed
  // bricks of the gate itself (the user, of five tries: "바빌론 1"). The day is not on record.
  // Not pale: the top of the pictures is deep blue brick.
  // Looked up (docs/신기한-사실.md) and found so: the gate is Nebuchadnezzar II's and its
  // glazed bricks are of about 575 BC; on blue, rows of dragons (mushhushshu) and bulls, the
  // beasts of Marduk and Adad; lions, the beast of Ishtar, in rows along the walls of the
  // Processional Way (their number is not said); the sky-watchers wrote the sky, the
  // weather, the prices and the height of the river on clay tablets day by day from about
  // 652 BC for six hundred years, and hundreds of the tablets are kept.
  // Weak, so said only as "잔칫날 행렬이 지나는 길": the new year procession along this way.
  // From memory: counting by sixties and the hour of sixty minutes, the wedge for one and
  // the corner wedge for ten, the stepped tower, barley bread, dates, sesame oil, the reed
  // pen, round reed boats tarred with bitumen, bricks set in bitumen, fringed robes, the
  // dragon's parts (snake, lion, eagle), the bright star of Ishtar at dusk, that tablets
  // were written while the clay was wet.
  // Made up: the tablet-baker's errand, the keeper of the way, the craftsman and the
  // workmen's path behind the wall, every other person.
  // Kept off the screen: the taking of Jerusalem and the captives.
  babylon575: {
    dir: 'babylon575', look: 'paper',
    drawn: '그 문의 푸른 유약 벽돌 그림처럼 그렸단다.',
    scenes: [
      {
        id: 'quay', name: '바빌론 유프라테스 강가 나루', short: '강가 나루', zoom: 1.13, ground: 0.72, scale: 0.661, air: 'market', floor: 'dirt',
        sora: '배가 바구니처럼 둥글어!',
        people: [
          { id: 'boatman', pass: '배 들어온다, 비켜라!', name: '둥근 배 사공', x: 0.19, w: 132, h: 320, lines: ['갈대로 엮은 둥근 배란다.', '보리를 싣고 강을 내려왔지.'] },
          { id: 'datewife', pass: '달콤한 대추야자요!', show: 'dates', name: '대추야자 장수', x: 0.3, w: 132, h: 278, lines: ['저 나무에서 딴 대추야자란다.', '보리빵이랑 먹어 보련?'],
            try: { id: 'eat-dates', verb: 'eat', name: '대추야자와 보리빵', face: 'yum', sora: '쫀득쫀득! 꿀처럼 달아.' } },
          { id: 'reedkid', pass: '갈대 펜 깎았다!', name: '갈대 베는 아이', x: 0.4, w: 117, h: 222, lines: ['갈대 끝을 깎으면 펜이 돼.', '젖은 흙에 꾹꾹 눌러 써.'] },
          { id: 'baker', pass: '어이쿠, 가마를 못 비우는데.', name: '점토판 굽는 이', x: 0.51, w: 109, h: 286, lines: ['글을 적은 흙 판을 굽는단다.', '구우면 돌처럼 단단해지지.'] },
          { id: 'counter', pass: '쉰아홉, 예순. 한 묶음!', show: 'sixty', pose: 'see-aha', sora: '예순이면 다시 하나래!', memo: '바빌론에서는 예순씩 묶어 세었단다. 한 시간이 예순 분인 것도 여기서 왔지.', name: '보리 세는 아저씨', x: 0.62, w: 135, h: 282, lines: ['우리는 예순씩 묶어 센단다.', '예순이 차면 쐐기 하나로 적지.'] },
          { id: 'clothier', pass: '술 달린 옷 보고 가요.', name: '옷 짓는 아주머니', x: 0.73, w: 125, h: 280, lines: ['단에 술을 촘촘히 단 옷이란다.', '아이 것도 있어. 입어 보련?'],
            try: { id: 'wear-babylon', verb: 'wear', name: '바빌론의 옷', outfit: 'babylon', sora: '걸으면 술이 찰랑거려!', memo: '긴 옷의 단과 숄에 술을 달아 입었단다.' } },
          { id: 'gauge', pass: '오늘은 한 뼘 올랐군.', name: '강물 재는 사람', x: 0.85, w: 107, h: 299, lines: ['날마다 강물 높이를 잰단다.', '재어서 별 보는 서기에게 알리지.'] },
        ],
        spots: [],
      },
      {
        id: 'way', name: '바빌론 행렬 길', short: '행렬 길', zoom: 1.15, ground: 0.705, scale: 0.673, air: 'masons',
        sora: '벽에 사자가 줄지어 걸어!',
        people: [
          { id: 'porter', pass: '영차, 벽돌 나간다!', name: '벽돌 나르는 일꾼', x: 0.18, w: 121, h: 266, lines: ['유약을 발라 구운 벽돌이란다.', '깨질라, 살살 날라야 하지.'] },
          { id: 'lionkid', pass: '하나, 둘, 셋… 또 있네!', show: 'lions', pose: 'see-wow', sora: '사자가 끝도 없어!', memo: '행렬 길의 두 벽에 사자가 줄지어 있단다. 사자는 이슈타르 여신의 짐승이지.', name: '사자 세는 아이', x: 0.29, w: 104, h: 197, lines: ['사자를 세는 중이야.', '세다가 자꾸 잊어버려.'] },
          { id: 'mixer', pass: '푸른빛이 잘 나와야 할 텐데.', name: '유약 개는 사람', x: 0.4, w: 107, h: 269, lines: ['벽돌에 바를 푸른 유약이란다.', '불에 구우면 반들반들 빛나지.'] },
          { id: 'glazier', pass: '이 장은 사자 꼬리 자리.', name: '벽돌 붙이는 장인', x: 0.51, w: 107, h: 271, lines: ['벽돌마다 제자리가 있단다.', '다 맞추면 사자 한 마리가 되지.'] },
          { id: 'palmgirl', pass: '행렬은 언제 오려나.', name: '종려 가지 든 소녀', x: 0.62, w: 112, h: 288, lines: ['오늘은 잔칫날이야.', '행렬이 오면 가지를 흔들 거야.'] },
          { id: 'drummer', pass: '둥, 둥, 두둥!', name: '북 치는 악사', x: 0.73, w: 119, h: 267, lines: ['잔칫날 행렬이 지나는 길이란다.', '북소리가 들리면 곧 온다는 거지.'] },
          { id: 'keeper', pass: '길을 비켜라, 길을!', name: '행렬 길 문지기', x: 0.85, w: 111, h: 320, lines: ['잔칫날 행렬이 지나는 길이란다.', '지나갈 때까지 길을 비워야 하지.'] },
        ],
        spots: [],
      },
      {
        id: 'gate', name: '바빌론 이슈타르 문 앞', short: '문 앞', zoom: 1.15, ground: 0.705, scale: 0.673, air: 'court',
        sora: '문이 온통 파래! 용도 있어.',
        people: [
          { id: 'guard', pass: '줄지어 들어가시오.', name: '문 앞의 병사', x: 0.18, w: 118, h: 320, lines: ['이 문은 이슈타르 여신의 문이란다.', '임금님이 새로 지으셨지.'] },
          { id: 'priest', pass: '용과 들소가 문을 지키지.', show: 'beasts', pose: 'see-wow', sora: '용 발이 앞뒤가 달라!', memo: '문에는 용과 들소가 줄지어 있단다. 용은 마르두크 신, 들소는 아다드 신의 짐승이지.', name: '사제', x: 0.29, w: 118, h: 311, lines: ['저 용은 마르두크 신의 짐승이란다.', '들소는 비를 내리는 신의 짐승이지.'] },
          { id: 'merchant', pass: '허어, 이런 문은 처음이오.', name: '먼 나라 장사꾼', x: 0.4, w: 117, h: 306, lines: ['먼 서쪽 바닷가에서 왔다오.', '문이 하늘빛이라 눈이 부시오.'] },
          { id: 'oilwoman', pass: '고소한 참깨 기름이오!', name: '참깨 기름 장수', x: 0.51, w: 110, h: 270, lines: ['참깨를 짜서 낸 기름이란다.', '등잔에도 넣고 빵에도 바르지.'] },
          { id: 'scribe', pass: '어젯밤 판이 올 때가 됐는데.', show: 'stars', pose: 'see-aha', sora: '별을 흙에 적어 둬!', memo: '바빌론의 별 보는 이들은 날마다 하늘을 점토판에 적었단다. 육백 해를 이어 적었지.', name: '별 보는 서기', x: 0.62, w: 116, h: 308, lines: ['나는 밤마다 하늘을 본단다.', '본 것을 날마다 흙 판에 적지.'] },
          { id: 'pupil', pass: '꾹, 꾹… 또 틀렸다.', name: '서기를 배우는 아이', x: 0.73, w: 86, h: 214, lines: ['쐐기 글자를 배우는 중이야.', '틀리면 흙을 뭉쳐서 다시 써.'] },
          { id: 'lamp', pass: '해 지기 전에 불을 켜야지.', name: '등잔 켜는 사람', x: 0.85, w: 104, h: 271, lines: ['해가 지면 문 앞에 불을 켠단다.', '서기 어른은 그때 별을 보러 오르지.'] },
        ],
        spots: [],
      },
    ],
    // "The tablet of last night's sky" (core/tale.js): the tablet-baker by the river has the
    // tablet on which the scribe wrote last night's sky, now baked hard; the keeper of the
    // Processional Way lets no one cross till the feast-day procession has passed; the
    // craftsman setting glazed bricks shows the workmen's path behind the wall; she hands
    // the tablet to the scribe, choosing what to say; and at dusk he looks at the stars and
    // writes a new one.
    tale: {
      thing: true,
      ask: '어젯밤 하늘을 어떻게 적어 둘까?',
      gate: { scene: 'way', open: 3, sora: '문지기가 막고 있어. 못 가.' },
      steps: [
        {
          who: 'baker', goal: '강가 나루의 점토판 굽는 이에게 가 보렴.', holds: '점토판: 굽는 이가 들고 있음',
          lines: ['얘야, 부탁 하나 들어주련?', '어젯밤 하늘을 적은 점토판이란다.', '이슈타르 문 앞의 별 보는 서기에게 전해 주렴.'],
          offer: { ask: '점토판을 전해 줄까?', label: '내가 전해 줄게요' },
          errand: 'took',
        },
        {
          who: 'keeper', goal: '행렬 길 끝의 이슈타르 문으로 가 보렴.', holds: '점토판: 소라가 들고 있음',
          lines: ['멈춰라. 잔칫날 행렬이 지나는 길이다.', '다 지나갈 때까지는 못 건넌다.'],
          sora: '점토판을 전해야 하는데… 어? 누가 불러!',
        },
        {
          who: 'glazier', call: '얘, 어디 가는데?', goal: '벽돌 붙이는 장인이 부른다. 가 보렴.', holds: '점토판: 소라가 들고 있음',
          lines: ['문 앞에 간다고? 그럼 이리 오렴.', '벽 뒤에 일꾼들이 다니는 길이 있단다.', '문지기 양반, 일꾼 길로 보낼게요!'],
          after: [{ who: 'keeper', line: '일꾼 길이라면 가도 좋다.' }],
          sora: '벽 뒤로 가면 된대! 가자!',
        },
        {
          who: 'scribe', goal: '문 앞의 별 보는 서기에게 점토판을 전하렴.', holds: '점토판: 소라가 들고 있음',
          lines: ['오, 어젯밤에 적은 판이 다 구워졌구나.'],
          choice: {
            ask: '점토판을 건네며 뭐라고 할까?',
            options: [
              { id: 'E1', label: '"굽는 아저씨가 보냈어요"', sora: '강가의 굽는 아저씨가 보내셨어요.', says: '단단히도 구웠구나. 고맙다, 얘야.' },
              { id: 'E2', label: '"뭘 적으셨어요?"', sora: '여기에 무엇을 적으셨어요?', says: '달과 별이 어디 있었는지 적었단다.' },
            ],
          },
          errand: 'gave',
        },
        {
          who: 'scribe', show: true, goal: '해가 진다. 서기가 별을 적는 것을 보렴.',
          lines: ['해가 졌구나. 저기 첫 별이 떴다.', '오늘 밤 하늘도 새 판에 적어 두마.'],
          sora: '젖은 흙에 별을 적어!',
          errand: 'saw',
        },
      ],
      asides: [
        { who: 'baker', when: ['S1', 'S2', 'S3', 'S4'], lines: ['서기 어른은 이슈타르 문 앞에 있단다.', '행렬 길을 따라 끝까지 가렴.'] },
        { who: 'baker', when: ['S5'], lines: ['전해 주었구나. 고맙다, 얘야.', '오늘 밤 판도 내가 구워야겠구나.'] },
      ],
      done: '점토판을 전하고, 서기가 별을 적는 것을 보았다.',
    },
    errands: [
      { id: 'took', text: '점토판을 받는다.', at: [] },
      { id: 'gave', text: '서기에게 점토판을 전한다.', at: [] },
      { id: 'saw', text: '서기가 별을 적는 것을 본다.', at: [] },
    ],
    reply: '그 점토판이 수백 장 남아 있단다. 그 옛날의 밤하늘을 지금도 읽을 수 있지.',
  },
  // Samarkand about 1428: Ulugh Beg at his observatory. Drawn as the tile mosaic of the
  // city's own buildings (the user, 2026.10.13, of five tries: the second). The day is not
  // on record: about the summer solstice, near noon.
  // Looked up on 2026.10.13 and found so: Ulugh Beg founded the observatory in 1420 on a
  // rocky hill outside Samarkand (one source has it finished in 1429); a round building
  // some 46 m across, of three floors and some 30 m high, dressed with glazed tiles and
  // marble; along its north-south line a great graduated arc of 40 m radius, 70 cm of it to
  // one degree, of which only the part under the ground is left; a list of 1018 stars (992
  // in another reading: "천 개쯤" here), which Ali Qushji saw finished.
  // From memory: Ulugh Beg was Timur's grandson, a king who taught at his own school, and
  // measured the length of the year closely; the school on the Registan with stars over
  // its door; the paper of Samarkand, rubbed smooth with a stone, and its melons and flat
  // bread; silk come from China; the brass astrolabe and how it is held; that the sunlight
  // came in by an opening at the top of the arc; that Qushji means the keeper of falcons
  // and that he was a young man in 1428; how tiles are glazed and fired; the striped silk
  // coat; that there were no telescopes yet.
  // Made up: the papermaker's errand of the bundle of paper, the gatekeeper, the mason and
  // the workers' stair, and everyone else who stands about.
  samarkand1428: {
    dir: 'samarkand1428', look: 'paper',
    drawn: '그 도시 건물의 푸른 타일 조각처럼 그렸단다.',
    scenes: [
      {
        id: 'registan', name: '사마르칸트 레기스탄의 학교 앞', short: '학교 앞', zoom: 1.085, ground: 0.755, scale: 0.635, air: 'market',
        sora: '문이 온통 파란 타일이야!',
        people: [
          { id: 'melon', pass: '꿀보다 단 멜론이오!', show: 'melon', name: '멜론 장수', x: 0.18, w: 149, h: 306, lines: ['사마르칸트 멜론은 꿀처럼 달단다.', '갓 구운 빵이랑 먹어 보련?'],
            try: { id: 'eat-melon', verb: 'eat', name: '멜론과 빵', face: 'yum', sora: '달콤해! 빵도 따끈따끈해.' } },
          { id: 'student', pass: '오늘 밤엔 별을 봐야지.', name: '학교의 학생', x: 0.29, w: 106, h: 302, lines: ['이 학교에서 별과 셈을 배워.', '임금님이 직접 가르치실 때도 있어.'] },
          { id: 'tiler', pass: '불이 세야 빛이 곱지.', show: 'tile', pose: 'see-wow', sora: '불에서 파란색이 나와!', memo: '흙 판에 유리 물을 발라 구우면 푸른 빛이 난단다. 천문대도 이 타일로 꾸몄지.', name: '타일 굽는 장인', x: 0.4, w: 118, h: 310, lines: ['흙 판에 유리 물을 발라 굽는단다.', '구우면 이렇게 파랗게 빛나지.'] },
          { id: 'teacher', pass: '배움에는 끝이 없지.', name: '학교의 선생님', x: 0.51, w: 124, h: 320, lines: ['문 위의 별 무늬를 보렴.', '별을 배우는 학교라서 그렇단다.'] },
          { id: 'silk', pass: '고운 비단 보고 가요.', name: '비단 장수', x: 0.62, w: 134, h: 295, lines: ['줄무늬 비단으로 지은 겉옷이란다.', '아이 것도 있어. 입어 보련?'],
            try: { id: 'wear-ikat', verb: 'wear', name: '줄무늬 비단 옷', outfit: 'ikat', sora: '반들반들해! 줄무늬가 예뻐.', memo: '긴 겉옷을 앞에서 여며 띠로 묶어 입는단다. 비단이라 가볍고 시원하지.' } },
          { id: 'paper', pass: '아이고, 가게를 못 비우는데.', name: '종이 장인', x: 0.73, w: 104, h: 303, lines: ['사마르칸트 종이는 먼 나라까지 간단다.', '돌로 문질러 매끈하게 윤을 내지.'] },
          { id: 'merchant', pass: '휴, 먼 길이었어.', name: '낙타 타고 온 상인', x: 0.85, w: 149, h: 319, lines: ['먼 동쪽에서 비단을 싣고 왔단다.', '이 도시엔 온 세상 물건이 모이지.'] },
        ],
        spots: [],
      },
      {
        id: 'hill', name: '사마르칸트 천문대 언덕길의 시장', short: '언덕길', zoom: 1.085, ground: 0.755, scale: 0.635, air: 'street',
        sora: '언덕 위에 둥근 집이 있어!',
        people: [
          { id: 'apricot', pass: '살구요, 잘 익은 살구!', name: '살구 장수', x: 0.18, w: 110, h: 280, lines: ['언덕 오르기 전에 살구 하나 먹으렴.', '천문대 사람들도 사 간단다.'] },
          { id: 'brass', pass: '눈금 하나라도 틀리면 안 돼.', show: 'astrolabe', pose: 'see-aha', sora: '판에 별 지도가 있어!', memo: '별이 얼마나 높이 떴는지 재는 놋쇠 판이란다. 손에 들고 별을 겨누지.', name: '놋쇠 장인', x: 0.29, w: 131, h: 269, lines: ['별을 재는 놋쇠 판이란다.', '들고 별을 겨누면 높이를 알지.'] },
          { id: 'waterboy', pass: '시원한 물이요!', name: '물 나르는 아이', x: 0.4, w: 94, h: 210, lines: ['언덕 위까지 물을 날라.', '천문대 아저씨들은 밤에도 일해.'] },
          { id: 'bricklayer', pass: '영차, 벽돌 올라간다.', name: '벽돌 나르는 일꾼', x: 0.51, w: 106, h: 270, lines: ['천문대는 둥근 삼 층 집이란다.', '겉은 푸른 타일과 흰 돌로 꾸몄지.'] },
          { id: 'shepherd', pass: '오늘 밤도 맑겠구먼.', name: '양치기 할아버지', x: 0.62, w: 117, h: 258, lines: ['밤이면 이 언덕에 별이 쏟아진단다.', '그래서 여기에 천문대를 지었지.'] },
          { id: 'mason', pass: '쓱쓱, 눈금이 잘 보여야지.', name: '눈금 돌 닦는 석공', x: 0.73, w: 118, h: 269, lines: ['큰 눈금 길에 놓는 흰 돌이란다.', '먼지 하나 없이 닦아야 하지.'] },
          { id: 'gatekeeper', pass: '조용, 조용히 하시오.', name: '천문대 문지기', x: 0.85, w: 111, h: 320, lines: ['이 문 안이 임금님의 천문대란다.', '잴 때는 발소리도 내면 안 되지.'] },
        ],
        spots: [],
      },
      {
        id: 'observatory', name: '사마르칸트 천문대 안 눈금 길 앞', short: '눈금 길 앞', zoom: 1.085, ground: 0.755, scale: 0.635, air: 'hush',
        sora: '눈금 길이 땅속으로 내려가!',
        people: [
          { id: 'scribe', pass: '이 별은 여기, 저 별은 저기.', show: 'catalog', pose: 'see-wow', sora: '별마다 자리가 적혀 있어!', memo: '별 천 개쯤의 자리를 하나하나 재어 적었단다. 알리 쿠시지가 그 일을 마무리했지.', name: '별 적는 서기', x: 0.18, w: 109, h: 299, lines: ['잰 별의 자리를 책에 적는단다.', '별 천 개쯤을 다 적을 거야.'] },
          { id: 'counter', pass: '더하고, 또 더하고.', name: '셈하는 학자', x: 0.29, w: 108, h: 294, lines: ['잰 것을 셈해야 쓸모가 있단다.', '한 해가 며칠인지도 꼼꼼히 쟀지.'] },
          { id: 'ulughbeg', pass: '오늘은 해가 가장 높구나.', name: '울루그 베그', x: 0.4, w: 123, h: 312, lines: ['나는 임금이지만 별이 더 좋단다.', '학교에서 아이들도 가르치지.'] },
          { id: 'oldmaster', pass: '허허, 잘들 하는구나.', name: '늙은 스승', x: 0.51, w: 110, h: 294, lines: ['임금님도 어릴 적엔 내 제자였단다.', '이제는 나보다 별을 잘 아시지.'] },
          { id: 'aliqushji', pass: '종이가 모자라겠는걸.', show: 'light', pose: 'see-wow', sora: '빛이 눈금 위에 앉았어!', memo: '땅속까지 휘어 내려간 큰 눈금 길이란다. 눈금 한 칸이 어른 팔 길이쯤이었지.', name: '알리 쿠시지', x: 0.62, w: 122, h: 295, lines: ['나는 임금님께 별 재는 법을 배운단다.', '내 이름은 매 기르는 사람이란 뜻이지.'] },
          { id: 'errandboy', pass: '먹물 쏟으면 안 돼.', name: '심부름하는 아이', x: 0.73, w: 88, h: 214, lines: ['나는 먹물이랑 붓을 날라.', '크면 나도 별을 잴 거야.'] },
          { id: 'visitor', pass: '허어, 놀랍구려.', name: '먼 나라에서 온 학자', x: 0.85, w: 113, h: 320, lines: ['이 눈금을 보려고 먼 길을 왔다오.', '이렇게 큰 눈금은 처음 보오.'] },
        ],
        spots: [],
      },
    ],
    // "The bundle of paper" (core/tale.js; the storyboard of docs/신기한-사실.md): the
    // papermaker has new paper for tonight's stars and cannot leave his stall; the
    // gatekeeper keeps her out while the king measures; the mason who polishes the scale
    // stones takes her down the workers' stair; she hands it to Ali Qushji, choosing what
    // to say; and he shows her the spot of sunlight on the great scale.
    tale: {
      thing: true,
      ask: '망원경도 없이 하늘을 어떻게 쟀을까?',
      gate: { scene: 'hill', open: 3, sora: '문지기가 막고 있어. 못 가.' },
      steps: [
        {
          who: 'paper', goal: '학교 앞의 종이 장인에게 가 보렴.', holds: '종이 묶음: 장인이 들고 있음',
          lines: ['얘야, 부탁 하나 들어주련?', '오늘 밤 별을 적을 새 종이란다.', '천문대의 알리 쿠시지에게 전해 주렴.'],
          offer: { ask: '종이 묶음을 전해 줄까?', label: '내가 전해 줄게요' },
          errand: 'took',
        },
        {
          who: 'gatekeeper', goal: '언덕길 끝의 천문대 문으로 가 보렴.', holds: '종이 묶음: 소라가 들고 있음',
          lines: ['멈춰라. 임금님이 해를 재시는 중이다.', '지금은 아무도 못 들어간다.'],
          sora: '종이를 전해야 하는데… 어? 누가 불러!',
        },
        {
          who: 'mason', call: '얘, 그 종이 어디 가니?', goal: '눈금 돌 닦는 석공이 부른다. 가 보렴.', holds: '종이 묶음: 소라가 들고 있음',
          lines: ['알리 쿠시지에게? 그럼 날 따라오렴.', '눈금 길 아래로 가는 일꾼 계단이 있단다.', '문지기 양반, 내 일손이오!'],
          after: [{ who: 'gatekeeper', line: '일꾼 계단으로 조용히 가거라.' }],
          sora: '일꾼 계단으로 가면 된대! 가자!',
        },
        {
          who: 'aliqushji', goal: '천문대 안의 알리 쿠시지에게 종이 묶음을 전하렴.', holds: '종이 묶음: 소라가 들고 있음',
          lines: ['오, 종이가 다 떨어진 참이었단다.'],
          choice: {
            ask: '종이 묶음을 건네며 뭐라고 할까?',
            options: [
              { id: 'E1', label: '"종이 장인이 보냈어요"', sora: '학교 앞의 종이 장인이 보내셨어요.', says: '그분 종이가 으뜸이지. 고맙다, 얘야.' },
              { id: 'E2', label: '"뭘 재세요?"', sora: '지금 무엇을 재세요?', says: '해가 얼마나 높이 떴는지 잰단다. 보여 주마.' },
            ],
          },
          errand: 'gave',
        },
        {
          who: 'aliqushji', show: true, goal: '눈금 위의 햇빛을 보렴.',
          lines: ['저 위 구멍으로 햇빛이 든단다. 보렴.', '빛이 닿은 눈금이 오늘 해의 높이지.'],
          sora: '빛 한 점이 눈금 위를 지나가!',
          errand: 'saw',
        },
      ],
      asides: [
        { who: 'paper', when: ['S1', 'S2', 'S3', 'S4'], lines: ['알리 쿠시지는 천문대 안에 있단다.', '언덕길을 올라 문으로 가렴.'] },
        { who: 'paper', when: ['S5'], lines: ['전해 주었구나. 고맙다, 얘야.', '오늘 밤 별도 잘 적히겠구나.'] },
      ],
      done: '종이 묶음을 전하고, 눈금 위의 햇빛을 보았다.',
    },
    errands: [
      { id: 'took', text: '종이 묶음을 받는다.', at: [] },
      { id: 'gave', text: '알리 쿠시지에게 종이 묶음을 전한다.', at: [] },
      { id: 'saw', text: '눈금 위를 지나는 햇빛을 본다.', at: [] },
    ],
    reply: '망원경도 없던 때에 별 천 개쯤을 적었단다. 땅속의 눈금 길은 지금도 남아 있지.',
  },
  // Chichen Itza about 1000, the afternoon of the spring equinox. Drawn as the wall paintings
  // of the Maya temple of Bonampak (the user, 2026.10.13, of five tries: style 2, "신전
  // 벽화"). The try itself is the third scene. The year is not on record.
  // Looked up on 2026.10.13 and found so: about the equinoxes, of an afternoon, seven
  // triangles of light run down the balustrade of the north stair of the great pyramid and
  // meet the stone serpent head at its foot, for some twenty minutes, and on the days about
  // it (whether it was built to do so is disputed: it is only said to be seen); the round
  // tower El Caracol, its windows toward where Venus sets farthest north and south; Venus
  // comes back five times in eight years; the pyramid stands over an older one.
  // Widely told, one source only: 91 steps on each of four sides and the top makes 365.
  // From memory: cacao beans as money and the frothed drink of cacao with chilli; maize
  // ground on a stone; the numbers of dots, bars and a shell for nought; the ball court,
  // its stone ring high on the wall and the rubber ball struck with the hip; the huipil;
  // honey of stingless bees in hollow logs; the white raised road; copal incense; the
  // turtle-shell drum and the conch trumpet; the winding stair inside the Caracol; lime
  // plaster; maize sown in spring with a planting stick; green feathers brought from far.
  // Made up: the knotted cord that tells the day, the day-counter's errand, the drummer who
  // bars the way, the ball player who shows the way round.
  // Left out on purpose: human sacrifice, and what was thrown into the well.
  chichen1000: {
    dir: 'chichen1000', look: 'paper', pale: true,
    drawn: '마야 신전의 벽에 그린 그림처럼 그렸단다.',
    scenes: [
      {
        id: 'market', name: '마야 치첸이트사 광장 어귀의 시장', short: '시장', zoom: 1.13, ground: 0.72, scale: 0.661, air: 'market',
        sora: '저 멀리 피라미드가 보여!',
        people: [
          { id: 'maize', pass: '옥수수 빵 굽는다!', name: '옥수수 가는 아주머니', x: 0.19, w: 120, h: 308, lines: ['옥수수를 돌판에 갈아 반죽한단다.', '납작하게 구우면 빵이 되지.'] },
          { id: 'merchant', pass: '점 하나, 점 둘, 막대 하나.', show: 'numbers', pose: 'see-aha', sora: '점이랑 막대로 세네!', memo: '마야 사람들은 점과 막대로 수를 적었단다. 점은 하나, 막대는 다섯, 조개는 영이지.', name: '셈하는 상인', x: 0.3, w: 129, h: 320, lines: ['여기서는 카카오 콩이 돈이란다.', '점은 하나, 막대는 다섯으로 세지.'] },
          { id: 'counter', pass: '아이고, 숨이 차구나.', name: '날 세는 사람', x: 0.4, w: 136, h: 313, lines: ['나는 달팽이 집에서 날을 센단다.', '매듭 하나가 하루지.'] },
          { id: 'child', pass: '오늘 뱀이 내려온대!', name: '구경 나온 아이', x: 0.51, w: 98, h: 214, lines: ['오늘은 다들 광장에 모여.', '해가 기울면 뭐가 보인대!'] },
          { id: 'weaver', pass: '고운 옷 보고 가요.', name: '천 짜는 아주머니', x: 0.62, w: 127, h: 309, lines: ['무명으로 짠 겉옷이란다.', '아이 것도 있어. 입어 보련?'],
            try: { id: 'wear-huipil', verb: 'wear', name: '마야의 옷', outfit: 'huipil', sora: '헐렁해서 시원해!', memo: '네모난 무명 천에 수를 놓은 겉옷이란다. 우이필이라고 하지.' } },
          { id: 'honey', pass: '달콤한 꿀이오!', name: '꿀 장수', x: 0.73, w: 135, h: 313, lines: ['통나무 속에서 벌을 친단다.', '침이 없는 작은 벌이지.'] },
          { id: 'cacao', pass: '거품 난 카카오요!', show: 'cacao', name: '카카오 장수', x: 0.85, w: 122, h: 305, lines: ['카카오 콩을 갈아 탄 물이란다.', '고추를 넣었지. 마셔 보련?'],
            try: { id: 'eat-cacao', verb: 'eat', name: '고추 넣은 카카오', face: 'yum', sora: '쌉쌀하고 매콤해! 그래도 맛있어.' } },
        ],
        spots: [],
      },
      {
        id: 'caracol', name: '마야 치첸이트사 달팽이 집 앞', short: '달팽이 집 앞', zoom: 1.13, ground: 0.72, scale: 0.661, air: 'court',
        sora: '탑이 동그래!',
        people: [
          { id: 'stargazer', pass: '오늘 저녁엔 샛별이 뜨려나.', show: 'venus', pose: 'see-aha', sora: '창으로 별이 딱 보여!', memo: '달팽이 집의 창은 샛별(금성)이 지는 자리를 본단다. 샛별은 여덟 해에 다섯 번 돌아오지.', name: '별 보는 사람', x: 0.18, w: 132, h: 317, lines: ['저 둥근 탑에서 별을 본단다.', '좁은 창으로 샛별이 지는 걸 보지.'] },
          { id: 'plasterer', pass: '쓱쓱, 하얗게 바른다.', name: '회 바르는 일꾼', x: 0.29, w: 120, h: 299, lines: ['돌 위에 흰 회를 바른단다.', '안의 계단은 달팽이처럼 돌지.'] },
          { id: 'incense', pass: '향이 곱게 오르네.', name: '향 피우는 아주머니', x: 0.4, w: 105, h: 282, lines: ['나무 진으로 만든 향이란다.', '오늘 같은 날엔 꼭 피우지.'] },
          { id: 'player', pass: '공은 엉덩이로 받는 거야!', name: '공놀이 선수', x: 0.51, w: 143, h: 307, lines: ['고무공을 엉덩이로 쳐 올린단다.', '저 높은 돌 고리에 넣으면 이기지.'] },
          { id: 'feather', pass: '깃털 하나도 귀하지.', name: '깃털 장식 만드는 사람', x: 0.62, w: 132, h: 280, lines: ['먼 숲의 새 깃털이란다.', '제사장의 머리 장식을 만들지.'] },
          { id: 'piper', pass: '삐리리, 삐리.', name: '피리 부는 아이', x: 0.73, w: 90, h: 208, lines: ['흙으로 빚은 피리야.', '북이 울리면 나도 같이 불 거야.'] },
          { id: 'drummer', pass: '다 모이면 북을 친다.', name: '북 치는 사람', x: 0.85, w: 140, h: 320, lines: ['사람들이 다 모이면 북을 친단다.', '그때까지 계단 앞은 비워 두지.'] },
        ],
        spots: [],
      },
      {
        id: 'pyramid', name: '마야 치첸이트사 큰 피라미드 발치', short: '피라미드 발치', zoom: 1.13, ground: 0.72, scale: 0.661, air: 'hush',
        sora: '계단이 하늘까지 가!',
        people: [
          { id: 'sweeper', pass: '한 칸, 두 칸, 끝이 없네.', show: 'steps', pose: 'see-wow', sora: '한 해의 날 수랑 똑같아!', memo: '계단이 네 쪽에 아흔한 칸씩이란다. 꼭대기 단까지 더하면 삼백예순다섯, 한 해의 날 수와 같지.', name: '계단 쓰는 사람', x: 0.18, w: 120, h: 274, lines: ['이 계단을 날마다 쓴단다.', '네 쪽을 다 세면 한 해의 날 수지.'] },
          { id: 'flower', pass: '꽃을 올려야지.', name: '꽃 든 아주머니', x: 0.29, w: 103, h: 251, lines: ['오늘은 낮과 밤의 길이가 같단다.', '그래서 다들 꽃을 들고 왔지.'] },
          { id: 'farmer', pass: '이제 씨를 심어야지.', name: '농부 할아버지', x: 0.4, w: 94, h: 269, lines: ['이 무렵이면 옥수수 심을 채비를 한단다.', '막대로 구멍을 내고 씨를 넣지.'] },
          { id: 'priest', pass: '해가 기울기를 기다린다.', show: 'serpent', pose: 'see-wow', sora: '빛이 뱀처럼 내려와!', memo: '봄날 오후에 계단 옆으로 세모꼴 빛 일곱이 줄지어 내려온단다. 아래의 돌 뱀 머리와 이어져 뱀처럼 보이지.', name: '제사장', x: 0.51, w: 131, h: 320, lines: ['이 피라미드는 옛 신전 위에 덧지었단다.', '깃털 달린 뱀의 신전이라고 하지.'] },
          { id: 'conch', pass: '뿌우, 뿌우.', name: '조개 나팔 부는 사람', x: 0.62, w: 135, h: 271, lines: ['큰 소라 껍데기로 만든 나팔이란다.', '멀리 숲 너머까지 들리지.'] },
          { id: 'tiptoe', pass: '어디, 어디? 안 보여!', name: '까치발 선 아이', x: 0.73, w: 92, h: 159, lines: ['계단 아래에 돌 뱀 머리가 있어.', '입을 쩍 벌리고 있어. 봤어?'] },
          { id: 'trader', pass: '허어, 높기도 하다.', name: '먼 데서 온 상인', x: 0.85, w: 118, h: 256, lines: ['여러 날을 걸어서 왔단다.', '이 날을 보려고 맞춰 왔지.'] },
        ],
        spots: [],
      },
    ],
    // "The knotted cord" (core/tale.js; the storyboard of docs/신기한-사실.md): the day-counter,
    // come down to the market out of breath, has the knotted cord that says today is the
    // day; the drummer keeps everyone from the stair until all have gathered; the ball
    // player shows the way round by the ball court; the cord is handed to the priest,
    // choosing what to say; and as the sun sinks the serpent of light is seen on the stair.
    tale: {
      thing: true,
      ask: '오늘 계단에 무엇이 보일까?',
      gate: { scene: 'caracol', open: 3, sora: '북 치는 아저씨가 막고 있어. 못 가.' },
      steps: [
        {
          who: 'counter', goal: '시장의 날 세는 사람에게 가 보렴.', holds: '매듭 끈: 할아버지가 들고 있음',
          lines: ['얘야, 부탁 하나 들어주련?', '오늘이 그날이라고 알리는 매듭 끈이란다.', '나는 숨이 차구나. 제사장께 전해 주렴.'],
          offer: { ask: '매듭 끈을 전해 줄까?', label: '내가 전해 줄게요' },
          errand: 'took',
        },
        {
          who: 'drummer', goal: '달팽이 집 앞을 지나 피라미드로 가 보렴.', holds: '매듭 끈: 소라가 들고 있음',
          lines: ['멈춰라. 아직 북을 치지 않았다.', '다 모일 때까지 계단 앞엔 못 간다.'],
          sora: '끈을 전해야 하는데… 어? 누가 불러!',
        },
        {
          who: 'player', call: '얘, 어디 가는데?', goal: '공놀이 선수가 부른다. 가 보렴.', holds: '매듭 끈: 소라가 들고 있음',
          lines: ['제사장께 간다고? 그럼 나를 따라와.', '공놀이 마당 옆으로 돌아가면 돼.', '북 아저씨, 이 아이는 돌아서 갈게요!'],
          after: [{ who: 'drummer', line: '돌아서 간다면 가 보거라.' }],
          sora: '돌아서 가면 된대! 가자!',
        },
        {
          who: 'priest', goal: '피라미드 발치의 제사장에게 매듭 끈을 전하렴.', holds: '매듭 끈: 소라가 들고 있음',
          lines: ['오, 그 끈을 기다리던 참이란다.'],
          choice: {
            ask: '매듭 끈을 건네며 뭐라고 할까?',
            options: [
              { id: 'E1', label: '"할아버지가 보냈어요"', sora: '날 세는 할아버지가 보내셨어요.', says: '날 세는 이가 보냈구나. 고맙다, 얘야.' },
              { id: 'E2', label: '"오늘이 무슨 날이에요?"', sora: '오늘이 무슨 날이에요?', says: '낮과 밤의 길이가 같은 날이란다. 보여 주마.' },
            ],
          },
          errand: 'gave',
        },
        {
          who: 'priest', show: true, goal: '제사장과 함께 계단을 보렴.',
          lines: ['매듭을 세어 보니 오늘이 맞구나.', '해가 기운다. 계단 옆을 보렴.'],
          sora: '빛이 뱀처럼 내려와!',
          errand: 'saw',
        },
      ],
      asides: [
        { who: 'counter', when: ['S1', 'S2', 'S3', 'S4'], lines: ['제사장은 큰 피라미드 발치에 계신단다.', '달팽이 집 앞을 지나서 가렴.'] },
        { who: 'counter', when: ['S5'], lines: ['전해 주었구나. 고맙다, 얘야.', '올해도 날을 바로 세었구나.'] },
      ],
      done: '매듭 끈을 전하고, 계단에 내려온 빛의 뱀을 보았다.',
    },
    errands: [
      { id: 'took', text: '매듭 끈을 받는다.', at: [] },
      { id: 'gave', text: '제사장에게 매듭 끈을 전한다.', at: [] },
      { id: 'saw', text: '계단에 내려온 빛의 뱀을 본다.', at: [] },
    ],
    reply: '그 빛의 뱀은 지금도 봄과 가을에 보인단다. 이십 분쯤 머물다 사라지지.',
  },
  // Seorabeol (Gyeongju) about 640, in the reign of Queen Seondeok: Cheomseongdae stands.
  // Drawn as the heavenly horse on the birch-bark saddle flap of Cheonmachong (the user's
  // choice of five tries: the second). The day is not on record. The pictures are in
  // seorabeol640; the try itself is not a scene (it shows the pagoda of Hwangnyongsa, which
  // did not stand until 645), so all three scenes were ordered anew and have no pagoda.
  // Looked up on 2026.10.13 and found so: built in the reign of Queen Seondeok (632 to 647),
  // the year given as 633 or as 647; 362 stones by the commonest count (356 and 365 are also
  // given: "삼백예순 개쯤"), 27 courses, 12 above and 12 below the square window, a little
  // over 9 m high; the pagoda of Hwangnyongsa begun in 643 and standing in 645.
  // From memory: that a ladder was leaned to the window and the way up went on inside; that
  // the window looks south (the square's card says so); the crossed long stones at the top;
  // the gold crown with spangles and curved jade; stemmed dishes; small clay figures;
  // wooden writing slips; the hwarang; the court astronomer called ilgwan; that the saddle
  // flap kept mud off the rider; the mounds of stones under earth; that Hwangnyongsa was the
  // greatest temple of the city; that Seondeok was the first queen of Silla; rice cake and
  // honey; the dress of Silla; that farmers sowed by the stars.
  // Made up: the errand of the gold plumb weight, the queen's coming that evening, the
  // carpenter with the ladder, every other person.
  cheomseongdae: {
    dir: 'seorabeol640', look: 'paper',
    drawn: '신라 무덤에서 나온 흰 말 그림처럼 그렸단다.',
    scenes: [
      {
        id: 'market', name: '신라 서라벌 저잣거리', short: '저잣거리', zoom: 1.13, ground: 0.725, scale: 0.661, air: 'market', floor: 'dirt',
        sora: '하늘도 땅도 나무껍질 빛이야!',
        people: [
          { id: 'potter', pass: '갓 구운 그릇이오!', name: '토기장이', x: 0.18, w: 125, h: 317, lines: ['가마에서 막 꺼낸 그릇이란다.', '굽이 높아서 상 없이도 쓰지.'] },
          { id: 'tteok', pass: '떡이오, 따끈한 떡!', show: 'tteok', name: '떡 파는 아주머니', x: 0.29, w: 130, h: 289, lines: ['시루에 갓 쪄 낸 떡이란다.', '꿀에 찍어 한 입 먹어 보련?'],
            try: { id: 'eat-tteok', verb: 'eat', name: '떡과 꿀', face: 'yum', sora: '쫄깃해! 꿀이 달아.' } },
          { id: 'toykid', pass: '내 말이 제일 빨라!', name: '흙 인형 든 아이', x: 0.4, w: 108, h: 232, lines: ['흙으로 빚은 말이야.', '아저씨가 가마에 같이 구워 줬어.'] },
          { id: 'goldsmith', pass: '톡톡, 살살 두드려야지.', name: '금 두드리는 장인', x: 0.51, w: 142, h: 320, lines: ['금은 두드리면 종이처럼 얇아진단다.', '그걸 오려서 꾸미개를 만들지.'] },
          { id: 'jade', pass: '옥은 천천히 갈아야 해.', show: 'crown', pose: 'see-wow', sora: '금이 나뭇가지 같아!', memo: '신라의 금관이란다. 작은 금 달개와 굽은 옥이 걸을 때마다 흔들렸겠지.', name: '옥 다듬는 장인', x: 0.62, w: 113, h: 313, lines: ['이 굽은 옥은 금관에 단단다.', '금 달개 사이에서 푸르게 빛나지.'] },
          { id: 'weaver', pass: '고운 베 보고 가요.', name: '베 짜는 아주머니', x: 0.73, w: 122, h: 292, lines: ['긴 저고리에 띠를 매어 입는단다.', '아이 것도 있어. 입어 보련?'],
            try: { id: 'wear-silla', verb: 'wear', name: '신라의 옷', outfit: 'silla', sora: '띠를 매니까 딱 맞아!', memo: '신라 사람들은 긴 저고리에 허리띠를 맸단다. 그 아래에 주름치마나 바지를 입었지.' } },
          { id: 'monk', pass: '고맙습니다.', name: '황룡사 스님', x: 0.85, w: 112, h: 291, lines: ['황룡사는 서라벌에서 큰 절이란다.', '높은 탑은 아직 없단다.'] },
        ],
        spots: [],
      },
      {
        id: 'tombs', name: '신라 서라벌 큰 무덤 사이 길', short: '무덤 사이 길', zoom: 1.13, ground: 0.725, scale: 0.661, air: 'street', floor: 'dirt',
        sora: '언덕인 줄 알았는데 무덤이래!',
        people: [
          { id: 'mower', pass: '풀이 금세 자라네.', name: '풀 베는 아저씨', x: 0.18, w: 123, h: 286, lines: ['옛 임금님들이 잠든 무덤이란다.', '집보다 커서 풀 베는 데 하루지.'] },
          { id: 'granny', pass: '올해도 잘 익었구나.', show: 'dish', pose: 'see-aha', sora: '접시에 다리가 있어!', memo: '굽이 높은 접시란다. 굽에 네모난 구멍을 뚫어 멋을 냈지.', name: '제물 올리는 할머니', x: 0.29, w: 82, h: 254, lines: ['굽다리 접시에 과일을 올린단다.', '굽이 높아야 정성스러워 보이지.'] },
          { id: 'carpenter', pass: '사다리 지나갑니다!', name: '사다리 멘 목수', x: 0.4, w: 134, h: 320, lines: ['첨성대 창에 걸칠 사다리란다.', '창이 높아서 사다리가 있어야 하지.'] },
          { id: 'piper', pass: '삘리리, 삘리리.', name: '피리 부는 소년', x: 0.51, w: 89, h: 197, lines: ['대나무로 만든 피리야.', '무덤 사이는 소리가 잘 울려.'] },
          { id: 'painter', pass: '흰 말아, 훨훨 달려라.', name: '말다래 그리는 화공', x: 0.62, w: 115, h: 266, lines: ['나무껍질에 흰 말을 그린단다.', '말 탄 이의 옷에 흙이 안 튀게 대지.'] },
          { id: 'water', pass: '찰랑찰랑, 쏟을라.', name: '물동이 인 아주머니', x: 0.73, w: 108, h: 291, lines: ['우물에서 물을 길어 온단다.', '첨성대는 이 길 끝에 있지.'] },
          { id: 'hwarang', pass: '오늘은 길을 잘 지켜야 해.', name: '길을 지키는 화랑', x: 0.85, w: 95, h: 306, lines: ['나는 서라벌의 화랑이다.', '동무들과 산과 들을 다니며 배우지.'] },
        ],
        spots: [],
      },
      {
        id: 'tower', name: '신라 서라벌 첨성대 앞', short: '첨성대 앞', zoom: 1.13, ground: 0.725, scale: 0.661, air: 'hush', floor: 'dirt',
        sora: '병처럼 생긴 돌탑이야!',
        people: [
          { id: 'mason', pass: '돌 하나하나 내 손을 거쳤지.', show: 'stones', pose: 'see-wow', sora: '돌이 동글동글 쌓였어!', memo: '돌이 삼백예순 개쯤, 스물일곱 단이란다. 창 위로 열두 단, 아래로 열두 단이지.', name: '돌 다듬는 석수', x: 0.18, w: 123, h: 278, lines: ['돌을 삼백예순 개쯤 쌓았단다.', '단을 세어 보렴. 스물일곱 단이지.'] },
          { id: 'scribe', pass: '어디 보자, 첫 별이…', name: '별을 적는 젊은 관리', x: 0.29, w: 102, h: 280, lines: ['본 것을 나무쪽에 적어 둔단다.', '적어 두어야 내년에 견주어 보지.'] },
          { id: 'lampkid', pass: '불 꺼질라, 살금살금.', name: '등불 든 아이', x: 0.4, w: 79, h: 204, lines: ['해가 지면 내가 불을 켜.', '별 볼 때는 불을 작게 해야 해.'] },
          { id: 'queen', pass: '오늘 밤은 하늘이 맑겠구나.', name: '선덕여왕', x: 0.51, w: 135, h: 320, lines: ['별을 보려고 쌓은 돌탑이란다.', '너도 오늘 밤 하늘을 보고 가렴.'] },
          { id: 'maid', pass: '여왕님, 바람이 찹니다.', name: '시녀', x: 0.62, w: 85, h: 241, lines: ['여왕님은 신라의 첫 여왕이시란다.', '별 보는 것을 무척 아끼시지.'] },
          { id: 'ilgwan', pass: '추가 와야 할 텐데.', show: 'stars', pose: 'see-wow', sora: '꼭대기에서 별을 세!', memo: '창까지는 사다리로 오르고, 그 위는 탑 속으로 올라갔다고들 한단다.', name: '일관', x: 0.73, w: 111, h: 296, lines: ['나는 하늘을 살피는 일관이란다.', '밤마다 별을 보고 적어 두지.'] },
          { id: 'farmer', pass: '내일은 비가 오려나.', name: '농부 할아버지', x: 0.85, w: 112, h: 248, lines: ['별을 보고 씨 뿌릴 때를 안단다.', '그래서 일관님께 여쭈러 왔지.'] },
        ],
        spots: [],
      },
    ],
    // "The plumb weight" (core/tale.js; the storyboard of docs/신기한-사실.md): the goldsmith
    // has made a small gold weight on a cord for the court astronomer; the hwarang keeps the
    // way to the tower, for the queen is coming; the carpenter with the ladder takes her along
    // as his helper; she hands it to the astronomer, choosing what to say; and at dusk he
    // climbs to the top and counts the first stars.
    tale: {
      thing: true,
      ask: '첨성대의 돌은 몇 개나 될까?',
      gate: { scene: 'tombs', open: 3, sora: '화랑이 막고 있어. 못 가.' },
      steps: [
        {
          who: 'goldsmith', goal: '저잣거리의 금 두드리는 장인에게 가 보렴.', holds: '금 추: 장인이 들고 있음',
          lines: ['얘야, 부탁 하나 들어주련?', '별 보는 일관께 드릴 금 추란다.', '첨성대 앞의 일관께 전해 주렴.'],
          offer: { ask: '금 추를 전해 줄까?', label: '내가 전해 줄게요' },
          errand: 'took',
        },
        {
          who: 'hwarang', goal: '무덤 사이 길 끝으로 가 보렴.', holds: '금 추: 소라가 들고 있음',
          lines: ['멈춰라. 여왕님께서 첨성대에 오신다.', '오늘은 아무나 가까이 못 간다.'],
          sora: '추를 전해야 하는데… 어? 누가 불러!',
        },
        {
          who: 'carpenter', call: '얘, 어디 가는데?', goal: '사다리 멘 목수가 부른다. 가 보렴.', holds: '금 추: 소라가 들고 있음',
          lines: ['일관께 간다고? 그럼 나를 따라오렴.', '나도 이 사다리를 가져가는 길이란다.', '화랑님, 이 아이는 저와 함께 갑니다!'],
          after: [{ who: 'hwarang', line: '목수와 함께라면 지나가거라.' }],
          sora: '목수 아저씨를 따라가면 된대! 가자!',
        },
        {
          who: 'ilgwan', goal: '첨성대 앞의 일관에게 금 추를 전하렴.', holds: '금 추: 소라가 들고 있음',
          lines: ['오, 기다리던 금 추로구나.'],
          choice: {
            ask: '금 추를 건네며 뭐라고 할까?',
            options: [
              { id: 'E1', label: '"장인 아저씨가 보냈어요"', sora: '저잣거리의 장인 아저씨가 보내셨어요.', says: '솜씨가 곱구나. 고맙다, 얘야.' },
              { id: 'E2', label: '"이걸로 뭘 해요?"', sora: '이 추로 무엇을 하세요?', says: '줄에 달면 곧게 아래를 가리킨단다.' },
            ],
          },
          errand: 'gave',
        },
        {
          who: 'ilgwan', show: true, goal: '일관이 별을 세는 것을 보렴.',
          lines: ['해가 졌구나. 사다리로 올라가마.', '꼭대기에서 별을 하나씩 센단다.'],
          sora: '첫 별이 떴어! 하나, 둘…',
          errand: 'saw',
        },
      ],
      asides: [
        { who: 'goldsmith', when: ['S1', 'S2', 'S3', 'S4'], lines: ['일관께서는 첨성대 앞에 계신단다.', '큰 무덤들 사이 길로 가렴.'] },
        { who: 'goldsmith', when: ['S5'], lines: ['전해 주었구나. 고맙다, 얘야.', '오늘 밤은 별이 잘 보이겠구나.'] },
      ],
      done: '금 추를 전하고, 첨성대에서 별을 세는 것을 보았다.',
    },
    errands: [
      { id: 'took', text: '금 추를 받는다.', at: [] },
      { id: 'gave', text: '일관에게 금 추를 전한다.', at: [] },
      { id: 'saw', text: '첨성대에서 별을 세는 것을 본다.', at: [] },
    ],
    reply: '천사백 년 동안 같은 하늘을 본 돌이란다. 부럽지.',
  },
};

// The far and the fore of every other scene are told from the pictures that are there (the
// user, 2026.10.13: "배경은 이렇게 다 바꾸자", "아. 전경도"): core/layers.js.
for (const place of Object.values(WALKS)) {
  for (const scene of place.scenes) {
    const layers = LAYERS[`${place.dir}/${scene.id}`];
    if (layers?.far) scene.far ??= layers.far;
    if (layers?.fore) scene.fore ??= layers.fore;
  }
}
