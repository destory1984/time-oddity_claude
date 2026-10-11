import './style.css';
import { phoneFrame } from './core/screen.js';
import { language } from './core/i18n.js';

// Which page this is: on a wide window the outer page only holds a phone-shaped frame
// (ui/shell.js) and the game starts inside it; on a phone, or inside that frame, the game
// starts here. (As in vol 1. There was a wide view to choose until 2026.10.12; the user:
// "우리 가로 버전은 포기하자.")
const inFrame = window.self !== window.top;
const framed = !inFrame && phoneFrame({ width: innerWidth, height: innerHeight });

if (framed) {
  document.documentElement.classList.add('shell');
  import('./ui/shell.js').then((m) => m.startShell());
} else {
  // The dictionary of the language in use is fetched before anything is written (Korean has none).
  const words = { en: () => import('./i18n/en.js'), ja: () => import('./i18n/ja.js'), zh: () => import('./i18n/zh.js') }[language()];
  (words ? words().catch(() => {}) : Promise.resolve()).then(() => import('./main.js'));
}
