// The one line of guidance at the top of the screen: what to try next, one thing at a
// time, in grandmother's way of asking. 25 characters at most. It never scolds and never
// hurries: it only names the next thing that has not been done.
//
// where: 'globe' or 'ground'. On the globe: visited and complete are how many squares
// have their first dot and all three, of total. On the ground: dots is that square's
// three, at is 'then' | 'today' | 'other' (where the dial stands), lookingUp is whether
// the head is raised, quizSolved whether its question was answered.
export function guideLine({ where, dots, at, lookingUp, quizSolved, complete, visited, total }) {
  if (where === 'globe') {
    if (complete >= total) return '수첩을 다 채웠구나. 고맙다';
    return visited > 0 ? '수첩이나 금색 점으로 다음 날에 가 보렴' : '지구를 돌려 금색 점을 눌러 보렴';
  }
  // A year with no picture: the way back comes before anything else.
  if (at === 'other') return '다이얼 끝의 이름표를 눌러 보렴';
  // Arriving: the day is about to fill by itself. Gone on to today before it did: back first.
  if (!dots.day) return at === 'then' ? null : '그날로 돌아가 보렴';
  if (!dots.sky) return lookingUp ? '그대로 잠깐 올려다보렴' : '화면을 위로 밀어 하늘을 보렴';
  if (lookingUp) return null;
  if (!dots.remains) return '오늘은 어떤지, 오늘로 돌려 보렴';
  return quizSolved ? '수첩을 펴서 다른 날로 가 보렴' : '이야기 카드도 읽어 보렴';
}
