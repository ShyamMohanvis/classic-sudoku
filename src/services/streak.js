/**
 * Streak Manager
 */

export function updateStreak(gameState) {
  const state = gameState.getState();

  const streak = state.streak;
  streak.current++;

  if (streak.current > streak.longest) {
    streak.longest = streak.current;
  }

  // Update statistics
  state.statistics.currentStreak = streak.current;
  state.statistics.longestStreak = streak.longest;

  gameState.emit();
}

export function breakStreak(gameState) {
  const state = gameState.getState();
  state.streak.current = 0;
  state.statistics.currentStreak = 0;
  gameState.emit();
}
