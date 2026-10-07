// What changed, day by day: the "Changes" page of the settings. One line each, in plain
// words, the newest day first and the newest line first within a day. Add a line at the
// top of its day when something worth telling is done, in the same commit.
//
// Until the game existed the lines told what was decided and made. From here on, as in
// volume 1, only what shows on screen or is heard goes in: a new thing to do or see, or
// a fault mended, does; moving buttons about or rewording a sentence does not.
// Each line is 10 to 70 characters and ends in "니다." (tests/changes.test.js).
export const CHANGES = [
  { day: '2026-10-07', text: '설정이 생겼습니다. 글자 크기를 바꾸고, 소리를 끄고, 바뀐 것들을 읽습니다.' },
  { day: '2026-10-07', text: '손글씨는 소라와 할머니의 말과 메모에만 씁니다. 알리는 글은 또렷한 글씨로 바꿨습니다.' },
  { day: '2026-10-07', text: '다이얼이 먹남색 판에 놋쇠 테를 두른 모습이 되었습니다. 눈금이 지날 때 바늘이 살짝 내려앉습니다.' },
  { day: '2026-10-07', text: '글씨가 우주 한량과 같아졌습니다. 할머니의 메모는 손글씨, 소라의 말은 아이 글씨입니다.' },
  { day: '2026-10-07', text: '볼 것이 있는 해가 다이얼에 표시됩니다. 끝의 딱지를 누르면 그 해로 저절로 굴러갑니다.' },
  { day: '2026-10-07', text: '첫 토막이 생겼습니다. 지구본을 돌려 네 칸에 가고, 오늘로 돌리면 3초에 걸쳐 땅이 바뀝니다.' },
  { day: '2026-10-07', text: '땅 그림 여덟 장을 받았습니다. 피라미드, 자메이카의 만, 수정궁, 키티호크의 그때와 오늘입니다.' },
  { day: '2026-10-07', text: '그날 그 자리의 하늘을 계산해 그립니다. 수정궁의 밤에는 달이 없고, 자메이카의 달은 붉습니다.' },
  { day: '2026-10-07', text: '조작 화면 견본 9번, 필름 띠를 석 장으로 자세히 그렸습니다.' },
  { day: '2026-10-07', text: '첫 토막의 설계를 적었습니다. 대피라미드, 콜럼버스의 월식, 수정궁, 12초의 비행에 갑니다.' },
  { day: '2026-10-07', text: '한 칸의 흐름을 초 단위로 적었습니다. 내려앉고, 올려다보고, 오늘로 돌리면 1분 5초입니다.' },
  { day: '2026-10-07', text: '우주 한량을 하지 않아도 할 수 있게 정했습니다. 여는 쪽 다섯을 새로 썼습니다.' },
  { day: '2026-10-07', text: '1969년 마당의 때를 그날 밤 9시로 잡았습니다. 서쪽 하늘에 초승달이 뜹니다.' },
  { day: '2026-10-07', text: '탈레스의 일식을 한낮에서 해 질 녘으로 고쳤습니다. 계산해 보니 오후 5시 반쯤이었습니다.' },
  { day: '2026-10-07', text: '기원전 2560년까지 그날의 하늘을 셈할 수 있음을 확인했습니다.' },
  { day: '2026-10-07', text: '칸 다섯의 글을 써 보았습니다. 일식, 월식, 사라진 열흘, 수정궁, 첫 비행입니다.' },
  { day: '2026-10-07', text: '화면 어림 다섯 장을 그렸습니다. 지구 위, 그날, 오늘, 수첩, 엽서입니다.' },
  { day: '2026-10-07', text: '다이얼을 해 다이얼 하나로 정했습니다. 한 칸에 1년이고, 눈금마다 소리가 납니다.' },
  { day: '2026-10-07', text: '손으로 굴려 보는 다이얼 시험판을 만들었습니다.' },
  { day: '2026-10-07', text: '다이얼의 생김새 견본 열 개를 그렸습니다.' },
  { day: '2026-10-07', text: '주인공의 이름을 소라로 바로잡았습니다.' },
  { day: '2026-10-07', text: '기획서 「할머니의 수첩 2권」을 썼습니다. 날 칸 120곳, 길 아홉, 쪽지 넷입니다.' },
];

const DAY_MS = 86400000;
const stamp = (day) => { const [y, m, d] = day.split('-').map(Number); return Date.UTC(y, m - 1, d); };

// A change dated after today (the device's clock is behind) is not shown yet.
export function changesUntil(today, changes = CHANGES) {
  return changes.filter((c) => stamp(c.day) <= stamp(today));
}

// The day the making of the game began, told at the head of the page with how many days
// it has been: the day itself is day 1.
export const STARTED = '2026-10-07';
export function startedLine(today, started = STARTED) {
  const [y, m, d] = started.split('-').map(Number);
  const days = Math.round((stamp(today) - stamp(started)) / DAY_MS) + 1;
  const began = `만들기 시작한 날: ${y}년 ${m}월 ${d}일`;
  return days >= 1 ? `${began}
시간 여행 오늘로 ${days.toLocaleString('ko-KR')}일째` : began;
}

// '2026-10-04' → '10.4'
export function dayLabel(day) {
  const [, month, date] = day.split('-').map(Number);
  return `${month}.${date}`;
}
