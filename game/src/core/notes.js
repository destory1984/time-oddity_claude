// Grandmother's notes: slips that fall from between the leaves of the notebook when
// something has been filled. They are the days she lived through herself. Each is told
// over pages: the first a picture and what happens, then her words a paragraph a page,
// with a word from Sora under each; the last of `says` is what she says when the slip is
// folded.
//
// So far there is one, for the first leaf. The user chose its wording on 2026.10.7 from
// three drafts (docs/쪽지-1969-시안.md, the second: "달은 어제와 똑같더구나"). It says why
// this notebook exists, and it does not contradict volume 1's note of the same day.
export const NOTES = [
  {
    id: 'y1969',
    square: 'yard1969',          // falls when this square's three dots are all filled
    title: '1969.7.21',
    image: 'note-1969.png',
    scene: '오늘로 돌아오자 수첩 사이에서 쪽지가 떨어졌다.',
    text: [
      '열다섯 살 여름이었단다. 이웃집 마당에서 온 동네가 텔레비전 한 대를 봤지. 사람이 달에 내려서는 걸.',
      '어른들은 세상이 달라졌다고 했단다. 그런데 고개를 들어 보니 달은 어제와 똑같더구나. 감나무 위에 가만히 떠 있었어.',
      '그때 알았단다. 큰일이 있던 날에도 하늘은 평소와 같다는 걸. 그래서 책에서 큰 날을 만나면 적어 두었지. 그날 밤 달은 어땠을까, 하고.',
    ],
    says: ['어, 뭐가 떨어졌네?', '온 동네가 한 마당에. 나도 봤어.', '맞아. 달은 그냥 떠 있었어.', '그래서 수첩이 이렇게 된 거구나.'],
  },
];

export const noteById = (id) => NOTES.find((note) => note.id === id);

// The note that is due: its square is complete and it has not been read yet. null if none.
// complete(squareId) says whether a square has all three dots; read is the ids already read.
export function dueNote(complete, read) {
  return NOTES.find((note) => complete(note.square) && !read.includes(note.id)) ?? null;
}

// A note as pages for the pager (ui/opening.js): { image, kind, text, say }.
export function notePages(note) {
  return [
    { image: note.image, kind: 'scene', text: note.scene, say: note.says[0] },
    // Under the last page Sora says nothing yet: her last word comes when the slip is folded.
    ...note.text.map((text, i) => ({ image: note.image, kind: 'note', text, say: i < note.text.length - 1 ? note.says[i + 1] : '' })),
  ];
}
