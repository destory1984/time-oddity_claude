"""Bumps the version by one patch and adds lines at the top of today's changes
(game/src/core/changes.js), then writes the same lines into docs/바뀐-것들.md. Run from the repository root before building and committing:

    python tools/release.py "line one" ["line two" ...]

A line is what a player would notice, 10 to 70 characters, ending in "니다.".
"""
import datetime, io, re, sys

def load(p): return io.open(p, encoding='utf-8').read()
def save(p, s): io.open(p, 'w', encoding='utf-8', newline='\n').write(s)

DAY = datetime.date.today().isoformat()
s = load('package.json')
m = re.search(r'"version": "(\d+)\.(\d+)\.(\d+)"', s)
new = f'{m.group(1)}.{m.group(2)}.{int(m.group(3)) + 1}'
save('package.json', s.replace(m.group(0), f'"version": "{new}"'))

lines = sys.argv[1:]
for l in lines:
    assert 10 <= len(l) <= 70, (len(l), l)
    assert l.endswith('니다.'), l
    assert "'" not in l, l
s = load('game/src/core/changes.js')
a = "export const CHANGES = [\n"
assert s.count(a) == 1
save('game/src/core/changes.js', s.replace(a, a + ''.join(f"  {{ day: '{DAY}', text: '{l}' }},\n" for l in lines)))
# The same lines, for reading on GitHub (docs/바뀐-것들.md).
import subprocess
subprocess.run([sys.executable, 'tools/changes-doc.py'], check=True)
print('v' + new)
