// Wires core, render and ui together. (Task 6: only the #shot still is drawn so far.)
import './style.css';
import { squareById } from './core/squares.js';
import { momentJd } from './core/moment.js';
import { skyAt } from './core/sky.js';
import { todayDate } from './core/when.js';
import { createSkyCanvas } from './render/skyCanvas.js';

const $ = (id) => document.getElementById(id);
const stage = $('stage');
const skyCanvas = createSkyCanvas($('sky'));
const today = todayDate();

// #shot=<id>,<then|sky|today> draws one still of that square, for screenshots.
const shot = location.hash.match(/^#shot=(\w+),(then|sky|today)$/);
if (shot) {
  const square = squareById(shot[1]);
  const up = shot[2] === 'sky';
  stage.className = 'on-ground';
  skyCanvas.resize();
  const year = shot[2] === 'today' ? today.year : square.date.year;
  const jd = momentJd(square, { year, night: up && square.nightOnLook ? 1 : 0 }, today);
  skyCanvas.draw(skyAt(jd, square), { facingAz: square.facingAz, pitch: up ? 1 : 0, labels: up ? 1 : 0 });
}
