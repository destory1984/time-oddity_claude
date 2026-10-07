// Sounds, all made with Web Audio: nothing is downloaded and nothing is licensed.
// The dial's tick is the one settled by ear in docs/dial-proto.html. The other four are
// placeholders until the user has heard them.
//
// A browser lets sound start only after a touch, so nothing is made until wake() is
// called from one. Where there is no AudioContext, or it cannot be made, every call is
// silently nothing.
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
    try { recipe(ac.currentTime); } catch { /* silence is fine */ }
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

  return {
    wake,
    muted: () => muted,
    setMuted(on) { muted = Boolean(on); },
    // One tick of the dial. big: every tenth year, lower and louder. dense: many ticks
    // are passing at once (a timed roll), so they are run together, low and soft.
    tick(big, dense) {
      const now = Date.now();
      if (now - lastTick < (dense ? 40 : 22)) return;
      lastTick = now;
      play((at) => {
        if (dense) { hiss(at, { seconds: 0.04, from: 600, gain: 0.25 }); return; }
        hiss(at, { seconds: 0.045, from: big ? 760 : 1200, gain: big ? 0.75 : 0.5 });
        tone(at, { seconds: 0.04, from: big ? 240 : 340, to: big ? 130 : 190, gain: big ? 0.22 : 0.12 });
      });
    },
    // The ground picture standing up: paper brushing paper.
    paper() { play((at) => hiss(at, { seconds: 0.12, from: 3200, gain: 0.12, type: 'highpass' })); },
    // The day filled: a low stamp.
    stamp() { play((at) => { tone(at, { seconds: 0.15, from: 110, to: 70, gain: 0.5 }); hiss(at, { seconds: 0.05, from: 300, gain: 0.2 }); }); },
    // The sky filled: one clear bell.
    bell() { play((at) => { tone(at, { seconds: 0.9, from: 1320, gain: 0.18, attack: 0.02 }); tone(at, { seconds: 0.5, from: 2640, gain: 0.05, attack: 0.02 }); }); },
    // What remains filled: a page turning.
    page() { play((at) => hiss(at, { seconds: 0.25, from: 2600, to: 500, gain: 0.2 })); },
  };
}
