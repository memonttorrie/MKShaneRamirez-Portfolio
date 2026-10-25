document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('fontSizeToggle');
  const menu = document.getElementById('fontSizeMenu');
  const value = document.getElementById('fontSizeValue');
  const down = document.getElementById('fontSizeDown');
  const up = document.getElementById('fontSizeUp');
  let sizeStep = 0;

  try {
    const saved = Number(localStorage.getItem('portfolio-text-size'));
    if (Number.isInteger(saved) && saved >= -1 && saved <= 2) sizeStep = saved;
  } catch (error) {
    console.warn('Text-size preference could not be restored.', error);
  }

  const updateSize = () => {
    document.documentElement.style.fontSize = `${100 + sizeStep * 10}%`;
    value.value = `${100 + sizeStep * 10}%`;
    down.disabled = sizeStep <= -1;
    up.disabled = sizeStep >= 2;
    try {
      localStorage.setItem('portfolio-text-size', String(sizeStep));
    } catch (error) {
      console.warn('Text-size preference could not be saved.', error);
    }
  };

  toggle.addEventListener('click', () => {
    menu.hidden = !menu.hidden;
    toggle.setAttribute('aria-expanded', String(!menu.hidden));
  });
  down.addEventListener('click', () => {
    sizeStep = Math.max(-1, sizeStep - 1);
    updateSize();
  });
  up.addEventListener('click', () => {
    sizeStep = Math.min(2, sizeStep + 1);
    updateSize();
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.reading-tools')) {
      menu.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      menu.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  updateSize();
});
