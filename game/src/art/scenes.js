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
  // The solar eclipse (2026.10.7). The middle is kept low and empty: the sky is the picture.
  // Centred a little right, so that both bands of soldiers stand clear of Sora.
  thales: scene('thales', 0.626, '#827940', 0.625, '#807b3c', { centre: 0.54 }),
  // The ten of the fourth batch (2026.10.7).
  persepolis: scene('persepolis', 0.557, '#bea068', 0.557, '#be9e65'),
  teotihuacan: scene('teotihuacan', 0.563, '#c5a554', 0.562, '#c9a658'),
  hagiaSophia: scene('hagiaSophia', 0.545, '#cabeaa', 0.545, '#cabfa8'),
  borobudur: scene('borobudur', 0.587, '#1f4231', 0.587, '#1a452f'),
  timbuktu: scene('timbuktu', 0.621, '#dfb96d', 0.621, '#e1ba6f'),
  forbiddenCity: scene('forbiddenCity', 0.613, '#b0b4b4', 0.613, '#aeb2b1'),
  // Mountains all round: the tool took the far ridge (0.440) for the horizon. Eye level is
  // set lower by hand so that the ridges stand above it. The city lies right of the middle.
  machuPicchu: scene('machuPicchu', 0.500, '#477049', 0.500, '#447746', { centre: 0.62 }),
  // The tent is small on the wide snow: the picture is shown larger than the others.
  amundsen: scene('amundsen', 0.615, '#fdfdfd', 0.615, '#fdfefe', { height: 1.3, centre: 0.54 }),
  eddington: scene('eddington', 0.654, '#9d725a', 0.655, '#9f7457', { centre: 0.56 }),
  // The city is at the right edge: more of the width is shown, centred right, so that
  // the far tower and the city are both in view.
  goldenGate: scene('goldenGate', 0.574, '#ad9b3a', 0.574, '#ac9b3b', { height: 0.6, centre: 0.68 }),
};
