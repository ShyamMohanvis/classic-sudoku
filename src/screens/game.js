/**
 * Game Screen — Orchestrates board, controls, number pad
 */

import { createBoard } from '../game/board.js';
import { createNumberPad } from '../game/numberpad.js';
import { createControls } from '../game/controls.js';
import { createTimer } from '../game/timer.js';
import { createHeader } from '../ui/header.js';

export function createGameScreen(container, gameState, callbacks) {
  const screen = document.createElement('div');
  screen.className = 'screen screen-enter';
  screen.id = 'game-screen';

  let isPaused = false;
  let gameOverShown = false;

  // Header
  const header = createHeader(screen, gameState, {
    onSettings: () => callbacks.onSettings?.(),
    onBack: () => showPauseMenu(),
  });

  // Lives Display
  const livesContainer = document.createElement('div');
  livesContainer.style.display = 'flex';
  livesContainer.style.justifyContent = 'center';
  livesContainer.style.gap = '8px';
  livesContainer.style.margin = '16px 0';
  screen.appendChild(livesContainer);

  // Timer (Hidden, just runs interval)
  const timer = createTimer(screen, gameState);
  timer.element.style.display = 'none';

  // Board
  const board = createBoard(screen, gameState);

  // Controls
  const controls = createControls(screen, gameState, {
    onHint: () => {
      const result = gameState.useHint();
      if (result) {
        board.flashHint(result.row, result.col);
      }
    },
    onUndo: () => gameState.undo(),
    onErase: () => gameState.clearCell(),
    onToggleNotes: () => gameState.toggleNotesMode(),
  });

  // Number pad
  const numberPad = createNumberPad(screen, gameState, (num) => {
    if (num === 'erase') {
      gameState.clearCell();
      return;
    }
    
    const result = gameState.placeNumber(num);
    const state = gameState.getState();

    if (result === 'correct') {
      board.animatePlace(state.selectedCell.row, state.selectedCell.col);
    } else if (result === 'invalid') {
      board.flashError(state.selectedCell.row, state.selectedCell.col);
      showToast('INVALID MOVE\n-1 LIFE');
    }
  });

  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'game-toast fade-in-up';
    toast.innerText = message;
    toast.style.textAlign = 'center';
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('fade-out-down');
      setTimeout(() => toast.remove(), 300);
    }, 1500);
  }

  function renderLives() {
    const state = gameState.getState();
    livesContainer.innerHTML = '';
    for (let i = 0; i < 3; i++) {
      const heart = document.createElement('span');
      heart.textContent = '♥';
      heart.style.fontSize = '24px';
      if (i < state.lives) {
        heart.style.color = 'var(--cyan)';
        heart.style.textShadow = '0 0 10px var(--cyan)';
      } else {
        heart.style.color = 'rgba(255, 255, 255, 0.2)';
        heart.style.textShadow = 'none';
      }
      livesContainer.appendChild(heart);
    }
  }

  function showPauseMenu() {
    if (isPaused || gameOverShown) return;
    isPaused = true;
    gameState.pauseTimer();

    const overlay = document.createElement('div');
    overlay.className = 'game-over-overlay game-over-enter';
    overlay.innerHTML = `
      <div class="game-over-title" style="color: var(--white); text-shadow: 0 0 15px var(--white);">PAUSED</div>
      <div style="display:flex; flex-direction:column; gap:16px; margin-top:24px;">
        <button class="start-btn" id="pause-resume">Resume</button>
        <button class="start-btn" id="pause-restart" style="background: rgba(255,0,0,0.1); border-color: #ff4466; color: #ff4466; box-shadow: 0 0 10px rgba(255,68,102,0.4);">Restart</button>
        <button class="start-btn" id="pause-home" style="background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.3); color: white; box-shadow: none;">Main Menu</button>
      </div>
    `;

    overlay.querySelector('#pause-resume')?.addEventListener('click', () => {
      overlay.remove();
      isPaused = false;
      gameState.resumeTimer();
    });

    overlay.querySelector('#pause-restart')?.addEventListener('click', () => {
      overlay.remove();
      isPaused = false;
      gameState.restartGame();
    });

    overlay.querySelector('#pause-home')?.addEventListener('click', () => {
      overlay.remove();
      isPaused = false;
      callbacks.onHome?.();
    });

    document.body.appendChild(overlay);
  }

  function showGameOver() {
    if (gameOverShown) return;
    gameOverShown = true;
    gameState.pauseTimer();

    const overlay = document.createElement('div');
    overlay.className = 'game-over-overlay game-over-enter';
    overlay.innerHTML = `
      <div class="game-over-title">GAME OVER</div>
      <div class="game-over-subtitle">OUT OF LIVES</div>
      <div style="display:flex; flex-direction:column; gap:16px; margin-top:24px;">
        <button class="start-btn" id="game-over-retry">Try Again</button>
        <button class="start-btn" id="game-over-home" style="background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.3); color: white; box-shadow: none;">Main Menu</button>
      </div>
    `;

    overlay.querySelector('#game-over-retry')?.addEventListener('click', () => {
      overlay.remove();
      gameOverShown = false;
      gameState.restartGame(); // Triggers restart of current puzzle
    });

    overlay.querySelector('#game-over-home')?.addEventListener('click', () => {
      overlay.remove();
      gameOverShown = false;
      callbacks.onHome?.();
    });

    document.body.appendChild(overlay);
  }

  container.appendChild(screen);

  function render() {
    board.render();
    numberPad.render();
    controls.render();
    timer.render();
    header.render();
    renderLives();

    const state = gameState.getState();
    if (state.gameOver) {
      showGameOver();
    }
  }

  function destroy() {
    timer.destroy();
    gameOverShown = false;
  }

  return { render, destroy, element: screen };
}
