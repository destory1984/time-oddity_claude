// Background music, the same as volume 1's: eleven tunes decided bar by bar in
// core/music.js and played here with Web Audio. No sound files. It sits well under the
// effects, and has its own switch, kept between visits.
import { BAR_S, barInOrder, barPlan, tuneFor, tuneOrder } from '../core/music.js';

const PAD_VOLUME = 0.02;
const BASS_VOLUME = 0.03;
const MASTER_VOLUME = 0.8;

// context: () => the AudioContext the effects use, or null until a touch has woken it.
export function createMusic({ context, on: startOn = true }) {
  let on = startOn;
  let ctx = null;
  let bus = null;
  let barBuses = [];
  let nextBarAt = 0;
  let barNumber = 0;
  let playing = null;
  // The tunes in a chance order for this sitting, so it does not open the same each time.
  const order = tuneOrder();

  function ready() {
    if (ctx) return true;
    ctx = context();
    if (!ctx) return false;
    bus = ctx.createGain();
    bus.gain.value = on ? MASTER_VOLUME : 0;
    bus.connect(ctx.destination);
    return true;
  }

  function tone({ freq, type = 'sine', start, length, volume, out }) {
    const t = ctx.currentTime + start;
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    env.gain.setValueAtTime(0.0001, t);
    env.gain.exponentialRampToValueAtTime(volume, t + 0.01);
    env.gain.exponentialRampToValueAtTime(0.0001, t + length);
    osc.connect(env).connect(out);
    osc.start(t);
    osc.stop(t + length + 0.05);
  }

  // One held note of the pad: two slightly detuned triangles behind a low-pass filter,
  // swelling in over 2.5 s and fading out over 3 s so bars melt into each other.
  function padNote(freq, start, volume, out) {
    const t = ctx.currentTime + start;
    const end = t + BAR_S + 3;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 900;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, t);
    env.gain.linearRampToValueAtTime(volume, t + 2.5);
    env.gain.setValueAtTime(volume, end - 3);
    env.gain.linearRampToValueAtTime(0.0001, end);
    filter.connect(env).connect(out);
    for (const cents of [-6, 6]) {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      osc.detune.value = cents;
      osc.connect(filter);
      osc.start(t);
      osc.stop(end + 0.05);
    }
  }

  // plan from core/music.js barPlan(); start is seconds from now.
  function playBar(plan, start) {
    const out = ctx.createGain();
    out.connect(bus);
    barBuses = barBuses.filter((bar) => bar.until > ctx.currentTime);
    barBuses.push({ out, until: ctx.currentTime + start + BAR_S + 3.1 });
    for (const freq of plan.pad) padNote(freq, start, PAD_VOLUME, out);
    tone({ freq: plan.bass, start, length: BAR_S, volume: BASS_VOLUME, out });
    for (const note of plan.notes) {
      const { length, overtone, overtoneVolume, wave = 'sine' } = plan.bell;
      tone({ freq: note.freq, type: wave, start: start + note.at, length, volume: note.volume, out });
      tone({ freq: note.freq * overtone, start: start + note.at, length: length * 0.3, volume: note.volume * overtoneVolume, out });
    }
  }

  return {
    on: () => on,
    playing: () => playing,
    setOn(next) {
      on = Boolean(next);
      if (!ctx) return;
      try {
        bus.gain.setTargetAtTime(on ? MASTER_VOLUME : 0, ctx.currentTime, 0.3);
        if (!on) {
          // The bars already sounding are stilled at once, not left to ring out.
          for (const bar of barBuses) bar.out.gain.setTargetAtTime(0, ctx.currentTime, 0.12);
          barBuses = [];
        }
      } catch { /* silence is fine */ }
    },
    // Called every frame with the mood ('surface' on the ground, 'near' above the Earth);
    // starts each bar a little ahead of time so that the audio clock keeps the beat.
    step(mood) {
      if (!on || !ready() || ctx.state !== 'running') return;
      try {
        const now = ctx.currentTime;
        // After a pause or a hidden tab, pick up from now rather than catching up.
        if (nextBarAt < now) nextBarAt = now + 0.1;
        if (nextBarAt - now > 0.5) return;
        const bar = barInOrder(barNumber, order);
        playBar(barPlan(bar, mood), nextBarAt - now);
        playing = tuneFor(bar).name;
        barNumber += 1;
        nextBarAt += BAR_S;
      } catch { /* a fault in the audio graph must never reach the game */ }
    },
  };
}
