/**
 * Sudoku Calendar — Entry Point
 */

import './styles/main.css';
import './styles/animations.css';
import { createApp } from './app.js';

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = createApp();

  // Expose for debugging
  if (import.meta.env.DEV) {
    window.__sudoku = app;
  }
});
