/**
 * Save Manager — LocalStorage persistence
 */

const SAVE_KEY = 'sudoku_calendar_save_v1';

export function saveGame(gameState) {
  const state = gameState.getState();

  try {
    const existing = loadSaveData() || {};

    const saveData = {
      settings: { ...state.settings },
      stars: state.stars,
      statistics: { ...state.statistics },
      streak: { ...state.streak },
      levelsProgress: { ...state.levelsProgress },
      randomProgress: null,
    };

    // Save current game progress
    if (state.screen === 'game' && state.puzzle && !state.completed) {
      const progress = {
        difficulty: state.difficulty,
        currentLevel: state.currentLevel,
        puzzle: state.puzzle,
        solution: state.solution,
        values: state.values,
        notes: state.notes.map(row => row.map(set => [...set])),
        elapsedSeconds: state.elapsedSeconds,
        mistakes: state.mistakes,
        hintsUsed: state.hintsUsed,
        lives: state.lives,
        completed: state.completed,
      };

      saveData.randomProgress = progress;
    }

    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
  } catch (e) {
    console.warn('Save failed:', e);
  }
}

export function loadSaveData() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Load failed:', e);
  }
  return null;
}

export function loadGameState(gameState) {
  const data = loadSaveData();
  if (!data) return;

  const state = gameState.getState();

  if (data.settings) Object.assign(state.settings, data.settings);
  if (data.statistics) Object.assign(state.statistics, data.statistics);
  if (data.streak) Object.assign(state.streak, data.streak);
  if (data.levelsProgress) Object.assign(state.levelsProgress, data.levelsProgress);
  if (typeof data.stars === 'number') state.stars = data.stars;

  gameState.emit();
}

export function resetProgress() {
  localStorage.removeItem(SAVE_KEY);
}


export function getRandomProgress() {
  const data = loadSaveData();
  return data?.randomProgress || null;
}
