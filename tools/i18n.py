"""The game's sentences for the other three languages (game/src/core/i18n.js): the Korean
sentence is the key, and game/src/i18n/en.json, ja.json and zh.json give it in English,
Japanese and Chinese. Run from the repository root.

    python tools/i18n.py keys     lists every Korean sentence the game can show, in
                                  temp/i18n/keys.json, and in pieces for translating
                                  (temp/i18n/chunk-<n>.json)
    python tools/i18n.py merge    gathers temp/i18n/out/<lang>-<n>.json into the dictionaries
    python tools/i18n.py check    says how many sentences each dictionary still lacks

What is listed: every string with Hangul in the code of game/src (comments left out), a
t`…` template as its key with {} for each value, the words of game/index.html, and of
core/squares.js only the squares that can be gone to (those with a walk).
"""
import glob
import io
import json
import os
import re
import sys
from html.parser import HTMLParser

HANGUL = re.compile('[가-힣]')
SRC = 'game/src'
OUT = 'temp/i18n'
LANGS = ['en', 'ja', 'zh']
CHUNKS = 6
# Shown as they are in every language: the name of a language on its own button.
AS_IT_IS = {'한국어'}


def load(path):
    return io.open(path, encoding='utf-8').read()


def unescape(body):
    def one(m):
        c = m.group(1)
        if c == 'n':
            return '\n'
        if c == 't':
            return '\t'
        if c[0] == 'u':
            return chr(int(c[1:], 16))
        return c
    return re.sub(r'\\(u[0-9a-fA-F]{4}|.)', one, body, flags=re.S)


def scan(code, found):
    """Every string of `code` that is not in a comment: ('s', text) for a plain one,
    ('t', key) for a t`…` template, ('x', text) for any other template with Hangul."""
    i, n = 0, len(code)
    while i < n:
        c = code[i]
        two = code[i:i + 2]
        if two == '//':
            i = code.find('\n', i)
            i = n if i < 0 else i
        elif two == '/*':
            i = code.find('*/', i) + 2
        elif c in '\'"':
            j = i + 1
            while code[j] != c:
                j += 2 if code[j] == '\\' else 1
            found.append(('s', unescape(code[i + 1:j])))
            i = j + 1
        elif c == '`':
            tagged = bool(re.search(r'(?<![\w.])t$', code[:i]))
            parts, part, j = [], '', i + 1
            while code[j] != '`':
                if code[j] == '\\':
                    part += code[j:j + 2]
                    j += 2
                elif code[j:j + 2] == '${':
                    depth, k = 1, j + 2
                    while depth:
                        if code[k] in '\'"`':
                            # (a string inside the value: skipped over by scanning it)
                            inner = []
                            k += scan_one(code[k:], inner, bool(re.search(r'(?<![\w.])t$', code[:k])))
                            found.extend(inner)
                            continue
                        depth += code[k] == '{'
                        depth -= code[k] == '}'
                        k += 1
                    scan(code[j + 2:k - 1], [])
                    parts.append(part)
                    part = ''
                    j = k
                else:
                    part += code[j]
                    j += 1
            parts.append(part)
            text = '{}'.join(unescape(p) for p in parts)
            found.append(('t' if tagged else ('s' if len(parts) == 1 else 'x'), text))
            i = j + 1
        else:
            i += 1
    return found


def scan_one(code, found, tagged=False):
    """Scans the one string or template `code` begins with; returns its length."""
    before = len(found)
    quote = code[0]
    if quote == '`':
        depth_found = []
        # find the end by scanning with a sentinel
        j = 1
        while code[j] != '`':
            if code[j] == '\\':
                j += 2
            elif code[j:j + 2] == '${':
                depth, k = 1, j + 2
                while depth:
                    if code[k] in '\'"`':
                        k += scan_one(code[k:], depth_found)
                        continue
                    depth += code[k] == '{'
                    depth -= code[k] == '}'
                    k += 1
                j = k
            else:
                j += 1
        scan(('t' if tagged else '') + code[:j + 1], found)
        return j + 1
    j = 1
    while code[j] != quote:
        j += 2 if code[j] == '\\' else 1
    found.append(('s', unescape(code[1:j])))
    assert len(found) == before + 1
    return j + 1


class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.texts = []
        self.skip = 0

    def handle_starttag(self, tag, attrs):
        if tag in ('script', 'style'):
            self.skip += 1
        for name, value in attrs:
            if name in ('title', 'aria-label', 'alt', 'placeholder', 'data-label') and value:
                self.texts.append(value)

    def handle_endtag(self, tag):
        if tag in ('script', 'style'):
            self.skip -= 1

    def handle_data(self, data):
        if not self.skip and data.strip():
            self.texts.append(data.strip())


def live_squares(code):
    """core/squares.js with the squares that have no walk cut out."""
    walks = load(f'{SRC}/core/walks.js')
    out, i = '', 0
    for m in re.finditer(r"\n  \{\n.*?\n  \},", code, re.S):
        own = re.search(r"^    id: '(\w+)'", m.group(0), re.M)
        keep = own is None or re.search(r"\n  %s: \{" % own.group(1), walks) is not None
        out += code[i:m.start()] + (m.group(0) if keep else '')
        i = m.end()
    return out + code[i:]


def keys():
    rows, seen, odd = [], set(), []

    def add(src, text):
        if HANGUL.search(text) and text not in seen and text not in AS_IT_IS:
            seen.add(text)
            rows.append({'src': src, 'ko': text})

    page = Page()
    page.feed(load('game/index.html'))
    for text in page.texts:
        add('index.html', text)
    for path in sorted(glob.glob(f'{SRC}/**/*.js', recursive=True)):
        name = path.replace('\\', '/').replace(f'{SRC}/', '')
        if name.startswith('i18n/'):
            continue
        code = load(path)
        if name == 'core/squares.js':
            code = live_squares(code)
        for kind, text in scan(code, []):
            if kind == 'x' and HANGUL.search(text):
                odd.append((name, text))
            elif kind != 'x':
                add(name, text)
                # A sentence of several lines is also asked for line by line.
    return rows, odd


def main():
    what = sys.argv[1] if len(sys.argv) > 1 else 'check'
    rows, odd = keys()
    if what == 'keys':
        os.makedirs(OUT, exist_ok=True)
        json.dump(rows, io.open(f'{OUT}/keys.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
        total = sum(len(r['ko']) for r in rows)
        # Pieces of about the same size, each of whole files where that can be.
        per, chunk, size, n = total / CHUNKS, [], 0, 1
        for row in rows:
            chunk.append(row)
            size += len(row['ko'])
            if size >= per and n < CHUNKS:
                json.dump(chunk, io.open(f'{OUT}/chunk-{n}.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
                chunk, size, n = [], 0, n + 1
        json.dump(chunk, io.open(f'{OUT}/chunk-{n}.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
        print(len(rows), 'sentences,', total, 'letters, in', n, 'pieces')
        for name, text in odd:
            print('  a template without t:', name, repr(text[:60]))
    elif what == 'merge':
        for lang in LANGS:
            book = json.loads(load(f'{SRC}/i18n/{lang}.json'))
            for path in sorted(glob.glob(f'{OUT}/out/{lang}-*.json')):
                book.update({k: v for k, v in json.loads(load(path)).items() if isinstance(v, str) and v.strip()})
            wanted = [r['ko'] for r in rows]
            kept = {k: book[k] for k in wanted if k in book}
            io.open(f'{SRC}/i18n/{lang}.json', 'w', encoding='utf-8', newline='\n').write(json.dumps(kept, ensure_ascii=False, indent=0) + '\n')
            print(lang, len(kept), 'of', len(wanted))
    else:
        bad = 0
        for lang in LANGS:
            book = json.loads(load(f'{SRC}/i18n/{lang}.json'))
            lack = [r['ko'] for r in rows if r['ko'] not in book]
            still = [k for k, v in book.items() if HANGUL.search(v)]
            holes = [k for k, v in book.items() if k.count('{}') and any('{%d}' % i not in v for i in range(k.count('{}')))]
            print(lang, 'lacks', len(lack), '· still Korean', len(still), '· a value dropped', len(holes))
            for k in (lack[:5] + still[:5] + holes[:5]):
                print('   ', repr(k[:70]))
            bad += len(lack) + len(still)
        sys.exit(1 if bad and what == 'strict' else 0)


if __name__ == '__main__':
    main()
