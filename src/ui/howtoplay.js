/**
 * How To Play Modal
 */

import { createModal } from './modal.js';

export function showHowToPlay() {
  const modal = createModal();

  const el = document.createElement('div');
  el.innerHTML = `
    <div class="modal-title">HOW TO PLAY</div>

    <div class="howto-steps">
      <div class="howto-step">
        <div class="howto-step-num">1</div>
        <div class="howto-step-text">Select an empty cell on the Sudoku grid by clicking or tapping it.</div>
      </div>
      <div class="howto-step">
        <div class="howto-step-num">2</div>
        <div class="howto-step-text">Choose a number (1-9) from the number pad below the grid.</div>
      </div>
      <div class="howto-step">
        <div class="howto-step-num">3</div>
        <div class="howto-step-text">Each <strong>row</strong> must contain the numbers 1-9 exactly once.</div>
      </div>
      <div class="howto-step">
        <div class="howto-step-num">4</div>
        <div class="howto-step-text">Each <strong>column</strong> must contain the numbers 1-9 exactly once.</div>
      </div>
      <div class="howto-step">
        <div class="howto-step-num">5</div>
        <div class="howto-step-text">Each <strong>3×3 box</strong> must contain the numbers 1-9 exactly once.</div>
      </div>
      <div class="howto-step">
        <div class="howto-step-num">6</div>
        <div class="howto-step-text">Use <strong>pencil mode</strong> ✏️ to write candidate notes in cells when you're not sure.</div>
      </div>
      <div class="howto-step">
        <div class="howto-step-num">7</div>
        <div class="howto-step-text">Use the <strong>hint</strong> 💡 button when stuck — it reveals the correct number for a cell.</div>
      </div>
    </div>

    <div class="modal-divider"></div>

    <div style="font-size: 13px; color: rgba(255,255,255,0.5); text-align: center; padding: 8px 0;">
      Keyboard: 1-9 numbers · Arrows to move · N notes · H hint · U undo
    </div>

    <button class="modal-close-btn">Got It!</button>
  `;

  el.querySelector('.modal-close-btn').addEventListener('click', () => {
    modal.hide();
  });

  modal.show(el);
}
