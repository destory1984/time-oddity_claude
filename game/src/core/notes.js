// Grandmother's notes: slips that fall from between the leaves of the notebook when
// something has been filled. They are the days she lived through herself. Each is told
// over pages: the first a picture and what happens, then her words a paragraph a page,
// with a word from Sora under each; the last of `says` is what she says when the slip is
// folded.
//
// The first leaf's the user chose on 2026.10.7 from three drafts (docs/쪽지-1969-시안.md,
// the second: "달은 어제와 똑같더구나"). It says why this notebook exists, and it does not
// contradict volume 1's note of the same day. The rest are drafts written on 2026.10.8
// after plan v5 (section 8), for the user to revise: 1988 falls in Seoul, the day she saw
// on television at thirty-four; 1989, the wall in Berlin, when five places are done (she
// read of it in the newspaper: which morning's is not said, for the gates opened in the
// small hours of the 10th by Korean time); and the last leaf when every place is done.
//
// A note falls when its `square` is complete, or when `after` places are ('all': every
// place that is walked about).
export const NOTES = [
  {
    id: 'y1969',
    square: 'yard1969',          // falls when this square's three dots are all filled
    title: '1969.7.21',
    image: 'note-1969.png',
    scene: '심부름을 마치자 수첩 사이에서 쪽지가 떨어졌다.',
    text: [
      '열다섯 살 여름이었단다. 이웃집 마당에서 온 동네가 텔레비전 한 대를 봤지. 사람이 달에 내려서는 걸.',
      '어른들은 세상이 달라졌다고 했단다. 그런데 고개를 들어 보니 달은 어제와 똑같더구나. 감나무 위에 가만히 떠 있었어.',
      '그때 알았단다. 큰일이 있던 날에도 하늘은 평소와 같다는 걸. 그래서 책에서 큰 날을 만나면 적어 두었지. 그날 밤 달은 어땠을까, 하고.',
    ],
    says: ['어, 뭐가 떨어졌네?', '온 동네가 한 마당에. 나도 봤어.', '맞아. 달은 그냥 떠 있었어.', '그래서 수첩이 이렇게 된 거구나.'],
  },
  {
    id: 'y1988',
    square: 'seoul88',
    title: '1988.9.17',
    image: 'note-1988.png',
    scene: '심부름을 마치자 수첩 사이에서 쪽지가 떨어졌다.',
    text: [
      '서른넷이었단다. 그날은 온 식구가 아침부터 텔레비전 앞에 앉았지. 이번에는 색이 다 나오는 텔레비전이었어.',
      '함성이 가득하던 운동장이 갑자기 조용해지더구나. 아이 하나가 굴렁쇠를 굴리며 나왔어. 우리 식구도 숨을 죽였단다.',
      '열다섯에는 남의 나라가 달에 가는 걸 봤는데, 서른넷에는 온 세상이 우리 동네에 왔더구나. 그래서 이 날도 적어 두었지.',
    ],
    says: ['쪽지다! 여기서도 떨어지네.', '이번엔 색깔 텔레비전이야.', '나도 봤어. 진짜 조용했어.', '할머니도 같이 본 거네.'],
  },
  {
    id: 'y1989',
    after: 5,
    title: '1989.11.9',
    image: 'note-1989.png',
    scene: '다섯 번째 자리를 마치자 쪽지가 또 한 장 떨어졌다.',
    text: [
      '서른다섯 살 늦가을이었단다. 신문 첫 장에 큰 사진이 실렸어. 높은 담 위에 사람들이 올라서서 손을 흔들고 있더구나.',
      '독일의 베를린이라는 도시를 스물여덟 해 동안 둘로 가르던 담이란다. 그 문이 하룻밤 사이에 열렸다는 거야.',
      '그날 밤 달은 보름을 며칠 앞두고 있었다더구나. 사람들이 담을 넘을 때도 달은 그냥 떠 있었겠지.',
    ],
    says: ['쪽지가 또 있어!', '담 위에 사람이 저렇게 많이.', '하룻밤에 열렸다고?', '그날도 달은 떠 있었구나.'],
  },
  {
    id: 'last',
    after: 'all',
    title: '마지막 장',
    close: '수첩을 덮는다',      // what the last button says (a slip is folded: '쪽지를 접는다')
    image: 'last.png',
    scene: '모든 자리를 다녀오자 수첩의 마지막 장이 펼쳐졌다.',
    text: [
      '책으로만 읽던 데를 네가 다 다녀왔구나. 로마 생선 소스는 정말 지독하더냐. 나는 평생 궁금했단다.',
      '2061년 여름에 핼리 혜성이 다시 온단다. 그때 너는 마흔다섯이겠네.',
      '나는 못 본다. 그러니 네가 보고 와서 또 얘기해 주련.',
    ],
    says: ['마지막 장이야.', '응, 진짜 지독했어.', '2061년… 한참 남았네.', '할머니, 2061년에 또 올게.'],
  },
];

export const noteById = (id) => NOTES.find((note) => note.id === id);

// The note that is due: its square is complete, or as many places are as it waits for, and
// it has not been read yet. null if none. complete(squareId) says whether a square has all
// three dots; read is the ids already read; places is the ids of the places that are
// walked about.
export function dueNote(complete, read, places = []) {
  const done = places.filter((id) => complete(id)).length;
  const ripe = (note) => (note.square ? complete(note.square) : places.length > 0 && done >= (note.after === 'all' ? places.length : note.after));
  return NOTES.find((note) => ripe(note) && !read.includes(note.id)) ?? null;
}

// A note as pages for the pager (ui/opening.js): { image, kind, text, say }.
export function notePages(note) {
  return [
    { image: note.image, kind: 'scene', text: note.scene, say: note.says[0] },
    // Under the last page Sora says nothing yet: her last word comes when the slip is folded.
    ...note.text.map((text, i) => ({ image: note.image, kind: 'note', text, say: i < note.text.length - 1 ? note.says[i + 1] : '' })),
  ];
}
