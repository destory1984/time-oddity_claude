// The opening: five pages shown the first time the game is opened. A picture, a line of
// what is seen or a slip of grandmother's note, and a word from Sora under it.
// Grandmother does not appear; she speaks only through the note.
//
// It must work for someone who never played volume 1 (who Sora is, that the notebook lists
// days long past) and read as the next moment for someone who did (the same gate and the
// same "할머니, 나 왔어!" that volume 1 ends on). The last two pages say what is done now:
// the dial, walking about and speaking to people, three errands a leaf (the first plan's
// "날아서 가거라" and "본 대로만 적어 오너라" stood here until 2026.10.8). The wording is a
// draft and is the user's to revise.
//
// kind: 'scene' for what is seen (the screen's type) or 'note' for grandmother's own
// words (her handwriting). say: Sora, 25 characters at most.
export const OPENING = [
  { image: 'gate.png', kind: 'scene', text: '할머니 댁 대문 앞. 불러도 대답이 없다.', say: '할머니, 나 왔어!' },
  { image: 'porch.png', kind: 'scene', text: '마루에 수첩이 놓여 있다. 그 위에 "소라에게"라고 적힌 쪽지.', say: '수첩이다. 할머니 글씨네.' },
  { image: 'open-book.png', kind: 'note', text: '소라야, 이건 내가 책 읽으며 적은 수첩이란다. 가 본 데는 하나도 없다. 다 지난 날이니까.', say: '지난 날엔 어떻게 가?' },
  { image: 'open-dial.png', kind: 'note', text: '지난 날로는 이 다이얼이 데려다줄 게다. 가거든 걸어 다니며 사람들에게 말을 걸어 보렴.', say: '다이얼을 돌리면 되는 거지?' },
  { image: 'open-dial.png', kind: 'note', text: '장마다 심부름을 셋씩 적어 두었다. 첫 장은 이천 년 전 로마란다. 새 경기장이 문을 여는 날이지.', say: '이천 년 전? 진짜 갈 수 있어?' },
];
