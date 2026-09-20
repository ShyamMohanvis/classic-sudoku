/**
 * Game Controls — Hint, Pencil, Undo, Erase
 */

export function createControls(container, gameState, callbacks) {
  const controls = document.createElement('div');
  controls.className = 'game-controls';

  // Hint button
  const hintBtn = document.createElement('button');
  hintBtn.className = 'control-btn';
  hintBtn.innerHTML = '💡';
  hintBtn.setAttribute('aria-label', 'Use hint');
  hintBtn.addEventListener('click', () => callbacks.onHint?.());

  // Undo button
  const undoBtn = document.createElement('button');
  undoBtn.className = 'control-btn';
  undoBtn.innerHTML = '↩';
  undoBtn.setAttribute('aria-label', 'Undo');
  undoBtn.addEventListener('click', () => callbacks.onUndo?.());

  // Erase button
  const eraseBtn = document.createElement('button');
  eraseBtn.className = 'control-btn';
  eraseBtn.innerHTML = '✕';
  eraseBtn.setAttribute('aria-label', 'Erase cell');
  eraseBtn.addEventListener('click', () => callbacks.onErase?.());

  // Pencil/Notes button
  const pencilBtn = document.createElement('button');
  pencilBtn.className = 'control-btn';
  pencilBtn.innerHTML = '✏️';
  pencilBtn.setAttribute('aria-label', 'Toggle pencil mode');
  pencilBtn.addEventListener('click', () => callbacks.onToggleNotes?.());

  controls.appendChild(hintBtn);
  controls.appendChild(undoBtn);
  controls.appendChild(eraseBtn);
  controls.appendChild(pencilBtn);

  container.appendChild(controls);

  function render() {
    const state = gameState.getState();

    // Update pencil active state
    if (state.isNotesMode) {
      pencilBtn.classList.add('active');
    } else {
      pencilBtn.classList.remove('active');
    }

    // Update hint badge
    const existingBadge = hintBtn.querySelector('.badge');
    if (existingBadge) existingBadge.remove();

    if (state.hintsUsed > 0) {
      const badge = document.createElement('span');
      badge.className = 'badge';
      badge.textContent = state.hintsUsed;
      hintBtn.appendChild(badge);
    }
  }

  return { render, element: controls };
}

/**
 * Set up keyboard controls.
 */
export function setupKeyboard(gameState, callbacks) {
  document.addEventListener('keydown', (e) => {
    const state = gameState.getState();
    if (state.screen !== 'game' || state.completed || state.gameOver) return;

    const key = e.key;

    // Number keys 1-9
    if (key >= '1' && key <= '9') {
      e.preventDefault();
      callbacks.onNumber?.(parseInt(key));
      return;
    }

    // Arrow keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
      e.preventDefault();
      const { selectedCell } = state;
      if (!selectedCell) {
        gameState.selectCell(0, 0);
        return;
      }
      let { row, col } = selectedCell;
      if (key === 'ArrowUp') row = Math.max(0, row - 1);
      if (key === 'ArrowDown') row = Math.min(8, row + 1);
      if (key === 'ArrowLeft') col = Math.max(0, col - 1);
      if (key === 'ArrowRight') col = Math.min(8, col + 1);
      gameState.selectCell(row, col);
      return;
    }

    // Other keys
    switch (key.toLowerCase()) {
      case 'n':
        e.preventDefault();
        callbacks.onToggleNotes?.();
        break;
      case 'h':
        e.preventDefault();
        callbacks.onHint?.();
        break;
      case 'u':
      case 'z':
        if (e.ctrlKey || key === 'u') {
          e.preventDefault();
          callbacks.onUndo?.();
        }
        break;
      case 'delete':
      case 'backspace':
        e.preventDefault();
        callbacks.onErase?.();
        break;
      case 'escape':
        e.preventDefault();
        callbacks.onEscape?.();
        break;
    }
  });
}
