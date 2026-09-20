/**
 * Floating Background Numbers
 */

export function createFloatingNumbers() {
  const container = document.getElementById('floating-numbers');
  if (!container) return;

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  function spawnNumber() {
    const el = document.createElement('span');
    el.className = 'floating-number';
    el.textContent = numbers[Math.floor(Math.random() * numbers.length)];

    const size = 20 + Math.random() * 60;
    const left = Math.random() * 100;
    const duration = 15 + Math.random() * 25;
    const delay = Math.random() * 5;

    el.style.fontSize = size + 'px';
    el.style.left = left + '%';
    el.style.bottom = '-60px';
    el.style.animation = `floatDrift ${duration}s linear ${delay}s`;
    el.style.opacity = '0';

    container.appendChild(el);

    // Clean up after animation
    setTimeout(() => {
      el.remove();
    }, (duration + delay) * 1000);
  }

  // Initial spawn
  for (let i = 0; i < 12; i++) {
    setTimeout(() => spawnNumber(), i * 800);
  }

  // Continuous spawn
  const intervalId = setInterval(() => {
    if (container.children.length < 20) {
      spawnNumber();
    }
  }, 2000);

  function destroy() {
    clearInterval(intervalId);
    container.innerHTML = '';
  }

  return { destroy };
}
