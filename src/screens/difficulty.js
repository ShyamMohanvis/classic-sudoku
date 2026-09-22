export function createDifficultyScreen(container, callbacks) {
  const screen = document.createElement('div');
  screen.className = 'screen screen-enter diff-screen-layout';
  screen.id = 'difficulty-screen';

  const headerRow = document.createElement('div');
  headerRow.style.display = 'flex';
  headerRow.style.alignItems = 'center';
  headerRow.style.width = '100%';
  headerRow.style.marginBottom = 'var(--space-2xl)';
  
  const backBtn = document.createElement('button');
  backBtn.className = 'header-back-btn';
  backBtn.innerHTML = '←';
  backBtn.style.fontSize = '24px';
  backBtn.style.fontWeight = 'bold';
  backBtn.style.padding = '8px';
  backBtn.style.marginRight = 'auto';
  backBtn.addEventListener('click', () => callbacks.onBack?.());

  const title = document.createElement('div');
  title.className = 'diff-screen-title';
  title.textContent = 'SELECT DIFFICULTY';
  title.style.margin = '0 auto';
  title.style.transform = 'translateX(-16px)'; // Offset back button width for centering

  headerRow.appendChild(backBtn);
  headerRow.appendChild(title);
  screen.appendChild(headerRow);

  const diffContainer = document.createElement('div');
  diffContainer.className = 'diff-cards-container';

  const difficulties = [
    { id: 'easy', label: 'EASY', desc: 'Beginner' },
    { id: 'medium', label: 'MEDIUM', desc: 'Intermediate' },
    { id: 'hard', label: 'HARD', desc: 'Advanced' },
  ];

  difficulties.forEach(diff => {
    const card = document.createElement('button');
    card.className = `diff-card diff-card-${diff.id}`;
    
    card.innerHTML = `
      <div class="diff-card-label">${diff.label}</div>
      <div class="diff-card-desc">${diff.desc}</div>
      <div class="diff-card-action" style="margin-top: 16px;">START</div>
    `;

    card.addEventListener('click', () => {
      callbacks.onSelect?.(diff.id);
    });
    diffContainer.appendChild(card);
  });

  screen.appendChild(diffContainer);

  container.appendChild(screen);
  return { element: screen };
}
