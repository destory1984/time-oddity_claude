"""Writes a WebP beside every PNG of the people and things of the walks (game/public/walks) and
of Sora (game/public/sora): the game asks for the WebP, the PNG stays as the original and is
left out of what is built (vite.config.js). Run from the repository root after pictures are cut:

    python tools/webp.py            (only those missing or older than their PNG)
    python tools/webp.py all        (every one again)

The people are kept at quality 90 with their edges whole (57.5MB of PNG came to 14.7MB); Sora is
pixel art and is kept without loss (17.7MB to 11.7MB), so that no pixel of her is smeared.
"""
import os
import sys

from PIL import Image

again = 'all' in sys.argv[1:]
made = kept = 0
for top, how in (('game/public/walks', dict(quality=90, alpha_quality=100, method=6)), ('game/public/sora', dict(lossless=True, method=6))):
    for root, _, files in os.walk(top):
        for f in files:
            if not f.endswith('.png'): continue
            src = os.path.join(root, f)
            dst = src[:-4] + '.webp'
            if not again and os.path.exists(dst) and os.path.getmtime(dst) >= os.path.getmtime(src):
                kept += 1
                continue
            Image.open(src).convert('RGBA').save(dst, 'WEBP', **how)
            made += 1
print(f'{made} written, {kept} already there')
