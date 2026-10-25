(() => {
  const observed = new WeakSet();
  const reduceMotion = matchMedia('(prefers-reduced-motion:reduce)');
  const revealObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      element.classList.add('in');
      element.querySelectorAll('.bar__fill').forEach(bar => { bar.style.transform = `scaleX(${Number(bar.dataset.w) / 100})`; });
      revealObserver.unobserve(element);
    }), {threshold:.12, rootMargin:'0px 0px -3% 0px'})
    : null;

  window.Anim = {
    reveal(){
      document.querySelectorAll('main section:not(.hero),[data-reveal]').forEach(element => {
        if (!element.hasAttribute('data-reveal')) element.setAttribute('data-reveal','');
        if (observed.has(element)) return;
        observed.add(element);
        const siblings = [...element.parentElement.children].filter(sibling => sibling.hasAttribute('data-reveal'));
        const index = siblings.indexOf(element);
        if (siblings.length > 1) element.style.setProperty('--reveal-delay', `${Math.min(index,5)*55}ms`);
        if (!revealObserver || reduceMotion.matches) {
          element.classList.add('in');
          element.querySelectorAll('.bar__fill').forEach(bar => { bar.style.transform = `scaleX(${Number(bar.dataset.w) / 100})`; });
        } else revealObserver.observe(element);
      });
    },
    counters(){
      const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        const element = entry.target, end = Number(element.dataset.count), suffix = element.dataset.suffix || '';
        if (reduceMotion.matches) { element.textContent = end.toLocaleString() + suffix; return; }
        const started = performance.now();
        const tick = now => {
          const progress = Math.min((now - started) / 900, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          element.textContent = Math.round(end * eased).toLocaleString() + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }), {threshold:.6}) : null;
      document.querySelectorAll('[data-count]').forEach(element => {
        if (!observer || reduceMotion.matches) element.textContent = Number(element.dataset.count).toLocaleString() + (element.dataset.suffix || '');
        else observer.observe(element);
      });
    }
  };
})();
