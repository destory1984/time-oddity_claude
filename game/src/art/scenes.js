// The ground pictures: for each square one of the day and one of today, in the same
// composition, 1536 x 1024 with a transparent sky. They were ordered from an image model
// (docs/art-order-slice-8.md; the last three in section 6) and keyed with tools/key-sky.py, which also measured where
// each picture's horizon lies (a share of its height from the top) and the colour of its
// bottom edge.
const scene = (id, horizonThen, footThen, horizonToday, footToday) => ({
  then: { src: `./scenes/${id}-then.webp`, horizon: horizonThen, foot: footThen },
  today: { src: `./scenes/${id}-now.webp`, horizon: horizonToday, foot: footToday },
});

export const SCENES = {
  khufu: scene('khufu', 0.521, '#d9ac65', 0.519, '#d9a964'),
  lunar1504: scene('lunar1504', 0.597, '#fce3a8', 0.597, '#fde3a7'),
  crystalPalace: scene('crystalPalace', 0.627, '#4e724b', 0.629, '#497347'),
  kittyHawk: scene('kittyHawk', 0.600, '#aea54f', 0.600, '#949248'),
  pharos: scene('pharos', 0.628, '#8b7858', 0.628, '#8b7855'),
  eiffel: scene('eiffel', 0.522, '#527a4c', 0.522, '#477c48'),
  sputnik: scene('sputnik', 0.567, '#a3844a', 0.567, '#a58246'),
};
