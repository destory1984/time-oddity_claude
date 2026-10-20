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
        '콜로세움은 지금도 로마 한가운데에 서 있습니다. 문을 연 지 1,900년이 넘었습니다.',
        '1349년 큰 지진 때 무른 땅 위에 있던 남쪽 바깥벽이 무너졌습니다. 그래서 지금은 북쪽 바깥벽만 절반쯤 남아 있습니다.',
        '콜로세움은 1980년에 로마의 옛 시가지와 함께 유네스코 세계유산이 되었습니다.',
        '경기장 바닥 밑에는 짐승과 무대 장치를 두던 땅굴이 있습니다. 2018년부터 이 땅굴을 고쳐, 2021년부터는 사람들이 걸어 들어가 볼 수 있습니다.',
        '1964년부터 해마다 부활절 앞 금요일 밤에는 교황이 이곳에서 십자가의 길 기도를 이끕니다.',
        '2024년에는 콜로세움과 곁의 옛 로마 광장 터를 묶은 공원에 1,470만 명이 넘게 다녀갔습니다.',
      ],
      credit: '사진: Anil Öztas, 위키미디어 공용, CC BY 4.0',
    },
    scenes: [
      {
        id: 'market', name: '이탈리아 로마 시장 거리', short: '시장 거리', zoom: 1.25, ground: 0.765, scale: SHEET.market, air: 'market',
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
            try: { id: 'wear-toga', verb: 'wear', name: '토가', outfit: 'toga', pose: 'toga-fuss', trips: 2, sora: '토가가 무거워! 자꾸 흘러내려.', memo: '시민만 입을 수 있었고, 무거워서 평소엔 다들 튜닉이었대.' } },
        ],
        spots: [],
      },
      {
        id: 'plaza', name: '이탈리아 로마 콜로세움 앞 광장', short: '콜로세움 앞 광장', zoom: 1.6, ground: 0.79, scale: SHEET.plaza, air: 'hush',
        sora: '와, 콜로세움이 새것이야! 하얘.',
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
          { id: 'child', pass: '훌쩍… 엄마가 없어졌어.', name: '우는 아이', x: 0.63, w: 63, h: 170, lines: ['엄마가 없어졌어…', '스물셋이랬는데. 스물셋이 어디야?'] },
          { id: 'guard', pass: '줄을 서시오, 줄!', show: 'rednumbers', pose: 'see-aha', sora: '번호가 빨개서 멀리서도 보여!', memo: '문 번호를 돌에 새기고 붉게 칠했단다. 지금은 칠이 다 벗겨졌지.', name: '경비병', x: 0.8, w: 133, h: 320, lines: ['번호 봐요, 번호. 스물셋은 저쪽.', '밀지 마시오. 문은 여든 개요.'] },
        ],
        spots: [],
      },
      {
        id: 'inside', name: '이탈리아 로마 콜로세움 안', short: '콜로세움 안', zoom: 1.3, ground: 0.775, scale: SHEET.inside, air: 'arena',
        sora: '우와… 끝까지 다 사람이야.',
        people: [
          { id: 'usher', pass: '표를 보여 주시오.', name: '자리 안내원', x: 0.17, w: 84, h: 263, lines: ['앞줄은 원로원 자리요. 저 위로.', '자리는 옷을 보고 정하오.'] },
          { id: 'nuts', pass: '콩이요, 콩! 보고 가요!', show: 'beans', name: '견과 파는 소년', x: 0.29, w: 99, h: 247, lines: ['볶은 콩 있어요! 구운 밤!', '싸움 시작하면 못 팔아. 지금 사.'],
            try: { id: 'eat-beans', verb: 'eat', name: '볶은 콩', face: 'yum', sora: '콩이 고소해! 하나만 더 먹을래.' } },
          { id: 'clap', pass: '와아! 공이다, 공!', show: 'balls', pose: 'see-gasp', sora: '공에 적힌 걸 진짜 주는 거야?!', memo: '황제가 던진 나무 공에 옷, 그릇, 말 같은 상품이 적혀 있었단다.', name: '관중 아저씨', x: 0.4, w: 101, h: 320, lines: ['황제가 나무 공을 던졌어! 잡았지.', '공에 적힌 걸 준대. 나는 옷이야!'] },
          { id: 'cheer', pass: '꺄아, 멋지다!', name: '관중 아가씨', x: 0.7, w: 89, h: 289, lines: ['저기 행진 온다! 반짝반짝해.', '천을 흔들면 황제가 본대.'] },
          { id: 'sailor1', pass: '영차, 줄 당겨라!', name: '뱃사람', x: 0.82, w: 108, h: 254, lines: ['미세눔에서 왔소. 돛 당기던 손이지.', '이 차양이 돛 천이오. 줄쯤이야.'] },
          { id: 'sailor2', pass: '영차! 줄을 조금만 더 당기자!', name: '젊은 뱃사람', x: 0.89, w: 92, h: 273, lines: ['해가 돌면 차양도 돌려야 하오.', '바람 센 날이 제일 무섭지.'] },
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
        '에펠탑은 쇠 조각 18,038개를 리벳 250만 개로 이어 붙여 만들었습니다. 귀스타브 에펠의 회사가 1887년부터 1889년까지 지었습니다.',
        '에펠탑은 41년 동안 세상에서 가장 높은 건축물이었습니다. 1930년 뉴욕에 크라이슬러 빌딩이 서면서 그 자리를 내주었습니다.',
        '지금 높이는 꼭대기 안테나까지 330미터입니다. 사람이 올라가는 맨 위 전망대는 276미터 높이에 있습니다.',
        // The user, 2026.10.10: "보수 공사비 많이 들어가던데". Looked up at toureiffel.paris: painted twenty
        // times, about once in seven years, about 60 tonnes a time. What it costs differs by source and is left out.
        // The user, 2026.10.10: "보수 비용이 얼마나 들어가는지도 적어. 어른들은 숫자(돈) 좋아해". Reuters, July
        // 2022, after the magazine Marianne: 60 million euros. The final sum was not found.
        '녹슬지 않게 일곱 해쯤마다 페인트 60톤으로 다시 칠합니다. 2019년에 시작한 스무 번째 칠에는 6천만 유로가 든다고 보도되었습니다.',
        '1991년, 에펠탑이 서 있는 파리의 센강 가가 유네스코 세계유산이 되었습니다.',
        '2022년에는 589만 명쯤이 에펠탑을 찾았습니다. 1889년 박람회 때보다 세 배쯤 많습니다.',
      ],
      credit: '사진: Benh LIEU SONG, 위키미디어 공용, 공개 저작물',
    },
    scenes: [
      {
        id: 'gate', name: '프랑스 파리 만국박람회 입구', short: '박람회 입구', zoom: 1.03, ground: 0.785, scale: 0.602, air: 'road',
        sora: '깃발이 잔뜩 걸렸어! 저 끝에 탑이 있네.',
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
            try: { id: 'wear-tophat', verb: 'wear', name: '실크해트', outfit: 'tophat', sora: '모자가 굴뚝처럼 높아! 머리가 휘청거려.' } },
          { id: 'kilt', pass: '허, 크긴 크구먼.', name: '먼 데서 온 아저씨', x: 0.855, w: 133, h: 291, lines: ['스코틀랜드에서 배 타고 왔다네.', '우리도 쇠로 큰 다리를 놓는 중이지.'] },
        ],
        spots: [],
      },
      {
        id: 'tower', name: '프랑스 파리 에펠탑 아래', short: '에펠탑 아래', zoom: 1.09, ground: 0.735, scale: 0.638, air: 'court', floor: 'dirt',
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
          { id: 'kid', pass: '우와, 탑이 정말 높다!', name: '올려다보는 아이', x: 0.38, w: 82, h: 201, lines: ['꼭대기가 구름에 닿을 것 같아!', '아빠가 나는 다음에 올라가래.'] },
          { id: 'postcard', show: 'postcard', pass: '어머, 엽서에 찍힌 도장 좀 봐!', pose: 'see-aha', sora: '도장에도 탑이 있어!', memo: '탑 층마다 우체통이 있어 탑 그림 도장을 찍어 줬단다.', name: '엽서 든 아가씨', x: 0.6, w: 155, h: 294, lines: ['탑 위에서 부친 엽서예요.', '도장에 탑이 그려져 있지요?'] },
          { id: 'photo', pass: '자, 여기 보시오!', name: '사진사', x: 0.68, w: 156, h: 320, lines: ['움직이지 마시오! 하나, 둘…', '탑이 커서 한 장에 다 안 들어가.'] },
          { id: 'puff', pass: '헉헉, 숨 좀 돌리고 가야겠구먼.', name: '숨 고르는 아저씨', x: 0.775, w: 155, h: 305, lines: ['헉, 헉… 1층만 갔다 왔네.', '위에서 보니 파리가 손바닥만 해.'] },
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
        id: 'hall', name: '프랑스 파리 만국박람회 기계관', short: '박람회 기계관', zoom: 1.16, ground: 0.69, scale: 0.678, air: 'works', floor: 'wood',
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
            try: { id: 'use-phono', verb: 'use', name: '말하는 기계', label: '말하는 기계 들어 볼래', sora: '귀에 댄 관에서 노래가 들려! 신기해.' } },
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
        '집현전이 있던 자리에는 지금 수정전이 서 있습니다. 수정전은 1867년에 다시 지은 건물입니다.',
        '경복궁은 1592년 전쟁 때 불탔고, 그 뒤 270년 넘게 빈터로 남아 있었습니다.',
        '1894년에는 나라의 제도를 새로 고치는 관청인 군국기무처가 수정전에 자리 잡았습니다.',
        '책 훈민정음(해례본)은 대한민국의 국보이고, 1997년에 유네스코 세계기록유산이 되었습니다.',
        '이 책 끝에 적힌 펴낸 날을 오늘의 달력으로 바꾸면 10월 9일입니다. 그래서 한글날이 10월 9일입니다.',
        '580년쯤 전에 세종대왕이 만든 그 글자로, 우리는 지금 이 글을 읽고 있습니다.',
      ],
      credit: '사진: De-Shao Liu, 위키미디어 공용, CC BY-SA 4.0',
    },
    scenes: [
      {
        id: 'market', name: '조선 한양 저잣거리', short: '저잣거리', zoom: 1.07, ground: 0.75, scale: 0.626, air: 'market', floor: 'dirt',
        sora: '감이 주렁주렁해! 장터가 시끌시끌해.',
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
            try: { id: 'wear-gat', verb: 'wear', name: '갓과 도포', outfit: 'gat', sora: '갓을 쓰니까 선비가 된 것 같아!' } },
          { id: 'woodboy', pass: '나무 사려! 장작이오!', name: '나무꾼 소년', x: 0.52, w: 119, h: 226, lines: ['저게 글자야? 그림 같은데.', '가, 나, 다… 나도 따라 했어!'] },
          { id: 'tteok', pass: '떡 사려, 따끈한 떡!', show: 'tteok', name: '떡 파는 할머니', x: 0.77, w: 110, h: 257, lines: ['시루떡 따끈해요. 하나 드시우.', '열흘이면 배운다니 나도 해 볼까.'],
            try: { id: 'eat-tteok', verb: 'eat', name: '떡', face: 'yum', sora: '떡이 쫀득해서 자꾸 손이 가!' } },
          { id: 'water', pass: '아이고, 물동이 무거워라.', name: '물동이 인 아낙', x: 0.862, w: 113, h: 320, lines: ['친정에 편지 한 장 못 썼다우.', '이제는 쓸 수 있으려나.'] },
        ],
        spots: [],
      },
      {
        id: 'gate', name: '조선 한양 광화문 앞', short: '광화문 앞', zoom: 1.15, ground: 0.7, scale: 0.673, air: 'court', floor: 'dirt',
        sora: '문이 엄청 커! 지붕이 두 층이야.',
        moving: [
          { kind: 'drift', id: 'parade', src: 'parade', from: 0, to: 1, foot: 0.676, tall: 0.2, wide: 0.3169, gap: 0.55, speed: 0.032, bob: 0.003 },
        ],
        people: [
          { id: 'farmer', flip: true, pass: '허어, 문이 산만 하구먼.', name: '시골 농부', x: 0.14, w: 118, h: 242, lines: ['대궐이 이리 큰 줄 몰랐소.', '억울한 일을 글로 적을 수 있다던데.'] },
          { id: 'bearer', pass: '영차! 가마가 참 무겁구먼.', name: '가마꾼', x: 0.3, w: 115, h: 251, lines: ['아이고 어깨야. 대감은 무겁다니까.', '글자? 가마 멜 때는 쓸 데 없지.'] },
          { id: 'guard', pass: '물렀거라!', name: '수문장', x: 0.42, w: 123, h: 320, lines: ['멈추시오. 여기는 대궐 문이오.', '광화문이오. 스무 해 전에 얻은 이름이지.'] },
          { id: 'elder', pass: '에헴! 새 글자가 웬 말이오.', name: '늙은 대신', x: 0.58, w: 111, h: 267, lines: ['한문이 있는데 새 글자가 웬 말이오.', '…허나 임금의 뜻이 굳으시오.'] },
          { id: 'official', pass: '새 글자요. 한번 보고 가시오.', show: 'letters', pose: 'see-aha', sora: '지금은 안 쓰는 글자가 넷이구나!', name: '젊은 관리', x: 0.7, w: 118, h: 263, lines: ['새 글자 스물여덟 자요. 보시오.', '소리 나는 대로 적으니 참 쉽소.'] },
          { id: 'girl', pass: '마님 심부름이 늦었어요!', name: '심부름 가는 소녀', x: 0.86, w: 103, h: 231, lines: ['마님 심부름 가요. 바빠요!', '언니가 새 글자를 가르쳐 준댔어.'] },
        ],
        spots: [],
      },
      {
        id: 'hall', name: '조선 한양 경복궁 집현전 뜰', short: '집현전 뜰', zoom: 1.09, ground: 0.74, scale: 0.638, air: 'palace',
        sora: '책이 마당 가득이야. 조용해.',
        moving: [
          { kind: 'drift', id: 'books', src: 'scholars', from: 0, to: 1, foot: 0.716, tall: 0.17, wide: 0.2807, gap: 0.6, speed: 0.026, bob: 0.003 },
        ],
        people: [
          { id: 'books', pass: '볕이 좋구먼.', name: '책 말리는 아저씨', x: 0.2, w: 114, h: 315, lines: ['볕 좋은 날 책을 말려야 하오.', '좀이 슬면 큰일이라오.'] },
          { id: 'sleepy', pass: '하암… 졸려라.', name: '졸린 학사', x: 0.32, w: 127, h: 313, lines: ['밤새 풀이를 썼소. 하암…', '임금님이 더 늦게 주무신다오.'] },
          { id: 'scholar', pass: '흠, 이 소리는 어찌 적을꼬.', name: '집현전 학사', x: 0.41, w: 134, h: 320, lines: ['글자마다 입 모양을 본떴다오.', '이 글자는 혀뿌리가 막힌 모양이지.'] },
          { id: 'tea', pass: '차 식어요. 비켜 주세요.', show: 'ongnu', pose: 'see-gasp', sora: '인형이 스스로 종을 쳐?!', memo: '종이로 만든 산을 금빛 해가 하루 한 바퀴 돌았단다. 때마다 인형이 종을 쳤지.', name: '차 나르는 궁녀', x: 0.66, w: 116, h: 302, lines: ['흠경각에는 인형 시계가 있답니다.', '종이 산을 금빛 해가 돌아요.'] },
          { id: 'child', pass: '가, 나, 다, 라를 써 보는 중이야.', show: 'brush', name: '글자 쓰는 아이', x: 0.75, w: 86, h: 206, lines: ['이거 봐! 내 이름이야. 내가 썼어!', '어제 배웠는데 벌써 다 써.'],
            try: { id: 'use-letters', verb: 'use', name: '새 글자', sora: 'ㅅ, ㅗ, ㄹ, ㅏ… 소라! 내 이름을 썼어!' } },
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
        '다리의 주황빛은 "인터내셔널 오렌지"라는 색입니다. 건축가 어빙 모로가 검은색과 회색 대신 이 색을 골랐습니다.',
        '바닷바람의 소금이 쇠를 녹슬게 해서, 페인트공 28명이 녹이 번지는 곳부터 쉬지 않고 다시 칠합니다.',
        '두 탑은 바다 위로 227미터 솟아 있습니다. 다리의 길이는 끝에서 끝까지 2,737미터입니다.',
        '다리를 매단 큰 줄 하나에는 가는 쇠줄 27,572가닥이 들어 있습니다. 줄의 굵기는 92센티미터입니다.',
        '금문교는 두 탑 사이가 세상에서 가장 긴 현수교였습니다. 1964년 뉴욕에 베라자노내로스 다리가 생기면서 그 자리를 내주었습니다.',
        '다리가 문을 연 뒤 2019년 2월까지 차가 22억 번 넘게 이 다리를 건넜습니다.',
      ],
      credit: '사진: Frank Schulenburg, 위키미디어 공용, CC BY-SA 4.0',
    },
    scenes: [
      {
        id: 'plaza', name: '미국 샌프란시스코 금문교 어귀', short: '금문교 어귀', zoom: 1.09, ground: 0.74, scale: 0.638, air: 'road',
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
        id: 'deck', name: '미국 샌프란시스코 금문교 위', short: '금문교 위', zoom: 1.12, ground: 0.722, scale: 0.655, air: 'bridge',
        sora: '차가 없으니까 운동장 같아.',
        // The crowd goes over on foot. (Those who cross some odd way went by in a line of their own
        // until 2026.10.12: they now stand among the people, to be found.)
        moving: [
          { kind: 'drift', id: 'over', src: 'crowd', from: 0, to: 1, foot: 0.716, tall: 0.16, wide: 0.386, gap: 0.08, speed: 0.03, bob: 0.003 },
        ],
        people: [
          { id: 'mother', pass: '바람이 시원하네, 아가.', name: '유모차 미는 어머니', x: 0.15, w: 217, h: 308, lines: ['아기도 오늘을 기억하면 좋겠어요.', '배 타고 건너던 길을 걸어서 가네.'] },
          { id: 'grandpa', pass: '허허, 살다 보니 별일이야.', name: '할아버지', x: 0.246, w: 123, h: 318, lines: ['이 물목에 다리는 못 놓는다 했지.', '살아서 걸어 건널 줄이야.'] },
          { id: 'tuba', pass: '뿜빠! 큰 나팔 소리 좀 들어 보렴.', pose: 'see-wow', sora: '저 큰 나팔을 불면서 걸어?', memo: '튜바를 불면서 건넌 사람도 있었단다.', name: '튜바 부는 아저씨', x: 0.338, w: 196, h: 355, lines: ['(튜바를 분다) 뿜빠 뿜빠!', '끝까지 불면서 갈 거요.'] },
          { id: 'worker', pass: '어이, 그물 구경해 볼 테요?', show: 'net', pose: 'see-gasp', sora: '다리 밑에 그물을 쳤구나!', name: '다리 일꾼', x: 0.433, w: 141, h: 320, lines: ['짓는 동안 밑에 그물을 쳤소. 보시오.', '그 그물에 떨어져 열아홉이 살았소.'] },
          { id: 'sisters', pass: '비켜요, 비켜! 지나가요!', pose: 'see-wow', sora: '바퀴 달린 신이다!', memo: '롤러스케이트로 처음 건넌 사람은 카르멘과 미니 페레스 자매란다.', name: '롤러스케이트 자매', x: 0.552, w: 294, h: 260, lines: ['롤러스케이트로 건너는 중이야!', '우리 자매가 일등일걸.'] },
          { id: 'backward', pass: '뒤로 가요, 뒤로!', name: '뒤로 걷는 남자', x: 0.665, w: 114, h: 315, lines: ['뒤로 걸어 건넌 건 내가 처음이오.', '신문에 나려면 별나야지.'] },
          { id: 'unicycle', pass: '어어, 길 좀 비켜요!', pose: 'see-gasp', sora: '바퀴가 하나뿐이야!', memo: '외발자전거로 건넌 사람도 있었단다.', name: '외발자전거 탄 사람', x: 0.767, w: 250, h: 313, lines: ['바퀴 하나로 건너는 중이오.', '멈추면 넘어져요, 하하!'] },
          { id: 'harmonica', pass: '하모니카 소리 좀 들어 볼래?', name: '하모니카 소년', x: 0.865, w: 98, h: 246, lines: ['(하모니카를 분다) 뿌우 뿌!', '다리 건너며 한 곡 다 불 거야.'] },
        ],
        spots: [],
      },
      {
        id: 'mid', name: '미국 샌프란시스코 금문교 한가운데', short: '금문교 한가운데', zoom: 1.17, ground: 0.692, scale: 0.684, air: 'bridge',
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
          { id: 'tap', pass: '구두로 탁탁 소리 내며 춤춰요!', pose: 'see-wow', sora: '발에서 소리가 나!', memo: '탭댄스를 추면서 건넌 사람도 있었단다.', name: '탭댄스 추는 사람', x: 0.46, w: 212, h: 308, lines: ['춤추면서 건너는 중이에요!', '탭댄스로는 내가 처음일걸요.'] },
          { id: 'painter', pass: '이 다리 색 얘기 들어 봤소?', show: 'stripes', pose: 'see-aha', sora: '줄무늬 다리가 될 뻔했구나!', name: '칠장이', x: 0.57, w: 114, h: 267, lines: ['해군은 노란 줄무늬를 하자 했소.', '이 주황은 안개 속에서도 보이라고.'] },
          { id: 'coal', pass: '석탄이 무겁구나, 얘야.', pose: 'see-gasp', sora: '석탄을 들고 온 거야?', memo: '펜실베이니아에서 온 아버지와 딸이 고향 석탄 11킬로그램을 들고 건넜단다.', name: '석탄을 든 아버지와 딸', x: 0.69, w: 253, h: 300, lines: ['펜실베이니아에서 왔소. 고향 석탄이오.', '이걸 들고 건넌 건 우리가 처음이지.'] },
          { id: 'sailor', pass: '오늘은 바람이 참 좋구나!', name: '수병', x: 0.812, w: 123, h: 258, lines: ['군함이 이 밑으로 지나다닌다오.', '물에서 다리까지 예순일곱 미터.'] },
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
        '사진은 소라가 탄 첫 열차의 뒤를 이은 N700S와 N700A입니다. 1964년과 같은 도쿄역 승강장에 서 있습니다.',
        '손님을 태우고 달리는 가장 빠른 속도는 처음에 시속 210킬로미터였고, 지금은 시속 285킬로미터입니다.',
        'N700S는 시험 운전에서 시속 360킬로미터까지 달린 적이 있습니다.',
        '도쿄에서 신오사카까지 가장 빠른 열차로 가면 지금은 2시간 21분이 걸립니다.',
        '2024년에는 이 노선에 열차가 하루 383번쯤 다녔고, 하루에 46만 명이 탔습니다.',
        '1964년 처음 달린 뒤로 지금까지, 열차 사고로 목숨을 잃거나 다친 승객은 한 명도 없습니다.',
      ],
      credit: '사진: 電車(新幹線)でゴー！, 위키미디어 공용, CC BY-SA 4.0',
    },
    scenes: [
      {
        id: 'front', name: '일본 도쿄역 앞', short: '도쿄역 앞', zoom: 1.3, ground: 0.765, scale: 0.66, air: 'road',
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
            try: { id: 'eat-ekiben', verb: 'eat', name: '기차 도시락', face: 'yum', sora: '도시락이 식었는데도 맛있어!' } },
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
        id: 'platform', name: '일본 도쿄역 승강장', short: '도쿄역 승강장', zoom: 1.3, ground: 0.83, scale: 0.76, air: 'station',
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
        id: 'car', name: '일본 달리는 신칸센 안', short: '달리는 신칸센 안', zoom: 1.3, ground: 0.72, scale: 0.66, air: 'train', floor: 'wood',
        sora: '기차가 안 흔들려! 창밖이 휙휙 가.',
        // The land goes by behind the picture, seen through its six windows.
        moving: [
          { kind: 'drift', id: 'land', src: 'view', from: 0.13, to: 0.87, foot: 0.472, tall: 0.17, wide: 0.415, gap: 0, speed: -0.09, bob: 0, behind: true },
        ],
        people: [
          { id: 'conductor', pass: '실례하겠습니다.', name: '차장', x: 0.168, w: 158, h: 315, lines: ['표 좀 보여 주시겠습니까.', '신오사카까지 네 시간입니다.'] },
          { id: 'dozer', pass: '음냐… 너무 조용해서 졸려.', name: '조는 대학생', x: 0.24, w: 133, h: 309, lines: ['…음냐. 벌써 시즈오카예요?', '너무 조용해서 잠이 와요.'],
            try: { id: 'wear-ivy', verb: 'wear', name: '아이비룩', outfit: 'ivy', sora: '내 옷 단추가 금빛이야. 멋지다!', memo: '그 무렵 도쿄 젊은이들 사이에 유행한 대학생 차림이란다.' } },
          { id: 'eater', pass: '우물우물, 도시락이 맛있네.', name: '도시락 먹는 아저씨', x: 0.38, w: 160, h: 311, lines: ['빨라서 도시락 먹을 틈이 없네.', '(우물우물) 그래도 맛은 좋아.'] },
          { id: 'kid', pass: '우와, 빠르다!', show: 'cup', pose: 'see-aha', sora: '봉투에 물을 받아 마시네!', memo: '이 기차에 맞춰 만든 종이컵이란다. 납작하게 접혀 있었지.', name: '신난 꼬마', x: 0.52, w: 146, h: 214, lines: ['물은 봉투에 받아 마시는 거야!', '나 커서 기관사 될 거야!'] },
          { id: 'granny', pass: '아이고, 벌써 여기야.', name: '창가의 할머니', x: 0.68, w: 181, h: 280, lines: ['저기 봐, 후지산이야! 벌써 여기야.', '옛날엔 걸어서 보름 길이었단다.'] },
          { id: 'buffet', pass: '어서 오세요! 속도계 보고 가세요.', show: 'speedometer', pose: 'see-gasp', sora: '1964년에 시속 210km?!', name: '뷔페 칸 종업원', x: 0.9, w: 136, h: 320, lines: ['속도계 보세요. 지금 시속 210km!', '커피가 안 쏟아지는 게 자랑이죠.'],
            try: { id: 'use-speed', verb: 'use', name: '속도계', label: '속도계 볼래', sora: '속도계 바늘이 210에서 안 내려와!' } },
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
    // Who lived here, for a player who has not heard of them: the first slip of all (the user,
    // 2026.10.13: "사람들이 잘 모르는 문명에 대해서는 간략하게나마 소개하는 페이지를"). Written from memory, then looked up.
    intro: { title: '동로마 사람들', text: '동로마는 로마가 둘로 갈라진 뒤 동쪽에 남은 나라란다. 서울 콘스탄티노플은 천 년 넘게 큰 도시였지.' },
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
        '이 도시는 지금 튀르키예의 이스탄불입니다. 하기아 소피아는 1,500년 가까이 그 자리에 서 있습니다.',
        '처음 올린 둥근 지붕은 558년 지진 뒤에 무너져 내렸습니다. 지금 지붕은 562년에 전보다 높게 다시 올린 것입니다.',
        '1453년부터는 이슬람 사원으로 썼습니다. 벽의 모자이크 그림은 오랫동안 회반죽 아래에 덮여 있었습니다.',
        '1935년에 박물관이 되었습니다. 그 무렵 미국 학자 토머스 휘트모어가 이끄는 사람들이 덮여 있던 모자이크를 다시 드러냈습니다.',
        '1985년, 하기아 소피아는 둘레의 옛 시가지와 함께 유네스코 세계유산이 되었습니다.',
        '2020년에 다시 이슬람 사원이 되었습니다. 2024년부터 외국에서 온 관광객은 입장료를 내고 위층 복도에 올라 모자이크를 봅니다.',
      ],
      credit: '사진: Arild Vågen, 위키미디어 공용, CC BY-SA 3.0',
      // A second photograph at the foot of the lines (the user, 2026.10.20: "마지막에 모자이크
      // 사진도 보여줘"): Wikimedia Commons, "Christ Pantocrator Deesis mosaic Hagia Sophia.jpg"
      // by Myrabella (public domain), made smaller. The Deesis is 13th-century, in the south gallery.
      more: {
        photo: 'photo-mosaic.webp', name: '데이시스 모자이크의 예수',
        text: '위층 남쪽 복도의 모자이크입니다. 13세기에 작은 돌과 유리 조각을 하나하나 붙여 만들었습니다.',
        credit: '사진: Myrabella, 위키미디어 공용, 공개 저작물',
      },
    },
    scenes: [
      {
        id: 'square', name: '동로마 콘스탄티노플 성당 앞 광장', short: '성당 앞 광장', zoom: 1.06, ground: 0.8, scale: 0.62, air: 'hush', floor: 'dirt',
        sora: '우와, 지붕이 산처럼 커!',
        people: [
          { id: 'candle', pass: '초 사세요, 새 성당 초!', show: 'candle', name: '초 파는 할머니', x: 0.14, w: 125, h: 301, lines: ['오늘 새 성당이 문을 여는 날이란다.', '초 하나 켜 보련?'],
            try: { id: 'use-candle', verb: 'use', name: '초', label: '초 켜 볼래', sora: '초가 안 꺼지게 조심조심 들어야지.' } },
          { id: 'mason', pass: '깡깡, 돌 다듬기가 이제 다 끝났다.', show: 'tesserae', pose: 'see-gasp', sora: '유리 속에 금이 들었어!', memo: '얇은 유리 두 겹 사이에 금박을 끼운 조각이란다. 그걸 지붕 가득 붙였지.', name: '석공', x: 0.23, w: 121, h: 303, lines: ['돌은 내가 깎고, 금빛은 저 조각이 낸단다.', '손톱만 한 조각을 지붕 가득 붙였지.'] },
          { id: 'porter', pass: '영차! 마지막 기둥이다.', name: '기둥 나르는 일꾼', x: 0.33, w: 153, h: 307, lines: ['이 돌기둥은 바다 건너에서 왔어.', '굴림대 없이는 꿈쩍도 안 해.'] },
          { id: 'child', pass: '우와, 하늘만큼 커!', name: '구경 나온 아이', x: 0.56, w: 94, h: 239, lines: ['지붕이 꼭 뒤집은 그릇 같아.', '안은 금빛이래. 보고 싶다!'] },
          { id: 'pilgrim', pass: '세상에, 저 지붕 좀 봐.', name: '먼 데서 온 순례자', x: 0.645, w: 134, h: 320, lines: ['먼 시골에서 걸어서 왔단다.', '저렇게 큰 둥근 지붕은 처음 봐.'] },
          { id: 'glass', pass: '유리가 반짝반짝 잘 구워졌군.', name: '유리 굽는 장인', x: 0.73, w: 115, h: 313, lines: ['유리 사이에 금을 끼워 굽는단다.', '그걸 잘게 쪼개 벽에 붙이지.'] },
          { id: 'baker', pass: '갓 구운 빵이오!', show: 'ringbread', name: '빵 장수', x: 0.83, w: 175, h: 301, lines: ['일꾼들이 새벽부터 줄을 섰지.', '고리 빵 하나 먹어 보련?'],
            try: { id: 'eat-ringbread', verb: 'eat', name: '고리 빵', face: 'yum', sora: '빵이 쫄깃쫄깃하고 따뜻해!' } },
        ],
        spots: [],
      },
      {
        id: 'narthex', name: '동로마 콘스탄티노플 성당 문간', short: '성당 문간', zoom: 1.06, ground: 0.8, scale: 0.66, air: 'hush', floor: 'wood',
        sora: '문이 엄청 커! 다 닫혀 있네.',
        people: [
          { id: 'oiler', pass: '기름을 한 방울도 안 흘리고 붓지.', name: '등잔에 기름 붓는 일꾼', x: 0.18, w: 113, h: 271, lines: ['등잔마다 기름을 채우는 중이야.', '밤에도 환하게 밝힐 거란다.'] },
          { id: 'singer', pass: '아아, 노래할 목이 잘 풀렸다.', name: '성가대 소년', x: 0.28, w: 80, h: 238, lines: ['오늘 처음으로 여기서 노래해.', '소리가 지붕까지 올라갔다 내려와.'] },
          { id: 'lady', pass: '어머, 귀여운 아이구나.', name: '귀족 부인', x: 0.38, w: 88, h: 274, lines: ['폐하를 기다리는 중이란다.', '우리 딸 나들이옷이 맞겠구나. 입어 보련?'],
            try: { id: 'wear-byz', verb: 'wear', name: '동로마 나들이옷', outfit: 'byz', sora: '망토가 어깨에서 찰랑거려!', memo: '어깨에서 핀으로 여미는 망토는 동로마 사람들의 나들이옷이란다.' } },
          { id: 'guard', pass: '물러서라. 폐하의 문이다.', name: '황제의 근위병', x: 0.5, w: 114, h: 320, lines: ['이 문은 폐하만 드나드신다.', '나는 여기서 꼼짝 않는다.'] },
          { id: 'polisher', pass: '대리석을 닦았더니 거울 같군.', show: 'marble', pose: 'see-aha', sora: '무늬가 양쪽이 똑같아!', memo: '돌 한 덩이를 얇게 켜서 책처럼 펼쳐 붙였단다. 그래서 무늬가 마주 보지.', name: '대리석 닦는 장인', x: 0.64, w: 110, h: 270, lines: ['이 돌판의 무늬를 가만히 보렴.', '한 덩이를 켜서 책처럼 펼친 거란다.'] },
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
          { id: 'lighter', pass: '등잔에 하나씩 불을 켜야지.', show: 'lamps', pose: 'see-wow', sora: '둥근 고리에 등잔이 줄줄이 달렸어!', memo: '기름 등잔을 고리에 여럿 꽂아 높이 매달았단다.', name: '등잔 켜는 사람', x: 0.31, w: 75, h: 320, lines: ['고리 하나에 등잔이 여럿이란다.', '긴 장대로 하나씩 불을 붙이지.'] },
          { id: 'emperor', pass: '드디어 이 집을 다 지었도다!', name: '황제 유스티니아누스', x: 0.44, w: 103, h: 248, lines: ['다섯 해 만에 이 집을 다 지었노라.', '이런 지붕은 세상에 처음이니라.'] },
          { id: 'patriarch', pass: '오늘은 큰 날이로다.', name: '총대주교', x: 0.53, w: 88, h: 232, lines: ['폐하께서 먼저 들어와 계셨구나.', '이제 문을 열 차례란다.'] },
          { id: 'master', pass: '금빛 조각이 한 줌만 더 있으면…', show: 'dome', pose: 'see-wow', sora: '지붕이 빛 위에 떠 있어!', memo: '지붕 밑동에 창을 빙 둘러 뚫었단다. 빛이 들면 지붕이 떠 보이지.', name: '모자이크 장인', x: 0.63, w: 87, h: 228, lines: ['지붕 안쪽은 온통 금빛 조각이란다.', '하나하나 손으로 눌러 붙였지.'] },
          { id: 'isidore', pass: '네모난 방 위에 둥근 지붕이라…', show: 'triangle', pose: 'see-aha', sora: '세모난 벽이 지붕을 받쳐!', memo: '네모난 방 위에 둥근 지붕을 얹으려고 휜 세모 벽 넷을 끼웠단다.', name: '수학자 이시도로스', x: 0.74, w: 84, h: 233, lines: ['네모난 방에 둥근 지붕을 어찌 얹을까?', '모서리마다 휜 세모를 끼우면 된단다.'] },
          { id: 'sweeper', pass: '바닥을 쓱싹쓱싹 반짝이게 닦아.', name: '바닥 닦는 아이', x: 0.85, w: 68, h: 176, lines: ['바닥이 넓어서 끝이 없어.', '위를 보다가 자꾸 손이 멈춰.'] },
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
    // Who lived here, for a player who has not heard of them: the first slip of all (the user,
    // 2026.10.13: "사람들이 잘 모르는 문명에 대해서는 간략하게나마 소개하는 페이지를"). Written from memory, then looked up.
    intro: { title: '말리 사람들', text: '오늘 카이로에 온 임금은 서아프리카 말리의 임금이란다. 말리는 금이 많이 나는 넓은 나라였지.' },
    first: '금을 뿌리며 지나가는 임금이 온 여름이란다. 금 조각을 돌려주러 가렴.',
    dir: 'cairo1324', look: 'paper', pale: true,
    drawn: '그 무렵 아랍의 책에 그려 넣던 그림처럼 그렸단다.',
    now: {
      photo: 'photo-now.webp', name: '카이로 옛 성문의 지금 모습', when: '이집트 카이로 · 주웨일라 문',
      text: [
        '주웨일라 문은 카이로 옛 성의 남쪽 문입니다. 1092년에 재상 바드르 알자말리가 세운 문이라, 만사 무사가 왔을 때에도 이 자리에 서 있었습니다.',
        '문 위의 뾰족한 탑 둘은 술탄 알무아이야드가 문 바로 옆에 모스크를 지으며 1415년부터 1421년까지 올린 것입니다.',
        '1979년에 카이로의 옛 시가지가 유네스코 세계유산이 되었고, 이 문도 그 안에 있습니다.',
        '1998년부터 2003년까지 이집트와 미국의 연구자들이 함께 문과 탑을 고쳤습니다.',
        '지금은 표를 사면 탑에 올라 옛 카이로의 지붕들을 내려다볼 수 있습니다.',
        '문 아래로는 지금도 사람들이 다닙니다. 문 바로 남쪽의 천막 장인 거리에서는 색색의 천을 꿰매어 팝니다.',
      ],
      credit: '사진: Richard Mortel, 위키미디어 공용, CC BY 2.0',
    },
    scenes: [
      {
        id: 'gate', name: '이집트 카이로 성문 앞 시장', short: '성문 앞 시장', zoom: 1.06, ground: 0.8, scale: 0.62, air: 'market', floor: 'dirt',
        sora: '낙타가 줄줄이 들어와! 무슨 날이야?',
        people: [
          { id: 'datewoman', pass: '대추야자요, 꿀맛이오!', show: 'dates', name: '대추야자 파는 아주머니', x: 0.18, w: 108, h: 320, lines: ['사막을 건너는 이들이 먹는 열매란다.', '하나 먹어 보련?'],
            try: { id: 'eat-date', verb: 'eat', name: '대추야자', face: 'yum', sora: '대추야자가 쫀득하고 꿀처럼 달아!' } },
          { id: 'spice', pass: '후추요, 계피요!', name: '향신료 장수', x: 0.27, w: 111, h: 297, lines: ['오늘은 손님들이 금으로 값을 치르네.', '금이 이렇게 흔한 날은 처음이야.'] },
          { id: 'child', pass: '낙타가 끝이 안 보여!', name: '구경하는 아이', x: 0.36, w: 97, h: 207, lines: ['저 줄이 아침부터 들어오고 있어.', '임금님은 금빛 양산 밑에 계셨어!'] },
          { id: 'porter', pass: '어이쿠, 무겁다.', name: '짐꾼', x: 0.46, w: 117, h: 305, lines: ['짐 자루가 왜 이리 무겁나 했더니.', '속에 든 게 금가루라지 뭐야.'] },
          { id: 'camelboy', pass: '워워, 다 왔다!', show: 'caravan', pose: 'see-wow', sora: '낙타 줄이 끝이 없어!', memo: '서아프리카 말리에서 사막을 건너온 임금의 행렬이란다. 메카로 가는 길이었지.', name: '낙타 몰이 소년', x: 0.58, w: 103, h: 306, lines: ['말리에서 사막을 건너왔어.', '몇 달을 걸었는지 몰라.'] },
          { id: 'pilgrim', pass: '나도 메카로 간다네.', name: '순례 가는 노인', x: 0.7, w: 109, h: 299, lines: ['저 임금님도 메카로 가는 길이라오.', '같은 길을 가는 길동무지.'] },
          { id: 'water', pass: '시원한 물이오!', name: '물 파는 할아버지', x: 0.84, w: 114, h: 300, lines: ['물 한 잔이면 더위가 가신단다.', '오늘은 별일을 다 겪는구나.'] },
        ],
        spots: [],
      },
      {
        id: 'souk', name: '이집트 카이로 금 시장 골목', short: '금 시장 골목', zoom: 1.06, ground: 0.8, scale: 0.62, air: 'market', floor: 'dirt',
        sora: '가게마다 금이 번쩍번쩍해!',
        people: [
          { id: 'changer', pass: '금값이 어제는 스물다섯이었는데…', show: 'scale', pose: 'see-aha', sora: '금이 흔해져서 값이 내렸구나!', memo: '금이 한꺼번에 너무 많이 풀리면 금값이 떨어진단다. 그해 카이로가 그랬지.', name: '환전상', x: 0.18, w: 107, h: 272, lines: ['금 한 닢이 은 스물다섯 닢이었단다.', '오늘은 스물둘도 안 쳐 줘. 금이 넘쳐서.'] },
          { id: 'goldsmith', pass: '두드려 펼 금이 남아도는구먼.', show: 'hammer', name: '금 세공사', x: 0.29, w: 90, h: 271, lines: ['금이 싸져서 일감이 밀려든다오.', '망치 한번 잡아 보겠니?'],
            try: { id: 'use-hammer', verb: 'use', name: '세공 망치', sora: '두드리니까 금이 얇게 펴져!' } },
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
        id: 'camp', name: '이집트 카이로 성 밖 임금의 천막', short: '임금의 천막', zoom: 1.06, ground: 0.8, scale: 0.62, air: 'hush', floor: 'dirt',
        sora: '천막이 집보다 커! 북소리도 나.',
        people: [
          { id: 'attendant', pass: '금 지팡이를 높이 들어라!', name: '금 지팡이 든 시종', x: 0.19, w: 79, h: 300, lines: ['임금님 앞에서 금 지팡이를 든단다.', '햇빛을 받으면 눈이 부시지.'] },
          { id: 'drummer', pass: '둥둥, 북을 힘껏 울리자!', name: '북 치는 사람', x: 0.3, w: 105, h: 267, lines: ['임금님이 나서실 때 북을 친단다.', '사막에서도 날마다 쳤지.'] },
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
    // Who lived here, for a player who has not heard of them: the first slip of all (the user,
    // 2026.10.13: "사람들이 잘 모르는 문명에 대해서는 간략하게나마 소개하는 페이지를"). Written from memory, then looked up.
    intro: { title: '송나라 사람들', text: '송나라는 천 년 전 중국에 있던 나라란다. 서울 개봉은 밤에도 시장이 열렸고, 책을 찍어 내고 나침반을 썼지.' },
    first: '낮에도 지지 않는 새 별이 뜬 날이란다. 별 보는 생도의 쪽지를 전해 주렴.',
    dir: 'kaifeng1054', look: 'paper', pale: true,
    // The eye is a camera here, and things stand nearer it than the street (ui/walk.js; the
    // user, 2026.10.12: "Until Then 움직임 따라하자", "개봉만 그렇게 해보자").
    deep: true,
    drawn: '송나라 사람들이 먹과 붓으로 그리던 그림처럼 그렸단다.',
    now: {
      photo: 'photo-now.webp', name: '그 새 별의 지금 모습', when: '황소자리 게 성운 · 허블 우주 망원경이 찍음',
      text: [
        '1054년에 보인 새 별은 큰 별이 마지막에 터지는 빛, 곧 초신성이었습니다. 사진 속 구름은 그때 흩어진 별의 조각입니다.',
        '이 구름의 이름은 게 성운입니다. 지구에서 6,500광년쯤 떨어져 있어, 그곳의 빛이 지구까지 오는 데 6,500년쯤 걸립니다.',
        '구름은 지금도 1초에 1,500킬로미터쯤씩 퍼져 나갑니다. 지금 너비는 11광년쯤입니다.',
        '구름 한가운데에는 터지고 남은 별의 알맹이, 중성자별이 있습니다. 이 별은 1초에 30번쯤 제자리에서 돕니다.',
        '1758년, 프랑스의 메시에가 이 구름을 별 목록의 첫 번째에 올렸습니다. 그래서 M1이라고도 부릅니다.',
        '맨눈으로는 안 보이지만, 작은 망원경으로는 황소자리 뿔 끝 가까이에서 뿌옇게 보입니다.',
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
            try: { id: 'use-whisk', verb: 'use', name: '차 젓는 솔', label: '차 저어 볼래', sora: '차를 저으니 거품이 뽀얗게 올라와!', memo: '송나라에서는 차를 가루 내어 대나무 솔로 저어 마셨단다.' } },
          { id: 'bun', pass: '따끈한 만두요, 만두!', show: 'mantou', name: '만두 장수', x: 0.28, w: 152, h: 276, lines: ['새벽부터 쪄서 김이 펄펄 나지.', '배 타는 사람들이 제일 먼저 사 가오.'],
            try: { id: 'eat-mantou', verb: 'eat', name: '찐 만두', face: 'yum', sora: '만두가 뜨거워! 폭신폭신해.' } },
          { id: 'carpenter', pass: '어디 보자, 여기도 멀쩡하군.', show: 'bridge', pose: 'see-wow', sora: '기둥이 하나도 없어!', memo: '통나무를 무지개처럼 휘어 강을 건넌 다리란다. 기둥이 없어 배가 걸리지 않았지.', name: '다리 고치는 목수', x: 0.39, w: 135, h: 279, lines: ['이 다리는 물속에 기둥이 없소.', '그래서 큰 배도 걸리지 않고 지나간다오.'] },
          { id: 'boatman', pass: '돛대 눕혀라, 다리다!', name: '뱃사공', x: 0.5, w: 130, h: 320, lines: ['다리 밑을 지날 땐 돛대를 눕힌다오.', '남쪽 쌀이 이 물길로 다 올라오지.'] },
          { id: 'apprentice', pass: '저 별… 어제는 없었는데.', name: '별 보는 생도', x: 0.62, w: 114, h: 280, lines: ['하늘 보는 일을 배우는 중이야.', '밤을 꼬박 새웠더니 눈이 감겨.'] },
          { id: 'porter', pass: '영차, 이 짐을 다 날라야지.', name: '짐꾼', x: 0.74, w: 176, h: 279, lines: ['새벽 장에 댈 채소라오.', '이 도시는 밤에도 장이 선다오.'] },
          { id: 'child', pass: '하암, 너무 일찍 일어났어.', name: '졸린 아이', x: 0.85, w: 93, h: 203, lines: ['형아가 밤새 하늘만 봤어.', '나도 별 봤어. 엄청 밝았어!'] },
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
            try: { id: 'wear-song', verb: 'wear', name: '송나라 옷', outfit: 'song', sora: '걸을 때마다 치마가 사락사락해!', memo: '송나라 아이들이 입던 저고리와 주름치마란다.' } },
          { id: 'scholar', pass: '공자 왈, 맹자 왈…', name: '글 읽는 선비', x: 0.5, w: 153, h: 310, lines: ['과거 시험이 코앞이라오.', '찍어 낸 책 덕에 공부할 맛이 나오.'] },
          { id: 'monk', pass: '나무아미타불.', name: '스님', x: 0.6, w: 115, h: 284, lines: ['새벽 예불을 마치고 오는 길이오.', '오늘 하늘이 심상치 않구려.'] },
          { id: 'fortune', pass: '오늘 운세 보고 가시오.', show: 'daystar', pose: 'see-wow', sora: '낮인데 별이 보여!', memo: '금성보다 밝아서 스무사흘 동안 낮에도 보였단다.', name: '점쟁이', x: 0.72, w: 143, h: 305, lines: ['별을 보면 앞일이 보인다오.', '오늘 저 별은 나도 처음 보오.'] },
          { id: 'guard', pass: '아함, 밤새 지켰더니 졸리구나.', name: '천문대 문지기', x: 0.85, w: 128, h: 320, lines: ['여기는 나라의 천문대다.', '아무나 못 들어간다.'] },
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
          { id: 'clockman', pass: '물이 똑똑 떨어지며 때를 알려 주지.', name: '물시계 지키는 관원', x: 0.18, w: 125, h: 305, lines: ['떨어지는 물로 시각을 잰단다.', '때가 되면 북을 쳐서 알리지.'] },
          { id: 'sweeper', pass: '쓱싹쓱싹, 마당을 깨끗이 쓸어야지.', name: '마당 쓰는 아이', x: 0.27, w: 90, h: 248, lines: ['어른들이 오늘은 하늘만 봐요.', '빗자루질도 안 시켜요. 히히.'] },
          { id: 'armil', pass: '이 고리를 이쪽으로 돌려 볼까.', show: 'armillary', pose: 'see-gasp', sora: '고리가 겹겹이야!', memo: '고리를 돌려 별이 하늘 어디에 있는지 재는 기구란다.', name: '혼천의 보는 관원', x: 0.47, w: 131, h: 316, lines: ['이 대롱으로 별을 겨눈단다.', '고리의 눈금을 읽으면 별의 자리가 나오지.'] },
          { id: 'old', pass: '허어, 평생 처음이로다.', name: '늙은 관원', x: 0.37, w: 151, h: 311, lines: ['육십 평생 저런 별은 처음이오.', '해가 떴는데도 지지를 않소.'] },
          { id: 'yang', pass: '새 별이 천관 별 곁에 떴구나.', show: 'chart', pose: 'see-aha', sora: '별 그림에 빨간 점을 찍었어!', memo: '그날 적어 둔 덕분에 먼 훗날 사람들이 그 별의 자취를 찾아냈단다.', name: '천문 관원 양유덕', x: 0.69, w: 135, h: 320, lines: ['하늘에 없던 별은 손님별이라 한단다.', '언제 와서 언제 가는지 다 적어 두지.'] },
          { id: 'scribe', pass: '들은 대로 사각사각 적어야지.', name: '받아 적는 서리', x: 0.78, w: 95, h: 301, lines: ['날짜와 시각을 빠짐없이 적는다.', '훗날 누가 읽을지 모르니까.'] },
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
    // Who lived here, for a player who has not heard of them: the first slip of all (the user,
    // 2026.10.13: "사람들이 잘 모르는 문명에 대해서는 간략하게나마 소개하는 페이지를"). Written from memory, then looked up.
    intro: { title: '무굴 사람들', text: '무굴은 인도의 북쪽을 다스린 큰 나라란다. 임금 샤 자한이 먼저 떠난 왕비를 그리며 흰 돌 무덤을 지었지.' },
    first: '흰 돌 무덤을 한창 짓는 중이란다. 붉은 돌 한 알을 전해 주렴.',
    dir: 'agra1640', look: 'paper', pale: true,
    drawn: '무굴의 임금들이 아끼던 작고 꼼꼼한 그림처럼 그렸단다.',
    now: {
      photo: 'photo-now.webp', name: '타지마할의 지금 모습', when: '인도 아그라 · 오늘날',
      text: [
        '소라가 본 공사는 1648년에 무덤을 마쳤고, 1653년에 둘레 건물까지 다 마쳤습니다. 가운데 둥근 지붕은 꼭대기까지 73미터입니다.',
        '1666년 샤자한이 세상을 떠나자, 아들 아우랑제브가 그를 황후 곁에 묻었습니다. 두 사람의 진짜 무덤은 큰 방 아래 땅속 방에 있습니다.',
        '무덤 둘레 네 귀퉁이에 선 높은 탑 넷은 처음부터 바깥쪽으로 살짝 기울게 세웠습니다.',
        '더러운 공기 때문에 흰 돌이 누렇게 변하자, 인도는 둘레의 공장에서 석탄을 못 쓰게 하고 매연을 내는 차가 가까이 오지 못하게 했습니다.',
        '인도의 고고학 기관은 흰 돌에 진흙을 발랐다가 씻어 내는 방법으로 누런 때를 벗겨 냅니다.',
        '1983년에 유네스코 세계유산이 되었습니다. 2022년 4월부터 1년 동안 500만 명쯤이 다녀갔습니다. 금요일에는 문을 닫습니다.',
      ],
      credit: '사진: Yann, King of Hearts, 위키미디어 공용, CC BY-SA 4.0',
    },
    scenes: [
      {
        id: 'site', name: '인도 아그라 강가 공사터', short: '강가 공사터', zoom: 1.06, ground: 0.8, scale: 0.62, air: 'masons', floor: 'dirt',
        sora: '하얀 지붕이 발판에 싸여 있어!',
        people: [
          { id: 'mason', pass: '깡, 깡. 흰 돌가루가 날리는구나.', name: '돌 깎는 석공', x: 0.19, w: 85, h: 275, lines: ['이 흰 돌은 먼 마크라나에서 왔단다.', '먼 길을 실려 온 귀한 돌이지.'] },
          { id: 'clerk', pass: '오늘 품삯이… 어디 보자.', name: '장부 적는 서기', x: 0.28, w: 114, h: 282, lines: ['일꾼이 하도 많아 이름 적기도 벅차.', '벌써 여러 해째 짓고 있단다.'] },
          { id: 'mahout', pass: '영차, 우리 코끼리 힘내라!', show: 'elephant', pose: 'see-wow', sora: '코끼리가 돌을 끌어!', memo: '무거운 대리석은 코끼리가 끌어 올렸단다.', name: '코끼리 몰이꾼', x: 0.4, w: 103, h: 297, lines: ['큰 돌은 우리 코끼리가 끈단다.', '비탈길을 하루에도 몇 번씩 오르지.'] },
          { id: 'mango', pass: '달디단 망고요!', show: 'mango', name: '망고 파는 아주머니', x: 0.52, w: 118, h: 262, lines: ['일하다 목마르면 망고가 제일이지.', '하나 먹어 보련?'],
            try: { id: 'eat-mango', verb: 'eat', name: '망고', face: 'yum', sora: '망고가 달콤해! 즙이 줄줄 흘러.' } },
          { id: 'girl', pass: '물 가져왔어요, 물!', name: '물 나르는 소녀', x: 0.63, w: 97, h: 264, lines: ['강에서 물을 길어다 날라.', '돌을 켤 때도 물이 많이 든대.'] },
          { id: 'boatman', pass: '배로 돌을 싣고 왔소!', name: '돌 싣고 온 뱃사공', x: 0.75, w: 80, h: 320, lines: ['무거운 돌은 강물로 실어 온다오.', '저 흰 지붕이 날마다 조금씩 자라지.'] },
          { id: 'jeweller', pass: '어디 보자, 보석 한 알이 비는구나.', name: '보석 장수', x: 0.85, w: 97, h: 296, lines: ['먼 나라에서 온 돌을 판단다.', '빛깔마다 고향이 다르지.'] },
        ],
        spots: [],
      },
      {
        id: 'yard', name: '인도 아그라 돌 다듬는 마당', short: '돌 다듬는 마당', zoom: 1.06, ground: 0.8, scale: 0.62, air: 'masons', floor: 'dirt',
        sora: '돌 켜는 소리가 쓱쓱 나!',
        people: [
          { id: 'cutter', pass: '돌을 켜야 하니 물 좀 부어라.', show: 'saw', pose: 'see-aha', sora: '돌을 꽃잎 모양으로 잘라!', memo: '색돌을 얇게 켜고 갈아서, 흰 돌에 판 홈에 꼭 맞게 박았단다.', name: '돌 켜는 장인', x: 0.19, w: 112, h: 274, lines: ['색돌을 꽃잎 모양으로 켠단다.', '머리카락만큼만 어긋나도 안 맞아.'] },
          { id: 'sorter', pass: '이 돌은 파랑, 저 돌은 초록.', show: 'stones', pose: 'see-gasp', sora: '돌 빛깔이 이렇게 많아?', memo: '파란 돌, 초록 돌, 붉은 돌. 꽃 한 송이에 여러 빛깔 돌이 들어갔단다.', name: '보석 고르는 아이', x: 0.29, w: 86, h: 216, lines: ['빛깔대로 그릇에 나눠 담아.', '파란 돌에는 금빛 점이 박혀 있어.'] },
          { id: 'tailor', pass: '터번 천 보고 가시오!', name: '옷 파는 아저씨', x: 0.4, w: 125, h: 281, lines: ['이 고장 나들이옷이란다.', '아이 것도 있지. 입어 보련?'],
            try: { id: 'wear-mughal', verb: 'wear', name: '무굴 나들이옷', outfit: 'mughal', sora: '숄이 나비 날개 같아!', memo: '무굴 사람들이 입던 긴 겉옷과 얇은 숄이란다.' } },
          { id: 'calligrapher', pass: '글씨는 위로 갈수록 크게 쓴단다.', show: 'letters', pose: 'see-aha', sora: '위쪽 글씨가 더 커!', memo: '높은 곳의 글씨를 더 크게 썼단다. 그래야 밑에서 보면 크기가 같아 보이지.', name: '글씨 쓰는 서예가', x: 0.56, w: 113, h: 285, lines: ['문 둘레의 글씨는 내가 쓴단다.', '높은 데 것은 일부러 더 크게 쓰지.'] },
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
          { id: 'carver', pass: '숨을 참고 톡, 톡 새겨야지.', name: '꽃 새기는 조각가', x: 0.42, w: 113, h: 261, lines: ['이 꽃은 돌을 깎아 도드라지게 했단다.', '한 번 잘못 치면 처음부터지.'] },
          { id: 'architect', pass: '왼쪽과 오른쪽이 똑같아야지.', name: '으뜸 건축가', x: 0.53, w: 149, h: 320, lines: ['이 집은 왼쪽과 오른쪽이 똑같단다.', '거울에 비춘 것처럼 지었지.'] },
          { id: 'polisher', pass: '대리석을 반들반들하게 닦아야지.', name: '대리석 닦는 일꾼', x: 0.65, w: 98, h: 270, lines: ['고운 모래로 문질러 윤을 낸단다.', '해가 뜨면 벽이 눈부시게 빛나지.'] },
          { id: 'visitor', pass: '오, 이런 솜씨는 처음 보오!', name: '먼 나라에서 온 보석상', x: 0.75, w: 128, h: 293, lines: ['프랑스에서 온 보석 장수요.', '이런 솜씨는 어디서도 못 봤소.'] },
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
              { id: 'E1', label: '"한 알이 빠졌대요"', sora: '보석 장수 아저씨가 보석 한 알이 빠졌대요.', says: '오, 이걸 찾고 있었단다. 고맙구나.' },
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
    // Who lived here, for a player who has not heard of them: the first slip of all (the user,
    // 2026.10.13: "사람들이 잘 모르는 문명에 대해서는 간략하게나마 소개하는 페이지를"). Written from memory, then looked up.
    intro: { title: '타히티 사람들', text: '넓은 태평양의 섬에 사는 뱃사람들이란다. 별과 물결을 읽어, 지도 없이 먼 바다를 건넜지.' },
    first: '오늘은 금성이 해 앞을 지나가는 날이란다. 코코넛을 전해 주렴.',
    dir: 'tahiti1769', look: 'paper',
    drawn: '백 년쯤 뒤 이 섬에 와서 살던 화가 고갱의 그림처럼 그렸단다.',
    now: {
      photo: 'photo-now.webp', name: '비너스 곶의 지금 모습', when: '프랑스령 폴리네시아 타히티 · 마타바이 만',
      text: [
        '곶의 이름은 지금도 "비너스 곶"입니다. 쿡이 이곳에 금성을 보는 관측소를 세워서 붙은 이름입니다.',
        '쿡의 요새는 남아 있지 않습니다. 관측 기구를 세웠던 자리에는 둥근 기둥이 서 있고, 기둥 꼭대기의 공은 금성을 나타냅니다.',
        '1867년, 망가레바섬에서 온 일꾼들이 곶에 등대를 세웠습니다. 남태평양에 처음 생긴 등대이고, 지금도 타히티에 하나뿐인 등대입니다.',
        '1797년에는 영국 런던선교회의 선교사들이 더프호를 타고 와서 이 바닷가에 내렸습니다. 곶에는 이들을 기리는 기념비도 있습니다.',
        '곶 둘레는 검은 모래 바닷가입니다. 나무 그늘과 잔디밭이 있어 지금은 사람들이 쉬러 옵니다.',
        '금성이 해 앞을 지나는 일은 아주 드뭅니다. 마지막은 2012년이었고, 다음은 2117년 12월입니다.',
      ],
      credit: '사진: Saga70, 위키미디어 공용, CC BY-SA 4.0',
    },
    scenes: [
      {
        id: 'beach', name: '남태평양 타히티 마타바이 만 바닷가', short: '마타바이 만', zoom: 1.06, ground: 0.8, scale: 0.62, air: 'market', floor: 'dirt',
        sora: '모래가 따끈따끈해! 저 배는 뭐지?',
        people: [
          { id: 'fisher', pass: '오늘 바다는 잔잔하군.', show: 'paddle', name: '카누 타는 어부', x: 0.19, w: 118, h: 320, lines: ['저 큰 배는 두 달 가까이 저기 서 있어.', '우리 카누는 옆에 팔이 달려서 안 뒤집혀.'],
            try: { id: 'use-paddle', verb: 'use', name: '카누의 노', label: '노 저어 볼래', sora: '영차! 어, 카누가 자꾸 옆으로 가!' } },
          { id: 'tapa', pass: '나무껍질을 탁탁 두드려 천을 만들지.', name: '천 두드리는 아주머니', x: 0.31, w: 113, h: 282, lines: ['나무껍질을 두드려서 천을 만들어.', '두드릴수록 넓고 얇아진단다.'],
            try: { id: 'wear-tapa', verb: 'wear', name: '나무껍질 옷', outfit: 'tapa', sora: '나무껍질 옷이 가볍고 바삭거려!', memo: '나무껍질을 물에 불려 두드려 만든 천이란다.' } },
          { id: 'tattoo', pass: '무늬를 톡톡 새기니 가만히 있거라.', show: 'tattoo', pose: 'see-gasp', sora: '뼈로 만든 빗이야!', memo: '이 섬 말로 "타타우"란다. 문신을 뜻하는 "타투"가 여기서 온 말이지.', name: '무늬 새기는 할아버지', x: 0.42, w: 107, h: 309, lines: ['뼈 빗에 검은 물을 묻혀 톡톡 친단다.', '배에서 온 젊은이도 팔에 새기고 갔지.'] },
          { id: 'coconut', pass: '코코넛 있어요!', name: '코코넛 파는 아주머니', x: 0.53, w: 98, h: 280, lines: ['코코넛 물은 더울 때 제일이야.', '못 하나면 한 아름 준단다.'] },
          { id: 'breadboy', pass: '앗 뜨거! 열매가 아직 뜨겁네.', show: 'breadfruit', name: '열매 굽는 소년', x: 0.63, w: 85, h: 244, lines: ['빵나무 열매야. 불에 구워 먹어.', '속이 하얗고 폭신폭신해.'],
            try: { id: 'eat-breadfruit', verb: 'eat', name: '구운 빵나무 열매', face: 'yum', sora: '갓 구운 빵 같아! 고구마 같기도 해.' } },
          { id: 'sailor', pass: '히히, 못 하나 주고 이만큼 받았지!', show: 'nail', pose: 'see-aha', sora: '못 하나에 이걸 다 줘?', memo: '이 섬에서는 쇠가 아주 귀했단다. 그래서 못 하나가 보물이었지.', name: '못을 든 선원', x: 0.74, w: 116, h: 311, lines: ['여기선 못이 돈이야.', '단추 하나로도 과일 한 바구니를 줘.'] },
          { id: 'shipboy', pass: '와, 모래가 뜨거워!', name: '배의 심부름 소년', x: 0.85, w: 89, h: 287, lines: ['대위님은 오늘 요새에서 해를 보신대.', '금성이 해 앞을 지나간다나 봐.'] },
        ],
        spots: [],
      },
      {
        id: 'gate', name: '남태평양 타히티 포트 비너스 문 앞', short: '요새 문 앞', zoom: 1.06, ground: 0.8, scale: 0.62, air: 'hush', floor: 'dirt',
        sora: '말뚝 담이다! 요새인가 봐.',
        people: [
          { id: 'painter', pass: '저리 가, 파리들아!', show: 'flies', pose: 'see-gasp', sora: '파리가 그림을 먹었어!', memo: '파리 떼가 물감을 갉아 먹어서 화가가 애를 먹었단다.', name: '배의 화가', x: 0.14, w: 85, h: 276, lines: ['이 섬의 풀과 꽃을 다 그리는 중이야.', '칠하자마자 파리가 물감을 먹어 버려.'] },
          { id: 'botanist', pass: '오, 이것도 처음 보는 풀!', name: '풀 모으는 학자', x: 0.23, w: 104, h: 271, lines: ['이 섬의 풀은 거의 다 처음 본다네.', '말려서 종이 사이에 끼워 가져가지.'] },
          { id: 'smith', pass: '깡깡, 새 못이 다 됐어요!', name: '배의 대장장이', x: 0.34, w: 90, h: 266, lines: ['배에서 쓸 못과 쇠를 벼린다오.', '섬사람들이 쇠라면 눈을 못 떼지.'] },
          { id: 'galley', pass: '어휴, 덥다 더워.', name: '배의 요리사', x: 0.46, w: 103, h: 260, lines: ['오늘은 불 앞에 서기가 싫구먼.', '온도계가 이렇게 오른 건 처음이래.'] },
          { id: 'girl', pass: '안에 뭐가 있을까?', name: '궁금한 소녀', x: 0.57, w: 59, h: 207, lines: ['어른들이 긴 통으로 해를 봐.', '해를 보면 눈 아프다고 했는데.'] },
          { id: 'chief', pass: '허허, 오늘은 다들 바쁘구먼.', name: '타히티의 족장', x: 0.68, w: 102, h: 304, lines: ['이 사람들과 나는 친구란다.', '과일과 돼지를 보내 주곤 하지.'] },
          { id: 'sentry', pass: '멈춰라! 누구냐!', name: '문 지키는 보초', x: 0.85, w: 87, h: 320, lines: ['요새는 내가 지킨다.', '땀이 비 오듯 하는구나.'] },
        ],
        spots: [],
      },
      {
        id: 'fort', name: '남태평양 타히티 포트 비너스 관측 터', short: '관측 터', zoom: 1.06, ground: 0.8, scale: 0.62, air: 'hush', floor: 'dirt',
        sora: '망원경이다! 다들 하늘만 봐.',
        people: [
          { id: 'caller', pass: '똑딱똑딱, 초를 틀리면 안 되지.', name: '시계 읽는 선원', x: 0.15, w: 96, h: 318, lines: ['시계가 몇 초인지 소리쳐 주는 일이야.', '한 번이라도 틀리면 큰일이지.'] },
          { id: 'captain', pass: '시각을 정확히 적게.', show: 'quadrant', pose: 'see-aha', sora: '놋쇠로 만든 부채 같아!', memo: '한 달 전에 도둑맞았다가 조각난 채로 되찾은 기구란다.', name: '쿡 대위', x: 0.26, w: 101, h: 320, lines: ['이 기구로 별의 높이를 잰다.', '이게 없으면 여기까지 온 보람이 없지.'] },
          { id: 'kid', pass: '나도 볼래, 나도!', name: '망원경이 궁금한 아이', x: 0.36, w: 71, h: 201, lines: ['저 통에 눈을 대면 해가 커진대.', '아저씨들이 종일 저것만 봐.'] },
          { id: 'green', pass: '저 점이 해에 들어선다… 지금!', show: 'transit', pose: 'see-wow', sora: '해에 까만 점이 있어!', memo: '저 점이 금성이란다. 해 앞을 한나절에 걸쳐 지나갔지.', name: '천문학자 그린', x: 0.47, w: 101, h: 303, lines: ['금성이 해 앞을 지나는 날이란다.', '끝날 때까지 눈을 뗄 수가 없어.'] },
          { id: 'clerk', pass: '부르시는 시각을 사각사각 적어요.', name: '받아 적는 서기', x: 0.6, w: 93, h: 302, lines: ['부르시는 시각을 다 받아 적어.', '세 분이 본 시각이 조금씩 달라.'] },
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
    // She is set down in the neighbour's yard, among those watching the television (the user,
    // 2026.10.13: "스타트 장소를 이웃집 마당으로 옮겨"); the lane is to her left.
    dir: 'yard', look: 'paper', talk: 'face', night: true, begin: 'yard',
    now: {
      photo: 'photo-now.webp', name: '그날 그 달의 지금 모습', when: '달 고요의 바다 · 달 궤도선이 위에서 찍음',
      text: [
        '2009년 7월, 달을 도는 탐사선 LRO가 아폴로 11호가 내린 고요의 바다를 찍었습니다. 40년 만에 다시 본 착륙 자리였습니다.',
        '2011년 11월에는 LRO가 달 표면 위 24킬로미터까지 낮게 날며 더 또렷한 사진을 찍었습니다.',
        '착륙선의 아랫부분은 지금도 그 자리에 있습니다. 사진에는 두 사람이 걸어 다닌 자국이 어두운 줄로 보입니다.',
        '과학자들은 두 사람이 두고 온 거울에 레이저를 쏘아, 지금도 지구에서 달까지의 거리를 잽니다. 달은 해마다 3.8센티미터쯤 멀어집니다.',
        '올드린은 달을 떠날 때 엔진 바람에 깃발이 쓰러졌다고 말했습니다. 궤도에서 찍은 사진도 그 말과 맞습니다.',
        '달에는 바람도 비도 없어 발자국이 그대로 남습니다. 하늘에서 떨어지는 작은 돌만이 그 자국을 조금씩 지웁니다.',
      ],
      credit: '사진: NASA, GSFC, 애리조나 주립대, 위키미디어 공용, 공개 저작물',
    },
    scenes: [
      {
        id: 'lane', name: '대한민국 할머니의 마을 길', short: '마을 길', zoom: 1.3, ground: 0.698, scale: 0.66, air: 'night', floor: 'dirt',
        sora: '밤인데 다들 어디로 가?',
        // Children run along the lane and in at the open gate.
        moving: [
          { kind: 'drift', id: 'kids', src: 'kids', from: 0, to: 0.645, foot: 0.695, tall: 0.13, wide: 0.379, gap: 0.9, speed: 0.07, bob: 0.006 },
        ],
        people: [
          { id: 'shop', pass: '어여 와라. 시원한 거 있다.', show: 'cider', name: '구멍가게 아주머니', x: 0.159, w: 129, h: 297, lines: ['사이다 한 병 줄까? 찬물에 담가 놨다.', '다들 테레비 보러 가서 가게가 비었네.'],
            try: { id: 'eat-cider', verb: 'eat', name: '사이다', face: 'yum', sora: '사이다가 톡 쏴! 진짜 차가워.' } },
          { id: 'kettle', pass: '어이쿠, 넘치겠네.', name: '주전자 든 아저씨', x: 0.26, w: 137, h: 320, lines: ['막걸리 받아 가는 길이여.', '달나라 구경에 술이 빠지면 쓰나.'] },
          { id: 'grandpa', pass: '허허, 덥구먼.', name: '부채 든 할아버지', x: 0.38, w: 155, h: 314, lines: ['살다 살다 달에 사람이 가는구먼.', '계수나무는 어찌 됐나 물어봐야지.'] },
          { id: 'dog', pass: '컹!', name: '누렁이', x: 0.47, w: 84, h: 125, lines: ['멍멍!', '(꼬리를 흔든다)'] },
          { id: 'runboy', pass: '빨리 와! 테레비에 달 나온대!', show: 'rabbit', pose: 'see-gasp', sora: '달에 토끼가… 없어?', memo: '그날 아이들이 방송국에 전화를 걸었단다. 달에 토끼가 안 보인다고.', name: '뛰어가는 아이', x: 0.57, w: 113, h: 213, lines: ['빨리 와! 테레비에 달 나온대!', '근데 토끼가 안 보인대!'] },
          { id: 'sister', pass: '자장자장…', name: '동생 업은 누나', x: 0.8, w: 118, h: 269, lines: ['동생 재우고 가야 하는데.', '업고라도 가서 볼 거야.'] },
        ],
        spots: [],
      },
      {
        id: 'yard', name: '대한민국 할머니의 마을 이웃집 마당', short: '이웃집 마당', zoom: 1.3, ground: 0.7, scale: 0.66, air: 'tv', floor: 'dirt',
        sora: '다들 텔레비전만 봐. 조용해.',
        moving: [
          { kind: 'drift', id: 'in', src: 'villagers', from: 0, to: 1, foot: 0.696, tall: 0.17, wide: 0.29, gap: 0.8, speed: 0.024, bob: 0.003 },
        ],
        people: [
          { id: 'owner', pass: '어여 와. 테레비 구경하고 가.', show: 'tv', pose: 'see-peer', sora: '어? 화면이 거꾸로야!', memo: '달에서 온 첫 화면은 거꾸로였단다. 사진기가 거꾸로 달려 있었거든.', name: '집주인 아저씨', x: 0.119, w: 105, h: 308, lines: ['마루 끝에 내놨지. 다들 보라고.', '동네에 한 대뿐인 테레비여.'] },
          { id: 'melon', pass: '수박 먹어라, 수박.', show: 'melon', name: '수박 든 아주머니', x: 0.3, w: 110, h: 292, lines: ['수박 먹고들 봐요. 우물에 담갔던 거야.', '낮에도 봤는데 또 봐도 신기해.'],
            try: { id: 'eat-melon', verb: 'eat', name: '수박', face: 'yum', sora: '수박을 우물에 담가서 시원해!' } },
          { id: 'corn', pass: '냠냠, 옥수수가 맛있다.', name: '옥수수 먹는 아이', x: 0.44, w: 87, h: 214, lines: ['저 아저씨들 통통 뛰어다녀!', '달에서는 몸이 가볍대.'] },
          { id: 'chief', pass: '다들 조용! 이제 달 나온다!', name: '이장님', x: 0.56, w: 134, h: 320, lines: ['서울 남산에선 큰 화면으로 본다네.', '온 세상이 같이 보고 있다는구먼.'] },
          { id: 'soldier', pass: '충성! …아, 버릇이네요.', name: '휴가 나온 군인', x: 0.816, w: 97, h: 303, lines: ['휴가 나왔다가 이걸 다 보네요.', '로켓이 나흘을 날아갔답니다.'] },
          { id: 'sleepy', pass: '하암… 졸려요.', name: '졸린 꼬마', x: 0.881, w: 78, h: 198, lines: ['졸려… 그래도 다 볼 거야.', '(눈을 비빈다)'] },
        ],
        spots: [
          // She stands a little to the girl's right, so as not to hide her.
          { id: 'girl', from: 0.715, to: 0.8, sora: '저 애가… 할머니야?', memo: '그래, 평상 끝의 그 단발머리가 나란다.' },
        ],
      },
      {
        id: 'bank', name: '대한민국 할머니의 마을 냇가 둑길', short: '냇가 둑길', zoom: 1.25, ground: 0.74, scale: 0.86, air: 'night', floor: 'dirt',
        sora: '달이 떴어. 조용하다.',
        moving: [
          { kind: 'drift', id: 'stroll', src: 'villagers', from: 0, to: 1, foot: 0.736, tall: 0.17, wide: 0.29, gap: 1.4, speed: -0.02, bob: 0.003, flip: true },
        ],
        people: [
          { id: 'radio', pass: '쉿, 중계 나와요. 들어 봐요.', show: 'radio', pose: 'see-aha', sora: '건전지를 고무줄로 묶었구나!', name: '라디오 든 청년', x: 0.123, w: 95, h: 249, lines: ['라디오로도 중계를 해 줘요. 볼래요?', '지금도 둘은 달 위에 있대요.'],
            try: { id: 'use-radio', verb: 'use', name: '라디오', label: '라디오 들어 볼래', sora: '지지직… 사람 목소리가 나와.' } },
          { id: 'schoolgirl', pass: '달이 참 예쁘다.', name: '여학생', x: 0.21, w: 74, h: 200, lines: ['나도 커서 달에 가 보고 싶어.', '선생님이 꼭 보라고 하셨어.'] },
          { id: 'granny', pass: '세상 참 좋아졌어.', name: '달 보는 할머니', x: 0.34, w: 99, h: 217, lines: ['저 달에 사람이 갔다니, 원.', '토끼는 놀라 달아났겠구먼.'] },
          { id: 'point', pass: '저기 봐, 저기 달이야!', name: '달을 가리키는 아이', x: 0.63, w: 72, h: 192, lines: ['저기! 저기 사람이 있대!', '손 흔들면 보일까?'] },
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
        '올림픽주경기장은 1984년 9월 29일에 문을 열었습니다. 1986년 아시안게임도 이곳에서 열렸습니다.',
        '건축가 김수근이 설계했습니다. 경기장 겉모습의 휜 선은 조선 백자의 곡선에서 따 왔습니다.',
        '1988년 10월에는 장애가 있는 선수들의 올림픽인 패럴림픽도 이곳에서 열렸습니다.',
        '서울시는 경기장 안을 새로 고치면서도 겉모습과 지붕은 처음 모습 그대로 두기로 했습니다.',
        '곁의 잠실 야구장은 지붕이 있는 새 야구장으로 다시 짓기로 했습니다.',
        '사진 앞쪽에 보이는 것은 잠실 야구장이고, 그 뒤의 둥근 건물이 올림픽주경기장입니다.',
      ],
      credit: '사진: Seoul Institute, 위키미디어 공용, CC BY 4.0',
    },
    scenes: [
      {
        id: 'road', name: '대한민국 서울 잠실 올림픽로', short: '올림픽로', zoom: 1.08, ground: 0.72, scale: 0.62, air: 'road',
        sora: '가게마다 호랑이 인형이야!',
        people: [
          { id: 'tourist', pass: '오우, 어디로 가지…', name: '외국인 관광객', x: 0.18, w: 148, h: 320, lines: ['160개국에서 참여했대요. 나도 왔죠!', '동쪽 서쪽이 다 모였어요.'] },
          { id: 'caller', pass: '여보세요? 나야, 나.', name: '전화 거는 회사원', x: 0.28, w: 132, h: 307, lines: ['집에 걸었어. 텔레비전 켜 두라고.', '컬러 방송이 여덟 해째거든.'] },
          { id: 'gimbap', pass: '김밥이요, 김밥!', show: 'clock', pose: 'see-aha', sora: '시계를 한 시간 앞으로 돌렸네!', memo: '그해에는 온 나라가 시계를 한 시간 앞당겨 썼단다.', name: '김밥 장수', x: 0.42, w: 145, h: 297, lines: ['열 시 반에 벌써 시작했어.', '올해는 시계를 한 시간 당겨 쓰잖아. 썸머 타임이라고 하던가?'],
            try: { id: 'eat-gimbap', verb: 'eat', name: '김밥', face: 'yum', sora: '참기름 냄새! 한 줄 다 먹을래.' } },
          { id: 'vendor', pass: '호돌이 사 가세요, 호돌이!', show: 'hodori', pose: 'see-wow', sora: '상모 쓴 호랑이네! 귀엽다.', memo: '상모의 긴 끈은 서울의 S란다. 이름은 이천이백 통에서 뽑았지. 짝은 호순이야.', name: '기념품 장수', x: 0.58, w: 177, h: 319, lines: ['호돌이요. 상모 쓴 아기 호랑이.', '이름은 온 국민이 지어 보냈다오.'],
            try: { id: 'wear-sangmo', verb: 'wear', name: '상모', outfit: 'sangmo', sora: '고개를 돌리니 상모 띠가 빙글빙글!', memo: '농악에서 쓰는 모자란다. 호돌이도 이걸 썼지.' } },
          { id: 'flagboy', pass: '대한민국! 짝짝짝!', name: '깃발 든 아이', x: 0.69, w: 133, h: 276, lines: ['버스 타고 왔어. 나는 칠십 원!', '토큰 말고 회수권 냈어.'] },
          { id: 'guide', pass: '경기장은 이쪽이에요!', name: '자원봉사 누나', x: 0.78, w: 159, h: 299, lines: ['길 안내를 맡았어요. 저쪽이에요.', '자원봉사자가 이만 칠천 명이에요.'] },
          { id: 'traffic', pass: '삐익! 이쪽으로, 이쪽!', name: '교통 정리 아저씨', x: 0.86, w: 183, h: 310, lines: ['천천히, 밀지 말고 가시오.', '칠만 명이 넘게 왔다니, 원.'] },
        ],
        spots: [],
      },
      {
        id: 'gate', name: '대한민국 서울 잠실 올림픽주경기장 앞', short: '주경기장 앞', zoom: 1.2, ground: 0.75, scale: 0.66, air: 'court',
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
        id: 'stand', name: '대한민국 서울 잠실 올림픽주경기장 안', short: '주경기장 안', zoom: 1.06, ground: 0.8, scale: 0.62, air: 'hush',
        sora: '어? 왜 이렇게 조용해?',
        people: [
          { id: 'granny', pass: '아이고, 좋은 날이다.', name: '눈물 닦는 할머니', x: 0.14, w: 140, h: 300, lines: ['내 생전에 이런 걸 다 보는구나.', '온 세상 사람이 우리 집에 왔어.'] },
          { id: 'drinks', pass: '(작게) 음료수 있어요…', name: '음료 파는 아이', x: 0.24, w: 150, h: 311, lines: ['지금은 조용히 팔아야 해요.', '태권도 때는 다들 소리쳤는데.'] },
          { id: 'binoc', pass: '쉿… 저 아이 좀 봐.', show: 'hoop', pose: 'see-peer', sora: '저 아이가 넓은 운동장에 혼자야.', memo: '서울이 올림픽을 따낸 날 태어난 아이란다. 나는 텔레비전으로 봤지.', name: '쌍안경 든 아가씨', x: 0.37, w: 154, h: 314, lines: ['국민학교 일학년이래. 혼자 나왔어.', '한가운데서 손을 흔들었어!'],
            try: { id: 'use-binoc', verb: 'use', name: '쌍안경', label: '쌍안경 들여다볼래', sora: '손을 흔들어! 나도 흔들래.' } },
          { id: 'hush', pass: '(숨을 죽인다)', name: '숨죽인 아이', x: 0.6, w: 106, h: 262, lines: ['쉿! 지금은 조용히 하는 거래.', '아까는 태권도 형들이 천 명이었어.'] },
          { id: 'official', pass: '뷰티풀… 원더풀.', name: '외국 선수단 임원', x: 0.69, w: 130, h: 320, lines: ['아이 하나에 온 경기장이 조용하오.', '이런 개회식은 처음 보오.'] },
          { id: 'fan', pass: '저기 봐, 성화에 불이 붙었어!', show: 'cauldron', pose: 'see-wow', sora: '세 사람이 같이 붙였구나!', memo: '선생님, 달리기 선수, 춤추는 학생. 세 사람이 함께 붙였단다.', name: '부채 든 아저씨', x: 0.8, w: 148, h: 317, lines: ['성화는 세 사람이 같이 붙였어.', '승강기를 타고 저 위로 올라갔지.'] },
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
        '벽화가 있는 옛 수도원 식당은 산타 마리아 델레 그라치에 성당 바로 옆에 붙어 있습니다.',
        '1943년 8월 15일 밤, 전쟁 중 폭탄이 떨어져 식당 대부분이 무너졌습니다. 그러나 미리 모래주머니로 감싸 둔 벽화 쪽 벽은 무너지지 않았습니다.',
        '그림은 다 그린 지 몇 해 만에 벗겨지기 시작해 여러 번 고쳤습니다. 마지막으로 크게 고친 일은 1977년부터 1999년까지 22년이 걸렸습니다.',
        '벽화 맞은편 벽에는 몬토르파노가 1495년에 그린 \'십자가에 못 박힌 예수\' 그림이 있습니다.',
        '1980년에 성당과 수도원이 벽화와 함께 유네스코 세계유산이 되었습니다.',
        '그림을 지키려고 방 안의 공기를 늘 맞춥니다. 미리 표를 사야 하고, 한 번에 40명씩 15분 동안만 볼 수 있습니다.',
      ],
      credit: '사진: Carlo Dell’Orto, 위키미디어 공용, CC BY-SA 3.0',
    },
    scenes: [
      {
        id: 'court', name: '이탈리아 밀라노 코르테 베키아 뜰', short: '코르테 베키아', zoom: 1.09, ground: 0.74, scale: 0.638, air: 'court',
        sora: '옛 궁전 뜰이래. 저 말 좀 봐!',
        people: [
          { id: 'salai', pass: '헤헤, 스승님 공책이다.', show: 'mirror', name: '화가의 제자', x: 0.18, w: 151, h: 302, lines: ['스승님은 글씨를 거꾸로 써.', '거울에 비춰야 읽혀. 볼래?'],
            then: [{ after: 'letter', lines: ['스승님? 방금 나가셨어.', '대성당 뒤 나루 쪽으로 가셨을걸.'] }],
            try: { id: 'use-mirror', verb: 'use', name: '거울', label: '거울 비춰 볼래', sora: '거울에 비추니 글씨가 똑바로야!', memo: '레오나르도는 글씨를 오른쪽에서 왼쪽으로 썼단다.' } },
          { id: 'clayboy', pass: '영차, 갈라진 데 메워야지!', name: '진흙 나르는 견습생', x: 0.26, w: 116, h: 274, lines: ['이 말은 전부 흙으로 빚었어.', '어른 키의 네 배가 넘는대.'] },
          { id: 'founder', pass: '에휴, 말에 부을 청동이 없어졌소.', name: '쇠 녹이는 장인', x: 0.34, w: 124, h: 318, lines: ['청동을 부어 굳히려던 말이오.', '그 청동은 대포 만들러 가 버렸소.'] },
          { id: 'pacioli', pass: '모서리가 몇 개인고…', show: 'solid', pose: 'see-aha', sora: '도형 속이 다 들여다보여!', memo: '수학 선생의 책에 레오나르도가 그림을 그려 주었단다.', name: '수학 선생 수도사', x: 0.64, w: 142, h: 318, lines: ['내 책의 그림은 그 친구가 그렸네.', '뼈대만 그려서 뒤쪽까지 보이지.'] },
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
        id: 'dock', name: '이탈리아 밀라노 대성당 뒤 나루', short: '대성당 나루', zoom: 1.07, ground: 0.76, scale: 0.626, air: 'market',
        sora: '성당을 아직 짓는 중이네!',
        people: [
          { id: 'armourer', pass: '땅, 땅! 밀라노 갑옷이오!', name: '갑옷 장인', x: 0.17, w: 165, h: 310, lines: ['밀라노 갑옷은 먼 나라에서도 사 가오.', '한번 입어 보겠소? 꽤 무겁소.'],
            try: { id: 'wear-armor', verb: 'wear', name: '밀라노 갑옷', outfit: 'armor', sora: '갑옷이 철컹철컹! 걷기 힘들어.', memo: '그때 밀라노는 갑옷으로 이름난 도시였단다.' } },
          { id: 'melon', pass: '멜론이오, 단 멜론!', show: 'cantaloupe', name: '멜론 파는 아주머니', x: 0.28, w: 167, h: 291, lines: ['한낮엔 멜론이 제일이지.', '화가 양반 댁도 멜론을 사 간다우.'],
            try: { id: 'eat-melon', verb: 'eat', name: '멜론', face: 'yum', sora: '멜론이 달고 시원해! 꿀 같아.' } },
          { id: 'waterboy', pass: '물이오, 비켜요!', name: '물 긷는 소년', x: 0.37, w: 160, h: 273, lines: ['화가 아저씨? 방금 지나갔어.', '땡볕에 수도원 쪽으로 걸어갔어.'] },
          { id: 'boatman', pass: '성당에 쓸 돌을 싣고 왔소!', show: 'marble', pose: 'see-aha', sora: '돌에 글자가 있어. A, U, F?', memo: '"성당 짓는 데 쓴다"는 라틴말의 첫 글자란다. 이 표시가 있으면 뱃길에서 돈을 안 냈지.', name: '대리석 배 뱃사공', x: 0.5, w: 160, h: 320, lines: ['먼 호숫가 산에서 물길로 왔소.', '성당 돌은 뱃길에서 돈을 안 내오.'] },
          { id: 'mason', pass: '깡, 깡. 돌가루 조심!', name: '대성당 석공', x: 0.76, w: 135, h: 304, lines: ['이 성당은 백 년 넘게 짓고 있소.', '내 손자 때나 다 될는지, 원.'] },
          { id: 'laundress', pass: '아이, 볕이 따갑기도 하지.', name: '빨래하는 처녀', x: 0.63, w: 153, h: 292, lines: ['이 물길로 배가 도시 안까지 와요.', '돌도 장작도 다 배로 온답니다.'] },
          { id: 'silk', pass: '비단이오, 고운 비단!', name: '비단 장수', x: 0.86, w: 169, h: 318, lines: ['수도원은 서쪽 성문 쪽이라오.', '식당 벽 그림이 몇 해째라지요.'] },
        ],
        spots: [],
      },
      {
        id: 'hall', name: '이탈리아 밀라노 그라치에 수도원 식당', short: '수도원 식당', zoom: 1.15, ground: 0.7, scale: 0.673, air: 'hush',
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
          { id: 'grinder', pass: '물감을 쓱쓱 곱게 갈아야지.', name: '물감 개는 조수', x: 0.33, w: 138, h: 306, lines: ['마른 벽에 달걀 물감으로 그려요.', '그래서 며칠 뒤에도 고칠 수 있죠.'] },
          { id: 'carpenter', pass: '실이 팽팽해야 하오.', show: 'nail', pose: 'see-peer', sora: '못 하나에서 줄이 다 나와!', memo: '한가운데 못을 박고 실을 당겨 줄을 그었단다. 못 자국이 지금도 있지.', name: '발판 세운 목수', x: 0.41, w: 163, h: 303, lines: ['한가운데 못에 실을 매어 당겼소.', '그림 속 줄이 다 그리로 모이오.'] },
          { id: 'cook', pass: '오늘 저녁은 장어라오.', show: 'eel', pose: 'see-wow', sora: '그림 속 접시에 장어가 있어!', memo: '구운 장어와 오렌지. 그때 귀하게 치던 요리를 그려 넣었단다.', name: '부엌 수도사', x: 0.5, w: 165, h: 272, lines: ['식탁 그림에 우리 음식이 있다오.', '구운 장어에 오렌지 조각이지.'] },
          { id: 'novice', pass: '(위를 올려다본다)', name: '어린 수련 수도사', x: 0.8, w: 124, h: 268, lines: ['한 번 그으려고 한 시간을 보세요.', '그리는 날은 밥도 잊고 저물 때까지요.'] },
          { id: 'secretary', pass: '공작님이 또 물으시오.', name: '공작의 비서', x: 0.87, w: 150, h: 306, lines: ['유월에도 재촉하는 편지가 왔소.', '또 보내셨다니, 공작님도 참.'] },
        ],
        spots: [
          // Leonardo on the scaffold: seen, not spoken to.
          { id: 'leonardo', from: 0.58, to: 0.7, see: [0.6, 0.24, 0.672, 0.45], sora: '찾았다! 그런데 붓을 들고 보기만 해.', memo: '붓질 한두 번만 하고 가 버리는 날도 있었단다. 그 그림이 "최후의 만찬"이야.' },
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
    // Who lived here, for a player who has not heard of them: the first slip of all (the user,
    // 2026.10.13: "사람들이 잘 모르는 문명에 대해서는 간략하게나마 소개하는 페이지를"). Written from memory, then looked up.
    intro: { title: '아스테카 사람들', text: '지금의 멕시코, 호수 한가운데 섬에 큰 도시를 지은 사람들이란다. 호수에 흙을 쌓아 밭을 만들고 옥수수를 길렀지.' },
    first: '호수 위의 도시에 낯선 손님이 온 날이란다. 꽃목걸이를 전해 주렴.',
    dir: 'tenoch1519', look: 'paper', pale: true,
    drawn: '아스테카 사람들이 돌에 새기고 색을 칠하던 것처럼 그렸단다.',
    // (What is said of today: written from memory and then looked up, 2026.10.13.)
    now: {
      photo: 'photo-now.webp', name: '큰 신전의 지금 모습', when: '멕시코 멕시코시티 · 템플로 마요르',
      text: [
        '1521년, 스페인 사람들은 큰 신전을 허물었습니다. 신전 구역의 서쪽 절반에는 뒷날 큰 성당이 섰습니다.',
        '1978년 2월 21일, 전기 회사 일꾼들이 땅을 파다가 여신 코욜샤우키를 새긴 커다란 둥근 돌을 찾았습니다.',
        '그 뒤 1978년부터 1982년까지 고고학자 에두아르도 마토스 목테수마가 신전 터를 파냈습니다.',
        '신전은 1325년쯤 처음 지은 뒤 여섯 번이나 그 위에 덧지었습니다. 그래서 일곱 겹의 신전이 양파처럼 겹쳐 있습니다.',
        '1987년, 터 옆에 템플로 마요르 박물관이 문을 열었습니다. 같은 해 멕시코시티 옛 시가지가 유네스코 세계유산이 되었습니다.',
        '지금은 멕시코시티 한가운데, 큰 성당 바로 옆에 신전 터가 드러나 있습니다.',
      ],
      credit: '사진: Diego Delso, 위키미디어 공용, CC BY-SA 3.0',
    },
    scenes: [
      {
        id: 'canal', name: '아스테카 테노치티틀란 물길 어귀', short: '물길 어귀', zoom: 1.12, ground: 0.715, scale: 0.655, air: 'market', floor: 'dirt',
        sora: '집이 물 위에 떠 있어!',
        people: [
          { id: 'canoe', pass: '밭에 다녀오는 길이오.', show: 'chinampa', pose: 'see-wow', sora: '밭이 물 위에 떠 있어!', memo: '호수 바닥의 진흙을 퍼 올려 물 위에 만든 밭이란다. 치남파라고 했지.', name: '카누 젓는 아저씨', x: 0.19, w: 147, h: 320, lines: ['우리 밭은 물 위에 있단다.', '진흙을 퍼 올려 쌓으면 밭이 되지.'] },
          { id: 'maize', pass: '옥수수를 쓱쓱 갈고 있어요.', name: '옥수수 가는 아주머니', x: 0.3, w: 125, h: 306, lines: ['옥수수를 갈아 얇게 부쳐 먹는단다.', '아침마다 온 동네가 이 소리지.'] },
          { id: 'kid', pass: '물고기다, 물고기!', name: '물가의 아이', x: 0.4, w: 125, h: 228, lines: ['우리 집 앞이 바로 물길이야.', '카누 타고 어디든 가.'] },
          { id: 'weaver', pass: '베를 한 줄씩 짜고 있어요.', name: '베 짜는 소녀', x: 0.51, w: 116, h: 288, lines: ['허리에 매고 짜는 베틀이야.', '내가 짠 옷이야. 입어 볼래?'],
            try: { id: 'wear-aztec', verb: 'wear', name: '아스테카의 옷', outfit: 'aztec', sora: '옷이 헐렁해서 시원해!', memo: '네모난 천을 이어 만든 윗옷이란다. 우이필이라고 했지.' } },
          { id: 'porter', pass: '영차, 길 좀 비켜 주오.', name: '짐꾼', x: 0.62, w: 140, h: 306, lines: ['짐은 사람이 등으로 나른단다.', '물길이 닿는 데는 카누로 가고.'] },
          { id: 'flower', pass: '꽃이 곱게 피었구나.', name: '꽃 엮는 할머니', x: 0.73, w: 121, h: 282, lines: ['우리 밭에서 딴 꽃이란다.', '오늘은 꽃이 아주 많이 쓰일 게다.'] },
          { id: 'fisher', pass: '오늘은 많이 잡혔네.', name: '어부', x: 0.85, w: 146, h: 298, lines: ['호수에서 잡은 물고기라오.', '이 도시는 호수가 먹여 살리지.'] },
        ],
        spots: [],
      },
      {
        id: 'market', name: '아스테카 테노치티틀란 큰 시장', short: '큰 시장', zoom: 1.16, ground: 0.69, scale: 0.678, air: 'market',
        sora: '콩으로 물건을 사네?',
        people: [
          { id: 'choco', pass: '거품 낸 초콜릿 물이오!', show: 'chocolate', name: '초콜릿 물 파는 아주머니', x: 0.18, w: 114, h: 241, lines: ['높이서 부어야 거품이 인단다.', '한 모금 마셔 보련?'],
            try: { id: 'eat-chocolate', verb: 'eat', name: '초콜릿 물', face: 'hmm', sora: '초콜릿 물이 써! 맵기까지 해!', memo: '그때 초콜릿은 달지 않았단다. 카카오 콩을 갈아 고추를 넣어 마셨지.' } },
          { id: 'feather', pass: '깃털이 날릴까 숨도 못 쉰다오.', show: 'feather', pose: 'see-gasp', sora: '깃털로 그림을 그려!', memo: '깃털을 한 올씩 겹쳐 붙여 무늬를 만들었단다. 그 장인을 아만테카라 불렀지.', name: '깃털 장인', x: 0.29, w: 103, h: 264, lines: ['깃털을 한 올씩 붙여 무늬를 낸단다.', '초록 긴 깃은 먼 숲에서 온 거야.'] },
          { id: 'veg', pass: '토마토요, 고추요!', name: '채소 장수', x: 0.4, w: 113, h: 233, lines: ['토마토도 고추도 이 땅의 열매란다.', '호박이랑 아보카도도 있지.'] },
          { id: 'turkey', pass: '골골, 칠면조가 살이 올랐소!', name: '칠면조 장수', x: 0.51, w: 113, h: 255, lines: ['칠면조 한 마리에 콩이 백 알이오.', '잔칫날에는 이놈이 빠질 수 없지.'] },
          { id: 'child', pass: '콩을 하나, 둘, 셋… 세는 중이야.', name: '심부름하는 아이', x: 0.62, w: 90, h: 185, lines: ['콩을 잘 세야 안 속아.', '속 빈 가짜 콩도 있대.'] },
          { id: 'pochteca', pass: '콩 세는 중이니 조용히.', show: 'cacao', pose: 'see-aha', sora: '여기서는 콩이 돈이야!', memo: '카카오 콩을 돈처럼 썼단다. 한 알에 토마토 하나, 서른 알에 토끼 한 마리였지.', name: '카카오 콩 상인', x: 0.73, w: 123, h: 252, lines: ['이 콩이 여기서는 돈이란다.', '콩 한 알이면 토마토가 하나지.'] },
          { id: 'overseer', pass: '저울 속이는 자 없느냐!', name: '시장 감독관', x: 0.85, w: 141, h: 320, lines: ['시장의 값과 되를 살피는 일을 한다.', '속이는 자는 가만두지 않지.'] },
        ],
        spots: [],
      },
      {
        id: 'causeway', name: '아스테카 테노치티틀란 호수 위 둑길', short: '호수 위 둑길', zoom: 1.15, ground: 0.7, scale: 0.673, air: 'hush',
        sora: '길이 호수를 가로질러!',
        people: [
          { id: 'sweeper', pass: '임금님 지나실 길을 쓸어야지.', name: '길 쓰는 사람', x: 0.18, w: 126, h: 240, lines: ['임금님이 지나실 길을 쓴단다.', '먼지 하나 없어야 하지.'] },
          { id: 'conch', pass: '뿌우우! 소라 나팔 소리 들리지?', name: '소라 나팔 부는 사람', x: 0.29, w: 126, h: 247, lines: ['바다 소라로 만든 나팔이란다.', '네 이름도 소라라고? 허허!'] },
          { id: 'noble', pass: '어험, 줄을 맞춰라.', name: '깃털 부채 든 귀족', x: 0.4, w: 162, h: 320, lines: ['오늘 임금님을 모시고 나왔단다.', '이런 손님맞이는 나도 처음이야.'] },
          { id: 'steward', pass: '손님께 걸 꽃이 모자라!', show: 'meeting', pose: 'see-wow', sora: '손님들이 사슴 같은 걸 타고 왔어!', memo: '바다 건너온 이들이 탄 말을 이곳 사람들은 처음에 사슴이라 불렀단다.', name: '꽃 맡은 시종', x: 0.51, w: 129, h: 239, lines: ['손님들 목에 걸어 줄 꽃이란다.', '하나라도 모자라면 큰일이지.'] },
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
      gate: { scene: 'market', open: 3, sora: '감독관이 길을 막고 있어. 못 가.' },
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
    // (What is said of today: written from memory and then looked up, 2026.10.13.)
    now: {
      photo: 'photo-now.webp', name: '대피라미드의 지금 모습', when: '이집트 기자 · 오늘날',
      text: [
        '4,500년이 지난 지금도 서 있습니다. 옛 세계 7대 불가사의 가운데 지금까지 남아 있는 것은 이 피라미드 하나뿐입니다.',
        '큰 돌 230만 개쯤으로 쌓았습니다. 다 지은 뒤 3,700년 넘게 세상에서 가장 높은 건축물이었습니다.',
        '겉을 덮었던 매끈한 흰 돌은 거의 다 뜯겨 나갔습니다. 1356년에 가까운 카이로에서 건물을 짓느라 가져갔다고 전합니다.',
        '처음 높이는 146.6미터였는데, 꼭대기 돌이 없어져 지금은 138.5미터입니다.',
        '2017년, 학자들은 우주에서 쏟아지는 아주 작은 알갱이로 피라미드 속을 들여다보았습니다. 그리고 길이 30미터가 넘는 빈 곳을 찾았는데, 무엇인지는 아직 모릅니다.',
        '1954년 피라미드 남쪽 구덩이에서 쿠푸 왕의 나무배가 나왔습니다. 이 배는 2025년에 문을 연 대이집트박물관에 있습니다.',
      ],
      credit: '사진: kallerna, 위키미디어 공용, CC BY-SA 3.0',
    },
    scenes: [
      {
        id: 'harbour', name: '이집트 기자 물길의 나루', short: '물길의 나루', zoom: 1.09, ground: 0.745, scale: 0.638, air: 'hush', floor: 'dirt',
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
          { id: 'rower', pass: '영차, 배가 다 왔다!', name: '뱃사공', x: 0.19, w: 127, h: 320, lines: ['강 건너 투라에서 흰 돌을 실어 왔지.', '열흘에 두세 번은 오간단다.'] },
          { id: 'roper', pass: '밧줄을 쉬지 않고 꼬는 중이란다.', name: '밧줄 꼬는 사람', x: 0.3, w: 129, h: 302, lines: ['돌을 끌려면 밧줄이 굵어야 해.', '하루에도 몇 타래를 꼰단다.'] },
          { id: 'watergirl', pass: '물이오, 시원한 물!', name: '물 긷는 아이', x: 0.4, w: 84, h: 245, lines: ['강물이 넘치는 철이라 물길이 깊어.', '그래서 큰 배가 여기까지 와.'] },
          { id: 'hauler', pass: '하나, 둘, 돌을 내리자!', name: '돌 내리는 일꾼', x: 0.51, w: 131, h: 304, lines: ['돌 하나가 황소 몇 마리 무게란다.', '지렛대와 굴림대로 내리지.'] },
          { id: 'linen', pass: '시원한 아마 옷이오.', name: '아마 옷 짓는 아주머니', x: 0.62, w: 118, h: 287, lines: ['풀 줄기로 짠 천이라 시원하단다.', '아이 옷도 있어. 입어 보련?'],
            try: { id: 'wear-egypt', verb: 'wear', name: '이집트의 옷', outfit: 'egypt', sora: '옷이 얇아서 바람이 솔솔 들어와!', memo: '아마라는 풀의 줄기로 짠 천이란다. 더운 나라에 딱 맞았지.' } },
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
          { id: 'brewer', pass: '맥주를 잘 걸러야지.', name: '맥주 빚는 아주머니', x: 0.18, w: 94, h: 279, lines: ['보리빵을 물에 불려 걸러 빚는단다.', '이건 어른들 마실 거야.'] },
          { id: 'butcher', pass: '고기 왔소, 고기!', name: '고기 나누는 사람', x: 0.29, w: 158, h: 280, lines: ['일꾼들 먹일 소와 양이란다.', '힘쓰는 사람은 잘 먹어야지.'] },
          { id: 'painter', pass: '우리 조가 으뜸이지!', show: 'gang', pose: 'see-aha', sora: '돌에 이름을 써 놨어!', memo: '일꾼들은 조를 짜서 일했고 조마다 이름이 있었단다. "쿠푸의 벗들" 같은 이름이지.', name: '조 이름 쓰는 일꾼', x: 0.4, w: 133, h: 273, lines: ['우리 조 이름을 돌에 써 두는 거야.', '끌려온 게 아니란다. 철 따라 와서 일하지.'] },
          { id: 'potter', pass: '빵틀이 또 깨졌네.', name: '빵틀 빚는 옹기장이', x: 0.51, w: 129, h: 275, lines: ['빵틀은 크기가 세 가지란다.', '그래야 빵을 똑같이 나눠 주지.'] },
          { id: 'kid', pass: '양파 먹을래?', name: '마을 아이', x: 0.62, w: 107, h: 199, lines: ['아빠는 돌 끄는 조야.', '나는 크면 서기가 될 거야.'] },
          { id: 'baker', pass: '갓 구운 빵이오!', show: 'bread', name: '빵 굽는 아주머니', x: 0.73, w: 145, h: 280, lines: ['흙 틀에 넣어 숯불에 묻어 굽는단다.', '하나 먹어 보련?'],
            try: { id: 'eat-bread', verb: 'eat', name: '원뿔 빵', face: 'yum', sora: '빵이 겉은 딱딱, 속은 쫀득해!', memo: '이 마을 자리에서는 깨진 빵틀 조각이 산더미로 나왔단다.' } },
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
          { id: 'puller', pass: '다 같이 줄을 끌자, 영차!', name: '줄 끄는 일꾼', x: 0.29, w: 133, h: 273, lines: ['돌이 이백만 개가 넘게 든다더구나.', '하나씩 끌다 보면 산이 되지.'] },
          { id: 'mason', pass: '돌을 톡톡 쳐서 반듯하게 다듬지.', show: 'casing', pose: 'see-wow', sora: '돌이 눈처럼 하얘!', memo: '겉은 강 건너 투라의 흰 돌로 매끈하게 덮었단다. 햇빛에 눈부셨지.', name: '겉돌 다듬는 석공', x: 0.4, w: 133, h: 295, lines: ['겉에 붙일 흰 돌을 다듬는단다.', '구리 정으로 톡톡 쳐 보겠니?'],
            try: { id: 'use-chisel', verb: 'use', name: '구리 정', sora: '정으로 치니까 돌가루가 날려!' } },
          { id: 'scribe', pass: '들어온 돌이 서른, 서른하나…', show: 'sled', pose: 'see-wow', sora: '모래에 물을 부으니 썰매가 쑥쑥 나가!', memo: '젖은 모래 위에서는 끄는 힘이 절반이면 된단다. 요즘 사람들이 재어 보았지.', name: '감독의 서기', x: 0.51, w: 130, h: 309, lines: ['들어온 돌을 하나하나 적는단다.', '적은 것은 안크하프 님께 올리지.'] },
          { id: 'surveyor', pass: '줄을 팽팽하게 당기시오!', name: '줄 재는 사람', x: 0.62, w: 105, h: 295, lines: ['매듭 지은 줄로 길이를 잰단다.', '조금만 틀려도 꼭대기가 안 맞아.'] },
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
    // Who lived here, for a player who has not heard of them: the first slip of all (the user,
    // 2026.10.13: "사람들이 잘 모르는 문명에 대해서는 간략하게나마 소개하는 페이지를"). Written from memory, then looked up.
    intro: { title: '나라 시대의 일본', text: '나라는 천삼백 해 전 일본의 서울이란다. 당나라에서 배우고 백제에서 온 사람들과 함께 큰 절과 큰 부처를 지었지.' },
    first: '오늘은 큰 부처님의 눈을 그려 넣는 날이란다. 비단 끈을 전해 주렴.',
    dir: 'nara752', look: 'paper', pale: true,
    drawn: '그 무렵 나라 사람들이 삼베에 먹으로 그리던 그림처럼 그렸단다.',
    // (What is said of today: written from memory and then looked up, 2026.10.13.)
    now: {
      photo: 'photo-now.webp', name: '큰 부처의 지금 모습', when: '일본 나라 · 도다이지',
      text: [
        '큰 부처는 지금도 도다이지의 큰 법당 안에 앉아 있습니다. 부처의 높이는 14.98미터입니다.',
        '1180년과 1567년, 싸움 중에 난 불로 절이 크게 탔습니다. 그래서 지금 부처의 손과 머리는 뒷날 다시 만든 것입니다.',
        '1686년, 고케이 스님이 부처의 머리를 다시 부어 만드는 일을 시작했습니다. 1692년에 일을 마치고 부처를 다시 모시는 의식을 열었습니다.',
        '부처를 모신 법당은 1709년에 다시 지었습니다. 돈이 모자라 너비를 처음의 60퍼센트쯤으로 줄여 지었습니다.',
        '1998년, 도다이지는 나라의 다른 옛 절과 신사, 숲과 함께 유네스코 세계유산이 되었습니다.',
        '법당의 한 나무 기둥 밑에는 부처의 콧구멍만 하다는 구멍이 있습니다. 아이들이 이 구멍으로 기어서 빠져나가 봅니다.',
      ],
      credit: '사진: Zairon, 위키미디어 공용, CC BY 4.0',
      // The hole under the pillar (the user, 2026.10.20: "이 사진도 추가"): Wikimedia Commons,
      // "Pillar in Todaiji-Temple in Nara Japan.jpg" by Kucharek (CC BY-SA 3.0), made smaller.
      more: {
        photo: 'photo-pillar.webp', name: '기둥 밑의 구멍',
        text: '아이 하나가 기둥 밑의 구멍을 기어서 빠져나오고 있습니다. 어른에게는 좁지만 아이는 몸을 숙이면 지나갈 수 있습니다.',
        credit: '사진: Kucharek, 위키미디어 공용, CC BY-SA 3.0',
      },
    },
    scenes: [
      {
        id: 'gate', name: '일본 나라 도다이지 문 앞', short: '절 문 앞', zoom: 1.13, ground: 0.715, scale: 0.661, air: 'street', floor: 'dirt',
        sora: '깃발이 하늘까지 닿겠어!',
        people: [
          { id: 'rice', pass: '김 나는 찐 쌀이오!', show: 'rice', name: '찐 쌀 파는 아주머니', x: 0.19, w: 145, h: 306, lines: ['먼 데서 온 이들이 많아 잘 팔린단다.', '하나 먹어 보련?'],
            try: { id: 'eat-rice', verb: 'eat', name: '찐 쌀 덩이', face: 'yum', sora: '찐 쌀이 쫀득쫀득해! 꼭꼭 씹혀.' } },
          { id: 'farmer', pass: '허어, 부처님이 참 크기도 하다.', name: '먼 고을에서 온 농부', x: 0.3, w: 134, h: 302, lines: ['열흘을 걸어서 왔다오.', '큰 부처님을 한 번은 뵈어야지.'] },
          { id: 'tiler', pass: '기와가 몇 장인지 아나?', name: '기와 굽는 장인', x: 0.4, w: 133, h: 310, lines: ['저 큰 집 지붕에 얹은 기와라오.', '굽고 또 구워도 모자랐지.'] },
          { id: 'child', pass: '탑이 구름에 닿았어!', name: '구경하는 아이', x: 0.51, w: 92, h: 187, lines: ['저 탑은 일곱 층이야. 세어 봤어.', '꼭대기는 고개가 아파서 못 봐.'] },
          { id: 'weaver', pass: '고운 옷 보고 가요.', name: '옷감 짜는 아주머니', x: 0.62, w: 130, h: 310, lines: ['바다 건너 당나라 옷을 본뜬 거란다.', '아이 옷도 있어. 입어 보련?'],
            try: { id: 'wear-nara', verb: 'wear', name: '나라의 옷', outfit: 'nara', sora: '치마가 가슴까지 올라와!', memo: '그 무렵 일본은 당나라의 옷과 집과 글을 많이 배워 왔단다.' } },
          { id: 'cord', pass: '실을 한 올 한 올 꼬는 중이란다.', name: '끈 꼬는 장인', x: 0.73, w: 128, h: 306, lines: ['비단실을 꼬아 끈을 만든단다.', '오늘 쓸 끈은 아주 길어야 해.'] },
          { id: 'official', pass: '모인 스님이 만 명도 넘겠구나.', name: '글 쓰는 관리', x: 0.85, w: 115, h: 320, lines: ['오늘 모인 스님만 만 명이란다.', '나무 조각에 다 적는 중이지.'] },
        ],
        spots: [],
      },
      {
        id: 'court', name: '일본 나라 도다이지 회랑 마당', short: '회랑 마당', zoom: 1.16, ground: 0.695, scale: 0.678, air: 'court', floor: 'dirt',
        sora: '탈이 잔뜩 걸려 있어!',
        people: [
          { id: 'mask', pass: '얼쑤! 이 탈 코가 참 길지?', show: 'mask', pose: 'see-wow', sora: '코가 엄청 긴 탈이야!', memo: '그날 쓴 탈과 춤옷이 지금도 쇼소인이라는 창고에 남아 있단다.', name: '탈춤꾼', x: 0.18, w: 130, h: 293, lines: ['먼 서쪽 나라 사람을 본뜬 탈이란다.', '이걸 쓰고 줄지어 춤을 추지.'] },
          { id: 'biwa', pass: '둥, 디리링. 비파 소리 들어 보렴.', name: '비파 타는 악사', x: 0.29, w: 132, h: 277, lines: ['바다 건너에서 온 악기란다.', '오늘은 여러 나라 음악이 다 울려.'] },
          { id: 'tang', pass: '나무아미타불.', name: '당나라에서 온 스님', x: 0.4, w: 102, h: 278, lines: ['바다를 건너 이 나라에 왔다오.', '오늘 눈을 그리는 스님은 인도 분이지.'] },
          { id: 'petal', pass: '꽃잎 뿌려요, 꽃잎!', name: '꽃잎 뿌리는 동자', x: 0.51, w: 120, h: 230, lines: ['의식 때 하늘에 뿌릴 꽃잎이야.', '바구니가 벌써 세 개째야.'] },
          { id: 'flute', pass: '삘릴리, 피리 소리가 곱지?', name: '피리 부는 악사', x: 0.62, w: 119, h: 282, lines: ['악사와 춤꾼이 사천 명이란다.', '이런 큰 잔치는 처음이야.'] },
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
          { id: 'gilder', pass: '부처님께 입힐 금이 아직 모자라.', name: '금 입히는 장인', x: 0.4, w: 79, h: 246, lines: ['부처님 몸에 금을 입히는 중이란다.', '아직 다 못 입혔어. 워낙 크셔서.'] },
          { id: 'ritual', pass: '붓에 맬 끈이 아직 안 왔는가?', show: 'eyes', pose: 'see-wow', sora: '다 같이 끈을 잡았어!', memo: '붓에 긴 끈을 매어 모인 이들이 함께 잡았다고 전한단다. 다 같이 눈을 그린 셈이지.', name: '의식을 맡은 스님', x: 0.51, w: 104, h: 243, lines: ['오늘 부처님의 눈을 그려 넣는단다.', '눈을 그려야 비로소 부처님이 되시지.'] },
          { id: 'bodhi', pass: '붓이 묵직하구나.', show: 'brush', pose: 'see-aha', sora: '붓이 내 팔보다 길어!', memo: '인도에서 온 스님 보리선나가 이 붓으로 눈을 그렸단다. 붓은 지금도 남아 있지.', name: '인도에서 온 스님', x: 0.62, w: 95, h: 298, lines: ['먼 인도에서 바다를 건너왔단다.', '이 붓으로 눈동자를 찍을 게다.'] },
          { id: 'lamp', pass: '이 등에 불을 밝혀야지.', show: 'lantern', pose: 'see-aha', sora: '등에 피리 부는 이가 있어!', memo: '이 청동 등은 지금도 큰 부처 집 앞 그 자리에 서 있단다.', name: '등 지키는 사람', x: 0.73, w: 90, h: 320, lines: ['이 등은 여덟 모로 지었단다.', '문짝마다 악기 든 보살이 계시지.'] },
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
              { id: 'E1', label: '"장인이 꼬았어요"', sora: '문 앞의 장인이 이 끈을 꼬았어요.', says: '곱게도 꼬았구나. 고맙다, 얘야.' },
              { id: 'E2', label: '"끈은 왜 매요?"', sora: '붓에 끈은 왜 매는 거예요?', says: '모두가 함께 잡으려고 맨단다.' },
            ],
          },
          errand: 'gave',
        },
        {
          who: 'ritual', show: true, goal: '스님이 가리키는 큰 부처를 보렴.',
          lines: ['이제 시작한다. 저 위를 보렴.', '끈을 잡은 모두가 함께 그리는 거란다.'],
          sora: '부처님 눈이 생겼어! 우릴 보셔.',
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
    // (What is said of today: written from memory and then looked up, 2026.10.13.)
    now: {
      photo: 'photo-now.webp', name: '파르테논의 지금 모습', when: '그리스 아테네 · 아크로폴리스',
      text: [
        '지붕과 벽은 많이 무너졌지만, 바깥 기둥들은 지금도 아크로폴리스 언덕 위에 서 있습니다.',
        '파르테논은 6세기 무렵부터 성모 마리아의 교회로 쓰였고, 15세기에 오스만 제국이 아테네를 차지한 뒤에는 모스크가 되었습니다.',
        '1801년부터 1812년까지 영국의 엘긴 백작이 남은 조각의 절반쯤을 떼어 갔습니다. 그 조각들은 지금 런던 영국박물관에 있고, 그리스는 돌려 달라고 요구합니다.',
        '1975년, 그리스는 아크로폴리스 유적을 지키는 위원회를 세웠습니다. 그 뒤 50년 넘게 돌을 하나하나 맞추며 고치고 있습니다.',
        '2026년 6월에는 서쪽 앞면을 다 고치고, 오래 서 있던 공사용 발판을 걷어 냈습니다. 이제는 안쪽 벽을 고칩니다.',
        '아크로폴리스는 1987년 유네스코 세계유산이 되었습니다. 2009년에는 언덕 아래에 아크로폴리스 박물관이 문을 열었습니다.',
      ],
      credit: '사진: A.Savin, 위키미디어 공용, CC BY-SA 3.0',
    },
    scenes: [
      {
        id: 'agora', name: '그리스 아테네 아고라', short: '아고라', zoom: 1.15, ground: 0.715, scale: 0.673, air: 'market', floor: 'dirt',
        sora: '저 언덕 위에 신전이야!',
        people: [
          { id: 'olive', pass: '올리브요, 갓 딴 올리브!', show: 'olive', name: '올리브 파는 아주머니', x: 0.19, w: 151, h: 296, lines: ['올리브는 여신이 주신 나무란다.', '하나 먹어 보련?'],
            try: { id: 'eat-olive', verb: 'eat', name: '올리브', face: 'sour', sora: '올리브가 짜고 떫어! 그래도 고소해.' } },
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
        id: 'ascent', name: '그리스 아테네 언덕 오르는 길', short: '언덕 오르는 길', zoom: 1.2, ground: 0.68, scale: 0.702, air: 'hush', floor: 'dirt',
        sora: '다들 줄지어 올라가!',
        people: [
          { id: 'jar', pass: '항아리 물이 출렁여. 조심조심.', name: '물 항아리 멘 청년', x: 0.18, w: 133, h: 310, lines: ['여신께 올릴 물을 지고 간단다.', '한 방울도 흘리면 안 되지.'] },
          { id: 'basket', pass: '바구니가 흔들려.', name: '바구니 인 소녀', x: 0.29, w: 130, h: 320, lines: ['행렬 맨 앞에서 바구니를 인단다.', '뽑힌 것만도 큰 자랑이야.'] },
          { id: 'piper', pass: '삘릴리, 내 피리 소리 들려?', name: '피리 부는 사람', x: 0.4, w: 119, h: 270, lines: ['행렬은 피리 소리에 맞춰 걷는단다.', '언덕 꼭대기까지 불어야 해.'] },
          { id: 'robe', pass: '구겨지면 안 돼.', name: '새 옷 든 아이', x: 0.51, w: 112, h: 240, lines: ['여신께 바칠 새 옷이야.', '아홉 달 동안 짰대.'] },
          { id: 'elder', pass: '언덕은 천천히 올라가야지.', name: '올리브 가지 든 노인', x: 0.62, w: 143, h: 271, lines: ['저 신전을 열다섯 해 지었단다.', '내 눈으로 다 지은 것을 보는구나.'] },
          { id: 'mason', pass: '돌을 톡톡 쪼아 반듯하게 해야지.', show: 'column', pose: 'see-aha', sora: '기둥 가운데가 볼록해!', memo: '신전의 기둥은 가운데가 손가락 한 마디쯤 볼록하단다. 왜 그랬는지는 아직도 다툰단다.', name: '석공', x: 0.73, w: 127, h: 269, lines: ['기둥은 곧게 깎지 않는단다.', '가운데를 아주 조금 볼록하게 하지.'] },
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
          { id: 'architect', pass: '줄을 팽팽하게 당기시오!', name: '기둥 재는 건축가', x: 0.4, w: 144, h: 319, lines: ['돌 하나하나를 재어 맞췄단다.', '틈에 머리카락 한 올도 안 들어가지.'] },
          { id: 'keeper', pass: '등잔 기름이 다 됐네.', show: 'athena', pose: 'see-wow', sora: '여신님이 집보다 커!', memo: '금과 상아로 만든 여신상이었단다. 높이가 12미터쯤이었는데 지금은 남아 있지 않지.', name: '제단지기', x: 0.51, w: 144, h: 316, lines: ['여신의 등잔을 지키는 일을 한단다.', '불이 꺼지면 안 되거든.'] },
          { id: 'runner', pass: '내가 이겼어, 내가!', show: 'prize', pose: 'see-aha', sora: '이긴 상으로 기름 항아리를 받았어!', memo: '경기에서 이기면 여신의 올리브 기름을 항아리째 받았단다. 그 항아리엔 늘 검은 그림을 그렸지.', name: '달리기 이긴 청년', x: 0.62, w: 138, h: 320, lines: ['달리기에서 이겨 받은 상이란다.', '여신의 나무에서 짠 기름이지.'] },
          { id: 'visitor', pass: '허어, 듣던 대로구나.', name: '멀리서 온 구경꾼', x: 0.73, w: 135, h: 320, lines: ['배를 타고 사흘을 왔다오.', '이런 집은 세상에 또 없을 게요.'] },
          { id: 'owlkid', pass: '부엉이 흉내 들어 봐. 부엉!', name: '부엉이 좋아하는 아이', x: 0.85, w: 96, h: 211, lines: ['부엉이는 여신님의 새야.', '우리 돈에도 부엉이가 있어.'] },
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
          sora: '여신님이 금빛이야! 올려보니 목이 아파.',
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
    // Who lived here, for a player who has not heard of them: the first slip of all (the user,
    // 2026.10.13: "사람들이 잘 모르는 문명에 대해서는 간략하게나마 소개하는 페이지를"). Written from memory, then looked up.
    intro: { title: '크메르 사람들', text: '지금의 캄보디아에 큰 나라를 세운 사람들이란다. 물길과 큰 못을 파서 벼를 기르고, 돌로 큰 절을 지었지.' },
    first: '큰 사원을 거의 다 지은 때란다. 쇠 정을 전해 주렴.',
    dir: 'angkor1150', look: 'paper', pale: true,
    drawn: '그 절의 벽에 얕게 새긴 돌 그림처럼 그렸단다.',
    // (What is said of today: written from memory and then looked up, 2026.10.13.)
    now: {
      photo: 'photo-now.webp', name: '앙코르와트의 지금 모습', when: '캄보디아 시엠레아프 · 오늘날',
      text: [
        '다섯 탑은 지금도 서 있습니다. 해 뜰 무렵이면 탑 앞의 못에 다섯 탑이 거울처럼 비칩니다.',
        '기네스 세계 기록에 따르면 앙코르와트는 세상에서 가장 큰 종교 건축물입니다. 넓이는 162.6헥타르입니다.',
        '1400년대 초 사람들이 앙코르 도시를 떠난 뒤에도, 불교 스님들이 이 절을 줄곧 돌보았습니다.',
        '캄보디아 국기 한가운데에는 이 절이 그려져 있습니다. 1800년대부터 국기에 들어갔습니다.',
        '1992년에 유네스코 세계유산이 되었습니다. 도굴과 땅속 지뢰 때문에 같은 해 "위험에 처한 유산" 목록에도 올랐습니다.',
        '여러 나라가 힘을 모아 지키고 고친 끝에 2004년에 위험 목록에서 빠졌습니다. 지금도 캄보디아의 압사라 기구가 돌 조각을 고치고 있습니다.',
      ],
      credit: '사진: Satdeep Gill, 위키미디어 공용, CC BY-SA 4.0',
      // Inside (the user, 2026.10.20: "마지막에 앙코르와트 내부 사진 하나 추가"): Wikimedia Commons,
      // "Cambodia-2322 (3582012570).jpg" by Dennis G. Jarvis (CC BY-SA 2.0), made smaller: the
      // cruciform cloister Preah Poan, the Gallery of a Thousand Buddhas, with a shrine in it.
      more: {
        photo: 'photo-inside.webp', name: '앙코르와트 안의 천 부처 회랑',
        text: '탑 안쪽의 열십자 모양 회랑입니다. 옛날에는 부처상이 많이 놓여 "천 부처 회랑"이라고 부릅니다. 지금도 사람들이 부처상 앞에 꽃과 향을 올립니다.',
        credit: '사진: Dennis G. Jarvis, 위키미디어 공용, CC BY-SA 2.0',
      },
    },
    scenes: [
      {
        id: 'moat', name: '크메르 앙코르 해자 앞', short: '해자 앞', zoom: 1.15, ground: 0.705, scale: 0.673, air: 'market', floor: 'dirt',
        sora: '탑이 연꽃 봉오리 같아!',
        people: [
          { id: 'fruit', pass: '망고요, 잘 익은 망고!', name: '과일 장수', x: 0.19, w: 153, h: 312, lines: ['절 짓는 이들이 사 먹는 과일이란다.', '일꾼이 많으니 장도 크게 서지.'] },
          { id: 'fishwife', pass: '큰 호수에서 온 생선!', name: '생선 파는 아주머니', x: 0.3, w: 135, h: 320, lines: ['큰 호수에서 잡아 말린 생선이란다.', '비 오는 철엔 호수가 몇 배로 커지지.'] },
          { id: 'carter', pass: '영차, 돌 나간다!', show: 'canal', pose: 'see-wow', sora: '돌이 뗏목을 타고 와!', memo: '돌은 쿨렌 산 기슭에서 캐어 물길로 실어 왔단다. 물길이 서른다섯 킬로미터쯤이었지.', name: '돌 수레 끄는 사람', x: 0.4, w: 144, h: 319, lines: ['이 돌은 먼 산에서 캐 온 거란다.', '물길에 뗏목을 띄워 실어 오지.'] },
          { id: 'child', pass: '연잎을 우산처럼 썼어!', name: '물장난하는 아이', x: 0.51, w: 135, h: 242, lines: ['해자가 강처럼 넓어.', '저기 탑이 다섯 개야. 세어 봐.'] },
          { id: 'weaver', pass: '고운 천 보고 가요.', name: '천 짜는 아주머니', x: 0.62, w: 137, h: 316, lines: ['천 한 장을 허리에 감아 입는단다.', '아이 것도 있어. 입어 보련?'],
            try: { id: 'wear-sampot', verb: 'wear', name: '크메르의 옷', outfit: 'sampot', sora: '천을 감기만 했는데 치마가 됐어!', memo: '긴 천을 허리에 감아 여며 입는 옷이란다. 삼폿이라고 하지.' } },
          { id: 'wife', pass: '아이고, 이를 어쩌나.', name: '장인의 아내', x: 0.73, w: 109, h: 318, lines: ['우리 집 양반은 돌 새기는 장인이란다.', '새벽부터 회랑에서 일하지.'] },
          { id: 'palm', pass: '달콤한 야자 즙이오!', show: 'palm', name: '야자 즙 받는 아저씨', x: 0.85, w: 140, h: 315, lines: ['사탕야자 나무에서 받은 즙이란다.', '한 모금 마셔 보련?'],
            try: { id: 'eat-palm', verb: 'eat', name: '야자 즙', face: 'yum', sora: '야자 즙이 꿀물처럼 달콤해!' } },
        ],
        spots: [],
      },
      {
        id: 'causeway', name: '크메르 앙코르와트 둑길', short: '둑길', zoom: 1.17, ground: 0.695, scale: 0.684, air: 'court',
        sora: '난간이 뱀 모양이야!',
        people: [
          { id: 'monk', pass: '고맙습니다.', name: '탁발하는 스님', x: 0.18, w: 93, h: 269, lines: ['이 절은 비슈누 신께 바친 절이란다.', '해가 지는 서쪽을 보고 서 있지.'] },
          { id: 'lotus', pass: '연꽃이 곱게 피었네.', name: '연꽃 따는 아주머니', x: 0.29, w: 106, h: 277, lines: ['절에 올릴 연꽃을 따는 중이란다.', '해자에는 연꽃이 끝도 없지.'] },
          { id: 'porter', pass: '영차, 무거운 돌을 나르자.', name: '돌 나르는 일꾼', x: 0.4, w: 177, h: 271, lines: ['깎고 남은 돌 부스러기란다.', '하루에도 수십 번을 나르지.'] },
          { id: 'dancer', pass: '하나, 둘, 손끝을 젖히고.', show: 'towers', pose: 'see-wow', sora: '탑이 물에도 비쳐!', memo: '가운데 탑과 네 귀의 탑, 모두 다섯이란다. 신들이 사는 산을 본떴다고 하지.', name: '춤 배우는 소녀', x: 0.51, w: 109, h: 291, lines: ['벽에 새긴 여신처럼 추는 춤이야.', '손가락을 이렇게 뒤로 젖혀.'] },
          { id: 'guard', pass: '둑길로 줄지어 가시오.', name: '문 지키는 병사', x: 0.62, w: 114, h: 320, lines: ['이 둑길은 해자를 건너 문까지 간단다.', '난간은 머리 일곱 달린 뱀이지.'] },
          { id: 'boatkid', pass: '배 타실 분, 배요!', name: '배 젓는 아이', x: 0.73, w: 123, h: 239, lines: ['연꽃 사이로 배를 저어 다녀.', '해자 건너편도 금방이야.'] },
          { id: 'mahout', pass: '코끼리 지나간다, 비켜라!', name: '코끼리 몰이꾼', x: 0.85, w: 114, h: 290, lines: ['코끼리가 돌을 끌고 다니는 길이란다.', '밟히면 큰일이니 물러서거라.'] },
        ],
        spots: [],
      },
      {
        id: 'gallery', name: '크메르 앙코르와트 회랑 앞', short: '회랑 앞', zoom: 1.15, ground: 0.71, scale: 0.673, air: 'chisels',
        sora: '벽이 온통 그림이야!',
        people: [
          { id: 'polisher', pass: '쓱쓱, 돌 가루 날린다.', name: '돌 닦는 일꾼', x: 0.18, w: 114, h: 296, lines: ['새긴 자리의 돌 가루를 닦아 낸단다.', '닦아야 그림이 또렷해지지.'] },
          { id: 'drawer', pass: '선 하나 틀리면 큰일.', show: 'churn', pose: 'see-wow', sora: '벽 속 사람들이 다 같이 뱀을 당겨!', memo: '신과 마귀가 큰 뱀을 당겨 바다를 휘젓는 이야기란다. 양쪽을 합쳐 백여든이 당기지.', name: '밑그림 그리는 화공', x: 0.29, w: 106, h: 302, lines: ['숯으로 밑그림을 먼저 그린단다.', '이 벽 그림은 팔백 걸음을 이어지지.'] },
          { id: 'gilder', pass: '금이 날아갈라, 숨도 조심조심.', name: '금 입히는 사람', x: 0.4, w: 112, h: 299, lines: ['새긴 돌 위에 금을 입히기도 한단다.', '바람만 불어도 날아가는 금이야.'] },
          { id: 'carver', pass: '정이 무뎌졌구먼.', show: 'hair', pose: 'see-aha', sora: '여신마다 머리 모양이 다 달라!', memo: '춤추는 여신이 이천쯤 새겨져 있단다. 머리 모양만 서른일곱 가지지.', name: '돌 새기는 장인', x: 0.51, w: 153, h: 314, lines: ['춤추는 여신을 새기는 중이란다.', '하나도 똑같이 새기지 않지.'] },
          { id: 'priest', pass: '꽃을 올려야지.', name: '사제', x: 0.62, w: 111, h: 320, lines: ['임금님이 신께 바치는 절이란다.', '다 지으려면 아직 몇 해 남았지.'] },
          { id: 'apprentice', pass: '꽃잎을 톡톡 새기기가 어렵다.', name: '어린 제자', x: 0.73, w: 85, h: 227, lines: ['나는 아직 꽃잎만 새겨.', '스승님은 눈 감고도 새기신대.'] },
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
      gate: { scene: 'causeway', open: 3, sora: '몰이꾼이 길을 막고 있어. 못 가.' },
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
    first: '큰 문으로 잔치 행렬이 지나는 날이란다. 점토판을 전해 주렴.',
    // Who lived here, for a player who has not heard of them: the first slip of all (the user,
    // 2026.10.13: "사람들이 잘 모르는 문명에 대해서는 간략하게나마 소개하는 페이지를"). Written from memory, then looked up.
    intro: { title: '바빌론 사람들', text: '지금의 이라크, 두 강 사이의 땅에 살던 사람들이란다. 진흙 판에 글을 눌러 썼고, 예순씩 묶어 세는 셈을 썼지.' },
    dir: 'babylon575', look: 'paper',
    drawn: '그 문의 푸른 유약 벽돌 그림처럼 그렸단다.',
    // (What is said of today: written from memory and then looked up, 2026.10.13.)
    now: {
      photo: 'photo-now.webp', name: '이슈타르 문의 지금 모습', when: '독일 베를린 · 페르가몬 박물관',
      text: [
        '이슈타르 문은 지금 이라크가 아니라 독일 베를린의 페르가몬 박물관에 서 있습니다.',
        '독일 학자 콜데바이 일행이 1902년부터 1914년까지 문이 있던 터를 파냈습니다. 부서진 벽돌 조각들은 베를린으로 실어 가 다시 맞추었습니다.',
        '다시 맞춘 문은 1930년에 처음 선보였습니다. 박물관에 다 들어가지 않아 앞쪽의 작은 문만 세웠고, 뒤쪽 큰 문은 창고에 있습니다.',
        '페르가몬 박물관은 건물을 고치느라 2023년 10월에 문을 닫았습니다. 이슈타르 문이 있는 전시실은 2037년쯤 다시 문을 열 예정입니다.',
        '이라크 정부는 1990년대부터 이 문과 함께 가져간 유물을 돌려 달라고 요청해 왔습니다.',
        '바빌론 터는 2019년에 유네스코 세계유산이 되었습니다. 그 입구에는 이슈타르 문을 본떠 지은 문이 서 있습니다.',
      ],
      credit: '사진: Radomir Vrbovsky, 위키미디어 공용, CC BY-SA 4.0',
    },
    scenes: [
      {
        id: 'quay', name: '바빌로니아 바빌론 유프라테스 강가 나루', short: '강가 나루', zoom: 1.13, ground: 0.72, scale: 0.661, air: 'market', floor: 'dirt',
        sora: '배가 바구니처럼 둥글어!',
        people: [
          { id: 'boatman', pass: '배 들어온다, 비켜라!', name: '둥근 배 사공', x: 0.19, w: 132, h: 320, lines: ['갈대로 엮은 둥근 배란다.', '보리를 싣고 강을 내려왔지.'] },
          { id: 'datewife', pass: '달콤한 대추야자요!', show: 'dates', name: '대추야자 장수', x: 0.3, w: 132, h: 278, lines: ['저 나무에서 딴 대추야자란다.', '보리빵이랑 먹어 보련?'],
            try: { id: 'eat-dates', verb: 'eat', name: '대추야자와 보리빵', face: 'yum', sora: '대추야자가 쫀득하고 꿀처럼 달아!' } },
          { id: 'reedkid', pass: '갈대로 펜을 깎았다!', name: '갈대 베는 아이', x: 0.4, w: 117, h: 222, lines: ['갈대 끝을 깎으면 펜이 돼.', '젖은 흙에 꾹꾹 눌러 써.'] },
          { id: 'baker', pass: '어이쿠, 가마를 못 비우는데.', name: '점토판 굽는 이', x: 0.51, w: 109, h: 286, lines: ['글을 적은 흙 판을 굽는단다.', '구우면 돌처럼 단단해지지.'] },
          { id: 'counter', pass: '쉰아홉, 예순. 보리 한 묶음이다!', show: 'sixty', pose: 'see-aha', sora: '예순이 되면 다시 하나로 센대!', memo: '바빌론에서는 예순씩 묶어 세었단다. 한 시간이 예순 분인 것도 여기서 왔지.', name: '보리 세는 아저씨', x: 0.62, w: 135, h: 282, lines: ['우리는 예순씩 묶어 센단다.', '예순이 차면 쐐기 하나로 적지.'] },
          { id: 'clothier', pass: '술 달린 옷 보고 가요.', name: '옷 짓는 아주머니', x: 0.73, w: 125, h: 280, lines: ['단에 술을 촘촘히 단 옷이란다.', '아이 것도 있어. 입어 보련?'],
            try: { id: 'wear-babylon', verb: 'wear', name: '바빌론의 옷', outfit: 'babylon', sora: '걸으면 술이 찰랑거려!', memo: '긴 옷의 단과 숄에 술을 달아 입었단다.' } },
          { id: 'gauge', pass: '오늘은 한 뼘 올랐군.', name: '강물 재는 사람', x: 0.85, w: 107, h: 299, lines: ['날마다 강물 높이를 잰단다.', '재어서 별 보는 서기에게 알리지.'] },
        ],
        spots: [],
      },
      {
        id: 'way', name: '바빌로니아 바빌론 행렬 길', short: '행렬 길', zoom: 1.15, ground: 0.705, scale: 0.673, air: 'hush',
        sora: '벽에 사자가 줄지어 걸어!',
        people: [
          { id: 'porter', pass: '영차, 벽돌 나간다!', name: '벽돌 나르는 일꾼', x: 0.18, w: 121, h: 266, lines: ['유약을 발라 구운 벽돌이란다.', '깨질라, 살살 날라야 하지.'] },
          { id: 'lionkid', pass: '사자가 하나, 둘, 셋… 또 있네!', show: 'lions', pose: 'see-wow', sora: '사자가 끝도 없어!', memo: '행렬 길의 두 벽에 사자가 줄지어 있단다. 사자는 이슈타르 여신의 짐승이지.', name: '사자 세는 아이', x: 0.29, w: 104, h: 197, lines: ['사자를 세는 중이야.', '세다가 자꾸 잊어버려.'] },
          { id: 'mixer', pass: '푸른빛이 잘 나와야 할 텐데.', name: '유약 개는 사람', x: 0.4, w: 107, h: 269, lines: ['벽돌에 바를 푸른 유약이란다.', '불에 구우면 반들반들 빛나지.'] },
          { id: 'glazier', pass: '이 벽돌은 사자 꼬리 자리지.', name: '벽돌 붙이는 장인', x: 0.51, w: 107, h: 271, lines: ['벽돌마다 제자리가 있단다.', '다 맞추면 사자 한 마리가 되지.'] },
          { id: 'palmgirl', pass: '행렬은 언제 오려나.', name: '종려 가지 든 소녀', x: 0.62, w: 112, h: 288, lines: ['오늘은 잔칫날이야.', '행렬이 오면 가지를 흔들 거야.'] },
          { id: 'drummer', pass: '둥둥, 북을 힘껏 울리자!', name: '북 치는 악사', x: 0.73, w: 119, h: 267, lines: ['잔칫날 행렬이 지나는 길이란다.', '북소리가 들리면 곧 온다는 거지.'] },
          { id: 'keeper', pass: '길을 비켜라, 길을!', name: '행렬 길 문지기', x: 0.85, w: 111, h: 320, lines: ['잔칫날 행렬이 지나는 길이란다.', '지나갈 때까지 길을 비워야 하지.'] },
        ],
        spots: [],
      },
      {
        id: 'gate', name: '바빌로니아 바빌론 이슈타르 문 앞', short: '문 앞', zoom: 1.15, ground: 0.705, scale: 0.673, air: 'hush',
        sora: '문이 온통 파래! 용도 있어.',
        people: [
          { id: 'guard', pass: '줄지어 들어가시오.', name: '문 앞의 병사', x: 0.18, w: 118, h: 320, lines: ['이 문은 이슈타르 여신의 문이란다.', '임금님이 새로 지으셨지.'] },
          { id: 'priest', pass: '용과 들소가 문을 지키지.', show: 'beasts', pose: 'see-wow', sora: '용 발이 앞뒤가 달라!', memo: '문에는 용과 들소가 줄지어 있단다. 용은 마르두크 신, 들소는 아다드 신의 짐승이지.', name: '사제', x: 0.29, w: 118, h: 311, lines: ['저 용은 마르두크 신의 짐승이란다.', '들소는 비를 내리는 신의 짐승이지.'] },
          { id: 'merchant', pass: '허어, 이런 문은 처음이오.', name: '먼 나라 장사꾼', x: 0.4, w: 117, h: 306, lines: ['먼 서쪽 바닷가에서 왔다오.', '문이 하늘빛이라 눈이 부시오.'] },
          { id: 'oilwoman', pass: '고소한 참깨 기름이오!', name: '참깨 기름 장수', x: 0.51, w: 110, h: 270, lines: ['참깨를 짜서 낸 기름이란다.', '등잔에도 넣고 빵에도 바르지.'] },
          { id: 'scribe', pass: '어젯밤 판이 올 때가 됐는데.', show: 'stars', pose: 'see-aha', sora: '별을 흙에 적어 둬!', memo: '바빌론의 별 보는 이들은 날마다 하늘을 점토판에 적었단다. 육백 해를 이어 적었지.', name: '별 보는 서기', x: 0.62, w: 116, h: 308, lines: ['나는 밤마다 하늘을 본단다.', '본 것을 날마다 흙 판에 적지.'] },
          { id: 'pupil', pass: '흙판에 꾹꾹 눌렀는데 또 틀렸다.', name: '서기를 배우는 아이', x: 0.73, w: 86, h: 214, lines: ['쐐기 글자를 배우는 중이야.', '틀리면 흙을 뭉쳐서 다시 써.'] },
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
    first: '임금이 손수 별을 재는 도시란다. 종이 묶음을 전해 주렴.',
    // Who lived here, for a player who has not heard of them: the first slip of all (the user,
    // 2026.10.13: "사람들이 잘 모르는 문명에 대해서는 간략하게나마 소개하는 페이지를"). Written from memory, then looked up.
    intro: { title: '티무르의 나라', text: '사마르칸트는 동쪽과 서쪽을 잇는 비단길 한가운데의 도시란다. 티무르 임금이 여기를 서울로 삼았고, 손자 울루그 베그가 다스렸지.' },
    dir: 'samarkand1428', look: 'paper',
    drawn: '그 도시 건물의 푸른 타일 조각처럼 그렸단다.',
    // (What is said of today: written from memory and then looked up, 2026.10.13.)
    now: {
      photo: 'photo-now.webp', name: '눈금 길의 지금 모습', when: '우즈베키스탄 사마르칸트 · 울루그 베그 천문대 터',
      text: [
        '1449년 울루그 베그가 세상을 떠난 뒤, 천문대는 버려지고 학자들도 떠났습니다.',
        '둥근 천문대 건물은 사라졌습니다. 땅 위에는 건물의 바닥 터가, 땅속에는 큰 눈금 길이 남았습니다.',
        '1908년, 러시아의 고고학자 바실리 뱌트킨이 수백 해 동안 잊혔던 눈금 길을 땅속에서 찾아냈습니다.',
        '1915년, 찾아낸 눈금 길을 지키려고 그 위에 둥근 지붕을 씌웠습니다. 찾아온 사람들은 지금도 지붕 아래에서 눈금 길을 내려다봅니다.',
        '1970년에는 그 곁에 박물관을 지었습니다. 울루그 베그의 별 목록 책을 본떠 만든 것과 천문 기구, 천문대의 작은 모형이 있습니다.',
        '2001년, 천문대 터가 들어간 사마르칸트가 유네스코 세계유산이 되었습니다.',
      ],
      credit: '사진: Benjamin Goetzinger, 위키미디어 공용, CC BY-SA 4.0',
    },
    scenes: [
      {
        id: 'registan', name: '티무르 제국 사마르칸트 레기스탄의 학교 앞', short: '학교 앞', zoom: 1.085, ground: 0.755, scale: 0.635, air: 'market',
        sora: '문이 온통 파란 타일이야!',
        people: [
          { id: 'melon', pass: '꿀보다 단 멜론이오!', show: 'melon', name: '멜론 장수', x: 0.18, w: 149, h: 306, lines: ['사마르칸트 멜론은 꿀처럼 달단다.', '갓 구운 빵이랑 먹어 보련?'],
            try: { id: 'eat-melon', verb: 'eat', name: '멜론과 빵', face: 'yum', sora: '멜론이 달콤해! 빵도 따끈따끈해.' } },
          { id: 'student', pass: '오늘 밤엔 별을 봐야지.', name: '학교의 학생', x: 0.29, w: 106, h: 302, lines: ['이 학교에서 별과 셈을 배워.', '임금님이 직접 가르치실 때도 있어.'] },
          { id: 'tiler', pass: '불이 세야 빛이 곱지.', show: 'tile', pose: 'see-wow', sora: '불에서 파란색이 나와!', memo: '흙 판에 유리 물을 발라 구우면 푸른 빛이 난단다. 천문대도 이 타일로 꾸몄지.', name: '타일 굽는 장인', x: 0.4, w: 118, h: 310, lines: ['흙 판에 유리 물을 발라 굽는단다.', '구우면 이렇게 파랗게 빛나지.'] },
          { id: 'teacher', pass: '배움에는 끝이 없지.', name: '학교의 선생님', x: 0.51, w: 124, h: 320, lines: ['문 위의 별 무늬를 보렴.', '별을 배우는 학교라서 그렇단다.'] },
          { id: 'silk', pass: '고운 비단 보고 가요.', name: '비단 장수', x: 0.62, w: 134, h: 295, lines: ['줄무늬 비단으로 지은 겉옷이란다.', '아이 것도 있어. 입어 보련?'],
            try: { id: 'wear-ikat', verb: 'wear', name: '줄무늬 비단 옷', outfit: 'ikat', sora: '비단이 반들반들해! 줄무늬가 예뻐.', memo: '긴 겉옷을 앞에서 여며 띠로 묶어 입는단다. 비단이라 가볍고 시원하지.' } },
          { id: 'paper', pass: '아이고, 가게를 못 비우는데.', name: '종이 장인', x: 0.73, w: 104, h: 303, lines: ['사마르칸트 종이는 먼 나라까지 간단다.', '돌로 문질러 매끈하게 윤을 내지.'] },
          { id: 'merchant', pass: '휴, 먼 길이었어.', name: '낙타 타고 온 상인', x: 0.85, w: 149, h: 319, lines: ['먼 동쪽에서 비단을 싣고 왔단다.', '이 도시엔 온 세상 물건이 모이지.'] },
        ],
        spots: [],
      },
      {
        id: 'hill', name: '티무르 제국 사마르칸트 천문대 언덕길의 시장', short: '언덕길', zoom: 1.085, ground: 0.755, scale: 0.635, air: 'hush',
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
        id: 'observatory', name: '티무르 제국 사마르칸트 천문대 안 눈금 길 앞', short: '눈금 길 앞', zoom: 1.085, ground: 0.755, scale: 0.635, air: 'hush',
        sora: '눈금 길이 땅속으로 내려가!',
        people: [
          { id: 'scribe', pass: '이 별은 여기, 저 별은 저기.', show: 'catalog', pose: 'see-wow', sora: '별마다 자리가 적혀 있어!', memo: '별 천 개쯤의 자리를 하나하나 재어 적었단다. 알리 쿠시지가 그 일을 마무리했지.', name: '별 적는 서기', x: 0.18, w: 109, h: 299, lines: ['잰 별의 자리를 책에 적는단다.', '별 천 개쯤을 다 적을 거야.'] },
          { id: 'counter', pass: '숫자를 더하고 또 더한단다.', name: '셈하는 학자', x: 0.29, w: 108, h: 294, lines: ['잰 것을 셈해야 쓸모가 있단다.', '한 해가 며칠인지도 꼼꼼히 쟀지.'] },
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
    first: '낮과 밤의 길이가 같은 날이란다. 매듭 끈을 전해 주렴.',
    // Who lived here, for a player who has not heard of them: the first slip of all (the user,
    // 2026.10.13: "사람들이 잘 모르는 문명에 대해서는 간략하게나마 소개하는 페이지를"). Written from memory, then looked up.
    intro: { title: '마야 사람들', text: '지금의 멕시코와 과테말라 숲속에 돌로 도시를 지은 사람들이란다. 별과 날을 세는 데 밝았고, 0을 쓸 줄 알았지.' },
    dir: 'chichen1000', look: 'paper', pale: true,
    drawn: '마야 신전의 벽에 그린 그림처럼 그렸단다.',
    // (What is said of today: written from memory and then looked up, 2026.10.13.)
    now: {
      photo: 'photo-now.webp', name: '큰 피라미드의 지금 모습', when: '멕시코 유카탄 · 치첸이트사',
      text: [
        '피라미드는 지금도 그 자리에 서 있습니다. 높이는 24미터이고, 꼭대기 신전까지 더하면 30미터쯤입니다.',
        '1930년대에 학자들이 피라미드 속에서 더 오래된 피라미드를 찾았습니다. 그 안의 방에서는 붉은 재규어 모양의 왕좌가 나왔습니다.',
        '2016년에는 땅에 전기를 흘려 속을 살피는 방법으로, 그 안에 높이 10미터쯤 되는 더 작은 피라미드가 또 있다는 것을 알아냈습니다.',
        '낮과 밤의 길이가 같은 봄날이면, 계단에 나타나는 빛의 뱀을 보려고 수천 명이 모입니다. 2025년에는 8,620명이 왔습니다.',
        '계단에서 사람이 떨어지는 사고가 난 뒤, 2006년쯤부터는 피라미드에 오를 수 없고 둘레에서만 봅니다.',
        '1988년에 유네스코 세계유산이 되었고, 2007년에는 새 세계 7대 불가사의로 뽑혔습니다. 2024년에는 225만 명쯤이 다녀갔습니다.',
      ],
      credit: '사진: Daniel Schwen, 위키미디어 공용, CC BY-SA 4.0',
    },
    scenes: [
      {
        id: 'market', name: '마야 치첸이트사 광장 어귀의 시장', short: '시장', zoom: 1.13, ground: 0.72, scale: 0.661, air: 'market',
        sora: '저 멀리 피라미드가 보여!',
        people: [
          { id: 'maize', pass: '옥수수 빵 굽는다!', name: '옥수수 가는 아주머니', x: 0.19, w: 120, h: 308, lines: ['옥수수를 돌판에 갈아 반죽한단다.', '납작하게 구우면 빵이 되지.'] },
          { id: 'merchant', pass: '점 하나, 점 둘, 막대 하나.', show: 'numbers', pose: 'see-aha', sora: '점이랑 막대로 수를 세네!', memo: '마야 사람들은 점과 막대로 수를 적었단다. 점은 하나, 막대는 다섯, 조개는 영이지.', name: '셈하는 상인', x: 0.3, w: 129, h: 320, lines: ['여기서는 카카오 콩이 돈이란다.', '점은 하나, 막대는 다섯으로 세지.'] },
          { id: 'counter', pass: '아이고, 숨이 차구나.', name: '날 세는 사람', x: 0.4, w: 136, h: 313, lines: ['나는 달팽이 집에서 날을 센단다.', '매듭 하나가 하루지.'] },
          { id: 'child', pass: '오늘 뱀이 내려온대!', name: '구경 나온 아이', x: 0.51, w: 98, h: 214, lines: ['오늘은 다들 광장에 모여.', '해가 기울면 뭐가 보인대!'] },
          { id: 'weaver', pass: '고운 옷 보고 가요.', name: '천 짜는 아주머니', x: 0.62, w: 127, h: 309, lines: ['무명으로 짠 겉옷이란다.', '아이 것도 있어. 입어 보련?'],
            try: { id: 'wear-huipil', verb: 'wear', name: '마야의 옷', outfit: 'huipil', sora: '옷이 헐렁해서 시원해!', memo: '네모난 무명 천에 수를 놓은 겉옷이란다. 우이필이라고 하지.' } },
          { id: 'honey', pass: '달콤한 꿀이오!', name: '꿀 장수', x: 0.73, w: 135, h: 313, lines: ['통나무 속에서 벌을 친단다.', '침이 없는 작은 벌이지.'] },
          { id: 'cacao', pass: '거품 난 카카오요!', show: 'cacao', name: '카카오 장수', x: 0.85, w: 122, h: 305, lines: ['카카오 콩을 갈아 탄 물이란다.', '고추를 넣었지. 마셔 보련?'],
            try: { id: 'eat-cacao', verb: 'eat', name: '고추 넣은 카카오', face: 'yum', sora: '쌉쌀하고 매콤해! 그래도 맛있어.' } },
        ],
        spots: [],
      },
      {
        id: 'caracol', name: '마야 치첸이트사 달팽이 집 앞', short: '달팽이 집 앞', zoom: 1.13, ground: 0.72, scale: 0.661, air: 'hush',
        sora: '탑이 동그래!',
        people: [
          { id: 'stargazer', pass: '오늘 저녁엔 샛별이 뜨려나.', show: 'venus', pose: 'see-aha', sora: '창으로 별이 딱 보여!', memo: '달팽이 집의 창은 샛별(금성)이 지는 자리를 본단다. 샛별은 여덟 해에 다섯 번 돌아오지.', name: '별 보는 사람', x: 0.18, w: 132, h: 317, lines: ['저 둥근 탑에서 별을 본단다.', '좁은 창으로 샛별이 지는 걸 보지.'] },
          { id: 'plasterer', pass: '벽에 회를 하얗게 바르는 중이란다.', name: '회 바르는 일꾼', x: 0.29, w: 120, h: 299, lines: ['돌 위에 흰 회를 바른단다.', '안의 계단은 달팽이처럼 돌지.'] },
          { id: 'incense', pass: '향이 곱게 오르네.', name: '향 피우는 아주머니', x: 0.4, w: 105, h: 282, lines: ['나무 진으로 만든 향이란다.', '오늘 같은 날엔 꼭 피우지.'] },
          { id: 'player', pass: '공은 엉덩이로 받는 거야!', name: '공놀이 선수', x: 0.51, w: 143, h: 307, lines: ['고무공을 엉덩이로 쳐 올린단다.', '저 높은 돌 고리에 넣으면 이기지.'] },
          { id: 'feather', pass: '깃털 하나도 귀하지.', name: '깃털 장식 만드는 사람', x: 0.62, w: 132, h: 280, lines: ['먼 숲의 새 깃털이란다.', '제사장의 머리 장식을 만들지.'] },
          { id: 'piper', pass: '삐리리, 내 피리 소리 들려?', name: '피리 부는 아이', x: 0.73, w: 90, h: 208, lines: ['흙으로 빚은 피리야.', '북이 울리면 나도 같이 불 거야.'] },
          { id: 'drummer', pass: '다 모이면 북을 친다.', name: '북 치는 사람', x: 0.85, w: 140, h: 320, lines: ['사람들이 다 모이면 북을 친단다.', '그때까지 계단 앞은 비워 두지.'] },
        ],
        spots: [],
      },
      {
        id: 'pyramid', name: '마야 치첸이트사 큰 피라미드 발치', short: '피라미드 발치', zoom: 1.13, ground: 0.72, scale: 0.661, air: 'hush',
        sora: '계단이 하늘까지 가!',
        people: [
          { id: 'sweeper', pass: '한 칸, 두 칸, 끝이 없네.', show: 'steps', pose: 'see-wow', sora: '계단 수가 한 해의 날 수랑 똑같아!', memo: '계단이 네 쪽에 아흔한 칸씩이란다. 꼭대기 단까지 더하면 삼백예순다섯, 한 해의 날 수와 같지.', name: '계단 쓰는 사람', x: 0.18, w: 120, h: 274, lines: ['이 계단을 날마다 쓴단다.', '네 쪽을 다 세면 한 해의 날 수지.'] },
          { id: 'flower', pass: '꽃을 올려야지.', name: '꽃 든 아주머니', x: 0.29, w: 103, h: 251, lines: ['오늘은 낮과 밤의 길이가 같단다.', '그래서 다들 꽃을 들고 왔지.'] },
          { id: 'farmer', pass: '이제 씨를 심어야지.', name: '농부 할아버지', x: 0.4, w: 94, h: 269, lines: ['이 무렵이면 옥수수 심을 채비를 한단다.', '막대로 구멍을 내고 씨를 넣지.'] },
          { id: 'priest', pass: '해가 기울기를 기다린다.', show: 'serpent', pose: 'see-wow', sora: '빛이 뱀처럼 내려와!', memo: '봄날 오후에 계단 옆으로 세모꼴 빛 일곱이 줄지어 내려온단다. 아래의 돌 뱀 머리와 이어져 뱀처럼 보이지.', name: '제사장', x: 0.51, w: 131, h: 320, lines: ['이 피라미드는 옛 신전 위에 덧지었단다.', '깃털 달린 뱀의 신전이라고 하지.'] },
          { id: 'conch', pass: '뿌우! 조개 나팔을 불어 보자.', name: '조개 나팔 부는 사람', x: 0.62, w: 135, h: 271, lines: ['큰 소라 껍데기로 만든 나팔이란다.', '멀리 숲 너머까지 들리지.'] },
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
    first: '별 보는 돌탑을 쌓은 서라벌이란다. 금 추를 전해 주렴.',
    dir: 'seorabeol640', look: 'paper',
    drawn: '신라 무덤에서 나온 흰 말 그림처럼 그렸단다.',
    // (What is said of today: written from memory and then looked up, 2026.10.13.)
    now: {
      photo: 'photo-now.webp', name: '첨성대의 지금 모습', when: '대한민국 경주 · 오늘날',
      text: [
        '1962년, 첨성대는 나라가 지키는 보물 가운데 으뜸인 국보가 되었습니다.',
        '2000년에는 경주의 신라 유적들과 함께 유네스코 세계유산 "경주역사유적지구"가 되었습니다. 첨성대는 옛 궁터 월성 곁의 월성지구에 들어 있습니다.',
        '첨성대의 둥근 몸통 속은 비어 있지 않습니다. 남쪽으로 난 창의 높이까지 흙으로 채워져 있습니다.',
        '첨성대는 북쪽으로 조금 기울어 있습니다. 2009년에 처음 재어 보니 20센티미터쯤 기울어 있었습니다.',
        '2016년 경주에서 큰 지진이 났습니다. 그 뒤에 재어 보니 북쪽으로 2센티미터쯤 더 기울었지만, 첨성대는 무너지지 않았습니다.',
        '나라의 문화유산 연구원들이 지금도 기울기를 꾸준히 재며 살핍니다. 밤에는 불을 밝혀 두어, 해가 진 뒤에도 첨성대를 볼 수 있습니다.',
      ],
      credit: '사진: Basile Morin, 위키미디어 공용, CC BY-SA 4.0',
      // The tower by night (the user, 2026.10.20: "첨성대 밤 사진 추가"): Wikimedia Commons,
      // "첨성대 야경.jpg" by Top6bin (CC BY-SA 4.0), made smaller. Other photographs there show
      // the same tower lit blue and violet, so the colour of the light is said to change.
      more: {
        photo: 'photo-night.webp', name: '밤의 첨성대',
        text: '밤에 비추는 불빛은 색이 바뀝니다. 첨성대가 노랗게도, 파랗게도, 보랏빛으로도 보입니다.',
        credit: '사진: Top6bin, 위키미디어 공용, CC BY-SA 4.0',
      },
    },
    scenes: [
      {
        id: 'market', name: '신라 서라벌 저잣거리', short: '저잣거리', zoom: 1.13, ground: 0.725, scale: 0.661, air: 'market', floor: 'dirt',
        sora: '하늘도 땅도 나무껍질 빛이야!',
        people: [
          { id: 'potter', pass: '갓 구운 그릇이오!', name: '토기장이', x: 0.18, w: 125, h: 317, lines: ['가마에서 막 꺼낸 그릇이란다.', '굽이 높아서 상 없이도 쓰지.'] },
          { id: 'tteok', pass: '떡이오, 따끈한 떡!', show: 'tteok', name: '떡 파는 아주머니', x: 0.29, w: 130, h: 289, lines: ['시루에 갓 쪄 낸 떡이란다.', '꿀에 찍어 한 입 먹어 보련?'],
            try: { id: 'eat-tteok', verb: 'eat', name: '떡과 꿀', face: 'yum', sora: '떡이 쫄깃하고 꿀이 달아!' } },
          { id: 'toykid', pass: '내 말이 제일 빨라!', name: '흙 인형 든 아이', x: 0.4, w: 108, h: 232, lines: ['흙으로 빚은 말이야.', '아저씨가 가마에 같이 구워 줬어.'] },
          { id: 'goldsmith', pass: '금은 톡톡 살살 두드려야지.', name: '금 두드리는 장인', x: 0.51, w: 142, h: 320, lines: ['금은 두드리면 종이처럼 얇아진단다.', '그걸 오려서 꾸미개를 만들지.'] },
          { id: 'jade', pass: '옥은 천천히 갈아야 해.', show: 'crown', pose: 'see-wow', sora: '금관 장식이 나뭇가지 같아!', memo: '신라의 금관이란다. 작은 금 달개와 굽은 옥이 걸을 때마다 흔들렸겠지.', name: '옥 다듬는 장인', x: 0.62, w: 113, h: 313, lines: ['이 굽은 옥은 금관에 단단다.', '금 달개 사이에서 푸르게 빛나지.'] },
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
          { id: 'piper', pass: '삘리리, 피리 소리 좋지?', name: '피리 부는 소년', x: 0.51, w: 89, h: 197, lines: ['대나무로 만든 피리야.', '무덤 사이는 소리가 잘 울려.'] },
          { id: 'painter', pass: '흰 말아, 훨훨 달려라.', name: '말다래 그리는 화공', x: 0.62, w: 115, h: 266, lines: ['나무껍질에 흰 말을 그린단다.', '말 탄 이의 옷에 흙이 안 튀게 대지.'] },
          { id: 'water', pass: '물이 찰랑찰랑, 쏟을라.', name: '물동이 인 아주머니', x: 0.73, w: 108, h: 291, lines: ['우물에서 물을 길어 온단다.', '첨성대는 이 길 끝에 있지.'] },
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
          { id: 'ilgwan', pass: '추가 와야 할 텐데.', show: 'stars', pose: 'see-wow', sora: '일관님이 꼭대기에서 별을 세!', memo: '창까지는 사다리로 오르고, 그 위는 탑 속으로 올라갔다고들 한단다.', name: '일관', x: 0.73, w: 111, h: 296, lines: ['나는 하늘을 살피는 일관이란다.', '밤마다 별을 보고 적어 두지.'] },
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
      gate: { scene: 'tombs', open: 3, sora: '화랑이 길을 막고 있어. 못 가.' },
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
  // Baghdad about 830, under the caliph al-Ma'mun. Drawn as the book painting of the Baghdad
  // school (the user, of five tries: the first, "아랍 책 그림"). The day is not on record: the
  // day the men came back from the plain, toward evening. Pale: the sky is bare paper.
  // Looked up on 2026.10.13 and found so (docs/신기한-사실.md): al-Ma'mun sent sky-watchers to
  // a plain to measure the earth: from one place one party walked north and one south until
  // the height of the noon sun had changed by one degree, and measured how far they had
  // gone; a degree came to 56 to 57 Arab miles (the sources differ: "쉰여섯 마일 남짓"); in
  // 828 to 829 he had the sky measured in the Shammasiyya quarter of Baghdad, to see whether
  // Ptolemy's numbers held ("옛 그리스 책의 숫자"); al-Khwarizmi wrote his book of reckoning
  // about 830 and gave it to al-Ma'mun.
  // Weak, so not said: that paper was made in Baghdad from 794 to 795 (people only write on
  // paper and sell it). Careful, so said only as "책을 옮겨 적는 집": the House of Wisdom.
  // From memory: that Greek books were put into Arabic here; the brass astrolabe and how
  // it is held; dates, pomegranates and pomegranate water; the reed pen cut aslant and
  // soot ink; round reed boats on the Tigris; that the way on the plain was measured with
  // a cord and pegs; that there are 360 degrees round the earth; that al-Khwarizmi came
  // from Khwarazm, far to the east, and reckoned on a board of sand; that books were sewn
  // and bound in leather; long robes, turbans and head cloths; that there were no
  // telescopes yet.
  // Made up: the paper seller's errand, the gatekeeper, the translator and the back door by
  // the water channel, that al-Khwarizmi reckoned the earth's girth from this paper at
  // Shammasiyya, and everyone else who stands about.
  baghdad830: {
    first: '걸어서 땅을 잰 이들이 돌아온 날이란다. 종이를 전해 주렴.',
    // Who lived here, for a player who has not heard of them: the first slip of all (the user,
    // 2026.10.13: "사람들이 잘 모르는 문명에 대해서는 간략하게나마 소개하는 페이지를"). Written from memory, then looked up.
    intro: { title: '바그다드 사람들', text: '바그다드는 지금의 이라크에 있던 큰 나라의 서울이란다. 먼 나라의 책을 모아 아랍 말로 옮기고, 셈과 별을 깊이 살폈지.' },
    dir: 'baghdad830', look: 'paper', pale: true,
    drawn: '그 도시의 옛 책 그림처럼 그렸단다.',
    // (What is said of today: written from memory and then looked up, 2026.10.13.)
    now: {
      photo: 'photo-now.webp', name: '바그다드 옛 학교의 지금 모습', when: '이라크 바그다드 · 무스탄시리야 학교',
      text: [
        '알마문 때의 바그다드는 1258년 몽골 군대에 무너졌습니다. 그때의 건물은 거의 남아 있지 않습니다.',
        '사진 속 무스탄시리야 학교는 같은 왕조가 400년쯤 뒤인 1233년에 티그리스 강가에 세웠습니다.',
        '이 학교는 1258년 몽골의 침입에도 살아남았습니다. 1960년에 이라크 정부가 고쳐, 지금은 누구나 찾아가 볼 수 있습니다.',
        '지금은 무스탄시리야 대학교에 딸려 있고, 유네스코 세계유산 후보 목록에 올라 있습니다.',
        '알콰리즈미의 이름은 라틴어로 "알고리트미"라고 적혔고, 그것이 "알고리즘"이라는 말로 남았습니다.',
        '그가 쓴 셈 책의 제목에 든 "알자브르"라는 말은 영어로 대수학을 뜻하는 "앨지브라"가 되었습니다.',
      ],
      credit: '사진: Taisir Mahdi, 위키미디어 공용, CC BY-SA 4.0',
    },
    scenes: [
      {
        id: 'market', name: '아바스 왕조 바그다드 티그리스 강가의 책 시장', short: '책 시장', zoom: 1.093, ground: 0.749, scale: 0.640, air: 'market',
        sora: '책이랑 종이가 가득해!',
        people: [
          { id: 'boatman', pass: '배 들어온다, 비켜라!', name: '둥근 배 사공', x: 0.18, w: 122, h: 320, lines: ['갈대로 엮은 둥근 배란다.', '이 강으로 온갖 짐이 들어오지.'] },
          { id: 'paper', pass: '아이고, 가게를 못 비우는데.', name: '종이 장수', x: 0.29, w: 108, h: 289, lines: ['종이는 가볍고 글씨가 잘 써진단다.', '책 적는 이들이 날마다 사 가지.'] },
          { id: 'bookseller', pass: '새 책 들어왔소!', show: 'pen', pose: 'see-aha', sora: '갈대가 펜이 됐어!', memo: '갈대 끝을 비스듬히 깎아 먹을 찍어 썼단다. 책은 한 자 한 자 손으로 옮겨 적었지.', name: '책 장수', x: 0.4, w: 133, h: 285, lines: ['책은 모두 손으로 적은 것이란다.', '갈대 펜에 먹을 찍어 쓰지.'] },
          { id: 'datewife', pass: '달콤한 대추야자요!', show: 'dates', name: '대추야자 장수', x: 0.51, w: 128, h: 281, lines: ['저 나무에서 딴 대추야자란다.', '석류 물이랑 먹어 보련?'],
            try: { id: 'eat-dates830', verb: 'eat', name: '대추야자와 석류 물', face: 'yum', sora: '대추야자는 달고, 석류 물은 새콤해!' } },
          { id: 'clothier', pass: '고운 옷 보고 가요.', name: '옷 짓는 아주머니', x: 0.62, w: 112, h: 282, lines: ['소매가 넓은 긴 겉옷이란다.', '아이 것도 있어. 입어 보련?'],
            try: { id: 'wear-abbasid', verb: 'wear', name: '바그다드의 긴 겉옷', outfit: 'abbasid', sora: '소매가 넓어서 펄럭펄럭해!', memo: '헐렁한 긴 겉옷을 띠로 묶어 입었단다. 볕이 뜨거워도 바람이 잘 통하지.' } },
          { id: 'student', pass: '오늘은 무슨 책을 볼까.', name: '책 집에 가는 학생', x: 0.73, w: 90, h: 266, lines: ['저 문 안이 책을 옮겨 적는 집이야.', '먼 나라 책도 우리말로 옮겨.'] },
          { id: 'walker', pass: '휴, 많이도 걸었지.', name: '벌판에서 돌아온 이', x: 0.85, w: 122, h: 303, lines: ['넓은 벌판을 걷고 돌아왔단다.', '한 패는 북으로, 한 패는 남으로 갔지.'] },
        ],
        spots: [],
      },
      {
        id: 'house', name: '아바스 왕조 바그다드의 책을 옮겨 적는 집 안뜰', short: '책 집 안뜰', zoom: 1.124, ground: 0.725, scale: 0.658, air: 'hush',
        sora: '다들 조용히 책을 옮겨 적어!',
        people: [
          { id: 'copyist', pass: '한 자도 틀리면 안 돼.', show: 'algebra', pose: 'see-wow', sora: '책에 네모 그림이 있어!', memo: '알콰리즈미가 쓴 셈하는 책이란다. 모르는 수를 찾는 법을 차근차근 적었지.', name: '옮겨 적는 이', x: 0.18, w: 106, h: 278, lines: ['알콰리즈미의 셈하는 책이란다.', '임금님께 바친 책을 옮겨 적는 중이지.'] },
          { id: 'binder', pass: '실로 꿰매고, 가죽을 씌우고.', name: '책 매는 이', x: 0.29, w: 102, h: 289, lines: ['적은 종이를 실로 꿰맨단다.', '가죽을 씌우면 책이 되지.'] },
          { id: 'inkboy', pass: '먹 쏟으면 안 돼.', name: '먹 만드는 아이', x: 0.4, w: 79, h: 209, lines: ['나는 먹을 갈아서 날라.', '크면 나도 책을 적을 거야.'] },
          { id: 'visitor', pass: '허어, 책이 이리 많다니.', name: '먼 나라에서 온 학자', x: 0.51, w: 95, h: 307, lines: ['책을 보려고 먼 길을 왔다오.', '이렇게 책이 많은 곳은 처음 보오.'] },
          { id: 'waterer', pass: '물길이 막히면 안 되지.', name: '물길 돌보는 이', x: 0.62, w: 109, h: 289, lines: ['안뜰 물길은 뒤쪽까지 흐른단다.', '물소리가 나면 글이 잘 써진대.'] },
          { id: 'translator', pass: '이 말은 뭐라고 옮기나.', name: '그리스 책 옮기는 이', x: 0.73, w: 96, h: 288, lines: ['옛 그리스 책을 우리말로 옮긴단다.', '별과 셈을 적은 책이 많지.'] },
          { id: 'gatekeeper', pass: '쉿, 조용히 하시오.', name: '책 집 문지기', x: 0.85, w: 117, h: 320, lines: ['이 문 안에서 책을 옮겨 적는단다.', '떠들면 글씨가 틀리지.'] },
        ],
        spots: [],
      },
      {
        id: 'field', name: '아바스 왕조 바그다드 샴마시야의 별 보는 터', short: '별 보는 터', zoom: 1.105, ground: 0.740, scale: 0.646, air: 'hush',
        sora: '벌써 별이 떴어!',
        people: [
          { id: 'lampboy', pass: '등불 꺼지면 안 돼.', name: '등불 켜는 아이', x: 0.18, w: 101, h: 243, lines: ['해가 지면 내가 등불을 켜.', '별 보는 아저씨들은 밤에 일해.'] },
          { id: 'gazer', pass: '저 별은 얼마나 높나.', show: 'astrolabe', pose: 'see-aha', sora: '놋쇠 판으로 별을 겨눠!', memo: '별이 얼마나 높이 떴는지 재는 놋쇠 판이란다. 고리로 들고 막대로 별을 겨누지.', name: '별 재는 이', x: 0.29, w: 152, h: 320, lines: ['별을 재는 놋쇠 판이란다.', '들고 별을 겨누면 높이를 알지.'] },
          { id: 'scribe', pass: '불러 주시오, 적으리다.', name: '받아 적는 이', x: 0.4, w: 115, h: 300, lines: ['잰 것을 그 자리에서 종이에 적는단다.', '안 적으면 금세 잊어버리지.'] },
          { id: 'elder', pass: '옛 책이 맞나 보자꾸나.', name: '별 보는 이들의 어른', x: 0.51, w: 142, h: 319, lines: ['옛 그리스 책에 별의 숫자가 있단다.', '그게 맞는지 우리가 다시 재지.'] },
          { id: 'khwarizmi', pass: '종이가 와야 셈을 하지.', show: 'earth', pose: 'see-wow', sora: '걸어서 땅을 쟀어!', memo: '한 패는 북으로, 한 패는 남으로 걸었단다. 해의 높이가 한 눈금 바뀌는 데 쉰여섯 마일 남짓, 백 킬로미터쯤이었지.', name: '알콰리즈미', x: 0.62, w: 132, h: 312, lines: ['나는 셈하는 책을 쓴 사람이란다.', '먼 동쪽 땅에서 이 도시로 왔지.'] },
          { id: 'pupil', pass: '삼백에 예순을… 어렵다.', name: '셈 배우는 제자', x: 0.73, w: 112, h: 283, lines: ['선생님은 모래판에 셈을 하셔.', '나는 아직 손가락으로 세.'] },
          { id: 'waterwife', pass: '시원한 물 드시오.', name: '물 나르는 아주머니', x: 0.85, w: 119, h: 292, lines: ['밤새 별을 보면 목이 마르단다.', '그래서 내가 물을 나르지.'] },
        ],
        spots: [],
      },
    ],
    // "The paper from the plain" (core/tale.js; the storyboard of docs/신기한-사실.md): the
    // paper seller has the paper on which the men back from the plain wrote what they
    // measured, and cannot leave his stall; the gatekeeper of the house keeps her out while
    // the books are copied; the translator of Greek books sends her along the water channel
    // to the back door; she hands it to al-Khwarizmi, choosing what to say; and he shows
    // her how the earth was measured by walking.
    tale: {
      thing: true,
      ask: '땅이 얼마나 큰지 어떻게 쟀을까?',
      gate: { scene: 'house', open: 3, sora: '문지기가 막고 있어. 못 가.' },
      steps: [
        {
          who: 'paper', goal: '책 시장의 종이 장수에게 가 보렴.', holds: '종이 두루마리: 장수가 들고 있음',
          lines: ['얘야, 부탁 하나 들어주련?', '벌판에서 걸으며 잰 것을 적은 종이란다.', '별 보는 터의 알콰리즈미에게 전해 주렴.'],
          offer: { ask: '종이 두루마리를 전해 줄까?', label: '내가 전해 줄게요' },
          errand: 'took',
        },
        {
          who: 'gatekeeper', goal: '책 집 안뜰 끝의 문으로 가 보렴.', holds: '종이 두루마리: 소라가 들고 있음',
          lines: ['멈춰라. 지금 책을 옮겨 적는 중이다.', '끝날 때까지 아무도 못 지나간다.'],
          sora: '종이를 전해야 하는데… 어? 누가 불러!',
        },
        {
          who: 'translator', call: '얘, 그 종이 어디 가니?', goal: '그리스 책 옮기는 이가 부른다. 가 보렴.', holds: '종이 두루마리: 소라가 들고 있음',
          lines: ['알콰리즈미에게? 그럼 길을 알려 주마.', '안뜰 물길을 따라가면 뒷문이 있단다.', '문지기 양반, 뒷문으로 보내리다!'],
          after: [{ who: 'gatekeeper', line: '물길 따라 조용히 가거라.' }],
          sora: '물길 따라 뒷문으로 가면 된대! 가자!',
        },
        {
          who: 'khwarizmi', goal: '별 보는 터의 알콰리즈미에게 종이 두루마리를 전하렴.', holds: '종이 두루마리: 소라가 들고 있음',
          lines: ['오, 이 종이를 기다리고 있었단다.'],
          choice: {
            ask: '종이 두루마리를 건네며 뭐라고 할까?',
            options: [
              { id: 'E1', label: '"종이 장수가 보냈어요"', sora: '책 시장의 종이 장수가 보내셨어요.', says: '먼 길을 와 주었구나. 고맙다, 얘야.' },
              { id: 'E2', label: '"뭘 셈하세요?"', sora: '지금 무엇을 셈하세요?', says: '땅이 얼마나 큰지 셈한단다. 보여 주마.' },
            ],
          },
          errand: 'gave',
        },
        {
          who: 'khwarizmi', show: true, goal: '걸어서 잰 땅의 크기를 보렴.',
          lines: ['해의 높이가 한 눈금 바뀔 때까지 걸었단다.', '그 길에 삼백예순을 곱하면 땅의 둘레지.'],
          sora: '걸어서 땅의 크기를 알아냈어!',
          errand: 'saw',
        },
      ],
      asides: [
        { who: 'paper', when: ['S1', 'S2', 'S3', 'S4'], lines: ['알콰리즈미는 별 보는 터에 있단다.', '책 집 안뜰을 지나서 가렴.'] },
        { who: 'paper', when: ['S5'], lines: ['전해 주었구나. 고맙다, 얘야.', '이제 땅의 크기를 알게 되겠구나.'] },
      ],
      done: '종이 두루마리를 전하고, 걸어서 잰 땅의 크기를 보았다.',
    },
    errands: [
      { id: 'took', text: '종이 두루마리를 받는다.', at: [] },
      { id: 'gave', text: '알콰리즈미에게 종이 두루마리를 전한다.', at: [] },
      { id: 'saw', text: '걸어서 잰 땅의 크기를 본다.', at: [] },
    ],
    reply: '걸어서 땅의 크기를 알아냈단다. 알콰리즈미의 셈하는 책은 지금도 이름이 남아 있지.',
  },
  // Qin about 210 BC, at the foot of Mount Li east of Xianyang: the yards where the clay
  // soldiers are made. Drawn as the painting on lacquerware (the user, 2026.10.13, of five
  // tries: the second). The day is not on record. Not pale: the sky of the pictures is
  // black lacquer.
  // Looked up (docs/신기한-사실.md) and found so: the soldiers are some eight thousand;
  // after firing they were coated with lacquer and painted over it (pink, red, green, blue,
  // purple, black); each was marked with its maker's name, 87 master craftsmen are known
  // by name and each had some ten pupils; the faces were pressed in eight to ten moulds
  // and finished by hand (said as "같은 얼굴을 찾기 어렵다", never "다 다르다"); in 221 BC
  // the weights and measures were made one over the whole land.
  // From memory: clay trodden with the feet; bodies built up of coils and hollow; heads
  // fired apart and set in the neck; that they stand a little taller than a man; the kiln
  // fired for days; lacquer as the sap of a tree that makes the skin itch; colours ground
  // of stones; slips of bamboo tied with cord, written with a brush and scraped with a
  // knife to mend a slip of the brush (no paper yet); millet, bean-leaf soup; the robe
  // wrapped to the right and tied with a sash; clay horses four to a chariot; the pits
  // floored with brick and roofed with timbers and mats.
  // Made up: the potter's errand of the name seal, the official with the measuring rod,
  // the lacquerer and the cart, the overseer, every other person. Where the workshops
  // stood is not known: they are put by the pits.
  // Kept off the screen (the user's "조심할 것"): the people brought to work by force, the
  // shutting in of the tomb's builders, the burning of the books. Nothing is said in the
  // walk of what lies in the tomb.
  xianyang210: {
    first: '흙으로 병사 팔천을 빚는 일터란다. 이름 도장을 전해 주렴.',
    // Who lived here, for a player who has not heard of them: the first slip of all (the user,
    // 2026.10.13: "사람들이 잘 모르는 문명에 대해서는 간략하게나마 소개하는 페이지를"). Written from memory, then looked up.
    intro: { title: '진나라 사람들', text: '진나라는 중국을 처음으로 하나로 합친 나라란다. 글자와 저울과 잣대를 온 나라에 하나로 맞췄지.' },
    dir: 'xianyang210', look: 'paper',
    drawn: '그때의 검고 붉은 옻칠 그릇 그림처럼 그렸단다.',
    // (What is said of today: written from memory and then looked up, 2026.10.13.)
    now: {
      photo: 'photo-now.webp', name: '흙 병사들의 지금 모습', when: '중국 시안 · 병마용 1호 구덩이',
      text: [
        '1974년 3월, 농부들이 우물을 파다가 흙 병사를 찾았습니다. 시황제의 무덤 언덕에서 동쪽으로 1.2킬로미터쯤 떨어진 곳입니다.',
        '사진의 1호 구덩이는 동서로 230미터, 남북으로 62미터입니다. 이 구덩이에만 흙 병사와 말이 6,000개쯤 묻혀 있다고 봅니다.',
        '1979년 10월 1일, 1호 구덩이를 덮은 전시관이 박물관으로 문을 열었습니다.',
        '1987년, 시황제의 무덤과 흙 병사들은 함께 유네스코 세계유산이 되었습니다.',
        '2023년 한 해 동안 이 박물관에는 1,120만 번 넘게 사람들이 다녀갔습니다.',
        '흙 병사들은 아직 다 파내지 못했습니다. 시황제가 묻힌 무덤 언덕은 지금까지 한 번도 열지 않았습니다.',
      ],
      credit: '사진: Gary Lee Todd, 위키미디어 공용, CC0',
    },
    scenes: [
      {
        id: 'clay', name: '진나라 함양 동쪽 여산의 흙 병사 빚는 터', short: '빚는 터', zoom: 1.127, ground: 0.723, scale: 0.659, air: 'court', floor: 'dirt',
        sora: '흙 병사 머리만 선반에 가득해!',
        people: [
          { id: 'treader', pass: '영차, 흙을 꾹꾹 밟아라!', name: '흙 이기는 일꾼', x: 0.18, w: 135, h: 320, lines: ['흙을 발로 밟아 이긴단다.', '잘 이겨야 구울 때 안 터지지.'] },
          { id: 'waterkid', pass: '물 왔어요, 물!', name: '물 긷는 아이', x: 0.29, w: 153, h: 245, lines: ['흙에 부을 물을 길어 와.', '하루에 스무 번은 오가.'] },
          { id: 'potter', pass: '어이쿠, 손을 못 떼는데.', name: '흙 병사 빚는 장인', x: 0.4, w: 130, h: 319, lines: ['흙을 띠처럼 감아 몸을 올린단다.', '다 빚으면 내 이름을 찍지.'] },
          { id: 'facer', pass: '이 병사는 눈썹을 짙게.', show: 'faces', pose: 'see-aha', sora: '틀은 여덟인데 얼굴은 많아!', memo: '얼굴은 틀 여덟 가지쯤으로 찍었단다. 그다음 손으로 고쳐서 같은 얼굴을 찾기 어렵지.', name: '얼굴 빚는 장인', x: 0.51, w: 133, h: 317, lines: ['얼굴은 먼저 틀로 찍는단다.', '그다음 손으로 하나하나 고치지.'] },
          { id: 'pupil', pass: '스승님, 틀 가져왔어요!', name: '제자 아이', x: 0.62, w: 98, h: 247, lines: ['나는 스승님께 빚는 걸 배워.', '제자가 나까지 열 명이야.'] },
          { id: 'cook', pass: '따끈한 조밥 드시오!', show: 'millet', name: '조밥 짓는 아주머니', x: 0.73, w: 146, h: 287, lines: ['노란 조로 지은 밥이란다.', '콩잎국이랑 먹어 보련?'],
            try: { id: 'eat-millet', verb: 'eat', name: '조밥과 콩잎국', face: 'yum', sora: '조밥이 알알이 톡톡! 고소해.' } },
          { id: 'stoker', pass: '불이 약하면 안 되지.', name: '가마 불 때는 이', x: 0.85, w: 136, h: 315, lines: ['빚은 병사를 가마에 굽는단다.', '며칠을 때야 돌처럼 단단해지지.'] },
        ],
        spots: [],
      },
      {
        id: 'paint', name: '진나라 함양 동쪽 여산의 흙 병사 칠하는 터', short: '칠하는 터', zoom: 1.131, ground: 0.720, scale: 0.662, air: 'court', floor: 'dirt',
        sora: '병사가 알록달록해!',
        people: [
          { id: 'grinder', pass: '물감은 곱게, 더 곱게 갈아야지.', name: '물감 가는 이', x: 0.18, w: 116, h: 285, lines: ['돌을 곱게 갈면 물감이 된단다.', '붉은 돌에서 붉은색이 나오지.'] },
          { id: 'painter', pass: '옷은 초록, 끈은 빨강.', show: 'colors', pose: 'see-wow', sora: '병사들이 원래 흙빛이 아니었어!', memo: '흙 병사는 구운 뒤 옻을 바르고 색을 칠했단다. 분홍, 빨강, 초록, 파랑, 보라, 검정을 썼지.', name: '색칠하는 화공', x: 0.29, w: 120, h: 308, lines: ['옻 위에 색을 입힌단다.', '얼굴은 분홍, 옷은 초록과 파랑이지.'] },
          { id: 'weigher', pass: '한 눈금도 틀리면 안 돼.', show: 'weight', pose: 'see-aha', sora: '어디서 달아도 무게가 똑같대!', memo: '진나라는 온 나라의 저울추와 잣대를 하나로 맞췄단다. 어디서 달아도 무게가 같았지.', name: '저울 다는 이', x: 0.4, w: 115, h: 301, lines: ['이 저울추는 온 나라가 똑같단다.', '어디서 달아도 무게가 같지.'] },
          { id: 'lacquerer', pass: '옻은 얇게, 고르게.', name: '옻 바르는 칠장이', x: 0.51, w: 143, h: 303, lines: ['옻나무에서 받은 검은 옻이란다.', '이걸 발라야 색이 잘 붙지.'] },
          { id: 'clothier', pass: '고운 옷 보고 가요.', name: '옷 짓는 아주머니', x: 0.62, w: 112, h: 284, lines: ['깃에 붉은 단을 댄 긴 옷이란다.', '아이 것도 있어. 입어 보련?'],
            try: { id: 'wear-qin', verb: 'wear', name: '진나라의 옷', outfit: 'qin', sora: '옷이 몸을 한 바퀴 감아!', memo: '긴 옷을 앞에서 여며 몸에 감고 띠로 묶어 입었단다.' } },
          { id: 'carter', pass: '짚을 두둑이 깔아야지.', name: '수레 끄는 일꾼', x: 0.73, w: 132, h: 307, lines: ['다 칠한 병사를 구덩이로 나른단다.', '깨질라, 짚을 깔고 눕혀 가지.'] },
          { id: 'official', pass: '키가 한 치 모자라는군.', name: '잣대 든 벼슬아치', x: 0.85, w: 137, h: 320, lines: ['가마에서 나온 병사를 잰단다.', '키와 어깨가 잣대에 맞아야 하지.'] },
        ],
        spots: [],
      },
      {
        id: 'pit', name: '진나라 함양 동쪽 여산의 흙 병사 세우는 구덩이', short: '구덩이', zoom: 1.105, ground: 0.740, scale: 0.646, air: 'hush',
        sora: '흙 병사가 끝도 없이 서 있어!',
        people: [
          { id: 'liner', pass: '왼쪽으로 반 뼘만 옮겨라!', name: '줄 맞추는 일꾼', x: 0.18, w: 119, h: 254, lines: ['줄을 당겨 병사를 세운단다.', '한 줄이 실처럼 곧아야 하지.'] },
          { id: 'girl', pass: '어? 아까 그 얼굴인가?', name: '얼굴 찾는 아이', x: 0.29, w: 130, h: 235, lines: ['똑같은 얼굴을 찾는 중이야.', '아침부터 찾았는데 아직 없어.'] },
          { id: 'scribe', pass: '이 대나무는 다 채워 적었구나.', name: '대나무에 적는 서기', x: 0.4, w: 124, h: 320, lines: ['대나무 조각에 붓으로 적는단다.', '틀리면 칼로 깎아 내고 다시 쓰지.'] },
          { id: 'horseman', pass: '말 귀는 쫑긋하게.', name: '흙 말 빚는 장인', x: 0.51, w: 119, h: 273, lines: ['나는 흙으로 말을 빚는단다.', '수레 한 대에 말이 넷이지.'] },
          { id: 'overseer', pass: '한 자리가 비었는데.', show: 'ranks', pose: 'see-wow', sora: '같은 얼굴이 안 보여!', memo: '흙 병사는 팔천쯤이란다. 병사마다 만든 이의 이름이 찍혀 있지.', name: '구덩이의 감독', x: 0.62, w: 134, h: 319, lines: ['병사마다 만든 이의 이름을 찍는단다.', '이름이 찍혀야 줄에 세우지.'] },
          { id: 'roofer', pass: '들보 올라간다, 비켜라!', name: '지붕 얹는 목수', x: 0.73, w: 164, h: 302, lines: ['줄이 다 차면 지붕을 얹는단다.', '통나무를 걸치고 돗자리를 덮지.'] },
          { id: 'elder', pass: '허허, 많이도 빚었구나.', name: '늙은 장인', x: 0.85, w: 115, h: 277, lines: ['병사가 팔천쯤 된단다.', '우리 장인들이 제자와 함께 빚었지.'] },
        ],
        spots: [],
      },
    ],
    // "The name seal" (core/tale.js; the storyboard of docs/신기한-사실.md): the potter who
    // shapes the soldiers has left his name seal off the soldier that went to the pit and
    // cannot leave the clay; the official before the kiln is measuring the fired soldiers
    // with his rod and lets no one by; the lacquerer sends her after the cart that carries
    // the painted soldiers; she hands the seal to the overseer, choosing what to say; and
    // he shows her the painted soldiers standing in their rows, where it is hard to find
    // one face twice.
    tale: {
      thing: true,
      ask: '팔천이나 되는 병사를 어떻게 빚었을까?',
      gate: { scene: 'paint', open: 3, sora: '벼슬아치가 막고 있어. 못 가.' },
      steps: [
        {
          who: 'potter', goal: '빚는 터의 흙 병사 빚는 장인에게 가 보렴.', holds: '이름 도장: 장인이 들고 있음',
          lines: ['얘야, 부탁 하나 들어주련?', '내 이름을 새긴 도장이란다.', '구덩이의 감독에게 전해 주렴.'],
          offer: { ask: '이름 도장을 전해 줄까?', label: '내가 전해 줄게요' },
          errand: 'took',
        },
        {
          who: 'official', goal: '칠하는 터를 지나 구덩이로 가 보렴.', holds: '이름 도장: 소라가 들고 있음',
          lines: ['멈춰라. 병사를 잣대로 재는 중이다.', '다 잴 때까지는 못 지나간다.'],
          sora: '도장을 전해야 하는데… 어? 누가 불러!',
        },
        {
          who: 'lacquerer', call: '얘, 어디 가는데?', goal: '옻 바르는 칠장이가 부른다. 가 보렴.', holds: '이름 도장: 소라가 들고 있음',
          lines: ['구덩이에 간다고? 그럼 이리 오렴.', '다 칠한 병사를 싣고 수레가 간단다.', '나리, 수레 따라 보낼게요!'],
          after: [{ who: 'official', line: '수레를 따라간다면 가도 좋다.' }],
          sora: '수레를 따라가면 된대! 가자!',
        },
        {
          who: 'overseer', goal: '구덩이의 감독에게 이름 도장을 전하렴.', holds: '이름 도장: 소라가 들고 있음',
          lines: ['오, 그 도장을 기다리던 참이란다.'],
          choice: {
            ask: '이름 도장을 건네며 뭐라고 할까?',
            options: [
              { id: 'E1', label: '"빚는 아저씨가 보냈어요"', sora: '빚는 터의 장인 아저씨가 보내셨어요.', says: '그 사람 솜씨가 좋지. 고맙다, 얘야.' },
              { id: 'E2', label: '"이름은 왜 찍어요?"', sora: '이름은 왜 찍어요?', says: '누가 빚었는지 알아야 하니까 그렇단다.' },
            ],
          },
          errand: 'gave',
        },
        {
          who: 'overseer', show: true, goal: '줄지어 선 흙 병사를 보렴.',
          lines: ['이제 마지막 병사도 줄에 세우마.', '자, 얼굴을 하나하나 보렴.'],
          sora: '같은 얼굴이 하나도 안 보여!',
          errand: 'saw',
        },
      ],
      asides: [
        { who: 'potter', when: ['S1', 'S2', 'S3', 'S4'], lines: ['감독 어른은 구덩이에 있단다.', '칠하는 터를 지나 끝까지 가렴.'] },
        { who: 'potter', when: ['S5'], lines: ['전해 주었구나. 고맙다, 얘야.', '이제 내 병사도 줄에 서겠구나.'] },
      ],
      done: '이름 도장을 전하고, 줄지어 선 흙 병사를 보았다.',
    },
    errands: [
      { id: 'took', text: '이름 도장을 받는다.', at: [] },
      { id: 'gave', text: '감독에게 이름 도장을 전한다.', at: [] },
      { id: 'saw', text: '줄지어 선 흙 병사를 본다.', at: [] },
    ],
    reply: '이천 해도 더 지나 우물을 파다가 찾았단다. 색은 벗겨졌어도 얼굴은 그대로지.',
  },
  // Machu Picchu about 1450, the morning of the shortest day there (the June solstice), in
  // the reign of Pachacuti. Drawn as the hammered sheet gold of the Inca and the Chimu on a
  // dark red cloth (the user's choice of five tries: the fifth). The pictures are in
  // machupicchu1450; the try itself is not a scene (it has the sun high over terraces, a
  // masons' yard and the stone called Intihuatana at once, and neither the gate nor the
  // temple), so all three scenes were ordered anew. The storyboard's gate stands at the
  // right end of the second scene, where the one who bars the way has to stand.
  // Looked up on 2026.10.13 and found so: the round-walled house (the Torreon, the temple of
  // the sun) has a north-east window facing sunrise at the June solstice, and that morning
  // the light falls on the rock inside, whose straight cut edge is at right angles to the
  // window (some have the light coming in from May: nothing here says "only that day");
  // built under Pachacuti, about 1438 to 1450 by the old writings; stones fitted with
  // nothing between them, worked with stone, copper and bronze, without iron, wheels or
  // beasts to pull; numbers on knotted cords, tens, hundreds and thousands by the place on
  // the cord and the number by the kind of knot; relay runners changing about every 2.5 km
  // (how far in a day is not said).
  // From memory: terraces and water channels; the single gate with its barred wooden door;
  // the foot plough; boiled potatoes and maize, and that the maize is in by June; that
  // potatoes came from these mountains and were of many colours; the shell trumpet of the
  // runner; the pan flute; ropes and bridges twisted of grass, remade every year; stones
  // hauled by many people with ropes; the fountains in a row; gold as "the sweat of the
  // sun"; the great ear spools of the nobles; that the sun told the time to sow; that a
  // grass blade will not go between the stones; the dress and its pin; alpaca wool; that
  // the keepers of the cords read them by hand; that the way from Cusco took days on foot.
  // Made up: the errand of the knotted cord from Cusco and what it counts, the gatekeeper
  // who lets no one in before sunrise, the mason who shows the narrow steps by the water
  // channel, every other person.
  // Kept out: human sacrifice; the name and the use of the stone called Intihuatana; chicha.
  machuPicchu: {
    first: '한 해에 낮이 가장 짧은 날이란다. 매듭 끈을 전해 주렴.',
    // Who lived here, for a player who has not heard of them: the first slip of all (the user,
    // 2026.10.13: "사람들이 잘 모르는 문명에 대해서는 간략하게나마 소개하는 페이지를"). Written from memory, then looked up.
    intro: { title: '잉카 사람들', text: '남아메리카의 높은 안데스 산에 큰 나라를 세운 사람들이란다. 글자 없이 매듭 끈으로 수를 적고, 산길을 달려 소식을 전했지.' },
    dir: 'machupicchu1450', look: 'paper',
    drawn: '잉카의 금 꾸미개처럼, 금판을 두드려 낸 듯 그렸단다.',
    // (What is said of today: written from memory and then looked up, 2026.10.13.)
    now: {
      photo: 'photo-now.webp', name: '마추픽추의 지금 모습', when: '페루 쿠스코 · 오늘날',
      text: [
        '집의 지붕은 모두 사라졌습니다. 회반죽 없이 돌을 맞물려 쌓은 벽과 계단밭은 지금도 남아 있습니다.',
        '1911년 7월 24일, 그 고장 농부 멜초르 아르테아가가 미국의 하이럼 빙엄을 이곳으로 데려왔습니다. 그때도 한 농부 부부가 계단밭을 일구며 살고 있었습니다.',
        '빙엄은 그릇과 뼈 같은 유물을 미국 예일 대학으로 가져갔습니다. 페루가 오래 돌려 달라고 한 끝에, 유물들은 2011년과 2012년에 돌아왔습니다.',
        '1983년에 유네스코 세계유산이 되었습니다. 옛 도시와 함께 둘레의 숲과 산도 지킵니다.',
        '마추픽추는 바다보다 2,430미터쯤 높은 산등성이에 있습니다. 2025년에는 150만 명이 넘게 찾아왔습니다.',
        '돌과 땅이 상하지 않도록, 사람이 많은 철에는 하루에 5,600명까지만 들어갈 수 있습니다.',
      ],
      credit: '사진: Diego Delso, 위키미디어 공용, CC BY-SA 4.0',
      // From the hill across (the user, 2026.10.20: "건너편 산에서 찍은 사진도 올려줘"; first a view
      // down from Huayna Picchu, "엉뚱한 산이야"): Wikimedia Commons, "Machu Picchu, Perú,
      // 2015-07-30, DD 37.jpg" by Diego Delso (CC BY-SA 4.0), made smaller: the whole town from the
      // terraces above it, Huayna Picchu behind.
      more: {
        photo: 'photo-across.webp', name: '건너편 언덕에서 본 마추픽추',
        text: '마을 위쪽 언덕에서 내려다본 모습입니다. 마을은 두 봉우리 사이의 좁은 등성이에 앉아 있고, 뒤에 솟은 뾰족한 산이 와이나픽추입니다.',
        credit: '사진: Diego Delso, 위키미디어 공용, CC BY-SA 4.0',
      },
    },
    scenes: [
      {
        id: 'terraces', name: '잉카 마추픽추 계단밭', short: '계단밭', zoom: 1.124, ground: 0.725, scale: 0.658, air: 'market', floor: 'dirt',
        sora: '밭이 계단처럼 층층이야!',
        people: [
          { id: 'farmer', pass: '올해 감자가 굵구먼.', name: '감자 캐는 농부', x: 0.18, w: 142, h: 303, lines: ['비탈에 돌을 쌓아 밭을 만들었단다.', '이 쟁기는 발로 꾹 밟아서 쓰지.'] },
          { id: 'cook', pass: '감자 다 익었다!', show: 'potato', name: '감자 삶는 아주머니', x: 0.29, w: 123, h: 287, lines: ['갓 삶은 감자와 옥수수란다.', '추운 아침엔 이게 최고지. 먹어 보련?'],
            try: { id: 'eat-potato', verb: 'eat', name: '삶은 감자와 옥수수', face: 'yum', sora: '감자가 포슬포슬해! 손이 따뜻해.' } },
          { id: 'piper', pass: '후우, 피리를 불어 볼까. 삐리리.', name: '피리 부는 아이', x: 0.4, w: 84, h: 222, lines: ['갈대 대롱을 묶은 피리야.', '산에서 불면 건너편까지 들려.'] },
          { id: 'chasqui', pass: '헉, 헉… 다 왔다.', name: '숨찬 전령', x: 0.51, w: 171, h: 320, lines: ['나는 소식을 들고 달리는 전령이란다.', '산길을 쉬지 않고 달려왔지.'] },
          { id: 'nextrunner', pass: '언제든 달릴 수 있지.', show: 'runner', pose: 'see-wow', sora: '전령이 달리면서 소식을 건네줘!', memo: '전령은 조금 달리고 다음 사람에게 넘겼단다. 그렇게 이어 달려 먼 데까지 소식을 전했지.', name: '다음 전령', x: 0.62, w: 124, h: 315, lines: ['전령은 혼자 끝까지 안 달린단다.', '오두막마다 다음 사람이 기다리지.'] },
          { id: 'weaver', pass: '고운 털실 보고 가렴.', name: '천 짜는 아주머니', x: 0.73, w: 111, h: 288, lines: ['알파카 털로 짠 어깨 천이란다.', '아이 것도 있어. 입어 보련?'],
            try: { id: 'wear-inca', verb: 'wear', name: '잉카의 옷', outfit: 'inca', sora: '털옷이 폭신해! 하나도 안 추워.', memo: '긴 옷을 몸에 감고 띠를 맸단다. 어깨 천은 큰 옷핀 하나로 여몄지.' } },
          { id: 'canal', pass: '물이 잘 내려가는구먼.', name: '물길 살피는 아저씨', x: 0.85, w: 134, h: 299, lines: ['돌을 파서 물길을 냈단다.', '샘물이 도시 안까지 흘러가지.'] },
        ],
        spots: [],
      },
      {
        id: 'gate', name: '잉카 마추픽추 성문 앞', short: '성문 앞', zoom: 1.131, ground: 0.720, scale: 0.662, air: 'chisels', floor: 'dirt',
        sora: '돌이 집채만 해!',
        people: [
          { id: 'hauler', pass: '영차, 영차! 밧줄을 당겨라!', name: '밧줄 끄는 일꾼', x: 0.18, w: 123, h: 307, lines: ['수레도 없이 돌을 끈단다.', '여럿이 밧줄로 당겨서 옮기지.'] },
          { id: 'fitter', pass: '조금만 더 갈아야겠군.', show: 'wall', pose: 'see-wow', sora: '돌 사이에 틈이 하나도 없어!', memo: '돌 사이에 아무것도 안 발랐단다. 쇠 연장도 없이 돌과 구리로 다듬었지.', name: '돌 맞추는 장인', x: 0.29, w: 118, h: 305, lines: ['돌을 갈고 또 갈아 맞춘단다.', '풀잎 한 장도 못 끼우지.'] },
          { id: 'mason', pass: '통, 통, 살살 쪼아야지.', name: '석공', x: 0.4, w: 136, h: 308, lines: ['돌망치로 돌을 쪼아 다듬는단다.', '이 도시의 돌은 다 그렇게 깎았지.'] },
          { id: 'roper', pass: '밧줄을 쉬지 않고 꼬는 중이란다.', name: '밧줄 꼬는 할머니', x: 0.51, w: 116, h: 282, lines: ['풀을 꼬아 밧줄을 만든단다.', '굵게 꼬면 다리도 놓을 수 있지.'] },
          { id: 'keeper', pass: '돌이 몇이더라, 어디 보자.', show: 'khipu', pose: 'see-aha', sora: '끈에 묶은 매듭이 숫자래!', memo: '잉카 사람들은 글자 대신 끈에 매듭을 지어 수를 적었단다. 매듭의 꼴과 자리로 수를 읽었지.', name: '매듭 끈 읽는 이', x: 0.62, w: 118, h: 309, lines: ['우리는 끈에 매듭을 지어 수를 적는단다.', '매듭의 자리가 다르면 수도 다르지.'] },
          { id: 'waterkid', pass: '아이, 차가워!', name: '물 긷는 아이', x: 0.73, w: 88, h: 212, lines: ['샘물이 얼음처럼 차가워.', '물길 옆 계단은 나만 다녀.'] },
          { id: 'gatekeeper', pass: '해가 떠야 문을 열지.', name: '성문 문지기', x: 0.85, w: 137, h: 320, lines: ['이 도시의 문은 여기 하나뿐이란다.', '그래서 내가 밤새 지키지.'] },
        ],
        spots: [],
      },
      {
        id: 'temple', name: '잉카 마추픽추 해의 신전 앞', short: '해의 신전 앞', zoom: 1.143, ground: 0.710, scale: 0.669, air: 'hush', floor: 'dirt',
        sora: '벽이 둥글게 휘었어!',
        people: [
          { id: 'sweeper', pass: '뜰을 싹싹 깨끗하게 쓸어야지.', name: '뜰 쓰는 아이', x: 0.18, w: 102, h: 259, lines: ['해가 뜨기 전에 뜰을 쓸어.', '오늘은 아주 큰 날이거든.'] },
          { id: 'maize', pass: '잘 여문 것으로 골랐지.', name: '옥수수 올리는 아주머니', x: 0.29, w: 122, h: 302, lines: ['올해 거둔 옥수수를 올린단다.', '해님 덕에 잘 익었으니까.'] },
          { id: 'goldsmith', pass: '톡톡, 살살 두드려야지.', name: '금판 두드리는 장인', x: 0.4, w: 149, h: 306, lines: ['얇은 금판을 뒤에서 두드린단다.', '그러면 해님 얼굴이 도드라지지.'] },
          { id: 'noble', pass: '곧 해가 뜨겠구나.', name: '귀한 어른', x: 0.51, w: 136, h: 320, lines: ['파차쿠티 임금님이 세운 도시란다.', '해를 모시려고 이 집을 지었지.'] },
          { id: 'pourer', pass: '한 방울도 흘리면 안 돼.', name: '물 따르는 아가씨', x: 0.62, w: 120, h: 298, lines: ['샘이 층층이 이어져 있단다.', '맨 위의 물이 가장 맑지.'] },
          { id: 'sunwatcher', pass: '매듭 끈이 와야 할 텐데.', show: 'sunbeam', pose: 'see-wow', sora: '빛이 창으로 쏙 들어와!', memo: '낮이 가장 짧은 날 아침, 해가 창으로 들어 바위를 비춘단다. 창을 해 뜨는 쪽으로 냈지.', name: '해 보는 이', x: 0.73, w: 137, h: 313, lines: ['나는 해가 뜨는 자리를 살핀단다.', '해는 날마다 조금씩 옮겨 뜨지.'] },
          { id: 'elder', pass: '이제 낮이 길어지겠구먼.', name: '농부 할아버지', x: 0.85, w: 159, h: 282, lines: ['해를 보고 씨 뿌릴 때를 안단다.', '오늘부터 낮이 다시 길어지지.'] },
        ],
        spots: [],
      },
    ],
    // "The knotted cord" (core/tale.js; the storyboard of docs/신기한-사실.md): a runner out
    // of breath has a knotted cord from Cusco for the one who watches the sun, and runs no
    // farther; the keeper of the one gate lets no one in before sunrise; the mason shows her
    // the narrow stone steps by the water channel; she hands it to the sun-watcher, choosing
    // what to say; and the sun comes up over the mountain and its light goes in at the window
    // and falls on the cut face of the rock.
    tale: {
      thing: true,
      ask: '해는 어느 창으로 들어올까?',
      gate: { scene: 'gate', open: 3, sora: '문지기가 막고 있어. 못 가.' },
      steps: [
        {
          who: 'chasqui', goal: '계단밭의 숨찬 전령에게 가 보렴.', holds: '매듭 끈: 전령이 들고 있음',
          lines: ['헉, 헉… 얘야, 부탁 하나 들어주련?', '쿠스코에서 온 매듭 끈이란다. 나는 여기까지만 달리지.', '해의 신전의 해 보는 이께 전해 주렴.'],
          offer: { ask: '매듭 끈을 전해 줄까?', label: '내가 전해 줄게요' },
          errand: 'took',
        },
        {
          who: 'gatekeeper', goal: '돌 다듬는 터 끝의 성문으로 가 보렴.', holds: '매듭 끈: 소라가 들고 있음',
          lines: ['멈춰라. 문은 해가 떠야 연다.', '해 뜨기 전에는 아무도 못 들어간다.'],
          sora: '해 뜨기 전에 전해야 하는데… 어? 누가 불러!',
        },
        {
          who: 'mason', call: '얘, 어디 가는데?', goal: '석공이 부른다. 가 보렴.', holds: '매듭 끈: 소라가 들고 있음',
          lines: ['해 보는 이께 간다고? 그럼 저 길로 가렴.', '물길 옆에 좁은 돌계단이 있단다.', '문지기님, 이 아이는 물길 옆 계단으로 보냅니다!'],
          after: [{ who: 'gatekeeper', line: '매듭 끈 심부름이라면 그 길로 가거라.' }],
          sora: '물길 옆 계단으로 가면 된대! 가자!',
        },
        {
          who: 'sunwatcher', goal: '해의 신전 앞의 해 보는 이에게 매듭 끈을 전하렴.', holds: '매듭 끈: 소라가 들고 있음',
          lines: ['오, 기다리던 매듭 끈이로구나.'],
          choice: {
            ask: '매듭 끈을 건네며 뭐라고 할까?',
            options: [
              { id: 'E1', label: '"전령 아저씨가 보냈어요"', sora: '숨찬 전령 아저씨가 보내셨어요.', says: '먼 길을 이어 달려왔구나. 고맙다, 얘야.' },
              { id: 'E2', label: '"매듭이 무슨 뜻이에요?"', sora: '이 매듭은 무슨 뜻이에요?', says: '지난해 오늘까지 센 날의 수란다.' },
            ],
          },
          errand: 'gave',
        },
        {
          who: 'sunwatcher', show: true, goal: '해가 창으로 드는 것을 보렴.',
          lines: ['때맞춰 왔구나. 산 너머를 보렴.', '해가 뜨면 빛이 저 창으로 든단다.'],
          sora: '빛이 바위에 딱 닿았어!',
          errand: 'saw',
        },
      ],
      asides: [
        { who: 'chasqui', when: ['S1', 'S2', 'S3', 'S4'], lines: ['해 보는 이는 해의 신전에 계신단다.', '성문을 지나 둥근 벽의 집으로 가렴.'] },
        { who: 'chasqui', when: ['S5'], lines: ['전해 주었구나. 고맙다, 얘야.', '이제야 숨을 좀 돌리겠구나.'] },
      ],
      done: '매듭 끈을 전하고, 해가 창으로 드는 것을 보았다.',
    },
    errands: [
      { id: 'took', text: '매듭 끈을 받는다.', at: [] },
      { id: 'gave', text: '해 보는 이에게 매듭 끈을 전한다.', at: [] },
      { id: 'saw', text: '해가 창으로 드는 것을 본다.', at: [] },
    ],
    reply: '산이 숨겨 줘서 남은 도시란다. 숨이 차지 않더냐.',
  },
  // Great Zimbabwe about 1350: the Great Enclosure. Drawn as the painting on the earthen
  // walls of southern African houses (the user, of five tries: the third). The day is not
  // on record. Pale: the sky of the pictures is a light clay wash.
  // Looked up on 2026.10.13 and found so (docs/신기한-사실.md): the outer wall is some 250 m
  // round and 10 to 11 m at its highest (9.7 m in another source: "어른 키의 여섯 배쯤"), of
  // granite split flat and laid with nothing between the stones, of the 13th to 14th
  // centuries; within it a solid conical tower 9 to 10 m high ("어른 키의 다섯 배도 넘어"),
  // and no one knows what it was for; Chinese celadon and Indian glass beads were found
  // here, some 500 km from the sea; they lived by gold and cattle and traded with the
  // coast; soapstone birds that sat on stone pillars were found, and their meaning is not
  // known.
  // Kept off the screen: how many people lived here, how many birds there are, and any
  // meaning for the tower or the birds (the people of the walk say only what they are made
  // of; the grandmother says "아무도 모른다").
  // From memory: the band along the top of the wall and that its stones are set aslant;
  // sorghum porridge; gold melted in clay crucibles; cotton cloth woven here; that
  // soapstone is soft; the narrow passage between two walls that leads to the tower and
  // lets one person through at a time; that many cattle meant wealth; clay pots; drums.
  // Made up: the dress and what is said of it, the walk of a month from the coast (500 km
  // on foot), the trader's errand of the bowl, the keeper and the cattle in the passage,
  // the mason, the king's sister, the day the last stone is laid, that the wall was
  // building "since grandfather's grandfather", and everyone else who stands about.
  zimbabwe1350: {
    first: '높은 돌담의 마지막 돌을 올리는 날이란다. 푸른 그릇을 전해 주렴.',
    // Who lived here, for a player who has not heard of them: the first slip of all (the user,
    // 2026.10.13: "사람들이 잘 모르는 문명에 대해서는 간략하게나마 소개하는 페이지를"). Written from memory, then looked up.
    intro: { title: '쇼나 사람들의 조상', text: '아프리카 남쪽에 돌로 큰 도시를 지은 사람들이란다. 소를 기르고 금을 캐서, 바다 건너 먼 나라와 물건을 바꿨지.' },
    dir: 'zimbabwe1350', look: 'paper', pale: true,
    drawn: '그 땅의 흙집 벽에 그린 그림처럼 그렸단다.',
    // (What is said of today: written from memory and then looked up, 2026.10.13.)
    now: {
      photo: 'photo-now.webp', name: '원뿔 탑의 지금 모습', when: '짐바브웨 마스빙고 · 그레이트 짐바브웨',
      text: [
        '큰 담은 높이 11미터쯤, 길이 250미터쯤입니다. 담 안의 원뿔 탑은 높이 9미터쯤이고, 둘 다 지금도 서 있습니다.',
        '원뿔 탑은 속까지 돌로 꽉 차 있어 들어갈 문도 계단도 없습니다. 왜 쌓았는지 적은 글은 남아 있지 않습니다. 곡식 창고를 본떠, 왕이 곡식을 거두고 나눠 주는 힘을 보인 것이라는 생각이 많습니다.',
        '이 도시는 1400년대부터 장사가 줄어 힘을 잃었고, 1600년대쯤에는 사람들이 떠나 비었습니다.',
        '1871년, 독일의 탐험가 카를 마우흐가 이곳에 와서 무너진 돌담을 둘러보았습니다.',
        '1980년에 새로 선 나라는 이곳의 이름을 따서 나라 이름을 짐바브웨라고 지었습니다. 쇼나 말로 "돌로 지은 집"이라는 뜻입니다.',
        '여기서 나온 돌 새 8개는 나라 깃발과 돈에 그려져 있습니다. 나라 밖으로 실려 갔던 새 가운데 여럿이 1981년과 2003년에 돌아왔습니다.',
        '1986년, 그레이트 짐바브웨는 유네스코 세계유산이 되었습니다. 마스빙고 시에서 25킬로미터쯤 떨어져 있습니다.',
      ],
      credit: '사진: Andrew Moore, 위키미디어 공용, CC BY-SA 2.0',
    },
    scenes: [
      {
        id: 'valley', name: '짐바브웨 그레이트 짐바브웨 큰 울타리 앞', short: '울타리 앞', zoom: 1.105, ground: 0.740, scale: 0.646, air: 'market', floor: 'dirt',
        sora: '돌담이 둥글게 휘었어!',
        people: [
          { id: 'porridge', pass: '죽이 보글보글 끓는다.', show: 'porridge', name: '수수죽 끓이는 아주머니', x: 0.18, w: 150, h: 320, lines: ['수수를 빻아 끓인 죽이란다.', '따끈할 때 먹어 보련?'],
            try: { id: 'eat-porridge', verb: 'eat', name: '수수죽', face: 'yum', sora: '수수죽이 따끈하고 구수해!' } },
          { id: 'goldsmith', pass: '불이 세야 금이 녹지.', name: '금 녹이는 장인', x: 0.29, w: 122, h: 311, lines: ['흙 그릇에 금을 녹인단다.', '이 금이 바닷가까지 팔려 가지.'] },
          { id: 'beads', pass: '반짝반짝 푸른 구슬이오!', show: 'bowl', pose: 'see-wow', sora: '이 구슬이 바다를 건너왔대!', memo: '중국의 푸른 그릇과 인도의 유리구슬이 여기서 나왔단다. 바다에서 아주 먼 곳인데도 말이지.', name: '구슬 장수', x: 0.4, w: 120, h: 305, lines: ['바다 건너에서 온 유리구슬이란다.', '금과 바꾸어 여기까지 왔지.'] },
          { id: 'trader', pass: '금을 달아야 해서 못 가는데.', name: '바닷가에서 온 장사꾼', x: 0.51, w: 123, h: 319, lines: ['바닷가에서 한 달을 걸어왔단다.', '금을 받아 바닷가로 돌아가지.'] },
          { id: 'cowherd', pass: '이랴, 이랴! 저리 가자.', name: '소 치는 아이', x: 0.62, w: 132, h: 233, lines: ['우리 마을은 소가 아주 많아.', '소가 많은 집이 부자야.'] },
          { id: 'weaver', pass: '무늬 고운 천 보고 가요.', name: '천 짜는 아주머니', x: 0.73, w: 115, h: 310, lines: ['목화 실로 짠 무늬 천이란다.', '아이 것도 있어. 둘러 보련?'],
            try: { id: 'wear-wrap', verb: 'wear', name: '무늬 천 옷', outfit: 'wrap', sora: '천에 세모 무늬가 줄줄이 있어!', memo: '무늬 넣은 천을 어깨에서 무릎까지 둘러 입는단다. 띠로 묶으면 안 흘러내리지.' } },
          { id: 'elder', pass: '허허, 담이 다 되어 가는구나.', name: '마을 할아버지', x: 0.85, w: 129, h: 316, lines: ['저 담은 우리가 쌓은 것이란다.', '할아버지의 할아버지 때부터 쌓았지.'] },
        ],
        spots: [],
      },
      {
        id: 'passage', name: '짐바브웨 그레이트 짐바브웨 두 담 사이 좁은 길 어귀', short: '좁은 길 어귀', zoom: 1.143, ground: 0.710, scale: 0.669, air: 'chisels', floor: 'dirt',
        sora: '담 사이에 길이 있어!',
        people: [
          { id: 'splitter', pass: '쩍! 돌이 반듯하게 갈라졌다.', name: '돌 쪼개는 이', x: 0.18, w: 135, h: 293, lines: ['바위를 납작하게 쪼갠단다.', '납작해야 반듯하게 쌓이지.'] },
          { id: 'carrier', pass: '영차, 돌 올라간다!', name: '돌 나르는 일꾼', x: 0.29, w: 106, h: 320, lines: ['쪼갠 돌을 담까지 나른단다.', '하루에도 몇 번을 오가지.'] },
          { id: 'waterwoman', pass: '시원한 물 왔어요.', name: '물 긷는 아주머니', x: 0.4, w: 108, h: 318, lines: ['일꾼들이 마실 물이란다.', '돌 쌓는 일은 목이 타거든.'] },
          { id: 'tallkid', pass: '아빠 키보다 훨씬 높아!', name: '담 높이 재는 아이', x: 0.51, w: 75, h: 224, lines: ['담이 어른 키의 여섯 배쯤 돼.', '고개를 젖혀야 꼭대기가 보여.'] },
          { id: 'carver', pass: '부리는 조금 더 뾰족하게.', show: 'bird', pose: 'see-aha', sora: '돌기둥 위에 새가 앉았어!', memo: '돌기둥 위에 앉은 돌 새가 여기서 나왔단다. 무슨 뜻인지는 지금 아무도 모르지.', name: '돌 새 깎는 이', x: 0.62, w: 106, h: 278, lines: ['무른 돌로 새를 깎는단다.', '긴 돌기둥 꼭대기에 앉힐 새지.'] },
          { id: 'mason', pass: '돌을 하나씩 차곡차곡 쌓지.', name: '담 쌓는 석공', x: 0.73, w: 123, h: 286, lines: ['돌 사이에 아무것도 안 바른단다.', '잘 맞춰 쌓으면 안 무너지지.'] },
          { id: 'keeper', pass: '소 떼가 지나간다, 비켜라!', name: '좁은 길 문지기', x: 0.85, w: 114, h: 314, lines: ['이 길은 탑 앞까지 이어진단다.', '한 사람씩 겨우 지나가는 길이지.'] },
        ],
        spots: [],
      },
      {
        id: 'tower', name: '짐바브웨 그레이트 짐바브웨 원뿔 탑 앞', short: '탑 앞', zoom: 1.124, ground: 0.725, scale: 0.658, air: 'hush', floor: 'dirt',
        sora: '탑에 문이 없어! 꽉 막혔네.',
        people: [
          { id: 'drummer', pass: '마지막 돌이 오르면 북을 친단다.', name: '북 치는 사람', x: 0.18, w: 114, h: 295, lines: ['오늘 담을 다 쌓는단다.', '마지막 돌이 오르면 북을 치지.'] },
          { id: 'teller', pass: '탑 그늘이 길어졌구나.', show: 'tower', pose: 'see-aha', sora: '탑 속이 돌로 꽉 찼대!', memo: '속이 돌로 꽉 찬 탑이란다. 무엇에 썼는지는 지금 아무도 모르지.', name: '이야기 할머니', x: 0.29, w: 107, h: 292, lines: ['이 탑은 속까지 돌이란다.', '문도 없고 방도 없지.'] },
          { id: 'gazer', pass: '꼭대기가 안 보여.', name: '탑 올려다보는 아이', x: 0.4, w: 89, h: 206, lines: ['탑이 어른 키의 다섯 배도 넘어.', '돌을 몇 개나 쌓았을까?'] },
          { id: 'potter', pass: '항아리 깨질라, 조심조심.', name: '항아리 빚는 아주머니', x: 0.51, w: 95, h: 286, lines: ['흙으로 빚어 구운 항아리란다.', '무늬도 내가 새겼지.'] },
          { id: 'sister', pass: '오늘이면 담이 다 되겠구나.', show: 'wall', pose: 'see-wow', sora: '꼭대기에 무늬 띠가 있어!', memo: '돌을 납작하게 쪼개 아무것도 바르지 않고 쌓은 담이란다. 이 땅 사람들이 제 손으로 쌓았지.', name: '임금의 누이', x: 0.62, w: 115, h: 320, lines: ['이 담은 우리 손으로 쌓았단다.', '돌만 쌓았는데도 이렇게 높지.'] },
          { id: 'topmason', pass: '마지막 돌은 내가 올린다.', name: '무늬 돌 올리는 석공', x: 0.73, w: 114, h: 295, lines: ['담 꼭대기에 무늬 띠를 두른단다.', '돌을 비스듬히 세워 무늬를 내지.'] },
          { id: 'guest', pass: '허어, 이렇게 높은 담이라니.', name: '먼 마을에서 온 손님', x: 0.85, w: 107, h: 288, lines: ['먼 마을에서 구경하러 왔다오.', '이런 돌담은 처음 보오.'] },
        ],
        spots: [],
      },
    ],
    // "The bowl from over the sea" (core/tale.js; the storyboard of docs/신기한-사실.md): the
    // trader who walked a month from the coast has a blue bowl for the king's sister and
    // must stay to weigh his gold; the keeper of the narrow passage lets no one in till
    // the cattle have gone through; the mason sends her in among the men who carry stone;
    // she hands the bowl to the king's sister, choosing what to say; and as the sun sinks
    // the masons lay the last stone of the band on the top of the wall.
    tale: {
      thing: true,
      ask: '이 높은 담을 누가 어떻게 쌓았을까?',
      gate: { scene: 'passage', open: 3, sora: '문지기가 길을 막고 있어. 못 가.' },
      steps: [
        {
          who: 'trader', goal: '울타리 앞의 바닷가 장사꾼에게 가 보렴.', holds: '푸른 그릇: 장사꾼이 들고 있음',
          lines: ['얘야, 부탁 하나 들어주련?', '바다를 건너온 푸른 그릇이란다.', '탑 앞의 임금님 누이께 전해 주렴.'],
          offer: { ask: '푸른 그릇을 전해 줄까?', label: '내가 전해 줄게요' },
          errand: 'took',
        },
        {
          who: 'keeper', goal: '두 담 사이 좁은 길의 어귀로 가 보렴.', holds: '푸른 그릇: 소라가 들고 있음',
          lines: ['멈춰라. 소 떼가 좁은 길을 지나는 중이다.', '다 지나갈 때까지는 못 들어간다.'],
          sora: '그릇을 전해야 하는데… 어? 누가 불러!',
        },
        {
          who: 'mason', call: '얘, 그 그릇 어디 가니?', goal: '담 쌓는 석공이 부른다. 가 보렴.', holds: '푸른 그릇: 소라가 들고 있음',
          lines: ['임금님 누이께? 그럼 이리 오렴.', '돌 나르는 일꾼들 틈에 끼어 가렴.', '문지기 양반, 내 일손이오!'],
          after: [{ who: 'keeper', line: '일꾼들 줄이라면 가도 좋다.' }],
          sora: '일꾼들 틈에 끼면 된대! 가자!',
        },
        {
          who: 'sister', goal: '탑 앞의 임금님 누이에게 푸른 그릇을 전하렴.', holds: '푸른 그릇: 소라가 들고 있음',
          lines: ['오, 바다를 건너온 그릇이구나.'],
          choice: {
            ask: '푸른 그릇을 건네며 뭐라고 할까?',
            options: [
              { id: 'E1', label: '"장사꾼이 보냈어요"', sora: '바닷가에서 온 장사꾼이 보내셨어요.', says: '먼 길을 온 그릇이구나. 고맙다, 얘야.' },
              { id: 'E2', label: '"담은 누가 쌓았어요?"', sora: '이 높은 담은 누가 쌓았어요?', says: '우리가 쌓았단다. 돌을 하나하나 올렸지.' },
            ],
          },
          errand: 'gave',
        },
        {
          who: 'sister', show: true, goal: '해가 기운다. 마지막 돌을 올리는 것을 보렴.',
          lines: ['저 담 꼭대기를 보렴.', '무늬 띠의 마지막 돌이 올라간단다.'],
          sora: '마지막 돌이 딱 맞았어!',
          errand: 'saw',
        },
      ],
      asides: [
        { who: 'trader', when: ['S1', 'S2', 'S3', 'S4'], lines: ['임금님 누이는 탑 앞에 계신단다.', '두 담 사이 좁은 길로 들어가렴.'] },
        { who: 'trader', when: ['S5'], lines: ['전해 주었구나. 고맙다, 얘야.', '그 그릇도 먼 길을 다 왔구나.'] },
      ],
      done: '푸른 그릇을 전하고, 담의 마지막 돌을 보았다.',
    },
    errands: [
      { id: 'took', text: '푸른 그릇을 받는다.', at: [] },
      { id: 'gave', text: '임금의 누이에게 푸른 그릇을 전한다.', at: [] },
      { id: 'saw', text: '담 꼭대기에 마지막 돌을 올리는 것을 본다.', at: [] },
    ],
    reply: '이 땅 사람들이 제 손으로 쌓은 담이란다. 탑이 무엇인지는 지금도 아무도 모르지.',
  },
  // Stonehenge about 2500 BC, the morning of the longest day (midsummer). Drawn as the rock
  // carvings of Bronze Age Scandinavia and Britain, pecked into grey rock and rubbed with red
  // ochre (the user's choice of five tries: the first). The pictures are in stonehenge2500;
  // the try is the third scene ('ring': huts and a fire, a stone on logs, antler picks, and
  // the ring with the sun coming up between two stones). The storyboard has "the village by
  // the river -> the way the great stone is hauled along -> before the ring of stones".
  // Looked up on 2026.10.13 and found so: the great stones were set up about 4,500 years ago
  // and fifty of the fifty-two came from West Woods, 25 km to the north ("하룻길" here: a
  // day's walk, which is this file's own way of saying 25 km); the small bluestones came
  // from the Preseli hills of Wales, more than 200 km away; the stones stand to the
  // midsummer sunrise and the midwinter sunset; those who set them up lived in a village
  // about 3 km off and nine in ten of the beasts' bones found there are of pigs (the feasts
  // were at midwinter: no feast is made of this day).
  // From memory: no iron, so hammers of stone and picks of red deer antler; no wheels, so
  // sledges and ropes, with logs laid under the sledge; the lintels held by a hole and a
  // knob; no writing, so neither names nor words are left; what it was for is not known;
  // that the bluestones were brought long before the great stones were set up (so the old
  // man tells of it as his forebears' doing); thatched houses with a hearth in the middle;
  // pots with grooved lines; flint knives; needles of bone; dugout boats and the fish of the
  // river; ropes twisted of the inner bark of trees; wild berries in June; stones raised
  // with levers and ropes into a pit; stones dressed by pounding with round hammerstones;
  // chalk under the grass, carried off in baskets; that a great stone weighs as much as
  // some elephants ("코끼리 몇 마리만큼": the sarsens are of about 25 tons).
  // Made up: the errand of the new rope and that the last stone is raised with it, the
  // keeper of the way who lets no one cross until the stone has gone by, the child who lays
  // the logs and says to follow the sledge, the chief of those who raise the stones, every
  // other person, and the dress (nothing of it is left).
  // Kept out: what the stones were for; druids; graves and bones; the midwinter feast.
  stonehenge: {
    first: '한 해에 낮이 가장 긴 날이란다. 밧줄을 전해 주렴.',
    // Who lived here, for a player who has not heard of them. The first sentence was looked
    // up; the second is from memory.
    intro: { title: '돌을 세운 사람들', text: '사천오백 해쯤 전 영국의 들판에 큰 돌을 세운 사람들이란다. 글자가 없어서 이름도 말도 남지 않았지.' },
    dir: 'stonehenge2500', look: 'paper', pale: true,
    drawn: '아주 옛날 바위에 새긴 그림처럼, 쪼아 내고 붉은 흙을 문질러 그렸단다.',
    // (What is said of today: from memory, 2026.10.13; not yet looked up.)
    now: {
      photo: 'photo-now.webp', name: '스톤헨지의 지금 모습', when: '영국 솔즈베리 평원 · 오늘날',
      text: [
        '쓰러진 돌도 많지만 큰 돌들은 지금도 서 있습니다. 1901년부터 1963년 사이에 기울거나 쓰러진 돌 몇 개를 다시 세웠습니다.',
        '2024년 연구로, 가운데 누운 제단돌은 스코틀랜드 북동쪽에서 690킬로미터쯤 옮겨 온 것으로 밝혀졌습니다.',
        '1986년에 가까운 에이브버리의 돌 유적과 함께 유네스코 세계유산이 되었습니다. 지금은 잉글리시 헤리티지라는 단체가 돌봅니다.',
        '돌과 땅이 닳아서 1977년부터 돌 둘레에 줄을 쳤습니다. 여느 날에는 줄 밖의 길에서만 볼 수 있고, 돌을 만지거나 올라갈 수 없습니다.',
        '2013년 12월에 조금 떨어진 곳에 방문자 센터를 열었고, 돌 곁을 지나던 찻길은 막아 풀밭으로 덮었습니다. 2023년에는 130만 명 넘게 다녀갔습니다.',
        '하짓날 해 뜨는 아침에는 돌 사이로 들어갈 수 있습니다. 2025년 6월 21일에는 해돋이를 보러 2만 5천 명쯤이 모였습니다.',
      ],
      credit: '사진: Diego Delso, 위키미디어 공용, CC BY-SA 4.0',
    },
    scenes: [
      {
        id: 'village', name: '영국 스톤헨지 곁 강가의 마을', short: '강가의 마을', zoom: 1.127, ground: 0.723, scale: 0.659, air: 'market', floor: 'dirt',
        sora: '집이 다 풀 지붕이야!',
        people: [
          { id: 'fisher', pass: '오늘은 두 마리나 잡았지.', name: '물고기 잡는 아저씨', x: 0.18, w: 145, h: 320, lines: ['강에 그물을 던져 잡았단다.', '배는 통나무 속을 파서 만들지.'] },
          { id: 'cook', pass: '노릇노릇 다 익었다!', show: 'roast', name: '고기 굽는 아주머니', x: 0.29, w: 125, h: 308, lines: ['우리 마을은 돼지를 많이 기른단다.', '불에 구운 고기와 산딸기야. 먹어 보련?'],
            try: { id: 'eat-roast', verb: 'eat', name: '구운 돼지고기와 산딸기', face: 'yum', sora: '고기는 고소하고 딸기는 새콤해!' } },
          { id: 'potter', pass: '줄무늬를 한 줄 더 넣자.', name: '그릇 빚는 아주머니', x: 0.4, w: 105, h: 310, lines: ['흙을 빚어 불에 구운 그릇이란다.', '손톱으로 줄무늬를 넣었지.'] },
          { id: 'roper', pass: '밧줄을 쉬지 않고 꼬는 중이란다.', name: '밧줄 꼬는 할머니', x: 0.51, w: 119, h: 302, lines: ['나무 속껍질을 꼬아 밧줄을 만든단다.', '굵게 꼬아야 큰 돌도 끌지.'] },
          { id: 'sewer', pass: '옷을 한 땀 한 땀 짓는단다.', name: '옷 짓는 아주머니', x: 0.62, w: 130, h: 305, lines: ['뼈로 만든 바늘로 옷을 짓는단다.', '아이 것도 있어. 입어 보련?'],
            try: { id: 'wear-henge', verb: 'wear', name: '돌 세운 사람들의 옷', outfit: 'henge', sora: '털가죽이 폭신폭신해!', memo: '그때 옷은 하나도 남지 않았단다. 거친 천과 털가죽을 입었으리라 짐작할 뿐이지.' } },
          { id: 'knapper', pass: '돌칼은 살살 쳐서 만들어야지.', name: '돌칼 만드는 아저씨', x: 0.73, w: 112, h: 318, lines: ['쇠가 없어서 돌로 칼을 만든단다.', '돌을 톡 치면 얇게 떨어지지.'] },
          { id: 'thatcher', pass: '비 오기 전에 이어야지.', name: '지붕 잇는 아저씨', x: 0.85, w: 176, h: 320, lines: ['돌 세우는 사람들은 다 여기 산단다.', '돌 고리는 저 언덕 너머에 있지.'] },
        ],
        spots: [],
      },
      {
        id: 'road', name: '영국 스톤헨지로 큰 돌을 끄는 길', short: '돌 끄는 길', zoom: 1.133, ground: 0.718, scale: 0.663, air: 'hush', floor: 'dirt',
        sora: '돌이 집보다 커!',
        people: [
          { id: 'puller', pass: '다 같이 밧줄을 당기자, 영차!', name: '밧줄 끄는 일꾼', x: 0.18, w: 164, h: 289, lines: ['바퀴가 없어서 썰매에 싣고 끈단다.', '여럿이 밧줄로 당기지.'] },
          { id: 'caller', pass: '하나, 둘, 당겨라!', name: '소리 매기는 아주머니', x: 0.29, w: 136, h: 309, lines: ['내가 소리치면 다 같이 당긴단다.', '이 돌은 북쪽으로 하룻길인 숲에서 왔지.'] },
          { id: 'logkid', pass: '통나무를 하나 더 깔자!', name: '통나무 놓는 아이', x: 0.4, w: 125, h: 207, lines: ['썰매 밑에 통나무를 깔아.', '그러면 돌이 미끄러지듯 가.'] },
          { id: 'teller', pass: '옛날 옛적에 말이다.', show: 'far', pose: 'see-wow', sora: '이 돌을 그 먼 데서 끌고 왔대!', memo: '작은 푸른 돌은 이백 킬로미터도 넘게 떨어진 웨일스의 산에서 왔단다. 바퀴도 없이 말이지.', name: '옛이야기 하는 할아버지', x: 0.51, w: 180, h: 280, lines: ['작은 푸른 돌은 더 먼 데서 왔단다.', '옛 어른들이 산을 넘고 물을 건너 끌고 왔지.'] },
          { id: 'waterer', pass: '물 마시고 하세요!', name: '물 나르는 아가씨', x: 0.62, w: 91, h: 267, lines: ['돌 끄는 사람들은 목이 마르단다.', '그래서 강에서 물을 길어 오지.'] },
          { id: 'lever', pass: '뒤에서 받쳐야지.', name: '지렛대 든 아저씨', x: 0.73, w: 161, h: 320, lines: ['긴 장대로 돌을 조금씩 들썩인단다.', '돌 하나가 코끼리 몇 마리만큼 무겁지.'] },
          { id: 'roadguard', pass: '돌이 지나간다, 비켜라.', name: '길 지키는 이', x: 0.85, w: 126, h: 293, lines: ['돌이 지나갈 때는 길이 위험하단다.', '그래서 내가 여기서 지키지.'] },
        ],
        spots: [],
      },
      {
        id: 'ring', name: '영국 스톤헨지 돌 고리 앞', short: '돌 고리 앞', zoom: 1.098, ground: 0.745, scale: 0.643, air: 'hush', floor: 'dirt',
        sora: '돌이 둥글게 서 있어!',
        people: [
          { id: 'digger', pass: '조금만 더 파면 되겠군.', show: 'antler', pose: 'see-aha', sora: '사슴뿔이 곡괭이래!', memo: '쇠가 없던 때라 사슴뿔로 땅을 팠단다. 뿔의 가지 하나를 뾰족한 날로 썼지.', name: '구덩이 파는 아저씨', x: 0.18, w: 149, h: 319, lines: ['돌을 세울 구덩이를 판단다.', '이 곡괭이는 사슴뿔로 만들었지.'] },
          { id: 'carrier', pass: '흰 흙이 또 한 바구니.', name: '흙 나르는 아주머니', x: 0.29, w: 123, h: 311, lines: ['풀밭 아래는 온통 흰 흙이란다.', '파낸 흙은 바구니로 나르지.'] },
          { id: 'joiner', pass: '턱이 홈에 꼭 맞아야지.', show: 'joint', pose: 'see-wow', sora: '돌을 끼워 맞췄어!', memo: '기둥 위에는 턱을, 가로 돌에는 홈을 파서 끼웠단다. 나무를 짜 맞추듯이 말이지.', name: '홈 파는 장인', x: 0.4, w: 130, h: 316, lines: ['가로 돌은 그냥 얹은 게 아니란다.', '홈과 턱을 파서 끼워 맞췄지.'] },
          { id: 'chief', pass: '밧줄이 와야 할 텐데.', show: 'sunrise', pose: 'see-wow', sora: '해가 돌 사이로 떠!', memo: '돌은 한여름 해가 뜨는 쪽에 맞춰 서 있단다. 왜 세웠는지는 지금도 아무도 모르지.', name: '돌 세우는 우두머리', x: 0.51, w: 192, h: 320, lines: ['나는 돌 세울 자리를 정한단다.', '해 뜨는 쪽을 보고 자리를 잡지.'] },
          { id: 'firekeeper', pass: '불씨를 꺼뜨리면 안 되지.', name: '불 지키는 할머니', x: 0.62, w: 137, h: 284, lines: ['밤새 불을 지켰단다.', '새벽 들판은 여름에도 춥거든.'] },
          { id: 'sunkid', pass: '해야, 얼른 떠라!', name: '해 기다리는 아이', x: 0.73, w: 114, h: 220, lines: ['오늘은 낮이 가장 긴 날이야.', '해 뜨는 걸 보려고 일찍 일어났어.'] },
          { id: 'dresser', pass: '돌을 쿵쿵 쳤더니 팔이 얼얼하군.', name: '돌 다듬는 아저씨', x: 0.85, w: 138, h: 319, lines: ['둥근 돌망치로 돌을 두드린단다.', '두드리고 또 두드려 반듯하게 하지.'] },
        ],
        spots: [],
      },
    ],
    // "The new rope" (core/tale.js; the storyboard of docs/신기한-사실.md): the old woman who
    // twists ropes in the village has a new thick rope for the chief of those who raise the
    // stones; the keeper of the way lets no one cross until the great stone has gone by; the
    // child who lays the logs says to follow behind the sledge; she hands it to the chief,
    // choosing what to say; and the sun comes up between the stones and its light goes into
    // the middle of the ring.
    tale: {
      thing: true,
      ask: '해는 어느 돌 사이로 뜰까?',
      gate: { scene: 'road', open: 3, sora: '길 지키는 이가 막고 있어. 못 가.' },
      steps: [
        {
          who: 'roper', goal: '강가 마을의 밧줄 꼬는 할머니에게 가 보렴.', holds: '밧줄: 할머니가 들고 있음',
          lines: ['얘야, 부탁 하나 들어주련?', '밤새 꼰 새 밧줄이란다. 내 다리로는 언덕을 못 넘지.', '돌 고리의 우두머리께 전해 주렴.'],
          offer: { ask: '밧줄을 전해 줄까?', label: '내가 전해 줄게요' },
          errand: 'took',
        },
        {
          who: 'roadguard', goal: '돌 끄는 길의 끝으로 가 보렴.', holds: '밧줄: 소라가 들고 있음',
          lines: ['멈춰라. 지금은 길을 못 건넌다.', '큰 돌이 다 지나갈 때까지 기다려라.'],
          sora: '해 뜨기 전에 전해야 하는데… 어? 누가 불러!',
        },
        {
          who: 'logkid', call: '야, 어디 가는데?', goal: '통나무 놓는 아이가 부른다. 가 보렴.', holds: '밧줄: 소라가 들고 있음',
          lines: ['돌 고리에 간다고? 그럼 나를 따라와.', '썰매 뒤를 따라가면 안 다쳐.', '아주머니, 얘는 썰매 뒤로 데려갈게요!'],
          after: [{ who: 'roadguard', line: '밧줄 심부름이라면 썰매 뒤로 가거라.' }],
          sora: '썰매 뒤를 따라가면 된대! 가자!',
        },
        {
          who: 'chief', goal: '돌 고리 앞의 우두머리에게 밧줄을 전하렴.', holds: '밧줄: 소라가 들고 있음',
          lines: ['오, 기다리던 밧줄이로구나.'],
          choice: {
            ask: '밧줄을 건네며 뭐라고 할까?',
            options: [
              { id: 'E1', label: '"할머니가 밤새 꼬셨어요"', sora: '마을 할머니가 밤새 꼬셨어요.', says: '튼튼하게도 꼬셨구나. 고맙다, 얘야.' },
              { id: 'E2', label: '"이 밧줄로 뭘 해요?"', sora: '이 밧줄로 뭘 해요?', says: '저 큰 돌을 당겨서 세운단다.' },
            ],
          },
          errand: 'gave',
        },
        {
          who: 'chief', show: true, goal: '해가 돌 사이로 뜨는 것을 보렴.',
          lines: ['때맞춰 왔구나. 저 돌 사이를 보렴.', '한여름 아침엔 해가 저리로 뜬단다.'],
          sora: '빛이 한가운데로 쏙 들어와!',
          errand: 'saw',
        },
      ],
      asides: [
        { who: 'roper', when: ['S1', 'S2', 'S3', 'S4'], lines: ['우두머리는 돌 고리 앞에 있단다.', '돌 끄는 길을 따라 언덕을 넘어가렴.'] },
        { who: 'roper', when: ['S5'], lines: ['전해 주었구나. 고맙다, 얘야.', '이제 그 돌도 곧 서겠구나.'] },
      ],
      done: '밧줄을 전하고, 해가 돌 사이로 뜨는 것을 보았다.',
    },
    errands: [
      { id: 'took', text: '새 밧줄을 받는다.', at: [] },
      { id: 'gave', text: '우두머리에게 밧줄을 전한다.', at: [] },
      { id: 'saw', text: '해가 돌 사이로 뜨는 것을 본다.', at: [] },
    ],
    reply: '글자도 쇠도 없이 세운 돌이란다. 팔이 아프진 않더냐.',
  },
  // Padua on the evening and night of 7 January 1610: the night Galileo saw three small
  // stars in a row by Jupiter. Drawn as the oil painting of the Venetian school at the end
  // of the 16th century (the user's choice of five tries: the fifth). The pictures are in
  // padua1610; the try itself is the third scene (the yard behind the house, with the
  // telescope), and the market and the lane were ordered after it. It is night in all three:
  // no `pale`.
  // Looked up on 2026.10.13 and found so: on the night of 7 January 1610, at Padua, Galileo
  // saw three small stars in a row by Jupiter, and the next night they stood otherwise; the
  // telescope was a new one that made things about twenty times larger (one study says
  // thirty); some days later he knew them for moons going round Jupiter and found a fourth;
  // the book came out on 13 March 1610.
  // From memory: that he ground his lenses himself, in a hollow dish with fine sand; that
  // the glass came from the glassmakers of Venice; that the telescope has a large lens at
  // the far end and a small one at the eye; that he taught mathematics at the university of
  // Padua and had students lodging in his house and workmen making instruments there; that
  // he had drawn the moon with its mountains and hollows before this night; that the
  // telescope began with the makers of spectacles; the clock tower of Padua whose face
  // shows the moon; roast chestnuts and bread in winter; printed books; the dress; that
  // Jupiter is bright enough to be the first star seen at dusk.
  // Made up: the errand of the glass, the glassmaker at the market, the lodging student who
  // lets no one in, the tube-maker who shows the way through the workshop, every other
  // person, and that anyone but Galileo looked through the telescope that night.
  // Kept out: the trial of later years. Nobody on the screen says "moon" of the three stars
  // (that night nobody knew): only grandmother's slips say what they were found to be.
  galileo: {
    first: '갈릴레오가 목성 곁의 별을 처음 본 밤이란다. 유리알을 전해 주렴.',
    dir: 'padua1610', look: 'paper',
    drawn: '베네치아 화가들의 유화처럼, 깊은 푸른 밤으로 그렸단다.',
    // (What is said of today: from memory, 2026.10.13; not yet looked up.)
    now: {
      photo: 'photo-now.webp', name: '갈릴레오의 망원경', when: '이탈리아 피렌체 · 갈릴레오 박물관',
      text: [
        '갈릴레오가 손수 만든 망원경 가운데 지금 남은 것은 두 개뿐입니다. 하나는 나무와 종이로, 하나는 나무와 가죽으로 겉을 쌌습니다.',
        '두 망원경은 파도바가 아니라 이탈리아 피렌체의 갈릴레오 박물관에 있습니다.',
        '같은 박물관에는 목성의 달을 찾을 때 쓴 망원경의 앞 렌즈도 있습니다. 지름이 38밀리미터이고, 뒷날 실수로 금이 갔습니다.',
        '갈릴레오는 이 렌즈를 토스카나의 대공 코시모 2세에게 바쳤습니다. 1677년, 메디치 집안은 렌즈를 흑단과 상아로 된 틀에 넣었습니다.',
        '갈릴레오는 1610년 3월에 펴낸 책 "별의 전령"에 이 발견을 알렸습니다. 그는 달 넷을 대공 집안의 이름을 따 "메디치의 별"이라고 불렀습니다.',
        '지금은 이 달들을 이오, 유로파, 가니메데, 칼리스토라고 부릅니다. 천문학자 시몬 마리우스가 1614년에 책에 실은 이름입니다.',
      ],
      credit: '사진: Zde, 위키미디어 공용, CC BY-SA 4.0',
    },
    scenes: [
      {
        id: 'market', name: '이탈리아 파도바 저녁 장터', short: '저녁 장터', zoom: 1.127, ground: 0.723, scale: 0.659, air: 'market', floor: 'dirt',
        sora: '좌판마다 불을 켰어!',
        people: [
          { id: 'chestnut', pass: '군밤이오, 따끈한 군밤!', show: 'chestnut', name: '군밤 장수', x: 0.18, w: 118, h: 295, lines: ['갓 구운 밤과 빵이란다.', '추운 저녁엔 이게 최고지. 먹어 보련?'],
            try: { id: 'eat-chestnut', verb: 'eat', name: '구운 밤과 빵', face: 'yum', sora: '군밤이 따끈따끈해! 달고 고소해.' } },
          { id: 'clockman', pass: '벌써 저녁 종 칠 때구먼.', name: '시계탑 보는 할아버지', x: 0.29, w: 112, h: 314, lines: ['저기 큰 시계가 보이느냐.', '달이 얼마나 찼는지도 알려 준단다.'] },
          { id: 'spectacles', pass: '글씨가 또렷이 보입니다!', name: '안경 장수', x: 0.4, w: 98, h: 309, lines: ['유리를 갈아서 안경알을 만든단다.', '망원경도 이런 유리알로 만들지.'] },
          { id: 'glassmaker', pass: '누가 좀 전해 주면 좋으련만.', name: '유리 장인', x: 0.51, w: 110, h: 299, lines: ['나는 맑은 유리를 만든단다.', '티 하나 없어야 멀리까지 보이지.'] },
          { id: 'scholar', pass: '내일도 수업이 있지.', name: '대학생', x: 0.62, w: 107, h: 320, lines: ['파도바에는 큰 대학이 있단다.', '갈릴레오 선생님은 수학을 가르치시지.'] },
          { id: 'draper', pass: '따뜻한 모직 옷 보고 가렴.', name: '옷감 장수', x: 0.73, w: 118, h: 294, lines: ['겨울엔 두꺼운 모직 옷을 입는단다.', '아이 것도 있어. 입어 보련?'],
            try: { id: 'wear-padua', verb: 'wear', name: '파도바의 옷', outfit: 'padua', sora: '망토가 폭신해! 안 추워.', memo: '긴 치마에 앞치마를 두르고 흰 깃을 달았단다. 겨울에는 짧은 망토를 걸쳤지.' } },
          { id: 'bookseller', pass: '새로 찍은 책이 왔소.', name: '책 파는 아저씨', x: 0.85, w: 117, h: 293, lines: ['이 책은 손으로 쓴 게 아니란다.', '틀로 찍어서 여러 권을 만들지.'] },
        ],
        spots: [],
      },
      {
        id: 'lane', name: '이탈리아 파도바 갈릴레오의 집 앞 골목', short: '집 앞 골목', zoom: 1.140, ground: 0.713, scale: 0.667, air: 'street', floor: 'dirt',
        sora: '골목에 작업장이 있어!',
        people: [
          { id: 'grinder', pass: '쓱쓱, 유리알을 조금만 더 갈자.', show: 'lens', pose: 'see-aha', sora: '뿌옇던 유리가 맑아졌어!', memo: '유리를 오목한 접시에 대고 고운 모래로 갈았단다. 갈릴레오는 유리알을 손수 갈았지.', name: '유리알 가는 일꾼', x: 0.18, w: 118, h: 301, lines: ['유리를 고운 모래로 문질러 간단다.', '며칠을 갈아야 한 알이 되지.'] },
          { id: 'cook', pass: '저녁 빵을 더 구워야겠네.', name: '밥 짓는 아주머니', x: 0.29, w: 142, h: 281, lines: ['선생님 댁에는 학생들이 함께 산단다.', '그래서 날마다 빵을 잔뜩 굽지.'] },
          { id: 'tubemaker', pass: '통을 땅땅 두드려 곧게 펴야지.', name: '통 만드는 일꾼', x: 0.4, w: 146, h: 320, lines: ['망원경의 긴 통을 만든단다.', '양 끝에 유리알을 하나씩 끼우지.'] },
          { id: 'neighbour', pass: '오늘 밤도 하늘이 맑구먼.', name: '이웃 할아버지', x: 0.51, w: 128, h: 280, lines: ['선생님은 밤마다 뒤뜰에 나오신단다.', '추운 줄도 모르고 하늘만 보시지.'] },
          { id: 'polisher', pass: '입김을 불어 망원경을 닦자.', show: 'telescope', pose: 'see-wow', sora: '망원경 통이 내 키보다 길어!', memo: '갈릴레오의 새 망원경은 스무 배쯤 크게 보였단다. 긴 통의 양 끝에 유리알을 끼웠지.', name: '망원경 닦는 제자', x: 0.62, w: 122, h: 289, lines: ['선생님이 새로 만드신 망원경이란다.', '먼 것이 스무 배쯤 크게 보이지.'] },
          { id: 'courier', pass: '편지요, 편지!', name: '편지 심부름꾼', x: 0.73, w: 105, h: 259, lines: ['베네치아에서 온 편지야.', '선생님께는 편지가 날마다 와.'] },
          { id: 'boarder', pass: '오늘 밤은 조용히 해야 해.', name: '하숙 학생', x: 0.85, w: 121, h: 310, lines: ['나는 선생님 댁에 사는 학생이란다.', '밤에는 내가 문을 지키지.'] },
        ],
        spots: [],
      },
      {
        id: 'garden', name: '이탈리아 파도바 갈릴레오의 집 뒤뜰', short: '집 뒤뜰', zoom: 1.136, ground: 0.716, scale: 0.665, air: 'hush', floor: 'dirt',
        sora: '망원경이 하늘을 보고 있어!',
        people: [
          { id: 'lampgirl', pass: '불이 꺼지면 안 돼.', name: '등잔 든 아이', x: 0.18, w: 102, h: 249, lines: ['종이에 적을 때 불을 비춰 드려.', '별을 볼 때는 멀리 서 있어야 해.'] },
          { id: 'moonpupil', pass: '달에도 산이 있다니.', show: 'moon', pose: 'see-aha', sora: '달이 울퉁불퉁해!', memo: '갈릴레오는 망원경으로 달을 보고 그림을 그렸단다. 달에도 산과 골짜기가 있다고 했지.', name: '달 그림 든 학생', x: 0.29, w: 107, h: 304, lines: ['선생님이 달을 보고 그리신 그림이란다.', '달은 매끈한 구슬이 아니었지.'] },
          { id: 'scribe', pass: '날짜부터 적어 두자.', name: '받아 적는 제자', x: 0.4, w: 104, h: 304, lines: ['선생님이 보신 것을 받아 적는단다.', '내일 밤 것과 견주어 보려고.'] },
          { id: 'coldpupil', pass: '호오, 손이 꽁꽁 얼었어.', name: '손이 언 학생', x: 0.51, w: 89, h: 283, lines: ['정월 밤이라 손이 꽁꽁 얼었어.', '그래도 별은 겨울에 더 맑게 보여.'] },
          { id: 'galileo', pass: '유리알이 올 때가 됐는데.', show: 'stars', pose: 'see-wow', sora: '작은 별 셋이 한 줄이야!', memo: '갈릴레오는 이날 밤 목성 곁의 작은 별 셋을 처음 봤단다. 며칠 뒤에야 그게 목성을 도는 달인 줄 알았지.', name: '갈릴레오', x: 0.62, w: 128, h: 320, lines: ['나는 망원경으로 하늘을 본단다.', '눈으로는 안 보이던 것이 보이지.'] },
          { id: 'vinedresser', pass: '봄이 오면 싹이 트겠지.', name: '포도 덩굴 손보는 아저씨', x: 0.73, w: 101, h: 295, lines: ['겨울이라 포도 잎이 다 졌단다.', '덕분에 뜰에서 하늘이 잘 보이지.'] },
          { id: 'blanket', pass: '밤바람이 차기도 하지.', name: '담요 든 아주머니', x: 0.85, w: 111, h: 279, lines: ['선생님께 담요를 가져왔단다.', '밤새 서 계시면 감기 드시지.'] },
        ],
        spots: [],
      },
    ],
    // "The glass for the telescope" (core/tale.js; the storyboard of docs/신기한-사실.md): the
    // glassmaker at the evening market has a new glass for Galileo and cannot leave his
    // stall; the student who lodges in the house keeps the door, for the teacher is making
    // ready to watch the stars; the tube-maker shows her the way through the workshop to the
    // yard behind; she hands it to Galileo, choosing what to say; and she looks through the
    // telescope and sees three small stars in a row by Jupiter. He calls them stars.
    tale: {
      thing: true,
      ask: '목성 곁에는 무엇이 있을까?',
      gate: { scene: 'lane', open: 3, sora: '학생이 문을 막고 있어. 못 가.' },
      steps: [
        {
          who: 'glassmaker', goal: '저녁 장터의 유리 장인에게 가 보렴.', holds: '유리알: 유리 장인이 들고 있음',
          lines: ['얘야, 부탁 하나 들어주련?', '갈릴레오 선생님이 기다리시는 유리알이란다. 나는 가게를 못 비우지.', '선생님 댁 뒤뜰로 전해 주렴.'],
          offer: { ask: '유리알을 전해 줄까?', label: '내가 전해 줄게요' },
          errand: 'took',
        },
        {
          who: 'boarder', goal: '골목 끝의 선생님 댁 문으로 가 보렴.', holds: '유리알: 소라가 들고 있음',
          lines: ['잠깐. 지금은 못 들어간단다.', '선생님이 별 볼 채비를 하셔. 아무도 못 들어가.'],
          sora: '선생님이 기다리신댔는데… 어? 누가 불러!',
        },
        {
          who: 'tubemaker', call: '얘, 뭘 들고 가니?', goal: '통 만드는 일꾼이 부른다. 가 보렴.', holds: '유리알: 소라가 들고 있음',
          lines: ['선생님께 가는 유리알이라고? 그럼 이리 오렴.', '작업장을 지나면 바로 뒤뜰이란다.', '이보게, 이 아이는 작업장으로 들여보내네!'],
          after: [{ who: 'boarder', line: '유리알 심부름이면 그리로 가렴.' }],
          sora: '작업장을 지나가면 된대! 가자!',
        },
        {
          who: 'galileo', goal: '뒤뜰의 갈릴레오에게 유리알을 전하렴.', holds: '유리알: 소라가 들고 있음',
          lines: ['오, 기다리던 유리알이로구나.'],
          choice: {
            ask: '유리알을 건네며 뭐라고 할까?',
            options: [
              { id: 'E1', label: '"유리 장인이 보냈어요"', sora: '장터의 유리 장인 아저씨가 보내셨어요.', says: '티 하나 없이 맑구나. 고맙다, 얘야.' },
              { id: 'E2', label: '"이걸로 뭘 봐요?"', sora: '이 유리알로 뭘 보세요?', says: '멀리 있는 것을 가까이 당겨 본단다.' },
            ],
          },
          errand: 'gave',
        },
        {
          who: 'galileo', show: true, goal: '망원경으로 목성 곁을 보렴.',
          lines: ['마침 잘 왔다. 저 밝은 별이 목성이란다.', '그 곁에 작은 별 셋이 한 줄로 섰구나. 너도 보렴.'],
          sora: '정말 한 줄이야! 왜 저렇게 서 있지?',
          errand: 'saw',
        },
      ],
      asides: [
        { who: 'glassmaker', when: ['S1', 'S2', 'S3', 'S4'], lines: ['선생님 댁은 골목 끝에 있단다.', '뒤뜰에 긴 망원경이 서 있지.'] },
        { who: 'glassmaker', when: ['S5'], lines: ['전해 주었구나. 고맙다, 얘야.', '그 유리알로 무엇을 보실까.'] },
      ],
      done: '유리알을 전하고, 목성 곁의 작은 별 셋을 보았다.',
    },
    errands: [
      { id: 'took', text: '유리알을 받는다.', at: [] },
      { id: 'gave', text: '갈릴레오에게 유리알을 전한다.', at: [] },
      { id: 'saw', text: '목성 곁의 별 셋을 본다.', at: [] },
    ],
    reply: '그 별 셋은 목성을 도는 달이었단다. 손은 시리지 않더냐.',
  },
  // Paris, 21 November 1783, about two in the afternoon: the first day people flew in a
  // balloon that no rope held. Drawn as a French rococo oil painting after Fragonard (the
  // user's choice of five tries: the second). The pictures are in balloon1783; the try is
  // the third scene (the garden of the chateau de la Muette with the balloon over its fire),
  // and the yard of the workshop and the road to the chateau were ordered anew. The gate of
  // the chateau stands at the right end of the second scene, where the one who bars the way
  // has to stand. The game has another Paris (1889, 'eiffel', in the folder paris): no id of
  // a person, of a thing to see, to eat or to wear here is one of that place's.
  // Looked up on 2026.10.13 and found so: on 21 November 1783, about two in the afternoon,
  // Pilatre de Rozier and the marquis d'Arlandes rose from the garden of la Muette in the
  // balloon of the Montgolfier brothers, the first flight of people without a rope; about
  // 25 minutes and about 9 km (26 minutes and 12 km are also given: "스물다섯 분쯤", and
  // no distance on screen); straw fed to the fire under the balloon filled it with hot air;
  // sparks caught the cloth and were pressed out with wet sponges; Benjamin Franklin, from
  // America, looked on.
  // From memory: the sheep, the duck and the cock that went up first two months before and
  // came down unhurt; the balloon blue with gold suns; that the Montgolfiers were paper
  // makers; that the balloon was made in the yard of a wallpaper workshop; the round wicker
  // gallery where the two stood on opposite sides; that it had gone up on ropes in the weeks
  // before; that what was seen was written down that day; prints of balloons sold in the
  // street; roasted chestnuts and thin rolled wafers; the dress of 1783; that the one of the
  // brothers who was there was Etienne (he is only "몽골피에 씨" here); that Franklin stood
  // in the garden itself (the source says only that he looked on).
  // Made up: the errand of the basket of wet sponges, the seamstress, the keeper of the
  // gate who wants a ticket, the straw carrier who takes her in behind his cart, what
  // Pilatre de Rozier answers, every other person.
  // Kept out: that Pilatre de Rozier died in a balloon two years later; the king (no line
  // says he was there). Nothing says the balloon was of paper.
  montgolfier: {
    first: '오늘은 사람이 처음 열기구를 타고 나는 날이란다. 해면 바구니를 전해 주렴.',
    dir: 'balloon1783', look: 'paper', pale: true,
    drawn: '그때 프랑스의 유화처럼, 부드러운 붓으로 그렸단다.',
    // (What is said of today: from memory, 2026.10.13; not yet looked up.)
    now: {
      photo: 'photo-now.webp', name: '라 뮈에트 성 자리의 지금 모습', when: '프랑스 파리 · 라늘라그 공원',
      text: [
        '라 뮈에트 성은 1790년에 나뉘어 팔렸고, 남은 건물도 1926년까지 모두 헐려 없어졌습니다.',
        '성의 뜰이 있던 땅에는 1860년에 라늘라그 공원이 생겼습니다. 영국식으로 꾸민 공원으로, 밤에도 문을 닫지 않습니다.',
        '공원 안의 "필라트르 드 로지에 길"은 그날 열기구에 탄 사람의 이름을 땄습니다. 이곳에서 첫 열기구가 떴다는 것을 알려 줍니다.',
        '성 자리 가까이에는 1921년부터 1922년까지 새로 지은 성이 있습니다. 지금은 국제기구 OECD(경제협력개발기구)의 본부입니다.',
        '기구가 내려앉은 뷔트오카유 언덕에는 그때 풍차가 서 있었습니다. 지금은 파리 13구의 한 동네입니다.',
        '지금의 열기구는 짚불 대신 프로판 가스 불로 뜹니다. 미국의 에드 요스트가 1960년에 이 방식으로 처음 날았습니다.',
      ],
      credit: '사진: Polymagou, 위키미디어 공용, CC BY-SA 4.0',
    },
    scenes: [
      {
        id: 'yard', name: '프랑스 파리 열기구 공방 마당', short: '공방 마당', zoom: 1.153, ground: 0.703, scale: 0.675, air: 'court', floor: 'dirt',
        sora: '여기서 그 큰 열기구를 지었대!',
        people: [
          { id: 'gilder', pass: '금빛은 살살 칠해야지.', name: '금빛 무늬 그리는 화공', x: 0.18, w: 104, h: 318, lines: ['푸른 천에 금빛 해를 그렸단다.', '멀리서도 잘 보이라고 그랬지.'] },
          { id: 'seamstress', pass: '열기구를 한 땀 한 땀 꿰맸지.', name: '열기구 꿰맨 재봉사', x: 0.29, w: 129, h: 303, lines: ['큰 천을 이어 열기구를 꿰맸단다.', '집보다 큰 주머니가 되었지.'] },
          { id: 'printer', pass: '쿵, 무늬가 잘 찍혔군.', name: '벽지 찍는 일꾼', x: 0.4, w: 115, h: 320, lines: ['여기는 벽지를 찍는 공방이란다.', '큰 열기구도 이 마당에서 지었지.'] },
          { id: 'shepherd', pass: '우리 양은 하늘을 날았지!', show: 'animals', pose: 'see-wow', sora: '양이 하늘을 날았대!', memo: '사람보다 먼저 양과 오리와 수탉이 탔단다. 셋 다 무사히 내려왔지.', name: '양 돌보는 아이', x: 0.51, w: 104, h: 266, lines: ['두 달 전엔 양이 먼저 탔어.', '오리랑 수탉도 같이 탔대.'] },
          { id: 'wicker', pass: '버들가지로 난간을 엮는 중이란다.', name: '버들 난간 엮는 할아버지', x: 0.62, w: 120, h: 304, lines: ['버들가지로 둥근 난간을 엮었단다.', '두 사람이 양쪽에 마주 서서 타지.'] },
          { id: 'ropemaker', pass: '오늘은 줄이 쉬는 날이군.', name: '밧줄 사리는 일꾼', x: 0.73, w: 93, h: 317, lines: ['지난번엔 줄에 매어 띄웠단다.', '오늘은 줄을 풀고 날아가지.'] },
          { id: 'dressmaker', pass: '고운 옷 보고 가렴.', name: '옷 짓는 아주머니', x: 0.85, w: 125, h: 307, lines: ['남은 틈에 아이 옷도 지었단다.', '나들이옷이야. 입어 보련?'],
            try: { id: 'wear-rococo', verb: 'wear', name: '1783년 파리의 옷', outfit: 'rococo', sora: '치마가 사락사락해!', memo: '긴 치마 옷에 흰 수건을 어깨에 둘렀단다. 소매 끝에는 레이스를 달았지.' } },
        ],
        spots: [],
      },
      {
        id: 'road', name: '프랑스 파리 라 뮈에트 성으로 가는 길', short: '성으로 가는 길', zoom: 1.136, ground: 0.716, scale: 0.665, air: 'street', floor: 'dirt',
        sora: '다들 열기구 보러 가나 봐!',
        people: [
          { id: 'chestnut', pass: '따끈한 군밤이오!', show: 'chestnuts', name: '밤 굽는 아주머니', x: 0.18, w: 153, h: 278, lines: ['갓 구운 밤과 돌돌 만 과자란다.', '기다릴 땐 이게 최고지. 먹어 보련?'],
            try: { id: 'eat-chestnut1783', verb: 'eat', name: '구운 밤과 과자', face: 'yum', sora: '앗 뜨거! 군밤이 달콤하고 고소해.' } },
          { id: 'fanlady', pass: '열기구가 언제쯤 뜨려나.', name: '부채 든 아가씨', x: 0.29, w: 106, h: 277, lines: ['파리 사람이 다 나왔나 봐요.', '저도 아침부터 기다렸답니다.'] },
          { id: 'strawman', pass: '짚이 모자라면 안 되지.', name: '짚 나르는 일꾼', x: 0.4, w: 178, h: 298, lines: ['열기구 불에 넣을 짚이란다.', '짚을 넣으면 불이 확 살아나지.'] },
          { id: 'scholar', pass: '더운 공기는 위로 올라가지.', show: 'strawfire', pose: 'see-aha', sora: '불을 때서 뜨는 거구나!', memo: '열기구 밑에서 짚을 태워 더운 공기를 채웠단다. 더운 공기는 위로 올라가지.', name: '불 살피는 학자', x: 0.51, w: 123, h: 293, lines: ['불을 때면 공기가 더워진단다.', '더운 공기가 차면 주머니가 뜨지.'] },
          { id: 'tiptoe', pass: '사람이 많아서 안 보여!', name: '까치발 선 아이', x: 0.62, w: 93, h: 207, lines: ['저기 열기구 꼭대기가 보여!', '나도 크면 하늘을 날 거야.'] },
          { id: 'printseller', pass: '열기구 그림 사세요!', name: '열기구 그림 파는 아저씨', x: 0.73, w: 134, h: 296, lines: ['열기구를 그린 그림이란다.', '벽에 걸어 두고 오래오래 보지.'] },
          { id: 'guard', pass: '표를 보여 주시오.', name: '성의 문지기', x: 0.85, w: 121, h: 320, lines: ['열기구는 이 문 안의 뜰에서 뜬단다.', '사람이 너무 몰려서 내가 지키지.'] },
        ],
        spots: [],
      },
      {
        id: 'garden', name: '프랑스 파리 라 뮈에트 성의 뜰', short: '성의 뜰', zoom: 1.095, ground: 0.747, scale: 0.641, air: 'court', floor: 'dirt',
        sora: '열기구가 집보다 커!',
        people: [
          { id: 'franklin', pass: '허허, 대단한 날이로구나.', name: '프랭클린 할아버지', x: 0.18, w: 87, h: 207, lines: ['나는 바다 건너 미국에서 왔단다.', '이 구경을 놓칠 수는 없지.'] },
          { id: 'scribe', pass: '낮 두 시쯤, 맑음.', name: '받아 적는 이', x: 0.29, w: 73, h: 210, lines: ['오늘 본 것을 다 적어 둔단다.', '뒷날 사람들도 알아야 하니까.'] },
          { id: 'etienne', pass: '바람이 잔잔해야 할 텐데.', name: '몽골피에 씨', x: 0.4, w: 89, h: 220, lines: ['우리 형제가 생각해 낸 열기구란다.', '불을 때면 뜨는 것을 알아냈지.'] },
          { id: 'ropeman', pass: '아직이야, 꽉 잡아!', name: '줄 잡은 일꾼', x: 0.51, w: 80, h: 320, lines: ['이 줄을 놓으면 열기구가 뜬단다.', '오늘은 줄 없이 멀리 가지.'] },
          { id: 'marquis', pass: '짚도 해면도 넉넉해야지.', show: 'sponge', pose: 'see-aha', sora: '불똥을 젖은 해면으로 꾹 눌러!', memo: '날다가 불똥이 천에 붙었단다. 젖은 해면으로 꾹 눌러 껐지.', name: '다를랑드 후작', x: 0.62, w: 85, h: 277, lines: ['나도 같이 탄단다. 불에 짚을 넣지.', '불똥이 튀면 젖은 해면으로 끈단다.'] },
          { id: 'pilatre', pass: '해면이 와야 할 텐데.', show: 'ascent', pose: 'see-wow', sora: '열기구가 줄도 없이 날아가!', memo: '사람이 탄 열기구가 줄 없이 처음 날았단다. 스물다섯 분쯤 날아 파리 건너편에 내렸지.', name: '필라트르 드 로지에', x: 0.73, w: 95, h: 221, lines: ['오늘 내가 이 열기구를 탄단다.', '하늘에서 파리를 내려다볼 거야.'] },
          { id: 'cheerer', pass: '만세! 열기구 만세!', name: '모자 흔드는 아저씨', x: 0.85, w: 89, h: 246, lines: ['사람이 하늘을 난다니!', '오늘을 오래오래 이야기할 거야.'] },
        ],
        spots: [],
      },
    ],
    // "The basket of wet sponges" (core/tale.js; the storyboard of docs/신기한-사실.md): the
    // seamstress who sewed the balloon has a basket of wet sponges, to press out sparks, for
    // the one who is to go up in it; the keeper of the gate of the chateau lets no one in
    // without a ticket; the straw carrier takes her in behind his cart of straw; she hands
    // it to Pilatre de Rozier, choosing what to say; and the balloon rises and goes off over
    // the roofs of Paris with no rope.
    tale: {
      thing: true,
      ask: '열기구는 줄 없이도 날 수 있을까?',
      gate: { scene: 'road', open: 3, sora: '문지기가 막고 있어. 못 가.' },
      steps: [
        {
          who: 'seamstress', goal: '공방 마당의 재봉사에게 가 보렴.', holds: '해면 바구니: 재봉사가 들고 있음',
          lines: ['얘야, 부탁 하나 들어주련?', '물에 적신 해면이란다. 불똥이 튀면 이걸로 끄지.', '열기구에 탈 필라트르 씨께 전해 주렴.'],
          offer: { ask: '해면 바구니를 전해 줄까?', label: '내가 전해 줄게요' },
          errand: 'took',
        },
        {
          who: 'guard', goal: '길 끝의 성문으로 가 보렴.', holds: '해면 바구니: 소라가 들고 있음',
          lines: ['멈춰라. 표를 보여 다오.', '표 없는 사람은 못 들어간다.'],
          sora: '열기구가 뜨기 전에 전해야 하는데… 어? 누가 불러!',
        },
        {
          who: 'strawman', call: '얘, 어디 가는데?', goal: '짚 나르는 일꾼이 부른다. 가 보렴.', holds: '해면 바구니: 소라가 들고 있음',
          lines: ['필라트르 씨께 간다고? 그럼 나를 따라오렴.', '짚 수레는 표 없이도 들어간단다.', '문지기님, 이 아이는 짚 수레와 같이 갑니다!'],
          after: [{ who: 'guard', line: '해면 심부름이라면 수레를 따라가거라.' }],
          sora: '짚 수레를 따라가면 된대! 가자!',
        },
        {
          who: 'pilatre', goal: '성의 뜰의 필라트르 씨에게 해면 바구니를 전하렴.', holds: '해면 바구니: 소라가 들고 있음',
          lines: ['오, 기다리던 해면이로구나.'],
          choice: {
            ask: '해면 바구니를 건네며 뭐라고 할까?',
            options: [
              { id: 'E1', label: '"재봉사 아주머니가 보냈어요"', sora: '열기구 꿰맨 아주머니가 보내셨어요.', says: '끝까지 마음을 써 주는구나. 고맙다, 얘야.' },
              { id: 'E2', label: '"안 무서워요?"', sora: '하늘에 올라가는 거 안 무서워요?', says: '조금 떨린단다. 그래도 꼭 가 보고 싶지.' },
            ],
          },
          errand: 'gave',
        },
        {
          who: 'pilatre', show: true, goal: '열기구가 떠오르는 것을 보렴.',
          lines: ['때맞춰 왔구나. 이제 줄을 푼단다.', '잘 보렴. 지붕 위로 날아갈 거야.'],
          sora: '떴다! 지붕 위로 날아가!',
          errand: 'saw',
        },
      ],
      asides: [
        { who: 'seamstress', when: ['S1', 'S2', 'S3', 'S4'], lines: ['필라트르 씨는 성의 뜰에 계신단다.', '길을 따라가 성문을 지나렴.'] },
        { who: 'seamstress', when: ['S5'], lines: ['전해 주었구나. 고맙다, 얘야.', '이제 마음 놓고 구경하겠구나.'] },
      ],
      done: '해면 바구니를 전하고, 열기구가 줄 없이 날아가는 것을 보았다.',
    },
    errands: [
      { id: 'took', text: '해면 바구니를 받는다.', at: [] },
      { id: 'gave', text: '필라트르 씨에게 해면 바구니를 전한다.', at: [] },
      { id: 'saw', text: '열기구가 떠오르는 것을 본다.', at: [] },
    ],
    reply: '두 사람 다 무사히 내렸단다. 하늘길이 열린 날이지.',
  },
  // Sydney on 20 October 1973, in the afternoon: the day the Opera House was opened. Drawn
  // as an architect's presentation sketch of the 1960s, pencil and charcoal on yellowed
  // paper with thin washes (the user's choice of five tries: the fourth). The pictures are
  // in sydney1973; the try itself is the second scene (the foot of the great stair), and
  // the wharf and the court under the shells were ordered.
  // Looked up on 2026.10.13 and found so: opened on 20 October 1973 by Queen Elizabeth II;
  // begun in 1959 (1958 in some), so fourteen years; every shell of the roof is a piece cut
  // from one sphere (found in 1961 to 1962), so the pieces could be cast in the same moulds;
  // 1,056,006 tiles on the roof ("백만 장도 넘게"), made in Sweden, washed by the rain; in
  // November 1960 a singer sang to the workmen on the unfinished site, the first to sing
  // there ("열세 해 전": he is not named).
  // From memory: fireworks, balloons and the hooters of the boats at the opening; that the
  // ceremony was out of doors in the afternoon and that the queen spoke from a stand;
  // Beethoven's Ninth ("합창") that evening; the green and yellow ferries of Circular Quay;
  // that the harbour was full of boats; the Harbour Bridge; the meat pie with tomato sauce;
  // that the tiles are of two kinds, glossy white and matt cream; the concrete ribs of the
  // shells and the cranes; the wooden model of the sphere; the dress of 1973.
  // Made up: the errand of the conductor's score, the chorister, the policeman who lets no
  // one up the stair till the queen has passed, the workman who shows the way round by the
  // water, the conductor (not the one who conducted that day), every other person.
  // Kept out: the quarrel between the architect and the state and what the house cost; the
  // architect and that he was not there; the names of the queen, the architect and the
  // singer. The queen is spoken of and never met. Nobody says "first" of that night's music:
  // there had been performances in the house before the day it was opened.
  sydneyOpera: {
    first: '오페라하우스가 문을 여는 날이란다. 악보를 전해 주렴.',
    dir: 'sydney1973', look: 'paper', pale: true,
    drawn: '집을 짓는 사람이 연필로 쓱쓱 그린 그림처럼 그렸단다.',
    // (What is said of today: from memory, 2026.10.13; not yet looked up.)
    now: {
      photo: 'photo-now.webp', name: '오페라하우스의 지금 모습', when: '오스트레일리아 시드니 · 오늘날',
      text: [
        '오페라하우스는 문을 연 지 쉰 해가 넘었습니다. 해마다 1,090만 명 넘게 이곳을 찾아옵니다.',
        '흰 지붕은 스웨덴에서 만든 타일 1,056,006장으로 덮여 있습니다. 반짝이는 흰색과 윤기 없는 크림색 두 가지입니다.',
        '건축가 웃손은 공사를 두고 주 정부와 뜻이 맞지 않아, 1966년에 일을 그만두고 오스트레일리아를 떠났습니다.',
        '웃손은 그 뒤 시드니에 다시 오지 않았습니다. 그래서 다 지은 건물을 끝내 보지 못했습니다.',
        '1999년에 웃손은 다시 이 건물의 건축가가 되었습니다. 그가 새로 꾸민 방은 2004년에 \'웃손 방\'이라는 이름으로 문을 열었습니다.',
        '웃손은 2003년에 건축의 큰 상인 프리츠커상을 받았고, 2008년 덴마크에서 90세로 세상을 떠났습니다.',
      ],
      credit: '사진: Diliff, 위키미디어 공용, CC BY-SA 3.0',
    },
    scenes: [
      {
        id: 'quay', name: '오스트레일리아 시드니 서큘러 키 부두', short: '부두', zoom: 1.093, ground: 0.749, scale: 0.640, air: 'market',
        sora: '배가 엄청 많아! 깃발도 달았어.',
        people: [
          { id: 'ferryman', pass: '오늘은 배가 꽉 찼구먼.', show: 'building', pose: 'see-wow', sora: '지붕이 아직 뼈대만 있어!', memo: '짓는 데 열네 해가 걸렸단다. 조개 지붕을 하나씩 세워 올렸지.', name: '연락선 선원', x: 0.18, w: 110, h: 281, lines: ['열네 해 동안 배에서 저 집을 봤단다.', '지붕이 하나씩 솟는 걸 다 봤지.'] },
          { id: 'pieman', pass: '파이요, 따끈한 파이!', show: 'pie', name: '파이 장수', x: 0.29, w: 99, h: 276, lines: ['갓 구운 고기 파이란다.', '빨간 소스를 뿌려야 제맛이지. 먹어 보련?'],
            try: { id: 'eat-pie', verb: 'eat', name: '고기 파이', face: 'yum', sora: '앗 뜨거! 그래도 파이가 고소해.' } },
          { id: 'pinwheel', pass: '바람개비야, 후우 돌아라!', name: '바람개비 든 아이', x: 0.4, w: 77, h: 234, lines: ['바닷바람에 혼자서도 돌아.', '오늘은 학교도 안 가는 날이야!'] },
          { id: 'chorister', pass: '아이고, 또 떨어지겠네.', name: '합창단 아저씨', x: 0.51, w: 86, h: 290, lines: ['나는 합창단에서 노래한단다.', '오늘 밤 저 집에서 노래하지.'] },
          { id: 'snapper', pass: '찰칵! 한 장 더.', name: '사진 찍는 아저씨', x: 0.62, w: 98, h: 276, lines: ['필름 한 통을 벌써 다 썼어.', '저 지붕은 어디서 찍어도 멋지거든.'] },
          { id: 'dresser', pass: '나들이옷 보고 가요!', name: '옷 수레 아주머니', x: 0.73, w: 103, h: 269, lines: ['요즘은 깃이 큰 옷을 입는단다.', '아이 것도 있어. 입어 보련?'],
            try: { id: 'wear-sydney73', verb: 'wear', name: '1973년의 나들이옷', outfit: 'sydney73', sora: '꽃무늬가 엄청 커! 마음에 들어.', memo: '그 무렵엔 깃이 크고 무늬가 큰 옷을 입었단다. 나도 그런 옷이 있었지.' } },
          { id: 'docker', pass: '저 배는 어디다 대나.', name: '부두 일꾼', x: 0.85, w: 109, h: 320, lines: ['오늘은 항구에 배가 가득하단다.', '다들 저 집을 보러 나왔지.'] },
        ],
        spots: [],
      },
      {
        id: 'steps', name: '오스트레일리아 시드니 오페라하우스 큰 계단 밑', short: '큰 계단 밑', zoom: 1.095, ground: 0.747, scale: 0.641, air: 'road',
        sora: '지붕이 조개껍데기 같아!',
        people: [
          { id: 'parasol', pass: '아이고, 곱기도 하지.', name: '양산 든 할머니', x: 0.18, w: 102, h: 290, lines: ['처음 삽을 뜰 때 나는 젊었단다.', '다 짓는 걸 보다니, 오래 살았지.'] },
          { id: 'icecream', pass: '아이스크림 있어요!', name: '아이스크림 장수', x: 0.29, w: 86, h: 275, lines: ['오늘은 줄이 끝이 없어요.', '시월이면 여기는 따뜻한 봄이에요.'] },
          { id: 'balloon', pass: '풍선아, 꼭 잡고 있을게.', name: '풍선 든 아이', x: 0.4, w: 69, h: 260, lines: ['이따가 다 같이 날린대.', '내 건 빨간색이야!'] },
          { id: 'engineer', pass: '공 하나면 다 되지.', show: 'sphere', pose: 'see-aha', sora: '지붕을 공에서 잘라 낸 거래!', memo: '조개 지붕은 모두 공 하나에서 잘라 낸 꼴이란다. 그래서 같은 틀로 찍어 맞출 수 있었지.', name: '나무 공 든 기술자', x: 0.51, w: 98, h: 281, lines: ['저 지붕은 다 공 하나의 조각이란다.', '굽은 꼴이 같으니 같은 틀로 찍었지.'] },
          { id: 'roofer', pass: '내가 붙인 게 저기 있지.', name: '타일 붙인 일꾼', x: 0.62, w: 108, h: 292, lines: ['저 지붕의 타일을 내가 붙였단다.', '흰 것도 있고 누르스름한 것도 있지.'] },
          { id: 'drummer', pass: '둥둥, 북소리 신나지?', name: '북 치는 악대 아저씨', x: 0.73, w: 98, h: 286, lines: ['여왕님이 오시면 북을 친단다.', '손에 땀이 다 나는구나.'] },
          { id: 'police', pass: '자, 뒤로 한 걸음씩!', name: '경찰 아저씨', x: 0.85, w: 97, h: 320, lines: ['오늘은 사람이 아주 많이 왔단다.', '밀지 말고 천천히 다니렴.'] },
        ],
        spots: [],
      },
      {
        id: 'forecourt', name: '오스트레일리아 시드니 오페라하우스 조개 지붕 아래 마당', short: '지붕 아래 마당', zoom: 1.115, ground: 0.732, scale: 0.652, air: 'court',
        sora: '우와, 밑에서 보니까 엄청 커!',
        people: [
          { id: 'flower', pass: '꽃이 시들면 안 되는데.', name: '꽃 든 아이', x: 0.18, w: 66, h: 198, lines: ['저 단 앞에 놓을 꽃이야.', '여왕님이 저 위에서 문을 여신대.'] },
          { id: 'binoc', pass: '어머, 하나하나 다 보여.', show: 'tiles', pose: 'see-wow', sora: '지붕이 다 타일이야!', memo: '지붕에 타일을 백만 장도 넘게 붙였단다. 비가 오면 저절로 씻기지.', name: '쌍안경 든 아주머니', x: 0.29, w: 89, h: 243, lines: ['지붕이 온통 작은 타일이란다.', '먼 나라 스웨덴에서 구워 왔대.'] },
          { id: 'violin', pass: '끼잉, 줄을 맞춰야지.', name: '바이올린 켜는 아가씨', x: 0.4, w: 94, h: 225, lines: ['오늘 밤 저 안에서 연주해.', '소리가 아주 곱게 울리는 집이야.'] },
          { id: 'oldhand', pass: '그 노래가 아직 귀에 선해.', name: '옛 일꾼 할아버지', x: 0.51, w: 79, h: 236, lines: ['열세 해 전, 짓다 만 여기서 한 가수가 노래했단다.', '우리 일꾼들이 일손을 놓고 들었지.'] },
          { id: 'choirgirl', pass: '아아, 노래 전에 목을 풀어야지.', name: '합창단 언니', x: 0.62, w: 81, h: 231, lines: ['목을 풀고 있어. 아아아.', '지휘자 선생님이 악보를 찾으셔.'] },
          { id: 'conductor', pass: '내 악보가 어디 갔지?', show: 'opening', pose: 'see-wow', sora: '배들이 다 같이 뱃고동을 울려!', memo: '1973년 10월 20일에 여왕이 문을 열었단다. 짓기 시작하고 열네 해 만이었지.', name: '지휘자', x: 0.73, w: 80, h: 233, lines: ['나는 노래와 악기를 이끈단다.', '이 막대 하나로 다 같이 맞추지.'] },
          { id: 'balloons', pass: '풍선은 아직 날리면 안 돼.', name: '풍선 줄 잡은 아저씨', x: 0.85, w: 102, h: 320, lines: ['신호가 오면 풍선을 날린단다.', '하늘이 알록달록해질 거야.'] },
        ],
        spots: [],
      },
    ],
    // "The conductor's score" (core/tale.js; the storyboard of docs/신기한-사실.md): a
    // chorister on the wharf, his arms full of music, has dropped the conductor's score and
    // cannot hurry; the policeman at the foot of the great stair lets no one up till the
    // queen has passed; the workman who laid the tiles shows her the way round by the water;
    // she hands it to the conductor, choosing what to say; and the house is opened, the
    // boats in the harbour sound their hooters and the balloons and fireworks go up.
    tale: {
      thing: true,
      ask: '문을 여는 날엔 무슨 일이 벌어질까?',
      gate: { scene: 'steps', open: 3, sora: '경찰 아저씨가 길을 막고 있어.' },
      steps: [
        {
          who: 'chorister', goal: '부두의 합창단 아저씨에게 가 보렴.', holds: '악보: 합창단 아저씨가 떨어뜨림',
          lines: ['얘야, 발밑의 그 악보 좀 주워 주련?', '지휘자 선생님의 악보란다. 나는 짐이 많아 빨리 못 가.', '조개 지붕 아래 마당의 지휘자 선생님께 전해 주렴.'],
          offer: { ask: '악보를 전해 줄까?', label: '내가 전해 줄게요' },
          errand: 'took',
        },
        {
          who: 'police', goal: '오페라하우스의 큰 계단으로 가 보렴.', holds: '악보: 소라가 들고 있음',
          lines: ['잠깐, 계단으로는 못 올라간단다.', '여왕님이 지나가실 때까지 기다려야 해.'],
          sora: '악보를 전해야 하는데… 어? 누가 불러!',
        },
        {
          who: 'roofer', call: '얘, 어디 가는데?', goal: '타일 붙인 일꾼이 부른다. 가 보렴.', holds: '악보: 소라가 들고 있음',
          lines: ['지휘자 선생님께 간다고? 그럼 옆길로 가렴.', '바닷가 난간을 따라 돌면 마당이 나온단다.', '경관님, 이 아이는 바닷가 옆길로 보냅니다!'],
          after: [{ who: 'police', line: '악보 심부름이라면 그 길로 가렴.' }],
          sora: '바닷가 옆길로 가면 된대! 가자!',
        },
        {
          who: 'conductor', goal: '조개 지붕 아래 마당의 지휘자에게 악보를 전하렴.', holds: '악보: 소라가 들고 있음',
          lines: ['오, 내 악보! 한참 찾았단다.'],
          choice: {
            ask: '악보를 건네며 뭐라고 할까?',
            options: [
              { id: 'E1', label: '"합창단 아저씨가 보냈어요"', sora: '합창단 아저씨가 보내셨어요.', says: '짐이 많았을 텐데. 고맙다, 얘야.' },
              { id: 'E2', label: '"오늘 무슨 노래 해요?"', sora: '오늘 무슨 노래를 해요?', says: '오늘 밤, 베토벤의 합창이란다.' },
            ],
          },
          errand: 'gave',
        },
        {
          who: 'conductor', show: true, goal: '오페라하우스가 문을 여는 것을 보렴.',
          lines: ['때맞춰 왔구나. 저 높은 단을 보렴.', '여왕님이 이 집을 연다고 말씀하신단다.'],
          sora: '뱃고동이 뿌우! 풍선도 날아가!',
          errand: 'saw',
        },
      ],
      asides: [
        { who: 'chorister', when: ['S1', 'S2', 'S3', 'S4'], lines: ['지휘자 선생님은 지붕 아래 마당에 계신단다.', '큰 계단을 지나 조개 지붕 밑으로 가렴.'] },
        { who: 'chorister', when: ['S5'], lines: ['전해 주었구나. 고맙다, 얘야.', '이제 마음 놓고 노래하겠구나.'] },
      ],
      done: '악보를 전하고, 오페라하우스가 문을 여는 것을 보았다.',
    },
    errands: [
      { id: 'took', text: '악보를 받는다.', at: [] },
      { id: 'gave', text: '지휘자에게 악보를 전한다.', at: [] },
      { id: 'saw', text: '오페라하우스가 문을 여는 것을 본다.', at: [] },
    ],
    reply: '열네 해를 기다린 집이란다. 뱃고동 소리 들었니?',
  },
  // Göbekli Tepe about 9500 BC, a summer evening. Drawn as the wall paintings of Çatalhöyük,
  // a village of that land some two thousand years later: red ochre and black on rough
  // milk-white plaster (the user's choice of five tries: the second). The pictures are in
  // gobekli9500; the try is the third scene ('ring': a hut, grinding stones, a fire, flints,
  // a pillar lying by logs and a rope, and the round wall with the pillars in it, seen from
  // before the wall, with the sun going down). The storyboard has "the huts below the hill
  // -> the place where stone is split and the way the pillar is hauled -> within the round
  // wall"; the third is named "before the round wall" here, for so the picture shows it.
  // Pale: the sky of the pictures is milk-white plaster.
  // Looked up on 2026.10.14 (docs/신기한-사실.md) and found so: built between 9600 and 8200 BC
  // by people who hunted and gathered, before pottery ("만 천오백 해쯤 전"); more than a hundred
  // T-shaped pillars, 1.5 to 5 m tall, standing round within round walls, the two in the
  // middle the tallest (more than 5 m in one ring: "어른 키의 세 배"); arms and hands on the
  // middle pillars, which are taken to stand for people; birds, snakes, foxes, boars and
  // wild cattle the beasts most often carved; people are now held to have lived there; what
  // the great rings were for is not agreed.
  // From memory: grinding stones for the seeds of wild grasses, in great number; cisterns
  // cut into the rock for rain, and no spring on the hill; no iron, no wheel, no pots, no
  // fields, no herds; wild pistachios and almonds; vessels cut of stone; the pillars cut
  // out of the rock of the hill itself with tools of stone; flint blades struck off with
  // antler; baskets of plant stalks; the crane and the scorpion among the beasts; that the
  // pillars are joined by walls of piled stones; that stone was carved with stone.
  // Not known, and a guess here: that the pillars were moved on logs with ropes and levers
  // (the try has logs and a rope); that porridge was made of the ground seeds; the dress
  // (nothing of it is left: hides, and the slip of the dress says it is a guess).
  // Made up: the errand of the basket of porridge, the keeper of the way who lets no one
  // cross while the pillar is hauled, the child who says to go round by the place where
  // stone is split, the carver and his new fox, every other person. Nobody has a name.
  // Kept out: what the place was for (temple, calendar, stars), "the oldest temple".
  gobekli: {
    first: '아주 먼 옛날, 큰 돌기둥을 세우던 날이란다. 죽을 전해 주렴.',
    // Who lived here, for a player who has not heard of them. The first sentence was looked
    // up; the second is from memory.
    intro: { title: '돌기둥을 세운 사람들', text: '만 천오백 해쯤 전, 사냥하고 열매를 모으며 살던 사람들이란다. 밭도 흙 그릇도 쇠도 없었지.' },
    dir: 'gobekli9500', look: 'paper', pale: true,
    // (What is said of today: from memory, 2026.10.14, but for what docs/신기한-사실.md has as found.)
    now: {
      photo: 'photo-now.webp', name: '괴베클리 테페의 지금 모습', when: '터키 샨르우르파 · 2010년에 흙을 걷어 내는 모습',
      text: [
        '1963년에 터키 이스탄불 대학과 미국 시카고 대학의 학자들이 이 언덕을 처음 조사했습니다.',
        '1994년, 독일의 고고학자 클라우스 슈미트가 이곳이 아주 오래된 유적임을 알아보았습니다. 그 뒤로 지금까지 흙을 걷어 내는 일이 이어지고 있습니다.',
        '지금까지 T자 돌기둥이 200개 넘게 나왔습니다. 큰 것은 높이 6미터, 무게 20톤에 이릅니다.',
        '비와 바람에서 돌기둥을 지키려고 2016년부터 큰 지붕을 씌웠습니다. 찾아온 사람들은 지붕 아래 놓인 길을 걸으며 봅니다.',
        '2018년에 유네스코 세계유산이 되었습니다. 2021년부터는 카라한 테페 같은 둘레의 비슷한 옛 터들도 함께 파내고 있습니다.',
        '여기서 나온 유물은 가까운 샨르우르파 박물관에 있습니다. 그곳에는 돌담 하나를 실제 크기로 본떠 지어 두어 안에 들어가 볼 수 있습니다.',
      ],
      credit: '사진: Volker Höhfeld, 위키미디어 공용, CC BY-SA 4.0',
    },
    drawn: '그 땅의 옛 마을 벽 그림처럼, 흰 회벽에 붉은 흙으로 그렸단다.',
    scenes: [
      {
        id: 'camp', name: '터키 괴베클리 테페 언덕 아래 움막 터', short: '움막 터', zoom: 1.124, ground: 0.725, scale: 0.658, air: 'market', floor: 'dirt',
        sora: '집을 가죽으로 덮었어!',
        people: [
          { id: 'nutkid', pass: '열매를 하나씩 줍는 중이야.', name: '열매 줍는 아이', x: 0.18, w: 96, h: 241, lines: ['저 나무에서 떨어진 열매야.', '껍질을 까면 고소한 알이 나와.'] },
          { id: 'cook', pass: '죽이 걸쭉하게 잘 됐네.', show: 'porridge', name: '죽 쑤는 아주머니', x: 0.29, w: 115, h: 311, lines: ['들풀 씨앗을 갈아서 쑨 죽이란다.', '피스타치오도 넣었어. 먹어 보련?'],
            try: { id: 'eat-porridge', verb: 'eat', name: '들풀 씨앗 죽과 피스타치오', face: 'yum', sora: '죽이 고소해! 알이 오독오독 씹혀.' } },
          { id: 'seeder', pass: '오늘은 이삭을 많이 모았지.', show: 'quern', pose: 'see-aha', sora: '돌로 갈아서 가루를 내!', memo: '밭이 없던 때라 들에 절로 자란 풀의 씨앗을 모았단다. 넓적한 돌에 갈아 가루를 냈지.', name: '씨앗 모으는 아주머니', x: 0.4, w: 114, h: 301, lines: ['우리는 밭을 일구지 않는단다.', '들에 절로 자란 풀에서 씨앗을 모으지.'] },
          { id: 'grinder', pass: '누가 좀 전해 주면 좋으련만.', name: '갈돌 가는 할머니', x: 0.51, w: 107, h: 299, lines: ['씨앗을 돌에 대고 문질러 간단다.', '한참을 갈아야 죽 한 그릇이 되지.'] },
          { id: 'tanner', pass: '가죽옷을 한 땀 한 땀 짓는단다.', name: '가죽옷 짓는 아주머니', x: 0.62, w: 115, h: 302, lines: ['뼈로 만든 바늘로 가죽을 꿰맨단다.', '아이 것도 있어. 입어 보련?'],
            try: { id: 'wear-gobekli', verb: 'wear', name: '괴베클리 테페의 옷', outfit: 'gobekli', sora: '가죽이 보들보들해!', memo: '그때 옷은 하나도 남지 않았단다. 짐승 가죽으로 지어 입었으리라 짐작할 뿐이지.' } },
          { id: 'weaver', pass: '촘촘히 엮어야 안 새지.', name: '바구니 엮는 할아버지', x: 0.73, w: 116, h: 312, lines: ['흙으로 빚은 그릇이 아직 없단다.', '그래서 풀 줄기로 바구니를 엮지.'] },
          { id: 'hunter', pass: '오늘은 멀리까지 다녀왔지.', name: '사냥 다녀온 아저씨', x: 0.85, w: 130, h: 320, lines: ['우리는 기르는 짐승이 없단다.', '들에서 사냥하고 열매를 모아 살지.'] },
        ],
        spots: [],
      },
      {
        id: 'quarry', name: '터키 괴베클리 테페 돌 떼는 자리와 돌 끄는 길', short: '돌 끄는 길', zoom: 1.137, ground: 0.715, scale: 0.665, air: 'hush', floor: 'dirt',
        sora: '큰 돌기둥이 누워 있어!',
        people: [
          { id: 'quarrier', pass: '돌을 조금만 더 떠내면 되겠다.', name: '돌 떠내는 아저씨', x: 0.18, w: 115, h: 272, lines: ['이 언덕의 바위에서 기둥을 떠낸단다.', '쇠가 없으니 돌로 돌을 두드리지.'] },
          { id: 'knapper', pass: '돌날은 살살 쳐서 떼야지.', show: 'flint', pose: 'see-aha', sora: '돌에서 칼날이 나와!', memo: '쇠가 없던 때라 부싯돌을 떼어 칼날로 썼단다. 톡 치면 얇고 날카로운 조각이 떨어지지.', name: '돌날 떼는 아주머니', x: 0.29, w: 115, h: 251, lines: ['부싯돌을 톡 치면 얇게 떨어진단다.', '그 조각이 우리의 칼이지.'] },
          { id: 'flintkid', pass: '나도 돌날을 한 장 뗐다!', name: '부싯돌 떼는 아이', x: 0.4, w: 96, h: 190, lines: ['돌날 떼는 걸 배우는 중이야.', '아직은 자꾸 부서져.'] },
          { id: 'puller', pass: '다 같이 기둥을 끌자, 영차!', name: '밧줄 끄는 일꾼', x: 0.51, w: 105, h: 272, lines: ['바퀴가 없어서 밧줄로 끈단다.', '여럿이 한꺼번에 당겨야 움직이지.'] },
          { id: 'waterer', pass: '물 마시고 하세요!', name: '물 나르는 아가씨', x: 0.62, w: 78, h: 240, lines: ['언덕 위에는 샘이 없단다.', '바위에 판 웅덩이에 빗물을 모으지.'] },
          { id: 'lever', pass: '밑을 받쳐라, 받쳐!', name: '지렛대 든 아저씨', x: 0.73, w: 100, h: 320, lines: ['긴 장대로 기둥을 조금씩 들썩인단다.', '그 밑에 통나무를 밀어 넣지.'] },
          { id: 'wayguard', pass: '기둥이 지나간다, 비켜라.', name: '길 지키는 이', x: 0.85, w: 111, h: 273, lines: ['기둥을 끌 때는 길이 위험하단다.', '그래서 내가 여기서 지키지.'] },
        ],
        spots: [],
      },
      {
        id: 'ring', name: '터키 괴베클리 테페 둥근 돌담 앞', short: '둥근 돌담 앞', zoom: 1.156, ground: 0.700, scale: 0.677, air: 'hush', floor: 'dirt',
        sora: '돌기둥이 둥글게 서 있어!',
        people: [
          { id: 'waller', pass: '이 돌은 여기가 맞겠군.', name: '돌담 쌓는 아저씨', x: 0.18, w: 138, h: 320, lines: ['기둥과 기둥 사이를 돌담으로 잇는단다.', '둥글게 빙 둘러서 쌓지.'] },
          { id: 'elder', pass: '볼 때마다 사람 같구먼.', show: 'arms', pose: 'see-aha', sora: '기둥에 팔이랑 손이 있어!', memo: '가운데 큰 기둥에는 팔과 손이 새겨져 있단다. 그래서 사람을 나타낸 것으로 보지.', name: '기둥 살피는 할아버지', x: 0.29, w: 174, h: 308, lines: ['가운데 큰 기둥의 옆을 잘 보렴.', '긴 팔과 손가락이 새겨져 있단다.'] },
          { id: 'tallkid', pass: '기둥이 높아서 목이 아파.', name: '키 재는 아이', x: 0.4, w: 114, h: 256, lines: ['가운데 기둥이 얼마나 큰지 재 봤어.', '어른 키의 세 배나 돼!'] },
          { id: 'rubber', pass: '돌을 쓱쓱 갈아 반반하게 하지.', name: '돌 가는 아주머니', x: 0.51, w: 130, h: 302, lines: ['거친 돌로 기둥의 면을 문지른단다.', '반반해야 짐승을 새기기 좋지.'] },
          { id: 'carver', pass: '배가 고픈데, 죽은 언제 오려나.', show: 'fox', pose: 'see-wow', sora: '여우가 뛰어나올 것 같아!', memo: '기둥에는 여우와 뱀과 새가 많이 새겨져 있단다. 왜 새겼는지는 아직 아무도 모르지.', name: '돌 새기는 이', x: 0.62, w: 147, h: 316, lines: ['나는 돌기둥에 짐승을 새긴단다.', '뾰족한 돌로 조금씩 쪼아 내지.'] },
          { id: 'firewife', pass: '해 지기 전에 불을 피워야지.', name: '불 피우는 아주머니', x: 0.73, w: 133, h: 278, lines: ['해가 지면 언덕은 금세 어두워진단다.', '그래서 미리 불을 피워 두지.'] },
          { id: 'counter', pass: '여우, 뱀, 멧돼지… 짐승이 많다!', name: '짐승 세는 아이', x: 0.85, w: 115, h: 228, lines: ['기둥에 있는 짐승을 세는 중이야.', '전갈도 있어. 찾아볼래?'] },
        ],
        spots: [],
      },
    ],
    // "The basket of porridge" (core/tale.js; the storyboard of docs/신기한-사실.md): the old
    // woman who grinds seeds by the huts has a basket of porridge for the carver of the
    // pillars; the keeper of the way lets no one cross while the great pillar is hauled;
    // the child who strikes flints says to go round by the place where stone is split; she
    // hands it to the carver, choosing what to say; and before the round wall she sees the
    // two great pillars in the middle and the fox he has just carved.
    tale: {
      thing: true,
      ask: '돌기둥에는 무엇이 새겨져 있을까?',
      gate: { scene: 'quarry', open: 3, sora: '길 지키는 이가 막고 있어. 못 가.' },
      steps: [
        {
          who: 'grinder', goal: '움막 터의 갈돌 가는 할머니에게 가 보렴.', holds: '죽 바구니: 할머니가 들고 있음',
          lines: ['얘야, 부탁 하나 들어주련?', '들풀 씨앗으로 쑨 죽이란다. 돌 새기는 이가 종일 굶었지.', '언덕 위 둥근 돌담으로 전해 주렴.'],
          offer: { ask: '죽 바구니를 전해 줄까?', label: '내가 전해 줄게요' },
          errand: 'took',
        },
        {
          who: 'wayguard', goal: '돌 끄는 길을 지나 둥근 돌담으로 가 보렴.', holds: '죽 바구니: 소라가 들고 있음',
          lines: ['멈춰라. 큰 돌기둥을 끄는 중이다.', '다 지나갈 때까지는 길을 못 건넌다.'],
          sora: '죽이 식을 텐데… 어? 누가 불러!',
        },
        {
          who: 'flintkid', call: '얘, 어디 가는데?', goal: '부싯돌 떼는 아이가 부른다. 가 보렴.', holds: '죽 바구니: 소라가 들고 있음',
          lines: ['돌담에 간다고? 그럼 이리 와.', '돌 떼는 자리를 돌아가면 길을 안 건너도 돼.', '아저씨, 이 애는 돌아서 갈게요!'],
          after: [{ who: 'wayguard', line: '돌아서 간다면 가도 좋다.' }],
          sora: '돌 떼는 자리를 돌아가면 된대! 가자!',
        },
        {
          who: 'carver', goal: '둥근 돌담의 돌 새기는 이에게 죽을 전하렴.', holds: '죽 바구니: 소라가 들고 있음',
          lines: ['오, 죽이 왔구나. 배가 몹시 고팠단다.'],
          choice: {
            ask: '죽 바구니를 건네며 뭐라고 할까?',
            options: [
              { id: 'E1', label: '"할머니가 보냈어요"', sora: '움막 터의 할머니가 보내셨어요.', says: '아직 따뜻하구나. 고맙다, 얘야.' },
              { id: 'E2', label: '"뭘 새기세요?"', sora: '기둥에 무엇을 새기세요?', says: '여우란다. 방금 꼬리까지 다 새겼지.' },
            ],
          },
          errand: 'gave',
        },
        {
          who: 'carver', show: true, goal: '가운데 큰 기둥 둘과 막 새긴 여우를 보렴.',
          lines: ['저기 가운데 큰 기둥 둘이 보이느냐.', '그 기둥에 내가 막 새긴 여우가 있단다.'],
          sora: '기둥이 엄청 커! 여우도 있어!',
          errand: 'saw',
        },
      ],
      asides: [
        { who: 'grinder', when: ['S1', 'S2', 'S3', 'S4'], lines: ['돌 새기는 이는 둥근 돌담에 있단다.', '돌 끄는 길을 지나 언덕 위로 가렴.'] },
        { who: 'grinder', when: ['S5'], lines: ['전해 주었구나. 고맙다, 얘야.', '내일도 씨앗을 갈아야겠구나.'] },
      ],
      done: '죽을 전하고, 큰 기둥 둘과 막 새긴 여우를 보았다.',
    },
    errands: [
      { id: 'took', text: '죽 바구니를 받는다.', at: [] },
      { id: 'gave', text: '돌 새기는 이에게 죽을 전한다.', at: [] },
      { id: 'saw', text: '큰 기둥 둘과 막 새긴 여우를 본다.', at: [] },
    ],
    reply: '왜 세웠는지는 아직 아무도 모른단다. 죽은 따뜻하더냐.',
  },
  // Olympia on a summer morning of 776 BC: the first Olympic festival on record, with one
  // footrace only. Drawn as the painting on Greek pots of that very century, the Geometric
  // (the user's choice of five tries: the first). The pictures are in olympia776; the try
  // itself is the third scene (the running ground: tent, table, tripod, starting line and
  // bank), and the tents in the olive grove and the ground before the altar were ordered
  // after it. The sky is the pale clay of the pot: `pale`.
  // Looked up on 2026.10.14 and found so: the first festival on record is of 776 BC and had
  // one contest, a footrace of about 192 m ("이백 미터쯤"; handed down as six hundred
  // "걸음", which is the word of docs/신기한-사실.md: the old measure is six hundred feet);
  // the winner was Koroibos of Elis, nearby, whose trade is said of here as "제사 음식을
  // 맡은 사람".
  // Not settled, so only "나뭇가지 관": whether the first crown was of olive.
  // From memory: that the altar of Zeus was a heap of ash that grew year by year; that
  // there was neither a stone temple nor a stone stadium then; that fighting was put off
  // for the festival (said as hearsay: "멈춘다고 들었지"); that bronze tripod cauldrons were
  // given to the god here in this century and many were dug up; barley bread, figs, goat
  // cheese, olive oil for the skin and for lamps; the lyre and songs of heroes; the double
  // pipe; wool dress pinned at the shoulders; skins for carrying water; a river near by;
  // that Elis is a day or two off on foot.
  // Made up: the errand of the water skin, the baker at the tents, the keeper of the altar
  // who lets no one by, the workman with the stones who shows the way along the bank, the
  // elder who judges and that it is he who crowns, the measuring of the ground with a
  // knotted line, every other person.
  // Kept out: the offering of oxen and any killing of beasts, the contests of later years,
  // stone temples, that those who ran wore nothing (they wear a cloth about the hips here),
  // and who was not let in to watch.
  olympia: {
    first: '기록에 남은 첫 올림피아 달리기 날이란다. 물 주머니를 전해 주렴.',
    // Who they were, for a player who has not heard of them. Both sentences are from memory.
    intro: { title: '옛 그리스 사람들', text: '옛 그리스 사람들은 도시마다 따로 나라를 이루고 살았단다. 올림피아에는 제우스 신께 제사하러 모였지.' },
    dir: 'olympia776', look: 'paper', pale: true,
    // (What is said of today: from memory, 2026.10.14, but for what docs/신기한-사실.md has as found.)
    now: {
      photo: 'photo-now.webp', name: '올림피아 달리기 터의 지금 모습', when: '그리스 올림피아 · 오늘날',
      text: [
        '올림피아는 지진과 홍수를 여러 번 겪고 600년대 초에 비었습니다. 그 뒤 터는 8미터 깊이까지 흙에 묻혔습니다.',
        '1875년, 독일 고고학자들이 큰 발굴을 시작했습니다. 1989년에는 올림피아 유적이 유네스코 세계유산이 되었습니다.',
        '지금 남은 달리기 터는 기원전 300년대에 다시 지은 것입니다. 1960년에 흙을 다 걷어 내고, 이듬해 옛 모습대로 고쳐 놓았습니다.',
        '달리기 길은 192미터쯤입니다. 양쪽 끝에는 발가락을 거는 홈을 판 출발선 돌이 지금도 남아 있습니다.',
        '2004년 아테네 올림픽 때, 이 옛 달리기 터에서 포환던지기 경기를 열었습니다.',
        '1936년부터 올림픽 성화는 이곳 헤라 신전 앞에서 오목 거울로 햇빛을 모아 불을 붙입니다.',
      ],
      credit: '사진: Carole Raddato, 위키미디어 공용, CC BY-SA 2.0',
    },
    drawn: '바로 그 무렵 그리스 항아리의 그림처럼, 세모와 줄무늬로 그렸단다.',
    scenes: [
      {
        id: 'camp', name: '그리스 올림피아 올리브 숲의 천막 터', short: '천막 터', zoom: 1.115, ground: 0.732, scale: 0.652, air: 'market', floor: 'dirt',
        sora: '나무 사이에 천막이 가득해!',
        people: [
          { id: 'shepherd', pass: '치즈랑 무화과 있어요!', show: 'bread', name: '양치기', x: 0.18, w: 120, h: 313, lines: ['염소젖으로 만든 치즈란다.', '보리빵이랑 무화과도 있지. 먹어 보련?'],
            try: { id: 'eat-barley', verb: 'eat', name: '보리빵과 무화과와 치즈', face: 'yum', sora: '무화과가 꿀처럼 달아!' } },
          { id: 'traveller', pass: '휴, 드디어 다 왔구나.', name: '먼 길 온 나그네', x: 0.29, w: 161, h: 316, lines: ['바다 건너 먼 도시에서 왔단다.', '잔치 동안은 싸움을 멈춘다고 들었지.'] },
          { id: 'waterboy', pass: '물 지나가요, 물!', name: '물 긷는 아이', x: 0.4, w: 91, h: 235, lines: ['강에서 물을 길어 오는 중이야.', '여름이라 다들 목이 말라.'] },
          { id: 'baker', pass: '어머, 이걸 놓고 갔네.', name: '빵 굽는 아주머니', x: 0.51, w: 133, h: 320, lines: ['보리 가루로 납작한 빵을 굽는단다.', '먼 길 온 사람들이 다 배고프지.'] },
          { id: 'oilman', pass: '갓 짠 올리브 기름이오.', name: '올리브 기름 장수', x: 0.62, w: 145, h: 312, lines: ['올리브 열매를 짜서 낸 기름이란다.', '몸에도 바르고 등잔에도 넣지.'] },
          { id: 'weaver', pass: '시원한 옷 보고 가렴.', name: '옷 짓는 아주머니', x: 0.73, w: 125, h: 316, lines: ['양털로 짠 옷이란다.', '아이 것도 있어. 입어 보련?'],
            try: { id: 'wear-olympia', verb: 'wear', name: '올림피아의 옷', outfit: 'olympia', sora: '어깨를 핀으로 여몄어!', memo: '긴 천을 어깨에서 핀으로 여미고 허리띠를 맸단다. 단에는 줄무늬를 넣었지.' } },
          { id: 'singer', pass: '옛날 옛적 한 영웅이…', name: '노래하는 이', x: 0.85, w: 129, h: 316, lines: ['옛 영웅들의 이야기를 노래한단다.', '줄을 뜯으며 밤늦도록 부르지.'] },
        ],
        spots: [],
      },
      {
        id: 'altar', name: '그리스 올림피아 제우스의 제단 앞', short: '제단 앞', zoom: 1.120, ground: 0.728, scale: 0.656, air: 'hush', floor: 'dirt',
        sora: '재가 언덕처럼 쌓였어!',
        people: [
          { id: 'tripodman', pass: '조심조심, 귀한 솥이야.', show: 'tripod', pose: 'see-wow', sora: '솥에 다리가 셋이야!', memo: '사람들은 청동 세발솥을 신께 바쳤단다. 올림피아 땅에서 많이 나왔지.', name: '세발솥 가져온 이', x: 0.18, w: 134, h: 313, lines: ['청동으로 만든 세발솥이란다.', '제우스 신께 바치려고 가져왔지.'] },
          { id: 'woodman', pass: '영차, 장작 나간다.', name: '장작 나르는 일꾼', x: 0.29, w: 136, h: 301, lines: ['제단에 불을 피울 장작이란다.', '연기가 하늘로 곧게 오르지.'] },
          { id: 'stoneman', pass: '이 돌은 출발선에 놓을 거야.', name: '돌 나르는 일꾼', x: 0.4, w: 150, h: 302, lines: ['달리기 터에 놓을 돌이란다.', '한 줄로 놓으면 출발선이 되지.'] },
          { id: 'ashman', pass: '올해도 한 뼘 높아지겠군.', show: 'altar', pose: 'see-aha', sora: '재를 쌓아서 만들었대!', memo: '제우스의 제단은 재를 쌓아 만들었다고 전한단다. 그때는 돌 신전이 없었지.', name: '제단 돌보는 할아버지', x: 0.51, w: 145, h: 319, lines: ['이 제단은 돌로 쌓은 게 아니란다.', '불을 피우고 남은 재를 쌓았지.'] },
          { id: 'piper', pass: '삘릴리, 피리 소리 들어 보렴.', name: '피리 부는 이', x: 0.62, w: 137, h: 305, lines: ['피리 두 개를 한꺼번에 분단다.', '제사 때는 내 피리 소리가 나지.'] },
          { id: 'branchgirl', pass: '잎이 은빛으로 반짝여.', name: '나뭇가지 든 아이', x: 0.73, w: 105, h: 217, lines: ['올리브 나뭇가지야.', '제단 앞에 놓으려고 가져왔어.'] },
          { id: 'keeper', pass: '아무도 지나가면 안 된다.', name: '제단 지키는 이', x: 0.85, w: 173, h: 320, lines: ['나는 제우스 신의 제단을 지킨단다.', '제사 채비를 할 때는 길을 막지.'] },
        ],
        spots: [],
      },
      {
        id: 'track', name: '그리스 올림피아 달리기 터', short: '달리기 터', zoom: 1.120, ground: 0.728, scale: 0.656, air: 'hush', floor: 'dirt',
        sora: '저기가 출발선인가 봐!',
        people: [
          { id: 'stretcher', pass: '하나, 둘! 몸을 잘 풀어 둬야지.', name: '몸 푸는 선수', x: 0.18, w: 121, h: 320, lines: ['달리기 전에 몸을 푼단다.', '다리가 굳으면 빨리 못 뛰지.'] },
          { id: 'cupboy', pass: '물 드세요, 시원한 물!', name: '물 나눠 주는 아이', x: 0.29, w: 126, h: 207, lines: ['더운 날이라 물을 나눠 줘.', '달리는 아저씨들이 먼저야.'] },
          { id: 'pacer', pass: '오백아흔아홉, 육백 걸음!', show: 'track', pose: 'see-wow', sora: '저 끝까지 한 번에 달리는 거래!', memo: '첫 제전의 경기는 달리기 하나뿐이었단다. 길은 이백 미터쯤이었지.', name: '길 재는 어른', x: 0.4, w: 174, h: 282, lines: ['달리기 길을 걸음으로 잰단다.', '저 끝까지 육백 걸음이라고들 하지.'] },
          { id: 'judge', pass: '누가 먼저 닿는지 잘 봐야지.', name: '심판 어른', x: 0.51, w: 130, h: 293, lines: ['누가 먼저 닿는지 내가 본단다.', '이긴 이에게 나뭇가지 관을 씌우지.'] },
          { id: 'koroibos', pass: '아이고, 목이 타는구나.', show: 'crown', pose: 'see-wow', sora: '코로이보스 아저씨가 이겼어!', memo: '기록에 남은 첫 올림피아에서 이긴 사람은 엘리스의 코로이보스란다. 나뭇가지 관을 받았지.', name: '코로이보스', x: 0.62, w: 148, h: 282, lines: ['나는 엘리스에서 온 코로이보스란다.', '고향에서는 제사 음식을 맡아 일하지.'] },
          { id: 'rival', pass: '오늘은 내가 이길 거야.', name: '다른 도시 선수', x: 0.73, w: 125, h: 284, lines: ['오늘 경기는 달리기 하나뿐이란다.', '딱 한 번 달리면 끝이지.'] },
          { id: 'fan', pass: '빨리 시작했으면!', name: '구경 온 아이', x: 0.85, w: 103, h: 192, lines: ['풀 둑에 앉으면 다 보여.', '아빠랑 이틀을 걸어왔어.'] },
        ],
        spots: [],
      },
    ],
    // "The water skin left behind" (core/tale.js; the storyboard of docs/신기한-사실.md): the
    // baker at the tents has the water skin that Koroibos of Elis left with her; the keeper
    // of the altar lets no one by, for the offering is being made ready; the workman who
    // carries stones for the starting line shows her the way round along the grassy bank;
    // she hands it to Koroibos at the starting line, choosing what to say; and she sees the
    // one race run and Koroibos given a crown of branches.
    tale: {
      thing: true,
      ask: '첫 올림피아에서는 무슨 경기를 했을까?',
      gate: { scene: 'altar', open: 3, sora: '제단 지키는 이가 막고 있어. 못 가.' },
      steps: [
        {
          who: 'baker', goal: '천막 터의 빵 굽는 아주머니에게 가 보렴.', holds: '물 주머니: 빵 굽는 아주머니가 들고 있음',
          lines: ['얘야, 부탁 하나 들어주련?', '엘리스에서 온 코로이보스가 물 주머니를 놓고 갔단다.', '달리기 터의 출발선으로 전해 주렴.'],
          offer: { ask: '물 주머니를 전해 줄까?', label: '내가 전해 줄게요' },
          errand: 'took',
        },
        {
          who: 'keeper', goal: '제단 앞을 지나 달리기 터로 가 보렴.', holds: '물 주머니: 소라가 들고 있음',
          lines: ['멈춰라. 지금은 제사 채비를 하는 중이다.', '이 길로는 아무도 못 지나간다.'],
          sora: '곧 달리기를 할 텐데… 어? 누가 불러!',
        },
        {
          who: 'stoneman', call: '얘, 어디 가는 길이니?', goal: '돌 나르는 일꾼이 부른다. 가 보렴.', holds: '물 주머니: 소라가 들고 있음',
          lines: ['출발선에 간다고? 그럼 이리 오렴.', '풀 둑을 따라 돌아가면 달리기 터란다.', '여보시오, 이 아이는 둑길로 보내겠소!'],
          after: [{ who: 'keeper', line: '둑길이라면 가도 좋다.' }],
          sora: '풀 둑을 따라가면 된대! 가자!',
        },
        {
          who: 'koroibos', goal: '출발선의 코로이보스에게 물 주머니를 전하렴.', holds: '물 주머니: 소라가 들고 있음',
          lines: ['오, 내 물 주머니로구나. 한참 찾았단다.'],
          choice: {
            ask: '물 주머니를 건네며 뭐라고 할까?',
            options: [
              { id: 'E1', label: '"빵 굽는 아주머니가 보냈어요"', sora: '천막의 빵 굽는 아주머니가 보내셨어요.', says: '이제 살았구나. 고맙다, 얘야.' },
              { id: 'E2', label: '"꼭 이기세요"', sora: '물 드시고 꼭 이기세요!', says: '하하, 힘이 솟는구나. 힘껏 달려 보마.' },
            ],
          },
          errand: 'gave',
        },
        {
          who: 'koroibos', show: true, goal: '달리기가 시작된다. 둑에서 지켜보렴.',
          lines: ['이제 달릴 차례란다. 저 끝까지 딱 한 번이지.', '풀 둑에서 잘 보렴. 다녀오마!'],
          sora: '일등이야! 나뭇가지 관을 받았어!',
          errand: 'saw',
        },
      ],
      asides: [
        { who: 'baker', when: ['S1', 'S2', 'S3', 'S4'], lines: ['코로이보스는 출발선에 있을 거란다.', '제단을 지나면 달리기 터가 나오지.'] },
        { who: 'baker', when: ['S5'], lines: ['전해 주었구나. 고맙다, 얘야.', '그 사람이 이겼다고? 빵을 더 구워야겠네.'] },
      ],
      done: '물 주머니를 전하고, 코로이보스가 나뭇가지 관을 받는 것을 보았다.',
    },
    errands: [
      { id: 'took', text: '물 주머니를 받는다.', at: [] },
      { id: 'gave', text: '코로이보스에게 물 주머니를 전한다.', at: [] },
      { id: 'saw', text: '첫 올림피아 달리기를 본다.', at: [] },
    ],
    reply: '경기라고는 달리기 하나뿐이었단다. 너도 숨이 차지 않더냐.',
  },
  // Persepolis about 518 BC, a spring morning: Darius has begun to build the palace on its
  // terrace. Drawn as a knotted carpet like the one from the Pazyryk tomb (the user's choice
  // of five tries: the fifth). The pictures are in persepolis518; the try itself is the
  // third scene (before the great stair), and the envoys' camp and the stone yard were
  // ordered after it. The woven sky is a deep blue: no `pale`.
  // Looked up on 2026.10.14 and found so: Darius I began the palace about 518 BC (some say
  // 515) and the kings after him built on; the great hall was begun by Darius and finished
  // under Xerxes; on the side walls of its stairs the envoys of twenty-three lands are
  // carved, each in the dress of his land and bearing gifts (not there yet in 518: the
  // carver only draws the lines, and only grandmother's slip says what was carved later);
  // the clay tablets from the palace are accounts of grain given out to workers, and paid
  // and bound workers were mixed (the screen says only that grain was had for work done);
  // the hall had 72 columns, 20 → 25 m high by different sources ("어른 키의 열 배도 넘는다").
  // From memory: the capital of two bulls back to back with the beam between them; that
  // envoys came with gifts at the new year in spring; the king's road and its houses where
  // riders changed horses; craftsmen from over the western sea (Ionia) and from Egypt
  // (Egyptians at the wood); columns built of drum-shaped blocks; that a carving was first
  // drawn on the stone in red lines; the low wide steps; the parasol held over the king;
  // gold armlets and camels among the gifts; flat bread and pomegranates; the dress; that
  // writing was pressed into wet clay with a reed.
  // Made up: the errand of the gold armlet, the envoy (his land is not named), the foreman
  // who lets no one by while a column is raised, the scribe who shows the way past the
  // grain, the doorkeeper of the stair, every other person; and that a column of the hall
  // was being raised and the stair wall drawn in the very first years.
  // Kept out: the fire of later years and war; nobody says there were no slaves; wine.
  // Darius is not spoken to: he is a far-off spot at the right end of the third scene.
  persepolis: {
    first: '다리우스 임금이 새 궁을 짓기 시작한 무렵이란다. 금 팔찌를 전해 주렴.',
    intro: { title: '페르시아 사람들', text: '아주 넓은 땅의 여러 나라를 다스린 사람들이란다. 임금의 길로 먼 곳까지 소식을 날랐지.' },
    dir: 'persepolis518', look: 'paper',
    // (What is said of today: from memory, 2026.10.14, but for what docs/신기한-사실.md has as found.)
    now: {
      photo: 'photo-now.webp', name: '페르세폴리스 큰 계단의 지금 모습', when: '이란 페르세폴리스 · 오늘날',
      text: [
        '큰 계단 옆벽에는 23개국의 사신이 저마다 제 나라 옷을 입고 선물을 든 모습이 새겨져 있습니다.',
        '1930년부터 미국 시카고 대학의 학자들이 여덟 해 동안 이곳을 발굴했습니다. 흙에 묻혀 있던 계단 조각도 이때 드러났습니다.',
        '발굴 때 성벽 안의 작은 방에서 글씨를 새긴 흙판 수만 장이 나왔습니다. 일꾼과 여행자에게 먹을 것을 나누어 준 기록입니다.',
        '"모든 나라의 문" 돌에는 뒷날 찾아온 여행자들이 새긴 이름이 남아 있습니다. 1870년에 미국 신문 기자 헨리 스탠리가 새긴 이름도 있는데, 그는 이듬해 아프리카에서 소식이 끊긴 탐험가 리빙스턴을 찾아내 이름을 떨쳤습니다.',
        '1971년에 이란은 페르시아 제국이 선 지 2,500년을 기리는 큰 잔치를 이곳에서 열었습니다. 1979년에는 유네스코 세계유산이 되었습니다.',
      ],
      credit: '사진: A.Davey, 위키미디어 공용, CC BY 2.0',
    },
    drawn: '옛 양탄자처럼, 붉고 푸른 실로 짠 듯이 그렸단다.',
    scenes: [
      {
        id: 'camp', name: '페르시아 페르세폴리스 사신들의 천막 터', short: '사신들의 천막 터', zoom: 1.107, ground: 0.738, scale: 0.648, air: 'market', floor: 'dirt',
        sora: '천막이 줄무늬야! 짐도 많아.',
        people: [
          { id: 'camelboy', pass: '휴, 짐이 끝이 없네.', name: '낙타 모는 아이', x: 0.18, w: 119, h: 303, lines: ['이 짐은 다 낙타가 지고 왔어.', '먼 길에는 낙타가 으뜸이야.'] },
          { id: 'baker', pass: '갓 구운 빵이 나왔단다.', show: 'bread', name: '빵 굽는 아주머니', x: 0.29, w: 127, h: 303, lines: ['화덕 벽에 붙여 구운 납작 빵이란다.', '석류도 잘 익었지. 먹어 보련?'],
            try: { id: 'eat-pomegranate', verb: 'eat', name: '석류와 납작 빵', face: 'yum', sora: '석류알이 톡톡 터져! 새콤해.' } },
          { id: 'envoy', pass: '누가 좀 전해 주면 좋으련만.', name: '먼 나라 사신', x: 0.4, w: 114, h: 320, lines: ['나는 먼 나라에서 온 사신이란다.', '임금님께 올릴 선물을 싣고 왔지.'] },
          { id: 'courier', pass: '다음 소식은 어디로 가나.', name: '임금의 길 파발꾼', x: 0.51, w: 111, h: 319, lines: ['임금의 길에는 쉬어 가는 집이 있단다.', '거기서 말을 바꿔 타고 소식을 나르지.'] },
          { id: 'robemaker', pass: '주름을 곱게 잡아야지.', name: '옷 짓는 아주머니', x: 0.62, w: 130, h: 306, lines: ['페르시아 사람은 주름진 긴 옷을 입는단다.', '아이 것도 있어. 입어 보련?'],
            try: { id: 'wear-persia', verb: 'wear', name: '페르시아의 옷', outfit: 'persia', sora: '소매가 날개처럼 넓어!', memo: '주름을 넉넉히 잡은 긴 옷에 띠를 맸단다. 소매가 넓게 늘어졌지.' } },
          { id: 'ionian', pass: '오늘은 어느 돌을 깎나.', name: '바다 건너온 석수', x: 0.73, w: 138, h: 315, lines: ['나는 서쪽 바다 건너에서 왔단다.', '돌 깎는 솜씨가 있어 여기서 일하지.'] },
          { id: 'giftkeeper', pass: '하나라도 없어지면 큰일이지.', name: '선물 지키는 아저씨', x: 0.85, w: 125, h: 310, lines: ['나라마다 제 땅의 귀한 것을 가져온단다.', '봄의 새해에 임금님께 올린다고들 하지.'] },
        ],
        spots: [],
      },
      {
        id: 'yard', name: '페르시아 페르세폴리스 돌 깎는 마당', short: '돌 깎는 마당', zoom: 1.112, ground: 0.734, scale: 0.651, air: 'chisels',
        sora: '온통 돌 쪼는 소리야!',
        people: [
          { id: 'mason', pass: '뿔은 살살 쪼아야 해.', show: 'capital', pose: 'see-wow', sora: '기둥머리에 황소 둘이 등을 맞댔어!', memo: '기둥 꼭대기에 황소 두 마리를 얹었단다. 그 등 사이에 지붕의 들보를 걸쳤지.', name: '기둥머리 깎는 석수', x: 0.18, w: 125, h: 269, lines: ['기둥 꼭대기에 얹을 황소란다.', '두 마리가 등을 맞대고 지붕을 받치지.'] },
          { id: 'watergirl', pass: '물이요, 시원한 물!', name: '물 나르는 아이', x: 0.29, w: 101, h: 242, lines: ['돌 깎는 아저씨들은 목이 금방 말라.', '그래서 하루에도 몇 번씩 물을 날라.'] },
          { id: 'measurer', pass: '한 되, 두 되, 석 되.', show: 'tablet', pose: 'see-aha', sora: '진흙판에 꾹꾹 눌러 글을 적었어!', memo: '궁에서 나온 진흙 판은 일꾼에게 나눠 준 곡식을 적은 장부란다.', name: '곡식 되는 아저씨', x: 0.4, w: 147, h: 267, lines: ['여기서는 일한 만큼 곡식을 받는단다.', '누가 얼마 받았는지 진흙 판에 적어 두지.'] },
          { id: 'scribe', pass: '어디 보자, 오늘 몫이…', name: '장부 적는 서기', x: 0.51, w: 134, h: 269, lines: ['나는 젖은 진흙에 글을 눌러 쓴단다.', '마르면 단단해져서 오래 남지.'] },
          { id: 'carpenter', pass: '비계가 튼튼해야 하지.', name: '이집트에서 온 목수', x: 0.62, w: 157, h: 320, lines: ['나는 이집트에서 온 목수란다.', '나무를 엮어 높은 비계를 짜지.'] },
          { id: 'polisher', pass: '돌을 틈이 없게 쓱쓱 다듬어야지.', name: '돌 다듬는 일꾼', x: 0.73, w: 103, h: 262, lines: ['기둥은 북 같은 돌 토막을 쌓아 세운단다.', '이은 틈이 안 보이게 매끈히 갈지.'] },
          { id: 'foreman', pass: '밧줄 당겨라, 천천히!', name: '돌 마당의 우두머리', x: 0.85, w: 135, h: 305, lines: ['나는 이 돌 마당을 맡은 사람이란다.', '기둥 하나 세우는 데 여럿이 매달리지.'] },
        ],
        spots: [],
      },
      {
        id: 'stairs', name: '페르시아 페르세폴리스 큰 계단 앞', short: '큰 계단 앞', zoom: 1.111, ground: 0.735, scale: 0.650, air: 'hush',
        sora: '기둥 위에 황소가 있어!',
        people: [
          { id: 'counter', pass: '그릇 넷, 항아리 셋…', name: '선물 세는 관리', x: 0.18, w: 86, h: 231, lines: ['사신들의 선물을 하나하나 센단다.', '금 그릇, 고운 천, 큰 항아리가 왔지.'] },
          { id: 'ropeman', pass: '영차, 밧줄이 무겁네.', name: '밧줄 감는 일꾼', x: 0.29, w: 82, h: 228, lines: ['돌을 끌어 올리는 굵은 밧줄이란다.', '여럿이 한꺼번에 당겨야 움직이지.'] },
          { id: 'gazer', pass: '우아, 끝이 안 보여.', show: 'column', pose: 'see-wow', sora: '기둥이 높아서 고개가 뒤로 넘어가!', memo: '큰 방의 기둥은 어른 키의 열 배도 넘었단다. 그런 기둥을 일흔두 개 세웠지.', name: '기둥 올려다보는 아이', x: 0.4, w: 77, h: 174, lines: ['저 기둥 좀 봐. 하늘에 닿겠어!', '꼭대기에 황소가 앉아 있어.'] },
          { id: 'sweeper', pass: '돌가루가 또 쌓였구먼.', name: '계단 쓰는 할아버지', x: 0.51, w: 93, h: 199, lines: ['이 계단은 낮고 넓게 놓았단다.', '긴 옷을 입고도 오르기 쉽지.'] },
          { id: 'carver', pass: '금이 곧아야 하는데.', show: 'lines', pose: 'see-aha', sora: '사신들이 줄을 섰어!', memo: '뒷날 계단 벽에 스물세 나라의 사신이 새겨졌단다. 저마다 제 나라 옷을 입었지.', name: '돌 새기는 이', x: 0.62, w: 82, h: 222, lines: ['돌에 새기기 전에 금부터 긋는단다.', '금이 비뚤면 새김도 비뚤어지지.'] },
          { id: 'doorkeeper', pass: '올릴 것은 내게 맡기시오.', name: '계단의 문지기', x: 0.73, w: 108, h: 261, lines: ['나는 이 계단을 지키는 사람이란다.', '임금님께 올릴 것은 내가 받아 두지.'] },
          { id: 'parasol', pass: '바람에 날리면 안 되는데.', name: '햇빛 가리개 든 시종', x: 0.85, w: 109, h: 320, lines: ['임금님 머리 위에 받치는 가리개란다.', '임금님은 저 위 돌단을 둘러보고 계시지.'] },
        ],
        spots: [
          { id: 'darius', from: 0.9, to: 0.99, sora: '저 위에 임금님이 계신대!', memo: '이 궁을 짓게 한 임금이 다리우스란다. 뒤의 임금들이 이어서 지었지.' },
        ],
      },
    ],
    // "The gold armlet for the king" (core/tale.js; the storyboard of docs/신기한-사실.md): an
    // envoy from a far land at the camp has a gold armlet for the king and must unload his
    // camels; the foreman of the stone yard lets no one by, for a great column is being
    // raised; the scribe of the accounts shows her the way past the place where grain is
    // given out; she hands it to the doorkeeper of the stair, choosing what to say; and she
    // sees the carver draw on the side wall of the stair the row of envoys bearing gifts.
    tale: {
      thing: true,
      ask: '계단 벽에는 무엇을 새길까?',
      gate: { scene: 'yard', open: 3, sora: '우두머리가 막고 있어. 못 가.' },
      steps: [
        {
          who: 'envoy', goal: '천막 터의 먼 나라 사신에게 가 보렴.', holds: '금 팔찌: 사신이 들고 있음',
          lines: ['얘야, 부탁 하나 들어주련?', '임금님께 올릴 금 팔찌란다. 나는 낙타 짐을 풀어야 하지.', '큰 계단의 문지기에게 전해 주렴.'],
          offer: { ask: '금 팔찌를 전해 줄까?', label: '내가 전해 줄게요' },
          errand: 'took',
        },
        {
          who: 'foreman', goal: '돌 깎는 마당을 지나 큰 계단으로 가 보렴.', holds: '금 팔찌: 소라가 들고 있음',
          lines: ['멈춰라. 지금은 못 지나간단다.', '큰 기둥을 세우는 중이야. 밧줄 밑은 위험하지.'],
          sora: '문지기한테 가야 하는데… 어? 누가 불러!',
        },
        {
          who: 'scribe', call: '얘, 어디로 가는 길이니?', goal: '장부 적는 서기가 부른다. 가 보렴.', holds: '금 팔찌: 소라가 들고 있음',
          lines: ['계단의 문지기에게 간다고? 그럼 이리 오렴.', '곡식 나눠 주는 곳을 지나면 계단이 나온단다.', '우두머리, 이 아이는 곡식 자루 쪽으로 보내겠소!'],
          after: [{ who: 'foreman', line: '그쪽 길이라면 괜찮다. 조심해서 가렴.' }],
          sora: '곡식 자루 사이로 가면 된대! 가자!',
        },
        {
          who: 'doorkeeper', goal: '큰 계단의 문지기에게 금 팔찌를 전하렴.', holds: '금 팔찌: 소라가 들고 있음',
          lines: ['거기 서거라. 손에 든 것이 무엇이냐?'],
          choice: {
            ask: '금 팔찌를 건네며 뭐라고 할까?',
            options: [
              { id: 'E1', label: '"사신이 보냈어요"', sora: '먼 나라 사신 아저씨가 임금님께 올린대요.', says: '잘 받았다. 임금님께 꼭 올리마.' },
              { id: 'E2', label: '"벽에 뭘 그려요?"', sora: '저기 계단 벽에는 뭘 그리는 거예요?', says: '가서 보렴. 돌 새기는 이가 일러 줄 게다.' },
            ],
          },
          errand: 'gave',
        },
        {
          who: 'carver', show: true, goal: '돌 새기는 이가 긋는 금을 보렴.',
          lines: ['이 벽에 선물 든 사신들을 새길 거란다.', '먼저 붉은 금으로 줄을 긋지. 너도 보렴.'],
          sora: '사신들이 줄을 섰어! 팔찌 든 사람도 있어!',
          errand: 'saw',
        },
      ],
      asides: [
        { who: 'envoy', when: ['S1', 'S2', 'S3', 'S4'], lines: ['큰 계단은 돌 마당을 지나면 있단다.', '문지기는 계단 아래에 서 있지.'] },
        { who: 'envoy', when: ['S5'], lines: ['전해 주었구나. 고맙다, 얘야.', '이제 마음 놓고 짐을 풀겠구나.'] },
      ],
      done: '금 팔찌를 전하고, 계단 벽에 긋는 사신들의 줄을 보았다.',
    },
    errands: [
      { id: 'took', text: '금 팔찌를 받는다.', at: [] },
      { id: 'gave', text: '문지기에게 금 팔찌를 전한다.', at: [] },
      { id: 'saw', text: '계단 벽에 긋는 금을 본다.', at: [] },
    ],
    reply: '그 금을 따라 새긴 사신들이 지금도 계단 벽에 서 있단다.',
  },
  // Alexandria about 280 BC, by day: the lighthouse on the island of Pharos is finished.
  // Drawn as a painting on an Egyptian papyrus roll (the user's choice of five tries: the
  // second). The pictures are in pharos280; the try itself is the first scene (the quay of
  // the great harbour), and the street before the library and the causeway were ordered
  // after it. The sky of the pictures is flat red ochre, not pale paper: no `pale`.
  // The day is not on record. It is day in all three scenes, and nobody says there is a fire
  // or a mirror on the top: that is said to be of Roman times. By day the tower is a mark
  // seen from far out at sea.
  // Looked up on 2026.10.14 and found so: begun under Ptolemy I and finished under Ptolemy
  // II, about 280 BC; twelve years in the building; three tiers, the lowest square, the
  // middle eight-sided, the top round; at least 100 metres high ("백 미터도 넘게");
  // Sostratus of Cnidus is said to have built it ("지었다고들 하지"); the great library and
  // the house of scholars were at Alexandria.
  // From memory: that the books of ships entering the harbour were copied for the library
  // (told as "전한단다"); that books were rolls of papyrus, made of strips of the reed laid
  // crosswise, pressed and dried; reed pens and ink of soot; that a roll is read sideways;
  // that the island was joined to the land by a long causeway with a harbour on each side;
  // that the coast of Egypt is low and flat, so the tower helped ships find the harbour;
  // that Egypt sent wheat abroad by ship; dates, flat bread and grilled fish; the dress;
  // that Greeks founded the city on the coast of Egypt and lived there beside Egyptians;
  // that the lighthouse stood for more than a thousand years (grandmother's reply).
  // Made up: the errand of the roll, the captain, the doorkeeper, the papyrus-seller who
  // knows where the keeper of books has gone, the keeper of books and that he went out to
  // see the tower, every other person, and that the tower was finished on this very day.
  // Kept out: the burning of the library; Euclid and Eratosthenes (their years were not
  // looked up); the king.
  pharos: {
    first: '파로스 섬의 등대를 다 지은 날이란다. 두루마리를 전해 주렴.',
    intro: { title: '알렉산드리아 사람들', text: '알렉산드리아는 그리스 사람들이 이집트 바닷가에 세운 도시란다. 그리스 사람과 이집트 사람이 섞여 살았지.' },
    dir: 'pharos280', look: 'paper',
    // (What is said of today: from memory, 2026.10.14, but for what docs/신기한-사실.md has as found.)
    now: {
      photo: 'photo-now.webp', name: '등대 자리에 선 성채', when: '이집트 알렉산드리아 · 카이트베이 성채',
      text: [
        '등대는 여러 번의 지진으로 조금씩 부서지다가 14세기에 무너졌습니다. 지금 땅 위에는 등대가 남아 있지 않습니다.',
        '1477년, 이집트의 술탄 카이트베이가 등대 자리에 이 성채를 짓기 시작해 1479년에 마쳤습니다. 등대의 돌을 가져다 썼다고 전합니다.',
        '1882년, 영국 함대가 알렉산드리아를 포격해 성채가 크게 부서졌습니다. 그 뒤 여러 번 고쳤고, 1984년에 가장 크게 손보았습니다.',
        '성채 앞바다 밑에는 등대의 큰 돌과 조각상이 흩어져 있습니다. 1994년부터 프랑스 학자들이 물속에 들어가 이것들을 조사하고 있습니다.',
        '2025년 7월, 학자들은 등대 입구의 문틀과 기둥이던 큰 돌 22개를 바다에서 건져 올렸습니다. 이 돌들로 컴퓨터 속에서 등대를 다시 지어 볼 계획입니다.',
        '성채 안에는 바다 박물관이 있습니다. 2025년에는 등대와 옛 항구 이야기를 알려 주는 안내관도 문을 열었습니다.',
      ],
      credit: '사진: Argenberg, 위키미디어 공용, CC BY 2.0',
    },
    drawn: '옛 이집트의 파피루스 두루마리 그림처럼 그렸단다.',
    scenes: [
      {
        id: 'harbor', name: '이집트 알렉산드리아 큰 항구 부두', short: '큰 항구 부두', zoom: 1.045, ground: 0.786, scale: 0.611, air: 'market', floor: 'dirt',
        sora: '바다 건너에 높은 탑이 있어!',
        people: [
          { id: 'tally', pass: '자루가 서른, 항아리가 열둘.', name: '짐 적는 서기', x: 0.18, w: 112, h: 312, lines: ['배에 실린 짐을 하나하나 적는단다.', '선반의 두루마리가 다 그런 장부지.'] },
          { id: 'fishwife', pass: '갓 구운 생선이오!', show: 'meal', name: '생선 굽는 아주머니', x: 0.29, w: 139, h: 300, lines: ['오늘 아침에 잡은 생선이란다.', '납작 빵에 얹어 먹어 보련?'],
            try: { id: 'eat-fish', verb: 'eat', name: '구운 생선과 납작 빵', face: 'yum', sora: '생선은 고소하고 대추야자는 달아!' } },
          { id: 'sailmender', pass: '돛을 한 땀씩 꿰매야지.', name: '돛 깁는 뱃사람', x: 0.4, w: 108, h: 317, lines: ['우리 배는 돛에 바람을 받아 간단다.', '찢어진 데는 이렇게 기워야 하지.'] },
          { id: 'captain', pass: '누가 좀 전해 주면 좋으련만.', name: '선장', x: 0.51, w: 107, h: 320, lines: ['먼 바다를 건너 막 닿았단다.', '저 높은 탑을 보고 항구를 찾았지.'] },
          { id: 'porter', pass: '영차, 자루 나간다!', name: '짐꾼', x: 0.62, w: 148, h: 310, lines: ['큰 강가의 밭에서 거둔 밀이란다.', '배에 실어 먼 나라로 보내지.'] },
          { id: 'clothier', pass: '시원한 아마포 옷 보고 가요.', name: '옷 파는 아주머니', x: 0.73, w: 119, h: 311, lines: ['더운 곳이라 얇은 옷을 입는단다.', '아이 것도 있어. 입어 보련?'],
            try: { id: 'wear-alexandria', verb: 'wear', name: '알렉산드리아의 옷', outfit: 'alexandria', sora: '얇아서 바람이 솔솔 들어와!', memo: '긴 천을 어깨에서 핀으로 여미고 허리띠를 맸단다. 그 위에 겉천을 둘렀지.' } },
          { id: 'oldsailor', pass: '오늘은 바다가 잔잔하구먼.', show: 'far', pose: 'see-wow', sora: '탑만 우뚝 솟았어!', memo: '이집트의 바닷가는 낮고 평평해서 항구를 찾기 어려웠단다. 높은 등대가 낮에도 멀리서 보였지.', name: '바다 보는 늙은 뱃사람', x: 0.85, w: 149, h: 312, lines: ['이 바닷가는 낮고 평평하단다.', '이제는 저 탑을 보고 항구를 찾지.'] },
        ],
        spots: [
          // The lighthouse far over the water in the try. (From and to are to be set to the picture.)
          { id: 'tower', from: 0.8, to: 0.95, sora: '저 탑이 등대야?', memo: '그래, 파로스 섬 끝에 세운 등대란다. 열두 해 만에 다 지었지.' },
        ],
      },
      {
        id: 'library', name: '이집트 알렉산드리아 도서관 앞 길', short: '도서관 앞 길', zoom: 1.088, ground: 0.753, scale: 0.637, air: 'hush', floor: 'dirt',
        sora: '두루마리가 잔뜩 있어!',
        people: [
          { id: 'papermaker', pass: '꾹꾹 눌러서 말려야지.', show: 'papyrus', pose: 'see-aha', sora: '풀 줄기를 겹쳐서 만들어!', memo: '종이가 없던 때라 파피루스에 글을 썼단다. 물가에 자라는 풀 줄기를 저며서 만들었지.', name: '파피루스 만드는 아저씨', x: 0.18, w: 116, h: 292, lines: ['물가의 풀 줄기를 얇게 저민단다.', '가로세로로 겹쳐 눌러 말리면 한 장이지.'] },
          { id: 'inkboy', pass: '쓱쓱, 먹이 다 됐다.', name: '먹 가는 아이', x: 0.29, w: 81, h: 235, lines: ['그을음을 개어서 먹을 만들어.', '갈대 펜에 찍어서 글을 써.'] },
          { id: 'seller', pass: '새 두루마리 들어왔어요.', name: '파피루스 파는 아주머니', x: 0.4, w: 133, h: 287, lines: ['글을 쓸 파피루스를 판단다.', '도서관 사람들이 날마다 사 가지.'] },
          { id: 'scholar', pass: '이 줄을 다시 읽어 보자.', name: '먼 도시에서 온 학자', x: 0.51, w: 128, h: 302, lines: ['이 도시에는 학자들의 집이 있단다.', '여러 곳에서 공부하러 모여들지.'] },
          { id: 'copyist', pass: '한 줄도 빠뜨리면 안 되지.', show: 'copy', pose: 'see-aha', sora: '똑같이 한 벌 더 쓰네!', memo: '항구에 들어온 배의 책을 도서관에서 베껴 두었다고 전한단다. 그렇게 책을 모았지.', name: '베껴 쓰는 서기', x: 0.62, w: 106, h: 276, lines: ['배에 실려 온 책을 베껴 쓴단다.', '똑같은 것을 한 벌 더 만들지.'] },
          { id: 'rollgirl', pass: '두루마리를 떨어뜨리면 안 돼.', name: '두루마리 나르는 아이', x: 0.73, w: 90, h: 224, lines: ['책은 이렇게 돌돌 말아 둬.', '읽을 때는 옆으로 펴면서 읽어.'] },
          { id: 'doorkeeper', pass: '쉿, 안에서 글을 쓰는 중이다.', name: '도서관 문지기', x: 0.85, w: 131, h: 320, lines: ['여기는 임금님의 큰 도서관이란다.', '세상의 책을 모으는 곳이지.'] },
        ],
        spots: [],
      },
      {
        id: 'causeway', name: '이집트 알렉산드리아 등대 둑길', short: '등대 둑길', zoom: 1.045, ground: 0.786, scale: 0.611, air: 'hush', floor: 'dirt',
        sora: '길 양쪽이 다 바다야!',
        people: [
          { id: 'angler', pass: '쉿, 고기 달아난다.', name: '낚시하는 할아버지', x: 0.18, w: 164, h: 320, lines: ['이 둑길은 섬까지 이어진단다.', '길 양쪽이 다 항구라 배가 많지.'] },
          { id: 'mason', pass: '허허, 다 지었구먼.', name: '돌 다듬던 석공', x: 0.29, w: 124, h: 270, lines: ['열두 해 동안 돌을 쌓아 올렸단다.', '소스트라토스 어른이 지었다고들 하지.'] },
          { id: 'counter', pass: '층이 하나, 둘, 셋이나 돼!', name: '층을 세는 아이', x: 0.4, w: 88, h: 210, lines: ['아래는 네모, 가운데는 여덟 모야.', '맨 위는 둥글어. 모두 세 층이야!'] },
          { id: 'waterwife', pass: '시원한 물이오, 물!', name: '물 파는 아주머니', x: 0.51, w: 125, h: 278, lines: ['둑길이 길어서 목이 마르단다.', '섬까지는 한참을 걸어야 하지.'] },
          { id: 'keeper', pass: '참으로 높이도 쌓았구나.', show: 'pharos', pose: 'see-wow', sora: '세 층이야! 정말 높다!', memo: '등대는 세 층이었단다. 아래는 네모, 가운데는 여덟 모, 위는 둥글었지. 높이는 백 미터도 넘었단다.', name: '책 맡는 이', x: 0.62, w: 122, h: 273, lines: ['나는 도서관의 책을 맡은 사람이란다.', '다 지은 등대를 보러 나왔지.'] },
          { id: 'visitor', pass: '허어, 목이 다 아프오.', name: '먼 나라 손님', x: 0.73, w: 107, h: 279, lines: ['바다 건너에서 이 탑을 보러 왔다오.', '이렇게 높은 것은 처음 보오.'] },
          { id: 'towerhand', pass: '밧줄도 이제 다 걷었네.', name: '등대 일꾼', x: 0.85, w: 117, h: 266, lines: ['꼭대기까지 오르려면 한참 걸린단다.', '위에 서면 먼바다의 배가 다 보이지.'] },
        ],
        spots: [],
      },
    ],
    // "The roll from the ship" (core/tale.js; the storyboard of docs/신기한-사실.md): the
    // captain of a ship just come to the quay has a roll for the library and cannot leave
    // his ship; the doorkeeper of the library lets no one in, for they are copying; the
    // papyrus-seller says the keeper of books is out on the causeway to the lighthouse; she
    // hands the roll to him, choosing what to say; and at the end of the causeway she looks
    // up at the lighthouse in its three tiers. No fire: it is day.
    tale: {
      thing: true,
      ask: '다 지은 등대는 어떤 모습일까?',
      gate: { scene: 'library', open: 3, sora: '문지기가 길을 막고 있어. 못 가.' },
      steps: [
        {
          who: 'captain', goal: '큰 항구 부두의 선장에게 가 보렴.', holds: '두루마리: 선장이 들고 있음',
          lines: ['얘야, 부탁 하나 들어주련?', '배에 싣고 온 두루마리란다. 나는 배를 못 비우지.', '도서관의 책 맡는 이에게 전해 주렴.'],
          offer: { ask: '두루마리를 전해 줄까?', label: '내가 전해 줄게요' },
          errand: 'took',
        },
        {
          who: 'doorkeeper', goal: '길 끝의 도서관 문으로 가 보렴.', holds: '두루마리: 소라가 들고 있음',
          lines: ['멈춰라. 지금은 못 들어간단다.', '안에서 책을 베끼는 중이라 아무도 못 들어가.'],
          sora: '두루마리를 전해야 하는데… 어? 누가 불러!',
        },
        {
          who: 'seller', call: '얘, 누구를 찾니?', goal: '파피루스 파는 아주머니가 부른다. 가 보렴.', holds: '두루마리: 소라가 들고 있음',
          lines: ['책 맡는 이를 찾는다고? 안에는 안 계신단다.', '다 지은 등대를 보러 둑길에 나가셨지.', '문지기 양반, 이 아이는 둑길로 보낼게요!'],
          after: [{ who: 'doorkeeper', line: '둑길이라면 저 옆길로 가렴.' }],
          sora: '둑길에 계신대! 가자!',
        },
        {
          who: 'keeper', goal: '둑길의 책 맡는 이에게 두루마리를 전하렴.', holds: '두루마리: 소라가 들고 있음',
          lines: ['오, 배에서 온 두루마리로구나.'],
          choice: {
            ask: '두루마리를 건네며 뭐라고 할까?',
            options: [
              { id: 'E1', label: '"선장님이 보냈어요"', sora: '부두의 선장님이 보내셨어요.', says: '먼 길을 온 책이구나. 고맙다, 얘야.' },
              { id: 'E2', label: '"이걸로 뭘 해요?"', sora: '이 두루마리로 뭘 하세요?', says: '한 벌 베껴서 도서관에 둔단다.' },
            ],
          },
          errand: 'gave',
        },
        {
          who: 'keeper', show: true, goal: '둑길 끝의 등대를 올려다보렴.',
          lines: ['마침 잘 왔다. 저 등대를 올려다보렴.', '아래는 네모, 가운데는 여덟 모, 위는 둥글단다.'],
          sora: '끝이 안 보여! 정말 높다!',
          errand: 'saw',
        },
      ],
      asides: [
        { who: 'captain', when: ['S1', 'S2', 'S3', 'S4'], lines: ['도서관은 이 길을 따라가면 나온단다.', '기둥이 줄지어 선 큰 집이지.'] },
        { who: 'captain', when: ['S5'], lines: ['전해 주었구나. 고맙다, 얘야.', '등대도 보고 왔니? 참 높지.'] },
      ],
      done: '두루마리를 전하고, 세 층으로 솟은 등대를 올려다보았다.',
    },
    errands: [
      { id: 'took', text: '두루마리를 받는다.', at: [] },
      { id: 'gave', text: '책 맡는 이에게 두루마리를 전한다.', at: [] },
      { id: 'saw', text: '세 층 등대를 올려다본다.', at: [] },
    ],
    reply: '그 등대는 천 년도 넘게 서 있었단다. 목은 아프지 않더냐.',
  },
  // Timbuktu in 1325, by day: the great mud mosque (Djinguereber) is being built. (1327 until
  // 2026.10.19, when the user had it 1325: see the square. The pictures keep the name timbuktu1327.)
  // Drawn as the painted page of a West African manuscript (the user's choice of five tries:
  // the second). The pictures are in timbuktu1327; the try itself is the first scene (the
  // market where the camels come in), and the yard where the mud is trodden and the foot of
  // the mosque wall were ordered after it. The sky of the pictures is a middling blue with
  // pale clouds: no `pale` (to be looked at again once the date is seen over it).
  // The day is not on record. The mosque is seen from outside only, and nobody prays.
  // There was no book market in 1327: the stall with books in the try is the place of a man
  // who teaches letters, and he says his books are not for sale.
  // Looked up on 2026.10.14 and found so: the mosque was built in 1327 on the order of the
  // king of Mali after his journey to Mecca ("임금님이 먼 길에서 돌아와 짓게 하셨다"); it is
  // of earth, straw and wood; it is said that a man from far away built it ("먼 데서 온 어른이
  // 꼴을 잡았다고들 하지": no name); salt from the north was changed for gold from the south;
  // the salt was cut in slabs and a camel carried two; the boats of the Niger met the camels
  // here, at the landing of Kabara ("나루"); the walls of this mosque are plastered anew with
  // mud every year by the people of the town; husks are mixed into its mud; Ibn Battuta was
  // given pounded millet with honey and milk in half a calabash in Mali (1352).
  // Found only for the mud mosque of Djenne, not surely for this one: that the sticks in the
  // walls are footholds for plastering. It is told all the same (the plasterer, the head
  // builder, the fifth step). To be looked at again.
  // From memory: dates and grilled river fish; the dress; writing boards washed clean and
  // written on again, reed pens, ink of soot; mud left to stand some days before it is used;
  // bricks shaped in a frame and dried in the sun; palm wood; that rain washes the mud away
  // (so the people of 1327 say "해마다 덧발라야" as those of today do); that the mosque has
  // stood for seven hundred years (grandmother's reply, as the square's reply says).
  // Made up: the errand of the lump of salt and the builders' soup, the camel driver, the man
  // treading mud, the child with the writing board, the head builder, every other person.
  // Kept out: the inside of the mosque and prayer; the buying and selling of people; Mansa
  // Musa himself; gold dust thrown about; the name of al-Sahili and the weight of his gold.
  timbuktu: {
    first: '팀북투에 큰 진흙 모스크를 짓는 해란다. 소금 덩이를 전해 주렴.',
    intro: { title: '팀북투 사람들', text: '팀북투는 사막 끝, 큰 강 가까이에 있는 말리의 도시란다. 낙타와 배가 만나 소금과 금을 바꾸었지.' },
    dir: 'timbuktu1327', look: 'paper',
    // (What is said of today: looked up on 2026.10.14, in docs/신기한-사실.md; the picture chosen by the user.)
    now: {
      photo: 'photo-now.webp', name: '징게레베르 모스크의 지금 모습', when: '말리 팀북투 · 오늘날',
      text: [
        '흙과 짚과 나무로 지은 징게레베르 모스크는 지금도 사람들이 모여 기도하는 곳으로 쓰입니다.',
        '뒷날 이 땅을 다스린 송가이 왕국 때, 판관 아키브가 1570년부터 모스크를 크게 고쳐 지었습니다.',
        '모스크에는 안뜰 3개와 뾰족탑 2개가 있고, 한 번에 2,000명쯤이 들어가 기도할 수 있습니다.',
        '1988년, 팀북투의 옛 모스크 세 곳이 함께 유네스코 세계유산이 되었습니다.',
        '2012년에 무장한 무리가 도시를 차지하고 모스크 곁의 무덤 2곳을 부수었습니다. 부서진 무덤들은 2014년부터 다시 지었습니다.',
        '2006년부터 아가 칸 문화재단이 물이 새던 지붕과 벽을 고쳤습니다. 2025년 10월에도 마을 사람 수백 명이 모여 벽을 새로 발랐습니다.',
      ],
      credit: '사진: Ousmane Garba Kounta, 위키미디어 공용, CC BY-SA 4.0',
    },
    drawn: '서아프리카의 손으로 쓴 옛 책의 장식 그림처럼 그렸단다.',
    scenes: [
      {
        id: 'market', name: '말리 팀북투 낙타 닿은 장터', short: '낙타 닿은 장터', zoom: 1.073, ground: 0.764, scale: 0.628, air: 'market', floor: 'dirt',
        sora: '집이 다 흙이야! 탑도 흙이야!',
        people: [
          { id: 'cameleer', pass: '누가 좀 전해 주면 좋으련만.', name: '낙타 몰이꾼', x: 0.18, w: 100, h: 308, lines: ['사막을 건너 막 닿았단다.', '소금 판을 지고 여러 날을 걸었지.'] },
          { id: 'saltseller', pass: '사막에서 온 소금이오!', show: 'salt', pose: 'see-aha', sora: '소금이 널빤지 같아!', memo: '북쪽 사막에서 소금을 판으로 떼어 왔단다. 낙타 한 마리가 두 판을 졌지.', name: '소금 장수', x: 0.29, w: 115, h: 302, lines: ['소금을 넓적한 판으로 떼어 온단다.', '낙타 한 마리에 두 판씩 싣지.'] },
          { id: 'goldman', pass: '저울 눈금을 잘 봐야지.', name: '금 바꾸러 온 상인', x: 0.4, w: 104, h: 302, lines: ['남쪽에서 금을 가지고 왔단다.', '여기서 사막의 소금과 바꾸지.'] },
          { id: 'teacher', pass: '한 줄씩 또박또박 읽어 보렴.', show: 'board', pose: 'see-aha', sora: '나무판이 공책이야!', memo: '아이들은 나무판에 글씨를 배웠단다. 다 익히면 물로 씻고 또 썼지.', name: '글 가르치는 이', x: 0.51, w: 108, h: 307, lines: ['아이들에게 글씨를 가르친단다.', '이 책은 파는 게 아니야. 내가 읽지.'] },
          { id: 'cook', pass: '따끈한 죽 들고 가요!', show: 'porridge', name: '죽 파는 아주머니', x: 0.62, w: 112, h: 299, lines: ['기장을 찧어 끓인 죽이란다.', '꿀을 얹었어. 먹어 보련?'],
            try: { id: 'eat-porridge', verb: 'eat', name: '기장 죽과 대추야자', face: 'yum', sora: '꿀이 달아! 죽은 고소해.' } },
          { id: 'clothier', pass: '바람 잘 드는 무명옷이오.', name: '옷 파는 아주머니', x: 0.73, w: 108, h: 302, lines: ['더운 곳이라 품이 넓은 옷을 입지.', '아이 것도 있단다. 입어 보련?'],
            try: { id: 'wear-timbuktu', verb: 'wear', name: '팀북투의 옷', outfit: 'timbuktu', sora: '헐렁해서 시원해!', memo: '품이 넓은 무명 긴 옷이란다. 머리에는 천을 둘러 햇볕을 가렸지.' } },
          { id: 'boatman', pass: '강물이 많이 불었구먼.', name: '강에서 온 뱃사공', x: 0.85, w: 127, h: 320, lines: ['나는 큰 강을 배로 오르내린단다.', '나루에서 낙타 짐과 배 짐이 만나지.'] },
        ],
        spots: [
          // The mosque at the right of the try. (From and to are to be set to the picture.)
          { id: 'mosque', from: 0.68, to: 0.98, sora: '벽에 막대가 삐죽삐죽해!', memo: '진흙으로 짓는 큰 모스크란다. 임금이 짓게 했지.' },
        ],
      },
      {
        id: 'yard', name: '말리 팀북투 흙 이기는 마당', short: '흙 이기는 마당', zoom: 1.088, ground: 0.753, scale: 0.637, air: 'hush', floor: 'dirt',
        sora: '흙벽돌이 줄줄이 누워 있어!',
        people: [
          { id: 'watergirl', pass: '물을 흘리면 안 돼!', name: '물 긷는 아이', x: 0.18, w: 96, h: 289, lines: ['흙을 이기려면 물이 많이 들어.', '우물에서 온종일 길어 날라.'] },
          { id: 'huskman', pass: '겨가 한 바구니 더 간다.', show: 'mud', pose: 'see-aha', sora: '흙에 짚을 섞네!', memo: '흙에 짚과 곡식 겨를 섞어 이겼단다. 그래야 말라도 잘 갈라지지 않지.', name: '겨 나르는 아저씨', x: 0.29, w: 119, h: 319, lines: ['흙에 짚과 곡식 겨를 섞는단다.', '그래야 말라도 덜 갈라지지.'] },
          { id: 'learner', pass: '오늘 배운 줄을 또 읽어야지.', name: '글씨 배우는 아이', x: 0.4, w: 119, h: 254, lines: ['이 나무판에 글씨를 써서 배워.', '선생님 자리는 장터에 있어.'] },
          { id: 'brickmaker', pass: '틀에 흙을 꾹꾹 채워서 쏙 빼지.', name: '흙벽돌 찍는 아주머니', x: 0.51, w: 114, h: 312, lines: ['이긴 흙을 나무 틀에 채운단다.', '틀을 빼고 햇볕에 말리면 벽돌이지.'] },
          { id: 'woodman', pass: '이 막대도 벽에 박을 것이지.', name: '나무 막대 다듬는 목수', x: 0.62, w: 113, h: 311, lines: ['야자나무를 팔 길이로 자른단다.', '벽을 쌓을 때 사이사이 박아 넣지.'] },
          { id: 'basketboy', pass: '흙 바구니가 너무 무거워!', name: '흙 바구니 나르는 아이', x: 0.73, w: 104, h: 311, lines: ['이긴 흙을 벽 아래로 날라.', '오늘만 벌써 열 번째야.'] },
          { id: 'treader', pass: '흙을 밟으니 잘 이겨진다.', name: '흙 밟는 일꾼', x: 0.85, w: 130, h: 320, lines: ['발로 밟아야 흙이 차지게 된단다.', '물과 짚이 고루 섞여야 하지.'] },
        ],
        spots: [],
      },
      {
        id: 'wall', name: '말리 팀북투 진흙 모스크 벽 아래', short: '모스크 벽 아래', zoom: 1.137, ground: 0.715, scale: 0.665, air: 'hush', floor: 'dirt',
        sora: '벽이 하늘까지 닿겠어!',
        people: [
          { id: 'elder', pass: '허허, 높이도 올라간다.', name: '구경 온 할아버지', x: 0.18, w: 100, h: 278, lines: ['임금님이 먼 길에서 돌아와 짓게 하셨지.', '먼 데서 온 어른이 꼴을 잡았다고들 하지.'] },
          { id: 'passer', pass: '흙 뭉치 받아요! 하나 더!', name: '흙 뭉치는 일꾼', x: 0.29, w: 90, h: 320, lines: ['흙을 둥글게 뭉쳐서 위로 건넨단다.', '손에서 손으로 꼭대기까지 가지.'] },
          { id: 'plasterer', pass: '손바닥으로 쓱쓱 펴야지.', name: '흙 바르는 일꾼', x: 0.4, w: 98, h: 279, lines: ['벽돌 위에 진흙을 손으로 바른단다.', '저 막대를 딛고 높은 데까지 오르지.'] },
          { id: 'foreman', pass: '저쪽은 한 겹 더 발라야겠군.', show: 'wall', pose: 'see-wow', sora: '일꾼들이 막대를 밟고 올라가!', memo: '이런 흙집은 벽에 박은 나무 막대를 딛고 올라 흙을 바른단다. 비에 씻기면 또 발랐지.', name: '벽 쌓는 우두머리', x: 0.51, w: 108, h: 285, lines: ['흙과 짚과 나무로만 짓는 집이란다.', '비에 씻기니 해마다 덧발라야 하지.'] },
          { id: 'soupwife', pass: '국이 싱거워서 큰일이네.', name: '국 끓이는 아주머니', x: 0.62, w: 109, h: 269, lines: ['일꾼들 저녁 국을 끓인단다.', '땀을 많이 흘려서 소금이 꼭 들지.'] },
          { id: 'brickgirl', pass: '벽돌은 하나씩 조심조심 날라야지.', name: '벽돌 나르는 아이', x: 0.73, w: 76, h: 209, lines: ['마른 벽돌은 돌처럼 단단해.', '그래도 떨어뜨리면 깨져.'] },
          { id: 'doorwright', pass: '문짝이 딱 맞아야 할 텐데.', name: '문 짜는 목수', x: 0.85, w: 112, h: 283, lines: ['굵은 나무 널로 문을 짠단다.', '이 고장은 나무가 귀해서 아껴 쓰지.'] },
        ],
        spots: [],
      },
    ],
    // "The lump of salt" (core/tale.js; the storyboard of docs/신기한-사실.md): a camel driver
    // just in from the desert has a lump broken off a slab of salt for the head builder (it
    // is for the workers' evening soup) and cannot leave his loads; the man treading mud
    // lets no one across the yard; the child with the writing board says to go between the
    // rows of drying bricks; she hands the salt to the head builder, choosing what to say;
    // and she looks up at the workers standing on the sticks in the wall, laying on the mud.
    tale: {
      thing: true,
      ask: '높은 흙벽에는 어떻게 흙을 바를까?',
      gate: { scene: 'yard', open: 3, sora: '흙 밟는 일꾼이 막고 있어. 못 가.' },
      steps: [
        {
          who: 'cameleer', goal: '장터의 낙타 몰이꾼에게 가 보렴.', holds: '소금 덩이: 낙타 몰이꾼이 들고 있음',
          lines: ['얘야, 부탁 하나 들어주련?', '소금 판에서 떼어 낸 한 덩이란다. 나는 짐을 못 비우지.', '벽 쌓는 우두머리에게 전해 주렴. 저녁 국에 넣을 거야.'],
          offer: { ask: '소금 덩이를 전해 줄까?', label: '내가 전해 줄게요' },
          errand: 'took',
        },
        {
          who: 'treader', goal: '마당 끝의 흙 밟는 일꾼에게 가 보렴.', holds: '소금 덩이: 소라가 들고 있음',
          lines: ['멈춰라. 여기로는 못 지나간단다.', '이긴 흙을 밟는 중이라 발이 푹푹 빠져.'],
          sora: '소금을 전해야 하는데… 어? 누가 불러!',
        },
        {
          who: 'learner', call: '얘, 어디 가려고?', goal: '글씨 배우는 아이가 부른다. 가 보렴.', holds: '소금 덩이: 소라가 들고 있음',
          lines: ['벽 아래로 간다고? 흙 구덩이로는 못 가.', '흙벽돌 말리는 줄 사이로 가면 돼.', '아저씨, 얘는 벽돌 줄 사이로 보낼게요!'],
          after: [{ who: 'treader', line: '벽돌 줄 사이라면 가도 좋다.' }],
          sora: '벽돌 줄 사이로 가래! 가자!',
        },
        {
          who: 'foreman', goal: '벽 아래의 우두머리에게 소금 덩이를 전하렴.', holds: '소금 덩이: 소라가 들고 있음',
          lines: ['오, 사막에서 온 소금이로구나.'],
          choice: {
            ask: '소금 덩이를 건네며 뭐라고 할까?',
            options: [
              { id: 'E1', label: '"낙타 몰이꾼이 보냈어요"', sora: '장터의 낙타 몰이꾼이 보냈어요.', says: '먼 길을 온 소금이구나. 고맙다, 얘야.' },
              { id: 'E2', label: '"소금을 어디에 써요?"', sora: '이 소금을 어디에 쓰세요?', says: '일꾼들 저녁 국에 넣는단다.' },
            ],
          },
          errand: 'gave',
        },
        {
          who: 'foreman', show: true, goal: '흙 바르는 벽을 올려다보렴.',
          lines: ['마침 잘 왔다. 저 벽을 올려다보렴.', '벽에 박힌 막대를 딛고 올라 흙을 바른단다.'],
          sora: '막대가 사다리였구나!',
          errand: 'saw',
        },
      ],
      asides: [
        { who: 'cameleer', when: ['S1', 'S2', 'S3', 'S4'], lines: ['우두머리는 큰 벽 아래에 있단다.', '흙 이기는 마당을 지나면 나오지.'] },
        { who: 'cameleer', when: ['S5'], lines: ['전해 주었구나. 고맙다, 얘야.', '오늘 저녁 국은 간이 맞겠구나.'] },
      ],
      done: '소금 덩이를 전하고, 막대를 딛고 올라 흙을 바르는 것을 보았다.',
    },
    errands: [
      { id: 'took', text: '소금 덩이를 받는다.', at: [] },
      { id: 'gave', text: '벽 쌓는 우두머리에게 소금 덩이를 전한다.', at: [] },
      { id: 'saw', text: '막대를 딛고 흙 바르는 것을 본다.', at: [] },
    ],
    reply: '그 벽은 칠백 해를 서 있단다. 손에 흙은 안 묻었니.',
  },
  // Teotihuacan about AD 200, by day: the last coat of red goes on the Pyramid of the Sun.
  // Drawn as a mural of a Teotihuacan house wall (the user's choice of five tries: the
  // first). The pictures are in teotihuacan200; the try itself is the third scene (the foot
  // of the pyramid), and the stalls at the mouth of the avenue and the front of the house
  // where walls are painted were ordered after it. The sky of the pictures is flat dark
  // red, not pale paper: no `pale`.
  // The day is not on record. Nobody says the name of the city, of the pyramid or of the
  // avenue: the Aztecs gave them centuries after. They say "큰 언덕", "큰길", "우리 도시".
  // Only the names of the scenes and grandmother's notes say 테오티우아칸. Nobody says what
  // stood on the top or what the place was for.
  // Looked up on 2026.10.14 and found so: brought to nearly its size about AD 200; finished
  // with lime plaster and painted, neither of which is left; 63 to 75 metres high by the
  // source ("예순 미터도 넘게"); what the builders called the city is not known; the walls
  // of the buildings were painted; the main buildings were painted dark red; obsidian was
  // knapped into blades and points and traded far; maize, beans, squash, chilli and prickly
  // pear were eaten; no metal tools, no carts, no beasts of burden; women's figurines of
  // these years wear a skirt and a shawl or shoulder cape.
  // From memory (not found): loads carried on the back with a strap over the forehead;
  // agave fibre for rope and cloth, cotton for finer cloth; red ground from red earth; lime
  // burnt from stone; maize cakes baked on a flat clay griddle (may be later here); sea
  // shells brought from the coast; that the plaster was rubbed smooth with a stone.
  // Made up: the errand of the bag of red, the woman who bakes maize cakes, the keeper of
  // the avenue, the knapper who knows the way round, the painter at the foot, every other
  // person, and that the last coat went on on this very day.
  // Kept out: offerings of people and the burying of beasts; Maya writing, anything Aztec;
  // names of people; how many lived there (the hundred thousand is of AD 450).
  teotihuacan: {
    first: '큰 피라미드에 마지막 칠을 하는 날이란다. 붉은 물감을 전해 주렴.',
    intro: { title: '테오티우아칸 사람들', text: '멕시코의 높은 들에 큰 도시를 지은 사람들이란다. 스스로를 뭐라 불렀는지는 아무도 모르지.' },
    dir: 'teotihuacan200', look: 'paper',
    // (What is said of today: looked up on 2026.10.14, in docs/신기한-사실.md; the picture chosen by the user.)
    now: {
      photo: 'photo-now.webp', name: '태양의 피라미드의 지금 모습', when: '멕시코 테오티우아칸 · 오늘날',
      text: [
        '태양의 피라미드는 높이가 66미터쯤이고, 바닥은 가로 220미터, 세로 230미터쯤입니다.',
        '지금의 모습은 1905년부터 1910년까지 다시 쌓은 것입니다. 이때 레오폴도 바트레스가 서둘러 고치면서 다섯째 층을 더하고 겉돌을 많이 걷어 냈습니다.',
        '바트레스는 고친 과정을 적어 두지 않았습니다. 그래서 처음 모습이 어땠는지 알기 어렵습니다.',
        '1971년, 학자들이 피라미드 바로 밑에서 굴을 찾았습니다. 굴은 100미터쯤 이어지다가 네 잎 클로버 꼴의 방에서 끝납니다.',
        '1987년, 테오티우아칸 옛 도시는 유네스코 세계유산이 되었습니다. 피라미드 앞으로 \'죽은 자의 길\'이라는 큰길이 뻗어 있습니다.',
        '2020년, 멕시코 정부는 유적을 지키려고 사람들이 피라미드에 오르지 못하게 했습니다.',
      ],
      credit: '사진: Daniel Case, 위키미디어 공용, CC BY-SA 3.0',
    },
    drawn: '옛 테오티우아칸의 집 벽에 그린 붉은 그림처럼 그렸단다.',
    scenes: [
      {
        id: 'market', name: '멕시코 테오티우아칸 큰길 어귀 좌판', short: '큰길 어귀 좌판', zoom: 1.131, ground: 0.720, scale: 0.662, air: 'market', floor: 'dirt',
        sora: '저 멀리 빨간 산이 있어!',
        people: [
          { id: 'ropemaker', pass: '밧줄을 쉬지 않고 꼬는 중이란다.', name: '밧줄 꼬는 아저씨', x: 0.18, w: 131, h: 320, lines: ['뾰족한 풀잎에서 실을 뽑는단다.', '그 실을 꼬면 튼튼한 밧줄이 되지.'] },
          { id: 'beangranny', pass: '콩이 다 삶아졌구나.', show: 'meal', name: '콩 삶는 할머니', x: 0.29, w: 128, h: 319, lines: ['옥수수 떡에 콩을 얹어 먹는단다.', '구운 호박도 있어. 먹어 보련?'],
            try: { id: 'eat-maize', verb: 'eat', name: '옥수수 떡과 콩', face: 'yum', sora: '콩이 고소해! 호박은 달콤해.' } },
          { id: 'cakewoman', pass: '누가 좀 전해 주면 좋으련만.', name: '옥수수 떡 굽는 아주머니', x: 0.4, w: 110, h: 306, lines: ['옥수수를 갈아서 떡을 굽는단다.', '우리 도시는 날마다 이 떡을 먹지.'] },
          { id: 'chiliwife', pass: '볕이 좋아 잘 마르겠네.', name: '고추 말리는 아주머니', x: 0.51, w: 131, h: 310, lines: ['붉은 고추를 줄에 꿰어 말린단다.', '조금만 넣어도 아주 맵지.'] },
          { id: 'clothier', pass: '고운 옷 보고 가요.', name: '옷 파는 아주머니', x: 0.62, w: 113, h: 306, lines: ['어깨에 덮는 옷이란다.', '아이 것도 있어. 입어 보련?'],
            try: { id: 'wear-teo', verb: 'wear', name: '테오티우아칸의 옷', outfit: 'teo', sora: '어깨에 세모난 천을 덮었어! 가벼워.', memo: '세모난 천을 어깨에 덮고 치마를 감아 입었단다. 흙으로 빚은 여자 인형이 그런 옷을 입고 있지.' } },
          { id: 'shellman', pass: '먼 길을 걸어왔더니 다리가 아프오.', name: '바닷가에서 온 장사꾼', x: 0.73, w: 165, h: 316, lines: ['바닷가에서 조개를 지고 왔단다.', '여러 날을 걸어서 왔지.'] },
          { id: 'watergirl', pass: '물을 쏟으면 안 돼, 조심조심.', name: '물 긷는 아이', x: 0.85, w: 97, h: 230, lines: ['저기 지붕 너머 큰 언덕 보여?', '사람들이 돌로 쌓은 거야!'] },
        ],
        spots: [
          // The pyramid far over the roofs at the right end. (From and to are to be set to the picture.)
          { id: 'hill', from: 0.77, to: 0.96, sora: '저 빨간 산은 뭐야?', memo: '산이 아니라 사람들이 쌓은 태양의 피라미드란다. 예순 미터도 넘게 높았지.' },
        ],
      },
      {
        id: 'painters', name: '멕시코 테오티우아칸 벽 그리는 집 앞', short: '벽 그리는 집 앞', zoom: 1.093, ground: 0.749, scale: 0.640, air: 'hush', floor: 'dirt',
        sora: '벽에 그림을 그리고 있어!',
        people: [
          { id: 'limeman', pass: '물을 조금만 더 붓자.', name: '회 개는 아저씨', x: 0.18, w: 140, h: 272, lines: ['흰 횟가루를 물에 갠단다.', '벽에 바르면 희고 매끈해지지.'] },
          { id: 'grinder', pass: '흙을 곱게 갈아야 물감이 돼.', name: '물감 가는 아이', x: 0.29, w: 80, h: 215, lines: ['붉은 흙을 갈아서 물감을 만들어.', '손이 다 빨개졌어!'] },
          { id: 'wallpainter', pass: '새의 꼬리는 풀빛으로.', show: 'mural', pose: 'see-wow', sora: '벽에 노래하는 새가 그려졌어!', memo: '이 도시는 집 벽마다 그림을 그렸단다. 흰 회를 바르고 그 위에 붉은 바탕을 칠했지.', name: '벽 그리는 이', x: 0.4, w: 108, h: 284, lines: ['회가 마르기 전에 그려야 한단다.', '우리 도시는 벽마다 그림이 있지.'] },
          { id: 'knapper', pass: '돌을 치니 날이 잘 떨어지네.', name: '검은 돌 떼는 장인', x: 0.51, w: 117, h: 269, lines: ['검은 돌을 톡 치면 날이 떨어진단다.', '손 베지 않게 조심하렴.'] },
          { id: 'bladewife', pass: '날이 고르게 잘 나왔네.', show: 'obsidian', pose: 'see-aha', sora: '돌인데 유리처럼 반짝여!', memo: '쇠가 없어서 검은 돌을 얇게 떼어 칼을 만들었단다. 이 칼날을 먼 곳까지 가져가 바꾸었지.', name: '칼날 고르는 아주머니', x: 0.62, w: 114, h: 257, lines: ['검은 돌 칼날은 아주 잘 든단다.', '먼 곳 사람들도 이 칼날을 찾지.'] },
          { id: 'porter', pass: '영차, 조금만 더 가면 된다.', show: 'load', pose: 'see-aha', sora: '짐꾼이 짐 끈을 이마에 걸었어!', memo: '수레도 짐 나르는 짐승도 없었단다. 그 큰 피라미드의 돌을 모두 사람이 등에 져 날랐지.', name: '돌 진 짐꾼', x: 0.73, w: 128, h: 271, lines: ['돌은 이렇게 등에 지고 나른단다.', '끈을 이마에 걸면 덜 무겁지.'] },
          { id: 'guard', pass: '줄이 아직 한참 남았구나.', name: '큰길 지키는 이', x: 0.85, w: 128, h: 320, lines: ['이 큰길은 큰 언덕까지 곧게 뻗었단다.', '짐꾼의 줄이 날마다 지나가지.'] },
        ],
        spots: [],
      },
      {
        id: 'pyramid', name: '멕시코 테오티우아칸 태양의 피라미드 발치', short: '피라미드 발치', zoom: 1.128, ground: 0.722, scale: 0.660, air: 'hush', floor: 'dirt',
        sora: '계단이 하늘까지 닿을 것 같아!',
        people: [
          { id: 'spinner', pass: '실이 곱게 뽑히는구나.', name: '실 잣는 할머니', x: 0.18, w: 132, h: 301, lines: ['저 뾰족한 풀에서 실을 뽑는단다.', '자루도 끈도 이 실로 만들지.'] },
          { id: 'maizeman', pass: '알이 꽉 찬 옥수수요!', name: '옥수수 파는 아저씨', x: 0.29, w: 167, h: 320, lines: ['일꾼들이 먹을 옥수수란다.', '큰 언덕을 쌓으려면 많이 먹어야지.'] },
          { id: 'paintgirl', pass: '물감을 흘리면 안 돼, 살금살금.', name: '물감 그릇 든 아이', x: 0.4, w: 116, h: 252, lines: ['붉은 물감을 나르는 중이야.', '오늘 다 칠한대!'] },
          { id: 'plasterer', pass: '여기도 매끈하게 됐다.', name: '회 바르는 이', x: 0.51, w: 151, h: 314, lines: ['돌 위에 흰 회를 발랐단다.', '둥근 돌로 문지르면 매끈해지지.'] },
          { id: 'painter', pass: '붉은 물감이 모자라는구나.', show: 'pyramid', pose: 'see-wow', sora: '큰 언덕이 온통 빨개! 정말 크다!', memo: '태양의 피라미드는 겉에 흰 회를 바르고 붉게 칠했단다. 높이는 예순 미터도 넘었지.', name: '칠하는 이', x: 0.62, w: 137, h: 318, lines: ['나는 큰 언덕에 칠을 하는 사람이란다.', '맨 아래 한 귀퉁이만 남았지.'] },
          { id: 'counter', pass: '서른하나, 서른둘… 어디였지?', name: '계단 세는 아이', x: 0.73, w: 103, h: 251, lines: ['계단을 세는데 자꾸 잊어버려.', '너무 많아서 끝이 안 보여!'] },
          { id: 'visitor', pass: '올려다보느라 목이 다 아프오.', name: '먼 데서 온 손님', x: 0.85, w: 136, h: 319, lines: ['먼 데서 이 큰 언덕을 보러 왔다오.', '이렇게 큰 것은 처음 보오.'] },
        ],
        spots: [],
      },
    ],
    // "The bag of red" (core/tale.js; the storyboard of docs/신기한-사실.md): the woman who
    // bakes maize cakes at the stalls has a bag of red paint powder for the painter at the
    // foot of the pyramid and cannot leave her fire; the keeper of the avenue lets no one
    // cross, for the line of porters with stone and lime on their backs is passing; the
    // obsidian knapper says to go round behind the house where walls are painted; she hands
    // the bag to the painter, choosing what to say; and at the foot she looks up the middle
    // stair, whose end cannot be seen, as the last of the red goes on.
    tale: {
      thing: true,
      ask: '붉게 칠한 큰 언덕은 어떤 모습일까?',
      gate: { scene: 'painters', open: 3, sora: '지키는 이가 막고 있어. 못 가.' },
      steps: [
        {
          who: 'cakewoman', goal: '큰길 어귀 좌판의 옥수수 떡 굽는 아주머니에게 가 보렴.', holds: '물감 자루: 아주머니가 들고 있음',
          lines: ['얘야, 부탁 하나 들어주련?', '붉은 물감 가루란다. 나는 불 앞을 못 떠나지.', '큰 언덕 발치의 칠하는 이에게 전해 주렴.'],
          offer: { ask: '물감 자루를 전해 줄까?', label: '내가 전해 줄게요' },
          errand: 'took',
        },
        {
          who: 'guard', goal: '길 끝의 큰길로 가 보렴.', holds: '물감 자루: 소라가 들고 있음',
          lines: ['멈춰라. 지금은 큰길을 못 건넌단다.', '돌과 회를 진 짐꾼의 줄이 지나가는 중이야.'],
          sora: '물감을 전해야 하는데… 어? 누가 불러!',
        },
        {
          who: 'knapper', call: '얘, 어디로 가니?', goal: '검은 돌 떼는 장인이 부른다. 가 보렴.', holds: '물감 자루: 소라가 들고 있음',
          lines: ['큰 언덕에 간다고? 줄은 한참 이어진단다.', '벽 그리는 집 뒤로 돌아가면 발치가 나오지.', '지키는 양반, 이 아이는 뒷길로 보낼게요!'],
          after: [{ who: 'guard', line: '뒷길이라면 가도 좋다. 저 집 뒤로 돌아가렴.' }],
          sora: '뒷길이 있대! 가자!',
        },
        {
          who: 'painter', goal: '피라미드 발치의 칠하는 이에게 물감을 전하렴.', holds: '물감 자루: 소라가 들고 있음',
          lines: ['오, 기다리던 붉은 물감이로구나.'],
          choice: {
            ask: '물감 자루를 건네며 뭐라고 할까?',
            options: [
              { id: 'E1', label: '"아주머니가 보냈어요"', sora: '좌판의 아주머니가 보내셨어요.', says: '때맞춰 왔구나. 고맙다, 얘야.' },
              { id: 'E2', label: '"이걸로 뭘 칠해요?"', sora: '이 물감으로 뭘 칠하세요?', says: '큰 언덕의 마지막 귀퉁이를 칠한단다.' },
            ],
          },
          errand: 'gave',
        },
        {
          who: 'painter', show: true, goal: '피라미드의 가운데 계단을 올려다보렴.',
          lines: ['마침 잘 왔다. 저 계단을 올려다보렴.', '흰 회 위에 붉은 칠을 하면 다 끝난단다.'],
          sora: '계단 끝이 안 보여! 온통 빨개!',
          errand: 'saw',
        },
      ],
      asides: [
        { who: 'cakewoman', when: ['S1', 'S2', 'S3', 'S4'], lines: ['큰 언덕은 큰길을 따라가면 나온단다.', '붉게 칠한 아주 큰 언덕이지.'] },
        { who: 'cakewoman', when: ['S5'], lines: ['전해 주었구나. 고맙다, 얘야.', '큰 언덕도 보고 왔니? 참 붉지.'] },
      ],
      done: '붉은 물감을 전하고, 붉게 칠한 큰 피라미드를 올려다보았다.',
    },
    errands: [
      { id: 'took', text: '붉은 물감 자루를 받는다.', at: [] },
      { id: 'gave', text: '칠하는 이에게 물감을 전한다.', at: [] },
      { id: 'saw', text: '붉은 피라미드를 올려다본다.', at: [] },
    ],
    reply: '그 붉은 칠은 다 벗겨지고 돌만 남았단다. 계단은 다 세어 보았니.',
  },
  // Heungdeok temple outside Cheongju, the summer of 1377, by day: Jikji is printed with type
  // of metal. Drawn as an ink landscape of late Goryeo on tan silk (the user's choice of
  // five tries: the fifth). The pictures are in jikji1377; the try is the third scene
  // ('print': the place beside the hall where the book is printed), and the stream where
  // paper is made and the yard where the metal is poured were ordered after it. The
  // storyboard has "책 찍는 방 앞" for the third; the picture shows an open place in the yard,
  // so it is named "책 찍는 자리". Pale: the sky of the pictures is tan silk left bare.
  // Looked up on 2026.10.14 (docs/신기한-사실.md) and found so: printed with cast type at
  // Heungdeok temple outside Cheongju in the seventh month of 1377 ("1377년 여름"); Baegun
  // put the book together and died in 1374 (he is not in it); Seokchan and Daljam had it
  // printed, Myodeok gave the money; two volumes; none of the type is left; the type is
  // held to have been cast by lost wax (people here simply do it: cut the letter in wax,
  // wrap it in clay, pour the metal; grandmother's slip says "만들었다고 본단다").
  // Looked up while writing and found so: a letter is set upside down in three places in
  // Jikji, and the setting is uneven (earticle.net A213210): "거꾸로 박힌 글자도 있단다".
  // Looked for and not found, so not said: that the type was fixed to the forme with wax;
  // that the ink was mixed with oil; why the same letter differs in shape.
  // From memory: paper of the bark of the paper mulberry (peeled, boiled, beaten, dipped out
  // with a bamboo screen, dried on boards); that the letter is first written on thin paper
  // and laid face down on the wax; that the letters come out of the mould on a stem like a
  // branch and are sawn off and filed; that a letter is cut mirrored; that the back of the
  // sheet is rubbed with a pad; that a sheet is folded in two and sewn; that the same letter
  // is needed many times over for one page; barley rice, greens and cucumber; the dress.
  // Made up: the papermaker, the master of the pouring, the young monk, that Seokchan
  // himself pulls the sheet, that Myodeok is in the hall that day, that the
  // sheets are hung on a line (the try shows it), every other person (the work of the day: see the comment before the tale).
  // Kept out: "the first in the world"; France (the square's card has it); Baegun; Hangul,
  // the horsehair hat, the white coat; any words of the book; meat and wine.
  jikji: {
    first: '절에서 쇠 글자로 책을 찍는 날이란다. 책이 잘 찍히도록 도와주렴.',
    dir: 'jikji1377', look: 'paper', pale: true,
    // (What is said of today: looked up on 2026.10.14, in docs/신기한-사실.md; the picture chosen by the user.
    // How it came to France and Park Byeong-seon: looked up on 2026.10.19, see the square's comment.
    // The site: in 1985 a gong (금구) cut with "흥덕사" turned up from a building site in Uncheon-dong,
    // Cheongju, and the dig found the temple (encykorea E0056711, hangyo.com 55152).
    // More of it (the user, 2026.10.19: "좀 더 자세한 설명"), looked up the same day: of two
    // volumes the second is left, its first leaf lost, 38 leaves (koreascience JAKO201228439148688);
    // 78 years before Gutenberg's Bible (hangyo.com 55152); a UNESCO Memory of the World in
    // September 2001 (seoul.co.kr 2011.11.24); the Cheongju Early Printing Museum opened at the
    // site in March 1992 (hangyo.com 55152).)
    now: {
      photo: 'photo-now.webp', name: '남은 책 직지', when: '프랑스 국립도서관 · 직지',
      text: [
        '온 이름은 "백운화상초록불조직지심체요절"입니다. 백운 스님이 부처와 큰스님들의 가르침에서 중요한 것을 가려 뽑아 엮었습니다.',
        '쇠 글자로 찍은 책 가운데 지금 남은 가장 오래된 책입니다. 독일 구텐베르크의 성경보다 78년 앞섭니다.',
        '본래 위아래 두 권이었는데 아래 권 한 권만 남았습니다. 그마저 첫 장이 없어 38장입니다.',
        '이 책은 조선 말에 프랑스 외교관이 사 갔고, 1950년에 프랑스 국립도서관에 들어갔습니다.',
        '1972년, 그 도서관에서 일하던 박병선 박사가 직지를 찾아내 세상에 알렸습니다. 2001년에는 유네스코 세계기록유산이 되었습니다.',
        '1985년, 청주의 한 공사장에서 "흥덕사"라는 글자가 새겨진 쇠북이 나왔습니다. 그래서 그동안 알 수 없던 흥덕사의 자리를 찾았습니다. 그 곁에는 지금 청주고인쇄박물관이 있습니다.',
      ],
      credit: '사진: 위키미디어 공용, 공개 저작물',
      // The gong (the user, 2026.10.20: "이 사진 추가"): Wikimedia Commons, "Heundeoksa2.jpg"
      // by Forcoolife (CC BY-SA 3.0), made smaller: the bronze gong of Heungdeoksa, its name cut on the side.
      more: {
        photo: 'photo-gong.webp', name: '"흥덕사" 글자가 새겨진 쇠북',
        text: '1985년에 땅속에서 나온 청동 쇠북입니다. 옆면에 "흥덕사"라는 글자가 새겨져 있습니다. 절에서 때를 알리거나 사람을 모을 때 쳤습니다.',
        credit: '사진: Forcoolife, 위키미디어 공용, CC BY-SA 3.0',
      },
    },
    drawn: '고려 때의 먹 그림처럼, 누런 비단에 먹으로 그렸단다.',
    scenes: [
      {
        id: 'stream', name: '고려 청주 흥덕사 아래 종이 뜨는 냇가', short: '종이 뜨는 냇가', zoom: 1.127, ground: 0.723, scale: 0.659, air: 'hush', floor: 'dirt',
        sora: '냇가에서 종이를 만들어!',
        people: [
          { id: 'peeler', pass: '닥 껍질이 죽죽 잘도 벗겨진다.', name: '닥 껍질 벗기는 아주머니', x: 0.18, w: 130, h: 320, lines: ['닥나무 가지의 껍질을 벗긴단다.', '이 흰 속껍질이 종이가 되지.'] },
          { id: 'beater', pass: '닥을 쿵쿵 두드렸더니 팔이 아파.', name: '닥 두드리는 아이', x: 0.29, w: 116, h: 304, lines: ['삶은 껍질을 방망이로 두드려.', '솜처럼 풀어질 때까지 쳐야 해.'] },
          { id: 'cook', pass: '새참 왔어요, 쉬었다 해요.', show: 'meal', name: '새참 내온 아주머니', x: 0.4, w: 109, h: 287, lines: ['보리밥에 나물을 무쳐 왔단다.', '오이도 있어. 먹어 보련?'],
            try: { id: 'eat-barley', verb: 'eat', name: '보리밥과 나물과 오이', face: 'yum', sora: '오이가 아삭아삭해! 밥은 구수해.' } },
          { id: 'papermaker', pass: '종이를 넉넉히 떠 두어야지.', name: '종이 뜨는 아저씨', x: 0.51, w: 121, h: 319, lines: ['대나무 발로 물에서 종이를 떠낸단다.', '발을 흔들어야 고르게 떠지지.'] },
          { id: 'dryer', pass: '볕이 좋아 금세 마르겠구먼.', show: 'paper', pose: 'see-aha', sora: '나무껍질이 종이가 됐어!', memo: '닥나무 껍질을 삶고 두드려 물에 풀었단다. 발로 얇게 떠서 말리면 종이가 되지.', name: '종이 말리는 할머니', x: 0.62, w: 122, h: 276, lines: ['떠낸 종이는 판에 붙여 말린단다.', '다 마르면 빳빳하고 질기지.'] },
          { id: 'tailor', pass: '모시옷이 시원하지.', name: '옷 짓는 아주머니', x: 0.73, w: 129, h: 291, lines: ['여름에는 모시와 삼베로 옷을 짓는단다.', '아이 것도 있어. 입어 보련?'],
            try: { id: 'wear-goryeo', verb: 'wear', name: '고려의 옷', outfit: 'goryeo', sora: '저고리가 길어서 엉덩이를 덮어!', memo: '고려 사람들은 긴 저고리를 입고 허리에 띠를 맸단다.' } },
          { id: 'granny', pass: '오늘은 절에 올라가 봐야지.', name: '절에 가는 할머니', x: 0.85, w: 105, h: 274, lines: ['저 위 절에서 책을 찍는다더구나.', '절은 이 돌계단 길로 올라간단다.'] },
        ],
        spots: [],
      },
      {
        id: 'foundry', name: '고려 청주 흥덕사 쇳물 붓는 마당', short: '쇳물 붓는 마당', zoom: 1.129, ground: 0.721, scale: 0.661, air: 'hush', floor: 'dirt',
        sora: '화로가 빨갛게 달았어!',
        people: [
          { id: 'bellows', pass: '풀무를 밟아야지. 불아, 세져라!', name: '풀무 밟는 일꾼', x: 0.18, w: 134, h: 306, lines: ['풀무를 밟아 화로에 바람을 넣는단다.', '불이 세야 쇠가 물처럼 녹지.'] },
          { id: 'writer', pass: '한 획 한 획 정성껏 써야지.', name: '글씨 쓰는 스님', x: 0.29, w: 122, h: 286, lines: ['글자를 얇은 종이에 먼저 쓴단다.', '그 종이를 밀랍에 뒤집어 붙이지.'] },
          { id: 'novice', pass: '살살, 획이 떨어지면 안 돼.', name: '글자 새기는 어린 스님', x: 0.4, w: 109, h: 223, lines: ['밀랍에 글자를 하나씩 새겨.', '뒤집힌 꼴로 새겨야 바로 찍혀.'] },
          { id: 'moulder', pass: '빈틈없이 꼭꼭 싸야지.', show: 'wax', pose: 'see-aha', sora: '밀랍 자리에 쇳물이 들어가!', memo: '쇠 글자는 밀랍으로 만들었다고 본단다. 밀랍에 새겨 흙으로 싸고, 밀랍이 녹은 자리에 쇳물을 부었지.', name: '흙 싸는 아저씨', x: 0.51, w: 123, h: 306, lines: ['밀랍 글자를 고운 흙으로 싼단다.', '불에 구우면 밀랍은 녹아 흘러나오지.'] },
          { id: 'breaker', pass: '탁! 어디 잘 나왔나 보자.', name: '흙 틀 깨는 일꾼', x: 0.62, w: 122, h: 290, lines: ['쇳물이 식으면 흙 틀을 깬단다.', '글자가 가지에 열매처럼 달려 나오지.'] },
          { id: 'filer', pass: '글자 모서리를 반듯하게 다듬어야지.', show: 'type', pose: 'see-wow', sora: '글자가 손톱만 해!', memo: '쇠 글자는 하나하나가 손톱만 했단다. 한 글자씩 따로 만들어 줄 맞춰 세웠지.', name: '글자 다듬는 아저씨', x: 0.73, w: 121, h: 294, lines: ['가지에서 글자를 하나씩 떼어 낸단다.', '줄로 갈아서 크기를 맞추지.'] },
          { id: 'founder', pass: '쇳물 나간다, 물러서라.', name: '쇳물 붓는 대장', x: 0.85, w: 140, h: 320, lines: ['나는 이 마당에서 쇳물을 붓는단다.', '쇳물은 몹시 뜨거워 조심해야 하지.'] },
        ],
        spots: [],
      },
      {
        id: 'print', name: '고려 청주 흥덕사 법당 옆 책 찍는 자리', short: '책 찍는 자리', zoom: 1.128, ground: 0.722, scale: 0.660, air: 'palace', floor: 'dirt',
        sora: '종이를 빨래처럼 널었어!',
        people: [
          { id: 'sorter', pass: '이 글자는 어느 칸에 있더라.', name: '글자 고르는 스님', x: 0.18, w: 123, h: 309, lines: ['상자에서 쓸 글자를 골라낸단다.', '같은 글자도 여러 개가 있어야 하지.'] },
          { id: 'setter', pass: '줄이 비뚤면 안 되지.', name: '판 짜는 스님', x: 0.29, w: 138, h: 317, lines: ['고른 글자를 판에 줄 맞춰 세운단다.', '석찬 스님과 달잠 스님이 맡은 일이지.'] },
          { id: 'inkboy', pass: '쓱쓱, 먹을 다 갈았다.', name: '먹 가는 아이', x: 0.4, w: 95, h: 241, lines: ['글자에 바를 먹을 갈아.', '볼에도 묻었어? 헤헤.'] },
          { id: 'hanger', pass: '먹이 마를 때까지 널어야지.', name: '종이 너는 아이', x: 0.51, w: 129, h: 263, lines: ['갓 찍은 종이는 먹이 젖어 있어.', '그래서 줄에 널어 말려.'] },
          { id: 'seokchan', pass: '먹이 마르기 전에 찍어야지.', show: 'print', pose: 'see-wow', sora: '한 장이 한꺼번에 찍혀!', memo: '글자를 판에 세워 먹을 바르고 종이를 덮어 문질렀단다. 글자를 다시 짜면 다른 장도 찍었지.', name: '석찬 스님', x: 0.62, w: 137, h: 320, lines: ['스승님이 엮으신 책을 찍는단다.', '여러 사람이 읽도록 여러 벌을 찍지.'] },
          { id: 'bellkid', pass: '땡그랑, 풍경이 또 울린다.', name: '풍경 소리 듣는 아이', x: 0.73, w: 117, h: 237, lines: ['처마 끝에 작은 종이 달렸어.', '바람이 불면 땡그랑 울려.'] },
          { id: 'binder', pass: '한 장, 두 장. 차례가 맞나.', name: '책 매는 스님', x: 0.85, w: 129, h: 307, lines: ['찍은 종이를 접어 매면 "직지"라는 책이 된단다.', '"마음을 곧바로 가리킨다"는 뜻이지.'] },
        ],
        spots: [
          // The hall in the try. (From and to are to be set to the picture.) Myodeok is not
          // drawn and cannot be spoken to: only that she gave the money is on record.
          { id: 'myodeok', from: 0.66, to: 0.8, sora: '법당 안에 누가 계신대!', memo: '비구니 묘덕 스님이란다. 이 책을 찍는 데 돈을 보탠 분이지.' },
        ],
      },
    ],
    // "The work of the day" (core/tale.js `work`, as at Darlington and London): the book is
    // printed from the paper made by the stream and the letters cast in the yard. By the
    // stream the paper for it is still short, and she dips sheets out of the vat with the
    // papermaker's bamboo screen; in the yard more of the letters that come many times over
    // in a page are to be cast, and she treads the bellows with the worker until the fire is
    // hot enough for the master to pour (the yard is shut while he pours); beside the hall the
    // forme is set and inked, and she lays the paper on it and rubs the back with Seokchan,
    // and a page comes off printed, three times over.
    // Looked up (docs/신기한-사실.md, and the place's comment above): printed with cast metal
    // type at Heungdeok temple in the seventh month of 1377; Seokchan and Daljam had it printed
    // (said only as "석찬 스님과 달잠 스님이 맡은 일"); two volumes.
    // From memory (as in the place's comment above, not looked up again): paper of the paper
    // mulberry dipped out with a bamboo screen and dried on boards; that the same letter is
    // needed many times over for one page; that the forme is inked and the back of the sheet
    // rubbed with a pad; that a furnace was blown with bellows. That the bellows were trodden
    // is the picture's (the "풀무 밟는 일꾼"), not a record.
    // Made up: the paper still short that day and her dipping it, the letters cast that day
    // for the page and her treading the bellows (in time to the four lights: the game's
    // shorthand), the master shutting the yard while he pours, Seokchan himself rubbing the
    // sheet with her, three sheets of the one page, every word they say.
    tale: {
      work: true,
      ask: '쇠 글자로 책을 어떻게 찍을까?',
      gate: { scene: 'foundry', open: 2, sora: '대장이 마당을 막고 있어. 못 가.' },
      steps: [
        {
          who: 'papermaker', goal: '종이 뜨는 냇가의 아저씨와 함께 대나무 발로 종이를 뜨렴.',
          lines: ['절에서 책 찍을 종이가 아직 모자란단다.', '발을 담갔다가 고르게 떠내자. 같이 하련?'],
          play: {
            kind: 'fill', tally: '종이 {all}장 가운데 {n}장을 떴다.', ask: '꾹 눌러 종이를 뜨다가 금빛 칸에서 떼렴.', label: '찰랑', hits: 3, zone: [0.65, 0.85], speed: 0.5,
            good: ['찰랑! 고르게 떠졌어!', '한 장 더!'], miss: ['앗, 너무 두껍게 떠졌어!', '앗, 너무 얇아!'],
          },
          after: [{ who: 'dryer', line: '떠낸 종이는 내가 말려서 절로 올려 보내마.' }],
          cheer: '종이를 다 떴다!',
          sora: '이제 쇳물 붓는 마당으로 올라가 보자!',
          errand: 'paper',
        },
        {
          who: 'bellows', goal: '쇳물 붓는 마당의 풀무 밟는 일꾼과 함께 풀무를 밟으렴.',
          lines: ['모자란 글자를 더 부어야 한단다.', '불을 키우게 풀무를 같이 밟으련?'],
          play: {
            kind: 'beat', tally: '풀무를 {all}번 가운데 {n}번 박자 맞춰 밟았다.', ask: '금빛 불이 켜질 때 풀무를 밟으렴.', label: '후욱!', hits: 3, zone: [0.42, 0.58], speed: 1.5,
            good: ['후욱! 불이 활활 타!', '한 번 더!'], miss: ['앗, 박자가 어긋났어!', '조금 일렀어!'],
          },
          after: [{ who: 'founder', line: '쇳물을 다 부었다. 이제 지나가도 좋다.' }],
          cheer: '쇳물을 다 부었다!',
          sora: '마당이 열렸어! 책 찍는 자리로 가 보자!',
          errand: 'bellows',
        },
        {
          who: 'seokchan', goal: '법당 옆 책 찍는 자리의 석찬 스님과 함께 한 장을 찍으렴.',
          lines: ['판에 글자를 다 세우고 먹을 발랐단다.', '종이를 덮고 뒤를 문지르자. 같이 하련?'],
          play: {
            kind: 'mash', tally: '종이 {all}장 가운데 {n}장에 글자를 찍었다.', ask: '여러 번 눌러 종이 뒤를 문지르렴.', label: '쓱쓱', hits: 3, zone: [0.41, 0.59], speed: 0.12,
            good: ['쓱쓱! 글자가 찍혀 나와!', '한 장 더!'], miss: ['앗, 글자가 흐릿해!', '조금 더 문질러야 해!'], show: 'print',
          },
          after: [{ who: 'hanger', line: '갓 찍은 종이는 줄에 널어 말리자.' }],
          cheer: '한 장이 다 찍혔다!',
          sora: '글자가 줄 맞춰 다 찍혔어!',
          errand: 'print',
        },
      ],
      asides: [
        { who: 'peeler', when: ['S0'], lines: ['절에서 책을 찍느라 종이가 많이 든단다.', '종이 뜨는 아저씨 혼자 바쁘겠구나.'] },
        { who: 'founder', when: ['S0', 'S1'], lines: ['풀무 불이 세져야 쇳물을 붓는단다.', '다 부을 때까지 마당은 못 지나간다.'] },
        { who: 'novice', when: ['S1'], lines: ['풀무 밟는 아저씨가 숨이 차 보여.', '같이 밟아 드리면 불이 금방 세질 거야.'] },
        { who: 'setter', when: ['S2'], lines: ['글자를 판에 줄 맞춰 다 세웠단다.', '석찬 스님께 가 보렴. 곧 찍으신단다.'] },
        { who: 'inkboy', when: ['S2'], lines: ['먹을 넉넉히 갈아 두었어.', '스님이 판에 먹을 바르실 거야.'] },
        { who: 'binder', when: ['S3'], lines: ['네가 찍은 종이도 마르면 접어 매마.', '그렇게 한 장씩 모여 책이 되지.'] },
        { who: 'papermaker', when: ['S3'], lines: ['내가 뜬 종이가 책이 되었다니 기쁘구나.', '네가 도와주어 종이가 넉넉했단다.'] },
      ],
      done: '종이를 뜨고, 풀무를 밟고, 쇠 글자로 한 장을 찍었다.',
    },
    errands: [
      { id: 'paper', text: '냇가에서 대나무 발로 종이를 뜬다.', at: [] },
      { id: 'bellows', text: '풀무를 밟아 쇠 글자를 붓게 돕는다.', at: [] },
      { id: 'print', text: '쇠 글자로 한 장을 찍는다.', at: [] },
    ],
    reply: '그 책에는 거꾸로 박힌 글자도 있단다. 손으로 하나하나 세웠으니까.',
  },
  // Java about 825: the great stone temple of Borobudur is just finished. Drawn as a painted
  // miniature on a palm-leaf sutra (the user's choice of five tries: the fifth). The pictures
  // are in borobudur825; the try itself is the first scene (the village below the temple),
  // and the stone yard and the walk of the lowest gallery were ordered after it. The sky of
  // the pictures is flat red, not pale paper: no `pale`.
  // The year is an estimate and the day is not on record: nobody says "825", and grandmother
  // says "천이백 해쯤 전" and "막 다 지은 무렵". No king is in it, and nobody has a name.
  // Looked up on 2026.10.14 and found so: built early in the ninth century; 2,672 picture
  // panels ("이천육백 장도 넘는단다"); 72 pierced bell-shaped towers on the round terraces
  // at the top, a Buddha seated in each; andesite, well over a million blocks ("백만 덩이도
  // 넘게"), fitted without mortar by knobs and indentations; the stone taken from the beds
  // of rivers, brought down by the volcanoes around; pilgrims go round each level the way
  // the sun goes and climb level by level; the panels follow one another as stories; a ship
  // with sails and outriggers is among the panels; a rice barn on posts is among them too.
  // From memory: that houses stood on posts because of the rain; coconut water; rope of
  // coconut fibre; that elephants are among the pictures of the panels; steamed rice on a
  // banana leaf, bananas and coconut; the dress; that the temple lay under ash and forest
  // for about a thousand years (grandmother's reply: the square's own reply says the same).
  // Made up: the errand of the lotus basket, the grandmother who strings flowers, the foreman
  // and the hauling of the last tower's stone, the sailor whose ship is carved, the carver
  // of the ship, the monk and that he walks the gallery every morning, every other person.
  // Kept out: the king; the panels of hell; the hidden foot; anything of Islam or of the
  // Dutch; batik; the Hindu temples of Prambanan (they are later); any teaching in the
  // monk's mouth.
  borobudur: {
    first: '큰 돌 절을 막 다 지은 무렵이란다. 연꽃 바구니를 전해 주렴.',
    intro: { title: '자바 사람들', text: '자바는 더운 바다에 있는 큰 섬이란다. 쌀농사를 짓고, 부처님을 모시는 큰 절을 돌로 쌓았지.' },
    dir: 'borobudur825', look: 'paper',
    // (What is said of today: looked up on 2026.10.14, in docs/신기한-사실.md; the picture chosen by the user.)
    now: {
      photo: 'photo-now.webp', name: '보로부두르의 지금 모습', when: '인도네시아 자바 보로부두르 · 오늘날',
      text: [
        '벽과 난간에는 돌에 새긴 그림 판 2,672개가 남아 있습니다. 처음 세운 부처상은 504개였습니다.',
        '오랜 세월 동안 많은 부처상의 머리가 떼어져 사라졌습니다. 2014년에 세어 보니 머리 없는 부처상이 250개쯤이었습니다.',
        '네덜란드 사람 판 에르프가 1907년부터 1911년까지 처음 고쳤고, 1975년부터 1982년까지는 인도네시아와 유네스코가 다시 크게 고쳤습니다.',
        '1991년에 유네스코 세계유산이 되었습니다. 2010년 므라피 화산의 재가 덮였을 때는 닷새 동안 문을 닫고 재를 씻어 냈습니다.',
        '해마다 부처님오신날(베삭)에는 불교 신자들이 멘듯 사원에서 이곳까지 걸어옵니다. 순례하는 이들은 시계 방향으로 돌며 한 층씩 오릅니다.',
        '돌이 닳지 않도록, 지금은 하루 1,200명만 안내인과 함께 대나무 신을 신고 위층에 오를 수 있습니다.',
      ],
      credit: '사진: Gunawan Kartapranata, 위키미디어 공용, 공개 저작물',
    },
    drawn: '옛 불경의 야자잎에 그려 넣던 색 그림처럼 그렸단다.',
    scenes: [
      {
        id: 'village', name: '인도네시아 자바 보로부두르 아래 마을 어귀', short: '마을 어귀', zoom: 1.076, ground: 0.762, scale: 0.630, air: 'market', floor: 'dirt',
        sora: '돌로 쌓은 산 같은 절이야!',
        people: [
          { id: 'climber', pass: '오늘은 열매가 잘 익었네.', name: '코코넛 따는 아저씨', x: 0.18, w: 141, h: 320, lines: ['야자나무에 올라가 열매를 딴단다.', '속에 든 물이 달고 시원하지.'] },
          { id: 'houseboy', pass: '사다리로 올라가야 해.', name: '기둥 집의 아이', x: 0.29, w: 97, h: 249, lines: ['우리 집은 기둥 위에 올렸어.', '비가 많이 와도 방이 안 젖어.'] },
          { id: 'florist', pass: '누가 좀 전해 주면 좋으련만.', name: '꽃 엮는 할머니', x: 0.4, w: 121, h: 300, lines: ['꽃을 실에 꿰어 엮는단다.', '부처님 앞에 올릴 꽃이지.'] },
          { id: 'cook', pass: '갓 찐 밥이 다 됐어요.', show: 'meal', name: '밥 짓는 아주머니', x: 0.51, w: 123, h: 305, lines: ['바나나잎에 밥을 담아 먹는단다.', '바나나와 코코넛도 먹어 보련?'],
            try: { id: 'eat-rice', verb: 'eat', name: '찐 쌀밥과 바나나', face: 'yum', sora: '밥이 고슬고슬해! 바나나는 달아.' } },
          { id: 'clothier', pass: '고운 두름치마 보고 가요.', name: '천 파는 아주머니', x: 0.62, w: 137, h: 299, lines: ['더운 땅이라 천을 둘러 입는단다.', '아이 것도 있어. 입어 보련?'],
            try: { id: 'wear-java', verb: 'wear', name: '자바의 옷', outfit: 'java', sora: '천을 빙 둘렀어! 시원해.', memo: '긴 천을 허리에 감아 치마처럼 입었단다. 더운 땅이라 얇은 무명을 썼지.' } },
          { id: 'farmer', pass: '영차, 올해도 잘 여물었네.', name: '볏단 진 농부', x: 0.73, w: 193, h: 310, lines: ['저 아래 논에서 벼를 거뒀단다.', '절 짓는 이들도 이 쌀을 먹었지.'] },
          { id: 'liongirl', pass: '쓱쓱, 이빨도 닦아 줄게.', name: '돌 사자 닦는 아이', x: 0.85, w: 106, h: 243, lines: ['계단을 지키는 돌 사자야.', '무섭게 생겼지만 물지는 않아.'] },
        ],
        spots: [
          // The smoking volcano and the temple in the try. (From and to are to be set to the picture.)
          { id: 'volcano', from: 0.25, to: 0.45, sora: '산에서 연기가 나!', memo: '불을 뿜는 산이란다. 절을 쌓은 돌이 그런 산에서 나온 돌이지.' },
          { id: 'temple', from: 0.6, to: 0.95, sora: '종 같은 탑이 잔뜩 있어!', memo: '천이백 해쯤 전에 막 다 지은 절이란다. 돌을 층층이 쌓아 올렸지.' },
        ],
      },
      {
        id: 'yard', name: '인도네시아 자바 보로부두르 돌 깎는 마당', short: '돌 깎는 마당', zoom: 1.073, ground: 0.764, scale: 0.628, air: 'chisels', floor: 'dirt',
        sora: '땅땅! 다들 돌을 깎고 있어!',
        people: [
          { id: 'hauler', pass: '영차, 무거운 돌을 나르자!', name: '돌 나르는 일꾼', x: 0.18, w: 140, h: 289, lines: ['냇바닥에서 돌을 날라 온단다.', '불 뿜는 산이 내려보낸 돌이지.'] },
          { id: 'fitter', pass: '턱과 홈이 꼭 맞아야지.', show: 'joint', pose: 'see-aha', sora: '돌과 돌이 꼭 맞게 끼워져!', memo: '돌 사이에 아무것도 바르지 않았단다. 턱과 홈을 파서 서로 끼워 맞췄지. 백만 덩이도 넘게 썼단다.', name: '돌 맞추는 석공', x: 0.29, w: 104, h: 294, lines: ['돌에 턱과 홈을 판단다.', '서로 끼우면 흔들리지 않지.'] },
          { id: 'sailor', pass: '돛은 이만큼 컸지.', show: 'ship', pose: 'see-wow', sora: '배 옆에 긴 나무가 달렸어!', memo: '절의 돌판에는 돛 단 배도 있단다. 배 옆에 긴 나무를 달아 파도에 넘어지지 않게 했지.', name: '뱃사람', x: 0.4, w: 111, h: 300, lines: ['내가 타던 배를 돌에 새겨 준단다.', '옆에 단 긴 나무가 배를 잡아 주지.'] },
          { id: 'shipcarver', pass: '돛을 조금만 더 쪼면 되겠다.', name: '배 새기는 이', x: 0.51, w: 132, h: 294, lines: ['돌판에 돛 단 배를 새긴단다.', '금을 먼저 긋고 정으로 쪼지.'] },
          { id: 'watergirl', pass: '물 왔어요, 물!', name: '물 긷는 아이', x: 0.62, w: 80, h: 223, lines: ['돌 깎는 어른들께 물을 날라.', '돌가루 때문에 목이 마르대.'] },
          { id: 'ropemaker', pass: '밧줄을 쉬지 않고 꼬는 중이란다.', name: '밧줄 꼬는 아주머니', x: 0.73, w: 123, h: 299, lines: ['야자 껍질의 실로 밧줄을 꼰단다.', '이 줄로 무거운 돌을 끌어 올리지.'] },
          { id: 'foreman', pass: '천천히, 천천히 당겨라!', name: '돌 마당의 우두머리', x: 0.85, w: 115, h: 320, lines: ['마지막 종 모양 탑을 올리는 중이란다.', '이 돌만 얹으면 다 짓는 거지.'] },
        ],
        spots: [],
      },
      {
        // No `floor`: the walk is paved with stone.
        id: 'gallery', name: '인도네시아 자바 보로부두르 맨 아래 층 돌길', short: '절의 돌길', zoom: 1.077, ground: 0.761, scale: 0.630, air: 'hush',
        sora: '벽에 그림이 끝도 없어!',
        people: [
          { id: 'pilgrim', pass: '한 걸음씩 천천히 올라가야지.', name: '순례 온 할아버지', x: 0.18, w: 104, h: 310, lines: ['해 도는 쪽으로 돌길을 돈단다.', '한 층을 다 돌면 위로 올라가지.'] },
          { id: 'reader', pass: '이 그림 다음은 저 그림이지.', show: 'panels', pose: 'see-aha', sora: '벽이 다 그림책이야!', memo: '벽의 돌판 그림은 이천육백 장도 넘는단다. 길을 따라 돌면서 차례로 보았지.', name: '그림 읽는 아주머니', x: 0.29, w: 127, h: 300, lines: ['벽의 그림이 이야기로 이어진단다.', '걸으면서 한 장씩 보는 거지.'] },
          { id: 'counter', pass: '그림이 너무 많아서 못 세겠어!', name: '그림 세는 아이', x: 0.4, w: 93, h: 232, lines: ['돌판에 코끼리도 있고 배도 있어.', '다 세려면 며칠은 걸리겠어.'] },
          { id: 'sweeper', pass: '쓱쓱, 돌가루가 아직 남았네.', name: '돌길 쓰는 아저씨', x: 0.51, w: 112, h: 318, lines: ['돌길을 날마다 쓴단다.', '돌 깎던 가루가 아직 남아 있거든.'] },
          { id: 'monk', pass: '오늘도 길이 조용하구나.', show: 'stupas', pose: 'see-wow', sora: '종 모양 탑이 빙 둘러섰어!', memo: '꼭대기 둥근 단에 종 모양 탑 일흔둘이 둘러서 있단다. 탑마다 부처님이 한 분씩 앉아 계시지.', name: '스님', x: 0.62, w: 104, h: 306, lines: ['나는 이 절에서 지내는 스님이란다.', '아침마다 이 길을 천천히 돈단다.'] },
          { id: 'offerer', pass: '꽃이 시들기 전에 올려야지.', name: '꽃 올리러 온 아주머니', x: 0.73, w: 101, h: 300, lines: ['부처님 앞에 꽃을 올리러 왔단다.', '먼 마을에서 이틀을 걸어왔지.'] },
          { id: 'finisher', pass: '잎 하나만 더 새기면 끝이다.', name: '마지막 손질하는 석공', x: 0.85, w: 106, h: 320, lines: ['돌판의 마지막 잎을 새기는 중이란다.', '이제 정을 내려놓을 때가 됐지.'] },
        ],
        spots: [],
      },
    ],
    // "The lotus basket" (core/tale.js; the storyboard of docs/신기한-사실.md): the grandmother
    // who strings flowers in the village has a basket of lotus for the monk up in the temple;
    // the foreman of the stone yard lets no one up the stair, for the stone of the last
    // bell-shaped tower is being hauled; the carver of the ship says to go round by the
    // walk, the way the sun goes, as everyone does; she hands the basket to the monk,
    // choosing what to say; and she looks at the panels along the wall and at the
    // bell-shaped towers standing round above.
    tale: {
      thing: true,
      ask: '다 지은 절의 꼭대기에는 무엇이 있을까?',
      gate: { scene: 'yard', open: 3, sora: '우두머리가 길을 막고 있어.' },
      steps: [
        {
          who: 'florist', goal: '마을 어귀의 꽃 엮는 할머니에게 가 보렴.', holds: '연꽃 바구니: 할머니가 들고 있음',
          lines: ['얘야, 부탁 하나 들어주련?', '부처님께 올릴 연꽃이란다. 나는 다리가 아파 못 오르지.', '절에 계신 스님께 전해 주렴.'],
          offer: { ask: '연꽃 바구니를 전해 줄까?', label: '내가 전해 줄게요' },
          errand: 'took',
        },
        {
          who: 'foreman', goal: '돌 마당 끝의 계단으로 가 보렴.', holds: '연꽃 바구니: 소라가 들고 있음',
          lines: ['멈춰라. 지금은 계단으로 못 간단다.', '마지막 탑의 돌을 끌어 올리는 중이라 위험하지.'],
          sora: '꽃을 전해야 하는데… 어? 누가 불러!',
        },
        {
          who: 'shipcarver', call: '얘, 어디로 가니?', goal: '배 새기는 이가 부른다. 가 보렴.', holds: '연꽃 바구니: 소라가 들고 있음',
          lines: ['스님을 찾니? 계단 말고 돌길로 가렴.', '해 도는 쪽으로 돌길을 따라 돌면 된단다. 다들 그렇게 돌지.', '우두머리 어른, 이 아이는 돌길로 보낼게요!'],
          after: [{ who: 'foreman', line: '돌길이라면 괜찮다. 저쪽으로 가렴.' }],
          sora: '돌길로 돌아가면 된대! 가자!',
        },
        {
          who: 'monk', goal: '돌길의 스님에게 연꽃 바구니를 전하렴.', holds: '연꽃 바구니: 소라가 들고 있음',
          lines: ['오, 고운 연꽃이로구나.'],
          choice: {
            ask: '바구니를 건네며 뭐라고 할까?',
            options: [
              { id: 'E1', label: '"할머니가 보냈어요"', sora: '마을의 꽃 엮는 할머니가 보내셨어요.', says: '그 할머니로구나. 고맙다, 얘야.' },
              { id: 'E2', label: '"이 꽃은 어디에 놓아요?"', sora: '이 꽃은 어디에 놓아요?', says: '부처님 앞에 올린단다. 고맙다.' },
            ],
          },
          errand: 'gave',
        },
        {
          who: 'monk', show: true, goal: '돌길 벽의 그림과 위의 탑들을 보렴.',
          lines: ['마침 잘 왔다. 벽의 그림을 따라 걸어 보렴.', '위도 보렴. 종 모양 탑들이 둘러서 있단다.'],
          sora: '탑이 빙 둘러섰어! 정말 많다!',
          errand: 'saw',
        },
      ],
      asides: [
        { who: 'florist', when: ['S1', 'S2', 'S3', 'S4'], lines: ['절은 돌 마당을 지나면 나온단다.', '꽃이 시들기 전에 가 주렴.'] },
        { who: 'florist', when: ['S5'], lines: ['전해 주었구나. 고맙다, 얘야.', '탑들도 보고 왔니? 참 곱지.'] },
      ],
      done: '연꽃 바구니를 전하고, 둘러선 종 모양 탑들을 보았다.',
    },
    errands: [
      { id: 'took', text: '연꽃 바구니를 받는다.', at: [] },
      { id: 'gave', text: '스님에게 연꽃 바구니를 전한다.', at: [] },
      { id: 'saw', text: '둘러선 종 모양 탑들을 본다.', at: [] },
    ],
    reply: '그 절은 천 년쯤 숲에 묻혀 있었단다. 꽃 냄새는 좋더냐.',
  },
  // The Sagrada Familia in Barcelona, November 1925, by day: the pinnacle of the tower of
  // Saint Barnabas is finished. Drawn as the careful landscapes of the young Miro (the
  // user's choice of five tries: the fifth). The pictures are in sagrada1925; the try is the
  // third scene ('nativity': the foot of the Nativity facade, with the school, the workshop
  // and the crane behind at the left), and the school and the workshop were ordered after
  // it as nearer views. Pale: the sky of the pictures is a bright blue of day.
  // Looked up on 2026.10.14 (docs/신기한-사실.md) and found so: the first stone of 1882 ("마흔
  // 해도 더 전"); the pinnacle of Saint Barnabas finished in November 1925, the other three
  // being built; the pinnacles stand for the mitre, crosier and ring of a bishop, with
  // broken Venetian glass, "Hosanna" under the pinnacle and "Sanctus" on the shaft; Gaudi
  // lives in a room by the workshop from 1925 and builds from plaster models more than from
  // drawings; the temple is built on gifts only (that Gaudi went asking is "전함": said as
  // "모으러 다니셨대"); the school of 1909, its roof of thin bricks in waves, for the workers'
  // children and the poor children of the quarter, meant to be pulled down one day.
  // Looked up while writing and found so: the pinnacle is of pieces of concrete cast
  // beforehand and covered with glass from Murano (upcommons.upc.edu): "틀에 부어 만든 조각";
  // the school taught by the Montessori method from 1915 ("스스로 골라서 공부해") and had
  // open-air classrooms under iron pergolas; the smock ("babi") over children's clothes is
  // in writing from 1918; workers' lunch of bread, llonganissa and olives (a memoir of
  // Tarragona, undated: to be looked at again).
  // Looked for and not found, so not said: pa amb tomaquet in 1925; how the glass was laid
  // on in 1925; "my client is not in a hurry".
  // From memory: the dress; the wooden crane with a wheel; masons with iron chisels; the
  // facade tells of the birth of Jesus; that Sanctus means "holy".
  // Made up: the errand of the lunch bundle, the boy at school and his father who lays the
  // glass, the master of the stone yard, the maker of plaster models who says to go through
  // the workshop, every other person. Gaudi is a spot only (the old man with a white beard
  // inside the workshop).
  // Kept out: Gaudi's death and the year 2026 (the square's card has them), the civil war,
  // the great middle towers, the Passion facade, iron cranes, tourists, trams, motor cars.
  sagrada: {
    first: '성당의 종탑 하나가 다 올라간 날이란다. 점심을 전해 주렴.',
    dir: 'sagrada1925', look: 'paper', pale: true,
    // The far picture a little milky, as air between (the user, 2026.10.15: "후경을 살짝 뿌옇게").
    haze: true,
    // (What is said of today: looked up on 2026.10.14, in docs/신기한-사실.md; the picture chosen by the user.)
    now: {
      photo: 'photo-now.webp', name: '사그라다 파밀리아의 지금 모습', when: '스페인 바르셀로나 · 2026년',
      text: [
        '1925년에 다 올린 바르나바 종탑은 지금도 탄생의 문 위에 서 있습니다. 2025년 11월 30일에 100주년을 기념했습니다.',
        '가우디는 이 성당의 지하 경당에 묻혀 있습니다. 2005년에 탄생의 문과 지하 경당이 유네스코 세계유산에 들어갔습니다.',
        '2010년 11월 7일, 교황 베네딕토 16세가 와서 성당을 하느님께 바치는 예식을 열었습니다.',
        '2026년 6월 10일, 교황 레오 14세가 172.5미터 높이의 예수의 탑을 축복했습니다. 이 성당에서 가장 높은 탑입니다.',
        '공사비는 손님들이 내는 입장료와 기부금으로 마련합니다. 2025년에는 500만 명쯤이 성당을 찾았습니다.',
        '2025년, 성당 측은 남은 공사를 10년쯤 뒤에 마칠 수 있다고 밝혔습니다. 지금은 영광의 문을 짓고 있습니다.',
      ],
      credit: '사진: ほっきー, 위키미디어 공용, 공개 저작물',
    },
    drawn: '그 무렵 젊은 미로의 풍경화처럼, 하나하나 또렷하게 그렸단다.',
    scenes: [
      {
        id: 'school', name: '스페인 바르셀로나 일꾼 아이들의 학교 앞', short: '학교 앞', zoom: 1.131, ground: 0.720, scale: 0.662, air: 'hush', floor: 'dirt',
        sora: '지붕이 물결처럼 출렁여!',
        people: [
          { id: 'teacher', pass: '오늘도 아이들이 다 왔구나.', name: '선생님', x: 0.18, w: 122, h: 320, lines: ['성당 일꾼의 아이들이 다니는 학교란다.', '동네 아이들도 함께 배우지.'] },
          { id: 'pupil', pass: '아빠가 점심을 두고 가셨어.', name: '창가의 아이', x: 0.29, w: 72, h: 254, lines: ['우리 아빠는 성당에서 일하셔.', '나는 지금 수업 중이라 못 나가.'] },
          { id: 'janitor', pass: '지붕이 오늘도 튼튼하구나.', show: 'roof', pose: 'see-aha', sora: '벽돌이 겹겹이 쌓였어!', memo: '얇은 벽돌을 여러 겹 겹쳐 물결치는 지붕을 얹었단다. 가볍게 지었는데도 튼튼하지.', name: '학교 문지기 할아버지', x: 0.4, w: 125, h: 312, lines: ['이 지붕은 얇은 벽돌을 겹쳐 쌓았단다.', '물결치게 지어서 아주 튼튼하지.'] },
          { id: 'baker', pass: '빵이 아직 따끈하구나.', show: 'meal', name: '빵 파는 아주머니', x: 0.51, w: 132, h: 291, lines: ['일꾼들은 빵에 소시지와 올리브를 먹는단다.', '한 조각 맛보련?'],
            try: { id: 'eat-bread', verb: 'eat', name: '빵과 소시지와 올리브', face: 'yum', sora: '올리브가 짭짤하고 빵이 고소해!' } },
          { id: 'seamstress', pass: '흰 덧옷을 다 지었구나.', name: '옷 짓는 아주머니', x: 0.62, w: 109, h: 308, lines: ['학교 갈 때는 옷 위에 흰 덧옷을 입는단다.', '네 것도 있어. 입어 보련?'],
            try: { id: 'wear-barcelona', verb: 'wear', name: '1920년대 바르셀로나의 옷', outfit: 'barcelona', sora: '흰 덧옷에 깃이 동그래!', memo: '그 무렵 아이들은 옷을 더럽히지 않게 덧옷을 입었단다.' } },
          { id: 'girl', pass: '오늘은 숫자 공부를 골랐어.', name: '공책 든 여자아이', x: 0.73, w: 80, h: 230, lines: ['우리 학교는 하고 싶은 공부를 골라서 해.', '바깥 그늘에서도 공부해.'] },
          { id: 'granny', pass: '저 탑이 언제 다 서려나.', name: '동네 할머니', x: 0.85, w: 125, h: 277, lines: ['저 성당은 사람들이 낸 돈으로만 짓는단다.', '나도 동전을 보탰지.'] },
        ],
        spots: [],
      },
      {
        id: 'workshop', name: '스페인 바르셀로나 성당 작업실과 돌 마당', short: '작업실과 돌 마당', zoom: 1.143, ground: 0.710, scale: 0.669, air: 'chisels', floor: 'dirt',
        sora: '창 안에 하얀 모형이 가득해!',
        people: [
          { id: 'plasterer', pass: '석고가 굳기 전에 부어야 해.', name: '석고 개는 일꾼', x: 0.18, w: 103, h: 302, lines: ['흰 석고 가루를 물에 개는 중이란다.', '금방 굳으니까 서둘러야 하지.'] },
          { id: 'modeler', pass: '이 꽃잎은 조금 더 둥글게 해야지.', show: 'model', pose: 'see-wow', sora: '성당이 작게 들어 있어!', memo: '이 성당은 도면보다 석고 모형으로 지었단다. 모형을 보며 돌을 깎았지.', name: '석고 모형 만드는 사람', x: 0.29, w: 101, h: 300, lines: ['석고로 성당을 작게 먼저 만든단다.', '석수들은 이 모형을 보고 돌을 깎지.'] },
          { id: 'draftsman', pass: '어른께 여쭤봐야겠어.', name: '도면 든 젊은 건축가', x: 0.4, w: 100, h: 309, lines: ['가우디 어른은 도면보다 모형을 보신단다.', '요즘은 공사장에서 지내시지.'] },
          { id: 'mason', pass: '이 모서리를 반듯하게 다듬어야지.', name: '돌 다듬는 석수', x: 0.51, w: 106, h: 300, lines: ['쇠 정과 망치로 돌을 다듬는단다.', '모형과 똑같은 모양이 되게 깎지.'] },
          { id: 'carter', pass: '이 돌은 저쪽 더미에 둬야지.', name: '돌 나르는 일꾼', x: 0.62, w: 92, h: 299, lines: ['다듬은 돌을 쌓아 두는 중이란다.', '큰 돌은 기중기로 들어 올리지.'] },
          { id: 'winder', pass: '밧줄을 꽉 잡아야 해.', name: '기중기 돌리는 일꾼', x: 0.73, w: 97, h: 320, lines: ['나무 기중기로 큰 돌을 들어 올린단다.', '바퀴를 돌리면 밧줄이 감기지.'] },
          { id: 'foreman', pass: '돌이 올라간다, 다들 물러서라.', name: '돌 마당 우두머리', x: 0.85, w: 92, h: 303, lines: ['나는 이 돌 마당을 맡은 사람이란다.', '돌이 떨어지면 크게 다치니 조심하렴.'] },
        ],
        spots: [
          // Gaudi, inside the workshop: he cannot be spoken to. (From and to are to be set to
          // the picture: the windows of the workshop.)
          { id: 'gaudi', from: 0.08, to: 0.42, sora: '창 안에 흰 수염 할아버지가 계셔!', memo: '가우디 어른이란다. 이 성당을 맡아 짓고, 공사장에서 사신단다.' },
        ],
      },
      {
        id: 'nativity', name: '스페인 바르셀로나 사그라다 파밀리아 탄생의 문 발치', short: '탄생의 문 발치', zoom: 1.095, ground: 0.747, scale: 0.641, air: 'hush', floor: 'dirt',
        sora: '탑 꼭대기가 반짝여!',
        people: [
          { id: 'breaker', pass: '이 유리는 예쁘게 깨졌구나.', show: 'trencadis', pose: 'see-aha', sora: '깨진 유리로 무늬를 만들어!', memo: '색유리를 깨뜨려 조각조각 붙였단다. 해가 비치면 꼭지가 반짝이지.', name: '유리 깨는 일꾼', x: 0.18, w: 114, h: 320, lines: ['색유리를 망치로 작게 깨뜨린단다.', '이 조각을 탑 꼭지에 붙이지.'] },
          { id: 'sculptor', pass: '아기의 얼굴은 웃게 새겨야지.', name: '돌 조각하는 사람', x: 0.29, w: 110, h: 309, lines: ['이 문에는 예수님이 태어난 이야기를 새긴단다.', '사람과 짐승과 꽃이 가득하지.'] },
          { id: 'rigger', pass: '비계를 한 칸 더 올려야 해.', name: '비계 일꾼', x: 0.4, w: 110, h: 318, lines: ['나무 비계를 타고 탑에 올라간단다.', '나머지 세 탑은 아직 짓는 중이지.'] },
          { id: 'donor', pass: '오늘도 조금 보태야지.', name: '기부함 앞 아주머니', x: 0.51, w: 107, h: 304, lines: ['이 성당은 모두가 낸 돈으로 짓는단다.', '가우디 어른도 돈을 모으러 다니셨대.'] },
          { id: 'tiler', pass: '점심때가 지났는데 배가 고프구나.', show: 'spire', pose: 'see-wow', sora: '꼭지가 주교님 모자 같아!', memo: '꼭지는 주교의 모자를 본떴단다. 꼭지 아래에 호산나, 몸통에 상투스라는 글자가 붙었지.', name: '타일 붙이는 아저씨', x: 0.62, w: 102, h: 310, lines: ['틀에 부어 만든 조각에 색유리를 붙인단다.', '그 조각을 탑 꼭대기로 올리지.'] },
          { id: 'waterboy', pass: '아저씨들께 물을 드려야지.', name: '물 나르는 아이', x: 0.73, w: 83, h: 253, lines: ['일하는 아저씨들께 물을 날라 드려.', '저 꼭대기까지는 못 올라가.'] },
          { id: 'oldman', pass: '살아서 이 탑이 완성되는 걸 보게 되는구나.', name: '구경하는 할아버지', x: 0.85, w: 127, h: 305, lines: ['첫 돌을 놓은 지 마흔 해도 더 지났단다.', '오늘 드디어 탑 하나가 다 섰구나.'] },
        ],
        spots: [],
      },
    ],
    // "The lunch bundle" (core/tale.js; the storyboard of docs/신기한-사실.md): the boy at the
    // school has the lunch his father left behind and cannot leave his lesson; the master of
    // the stone yard lets no one cross while the crane lifts a great stone; the maker of
    // plaster models says to go through the workshop, past the models hung from the ceiling;
    // she hands the lunch to the father who lays the glass at the foot of the Nativity facade,
    // choosing what to say; and she looks up at the pinnacle just finished and its letters.
    tale: {
      thing: true,
      ask: '성당의 탑 꼭대기는 왜 반짝일까?',
      gate: { scene: 'workshop', open: 3, sora: '우두머리가 막고 있어. 못 가.' },
      steps: [
        {
          who: 'pupil', goal: '학교 앞의 아이에게 가 보렴.', holds: '점심 꾸러미: 아이가 들고 있음',
          lines: ['얘, 부탁 하나 들어줄래?', '아빠가 점심을 두고 가셨어. 나는 수업 중이야.', '탄생의 문 앞에서 일하고 계시는 아빠께 전해 줘.'],
          offer: { ask: '점심 꾸러미를 전해 줄까?', label: '내가 전해 줄게' },
          errand: 'took',
        },
        {
          who: 'foreman', goal: '돌 마당을 지나 탄생의 문 쪽으로 가 보렴.', holds: '점심 꾸러미: 소라가 들고 있음',
          lines: ['멈춰라. 지금 큰 돌을 들어 올리는 중이다.', '돌 아래로는 아무도 못 지나간다.'],
          sora: '점심을 전해야 하는데… 어? 누가 불러!',
        },
        {
          who: 'modeler', call: '얘, 이쪽으로 오렴.', goal: '석고 모형 만드는 사람이 부른다. 가 보렴.', holds: '점심 꾸러미: 소라가 들고 있음',
          lines: ['탄생의 문에 간다고? 그럼 이리 오렴.', '작업실 안을 지나가면 돌 마당을 안 건너도 된단다.', '천장에 매단 모형은 건드리지 말고 가렴.'],
          after: [{ who: 'foreman', line: '작업실로 돌아간다면 가도 좋다.' }],
          sora: '작업실 안으로 지나가면 된대! 가자!',
        },
        {
          who: 'tiler', goal: '탄생의 문 앞의 타일 붙이는 아저씨에게 점심을 전하렴.', holds: '점심 꾸러미: 소라가 들고 있음',
          lines: ['어, 그건 내 점심 꾸러미잖니?'],
          choice: {
            ask: '점심 꾸러미를 건네며 뭐라고 할까?',
            options: [
              { id: 'E1', label: '"아들이 보냈어요"', sora: '학교에 있는 아드님이 보냈어요.', says: '그 녀석이 챙겨 주었구나. 고맙다, 얘야.' },
              { id: 'E2', label: '"무슨 일을 하세요?"', sora: '아저씨는 무슨 일을 하세요?', says: '탑 꼭지에 색유리 조각을 붙인단다.' },
            ],
          },
          errand: 'gave',
        },
        {
          who: 'tiler', show: true, goal: '다 올라간 종탑 꼭지를 올려다보렴.',
          lines: ['마침 잘 왔다. 저 꼭대기를 올려다보렴.', '오늘 저 탑의 꼭지가 다 올라갔단다.'],
          sora: '꼭대기에 글자도 붙어 있어!',
          errand: 'saw',
        },
      ],
      asides: [
        { who: 'pupil', when: ['S1', 'S2', 'S3', 'S4'], lines: ['아빠는 탄생의 문 앞에서 일하셔.', '돌 마당을 지나면 금방이야.'] },
        { who: 'pupil', when: ['S5'], lines: ['점심을 전해 줬구나! 고마워.', '이제 아빠가 배고프지 않으시겠다.'] },
      ],
      done: '점심을 전하고, 다 올라간 종탑 꼭지를 올려다보았다.',
    },
    errands: [
      { id: 'took', text: '점심 꾸러미를 받는다.', at: [] },
      { id: 'gave', text: '타일 붙이는 아저씨에게 점심을 전한다.', at: [] },
      { id: 'saw', text: '다 올라간 종탑 꼭지를 본다.', at: [] },
    ],
    reply: '가우디 어른이 다 지어진 걸 본 종탑은 그것 하나란다. 지금도 그대로 서 있지.',
  },
  // Jamaica on the evening of 29 February 1504 (Julian): a day of the Taino by St Ann's Bay,
  // where the two ships of Columbus have lain on the sand since June 1503, and the full moon
  // rising over the sea in total eclipse. Drawn as the Taino drew on the walls of caves, in
  // charcoal and red ochre (the user's choice of five tries: the first). The pictures are in
  // jamaica1504; the try itself is the third scene (the sandbar where the ships are seen,
  // after moonrise, the moon already red), and the village and the beach of the canoes were
  // ordered after it, at sunset. The sky of the pictures is the yellow wall itself: `pale`
  // (to be looked at again once the date is seen over it, as the scenes are evening).
  // Looked up on 2026.10.14 and found so: the ships lay on the north shore from June 1503
  // ("여덟 달째"); the islanders gave cassava, maize and fish for trinkets and grew tired of
  // it ("요즘은 다들 지쳐서 덜 가져간단다": nothing more); islanders paddled canoes to
  // Hispaniola with Diego Mendez ("지난여름 우리 사람들이 노를 저어 먼 섬으로 갔단다": no
  // name); the total eclipse was seen here on the evening of 29 February; Columbus knew of it
  // from an almanac ("달과 별이 언제 어디 있을지 적은 책": the chest in the try); the Taino
  // lived in thatched houses called bohio and slept in cotton hammocks (hamaca, from Taino);
  // cassava bread (casabe) was baked on a flat clay griddle after the root was grated and its
  // juice pressed out; canoes were dug out of one tree trunk.
  // From memory: the dress; shell beads; clay pots; the digging stick; spinning cotton; nets;
  // conch shells; that the moon in a total eclipse turns dark red.
  // Made up: the errand of the basket of bread, the grandmother who bakes, the grandson who
  // mends nets on the sandbar, the man hauling up a canoe who bars the way, the child picking
  // up shells who says to go round by the palm path, every other person.
  // Kept out: fighting, guns, horses, dogs; any belief of the Taino about the moon (people
  // only murmur and say the moon has turned red); the trick as the end (the tale ends with the
  // basket handed over and the red moon watched together); that Columbus pretended to pray;
  // Columbus except as a far figure on the ship (a spot), and the almanac only as a spot.
  lunar1504: {
    first: '보름달이 붉게 가려지는 저녁이란다. 빵 바구니를 전해 주렴.',
    intro: { title: '타이노 사람들', text: '타이노 사람들은 카리브 바다의 섬들에 살았단다. 카사바로 빵을 굽고 통나무배로 바다를 다녔지.' },
    dir: 'jamaica1504', look: 'paper', pale: true,
    // (What is said of today: looked up on 2026.10.14; the picture chosen by the user.)
    now: {
      photo: 'photo-now.webp', name: '세인트앤스 만의 지금 모습', when: '자메이카 세인트앤스 만 · 2023년',
      text: [
        '1503년 6월부터 이듬해 6월 말까지, 콜럼버스 일행 110명쯤은 이 만의 바닷가에 얹힌 배 두 척에서 지냈습니다.',
        '선원 디에고 멘데스가 카누를 타고 이웃 섬 히스파니올라로 건너가 도움을 청했고, 1504년 6월에 구조하는 배가 왔습니다.',
        '1509년, 스페인 사람들은 이 바닷가에 자메이카의 첫 도시 세비야 라 누에바를 세웠습니다. 그러나 1534년쯤 이 도시를 버리고 떠났습니다.',
        '타이노 마을 마이마와 스페인 도시의 터는 지금 세빌 유산 공원 안에 있습니다. 자메이카 국립유산재단이 지킵니다.',
        '세빌 유산 공원은 2009년에 유네스코 세계유산 후보 목록에 올랐습니다.',
        '그때 바닷가에 얹혀 있던 배 두 척은 아직 찾지 못했습니다. 500년 동안 바닷가 모양이 바뀌어, 학자들은 지금도 땅속을 뒤지고 있습니다.',
      ],
      credit: '사진: CaptJayRuffins, 위키미디어 공용, CC BY-SA 4.0',
    },
    drawn: '타이노 사람들이 동굴 벽에 숯과 황토로 그린 그림처럼 그렸단다.',
    scenes: [
      {
        id: 'village', name: '자메이카 세인트앤스 만 타이노 마을', short: '타이노 마을', zoom: 1.176, ground: 0.685, scale: 0.688, air: 'hush', floor: 'dirt',
        sora: '지붕이 둥근 풀집이야!',
        people: [
          { id: 'grandma', pass: '누가 바닷가에 좀 다녀오면 좋으련만.', name: '카사바 빵 굽는 할머니', x: 0.18, w: 122, h: 307, lines: ['저녁 빵을 막 구워 냈단다.', '손자가 바닷가에서 그물을 깁고 있지.'] },
          { id: 'grater', pass: '카사바 뿌리를 곱게 갈아야지.', show: 'buren', pose: 'see-aha', sora: '뿌리가 빵이 됐어!', memo: '카사바 뿌리를 갈아 즙을 짜내고, 넓적한 흙 판에 얇게 구웠단다. 그 빵을 카사베라 했지.', name: '카사바 가는 아주머니', x: 0.29, w: 112, h: 309, lines: ['카사바 뿌리를 갈아서 즙을 짠단다.', '흙 판에 얇게 펴서 구우면 빵이 되지.'] },
          { id: 'netbed', pass: '한 코씩 엮으면 침대가 되지.', show: 'hammock', pose: 'see-wow', sora: '그물에서 잠을 자!', memo: '타이노 사람들은 무명 그물 침대에서 잤단다. 아마카라 불렀지.', name: '그물 침대 짜는 할아버지', x: 0.4, w: 140, h: 316, lines: ['무명실로 그물 침대를 짠단다.', '우리는 아마카라고 부르지.'] },
          { id: 'potter', pass: '이 사발은 잘 구워지겠구나.', name: '흙 그릇 빚는 아주머니', x: 0.51, w: 103, h: 303, lines: ['물 담을 흙 사발을 빚는단다.', '마르면 불에 구워서 단단하게 하지.'] },
          { id: 'fishcook', pass: '물고기가 노릇하게 익었구나.', show: 'casabe', name: '물고기 굽는 아저씨', x: 0.62, w: 140, h: 320, lines: ['오늘 잡은 물고기를 굽는단다.', '카사바 빵과 같이 먹어 보련?'],
            try: { id: 'eat-casabe', verb: 'eat', name: '카사바 빵과 구운 물고기', face: 'yum', sora: '빵이 바삭하고 물고기는 고소해!' } },
          { id: 'spinner', pass: '실이 끊어지지 않게 살살.', name: '무명실 잣는 아주머니', x: 0.73, w: 103, h: 311, lines: ['무명실을 자아서 옷을 짓는단다.', '아이 옷도 있어. 입어 보련?'],
            try: { id: 'wear-taino', verb: 'wear', name: '타이노의 옷', outfit: 'taino', sora: '조개 목걸이가 달랑거려!', memo: '타이노 사람들은 무명 두름치마를 입고 조개 구슬을 걸었단다.' } },
          { id: 'farmer', pass: '내일은 저 밭을 일궈야지.', name: '밭에서 온 아저씨', x: 0.85, w: 148, h: 318, lines: ['밭에서 카사바 뿌리를 캐 왔단다.', '바다로 가는 길은 저 숲 너머에 있지.'] },
        ],
        spots: [],
      },
      {
        id: 'beach', name: '자메이카 세인트앤스 만 통나무배 바닷가', short: '통나무배 바닷가', zoom: 1.180, ground: 0.682, scale: 0.690, air: 'hush', floor: 'dirt',
        sora: '배가 모래 위에 누워 있어!',
        people: [
          { id: 'fisher', pass: '오늘은 물고기가 잘 잡혔구나.', name: '물고기 꿰미 든 어부', x: 0.18, w: 128, h: 275, lines: ['그물로 물고기를 넷이나 잡았단다.', '해가 지기 전에 돌아왔지.'] },
          { id: 'paddler', pass: '노가 손에 착 붙어야 하지.', name: '노 깎는 아저씨', x: 0.29, w: 109, h: 276, lines: ['나무를 깎아서 노를 만든단다.', '지난여름 우리 사람들이 노를 저어 먼 섬으로 갔지.'] },
          { id: 'canoeman', pass: '이 나무는 속이 단단하구나.', show: 'canoe', pose: 'see-wow', sora: '나무 한 그루가 배가 됐어!', memo: '통나무배는 큰 나무 한 그루를 통째로 파서 만들었단다. 불로 그을리며 속을 파냈지.', name: '통나무배 만드는 할아버지', x: 0.4, w: 159, h: 278, lines: ['큰 나무 한 그루를 통째로 판단다.', '불로 그을리고 돌도끼로 속을 파내지.'] },
          { id: 'shellgirl', pass: '이 소라고둥은 정말 크다!', name: '소라고둥 줍는 아이', x: 0.51, w: 107, h: 188, lines: ['물가에서 소라고둥을 줍고 있어.', '저녁 바다는 물이 빠져서 많이 보여.'] },
          { id: 'cornwife', pass: '오늘은 이만큼만 가져가야지.', name: '옥수수 바구니 인 아주머니', x: 0.62, w: 106, h: 320, lines: ['배에서 온 사람들에게 가져가던 옥수수란다.', '요즘은 다들 지쳐서 덜 가져간단다.'] },
          { id: 'netman', pass: '그물을 잘 개어 두어야지.', name: '그물 개는 아저씨', x: 0.73, w: 105, h: 275, lines: ['말린 그물을 개어 둔단다.', '내일 아침에 또 바다로 나가지.'] },
          { id: 'hauler', pass: '이 배를 조금만 더 끌어 올리자.', name: '통나무배 끄는 어른', x: 0.85, w: 125, h: 283, lines: ['배를 물 밖으로 끌어 올리는 중이란다.', '밤에 물이 들어도 떠내려가지 않게 하지.'] },
        ],
        spots: [],
      },
      {
        id: 'sandbar', name: '자메이카 세인트앤스 만 배 얹힌 모래톱', short: '배 얹힌 모래톱', zoom: 1.141, ground: 0.712, scale: 0.668, air: 'hush', floor: 'dirt',
        sora: '큰 배 두 척이 모래에 걸렸어!',
        people: [
          { id: 'elder', pass: '오늘 달은 빛이 이상하구나.', name: '바다를 보는 할아버지', x: 0.18, w: 103, h: 258, lines: ['저 배들은 여덟 달째 저기 있단다.', '바다를 건너온 사람들이 타고 왔지.'] },
          { id: 'torch', pass: '모두들 저 달을 좀 보시오.', name: '횃불 든 아저씨', x: 0.29, w: 117, h: 320, lines: ['어두워져서 횃불을 밝혔단다.', '오늘은 달빛이 어두워서 더 필요하구나.'] },
          { id: 'mother', pass: '아가야, 달이 붉어졌단다.', name: '아기 안은 어머니', x: 0.4, w: 97, h: 248, lines: ['아기를 재우러 나왔단다.', '바닷바람이 시원해서 아기가 잘 자지.'] },
          { id: 'grandson', pass: '할머니가 저녁을 보내 주실 텐데.', show: 'moon', pose: 'see-wow', sora: '보름달이 빨갛게 됐어!', memo: '달이 땅의 그림자에 다 가려지면 붉게 보인단다. 그날 저녁 바닷가에서 그것이 보였지.', name: '그물 깁는 손자', x: 0.51, w: 102, h: 216, lines: ['찢어진 그물을 깁고 있어.', '내일 아침에 이 그물로 물고기를 잡을 거야.'] },
          { id: 'pointer', pass: '달이 붉어졌어! 저기 좀 봐!', name: '달을 가리키는 아이', x: 0.62, w: 93, h: 202, lines: ['아까는 달이 하얗고 밝았어.', '그런데 지금은 붉게 어두워졌어.'] },
          { id: 'fruitwife', pass: '사람들이 다들 하늘을 보네.', name: '과일 바구니 든 아주머니', x: 0.73, w: 93, h: 250, lines: ['숲에서 과일을 따 오는 길이란다.', '모두 달을 보느라 걸음을 멈추었구나.'] },
          { id: 'watcher', pass: '배 위의 사람들도 달을 보는구나.', name: '배를 바라보는 어부', x: 0.85, w: 125, h: 263, lines: ['저 배는 벌레가 먹어서 바다에 못 뜬단다.', '그래서 배 위에 풀로 지붕을 얹었지.'] },
        ],
        spots: [
          // The chest with the book and the hourglass in the try. (From and to are to be set
          // to the picture.) Only what the book was; not what was done with it.
          { id: 'almanac', from: 0.59, to: 0.69, sora: '궤짝 위에 책이 있어!', memo: '배에서 온 사람들의 책이란다. 달과 별이 언제 어디 있을지 적혀 있었지.' },
          // Columbus, far off on the ships at the right of the try. Not drawn as a person to
          // speak to.
          { id: 'columbus', from: 0.72, to: 0.98, sora: '배 위에 누가 서 있어!', memo: '바다를 건너온 콜럼버스란다. 배가 망가져 여덟 달째 여기 묶여 있었지.' },
        ],
      },
    ],
    // "The basket of bread" (core/tale.js; the storyboard of docs/신기한-사실.md): the
    // grandmother who bakes cassava bread in the village has a basket of the evening's bread
    // for her grandson, who mends nets on the sandbar; a man hauling up a canoe bars the beach;
    // the child picking up conch shells says to go round by the palm path; she hands the basket
    // to the grandson, choosing what to say; and they watch the full moon over the sea turn red
    // while the people about them murmur.
    tale: {
      thing: true,
      ask: '오늘 저녁 보름달은 어떤 빛일까?',
      gate: { scene: 'beach', open: 3, sora: '배를 끄는 어른이 막고 있어. 못 가.' },
      steps: [
        {
          who: 'grandma', goal: '마을의 카사바 빵 굽는 할머니에게 가 보렴.', holds: '빵 바구니: 할머니가 들고 있음',
          lines: ['얘야, 부탁 하나 들어주련?', '저녁 빵을 구웠단다. 나는 불을 못 비우지.', '모래톱에서 그물 깁는 내 손자에게 전해 주렴.'],
          offer: { ask: '빵 바구니를 전해 줄까?', label: '내가 전해 줄게요' },
          errand: 'took',
        },
        {
          who: 'hauler', goal: '바닷가 끝의 배 끄는 어른에게 가 보렴.', holds: '빵 바구니: 소라가 들고 있음',
          lines: ['멈춰라. 여기로는 못 지나간단다.', '배를 끌어 올리는 중이라 길을 막고 있지.'],
          sora: '빵을 전해야 하는데… 어? 누가 불러!',
        },
        {
          who: 'shellgirl', call: '얘, 어디 가려고?', goal: '소라고둥 줍는 아이가 부른다. 가 보렴.', holds: '빵 바구니: 소라가 들고 있음',
          lines: ['모래톱에 간다고? 배가 길을 막았어.', '야자 숲길로 돌아가면 돼.', '아저씨, 얘는 숲길로 보낼게요!'],
          after: [{ who: 'hauler', line: '숲길이라면 가도 좋다.' }],
          sora: '야자 숲길로 돌아가래! 가자!',
        },
        {
          who: 'grandson', goal: '모래톱의 손자에게 빵 바구니를 전하렴.', holds: '빵 바구니: 소라가 들고 있음',
          lines: ['어, 우리 할머니 빵 바구니다!'],
          choice: {
            ask: '빵 바구니를 건네며 뭐라고 할까?',
            options: [
              { id: 'E1', label: '"할머니가 보내셨어"', sora: '할머니가 저녁 빵을 보내셨어.', says: '아직 따뜻하구나. 고마워.' },
              { id: 'E2', label: '"같이 먹을래?"', sora: '우리 같이 먹을래?', says: '좋아. 여기 앉아서 같이 먹자.' },
            ],
          },
          errand: 'gave',
        },
        {
          who: 'grandson', show: true, goal: '바다 위의 보름달을 보렴.',
          lines: ['저기 좀 봐. 달이 이상해.', '하얗던 보름달이 붉어졌어.'],
          sora: '사람들이 다 달을 보고 있어!',
          errand: 'saw',
        },
      ],
      asides: [
        { who: 'grandma', when: ['S1', 'S2', 'S3', 'S4'], lines: ['손자는 배 얹힌 모래톱에 있단다.', '바닷가를 지나면 나오지.'] },
        { who: 'grandma', when: ['S5'], lines: ['전해 주었구나. 고맙다, 얘야.', '오늘은 달이 붉다더구나. 너도 보았니?'] },
      ],
      done: '빵 바구니를 전하고, 바다 위의 보름달이 붉어지는 것을 보았다.',
    },
    errands: [
      { id: 'took', text: '빵 바구니를 받는다.', at: [] },
      { id: 'gave', text: '그물 깁는 손자에게 빵 바구니를 전한다.', at: [] },
      { id: 'saw', text: '보름달이 붉어지는 것을 본다.', at: [] },
    ],
    reply: '붉던 달은 그날 밤에 다시 하얘졌단다. 빵은 따뜻했니.',
  },
  // The Forbidden City in Beijing, the winter of 1420, on a clear day: the emperor has given
  // out that the new palace is finished. Drawn as a careful coloured court painting of the
  // Ming on silk (the user's choice of five tries: the fourth). The pictures are in
  // beijing1420; the try itself is the third scene (the front of the great hall), and the
  // yard where the timber is piled and the yard where the gold bricks are rubbed were ordered
  // after it. Pale: the sky of the pictures is tan silk left bare.
  // Looked up on 2026.10.14 and found so: the emperor gave out in the eleventh lunar month
  // of 1420 that the palace was finished, and Beijing became the capital on the New Year's
  // day of 1421 ("이듬해 설날부터 여기가 서울이란다"); the nanmu of the columns came mostly
  // from the south-west; the gold bricks of the great halls' floors were fired over months of
  // the clay of Suzhou; the great roofs are of yellow glazed tiles; small beast figures on the
  // ridges are in the Song building manual already and were settled in form under the Ming
  // and Qing (so the beast tile is told, with no number and no order).
  // Looked for and NOT found: that the name "紫禁城" was used in 1420. People say "새 궁",
  // "황궁"; only the scene names and grandmother's words say "자금성". The ice roads on record
  // are of 1557, so they are not told. The number of workers is not told.
  // From memory: that the timber came by rivers and the canal for months; that nanmu is hard
  // and does not rot; steamed buns, noodles and tea; the padded winter dress; that the blue
  // colour is ground from stone; that the beast tiles are thought to guard the roof.
  // Made up: the errand of the last beast tile, the tile maker, the man who keeps the yard of
  // the gold bricks, the timber carrier who shows the way under the covered walk, the roof
  // master, every other person; that gold bricks lie in a yard to be rubbed before they are
  // laid; that the emperor is seen far off on the terrace that day.
  // Kept out: the emperor except far off (a spot, no face); the fire of 1421, punishments,
  // eunuchs; anything of the Qing; the number and order of the beast tiles.
  forbiddenCity: {
    first: '자금성을 다 지은 겨울이란다. 짐승 기와를 전해 주렴.',
    dir: 'beijing1420', look: 'paper', pale: true,
    // (What is said of today: looked up on 2026.10.14; the picture chosen by the user.)
    now: {
      photo: 'photo-now.webp', name: '자금성의 지금 모습', when: '중국 베이징 · 2022년',
      text: [
        '마지막 황제 푸이는 1924년에 궁에서 쫓겨났습니다. 이듬해 1925년 10월 10일, 궁은 "고궁박물원"이라는 박물관이 되었습니다.',
        '궁 안에는 지금도 건물 980채가 남아 있습니다. 궁의 넓이는 72만 제곱미터입니다.',
        '1987년, 자금성은 유네스코 세계유산이 되었습니다. 옛 나무 건물이 세계에서 가장 많이 모여 남아 있는 곳으로 꼽힙니다.',
        '박물관이 가진 옛 물건은 2016년에 세어 보니 186만 점이 넘었습니다.',
        '1933년부터 전쟁을 피해 귀한 물건들을 상자에 담아 멀리 옮겼습니다. 그 가운데 일부는 지금 타이완 타이베이의 고궁박물원에 있습니다.',
        '2018년에는 1,700만 명 넘게 찾아왔습니다. 지금은 미리 예약해야 들어갈 수 있고, 하루에 4만 명까지 받습니다.',
      ],
      credit: '사진: N509FZ, 위키미디어 공용, CC BY-SA 4.0',
    },
    drawn: '명나라 궁정 화가의 그림처럼, 비단에 곱게 칠했단다.',
    scenes: [
      {
        id: 'timber', name: '명나라 베이징 자금성 나무 쌓은 마당', short: '나무 쌓은 마당', zoom: 1.117, ground: 0.730, scale: 0.654, air: 'hush', floor: 'dirt',
        sora: '나무 기둥이 엄청 굵어!',
        people: [
          { id: 'tilemaker', pass: '누가 좀 전해 주면 좋으련만.', name: '기와 굽는 이', x: 0.18, w: 114, h: 316, lines: ['가마에서 구운 기와를 실어 왔단다.', '누런 유약을 발라 구우면 금빛이 나지.'] },
          { id: 'carter', pass: '오늘은 바람이 몹시 차구나.', name: '나무 수레 끄는 일꾼', x: 0.29, w: 160, h: 320, lines: ['이 나무는 먼 서남쪽 산에서 왔단다.', '강과 물길로 여러 달을 실어 왔지.'] },
          { id: 'nanmuwright', pass: '이렇게 곧은 나무는 드물지.', show: 'nanmu', pose: 'see-wow', sora: '나무 한 그루가 기둥 하나래!', memo: '큰 전각의 기둥은 먼 서남쪽 산의 녹나무로 세웠단다.', name: '녹나무 고르는 목수', x: 0.4, w: 147, h: 313, lines: ['녹나무는 단단하고 잘 썩지 않는단다.', '큰 전각을 받치는 기둥이 되지.'] },
          { id: 'sawyer', pass: '톱날이 무뎌지기 전에 끝내야지.', name: '톱질하는 일꾼', x: 0.51, w: 127, h: 310, lines: ['둘이서 큰 톱을 당겨 나무를 켠단다.', '추운 날에도 톱질을 하면 땀이 나지.'] },
          { id: 'cook', pass: '만두가 다 쪄졌어요!', show: 'buns', name: '일꾼 밥 짓는 아주머니', x: 0.62, w: 115, h: 304, lines: ['김이 나는 만두와 따끈한 국수란다.', '추운 날엔 국물이 최고지. 먹어 보련?'],
            try: { id: 'eat-buns', verb: 'eat', name: '찐만두와 국수', face: 'yum', sora: '만두가 따끈따끈해! 국물도 뜨거워.' } },
          { id: 'tailor', pass: '바느질하다 손이 곱았네.', name: '솜옷 깁는 아주머니', x: 0.73, w: 122, h: 314, lines: ['솜을 두둑이 넣어 겨울옷을 짓는단다.', '아이 것도 있어. 입어 보련?'],
            try: { id: 'wear-mingwinter', verb: 'wear', name: '명나라의 겨울옷', outfit: 'mingwinter', sora: '솜옷이라 하나도 안 추워!', memo: '명나라 사람들은 겨울에 솜을 두둑이 넣은 옷을 입었단다.' } },
          { id: 'stoker', pass: '불 곁에서 손을 녹이고 가거라.', name: '화롯불 지키는 할아버지', x: 0.85, w: 118, h: 320, lines: ['입김이 하얗게 나오지? 날이 차단다.', '일꾼들이 여기서 손을 녹이고 가지.'] },
        ],
        spots: [],
      },
      {
        id: 'bricks', name: '명나라 베이징 자금성 금 벽돌 닦는 마당', short: '금 벽돌 닦는 마당', zoom: 1.162, ground: 0.696, scale: 0.680, air: 'hush', floor: 'dirt',
        sora: '벽돌이 거울처럼 반들반들해!',
        people: [
          { id: 'waterboy', pass: '물이 얼기 전에 날라야 해.', name: '물 나르는 아이', x: 0.18, w: 80, h: 237, lines: ['벽돌 닦을 물을 길어 날라요.', '날이 추워서 물통에 살얼음이 껴요.'] },
          { id: 'brickmaster', pass: '벽돌 한 장도 깨지면 안 되지.', show: 'brick', pose: 'see-aha', sora: '벽돌이 돌처럼 매끈해!', memo: '큰 전각 바닥의 금 벽돌은 쑤저우의 흙으로 몇 달에 걸쳐 구웠단다.', name: '금 벽돌 장인', x: 0.29, w: 116, h: 291, lines: ['이 벽돌은 쑤저우의 흙으로 구웠단다.', '몇 달에 걸쳐 천천히 구웠지.'] },
          { id: 'clerk', pass: '벽돌 수를 장부에 잘 적어야지.', name: '벽돌 세는 관리', x: 0.4, w: 120, h: 320, lines: ['나는 벽돌이 몇 장 왔는지 적는단다.', '이 벽돌은 큰 전각 바닥에 깔 것이지.'] },
          { id: 'rubber', pass: '반들반들해질 때까지 닦아야지.', name: '벽돌 닦는 아주머니', x: 0.51, w: 97, h: 293, lines: ['넓적한 돌로 벽돌 겉을 문지른단다.', '닦을수록 먹처럼 반들반들해지지.'] },
          { id: 'carrier', pass: '회랑 밑은 바람이 덜 부는구나.', name: '나무 나르는 일꾼', x: 0.62, w: 158, h: 294, lines: ['나는 회랑 밑으로 나무를 나른단다.', '마당을 안 밟고 돌아가는 길이지.'] },
          { id: 'bearer', pass: '벽돌 한 장이 꽤 무겁구나.', name: '벽돌 지는 일꾼', x: 0.73, w: 112, h: 283, lines: ['벽돌을 지게에 지고 전각으로 나른단다.', '한 장씩 조심조심 날라야 하지.'] },
          { id: 'keeper', pass: '닦은 벽돌은 밟지 마시오.', name: '마당 지키는 이', x: 0.85, w: 124, h: 316, lines: ['나는 이 마당을 지키는 사람이란다.', '닦아 놓은 벽돌을 밟으면 안 되지.'] },
        ],
        spots: [],
      },
      {
        id: 'hall', name: '명나라 베이징 자금성 큰 전각 앞', short: '큰 전각 앞', zoom: 1.116, ground: 0.731, scale: 0.653, air: 'palace', floor: 'dirt',
        sora: '지붕이 금빛이야! 두 겹이야!',
        people: [
          { id: 'sweeper', pass: '마당을 깨끗이 쓸어 둬야 해.', name: '마당 쓰는 아이', x: 0.18, w: 105, h: 271, lines: ['큰 전각 앞을 깨끗이 쓸어요.', '설날에 큰 의식이 열린대요.'] },
          { id: 'tilesorter', pass: '깨진 기와는 따로 골라 둬야지.', name: '기와 고르는 일꾼', x: 0.29, w: 120, h: 317, lines: ['지붕에 올릴 기와를 고른단다.', '누런 기와가 햇볕에 금빛으로 빛나지.'] },
          { id: 'painter', pass: '이 칸에는 금빛 선을 그어야지.', show: 'paint', pose: 'see-aha', sora: '들보에 용을 그리고 있어!', memo: '들보와 처마 밑에 푸른빛, 풀빛, 붉은빛으로 고운 무늬를 칠했단다.', name: '단청 칠하는 화공', x: 0.4, w: 127, h: 312, lines: ['들보에 푸른빛과 풀빛을 칠한단다.', '가는 붓으로 금빛 선을 긋지.'] },
          { id: 'mixer', pass: '물감을 곱게 개어 놓아야지.', name: '물감 개는 아이', x: 0.51, w: 98, h: 256, lines: ['선생님이 쓰실 물감을 개어요.', '푸른 물감은 돌을 갈아서 만들어요.'] },
          { id: 'roofer', pass: '마지막 기와가 아직 안 왔구나.', show: 'roof', pose: 'see-wow', sora: '처마 끝에 짐승이 줄 섰어!', memo: '처마 끝 지붕 마루에 작은 짐승 기와를 줄지어 올렸단다. 지붕을 지켜 준다고 여겼지.', name: '지붕 올리는 장인', x: 0.62, w: 127, h: 307, lines: ['나는 큰 전각의 지붕을 올린단다.', '마지막 기와 하나를 기다리는 중이지.'] },
          { id: 'official', pass: '설날 의식 준비를 서둘러야지.', name: '설날 의식 준비하는 관리', x: 0.73, w: 125, h: 320, lines: ['이듬해 설날부터 여기가 서울이란다.', '나라의 큰일을 이 궁에서 보게 되지.'] },
          { id: 'mason', pass: '흰 돌이 눈처럼 하얗구나.', name: '돌난간 닦는 석수', x: 0.85, w: 125, h: 299, lines: ['흰 돌로 다리와 난간을 깎았단다.', '먼지 하나 없이 닦아 두어야지.'] },
        ],
        spots: [
          // The terrace of the great hall in the try. (From and to are to be set to the
          // picture.) The emperor is not drawn and cannot be spoken to: far off, no face.
          { id: 'emperor', from: 0.66, to: 0.8, sora: '높은 단 위에 노란 옷이 보여!', memo: '황제란다. 새 궁을 다 지었다고 온 나라에 알렸지.' },
        ],
      },
    ],
    // "The last beast tile" (core/tale.js; the storyboard of docs/신기한-사실.md): the tile
    // maker has the last small beast tile for the eaves and cannot leave his cart; the man
    // who keeps the yard lets no one step on the gold bricks just rubbed; the timber carrier
    // says to go round under the covered walk; she hands the tile to the roof master,
    // choosing what to say; and she looks up at the yellow roof and the row of small beasts
    // at the end of the eaves.
    tale: {
      thing: true,
      ask: '처마 끝에는 무엇이 앉아 있을까?',
      gate: { scene: 'bricks', open: 3, sora: '마당 지키는 이가 막고 있어. 못 가.' },
      steps: [
        {
          who: 'tilemaker', goal: '나무 쌓은 마당의 기와 굽는 이에게 가 보렴.', holds: '짐승 기와: 기와 굽는 이가 들고 있음',
          lines: ['얘야, 부탁 하나 들어주련?', '처마 끝에 올릴 마지막 짐승 기와란다. 나는 수레를 못 비우지.', '큰 전각 앞의 지붕 장인에게 전해 주렴.'],
          offer: { ask: '짐승 기와를 전해 줄까?', label: '내가 전해 줄게요' },
          errand: 'took',
        },
        {
          who: 'keeper', goal: '마당 끝의 마당 지키는 이에게 가 보렴.', holds: '짐승 기와: 소라가 들고 있음',
          lines: ['멈춰라. 여기로는 못 지나간단다.', '금 벽돌을 막 닦아 놓아서 밟으면 안 돼.'],
          sora: '기와를 전해야 하는데… 어? 누가 불러!',
        },
        {
          who: 'carrier', call: '얘, 어디 가려고?', goal: '나무 나르는 일꾼이 부른다. 가 보렴.', holds: '짐승 기와: 소라가 들고 있음',
          lines: ['큰 전각에 간다고? 마당으로는 못 가.', '저 회랑 지붕 밑으로 돌아가면 돼.', '아저씨, 이 애는 회랑 밑으로 보낼게요!'],
          after: [{ who: 'keeper', line: '회랑 밑이라면 가도 좋다.' }],
          sora: '회랑 밑으로 돌아가래! 가자!',
        },
        {
          who: 'roofer', goal: '큰 전각 앞의 지붕 장인에게 짐승 기와를 전하렴.', holds: '짐승 기와: 소라가 들고 있음',
          lines: ['오, 마지막 짐승 기와로구나.'],
          choice: {
            ask: '짐승 기와를 건네며 뭐라고 할까?',
            options: [
              { id: 'E1', label: '"기와 굽는 분이 보냈어요"', sora: '기와 굽는 분이 보내셨어요.', says: '금빛이 곱게 났구나. 고맙다, 얘야.' },
              { id: 'E2', label: '"이걸 어디에 올려요?"', sora: '이 기와는 어디에 올려요?', says: '저 처마 끝에 줄지어 올린단다.' },
            ],
          },
          errand: 'gave',
        },
        {
          who: 'roofer', show: true, goal: '누런 지붕의 처마 끝을 올려다보렴.',
          lines: ['마침 잘 왔다. 저 지붕을 올려다보렴.', '처마 끝에 작은 짐승들이 줄지어 앉았지.'],
          sora: '지붕 끝에 짐승들이 앉았어!',
          errand: 'saw',
        },
      ],
      asides: [
        { who: 'tilemaker', when: ['S1', 'S2', 'S3', 'S4'], lines: ['지붕 장인은 큰 전각 앞에 있단다.', '금 벽돌 마당을 지나면 나오지.'] },
        { who: 'tilemaker', when: ['S5'], lines: ['전해 주었구나. 고맙다, 얘야.', '이제 지붕이 다 갖추어지겠구나.'] },
      ],
      done: '짐승 기와를 전하고, 처마 끝의 짐승 줄을 보았다.',
    },
    errands: [
      { id: 'took', text: '짐승 기와를 받는다.', at: [] },
      { id: 'gave', text: '지붕 장인에게 짐승 기와를 전한다.', at: [] },
      { id: 'saw', text: '처마 끝의 짐승 줄을 본다.', at: [] },
    ],
    reply: '그 궁은 지금도 그 자리에 있단다. 손은 시리지 않았니.',
  },
  // Florence on 25 March 1436, in the morning: the day Pope Eugenius IV consecrates the
  // cathedral, its great dome nearly finished. Drawn as the painted page of a Florentine
  // illuminated manuscript (the user's choice of five tries: the third). The pictures are in
  // florence1436; the try is the third scene ('door': the square before the cathedral door),
  // and the small square by the bakery and the yard of the dome workers were ordered after
  // it. The try draws the lantern on top of the dome: it is to be taken off by hand. The sky
  // of the pictures is a deep blue: no `pale`.
  // Looked up on 2026.10.14 (docs/신기한-사실.md) and found so: consecrated by Eugenius IV on
  // 25 March 1436, the first day of the year in Florence ("피렌체의 새해 첫날"); Dufay's
  // motet for the day sings of the golden rose the pope had given a week before (people call
  // it "새 노래", "장미 노래": no words of it are given); the dome nearly finished ("거의 다
  // 올렸다"); the herringbone bricks passing their weight to the ribs; two shells;
  // Brunelleschi's machine to hoist the bricks; red dome, eight white ribs.
  // Looked up while writing and found so: an elevated passageway was made from the cathedral
  // to Santa Maria Novella for the coming of the pope (archive of the Opera del Duomo, paid
  // 4 April 1436): the soldier keeps "교황님의 행렬이 지나갈 길". What it was made of was not
  // found (the order draws planks on posts hung with cloth: made up).
  // Looked for and not found, so not said: oxen at the hoist; the number of bricks; the
  // workers' lunch up on the dome.
  // From memory: Florence living by wool cloth; bread with olive oil; the dress (long gowns,
  // sleeves laced on at the shoulder, choirboys in white over dark); banners hung from the
  // windows on a feast day; the goldsmiths of Florence; that the side door of the cathedral
  // opens on the yard; that the bell tower rings on the day (the `court` air: far bells).
  // Made up: the errand of the bundle of music, the baker, the choirboy who left it, the
  // soldier who keeps the road, the brick carrier who says to go between the brick piles,
  // the choirmaster, the goldsmith's small copy of the rose, every other person.
  // Kept out: the pope and Brunelleschi but as far-off spots; the lantern; any words of the
  // song; oxen, the number of bricks, the lunch on the dome; Baroque buildings.
  duomo: {
    first: '피렌체 대성당을 봉헌하는 날이란다. 악보를 전해 주렴.',
    dir: 'florence1436', look: 'paper',
    // (What is said of today: looked up on 2026.10.14; the picture chosen by the user.)
    now: {
      photo: 'photo-now.webp', name: '피렌체 대성당의 지금 모습', when: '이탈리아 피렌체 · 2015년',
      text: [
        '1436년에 하느님께 바친 피렌체 대성당은 590년이 지난 지금도 도시 한가운데에 서 있습니다.',
        '대성당 앞면은 오래 다 꾸미지 못한 채로 있다가, 1876년부터 1887년까지 흰색, 초록색, 붉은색 대리석으로 새로 꾸몄습니다.',
        '돔 꼭대기의 작은 탑까지 높이는 114.5미터입니다. 돌과 벽돌로 쌓은 둥근 지붕 가운데 지금도 가장 큽니다.',
        '돔 안쪽에는 바사리와 추카리가 1572년부터 1579년까지 그린 "최후의 심판" 그림이 3,600제곱미터 넓이로 펼쳐져 있습니다.',
        '지금은 누구나 463계단을 걸어 올라 돔 꼭대기에서 피렌체 시내를 내려다볼 수 있습니다.',
        '대성당이 있는 피렌체 옛 도심은 1982년에 유네스코 세계유산이 되었습니다.',
      ],
      credit: '사진: Gary Campbell-Hall, 위키미디어 공용, CC BY 2.0',
    },
    drawn: '그 무렵 피렌체의 손으로 쓴 책에 든 그림처럼 그렸단다.',
    scenes: [
      {
        id: 'bakery', name: '이탈리아 피렌체 빵집 앞 작은 광장', short: '빵집 앞 광장', zoom: 1.060, ground: 0.774, scale: 0.621, air: 'market', floor: 'dirt',
        sora: '창마다 고운 천이 걸렸어!',
        people: [
          { id: 'banner', pass: '오늘은 집집마다 고운 천을 거는 날이지.', name: '창에 천 거는 아저씨', x: 0.18, w: 132, h: 320, lines: ['큰 잔칫날이라 창마다 천을 건단다.', '오늘 교황님이 대성당에 오시거든.'] },
          { id: 'flowergirl', pass: '꽃이 벌써 반이나 팔렸어.', name: '꽃 파는 아이', x: 0.29, w: 109, h: 259, lines: ['오늘은 피렌체의 새해 첫날이야.', '그래서 다들 꽃을 사 가.'] },
          { id: 'oilman', pass: '갓 짠 기름이 아주 고소하다오.', show: 'bread', name: '올리브 기름 장수', x: 0.4, w: 135, h: 312, lines: ['올리브를 짜서 얻은 기름이란다.', '빵을 찍어 먹어 보련?'],
            try: { id: 'eat-bread', verb: 'eat', name: '빵과 올리브 기름', face: 'yum', sora: '기름이 고소해! 빵은 쫄깃해.' } },
          { id: 'baker', pass: '누가 좀 전해 주면 좋으련만.', name: '빵 굽는 아주머니', x: 0.51, w: 127, h: 311, lines: ['새벽부터 화덕에 빵을 구웠단다.', '오늘은 손님이 많아 정신이 없구나.'] },
          { id: 'goldsmith', pass: '이 꽃잎은 조금 더 얇게 펴야겠군.', show: 'rose', pose: 'see-wow', sora: '장미가 금으로 되어 있어!', memo: '교황님이 한 주 전에 금 장미를 선물했단다. 오늘 부를 새 노래도 그 장미를 노래하지.', name: '금 세공사', x: 0.62, w: 110, h: 317, lines: ['교황님이 금 장미를 선물하셨단다.', '나도 본떠서 작은 것을 만들어 봤지.'] },
          { id: 'tailor', pass: '잔칫날에는 고운 옷을 입어야지.', name: '옷 파는 아주머니', x: 0.73, w: 147, h: 309, lines: ['잔칫날이라 고운 옷이 잘 팔린단다.', '아이 것도 있어. 입어 보련?'],
            try: { id: 'wear-florence', verb: 'wear', name: '피렌체의 옷', outfit: 'florence', sora: '소매를 어깨에 끈으로 묶었어!', memo: '피렌체 사람들은 소매를 따로 달아 어깨에서 끈으로 묶었단다.' } },
          { id: 'grandpa', pass: '오늘은 대성당에 꼭 가 봐야지.', name: '대성당 가는 할아버지', x: 0.85, w: 139, h: 318, lines: ['내가 아이였을 때부터 짓던 성당이란다.', '오늘 드디어 봉헌을 하는구나.'] },
        ],
        spots: [],
      },
      {
        id: 'yard', name: '이탈리아 피렌체 돔 일꾼들의 마당', short: '돔 일꾼들의 마당', zoom: 1.058, ground: 0.776, scale: 0.619, air: 'hush', floor: 'dirt',
        sora: '벽돌이 산처럼 쌓였어!',
        people: [
          { id: 'mixer', pass: '석회 반죽이 너무 되면 안 되지.', name: '석회 개는 일꾼', x: 0.18, w: 122, h: 281, lines: ['벽돌 사이에 바를 석회를 갠단다.', '물을 알맞게 부어야 잘 붙지.'] },
          { id: 'carpenter', pass: '밧줄이 닳지 않았나 살펴봐야지.', show: 'hoist', pose: 'see-wow', sora: '짐이 저 높이까지 올라가!', memo: '브루넬레스키는 벽돌을 끌어 올리는 기계를 만들었단다. 밧줄을 감아 무거운 짐을 높이 올렸지.', name: '기계 지키는 목수', x: 0.29, w: 113, h: 320, lines: ['이 기계로 벽돌을 돔 위까지 올린단다.', '사람이 지고 오르면 하루가 다 가지.'] },
          { id: 'carrier', pass: '벽돌 한 지게 더 나가요.', name: '벽돌 나르는 일꾼', x: 0.4, w: 106, h: 255, lines: ['나는 벽돌을 지고 기계까지 날라.', '이 마당 길은 내가 다 알아.'] },
          { id: 'mason', pass: '한 장 눕히고, 한 장 세워야지.', show: 'herring', pose: 'see-aha', sora: '벽돌이 생선뼈처럼 엇갈렸어!', memo: '벽돌을 생선뼈 꼴로 엇갈려 쌓았단다. 그러면 굳기 전에도 무게가 옆의 갈비뼈로 넘어가지.', name: '벽돌 쌓는 석수', x: 0.51, w: 108, h: 277, lines: ['돔의 벽돌은 이렇게 엇갈려 쌓는단다.', '굳기 전에도 미끄러지지 않지.'] },
          { id: 'roper', pass: '밧줄은 언제나 넉넉해야 하지.', name: '밧줄 감는 일꾼', x: 0.62, w: 106, h: 280, lines: ['기계에 쓸 굵은 밧줄을 감는단다.', '밧줄이 끊어지면 큰일이 나지.'] },
          { id: 'foreman', pass: '이제 정말 조금만 남았구나.', name: '돔 일꾼 우두머리', x: 0.73, w: 112, h: 282, lines: ['돔은 껍데기가 두 겹으로 되어 있단다.', '안쪽과 바깥쪽을 함께 쌓아 올렸지.'] },
          { id: 'guard', pass: '오늘은 이 길을 아무도 못 건넌다.', name: '행렬 길 지키는 병사', x: 0.85, w: 106, h: 300, lines: ['나는 오늘 행렬 길을 지킨단다.', '교황님이 저 높은 길로 지나가시지.'] },
        ],
        spots: [
          // The workshop hut of the new scene. (From and to are to be set to the picture.)
          // Brunelleschi is not drawn and cannot be spoken to.
          { id: 'brunelleschi', from: 0.37, to: 0.53, sora: '오두막에서 누가 도면을 봐!', memo: '돔 짓는 일을 맡은 브루넬레스키란다. 오늘은 바빠서 말을 걸 수 없지.' },
        ],
      },
      {
        id: 'door', name: '이탈리아 피렌체 대성당 문 앞 광장', short: '대성당 문 앞', zoom: 1.065, ground: 0.770, scale: 0.624, air: 'court', floor: 'dirt',
        sora: '돔이 엄청나게 커!',
        people: [
          { id: 'washer', pass: '행렬 오기 전에 빨래를 걷어야지.', name: '빨래 걷는 아주머니', x: 0.18, w: 98, h: 293, lines: ['오늘은 빨래를 일찍 걷어야 한단다.', '행렬이 오면 광장이 꽉 차거든.'] },
          { id: 'woolman', pass: '오늘은 천이 잘 팔리겠구먼.', name: '양털 천 장수', x: 0.29, w: 93, h: 320, lines: ['피렌체는 양털 천을 짜서 판단다.', '이 천은 멀리 다른 나라까지 가지.'] },
          { id: 'brickman', pass: '돔이 다 되면 이 벽돌도 치워야지.', name: '벽돌 지키는 일꾼', x: 0.4, w: 130, h: 318, lines: ['돔은 이제 거의 다 올렸단다.', '조금만 더 쌓으면 끝이 나지.'] },
          { id: 'choirboy', pass: '높은 소리를 틀리지 않아야 할 텐데.', name: '성가대 아이', x: 0.51, w: 75, h: 227, lines: ['오늘 성가대에서 새 노래를 불러.', '높은 소리는 내가 맡았어.'] },
          { id: 'choirmaster', pass: '악보가 어디로 갔을까.', show: 'dome', pose: 'see-wow', sora: '돔에 하얀 줄이 여덟 개야!', memo: '돔은 붉은 기와에 흰 갈비뼈가 여덟 줄이란다. 이날은 거의 다 올린 때였지.', name: '성가대 선생', x: 0.62, w: 127, h: 308, lines: ['오늘 처음 부르는 새 노래가 있단다.', '사람들은 장미 노래라고 부르지.'] },
          { id: 'belltower', pass: '종소리가 저 탑에서 나요.', name: '종탑 보는 아이', x: 0.73, w: 89, h: 216, lines: ['저 네모난 탑이 종탑이야.', '오늘은 종이 아주 많이 울려.'] },
          { id: 'granny', pass: '살아서 이날을 보는구나.', name: '세례당 앞 할머니', x: 0.85, w: 96, h: 289, lines: ['나는 저 세례당에서 세례를 받았단다.', '대성당이 다 되는 걸 보니 기쁘구나.'] },
        ],
        spots: [
          // The cathedral in the try. (From and to are to be set to the picture.) The pope is
          // not drawn and cannot be spoken to.
          { id: 'pope', from: 0.64, to: 0.9, sora: '대성당 안에 교황님이 계신대!', memo: '교황 에우제니오 4세란다. 오늘 이 대성당을 봉헌하지.' },
        ],
      },
    ],
    // "The bundle of music" (core/tale.js; the storyboard of docs/신기한-사실.md): the baker
    // in the small square has the music a choirboy left at her shop, a new song to be sung
    // for the first time today, and cannot leave her oven; the soldier keeps the road of the
    // pope's procession and lets no one cross; the brick carrier says to go between the brick
    // piles of the yard to the side door; she hands the music to the choirmaster, choosing
    // what to say; and she looks up at the nearly finished red dome with its white ribs.
    tale: {
      thing: true,
      ask: '거의 다 올린 돔은 어떻게 생겼을까?',
      gate: { scene: 'yard', open: 3, sora: '병사가 막고 있어. 못 가.' },
      steps: [
        {
          who: 'baker', goal: '빵집 앞의 빵 굽는 아주머니에게 가 보렴.', holds: '악보 묶음: 아주머니가 들고 있음',
          lines: ['얘야, 부탁 하나 들어주련?', '성가대 아이가 악보를 두고 갔단다.', '오늘 부를 노래야. 성가대 선생님께 전해 주렴.'],
          offer: { ask: '악보 묶음을 전해 줄까?', label: '내가 전해 줄게요' },
          errand: 'took',
        },
        {
          who: 'guard', goal: '돔 일꾼들의 마당을 지나 대성당 쪽으로 가 보렴.', holds: '악보 묶음: 소라가 들고 있음',
          lines: ['멈춰라. 교황님의 행렬이 지나갈 길이다.', '오늘은 아무도 이 길을 건너지 못한다.'],
          sora: '악보를 전해야 하는데… 어? 누가 불러!',
        },
        {
          who: 'carrier', call: '얘, 어디 가는데?', goal: '벽돌 나르는 일꾼이 부른다. 가 보렴.', holds: '악보 묶음: 소라가 들고 있음',
          lines: ['대성당에 간다고? 그럼 이리 와.', '벽돌 더미 사이로 가면 옆문이 나와.', '아저씨, 이 애는 마당 안쪽으로 보낼게요!'],
          after: [{ who: 'guard', line: '마당 안쪽으로 간다면 가도 좋다.' }],
          sora: '벽돌 더미 사이로 가면 된대! 가자!',
        },
        {
          who: 'choirmaster', goal: '대성당 문 앞의 성가대 선생님에게 악보를 전하렴.', holds: '악보 묶음: 소라가 들고 있음',
          lines: ['오, 악보로구나! 찾고 있던 참이란다.'],
          choice: {
            ask: '악보 묶음을 건네며 뭐라고 할까?',
            options: [
              { id: 'E1', label: '"빵집 아주머니가 보냈어요"', sora: '빵집 아주머니가 보내셨어요.', says: '아이가 두고 갔구나. 고맙다, 얘야.' },
              { id: 'E2', label: '"무슨 노래예요?"', sora: '이건 무슨 노래예요?', says: '오늘 처음 부르는 장미 노래란다.' },
            ],
          },
          errand: 'gave',
        },
        {
          who: 'choirmaster', show: true, goal: '거의 다 올린 돔을 올려다보렴.',
          lines: ['마침 잘 왔다. 저 돔을 올려다보렴.', '붉은 지붕에 흰 갈비뼈가 여덟 줄이란다.'],
          sora: '돔이 하늘을 다 덮을 것 같아!',
          errand: 'saw',
        },
      ],
      asides: [
        { who: 'baker', when: ['S1', 'S2', 'S3', 'S4'], lines: ['성가대 선생님은 대성당 문 앞에 계신단다.', '돔 일꾼들의 마당을 지나가렴.'] },
        { who: 'baker', when: ['S5'], lines: ['전해 주었구나. 고맙다, 얘야.', '이제 그 아이도 마음 놓고 노래하겠구나.'] },
      ],
      done: '악보를 전하고, 거의 다 올린 돔을 올려다보았다.',
    },
    errands: [
      { id: 'took', text: '악보 묶음을 받는다.', at: [] },
      { id: 'gave', text: '성가대 선생님에게 악보를 전한다.', at: [] },
      { id: 'saw', text: '거의 다 올린 돔을 올려다본다.', at: [] },
    ],
    reply: '그 돔은 지금도 피렌체 하늘에 그대로 서 있단다.',
  },
  // The shipyard by the river at Nanjing, the summer of 1405, in the morning: the great ships
  // of Zheng He make ready for the first voyage. Drawn as an ink and light-colour painting of
  // the Zhe school of early Ming on tan silk (the user's choice of five tries: the fifth). The
  // pictures are in nanjing1405; the try is the third scene ('dock': the wharf where the great
  // ship is moored), and the riverbank in front of the shipyard and the front of the
  // storehouse were ordered after it. Pale: the sky of the pictures is tan silk left bare.
  // Looked up on 2026.10.14 (docs/신기한-사실.md) and found so: the fleet was built in the
  // shipyards by the river at Nanjing; more than three hundred ships and twenty thousand men;
  // the length of the largest ship is disputed (never a number: "이렇게 큰 배").
  // Looked up while writing and found so: the navigators used compasses, a needle floating in
  // water in a round box (a "wet compass"), and the stars by night; silks and porcelain went
  // with the fleet; the sails of Chinese ships were of bamboo woven like matting; the number
  // of masts is disputed (never a number: "돛대가 여럿"); the fleet left in the autumn of 1405
  // (the square's day is the edict: so "곧 떠날", "채비").
  // From memory: red sails stiffened with bamboo battens; seams filled before launching
  // ("틈을 메운다" only); ropes of hemp; steamed buns and tea; the dress of early Ming; that
  // the ship is steered with one great rudder at the stern; that rice and water are loaded.
  // Made up: the errand of the blue-and-white jar, the woman who wraps the dishes, the guard of
  // the wharf road who stops all while the great rudder is hoisted, the rope maker who sends
  // her over the plank bridge, the clerk of the cargo, every other person.
  // The storyboard has the one who asks in the storehouse (the second scene): she is put
  // there, before the guard; the first scene has no part in the tale.
  // Kept out: numbers of length and masts; the giraffe; fighting; the queue of Qing; European
  // ships. Zheng He is a far place on the high deck (a spot), not one to talk to.
  zhenghe: {
    first: '정화의 큰 배들이 바다로 떠날 채비를 한단다. 그릇을 전해 주렴.',
    dir: 'nanjing1405', look: 'paper', pale: true,
    // (What is said of today: looked up on 2026.10.14; the picture chosen by the user.)
    now: {
      photo: 'photo-now.webp', name: '난징 보선창 터의 지금 모습', when: '중국 난징 · 2011년',
      text: [
        '조선소에는 장강을 따라 배를 짓는 물길이 일곱 개 있었습니다. 지금은 넷째, 다섯째, 여섯째 물길 셋이 남아 있습니다.',
        '2003년과 2004년에 여섯째 물길을 파 보니, 배 짓는 연장과 배의 부품 같은 옛 물건이 1,000점 넘게 나왔습니다.',
        '여섯째 물길은 길이가 421미터, 너비가 41미터입니다. 넷째와 다섯째 물길은 파지 않고 그대로 둡니다.',
        '1957년에는 이 조선소 터에서 배의 키를 돌리는 11.07미터 길이의 나무 기둥이 나왔습니다. 지금은 베이징의 중국 국가박물관에 있습니다.',
        '난징시는 정화가 첫 바닷길을 떠난 지 600년이 되는 해를 기리려고 이 공원을 만들었습니다.',
        '사진의 배는 여섯째 물길에 새로 지어 띄운 보물선입니다. 이 배의 길이는 71미터입니다.',
      ],
      credit: '사진: Vmenkov, 위키미디어 공용, CC BY-SA 3.0',
    },
    drawn: '명나라 때의 강 그림처럼, 누런 비단에 먹과 엷은 색으로 그렸단다.',
    scenes: [
      {
        id: 'yard', name: '명나라 난징 조선소 앞 강가', short: '조선소 앞 강가', zoom: 1.103, ground: 0.741, scale: 0.646, air: 'hush', floor: 'dirt',
        sora: '강가에서 배를 짓고 있어!',
        people: [
          { id: 'sawyer', pass: '이 널빤지는 배 옆구리에 붙일 거야.', name: '나무 켜는 일꾼', x: 0.18, w: 106, h: 286, lines: ['통나무를 톱으로 켜서 널빤지를 만든단다.', '두 사람이 마주 잡고 당기지.'] },
          { id: 'caulker', pass: '물이 새면 큰일이니 꼼꼼히 메워야지.', name: '배 틈 메우는 일꾼', x: 0.29, w: 102, h: 285, lines: ['널빤지 사이의 틈을 메운단다.', '틈이 없어야 바다에서도 물이 안 새지.'] },
          { id: 'ruddersmith', pass: '이 키는 내가 깎은 것 가운데 가장 크다.', show: 'rudder', pose: 'see-wow', sora: '키가 어른보다 몇 배나 커!', memo: '배의 방향을 트는 키란다. 큰 배에는 이렇게 큰 키가 달렸지.', name: '키 만드는 목수', x: 0.4, w: 124, h: 276, lines: ['나는 배의 방향을 트는 키를 만든단다.', '배가 크니 키도 이렇게 커야 하지.'] },
          { id: 'sailmaker', pass: '대나무 살을 한 줄 더 대야겠어.', name: '돛 엮는 아주머니', x: 0.51, w: 107, h: 269, lines: ['돛에 대나무 살을 대어 엮는단다.', '바람이 세도 돛이 찢어지지 않지.'] },
          { id: 'tailor', pass: '여름에는 얇은 옷이 시원하지.', name: '옷 짓는 아주머니', x: 0.62, w: 106, h: 268, lines: ['뱃사람들이 입을 옷을 짓는단다.', '아이 옷도 있어. 입어 보련?'],
            try: { id: 'wear-ming', verb: 'wear', name: '명나라의 옷', outfit: 'ming', sora: '치마에 주름이 잔뜩 잡혔어!', memo: '명나라 여자들은 오른쪽으로 여민 웃옷에 긴 치마를 입었단다.' } },
          { id: 'watcher', pass: '저 배는 언제 다 지어질까?', name: '배 구경하는 아이', x: 0.73, w: 80, h: 192, lines: ['나는 날마다 배를 구경하러 와.', '다 지은 배는 부두에 매여 있어.'] },
          { id: 'ferryman', pass: '오늘은 강물이 잔잔하구나.', name: '나룻배 사공 할아버지', x: 0.85, w: 118, h: 320, lines: ['이 강은 아주 넓고 길단다.', '강을 따라 내려가면 바다가 나오지.'] },
        ],
        spots: [],
      },
      {
        id: 'store', name: '명나라 난징 조선소 짐 싣는 창고 앞', short: '짐 싣는 창고 앞', zoom: 1.125, ground: 0.724, scale: 0.659, air: 'market', floor: 'dirt',
        sora: '창고에 짐이 가득 쌓였어!',
        people: [
          { id: 'wrapper', pass: '누가 이 그릇을 배까지 가져다주면 좋겠는데.', name: '그릇 싸는 아주머니', x: 0.18, w: 106, h: 305, lines: ['그릇이 깨지지 않게 볏짚으로 싼단다.', '바다는 멀고 배는 많이 흔들리지.'] },
          { id: 'counter', pass: '한 장, 두 장, 금 간 것은 없구나.', show: 'porcelain', pose: 'see-aha', sora: '흰 그릇에 푸른 꽃이 피었어!', memo: '흰 바탕에 푸른 무늬를 그린 청화 백자란다. 비단과 함께 배에 실었지.', name: '그릇 세는 일꾼', x: 0.29, w: 117, h: 320, lines: ['배에 실을 청화 백자를 센단다.', '비단도 저렇게 잔뜩 싣는단다.'] },
          { id: 'bunman', pass: '찐빵이 막 쪄졌어요, 따뜻할 때 드세요.', show: 'meal', name: '찐빵 파는 아저씨', x: 0.4, w: 143, h: 302, lines: ['일꾼들이 아침으로 찐빵을 먹는단다.', '하나 먹어 보련? 차도 있단다.'],
            try: { id: 'eat-ming-bun', verb: 'eat', name: '찐빵과 차', face: 'yum', sora: '찐빵이 폭신하고 차는 따뜻해!' } },
          { id: 'teagirl', pass: '찻잔을 떨어뜨리지 않게 천천히 가야지.', name: '차 따르는 아이', x: 0.51, w: 92, h: 227, lines: ['나는 아빠 일을 도와 차를 따라.', '일꾼 아저씨들이 차를 아주 좋아해.'] },
          { id: 'roper', pass: '밧줄은 세 가닥을 꼬아야 튼튼해.', name: '밧줄 꼬는 일꾼', x: 0.62, w: 163, h: 315, lines: ['배에 쓸 굵은 밧줄을 꼰단다.', '돛을 올릴 때도 닻을 내릴 때도 쓰지.'] },
          { id: 'porter', pass: '물통이 가득 차서 어깨가 무겁구나.', name: '물통 나르는 일꾼', x: 0.73, w: 220, h: 301, lines: ['배에 실을 물을 나른단다.', '바다에서는 마실 물이 귀하지.'] },
          { id: 'guard', pass: '키가 다 올라갈 때까지 아무도 못 지나간다.', name: '부두 길 지키는 사람', x: 0.85, w: 121, h: 320, lines: ['나는 부두로 가는 길을 지킨단다.', '큰 짐을 올릴 때는 길을 막아야 하지.'] },
        ],
        spots: [],
      },
      {
        id: 'dock', name: '명나라 난징 큰 배가 매인 부두', short: '큰 배가 매인 부두', zoom: 1.076, ground: 0.762, scale: 0.630, air: 'hush', floor: 'wood',
        sora: '돛이 하늘까지 닿을 것 같아!',
        people: [
          { id: 'rigger', pass: '이 줄을 단단히 매어야 돛이 바로 서.', name: '돛줄 매는 선원', x: 0.18, w: 137, h: 265, lines: ['돛을 올리고 내리는 줄을 맨단다.', '줄이 아주 많아서 헷갈리면 안 되지.'] },
          { id: 'navigator', pass: '바늘이 오늘도 같은 쪽을 가리키는구나.', show: 'compass', pose: 'see-aha', sora: '물 위에 뜬 바늘이 길을 알려 줘!', memo: '물에 띄운 바늘로 방향을 알았단다. 밤에는 별을 보고 뱃길을 찾았지.', name: '뱃길 보는 선원', x: 0.29, w: 122, h: 303, lines: ['나는 바다에서 뱃길을 찾는단다.', '흐린 날에는 이 바늘을 보고 간단다.'] },
          { id: 'anchorman', pass: '닻줄이 닳은 데가 없는지 봐야지.', name: '닻 살피는 선원', x: 0.4, w: 131, h: 251, lines: ['배를 세울 때는 닻을 내린단다.', '닻이 무거워야 배가 떠내려가지 않지.'] },
          { id: 'ricecarrier', pass: '쌀자루를 배에 싣는 것도 이제 거의 다 했어.', name: '쌀자루 나르는 일꾼', x: 0.51, w: 140, h: 283, lines: ['배에 쌀을 잔뜩 싣는단다.', '사람이 많으니 먹을 것도 많아야 하지.'] },
          { id: 'clerk', pass: '그릇이 하나 모자라는데 어디 있을까.', show: 'sail', pose: 'see-wow', sora: '돛대가 여럿이고 돛이 다 빨개!', memo: '돛에 대나무 살을 대어 여러 칸으로 나눴단다. 큰 배에는 돛대가 여럿이었지.', name: '짐 맡는 서기', x: 0.62, w: 118, h: 292, lines: ['나는 배에 싣는 짐을 장부에 적는단다.', '무엇을 얼마나 실었는지 다 적어야 하지.'] },
          { id: 'farewell', pass: '먼 바다까지 가도 꼭 무사히 돌아와요.', name: '배웅하는 아주머니', x: 0.73, w: 108, h: 259, lines: ['남편이 이 배를 타고 바다로 간단다.', '떠날 날이 머지않아 보따리를 쌌지.'] },
          { id: 'flagman', pass: '깃발이 바람에 잘 날려야 할 텐데.', name: '깃발 다는 선원', x: 0.85, w: 122, h: 320, lines: ['돛대 끝에 붉은 깃발을 단단다.', '바람이 어느 쪽에서 부는지 알려 주지.'] },
        ],
        spots: [
          // The high stern deck of the great ship in the try. (From and to are to be set to the
          // picture.) Zheng He is not drawn and cannot be spoken to.
          { id: 'zhenghe', from: 0.8, to: 0.97, sora: '배 위 높은 곳에 누가 서 계신대!', memo: '정화 장군이란다. 이 큰 배들을 이끄는 사람이지.' },
        ],
      },
    ],
    // "The blue-and-white jar" (core/tale.js; the storyboard of docs/신기한-사실.md): the woman
    // who wraps the dishes in the storehouse has one jar wrapped in straw for the clerk of the
    // cargo, whose ship will soon leave; the guard of the wharf road lets no one by while the
    // great rudder is hoisted onto a ship; the rope maker says to go round by the plank bridge
    // for loading; she hands the jar to the clerk, choosing what to say; and she looks up at
    // the great ship with its many masts and red sails.
    tale: {
      thing: true,
      ask: '이렇게 큰 배는 어떻게 생겼을까?',
      gate: { scene: 'store', open: 3, sora: '아저씨가 막고 있어. 못 가.' },
      steps: [
        {
          who: 'wrapper', goal: '창고 앞의 그릇 싸는 아주머니에게 가 보렴.', holds: '그릇: 아주머니가 들고 있음',
          lines: ['얘야, 부탁 하나 들어주련?', '이 청화 백자 하나를 빠뜨리고 못 실었단다.', '부두의 짐 맡는 서기님께 전해 주렴.'],
          offer: { ask: '볏짚에 싼 그릇을 전해 줄까?', label: '내가 전해 줄게요' },
          errand: 'took',
        },
        {
          who: 'guard', goal: '부두로 가는 길로 가 보렴.', holds: '그릇: 소라가 들고 있음',
          lines: ['멈춰라. 지금 큰 키를 배에 달아 올리는 중이다.', '떨어지면 위험하니 이 길로는 못 지나간다.'],
          sora: '그릇을 전해야 하는데… 어? 누가 불러!',
        },
        {
          who: 'roper', call: '얘, 부두에 가려고?', goal: '밧줄 꼬는 일꾼이 부른다. 가 보렴.', holds: '그릇: 소라가 들고 있음',
          lines: ['부두에 가려면 이쪽으로 오렴.', '짐 나르는 널빤지 다리로 돌아가면 된단다.', '아저씨, 이 아이는 다리로 돌아갈게요!'],
          after: [{ who: 'guard', line: '널빤지 다리로 간다면 가도 좋다.' }],
          sora: '널빤지 다리로 돌아가면 된대! 가자!',
        },
        {
          who: 'clerk', goal: '부두의 짐 맡는 서기에게 그릇을 전하렴.', holds: '그릇: 소라가 들고 있음',
          lines: ['오, 모자라던 그릇이 여기 있었구나.'],
          choice: {
            ask: '그릇을 건네며 뭐라고 할까?',
            options: [
              { id: 'E1', label: '"아주머니가 보냈어요"', sora: '창고의 그릇 싸는 아주머니가 보내셨어요.', says: '하나도 안 깨졌구나. 고맙다, 얘야.' },
              { id: 'E2', label: '"이 그릇은 어디 가요?"', sora: '이 그릇은 어디로 가요?', says: '바다 건너 먼 나라에 선물로 간단다.' },
            ],
          },
          errand: 'gave',
        },
        {
          who: 'clerk', show: true, goal: '큰 배의 돛대와 돛을 올려다보렴.',
          lines: ['마침 잘 왔다. 저 배를 올려다보렴.', '돛대가 여럿이고 돛은 대나무 살을 댔단다.'],
          sora: '이렇게 큰 배는 처음 봐!',
          errand: 'saw',
        },
      ],
      asides: [
        { who: 'wrapper', when: ['S1', 'S2', 'S3', 'S4'], lines: ['서기님은 큰 배 앞 부두에 계신단다.', '이 길 끝에서 부두로 나가면 된단다.'] },
        { who: 'wrapper', when: ['S5'], lines: ['전해 주었구나. 고맙다, 얘야.', '그 그릇도 먼 바다를 건너가겠구나.'] },
      ],
      done: '그릇을 전하고, 돛대가 여럿인 큰 배를 올려다보았다.',
    },
    errands: [
      { id: 'took', text: '볏짚에 싼 그릇을 받는다.', at: [] },
      { id: 'gave', text: '짐 맡는 서기에게 그릇을 전한다.', at: [] },
      { id: 'saw', text: '큰 배의 돛대와 붉은 돛을 본다.', at: [] },
    ],
    reply: '그 배들은 바다 건너 아주 먼 나라까지 갔다가 돌아왔단다.',
  },
  // The Crystal Palace in Hyde Park, London, on 1 May 1851: Queen Victoria opens the Great
  // Exhibition; a little rain in the morning, then the sun. Drawn as a very careful oil
  // painting of the young English painters of the 1850s (the user's choice of five tries:
  // the fourth). The pictures are in london1851; the try itself is the third scene (the
  // gravel walk before the palace), and the road before the park gate and the shore of the
  // Serpentine were ordered after it. The try's big fountain outside is to be taken out by
  // hand (flower beds there). Pale: the sky of the pictures is a light blue with white clouds.
  // Looked up on 2026.10.14 and found so: the queen opened the exhibition that day; her
  // journal says a little rain fell as they set out and the sun came out as they neared the
  // building; only season ticket holders went in that day, and the park was full; the choir
  // sang Handel's "Hallelujah" and the great organ was played; cast iron, wood and sheet glass,
  // put up in less than a year; Paxton, once the gardener of Chatsworth, took the design from
  // his glass house for the giant water lily; the middle was raised as a round arched roof to
  // take in the big elms of the park; the glass fountain stood inside, in the middle; weekday
  // tickets came down to one shilling on 26 May ("이달 말부터"); Bath buns, lemonade and other
  // drinks were sold inside, and beer, wine and spirits were not (Wikipedia, "Bath bun";
  // Tallis, 1851).
  // Looked for and NOT found: that buns and lemonade were sold in the park outside (the
  // baker's buns are her own; only "inside they sell them too" is said).
  // From memory: the dress of 1851; the blue coat and tall hat of the London police; crossing
  // sweepers and flower girls; flags along the roof; that things were still being carried in
  // on the day; that the queen came by carriage from her palace.
  // Made up: the errand of the lunch bundle, the baker, the guidebook seller, the policeman
  // who keeps the queen's road, the flower girl who shows the way along the lake, every other
  // person.
  // Kept out: the queen, Prince Albert, Paxton and Wellington except far off (spots, no face);
  // the guns, the sparrows and the sparrowhawks, the stranger in Chinese dress, the
  // Koh-i-Noor, the fire of 1936; the number of people; "dome"; one-shilling day on this day.
  crystalPalace: {
    first: '유리 집에서 박람회를 여는 날이란다. 박람회가 잘 열리도록 도와주렴.',
    dir: 'london1851', look: 'paper', pale: true,
    // (What is said of today: looked up on 2026.10.14; the picture chosen by the user.)
    now: {
      photo: 'photo-now.webp', name: '하이드파크의 지금 모습', when: '영국 런던 · 2025년',
      text: [
        '수정궁은 하이드파크의 긴 호수 남쪽, 말 타는 길 "로튼 로" 바로 남쪽에 서 있었습니다. 지금 그 자리는 풀밭입니다.',
        '1851년 박람회가 열리는 동안 표를 사서 들어온 사람은 600만 명이 넘었습니다.',
        '박람회에서 남은 돈 18만 6천 파운드로 런던 사우스켄싱턴에 빅토리아 앨버트 박물관, 과학 박물관, 자연사 박물관을 세웠습니다.',
        '박람회가 끝난 뒤 수정궁은 런던 남쪽 시드넘 언덕에 다시 지어졌고, 1854년 6월 10일 빅토리아 여왕이 문을 열었습니다.',
        '1936년 11월 30일 밤, 시드넘의 수정궁에 난 불은 센 바람을 타고 번졌습니다. 불빛은 여덟 개 주에서도 보였습니다.',
        '시드넘의 공원에는 지금도 돌계단 터와 공룡 조각 33개가 남아 있습니다. 그 동네와 축구단도 \'크리스털 팰리스\'라는 이름을 씁니다.',
      ],
      credit: '사진: kitmasterbloke, 위키미디어 공용, CC BY 2.0',
    },
    drawn: '그 무렵 영국의 젊은 화가들처럼, 잎 하나까지 꼼꼼히 칠했단다.',
    scenes: [
      {
        id: 'gate', name: '영국 런던 하이드파크 문 앞 길', short: '공원 문 앞 길', zoom: 1.095, ground: 0.747, scale: 0.641, air: 'market', floor: 'dirt',
        sora: '비가 그치고 해가 났어!',
        people: [
          { id: 'baker', pass: '번이 다 팔리면 집에 가야지.', name: '빵집 아주머니', x: 0.18, w: 118, h: 282, lines: ['오늘은 빵이 날개 돋친 듯 팔린단다.', '새벽부터 번을 구웠지.'] },
          { id: 'gentleman', pass: '우산을 괜히 들고 나왔구나.', name: '우산 접는 신사', x: 0.29, w: 102, h: 320, lines: ['아침엔 비가 조금 왔단다.', '여왕님이 오실 때 마침 해가 났지.'] },
          { id: 'glazier', pass: '유리는 살살 다뤄야 하지.', show: 'pane', pose: 'see-aha', sora: '유리판으로 집을 지었대!', memo: '수정궁은 무쇠 기둥과 나무 틀에 판유리를 끼워 지었단다. 한 해도 안 걸렸지.', name: '유리 끼우는 일꾼', x: 0.4, w: 119, h: 298, lines: ['나는 저 유리 집에 유리를 끼웠단다.', '한 해도 안 걸려서 다 지었지.'] },
          { id: 'bunman', pass: '번 사세요, 갓 구운 번이에요!', show: 'buns', name: '빵집 아저씨', x: 0.51, w: 116, h: 292, lines: ['위에 설탕을 뿌린 달콤한 번이란다.', '유리 집 안에서도 번과 레모네이드를 판대.'],
            try: { id: 'eat-buns', verb: 'eat', name: '설탕 뿌린 번', face: 'yum', sora: '설탕이 바삭바삭하고 빵은 폭신해!' } },
          { id: 'season', pass: '표를 잃어버리면 안 되지.', name: '시즌 표를 든 부인', x: 0.62, w: 124, h: 299, lines: ['오늘은 시즌 표가 있는 사람만 들어가요.', '나는 이 표를 오래전에 샀답니다.'] },
          { id: 'dressmaker', pass: '오늘 같은 날엔 새 옷이지.', name: '옷 가게 아주머니', x: 0.73, w: 119, h: 292, lines: ['박람회 구경 갈 나들이옷을 짓는단다.', '아이 것도 있어. 입어 보련?'],
            try: { id: 'wear-victoria', verb: 'wear', name: '1851년 런던의 나들이옷', outfit: 'victoria', sora: '치마가 동그랗게 퍼져!', memo: '그 무렵 런던 여자아이들은 넓게 퍼진 치마 밑에 흰 속바지를 입었단다.' } },
          { id: 'sweeper', pass: '비 온 뒤라 길이 질척하네.', name: '길 쓰는 아이', x: 0.85, w: 88, h: 295, lines: ['나는 사람들이 건널 길을 쓸어요.', '오늘은 손님이 아주 많아요.'] },
        ],
        spots: [],
      },
      {
        id: 'lake', name: '영국 런던 하이드파크 서펜타인 호숫가', short: '서펜타인 호숫가', zoom: 1.071, ground: 0.766, scale: 0.627, air: 'hush', floor: 'dirt',
        sora: '호수에 구름이 비쳐!',
        people: [
          { id: 'painter', pass: '물빛이 참 맑게 나왔구나.', name: '호숫가의 화가', x: 0.18, w: 103, h: 292, lines: ['나는 오늘 공원을 그림에 담는단다.', '유리 집은 빛 때문에 그리기 어렵지.'] },
          { id: 'gardener', pass: '꽃모종을 마저 심어야지.', show: 'lily', pose: 'see-wow', sora: '잎이 쟁반처럼 커!', memo: '수정궁을 생각해 낸 팩스턴은 정원사였단다. 큰 수련을 기르던 유리 온실이 바탕이 되었지.', name: '공원 정원사', x: 0.29, w: 106, h: 286, lines: ['저 유리 집은 정원사가 생각해 냈단다.', '큰 수련을 기르던 온실이 바탕이었지.'] },
          { id: 'oldman', pass: '살다 보니 이런 날도 오는구나.', name: '멀리서 온 할아버지', x: 0.4, w: 112, h: 307, lines: ['나는 멀리서 박람회를 보러 왔단다.', '오늘은 못 들어가도 지붕만 봐도 좋구나.'] },
          { id: 'mother', pass: '손을 꼭 잡고 있으렴.', name: '아이 손 잡은 엄마', x: 0.51, w: 159, h: 285, lines: ['여왕님 마차를 보려고 일찍 나왔어요.', '공원이 사람으로 꽉 찼네요.'] },
          { id: 'flowergirl', pass: '제비꽃 사세요, 향긋해요!', name: '꽃 파는 아이', x: 0.62, w: 123, h: 235, lines: ['나는 공원에서 제비꽃을 팔아요.', '호숫가 길은 내가 제일 잘 알아요.'] },
          { id: 'reporter', pass: '이건 꼭 적어 두어야겠군.', name: '신문 기자', x: 0.73, w: 90, h: 302, lines: ['오늘 일을 신문에 쓸 거란다.', '유리 집 안에 큰 오르간이 있다더구나.'] },
          { id: 'policeman', pass: '이 길은 건너면 안 됩니다.', name: '마찻길 지키는 경관', x: 0.85, w: 105, h: 320, lines: ['나는 이 마찻길을 지키는 경관이란다.', '오늘은 여왕님의 마차가 지나가시지.'] },
        ],
        spots: [
          // The carriage road at the right of the picture ordered for this scene, beyond the
          // ropes. (From and to are to be set to the picture.) The queen is not drawn and
          // cannot be spoken to: far off, no face.
          { id: 'queen', from: 0.8, to: 0.97, sora: '멀리 마차 행렬이 지나가!', memo: '빅토리아 여왕의 마차란다. 오늘 박람회를 열러 가지.' },
        ],
      },
      {
        id: 'palace', name: '영국 런던 하이드파크 수정궁 앞', short: '수정궁 앞', zoom: 1.024, ground: 0.802, scale: 0.599, air: 'hush', floor: 'dirt',
        sora: '집이 통째로 유리야!',
        people: [
          { id: 'guideseller', pass: '배가 고파도 수레를 못 비우네.', show: 'roof', pose: 'see-wow', sora: '지붕 안에 나무가 있어!', memo: '공원의 큰 느릅나무를 베지 않으려고 가운데를 둥근 아치 지붕으로 높여 건물 안에 품었단다.', name: '안내 책 파는 아저씨', x: 0.18, w: 103, h: 308, lines: ['박람회 안내 책이 여기 있단다.', '안에 무엇이 있는지 다 적혀 있지.'] },
          { id: 'lensman', pass: '렌즈에 먼지가 앉으면 안 되지.', name: '망원경 지키는 이', x: 0.29, w: 104, h: 319, lines: ['이 망원경은 먼 별을 보는 것이란다.', '여러 나라의 물건이 여기 모였지.'] },
          { id: 'engineer', pass: '조금 늦었지만 다 왔구나.', show: 'engine', pose: 'see-wow', sora: '작은 기차 같은 기계야!', memo: '박람회에는 영국과 여러 나라에서 온 기계와 물건이 아주 많이 모였단다.', name: '증기 기관 모형 장인', x: 0.4, w: 97, h: 297, lines: ['증기의 힘으로 바퀴를 돌리는 기계란다.', '내가 만든 것을 안에 내놓을 거지.'] },
          { id: 'clothman', pass: '천이 구겨지지 않게 들어야지.', name: '천 나르는 일꾼', x: 0.51, w: 108, h: 293, lines: ['먼 나라에서 배로 실어 온 천이란다.', '무늬가 참 곱지? 안에 걸 거란다.'] },
          { id: 'gardengirl', pass: '꽃이 목마르지 않게 해야지.', name: '꽃밭 가꾸는 아이', x: 0.62, w: 123, h: 246, lines: ['유리 집 앞 꽃밭에 물을 줘요.', '유리 집 한가운데엔 유리 분수가 있대요.'] },
          { id: 'usher', pass: '표를 보여 주시면 됩니다.', name: '문 앞 안내원', x: 0.73, w: 100, h: 320, lines: ['오늘은 시즌 표가 있어야 들어간단다.', '안에서 곧 큰 노래가 울릴 거야.'] },
          { id: 'grandma', pass: '유리가 해에 반짝이는구나.', name: '구경 온 할머니', x: 0.85, w: 128, h: 286, lines: ['이달 말부터는 1실링이면 들어간대.', '그때는 손주들을 데리고 오련다.'] },
        ],
        spots: [
          // The flags on the roof of the arched middle in the try (the big flag at about 0.72).
          // (From and to are to be set to the picture.)
          { id: 'flags', from: 0.66, to: 0.78, sora: '지붕 위에 깃발이 펄럭여!', memo: '박람회를 여는 날, 유리 집 지붕 위에 깃발을 줄지어 걸었단다.' },
        ],
      },
    ],
    // "The work of the day" (core/tale.js `work`, as at Darlington; the user, 2026.10.16: "런던도
    // 달링턴 스타일로 고쳐"): the rain has left the road by the gate muddy and she sweeps the
    // crossing with the crossing sweeper (crossing sweepers were a London trade of the time:
    // Mayhew, 1851); by the lake she sells the flower girl's violets to three people in the
    // crowd; before the palace she pulls the flags up with the usher as the queen comes, and
    // looks up at the arched glass roof and hears the "Hallelujah" from within.
    // Looked up: flags of many nations flew from the top of the palace through the exhibition.
    // Made up: sweeping with the boy, the violets sold to those three, the usher and the flags
    // pulled up at that hour.
    tale: {
      work: true,
      ask: '유리 지붕 안에는 무엇이 있을까?',
      gate: { scene: 'gate', open: 1, sora: '길이 진흙투성이야. 건널목부터 쓸자.' },
      steps: [
        {
          who: 'sweeper', goal: '공원 문 앞 길의 길 쓰는 아이를 도와 건널목을 쓸렴.',
          lines: ['비가 와서 건널목이 진흙투성이예요.', '손님들 치맛자락이 젖지 않게 같이 쓸어요.'],
          play: {
            kind: 'aim', tally: '건널목 {all}군데 가운데 {n}군데를 쓸었다.', ask: '하얀 점이 금빛 칸에 올 때 비질을 하렴.', label: '쓱쓱', hits: 3, zone: [0.4, 0.6], speed: 0.7,
            good: ['쓱쓱! 깨끗해졌어!', '한 군데 더!'], miss: ['앗, 진흙이 튀었어!', '조금 더 기다렸다가!'],
          },
          after: [{ who: 'season', line: '길이 깨끗하구나. 치마가 젖지 않겠어.' }],
          cheer: '건널목이 깨끗해졌다!',
          sora: '이제 호숫가로 가 보자!',
          errand: 'swept',
        },
        {
          goal: '호숫가의 꽃 파는 아이를 도와 제비꽃을 사람들에게 팔렴.', tally: '제비꽃 {all}다발 가운데 {n}다발을 팔았다.',
          round: [
            { who: 'mother', lines: ['어머, 향긋한 제비꽃이구나.', '한 다발 주렴. 아이 모자에 꽂아 줘야지.'] },
            { who: 'oldman', lines: ['제비꽃이라, 고향 들판이 생각나는구나.', '한 다발 사서 가져가련다.'] },
            { who: 'reporter', lines: ['오늘 같은 날엔 꽃 한 송이쯤 꽂아야지.', '한 다발 주렴. 단추 구멍에 꽂으마.'] },
          ],
          after: [{ who: 'flowergirl', line: '다 팔았어요! 고마워요. 이제 수정궁에 가 봐요.' }],
          cheer: '제비꽃을 다 팔았다!',
          sora: '수정궁 앞으로 가 보자!',
          errand: 'violets',
        },
        {
          who: 'usher', goal: '수정궁 앞의 문 앞 안내원과 함께 깃발을 올리렴.',
          lines: ['여왕님이 곧 박람회를 여신단다.', '지붕에 깃발을 올려야 해. 줄을 같이 당기련?'],
          play: {
            kind: 'mash', tally: '깃발 {all}개 가운데 {n}개를 올렸다.', ask: '여러 번 눌러 깃발을 끝까지 올리렴.', label: '영차!', hits: 3, zone: [0.42, 0.58], speed: 0.12,
            good: ['영차! 깃발이 올라가!', '하나 더!'], miss: ['앗, 줄이 미끄러졌어!', '조금 일렀어!'], show: 'roof',
          },
          cheer: '박람회가 열린다!',
          sora: '안에서 할렐루야 노래가 들려!',
          errand: 'flags',
        },
      ],
      asides: [
        { who: 'baker', when: ['S0'], lines: ['비가 그치니 손님이 몰려오는구나.', '길 쓰는 아이 혼자 바쁘겠어.'] },
        { who: 'flowergirl', when: ['S1'], lines: ['제비꽃이 아직 이렇게 많이 남았어요.', '저 사람들에게 한 다발씩 팔아 줄래요?'] },
        { who: 'flowergirl', when: ['S3'], lines: ['깃발이 올라가는 것 봤어요?', '여기서도 노랫소리가 들려요!'] },
      ],
      done: '건널목을 쓸고, 제비꽃을 팔고, 깃발을 올려 박람회를 열었다.',
    },
    errands: [
      { id: 'swept', text: '건널목을 쓴다.', at: [] },
      { id: 'violets', text: '제비꽃을 팔아 준다.', at: [] },
      { id: 'flags', text: '깃발을 올려 박람회를 연다.', at: [] },
    ],
    reply: '그 유리 집은 지금 없단다. 그래도 네가 보았으니 됐지.',
  },
  // Menlo Park on the evening of 31 December 1879: the night the railroad runs extra trains
  // and anyone may come to see Edison's long-burning lamp. Drawn as an oil painting of a night
  // scene, after the nocturnes of the 1870s (the user's choice of five tries: the second). The
  // pictures are in menlo1879; the try is the third scene ('road': the snowy road lit by the
  // lamps, with the station, the boarding house, the brick machine shop and the white
  // laboratory), and the front of the station and the workroom upstairs in the laboratory
  // were ordered after it. The try draws many stars: they are to be mostly taken off by hand
  // (a cloudy night). The pictures are dark: no `pale`. Whether the place wants `night` (the
  // people dimmed, the computed sky over the roofs) is to be seen once the pictures are in:
  // the computed sky would show stars the clouds hid.
  // Looked up on 2026.10.14 (docs/신기한-사실.md) and found so: extra trains, a special train
  // of the Pennsylvania Railroad, people coming in spite of the weather; lamps on wooden poles
  // along the road from the station to the laboratory; lamps in some neighbouring houses and
  // before the boarding house; all fed from the generator in the machine shop; storm clouds
  // hid the stars and the steps were sprinkled with snow; the filament of cardboard cut to a
  // horseshoe and baked to carbon, the pear-shaped glass emptied of air; the vacuum pump and
  // the baking of filaments shown; a lamp burning under water; "it does not flicker like gas";
  // the boarding house of the laboratory's single men; the New York Herald's page on the light
  // ten days before (21 December); an out-of-tune organ upstairs (one source).
  // Looked up while writing and found so: the laboratory a white two-storey building, the
  // machine shop of brick (edison.rutgers.edu, thehenryford.org); hot chocolate a common
  // American drink of the time (thehenryford.org, Smithsonian).
  // From memory: the dress; the look of the mercury pump and of the generator; a cocoa cart at
  // the station; sledges.
  // Made up: the landlady, the worker who keeps the front stairs, the stoker, every other person
  // (the work of the day: see the comment before the tale).
  // Kept out: Edison but as a far-off spot in a window; any number of lamps, people or hours;
  // the lamps taken by visitors (only "만지지 말고 눈으로만 보렴"); the gas companies, share
  // prices; "the first bulb in the world"; the moon; smoking and drink.
  menlo: {
    first: '누구나 전깃불을 보러 오는 밤이란다. 구경이 잘 되도록 도와주렴.',
    dir: 'menlo1879', look: 'paper',
    // (What is said of today: looked up on 2026.10.14; the picture chosen by the user.)
    now: {
      photo: 'photo-now.webp', name: '다시 지은 실험실의 지금 모습', when: '미국 미시간 디어본 · 2010년',
      text: [
        '1887년, 에디슨은 멘로파크를 떠나 뉴저지 웨스트오렌지의 더 큰 연구소로 옮겼습니다.',
        '1928년, 헨리 포드가 미시간 디어본의 그린필드 마을에 이 실험실을 다시 짓게 했습니다. 1929년 10월에 다 지었습니다.',
        '다시 지을 때 남아 있던 옛 재료를 찾아 썼고, 둘레에는 뉴저지에서 옮겨 온 흙을 깔았습니다.',
        '1929년 10월 21일 밤, 에디슨은 다시 지은 이 실험실에서 옛 조수와 함께 첫 전구를 켜던 일을 다시 해 보였습니다.',
        '실험실이 있던 뉴저지 자리에는 1938년에 높이 40미터쯤의 기념탑을 세웠습니다. 곁에는 에디슨 박물관이 있습니다.',
        '1954년, 멘로파크가 들어 있는 고장은 이름을 에디슨으로 바꾸었습니다.',
      ],
      credit: '사진: Swampyank, 위키미디어 공용, CC BY 3.0',
    },
    drawn: '그 무렵 밤 풍경을 그린 유화처럼 그렸단다.',
    scenes: [
      {
        id: 'depot', name: '미국 멘로파크 기차 정거장 앞', short: '정거장 앞', zoom: 1.162, ground: 0.696, scale: 0.680, air: 'market', floor: 'dirt',
        sora: '기차에서 사람들이 잔뜩 내려!',
        people: [
          { id: 'conductor', pass: '다음 기차도 곧 들어옵니다.', name: '기차 차장', x: 0.18, w: 153, h: 315, lines: ['오늘은 기차를 더 놓아 손님이 많단다.', '모두 전깃불을 보러 온 사람들이지.'] },
          { id: 'newsboy', pass: '전깃불 이야기가 실린 신문이에요.', name: '신문 파는 아이', x: 0.29, w: 116, h: 268, lines: ['열흘 전 신문에 전깃불 이야기가 났어요.', '신문 한 면이 다 그 이야기였어요.'] },
          { id: 'cocoa', pass: '추운 밤에는 따뜻한 것이 제일이지.', show: 'cocoa', name: '코코아 파는 아주머니', x: 0.4, w: 131, h: 305, lines: ['추운 밤엔 따뜻한 코코아가 최고란다.', '한 잔 마셔 보련? 손이 녹을 거야.'],
            try: { id: 'eat-cocoa', verb: 'eat', name: '따뜻한 코코아', face: 'yum', sora: '코코아가 달콤하고 따뜻해!' } },
          { id: 'landlady', pass: '일꾼들 저녁을 데워 두어야지.', name: '하숙집 아주머니', x: 0.51, w: 123, h: 305, lines: ['나는 연구소 일꾼들의 하숙집을 한단다.', '오늘은 다들 바빠서 밥 먹을 틈도 없구나.'] },
          { id: 'coatlady', pass: '딸아이 외투를 하나 더 가져왔지.', name: '구경 온 아주머니', x: 0.62, w: 120, h: 311, lines: ['밤바람이 차서 외투를 더 챙겨 왔단다.', '아이 것이 하나 남는구나. 입어 보련?'],
            try: { id: 'wear-gilded', verb: 'wear', name: '1879년 미국의 겨울옷', outfit: 'gilded', sora: '외투에 놋쇠 단추가 두 줄이야!', memo: '그 무렵 미국 아이들은 겨울에 모직 외투를 입고 털 토시를 꼈단다.' } },
          { id: 'shovel', pass: '계단에 눈이 또 쌓였구나.', name: '눈 치우는 아저씨', x: 0.73, w: 123, h: 301, lines: ['정거장 계단에 눈이 살짝 덮였단다.', '손님이 미끄러지지 않게 치우는 중이지.'] },
          { id: 'gentleman', pass: '저 불빛 좀 보게나.', name: '구경 온 신사', x: 0.85, w: 140, h: 320, lines: ['나는 뉴욕에서 기차를 타고 왔다오.', '전깃불을 내 눈으로 꼭 보고 싶었지.'] },
        ],
        spots: [],
      },
      {
        id: 'workroom', name: '미국 멘로파크 연구소 이층 작업방', short: '연구소 이층 작업방', zoom: 1.234, ground: 0.640, scale: 0.722, air: 'hush', floor: 'wood',
        sora: '유리병이 벽에 가득해!',
        people: [
          { id: 'shelf', pass: '병은 늘 제자리에 두어야지.', name: '유리병 지키는 일꾼', x: 0.18, w: 120, h: 308, lines: ['병마다 실험에 쓰는 것이 들었단다.', '만지지 말고 눈으로만 보렴.'] },
          { id: 'pumper', pass: '공기가 조금도 남으면 안 되지.', show: 'pump', pose: 'see-aha', sora: '유리알 속 공기를 빼낸대!', memo: '전구 속 공기를 다 빼내야 실이 타 버리지 않고 오래 빛난단다.', name: '진공 펌프 돌보는 일꾼', x: 0.29, w: 94, h: 304, lines: ['이 펌프로 유리알 속 공기를 빼낸단다.', '공기가 없어야 실이 오래 빛나지.'] },
          { id: 'carbon', pass: '이번 실은 잘 구워졌구나.', show: 'bulb', pose: 'see-wow', sora: '유리알 속에 말굽 꼴 실이 있어!', memo: '두꺼운 종이를 말굽 꼴로 잘라 숯이 되게 구웠단다. 그 실이 빛을 내지.', name: '실 굽는 일꾼', x: 0.4, w: 121, h: 320, lines: ['두꺼운 종이를 말굽 꼴로 잘라 굽는단다.', '구우면 까만 숯 실이 되지.'] },
          { id: 'water', pass: '물속에서도 아직 켜져 있구나.', name: '물동이 보이는 일꾼', x: 0.51, w: 93, h: 300, lines: ['전구를 물속에 넣어도 꺼지지 않는단다.', '유리알이 꼭 막혀 있어서 그렇지.'] },
          { id: 'organist', pass: '오르간 소리가 조금 어긋났네.', name: '오르간 치는 일꾼', x: 0.62, w: 106, h: 310, lines: ['일이 끝나면 다 같이 오르간을 친단다.', '소리가 조금 어긋나도 즐겁지.'] },
          { id: 'stoker', pass: '기계실 보일러에 불을 더 넣어야지.', name: '기계실 불 때는 일꾼', x: 0.73, w: 139, h: 308, lines: ['나는 기계실에서 보일러에 불을 땐단다.', '기계실 소식을 전하러 잠깐 올라왔지.'] },
          { id: 'keeper', pass: '오늘은 앞 계단이 꽉 찼구나.', name: '앞 계단 지키는 일꾼', x: 0.85, w: 106, h: 305, lines: ['앞 계단은 구경꾼으로 가득하단다.', '나는 여기서 기계를 지키는 중이야.'] },
        ],
        spots: [],
      },
      {
        id: 'road', name: '미국 멘로파크 전깃불 켜진 눈길', short: '전깃불 눈길', zoom: 1.093, ground: 0.749, scale: 0.640, air: 'hush', floor: 'dirt',
        sora: '밤인데 길이 환해!',
        people: [
          { id: 'sledgirl', pass: '밤인데도 썰매 길이 잘 보여.', name: '썰매 끄는 아이', x: 0.18, w: 136, h: 250, lines: ['전깃불 덕분에 밤길이 환해.', '그래서 밤에도 썰매를 끌 수 있어.'] },
          { id: 'glassblower', pass: '저 기둥의 전구도 잘 켜졌구나.', show: 'lamps', pose: 'see-wow', sora: '기둥마다 전구가 켜졌어!', memo: '정거장에서 연구소까지 나무 기둥마다 전구를 달아 길을 밝혔단다.', name: '유리 부는 일꾼', x: 0.29, w: 105, h: 315, lines: ['전구의 유리알은 내가 불어 만든단다.', '길가 전구가 잘 켜졌나 보러 나왔지.'] },
          { id: 'boarder', pass: '하숙집 창이 오늘따라 환하네.', name: '하숙하는 일꾼', x: 0.4, w: 92, h: 307, lines: ['나는 저 하숙집에서 지낸단다.', '하숙집 앞에도 전깃불을 세웠지.'] },
          { id: 'machinist', pass: '바퀴 소리가 오늘도 고르구나.', show: 'dynamo', pose: 'see-wow', sora: '창 안에서 큰 바퀴가 돌아!', memo: '기계실의 발전기가 전기를 만들어 마을의 전구를 모두 밝혔단다.', name: '기계실 일꾼', x: 0.51, w: 147, h: 311, lines: ['기계실의 발전기가 전기를 만든단다.', '전구는 모두 이 기계에 이어져 있지.'] },
          { id: 'reporter', pass: '이 불빛을 어떻게 적으면 좋을까.', name: '공책 든 신문 기자', x: 0.62, w: 104, h: 313, lines: ['전깃불이 가스불처럼 깜박이지 않는군요.', '오늘 본 것을 신문에 쓰겠어요.'] },
          { id: 'lookerlady', pass: '창마다 불이 어쩌면 이리 환할까.', name: '구경 온 아주머니', x: 0.73, w: 135, h: 320, lines: ['불꽃도 없는데 창마다 환하구나.', '유리알 속 실이 빛난다지 뭐니.'] },
          { id: 'farmer', pass: '오늘 밤은 낮처럼 환하구먼.', name: '이웃 농부 할아버지', x: 0.85, w: 140, h: 308, lines: ['우리 집에도 전깃불을 달아 주었단다.', '등잔 없이도 밤이 환하구나.'] },
        ],
        spots: [
          // The laboratory in the try (its lit windows). Edison is not drawn and cannot be
          // spoken to. (From and to are to be checked against the picture.)
          { id: 'edison', from: 0.74, to: 0.98, sora: '연구소 창 안에 누가 설명하고 있어!', memo: '연구소를 이끄는 에디슨이란다. 오늘은 손님이 많아 말을 걸 수 없지.' },
        ],
      },
    ],
    // "The work of the day" (core/tale.js `work`; told after Darlington and London): extra
    // trains bring visitors to the station, and she tells two of them the way to the
    // laboratory: follow the lamps on the wooden poles along the road. Upstairs in the
    // workroom the vacuum pump is being shown to the visitors, and she helps the worker work it
    // in time. Out on the lit snowy road a few poles at the far end are still dark, and she
    // lights them with the glassblower, and the road shines from end to end.
    // Looked up (docs/신기한-사실.md; edison.rutgers.edu, history.com): extra trains that
    // evening and visitors coming in spite of the weather; lamps on wooden poles lit the road
    // from the station to the laboratory, all fed from the generator in the machine shop; the
    // vacuum pump and the baking of filaments were shown to the visitors; the air is taken out
    // of the glass so the filament lasts; "it does not flicker like gas".
    // Made up: the two visitors asking the way and what they say; her working the pump (pressed
    // in time is the game's shorthand for working it, not how the pump of 1879 was worked); the
    // poles at the far end still dark, and lighting them one by one (how the road lamps were
    // turned on that night was not looked up).
    tale: {
      work: true,
      ask: '전깃불 켜진 밤길은 어떤 모습일까?',
      gate: { scene: 'depot', open: 1, sora: '구경꾼들이 길을 몰라. 먼저 알려 주자.' },
      steps: [
        {
          goal: '정거장 앞의 구경꾼들에게 연구소 가는 길을 알려 주렴.', tally: '구경꾼 {all}명 가운데 {n}명에게 길을 알려 주었다.',
          round: [
            { who: 'gentleman', lines: ['전깃불 기둥을 따라가면 연구소라고?', '고맙구나. 눈길에서 헤맬 뻔했단다.'] },
            { who: 'coatlady', lines: ['불 켜진 기둥만 따라가면 되는구나.', '고맙다. 딸아이 손을 꼭 잡고 가마.'] },
          ],
          after: [{ who: 'conductor', line: '길을 잘 알려 주었구나. 다음 기차도 곧 온단다.' }],
          cheer: '길을 다 알려 주었다!',
          sora: '나도 연구소 이층에 올라가 보자!',
          errand: 'guide',
        },
        {
          who: 'pumper', goal: '연구소 이층 작업방의 진공 펌프 일꾼을 도우렴.',
          lines: ['구경꾼들에게 공기 빼는 것을 보여 주는 중이란다.', '박자를 맞춰 펌프를 움직여야 해. 도와주련?'],
          play: {
            kind: 'mash', tally: '펌프를 {all}번 가운데 {n}번 맞춰 움직였다.', ask: '여러 번 눌러 펌프를 움직이렴.', label: '쉭!', hits: 3, zone: [0.41, 0.59], speed: 0.12,
            good: ['쉭! 공기가 빠져나가!', '한 번 더!'], miss: ['앗, 박자가 어긋났어!', '조금 더 기다렸다가!'],
          },
          after: [{ who: 'carbon', line: '공기가 다 빠졌구나. 이제 실이 오래 빛나겠어.' }],
          cheer: '공기를 다 뺐다!',
          sora: '이제 전깃불 켜진 길로 나가 보자!',
          errand: 'pump',
        },
        {
          who: 'glassblower', goal: '전깃불 눈길의 유리 부는 아저씨와 함께 전구를 켜렴.',
          lines: ['길 끝의 기둥 몇 개가 아직 깜깜하구나.', '하나씩 불을 켜 보자. 같이 하련?'],
          play: {
            kind: 'aim', tally: '기둥 {all}개 가운데 {n}개에 불을 켰다.', ask: '하얀 점이 금빛 칸에 올 때 불을 켜렴.', label: '딸깍!', hits: 3, zone: [0.42, 0.58], speed: 0.7,
            good: ['딸깍! 불이 들어왔어!', '하나 더!'], miss: ['앗, 너무 일렀어!', '조금 더 기다렸다가!'], show: 'lamps',
          },
          after: [{ who: 'reporter', line: '정말 가스불처럼 깜박이지 않는군요.' }],
          cheer: '밤길이 환해졌다!',
          sora: '눈길이 끝까지 환하게 빛나!',
          errand: 'lamps',
        },
      ],
      asides: [
        { who: 'conductor', when: ['S0'], lines: ['손님들이 연구소 가는 길을 자꾸 묻는구나.', '전깃불 기둥을 따라가면 된다고 알려 주렴.'] },
        { who: 'landlady', when: ['S1'], lines: ['연구소 이층에서 펌프를 보여 준다더라.', '불 켜진 길을 따라 연구소로 가 보렴.'] },
        { who: 'keeper', when: ['S1'], lines: ['펌프 일꾼이 손이 모자라 보이는구나.', '가서 좀 도와주렴.'] },
        { who: 'sledgirl', when: ['S2'], lines: ['저 끝 기둥은 아직 깜깜해.', '유리 부는 아저씨가 켜러 간대.'] },
        { who: 'farmer', when: ['S3'], lines: ['길 끝까지 불이 다 들어왔구나.', '이렇게 환한 밤은 처음 보는구먼.'] },
      ],
      done: '구경꾼에게 길을 알려 주고, 펌프를 돕고, 길가 전구를 켰다.',
    },
    errands: [
      { id: 'guide', text: '구경꾼들에게 연구소 가는 길을 알려 준다.', at: [] },
      { id: 'pump', text: '진공 펌프로 유리알 속 공기를 뺀다.', at: [] },
      { id: 'lamps', text: '길가 기둥의 전구를 켠다.', at: [] },
    ],
    reply: '그날 밤 켜진 전깃불은 그 뒤로 온 세상으로 퍼져 나갔단다.',
  },
  // New York on 28 October 1886, a drizzling, foggy holiday: the day the Statue of Liberty
  // was dedicated on Bedloe's Island. Drawn as an oil painting of the sea of the 1880s (the
  // user's choice of five tries: the third). The pictures are in newyork1886; the try itself
  // is the third scene (the foggy pier at the south end of Manhattan, the statue over the
  // water), and the parade street and the newspaper cart by the Battery were ordered after
  // it. Pale: the sky of the pictures is light grey fog.
  // Looked up on 2026.10.14 and found so: the dedication on Bedloe's Island; drizzle and
  // thick fog, lifting about three in the afternoon ("안개가 걷히고 있어"); the morning parade
  // to the Battery and the ticker tape thrown from the windows of the Stock Exchange; the city
  // made the day a holiday and Brooklyn closed its schools (one source); the whistles of the
  // boats drowned some of the speeches; the face covered with a great French flag; women who
  // wanted the vote spoke from a hired boat near the island (only as a far spot); the new
  // statue shone reddish brown; it came in crates by ship the year before ("작년에 상자에
  // 담겨 배로 왔단다") and was put up after the pedestal was done; a newspaper gathered the
  // money for the pedestal from very many people, children giving coins among them ("아이들도
  // 동전을 보탰단다"); the old star-shaped fort on the island; newsboys sold the papers in the
  // streets in those years.
  // Looked for and NOT found: roasted chestnut carts in the New York of the 1880s (no
  // chestnuts); that a paper printed a picture of the statue that day (the newsboy only says
  // the papers are full of the statue).
  // From memory: that the parade went by Broadway; sandwiches of ham and cheese; the dress of
  // 1886 and the long blue coat of the police; gas lamps; that Edward Moran painted that day.
  // Made up: the baker, the policeman who keeps the street, the captain of the small steamer,
  // every other person (the work of the day: see the comment before the tale).
  // Kept out: Cleveland and Bartholdi except as far spots (Bartholdi only "inside", not where
  // inside), Lesseps; the statue green; crates of copper pieces on the pier that day; guns in
  // the parade; fireworks (put off); the number of people; cannon.
  liberty: {
    first: '자유의 여신상을 여는 날이란다. 잔치가 잘 치러지도록 도와주렴.',
    dir: 'newyork1886', look: 'paper', pale: true,
    // (What is said of today: looked up on 2026.10.14; the picture chosen by the user.)
    now: {
      photo: 'photo-now.webp', name: '자유의 여신상의 지금 모습', when: '미국 뉴욕 · 2023년',
      text: [
        '땅에서 횃불 끝까지 높이가 93미터입니다. 1933년부터 미국 국립공원관리청이 돌보고 있습니다.',
        '섬까지는 배를 타고 갑니다. 받침대에서 왕관까지 162계단을 걸어 올라가면 왕관 창으로 밖을 볼 수 있습니다.',
        '1916년부터는 높이 든 횃불까지 사람이 올라갈 수 없게 막아 두었습니다.',
        '처음 만든 횃불은 내려와, 지금은 2019년 5월 섬에 문을 연 자유의 여신상 박물관에 있습니다.',
        '1984년에 유네스코 세계유산이 되었습니다. 2019년에는 450만 명이 자유의 여신상을 보러 왔습니다.',
      ],
      credit: '사진: Jakub Hałun, 위키미디어 공용, CC BY 4.0',
    },
    drawn: '그날 바다를 그린 유화처럼, 붓으로 칠했단다.',
    scenes: [
      {
        id: 'parade', name: '미국 뉴욕 브로드웨이 행진 길', short: '행진 길', zoom: 1.137, ground: 0.715, scale: 0.665, air: 'hush', floor: 'dirt',
        sora: '하얀 종이 띠가 길에 가득해!',
        people: [
          { id: 'baker', pass: '오늘은 빵이 잘 팔리는구나.', name: '빵집 아저씨', x: 0.18, w: 126, h: 311, lines: ['아침에 행진이 이 길로 지나갔단다.', '오늘은 온 도시가 쉬는 날이지.'] },
          { id: 'tapeboy', pass: '종이 띠를 이만큼이나 주웠어.', name: '종이 띠 줍는 아이', x: 0.29, w: 99, h: 254, lines: ['위에서 종이 띠가 비처럼 내려왔어요.', '나는 제일 긴 띠를 찾는 중이에요.'] },
          { id: 'clerk', pass: '창마다 종이 띠를 던졌지.', show: 'tape', pose: 'see-wow', sora: '종이 띠를 창밖으로 던졌대!', memo: '행진이 지날 때 증권 거래소 창에서 시세 종이 띠를 던졌단다.', name: '증권 거래소 사환', x: 0.4, w: 116, h: 296, lines: ['이 띠에는 물건값이 찍혀 나온단다.', '오늘은 기뻐서 창밖으로 던졌지.'] },
          { id: 'drummer', pass: '북채를 잘 챙겨 둬야지.', name: '악대 북 치는 이', x: 0.51, w: 127, h: 318, lines: ['아침 내내 북을 치며 걸었단다.', '이제 배터리 쪽으로 가는 길이지.'] },
          { id: 'flagseller', pass: '깃발 사세요, 두 나라 깃발이요!', show: 'flags', pose: 'see-aha', sora: '깃발이 두 가지야!', memo: '여신상은 프랑스 사람들이 보낸 선물이라 두 나라 깃발을 걸었단다.', name: '깃발 파는 아주머니', x: 0.62, w: 154, h: 312, lines: ['미국 깃발과 프랑스 깃발이란다.', '여신상은 프랑스가 보낸 선물이거든.'] },
          { id: 'coatseller', pass: '오늘은 날이 쌀쌀하구나.', name: '외투 가게 아주머니', x: 0.73, w: 129, h: 320, lines: ['비가 와서 날이 쌀쌀하단다.', '아이 외투도 있어. 입어 보련?'],
            try: { id: 'wear-ny1886', verb: 'wear', name: '1886년 뉴욕의 외투', outfit: 'ny1886', sora: '외투가 따뜻하고 단추가 반짝여!', memo: '그 무렵 뉴욕 아이들은 망토 깃 달린 외투를 입었단다.' } },
          { id: 'coingrandpa', pass: '이 동전 하나도 보탬이 되었지.', name: '동전 이야기 할아버지', x: 0.85, w: 107, h: 305, lines: ['받침대는 우리가 돈을 모아 지었단다.', '아이들도 동전을 보탰지.'] },
        ],
        spots: [],
      },
      {
        id: 'newsstand', name: '미국 뉴욕 배터리 신문 수레 앞', short: '신문 수레 앞', zoom: 1.159, ground: 0.698, scale: 0.678, air: 'market', floor: 'dirt',
        sora: '신문이 산더미처럼 쌓였어!',
        people: [
          { id: 'sandwiches', pass: '샌드위치가 아직 따끈해요!', show: 'sandwich', name: '샌드위치 파는 아주머니', x: 0.18, w: 127, h: 278, lines: ['햄과 치즈를 넣은 샌드위치란다.', '구경하다 배고프면 먹어야지. 먹어 보련?'],
            try: { id: 'eat-sandwich', verb: 'eat', name: '햄 샌드위치', face: 'yum', sora: '빵이 폭신하고 햄이 짭짤해!' } },
          { id: 'paperman', pass: '신문이 금방 다 팔리겠구나.', name: '신문 수레 주인', x: 0.29, w: 116, h: 282, lines: ['오늘 신문은 온통 여신상 이야기란다.', '받침대 돈도 신문사가 모았지.'] },
          { id: 'sailor', pass: '깃발 줄이 엉키지 않게 해야지.', name: '깃발 다는 선원', x: 0.4, w: 112, h: 288, lines: ['난간을 깃발과 색 띠로 꾸민단다.', '배들도 오늘은 깃발을 잔뜩 달았지.'] },
          { id: 'lampman', pass: '저녁이 오기 전에 닦아 둬야지.', name: '가스등 닦는 이', x: 0.51, w: 113, h: 281, lines: ['나는 가스등의 유리를 닦는단다.', '안개 낀 날은 유리가 금방 흐려지지.'] },
          { id: 'newsboy', pass: '신문 사세요! 여신상 소식이요!', name: '신문팔이 아이', x: 0.62, w: 109, h: 270, lines: ['나는 날마다 이 길에서 신문을 팔아요.', '오늘은 신문이 아주 잘 팔려요.'] },
          { id: 'schoolgirl', pass: '오늘은 학교에 안 가는 날이야.', name: '학교 쉬는 날 나온 여자아이', x: 0.73, w: 93, h: 237, lines: ['오늘은 학교가 쉬는 날이에요.', '여신상을 보러 부두에 가는 길이에요.'] },
          { id: 'police', pass: '길을 건너면 안 됩니다.', name: '길 지키는 경찰', x: 0.85, w: 112, h: 320, lines: ['나는 이 길을 지키는 경찰이란다.', '행진하는 사람들이 아직 지나가는 중이지.'] },
        ],
        spots: [],
      },
      {
        id: 'pier', name: '미국 뉴욕 배터리 안개 낀 부두', short: '안개 낀 부두', zoom: 1.124, ground: 0.725, scale: 0.658, air: 'hush', floor: 'wood',
        sora: '바다 건너에 큰 사람이 서 있어!',
        people: [
          { id: 'roper', pass: '밧줄을 단단히 감아 둬야지.', name: '밧줄 감는 선원', x: 0.18, w: 122, h: 311, lines: ['배를 부두에 단단히 매어 둔단다.', '오늘은 배가 아주 많이 나왔지.'] },
          { id: 'umbrella', pass: '비가 그쳐서 다행이구나.', name: '우산 든 할머니', x: 0.29, w: 125, h: 302, lines: ['이틀 내내 이슬비가 내렸단다.', '그래도 여신상은 보고 싶어서 나왔지.'] },
          { id: 'stoker', pass: '불을 세게 지펴야 김이 나지.', show: 'steam', pose: 'see-wow', sora: '굴뚝에서 하얀 김이 솟아!', memo: '그날 항구의 증기선들이 고동을 크게 울려 연설이 묻히기도 했단다.', name: '증기선 화부', x: 0.4, w: 103, h: 302, lines: ['나는 배에 석탄을 넣는 사람이란다.', '불을 지피면 굴뚝에서 김이 나지.'] },
          { id: 'bugler', pass: '나팔을 불 때가 곧 오겠지.', name: '나팔 부는 악대원', x: 0.51, w: 104, h: 295, lines: ['식이 끝나면 다 같이 나팔을 분단다.', '배의 고동 소리에 질 수는 없지.'] },
          { id: 'captain', pass: '안개가 어서 걷혀야 할 텐데.', show: 'unveil', name: '작은 증기선 선장', x: 0.62, w: 125, h: 310, lines: ['나는 이 작은 증기선의 선장이란다.', '곧 섬 쪽으로 가는 배들 틈에 끼지.'] },
          { id: 'cabinboy', pass: '망원경으로 섬을 봐야지.', name: '선장을 돕는 소년', x: 0.73, w: 91, h: 259, lines: ['안개 때문에 섬이 잘 안 보여요.', '저 여신상은 구릿빛이라 반짝여요.'] },
          { id: 'harbormaster', pass: '오늘은 항구가 몹시 붐비는구나.', name: '항구 관리', x: 0.85, w: 121, h: 320, lines: ['여신상은 작년에 상자에 담겨 배로 왔단다.', '받침대를 다 짓고 올봄에 세웠지.'] },
        ],
        spots: [
          // The steamer with flags at the left of the try, far off. (From and to are to be set
          // to the picture.) The president is not drawn as a person and cannot be spoken to.
          { id: 'president', from: 0.29, to: 0.41, sora: '깃발 단 큰 배가 섬으로 가!', memo: '대통령이 탄 배란다. 섬에서 열리는 식에 가는 길이지.' },
          // The statue on its star-shaped fort in the try. Bartholdi is inside it: not where.
          { id: 'statue', from: 0.67, to: 0.77, sora: '얼굴을 깃발로 가렸어!', memo: '얼굴을 프랑스 깃발로 가렸단다. 만든 사람이 여신상 안에서 기다렸지.' },
          // The sailing ships at the right of the try, far off: the boat of the women who
          // wanted the vote.
          { id: 'voteboat', from: 0.88, to: 0.98, sora: '저 배에서 누가 외치고 있어!', memo: '섬에는 여자를 거의 들이지 않았단다. 여자들은 배를 빌려 투표하게 해 달라고 외쳤지.' },
        ],
      },
    ],
    // "The work of the day" (core/tale.js `work`, as at Darlington and London): on the parade
    // street, strewn with the ticker tape of the morning's parade, she hands out the flag
    // seller's American and French flags to three people going down to the harbour; at the
    // newsstand by the Battery, while the policeman holds the street for the last of the
    // marchers, she wipes the fogged glass of the gas lamps with the lamp cleaner; on the
    // foggy pier, as the fog lifts and the French flag slides from the copper face, she pulls
    // the whistle cord of the captain's small steamer with the other boats.
    // Looked up: the statue was a gift of the French (flags of both nations); the face was
    // covered with a great French flag and it came down (early) in the afternoon; at that the
    // steamers and tugs in the harbour sounded their whistles, drowning the speeches
    // (nps.gov/museum/exhibits/statue_liberty/opening_ceremony.html, boweryboyshistory.com);
    // the fog lifting about three in the afternoon; the people gave coins for the pedestal.
    // From memory: gas lamps along the street.
    // Made up: the flags given away and to those three, the lamp glass wiped, the policeman
    // letting her by when the marchers are gone, her pulling the captain's whistle cord.
    tale: {
      work: true,
      ask: '안개 너머에는 무엇이 서 있을까?',
      gate: { scene: 'newsstand', open: 2, sora: '경찰 아저씨가 막고 있어. 못 가.' },
      steps: [
        {
          goal: '행진 길의 깃발 파는 아주머니를 도와 사람들에게 깃발을 나눠 주렴.', tally: '깃발 {all}개 가운데 {n}개를 나눠 주었다.',
          round: [
            { who: 'tapeboy', lines: ['나도 깃발을 받아도 돼? 고마워!', '부두에 가서 배들에게 흔들 거예요.'] },
            { who: 'drummer', lines: ['북에 두 나라 깃발을 꽂아야겠구나.', '배터리까지 펄럭이며 걸어가마.'] },
            { who: 'coingrandpa', lines: ['프랑스 깃발도 같이 주는구나.', '나도 받침대에 동전을 보탰단다. 고맙다.'] },
          ],
          after: [{ who: 'flagseller', line: '다 나눠 주었구나! 이제 배터리로 가 보렴.' }],
          cheer: '깃발을 다 나눠 주었다!',
          sora: '배터리 쪽 신문 수레로 가 보자!',
          errand: 'flags',
        },
        {
          who: 'lampman', goal: '신문 수레 앞의 가스등 닦는 이를 도와 등 유리를 닦으렴.',
          lines: ['안개 때문에 등 유리가 뿌옇게 흐려졌단다.', '길이 환하게 보이도록 같이 닦으련?'],
          play: {
            kind: 'mash', tally: '가스등 {all}개 가운데 {n}개를 닦았다.', ask: '여러 번 눌러 유리를 닦으렴.', label: '뽀득뽀득', hits: 3, zone: [0.41, 0.59], speed: 0.12,
            good: ['뽀득! 유리가 맑아졌어!', '하나 더!'], miss: ['앗, 얼룩이 남았어!', '조금 더 기다렸다가!'],
          },
          after: [{ who: 'police', line: '행진이 다 지나갔다. 이제 건너도 좋다.' }],
          cheer: '가스등이 맑아졌다!',
          sora: '길이 열렸어! 안개 낀 부두로 가자!',
          errand: 'lamps',
        },
        {
          who: 'captain', goal: '안개 낀 부두의 선장님과 함께 배의 고동을 울리렴.',
          lines: ['안개가 걷히고 있어. 곧 얼굴의 깃발이 내려간단다.', '깃발이 내려가면 고동을 울리자. 줄을 당기련?'],
          play: {
            kind: 'beat', tally: '고동을 {all}번 가운데 {n}번 울렸다.', ask: '금빛 불이 켜질 때 줄을 당기렴.', label: '뿌우!', hits: 3, zone: [0.42, 0.6], speed: 1.5,
            good: ['뿌우! 고동이 울려!', '한 번 더!'], miss: ['앗, 소리가 안 났어!', '조금 일렀어!'], show: 'unveil',
          },
          cheer: '여신상이 얼굴을 드러냈다!',
          sora: '구릿빛 얼굴이 반짝여! 배들도 다 같이 고동을 울려!',
          errand: 'whistle',
        },
      ],
      asides: [
        { who: 'baker', when: ['S0'], lines: ['깃발 파는 아주머니가 바빠 보이는구나.', '깃발 나눠 주는 걸 도와드리렴.'] },
        { who: 'police', when: ['S0', 'S1'], lines: ['행진하는 사람들이 아직 지나가는 중이란다.', '다 지나가면 건너게 해 주마.'] },
        { who: 'newsboy', when: ['S1'], lines: ['안개 때문에 낮인데도 길이 어두워요.', '가스등 아저씨가 혼자서 바빠요.'] },
        { who: 'cabinboy', when: ['S2'], lines: ['안개가 조금씩 걷히고 있어요.', '선장님이 고동을 울릴 사람을 찾아요.'] },
        { who: 'tapeboy', when: ['S3'], lines: ['부두 쪽에서 고동 소리가 들려요!', '여신상이 얼굴을 드러냈나 봐요!'] },
      ],
      done: '깃발을 나눠 주고, 가스등을 닦고, 고동을 울려 여신상을 맞았다.',
    },
    errands: [
      { id: 'flags', text: '두 나라 깃발을 나눠 준다.', at: [] },
      { id: 'lamps', text: '가스등 유리를 닦는다.', at: [] },
      { id: 'whistle', text: '고동을 울려 여신상을 맞는다.', at: [] },
    ],
    reply: '그 여신상은 지금도 그 섬에 서 있단다. 안개에 젖지는 않았니.',
  },
  // Darlington on 27 September 1825, about noon: the day the Stockton and Darlington Railway
  // is opened and the first train drawn by a steam engine comes into the town. Drawn as an
  // English landscape in oils of the 1820s, after Constable (the user's choice of five tries:
  // the second). The pictures are in darlington1825; the try is the third scene ('water': the
  // side of the line where the engine takes on water), and the farmyard by the line and the
  // bank by the stone bridge over the Skerne were ordered after it. The sky of the pictures is
  // a light blue with white clouds: `pale`.
  // Looked up on 2026.10.14 (docs/신기한-사실.md) and found so: opened that day in very fine
  // weather; the train came into Darlington about noon before more than ten thousand people;
  // it stood more than half an hour while the engine took on water; six coal waggons were
  // taken off at Darlington and the coal given to the poor; Mr Meynell's band rode in two
  // waggons from Darlington to Stockton; four waggons carried flags, one a great white flag
  // with the Latin words "Periculum privatum utilitas publica" (said as "내가 짊어진 위험이
  // 모두에게 쓸모가 된다"); a man on horseback with a flag rode before the train; the train
  // was the engine, coal waggons, a waggon of flour sacks, the covered coach of the committee
  // ("Experiment") and open waggons full of people, some sitting on the coal; gentlemen on
  // horses could not keep up; the engine's two upright cylinders half sunk in the boiler and
  // its four wheels joined by rods (said as "본단다": thought to be the first so made); the
  // Skerne Bridge, of stone, made in 1825, carried the first train over the river.
  // Looked up while writing and found only in part: bread and cheese as the common meal of
  // English labourers about 1800 (sources speak of the south): the food to try. To be looked
  // at again. Clogs were not found for 1825: not said.
  // From memory: the dress of England about 1825 (tail coats and tall hats, smocks, high-
  // waisted gowns, bonnets, girls' frocks with pantalettes); waggons on the old waggonways
  // drawn by horses (the grandfather's line); the look of the Skerne Bridge (one great arch
  // with a small arch on each side).
  // Made up: the errand of the drumstick, the farm wife, the drummer, the man in the crowd who
  // cannot let her by, the coal carter who says to go round by the river bank, every other
  // person.
  // Kept out: Stephenson but as a far-off spot on the engine, and who drove it; the name
  // "Locomotion" in people's mouths; the hurt workman, the guns at Stockton, the workmen's
  // ale; numbers of people and of speed; wires, a big station, platforms.
  darlington: {
    first: '첫 철도가 열리는 날이란다. 기관차가 무사히 떠나도록 도와주렴.',
    dir: 'darlington1825', look: 'paper', pale: true,
    // (What is said of today: looked up on 2026.10.14; the picture chosen by the user.)
    now: {
      photo: 'photo-now.webp', name: '스컨 다리의 지금 모습', when: '영국 달링턴 · 2021년',
      text: [
        '1825년에 놓은 이 돌다리 위로 지금도 기차가 다닙니다. 티스 밸리 선의 열차가 이 다리를 건넙니다.',
        '놓은 뒤로 쉬지 않고 쓰여 온 철도 다리 가운데, 이 다리가 세계에서 가장 오래되었습니다.',
        '건축가 이그나티우스 보노미가 이 다리를 돌로 설계했습니다. 가운데 큰 아치가 강을 건너고, 양옆의 작은 아치 밑으로는 길이 지나갑니다.',
        '1990년부터 2002년까지 영국 5파운드 지폐 뒷면에 이 다리 그림이 실렸습니다. 2021년에는 영국이 가장 귀하게 지키는 1등급 보호 건축물이 되었습니다.',
        '다리 곁의 옛 노스로드 역은 철도 박물관 "호프타운 달링턴"으로 새로 꾸며져 2024년 7월에 문을 열었습니다.',
        '2025년 9월 27일, 200주년을 맞아 1975년에 만든 복제 기관차가 이 다리를 다시 건넜습니다. 6,000명쯤이 모여 지켜보았습니다.',
      ],
      credit: '사진: Verbarson, 위키미디어 공용, CC BY-SA 4.0',
    },
    drawn: '그 무렵 영국의 풍경 유화처럼 그렸단다.',
    scenes: [
      {
        id: 'farm', name: '영국 달링턴 철길 가 농가 마당', short: '농가 마당', zoom: 1.134, ground: 0.717, scale: 0.664, air: 'hush', floor: 'dirt',
        sora: '저 멀리 철길이 보여!',
        people: [
          { id: 'farmer', pass: '오늘은 밭일을 일찍 끝내야지.', name: '갈퀴 든 농부', x: 0.18, w: 135, h: 305, lines: ['오늘 저 철길로 기관차가 지나간단다.', '마을 사람들이 다 구경하러 나갔지.'] },
          { id: 'milkmaid', pass: '우유를 얼른 날라 두어야지.', name: '우유 나르는 아가씨', x: 0.29, w: 106, h: 286, lines: ['아침에 짠 우유를 나르는 중이야.', '일을 마치면 나도 구경하러 갈 거야.'] },
          { id: 'granny', pass: '빵을 넉넉히 구워 두길 잘했구나.', show: 'bread', name: '빵과 치즈 차린 할머니', x: 0.4, w: 115, h: 279, lines: ['구경꾼들 먹으라고 빵을 구웠단다.', '치즈와 함께 먹어 보련?'],
            try: { id: 'eat-bread', verb: 'eat', name: '빵과 치즈', face: 'yum', sora: '치즈가 고소하고 빵은 폭신해!' } },
          { id: 'farmwife', pass: '오늘은 손님이 정말 많구나.', name: '농가 아주머니', x: 0.51, w: 113, h: 288, lines: ['악대 사람들이 아까 우리 마당에서 쉬었단다.', '오늘은 손님이 많아 정신이 없구나.'] },
          { id: 'seamstress', pass: '나들이옷을 한 벌 더 지어야겠어.', name: '옷 짓는 아주머니', x: 0.62, w: 124, h: 286, lines: ['구경 가는 날이라 고운 옷을 짓는단다.', '아이 옷도 있어. 입어 보련?'],
            try: { id: 'wear-regency', verb: 'wear', name: '1825년 영국의 옷', outfit: 'regency', sora: '허리띠가 가슴 바로 아래에 있어!', memo: '옛 그리스 조각상의 옷을 본떠서 허리선이 가슴 바로 아래란다. 어른 옷은 이 무렵 허리로 내려오던 참이었지.' } },
          { id: 'boy', pass: '기관차를 꼭 가까이서 볼 거야.', name: '구경 가는 아이', x: 0.73, w: 96, h: 281, lines: ['기관차는 말 없이도 수레를 끈대.', '나는 깃발을 들고 마중 갈 거야.'] },
          { id: 'grandpa', pass: '살다 보니 이런 날을 다 보는구나.', name: '지팡이 짚은 할아버지', x: 0.85, w: 115, h: 320, lines: ['예전에는 말이 철길 수레를 끌었단다.', '이제는 쇠로 만든 기관차가 끈다는구나.'] },
        ],
        spots: [],
      },
      {
        id: 'bridge', name: '영국 달링턴 스컨 강 돌다리 가', short: '스컨 강 돌다리', zoom: 1.198, ground: 0.668, scale: 0.701, air: 'hush', floor: 'dirt',
        sora: '사람들이 강가에 가득해!',
        people: [
          { id: 'painter', pass: '이 다리를 그림에 꼭 담아야지.', name: '그림 그리는 아저씨', x: 0.18, w: 104, h: 308, lines: ['오늘 같은 날은 그림으로 남겨야지.', '열차가 다리를 건너는 모습을 그릴 거란다.'] },
          { id: 'mason', pass: '돌 하나하나를 내 손으로 다듬었지.', show: 'bridge', pose: 'see-wow', sora: '다리가 돌로 둥글게 놓였어!', memo: '이 돌다리는 올해 새로 지었단다. 첫 열차가 이 다리로 강을 건넜지.', name: '다리 놓은 석수', x: 0.29, w: 130, h: 285, lines: ['올해 우리가 이 돌다리를 놓았단다.', '오늘 첫 열차가 이 위로 강을 건넜지.'] },
          { id: 'carter', pass: '석탄을 얼른 마을에 날라야 해요.', name: '석탄 수레 일꾼', x: 0.4, w: 144, h: 271, lines: ['열차에서 떼어 낸 석탄을 나르는 중이야.', '가난한 집에 나눠 줄 석탄이란다.'] },
          { id: 'waver', when: ['S0'], pass: '이렇게 많은 사람은 처음 보는구나.', name: '손수건 흔드는 아주머니', x: 0.51, w: 122, h: 300, lines: ['오늘은 날씨가 참 좋구나.', '열차가 지나갈 때 손수건을 흔들었단다.'] },
          { id: 'flaggirl', when: ['S0'], pass: '깃발을 더 높이 들어야지.', name: '작은 깃발 든 아이', x: 0.62, w: 84, h: 220, lines: ['열차가 지나갈 때 깃발을 흔들었어.', '수레마다 사람이 빼곡히 탔더라.'] },
          { id: 'gentleman', pass: '말을 타고도 따라잡지 못했다네.', name: '모자 흔드는 신사', x: 0.73, w: 147, h: 320, lines: ['나는 말을 타고 열차를 따라 달렸다네.', '그런데 열차가 더 빨라서 놓쳤지 뭔가.'] },
          { id: 'crowdman', when: ['S0'], pass: '여기서 한 걸음도 못 움직이겠군.', name: '구경꾼 틈의 아저씨', x: 0.85, w: 130, h: 294, lines: ['사람이 너무 많아 꼼짝도 못 한단다.', '모두 기관차를 보러 나왔거든.'] },
        ],
        spots: [],
      },
      {
        id: 'water', name: '영국 달링턴 기관차가 물을 넣는 철길 가', short: '물 넣는 철길 가', zoom: 1.168, ground: 0.691, scale: 0.684, air: 'hush', floor: 'dirt',
        sora: '기관차가 멈춰서 물을 마셔!',
        people: [
          { id: 'flagman', pass: '깃발이 바람에 찢어지면 안 되지.', show: 'banner', pose: 'see-aha', sora: '깃발에 글자가 적혀 있어!', memo: '큰 흰 깃발에 옛 라틴 말이 적혔단다. 내가 짊어진 위험이 모두에게 쓸모가 된다는 뜻이지.', name: '깃발 지키는 아저씨', x: 0.18, w: 115, h: 320, lines: ['수레 넷에 깃발을 달았단다.', '이 흰 깃발에는 철도가 열린 날을 적었지.'] },
          { id: 'trumpeter', pass: '나팔을 한 번 더 닦아 두어야지.', name: '나팔 부는 악대 사람', x: 0.29, w: 134, h: 291, lines: ['우리 악대는 야름에서 왔단다.', '여기서부터 수레에 타고 연주하지.'] },
          { id: 'coalboy', pass: '석탄 위에 앉아 오길 잘했어.', name: '석탄 위에 앉아 온 소년', x: 0.4, w: 131, h: 218, lines: ['자리가 없어서 석탄 위에 앉아 왔어.', '말 탄 사람들도 우리를 못 따라왔어.'] },
          { id: 'waterman', pass: '물통이 하나만 더 있으면 되겠어.', name: '물 붓는 일꾼', x: 0.51, w: 111, h: 271, lines: ['기관차는 물을 끓여 김으로 달린단다.', '그래서 여기서 물을 넣고 있지.'] },
          { id: 'drummer', pass: '기관차가 떠날 때 북을 크게 쳐야지.', show: 'train', name: '북 치는 악대 사람', x: 0.62, w: 102, h: 288, lines: ['나는 악대에서 큰북을 친단다.', '기관차가 떠나면 수레 위에서 칠 거야.'] },
          { id: 'smith', pass: '바퀴가 다 같이 잘 도는구나.', show: 'engine', pose: 'see-wow', sora: '바퀴 넷이 막대로 이어졌어!', memo: '실린더 둘이 보일러 위로 솟았단다. 바퀴 넷을 막대로 이어 함께 돌게 한 첫 기관차로 본단다.', name: '기관차 보는 대장장이', x: 0.73, w: 129, h: 258, lines: ['저 막대가 바퀴 넷을 한꺼번에 돌린단다.', '쇠를 다루는 나도 처음 보는 기계야.'] },
          { id: 'clerk', pass: '손님들이 모두 자리에 앉았나 볼까.', name: '객차 지키는 신사', x: 0.85, w: 121, h: 281, lines: ['저 지붕 달린 객차는 이름이 익스페리먼트란다.', '철도 회사 사람들이 타고 왔지.'] },
        ],
        spots: [
          // The engine in the try (x 0.71 to 0.85 of the picture). Stephenson is not drawn and
          // cannot be spoken to; who drove the engine is not said.
          { id: 'stephenson', from: 0.71, to: 0.85, sora: '기관차 옆에 누가 서 있어!', memo: '이 철길을 놓은 조지 스티븐슨이란다. 오늘은 바빠서 말을 걸 수 없지.' },
        ],
      },
    ],
    // "The work of the day" (core/tale.js `work`; the user, 2026.10.15: "이야기 패턴이 너무
    // 단순한데", then the way chosen, the work of that day itself, and "달링턴부터 해보자"): the
    // engine is coming over the Skerne bridge and people stand on the line; she asks three of
    // them to step back. It stops by Darlington to take on water (it did, for over half an
    // hour: docs/신기한-사실.md), and she pours it in. The band plays from the waggons as it
    // leaves (it did, from Darlington to Stockton); she beats the drum with them, and the
    // engine draws its flagged waggons away, a rider with a flag going before.
    // Made up: the three on the line and what they say, her pouring the water, the drum beaten
    // three times as a sign to go.
    tale: {
      work: true,
      ask: '기관차는 수레들을 어떻게 끌고 갈까?',
      gate: { scene: 'bridge', open: 1, sora: '철길 위에 사람들이 있어. 못 가.' },
      steps: [
        {
          goal: '돌다리 가의 철길 위 사람들에게 비켜 달라고 하렴.', tally: '철길 위 {all}명 가운데 {n}명이 비켜 주었다.',
          round: [
            { who: 'waver', lines: ['어머, 내가 철길 위에 서 있었구나.', '고맙다. 둑 위로 물러서마.'] },
            { who: 'flaggirl', lines: ['기관차가 온다고? 얼른 비킬게!', '둑 위에서 깃발을 흔들 거야.'] },
            { who: 'crowdman', lines: ['기관차가 곧 온다고? 이런, 비켜야지.', '여러분, 철길에서 물러섭시다!'] },
          ],
          after: [{ who: 'gentleman', line: '철길이 비었구나! 기관차가 다리를 건너온다.' }],
          cheer: '철길을 다 비웠다!',
          sora: '기관차가 물 넣는 곳으로 갔대! 가 보자!',
          errand: 'clear',
        },
        {
          who: 'waterman', goal: '물 넣는 철길 가의 물 붓는 일꾼을 도우렴.',
          lines: ['기관차는 물을 끓인 김으로 달린단다.', '물을 다 넣어야 다시 떠나지. 도와주련?'],
          play: {
            kind: 'fill', tally: '물통 {all}개 가운데 {n}개를 부었다.', ask: '꾹 눌러 물을 붓다가 금빛 칸에서 떼렴.', label: '물 붓기', hits: 3, zone: [0.65, 0.85], speed: 0.5,
            good: ['콸콸! 잘 들어갔어!', '한 통 더!'], miss: ['앗, 물이 넘쳤어!', '조금 더 부어야 해!'],
          },
          after: [{ who: 'smith', line: '김이 다시 오르는구나. 곧 떠나겠어.' }],
          cheer: '물을 가득 넣었다!',
          sora: '물을 다 넣었어! 북 치는 아저씨에게 가 보자!',
          errand: 'water',
        },
        {
          who: 'drummer', goal: '북 치는 아저씨와 함께 북을 쳐서 기관차를 떠나보내렴.',
          lines: ['물을 다 넣었으니 이제 떠난단다.', '떠날 때 큰북을 쳐서 알리자. 같이 치련?'],
          play: {
            kind: 'beat', tally: '북을 {all}번 가운데 {n}번 쳤다.', ask: '금빛 불이 켜질 때 북을 치렴.', label: '둥!', hits: 3, zone: [0.42, 0.58], speed: 1.5,
            good: ['둥!', '둥! 한 번 더!'], miss: ['앗, 박자가 어긋났어!', '조금 일렀어!'], show: 'train',
          },
          cheer: '기관차가 떠난다!',
          sora: '말 탄 아저씨가 깃발을 들고 앞서 가!',
          errand: 'drum',
        },
      ],
      asides: [
        { who: 'boy', when: ['S0'], lines: ['기관차가 곧 스컨 강 돌다리를 건너온대.', '그런데 철길 위에 구경꾼들이 서 있대!'] },
        { who: 'gentleman', when: ['S0'], lines: ['기관차가 곧 이 다리를 건너온단다.', '철길 위 사람들이 비켜야 할 텐데.'] },
        { who: 'carter', when: ['S0'], lines: ['기관차가 오면 석탄 수레를 떼어 낸단다.', '가난한 집에 나눠 줄 석탄이지.'] },
        { who: 'boy', when: ['S3'], lines: ['기관차가 떠나는 소리 들었어?', '북소리가 여기까지 들렸어!'] },
      ],
      done: '철길을 비우고, 물을 넣고, 북을 쳐서 기관차를 떠나보냈다.',
    },
    errands: [
      { id: 'clear', text: '철길 위 구경꾼들을 비키게 한다.', at: [] },
      { id: 'water', text: '기관차에 물을 넣는다.', at: [] },
      { id: 'drum', text: '북을 쳐서 기관차를 떠나보낸다.', at: [] },
    ],
    reply: '그날 처음 달린 철길은 그 뒤로 온 세상에 놓였단다.',
  },
  // Kill Devil Hills, by Kitty Hawk, North Carolina, on 17 December 1903, the morning the
  // Wright brothers flew: cold, a strong north wind, an overcast sky, ice on the puddles. Drawn
  // as a seaside watercolour after Winslow Homer (the user's choice of five tries: the second).
  // The pictures are in kittyhawk1903; the try is the third scene (the brothers' camp), to be
  // put right by hand (grey sky, elevator and rudder, pusher propellers, a single rail, ice);
  // the life-saving station and the iced sand path were ordered after it. Pale: the sky of the
  // pictures is a light grey.
  // Looked up on 2026.10.15 (docs/신기한-사실.md) and found so: four flights that day, the
  // first at about 10:35; cold, a strong north wind, ice on the puddles by the camp; the sky
  // overcast (one source); the brothers warmed their hands inside; men of the Kill Devil Hills
  // life-saving station watched; the brothers put up a signal when they wanted help and the
  // station's lookout saw it; the surfmen walked the beach watching for wrecks and, off duty,
  // carried the brothers' mail; the station was about a mile from the camp; the rail was a
  // single line of wood laid on the flat sand; the machine had a double elevator in front, a
  // double rudder behind, two propellers behind turned by chains like a bicycle's; the engine
  // was made by the mechanic of the brothers' bicycle shop; Orville set up the camera and asked
  // a surfman to press the bulb when the machine rose; the brothers had flown gliders there in
  // the years before.
  // Looked up while writing (airandspaceforces.com, "Dawn at Kill Devil Hill"): the people of
  // Kitty Hawk ate fish when they caught it; the brothers had a good stove in camp. Surfmen
  // cooked their own meals at Outer Banks stations (found for Chicamacomico, not for Kill Devil
  // Hills). Coffee and fish soup at the station were looked for and NOT found: the cook only
  // fries fish. To be looked at again.
  // From memory: the dress of 1903 and the dark blue coat and cap of the life-saving service;
  // the look of the station (a lookout on the roof, a white surfboat); nets, shells, live oaks.
  // Made up: the surfman at the wing tip, every other person (the work of the day: see the
  // comment before the tale).
  // Kept out: the brothers but far off (spots, no face); the real names of the watchers;
  // numbers of seconds and of distance; the machine overturned afterwards and the hurt surfman;
  // "the first in the world"; a blue sky and the sun; wheels; the telegram.
  kittyHawk: {
    first: '바닷가에서 형제가 비행기를 띄우는 날이란다. 비행기가 잘 뜨도록 도와주렴.',
    dir: 'kittyhawk1903', look: 'paper', pale: true,
    // (What is said of today: looked up on 2026.10.16; the picture chosen by the user.)
    now: {
      photo: 'photo-now.webp', name: '라이트 형제 기념탑의 지금 모습', when: '미국 노스캐롤라이나 킬데빌힐스 · 2017년',
      text: [
        '라이트 형제가 날았던 곳은 지금 "라이트 형제 국립 기념지"입니다. 미국 국립공원관리청이 돌보며, 2024년에는 40만 명쯤이 찾았습니다.',
        '바람에 날리던 모래 언덕은 1929년에 풀과 나무를 심어 굳혔습니다. 그래서 지금은 풀로 덮인 언덕이 되었습니다.',
        '언덕 꼭대기에는 1932년에 세운 높이 18미터의 화강암 기념탑이 있습니다.',
        '들판의 큰 돌은 비행기가 떠오른 곳을 알립니다. 1928년에 그날을 본 사람 세 명이 그 자리를 짚어 주었습니다.',
        '큰 돌 북쪽에는 번호를 새긴 돌 4개가 있어, 그날 네 번의 비행이 각각 내려앉은 곳을 알립니다.',
        '형제가 쓰던 비행기 창고와 숙소는 옛 사진을 보고 다시 지었습니다. 안내관에는 1903년의 비행기를 똑같이 본떠 만든 것이 있습니다.',
      ],
      credit: '사진: Yuming Huang, 위키미디어 공용, CC BY-SA 4.0',
    },
    drawn: '그 무렵 미국 화가의 바닷가 수채화처럼 그렸단다.',
    scenes: [
      {
        id: 'station', name: '미국 킬데빌힐스 인명 구조대 앞', short: '인명 구조대 앞', zoom: 1.250, ground: 0.628, scale: 0.732, air: 'hush', floor: 'dirt',
        sora: '바닷바람이 정말 차가워!',
        people: [
          { id: 'keeper', pass: '오늘은 바다가 조용해야 할 텐데.', name: '구조대장', x: 0.18, w: 109, h: 308, lines: ['우리는 바닷가를 걸으며 난파선을 살핀단다.', '배가 위험하면 구조선을 띄우지.'] },
          { id: 'cook', pass: '생선이 타지 않게 봐야지.', show: 'fish', name: '밥 당번 구조대원', x: 0.29, w: 94, h: 292, lines: ['오늘은 내가 밥 당번이란다.', '바다에서 잡은 생선을 구웠지. 먹어 보련?'],
            try: { id: 'eat-fish', verb: 'eat', name: '구운 생선', face: 'yum', sora: '생선이 따끈하고 고소해!' } },
          { id: 'mender', pass: '찢어진 그물코를 다 기워야지.', name: '그물 깁는 아주머니', x: 0.4, w: 115, h: 283, lines: ['우리 마을 사람들은 고기를 잡아 산단다.', '바람이 세면 그물이 자주 찢어지지.'] },
          { id: 'lookout', pass: '망대에서 캠프 깃대가 잘 보인단다.', name: '망보는 구조대원', x: 0.51, w: 105, h: 302, lines: ['나는 지붕 위 망대에서 바다를 본단다.', '아까 형제의 캠프에 신호가 올랐지.'] },
          { id: 'mailman', pass: '편지가 바람에 날리면 안 되지.', name: '우편물 나르는 구조대원', x: 0.62, w: 106, h: 320, lines: ['쉬는 날엔 형제의 편지를 날라 준단다.', '형제는 오하이오에서 왔지.'] },
          { id: 'knitter', pass: '털실이 조금 모자라겠구나.', name: '털옷 짓는 아주머니', x: 0.73, w: 125, h: 290, lines: ['바닷바람이 차서 두꺼운 옷을 짓는단다.', '아이 옷도 있어. 입어 보련?'],
            try: { id: 'wear-banks1903', verb: 'wear', name: '1903년 바닷가 마을의 겨울옷', outfit: 'banks1903', sora: '털실 두건이 정말 따뜻해!', memo: '그 무렵 바닷가 마을 아이들은 겨울에 두꺼운 모직 옷을 입었단다.' } },
          { id: 'boatboy', pass: '구조선은 늘 깨끗해야 해요.', name: '구조선 닦는 아이', x: 0.85, w: 87, h: 243, lines: ['나는 구조선을 닦는 걸 도와요.', '크면 나도 구조대원이 될 거예요.'] },
        ],
        spots: [],
      },
      {
        id: 'path', name: '미국 킬데빌힐스 얼음 낀 모래길', short: '얼음 낀 모래길', zoom: 1.231, ground: 0.643, scale: 0.720, air: 'hush', floor: 'dirt',
        sora: '웅덩이에 얼음이 얼었어!',
        people: [
          { id: 'woodman', pass: '마른 가지가 많아서 다행이구나.', name: '땔나무 줍는 할아버지', x: 0.18, w: 132, h: 290, lines: ['오늘 같은 날은 불을 넉넉히 때야지.', '이렇게 추운 겨울은 오랜만이구나.'] },
          { id: 'waterwoman', pass: '물통이 얼기 전에 가야지.', name: '물 긷는 아주머니', x: 0.29, w: 117, h: 281, lines: ['아침에 보니 물통 위가 얼었더구나.', '북풍이 아주 세게 부는 날이야.'] },
          { id: 'shellgirl', pass: '예쁜 조개를 또 찾았어.', show: 'ice', pose: 'see-aha', sora: '웅덩이가 꽁꽁 얼었어!', memo: '그날은 몹시 추워서 캠프 둘레의 웅덩이에 얼음이 얼었단다.', name: '조개 줍는 아이', x: 0.4, w: 103, h: 217, lines: ['나는 바닷가에서 조개를 주워요.', '이 길은 모래 언덕까지 다 알아요.'] },
          { id: 'granny', pass: '저 언덕도 참 오래 봤구나.', name: '언덕 바라보는 할머니', x: 0.51, w: 114, h: 276, lines: ['저 형제는 몇 해째 이 언덕에 온단다.', '전에는 큰 연 같은 것을 날렸지.'] },
          { id: 'boatman', pass: '오늘은 배를 띄우기 어렵겠군.', name: '배 손보는 아저씨', x: 0.62, w: 122, h: 320, lines: ['바람이 세서 오늘은 고기잡이를 쉰단다.', '대신 노를 손보는 중이지.'] },
          { id: 'woodboy', pass: '장작을 떨어뜨리면 안 돼.', name: '장작 나르는 아이', x: 0.73, w: 90, h: 228, lines: ['집에 땔 장작을 나르는 중이에요.', '손이 시려서 얼른 가야 해요.'] },
          { id: 'fisherman', pass: '모래길은 수레가 지나기 힘들구나.', name: '수레 멈춘 어부', x: 0.85, w: 155, h: 295, lines: ['바닷가를 돌며 그물을 걷어 왔단다.', '그물을 실어서 무겁기도 하구나.'] },
        ],
        spots: [],
      },
      {
        id: 'camp', name: '미국 킬데빌힐스 형제의 캠프', short: '형제의 캠프', zoom: 1.199, ground: 0.667, scale: 0.702, air: 'hush', floor: 'dirt',
        sora: '날개가 위아래로 두 겹이야!',
        people: [
          { id: 'warmer', pass: '손가락이 말을 안 듣는구나.', name: '손 녹이는 구조대원', x: 0.18, w: 93, h: 294, lines: ['레일을 깔다가 손이 꽁꽁 얼었단다.', '형제도 헛간 난로에서 손을 녹였지.'] },
          { id: 'neighbor', pass: '이런 기계는 처음 보는구나.', show: 'chain', pose: 'see-aha', sora: '자전거 사슬이 달렸어!', memo: '형제는 자전거 가게를 했단다. 엔진이 사슬로 뒤의 프로펠러 둘을 돌리지.', name: '이웃 마을 아저씨', x: 0.29, w: 132, h: 241, lines: ['형제는 고향에서 자전거 가게를 한대.', '그래서 자전거 사슬을 달았다는구나.'] },
          { id: 'cameraman', pass: '고무공을 꼭 눌러야 할 텐데.', show: 'camera', pose: 'see-wow', sora: '사진기가 레일을 보고 있어!', memo: '형제가 사진기를 세워 두고, 뜨는 순간 누르라고 구조대원에게 맡겼단다.', name: '사진기 곁의 구조대원', x: 0.4, w: 114, h: 320, lines: ['비행기가 뜨면 이 공을 누르래.', '사진기는 처음 만져 봐서 떨린단다.'] },
          { id: 'youngman', pass: '모자가 날아갈 것 같아요.', name: '옆 마을에서 온 젊은이', x: 0.51, w: 115, h: 304, lines: ['바람이 세서 모자를 꼭 눌러야 해요.', '오늘 정말 날 수 있을까요?'] },
          { id: 'woodgirl', pass: '난로가 꺼지면 안 돼요.', name: '장작 나르는 소녀', x: 0.62, w: 111, h: 244, lines: ['형제의 난로에 넣을 장작이에요.', '헛간 안은 그래도 따뜻해요.'] },
          { id: 'signalman', pass: '신호를 보고 바로 달려왔지.', name: '신호 보고 온 구조대원', x: 0.73, w: 138, h: 293, lines: ['저 깃대에 신호가 올라서 왔단다.', '도움이 필요하면 형제가 신호를 올리지.'] },
          { id: 'wingman', pass: '바람에 날개가 들썩이는구나.', show: 'flight', name: '날개 끝 잡은 구조대원', x: 0.85, w: 100, h: 297, lines: ['비행기를 레일 위로 옮기는 걸 거들었단다.', '바람에 들썩이지 않게 날개를 잡고 있지.'] },
        ],
        spots: [
          // The aeroplane on the rail in the try (x 0.49 to 0.93 of the picture). The brothers
          // are not drawn and cannot be spoken to: far off, no face.
          { id: 'brothers', from: 0.5, to: 0.9, sora: '비행기 곁에 형제가 있어!', memo: '오빌과 윌버 라이트 형제란다. 오늘은 바빠서 말을 걸 수 없지.' },
          // The flag pole at the right of the try (x about 0.91).
          { id: 'flag', from: 0.9, to: 0.98, sora: '깃대에 깃발이 날려!', memo: '형제는 도움이 필요하면 신호를 올렸단다. 구조대가 그걸 보고 왔지.' },
        ],
      },
    ],
    // "The work of the day" (core/tale.js `work`, as at Darlington and London): the lookout on
    // the roof of the life-saving station has seen the brothers' signal flag at the camp and
    // cannot leave his post, so she runs round the station telling the keeper, the mailman and
    // the cook; on the iced sand path the fisherman's cart is stuck in the sand across the
    // narrow way and she pushes it out with him; at the camp the surfman by the camera is to
    // squeeze the rubber bulb as the machine rises, and she presses it with him (twice for
    // practice, the third time as the machine slides along the rail into the north wind and
    // rises from the sand).
    // Looked up (docs/신기한-사실.md; maritime-executive.com, "Coast Guardsmen pioneered flight
    // with Wright brothers"; npshistory.com, Historical Handbook 34): the brothers flew a red
    // flag from the camp when they wanted help, by leave of the station's keeper, and the
    // station's lookout saw it on 17 December; surfmen came and moved the machine to its
    // starting place on the rail; a surfman who had never worked a camera was to squeeze the
    // bulb as it rose, and nearly forgot in his excitement; it rose into the north wind.
    // Made up: her telling the keeper, the mailman and the cook, and what they say; the cart
    // stuck on the path and pushed out with the fisherman; her pressing the bulb with the
    // surfman, and the two presses for practice.
    tale: {
      work: true,
      ask: '저 비행기는 정말 날 수 있을까?',
      gate: { scene: 'path', open: 2, sora: '수레가 길을 막고 있어. 못 가.' },
      steps: [
        {
          goal: '인명 구조대 앞의 사람들에게 신호가 올랐다고 알리렴.', tally: '구조대 사람 {all}명 가운데 {n}명에게 알렸다.',
          round: [
            { who: 'keeper', lines: ['형제의 캠프에 신호가 올랐다고?', '알았다. 쉬는 대원들은 가서 거들게 하마.'] },
            { who: 'mailman', lines: ['신호라니, 오늘 비행기를 띄우나 보구나.', '나도 얼른 캠프로 가 보마.'] },
            { who: 'cook', lines: ['신호가 올랐다고? 생선은 이따 먹어야겠구나.', '가는 대원들 손이 얼지 않아야 할 텐데.'] },
          ],
          after: [{ who: 'lookout', line: '고맙다. 대원들이 캠프로 가는구나.' }],
          cheer: '신호를 다 알렸다!',
          sora: '우리도 모래길을 따라 캠프에 가 보자!',
          errand: 'told',
        },
        {
          who: 'fisherman', goal: '얼음 낀 모래길의 어부 아저씨와 함께 수레를 밀렴.',
          lines: ['내 수레 바퀴가 모래에 빠졌단다.', '길을 막아서 미안하구나. 같이 밀어 주련?'],
          play: {
            kind: 'mash', tally: '수레를 {all}번 가운데 {n}번 힘껏 밀었다.', ask: '여러 번 눌러 수레를 밀렴.', label: '으쌰!', hits: 3, zone: [0.41, 0.59], speed: 0.12,
            good: ['으쌰! 바퀴가 움직여!', '조금만 더!'], miss: ['앗, 발이 모래에 미끄러졌어!', '조금 일렀어!'],
          },
          after: [{ who: 'boatman', line: '수레가 빠져나왔구나. 이제 길이 트였어.' }],
          cheer: '길이 트였다!',
          sora: '캠프에 깃발이 날려! 얼른 가자!',
          errand: 'cart',
        },
        {
          who: 'cameraman', goal: '형제의 캠프에서 사진기 곁의 아저씨와 함께 고무공을 누르렴.',
          lines: ['비행기가 뜨는 순간에 이 고무공을 누르래.', '두 번 연습하고 세 번째에 진짜로 누르자.'],
          play: {
            kind: 'aim', tally: '고무공 누르기 {all}번 가운데 {n}번을 맞췄다.', ask: '하얀 점이 금빛 칸에 올 때 공을 누르렴.', label: '찰칵!', hits: 3, zone: [0.42, 0.58], speed: 0.7,
            good: ['연습은 잘됐어! 한 번 더!', '엔진이 돈다! 이번엔 진짜야!'], miss: ['앗, 조금 늦었어!', '조금 일렀어!'], show: 'flight',
          },
          cheer: '비행기가 떴다!',
          sora: '비행기가 떴다가 모래 위에 내려앉았어!',
          errand: 'photo',
        },
      ],
      asides: [
        { who: 'lookout', when: ['S0'], lines: ['형제의 캠프에 신호 깃발이 올랐단다.', '나는 망대를 지켜야 해. 모두에게 알려 주렴.'] },
        { who: 'shellgirl', when: ['S1'], lines: ['어부 아저씨 수레가 모래에 빠졌어요.', '혼자서는 빼내기 힘들 것 같아요.'] },
        { who: 'fisherman', when: ['S2', 'S3'], lines: ['고맙다, 얘야. 수레가 잘 굴러가는구나.', '나도 그물을 두고 구경하러 가련다.'] },
        { who: 'signalman', when: ['S2'], lines: ['우리가 비행기를 레일 위로 옮겼단다.', '이제 엔진이 돌면 레일을 미끄러지지.'] },
        { who: 'youngman', when: ['S3'], lines: ['비행기가 정말 날았어요!', '바람을 안고 모래 위로 떠올랐어요.'] },
      ],
      done: '신호를 알리고, 수레를 밀고, 비행기가 뜨는 순간 사진기의 고무공을 눌렀다.',
    },
    errands: [
      { id: 'told', text: '구조대에 신호가 올랐다고 알린다.', at: [] },
      { id: 'cart', text: '어부 아저씨의 수레를 밀어 길을 연다.', at: [] },
      { id: 'photo', text: '비행기가 뜨는 순간 사진기의 고무공을 누른다.', at: [] },
    ],
    reply: '그 짧은 비행에서 사람이 하늘을 나는 길이 열렸단다.',
  },
  // Gatun on 15 August 1914, in the morning: the day the steamship Ancon makes the first
  // official passage through the Panama Canal and is lifted up the three steps of the Gatun
  // Locks. Drawn as an oil painting of the canal works of 1913, after Jonas Lie (the user's
  // choice of five tries: the fourth). The pictures are in panama1914; the try is the third
  // scene ('lock': beside the wall of the Gatun Locks), and the workers' village and the
  // railway below the lock wall were ordered after it. The sky of the pictures is a light grey
  // under low cloud: `pale`.
  // Looked up on 2026.10.15 (docs/신기한-사실.md) and found so: the first official passage that
  // day; the ship reached Gatun in the morning; she was dressed with flags from bow to stern and
  // flew the flags of many nations; all other traffic was stopped while she passed (so the wall
  // is shut to all); the President of Panama and canal officials were aboard; the war in Europe
  // kept back the great celebration (said as "먼 데서 큰 싸움이 나 축하를 크게 못 한단다");
  // the gates of two leaves meeting in a V, hollow so that they float; the electric engines on
  // the walls called mules, holding the ship with cables, on a track with a toothed rail; most
  // workers from the West Indies (Barbados, Jamaica); West Indian women kept eating places and
  // did washing; Gorgas's men oiled pools and screened houses against mosquitoes; the Culebra
  // Cut dug with steam shovels, the earth carried by trains.
  // Looked up while writing and not found: rice and peas and fried bread sold by West Indian
  // women: not said (the food to try is fruit).
  // From memory: the dress of the Canal Zone about 1914; the police in khaki; houses on posts
  // with screened verandas and tin roofs (as the try shows); bananas, pineapples and mangoes
  // sold in the villages; the girls' white frocks; the hoop and stick.
  // Made up: every person (the work of the day: see the comment before the tale).
  // Kept out: Goethals; Porras and the guests but as a faceless far-off spot on the deck; the
  // dead of the works, landslides, blasting, the sick; the gold roll and the silver roll; drink;
  // numbers of days, hours, people and fares; the name Gaillard Cut; container ships, the new
  // locks, the engines of today; the steam shovel's bucket.
  panama: {
    first: '운하에 첫 배가 지나가는 날이란다. 배가 잘 지나가도록 도와주렴.',
    dir: 'panama1914', look: 'paper', pale: true,
    // (What is said of today: looked up on 2026.10.16; the picture chosen by the user.)
    now: {
      photo: 'photo-now.webp', name: '가툰 갑문의 지금 모습', when: '파나마 콜론 가툰 · 2015년',
      text: [
        '파나마 운하는 길이가 80킬로미터쯤이고, 대서양과 태평양을 하나의 물길로 잇습니다.',
        '가툰 갑문은 배를 바다보다 26미터쯤 높은 가툰 호수까지 들어 올립니다.',
        '가툰 호수는 1913년에 차그레스 강을 막아 만들었습니다. 그때는 사람이 만든 호수 가운데 가장 컸습니다.',
        '지금 갑문 벽 위를 달리는 기관차는 일본 미쓰비시에서 새로 들여왔습니다. 기관차 여러 대가 큰 배 한 척에 줄을 걸어 배를 붙잡아 줍니다.',
        '운하는 미국이 지어 운영했습니다. 1977년 두 나라가 맺은 조약에 따라 1999년 12월 31일에 파나마가 운하를 넘겨받았습니다.',
        '2016년 6월 26일, 가툰 갑문 가까이에 더 큰 배를 위한 아구아 클라라 갑문이 문을 열었습니다. 새 갑문에서는 벽 위의 기관차를 쓰지 않습니다.',
      ],
      credit: '사진: Balou46, 위키미디어 공용, CC BY-SA 4.0',
    },
    drawn: '그 무렵 운하 공사를 그린 유화처럼 그렸단다.',
    scenes: [
      {
        id: 'village', name: '파나마 가툰 일꾼 마을', short: '일꾼 마을', zoom: 1.158, ground: 0.699, scale: 0.678, air: 'market', floor: 'dirt',
        sora: '집이 기둥 위에 올라가 있어!',
        people: [
          { id: 'laundress', pass: '해가 나기 전에 빨래를 다 해야지.', name: '빨래하는 아주머니', x: 0.18, w: 114, h: 311, lines: ['일꾼들의 흰 셔츠를 빨아 주는 중이란다.', '오늘은 다들 깨끗한 옷을 입고 싶어 하지.'] },
          { id: 'fruitseller', pass: '바나나가 아주 잘 익었구나.', show: 'fruit', name: '과일 파는 아주머니', x: 0.29, w: 132, h: 303, lines: ['오늘 아침에 딴 과일을 가져왔단다.', '파인애플 한 조각 먹어 보련?'],
            try: { id: 'eat-fruit', verb: 'eat', name: '바나나와 파인애플', face: 'yum', sora: '파인애플이 달고 새콤해!' } },
          { id: 'oilman', pass: '이 웅덩이에도 기름을 뿌려야겠어.', show: 'veranda', pose: 'see-aha', sora: '베란다에 그물을 쳤어!', memo: '모기가 못 들어오게 집마다 그물을 쳤단다. 모기가 알을 낳지 못하게 웅덩이에는 기름을 뿌렸지.', name: '모기 잡는 일꾼', x: 0.4, w: 129, h: 320, lines: ['나는 모기를 막는 일을 한단다.', '고인 물에 기름을 뿌리면 모기가 줄지.'] },
          { id: 'cook', pass: '오늘은 밥을 넉넉히 지어야지.', name: '밥집 아주머니', x: 0.51, w: 119, h: 306, lines: ['나는 바베이도스에서 와서 밥집을 한단다.', '오늘은 아침부터 손님이 많구나.'] },
          { id: 'seamstress', pass: '나들이옷을 한 벌 더 지어야겠어.', name: '옷 짓는 아주머니', x: 0.62, w: 120, h: 318, lines: ['배 구경 가는 날이라 고운 옷을 짓는단다.', '아이 옷도 있어. 입어 보련?'],
            try: { id: 'wear-zone1914', verb: 'wear', name: '1914년 운하 마을의 옷', outfit: 'zone1914', sora: '하얀 옷에 주홍 띠를 둘렀어!', memo: '그 무렵 운하 마을의 여자아이들은 시원한 흰 무명 옷을 즐겨 입었단다.' } },
          { id: 'hoopboy', pass: '굴렁쇠를 갑문까지 굴려 가야지.', name: '굴렁쇠 굴리는 아이', x: 0.73, w: 117, h: 234, lines: ['오늘 큰 배가 물 계단을 올라간대.', '나도 물가에 나가서 볼 거야.'] },
          { id: 'grandpa', pass: '살다 보니 이런 날을 다 보는구나.', name: '자메이카에서 온 할아버지', x: 0.85, w: 130, h: 315, lines: ['젊을 때 자메이카에서 배를 타고 왔단다.', '이 운하를 짓는 걸 오래도록 보았지.'] },
        ],
        spots: [],
      },
      {
        id: 'rail', name: '파나마 가툰 갑문 아래 철길', short: '갑문 아래 철길', zoom: 1.150, ground: 0.705, scale: 0.673, air: 'hush', floor: 'dirt',
        sora: '벽이 하늘만큼 높아!',
        people: [
          { id: 'trackman', pass: '레일이 하나도 어긋나면 안 되지.', name: '철길 고치는 일꾼', x: 0.18, w: 106, h: 314, lines: ['공사 때는 흙 실은 기차가 쉬지 않고 다녔단다.', '쿨레브라에서는 증기 삽차로 산을 깎았지.'] },
          { id: 'engineer', pass: '문이 꼭 맞물려야 물이 새지 않지.', show: 'gate', pose: 'see-wow', sora: '문 두 짝이 V 자로 맞물려!', memo: '갑문 문은 속이 비어서 물에 뜬단다. 두 짝이 V 자로 맞물려 물을 막지.', name: '도면 든 기술자', x: 0.29, w: 114, h: 305, lines: ['저 무쇠 문은 두 짝이 가운데에서 맞물린단다.', '문이 닫히면 방에 물을 채우지.'] },
          { id: 'bananakid', pass: '배가 오기 전에 물가로 가야지.', name: '바나나 바구니 인 아이', x: 0.4, w: 94, h: 270, lines: ['나는 바나나를 팔러 왔어.', '이따가 물가에서 배를 볼 거야.'] },
          { id: 'waterman', pass: '물통이 하나만 더 있으면 되겠어.', name: '물통 나르는 일꾼', x: 0.51, w: 86, h: 310, lines: ['벽 위의 일꾼들에게 물을 나른단다.', '오늘은 아침부터 무척 덥구나.'] },
          { id: 'photographer', pass: '오늘 같은 날은 꼭 찍어 두어야지.', name: '사진 찍는 아저씨', x: 0.62, w: 101, h: 304, lines: ['첫 배가 지나가는 모습을 찍을 거란다.', '구름이 걷히면 좋으련만.'] },
          { id: 'rester', pass: '물 한 잔 마시고 다시 일해야지.', name: '쉬는 일꾼', x: 0.73, w: 103, h: 289, lines: ['먼 데서 큰 싸움이 나서 축하 잔치를 못 한단다.', '그래도 일꾼들은 모두 기뻐하고 있지.'] },
          { id: 'police', pass: '배가 지나가는 동안 잘 지켜야지.', name: '운하 지대 경관', x: 0.85, w: 110, h: 320, lines: ['첫 배가 지나가는 동안은 다른 배도 멈췄단다.', '오늘은 갑문을 꼭 지켜야 하지.'] },
        ],
        spots: [],
      },
      {
        id: 'lock', name: '파나마 가툰 갑문 벽 옆', short: '갑문 벽 옆', zoom: 1.052, ground: 0.780, scale: 0.616, air: 'hush', floor: 'dirt',
        sora: '배에 깃발이 줄줄이 달렸어!',
        people: [
          { id: 'waver', pass: '배가 오면 모자를 흔들어야지.', name: '손 흔드는 일꾼', x: 0.18, w: 105, h: 320, lines: ['일꾼들이 모두 물가에 나왔단다.', '우리가 지은 운하로 배가 지나가는구나.'] },
          { id: 'gauger', pass: '물이 차오르는 걸 잘 보아야지.', name: '물 높이 보는 일꾼', x: 0.29, w: 99, h: 273, lines: ['방에 물이 차오르면 배가 위로 뜬단다.', '그렇게 세 계단을 올라 호수로 가지.'] },
          { id: 'painter', pass: '이 큰 벽을 그림에 다 담아야지.', name: '그림 그리는 화가', x: 0.4, w: 100, h: 276, lines: ['나는 운하를 그리러 멀리서 왔단다.', '이렇게 큰 벽은 처음 그려 본단다.'] },
          { id: 'son', pass: '밧줄이 엉키지 않게 잘 감아야지.', show: 'ship', name: '밧줄 다루는 청년', x: 0.51, w: 85, h: 267, lines: ['나는 배와 기관차를 밧줄로 잇는 일을 해.', '배가 들어오면 밧줄을 배에 걸지.'] },
          { id: 'driver', pass: '밧줄을 너무 세게 당기면 안 되지.', show: 'mule', pose: 'see-wow', sora: '기관차가 벽 위 철길에 섰어!', memo: '이 전기 기관차는 노새라고 불렸단다. 배를 끌지 않고 밧줄로 가운데에 잡아 주지.', name: '기관차 모는 기관사', x: 0.62, w: 96, h: 290, lines: ['이 기관차는 노새라고 부른단다.', '철길 가운데의 톱니 레일을 물고 가지.'] },
          { id: 'clerk', pass: '오늘 지나가는 배를 꼭 적어 두어야지.', name: '배 이름 적는 서기', x: 0.73, w: 90, h: 271, lines: ['첫 배의 이름은 안콘 호란다.', '이 장부에 배 이름을 하나하나 적지.'] },
          { id: 'granny', pass: '저 배가 우리 운하를 처음 지나는구나.', name: '구경 온 할머니', x: 0.85, w: 91, h: 256, lines: ['배가 깃발로 곱게 꾸몄구나.', '이런 날을 보려고 일찍 나왔단다.'] },
        ],
        spots: [
          // The deck of the ship in the try (x 0.82 to 0.98 of the picture). The President of
          // Panama and the guests are not drawn and cannot be spoken to. Goethals is not named.
          { id: 'guests', from: 0.82, to: 0.98, sora: '배 위에 손님들이 서 있어!', memo: '파나마의 포라스 대통령과 운하 사람들이 첫 배에 탔단다. 오늘은 말을 걸 수 없지.' },
        ],
      },
    ],
    // "The work of the day" (core/tale.js `work`, as at Darlington and London): in the workers'
    // village she hands the clean white shirts the laundress has washed to three people who
    // will put them on to see the ship; on the railway below the lock wall she tells three
    // workers that the first ship has come to Gatun, and they go up to the water's edge (the
    // policeman lets her up with them); beside the lock wall she throws the lines to the ship
    // with the young line handler, and the ship dressed with flags is held by the engines on
    // the walls and lifted step by step as the water rises.
    // Looked up (docs/신기한-사실.md): West Indian women did washing for the workers; the
    // Ancon reached Gatun in the morning; other traffic was stopped while she passed; workers
    // lined the water's edge to see her (one source); the mules on the walls hold the ship
    // with cables while she goes on by her own engine; the chamber fills and she rises, three
    // steps up to the lake.
    // Made up: the shirts and who gets them, the news carried to the three on the railway, the
    // policeman letting her up with the workers, the lines thrown to the ship and how many.
    tale: {
      work: true,
      ask: '배는 어떻게 높은 호수까지 올라갈까?',
      gate: { scene: 'rail', open: 2, sora: '경관 아저씨가 막고 있어. 못 가.' },
      steps: [
        {
          goal: '일꾼 마을의 빨래하는 아주머니를 도와 흰 셔츠를 나눠 주렴.', tally: '흰 셔츠 {all}벌 가운데 {n}벌을 나눠 주었다.',
          round: [
            { who: 'oilman', lines: ['내 셔츠가 눈처럼 하얘졌구나.', '이걸 입고 배를 보러 가야지.'] },
            { who: 'grandpa', lines: ['고맙다. 오늘은 새 셔츠를 입어야지.', '이 운하로 첫 배가 지나가는 날이니까.'] },
            { who: 'hoopboy', lines: ['우리 아빠 셔츠예요! 고마워요.', '아빠한테 얼른 갖다 드릴게요.'] },
          ],
          after: [{ who: 'laundress', line: '다 나눠 주었구나. 모두 깨끗한 옷을 입겠어.' }],
          cheer: '셔츠를 다 나눠 주었다!',
          sora: '이제 갑문 아래 철길로 가 보자!',
          errand: 'shirts',
        },
        {
          goal: '갑문 아래 철길의 일꾼들에게 배가 왔다고 알리렴.', tally: '일꾼 {all}명 가운데 {n}명에게 알렸다.',
          round: [
            { who: 'trackman', lines: ['첫 배가 벌써 왔다고? 얼른 가 봐야지.', '우리가 지은 운하로 배가 처음 지나는구나.'] },
            { who: 'rester', lines: ['배가 왔구나! 마침 쉬던 참이었단다.', '물가에 나가서 모자를 흔들어야지.'] },
            { who: 'photographer', lines: ['배가 왔다고? 알려 줘서 고맙다.', '깃발 단 배를 꼭 사진에 담아야지.'] },
          ],
          after: [{ who: 'police', line: '일꾼들과 함께라면 올라가도 된단다. 조심하렴.' }],
          cheer: '모두에게 알렸다!',
          sora: '갑문 벽 옆으로 올라가 보자!',
          errand: 'news',
        },
        {
          who: 'son', goal: '갑문 벽 옆의 밧줄 다루는 청년을 도와 배에 밧줄을 걸렴.',
          lines: ['배가 방에 들어왔어. 밧줄을 배에 걸어야 해.', '기관차가 그 밧줄로 배를 가운데에 잡아 줘.'],
          play: {
            kind: 'aim', tally: '밧줄 {all}가닥 가운데 {n}가닥을 배에 걸었다.', ask: '하얀 점이 금빛 칸에 올 때 밧줄을 던지렴.', label: '휙!', hits: 3, zone: [0.41, 0.59], speed: 0.7,
            good: ['휙! 배에 걸렸어!', '한 가닥 더!'], miss: ['앗, 밧줄이 모자랐어!', '조금 일렀어!'], show: 'ship',
          },
          cheer: '배가 올라간다!',
          sora: '물이 차오르니 배가 한 계단씩 올라가!',
          errand: 'lines',
        },
      ],
      asides: [
        { who: 'laundress', when: ['S0'], lines: ['흰 셔츠를 다 빨았는데 손이 모자라는구나.', '셔츠 임자들에게 좀 나눠 주련?'] },
        { who: 'bananakid', when: ['S1'], lines: ['첫 배가 벌써 가툰에 들어왔대!', '일꾼 아저씨들은 아직 모르나 봐.'] },
        { who: 'police', when: ['S0', 'S1'], lines: ['첫 배가 지나가는 동안은 못 올라간단다.', '벽 위에는 일꾼들만 올라갈 수 있지.'] },
        { who: 'clerk', when: ['S2'], lines: ['안콘 호가 곧 이 방에 들어온단다.', '밧줄 다루는 청년을 좀 도와주렴.'] },
        { who: 'gauger', when: ['S3'], lines: ['봤니? 물이 차오르니 배가 떠올랐단다.', '세 계단을 다 오르면 가툰 호수란다.'] },
        { who: 'hoopboy', when: ['S3'], lines: ['배가 물 계단을 올라가는 거 봤어?', '깃발이 바람에 펄럭였어!'] },
      ],
      done: '셔츠를 나눠 주고, 배가 왔다고 알리고, 밧줄을 걸어 배를 올려 보냈다.',
    },
    errands: [
      { id: 'shirts', text: '흰 셔츠를 나눠 준다.', at: [] },
      { id: 'news', text: '일꾼들에게 배가 왔다고 알린다.', at: [] },
      { id: 'lines', text: '배에 밧줄을 걸어 배를 올려 보낸다.', at: [] },
    ],
    reply: '그날 처음 열린 갑문으로 지금도 배들이 산을 넘는단다.',
  },
  // Roca Sundy on the island of Principe, on 29 May 1919: a great shower in the morning, then
  // the total eclipse through driving cloud. Drawn as the oil paintings of the Portuguese
  // modernists of the 1910s, split into bright pieces of colour (the user's choice of five
  // tries: the fifth). The pictures are in principe1919; the try itself is the third scene
  // (the telescope yard), and the kitchen yard and the cocoa drying yard were ordered after
  // it. The try is mended by hand (fix5/principe-fix.txt): few stars, thin clouds, no ring
  // round the sun, a mirror on a low stand, no wheels under the tube. Pale: the top left of
  // the pictures is bright.
  // Looked up on 2026.10.15 and found so: Eddington and Cottingham chose Roca Sundy, the
  // estate of Mr Carneiro; the island was damp and they feared for the mirror; a flat mirror
  // turned by clockwork threw the sunlight into a long iron tube that lay level; it was the
  // dry season, and a great shower passed that morning, out of season; guests of the island
  // (the judge, doctors) came that morning; the clouds thinned in the last of totality and a
  // red prominence was taken; Eddington was too busy changing plates to look; the sky was
  // clear a little after and clouded over again; men kept monkeys from the cocoa, and the
  // golden pods were likened to lanterns; the islands grew a great deal of the cocoa of the
  // world, worked by labourers brought from far lands; the fresh pulp of the cocoa pod is
  // sweet and sour and sucked from the bitter beans.
  // Looked for and NOT found: that the big house stood in 1919 (said to be built in 1921);
  // that the drying boards were pushed under a roof in rain; what the workers ate in 1919.
  // From memory: the dress of 1919; glass plates in wooden boxes; the white summer dress.
  // Made up: the washerwoman, the monkey-scaring boy, the worker of the drying boards, the young
  // helper of the tent, every other person (the work of the day: see the comment before the
  // tale).
  // Kept out: Eddington, Cottingham, the guests and the manager except far off (spots, no
  // face); that the light "bent" on the day (the plates were measured days later: only the
  // reply); the length of totality, the number of plates, the telegram; many stars.
  eddington: {
    first: '해가 달에 다 가려지는 날이란다. 농장의 하루 일을 도와주렴.',
    dir: 'principe1919', look: 'paper', pale: true,
    // (What is said of today: looked up on 2026.10.16; the picture chosen by the user.)
    now: {
      photo: 'photo-now.webp', name: '순디 농장의 지금 모습', when: '상투메 프린시페 프린시페 섬 · 2014년',
      text: [
        '순디는 프린시페 섬에서 카카오와 커피를 기르던 가장 큰 농장이었습니다. 지금은 옛 농장 집을 고쳐 손님이 묵는 숙소로 씁니다.',
        '옛 농장 시절의 건물 여러 채가 지금도 남아 있습니다. 비어 있는 옛 병원 건물도 그대로 서 있습니다.',
        '2009년, 일식 90주년을 맞아 상투메 프린시페의 대통령이 농장 앞마당에서 기념판을 처음 선보였습니다.',
        '2019년 5월 29일, 100주년을 맞아 이곳에 작은 과학관 \'순디 과학 공간\'이 문을 열었습니다.',
        '그때 학자들이 에딩턴이 사진을 찍은 바로 그 자리를 찾아냈습니다. 지금 그 자리에는 마을 사람들과 화가가 함께 만든 표시가 있습니다.',
        '2012년에 프린시페 섬과 둘레 바다가 유네스코 생물권 보전 지역이 되었습니다. 숲과 바다의 생물을 지키는 곳입니다.',
      ],
      credit: '사진: César J. Pollo, 위키미디어 공용, CC BY-SA 4.0',
    },
    drawn: '그 무렵 포르투갈의 새 화가들처럼, 색 조각으로 쪼개어 그렸단다.',
    scenes: [
      {
        id: 'kitchen', name: '상투메 프린시페 프린시페 섬 순디 농장 부엌 마당', short: '부엌 마당', zoom: 1.105, ground: 0.740, scale: 0.646, air: 'hush', floor: 'dirt',
        sora: '소나기가 막 그쳤어!',
        people: [
          { id: 'washer', pass: '소나기에 빨래가 다 젖었구나.', name: '빨래하는 아주머니', x: 0.18, w: 103, h: 312, lines: ['이 섬은 축축해서 거울이 흐려지기 쉽대.', '그래서 소나기 때 거울을 천으로 덮었단다.'] },
          { id: 'cook', pass: '손님 점심을 서둘러 지어야지.', name: '부엌 아주머니', x: 0.29, w: 119, h: 291, lines: ['섬의 손님들이 해를 보러 오셨단다.', '오시자마자 소나기가 쏟아졌지.'] },
          { id: 'podcutter', pass: '잘 익은 열매만 골라야지.', show: 'pulp', name: '카카오 열매 쪼개는 아주머니', x: 0.4, w: 92, h: 296, lines: ['카카오 속살은 새콤달콤하단다.', '씨는 쓰니까 속살만 빨아 먹으렴.'],
            try: { id: 'eat-pulp', verb: 'eat', name: '카카오 열매 속살', face: 'yum', sora: '하얀 속살이 새콤달콤해!' } },
          { id: 'woodman', pass: '불이 꺼지지 않게 장작을 대야지.', name: '장작 나르는 아저씨', x: 0.51, w: 129, h: 320, lines: ['비에 젖은 장작을 불 곁에 말린단다.', '오후에는 해가 가려진다더구나.'] },
          { id: 'seamstress', pass: '오늘 같은 날엔 흰 옷이 좋지.', name: '옷 짓는 아주머니', x: 0.62, w: 108, h: 305, lines: ['더운 섬이라 얇은 무명옷을 짓는단다.', '아이 것도 있어. 입어 보련?'],
            try: { id: 'wear-principe1919', verb: 'wear', name: '1919년 프린시페의 흰 여름옷', outfit: 'principe1919', sora: '옷이 가볍고 시원해!', memo: '그 무렵 더운 섬에서는 얇고 하얀 무명옷을 즐겨 입었단다.' } },
          { id: 'watergirl', pass: '물동이를 엎지르면 안 되지.', name: '물 긷는 아이', x: 0.73, w: 88, h: 245, lines: ['천막 손님들은 먼 영국에서 왔대요.', '해를 찍는 긴 통을 가져왔대요.'] },
          { id: 'basketman', pass: '비가 그치니 바람이 시원하구나.', name: '바구니 짜는 할아버지', x: 0.85, w: 126, h: 302, lines: ['나는 카카오 콩 담을 바구니를 짠단다.', '이 섬 카카오는 배에 실려 멀리 가지.'] },
        ],
        spots: [
          // The shaded veranda of the low storehouse in the picture ordered for this scene
          // ((5) of its order). (From and to are to be set to the picture.) The manager is not
          // drawn and cannot be spoken to: far off, no face, no name.
          { id: 'manager', from: 0.64, to: 0.8, sora: '베란다에 누가 서 있어!', memo: '이 농장을 돌보는 관리인이란다. 손님들의 일을 여러모로 거들었지.' },
        ],
      },
      {
        id: 'drying', name: '상투메 프린시페 프린시페 섬 순디 농장 카카오 말리는 마당', short: '카카오 말리는 마당', zoom: 1.111, ground: 0.735, scale: 0.650, air: 'hush', floor: 'dirt',
        sora: '나무에 열매가 주렁주렁해!',
        people: [
          { id: 'raker', pass: '해가 나면 콩이 잘 마르겠지.', name: '갈퀴 든 일꾼', x: 0.18, w: 119, h: 320, lines: ['카카오 콩은 햇볕에 며칠 말린단다.', '비가 와서 오늘은 늦어졌지.'] },
          { id: 'monkeyboy', pass: '원숭이야, 우리 밭에 오지 마!', show: 'pods', pose: 'see-wow', sora: '열매가 등불처럼 달렸어!', memo: '천막의 손님은 카카오 열매가 숲에 단 등불 같다고 적었단다.', name: '원숭이 쫓는 아이', x: 0.29, w: 95, h: 244, lines: ['나는 원숭이가 밭에 못 오게 지켜요.', '원숭이는 카카오 열매를 좋아하거든요.'] },
          { id: 'sorter', pass: '쭉정이는 골라내야지.', name: '콩 고르는 아주머니', x: 0.4, w: 104, h: 293, lines: ['나는 먼 땅에서 이 섬에 일하러 왔단다.', '좋은 콩만 골라 자루에 담는단다.'] },
          { id: 'sackman', pass: '자루가 꽤 묵직하구나.', name: '자루 나르는 일꾼', x: 0.51, w: 124, h: 296, lines: ['마른 콩은 자루에 담아 항구로 간단다.', '배에 실려 먼 나라로 가지.'] },
          { id: 'basketgirl', pass: '엄마한테 바구니를 갖다드려야지.', name: '바구니 이는 아이', x: 0.62, w: 89, h: 273, lines: ['오늘 손님들이 해를 사진에 찍는대요.', '해를 맨눈으로 보면 안 된대요.'] },
          { id: 'granny', pass: '이 철에 웬 소나기일까.', name: '나무 그늘의 할머니', x: 0.73, w: 90, h: 262, lines: ['지금은 비가 거의 안 오는 마른 철이란다.', '오늘 아침 소나기는 참 별일이구나.'] },
          { id: 'boardman', pass: '이 길은 지금 지나갈 수 없단다.', name: '판 맡은 일꾼', x: 0.85, w: 116, h: 307, lines: ['나는 이 마당의 콩 말리는 판을 맡았지.', '비가 그쳤으니 콩을 서둘러 널어야 해.'] },
        ],
        spots: [],
      },
      {
        id: 'scope', name: '상투메 프린시페 프린시페 섬 순디 농장 망원경 마당', short: '망원경 마당', zoom: 1.072, ground: 0.765, scale: 0.627, air: 'hush', floor: 'dirt',
        sora: '해가 조금씩 가려지고 있어!',
        people: [
          { id: 'helper', pass: '구름이 비켜 주면 좋으련만.', show: 'corona', pose: 'see-wow', sora: '검은 해 둘레가 하얗게 빛나!', memo: '해가 다 가려지면 둘레의 흰 빛 무리와 붉은 불꽃이 보인단다.', name: '망원경 조수', x: 0.18, w: 114, h: 308, lines: ['나는 천막 손님들의 일을 거든단다.', '해 곁의 별을 사진에 담는대.'] },
          { id: 'mirrorman', pass: '거울에 물기가 앉으면 안 되지.', show: 'mirror', pose: 'see-aha', sora: '거울이 해를 따라 돌아!', memo: '시계 장치가 거울을 천천히 돌려 햇빛을 긴 통 안으로 비추었단다.', name: '거울 지키는 이', x: 0.29, w: 93, h: 303, lines: ['이 거울이 햇빛을 통 안으로 보낸단다.', '시계 장치가 거울을 천천히 돌리지.'] },
          { id: 'plateman', pass: '깨지지 않게 살살 날라야지.', show: 'plates', pose: 'see-aha', sora: '유리판에 사진을 찍는대!', memo: '그 무렵에는 얇은 유리판에 사진을 찍었단다.', name: '판 상자 나르는 젊은이', x: 0.4, w: 106, h: 304, lines: ['이 상자에는 사진 찍을 유리판이 들었어.', '천막 안에서 판을 쉬지 않고 갈아 끼운대.'] },
          { id: 'carpenter', pass: '기둥이 잘 버텨 주었구나.', name: '천막 기둥 세운 목수', x: 0.51, w: 116, h: 320, lines: ['나는 천막 기둥을 단단히 박았단다.', '아침 소나기에도 천막은 끄떡없었지.'] },
          { id: 'maid', pass: '손님들께 물을 내어 드려야지.', name: '손님 시중드는 아주머니', x: 0.62, w: 113, h: 294, lines: ['섬의 손님들이 해를 보러 오셨단다.', '판사님과 의사 선생님들도 오셨지.'] },
          { id: 'rakeboy', pass: '하늘이 점점 어두워지네.', name: '갈퀴 든 아이', x: 0.73, w: 88, h: 225, lines: ['해가 다 가려지면 어두워진대요.', '그래도 금방 다시 밝아진대요.'] },
          { id: 'grandpa', pass: '먼 데서 해를 보러 왔구나.', name: '지팡이 짚은 할아버지', x: 0.85, w: 114, h: 310, lines: ['손님들은 먼 영국에서 배로 왔단다.', '여러 곳을 둘러보고 이 마당을 골랐지.'] },
        ],
        spots: [
          // The tent at the right of the try, under which the tube lies (about 0.66 to 0.86).
          // (From and to are to be set to the picture.) Eddington and Cottingham are not drawn
          // and cannot be spoken to: far off, no face.
          { id: 'astronomers', from: 0.67, to: 0.85, sora: '천막 아래서 바쁘게 일해!', memo: '영국에서 온 에딩턴과 코팅엄이란다. 판을 갈아 끼우느라 해를 볼 틈도 없었지.' },
          // The big white house of the try was taken out (said to be built in 1921: the user,
          // 2026.10.15, "없애"); the guests of the island stand at the edge of the yard. They
          // are not drawn: far off, no face, no names.
          { id: 'guests', from: 0.4, to: 0.6, sora: '마당 가에 손님들이 모였어!', memo: '섬의 판사와 의사들이 해가 가려지는 것을 보러 왔단다.' },
        ],
      },
    ],
    // "The work of the day" (core/tale.js `work`, as at Darlington and London): the great
    // shower of the morning has wet the firewood, and she fans the kitchen fire with the
    // woodman so the cook can make the guests' lunch; in the drying yard she helps three
    // people spread the cocoa beans on the boards again, and the worker of the boards lets
    // her through; in the telescope yard she hands the glass plates out of their boxes with
    // the young man who carries them, while the sun goes black, and through the thinning cloud
    // the white glow and a red flame show.
    // Looked up (docs/신기한-사실.md, 2026.10.15): a great shower that morning, out of the dry
    // season; guests of the island came that morning; plates were changed without rest under
    // the tent (Eddington too busy to look); the clouds thinned in the last part of totality
    // and a red prominence was taken; the sky was clear a little after and clouded over again.
    // Made up: the wet firewood and the fanning, the lunch of the guests, the beans spread
    // again after the shower (the drying boards pushed under a roof in rain was looked for and
    // not found), the three who spread them, her handing the plates.
    tale: {
      work: true,
      ask: '구름이 해를 비켜 줄까?',
      gate: { scene: 'drying', open: 2, sora: '콩을 너느라 길이 막혔어. 못 가.' },
      steps: [
        {
          who: 'woodman', goal: '부엌 마당의 장작 나르는 아저씨와 함께 불을 살리렴.',
          lines: ['소나기에 장작이 젖어 불이 약하구나.', '손님들 점심을 지어야 해. 부채질을 해 주련?'],
          play: {
            kind: 'mash', tally: '부채질 {all}번 가운데 {n}번 불길이 일었다.', ask: '여러 번 눌러 부채질을 하렴.', label: '훨훨', hits: 3, zone: [0.4, 0.6], speed: 0.12,
            good: ['훨훨! 불길이 일어나!', '한 번 더!'], miss: ['앗, 연기만 났어!', '조금 더 기다렸다가!'],
          },
          after: [{ who: 'cook', line: '불이 살았구나. 이제 손님 점심을 짓겠다.' }],
          cheer: '불이 다시 살았다!',
          sora: '카카오 말리는 마당으로 가 보자!',
          errand: 'fire',
        },
        {
          goal: '카카오 말리는 마당의 일꾼들을 도와 콩을 다시 널렴.', tally: '말리는 판 {all}개 가운데 {n}개에 콩을 널었다.',
          round: [
            { who: 'raker', lines: ['콩을 같이 널어 주겠다고? 고맙구나.', '이렇게 얇게 펴야 햇볕에 잘 마른단다.'] },
            { who: 'sorter', lines: ['좋은 콩만 골라 두었단다. 같이 널자.', '그래, 판 위에 고루 펴 주렴.'] },
            { who: 'basketgirl', lines: ['바구니에 콩이 가득해서 무거워요.', '같이 판에 쏟아 줘서 고마워요!'] },
          ],
          after: [{ who: 'boardman', line: '콩을 다 널었구나. 이제 지나가도 좋단다.' }],
          cheer: '콩을 다 널었다!',
          sora: '해가 가려지기 시작했어! 망원경 마당으로 가자!',
          errand: 'beans',
        },
        {
          who: 'plateman', goal: '망원경 마당의 판 상자 나르는 젊은이와 유리판을 건네렴.',
          lines: ['곧 해가 다 가려진대. 판을 바삐 갈아야 해.', '내가 상자를 열면 천막에 한 장씩 건네주련?'],
          play: {
            kind: 'aim', tally: '유리판 {all}장 가운데 {n}장을 건넸다.', ask: '하얀 점이 금빛 칸에 올 때 유리판을 건네렴.', label: '쏙!', hits: 3, zone: [0.42, 0.58], speed: 0.7,
            good: ['쏙! 잘 들어갔어!', '다음 판!'], miss: ['앗, 조금 늦었어!', '살살, 천천히!'], show: 'corona',
          },
          cheer: '구름이 비켜 주었다!',
          sora: '검은 해에 붉은 불꽃이 보여!',
          errand: 'plates',
        },
      ],
      asides: [
        { who: 'cook', when: ['S0'], lines: ['손님들 점심을 지어야 하는데 불이 약하구나.', '장작 나르는 아저씨를 도와주련?'] },
        { who: 'boardman', when: ['S0', 'S1'], lines: ['비가 그쳤으니 콩을 서둘러 널어야 해.', '다 널 때까지는 이 길로 못 지나간단다.'] },
        { who: 'helper', when: ['S2'], lines: ['해가 조금씩 가려지고 있단다.', '판 상자 나르는 젊은이를 도와주련?'] },
        { who: 'helper', when: ['S3'], lines: ['마지막에 구름이 엷어져 주었구나.', '하늘이 잠깐 맑더니 다시 흐려지네.'] },
      ],
      done: '불을 살리고, 콩을 다시 널고, 유리판을 건네며 구름 틈의 검은 해를 보았다.',
    },
    errands: [
      { id: 'fire', text: '부채질을 해서 부엌 불을 살린다.', at: [] },
      { id: 'beans', text: '카카오 콩을 말리는 판에 다시 넌다.', at: [] },
      { id: 'plates', text: '유리판을 건네며 해가 가려지는 것을 본다.', at: [] },
    ],
    reply: '며칠 뒤 사진을 재 보니 별빛이 휘었더란다. 네가 그 하늘을 보았구나.',
  },
  // Tyuratam (now Baikonur), Kazakhstan, on the night of 4 October 1957: the rocket that put
  // the first artificial satellite round the earth goes up from the pad of Site 1. Drawn as a
  // Soviet lithograph poster of the 1950s (the user's choice of five tries: the first). The
  // pictures are in baikonur1957; the try itself is the third scene (the steppe where the
  // launch site is seen: its hut and tea table read as the guard post), and the soldiers'
  // canteen in the village and the steppe by the railway were ordered after it. The try is
  // mended by hand (assets/codex/fix5/baikonur-fix.txt): one rocket only, light grey, no
  // satellite outside, an almost full moon and no Milky Way, steam and no fire. The pictures
  // are dark: no `pale`. Whether the place wants `night` is to be seen once the pictures are in.
  // Looked up on 2026.10.15 and found so: the launch at 22:28 Moscow time (19:28 UT) on
  // 4 October 1957 from Site 1 of the Tyuratam range; the name "Baikonur" came only about 1961
  // (no one says it); the soldiers' village was called "Zarya" unofficially; the first
  // builders came in January 1955, lived in tents, and in spring dug dugouts on the bank of
  // the Syr Darya; the builders called the great pit of the pad "the stadium"; the rocket was
  // taken to the pad by rail on the morning of 3 October; the satellite rode under the nose
  // fairing, not to be seen (russianspaceweb, "sputnik_lv", "sputnik_preflight"); the R-7
  // hung in the trusses that bore it, standing on no pad (Wikipedia, "R-7 Semyorka"); an
  // almost full moon in the south-west; the satellite burned up in the air on 4 January 1958;
  // soldiers ate kasha with tea and sugar and much bread, part of it rye (CIA reading room
  // interviews; HRW 2003). Baikonur town and the pad stand about 34 km apart (by coordinates;
  // no number on screen).
  // Looked for and NOT found: the weather that night; whether the soldiers knew what went up
  // (they do not, here); the colour of the 1957 rocket (light grey, as the user mends it);
  // that the arms fell back like petals in 1957 (not said).
  // From memory: the dress of 1957; the lamp towers round the pad; the tea urn and the glass
  // in a metal holder; that wives and children lived in the village; the Kazakh herder; that
  // Korolev watched from the bunker by the pad.
  // Made up: the woman of the canteen, the guard of the crossing, the track worker, the guard of
  // the post, every other person (the work of the day: see the comment before the tale).
  // Kept out: Korolev and the high men except far off (a spot, no face); "바이코누르",
  // "인공위성", "스푸트니크" in the mouths of the people (Sora and grandmother only); what went
  // up; the missile, arms, secrets, the cold war; every number; anyone near the pad at the
  // launch; drink and smoking.
  sputnik: {
    first: '사람이 만든 첫 별이 하늘로 오르는 밤이란다. 밤일하는 사람들을 도와주렴.',
    dir: 'baikonur1957', look: 'paper',
    // (What is said of today: looked up on 2026.10.16; the picture chosen by the user.)
    now: {
      photo: 'photo-now.webp', name: '가가린 발사대의 지금 모습', when: '카자흐스탄 바이코누르 · 2013년',
      text: [
        '1957년 5월 15일, R-7 로켓이 이 발사대에서 처음 날아올랐습니다. 다섯 달 뒤 같은 로켓이 스푸트니크를 올렸습니다.',
        '1961년 4월 12일, 유리 가가린의 첫 우주 비행도 이 발사대에서 떠났습니다. 그래서 "가가린 발사대"라고 부릅니다.',
        '이 발사대에서는 로켓 520대쯤이 날아올랐습니다. 마지막은 2019년 9월 25일의 소유스 MS-15입니다.',
        '바이코누르 우주 기지는 카자흐스탄 땅에 있습니다. 러시아가 이 기지를 2050년까지 빌려 씁니다.',
        '2023년, 러시아와 카자흐스탄은 이 발사대를 더 쓰지 않고 박물관으로 남기려는 계획을 밝혔습니다.',
        '2025년, 러시아는 이 발사대를 카자흐스탄에 돌려주기로 했습니다. 카자흐스탄은 이곳을 우주 박물관으로 꾸밀 계획입니다.',
      ],
      credit: '사진: Carla Cioffi, 위키미디어 공용, 공개 저작물',
    },
    drawn: '그 무렵 소련의 포스터처럼, 평평한 색으로 굵게 그렸단다.',
    scenes: [
      {
        id: 'canteen', name: '카자흐스탄 튜라탐 자랴 마을 군인 식당', short: '군인 식당', zoom: 1.208, ground: 0.660, scale: 0.707, air: 'hush', floor: 'wood',
        sora: '식당에 빵 냄새가 가득해!',
        people: [
          { id: 'cook', pass: '차가 식기 전에 날라야지.', name: '식당 아주머니', x: 0.18, w: 112, h: 279, lines: ['오늘 밤은 다들 늦게까지 일한단다.', '무슨 일인지는 아무도 말해 주지 않는구나.'] },
          { id: 'baker', pass: '오늘 빵은 잘 부풀었구나.', show: 'bread', name: '빵 굽는 병사', x: 0.29, w: 89, h: 300, lines: ['나는 날마다 검은 빵을 굽는단다.', '따뜻한 차와 같이 먹으면 아주 맛있지.'],
            try: { id: 'eat-bread', verb: 'eat', name: '검은 빵과 차', face: 'yum', sora: '빵이 쫄깃하고 차가 따뜻해!' } },
          { id: 'sergeant', pass: '그때보다 지금이 훨씬 낫구나.', show: 'dugout', pose: 'see-aha', sora: '강가 흙집에서 살았대!', memo: '처음 온 군인들은 천막에서 살다가, 봄에 시르다리야 강가에 땅을 파고 흙집을 지었단다.', name: '나이 든 상사', x: 0.4, w: 101, h: 301, lines: ['우리가 처음 왔을 땐 천막뿐이었단다.', '봄이 되자 강가에 땅을 파고 살았지.'] },
          { id: 'porridge', pass: '죽이 눋지 않게 저어야지.', name: '죽 젓는 취사병', x: 0.51, w: 100, h: 296, lines: ['아침마다 큰 솥에 카샤를 끓인단다.', '카샤는 곡식을 푹 끓인 죽이야.'] },
          { id: 'tailor', pass: '밤바람이 차니 단추를 단단히 달아야지.', name: '옷 고치는 아주머니', x: 0.62, w: 97, h: 282, lines: ['나는 군인들의 외투 단추를 달아 준단다.', '아이 외투가 하나 있구나. 입어 보련?'],
            try: { id: 'wear-steppe1957', verb: 'wear', name: '1957년 초원 마을의 가을 외투', outfit: 'steppe1957', sora: '외투가 두툼하고 포근해!', memo: '그 무렵 소련 아이들은 가을이면 두꺼운 모직 외투를 입었단다.' } },
          { id: 'letter', pass: '어머니께 무엇부터 쓸까.', name: '편지 쓰는 병사', x: 0.73, w: 84, h: 294, lines: ['고향의 어머니께 편지를 쓰는 중이란다.', '이곳 초원은 바람이 세다고 썼지.'] },
          { id: 'stoker', pass: '밤이 깊으니 난로를 더 지펴야지.', name: '난로 지피는 병사', x: 0.85, w: 94, h: 320, lines: ['초원의 가을밤은 꽤 쌀쌀하단다.', '난로를 지펴 식당을 데우는 중이야.'] },
        ],
        spots: [],
      },
      {
        id: 'rail', name: '카자흐스탄 튜라탐 철길 가 초원', short: '철길 가 초원', zoom: 1.111, ground: 0.735, scale: 0.650, air: 'hush', floor: 'dirt',
        sora: '달빛에 철길이 반짝여!',
        people: [
          { id: 'herder', pass: '양들은 벌써 잠들었겠지.', name: '카자흐 양치기 할아버지', x: 0.18, w: 124, h: 270, lines: ['나는 이 초원에서 양을 치며 살았단다.', '저 철길 역의 이름이 튜라탐이지.'] },
          { id: 'signal', pass: '등불이 꺼지지 않게 해야지.', name: '신호등 든 병사', x: 0.29, w: 143, h: 320, lines: ['나는 밤에 신호등으로 기차를 맞는단다.', '오늘 밤에는 기차가 오지 않는구나.'] },
          { id: 'driver', pass: '바퀴에 기름을 더 쳐야겠구나.', show: 'cart', pose: 'see-aha', sora: '아주 긴 수레가 비어 있어!', memo: '로켓은 눕혀서 철길 수레에 싣고 발사대로 옮겼단다. 하루 전 아침의 일이었지.', name: '기관사', x: 0.4, w: 107, h: 271, lines: ['어제 아침에 긴 수레로 긴 짐을 옮겼단다.', '무엇인지는 나도 덮개만 보았지.'] },
          { id: 'trackman', pass: '나사 하나도 헐거우면 안 되지.', name: '철길 고치는 일꾼', x: 0.51, w: 153, h: 270, lines: ['나는 밤마다 철길 나사를 조인단다.', '저쪽 큰 구덩이를 우리는 경기장이라 불러.'] },
          { id: 'lineman', pass: '전깃줄이 바람에 흔들리는구나.', name: '전깃줄 고치는 병사', x: 0.62, w: 113, h: 276, lines: ['초원 끝까지 전깃줄을 이어 놓았단다.', '저 먼 등불도 이 줄로 켜지.'] },
          { id: 'mail', pass: '편지 자루가 오늘은 가볍구나.', name: '우편 나르는 병사', x: 0.73, w: 120, h: 275, lines: ['나는 역에서 편지 자루를 나른단다.', '고향 편지를 받으면 다들 웃지.'] },
          { id: 'crossguard', pass: '건널목 둘레를 잘 살펴야지.', name: '건널목 경계병', x: 0.85, w: 111, h: 297, lines: ['나는 이 건널목을 지키는 경계병이란다.', '철길을 손보는 동안은 건널목을 닫지.'] },
        ],
        spots: [
          // The small lights on the far horizon at the right of the picture ordered for this
          // scene (the launch site, far from the village). (From and to are to be set to the
          // picture.)
          { id: 'farlights', from: 0.86, to: 0.98, sora: '먼 지평선에 불빛이 모여 있어!', memo: '저 멀리 모인 불빛이 발사대란다. 마을에서 한참 떨어져 있지.' },
        ],
      },
      {
        id: 'pad', name: '카자흐스탄 튜라탐 발사장이 보이는 초원 초소', short: '초원 초소', zoom: 1.082, ground: 0.757, scale: 0.633, air: 'hush', floor: 'dirt',
        sora: '멀리 로켓이 등불에 빛나!',
        people: [
          { id: 'postguard', pass: '오늘 밤은 유난히 길구나.', show: 'rocket', pose: 'see-wow', sora: '쇠 팔이 로켓을 안고 있어!', memo: '로켓은 바닥에 서지 않고 쇠 팔들에 매달려 있었단다. 꼭대기 덮개 속에 인공위성이 들었지.', name: '초소 경계병', x: 0.18, w: 123, h: 320, lines: ['나는 이 초소에서 밤새 초원을 지킨단다.', '오늘은 저 등불이 밤새 꺼지지 않는구나.'] },
          { id: 'teaman', pass: '물이 곧 끓겠구나.', name: '차 끓이는 병사', x: 0.29, w: 112, h: 314, lines: ['나는 초소에서 밤새 차를 끓인단다.', '찻잔은 쇠 받침에 끼워 마시지.'] },
          { id: 'lampman', pass: '불이 하나도 꺼지면 안 되지.', show: 'lamps', pose: 'see-wow', sora: '등불 탑이 로켓을 비춰!', memo: '발사대 둘레의 높은 등불 탑들이 밤새 로켓을 비추었단다.', name: '등불 탑 전기병', x: 0.4, w: 130, h: 318, lines: ['저 멀리 높은 등불 탑에 불을 켰단다.', '밤인데도 낮처럼 환하게 비추지.'] },
          { id: 'moonman', pass: '오늘은 달이 참 밝구나.', name: '달 보는 병사', x: 0.51, w: 146, h: 312, lines: ['저기 달이 거의 동그랗게 찼구나.', '달빛에 초원이 은빛으로 보이지.'] },
          { id: 'phone', pass: '전화가 또 울리는구나.', name: '전화 받는 병사', x: 0.62, w: 98, h: 318, lines: ['오늘 밤은 전화가 자주 울린단다.', '다들 기다리라는 말뿐이야.'] },
          { id: 'truck', pass: '바퀴에 모래가 잔뜩 꼈네.', name: '트럭 모는 운전병', x: 0.73, w: 154, h: 320, lines: ['나는 초원 길로 짐을 나르는 운전병이란다.', '오늘 밤은 모두 멀리 물러나 있으래.'] },
          { id: 'recruit', pass: '초원은 끝이 보이지 않는구나.', name: '새로 온 신병', x: 0.85, w: 102, h: 314, lines: ['나는 이번 가을에 이곳에 왔단다.', '밤하늘이 이렇게 넓은 줄 몰랐어.'] },
        ],
        spots: [
          // The moon put in at the upper left of the try by the mend (where the red streaks
          // were). (From and to are to be set to the mended picture.)
          { id: 'moon', from: 0.04, to: 0.2, sora: '달이 거의 동그래!', memo: '그날 밤 거의 찬 달이 남서쪽 하늘에 떠 있었단다.' },
          // The rocket in the try (about 0.75 to 0.85).
          { id: 'fairing', from: 0.75, to: 0.85, sora: '로켓 꼭대기에 뭐가 있을까?', memo: '로켓 꼭대기의 뾰족한 덮개 속에 첫 인공위성이 들어 있었단다.' },
          // The low block at the right edge of the try (about 0.93 to 0.99). Korolev is not
          // drawn and cannot be spoken to: far off, no face.
          { id: 'bunker', from: 0.93, to: 0.99, sora: '저 낮은 집에 누가 있을까?', memo: '발사대 곁 지휘소란다. 로켓을 만든 코롤료프와 기술자들이 지켜보았지.' },
        ],
      },
    ],
    // "The work of the day" (core/tale.js `work`, as at Darlington and London): everyone works
    // late tonight. In the soldiers' canteen she pours tea for three of them (tea with sugar and
    // bread: CIA reading room interviews, HRW 2003, as above); by the railway she tightens the
    // bolts of the line with the track worker, and the guard opens the crossing once the line is
    // seen to; at the post on the steppe the truck that is to be drawn back has sunk in the sand
    // and she pushes it out with its driver, and far off in the lights a fire springs up, a low
    // rumble comes long after, and the rocket climbs lighting the steppe. The guard does not know
    // what went up; only Sora does.
    // The way on from the railway is shut (every tale has a `gate`: tests/tale.test.js) because
    // the crossing is closed while the line is seen to; it opens with the second step.
    // Looked up (above): the launch that night, seen from far off; the pad's lamp towers (from
    // memory); soldiers drank tea with sugar.
    // Made up: the three she pours tea for and what they say, the bolts tightened that night,
    // the crossing closed while the line is seen to, the truck sunk in the sand and pushed out,
    // that everyone was told to keep far back (from memory, not looked up).
    tale: {
      work: true,
      ask: '오늘 밤 초원에서 무엇이 오를까?',
      gate: { scene: 'rail', open: 2, sora: '건널목이 닫혀 있어. 못 건너.' },
      steps: [
        {
          goal: '군인 식당의 식당 아주머니를 도와 병사들에게 차를 따라 주렴.', tally: '차 {all}잔 가운데 {n}잔을 따라 주었다.',
          round: [
            { who: 'letter', lines: ['차를 따라 주는구나. 고맙다.', '편지에 차가 맛있었다고 써야겠구나.'] },
            { who: 'stoker', lines: ['난로 앞에서 마시는 차가 제일이지.', '설탕도 한 덩이 넣어 주련?'] },
            { who: 'sergeant', lines: ['천막에서 살 때는 차 한 잔이 귀했단다.', '오늘 밤은 길 테니 든든히 마셔야지.'] },
          ],
          after: [{ who: 'cook', line: '고맙다, 얘야. 다들 몸이 따뜻해졌겠구나.' }],
          cheer: '차를 다 따라 주었다!',
          sora: '이제 철길 가 초원으로 가 보자!',
          errand: 'tea',
        },
        {
          who: 'trackman', goal: '철길 가 초원의 철길 고치는 일꾼을 도와 나사를 조이렴.',
          lines: ['오늘 밤은 철길을 꼼꼼히 살피란다.', '나사를 하나씩 꽉 조여야 해. 도와주련?'],
          play: {
            kind: 'aim', tally: '철길 나사 {all}개 가운데 {n}개를 조였다.', ask: '하얀 점이 금빛 칸에 올 때 나사를 돌리렴.', label: '꽉!', hits: 3, zone: [0.41, 0.59], speed: 0.7,
            good: ['끼익, 꽉! 잘 조였어!', '하나 더!'], miss: ['앗, 손이 미끄러졌어!', '조금 더 기다렸다가!'],
          },
          after: [{ who: 'crossguard', line: '철길을 다 살폈구나. 이제 건너가도 좋단다.' }],
          cheer: '나사를 다 조였다!',
          sora: '건널목을 건너 초원 초소로 가 보자!',
          errand: 'bolts',
        },
        {
          who: 'truck', goal: '초원 초소의 트럭 모는 운전병과 함께 모래에 빠진 트럭을 밀렴.',
          lines: ['트럭을 초소 뒤로 물려야 하는데 큰일이구나.', '바퀴가 모래에 빠졌어. 같이 밀어 주련?'],
          play: {
            kind: 'mash', tally: '트럭을 {all}번 가운데 {n}번 힘껏 밀었다.', ask: '여러 번 눌러 트럭을 밀렴.', label: '끙차!', hits: 3, zone: [0.42, 0.6], speed: 0.12,
            good: ['끙차! 바퀴가 굴렀어!', '한 번 더!'], miss: ['앗, 발이 모래에 빠졌어!', '조금 일렀어!'], show: 'rocket',
          },
          after: [{ who: 'postguard', line: '불빛이 먼저 오고 소리는 한참 뒤에 오는구나.' }],
          cheer: '불빛이 하늘로 오른다!',
          sora: '저건 첫 인공위성을 실은 로켓이야!',
          errand: 'truck',
        },
      ],
      asides: [
        { who: 'cook', when: ['S0'], lines: ['오늘 밤은 다들 늦게까지 일한단다.', '병사들에게 차를 한 잔씩 따라 주련?'] },
        { who: 'cook', when: ['S1'], lines: ['철길 가에서도 다들 밤일을 한단다.', '철길 고치는 일꾼을 도와주렴.'] },
        { who: 'crossguard', when: ['S0', 'S1'], lines: ['철길을 손보는 동안은 건널목을 닫는단다.', '나사를 다 조이면 그때 열어 주마.'] },
        { who: 'postguard', when: ['S2'], lines: ['트럭이 모래에 빠져 운전병이 애를 쓰는구나.', '오늘 밤은 모두 멀리 물러나 있어야 하는데.'] },
        { who: 'postguard', when: ['S3'], lines: ['무엇이 올라갔는지 나도 모른단다.', '그래도 오늘 밤은 잊지 못하겠구나.'] },
        { who: 'herder', when: ['S3'], lines: ['하늘로 오르는 불빛을 나도 보았단다.', '이 초원에 오래 살았지만 처음 보는구나.'] },
      ],
      done: '차를 따르고, 나사를 조이고, 트럭을 밀어 로켓이 오르는 것을 보았다.',
    },
    errands: [
      { id: 'tea', text: '병사들에게 차를 따라 준다.', at: [] },
      { id: 'bolts', text: '철길 나사를 조인다.', at: [] },
      { id: 'truck', text: '트럭을 밀고, 로켓이 오르는 것을 본다.', at: [] },
    ],
    reply: '그 밤의 쇠공은 이듬해 하늘에서 타 버렸단다. 그래도 네가 보았으니 됐지.',
  },
  // Dubai on 4 January 2010, at night: the tallest building in the world is opened, and its
  // name is changed from Burj Dubai to Burj Khalifa. Drawn as Islamic zellij, small glazed
  // tiles laid flat (the user's choice of five tries: the first). The pictures are in
  // dubai2010; the try is the third scene ('lake': the promenade by the lake under the
  // tower), and a lane of the Souk Al Bahar and the front of the new metro station were
  // ordered after it. It is night: not `pale`.
  // Looked up on 2026.10.15 (docs/신기한-사실.md) and found so: opened that night; the name
  // changed at the ceremony, a surprise; the height kept secret and shown on a great screen;
  // the tower lit first, lights beating like a heart, searchlights drawing the tower, the
  // fountain and fireworks drawing the desert flower the tower was made after, fireworks from
  // the tower's terraces at the end; people watched from the promenade by the lake, with a
  // great screen; the Burj Dubai metro station opened that day, and there was no walkway from
  // it to the mall until 2012 (people went by bus); the deck at the top opened the next day;
  // the fountain dances to music; the Souk Al Bahar of arched lanes and wooden lattices was
  // open; the tower narrows in steps to a spire; no moon during the ceremony.
  // Looked up while writing and found so: Arabic coffee is poured from a dallah and served to
  // guests with dates, and a guest shakes the cup when done (UNESCO; Gulf News).
  // Not found, so not said as of that night: the hour (eight is a guess), the weather, what
  // was sold by the lake.
  // From memory: the dress of the Emirates (kandura, ghutra and agal, abaya and shayla, the
  // girl's embroidered dress); the shell-like golden roof of the raised metro stations; that
  // the land about was desert sand not long before (the grandmother's line).
  // Made up: the date seller and his nephew the lighting worker, the guard, the station guide,
  // every other person (the work of the day: see the comment before the tale).
  // Kept out: Sheikh Mohammed and the great guests but as a far-off stage; why the name was
  // changed; the workers' pay; the height in words; going up the tower; the moon; boats.
  burjKhalifa: {
    first: '세상에서 가장 높은 탑을 여는 밤이란다. 잔치가 잘 열리도록 도와주렴.',
    dir: 'dubai2010', look: 'paper',
    // (What is said of today: looked up on 2026.10.16; the picture chosen by the user.)
    now: {
      photo: 'photo-now.webp', name: '부르즈 할리파의 지금 모습', when: '아랍에미리트 두바이 · 2015년',
      text: [
        '부르즈 할리파는 높이 828미터로, 지금도 세계에서 가장 높은 건물입니다. 163층으로 층수도 가장 많고, 엘리베이터가 57대 있습니다.',
        '문을 연 다음 날인 2010년 1월 5일, 124층(452미터 높이)에 전망대가 열렸습니다.',
        '2014년 10월에는 148층(555미터 높이)에 더 높은 전망대가 열렸습니다.',
        '20층에서 108층 사이에는 사람이 사는 집 900채가 있고, 아래쪽 층에는 호텔이 있습니다.',
        '건물 바깥의 유리창을 모두 닦으려면 일꾼 36명이 서너 달 동안 일해야 합니다.',
        '탑 앞 호수의 분수는 길이가 270미터입니다. 저녁에는 30분에 한 번씩 음악에 맞추어 물을 뿜습니다.',
      ],
      credit: '사진: Tim Reckmann, 위키미디어 공용, CC BY 2.0 (잘라 씀)',
    },
    drawn: '이슬람 건물의 별 무늬 조각 타일처럼 그렸단다.',
    scenes: [
      {
        id: 'souk', name: '아랍에미리트 두바이 수크 알 바하르 골목', short: '수크 알 바하르 골목', zoom: 1.079, ground: 0.760, scale: 0.631, air: 'market', floor: 'dirt',
        sora: '장터에 등불이 가득 켜졌어!',
        people: [
          { id: 'lamps', pass: '등불을 하나씩 다 켜 두어야지.', name: '등불 가게 아저씨', x: 0.18, w: 145, h: 319, lines: ['오늘 밤은 장터 등불을 모두 켰단다.', '호수 건너 탑에서 큰 잔치가 열리거든.'] },
          { id: 'coffeeman', pass: '손님께 드릴 커피가 다 끓었구나.', show: 'dallah', pose: 'see-aha', sora: '주둥이가 새 부리처럼 길어!', memo: '이 주전자를 달라라고 한단다. 손님에게 커피를 따르고 대추야자를 곁들이지.', name: '커피 따르는 아저씨', x: 0.29, w: 130, h: 320, lines: ['손님이 오면 이 주전자로 커피를 따른단다.', '다 마신 손님은 잔을 살살 흔들어 알리지.'] },
          { id: 'datesaunt', pass: '대추야자를 접시에 곱게 담아야지.', show: 'dates', name: '대추야자 접시 든 아주머니', x: 0.4, w: 123, h: 303, lines: ['손님을 맞을 때는 대추야자를 내놓는단다.', '하나 먹어 보련? 아주 달단다.'],
            try: { id: 'eat-dates2010', verb: 'eat', name: '대추야자 한 접시', face: 'yum', sora: '대추야자가 쫀득하고 달콤해!' } },
          { id: 'grandpa', pass: '오늘은 대추야자가 잘 팔리는구나.', name: '대추야자 가게 할아버지', x: 0.51, w: 121, h: 316, lines: ['나는 이 장터에서 대추야자를 판단다.', '손님들이 커피와 함께 많이 사 가지.'] },
          { id: 'tailor', pass: '소매 끝의 수를 마저 놓아야지.', name: '옷 가게 아주머니', x: 0.62, w: 139, h: 304, lines: ['아이들 나들이옷을 짓는 가게란다.', '수놓은 옷이 있어. 입어 보련?'],
            try: { id: 'wear-dubai2010', verb: 'wear', name: '아랍에미리트의 나들이옷', outfit: 'dubai2010', sora: '소매 끝에 금빛 수가 놓였어!', memo: '이 땅 여자아이들은 잔치 날에 수놓은 긴 옷을 입고 그 아래에 바지를 입는단다.' } },
          { id: 'boy', pass: '불꽃을 맨 앞에서 볼 거야.', name: '구경 가는 아이', x: 0.73, w: 117, h: 239, lines: ['오늘 밤 탑에서 불꽃을 쏜대.', '아빠랑 호숫가에 가서 볼 거야.'] },
          { id: 'traveler', pass: '오늘 밤 사진을 많이 찍어야지.', name: '사진기 든 여행객', x: 0.85, w: 135, h: 305, lines: ['나는 먼 나라에서 구경하러 왔어요.', '탑을 여는 날에 맞춰서 왔지요.'] },
        ],
        spots: [],
      },
      {
        id: 'station', name: '아랍에미리트 두바이 부르즈 두바이 역 앞', short: '부르즈 두바이 역 앞', zoom: 1.059, ground: 0.775, scale: 0.620, air: 'hush', floor: 'dirt',
        sora: '오늘 처음 문을 연 역이래!',
        people: [
          { id: 'rider', pass: '기차가 정말 조용하게 달리는구나.', show: 'metro', pose: 'see-wow', sora: '기차가 높은 다리 위로 다녀!', memo: '이 역은 탑을 여는 날에 맞춰 오늘 문을 열었단다. 기차는 높은 다리 위로 달리지.', name: '첫 기차 타 본 아저씨', x: 0.18, w: 133, h: 310, lines: ['방금 기차를 타고 여기까지 왔단다.', '기차가 길 위의 높은 다리로 달리더구나.'] },
          { id: 'builder', pass: '오늘은 일 대신 구경하는 날이야.', name: '탑을 지은 일꾼', x: 0.29, w: 146, h: 309, lines: ['나는 먼 나라에서 와서 저 탑을 지었어.', '오늘은 친구들과 불꽃을 보러 왔지.'] },
          { id: 'guide', pass: '오늘은 첫날이라 나도 바쁘구나.', name: '역 안내원', x: 0.4, w: 150, h: 293, lines: ['이 역은 오늘 처음 문을 열었단다.', '탑을 여는 날에 맞춰서 열었지.'] },
          { id: 'flagkid', pass: '깃발을 더 높이 흔들어야지.', name: '국기 든 아이', x: 0.51, w: 114, h: 288, lines: ['우리 나라 깃발을 들고 왔어.', '탑 위로 불꽃이 터지면 흔들 거야.'] },
          { id: 'busaunt', pass: '버스가 얼른 오면 좋겠구나.', name: '버스 기다리는 아주머니', x: 0.62, w: 112, h: 292, lines: ['역에서 몰까지는 버스를 타고 간단다.', '오늘은 사람이 많아서 줄이 길구나.'] },
          { id: 'grandma', pass: '이렇게 높은 탑은 처음 보는구나.', name: '손주 손 잡은 할머니', x: 0.73, w: 147, h: 275, lines: ['내가 어릴 적엔 여기가 다 모래밭이었단다.', '이제는 하늘에 닿을 듯한 탑이 섰구나.'] },
          { id: 'guard', pass: '이쪽은 손님들 자리입니다.', name: '다리 앞 경비원', x: 0.85, w: 151, h: 320, lines: ['이쪽 길은 초대받은 손님들 자리란다.', '오늘 밤은 표가 있어야 지나간단다.'] },
        ],
        spots: [],
      },
      {
        id: 'lake', name: '아랍에미리트 두바이 부르즈 할리파 호숫가 산책길', short: '호숫가 산책길', zoom: 1.059, ground: 0.775, scale: 0.620, air: 'hush', floor: 'dirt',
        sora: '탑 꼭대기가 하늘을 찔러!',
        people: [
          { id: 'mom', pass: '아기가 불꽃 소리에 놀라지 않을까.', name: '아기 안은 엄마', x: 0.18, w: 89, h: 257, lines: ['아기에게 오늘 밤을 보여 주고 싶었단다.', '나중에 크면 이야기해 줄 거야.'] },
          { id: 'teacher', pass: '아이들에게 꽃 이야기를 해 줘야지.', name: '사막 꽃 이야기하는 선생님', x: 0.29, w: 101, h: 259, lines: ['저 탑은 사막에 피는 꽃을 보고 지었단다.', '오늘 밤 분수도 그 꽃 모양으로 핀대.'] },
          { id: 'oldman', pass: '아무리 올려다봐도 끝이 까마득하구나.', show: 'tower', pose: 'see-wow', sora: '탑이 계단처럼 가늘어져!', memo: '탑은 위로 갈수록 계단처럼 가늘어지다가 바늘 끝이 된단다. 오늘이 탑을 여는 날이지.', name: '탑을 올려다보는 할아버지', x: 0.4, w: 94, h: 271, lines: ['꼭대기가 구름에 닿을 것만 같구나.', '꼭대기 전망대는 내일부터 연다는구나.'] },
          { id: 'reporter', pass: '이 밤을 사진에 꼭 담아야지.', name: '사진 찍는 기자', x: 0.51, w: 100, h: 272, lines: ['온 세상 신문에 오늘 밤 사진이 실릴 거야.', '탑 꼭대기까지 한 장에 담기가 어렵구나.'] },
          { id: 'lightman', pass: '음악에 맞춰 켜야 하니 떨리는구나.', show: 'night', name: '조명 일꾼', x: 0.62, w: 87, h: 256, lines: ['나는 큰 화면 뒤에서 조명을 맡았단다.', '식이 끝날 때까지 자리를 지켜야 해.'] },
          { id: 'clapper', pass: '분수가 언제 춤을 출까?', name: '손뼉 치는 아이', x: 0.73, w: 82, h: 201, lines: ['분수가 노래에 맞춰 춤을 춘대.', '맨 앞에서 보려고 일찍 왔어.'] },
          { id: 'dad', pass: '우리 아이가 잘 보이면 좋겠구나.', name: '아이 목말 태운 아빠', x: 0.85, w: 99, h: 320, lines: ['사람이 많아서 아이를 목말 태웠단다.', '저기 큰 화면에 탑이 비치는구나.'] },
        ],
        spots: [
          // The foot of the tower in the try (x 0.80 to 0.95 of the picture), where the stage of
          // the ceremony was. Sheikh Mohammed and the great guests are not drawn and cannot be
          // spoken to.
          { id: 'stage', from: 0.8, to: 0.95, sora: '탑 아래 먼 무대가 환해!', memo: '두바이를 다스리는 셰이크 무함마드와 손님들이 계신 무대란다. 멀어서 말을 걸 수 없지.' },
        ],
      },
    ],
    // "The work of the day" (core/tale.js `work`, as at Darlington and London): in the souk
    // she pours Arabic coffee from the dallah for guests on their way to the lake, and the
    // date aunt sets dates beside it; before the new metro station, opened that day, she helps
    // the station guide tell three people asking the way that there is no walkway to the mall
    // yet and to go by bus; by the lake she switches on the searchlights with the lighting
    // worker, and the tower is lit, the fountain and fireworks draw the desert flower, and the
    // new name comes up on the great screen.
    // Looked up (docs/신기한-사실.md, and the place's comment above): Arabic coffee is poured
    // from a dallah and served to guests with dates, and a guest shakes the cup when done
    // (UNESCO; Gulf News); the Burj Dubai metro station opened that day and there was no
    // walkway from it to the mall until 26 December 2012, people went by bus (Wikipedia, Burj
    // Khalifa/Dubai Mall metro station); the ceremony began with the tower lit, searchlights
    // shot into the sky drew the tower, the fountain and fireworks drew the desert flower the
    // tower was made after, fireworks from the tower's terraces (fmlink.com; Wikipedia); the
    // new name, a surprise, shown on the great screen (nbcnews.com).
    // Made up: the coffee poured for passers-by that night, the three who ask the way and what
    // they say, the lighting worker working searchlights and letting her switch them on, the
    // lights switched on three times.
    // The gate (every tale has one: tests/tale.test.js) is at the station: its front is full
    // of people asking the way until she has helped the guide.
    tale: {
      work: true,
      ask: '탑을 여는 밤에는 무슨 일이 생길까?',
      gate: { scene: 'station', open: 2, sora: '역 앞이 길 묻는 사람들로 꽉 찼어.' },
      steps: [
        {
          who: 'coffeeman', goal: '수크 알 바하르 골목의 커피 따르는 아저씨를 도와 손님들께 커피를 따르렴.',
          lines: ['오늘 밤은 구경 가는 손님이 아주 많단다.', '손님들께 커피를 한 잔씩 따르자. 도와주련?'],
          play: {
            kind: 'fill', tally: '커피 {all}잔 가운데 {n}잔을 따랐다.', ask: '꾹 눌러 커피를 따르다가 금빛 칸에서 떼렴.', label: '쪼르륵', hits: 3, zone: [0.65, 0.85], speed: 0.5,
            good: ['쪼르륵! 알맞게 찼어!', '한 잔 더!'], miss: ['앗, 커피가 넘쳤어!', '조금 더 따라야 해!'],
          },
          after: [
            { who: 'datesaunt', line: '커피에는 대추야자를 곁들여야지.' },
            { who: 'traveler', line: '다 마시면 잔을 살살 흔들라고요? 알겠어요.' },
          ],
          cheer: '커피를 다 따랐다!',
          sora: '이제 역 앞으로 가 보자!',
          errand: 'coffee',
        },
        {
          goal: '부르즈 두바이 역 앞의 안내원을 도와 사람들에게 버스 길을 알려 주렴.', tally: '길 묻는 사람 {all}명 가운데 {n}명에게 길을 알려 주었다.',
          round: [
            { who: 'rider', lines: ['탑에 가려면 어느 길로 걸어가니?', '걸어가는 길은 아직 없구나. 버스를 타마.'] },
            { who: 'builder', lines: ['내가 지은 탑인데 가는 길을 모르겠구나.', '버스를 타면 된다고? 고맙다, 얘야.'] },
            { who: 'grandma', lines: ['손주와 분수를 보러 가는 길이란다.', '버스 정류장이 저기로구나. 고맙다.'] },
          ],
          after: [{ who: 'guide', line: '다들 버스 쪽으로 갔구나. 고맙다, 얘야.' }],
          cheer: '길을 다 알려 주었다!',
          sora: '호숫가 산책길로 가 보자!',
          errand: 'bus',
        },
        {
          who: 'lightman', goal: '호숫가의 조명 일꾼과 함께 탑에 조명을 켜렴.',
          lines: ['이제 곧 탑을 여는 식이 시작된단다.', '하늘로 쏘는 조명을 같이 켜 보련?'],
          play: {
            kind: 'beat', tally: '빛줄기 {all}개 가운데 {n}개를 쏘아 올렸다.', ask: '금빛 불이 켜질 때 조명을 켜렴.', label: '번쩍!', hits: 3, zone: [0.42, 0.58], speed: 1.5,
            good: ['번쩍! 빛줄기가 솟았어!', '하나 더!'], miss: ['앗, 음악보다 늦었어!', '조금 일렀어!'], show: 'night',
          },
          cheer: '탑에 불이 들어왔다!',
          sora: '큰 화면에 새 이름이 떴어! 부르즈 할리파래!',
          errand: 'lights',
        },
      ],
      asides: [
        { who: 'lamps', when: ['S0'], lines: ['오늘 밤은 손님이 장터로 몰려온단다.', '커피 따르는 아저씨 혼자 바쁘겠구나.'] },
        { who: 'guide', when: ['S1'], lines: ['역에서 몰까지 걸어가는 길은 아직 없단다.', '길 묻는 분들께 버스를 타라고 알려 주렴.'] },
        { who: 'busaunt', when: ['S1'], lines: ['버스는 여기서 탄단다.', '다들 정류장을 못 찾아 헤매는구나.'] },
        { who: 'clapper', when: ['S2'], lines: ['조명 아저씨가 무척 바빠 보여.', '곧 탑에 불이 켜진대!'] },
        { who: 'clapper', when: ['S3'], lines: ['분수가 사막 꽃처럼 피었어!', '탑에서 불꽃이 터졌어!'] },
        { who: 'dad', when: ['S3'], lines: ['탑 이름이 부르즈 할리파로 바뀌었단다.', '미리 알리지 않아서 다들 놀랐지.'] },
      ],
      done: '커피를 따르고, 버스 길을 알리고, 조명을 켜서 탑을 열었다.',
    },
    errands: [
      { id: 'coffee', text: '손님들께 커피를 따른다.', at: [] },
      { id: 'bus', text: '역 앞에서 버스 길을 알려 준다.', at: [] },
      { id: 'lights', text: '조명을 켜서 탑을 여는 식을 돕는다.', at: [] },
    ],
    reply: '그날 밤 바뀐 이름을 지금은 온 세상이 부른단다.',
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
