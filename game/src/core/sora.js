// What Sora is doing: which of her sprite sheets is showing, which of its four frames,
// and anything she says with it. The sprites are volume 1's (game/public/sora/).
//
// So far she idles, and puts a finger to her lips when the sound or the music is switched
// off, as in volume 1 (the user there: "소리 끄기 버튼을 누르면, 소라가 손가락을 입에
// 대고, 쉬잇~ 하는 움직임 넣어줘", "소리/음악 공통으로 해줘"; here on 2026.10.7: "소리 off,
// bgm off 할 때마다 소라가 쉬잇~하는 것도 가져와").
export const HUSH_S = 3;
const IDLE_FPS = 3;
const SEE_FPS = 6;
const FRAMES = 4;

// now, hushAt: milliseconds on the same clock; hushAt is null when she has not hushed.
export function soraPose({ now, hushAt }) {
  if (hushAt !== null && now >= hushAt && now - hushAt < HUSH_S * 1000) {
    // Played once, then the last frame is held.
    const frame = Math.min(FRAMES, 1 + Math.floor(((now - hushAt) / 1000) * SEE_FPS));
    return { sheet: 'see-hush', frame, saying: '쉬잇~' };
  }
  return { sheet: 'idle', frame: 1 + (Math.floor((now / 1000) * IDLE_FPS) % FRAMES), saying: null };
}
