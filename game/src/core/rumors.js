// The comet's rumour web (docs/스토리보드-소문-그물.md, line A, chosen by the user on
// 2026.10.22). Until then the game had no goal: Sora went wherever she liked and did the
// day's work (the user: "너는 그동안 목표가 없었거든. 그래서 outer wilds 게임 방식을 가지고
// 오려는거야"). Now one line is set from the start, grandmother's: find the comet she never
// saw. What people say of it is written in the notebook as a rumour, and the rumours
// together bring to light the days the comet came, which are hidden until then.
//
// A rumour is heard from one person at one place: the line they say that holds it is one
// of their two `lines` in core/walks.js, and it is counted as heard once that person has
// been spoken to (the progress record's `met`), so nothing more is saved for it.
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
];

// id: the hidden place (core/squares.js, core/walks.js). needs: the rumours that bring it
// to light. sum: a question asked in the notebook once they are heard; the year chosen
// must be `year`, from `choices`.
export const HIDDEN = [
  {
    id: 'dresden1758', needs: ['y1682', 'every76'],
    sum: { ask: '1682 + 76 = ?', choices: [1748, 1758, 1768], year: 1758, opened: '1758년 크리스마스, 드레스덴 근교에 빛이 켜졌다.' },
  },
];

export const isHidden = (id) => HIDDEN.some((h) => h.id === id);

// met(placeId) => the ids of the people spoken to there.
export const rumorsHeard = (met) => RUMORS.filter((r) => met(r.at).includes(r.who));

// The rumour that speaking to this person at this place gives, or null.
export const rumorOf = (place, person) => RUMORS.find((r) => r.at === place && r.who === person) ?? null;

// Whether a hidden place's rumours are all heard (its sum may still be unanswered).
export function rumorsDone(hidden, met) {
  const heard = rumorsHeard(met).map((r) => r.id);
  return hidden.needs.every((id) => heard.includes(id));
}

// Whether a hidden place is open: its rumours heard and its sum, if any, answered.
// keys: the hidden places whose sum has been answered.
export const isOpen = (hidden, met, keys) => rumorsDone(hidden, met) && (!hidden.sum || keys.includes(hidden.id));

// The ids of the places that are shown: every place that is not hidden, and the hidden
// ones that are open.
export function shownPlaces(ids, met, keys) {
  return ids.filter((id) => { const h = HIDDEN.find((x) => x.id === id); return !h || isOpen(h, met, keys); });
}
