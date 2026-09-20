/**
 * Sudoku Validator
 */

/**
 * Check if the board is completely and correctly filled.
 */
export function isComplete(board) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) return false;
    }
  }
  return isBoardValid(board);
}

/**
 * Check if the board has no rule violations.
 * Ignores empty cells.
 */
export function isBoardValid(board) {
  // Check rows
  for (let r = 0; r < 9; r++) {
    if (hasDuplicates(board[r])) return false;
  }
  // Check columns
  for (let c = 0; c < 9; c++) {
    const col = [];
    for (let r = 0; r < 9; r++) col.push(board[r][c]);
    if (hasDuplicates(col)) return false;
  }
  // Check 3x3 boxes
  for (let br = 0; br < 9; br += 3) {
    for (let bc = 0; bc < 9; bc += 3) {
      const box = [];
      for (let r = br; r < br + 3; r++) {
        for (let c = bc; c < bc + 3; c++) {
          box.push(board[r][c]);
        }
      }
      if (hasDuplicates(box)) return false;
    }
  }
  return true;
}

function hasDuplicates(arr) {
  const seen = new Set();
  for (const val of arr) {
    if (val === 0) continue;
    if (seen.has(val)) return true;
    seen.add(val);
  }
  return false;
}

/**
 * Check if a specific value at (row, col) conflicts with existing values.
 */
export function hasConflict(board, row, col, val) {
  if (val === 0) return false;

  // Check row
  for (let c = 0; c < 9; c++) {
    if (c !== col && board[row][c] === val) return true;
  }
  // Check column
  for (let r = 0; r < 9; r++) {
    if (r !== row && board[r][col] === val) return true;
  }
  // Check 3x3 box
  const br = Math.floor(row / 3) * 3;
  const bc = Math.floor(col / 3) * 3;
  for (let r = br; r < br + 3; r++) {
    for (let c = bc; c < bc + 3; c++) {
      if (r !== row || c !== col) {
        if (board[r][c] === val) return true;
      }
    }
  }
  return false;
}

/**
 * Get values in the same row, column, and box as (row, col).
 */
export function getRelatedValues(board, row, col) {
  const vals = new Set();
  // Row
  for (let c = 0; c < 9; c++) {
    if (board[row][c] !== 0) vals.add(board[row][c]);
  }
  // Column
  for (let r = 0; r < 9; r++) {
    if (board[r][col] !== 0) vals.add(board[r][col]);
  }
  // Box
  const br = Math.floor(row / 3) * 3;
  const bc = Math.floor(col / 3) * 3;
  for (let r = br; r < br + 3; r++) {
    for (let c = bc; c < bc + 3; c++) {
      if (board[r][c] !== 0) vals.add(board[r][c]);
    }
  }
  return vals;
}

/**
 * Get possible values for a cell.
 */
export function getPossibleValues(board, row, col) {
  const related = getRelatedValues(board, row, col);
  const possible = [];
  for (let n = 1; n <= 9; n++) {
    if (!related.has(n)) possible.push(n);
  }
  return possible;
}

/**
 * Count how many times each number 1-9 appears on the board.
 * Returns an object { 1: count, 2: count, ... }
 */
export function getNumberCounts(board) {
  const counts = {};
  for (let n = 1; n <= 9; n++) counts[n] = 0;
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] !== 0) counts[board[r][c]]++;
    }
  }
  return counts;
}
