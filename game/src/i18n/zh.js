// The Chinese of the game's Korean sentences (core/i18n.js). zh.json is kept by tools/i18n.py:
// the Korean sentence is the key.
import { addWords } from '../core/i18n.js';
import words from './zh.json';

addWords(words, 'zh');
