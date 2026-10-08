"""Cuts a sheet of Sora (several of her in a row on flat #00ff00, as ordered for the three
verbs: docs/art-order-rome-verbs.md) into her pictures for game/public/sora/.

Her hair is lavender, so her sheets are ordered on green and not on the magenta of the
other sheets (tools/walk-art.py). The figures are told apart by the empty columns between
them and all made smaller by one and the same factor, so that she stays one size from
picture to picture.

A sheet of her standing: each figure is set in a frame 256 px high with her feet where
they are in idle-1.png (ui/walk.js shows such a frame as it shows her standing).
<tall> is how high the tallest figure comes out (she is 244 px in idle-1.png).

    python tools/sora-art.py stand <in.png> <tall> <name> [<name> ...]

A sheet of her walking: each figure is trimmed to its own box, the tallest <tall> px high
(her own walking frames are 320).

    python tools/sora-art.py walk <in.png> <tall> <name> [<name> ...]

A name of "-" leaves that figure out. Written to game/public/sora/<name>.png.
"""
import sys

import numpy as np
from PIL import Image

LOW, HIGH = 50, 150     # how green a pixel is: below LOW it is kept, above HIGH it is gone
FRAME_TALL, FOOT_ROW = 256, 250
OUT = 'game/public/sora/'


def keyed(path):
    rgb = np.asarray(Image.open(path).convert('RGB')).astype(np.float32)
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    green = g - np.maximum(r, b)
    alpha = np.clip(1 - (green - LOW) / (HIGH - LOW), 0, 1)
    spill = np.clip(green, 0, None) * (alpha < 1)
    return np.dstack([r, g - spill, b, alpha * 255]).clip(0, 255).astype(np.uint8)


def figures(out, n):
    """The n widest runs of columns that have something in them, left to right, each trimmed to its box."""
    filled = (out[..., 3] > 128).sum(axis=0) > 1
    runs, start = [], None
    for x, on in enumerate(list(filled) + [False]):
        if on and start is None: start = x
        elif not on and start is not None: runs.append((start, x)); start = None
    runs = sorted(sorted(runs, key=lambda run: run[0] - run[1])[:n])
    if len(runs) != n: sys.exit(f'{len(runs)} figures found, {n} names given')
    cut = []
    for x0, x1 in runs:
        rows = np.where((out[:, x0:x1, 3] > 128).any(axis=1))[0]
        cut.append(Image.fromarray(out[rows[0]:rows[-1] + 1, x0:x1], 'RGBA'))
    return cut


def hard(img):
    """Pixels are there or not: no soft edge is left to show as a rim."""
    a = np.asarray(img).copy()
    a[..., 3] = np.where(a[..., 3] > 128, 255, 0)
    return Image.fromarray(a, 'RGBA')


def run(kind, src, tall, names):
    cut = figures(keyed(src), len(names))
    factor = tall / max(img.height for img in cut)
    for img, name in zip(cut, names):
        if name == '-': continue
        small = hard(img.resize((max(1, round(img.width * factor)), max(1, round(img.height * factor))), Image.NEAREST))
        if kind == 'stand':
            wide = max(192, small.width + (small.width % 2))
            frame = Image.new('RGBA', (wide, FRAME_TALL), (0, 0, 0, 0))
            frame.alpha_composite(small, ((wide - small.width) // 2, FOOT_ROW - small.height))
            small = frame
        small.save(f'{OUT}{name}.png')
        print(f'{OUT}{name}.png: {small.width}x{small.height}')


if __name__ == '__main__':
    if len(sys.argv) < 5 or sys.argv[1] not in ('stand', 'walk'): sys.exit(__doc__)
    run(sys.argv[1], sys.argv[2], int(sys.argv[3]), sys.argv[4:])
