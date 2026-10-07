// Grandmother's notebook: every square in a list, with its three dots and a "가기" that
// takes Sora there, so that nobody has to know a year to choose where to go. A row opens
// to show grandmother's memo (always, she wrote it beforehand) and, once Sora has been
// there, Sora's note and the story card with its question.
import { countProgress, dotsOf, isVisited, quizSolved } from '../core/progress.js';
import { renderQuiz } from './quiz.js';

const $ = (id) => document.getElementById(id);
const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

// squares: all of them, in order. progress: () => the record now. onGo(id): "가기" was
// pressed. onSolve(id): the square's question was answered. here: () => the id of the
// square Sora stands on, or null. canGo: () => whether she can set off now (not while
// she is already on her way).
export function createJournal({ squares, progress, onGo, onSolve, here, canGo = () => true }) {
  const dialog = $('journal');
  const ids = squares.map((s) => s.id);
  let open = null;   // the id of the row that is opened

  function row(square) {
    const record = progress();
    const dots = dotsOf(record, square.id);
    const visited = isVisited(record, square.id);
    const item = el('li', `row${visited ? '' : ' unseen'}${open === square.id ? ' open' : ''}`);

    const head = el('button', 'rowHead');
    head.type = 'button';
    const marks = el('span', 'rowDots');
    for (const key of ['day', 'sky', 'remains']) marks.append(el('i', dots[key] ? 'on' : ''));
    const words = el('span', 'rowWords');
    words.append(el('b', '', `${square.no} ${square.name}`), el('small', '', `${square.dateLabel} · ${square.place}`));
    head.append(marks, words);
    head.addEventListener('click', () => { open = open === square.id ? null : square.id; render(); });

    const go = el('button', 'go', here() === square.id ? '여기' : '가기');
    go.type = 'button';
    go.disabled = here() === square.id || !canGo();
    go.addEventListener('click', () => { dialog.close(); onGo(square.id); });
    item.append(head, go);

    if (open === square.id) {
      const more = el('div', 'more');
      more.append(el('p', 'hand', square.noteMemo));
      if (visited) {
        more.append(el('p', 'seora', `소라: ${square.sora}`));
        more.append(el('p', 'cardText', square.card));
        const quiz = el('div', 'quiz');
        renderQuiz(quiz, square, quizSolved(record, square.id), () => { onSolve(square.id); render(); });
        more.append(quiz);
      } else {
        more.append(el('p', 'faint', '다녀오면 소라의 덧글과 이야기 카드가 생깁니다.'));
      }
      item.append(more);
    }
    return item;
  }

  function render() {
    const count = countProgress(progress(), ids);
    $('journalProgress').textContent = `날 ${count.day}/${count.total} · 하늘 ${count.sky} · 남은 것 ${count.remains} · 맞힌 문제 ${count.quiz}`;
    $('journalList').replaceChildren(...squares.map(row));
  }

  // The count on the top button: squares with all three dots filled.
  function showCount() {
    const count = countProgress(progress(), ids);
    $('journalCount').textContent = `${count.complete}/${count.total}`;
  }
  showCount();

  $('journalButton').addEventListener('click', () => {
    if (dialog.open) return;
    open = here();
    render();
    dialog.showModal();
  });
  $('closeJournal').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => {
    if (e.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (e.clientX < box.left || e.clientX > box.right || e.clientY < box.top || e.clientY > box.bottom) dialog.close();
  });

  return { showCount, isOpen: () => dialog.open };
}
