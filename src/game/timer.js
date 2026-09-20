/**
 * Timer Component
 */

export function createTimer(container, gameState) {
  const timerEl = document.createElement('div');
  timerEl.className = 'timer-display';
  timerEl.textContent = '00:00';
  container.appendChild(timerEl);

  let intervalId = null;

  function start() {
    stop();
    intervalId = setInterval(() => {
      gameState.tickTimer();
    }, 1000);
  }

  function stop() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function render() {
    const state = gameState.getState();
    const secs = state.elapsedSeconds;
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    timerEl.textContent = `${m}:${s}`;

    if (state.timerRunning && !intervalId) {
      start();
    } else if (!state.timerRunning && intervalId) {
      stop();
    }
  }

  function destroy() {
    stop();
  }

  return { render, start, stop, destroy, element: timerEl };
}

/**
 * Format seconds into MM:SS string.
 */
export function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}
