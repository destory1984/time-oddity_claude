// Shows the opening pages (core/opening.js) one at a time over the whole screen.
import { OPENING } from '../core/opening.js';

const $ = (id) => document.getElementById(id);

// onDone: called when the last page is passed or the opening is skipped.
export function createOpening({ onDone }) {
  const dialog = $('opening');
  let page = 0;

  function show() {
    const { image, kind, text, say } = OPENING[page];
    $('openingImage').src = `./opening/${image}`;
    $('openingText').textContent = text;
    $('openingText').className = kind;
    $('openingSay').textContent = say;
    $('openingCount').textContent = `${page + 1}/${OPENING.length}`;
    $('openingNext').textContent = page === OPENING.length - 1 ? '수첩 펴기' : '다음';
  }

  // The pictures are fetched together so that turning a page does not wait on one.
  for (const { image } of OPENING) { const img = new Image(); img.src = `./opening/${image}`; }

  $('openingNext').addEventListener('click', () => {
    if (page < OPENING.length - 1) { page += 1; show(); return; }
    dialog.close();
  });
  $('openingSkip').addEventListener('click', () => dialog.close());
  // Escape closes a dialog too: every way out ends the opening the same way.
  dialog.addEventListener('close', () => onDone());

  return {
    open() { page = 0; show(); if (!dialog.open) dialog.showModal(); },
    isOpen: () => dialog.open,
  };
}
