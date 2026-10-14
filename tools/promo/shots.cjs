// The shots of the promo video, each a short script of moves on the game page (p),
// recording only between rec.start() and the end (rec.wait moves the game on and takes the
// frames). See shoot.cjs. A shot's `hide` is what is not shown in it (CSS selectors).
//
// The film (the user, 2026.10.15, "가.. 좋다"): one day, Kitty Hawk 1903, told as the game
// tells it. A question (what are these people waiting for?), the way there by the dial, an
// errand (the gloves), the way shut, someone showing the way round, the gloves given, and
// the answer: the first flight. Then the stamp, and a few other days.

// Grandmother's slips are put away as they come (the button on the slip).
const shut = (p) => p.evaluate(() => { document.querySelectorAll('#memo button.ok').forEach((b) => b.click()); });

// Stands at a place's first scene, with the slips put away and the sound awake.
async function arrive(p, url, id) {
  await p.goto(`${url}?t=${Date.now()}#go=${id}`, { waitUntil: 'domcontentloaded' });
  await p.waitForFunction(() => window.walkDebug && document.getElementById('loading').hidden, null, { timeout: 60000 });
  await p.waitForTimeout(3000);
  // A key wakes the sound, as a player's first key does (Shift moves nothing).
  await p.keyboard.press('Shift');
  for (let i = 0; i < 6; i++) { await shut(p); await p.waitForTimeout(400); }
  await p.evaluate(() => { window.__shut = setInterval(() => document.querySelectorAll('#memo button.ok').forEach((b) => b.click()), 150); });
}

// Puts the tale at a step ('S0' none done; 'S<n>' the first n done; 'end' all): a tale's
// gate shuts the way on until its errand is done, and the film begins where it wants to.
const step = (p, s) => p.evaluate((s) => { window.walkDebug.tale.state = s === 'end' ? `S${window.walkDebug.place.tale.steps.length}` : s; }, s);

// Goes on to scene n by holding the key at the right foot of the screen, as a player does.
async function toScene(p, n) {
  for (let t = 0; t < 3 && await p.evaluate(() => window.walkDebug.scene) < n; t++) {
    const b = await p.locator('#walkNext').boundingBox();
    await p.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
    await p.mouse.down();
    for (let i = 0; i < 60 && await p.evaluate(() => window.walkDebug.scene) < n; i++) await p.waitForTimeout(500);
    await p.mouse.up();
    await p.waitForTimeout(3000);
  }
}

// She is set down a little before someone (by `by`, a share of the scene).
const before = (p, who, by = 0.12) => p.evaluate(([who, by]) => {
  const w = window.walkDebug;
  const q = w.place.scenes[w.scene].people.find((x) => x.id === who);
  w.x = Math.max(0.03, q.x - by);
}, [who, by]);

// Touches someone as a player does (she walks over and they speak).
const touch = (p, who) => p.evaluate((who) => {
  const w = window.walkDebug;
  const i = w.place.scenes[w.scene].people.findIndex((x) => x.id === who);
  document.querySelectorAll('img.person')[i].dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 5, clientY: 5 }));
}, who);

// Touches someone n times, a line each.
async function talk(p, rec, who, n, first = 1400, next = 1200) {
  for (let k = 0; k < n; k++) { await touch(p, who); await rec.wait(k === 0 ? first : next); }
}

// Presses a key of the screen by its words.
async function press(p, words) {
  const key = p.locator('button', { hasText: words }).first();
  if (!await key.count()) return false;
  await key.click({ force: true });
  return true;
}

// Walks to the right for walkS seconds (scene, the scene to begin in; x, where she stands).
const walk = (id, walkS, scene = 0, x = null) => async (p, rec, url) => {
  await arrive(p, url, id);
  if (scene) { await step(p, 'end'); await toScene(p, scene); }
  if (x !== null) { await p.evaluate((x) => { window.walkDebug.x = x; }, x); await p.waitForTimeout(1500); }
  await rec.start();
  await rec.wait(400);
  await p.keyboard.down('ArrowRight');
  await rec.wait(walkS * 1000);
  await p.keyboard.up('ArrowRight');
  await rec.wait(400);
  return '';
};

// 1. The question: the camp, the flying machine on its rail, people waiting by it.
const hook = async (p, rec, url) => {
  await arrive(p, url, 'kittyHawk');
  await step(p, 'S3');
  await toScene(p, 2);
  await p.evaluate(() => { window.walkDebug.x = 0.6; });
  await p.waitForTimeout(1500);
  await rec.start();
  await p.keyboard.down('ArrowRight');
  await rec.wait(1200);
  await p.keyboard.up('ArrowRight');
  await rec.wait(2000);
  return '';
};

// 2 and 3. Off the Earth, the dial turned to 1903 and down to Kitty Hawk; there the lookout
// asks her to take his friend's gloves to the camp, and they come to her side.
const land = async (p, rec, url) => {
  await arrive(p, url, 'kittyHawk');
  await p.click('#leaveBtn');
  await p.waitForTimeout(5000);
  await rec.start();
  await rec.wait(400);
  await p.evaluate(() => [...document.querySelectorAll('#pins .pin')].find((e) => e.textContent.includes('12초의 비행'))?.click());
  await rec.wait(3600);
  await shut(p);
  // (She walks over to him first: the first line waits for her.)
  await talk(p, rec, 'lookout', 3, 3200, 1400);
  let took = false;
  for (let k = 0; k < 4 && !(took = await press(p, /전해 줄게요/)); k++) { await touch(p, 'lookout'); await rec.wait(1200); }
  await rec.wait(2200);
  return took ? 'took the gloves' : 'NO OFFER';
};

// 4 and 5. The sandy way: the fisherman's cart shuts it; the shell girl calls her round.
const way = async (p, rec, url) => {
  await arrive(p, url, 'kittyHawk');
  await step(p, 'S1');
  await toScene(p, 1);
  await before(p, 'fisherman', 0.1);
  await p.waitForTimeout(1500);
  await rec.start();
  await talk(p, rec, 'fisherman', 2, 1600, 1300);
  await rec.wait(600);
  await talk(p, rec, 'shellgirl', 3, 2200, 1300);
  await rec.wait(600);
  return '';
};

// 6, 7 and 8. The camp: the gloves given, the flight, and the stamp on grandmother's slip.
const camp = async (p, rec, url) => {
  await arrive(p, url, 'kittyHawk');
  await step(p, 'S3');
  await toScene(p, 2);
  await before(p, 'wingman', 0.1);
  await p.waitForTimeout(1500);
  await rec.start();
  await touch(p, 'wingman');
  await rec.wait(1600);
  const gave = await press(p, /망보는 아저씨가 보냈어요/);
  await rec.wait(2400);
  await talk(p, rec, 'wingman', 3, 1500, 1500);
  await rec.wait(3000);
  return gave ? 'gave the gloves' : 'NO CHOICE';
};
camp.hide = '#testBar';

// The music alone.
const music = async (p, rec, url) => {
  await arrive(p, url, 'gobekli');
  await rec.start();
  await rec.wait(36000);
  return '';
};

module.exports = {
  music,
  hook,
  land,
  way,
  camp,
  // 9. A few other days.
  kaifeng: walk('guest1054', 2.5, 2, 0.3),
  hanyang: walk('hunminjeongeum', 2.5),
  dubai: walk('burjKhalifa', 2.5, 2, 0.55),
};
