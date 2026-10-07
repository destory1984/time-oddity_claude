// Draws the year dial: a large arc at the bottom of the screen with a tick for every
// year and a gold needle. The look is sample 3 of docs/ui-samples.html as tuned in
// docs/dial-proto.html.
import { PX_PER_YEAR } from '../core/dial.js';
import { formatYear, yearFromIndex } from '../core/when.js';

export function createDialView(canvas) {
  const c = canvas.getContext('2d');
  let w = 0;
  let h = 0;

  function resize() {
    const box = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    w = box.width; h = box.height;
    canvas.width = Math.round(w * ratio); canvas.height = Math.round(h * ratio);
    c.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function draw(dial) {
    c.clearRect(0, 0, w, h);
    const radius = w * 1.15;
    const cx = w / 2;
    const cy = h - 100 + radius;
    c.fillStyle = 'rgba(5,3,48,.78)';
    c.beginPath(); c.arc(cx, cy, radius, 0, Math.PI * 2); c.fill();
    c.strokeStyle = '#f6b951'; c.lineWidth = 2; c.stroke();

    c.font = '11px "Malgun Gothic", system-ui, sans-serif';
    c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillStyle = 'rgba(251,248,249,.9)';
    const reach = Math.ceil((radius * 0.7) / PX_PER_YEAR);
    const first = Math.max(dial.min, Math.round(dial.offset) - reach);
    const last = Math.min(dial.max, Math.round(dial.offset) + reach);
    for (let i = first; i <= last; i += 1) {
      const big = i % 10 === 0;
      c.save();
      c.translate(cx, cy);
      c.rotate(((i - dial.offset) * PX_PER_YEAR) / radius);
      c.fillRect(-(big ? 1 : 0.5), -radius + 2, big ? 2 : 1, big ? 18 : 9);
      if (big) c.fillText(formatYear(yearFromIndex(i)), 0, -radius + 34);
      c.restore();
    }
    c.fillStyle = '#f6b951';
    c.beginPath(); c.moveTo(cx - 8, h - 114); c.lineTo(cx + 8, h - 114); c.lineTo(cx, h - 98); c.fill();
  }

  return { resize, draw };
}
