(() => {
  const btn = document.getElementById('themeToggle');
  const root = document.documentElement;
  const set = t => {
    root.dataset.theme = t;
    btn.setAttribute('aria-label', `Switch to ${t === 'dark' ? 'light' : 'dark'} mode`);
    btn.innerHTML = (t === 'dark'
      ? '<svg class="theme-toggle__icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg>'
      : '<svg class="theme-toggle__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.2 15.1A8.5 8.5 0 0 1 8.9 3.8 8.6 8.6 0 1 0 20.2 15.1Z"/></svg>') + `<span>${t === 'dark' ? 'Light mode' : 'Dark mode'}</span>`;
    document.querySelector('meta[name=theme-color]').content = t === 'dark' ? '#101827' : '#F5F6F2';
    try { localStorage.setItem('theme', t); } catch (e) {}
  };
  let saved; try{saved = localStorage.getItem('theme')}catch(e){}
  set(saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  btn.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    if (typeof document.startViewTransition === 'function' && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      try {
        const transition = document.startViewTransition(() => set(next));
        transition.ready.catch(error => {
          if (error.name !== 'AbortError' && error.name !== 'InvalidStateError') console.error('Theme transition failed.', error);
        });
        transition.finished.catch(error => {
          if (error.name !== 'AbortError') console.error('Theme transition failed.', error);
        });
      } catch (error) {
        set(next);
        console.error('Theme transition failed.', error);
      }
    } else {
      set(next);
    }
  });
})();
