/**
 * Statistics Manager
 */

import { createModal } from '../ui/modal.js';
import { formatTime } from '../game/timer.js';

export function updateStatistics(gameState) {
  const state = gameState.getState();
  if (!state.completed) return;

  const stats = state.statistics;
  stats.gamesCompleted++;
  stats.totalMistakes += state.mistakes;
  stats.totalHints += state.hintsUsed;

  // Best time
  if (stats.bestTime === null || state.elapsedSeconds < stats.bestTime) {
    stats.bestTime = state.elapsedSeconds;
  }

  // Average time
  if (stats.averageTime === null) {
    stats.averageTime = state.elapsedSeconds;
  } else {
    stats.averageTime = Math.round(
      (stats.averageTime * (stats.gamesCompleted - 1) + state.elapsedSeconds) / stats.gamesCompleted
    );
  }

  gameState.emit();
}

export function showStatistics(gameState) {
  const modal = createModal();
  const stats = gameState.getState().statistics;
  const streak = gameState.getState().streak;

  const el = document.createElement('div');
  el.innerHTML = `
    <div class="modal-title">STATISTICS</div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">${stats.gamesPlayed}</div>
        <div class="stat-label">Games Played</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${stats.gamesCompleted}</div>
        <div class="stat-label">Completed</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${streak.current}</div>
        <div class="stat-label">Current Streak</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${streak.longest}</div>
        <div class="stat-label">Longest Streak</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${stats.bestTime ? formatTime(stats.bestTime) : '--:--'}</div>
        <div class="stat-label">Best Time</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${stats.averageTime ? formatTime(stats.averageTime) : '--:--'}</div>
        <div class="stat-label">Avg Time</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${stats.totalMistakes}</div>
        <div class="stat-label">Total Mistakes</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${stats.totalHints}</div>
        <div class="stat-label">Hints Used</div>
      </div>
    </div>

    <button class="modal-close-btn">Close</button>
  `;

  el.querySelector('.modal-close-btn').addEventListener('click', () => modal.hide());
  modal.show(el);
}
