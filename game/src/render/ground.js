// The ground picture of a square: one picture of the day and one of today, in the same
// composition, laid over the sky canvas. The pictures are wide (3:2) with a transparent
// sky; each is placed so that its horizon lies on the sky's horizon, at 60% of the height.
import { SCENES } from '../art/scenes.js';

const HORIZON_ON_SCREEN = 0.60;
// A picture's height as a share of the screen's. At 0.78 a phone shows the middle 38%
// of the picture's width; below the picture the ground is carried on in its foot colour.
const PICTURE_HEIGHT = 0.78;
const RISE_FROM = 0.45;       // share of the height the picture comes up from on arriving

const smooth = (t) => t * t * (3 - 2 * t);

function makeLayer(el) {
  const layer = document.createElement('div');
  const img = document.createElement('img');
  const foot = document.createElement('div');
  layer.className = 'layer';
  foot.className = 'foot';
  img.alt = ''; img.draggable = false;
  layer.append(foot, img);
  el.append(layer);
  return {
    layer, img, foot,
    // height: the picture's height as a share of the screen's, when a scene needs more of
    // its width on a phone than the usual. centre: the share of the picture's width that
    // comes to the middle of the screen (0.5 unless what matters is off to one side).
    show({ src, horizon, foot: colour }, { height = PICTURE_HEIGHT, centre = 0.5 } = {}) {
      const top = HORIZON_ON_SCREEN - horizon * height;
      img.src = src;
      img.style.height = `${height * 100}%`;
      img.style.transform = `translateX(${-centre * 100}%)`;
      img.style.top = `${top * 100}%`;
      // The foot starts a little inside the picture so that no seam shows, and runs far
      // enough below the screen to stay under it when the ground sinks or rises.
      foot.style.top = `${(top + height) * 100 - 1}%`;
      foot.style.background = colour;
    },
  };
}

export function createGround(el) {
  const then = makeLayer(el);
  const today = makeLayer(el);
  let scene = null;

  function show(square) {
    scene = SCENES[square.id];
    then.show(scene.then, scene.frame);
    today.show(scene.today, scene.frame);
  }

  // rise 0 to 1: how far the picture has come up. blend 0 to 1: the day to today.
  // silhouette 0 to 1: today's picture pressed to one dark colour (a year with no
  // picture). dropPx: how far the sky's horizon has sunk below its level place as the
  // head is raised, so that ground and sky stay joined. day 0 to 1: how light the sky is.
  function set({ rise = 1, blend = 0, silhouette = 0, dropPx = 0, day = 1 }) {
    if (!scene) return;
    dayNow = day;
    const h = el.clientHeight;
    const drop = dropPx + (1 - smooth(rise)) * RISE_FROM * h;
    const move = `translateY(${drop.toFixed(1)}px)`;
    // The pictures are drawn in even noon light; the hour is put on here.
    const lit = `brightness(${(0.34 + 0.66 * day).toFixed(3)}) saturate(${(0.55 + 0.45 * day).toFixed(3)})`;
    const dark = silhouette > 0 ? ` brightness(${(1 - 0.8 * silhouette).toFixed(3)}) saturate(${(1 - silhouette).toFixed(3)})` : '';
    const arrived = Math.min(1, rise * 3);
    then.layer.style.transform = move;
    today.layer.style.transform = move;
    then.layer.style.filter = lit;
    today.layer.style.filter = lit + dark;
    // Today comes in over the first half and the day goes out over the second, so the
    // ground they share stays solid throughout and the sky never shows through it.
    then.layer.style.opacity = (Math.min(1, 2 - 2 * blend) * (1 - silhouette) * arrived).toFixed(3);
    today.layer.style.opacity = (Math.max(Math.min(1, 2 * blend), silhouette) * arrived).toFixed(3);
  }

  // Paints the ground as it now stands into a picture: the part inside `frame` (in the
  // stage's own px), `scale` times as large. The darkness of the hour is laid on as a
  // navy veil over the ground only, since a canvas cannot be asked for the CSS filter
  // everywhere.
  let dayNow = 1;
  function paint(ctx, frame, scale) {
    const stageBox = el.getBoundingClientRect();
    const sheet = document.createElement('canvas');
    sheet.width = ctx.canvas.width; sheet.height = ctx.canvas.height;
    const g = sheet.getContext('2d');
    for (const one of [then, today]) {
      const opacity = Number(one.layer.style.opacity || 0);
      if (opacity <= 0) continue;
      g.globalAlpha = opacity;
      const place = (node) => { const r = node.getBoundingClientRect(); return [(r.left - stageBox.left - frame.x) * scale, (r.top - stageBox.top - frame.y) * scale, r.width * scale, r.height * scale]; };
      g.fillStyle = one.foot.style.background;
      g.fillRect(...place(one.foot));
      if (one.img.complete && one.img.naturalWidth > 0) g.drawImage(one.img, ...place(one.img));
    }
    g.globalAlpha = (1 - dayNow) * 0.62;
    g.globalCompositeOperation = 'source-atop';
    g.fillStyle = '#060a2c';
    g.fillRect(0, 0, sheet.width, sheet.height);
    ctx.drawImage(sheet, 0, 0);
  }

  return { show, set, paint };
}
