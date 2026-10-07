// The ground pictures: for each square one of the day and one of today, in the same
// composition, 1536 x 1024 with a transparent sky. They were ordered from an image model
// (docs/art-order-slice-8.md; the last three in section 6) and keyed with tools/key-sky.py, which also measured where
// each picture's horizon lies (a share of its height from the top) and the colour of its
// bottom edge.
// frame: { height, centre } when a phone should show more of the picture's width than
// usual or a part that is off to one side (see render/ground.js).
const scene = (id, horizonThen, footThen, horizonToday, footToday, frame = undefined) => ({
  frame,
  then: { src: `./scenes/${id}-then.webp`, horizon: horizonThen, foot: footThen },
  today: { src: `./scenes/${id}-now.webp`, horizon: horizonToday, foot: footToday },
});

export const SCENES = {
  // The yard is wide: the television on the porch at the left and the girl at the right of
  // the bench must both be in view, so more of the width is shown and it is centred left.
  yard1969: scene('yard1969', 0.565, '#d6ad65', 0.562, '#d9ad62', { height: 0.48, centre: 0.36 }),
  khufu: scene('khufu', 0.521, '#d9ac65', 0.519, '#d9a964'),
  lunar1504: scene('lunar1504', 0.597, '#fce3a8', 0.597, '#fde3a7'),
  crystalPalace: scene('crystalPalace', 0.627, '#4e724b', 0.629, '#497347'),
  kittyHawk: scene('kittyHawk', 0.600, '#aea54f', 0.600, '#949248'),
  pharos: scene('pharos', 0.628, '#8b7858', 0.628, '#8b7855'),
  eiffel: scene('eiffel', 0.522, '#527a4c', 0.522, '#477c48'),
  sputnik: scene('sputnik', 0.567, '#a3844a', 0.567, '#a58246'),
  // The ten of the third batch (2026.10.7).
  stonehenge: scene('stonehenge', 0.564, '#4d784d', 0.566, '#467946'),
  parthenon: scene('parthenon', 0.621, '#989789', 0.621, '#969485'),
  colosseum: scene('colosseum', 0.641, '#626045', 0.642, '#5e5e44'),
  cheomseongdae: scene('cheomseongdae', 0.512, '#94a383', 0.511, '#76a25f'),
  hunminjeongeum: scene('hunminjeongeum', 0.453, '#bcbbb7', 0.453, '#babab5'),
  galileo: scene('galileo', 0.528, '#614737', 0.524, '#614633'),
  tajMahal: scene('tajMahal', 0.586, '#496e4b', 0.586, '#426e45'),
  montgolfier: scene('montgolfier', 0.630, '#4e754a', 0.617, '#4a7542'),
  liberty: scene('liberty', 0.578, '#2d615e', 0.573, '#285f62'),
  sydneyOpera: scene('sydneyOpera', 0.598, '#3f6c45', 0.598, '#376d43'),
};
