/**
 * Seeded PRNG — Mulberry32
 * Deterministic random number generator for daily puzzles.
 */

export function mulberry32(seed) {
  let s = seed | 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Hash a string to a 32-bit integer seed.
 */
export function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    hash = ((hash << 5) - hash + ch) | 0;
  }
  return hash >>> 0;
}

/**
 * Create a daily seed string from a date and difficulty.
 * @param {number} year
 * @param {number} month (1-12)
 * @param {number} day
 * @param {string} difficulty - 'easy' | 'medium' | 'hard'
 * @returns {string}
 */
export function dailySeedString(year, month, day, difficulty = 'medium') {
  const m = String(month).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}-${difficulty}-v1`;
}

/**
 * Get a seeded PRNG for a specific date.
 */
export function dailyRNG(year, month, day, difficulty) {
  const seedStr = dailySeedString(year, month, day, difficulty);
  const seed = hashString(seedStr);
  return mulberry32(seed);
}

/**
 * Shuffle array in-place using Fisher-Yates with a seeded RNG.
 */
export function seededShuffle(arr, rng) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
