// The story card of the square Sora stands on: three sentences in a newspaper voice and
// the square's question, on a sheet that comes up over the ground.
import { squareTitle } from '../core/squares.js';
import { t } from '../core/i18n.js';
import { renderQuiz } from './quiz.js';

const $ = (id) => document.getElementById(id);

// solved(id): whether that square's question was answered. onSolve(id): it was, just now.
export function createCard({ solved, onSolve }) {
  const dialog = $('cardSheet');

  function open(square, toQuiz = false) {
    $('cardName').textContent = squareTitle(square);
    $('cardWhen').textContent = `${t(square.dateLabel)} · ${t(square.place)}`;
    $('cardText').textContent = square.card;
    renderQuiz($('cardQuiz'), square, solved(square.id), () => onSolve(square.id));
    if (!dialog.open) dialog.showModal();
    if (toQuiz) $('cardQuiz').scrollIntoView({ block: 'nearest' });
  }

  $('closeCard').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => {
    if (e.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (e.clientX < box.left || e.clientX > box.right || e.clientY < box.top || e.clientY > box.bottom) dialog.close();
  });

  return { open, isOpen: () => dialog.open };
}
