(() => {
  const viewport = document.getElementById('companyShowcase');
  const track = document.getElementById('companyTrack');
  if (!viewport || !track) return;

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const idleSpeed = -22;
  let offset = 0;
  let speed = idleSpeed;
  let targetSpeed = idleSpeed;
  let previousX = null;
  let lastPointerTime = 0;
  let previousFrame = 0;
  let frame = 0;
  let isVisible = false;

  function groupWidth() {
    return track.firstElementChild?.getBoundingClientRect().width || 0;
  }

  function animate(now) {
    frame = 0;
    if (reducedMotion.matches || document.hidden || !isVisible) {
      previousFrame = 0;
      return;
    }

    const width = groupWidth();
    if (!width) return;
    const elapsed = previousFrame ? Math.min((now - previousFrame) / 1000, 0.05) : 0;
    previousFrame = now;
    if (now - lastPointerTime > 1400) targetSpeed = idleSpeed;
    speed += (targetSpeed - speed) * Math.min(1, elapsed * 2.5);
    offset = ((offset + speed * elapsed) % width + width) % width;
    track.style.transform = `translate3d(${-offset}px,0,0)`;
    frame = requestAnimationFrame(animate);
  }

  function start() {
    if (!frame && isVisible && !reducedMotion.matches && !document.hidden) {
      frame = requestAnimationFrame(animate);
    }
  }

  viewport.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch' && event.buttons === 0) return;
    if (previousX !== null) {
      const delta = event.clientX - previousX;
      if (Math.abs(delta) > 0.5) {
        targetSpeed = Math.max(-80, Math.min(80, -delta * 8));
        lastPointerTime = performance.now();
      }
    }
    previousX = event.clientX;
  }, {passive:true});

  viewport.addEventListener('pointerleave', () => { previousX = null; });
  viewport.addEventListener('pointerdown', event => { previousX = event.clientX; }, {passive:true});
  viewport.addEventListener('pointerup', () => { previousX = null; }, {passive:true});
  viewport.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      targetSpeed = event.key === 'ArrowRight' ? -65 : 65;
      lastPointerTime = performance.now();
    }
  });
  document.addEventListener('visibilitychange', () => {
    previousFrame = 0;
    if (!document.hidden) start();
  });
  reducedMotion.addEventListener?.('change', () => {
    if (reducedMotion.matches && frame) {
      cancelAnimationFrame(frame);
      frame = 0;
      track.style.transform = '';
    } else start();
  });

  new ResizeObserver(() => {
    const width = groupWidth();
    if (width) offset %= width;
  }).observe(viewport);

  new IntersectionObserver(([entry]) => {
    isVisible = entry.isIntersecting;
    if (isVisible) start();
    else if (frame) {
      cancelAnimationFrame(frame);
      frame = 0;
      previousFrame = 0;
    }
  }).observe(viewport);
})();
