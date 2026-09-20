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

  // Hearts
  const heartsEl = document.createElement('div');
  heartsEl.className = 'header-badge hearts';
  heartsEl.innerHTML = '<span class="heart-icon">♥</span> <span class="lives-count">5</span>';
  left.appendChild(heartsEl);


  // Stars
  const starsEl = document.createElement('div');
  starsEl.className = 'header-badge stars';
  starsEl.innerHTML = '<span class="star-icon">★</span> <span class="stars-count">1</span>';
  right.appendChild(starsEl);

  // Settings
  const settingsBtn = document.createElement('button');
  settingsBtn.className = 'settings-btn';
  settingsBtn.innerHTML = '⚙';
  settingsBtn.setAttribute('aria-label', 'Settings');
  settingsBtn.addEventListener('click', () => callbacks.onSettings?.());
  right.appendChild(settingsBtn);

  header.appendChild(left);
  header.appendChild(right);
  container.appendChild(header);

  function render() {
    const state = gameState.getState();
    const livesCount = heartsEl.querySelector('.lives-count');
    const starsCount = starsEl.querySelector('.stars-count');
    livesCount.textContent = state.lives;
    starsCount.textContent = state.stars;

    // Show/hide hearts based on screen
    if (state.screen === 'game') {
      heartsEl.style.display = 'flex';
    } else {
      heartsEl.style.display = 'none';
    }
  }

  function animateHeartLoss() {
    const heartIcon = heartsEl.querySelector('.heart-icon');
    heartIcon.classList.add('heart-bounce');
    setTimeout(() => heartIcon.classList.remove('heart-bounce'), 500);
  }

  return { render, animateHeartLoss, element: header };
}
