// The shots of the promo video, each a short script of moves on the game page (p),
// recording only between rec.start() and rec.stop(). See shoot.cjs.

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

// Walks to the right for walkS seconds, then speaks to the person nearest (talkS seconds).
// scene: the scene to begin in (0, the first).
// x: where she stands when the film begins (0 to 1 across the scene), when not at its start.
const walk = (id, walkS, talkS = 0, scene = 0, x = null) => async (p, rec, url) => {
  await arrive(p, url, id);
  // (A tale's gate shuts the way on until its errand is done: the film begins after it.)
  if (scene) { await p.evaluate(() => { window.walkDebug.tale.state = 'S5'; }); await toScene(p, scene); }
  if (x !== null) { await p.evaluate((x) => { window.walkDebug.x = x; }, x); await p.waitForTimeout(1500); }
  await rec.start();
  await p.waitForTimeout(600);
  await p.keyboard.down('ArrowRight');
  await p.waitForTimeout(walkS * 1000);
  await p.keyboard.up('ArrowRight');
  if (talkS) {
    // The person nearest her, touched as a player touches them.
    await p.evaluate(() => {
      const w = window.walkDebug;
      const people = w.place.scenes[w.scene].people;
      let best = 0;
      people.forEach((q, i) => { if (Math.abs(q.x - w.x) < Math.abs(people[best].x - w.x)) best = i; });
      document.querySelectorAll('img.person')[best].dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 5, clientY: 5 }));
    });
    await p.waitForTimeout(talkS * 1000);
  } else {
    await p.waitForTimeout(800);
  }
  return '';
};

// The music alone: standing still for a while.
const music = async (p, rec, url) => {
  await arrive(p, url, 'gobekli');
  await rec.start();
  await p.waitForTimeout(36000);
  return '';
};

module.exports = {
  music,
  gobekli: walk('gobekli', 4.5),
  rome: walk('colosseum', 4.5),
  kaifeng: walk('guest1054', 2.5, 3),
  machu: walk('machuPicchu', 4.5),
  tokyo: walk('shinkansen', 4.5),
  kittyhawk: walk('kittyHawk', 4.5, 0, 2, 0.52),
  dubai: walk('burjKhalifa', 4.5, 0, 2, 0.55),
};
