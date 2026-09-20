/**
 * Home Screen
 */

import { createLogo } from '../ui/logo.js';
import { icons } from '../ui/icons.js';

export function createHomeScreen(container, callbacks) {
  const screen = document.createElement('div');
  screen.className = 'screen screen-enter';
  screen.id = 'home-screen';

  // Logo
  const logo = createLogo();
  screen.appendChild(logo);

  // Navigation actions
  const nav = document.createElement('div');
  nav.className = 'nav-actions';

  // Random Sudoku
  const randomAction = createNavAction('🎲', 'New\nSudoku', () => callbacks.onRandom?.());
  nav.appendChild(randomAction);

  // How to Play
  const howtoAction = createNavAction('❓', 'How to\nPlay', () => callbacks.onHowToPlay?.());
  nav.appendChild(howtoAction);

  screen.appendChild(nav);

  // Decorative isometric board
  const deco = createDecorativeBoard();
  screen.appendChild(deco);

  container.appendChild(screen);

  return { element: screen };
}

function createNavAction(emoji, label, onClick) {
  const action = document.createElement('button');
  action.className = 'nav-action';

  const iconEl = document.createElement('div');
  iconEl.className = 'nav-action-icon';
  iconEl.innerHTML = `<span style="font-size: 32px;">${emoji}</span>`;

  const labelEl = document.createElement('span');
  labelEl.className = 'nav-action-label';
  labelEl.textContent = label;

  action.appendChild(iconEl);
  action.appendChild(labelEl);

  action.addEventListener('click', onClick);

  return action;
}

function createDecorativeBoard() {
  const container = document.createElement('div');
  container.style.cssText = 'margin-top: 24px; perspective: 800px; display: flex; justify-content: center;';

  const board = document.createElement('div');
  board.style.cssText = `
    width: 220px; height: 160px;
    background: rgba(255,255,255,0.06);
    border-radius: 16px;
    transform: rotateX(35deg) rotateZ(-3deg);
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    grid-template-rows: repeat(7, 1fr);
    gap: 0;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0,0,0,0.2);
  `;

  // Some example numbers scattered
  const sampleNums = [
    [0,0,'6'],[0,2,'5'],[0,5,'1'],[0,8,'4'],
    [1,1,'9'],[1,3,'2'],[1,7,'1'],
    [2,0,'2'],[2,4,'1'],[2,6,'3'],[2,8,'5'],
    [3,2,'3'],[3,4,'8'],[3,7,'1'],
    [4,0,'1'],[4,3,'3'],[4,5,'7'],
    [5,1,'2'],[5,4,'4'],[5,6,'7'],[5,8,'2'],
    [6,0,'8'],[6,2,'7'],[6,5,'2'],[6,7,'1'],
  ];

  const numMap = {};
  sampleNums.forEach(([r, c, v]) => { numMap[`${r}-${c}`] = v; });

  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < 9; c++) {
      const cell = document.createElement('div');
      cell.style.cssText = `
        display: flex; align-items: center; justify-content: center;
        font-size: 10px; font-weight: 700;
        color: rgba(255,255,255,0.3);
        border-right: 1px solid rgba(255,255,255,0.06);
        border-bottom: 1px solid rgba(255,255,255,0.06);
      `;
      const key = `${r}-${c}`;
      if (numMap[key]) {
        cell.textContent = numMap[key];
        cell.style.color = 'rgba(255,255,255,0.45)';
      }
      board.appendChild(cell);
    }
  }

  container.appendChild(board);
  return container;
}
