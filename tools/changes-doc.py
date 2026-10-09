"""Writes the lines of the game's "Changes" page (game/src/core/changes.js) into
docs/바뀐-것들.md, day by day, so that they can be read on GitHub as well as in the game.
The lines are kept in the game's file only; the document's list is always made from it
(tools/release.py runs this). Run from the repository root:

    python tools/changes-doc.py
"""
import io, re

MARK = '## 날마다 바뀐 것'
DOC = 'docs/바뀐-것들.md'

src = io.open('game/src/core/changes.js', encoding='utf-8').read()
rows = re.findall(r"\{ day: '(\d{4})-(\d{2})-(\d{2})', text: '([^']*)' \}", src)
assert len(rows) == src.count('{ day:'), (len(rows), src.count('{ day:'))

out = [MARK, '', f'모두 {len(rows)}줄이다. 새 날이 위에 온다. 이 아래는 `tools/changes-doc.py` 가 쓴다. 손으로 고치지 않는다.']
day = None
for y, m, d, text in rows:
    if (y, m, d) != day:
        day = (y, m, d)
        n = sum(1 for r in rows if r[:3] == day)
        out += ['', f'### {y}.{int(m)}.{int(d)} ({n}줄)', '']
    out.append(f'- {text}')

doc = io.open(DOC, encoding='utf-8').read()
head = doc.split(MARK)[0].rstrip('\n')
io.open(DOC, 'w', encoding='utf-8', newline='\n').write(head + '\n\n' + '\n'.join(out) + '\n')
print(f'{DOC}: {len(rows)} lines')
