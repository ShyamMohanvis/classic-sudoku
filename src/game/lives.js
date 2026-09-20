/**
 * Lives / Hearts Display
 */

export function createLives(container, gameState) {
  const el = document.createElement('div');
  el.className = 'header-badge hearts';
  el.innerHTML = '<span class="heart-icon">♥</span> <span class="lives-count">5</span>';
  container.appendChild(el);

  const countEl = el.querySelector('.lives-count');
  const heartIcon = el.querySelector('.heart-icon');

  function render() {
    const state = gameState.getState();
    countEl.textContent = state.lives;
    el.setAttribute('aria-label', `${state.lives} lives remaining`);
  }

  function animateLoss() {
    heartIcon.classList.add('heart-bounce');
    setTimeout(() => heartIcon.classList.remove('heart-bounce'), 500);
  }

  return { render, animateLoss, element: el };
}
