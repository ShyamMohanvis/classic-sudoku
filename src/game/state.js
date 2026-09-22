/**
 * Game State Manager
 * Central state with event-driven updates.
 */

export function createGameState() {
  const listeners = new Set();

  const state = {
    // Current screen
    screen: 'home', // 'home' | 'random' | 'calendar' | 'game' | 'completion'

    // Game level/difficulty
    difficulty: 'medium',
    currentLevel: 1,
    levelsProgress: { easy: 1, medium: 1, hard: 1 },

    // Puzzle data
    puzzle: null,       // original puzzle (givens)
    solution: null,     // complete solution
    values: null,       // current player values (9x9)
    notes: null,        // notes (9x9 array of Sets)

    // Selection
    selectedCell: null, // { row, col } or null

    // Game status
    lives: 5,
    maxLives: 5,
    hintsUsed: 0,
    mistakes: 0,
    elapsedSeconds: 0,
    isNotesMode: false,
    completed: false,
    gameOver: false,

    // Timer
    timerRunning: false,

    // Undo stack
    undoStack: [],

    // Settings
    settings: {
      sound: true,
      music: false,
      animations: true,
      hideImpossible: true,
    },

    // Statistics
    statistics: {
      gamesPlayed: 0,
      gamesCompleted: 0,
      currentStreak: 0,
      longestStreak: 0,
      bestTime: null,
      averageTime: null,
      totalMistakes: 0,
      totalHints: 0,
    },

    // Streak
    streak: {
      current: 0,
      longest: 0,
      lastCompletedDate: null,
    },

    // Stars / currency
    stars: 1,
  };

  function emit() {
    for (const fn of listeners) {
      try { fn(state); } catch (e) { console.error(e); }
    }
  }

  function update(partial) {
    Object.assign(state, partial);
    emit();
  }

  function subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  function getState() {
    return state;
  }

  /**
   * Initialize a new game.
   */
  function startGame({ puzzle, solution, difficulty, level }) {
    const values = puzzle.map(r => [...r]);
    const notes = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => new Set()));

    Object.assign(state, {
      screen: 'game',
      difficulty,
      currentLevel: level,
      puzzle,
      solution,
      values,
      notes,
      selectedCell: null,
      lives: 3, // Exactly 3 lives
      maxLives: 3,
      hintsUsed: 0,
      mistakes: 0,
      elapsedSeconds: 0,
      isNotesMode: false,
      completed: false,
      gameOver: false,
      timerRunning: true,
      undoStack: [],
    });

    state.statistics.gamesPlayed++;
    emit();
  }

  /**
   * Restart the current puzzle.
   */
  function restartGame() {
    const { puzzle } = state;
    if (!puzzle) return;

    state.values = puzzle.map(r => [...r]);
    state.notes = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => new Set()));
    state.selectedCell = null;
    state.lives = 3;
    state.elapsedSeconds = 0;
    state.completed = false;
    state.gameOver = false;
    state.timerRunning = true;
    state.undoStack = [];
    emit();
  }

  /**
   * Place a number in the selected cell.
   * Returns 'correct', 'invalid', or 'notes'.
   */
  function placeNumber(num) {
    const { selectedCell, puzzle, solution, values, notes, isNotesMode, lives } = state;
    if (!selectedCell || state.completed || state.gameOver) return null;

    const { row, col } = selectedCell;

    // Can't modify given cells or correctly filled cells
    if (puzzle[row][col] !== 0) return null;
    if (values[row][col] !== 0) return null;

    if (isNotesMode) {
      // Toggle note
      const cellNotes = notes[row][col];
      if (cellNotes.has(num)) {
        cellNotes.delete(num);
      } else {
        cellNotes.add(num);
      }
      state.undoStack.push({ type: 'note', row, col, num });
      emit();
      return 'notes';
    }

    if (solution[row][col] === num) {
      // Correct
      // Save undo for potential future changes, though correct values shouldn't be cleared.
      state.undoStack.push({ type: 'value', row, col, oldVal: 0 });
      values[row][col] = num;
      notes[row][col].clear();
      removeNoteFromRelated(row, col, num);

      if (checkCompletion()) {
        state.completed = true;
        state.timerRunning = false;
        state.screen = 'completion';
      }

      emit();
      return 'correct';
    } else {
      // Invalid Move: Does not match solution
      state.mistakes++;
      state.lives = Math.max(0, lives - 1);

      if (state.lives <= 0) {
        state.gameOver = true;
        state.timerRunning = false;
      }

      emit();
      return 'invalid';
    }
  }

  function removeNoteFromRelated(row, col, num) {
    const { notes } = state;
    // Same row
    for (let c = 0; c < 9; c++) notes[row][c].delete(num);
    // Same col
    for (let r = 0; r < 9; r++) notes[r][col].delete(num);
    // Same box
    const br = Math.floor(row / 3) * 3;
    const bc = Math.floor(col / 3) * 3;
    for (let r = br; r < br + 3; r++) {
      for (let c = bc; c < bc + 3; c++) {
        notes[r][c].delete(num);
      }
    }
  }

  function checkCompletion() {
    const { values, solution } = state;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (values[r][c] !== solution[r][c]) return false;
      }
    }
    return true;
  }

  /**
   * Use a hint.
   */
  function useHint() {
    const { selectedCell, puzzle, solution, values, notes } = state;
    if (state.completed || state.gameOver) return null;

    let row, col;

    if (selectedCell && puzzle[selectedCell.row][selectedCell.col] === 0 && values[selectedCell.row][selectedCell.col] === 0) {
      row = selectedCell.row;
      col = selectedCell.col;
    } else {
      // Find an empty cell
      const emptyCells = [];
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (values[r][c] === 0) {
            emptyCells.push({ row: r, col: c });
          }
        }
      }
      if (emptyCells.length === 0) return null;
      const idx = Math.floor(Math.random() * emptyCells.length);
      row = emptyCells[idx].row;
      col = emptyCells[idx].col;
    }

    // Reveal
    const num = solution[row][col];
    values[row][col] = num;
    notes[row][col].clear();
    removeNoteFromRelated(row, col, num);
    state.hintsUsed++;
    state.selectedCell = { row, col };

    // Check completion
    if (checkCompletion()) {
      state.completed = true;
      state.timerRunning = false;
      state.screen = 'completion';
    }

    emit();
    return { row, col, num };
  }

  /**
   * Undo last action.
   */
  function undo() {
    const { undoStack, values, notes } = state;
    if (undoStack.length === 0 || state.completed) return;

    const action = undoStack.pop();
    if (action.type === 'value') {
      values[action.row][action.col] = action.oldVal;
    } else if (action.type === 'note') {
      const cellNotes = notes[action.row][action.col];
      if (cellNotes.has(action.num)) {
        cellNotes.delete(action.num);
      } else {
        cellNotes.add(action.num);
      }
    }
    emit();
  }

  /**
   * Clear selected cell.
   */
  function clearCell() {
    const { selectedCell, puzzle, values, notes } = state;
    if (!selectedCell || state.completed) return;

    const { row, col } = selectedCell;
    if (puzzle[row][col] !== 0) return; // can't clear given

    if (values[row][col] !== 0) {
      state.undoStack.push({ type: 'value', row, col, oldVal: values[row][col] });
      values[row][col] = 0;
    }
    notes[row][col].clear();
    emit();
  }

  /**
   * Select a cell.
   */
  function selectCell(row, col) {
    if (state.completed || state.gameOver) return;
    state.selectedCell = { row, col };
    emit();
  }

  function deselectCell() {
    state.selectedCell = null;
    emit();
  }

  function toggleNotesMode() {
    state.isNotesMode = !state.isNotesMode;
    emit();
  }

  function tickTimer() {
    if (state.timerRunning && !state.completed && !state.gameOver) {
      state.elapsedSeconds++;
      emit();
    }
  }

  function pauseTimer() {
    state.timerRunning = false;
  }

  function resumeTimer() {
    if (!state.completed && !state.gameOver) {
      state.timerRunning = true;
    }
  }

  return {
    getState,
    update,
    subscribe,
    startGame,
    restartGame,
    placeNumber,
    useHint,
    undo,
    clearCell,
    selectCell,
    deselectCell,
    toggleNotesMode,
    tickTimer,
    pauseTimer,
    resumeTimer,
    emit,
  };
}
