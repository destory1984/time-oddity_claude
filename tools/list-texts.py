"""Gathers every line of text in the game that the user has yet to read and revise into
docs/임시-글.md. The texts themselves live in the code; this only lists them.

    python tools/list-texts.py
"""
import io
import re


def load(path):
    return io.open(path, encoding='utf-8').read()


def field(block, key):
    found = re.search(r"\b" + key + r": '([^']*)'", block)
    return found.group(1) if found else ''


# Lines taken over from docs/상세-기획-1.md or the outline ("초안"); every other line was
# written while building ("임시"). Neither has been revised by the user yet.
FROM_PLAN = {
    'lunar1504': ['memo', 'sora', 'noteMemo', 'card', 'quiz'],
    'crystalPalace': ['memo', 'sora', 'soraToday', 'memoToday', 'noteMemo', 'card', 'quiz'],
    'kittyHawk': ['memo', 'sora', 'noteMemo', 'card', 'quiz'],
    'yard1969': ['sora', 'soraSky'],
}
NAMES = {
    'memo': '화면 메모(할머니)', 'sora': '소라 한마디', 'soraSky': '소라, 하늘을 보고',
    'memoToday': '남은 것', 'soraToday': '소라, 오늘로 돌린 뒤',
    'noteMemo': '수첩 메모(할머니)', 'card': '이야기 카드',
}

out = [
    '# 임시 글 모음: 사용자가 읽고 고칠 글',
    '',
    '- 만든 날: 2026.10.7. 사용자가 "임시글은 어디에 있어?"라고 물어, 게임 안의 글을 한곳에 모았다.',
    '- 글의 원본은 코드에 있다. 칸의 글은 `game/src/core/squares.js`, 여는 쪽은 `game/src/core/opening.js`, 안내 한 줄은 `game/src/core/guide.js` 다. **고칠 것을 말해 주면 코드에 옮긴다.** 이 문서는 `tools/list-texts.py` 로 코드에서 뽑은 것이라, 코드가 바뀌면 다시 뽑는다.',
    '- "어디서" 칸의 뜻: **임시**는 짓는 동안 새로 지은 글이다. **초안**은 `상세-기획-1.md` 나 기획서에 적어 둔 글을 옮긴 것이다. 둘 다 사용자가 아직 고치지 않았다.',
    '- 글자 수 규칙: 화면 메모와 소라의 말은 25자, 수첩 메모는 60자, 카드는 세 문장. 문제의 답은 카드 글 안의 말이고 숫자를 묻지 않는다.',
    '',
    '## 1. 칸의 글',
    '',
]
squares = load('game/src/core/squares.js')
blocks = re.findall(r"\n  \{\n(.*?)\n  \},", squares, re.S)
for block in blocks:
    ident = field(block, 'id')
    number = re.search(r"no: (\d+)", block).group(1)
    title = ('첫 장' if number == '0' else number) + ' ' + field(block, 'name')
    out += [f"### {title} ({field(block, 'dateLabel')}, {field(block, 'place')})", '', '| 무엇 | 글 | 어디서 |', '|---|---|---|']
    for key, label in NAMES.items():
        value = field(block, key)
        if value:
            out.append(f"| {label} | {value} | {'초안' if key in FROM_PLAN.get(ident, []) else '임시'} |")
    quiz = re.search(r"question: '([^']*)', answer: '([^']*)', proof: '[^']*', wrong: \['([^']*)', '([^']*)'\]", block)
    if quiz:
        source = '초안' if 'quiz' in FROM_PLAN.get(ident, []) else '임시'
        out.append(f"| 맞혀 보렴 | {quiz.group(1)} **{quiz.group(2)}** / {quiz.group(3)} / {quiz.group(4)} | {source} |")
    out.append('')

pages = re.findall(r"\{ image: '([^']*)', kind: '([^']*)', text: '([^']*)', say: '([^']*)' \}", load('game/src/core/opening.js'))
out += ['## 2. 여는 쪽 다섯', '', '모두 초안이다(`상세-기획-1.md` 2.3절). 1쪽의 글만 "토요일"을 뺐다.', '', '| 쪽 | 글 | 누구의 글 | 소라 |', '|---:|---|---|---|']
for number, (_, kind, text, say) in enumerate(pages, 1):
    out.append(f"| {number} | {text} | {'할머니의 쪽지' if kind == 'note' else '장면'} | {say} |")

guide = sorted(set(re.findall(r"'([^']*(?:렴|고맙다))'", load('game/src/core/guide.js'))))
out += ['', '## 3. 안내 한 줄', '', '모두 임시다. 화면 위 날짜 아래에 뜬다. 25자 안.', '', '| 글 |', '|---|'] + [f'| {line} |' for line in guide]

out += [
    '',
    '## 4. 그 밖의 한 줄들',
    '',
    '| 어디 | 글 | 어디서 |',
    '|---|---|---|',
    '| 볼 것 없는 해에 다이얼이 섰을 때의 메모 | 이 해는 적어 둔 게 없구나 | 초안(`상세-기획-2` 4절). 손글씨로 두기로 정했다 |',
    '| 소리나 음악을 껐을 때 소라 | 쉬잇(끝에 물결표가 붙는다) | 1권의 것 |',
    '| 수첩에서 가 보지 않은 칸을 펼쳤을 때 | 다녀오면 소라의 덧글과 이야기 카드가 생깁니다. | 임시 |',
    '| 닫는 단추들 | 여행 계속하기 / 수첩 덮기 / 닫기 / 수첩 펴기 | 임시 |',
    '',
    '## 5. 아직 없는 글',
    '',
    '- 첫 장의 쪽지(1969.7.21). 시안 셋이 `쪽지-1969-시안.md` 에 있다.',
    '- 엽서의 답장. 칸마다 한 장씩이고, 마음을 쓰는 글이라 사람이 고쳐야 한다.',
    '- 1988, 1989, 2061의 쪽지.',
    '',
]
io.open('docs/임시-글.md', 'w', encoding='utf-8', newline='\n').write('\n'.join(out))
print(f'{len(blocks)} squares, {len(pages)} opening pages, {len(guide)} guidance lines')
