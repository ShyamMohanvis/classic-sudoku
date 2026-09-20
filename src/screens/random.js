/**
 * Random Sudoku Screen
 */

import { generateRandomPuzzle } from '../sudoku/generator.js';

export function createRandomScreen(container, gameState, callbacks) {
  const screen = document.createElement('div');
  screen.className = 'screen screen-enter';
  screen.id = 'random-screen';

  // Mini nav
  const miniNav = document.createElement('div');
  miniNav.className = 'mini-nav';

  const diceNav = createMiniNavBtn('🎲', true, () => {});
  const helpNav = createMiniNavBtn('❓', false, () => callbacks.onHowToPlay?.());

  miniNav.appendChild(diceNav);
  miniNav.appendChild(helpNav);
  screen.appendChild(miniNav);

  // Title
  const title = document.createElement('div');
  title.className = 'section-title';
  title.textContent = 'Random Sudoku';
  screen.appendChild(title);

  // Difficulty selector
  const diffContainer = document.createElement('div');
  diffContainer.style.cssText = 'display: flex; justify-content: center; margin: 8px 0;';

  const diffSelector = document.createElement('div');
  diffSelector.className = 'difficulty-selector';

  const difficulties = ['easy', 'medium', 'hard'];
  let currentDifficulty = 'medium';
  const diffBtns = {};

  difficulties.forEach(diff => {
    const btn = document.createElement('button');
    btn.className = 'diff-btn' + (diff === currentDifficulty ? ' active' : '');
    btn.textContent = diff.charAt(0).toUpperCase() + diff.slice(1);
    btn.addEventListener('click', () => {
      currentDifficulty = diff;
      difficulties.forEach(d => diffBtns[d].classList.toggle('active', d === diff));
      refreshPreview();
    });
    diffBtns[diff] = btn;
    diffSelector.appendChild(btn);
  });

  diffContainer.appendChild(diffSelector);
  screen.appendChild(diffContainer);

  // Preview board
  const previewContainer = document.createElement('div');
  previewContainer.className = 'preview-container';
  previewContainer.style.cssText = 'display: flex; flex-direction: column; align-items: center;';

  const previewBoard = document.createElement('div');
  previewBoard.className = 'preview-board';
  previewContainer.appendChild(previewBoard);

  // Randomize button
  const randomizeBtn = document.createElement('button');
  randomizeBtn.className = 'randomize-btn';
  randomizeBtn.innerHTML = '↻';
  randomizeBtn.setAttribute('aria-label', 'Generate new puzzle');
  randomizeBtn.addEventListener('click', () => {
    randomizeBtn.classList.add('spin');
    setTimeout(() => randomizeBtn.classList.remove('spin'), 500);
    refreshPreview();
  });
  previewContainer.appendChild(randomizeBtn);

  screen.appendChild(previewContainer);

  // Start button
  const startBtn = document.createElement('button');
  startBtn.className = 'start-btn';
  startBtn.textContent = 'START';
  startBtn.addEventListener('click', () => {
    if (currentPuzzle) {
      callbacks.onStart?.(currentPuzzle.puzzle, currentPuzzle.solution, currentDifficulty);
    }
  });
  screen.appendChild(startBtn);

  // Back button
  const backBtn = document.createElement('button');
  backBtn.style.cssText = 'margin-top: 16px; padding: 10px 24px; font-size: 14px; color: rgba(255,255,255,0.6); font-weight: 600;';
  backBtn.textContent = '← Back';
  backBtn.addEventListener('click', () => callbacks.onBack?.());
  screen.appendChild(backBtn);

  container.appendChild(screen);

  let currentPuzzle = null;

  function refreshPreview() {
    // Generate puzzle in background
    currentPuzzle = generateRandomPuzzle(currentDifficulty);
    renderPreview();
  }

  function renderPreview() {
    if (!currentPuzzle) return;
    previewBoard.innerHTML = '';

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const cell = document.createElement('div');
        cell.className = 'preview-cell';
        const val = currentPuzzle.puzzle[r][c];
        cell.textContent = val !== 0 ? val : '';
        previewBoard.appendChild(cell);
      }
    }
  }

  // Initial preview
  refreshPreview();

  return { element: screen };
}

function createMiniNavBtn(emoji, active, onClick) {
  const btn = document.createElement('button');
  btn.className = 'mini-nav-btn' + (active ? ' active' : '');
  btn.innerHTML = emoji;
  btn.addEventListener('click', onClick);
  return btn;
}
