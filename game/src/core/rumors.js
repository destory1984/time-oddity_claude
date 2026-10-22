// The comet's rumour web (docs/스토리보드-소문-그물.md, line A, chosen by the user on
// 2026.10.22). Until then the game had no goal: Sora went wherever she liked and did the
// day's work (the user: "너는 그동안 목표가 없었거든. 그래서 outer wilds 게임 방식을 가지고
// 오려는거야"). Now one line is set from the start, grandmother's: find the comet she never
// saw. What people say of it is written in the notebook as a rumour, and the rumours
// together bring to light the days the comet came, which are hidden until then.
//
// A rumour is heard from one person at one place: the line they say that holds it is one
// of their two `lines` in core/walks.js, and it is written down (the progress record's
// `rumors`) once they have said their last line. Not from `met`: one spoken to before the
// rumour was given them, or left after the first line, has not told it.
// A hidden place shows on the globe once its rumours are heard and, where it has a `sum`,
// the year it asks for has been chosen in the notebook (the progress record's `keys`).
// Rumours guide and never shut: every place that is not hidden stays open.

export const GOAL = '할머니가 못 본 꼬리별을 찾아라';

// id, at: the place, who: the person there, says: what the notebook writes.
export const RUMORS = [
  { id: 'returns', at: 'babylon575', who: 'scribe', says: '바빌론의 별 보는 서기: 하늘의 일은 같은 간격으로 돌아온다.' },
  { id: 'again', at: 'guest1054', who: 'old', says: '개봉의 늙은 관원: 꼬리별은 옛 기록에 여러 번 왔다.' },
  { id: 'y1682', at: 'crystalPalace', who: 'lensman', says: '런던의 망원경 지키는 이: 핼리가 1682년에 본 꼬리별이 1835년에 또 왔다.' },
  { id: 'every76', at: 'crystalPalace', who: 'oldman', says: '런던의 할아버지: 꼬리별은 일흔여섯 해마다 온다.' },
  { id: 'tapestry', at: 'crystalPalace', who: 'dressmaker', says: '런던의 옷 가게 아주머니: 노르망디의 긴 자수에 꼬리별이 수놓여 있다.' },
  { id: 'twain', at: 'liberty', who: 'coingrandpa', says: '뉴욕의 할아버지: 트웨인은 1835년 꼬리별이 온 해에 태어났다.' },
  // Heard at the first hidden place itself: the way on to the next return.
  { id: 'next76', at: 'dresden1758', who: 'palitzsch', says: '프롤리스의 팔리치: 꼬리별은 예언대로 1758년에 돌아왔다. 다음은 일흔여섯 해 뒤.' },
];

// id: the hidden place (core/squares.js, core/walks.js). needs: the rumours that bring it
// to light. sum: a question asked in the notebook once they are heard; the year chosen
// must be `year`, from `choices`. note: grandmother's note (core/notes.js) that must have
// been read first.
export const HIDDEN = [
  {
    id: 'dresden1758', needs: ['y1682', 'every76'],
    sum: { ask: '1682 + 76 = ?', choices: [1748, 1758, 1768], year: 1758, opened: '1758년 크리스마스, 드레스덴 근교에 빛이 켜졌다.' },
  },
  // The year it first came to an English village: the old star of the records, sewn into cloth.
  { id: 'england1066', needs: ['again', 'tapestry'] },
  // The return after Twain's: the old rumour that it comes every seventy-six years or so.
  {
    id: 'newyork1910', needs: ['next76', 'twain'],
    sum: { ask: '1835년의 다음 꼬리별은? (일흔여섯 해쯤 뒤)', choices: [1900, 1910, 1920], year: 1910, opened: '1910년 5월, 뉴욕의 저녁 하늘에 빛이 켜졌다.' },
  },
  // The end of the goal: the dawn grandmother went up to her rooftop and the clouds hid it.
  { id: 'roof1986', needs: [], note: 'y1986' },
];

export const isHidden = (id) => HIDDEN.some((h) => h.id === id);

// heard: the ids of the rumours written down.
export const rumorsHeard = (heard) => RUMORS.filter((r) => heard.includes(r.id));

// The rumour that speaking to this person at this place gives, or null.
export const rumorOf = (place, person) => RUMORS.find((r) => r.at === place && r.who === person) ?? null;

// Whether a hidden place's rumours are all heard (its sum may still be unanswered).
export function rumorsDone(hidden, heard) {
  return hidden.needs.every((id) => heard.includes(id));
}

// Whether a hidden place is open: its rumours heard, its sum, if any, answered, and its note,
// if any, read. keys: the hidden places whose sum has been answered; read: the notes read.
export const isOpen = (hidden, heard, keys, read = []) => rumorsDone(hidden, heard) && (!hidden.sum || keys.includes(hidden.id)) && (!hidden.note || read.includes(hidden.note));

// The ids of the places that are shown: every place that is not hidden, and the hidden
// ones that are open.
export function shownPlaces(ids, heard, keys, read = []) {
  return ids.filter((id) => { const h = HIDDEN.find((x) => x.id === id); return !h || isOpen(h, heard, keys, read); });
}
