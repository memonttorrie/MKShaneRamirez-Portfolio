/* Dot follows instantly; ring lags (lerp). Ring grows over links, shows "View" on cards. */
(() => {
  if (!matchMedia('(hover:hover) and (pointer:fine)').matches || matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  const dot = document.getElementById('cursorDot'), ring = document.getElementById('cursorRing'), label = document.getElementById('cursorLabel');
  let x = innerWidth/2, y = innerHeight/2, rx = x, ry = y;
  document.body.classList.add('has-cursor');
  addEventListener('mousemove', e => { x = e.clientX; y = e.clientY; dot.style.transform = `translate(${x}px,${y}px)`; });
  (function loop(){ rx += (x-rx)*.15; ry += (y-ry)*.15; ring.style.transform = `translate(${rx}px,${ry}px)`; requestAnimationFrame(loop); })();
  document.addEventListener('mouseover', e => {
    const card = e.target.closest('.card'), link = e.target.closest('a,button,.tab');
    ring.classList.toggle('is-view', !!card); label.textContent = card ? 'View' : '';
    ring.classList.toggle('is-link', !!link && !card);
  });
})();
