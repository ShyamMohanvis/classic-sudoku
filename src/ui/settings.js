/**
 * Settings Modal
 */

import { createModal } from './modal.js';

export function showSettings(gameState, callbacks) {
  const modal = createModal();
  const state = gameState.getState();

  const el = document.createElement('div');
  el.innerHTML = `
    <div class="modal-title">SETTINGS</div>

    <div class="setting-row">
      <span class="setting-label">Sound</span>
      <div class="toggle-switch ${state.settings.sound ? 'on' : ''}" data-setting="sound"></div>
    </div>
    <div class="setting-row">
      <span class="setting-label">Music</span>
      <div class="toggle-switch ${state.settings.music ? 'on' : ''}" data-setting="music"></div>
    </div>
    <div class="setting-row">
      <span class="setting-label">Animations</span>
      <div class="toggle-switch ${state.settings.animations ? 'on' : ''}" data-setting="animations"></div>
    </div>
    <div class="setting-row">
      <span class="setting-label">Hide impossible</span>
      <div class="toggle-switch ${state.settings.hideImpossible ? 'on' : ''}" data-setting="hideImpossible"></div>
    </div>

    <div class="modal-divider"></div>

    <button class="setting-btn" data-action="statistics">📊 Statistics</button>
    <button class="setting-btn" data-action="howtoplay">❓ How To Play</button>

    <div class="modal-divider"></div>

    <button class="setting-btn danger" data-action="reset">🗑️ Reset Progress</button>

    <button class="modal-close-btn">Close</button>
  `;

  // Toggle switches
  el.querySelectorAll('.toggle-switch').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const setting = toggle.dataset.setting;
      state.settings[setting] = !state.settings[setting];
      toggle.classList.toggle('on');
      gameState.emit();
      callbacks.onSave?.();
    });
  });

  // Action buttons
  el.querySelectorAll('.setting-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      if (action === 'statistics') {
        modal.hide();
        callbacks.onStatistics?.();
      } else if (action === 'howtoplay') {
        modal.hide();
        callbacks.onHowToPlay?.();
      } else if (action === 'reset') {
        showResetConfirmation(modal, gameState, callbacks);
      }
    });
  });

  // Close button
  el.querySelector('.modal-close-btn').addEventListener('click', () => {
    modal.hide();
    callbacks.onClose?.();
  });

  modal.show(el, () => {
    if (state.screen === 'game') {
      gameState.resumeTimer();
    }
  });

  // Pause timer when settings open
  if (state.screen === 'game') {
    gameState.pauseTimer();
  }
}

function showResetConfirmation(modal, gameState, callbacks) {
  const el = document.createElement('div');
  el.className = 'confirm-dialog';
  el.innerHTML = `
    <div class="modal-title">Reset Progress</div>
    <p>This will delete all local progress including completed puzzles, statistics, and streaks.</p>
    <div class="confirm-actions">
      <button class="confirm-cancel">Cancel</button>
      <button class="confirm-danger">Reset</button>
    </div>
  `;

  el.querySelector('.confirm-cancel').addEventListener('click', () => {
    modal.hide();
  });

  el.querySelector('.confirm-danger').addEventListener('click', () => {
    callbacks.onReset?.();
    modal.hide();
  });

  modal.setContent(el);
}
