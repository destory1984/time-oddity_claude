// Four languages, as in volume 1 (oddity/src/core/i18n.js): Korean, which everything is
// written in, and English, Japanese and Chinese (simplified). The Korean sentence itself is
// the key: a dictionary for each other language (src/i18n/en.json, ja.json, zh.json) gives
// its sentence there. A sentence that is not in the dictionary yet is shown in Korean.
// (The user, 2026.10.9, of the settings: "언어 바꾸는 버튼이 없네"; asked how far: "1권처럼 넷 다",
// "늦으면 더 힘들어... 지금이라도 해야지".)

export const LANG_KEY = 'timeoddity.lang.v1';
export const LANGUAGES = ['ko', 'en', 'ja', 'zh'];

// The language to use. saved: what the player chose (one of LANGUAGES), or null. device:
// the device's own language (navigator.language). Korean, Japanese and Chinese devices
// get their own, every other device English.
export function pickLanguage(saved, device) {
  if (LANGUAGES.includes(saved)) return saved;
  const own = /^(ko|ja|zh)\b/i.exec(device ?? 'ko');
  return own ? own[1].toLowerCase() : 'en';
}

function detect() {
  // Only in a browser: the tests, which check the Korean sentences, run in Korean.
  if (typeof document === 'undefined') return 'ko';
  let saved = null;
  try {
    saved = localStorage.getItem(LANG_KEY);
  } catch {
    // No storage: the device's language.
  }
  return pickLanguage(saved, navigator.language);
}

let lang = detect();
const dictionaries = { en: new Map(), ja: new Map(), zh: new Map() };
const dictionary = () => dictionaries[lang];

export const language = () => lang;
export const english = () => lang === 'en';
// What the page's lang attribute says (ui/translate.js).
export const pageLanguage = () => ({ zh: 'zh-Hans' }[lang] ?? lang);

// For the tests.
export function setLanguage(next) {
  lang = LANGUAGES.includes(next) ? next : 'ko';
}

// Adds sentences: { '한글 문장': 'English sentence' }, to the dictionary of the language
// `to`. A sentence of several lines is also known line by line, so that it is found when
// joined to another one.
export function addWords(words, to = 'en') {
  const book = dictionaries[to];
  for (const [ko, own] of Object.entries(words)) {
    book.set(ko, own);
    const koLines = ko.split('\n');
    const ownLines = own.split('\n');
    // (Not a template's: its values are numbered across the whole sentence.)
    if (koLines.length > 1 && koLines.length === ownLines.length && !ko.includes('{}')) {
      koLines.forEach((line, i) => { if (line.trim() && !book.has(line)) book.set(line, ownLines[i]); });
    }
  }
}

// A whole Korean text in the language in use, or null when there is none: the text
// itself, or each of its lines.
export function wordsOf(text) {
  const book = dictionary();
  if (!book) return null;
  const whole = book.get(text);
  if (whole !== undefined) return whole;
  if (!text.includes('\n')) return null;
  const lines = text.split('\n');
  const out = lines.map((line) => (line.trim() ? book.get(line) : line));
  return out.every((line) => line !== undefined) ? out.join('\n') : null;
}

// t('문장') or t`${name}에 내려앉기`: the sentence in the language in use. For a template the
// key has {} where each value stands ('{}에 내려앉기') and the other language names the values
// by number ('Land at {0}'), so it may reorder or drop them (a Korean particle has no
// English). A value that is itself a sentence is put into the language where it is given:
// t`할머니의 물음 · ${t(ask)}`.
export function t(strings, ...values) {
  if (typeof strings === 'string') return (lang !== 'ko' && wordsOf(strings)) || strings;
  if (strings === null || strings === undefined) return strings;
  const korean = () => strings.reduce((out, part, i) => out + part + (i < values.length ? values[i] : ''), '');
  if (lang === 'ko') return korean();
  const own = dictionary().get(strings.join('{}'));
  return own === undefined ? korean() : own.replace(/\{(\d+)\}/g, (_, n) => values[Number(n)] ?? '');
}

// 1st, 2nd, 3rd, 4th … 11th, 12th, 13th … 21st: for the centuries in English.
export function ordinal(n) {
  const tens = n % 100;
  if (tens >= 11 && tens <= 13) return `${n}th`;
  return `${n}${['th', 'st', 'nd', 'rd'][n % 10] ?? 'th'}`;
}

// Every key and its sentence in the language `of`, for the tests.
export const words = (of = 'en') => [...dictionaries[of].entries()];
