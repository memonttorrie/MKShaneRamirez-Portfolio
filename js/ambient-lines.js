(() => {
  const svg = document.querySelector('.ambient-lines');
  const paths = svg ? [...svg.querySelectorAll('.ambient-lines__path')] : [];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  if (!svg || !paths.length || reduceMotion.matches || !finePointer.matches) return;

  const boxes = paths.map(path => path.getBBox());
  let pointer = null;
  let frame = 0;

  function update() {
    frame = 0;
    if (!pointer) return;

    const svgPoint = svg.createSVGPoint();
    svgPoint.x = pointer.x;
    svgPoint.y = pointer.y;
    const point = svgPoint.matrixTransform(svg.getScreenCTM().inverse());

    paths.forEach((path, index) => {
      const box = boxes[index];
      const centerX = box.x + box.width / 2;
      const centerY = box.y + box.height / 2;
      const distance = Math.hypot(point.x - centerX, (point.y - centerY) * 1.25);
      const influence = Math.max(0, 1 - distance / 1050);
      const dx = Math.max(-11, Math.min(11, (point.x - centerX) * 0.018)) * influence;
      const dy = Math.max(-8, Math.min(8, (point.y - centerY) * 0.018)) * influence;
      path.style.translate = `${dx.toFixed(1)}px ${dy.toFixed(1)}px`;
    });
  }

  addEventListener('pointermove', event => {
    pointer = {x: event.clientX, y: event.clientY};
    svg.classList.add('ambient-lines--cursor-active');
    if (!frame) frame = requestAnimationFrame(update);
  }, {passive: true});

  function settle() {
    pointer = null;
    svg.classList.remove('ambient-lines--cursor-active');
    paths.forEach(path => { path.style.translate = ''; });
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
  }

  addEventListener('pointerout', event => {
    if (!event.relatedTarget) settle();
  }, {passive: true});
  addEventListener('blur', settle);
  reduceMotion.addEventListener?.('change', event => { if (event.matches) settle(); });
  finePointer.addEventListener?.('change', event => { if (!event.matches) settle(); });
})();
