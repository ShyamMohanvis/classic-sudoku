/**
 * Modal Component
 */

export function createModal() {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  const content = document.createElement('div');
  content.className = 'modal-content';

  overlay.appendChild(content);

  // Close on overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      hide();
    }
  });

  // Close on Escape
  function onKeydown(e) {
    if (e.key === 'Escape') {
      hide();
    }
  }

  let onHideCallback = null;

  function show(html, onHide) {
    if (typeof html === 'string') {
      content.innerHTML = html;
    } else if (html instanceof HTMLElement) {
      content.innerHTML = '';
      content.appendChild(html);
    }
    onHideCallback = onHide || null;

    document.body.appendChild(overlay);
    // Force reflow
    overlay.offsetHeight;
    overlay.classList.add('visible');
    document.addEventListener('keydown', onKeydown);
  }

  function hide() {
    overlay.classList.remove('visible');
    document.removeEventListener('keydown', onKeydown);
    setTimeout(() => {
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
      if (onHideCallback) onHideCallback();
    }, 250);
  }

  function setContent(el) {
    content.innerHTML = '';
    if (typeof el === 'string') {
      content.innerHTML = el;
    } else {
      content.appendChild(el);
    }
  }

  return { show, hide, setContent, element: overlay, contentElement: content };
}
