// The words and buttons over the picture: date, the three dots, the memo slip, Sora's
// bubble. set() takes the whole state every frame and touches the page only where a
// value has changed.
export function createHud(el) {
  const $ = (id) => el.querySelector(`#${id}`);
  const parts = {
    name: $('name'), dateText: $('dateText'), placeText: $('placeText'), subText: $('subText'),
    memo: $('memo'), bubble: $('bubble'), todayBtn: $('todayBtn'), leaveBtn: $('leaveBtn'), hint: $('hint'),
  };
  const dots = [...el.querySelectorAll('#dots i')];
  const glowSky = document.getElementById('glowSky');
  const sora = document.getElementById('sora');
  const shown = {};

  const changed = (key, value) => { if (shown[key] === value) return false; shown[key] = value; return true; };
  const text = (key, value) => { if (changed(key, value)) parts[key].textContent = value; };
  const glow = (node) => { node.classList.remove('glow'); node.getBoundingClientRect(); node.classList.add('glow'); };

  // state: { name, dateText, placeText, subText, dots: { day, sky, remains }, memo (text
  // or null), bubble (text or null), todayLabel, showToday, showLeave, hint, soraFade,
  // glowSky (a count: glows once each time it goes up), glowToday (likewise) }
  function set(state) {
    text('name', state.name);
    text('dateText', state.dateText);
    text('placeText', state.placeText);
    text('subText', state.subText);
    text('hint', state.hint ?? '');
    [state.dots.day, state.dots.sky, state.dots.remains].forEach((on, i) => {
      if (changed(`dot${i}`, on)) dots[i].classList.toggle('on', on);
    });
    if (changed('memoOn', state.memo !== null)) parts.memo.classList.toggle('on', state.memo !== null);
    if (state.memo !== null && changed('memo', state.memo)) {
      // A slip already on the screen turns over to show its new line.
      const wasShown = parts.memo.textContent !== '';
      parts.memo.textContent = state.memo;
      if (wasShown) { parts.memo.classList.remove('flip'); parts.memo.getBoundingClientRect(); parts.memo.classList.add('flip'); }
    }
    if (changed('bubbleOn', state.bubble !== null)) parts.bubble.classList.toggle('on', state.bubble !== null);
    if (state.bubble !== null && changed('bubble', state.bubble)) parts.bubble.textContent = state.bubble;
    text('todayBtn', state.todayLabel);
    if (changed('showToday', state.showToday)) parts.todayBtn.hidden = !state.showToday;
    if (changed('showLeave', state.showLeave)) parts.leaveBtn.hidden = !state.showLeave;
    if (changed('soraFade', Math.round(state.soraFade * 20))) sora.style.opacity = String(1 - state.soraFade);
    if (changed('glowSky', state.glowSky) && state.glowSky > 0) glow(glowSky);
    if (changed('glowToday', state.glowToday) && state.glowToday > 0) glow(parts.todayBtn);
  }

  return { set, todayBtn: parts.todayBtn, leaveBtn: parts.leaveBtn };
}
