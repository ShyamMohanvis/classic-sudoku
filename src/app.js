/**
 * App — Main Controller / Router
 */

import { createGameState } from './game/state.js';
import { setupKeyboard } from './game/controls.js';
import { createHomeScreen } from './screens/home.js';
import { createDifficultyScreen } from './screens/difficulty.js';
import { LEVELS } from './game/levels.js';
import { createGameScreen } from './screens/game.js';
import { createCompletionScreen } from './screens/completion.js';
import { showSettings } from './ui/settings.js';
import { showHowToPlay } from './ui/howtoplay.js';
import { showStatistics, updateStatistics } from './services/statistics.js';
import { updateStreak } from './services/streak.js';
import { saveGame, loadGameState, resetProgress } from './services/save.js';
import { createFloatingNumbers } from './ui/background.js';

export function createApp() {
  const containerEl = document.getElementById('screen-container');
  const gameState = createGameState();

  let currentScreen = null;
  let gameScreen = null;
  let floatingNumbers = null;

  // Load saved state
  loadGameState(gameState);

  // Start floating numbers
  floatingNumbers = createFloatingNumbers();

  // Auto-save interval
  setInterval(() => {
    const state = gameState.getState();
    if (state.screen === 'game' && !state.completed) {
      saveGame(gameState);
    }
  }, 10000);

  // Keyboard controls
  setupKeyboard(gameState, {
    onNumber: (num) => {
      const result = gameState.placeNumber(num);
      if (gameScreen && result) {
        const state = gameState.getState();
        if (result === 'correct') {
          // State updated in placeNumber
        } else if (result === 'wrong') {
          // Animations handled in render
        }
        renderCurrentScreen();

        if (state.completed) {
          handleCompletion();
        }
      }
    },
    onToggleNotes: () => {
      gameState.toggleNotesMode();
      renderCurrentScreen();
    },
    onHint: () => {
      const result = gameState.useHint();
      renderCurrentScreen();
      const state = gameState.getState();
      if (state.completed) {
        handleCompletion();
      }
    },
    onUndo: () => {
      gameState.undo();
      renderCurrentScreen();
    },
    onErase: () => {
      gameState.clearCell();
      renderCurrentScreen();
    },
    onEscape: () => {
      // Close any modals or deselect
      gameState.deselectCell();
      renderCurrentScreen();
    },
  });

  // Subscribe to state changes
  gameState.subscribe(() => {
    renderCurrentScreen();
  });

  function navigateTo(screen) {
    clearScreen();
    gameState.update({ screen });

    switch (screen) {
      case 'home':
        showHome();
        break;
      case 'difficulty':
        showDifficulty();
        break;
      case 'game':
        showGame();
        break;
      case 'completion':
        showCompletion();
        break;
    }
  }

  function clearScreen() {
    if (gameScreen) {
      gameScreen.destroy();
      gameScreen = null;
    }
    containerEl.innerHTML = '';
    currentScreen = null;
  }

  function showHome() {
    currentScreen = createHomeScreen(containerEl, {
      onPlay: () => navigateTo('difficulty'),
      onHowToPlay: () => showHowToPlay(),
    });
  }

  function showDifficulty() {
    currentScreen = createDifficultyScreen(containerEl, {
      onBack: () => navigateTo('home'),
      onSelect: (difficulty) => {
        const state = gameState.getState();
        const levelNum = state.levelsProgress[difficulty] || 1;
        
        // Find puzzle data
        const levelData = LEVELS[difficulty].find(l => l.id === levelNum);
        
        if (levelData) {
          gameState.startGame({
            puzzle: levelData.puzzle,
            solution: levelData.solution,
            difficulty: difficulty,
            level: levelNum
          });
          clearScreen();
          showGame();
        } else {
          // If they beat all 20, reset them or show congrats
          alert(`You beat all 20 levels of ${difficulty.toUpperCase()}!`);
          navigateTo('difficulty');
        }
      },
    });
  }

  function showGame() {
    gameScreen = createGameScreen(containerEl, gameState, {
      onSettings: () => {
        showSettings(gameState, {
          onSave: () => saveGame(gameState),
          onStatistics: () => showStatistics(gameState),
          onHowToPlay: () => showHowToPlay(),
          onReset: () => {
            resetProgress();
            location.reload();
          },
          onClose: () => {
            gameState.resumeTimer();
            renderCurrentScreen();
          },
        });
      },
      onRetry: () => {
        const state = gameState.getState();
        const levelData = LEVELS[state.difficulty].find(l => l.id === state.currentLevel);
        gameState.startGame({
          puzzle: levelData.puzzle,
          solution: levelData.solution,
          difficulty: state.difficulty,
          level: state.currentLevel
        });
        renderCurrentScreen();
      },
      onHome: () => navigateTo('home'),
    });
    currentScreen = gameScreen;
    renderCurrentScreen();
  }

  function showCompletion() {
    currentScreen = createCompletionScreen(containerEl, gameState, {
      onContinue: () => {
        saveGame(gameState);
        navigateTo('home');
      },
    });
  }

  function handleCompletion() {
    updateStatistics(gameState);
    updateStreak(gameState);
    
    // Auto advance level
    const state = gameState.getState();
    let nextLevelNum = state.currentLevel + 1;
    
    if (nextLevelNum > 20) {
      // Completed the mode
      gameState.update({ stars: state.stars + 5 });
      saveGame(gameState);
      
      setTimeout(() => {
        clearScreen();
        alert(`CONGRATULATIONS! You completed all ${state.difficulty.toUpperCase()} levels!`);
        navigateTo('difficulty');
      }, 800);
      return;
    }
    
    // Update progress
    gameState.update({ 
      stars: state.stars + 1,
      levelsProgress: {
        ...state.levelsProgress,
        [state.difficulty]: Math.max(state.levelsProgress[state.difficulty], nextLevelNum)
      }
    });
    
    saveGame(gameState);

    setTimeout(() => {
      clearScreen();
      gameState.update({ screen: 'completion' });
      showCompletion();
    }, 800);
  }

  function renderCurrentScreen() {
    if (gameScreen && gameState.getState().screen === 'game') {
      gameScreen.render();
    }
  }

  // Initial screen
  navigateTo('home');

  return { gameState, navigateTo };
}
