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

  // Header
  const header = createHeader(screen, gameState, {
    onSettings: () => callbacks.onSettings?.(),
  });

  // Timer
  const timer = createTimer(screen, gameState);

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
    const result = gameState.placeNumber(num);
    const state = gameState.getState();

    if (result === 'correct') {
      board.animatePlace(state.selectedCell.row, state.selectedCell.col);
    } else if (result === 'wrong') {
      board.flashError(state.selectedCell.row, state.selectedCell.col);
      header.animateHeartLoss();
    }
  });

  container.appendChild(screen);

  function render() {
    board.render();
    numberPad.render();
    controls.render();
    timer.render();
    header.render();

    // Check game over
    const state = gameState.getState();
    if (state.gameOver) {
      showGameOver();
    }
  }

  let gameOverShown = false;

  function showGameOver() {
    if (gameOverShown) return;
    gameOverShown = true;

    const overlay = document.createElement('div');
    overlay.className = 'game-over-overlay game-over-enter';
    overlay.innerHTML = `
      <div class="game-over-title">GAME OVER</div>
      <div class="game-over-subtitle">You've run out of lives</div>
      <button class="start-btn" id="game-over-retry">Try Again</button>
      <button style="padding: 10px 24px; color: rgba(255,255,255,0.6); font-size: 14px; font-weight: 600;">← Home</button>
    `;

    overlay.querySelector('#game-over-retry')?.addEventListener('click', () => {
      overlay.remove();
      gameOverShown = false;
      callbacks.onRetry?.();
    });

    overlay.querySelector('button:last-child')?.addEventListener('click', () => {
      overlay.remove();
      gameOverShown = false;
      callbacks.onHome?.();
    });

    document.body.appendChild(overlay);
  }

  function destroy() {
    timer.destroy();
    gameOverShown = false;
  }

  return { render, destroy, element: screen };
}
