// Taking a picture: a 3:2 frame is laid over the scene, moved up and down with a finger
// to take in more ground or more sky, and the shutter makes a postcard picture of what
// lies inside it: the computed sky and the ground picture, without Sora and without the
// words on the screen.
const WIDE = 900;             // the picture kept, in px: 900 x 600
const TALL = 600;
const MARGIN = 14;            // the frame's distance from the sides of the screen, in px
const BAR = 110;              // room under the frame for the hint and the two buttons, in px

const $ = (id) => document.getElementById(id);

// stage: the game's element. skyCanvas: the <canvas> the sky is drawn on. paintGround(ctx,
// frame, scale): draws the ground inside the frame (render/ground.js). onShot(image): the
// picture taken, as a JPEG data URL. onMode(on): photo mode was entered or left.
export function createPhoto({ stage, skyCanvas, paintGround, onShot, onMode }) {
  const frame = $('photoFrame');
  const bar = $('photoBar');
  let on = false;
  let centre = 0.5;           // the frame's middle, as a share of the stage's height

  function box() {
    const w = stage.clientWidth - MARGIN * 2;
    const h = (w * TALL) / WIDE;
    const least = h / 2 + 96;                         // clear of the buttons at the top
    // Clear of the dial, with the buttons between: they stand under the frame, never on
    // the picture (the user, 2026.10.7, of the button lying on it: "저 버튼은 왜 저기에").
    const most = Math.max(least, stage.clientHeight - h / 2 - 150 - BAR);
    const y = Math.max(least, Math.min(most, centre * stage.clientHeight)) - h / 2;
    return { x: MARGIN, y, w, h };
  }

  function place() {
    const { x, y, w, h } = box();
    frame.style.left = `${x}px`; frame.style.top = `${y}px`;
    frame.style.width = `${w}px`; frame.style.height = `${h}px`;
    bar.style.top = `${y + h + 10}px`;
  }

  function enter() {
    on = true;
    centre = 0.5;
    stage.classList.add('photo');
    place();
    onMode(true);
  }

  function leave() {
    on = false;
    stage.classList.remove('photo');
    onMode(false);
  }

  function shoot() {
    const view = box();
    const scale = WIDE / view.w;
    const canvas = document.createElement('canvas');
    canvas.width = WIDE; canvas.height = TALL;
    const c = canvas.getContext('2d');
    // The sky, straight from its canvas.
    const ratio = skyCanvas.width / skyCanvas.clientWidth;
    c.drawImage(skyCanvas, view.x * ratio, view.y * ratio, view.w * ratio, view.h * ratio, 0, 0, WIDE, TALL);
    paintGround(c, view, scale);
    let image = null;
    try { image = canvas.toDataURL('image/jpeg', 0.82); } catch { /* a picture that cannot be read out is not kept */ }
    // The flash.
    const flash = $('photoFlash');
    flash.classList.remove('on'); flash.getBoundingClientRect(); flash.classList.add('on');
    leave();
    if (image) onShot(image);
  }

  $('photoButton').addEventListener('click', () => { if (!on) enter(); });
  $('photoShutter').addEventListener('click', shoot);
  $('photoCancel').addEventListener('click', leave);

  return {
    isOn: () => on,
    leave,
    // dyShare: how far the finger moved, as a share of the stage's height (down positive).
    drag(dyShare) { centre = Math.max(0, Math.min(1, centre + dyShare)); place(); },
  };
}
