/**
 * Header Component
 */

export function createHeader(container, gameState, callbacks) {
  const header = document.createElement('div');
  header.className = 'game-header';

  const left = document.createElement('div');
  left.className = 'header-left';

  const right = document.createElement('div');
  right.className = 'header-right';

  const center = document.createElement('div');
  center.className = 'header-center';

  // Back Button
  const backBtn = document.createElement('button');
  backBtn.className = 'header-back-btn';
  backBtn.innerHTML = '←';
  backBtn.style.fontSize = '24px';
  backBtn.style.fontWeight = 'bold';
  backBtn.style.padding = '8px';
  backBtn.setAttribute('aria-label', 'Back');
  backBtn.addEventListener('click', () => callbacks.onBack?.());
  left.appendChild(backBtn);

  const diffTitle = document.createElement('div');
  diffTitle.className = 'header-diff-title';
  diffTitle.style.fontSize = '18px';
  diffTitle.style.fontWeight = '800';
  diffTitle.style.letterSpacing = '2px';
  diffTitle.style.textTransform = 'uppercase';

  const timerDisplay = document.createElement('div');
  timerDisplay.className = 'header-timer';
  timerDisplay.style.fontSize = '14px';
  timerDisplay.style.fontWeight = '700';
  timerDisplay.style.color = 'var(--white-dim)';
  timerDisplay.style.marginTop = '2px';

  const centerWrapper = document.createElement('div');
  centerWrapper.style.display = 'flex';
  centerWrapper.style.flexDirection = 'column';
  centerWrapper.style.alignItems = 'center';
  centerWrapper.appendChild(diffTitle);
  centerWrapper.appendChild(timerDisplay);
  center.appendChild(centerWrapper);

  // Settings
  const settingsBtn = document.createElement('button');
  settingsBtn.className = 'settings-btn';
  settingsBtn.innerHTML = '⚙';
  settingsBtn.setAttribute('aria-label', 'Settings');
  settingsBtn.addEventListener('click', () => callbacks.onSettings?.());
  right.appendChild(settingsBtn);

  header.appendChild(left);
  header.appendChild(center);
  header.appendChild(right);
  container.appendChild(header);

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function render() {
    const state = gameState.getState();
    const diffText = state.difficulty ? state.difficulty.toUpperCase() : '';
    
    diffTitle.textContent = diffText;

    // Update color based on difficulty
    diffTitle.style.color = state.difficulty === 'easy' ? 'var(--cyan)' :
                            state.difficulty === 'medium' ? 'var(--purple)' :
                            state.difficulty === 'hard' ? 'var(--magenta)' : 'var(--cyan)';
    diffTitle.style.textShadow = `0 0 10px ${diffTitle.style.color}`;

    timerDisplay.textContent = formatTime(state.elapsedSeconds);
  }

  return { render, element: header };
}
