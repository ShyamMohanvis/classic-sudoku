/**
 * App — Main Controller / Router
 */

import { createGameState } from './game/state.js';
import { setupKeyboard } from './game/controls.js';
import { createHomeScreen } from './screens/home.js';
import { createRandomScreen } from './screens/random.js';
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
      case 'random':
        showRandom();
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
      onRandom: () => navigateTo('random'),
      onHowToPlay: () => showHowToPlay(),
    });
  }

  function showRandom() {
    currentScreen = createRandomScreen(containerEl, gameState, {
      onHowToPlay: () => showHowToPlay(),
      onBack: () => navigateTo('home'),
      onStart: (puzzle, solution, difficulty) => {
        gameState.startGame({
          puzzle,
          solution,
          mode: 'random',
          difficulty,
        });
        clearScreen();
        showGame();
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
      onRetry: () => navigateTo('random'),
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
    gameState.update({ stars: gameState.getState().stars + 1 });
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
