/* Visible circular pointer trail for mouse and pen input, across the whole page. */
(() => {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  const label = document.getElementById('cursorLabel');
  if (!dot || !ring) return;

  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  let x = 0, y = 0, dotX = 0, dotY = 0, ringX = 0, ringY = 0, frame = 0;
  const interactive = 'a, button, [role="button"], .tab';
  const cards = '.card, .project-card, .home-tile, .future-card, .skill-card, .expertise-card, .fw-stage';

  function render() {
    const dotEase = reducedMotion ? 1 : 0.48;
    const ringEase = reducedMotion ? 1 : 0.24;
    dotX += (x - dotX) * dotEase;
    dotY += (y - dotY) * dotEase;
    ringX += (x - ringX) * ringEase;
    ringY += (y - ringY) * ringEase;
    dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;

    if (Math.abs(x - dotX) + Math.abs(y - dotY) + Math.abs(x - ringX) + Math.abs(y - ringY) > 0.2) {
      frame = requestAnimationFrame(render);
    } else {
      frame = 0;
    }
  }

  function move(event) {
    if (event.pointerType === 'touch') return;
    x = event.clientX;
    y = event.clientY;
    if (!ring.classList.contains('is-visible')) {
      dotX = ringX = x;
      dotY = ringY = y;
      dot.classList.add('is-visible');
      ring.classList.add('is-visible');
    }
    if (!frame) frame = requestAnimationFrame(render);
  }

  document.addEventListener('pointermove', move, { passive: true });
  document.addEventListener('mouseover', event => {
    const target = event.target instanceof Element ? event.target : null;
    const card = target?.closest(cards);
    const link = target?.closest(interactive);
    ring.classList.toggle('is-view', !!card);
    ring.classList.toggle('is-link', !!link && !card);
    if (label) label.textContent = card ? 'View' : '';
  }, { passive: true });
  document.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'touch') ring.classList.add('is-pressing');
  }, { passive: true });
  document.addEventListener('pointerup', () => ring.classList.remove('is-pressing'), { passive: true });
  window.addEventListener('pointerout', event => {
    if (!event.relatedTarget) {
      dot.classList.remove('is-visible');
      ring.classList.remove('is-visible');
    }
  }, { passive: true });
})();
