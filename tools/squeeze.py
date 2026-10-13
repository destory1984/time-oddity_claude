"""Makes the game's large pictures smaller (the user, 2026.10.13, having seen them side by side at
assets/codex/squeeze/compare.html: "WebP 78이랑 후경 절반으로 하자"). Every WebP under
game/public/walks that is 1000 px wide or more (a scene's picture or its near layer, its far
layer, a thing shown, a photograph of today) is written again at quality 78; a far layer is also
halved each way (it is drawn by its aspect, so it stands where it stood). The people, what
stands nearest the eye and Sora are not touched (tools/webp.py).

A thing shown is baked from its original PNG (assets/codex/<dir>/<name>.png) when that is at hand
and is the same picture; everything else is baked again from the picture the game has.

Run from the repository root after new pictures are put in: python tools/squeeze.py
It may be run again: tools/squeeze.json keeps what it wrote, and a picture it wrote is passed by.
What a picture was before is kept at assets/codex/squeeze/before/ (not in the repository)."""
import hashlib, io, json, os, shutil, sys
import numpy as np
from PIL import Image

ROOT = 'game/public/walks/'
BEFORE = 'assets/codex/squeeze/before/'
DONE = 'tools/squeeze.json'
QUALITY = 78
WIDE = 1000          # a picture this wide or wider is one of the large ones
FAR_TALL = 1000      # a far layer this tall or taller has not been halved yet
SAME = 6.0           # an original differs from the game's picture by less than this (mean, of 255) if it is the same picture

sha = lambda data: hashlib.sha1(data).hexdigest()


def main():
    done = json.load(open(DONE, encoding='utf-8')) if os.path.exists(DONE) else {}
    was = now = count = from_png = 0
    for folder, _, files in sorted(os.walk(ROOT)):
        for name in sorted(files):
            if not name.endswith('.webp'): continue
            path = (folder + '/' + name).replace('\\', '/').replace('//', '/')
            key = path[len(ROOT):]
            with open(path, 'rb') as f: data = f.read()
            if done.get(key) == sha(data): continue
            picture = Image.open(io.BytesIO(data))
            if picture.width < WIDE: continue
            picture = picture.convert('RGBA' if picture.mode == 'RGBA' else 'RGB')
            if name.startswith('show-'):
                original = f'assets/codex/{key[:-5]}.png'
                if os.path.exists(original):
                    drawn = Image.open(original).convert('RGB').resize(picture.size, Image.LANCZOS)
                    if picture.mode == 'RGB' and np.abs(np.asarray(drawn, np.int16) - np.asarray(picture, np.int16)).mean() < SAME:
                        picture = drawn; from_png += 1
            if name.endswith('-far.webp') and picture.height >= FAR_TALL:
                picture = picture.resize((picture.width // 2, picture.height // 2), Image.LANCZOS)
            out = io.BytesIO()
            picture.save(out, format='WEBP', quality=QUALITY, method=6, **({'alpha_quality': 100} if picture.mode == 'RGBA' else {}))
            os.makedirs(os.path.dirname(BEFORE + key), exist_ok=True)
            shutil.copyfile(path, BEFORE + key)
            with open(path, 'wb') as f: f.write(out.getvalue())
            done[key] = sha(out.getvalue())
            was += len(data); now += out.tell(); count += 1
    with open(DONE, 'w', encoding='utf-8', newline='\n') as f: json.dump(done, f, indent=0, sort_keys=True)
    print(f'{count} pictures ({from_png} from their PNG): {was / 1e6:.1f}MB -> {now / 1e6:.1f}MB')


if __name__ == '__main__':
    sys.exit(main())
