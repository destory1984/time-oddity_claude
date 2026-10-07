// Grandmother's notebook: every square in a list, with its three dots and a "가기" that
// takes Sora there, so that nobody has to know a year to choose where to go. A row opens
// to show grandmother's memo (always, she wrote it beforehand) and, once Sora has been
// there, Sora's note and the story card with its question.
import { countProgress, dotsOf, isVisited, quizSolved } from '../core/progress.js';
import { squareTitle } from '../core/squares.js';
import { repliesWaiting, replyDue } from '../core/postcard.js';
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
// notes: () => the notes read so far ([{ id, title }]); onNote(id): one is to be read again.
// cards: () => the postcards (core/postcard.js); today: () => 'YYYY-MM-DD'; onSend(id): a
// postcard is sent; onReply(id): its answer has been shown.
export function createJournal({
  squares, progress, onGo, onSolve, here, canGo = () => true, notes = () => [], onNote = () => {},
  cards = () => ({}), today = () => '', onSend = () => {}, onReply = () => {},
}) {
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
    words.append(el('b', '', squareTitle(square)), el('small', '', `${square.dateLabel} · ${square.place}`));
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
        const card = cards()[square.id];
        if (card) {
          const post = el('div', 'postcard');
          const picture = el('img');
          picture.src = card.image; picture.alt = `${square.name}의 엽서`;
          post.append(picture, el('p', 'seora', card.at === 'today' ? square.soraToday : square.sora), el('small', '', `${card.label} · ${square.place} — 소라`));
          more.append(post);
          if (!card.sentDay) {
            const send = el('button', 'send', '할머니께 보내기');
            send.type = 'button';
            send.addEventListener('click', () => { onSend(square.id); render(); });
            more.append(send);
          } else if (!replyDue(card, today())) {
            more.append(el('p', 'faint', '보냈습니다. 답장은 내일 옵니다.'));
          } else {
            const reply = el('div', 'reply');
            reply.append(el('small', '', '할머니의 답장'), el('p', 'hand', square.reply));
            more.append(reply);
            if (!card.replyRead) onReply(square.id);
          }
        } else {
          more.append(el('p', 'faint', '사진을 찍으면 엽서가 여기에 들어옵니다.'));
        }
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
    const slips = notes().map(({ id, title }) => {
      const item = el('li', 'row slip');
      const words = el('span', 'rowWords');
      words.append(el('b', '', `쪽지 ${title}`), el('small', '', '수첩 사이에서 떨어진 할머니의 쪽지'));
      const again = el('button', 'go', '읽기');
      again.type = 'button';
      again.addEventListener('click', () => { dialog.close(); onNote(id); });
      item.append(words, again);
      return item;
    });
    $('journalList').replaceChildren(...squares.map(row), ...slips);
  }

  // The count on the top button: squares with all three dots filled.
  function showCount() {
    const count = countProgress(progress(), ids);
    $('journalCount').textContent = `${count.complete}/${count.total}`;
    $('journalButton').classList.toggle('has-reply', repliesWaiting(cards(), today()) > 0);
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
