/**
 * Logo Component
 */

export function createLogo() {
  const container = document.createElement('div');
  container.className = 'logo-container';

  // SVG logo icon - circular Sudoku motif
  const logoIcon = document.createElement('div');
  logoIcon.className = 'logo-icon';
  logoIcon.innerHTML = `
    <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#9b1060"/>
          <stop offset="50%" style="stop-color:#c44030"/>
          <stop offset="100%" style="stop-color:#ff8c42"/>
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="38" fill="url(#logoGrad)" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
      <!-- 3x3 grid -->
      <rect x="16" y="16" width="48" height="48" rx="4" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>
      <line x1="32" y1="16" x2="32" y2="64" stroke="rgba(255,255,255,0.25)" stroke-width="1"/>
      <line x1="48" y1="16" x2="48" y2="64" stroke="rgba(255,255,255,0.25)" stroke-width="1"/>
      <line x1="16" y1="32" x2="64" y2="32" stroke="rgba(255,255,255,0.25)" stroke-width="1"/>
      <line x1="16" y1="48" x2="64" y2="48" stroke="rgba(255,255,255,0.25)" stroke-width="1"/>
      <!-- Letters S U D O K U -->
      <text x="24" y="29" text-anchor="middle" font-family="Nunito, sans-serif" font-size="10" font-weight="800" fill="rgba(255,255,255,0.85)">S</text>
      <text x="40" y="29" text-anchor="middle" font-family="Nunito, sans-serif" font-size="10" font-weight="800" fill="rgba(255,255,255,0.85)">U</text>
      <text x="24" y="45" text-anchor="middle" font-family="Nunito, sans-serif" font-size="10" font-weight="800" fill="rgba(255,255,255,0.85)">D</text>
      <text x="40" y="45" text-anchor="middle" font-family="Nunito, sans-serif" font-size="10" font-weight="800" fill="rgba(255,255,255,0.85)">O</text>
      <text x="24" y="61" text-anchor="middle" font-family="Nunito, sans-serif" font-size="10" font-weight="800" fill="rgba(255,255,255,0.85)">K</text>
      <text x="40" y="61" text-anchor="middle" font-family="Nunito, sans-serif" font-size="10" font-weight="800" fill="rgba(255,255,255,0.85)">U</text>
    </svg>
  `;

  const title = document.createElement('div');
  title.className = 'logo-title';
  title.textContent = 'SUDOKU';

  const subtitle = document.createElement('div');
  subtitle.className = 'logo-subtitle';
  subtitle.textContent = 'DAILY PUZZLE';

  container.appendChild(logoIcon);
  container.appendChild(title);
  container.appendChild(subtitle);

  return container;
}
