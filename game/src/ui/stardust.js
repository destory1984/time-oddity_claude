// Sora breaks into twinkling star dust that drifts up, or gathers out of it: volume 1's
// (oddity/src/ui/vanish.js `dust`; the user, 2026.10.20: "소라가 내려앉기 -> 떠나기 하는
// 효과는 우주한량에게 별빛 효과를 물어봐서, 그걸로 바꾸자", then the same for going down
// from the Earth and between scenes). A speck for every two pixels of her picture, in its
// colour, each with its own drift, twinkle and moment to leave (from the top of her down),
// drawn on a canvas round her. The film runs 1.9 s there; here it is played in `ms`, and
// backwards to gather.

const DUST_S = 1.9;
const PAD_X = 70;
const PAD_TOP = 230;

// img: her picture element. parent: where the canvas goes, positioned as she is in it
// (left, top, w, h in its css px; fixed: the canvas is fixed to the screen instead).
// flip: her picture is shown turned about. going: breaking up (true) or gathering (false).
export function starDust(img, { parent, left, top, w, h, fixed = false, flip = false, going, ms }) {
  w = Math.max(1, Math.round(w) || 1);
  h = Math.max(1, Math.round(h) || 1);
  left = left || 0;
  top = top || 0;
  const box = document.createElement('canvas');
  box.className = 'starDust';
  const ratio = Math.min(2, window.devicePixelRatio || 1);
  const bw = w + PAD_X * 2;
  const bh = h + PAD_TOP + 20;
  box.width = Math.round(bw * ratio);
  box.height = Math.round(bh * ratio);
  box.style.cssText = `position:${fixed ? 'fixed' : 'absolute'};left:${left - PAD_X}px;top:${top - PAD_TOP}px;width:${bw}px;height:${bh}px;pointer-events:none;z-index:21`;
  const pen = box.getContext('2d');
  pen.setTransform(ratio, 0, 0, ratio, 0, 0);
  const copy = document.createElement('canvas');
  copy.width = w;
  copy.height = h;
  const cpen = copy.getContext('2d', { willReadFrequently: true });
  cpen.imageSmoothingEnabled = false;
  if (flip) { cpen.translate(w, 0); cpen.scale(-1, 1); }
  try { cpen.drawImage(img, 0, 0, w, h); } catch { /* not there yet: no specks */ }
  const { data } = cpen.getImageData(0, 0, w, h);
  let seed = 7;
  const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const step = w * h > 40000 ? 3 : 2;
  const specks = [];
  for (let py = 0; py < h; py += step) {
    for (let px = 0; px < w; px += step) {
      const k = (py * w + px) * 4;
      if (data[k + 3] < 60) continue;
      specks.push({
        x: PAD_X + px, y: PAD_TOP + py, color: `rgb(${data[k]},${data[k + 1]},${data[k + 2]})`,
        vx: (random() - 0.5) * 50, vy: -(25 + random() * 90),
        wait: (py / h) * 0.55 + random() * 0.15, life: 0.9 + random() * 0.6,
        phase: random() * 6.28, star: random() < 0.04,
      });
    }
  }
  parent.append(box);
  const began = performance.now();
  return new Promise((resolve) => {
    const draw = (now) => {
      const u = Math.min(1, (now - began) / ms);
      const film = (going ? u : 1 - u) * DUST_S;
      pen.clearRect(0, 0, bw, bh);
      for (const p of specks) {
        const a = Math.max(0, film - p.wait);
        const flown = Math.min(1, a / p.life);
        const x = p.x + p.vx * a + Math.sin(a * 3 + p.phase) * 6 * flown;
        const y = p.y + p.vy * a * (0.6 + 0.4 * flown);
        const twinkle = 0.55 + 0.45 * Math.sin(now / 90 + p.phase);
        pen.globalAlpha = a <= 0 ? 1 : Math.max(0, 1 - flown) * twinkle;
        pen.fillStyle = a <= 0 ? p.color : flown > 0.25 ? '#fff6dd' : p.color;
        const size = a <= 0 ? step : 2 - flown;
        pen.fillRect(x, y, size, size);
        if (p.star && a > 0 && flown < 0.9) {
          pen.globalAlpha = (1 - flown) * twinkle;
          pen.fillStyle = '#ffffff';
          const arm = 3 + 3 * twinkle;
          pen.fillRect(x - arm, y, arm * 2 + 1, 1);
          pen.fillRect(x, y - arm, 1, arm * 2 + 1);
        }
      }
      pen.globalAlpha = 1;
      if (u < 1) { requestAnimationFrame(draw); return; }
      box.remove();
      resolve();
    };
    requestAnimationFrame(draw);
  });
}

// Once the picture has come (on the first frame of a place it may still be on its way); a
// picture that cannot come, or is slow, is not waited for longer than a second (the dust then
// goes without specks).
export function whenDrawn(img) {
  if (img.complete && img.naturalWidth > 0) return Promise.resolve();
  return new Promise((resolve) => {
    img.addEventListener('load', resolve, { once: true });
    img.addEventListener('error', resolve, { once: true });
    setTimeout(resolve, 1000);
  });
}
