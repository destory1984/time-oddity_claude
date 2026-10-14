// Draws the promo video's captions and its end card as see-through 1080 x 1920 pictures,
// in the game's own fonts (Pretendard and the hand of Gaegu, served by the dev server), as
// volume 1's build/promo/captions.cjs.
// Run: node tools/promo/captions.cjs <lang>  ->  assets/promo/<lang>/captions/<n>.png
const fs = require('fs');
const path = require('path');
const { chromium, executablePath } = require('./env.cjs');

const DEV = process.env.PROMO_DEV || 'http://localhost:5321/';
const ROOT = path.join(__dirname, '..', '..', 'assets', 'promo');

// One caption for each shot of the cut (tools/promo/cut.py CUT), in its order: what she
// does (line), and over it, small, how the place is drawn (style): each place is drawn as
// the pictures of that land and time were (the user, 2026.10.15: "그림체가 해당 시대를
// 대표하는 그림체로 그려졌다는 것도 어필해봐"). The first says why she goes ("왜 여행을
// 하는지 한 줄"): grandmother only read of those days (the opening, core/opening.js).
// The game is not in the store yet (the user: "등록 준비중이라고 하면 되겠다").
const LINES = {
  ko: {
    hook: { style: '미국 키티호크 · 1903년 12월 17일 아침', line: '이 사람들은<br>무엇을 기다리고 있을까?' },
    land: { style: '할머니의 수첩', line: '수첩에 적힌 그날로<br>가 봐요' },
    ask: { style: '키티호크 · 바닷가 수채화', line: '부탁 하나:<br>캠프에 털장갑을 전해 주렴' },
    block: { style: '', line: '그런데 길이 막혔어요' },
    help: { style: '', line: '그때 사람들이<br>길을 알려 줘요' },
    give: { style: '', line: '털장갑을 건네고', top: 330 },
    flight: { style: '', line: '12초.<br>사람이 처음 하늘을 날았어요', top: 330 },
    stamp: { style: '', line: '그날을 보러 갔다가,<br>그날을 살고 왔어요', top: 330 },
    kaifeng: { style: '송나라 개봉 1054 · 먹과 붓의 그림', line: '다음은 어느 날로 갈까?' },
    hanyang: { style: '조선 한양 1446 · 목판 책 그림', line: '쉰두 곳의 그날,' },
    dubai: { style: '두바이 2010 · 별 무늬 타일', line: '곳마다 그 시대의 그림체로' },
    end: { title: '할머니의 수첩', note: '지난날을 걸어보는<br>시간 여행 게임', find: '구글 플레이 등록 준비 중', store: 'Time Oddity - 할머니의 수첩' },
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
.band { position: absolute; left: 0; right: 0; top: 136px; height: 150px; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 0 18px; box-sizing: border-box;
  background: linear-gradient(to bottom, rgba(30, 20, 10, 0) 0%, rgba(30, 20, 10, 0.72) 22%, rgba(30, 20, 10, 0.72) 78%, rgba(30, 20, 10, 0) 100%); }
.kick { font: 700 13px/1.2 Pretendard Variable, Pretendard, sans-serif; letter-spacing: 0.06em; color: #f2c46b; margin-bottom: 8px; }
.line { font: 400 31px/1.2 Gaegu, cursive; color: #fdf8ec; text-align: center; word-break: keep-all; white-space: nowrap; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.6); }
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
      : `<div class="band" style="${line.top ? `top:${line.top}px` : ''}">${line.style ? `<div class="kick">${line.style}</div>` : ''}<div class="line">${line.line}</div></div>`;
    await p.setContent(page(body), { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(300);
    await p.screenshot({ path: path.join(out, `${key}.png`), omitBackground: true });
  }
  await browser.close();
  console.log(out);
})();
