// The Japanese of the game's Korean sentences (core/i18n.js). ja.json is kept by tools/i18n.py:
// the Korean sentence is the key.
import { addWords } from '../core/i18n.js';
import words from './ja.json';

addWords(words, 'ja');
