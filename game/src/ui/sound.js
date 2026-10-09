// Sounds, all made with Web Audio: nothing is downloaded and nothing is licensed.
// The dial's tick is the one settled by ear in docs/dial-proto.html. The other four are
// placeholders until the user has heard them.
//
// A browser lets sound start only after a touch, so nothing is made until wake() is
// called from one. Where there is no AudioContext, or it cannot be made, every call is
// silently nothing.
// The dial's tick at half the loudness it was settled at: the user, 2026.10.7, "다이얼 돌아가는
// 소리는 절반으로 줄여줘".
const TICK = 0.5;
const WARP_PACE = 0.4;       // volume 1's jump takes 6 s; here its moments come in this share of the time
const WARP_VOLUME = 0.8;     // volume 1 plays everything through a master at this level
// How long after the jump's first note its chord sounds: when the screen should change.
export const WARP_CHORD_MS = 2720 * WARP_PACE;
// Sounds start this long after they are asked for. Started at the very moment, the first
// few milliseconds are already past and the soft attack is cut off: a click.
const AHEAD_S = 0.012;
// A hiss far too soft to hear, played without end. An output that has had nothing but
// silence for a while goes to sleep (sound cards and wireless earphones do), and the
// first half second after it wakes comes out broken: the user, 2026.10.7, "한참 가만히 있다가
// 다이얼을 돌릴 때 처음 0.5초의 소리가 오류 같다".
const AWAKE_GAIN = 0.0004;

export function createSound(AudioContextClass = globalThis.AudioContext ?? globalThis.webkitAudioContext) {
  let ac = null;
  let noise = null;
  let failed = !AudioContextClass;
  let lastTick = 0;
  let muted = false;

  function wake() {
    if (failed) return;
    try {
      if (!ac) {
        ac = new AudioContextClass();
        noise = ac.createBuffer(1, Math.round(ac.sampleRate * 0.3), ac.sampleRate);
        const data = noise.getChannelData(0);
        for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
        const awake = ac.createBufferSource();
        const hush = ac.createGain();
        awake.buffer = noise; awake.loop = true;
        hush.gain.value = AWAKE_GAIN;
        awake.connect(hush); hush.connect(ac.destination);
        awake.start();
      }
      if (ac.state === 'suspended') ac.resume()?.catch?.(() => {});
    } catch {
      failed = true;
      ac = null;
    }
  }

  // Runs a sound's recipe; a fault in the audio graph must never reach the game.
  function play(recipe) {
    if (!ac || failed || muted) return;
    // A context that is not running keeps its clock still: sounds asked of it pile up on
    // one moment and all go off together when it starts. They are dropped instead.
    if (ac.state !== 'running') { wake(); return; }
    try { recipe(ac.currentTime + AHEAD_S); } catch { /* silence is fine */ }
  }

  // A burst of filtered noise that fades over `seconds`.
  function hiss(at, { seconds, from, to = from, gain, type = 'bandpass', q = 1 }) {
    const source = ac.createBufferSource();
    const filter = ac.createBiquadFilter();
    const volume = ac.createGain();
    source.buffer = noise;
    filter.type = type; filter.Q.value = q;
    filter.frequency.setValueAtTime(from, at);
    if (to !== from) filter.frequency.exponentialRampToValueAtTime(to, at + seconds);
    // A short attack: a sound that starts at its loudest is heard as a click.
    volume.gain.setValueAtTime(0.0001, at);
    volume.gain.exponentialRampToValueAtTime(gain, at + 0.004);
    volume.gain.exponentialRampToValueAtTime(0.0001, at + seconds);
    source.connect(filter); filter.connect(volume); volume.connect(ac.destination);
    source.start(at); source.stop(at + seconds + 0.02);
  }

  function tone(at, { seconds, from, to = from, gain, attack = 0.004 }) {
    const osc = ac.createOscillator();
    const volume = ac.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(from, at);
    if (to !== from) osc.frequency.exponentialRampToValueAtTime(to, at + seconds);
    volume.gain.setValueAtTime(0.0001, at);
    volume.gain.exponentialRampToValueAtTime(gain, at + attack);
    volume.gain.exponentialRampToValueAtTime(0.0001, at + seconds);
    osc.connect(volume); volume.connect(ac.destination);
    osc.start(at); osc.stop(at + seconds + 0.02);
  }

  // The air of a place that is walked about. There was a murmur of filtered noise under
  // every scene; the user, 2026.10.8: "화이트 노이즈는 없애고, 차라리 시장이면 시장에
  // 어울리는 효과음 넣는게". Now nothing sounds without end: a scene has a few small
  // sounds of its own, each heard now and then (AIRS: for each, how long between two of
  // them at least and at most, in ms, and what is played). All are placeholders until the
  // user has heard them.
  const ping = (at, freq, seconds, gain) => {
    tone(at, { seconds, from: freq, gain, attack: 0.005 });
    tone(at, { seconds: seconds * 0.4, from: freq * 2.76, gain: gain * 0.25, attack: 0.005 });
  };
  const knock = (at, freq, gain) => tone(at, { seconds: 0.07, from: freq, to: freq * 0.6, gain });
  const birds = (at) => {
    const base = 2600 + Math.random() * 900;
    for (let i = 0; i < 2 + Math.floor(Math.random() * 3); i += 1) tone(at + i * 0.13, { seconds: 0.09, from: base, to: base * 1.25, gain: 0.03, attack: 0.01 });
  };
  const coins = (at) => { ping(at, 3100, 0.12, 0.035); ping(at + 0.07, 3700, 0.14, 0.03); };
  const wood = (at) => { knock(at, 300, 0.09); knock(at + 0.16, 260, 0.07); };
  const farBell = (at) => ping(at, 660, 1.6, 0.045);
  const bikeBell = (at) => { for (let i = 0; i < 2; i += 1) for (let k = 0; k < 4; k += 1) ping(at + i * 0.32 + k * 0.045, 2300, 0.08, 0.03); };
  const windBell = (at) => { const notes = [1568, 1760, 2093, 2349]; ping(at, notes[Math.floor(Math.random() * notes.length)], 1.1, 0.035); };
  const drum = (at) => { [0, 0.4, 0.6, 0.8].forEach((t, i) => tone(at + t, { seconds: 0.22, from: i === 0 ? 95 : 80, to: 55, gain: 0.16 })); };
  const horn = (at) => { [[262, 0], [330, 0.28], [392, 0.56]].forEach(([f, t]) => { tone(at + t, { seconds: t > 0.5 ? 0.7 : 0.26, from: f, gain: 0.05, attack: 0.04 }); tone(at + t, { seconds: 0.25, from: f * 2, gain: 0.02, attack: 0.04 }); }); };
  const clank = (at) => { tone(at, { seconds: 0.12, from: 72, to: 50, gain: 0.2 }); ping(at + 0.21, 1900, 0.05, 0.02); };
  const fogHorn = (at) => { tone(at, { seconds: 1.6, from: 110, gain: 0.07, attack: 0.25 }); tone(at + 2.1, { seconds: 2.0, from: 98, gain: 0.07, attack: 0.25 }); };
  const gulls = (at) => { for (let i = 0; i < 3; i += 1) tone(at + i * 0.34, { seconds: 0.26, from: 1900, to: 1250, gain: 0.03, attack: 0.03 }); };
  const chime = (at) => { [784, 659, 523, 659].forEach((f, i) => ping(at + i * 0.42, f, 0.8, 0.045)); };
  const whistle = (at) => { tone(at, { seconds: 0.35, from: 2150, gain: 0.03, attack: 0.02 }); tone(at + 0.5, { seconds: 0.7, from: 2150, gain: 0.03, attack: 0.02 }); };
  const rails = (at) => { [0, 0.13, 0.42, 0.55].forEach((t) => tone(at + t, { seconds: 0.06, from: 110, to: 70, gain: 0.13 })); };
  const crickets = (at) => { const f = 4100 + Math.random() * 500; for (let i = 0; i < 9; i += 1) tone(at + i * 0.055, { seconds: 0.035, from: f, gain: 0.014, attack: 0.008 }); };
  const frogs = (at) => { for (let i = 0; i < 2 + Math.floor(Math.random() * 2); i += 1) tone(at + i * 0.3, { seconds: 0.16, from: 250, to: 170, gain: 0.04, attack: 0.02 }); };
  // The beep that ended each sentence from the Moon, as the television had it.
  const moonBeep = (at) => tone(at, { seconds: 0.25, from: 2525, gain: 0.02, attack: 0.01 });
  const AIRS = {
    market: [[2600, 6000, coins], [3500, 8000, wood], [4000, 9000, birds]],
    court: [[3000, 7000, birds], [9000, 18000, farBell]],
    street: [[3500, 8000, birds], [7000, 15000, bikeBell], [12000, 22000, farBell]],
    arena: [[5000, 9000, drum], [9000, 16000, horn]],
    works: [[420, 420, clank]],
    palace: [[2500, 6000, windBell], [5000, 11000, birds]],
    bridge: [[9000, 16000, fogHorn], [4000, 9000, gulls]],
    station: [[8000, 14000, chime], [10000, 18000, whistle]],
    // A joint in the rails every three seconds (the user, 2026.10.8: "기차가 움직이는게 너무
    // 빨라. 기차 안 타봤지? 소리 간격을 3초로 해줘").
    train: [[3000, 3000, rails]],
    night: [[900, 2200, crickets], [5000, 11000, frogs]],
    tv: [[1100, 2600, crickets], [3500, 7000, moonBeep]],
  };
  let airKind = null;
  let airWait = [];
  const between = ([least, most]) => least + Math.random() * (most - least);
  // What a scene sounds like from now on (one of AIRS), or null for nothing.
  function air(kind) {
    airKind = AIRS[kind] ? kind : null;
    // The first of each comes a little sooner than the rest.
    airWait = airKind ? AIRS[airKind].map((voice) => between(voice) * 0.4) : [];
  }
  // Called every frame at a place, with the time gone by: plays what has come due and
  // returns it (the screen jolts with the rails).
  function airStep(dtMs) {
    const due = [];
    if (!airKind) return due;
    AIRS[airKind].forEach((voice, i) => {
      airWait[i] -= dtMs;
      if (airWait[i] > 0) return;
      airWait[i] = between(voice);
      due.push(voice[2]);
      play((at) => voice[2](at));
    });
    return due;
  }
  // A footfall as she walks, on stone, earth or boards; left and right differ a little.
  function step(floor, n) {
    play((at) => {
      const side = n % 2 === 0 ? 1 : 0.9;
      if (floor === 'wood') { tone(at, { seconds: 0.07, from: 250 * side, to: 150, gain: 0.11 }); tone(at, { seconds: 0.02, from: 520, gain: 0.025 }); }
      else if (floor === 'dirt') { tone(at, { seconds: 0.08, from: 150 * side, to: 80, gain: 0.1 }); }
      else { tone(at, { seconds: 0.03, from: 950 * side, to: 520, gain: 0.04 }); tone(at, { seconds: 0.055, from: 170 * side, to: 110, gain: 0.08 }); }
    });
  }

  // One note of the jump: a music-box bell with its third harmonic, ringing 1.1 s.
  const warpBell = (when, freq, volume) => {
    tone(when, { seconds: 1.1, from: freq, gain: volume * WARP_VOLUME, attack: 0.01 });
    tone(when, { seconds: 0.35, from: freq * 3, gain: volume * 0.2 * WARP_VOLUME, attack: 0.01 });
  };

  return {
    wake,
    air, airStep, step, rails,
    // A wax cylinder heard through a small tube: the first line of "Au clair de la
    // lune", thin and a little unsteady. A placeholder until the user has heard it.
    phonograph() {
      play((at) => {
        const C = 523.25, D = 587.33, E = 659.25;
        const tune = [[C, 1], [C, 1], [C, 1], [D, 1], [E, 2], [D, 2], [C, 1], [E, 1], [D, 1], [D, 1], [C, 3]];
        const band = ac.createBiquadFilter();
        band.type = 'bandpass'; band.frequency.value = 1700; band.Q.value = 2.5;
        band.connect(ac.destination);
        let when = at;
        for (const [freq, beats] of tune) {
          const seconds = beats * 0.27;
          const osc = ac.createOscillator();
          const volume = ac.createGain();
          osc.type = 'sawtooth';
          // The cylinder does not turn quite evenly.
          osc.frequency.setValueAtTime(freq * 0.99, when);
          osc.frequency.linearRampToValueAtTime(freq * 1.012, when + seconds);
          volume.gain.setValueAtTime(0.0001, when);
          volume.gain.exponentialRampToValueAtTime(0.16, when + 0.02);
          volume.gain.exponentialRampToValueAtTime(0.0001, when + seconds * 0.95);
          osc.connect(volume); volume.connect(band);
          osc.start(when); osc.stop(when + seconds);
          when += seconds;
        }
      });
    },
    // Going between the Earth and a place: volume 1's jump (oddity/src/ui/sound.js `warp`),
    // note for note, as the user asked (2026.10.8: "텔레포트 소리는 우주 한량꺼 가져와서
    // 붙여줘"). Music-box notes climb a five-note scale faster and faster, a wide bright
    // chord sounds as the screen changes, then a few slow chimes step down. There it runs
    // six seconds with a six-second flash; here the change of screen comes sooner, so the
    // moments are brought closer by `pace` (WARP_PACE: the chord falls 1.09 s in) while
    // each note rings as long as it did.
    warp() {
      play((at) => {
        const pace = WARP_PACE;
        const bell = (freq, start, volume) => warpBell(at + start * pace, freq, volume);
        const scale = [392, 440, 523, 587, 659, 784, 880, 1047, 1175, 1319, 1568, 1760, 2093, 2349, 2637, 3136];
        scale.forEach((freq, k) => {
          // Bunched toward the end.
          bell(freq, 2.6 * (1 - (1 - k / scale.length) ** 1.7), 0.03 + 0.045 * (k / scale.length));
        });
        // A thin, high shimmer under the climb.
        tone(at + 0.6 * pace, { seconds: 2.1 * pace, from: 1568, to: 3136, gain: 0.018 * WARP_VOLUME, attack: 0.01 });
        hiss(at + 1.6 * pace, { seconds: 1.2 * pace, from: 6000, to: 9000, gain: 0.035 * WARP_VOLUME, type: 'highpass' });
        // Arrival: a wide, bright chord.
        [1047, 1319, 1568, 2093, 2637].forEach((freq, i) => bell(freq, 2.72 + (i * 0.03) / pace, 0.085 - i * 0.008));
        tone(at + 2.72 * pace, { seconds: 1.6, from: 523, gain: 0.05 * WARP_VOLUME, attack: 0.01 });
        // Settling: slow chimes stepping down.
        [[2093, 3.5], [1568, 4.0], [1319, 4.5], [1047, 5.0]].forEach(([freq, when], i) => bell(freq, when, 0.045 - i * 0.007));
      });
    },
    // She is set down in a shaft of light (style.css `beamDown`, 0.62 s: she touches the
    // ground 0.4 s in). Coming down from above the Earth the jump's own chord has just
    // sounded, so there is only her foot on the ground and one small chime (`land`). The
    // user, 2026.10.9: "소라가 워프해서 땅에 내려올 때 효과음 넣어".
    land() {
      play((at) => {
        tone(at + 0.4, { seconds: 0.12, from: 170, to: 90, gain: 0.14 });
        ping(at + 0.42, 1047, 0.6, 0.05);
      });
    },
    // Going to the scene beside this one in a ring of gold (0.42 s, main.js HOP_MS) is the
    // jump of volume 1 made small: `lift` is its climb, eight music-box notes bunched toward
    // the end with the shimmer under them, and `hop` is its arrival, the wide bright chord
    // with her foot on the ground and three slow chimes stepping down. First these were a
    // glide of pitch up and one down; the user, 2026.10.9: "장면간 워프 소리가 너무 가벼워....
    // 우주한량 워프 소리처럼 해줘". Placeholders until heard.
    lift() {
      play((at) => {
        const scale = [523, 659, 784, 1047, 1319, 1568, 2093, 2637];
        scale.forEach((freq, k) => warpBell(at + 0.4 * (1 - (1 - k / scale.length) ** 1.7), freq, 0.03 + 0.045 * (k / scale.length)));
        tone(at + 0.05, { seconds: 0.4, from: 1568, to: 3136, gain: 0.018 * WARP_VOLUME, attack: 0.01 });
        hiss(at + 0.2, { seconds: 0.3, from: 6000, to: 9000, gain: 0.035 * WARP_VOLUME, type: 'highpass' });
      });
    },
    hop() {
      play((at) => {
        [1047, 1319, 1568, 2093, 2637].forEach((freq, i) => warpBell(at + i * 0.03, freq, 0.085 - i * 0.008));
        tone(at, { seconds: 1.6, from: 523, gain: 0.05 * WARP_VOLUME, attack: 0.01 });
        tone(at + 0.4, { seconds: 0.12, from: 170, to: 90, gain: 0.14 });
        [[2093, 0.5], [1568, 0.75], [1047, 1.0]].forEach(([freq, when], i) => warpBell(at + when, freq, 0.045 - i * 0.007));
      });
    },
    // A thing changes hands: a small rising pluck, and a chime as it lands.
    hand() { play((at) => { tone(at, { seconds: 0.14, from: 660, to: 990, gain: 0.07, attack: 0.01 }); ping(at + 0.7, 1319, 0.45, 0.045); }); },
    // The AudioContext, once a touch has woken it: the music plays through the same one.
    context: () => (failed ? null : ac),
    muted: () => muted,
    setMuted(on) { muted = Boolean(on); },
    // One tick of the dial. big: every tenth year, lower and louder. dense: many ticks
    // are passing at once (a timed roll), so they are run together, low and soft.
    tick(big, dense) {
      const now = Date.now();
      if (now - lastTick < (dense ? 40 : 22)) return;
      lastTick = now;
      play((at) => {
        if (dense) { hiss(at, { seconds: 0.04, from: 600, gain: 0.25 * TICK }); return; }
        hiss(at, { seconds: 0.045, from: big ? 760 : 1200, gain: (big ? 0.75 : 0.5) * TICK });
        tone(at, { seconds: 0.04, from: big ? 240 : 340, to: big ? 130 : 190, gain: (big ? 0.22 : 0.12) * TICK });
      });
    },
    // The ground picture standing up: paper brushing paper.
    paper() { play((at) => hiss(at, { seconds: 0.12, from: 3200, gain: 0.12, type: 'highpass' })); },
    // The day filled: a low stamp.
    stamp() { play((at) => { tone(at, { seconds: 0.15, from: 110, to: 70, gain: 0.5 }); hiss(at, { seconds: 0.05, from: 300, gain: 0.2 }); }); },
    // The sky filled: one clear bell.
    bell() { play((at) => { tone(at, { seconds: 0.9, from: 1320, gain: 0.18, attack: 0.02 }); tone(at, { seconds: 0.5, from: 2640, gain: 0.05, attack: 0.02 }); }); },
    // A picture taken: two short beeps and the click of a shutter, as in volume 1.
    shutter() { play((at) => { tone(at, { seconds: 0.06, from: 1760, gain: 0.12 }); tone(at + 0.09, { seconds: 0.06, from: 2100, gain: 0.12 }); hiss(at + 0.2, { seconds: 0.07, from: 1800, gain: 0.5 }); }); },
    // What remains filled: a page turning.
    page() { play((at) => hiss(at, { seconds: 0.25, from: 2600, to: 500, gain: 0.2 })); },
  };
}
