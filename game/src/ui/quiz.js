// "맞혀 보렴": a square's question with three choices. Nothing is lost by a wrong answer:
// that choice dims and the others stay. The right one is stamped and remembered.
// Used by the notebook and by the story card on the ground.

// The three choices in an order that is always the same for a square but not always
// answer-first.
export function choicesFor(square) {
  const all = [square.quiz.answer, ...square.quiz.wrong];
  const turn = square.no % all.length;
  return [...all.slice(turn), ...all.slice(0, turn)];
}

// container: where to draw. solved: it was answered before. onSolve: called when the
// right choice is pressed for the first time.
export function renderQuiz(container, square, solved, onSolve) {
  const question = document.createElement('p');
  question.className = 'quizAsk';
  question.textContent = `맞혀 보렴: ${square.quiz.question}`;
  const list = document.createElement('div');
  list.className = 'quizChoices';
  for (const choice of choicesFor(square)) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = choice;
    const right = choice === square.quiz.answer;
    if (solved) { button.disabled = true; if (right) button.classList.add('right'); }
    button.addEventListener('click', () => {
      if (right) {
        for (const other of list.children) other.disabled = true;
        button.classList.add('right');
        onSolve();
      } else {
        button.disabled = true;
        button.classList.add('wrong');
      }
    });
    list.append(button);
  }
  container.replaceChildren(question, list);
}
