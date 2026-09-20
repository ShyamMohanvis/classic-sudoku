/**
 * Number Pad Component
 */

import { getRelatedValues } from '../sudoku/validator.js';

export function createNumberPad(container, gameState, onNumber) {
  const pad = document.createElement('div');
  pad.className = 'number-pad';
  pad.setAttribute('role', 'group');
  pad.setAttribute('aria-label', 'Number pad');

  const buttons = [];

  for (let n = 1; n <= 9; n++) {
    const btn = document.createElement('button');
    btn.className = 'num-btn';
    btn.textContent = n;
    btn.dataset.num = n;
    btn.setAttribute('aria-label', `Number ${n}`);

    btn.addEventListener('click', () => {
      onNumber(n);
    });

    pad.appendChild(btn);
    buttons.push(btn);
  }

  container.appendChild(pad);

  function render() {
    const state = gameState.getState();
    if (!state.values) return;

    const { selectedCell, values, settings } = state;

    // Count completed numbers
    const numCounts = {};
    for (let n = 1; n <= 9; n++) numCounts[n] = 0;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (values[r][c] !== 0) numCounts[values[r][c]]++;
      }
    }

    // Get impossible numbers for selected cell
    let impossibleNums = new Set();
    if (selectedCell && settings.hideImpossible) {
      const related = getRelatedValues(values, selectedCell.row, selectedCell.col);
      impossibleNums = related;
    }

    for (let i = 0; i < 9; i++) {
      const n = i + 1;
      const btn = buttons[i];
      btn.className = 'num-btn';

      // Mark completed numbers (all 9 placed)
      if (numCounts[n] >= 9) {
        btn.classList.add('completed');
      }

      // Mark impossible numbers
      if (selectedCell && settings.hideImpossible && impossibleNums.has(n) && values[selectedCell.row][selectedCell.col] === 0) {
        btn.classList.add('disabled');
      }
    }
  }

  return { render, element: pad };
}
