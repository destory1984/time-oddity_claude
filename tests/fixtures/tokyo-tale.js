// Tokyo as it was told until 2026.10.12: a bunch of flowers taken from a young woman and
// handed to the driver of the first train (the user, 2026.10.9). The place is now one where
// things are found (core/seek.js), and this is kept as the tale the tests of core/tale.js
// and core/walk.js walk through.
export const TOKYO_TALE = {
    // In the manner of Nintendo's first 8-bit games since 2026.10.9 (the user, of four tries:
    // "1"): pixels again, the sky in the pictures, and people speaking in balloons (their
    // faces in a panel went with the flat look this place had).
    dir: 'tokyo',
    drawn: '스무 해쯤 뒤 일본에서 나온 게임기의 네모 점 그림처럼 그렸단다.',
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
      thing: true,
      ask: '이 꽃은 누구에게 가는 걸까?',
      gate: { scene: 'platform', open: 4, sora: '아직 못 타. 꽃부터 전해야 해.' },
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
  };
