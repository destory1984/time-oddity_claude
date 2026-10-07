"""Prepares the ordered pictures of a place that is walked about (game/src/core/walks.js).

A scene's background comes with its sky painted flat #ff00ff: the sky is keyed out and
the picture written as WebP, as tools/key-sky.py does for the ground pictures.

    python tools/walk-art.py scene <in.png> <out.webp>

A sheet of people comes with several figures in a row on flat #ff00ff: the background is
keyed out, the figures are told apart as the pieces that hang together, each is
trimmed to its own box and written as <out dir>/<name>.png, in the order of the names
given (left to right). A figure the model ran into its neighbour comes out as one piece
and the count is then wrong: the tool says so and writes nothing.

    python tools/walk-art.py people <in.png> <out dir> <name> [<name> ...]
"""
import os
import sys

import numpy as np
from PIL import Image

LOW, HIGH = 50, 150     # how magenta a pixel is: below LOW it is kept, above HIGH it is gone
CELL = 4                # figures are told apart on a grid of cells this many px wide
TALL = 320              # the tallest figure of a sheet is written this many px high


def keyed(path):
    rgb = np.asarray(Image.open(path).convert('RGB')).astype(np.float32)
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    magenta = np.minimum(r, b) - g
    alpha = np.clip(1 - (magenta - LOW) / (HIGH - LOW), 0, 1)
    spill = np.clip(magenta, 0, None) * (alpha < 1)
    return np.dstack([r - spill, g, b - spill, alpha * 255]).clip(0, 255).astype(np.uint8)


def scene(src, dst):
    out = keyed(src)
    Image.fromarray(out, 'RGBA').save(dst, 'WEBP', quality=90, method=6)
    print(f'{dst}: {out.shape[1]}x{out.shape[0]}, sky {float((out[..., 3] < 128).mean()):.0%} of the picture')


def people(src, out_dir, names):
    out = keyed(src)
    solid = out[..., 3] > 128
    # Pieces that hang together, found on a coarse grid (figures stand close: a column of
    # the picture is seldom empty between two of them, but they do not touch).
    small = solid[: solid.shape[0] // CELL * CELL, : solid.shape[1] // CELL * CELL]
    small = small.reshape(small.shape[0] // CELL, CELL, small.shape[1] // CELL, CELL).any(axis=(1, 3))
    label = np.zeros(small.shape, np.int32)
    groups = []
    for r, c in zip(*np.nonzero(small)):
        if label[r, c]:
            continue
        number = len(groups) + 1
        label[r, c] = number
        stack, cells = [(r, c)], []
        while stack:
            y, x = stack.pop()
            cells.append((y, x))
            for yy in (y - 1, y, y + 1):
                for xx in (x - 1, x, x + 1):
                    if 0 <= yy < small.shape[0] and 0 <= xx < small.shape[1] and small[yy, xx] and not label[yy, xx]:
                        label[yy, xx] = number
                        stack.append((yy, xx))
        groups.append(cells)
    largest = max(len(g) for g in groups)
    figures = [i for i, g in enumerate(groups) if len(g) >= largest * 0.12]
    if len(figures) != len(names):
        print(f'{src}: {len(figures)} figures found, {len(names)} names given')
        return 1
    middle = {i: np.mean(groups[i], axis=0) for i in range(len(groups))}
    # A speck beside a figure (a tear, a sparkle) goes with the figure nearest it.
    owner = {i: i for i in figures}
    for i in range(len(groups)):
        if i not in owner:
            owner[i] = min(figures, key=lambda f: np.hypot(*(middle[i] - middle[f])))
    figures.sort(key=lambda f: middle[f][1])
    full = np.kron(label, np.ones((CELL, CELL), np.int32))
    boxes = []
    for f in figures:
        mine = np.isin(full, [i + 1 for i, o in owner.items() if o == f]) & solid[: full.shape[0], : full.shape[1]]
        rows = np.where(mine.any(axis=1))[0]
        cols = np.where(mine.any(axis=0))[0]
        boxes.append((mine, int(cols[0]), int(rows[0]), int(cols[-1]) + 1, int(rows[-1]) + 1))
    tallest = max(bottom - top for _, _, top, _, bottom in boxes)
    scale = TALL / tallest
    os.makedirs(out_dir, exist_ok=True)
    for name, (mine, left, top, right, bottom) in zip(names, boxes):
        cut = out[: full.shape[0], : full.shape[1]].copy()
        cut[..., 3] = np.where(mine, cut[..., 3], 0)
        figure = Image.fromarray(cut[top:bottom, left:right], 'RGBA')
        size = (max(1, round(figure.width * scale)), max(1, round(figure.height * scale)))
        figure.resize(size, Image.NEAREST).save(os.path.join(out_dir, f'{name}.png'))
        print(f'{name}: {size[0]}x{size[1]} (share of the tallest: {(bottom - top) / tallest:.2f})')
    return 0


if __name__ == '__main__':
    if sys.argv[1] == 'scene':
        scene(sys.argv[2], sys.argv[3])
    else:
        sys.exit(people(sys.argv[2], sys.argv[3], sys.argv[4:]))
