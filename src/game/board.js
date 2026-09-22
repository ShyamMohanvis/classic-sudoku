/**
 * Sudoku Board Renderer
 */

export function createBoard(container, gameState) {
  const wrapper = document.createElement('div');
  wrapper.className = 'sudoku-board-wrapper';

  const board = document.createElement('div');
  board.className = 'sudoku-board';
  board.setAttribute('role', 'grid');
  board.setAttribute('aria-label', 'Sudoku puzzle grid');

  const cells = [];

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const cell = document.createElement('button');
      cell.className = 'sudoku-cell';
      cell.setAttribute('role', 'gridcell');
      cell.setAttribute('aria-label', `Row ${r + 1}, Column ${c + 1}`);
      cell.dataset.row = r;
      cell.dataset.col = c;

      cell.addEventListener('click', () => {
        gameState.selectCell(r, c);
      });

      board.appendChild(cell);
      cells.push(cell);
    }
  }

  wrapper.appendChild(board);
  container.appendChild(wrapper);

  function render() {
    const state = gameState.getState();
    if (!state.values) return;

    const { puzzle, values, notes, selectedCell } = state;

    // Count numbers for "completed" digits
    const numCounts = {};
    for (let n = 1; n <= 9; n++) numCounts[n] = 0;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (values[r][c] !== 0) numCounts[values[r][c]]++;
      }
    }

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const idx = r * 9 + c;
        const cell = cells[idx];
        const val = values[r][c];
        const isGiven = puzzle[r][c] !== 0;
        const cellNotes = notes[r][c];

        // Reset classes
        cell.className = 'sudoku-cell';

        // Determine cell state
        if (isGiven) {
          cell.classList.add('given');
        } else if (val !== 0) {
          cell.classList.add('player');
        }

        // Selection highlighting
        if (selectedCell) {
          const sr = selectedCell.row;
          const sc = selectedCell.col;

          if (r === sr && c === sc) {
            cell.classList.add('selected');
          }
        }

        // Content
        // Clear existing content
        cell.textContent = '';

        // Remove existing notes
        const existingNotes = cell.querySelector('.cell-notes');
        if (existingNotes) existingNotes.remove();

        if (val !== 0) {
          cell.textContent = val;
          cell.setAttribute('aria-label', `Row ${r + 1}, Column ${c + 1}, value ${val}${isGiven ? ', given' : ''}`);
        } else if (cellNotes.size > 0) {
          // Show notes
          const notesGrid = document.createElement('div');
          notesGrid.className = 'cell-notes';
          for (let n = 1; n <= 9; n++) {
            const noteEl = document.createElement('span');
            noteEl.className = 'cell-note';
            noteEl.textContent = cellNotes.has(n) ? n : '';
            notesGrid.appendChild(noteEl);
          }
          cell.appendChild(notesGrid);
          cell.setAttribute('aria-label', `Row ${r + 1}, Column ${c + 1}, notes: ${[...cellNotes].join(', ')}`);
        } else {
          cell.setAttribute('aria-label', `Row ${r + 1}, Column ${c + 1}, empty`);
        }
      }
    }
  }

  /**
   * Flash error on a cell.
   */
  function flashError(row, col) {
    const idx = row * 9 + col;
    const cell = cells[idx];
    cell.classList.add('error', 'shake', 'error-flash');
    setTimeout(() => {
      cell.classList.remove('error', 'shake', 'error-flash');
    }, 600);
  }

  /**
   * Flash hint on a cell.
   */
  function flashHint(row, col) {
    const idx = row * 9 + col;
    const cell = cells[idx];
    cell.classList.add('hint-reveal', 'hint-pulse', 'number-placed');
    setTimeout(() => {
      cell.classList.remove('hint-pulse', 'number-placed');
    }, 800);
    setTimeout(() => {
      cell.classList.remove('hint-reveal');
    }, 2000);
  }

  /**
   * Animate correct number placement.
   */
  function animatePlace(row, col) {
    const idx = row * 9 + col;
    const cell = cells[idx];
    cell.classList.add('number-placed');
    setTimeout(() => {
      cell.classList.remove('number-placed');
    }, 300);
  }

  /**
   * Completion pulse on the whole board.
   */
  function animateCompletion() {
    board.classList.add('completion-pulse');
    setTimeout(() => {
      board.classList.remove('completion-pulse');
    }, 1000);
  }

  return { render, flashError, flashHint, animatePlace, animateCompletion, element: wrapper };
}
