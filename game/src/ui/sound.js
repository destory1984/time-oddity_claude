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

  // The voices of a crowd, far enough off that no word is heard: noise through a narrow
  // band where voices lie, swelling and falling a little. level 0 is silence, 1 a full
  // arena. A placeholder until the user has heard it.
  let crowd = null;
  function murmur(level) {
    if (!ac || failed) return;
    try {
      if (!crowd) {
        const source = ac.createBufferSource();
        const band = ac.createBiquadFilter();
        const volume = ac.createGain();
        source.buffer = noise; source.loop = true;
        band.type = 'bandpass'; band.frequency.value = 520; band.Q.value = 0.7;
        volume.gain.value = 0;
        source.connect(band); band.connect(volume); volume.connect(ac.destination);
        source.start();
        crowd = { volume, band };
      }
      const now = ac.currentTime;
      crowd.volume.gain.cancelScheduledValues(now);
      crowd.volume.gain.setTargetAtTime(muted ? 0 : level * 0.05, now, 0.5);
      crowd.level = level;
    } catch { /* silence is fine */ }
  }

  return {
    wake,
    murmur,
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
        const bell = (freq, start, volume) => {
          tone(at + start * pace, { seconds: 1.1, from: freq, gain: volume * WARP_VOLUME, attack: 0.01 });
          tone(at + start * pace, { seconds: 0.35, from: freq * 3, gain: volume * 0.2 * WARP_VOLUME, attack: 0.01 });
        };
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
    // The AudioContext, once a touch has woken it: the music plays through the same one.
    context: () => (failed ? null : ac),
    muted: () => muted,
    setMuted(on) { muted = Boolean(on); if (crowd) murmur(crowd.level ?? 0); },
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
