// Draws the computed sky (core/sky.js) on a 2D canvas that lies behind the ground art.
import { frameZoom } from '../ui/shell.js';
import { skyLight } from '../core/sky.js';
import { project } from '../core/project.js';

const DISC = 28;   // sun and moon, 9 times their real size so that the moon's shape shows

// Sky colours from the top of the screen down to the horizon, for night, dusk and day.
const STOPS = [0, 0.5, 0.86, 1];
const NIGHT = ['#050330', '#0a0a4a', '#131760', '#1c2070'];
const DUSK = ['#070640', '#1a2894', '#7a5fa8', '#f2b88a'];
const DAY = ['#3f86d0', '#6fb0e6', '#b4d9f2', '#e2f1fa'];

const hex = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const mix = (a, b, t) => { const p = hex(a); const q = hex(b); return `rgb(${p.map((v, i) => Math.round(v + (q[i] - v) * t)).join(',')})`; };
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

export function createSkyCanvas(canvas) {
  const c = canvas.getContext('2d');
  let w = 0;
  let h = 0;

  function resize() {
    const box = canvas.getBoundingClientRect();
    const ratio = (window.devicePixelRatio || 1) * frameZoom();
    w = box.width; h = box.height;
    canvas.width = Math.round(w * ratio); canvas.height = Math.round(h * ratio);
    c.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function backdrop(day, horizonY) {
    const g = c.createLinearGradient(0, 0, 0, Math.max(1, horizonY));
    STOPS.forEach((stop, i) => {
      g.addColorStop(stop, day < 0.5 ? mix(NIGHT[i], DUSK[i], day * 2) : mix(DUSK[i], DAY[i], day * 2 - 1));
    });
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);
  }

  function label(text, x, y, alpha) {
    if (alpha <= 0) return;
    c.globalAlpha = alpha * 0.85;
    c.fillStyle = '#fbf8f9';
    c.font = '11px "Pretendard Variable", Pretendard, "Malgun Gothic", sans-serif';
    c.textBaseline = 'middle';
    c.fillText(text, x + 12, y - 12);
    c.globalAlpha = 1;
  }

  // Draws the moon at the origin of ctx with its lit side toward the sun: a half disc on
  // the sunward side closed by the terminator, which is half an ellipse.
  function drawMoon(ctx, moon, day) {
    const r = DISC / 2;
    const k = 1 - 2 * moon.lit;   // 1 new, 0 half, -1 full
    ctx.save();
    ctx.rotate(-moon.towardSun);
    // The unlit part is a faint disc by night and nothing at all by day.
    ctx.fillStyle = `rgba(46,52,120,${(1 - day) * 0.9})`;
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
    if (moon.eclipse < 0.5) { ctx.shadowColor = 'rgba(255,255,255,.5)'; ctx.shadowBlur = 12 * moon.lit * (1 - day); }
    ctx.fillStyle = mix('#f4f1ff', '#b0432a', moon.eclipse);
    ctx.globalAlpha *= 0.6 + 0.4 * (1 - day);
    ctx.beginPath();
    ctx.arc(0, 0, r, -Math.PI / 2, Math.PI / 2);
    ctx.ellipse(0, 0, Math.abs(k) * r, r, 0, Math.PI / 2, -Math.PI / 2, k > 0);
    ctx.fill();
    ctx.restore();
  }

  // view: { facingAz, pitch (0 to 1), dim (0 to 1: moon and planets faded while the dial
  // rolls), labels (0 to 1: opacity of the names) }
  function draw(sky, { facingAz, pitch, dim = 0, labels = 0 }) {
    const view = { facingAz, pitch, w, h };
    const light = skyLight(sky.sun.alt);
    const horizonY = project(0, facingAz, view).y;
    c.globalCompositeOperation = 'source-over';
    c.globalAlpha = 1;
    backdrop(light.day, horizonY);
    const fade = 1 - 0.7 * dim;
    const seen = (alt, az, margin = 20) => {
      if (alt < 0) return null;
      const p = project(alt, az, view);
      return p.front && p.x > -margin && p.x < w + margin && p.y > -margin && p.y < horizonY + 2 ? p : null;
    };

    if (light.stars > 0) {
      c.fillStyle = '#fbf8f9';
      for (const star of sky.stars) {
        const p = seen(star.alt, star.az, 2);
        if (!p) continue;
        const size = clamp(2.4 - 0.4 * star.mag, 0.6, 2.4);
        // Stars dim toward the horizon, as they do.
        c.globalAlpha = light.stars * 0.9 * clamp(star.alt / 8, 0.25, 1);
        c.beginPath(); c.arc(p.x, p.y, size / 2 + 0.3, 0, Math.PI * 2); c.fill();
      }
      c.globalAlpha = 1;
    }

    const moonAt = seen(sky.moon.alt, sky.moon.az);
    if (moonAt) {
      c.save();
      c.translate(moonAt.x, moonAt.y);
      c.globalAlpha = fade;
      drawMoon(c, sky.moon, light.day);
      c.restore();
      if (sky.moon.lit > 0.03 || light.day < 0.5) label('달', moonAt.x, moonAt.y, labels * fade);
    }

    const sunAt = seen(sky.sun.alt, sky.sun.az, 40);
    if (sunAt) {
      c.save();
      c.shadowColor = 'rgba(255,240,190,.9)'; c.shadowBlur = 30;
      c.fillStyle = '#fff6d8'; c.beginPath(); c.arc(sunAt.x, sunAt.y, DISC / 2, 0, Math.PI * 2); c.fill();
      c.restore();
    }

    if (light.stars > 0) {
      for (const planet of sky.planets) {
        const p = seen(planet.alt, planet.az);
        if (!p) continue;
        const size = clamp(5 - 0.8 * (planet.mag + 2), 2, 5);
        c.globalAlpha = light.stars * fade;
        c.fillStyle = '#fff3d6';
        c.beginPath(); c.arc(p.x, p.y, size / 2 + 0.5, 0, Math.PI * 2); c.fill();
        c.globalAlpha = 1;
        label(planet.name, p.x, p.y, labels * light.stars * fade);
      }
    }
  }

  return { resize, draw };
}
