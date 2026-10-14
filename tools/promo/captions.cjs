// Draws the promo video's captions and its end card as see-through 1080 x 1920 pictures,
// in the game's own fonts (Pretendard and the hand of Gaegu, served by the dev server), as
// volume 1's build/promo/captions.cjs.
// Run: node tools/promo/captions.cjs <lang>  ->  assets/promo/<lang>/captions/<n>.png
const fs = require('fs');
const path = require('path');
const { chromium, executablePath } = require('./env.cjs');

const DEV = process.env.PROMO_DEV || 'http://localhost:5321/';
const ROOT = path.join(__dirname, '..', '..', 'assets', 'promo');

// One line for each shot of the cut (tools/promo/cut.py CUT), in its order.
// The game is not in the store yet (the user, 2026.10.15: "등록 준비중이라고 하면 되겠다").
const LINES = {
  ko: {
    gobekli: '할머니가 남긴 시간 여행 수첩',
    rome: '그날 그 거리를 걸어요',
    kaifeng: '그때 사람들에게 말을 걸고',
    machu: '잉카의 계단밭을 지나',
    tokyo: '첫 신칸센이 달리던 날로',
    kittyhawk: '첫 비행을 곁에서 보고',
    dubai: '가장 높은 탑의 불꽃까지',
    end: { title: '할머니의 수첩 2권', note: '지난 날을 걸어 보는 시간 여행 게임', find: '구글 플레이 등록 준비 중', store: 'Time Oddity - 시간 한량' },
  },
};

const page = (body) => `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="${DEV}fonts/pretendard/pretendardvariable-dynamic-subset.css">
<link rel="stylesheet" href="${DEV}fonts/gaegu/400.css">
<style>
html, body { margin: 0; width: 405px; height: 720px; background: transparent; overflow: hidden; }
/* YouTube Shorts lays its own things over the film: its logo row at the top (8 to 12%),
   the channel, the title and the subscribe key at the foot (the last 12% and more), the
   like, comment and share keys down the right (from 65%). The game's date card stands at
   the top left, so the words stand just under it, between 21% and 36%, clear of the sides. */
.band { position: absolute; left: 0; right: 0; top: 140px; height: 130px; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 0 40px; box-sizing: border-box;
  background: linear-gradient(to bottom, rgba(30, 20, 10, 0) 0%, rgba(30, 20, 10, 0.72) 22%, rgba(30, 20, 10, 0.72) 78%, rgba(30, 20, 10, 0) 100%); }
.kick { font: 700 11px/1 Pretendard Variable, Pretendard, sans-serif; letter-spacing: 0.32em; color: #f2c46b; margin-bottom: 10px; }
.line { font: 400 37px/1.15 Gaegu, cursive; color: #fdf8ec; text-align: center; word-break: keep-all; text-wrap: balance; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.6); }
.end { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; padding-top: 96px; text-align: center; }
.end img { width: 120px; image-rendering: pixelated; margin-bottom: 14px; }
.end .name { font: 800 40px/1 Pretendard Variable, Pretendard, sans-serif; color: #fdf8ec; letter-spacing: 0.02em; }
.end .title { font: 400 46px/1.1 Gaegu, cursive; color: #f2c46b; margin-top: 8px; }
.end .note { font: 400 27px/1.2 Gaegu, cursive; color: #fdf8ec; margin-top: 22px; word-break: keep-all; max-width: 300px; }
.end .find { font: 700 15px/1.5 Pretendard Variable, Pretendard, sans-serif; color: #fdf8ec; margin-top: 30px; padding: 9px 18px; border: 1px solid rgba(242, 196, 107, 0.55); border-radius: 999px; word-break: keep-all; max-width: 260px; }
.end .find b { display: block; font-weight: 500; font-size: 13px; color: #c9d3f2; white-space: nowrap; margin-top: 2px; }
</style></head><body>${body}</body></html>`;

(async () => {
  const lang = process.argv[2];
  const lines = LINES[lang];
  const out = path.join(ROOT, lang, 'captions');
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ headless: true, executablePath });
  const p = await (await browser.newContext({ viewport: { width: 405, height: 720 }, deviceScaleFactor: 8 / 3 })).newPage();
  // (From the dev server's own origin, or the fonts are refused as another site's.)
  await p.goto(`${DEV}fonts/gaegu/400.css`);
  for (const [key, line] of Object.entries(lines)) {
    const body = key === 'end'
      ? `<div class="end"><img src="${DEV}sora/idle-1.png"><div class="name">Time Oddity</div><div class="title">${line.title}</div><div class="note">${line.note}</div><div class="find">${line.find}<b>${line.store}</b></div></div>`
      : `<div class="band"><div class="kick">TIME ODDITY</div><div class="line">${line}</div></div>`;
    await p.setContent(page(body), { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(300);
    await p.screenshot({ path: path.join(out, `${key}.png`), omitBackground: true });
  }
  await browser.close();
  console.log(out);
})();
