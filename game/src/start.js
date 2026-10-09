import './style.css';
import { phoneFrame } from './core/screen.js';
import { loadScreen } from './ui/storage.js';
import { language } from './core/i18n.js';

// Which page this is: on a wide window the outer page only holds a phone-shaped frame
// (ui/shell.js) and the game starts inside it; on a phone, inside that frame, or when the
// player chose the wide view, the game starts here. (As in vol 1.)
const inFrame = window.self !== window.top;
const framed = !inFrame && loadScreen() !== 'wide' && phoneFrame({ width: innerWidth, height: innerHeight });

if (framed) {
  document.documentElement.classList.add('shell');
  import('./ui/shell.js').then((m) => m.startShell());
} else {
  // The wide view was chosen: the game fills the window instead of a phone-wide column.
  if (!inFrame && loadScreen() === 'wide') document.documentElement.classList.add('wide');
  // The dictionary of the language in use is fetched before anything is written (Korean has none).
  const words = { en: () => import('./i18n/en.js'), ja: () => import('./i18n/ja.js'), zh: () => import('./i18n/zh.js') }[language()];
  (words ? words().catch(() => {}) : Promise.resolve()).then(() => import('./main.js'));
}
