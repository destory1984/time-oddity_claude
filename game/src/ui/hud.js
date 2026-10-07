// The words and buttons over the picture: date, the three dots, the memo slip, Sora's
// bubble. set() takes the whole state every frame and touches the page only where a
// value has changed.
export function createHud(el) {
  const $ = (id) => el.querySelector(`#${id}`);
  const parts = {
    name: $('name'), dateText: $('dateText'), placeText: $('placeText'), subText: $('subText'),
    memo: $('memo'), chips: $('chips'), bubble: $('bubble'), todayBtn: $('todayBtn'), leaveBtn: $('leaveBtn'), hint: $('hint'),
  };
  const dots = [...el.querySelectorAll('#dots i')];
  const glowSky = document.getElementById('glowSky');
  const sora = document.getElementById('sora');
  const shown = {};

  // Her eight frames are fetched at the start so that none flickers in late.
  for (const sheet of ['idle', 'see-hush', 'left', 'right', 'up', 'down', 'land-descend']) for (let i = 1; i <= 4; i += 1) { const img = new Image(); img.src = `./sora/${sheet}-${i}.png`; }

  const changed = (key, value) => { if (shown[key] === value) return false; shown[key] = value; return true; };
  const text = (key, value) => { if (changed(key, value)) parts[key].textContent = value; };
  const glow = (node) => { node.classList.remove('glow'); node.getBoundingClientRect(); node.classList.add('glow'); };

  // The date, with its "AD" or "BC" in letters half the size of the number.
  function dateWithEra(node, value) {
    const era = /^(AD|BC) (.*)$/.exec(value);
    node.textContent = era ? era[2] : value;
    if (!era) return;
    const small = document.createElement('small');
    small.textContent = era[1];
    node.prepend(small);
  }

  // state: { name, dateText, placeText, subText, dots: { day, sky, remains }, memo (text
  // or null), memoPlain (true when the slip carries a plain note, not grandmother's words), chips
  // (the story card and question buttons are up), bubble (text or null), todayLabel, showToday, showLeave, hint, soraFade, sora ({ sheet, frame }: which of her pictures is up),
  // glowSky (a count: glows once each time it goes up), glowToday (likewise) }
  function set(state) {
    text('name', state.name);
    if (changed('dateText', state.dateText)) dateWithEra(parts.dateText, state.dateText);
    text('placeText', state.placeText);
    text('subText', state.subText);
    // The guidance fades in and out; while it is up, a new line simply takes the old one's place.
    if (changed('hintOn', Boolean(state.hint))) parts.hint.classList.toggle('on', Boolean(state.hint));
    if (state.hint) text('hint', state.hint);
    [state.dots.day, state.dots.sky, state.dots.remains].forEach((on, i) => {
      if (changed(`dot${i}`, on)) dots[i].classList.toggle('on', on);
    });
    if (changed('memoPlain', Boolean(state.memoPlain))) parts.memo.classList.toggle('plain', Boolean(state.memoPlain));
    // memoSky: the slip is what grandmother wrote of the sky, shown higher up while Sora looks up.
    if (changed('memoSky', Boolean(state.memoSky))) parts.memo.classList.toggle('sky', Boolean(state.memoSky));
    if (changed('memoOn', state.memo !== null)) parts.memo.classList.toggle('on', state.memo !== null);
    if (state.memo !== null && changed('memo', state.memo)) {
      // A slip already on the screen turns over to show its new line.
      const wasShown = parts.memo.textContent !== '';
      parts.memo.textContent = state.memo;
      if (wasShown) { parts.memo.classList.remove('flip'); parts.memo.getBoundingClientRect(); parts.memo.classList.add('flip'); }
    }
    if (changed('chips', Boolean(state.chips))) parts.chips.classList.toggle('on', Boolean(state.chips));
    if (changed('bubbleOn', state.bubble !== null)) parts.bubble.classList.toggle('on', state.bubble !== null);
    if (state.bubble !== null && changed('bubble', state.bubble)) parts.bubble.textContent = state.bubble;
    text('todayBtn', state.todayLabel);
    if (changed('showToday', state.showToday)) parts.todayBtn.hidden = !state.showToday;
    if (changed('showLeave', state.showLeave)) parts.leaveBtn.hidden = !state.showLeave;
    if (changed('soraFade', Math.round(state.soraFade * 20))) sora.style.opacity = String(1 - state.soraFade);
    if (state.sora && changed('soraPose', `${state.sora.sheet}-${state.sora.frame}`)) sora.src = `./sora/${state.sora.sheet}-${state.sora.frame}.png`;
    if (changed('glowSky', state.glowSky) && state.glowSky > 0) glow(glowSky);
    if (changed('glowToday', state.glowToday) && state.glowToday > 0) glow(parts.todayBtn);
  }

  return { set, todayBtn: parts.todayBtn, leaveBtn: parts.leaveBtn };
}
