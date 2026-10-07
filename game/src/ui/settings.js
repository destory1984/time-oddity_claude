// The settings: the gear at the right end of the top buttons, built like volume 1's.
// Four pages: the options, the help, what changed (core/changes.js) and "About". The
// head carries the version and the two buttons for the size of the writing.
import { CHANGES, changesUntil, dayLabel, startedLine } from '../core/changes.js';
import { canResize, nextTextSize } from '../core/textSize.js';
import { loadTextSize, saveTextSize } from './storage.js';

const $ = (id) => document.getElementById(id);

// onOpen, onClose: the game is held while the settings are open.
// today: () => 'YYYY-MM-DD', the device's own day.
// sound: { muted(), setMuted(on) }, the same switch as the speaker button.
// version: the text for the head, such as 'v0.1.1 · 2026.10.7'.
export function createSettings({ onOpen, onClose, today, sound, version }) {
  const dialog = $('settings');
  $('appVersion').textContent = version;

  function showTab(name) {
    for (const button of $('settingsTabs').children) button.setAttribute('aria-selected', String(button.dataset.tab === name));
    for (const part of dialog.querySelectorAll('section')) part.hidden = part.dataset.tab !== name;
    $('settingsBody').scrollTop = 0;
  }
  for (const button of $('settingsTabs').children) button.addEventListener('click', () => showTab(button.dataset.tab));

  function renderNews() {
    let lastDay = null;
    $('newsStarted').textContent = startedLine(today());
    $('newsList').replaceChildren(...changesUntil(today(), CHANGES).map(({ day, text }) => {
      const item = document.createElement('li');
      // The day is written once, at the first line of that day.
      const when = document.createElement('time');
      when.dateTime = day;
      when.textContent = day === lastDay ? '' : dayLabel(day);
      lastDay = day;
      item.append(when, text);
      return item;
    }));
  }

  // The size of the writing: on the page's root, so that the memo slip and Sora's bubble
  // grow with the settings' own text.
  let textSize = loadTextSize();
  const sizeButtons = [...dialog.querySelectorAll('.textSize button')];
  function applyTextSize() {
    document.documentElement.style.setProperty('--text', String(textSize));
    for (const button of sizeButtons) button.disabled = !canResize(textSize, Number(button.dataset.way));
  }
  for (const button of sizeButtons) {
    button.addEventListener('click', () => {
      textSize = nextTextSize(textSize, Number(button.dataset.way));
      saveTextSize(textSize);
      applyTextSize();
    });
  }
  applyTextSize();

  function renderSound() {
    $('soundNow').textContent = sound.muted() ? '지금은 꺼져 있습니다.' : '지금은 켜져 있습니다.';
    $('soundSwitch').textContent = sound.muted() ? '소리 켜기' : '소리 끄기';
  }
  $('soundSwitch').addEventListener('click', () => { sound.setMuted(!sound.muted()); renderSound(); });

  $('settingsButton').addEventListener('click', () => {
    if (dialog.open) return;
    onOpen();
    renderNews();
    renderSound();
    showTab('options');
    dialog.showModal();
  });
  $('closeSettings').addEventListener('click', () => dialog.close());
  // A press outside the sheet closes it, as the closing button does. Outside is told by
  // where the press fell, not by its target: the sheet's own margin is the dialog too.
  dialog.addEventListener('click', (e) => {
    if (e.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (e.clientX < box.left || e.clientX > box.right || e.clientY < box.top || e.clientY > box.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => onClose());

  return { isOpen: () => dialog.open };
}
