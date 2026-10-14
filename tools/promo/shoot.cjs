// Records the game for the promo video (as volume 1's build/promo/shoot.cjs): a phone view
// (405 x 720 drawn at 8/3 = 1080 x 1920) taken frame by frame from Chromium's screencast,
// headless. Each shot is a short script of moves (shots.cjs); the frames go to
// assets/promo/<lang>/<shot>/ with their times (times.json, seconds since 1970), and the
// game's own sound beside them (audio.webm, its start in audio.json): the effects only, with
// the music off, except in the shot named 'music', which is the music alone.
// tools/promo/cut.py makes them into a film.
// Run (the dev server up): node tools/promo/shoot.cjs <lang> <shot> [<shot> ...]
const fs = require('fs');
const path = require('path');
const { chromium, executablePath } = require('./env.cjs');
const SHOTS = require('./shots.cjs');

const URL = process.env.PROMO_URL || 'http://localhost:5321/';
const ROOT = path.join(__dirname, '..', '..', 'assets', 'promo');

async function shoot(browser, lang, name) {
  const ctx = await browser.newContext({ viewport: { width: 405, height: 720 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  await p.addInitScript(([l, music, hide]) => {
    try {
      localStorage.setItem('timeoddity.lang.v1', l);
      localStorage.setItem('timeoddity.opened.v1', '1');
      localStorage.setItem('timeoddity.music.v1', music ? '1' : '0');
      localStorage.setItem('timeoddity.muted.v1', music ? '1' : '0');
    } catch {}
    // The test buttons along the top are not for the film, nor grandmother's slip of errands
    // (the caption stands there), nor the picture held up at the top when she is shown something.
    document.addEventListener('DOMContentLoaded', () => {
      const s = document.createElement('style');
      s.textContent = `${hide}{display:none!important}`;
      document.head.append(s);
    });
    // The game's clock, held by the recorder while it records (window.__step): each frame of
    // the film is the game moved on by exactly 1/30 s and drawn. Taken from the screencast
    // instead, a headless page drawn at 1080 x 1920 keeps up with a few frames a second only,
    // and the film judders: the same picture three times, then a jump (the user, 2026.10.15:
    // "화면이 앞뒤로 너무 떨리는 일이 많고").
    {
      const real = performance.now.bind(performance);
      const raf = window.requestAnimationFrame.bind(window);
      let held = false, at = 0, queue = [];
      performance.now = () => (held ? at : real());
      window.requestAnimationFrame = (cb) => {
        if (held) { queue.push(cb); return queue.length; }
        return raf((t) => cb(held ? at : t));
      };
      window.__hold = () => { at = real(); held = true; };
      window.__step = (ms) => { at += ms; const due = queue; queue = []; for (const cb of due) cb(at); };
    }
    // What goes to the speakers goes to a recorder as well.
    const connect = AudioNode.prototype.connect;
    AudioNode.prototype.connect = function (to, ...rest) {
      if (to instanceof AudioDestinationNode) {
        if (!window.__tap) window.__tap = this.context.createMediaStreamDestination();
        connect.call(this, window.__tap);
      }
      return connect.call(this, to, ...rest);
    };
    window.__tapStart = () => {
      if (!window.__tap) return null;
      window.__chunks = [];
      window.__rec = new MediaRecorder(window.__tap.stream, { mimeType: 'audio/webm;codecs=opus', audioBitsPerSecond: 192000 });
      window.__rec.ondataavailable = (e) => window.__chunks.push(e.data);
      window.__rec.start();
      return Date.now() / 1000;
    };
    window.__tapStop = () => new Promise((done) => {
      if (!window.__rec) return done(null);
      window.__rec.onstop = () => {
        const reader = new FileReader();
        reader.onload = () => done(reader.result.split(',')[1]);
        reader.readAsDataURL(new Blob(window.__chunks, { type: 'audio/webm' }));
      };
      window.__rec.stop();
    });
  }, [lang, name === 'music', SHOTS[name].hide ?? '#testBar,#errands,#walkShow']);
  const out = path.join(ROOT, lang, name);
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });
  const times = [];
  let n = 0;
  let audioAt = null;
  let t0 = 0;
  const FRAME = 1000 / 30;
  const rec = {
    start: async () => {
      audioAt = await p.evaluate(() => window.__tapStart());
      await p.evaluate(() => window.__hold());
      t0 = Date.now() / 1000;
    },
    // Moves the game on by ms, a frame at a time, taking each.
    wait: async (ms) => {
      for (let k = 0; k < Math.round(ms / FRAME); k++) {
        await p.evaluate((f) => window.__step(f), FRAME);
        await p.screenshot({ path: path.join(out, `${String(n).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 92 });
        times.push(t0 + n / 30);
        n++;
      }
    },
    stop: async () => {},
  };
  const log = await SHOTS[name](p, rec, URL);
  await rec.stop().catch(() => {});
  const sound = await p.evaluate(() => window.__tapStop()).catch(() => null);
  if (sound) {
    fs.writeFileSync(path.join(out, 'audio.webm'), Buffer.from(sound, 'base64'));
    fs.writeFileSync(path.join(out, 'audio.json'), JSON.stringify({ start: audioAt }));
  }
  fs.writeFileSync(path.join(out, 'times.json'), JSON.stringify(times));
  await ctx.close();
  const span = times.length > 1 ? times[times.length - 1] - times[0] : 0;
  console.log(`${lang}/${name}: ${times.length} frames over ${span.toFixed(1)} s (${(times.length / (span || 1)).toFixed(1)} a second), sound ${sound ? 'yes' : 'no'}`, log ?? '');
}

(async () => {
  const [lang, ...names] = process.argv.slice(2);
  const browser = await chromium.launch({ headless: true, executablePath, args: ['--force-device-scale-factor=2.6667', '--autoplay-policy=no-user-gesture-required'] });
  try {
    for (const name of names) await shoot(browser, lang, name);
  } finally {
    await browser.close();
  }
})();
