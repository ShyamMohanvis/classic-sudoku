/**
 * Sudoku Puzzle Generator
 *
 * Pipeline:
 * 1. Generate a complete solved board (seeded)
 * 2. Remove cells while maintaining unique solution
 * 3. Return puzzle + solution
 */

import { solve, countSolutions, createEmptyBoard } from './solver.js';
import { seededShuffle, mulberry32, hashString } from './seed.js';
import { getRemovalCount } from './difficulty.js';

/**
 * Generate a complete valid Sudoku board using seeded RNG.
 */
function generateSolvedBoard(rng) {
  const board = createEmptyBoard();
  fillBoard(board, rng);
  return board;
}

function fillBoard(board, rng) {
  const cell = findEmptyCell(board);
  if (!cell) return true;

  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  seededShuffle(nums, rng);

  for (const num of nums) {
    if (isValidPlacement(board, cell.row, cell.col, num)) {
      board[cell.row][cell.col] = num;
      if (fillBoard(board, rng)) return true;
      board[cell.row][cell.col] = 0;
    }
  }
  return false;
}

function findEmptyCell(board) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) return { row: r, col: c };
    }
  }
  return null;
}

function isValidPlacement(board, row, col, num) {
  for (let c = 0; c < 9; c++) {
    if (board[row][c] === num) return false;
  }
  for (let r = 0; r < 9; r++) {
    if (board[r][col] === num) return false;
  }
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
 * Remove cells from a solved board while ensuring unique solution.
 */
function createPuzzle(solvedBoard, removals, rng) {
  const puzzle = solvedBoard.map(r => [...r]);

  // Create list of all cell positions and shuffle
  const positions = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      positions.push([r, c]);
    }
  }
  seededShuffle(positions, rng);

  let removed = 0;
  for (const [r, c] of positions) {
    if (removed >= removals) break;

    const val = puzzle[r][c];
    puzzle[r][c] = 0;

    // Check uniqueness
    const copy = puzzle.map(row => [...row]);
    if (countSolutions(copy) !== 1) {
      puzzle[r][c] = val; // restore
    } else {
      removed++;
    }
  }

  return puzzle;
}

/**
 * Generate a puzzle with a specific seeded RNG.
 * @param {string} difficulty - 'easy' | 'medium' | 'hard'
 * @param {function} rng - seeded PRNG function
 * @returns {{ puzzle: number[][], solution: number[][] }}
 */
export function generatePuzzle(difficulty, rng) {
  const solution = generateSolvedBoard(rng);
  const removals = getRemovalCount(difficulty, rng);
  const puzzle = createPuzzle(solution, removals, rng);
  return { puzzle, solution };
}



/**
 * Generate a random puzzle (non-deterministic).
 */
export function generateRandomPuzzle(difficulty = 'medium') {
  const seed = Date.now() ^ (Math.random() * 0xffffffff);
  const rng = mulberry32(seed);
  return generatePuzzle(difficulty, rng);
}
