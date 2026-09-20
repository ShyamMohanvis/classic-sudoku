/**
 * Difficulty Configuration
 */

export const DIFFICULTIES = {
  easy: {
    name: 'Easy',
    givens: [38, 45], // min, max givens
    removals: [36, 43], // 81 - givens
  },
  medium: {
    name: 'Medium',
    givens: [32, 37],
    removals: [44, 49],
  },
  hard: {
    name: 'Hard',
    givens: [25, 31],
    removals: [50, 56],
  },
};

/**
 * Get the number of cells to remove for a difficulty.
 * @param {string} difficulty
 * @param {function} rng - seeded random
 * @returns {number}
 */
export function getRemovalCount(difficulty, rng) {
  const cfg = DIFFICULTIES[difficulty] || DIFFICULTIES.medium;
  const [min, max] = cfg.removals;
  return min + Math.floor(rng() * (max - min + 1));
}
