// The settings: the gear at the right end of the top buttons, built like volume 1's.
// Four pages: the options, the help, what changed (core/changes.js) and "About". The
// head carries the version and the two buttons for the size of the writing.
import { loadScreen, saveScreen } from './storage.js';
import { CHANGES, changesUntil, dayLabel, startedLine } from '../core/changes.js';
import { canResize, nextTextSize } from '../core/textSize.js';
import { loadTextSize, saveTextSize } from './storage.js';

const $ = (id) => document.getElementById(id);

// onOpen, onClose: the game is held while the settings are open.
// today: () => 'YYYY-MM-DD', the device's own day.
// sound: { muted(), setMuted(on) }, the same switch as the speaker button.
// music: { on(), setOn(on), another(), tunes(), playingId(), choose(id), repeat(), setRepeat(on) },
// the same switch as the note button.
// version: the text for the head, such as 'v0.1.1 · 2026.10.7'.
// onReset: the notebook is to be emptied (asked twice before it is done).
// onReplay: the opening is to be shown again.
export function createSettings({ onOpen, onClose, today, sound, music, version, onReset = () => {}, onReplay = () => {} }) {
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

  // Every tune has a button of its own, the one sounding lit; and one tune may be heard
  // over and over (the user, 2026.10.9: "음악 선택 가능하게, 반복도 가능하게").
  const tuneButtons = music.tunes().map(({ id, name }) => {
    const button = document.createElement('button');
    button.type = 'button'; button.textContent = name; button.dataset.tune = id;
    button.addEventListener('click', () => { music.choose(id); if (!music.on()) music.setOn(true); renderSound(); });
    return button;
  });
  $('musicTunes').replaceChildren(...tuneButtons);
  function renderSound() {
    $('musicNow').textContent = music.on() ? '지금은 켜져 있습니다.' : '지금은 꺼져 있습니다.';
    $('musicSwitch').textContent = music.on() ? '배경 음악 끄기' : '배경 음악 켜기';
    const playing = music.on() ? music.playingId() : null;
    for (const button of tuneButtons) button.setAttribute('aria-pressed', String(button.dataset.tune === playing));
    $('musicRepeat').setAttribute('aria-pressed', String(music.repeat()));
    $('musicRepeat').textContent = music.repeat() ? '한 곡만 되풀이: 켜짐' : '한 곡만 되풀이: 꺼짐';
  }
  $('musicRepeat').addEventListener('click', () => { music.setRepeat(!music.repeat()); renderSound(); });
  // While the settings are open the lit button follows the tune as it changes.
  let watch = 0;
  $('musicSwitch').addEventListener('click', () => { music.setOn(!music.on()); renderSound(); });
  // Another tune; if the music was off, it is switched on to play it.
  $('musicAnother').addEventListener('click', () => { music.another(); if (!music.on()) music.setOn(true); renderSound(); });

  // Emptying the notebook cannot be undone, so the button asks once more before it does.
  let sure = false;
  const resetLabel = () => { $('resetProgress').textContent = sure ? '정말 비울까요? 한 번 더 누르면 비웁니다' : '수첩 비우기'; };
  $('resetProgress').addEventListener('click', () => {
    if (!sure) { sure = true; resetLabel(); return; }
    sure = false; resetLabel();
    onReset();
  });

  // On a PC the game is in a phone-shaped frame (ui/shell.js) unless the wide view was
  // chosen; a phone has neither, and is not offered the switch.
  const inFrame = window.self !== window.top;
  if (inFrame || loadScreen() === 'wide') {
    $('screenTerm').hidden = false;
    $('screenRow').hidden = false;
    $('screenNow').textContent = inFrame ? '지금: 휴대전화와 같은 세로 화면.' : '지금: 창을 가득 채운 넓은 화면.';
    $('screenButton').textContent = inFrame ? '넓은 화면으로 바꾸기' : '세로 화면으로 바꾸기';
    $('screenButton').addEventListener('click', () => {
      saveScreen(inFrame ? 'wide' : 'phone');
      window.top.location.reload();
    });
  }
  $('replayOpening').addEventListener('click', () => { dialog.close(); onReplay(); });

  $('settingsButton').addEventListener('click', () => {
    if (dialog.open) return;
    onOpen();
    renderNews();
    renderSound();
    sure = false; resetLabel();
    showTab('options');
    dialog.showModal();
    watch = setInterval(renderSound, 1000);
  });
  $('closeSettings').addEventListener('click', () => dialog.close());
  // A press outside the sheet closes it, as the closing button does. Outside is told by
  // where the press fell, not by its target: the sheet's own margin is the dialog too.
  dialog.addEventListener('click', (e) => {
    if (e.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (e.clientX < box.left || e.clientX > box.right || e.clientY < box.top || e.clientY > box.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => { clearInterval(watch); onClose(); });

  return { isOpen: () => dialog.open };
}
