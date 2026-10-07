// How close the globe is seen: 1 shows the whole Earth, 8 is the closest (it was 4 until
// the user asked for more on 2026.10.7: "지구를 좀 더 확대할 수 있게 해줘"). Where squares
// crowd (Europe, Korea) their pins lie on one another until the player comes closer.
export const ZOOM_MIN = 1;
export const ZOOM_MAX = 8;
// One press of the + button: three presses reach the closest view.
export const ZOOM_STEP = Math.cbrt(ZOOM_MAX);

// The zoom after growing by `factor` (a pinch's change of width, a button's step, a wheel's notch).
export function zoomBy(zoom, factor) {
  if (!(factor > 0) || !Number.isFinite(factor)) return zoom;
  return Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, zoom * factor));
}
