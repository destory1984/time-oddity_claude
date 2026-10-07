# 첫 토막 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 손전화에서 지구본을 돌려 칸 넷에 가고, 해 다이얼과 "오늘로"로 그때와 오늘을 오가며 계산한 하늘을 보는 첫 토막을 `play/` 에 올린다.

**Architecture:** `game/src/core/` 는 화면을 모르는 순수 계산(날짜, 하늘, 다이얼, 칸의 진행)이고 vitest로 시험한다. `game/src/render/` 는 Babylon.js 지구본, 2D 캔버스 하늘, SVG 땅 그림을 그리고, `game/src/ui/` 는 다이얼, 글과 단추, 손가락, 소리를 맡는다. `main.js` 가 프레임마다 core의 상태를 읽어 render와 ui에 넘긴다.

**Tech Stack:** Vite 8, vitest 5, @babylonjs/core 9, astronomy-engine 2.1.19, 프레임워크 없는 ES 모듈.

**Spec:** `docs/superpowers/specs/2026-10-07-first-slice-design.md`. 초 단위의 흐름은 `docs/상세-기획-2-칸-하나의-흐름.md` 3절과 4절.

## Global Constraints

- 화면 기준은 세로 375 × 812다. 더 큰 화면에서는 가운데에 같은 비율로 둔다.
- 안에서 쓰는 때는 율리우스일(JD) 하나다. 날짜 변환은 `game/src/core/when.js` 에서만 한다. 자바스크립트 `Date` 는 "오늘이 며칠인가"를 얻는 데만 쓴다.
- 적는 해는 역사 연도다. 음수가 기원전이고 0은 없다(-1 다음이 1).
- `core/` 는 DOM과 브라우저 API를 쓰지 않는다. astronomy-engine은 `sky.js` 와 `when.js` 만 부른다. `render/` 와 `ui/` 는 서로를 부르지 않는다.
- 다이얼의 숫자는 `docs/dial-proto.html` 그대로다: 한 칸 12픽셀, 속도 한계 2.5픽셀/밀리초, 감속 `exp(-dt/500)`, 0.015픽셀/밀리초 아래에서 멈춤, 눈금 소리 1,200Hz와 10칸째 760Hz.
- 화면의 글은 한국어다. 코드, 주석, 커밋 메시지는 영어다.
- 비밀값, 이메일, 개인 경로를 넣지 않는다. 커밋 작성자는 `13573570+destory1984@users.noreply.github.com` 이다.
- 깃허브에 올리기와 파일 내려받기(별 목록)는 하기 전에 사용자에게 묻는다.
- 눈에 띄는 일을 마치면 `docs/바뀐-것들.md` 의 그날 맨 위에 한 줄을 더한다.

## Review Focus

1. 2월 29일 칸(1504)에서 다이얼을 윤년이 아닌 해에 세운다 → 2월 28일로 보여야 한다. Task 2의 시험.
2. 다이얼을 범위 끝(기원전 2600년, 올해)에서 세게 굴린다 → 끝에서 서고 값이 NaN이 되지 않는다. Task 4의 시험.
3. 손가락이 끌던 중에 끊긴다(pointercancel, 화면 밖으로 나감) → 다이얼이 눈금에 서고 멈춘 채로 남지 않는다. Task 4의 시험(속도 0으로 놓기)과 Task 8의 손 확인.
4. 소리를 쓸 수 없다(AudioContext 없음, 아직 잠김) → 오류 없이 조용히 넘어간다. Task 8의 시험.
5. 화면 크기가 375 × 812가 아니다(넓은 손전화, 돌린 화면, 데스크톱) → 지평선과 별이 같은 비율로 놓인다. Task 5의 시험(다른 너비와 높이).

---

## 파일의 짜임

```
package.json, vite.config.js          뿌리에 둔다. Vite의 root는 game/, outDir는 ../play
game/index.html
game/public/earth-day.jpg, sora.png
game/src/main.js
game/src/core/   when.js squares.js moment.js sky.js project.js dial.js visit.js
game/src/render/ globe.js skyCanvas.js ground.js
game/src/ui/     dialView.js hud.js touch.js sound.js
game/src/data/stars.json
game/src/art/<id>/then-1.svg … today-3.svg      칸마다 여섯 장. 1이 먼 것, 3이 가까운 것
tests/*.test.js
tools/make-stars.mjs
play/                                 지은 결과물. 커밋한다
```

설계 문서는 `src/` 를 뿌리에 둔다고 적었는데 `game/src/` 로 옮긴다. `index.html` 이 저장소 뿌리에 있으면 GitHub Pages가 짓지 않은 그 파일을 사이트 첫 쪽으로 내보내기 때문이다. Task 1에서 설계 문서 7절과 9절을 이에 맞게 고친다.

---

### Task 1: 틀과 날짜 (`when.js`)

**Files:**
- Create: `package.json`, `vite.config.js`, `game/index.html`, `game/src/main.js`(빈 화면만), `game/src/core/when.js`
- Test: `tests/when.test.js`
- Modify: `docs/superpowers/specs/2026-10-07-first-slice-design.md` 7절, 9절(`src/` → `game/src/`)

**Interfaces:**
- Produces:
  - `jdFromDate({ year, month, day, hour = 0 }, calendar) → number` — `year` 는 역사 연도, `hour` 는 세계시(24를 넘어도 됨), `calendar` 는 `'julian' | 'gregorian'`. `year === 0` 이면 `RangeError`.
  - `dateFromJd(jd, calendar = calendarOf(jd)) → { year, month, day, hour }`
  - `calendarOf(jd) → 'julian' | 'gregorian'` — 경계는 JD 2299160.5
  - `yearIndex(year) → number` (역사 → 천문: -585 → -584, 1 → 1), `yearFromIndex(i) → number`
  - `isLeap(year, calendar) → boolean`
  - `formatYear(year) → string` (`'기원전 585'`, `'1851'`), `formatDate({ year, month, day }) → string` (`'기원전 585.5.28'`)
  - `utHour(localHour, lon) → number` (= `localHour - lon / 15`)
  - `astroTime(jd) → AstroTime` (astronomy-engine `MakeTime(jd - 2451545)`)
  - `todayDate(now = new Date()) → { year, month, day }`

- [ ] **Step 1: 틀을 놓는다.** `package.json`(`"type": "module"`, scripts `dev`, `build`, `test: "vitest run"`), 의존은 `astronomy-engine`, `@babylonjs/core`, 개발 의존은 `vite`, `vitest`. `vite.config.js` 는 `root: 'game'`, `base: './'`, `build: { outDir: '../play', emptyOutDir: true }`, `test: { root: '.', include: ['tests/**/*.test.js'] }`. `npm install`.
- [ ] **Step 2: 시험을 쓴다** (`tests/when.test.js`)

```js
expect(jdFromDate({ year: -585, month: 5, day: 28 }, 'julian')).toBe(1507899.5);
expect(jdFromDate({ year: 1504, month: 2, day: 29 }, 'julian')).toBe(2270452.5);
expect(jdFromDate({ year: 1582, month: 10, day: 4 }, 'julian')).toBe(2299159.5);
expect(jdFromDate({ year: 1582, month: 10, day: 15 }, 'gregorian')).toBe(2299160.5);
expect(jdFromDate({ year: 1851, month: 5, day: 1 }, 'gregorian')).toBe(2397243.5);
expect(jdFromDate({ year: 1, month: 1, day: 1 }, 'julian') - jdFromDate({ year: -1, month: 12, day: 31 }, 'julian')).toBe(1);
expect(() => jdFromDate({ year: 0, month: 1, day: 1 }, 'julian')).toThrow(RangeError);
expect(jdFromDate({ year: 1504, month: 2, day: 29, hour: 24 + 40 / 60 }, 'julian')).toBeCloseTo(2270453.5278, 4);
expect(dateFromJd(1507899.5)).toMatchObject({ year: -585, month: 5, day: 28 });
expect(dateFromJd(2299160.5)).toMatchObject({ year: 1582, month: 10, day: 15 });
expect(dateFromJd(2299159.5)).toMatchObject({ year: 1582, month: 10, day: 4 });
expect(yearIndex(-585)).toBe(-584); expect(yearFromIndex(0)).toBe(-1); expect(yearFromIndex(1)).toBe(1);
expect(isLeap(1504, 'julian')).toBe(true); expect(isLeap(1900, 'gregorian')).toBe(false); expect(isLeap(-1, 'julian')).toBe(true);
expect(formatDate({ year: -585, month: 5, day: 28 })).toBe('기원전 585.5.28');
expect(utHour(21, 31.134)).toBeCloseTo(18.9244, 4);
```

- [ ] **Step 3: 돌려서 실패를 본다.** `npx vitest run tests/when.test.js` → 모듈이 없어 FAIL.
- [ ] **Step 4: `when.js` 를 쓴다.** JD 셈은 `tools/sky-check.mjs` 의 `jd()` 와 같은 식(Meeus)이다.
- [ ] **Step 5: 돌려서 통과를 본다.** PASS.
- [ ] **Step 6: 설계 문서의 폴더 이름을 고치고 커밋한다.** `git commit -m "Scaffold the game and add calendar conversion"`

---

### Task 2: 칸 넷과 보이는 때 (`squares.js`, `moment.js`)

**Files:**
- Create: `game/src/core/squares.js`, `game/src/core/moment.js`
- Test: `tests/moment.test.js`

**Interfaces:**
- Consumes: `jdFromDate`, `utHour`, `isLeap` (Task 1)
- Produces:
  - `SQUARES: Square[]`, `squareById(id) → Square`
  - `Square = { no, id, name, dateLabel, place, lat, lon, date: { year, month, day }, calendar, hourLocal, facingAz, nightOnLook, memo, sora, memoToday, soraToday }`
  - `momentJd(square, { year, night = 0 }, today) → number` — `year` 는 다이얼이 선 역사 연도, `night` 는 0 → 1(밤 9시로 흘러간 정도), `today` 는 `{ year, month, day }`

`SQUARES` 의 값:

| id | no | name | dateLabel | place | lat | lon | date | calendar | hourLocal | facingAz | nightOnLook |
|---|---:|---|---|---|---:|---:|---|---|---:|---:|---|
| khufu | 1 | 대피라미드 | 기원전 2560년경 | 기자, 이집트 | 29.979 | 31.134 | -2560.4.11 | julian | 21 | 0 | false |
| lunar1504 | 39 | 콜럼버스의 월식 | 1504.2.29 | 세인트앤스 만, 자메이카 | 18.44 | -77.20 | 1504.2.29 | julian | 19.52 | 90 | false |
| crystalPalace | 64 | 수정궁 | 1851.5.1 | 하이드파크, 런던 | 51.503 | -0.170 | 1851.5.1 | gregorian | 12 | 180 | true |
| kittyHawk | 82 | 12초의 비행 | 1903.12.17 | 키티호크, 노스캐롤라이나 | 36.014 | -75.668 | 1903.12.17 | gregorian | 10.5833 | 0 | true |

- 기원전 2560.4.11(율리우스력)은 그 해의 춘분날이다(계산한 값). 주석으로 적는다.
- 글(`memo`, `sora`, `memoToday`, `soraToday`)은 설계 문서 3절과 `docs/상세-기획-1.md` 5.3, 5.5, 5.6절에서 옮긴다. 39번의 `soraToday` 는 "배는 없고 바다만 있네."(임시), 82번은 "언덕 위에 돌탑이 생겼어."(임시), 1번은 "누렇게 됐네. 그래도 서 있다."(임시)로 둔다.

`momentJd` 의 규칙(설계 문서 6절):

- `year` 가 사건의 해면 `square.date` 와 `square.calendar`, 올해면 `today` 와 `'gregorian'`, 그 밖이면 사건의 달과 날에 `year < 1583 ? 'julian' : 'gregorian'`.
- 달과 날이 2.29인데 그 해가 윤년이 아니면 2.28로 한다.
- 시각은 `hourLocal + (21 - hourLocal) * night` 를 `utHour` 로 바꾼 것이다.

- [ ] **Step 1: 시험을 쓴다**

```js
const today = { year: 2026, month: 10, day: 7 };
const at = (id, o) => momentJd(squareById(id), o, today);
expect(at('khufu', { year: -2560 })).toBeCloseTo(786484.2885, 3);
expect(at('lunar1504', { year: 1504 })).toBeCloseTo(2270453.5278, 3);
expect(at('crystalPalace', { year: 1851 })).toBeCloseTo(2397244.0005, 3);
expect(at('crystalPalace', { year: 1851, night: 1 })).toBeCloseTo(2397244.3755, 3);
expect(at('kittyHawk', { year: 1903 })).toBeCloseTo(2416466.1512, 3);
expect(at('kittyHawk', { year: 1903, night: 1 })).toBeCloseTo(2416466.5852, 3);
// today keeps the event's local clock time
expect(at('crystalPalace', { year: 2026 })).toBeCloseTo(jdFromDate({ ...today, hour: 12 + 0.170 / 15 }, 'gregorian'), 6);
// another year keeps month and day
expect(at('crystalPalace', { year: 1700 })).toBeCloseTo(jdFromDate({ year: 1700, month: 5, day: 1, hour: 12 + 0.170 / 15 }, 'gregorian'), 6);
// Feb 29 in a common year falls back to Feb 28 (Review Focus 1)
expect(dateFromJd(at('lunar1504', { year: 1505 }) - 0.5, 'julian')).toMatchObject({ month: 2, day: 28 });
expect(SQUARES.map((s) => s.no)).toEqual([1, 39, 64, 82]);
for (const s of SQUARES) { expect(s.memo.length).toBeLessThanOrEqual(25); expect(s.sora.length).toBeLessThanOrEqual(25); }
```

- [ ] **Step 2: 실패를 본다.** `npx vitest run tests/moment.test.js` → FAIL.
- [ ] **Step 3: `squares.js` 와 `moment.js` 를 쓴다.**
- [ ] **Step 4: 통과를 본다.** PASS.
- [ ] **Step 5: 커밋.** `git commit -m "Add the four squares and the rule for the shown moment"`

---

### Task 3: 별 목록과 하늘 계산 (`stars.json`, `sky.js`)

**Files:**
- Create: `tools/make-stars.mjs`, `game/src/data/stars.json`, `game/src/core/sky.js`
- Test: `tests/sky.test.js`

**Interfaces:**
- Consumes: `astroTime` (Task 1)
- Produces:
  - `stars.json`: `[[raHours, decDeg, mag], …]` — J2000, 4.5등급보다 밝은 것
  - `skyAt(jd, { lat, lon }) → { sun: { alt, az }, moon: { alt, az, lit, waxing, towardSun, eclipse }, planets: [{ id, name, alt, az, mag }], stars: [{ alt, az, mag }] }`
    - 각도는 도. `az` 는 북 0, 동 90. 대기 굴절을 넣는다(`'normal'`).
    - `moon.lit` 0 → 1, `moon.towardSun` 은 화면에서 달에서 해 쪽을 가리키는 각(라디안, 오른쪽 0, 위 π/2): `atan2(sun.alt - moon.alt, wrap180(sun.az - moon.az) * cos(moon.alt))`
    - `moon.eclipse` 0 → 1: 부분식이 시작할 때 0, 개기가 시작할 때 1, 개기 동안 1. 달의 위상각이 170 → 190도일 때만 `SearchLunarEclipse` 로 찾고, 찾은 결과는 JD의 정수 부분으로 기억해 둔다.
    - `planets` 의 `id` 는 `mercury, venus, mars, jupiter, saturn`, `name` 은 `수성, 금성, 화성, 목성, 토성`.
  - `skyLight(sunAlt) → { day, stars }` — `day` 는 해가 0도 위면 1, -12도 아래면 0, 사이는 곧게 잇는다. `stars` 는 -6도 위면 0, -12도 아래면 1.

- [ ] **Step 1: 사용자에게 묻고 별 목록을 받는다.** Yale Bright Star Catalog 5판(`https://cdsarc.cds.unistra.fr/ftp/cats/V/50/catalog.gz`, 0.6MB쯤, 공개 자료). `tools/make-stars.mjs` 가 받아서 푼다. 고정 폭 줄에서 J2000 적경(76 → 83번째 글자: 시 2, 분 2, 초 4), 적위(84 → 90번째: 부호 1, 도 2, 분 2, 초 2), V등급(103 → 107번째)을 읽고, 4.5 이하만 등급 차례로 적는다. 적경은 소수 4자리, 적위는 3자리, 등급은 2자리.
- [ ] **Step 2: 시험을 쓴다**

```js
// catalog sanity
expect(stars.length).toBeGreaterThan(700); expect(stars.length).toBeLessThan(1100);
const near = (ra, dec) => stars.find(([r, d]) => Math.abs(r - ra) < 0.01 && Math.abs(d - dec) < 0.05);
expect(near(6.7525, -16.716)[2]).toBeCloseTo(-1.46, 1);   // Sirius
expect(near(14.0732, 64.376)[2]).toBeCloseTo(3.65, 1);    // Thuban
// the four squares, values from docs/하늘-계산-확인.md and the planning run
const sky = (id, o) => skyAt(momentJd(squareById(id), o, today), squareById(id));
const khufu = sky('khufu', { year: -2560 });
expect(khufu.sun.alt).toBeCloseTo(-36.2, 0);
const pole = khufu.stars.filter((s) => s.alt > 29 && s.alt < 33 && (s.az < 3 || s.az > 357));
expect(pole.length).toBeGreaterThan(0);                    // Thuban sits over the north point (alt 30.8, az 1.2)
const eclipse = sky('lunar1504', { year: 1504 });
expect(eclipse.moon.alt).toBeCloseTo(19.4, 0); expect(eclipse.moon.az).toBeCloseTo(92.2, 0);
expect(eclipse.moon.eclipse).toBe(1); expect(eclipse.moon.lit).toBeGreaterThan(0.99);
const noon = sky('crystalPalace', { year: 1851 });
expect(noon.sun.alt).toBeCloseTo(53.5, 0); expect(noon.moon.lit).toBeLessThan(0.01); expect(noon.moon.eclipse).toBe(0);
const night = sky('crystalPalace', { year: 1851, night: 1 });
expect(night.sun.alt).toBeCloseTo(-12.6, 0);
const jup = night.planets.find((p) => p.id === 'jupiter');
expect(jup.alt).toBeCloseTo(31.2, 0); expect(jup.az).toBeCloseTo(155.9, 0);
expect(sky('kittyHawk', { year: 1903 }).moon.lit).toBeCloseTo(0.017, 2);
// partial phase is between 0 and 1: 60 minutes before the peak
const partial = skyAt(2270453.5278 - 60 / 1440, squareById('lunar1504'));
expect(partial.moon.eclipse).toBeGreaterThan(0); expect(partial.moon.eclipse).toBeLessThan(1);
expect(skyLight(5)).toEqual({ day: 1, stars: 0 }); expect(skyLight(-20)).toEqual({ day: 0, stars: 1 });
expect(skyLight(-6).day).toBeCloseTo(0.5, 5); expect(skyLight(-9).stars).toBeCloseTo(0.5, 5);
```

- [ ] **Step 3: 실패를 본다.** FAIL.
- [ ] **Step 4: `sky.js` 를 쓴다.** 별은 J2000 벡터를 `Rotation_EQJ_EQD(time)` 로 돌린 뒤 `Horizon` 으로 바꾼다(`tools/sky-check.mjs` 7번 마디와 같은 길). 월식의 반지속 시간은 `sd_partial`, `sd_total`(분)이다.
- [ ] **Step 5: 통과를 본다.** PASS. 이어서 `skyAt` 을 2,000번 불러 한 번에 몇 밀리초인지 재어 커밋 메시지에 적는다. 2밀리초를 넘으면 별의 회전 행렬을 JD가 0.01일 넘게 바뀔 때만 다시 셈하게 한다.
- [ ] **Step 6: 커밋.** `git commit -m "Add the bright-star list and the sky computation"`

---

### Task 4: 다이얼의 움직임 (`dial.js`)

**Files:**
- Create: `game/src/core/dial.js`
- Test: `tests/dial.test.js`

**Interfaces:**
- Consumes: `yearIndex`, `yearFromIndex` (Task 1)
- Produces:
  - `createDial({ year, minYear = -2600, maxYear }) → Dial`
  - `Dial` 의 읽는 값: `year`(지금 눈금의 역사 연도), `offset`(그려질 자리, 눈금 단위의 소수), `resting`(손도 떼었고 멈췄는가), `rolling`(정한 초 동안 구르는 중인가)
  - `grab(dial)`, `drag(dial, dxPx)`, `release(dial, vPxPerMs)`, `rollTo(dial, year, seconds)`
  - `stepDial(dial, dtMs) → number[]` — 이번 걸음에 지난 눈금의 해들(소리와 날짜에 쓴다)
  - `PX_PER_YEAR = 12`

규칙:

- 안에서는 해의 번호(`yearIndex`)로 센다. 그래서 0년은 저절로 건너뛴다.
- 오른쪽으로 끌면(`dxPx > 0`) 옛날이 온다. 해 = 잡은 때의 해 − `round(끈 거리 / 12)`.
- 놓으면 속도를 ±2.5로 자르고, 걸음마다 `v * dt` 만큼 끈 것으로 치고 `v *= exp(-dt / 500)`. `|v| < 0.015` 가 되면 가장 가까운 눈금으로 `offset` 을 붙인다(걸음마다 남은 거리의 `min(1, dt * 0.012)` 만큼).
- 범위 끝에서는 해를 자르고 속도를 0으로 한다.
- `rollTo` 는 정한 초에 꼭 그 해에 닿는다. 앞의 1/6 동안 빨라지고 뒤의 1/3 동안 느려진다. 구르는 중에 `grab` 하면 그 자리에서 멈추고 손에 넘어간다.

- [ ] **Step 1: 시험을 쓴다**

```js
const run = (d, ms, dt = 16) => { const seen = []; for (let t = 0; t < ms; t += dt) seen.push(...stepDial(d, dt)); return seen; };
// dragging right by 5 ticks goes 5 years back
let d = createDial({ year: 1851, maxYear: 2026 }); grab(d); drag(d, 60); expect(d.year).toBe(1846);
// released with speed, it glides, then rests exactly on a tick
release(d, 1.0); run(d, 5000); expect(d.resting).toBe(true); expect(Number.isInteger(d.year)).toBe(true); expect(d.offset).toBe(yearIndex(d.year)); expect(d.year).toBeLessThan(1846);
// a glide from a 1.0 px/ms flick ends within 2 s
d = createDial({ year: 1851, maxYear: 2026 }); grab(d); release(d, 1.0); run(d, 2000); const y = d.year; run(d, 1000); expect(d.year).toBe(y);
// released with no speed (pointercancel), it still rests on a tick (Review Focus 3)
d = createDial({ year: 1851, maxYear: 2026 }); grab(d); drag(d, 7); release(d, 0); run(d, 1000); expect(d.resting).toBe(true); expect(d.year).toBe(1850);
// skips year 0
d = createDial({ year: 2, maxYear: 2026 }); grab(d); drag(d, 36); expect(d.year).toBe(-2);
// hard fling at both ends: clamps, no NaN (Review Focus 2)
d = createDial({ year: 2025, maxYear: 2026 }); grab(d); release(d, -9); run(d, 4000); expect(d.year).toBe(2026); expect(Number.isFinite(d.offset)).toBe(true);
d = createDial({ year: -2599, maxYear: 2026 }); grab(d); release(d, 9); run(d, 4000); expect(d.year).toBe(-2600);
// rollTo lands on the year at the given time and reports every tick it passed
d = createDial({ year: 1851, maxYear: 2026 }); rollTo(d, 2026, 3); let seen = run(d, 2990); expect(d.rolling).toBe(true); seen.push(...run(d, 32)); expect(d.year).toBe(2026); expect(d.resting).toBe(true); expect(seen.length).toBe(175); expect(seen.at(-1)).toBe(2026);
d = createDial({ year: -2560, maxYear: 2026 }); rollTo(d, 2026, 3); run(d, 3020); expect(d.year).toBe(2026);
```

- [ ] **Step 2: 실패를 본다.** FAIL.
- [ ] **Step 3: `dial.js` 를 쓴다.**
- [ ] **Step 4: 통과를 본다.** PASS.
- [ ] **Step 5: 커밋.** `git commit -m "Add the dial motion: drag, glide, settle, timed roll"`

---

### Task 5: 칸의 진행과 하늘의 투영 (`visit.js`, `project.js`)

**Files:**
- Create: `game/src/core/visit.js`, `game/src/core/project.js`
- Test: `tests/visit.test.js`, `tests/project.test.js`

**Interfaces:**
- Produces:
  - `createVisit(square) → Visit` — `{ square, t: 0, dots: { day: false, sky: false, remains: false }, look: 0, lookHeld: 0, night: 0, seenThen: false }`
  - `stepVisit(visit, dtMs, { dialYear, dialResting, thisYear, lookTarget }) → string[]` — 이번 걸음에 채워진 동그라미의 이름들(`'day' | 'sky' | 'remains'`)
  - `visitAt(visit, { dialYear, thisYear }) → 'then' | 'today' | 'other'`
  - `MAX_PITCH_DEG` 와 `project(alt, az, { facingAz, pitch, w, h }) → { x, y, front }` — `pitch` 는 0 → 1(고개를 든 정도)

`visit.js` 의 규칙(`상세-기획-2` 3절 나, 다, 라):

- `t` 는 도착한 뒤 흐른 밀리초다. 사건의 해에 서 있고 `t ≥ 1000` 이면 `day`.
- `look` 은 `lookTarget` 을 따라간다(걸음마다 남은 차이의 `min(1, dt * 0.01)`). `look ≥ 0.95` 인 동안 `lookHeld` 가 쌓이고, 내리면 0이 된다.
- `square.nightOnLook` 이면 `lookHeld` 가 1,500을 넘은 뒤 2,000밀리초에 걸쳐 `night` 가 0 → 1이 되고, 1이 되면 `sky`. 고개를 내리면 `night` 가 2,000밀리초에 걸쳐 0으로 돌아간다.
- `nightOnLook` 이 아니면 `lookHeld ≥ 1500` 에서 `sky`.
- 사건의 해에 한 번 섰고(`seenThen`), 다이얼이 올해에 멈춰 있으면 `remains`.
- 한 번 채워진 동그라미는 비지 않는다. 같은 이름을 두 번 알리지 않는다.

`project.js` 의 규칙(설계 문서 5.2절):

- 가로로 60도가 보이는 원근 투영이다. 초점 거리 `f = (w / 2) / tan(30°)`.
- `pitch = 0` 일 때 지평선이 `0.60 * h`, `pitch = 1` 일 때 `0.85 * h` 에 온다. 그러니 `MAX_PITCH_DEG = atan(0.25 * h / f)` 를 도로 바꾼 값이고, 375 × 812에서 32도쯤이다. 화면 비율에 따라 달라지므로 함수 `maxPitchDeg(w, h)` 로 둔다.
- 시선의 뒤쪽에 있는 점은 `front: false`.

- [ ] **Step 1: 시험을 쓴다**

```js
// visit
const sq = squareById('crystalPalace'), base = { dialYear: 1851, dialResting: true, thisYear: 2026, lookTarget: 0 };
const run = (v, ms, input) => { const got = []; for (let t = 0; t < ms; t += 20) got.push(...stepVisit(v, 20, input)); return got; };
let v = createVisit(sq); expect(run(v, 980, base)).toEqual([]); expect(run(v, 40, base)).toEqual(['day']);
expect(run(v, 1000, { ...base, lookTarget: 1 })).toEqual([]);            // still looking up, held < 1.5 s
expect(run(v, 3500, { ...base, lookTarget: 1 })).toEqual(['sky']); expect(v.night).toBe(1);
run(v, 2500, base); expect(v.night).toBe(0); expect(v.dots.sky).toBe(true);
expect(run(v, 100, { ...base, dialYear: 1950, dialResting: true })).toEqual([]);
expect(run(v, 100, { ...base, dialYear: 2026, dialResting: false })).toEqual([]);
expect(run(v, 100, { ...base, dialYear: 2026 })).toEqual(['remains']);
expect(run(v, 100, base)).toEqual([]);                                     // going back fills nothing
// a night square fills the sky dot after 1.5 s of looking, and never shifts the clock
v = createVisit(squareById('lunar1504')); const e = { dialYear: 1504, dialResting: true, thisYear: 2026, lookTarget: 1 };
const got = run(v, 2200, e); expect(got).toContain('sky'); expect(v.night).toBe(0);
// arriving when the dial is not on the event year fills nothing until it is
v = createVisit(sq); expect(run(v, 3000, { ...base, dialYear: 1800 })).toEqual([]); expect(run(v, 100, { ...base, dialYear: 2026 })).toEqual([]);

// project
const view = { facingAz: 180, pitch: 0, w: 375, h: 812 };
expect(project(0, 180, view)).toMatchObject({ front: true }); expect(project(0, 180, view).x).toBeCloseTo(187.5, 1); expect(project(0, 180, view).y).toBeCloseTo(487.2, 1);
expect(project(0, 210, view).x).toBeCloseTo(375, 0); expect(project(0, 150, view).x).toBeCloseTo(0, 0);
expect(project(0, 180, { ...view, pitch: 1 }).y).toBeCloseTo(690.2, 1);
expect(project(30, 180, view).y).toBeLessThan(487); expect(project(10, 0, view).front).toBe(false);
// another screen keeps the same proportions (Review Focus 5)
const wide = { facingAz: 180, pitch: 0, w: 800, h: 600 };
expect(project(0, 180, wide).y).toBeCloseTo(360, 1); expect(project(0, 210, wide).x).toBeCloseTo(800, 0); expect(project(0, 180, { ...wide, pitch: 1 }).y).toBeCloseTo(510, 1);
```

- [ ] **Step 2: 실패를 본다.** FAIL.
- [ ] **Step 3: `visit.js` 와 `project.js` 를 쓴다.**
- [ ] **Step 4: 통과를 본다.** PASS. `npx vitest run` 으로 앞의 시험도 모두 통과하는지 본다.
- [ ] **Step 5: 커밋.** `git commit -m "Add the progress of a visit and the sky projection"`

---

### Task 6: 하늘 캔버스 (`skyCanvas.js`)

**Files:**
- Create: `game/src/render/skyCanvas.js`
- Modify: `game/src/main.js`, `game/index.html`

**Interfaces:**
- Consumes: `skyAt`, `skyLight` (Task 3), `project` (Task 5), `momentJd`, `squareById` (Task 2)
- Produces:
  - `createSkyCanvas(canvas) → { resize(), draw(sky, { facingAz, pitch, dim, labels }) }` — `dim` 은 0 → 1(다이얼이 구르는 동안 달과 행성을 흐리게, 1이면 30%), `labels` 는 0 → 1(이름의 불투명도)
  - `main.js` 가 주소 끝의 `#shot=<id>,<then|sky|today>` 를 읽어, 움직임 없이 그 칸의 그 모습을 바로 그린다. 화면을 찍을 때 쓴다.

그리는 값(설계 문서 5.2절):

- 바탕: 밤 `#050330`, 황혼의 지평선 `#f6a25e` 에서 위로 `#2b2a6e`, 낮 `#8ec5ee` 에서 지평선 `#d8ecf8`. `skyLight().day` 로 섞는다. 색은 임시이고 화면 어림(`docs/mock-screens.html`)의 `space`, `dusk` 와 어울리게 잡는다.
- 별: 지름 `clamp(2.4 - 0.4 * mag, 0.6, 2.4)` 픽셀, 색 `rgba(251,248,249,.9)`, 불투명도에 `skyLight().stars` 를 곱한다.
- 행성: 지름 `clamp(5 - 0.8 * (mag + 2), 2, 5)` 픽셀, 색 `#fff3d6`.
- 해와 달: 지름 28픽셀. 달은 `lit` 만큼 밝은 쪽을 그리고 `towardSun` 으로 돌린다(시험판 `drawSky` 의 반원과 타원 겹치기). 어두운 쪽은 하늘빛보다 조금 밝게 둔다.
- 월식: 달의 밝은 색 `#f4f1ff` 를 `eclipse` 에 따라 `#b0432a` 로 섞는다.
- 이름: 11픽셀, 달과 행성의 오른쪽 위에. `수정궁의 밤` 처럼 달이 지평선 아래면 달 이름은 그리지 않는다.
- 지평선 아래(`alt < 0`)는 그리지 않는다.
- 기기 화소 비율(`devicePixelRatio`)에 맞춰 캔버스 크기를 잡고, `resize()` 에서 다시 잡는다.

- [ ] **Step 1: `skyCanvas.js` 를 쓰고 `main.js` 에서 `#shot` 을 읽어 한 장 그리게 한다.**
- [ ] **Step 2: 찍어서 본다.** `npm run build` 뒤 크롬을 머리 없이 띄워 네 칸의 `sky` 를 찍는다(넘김 문서 6절의 명령, `--window-size=375,812`, 주소는 `play/index.html#shot=lunar1504,sky`). 그림 파일을 열어 확인한다:
  - `lunar1504,sky`: 화면 가운데 조금 오른쪽, 지평선 위 낮은 자리에 붉은 보름달.
  - `crystalPalace,sky`: 밤하늘, 달 없음, 왼쪽에 목성과 이름.
  - `khufu,sky`: 가운데 세로줄 위, 지평선에서 화면 높이의 1/4쯤 올라간 자리에 별 하나(투반).
  - `crystalPalace,then`: 낮 하늘, 해가 가운데 위쪽.
- [ ] **Step 3: 커밋.** 찍은 그림은 커밋하지 않는다. `git commit -m "Draw the computed sky on a canvas"`

---

### Task 7: 땅 그림 (`ground.js` 와 임시 그림 스물넉 장)

**Files:**
- Create: `game/src/render/ground.js`, `game/src/art/<id>/{then,today}-{1,2,3}.svg` (4칸 × 6장)
- Modify: `game/src/main.js`

**Interfaces:**
- Produces: `createGround(el) → { show(square), set({ rise, blend, silhouette, look }) }`
  - `rise` 0 → 1: 종이 석 장이 아래에서 올라온 정도. 먼 것부터 0.2초씩 틈을 두므로, 전체 0.8초 가운데 장마다 0.4초를 쓴다.
  - `blend` 0 → 1: 그때 → 오늘
  - `silhouette` 0 → 1: 오늘 그림을 한 가지 색(`#141238`)으로 누른 정도(`상세-기획-2` 4절)
  - `look` 0 → 1: 고개를 든 정도. 땅 전체가 `0.25 * 높이` 만큼 아래로 내려간다(`project` 의 지평선과 같은 양).

그림의 규칙:

- 모든 SVG는 `viewBox="0 0 375 812"`, 지평선은 `y = 487`. 지평선 위의 하늘은 투명하다. 지평선 위로 솟는 것(건물, 피라미드, 언덕)만 그린다.
- 그때와 오늘은 구도가 같다. 땅의 윤곽은 같고 솟은 것만 다르다.
- 종이를 오려 겹친 듯 납작하게, 장마다 두세 가지 색. 사람은 작은 실루엣이거나 없다. 얼굴은 그리지 않는다.
- 수정궁은 `docs/mock-screens.html` 의 `park()` 를 옮겨 석 장으로 가른다.

| id | 그때 | 오늘 |
|---|---|---|
| khufu | 흰 겉돌을 입은 매끈한 피라미드, 꼭대기에 금빛 뾰족돌. 앞에 사막과 작은 사람 실루엣 | 누런 계단 꼴의 피라미드, 꼭대기가 뭉툭함. 같은 사막 |
| lunar1504 | 밤의 만. 얹힌 배 두 척의 실루엣, 바닷가에 작은 사람들 | 같은 만. 배가 없고 바닷가에 야자나무 |
| crystalPalace | 풀밭 너머 길게 누운 유리 건물, 가운데 둥근 지붕 | 풀밭과 나무뿐 |
| kittyHawk | 모래 언덕. 낮게 뜬 복엽기 실루엣과 곁에서 달리는 한 사람 | 같은 언덕 위에 돌 기념비 |

- [ ] **Step 1: 그림 스물넉 장을 그린다.**
- [ ] **Step 2: `ground.js` 를 쓰고 `#shot` 에 땅을 얹는다.** `then` 은 `rise 1, blend 0`, `today` 는 `blend 1`, `sky` 는 `look 1`.
- [ ] **Step 3: 찍어서 본다.** 네 칸의 `then`, `today`, `sky` 열두 장을 찍어 연다. 확인할 것: 지평선이 하늘 캔버스의 지평선과 맞닿는다(틈이나 겹침이 없다). 그때와 오늘의 땅 윤곽이 같다. `sky` 에서 땅이 화면 아래 15%에 띠로 남는다. 피라미드 꼭대기 위쪽에 투반이 보인다.
- [ ] **Step 4: 커밋.** `git commit -m "Add placeholder ground art for the four squares"`

---

### Task 8: 땅 화면을 잇는다 (`dialView.js`, `hud.js`, `touch.js`, `sound.js`, `main.js`)

**Files:**
- Create: `game/src/ui/dialView.js`, `game/src/ui/hud.js`, `game/src/ui/touch.js`, `game/src/ui/sound.js`
- Modify: `game/src/main.js`, `game/index.html`
- Test: `tests/sound.test.js`

**Interfaces:**
- Consumes: Task 1 → 7의 모든 것
- Produces:
  - `createDialView(canvas) → { resize(), draw(dial) }` — 시험판의 `drawArc` 와 `ticks` 를 옮긴다(큰 호, 반지름 `W * 1.15`, 금색 바늘). 눈금 글자는 `formatYear`.
  - `createHud(el) → { set(state) }` — `state = { dateText, placeText, subText, dots, memo, bubble, todayLabel, showToday, showLeave, glowSky, glowToday }`. 바뀐 값만 DOM에 쓴다.
  - `createTouch(el, { dialHeight: 140, onDialGrab, onDialDrag(dx), onDialRelease(v), onLook(dy), onLookEnd, onGlobeDrag(dx, dy), onGlobeEnd }) ` — 손가락을 처음 댄 자리로 구역을 정하고 떼거나 끊길 때까지 바꾸지 않는다. `pointercancel` 은 뗀 것과 같다. 다이얼의 속도는 시험판처럼 `vp += (d / dt - vp) * 0.35`, 70밀리초 넘게 멈춰 있으면 `vp *= 0.7`.
  - `createSound(AudioContextClass = globalThis.AudioContext ?? globalThis.webkitAudioContext) → { wake(), tick(big, dense), paper(), stamp(), bell(), page() }` — 클래스가 없거나 만들다 던지면 모든 함수가 아무 일도 하지 않는다.

`main.js` 가 프레임마다 하는 일(땅 화면):

1. `stepDial` → 지난 눈금마다 소리. 한 프레임에 눈금이 둘 넘으면 `tick(false, true)` 를 한 번만(40밀리초에 한 번을 넘지 않게). 10으로 나누어떨어지는 해는 `big`.
2. `stepVisit` → 채워진 동그라미마다 소리(`day` 도장, `sky` 종, `remains` 종이 넘김).
3. `momentJd(square, { year: dial.year, night: visit.night }, today)` → `skyAt` → `skyCanvas.draw` 와 `ground.set` 과 `hud.set`.

정한 값(`상세-기획-2` 3절과 5절):

- 도착: 0 → 800밀리초 `rise`, 1,200에 메모, 2,500 → 6,500에 말풍선, 9,000에 하늘 귀띔, 15,000에 "오늘로" 귀띔. 귀띔은 한 번 밝아졌다 가라앉는다(1.2초).
- "오늘로": `rollTo(dial, thisYear, 3)`. 땅의 `blend` 는 굴러가는 시간의 20% → 80% 사이에 0 → 1(`smoothstep`). 하늘의 `dim` 은 구르는 동안 1, 서면 400밀리초에 걸쳐 0.
- "그날로": `rollTo(dial, square.date.year, 1.5)`, `blend` 는 거꾸로.
- 손으로 굴릴 때: 다이얼이 사건의 해도 올해도 아닌 해에 멈춘 뒤 1,000밀리초가 지나면 `silhouette` 가 400밀리초에 걸쳐 1이 되고 메모가 "이 해는 적어 둔 게 없구나"가 된다. 굴러가는 동안에는 직전의 그림(그때 또는 오늘)을 그대로 둔다.
- 남은 것이 채워진 뒤 200밀리초에 메모가 `memoToday` 로 뒤집히고, 1,200밀리초에 `soraToday` 말풍선.
- 날짜 아래 `subText`: 밤으로 흘러간 동안 "그날 밤 9시".
- `tick` 의 소리는 시험판 `click(big)` 그대로(잡음 띠 통과 1,200Hz 또는 760Hz에 낮은 사인 한 번). `dense` 는 600Hz, 세기 0.25.
- 임시 소리: `paper` 는 0.12초의 높은 잡음, `stamp` 는 90Hz 사인 0.15초, `bell` 은 1,320Hz 사인 0.9초 감쇠, `page` 는 0.25초의 잡음이 높은 데서 낮은 데로.

- [ ] **Step 1: 소리의 시험을 쓴다** (Review Focus 4)

```js
const none = createSound(undefined);
expect(() => { none.wake(); none.tick(true, false); none.paper(); none.stamp(); none.bell(); none.page(); }).not.toThrow();
const broken = createSound(class { constructor() { throw new Error('blocked'); } });
expect(() => { broken.wake(); broken.tick(false, true); }).not.toThrow();
```

- [ ] **Step 2: 실패를 본다.** FAIL.
- [ ] **Step 3: 넷을 쓰고 `main.js` 에서 잇는다.** 지구본이 아직 없으므로 주소 끝 `#go=<id>` 로 그 칸에 도착한 데서 시작한다(없으면 `crystalPalace`).
- [ ] **Step 4: 시험이 통과하는지 본다.** `npx vitest run` → 모두 PASS.
- [ ] **Step 5: 브라우저에서 손으로 본다.** `npm run dev` 를 띄우고 375 × 812 창에서 네 칸을 차례로: 도착하면 그림이 서고 첫 동그라미가 찬다. 위로 끌면 하늘이 보이고 둘째가 찬다(수정궁과 키티호크는 밤으로 흘러간다). "오늘로"를 누르면 3초에 걸쳐 바뀌고 셋째가 찬다. 다이얼을 손으로 굴려 1900년에 세우면 1초 뒤 실루엣이 된다. 다이얼을 끌다가 손가락을 화면 밖으로 내보내도 눈금에 선다(Review Focus 3). 콘솔에 오류가 없다.
- [ ] **Step 6: 커밋.** `git commit -m "Wire the ground screen: dial, sky look, today, sounds"`

---

### Task 9: 지구본 (`globe.js`)

**Files:**
- Create: `game/src/render/globe.js`, `game/public/earth-day.jpg`(1권 `C:\_c\oddity\public\assets\earth-day.jpg`, NASA Blue Marble, 공개 자료), `game/public/sora.png`(`docs/mock/sora.png`)
- Modify: `game/src/main.js`, `game/index.html`, `README.md`(지구 그림의 출처 한 줄)

**Interfaces:**
- Consumes: `SQUARES` (Task 2), `createTouch` 의 `onGlobeDrag`, `onGlobeEnd` (Task 8), `rollTo` (Task 4)
- Produces: `createGlobe(canvas, { squares, onPick(id) }) → { resize(), setActive(on), drag(dx, dy), release(), spinTo(lat, lon, seconds) → Promise, render(dtMs) }`

규칙(설계 문서 4.1절):

- `@babylonjs/core` 에서 쓰는 것만 골라 들인다(`Engine`, `Scene`, `ArcRotateCamera` 대신 고정 카메라와 구의 회전, `MeshBuilder.CreateSphere`, `StandardMaterial`, `Texture`). 통째로 들이지 않는다.
- 지구의 지름은 화면 너비의 80%다. 끌면 가로로 경도, 세로로 위도가 돈다(위도는 ±70도에서 멈춘다). 놓으면 0.5초에 걸쳐 미끄러지다 선다.
- 점과 이름표는 HTML이다. 프레임마다 위도와 경도를 화면 자리로 바꿔 옮기고, 지구 뒤쪽이면 숨긴다. 점은 지름 14픽셀의 금색(`#f6b951`), 누르는 자리는 44픽셀.
- `earth-day.jpg` 의 경도 0도가 그림 가운데인지 1권의 코드(`C:\_c\oddity\src\render\planets.js`)에서 확인하고, 런던의 점이 영국 위에 오는지 찍어서 본다.
- 점을 누르면: `sound.wake()` → `spinTo`(1.0초) → `rollTo(dial, 사건의 해, 1.0)` → 0.4초에 걸쳐 어두워졌다 밝아지며 땅 화면. "떠나기"는 땅 그림을 0.6초에 걸쳐 내리고(`rise` 1 → 0) 지구본으로 돌아온다.
- 땅 화면인 동안에는 `setActive(false)` 로 지구본을 그리지 않는다.

- [ ] **Step 1: `globe.js` 를 쓰고 `main.js` 에 지구본 화면을 잇는다.** `#go` 와 `#shot` 은 그대로 남긴다. `#shot=globe` 를 더한다.
- [ ] **Step 2: 찍어서 본다.** `#shot=globe` 를 찍어, 점 넷 가운데 앞쪽에 있는 것들이 제 땅 위에 있는지 본다(런던, 기자가 한 화면에 든다).
- [ ] **Step 3: 브라우저에서 손으로 본다.** 지구를 끌어 돌린다. 점 넷을 차례로 눌러 가고, 떠나고, 다시 간다. 지구본 화면에서 다이얼을 굴려도 지구가 돌지 않는다. 콘솔에 오류가 없다.
- [ ] **Step 4: 커밋.** `git commit -m "Add the globe and travel between it and the four squares"`

---

### Task 10: 짓고, 재고, 적고, 묻는다

**Files:**
- Create: `play/`(지은 결과물)
- Modify: `README.md`, `docs/넘김.md`, `docs/바뀐-것들.md`

- [ ] **Step 1: 모든 시험.** `npx vitest run` → 모두 PASS.
- [ ] **Step 2: 짓는다.** `npm run build`. `play/` 의 파일 크기를 재어 적는다(자바스크립트, 지구 그림, 합계).
- [ ] **Step 3: 지은 것을 찍어서 본다.** `play/index.html` 을 파일 주소로 열어 `#shot=globe` 와 네 칸의 `then`, `sky`, `today` 를 다시 찍는다. 설계 문서 10절의 3번을 그림에서 확인한다: 수정궁의 밤에 달이 없다, 자메이카의 달이 붉다, 피라미드 위에 투반이 있고 `khufu,today` 의 하늘에서는 그 가까이에 북극성이 있다.
- [ ] **Step 4: 비밀값을 훑는다.** `git grep -n -i -E "gmail|token|api[_-]?key|C:\\\\Users"` 가 `play/` 와 `game/` 에서 아무것도 내지 않는다.
- [ ] **Step 5: 문서를 고친다.** `README.md` 에 첫 토막의 주소와 하는 법 세 줄. `docs/넘김.md` 의 "지금 있는 것", "다음에 할 일". `docs/바뀐-것들.md` 맨 위에 "첫 토막이 생겼습니다. 지구본을 돌려 네 칸에 가고, 다이얼을 오늘로 돌리면 3초에 걸쳐 땅이 바뀝니다."
- [ ] **Step 6: 커밋하고 사용자에게 묻는다.** `git commit -m "Build the first slice into play/"`. 올려도 되는지 묻고, 올린 뒤 40초쯤 기다려 `https://destory1984.github.io/time-oddity_claude/play/` 가 200을 내는지 본다.
- [ ] **Step 7: 사용자에게 아뢴다.** 잰 숫자(시험 수, 파일 크기, `skyAt` 한 번의 밀리초)와, 손으로 보아야 하는 것 셋: "오늘로"의 3초가 알맞은가, 다이얼과 하늘 보기가 손가락끼리 부딪치는가, 소리가 어떤가.
