/**
 * Sudoku Solver — Backtracking with MRV heuristic
 */

/**
 * Check if placing `num` at (row, col) is valid.
 */
export function isValid(board, row, col, num) {
  // Check row
  for (let c = 0; c < 9; c++) {
    if (board[row][c] === num) return false;
  }
  // Check column
  for (let r = 0; r < 9; r++) {
    if (board[r][col] === num) return false;
  }
  // Check 3x3 box
  const br = Math.floor(row / 3) * 3;
  const bc = Math.floor(col / 3) * 3;
  for (let r = br; r < br + 3; r++) {
    for (let c = bc; c < bc + 3; c++) {
      if (board[r][c] === num) return false;
    }
  }
  return true;
}

/**
 * Get all valid candidates for a cell.
 */
export function getCandidates(board, row, col) {
  if (board[row][col] !== 0) return [];
  const candidates = [];
  for (let n = 1; n <= 9; n++) {
    if (isValid(board, row, col, n)) {
      candidates.push(n);
    }
  }
  return candidates;
}

/**
 * Find the empty cell with fewest candidates (MRV heuristic).
 * Returns { row, col, candidates } or null if board is full.
 */
function findBestCell(board) {
  let best = null;
  let minCount = 10;
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) {
        const cands = getCandidates(board, r, c);
        if (cands.length === 0) return { row: r, col: c, candidates: [] }; // dead end
        if (cands.length < minCount) {
          minCount = cands.length;
          best = { row: r, col: c, candidates: cands };
        }
      }
    }
  }
  return best;
}

/**
 * Solve the board in-place using backtracking + MRV.
 * @returns {boolean} true if a solution was found
 */
export function solve(board) {
  const cell = findBestCell(board);
  if (!cell) return true; // all cells filled
  if (cell.candidates.length === 0) return false; // dead end

  for (const num of cell.candidates) {
    board[cell.row][cell.col] = num;
    if (solve(board)) return true;
    board[cell.row][cell.col] = 0;
  }
  return false;
}

/**
 * Count solutions (stops at 2 to save time).
 * @returns {number} 0, 1, or 2
 */
export function countSolutions(board, limit = 2) {
  const counter = { count: 0 };
  _countSolutions(board, counter, limit);
  return counter.count;
}

function _countSolutions(board, counter, limit) {
  if (counter.count >= limit) return;

  const cell = findBestCell(board);
  if (!cell) {
    counter.count++;
    return;
  }
  if (cell.candidates.length === 0) return;

  for (const num of cell.candidates) {
    board[cell.row][cell.col] = num;
    _countSolutions(board, counter, limit);
    board[cell.row][cell.col] = 0;
    if (counter.count >= limit) return;
  }
}

/**
 * Solve and return the solution without modifying the input.
 */
export function getSolution(board) {
  const copy = board.map(r => [...r]);
  if (solve(copy)) return copy;
  return null;
}

/**
 * Create an empty 9x9 board.
 */
export function createEmptyBoard() {
  return Array.from({ length: 9 }, () => Array(9).fill(0));
}
