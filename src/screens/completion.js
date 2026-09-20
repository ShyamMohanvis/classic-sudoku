/**
 * Completion Screen
 */

import { formatTime } from '../game/timer.js';

export function createCompletionScreen(container, gameState, callbacks) {
  const screen = document.createElement('div');
  screen.className = 'screen screen-enter';
  screen.id = 'completion-screen';

  const state = gameState.getState();

  const completion = document.createElement('div');
  completion.className = 'completion-screen';

  // Confetti
  spawnConfetti();

  // Check mark
  const check = document.createElement('div');
  check.className = 'completion-check check-pop';
  check.innerHTML = '✓';
  completion.appendChild(check);

  // Title
  const title = document.createElement('div');
  title.className = 'completion-title fade-in-up';
  title.textContent = 'SOLVED!';
  completion.appendChild(title);

  // Time
  const time = document.createElement('div');
  time.className = 'completion-time fade-in-up';
  time.style.animationDelay = '0.15s';
  time.textContent = formatTime(state.elapsedSeconds);
  completion.appendChild(time);

  // Stats
  const stats = document.createElement('div');
  stats.className = 'completion-stats fade-in-up';
  stats.style.animationDelay = '0.3s';

  const statsData = [
    ['Difficulty', state.difficulty.charAt(0).toUpperCase() + state.difficulty.slice(1)],
    ['Mistakes', state.mistakes],
    ['Hints', state.hintsUsed],
    ['Streak', state.streak.current],
  ];

  if (state.mode === 'daily' && state.dailyDate) {
    const { year, month, day } = state.dailyDate;
    statsData.unshift(['Date', `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`]);
  }

  statsData.forEach(([label, value]) => {
    const row = document.createElement('div');
    row.className = 'completion-stat';
    row.innerHTML = `
      <span class="completion-stat-label">${label}</span>
      <span class="completion-stat-value">${value}</span>
    `;
    stats.appendChild(row);
  });

  completion.appendChild(stats);

  // Continue button
  const continueBtn = document.createElement('button');
  continueBtn.className = 'continue-btn fade-in-up';
  continueBtn.style.animationDelay = '0.45s';
  continueBtn.textContent = 'Continue';
  continueBtn.addEventListener('click', () => callbacks.onContinue?.());
  completion.appendChild(continueBtn);

  screen.appendChild(completion);
  container.appendChild(screen);

  return { element: screen };
}

function spawnConfetti() {
  const canvas = document.createElement('canvas');
  canvas.className = 'confetti-canvas';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const particles = [];
  const colors = ['#ff6b1a', '#ff8c42', '#ffaa33', '#e04090', '#c4196e', '#66cc66', '#4488ff', '#ffffff'];

  for (let i = 0; i < 80; i++) {
    particles.push({
      x: canvas.width / 2 + (Math.random() - 0.5) * 200,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 12,
      vy: -Math.random() * 15 - 5,
      size: 4 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 10,
      gravity: 0.3,
      opacity: 1,
    });
  }

  let frame = 0;
  const maxFrames = 120;

  function animate() {
    if (frame > maxFrames) {
      canvas.remove();
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.rotSpeed;
      p.opacity = Math.max(0, 1 - frame / maxFrames);
      p.vx *= 0.99;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    });

    frame++;
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}
