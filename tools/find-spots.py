"""Finds where a square's two ground pictures differ: the places to be found in the
"what has changed" game. For every scene in game/src/art/scenes.js the picture of the day
and the picture of today are laid over each other, and up to four of the largest places
that differ, well apart and inside what a phone shows, are written to
game/src/data/spots.json as { id: [{ x, y, r }] }: x and y are the middle as shares of the
picture's width and height, r the radius as a share of its width.

    python tools/find-spots.py [sheet.jpg]

With a file name it also draws every square's today picture with its rings, to be looked
over: the tool cannot tell a thing that changed from a colour that drifted.
"""
import io
import json
import re
import sys
from collections import deque

import numpy as np
from PIL import Image, ImageDraw

CELL = 8                 # the pictures are compared in cells of this many px
THRESHOLD = 34           # a cell differs when its colours are this far apart (0 to 255)
MOST = 4                 # places kept for a square
APART = 0.085            # their middles are at least this far apart, as a share of the width
SMALLEST = 4             # a place has at least this many cells
R_MIN, R_MAX = 0.028, 0.075
# What a 375 x 812 phone shows of a picture (render/ground.js): the picture is `height`
# of the screen tall and 3:2; its horizon lies at 60% of the screen. The top 150 px hold
# the date and the bottom 190 the dial.
SCREEN_W, SCREEN_H, HORIZON, PICTURE_HEIGHT = 375, 812, 0.60, 0.78
TOP_PX, BOTTOM_PX = 150, 812 - 190


def scenes():
    text = io.open('game/src/art/scenes.js', encoding='utf-8').read()
    for m in re.finditer(r"^  (\w+): scene\('(\w+)', ([\d.]+), '#\w+', [\d.]+, '#\w+'(?:, \{([^}]*)\})?\)", text, re.M):
        frame = dict(re.findall(r'(\w+): ([\d.]+)', m.group(4) or ''))
        yield m.group(2), float(m.group(3)), float(frame.get('height', PICTURE_HEIGHT)), float(frame.get('centre', 0.5))


def load(path):
    rgba = np.asarray(Image.open(path).convert('RGBA')).astype(np.float32)
    # Where a picture is clear (its sky) it counts as one flat colour far from any paint.
    alpha = rgba[..., 3:4] / 255
    return rgba[..., :3] * alpha + np.array([255, 0, 255], np.float32) * (1 - alpha)


def window(horizon, height, centre):
    """The part of the picture a phone shows, as shares: x0, x1, y0, y1."""
    tall = height * SCREEN_H
    wide = tall * 1.5
    half = SCREEN_W / wide / 2
    top = (HORIZON - horizon * height) * SCREEN_H
    return centre - half + 0.05, centre + half - 0.05, max(0, (TOP_PX - top) / tall), min(1, (BOTTOM_PX - top) / tall)


def places(then, now, box):
    h, w = then.shape[:2]
    diff = np.abs(then - now).max(axis=2)
    cells = diff[: h // CELL * CELL, : w // CELL * CELL].reshape(h // CELL, CELL, w // CELL, CELL).mean(axis=(1, 3))
    rows, cols = cells.shape
    x0, x1, y0, y1 = box
    on = cells > THRESHOLD
    on[:, : int(x0 * cols)] = False; on[:, int(x1 * cols) + 1:] = False
    on[: int(y0 * rows)] = False; on[int(y1 * rows) + 1:] = False
    seen = np.zeros_like(on)
    found = []
    for r in range(rows):
        for c in range(cols):
            if not on[r, c] or seen[r, c]:
                continue
            queue, group = deque([(r, c)]), []
            seen[r, c] = True
            while queue:
                y, x = queue.popleft()
                group.append((y, x))
                for dy in (-1, 0, 1):
                    for dx in (-1, 0, 1):
                        yy, xx = y + dy, x + dx
                        if 0 <= yy < rows and 0 <= xx < cols and on[yy, xx] and not seen[yy, xx]:
                            seen[yy, xx] = True
                            queue.append((yy, xx))
            if len(group) < SMALLEST:
                continue
            ys = np.array([g[0] for g in group]); xs = np.array([g[1] for g in group])
            weight = float(sum(cells[g] for g in group))
            spread = max(xs.max() - xs.min() + 1, ys.max() - ys.min() + 1) * CELL / w / 2
            found.append({
                'x': round(float((xs.mean() + 0.5) * CELL / w), 4), 'y': round(float((ys.mean() + 0.5) * CELL / h), 4),
                'r': round(float(min(R_MAX, max(R_MIN, spread))), 4), 'weight': weight,
            })
    found.sort(key=lambda p: -p['weight'])
    kept = []
    for p in found:
        if all(np.hypot(p['x'] - q['x'], (p['y'] - q['y']) / 1.5) >= APART for q in kept):
            kept.append(p)
        if len(kept) == MOST:
            break
    return [{k: p[k] for k in ('x', 'y', 'r')} for p in kept]


def main(sheet_path=None):
    spots, tiles = {}, []
    for scene_id, horizon, height, centre in scenes():
        then = load(f'game/public/scenes/{scene_id}-then.webp')
        now_path = f'game/public/scenes/{scene_id}-now.webp'
        box = window(horizon, height, centre)
        spots[scene_id] = places(then, load(now_path), box)
        print(f'{scene_id}: {len(spots[scene_id])}', ' '.join(f"({p['x']:.2f},{p['y']:.2f})" for p in spots[scene_id]))
        if sheet_path:
            both = []
            for path in (f'game/public/scenes/{scene_id}-then.webp', now_path):
                picture = Image.new('RGB', (1536, 1024), '#6fb0e6')
                picture.paste(Image.open(path).convert('RGBA'), (0, 0), Image.open(path).convert('RGBA'))
                draw = ImageDraw.Draw(picture)
                for p in spots[scene_id]:
                    cx, cy, rr = p['x'] * 1536, p['y'] * 1024, p['r'] * 1536
                    draw.ellipse((cx - rr, cy - rr, cx + rr, cy + rr), outline='#ff2020', width=6)
                x0, x1, y0, y1 = box
                both.append(picture.crop((int(x0 * 1536), int(y0 * 1024), int(x1 * 1536), int(y1 * 1024))).resize((220, 300)))
            tiles.append(both)
    io.open('game/src/data/spots.json', 'w', encoding='utf-8', newline='\n').write(json.dumps(spots, separators=(',', ':')) + '\n')
    if sheet_path:
        per = 10
        for n in range(0, len(tiles), per):
            part = tiles[n:n + per]
            sheet = Image.new('RGB', (220 * len(part), 600))
            for i, (a, b) in enumerate(part):
                sheet.paste(a, (i * 220, 0)); sheet.paste(b, (i * 220, 300))
            sheet.save(sheet_path.replace('.jpg', f'-{n // per + 1}.jpg'), quality=85)


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else None)
