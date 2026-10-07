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

  // Draws the sun at the origin of ctx. With the moon before it (sun.cover > 0) the moon's
  // disc is cut out of the sun and its glare, the glare shrinks with what is left of the
  // sun, and once the sun is all but gone the corona comes out around the black moon.
  // The discs are drawn 9 times their size, and so is the way between their middles, so
  // the bite is the shape it was.
  function drawSun(ctx, sun) {
    const r = DISC / 2;
    const left = 1 - sun.cover;
    const mx = sun.moonX * r;
    const my = -sun.moonY * r;
    const mr = sun.moonSize * r;
    const corona = clamp((sun.cover - 0.97) / 0.03, 0, 1);
    if (corona > 0) {
      const glow = ctx.createRadialGradient(mx, my, mr * 0.9, mx, my, mr * 3.6);
      glow.addColorStop(0, `rgba(255,252,240,${0.95 * corona})`);
      glow.addColorStop(0.12, `rgba(240,240,255,${0.5 * corona})`);
      glow.addColorStop(0.45, `rgba(200,210,255,${0.14 * corona})`);
      glow.addColorStop(1, 'rgba(200,210,255,0)');
      ctx.fillStyle = glow;
      // Wider than it is tall, as the corona lies along the sun's equator.
      ctx.save(); ctx.translate(mx, my); ctx.scale(1.25, 0.9); ctx.translate(-mx, -my);
      ctx.beginPath(); ctx.arc(mx, my, mr * 3.6, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
    if (left > 0) {
      ctx.save();
      if (sun.cover > 0) {
        // Everything but the moon's disc.
        ctx.beginPath(); ctx.rect(-200, -200, 400, 400); ctx.arc(mx, my, mr, 0, Math.PI * 2);
        ctx.clip('evenodd');
      }
      ctx.shadowColor = `rgba(255,240,190,${0.9 * Math.sqrt(left)})`; ctx.shadowBlur = 6 + 24 * Math.sqrt(left);
      ctx.fillStyle = '#fff6d8'; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
    if (sun.cover > 0) {
      // The moon itself: nothing but sky until the light fails, then black.
      ctx.fillStyle = `rgba(4,3,22,${clamp((sun.cover - 0.8) / 0.2, 0, 1)})`;
      ctx.beginPath(); ctx.arc(mx, my, mr - 0.3, 0, Math.PI * 2); ctx.fill();
    }
  }

  // view: { facingAz, pitch (0 to 1), dim (0 to 1: moon and planets faded while the dial
  // rolls), labels (0 to 1: opacity of the names) }
  // camera: a free eye ({ yaw, pitch, fovY }, core/project.js) in place of facingAz and pitch.
  function draw(sky, { facingAz = 0, pitch = 0, dim = 0, labels = 0, camera = null }) {
    const view = { facingAz, pitch, w, h, camera };
    const light = skyLight(sky.sun.alt, sky.sun.cover);
    const horizonY = project(0, camera ? camera.yaw : facingAz, view).y;
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

    // Before the sun the moon is drawn with it, below.
    const moonAt = sky.sun.cover > 0 ? null : seen(sky.moon.alt, sky.moon.az);
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
      c.translate(sunAt.x, sunAt.y);
      drawSun(c, sky.sun);
      c.restore();
      if (sky.sun.cover > 0.5) label('해를 가린 달', sunAt.x + sky.sun.moonX * DISC / 2, sunAt.y - sky.sun.moonY * DISC / 2, labels);
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
