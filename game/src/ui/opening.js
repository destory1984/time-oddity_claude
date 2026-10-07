// A pager: shows pages one at a time over the whole screen. The opening (core/opening.js)
// and grandmother's notes (core/notes.js) are both told this way.

const $ = (id) => document.getElementById(id);

export function createPager() {
  const dialog = $('opening');
  let pages = [];
  let page = 0;
  let lastLabel = '닫기';
  let onDone = () => {};

  function show() {
    const { image, kind, text, say } = pages[page];
    $('openingImage').src = `./opening/${image}`;
    $('openingText').textContent = text;
    $('openingText').className = kind;
    $('openingSay').textContent = say;
    $('openingSay').hidden = !say;
    $('openingCount').textContent = `${page + 1}/${pages.length}`;
    $('openingNext').textContent = page === pages.length - 1 ? lastLabel : '다음';
  }

  $('openingNext').addEventListener('click', () => {
    if (page < pages.length - 1) { page += 1; show(); return; }
    dialog.close();
  });
  $('openingSkip').addEventListener('click', () => dialog.close());
  // Escape closes a dialog too: every way out ends the telling the same way.
  dialog.addEventListener('close', () => { const done = onDone; onDone = () => {}; done(); });

  return {
    // what: { pages: [{ image, kind, text, say }], lastLabel, skip (whether it may be
    // skipped), onDone (called however it ends) }
    open(what) {
      pages = what.pages; lastLabel = what.lastLabel; onDone = what.onDone ?? (() => {});
      $('openingSkip').hidden = !what.skip;
      // The pictures are fetched together so that turning a page does not wait on one.
      for (const { image } of pages) { const img = new Image(); img.src = `./opening/${image}`; }
      page = 0; show();
      if (!dialog.open) dialog.showModal();
    },
    isOpen: () => dialog.open,
  };
}
