/**
 * Home Screen
 */

import { createLogo } from '../ui/logo.js';

export function createHomeScreen(container, callbacks) {
  const screen = document.createElement('div');
  screen.className = 'screen screen-enter home-screen-layout';
  screen.id = 'home-screen';

  // Logo container
  const logoContainer = document.createElement('div');
  logoContainer.className = 'home-logo-container';
  
  const logoMark = document.createElement('div');
  logoMark.className = 'logo-mark';
  logoMark.innerHTML = '◈';
  
  const logoTitle = document.createElement('div');
  logoTitle.className = 'logo-title-main';
  logoTitle.textContent = 'SUDOKU';

  const logoSubtitle = document.createElement('div');
  logoSubtitle.className = 'logo-subtitle-main';
  logoSubtitle.textContent = 'DAILY PUZZLE';

  logoContainer.appendChild(logoMark);
  logoContainer.appendChild(logoTitle);
  logoContainer.appendChild(logoSubtitle);
  screen.appendChild(logoContainer);

  // Play Button
  const playBtn = document.createElement('button');
  playBtn.className = 'home-play-btn';
  playBtn.innerHTML = '<span class="play-icon">▶</span> PLAY';
  playBtn.addEventListener('click', () => callbacks.onPlay?.());
  screen.appendChild(playBtn);

  // How to Play Button
  const howToPlayBtn = document.createElement('button');
  howToPlayBtn.className = 'home-howto-btn';
  howToPlayBtn.innerHTML = '<span class="howto-icon">?</span> HOW TO PLAY';
  howToPlayBtn.addEventListener('click', () => callbacks.onHowToPlay?.());
  screen.appendChild(howToPlayBtn);

  // Settings Button
  const settingsBtn = document.createElement('button');
  settingsBtn.className = 'home-settings-btn';
  settingsBtn.innerHTML = '⚙';
  settingsBtn.addEventListener('click', () => callbacks.onSettings?.());
  screen.appendChild(settingsBtn);

  container.appendChild(screen);

  return { element: screen };
}
