document.addEventListener('DOMContentLoaded', () => {
  const $ = s => document.querySelector(s);
  document.querySelectorAll('.reveal-load').forEach((el,i) => el.style.setProperty('--i', i));
  Anim.reveal(); Anim.counters();
  const profileSwitch = $('#profileSwitch');
  const profileImage = profileSwitch.querySelector('img');
  profileSwitch.addEventListener('click', () => {
    const illustrated = profileSwitch.getAttribute('aria-pressed') !== 'true';
    profileSwitch.setAttribute('aria-pressed', String(illustrated));
    profileSwitch.setAttribute('aria-label', `Switch to ${illustrated ? 'photo' : 'illustrated'} profile portrait`);
    profileImage.src = illustrated ? 'assets/images/profile-illustration.png' : 'assets/images/profile-photo.png';
    profileImage.alt = illustrated ? 'Illustrated portrait of Shane Ramirez' : 'Portrait of Shane Ramirez';
    profileImage.classList.remove('is-switching');
    void profileImage.offsetWidth;
    profileImage.classList.add('is-switching');
  });

  const bar = $('#progress'), navLinks = $('.sidebar .nav__links');
  const links = [...navLinks.querySelectorAll('a[href^="#"]')];
  const setActiveLink = link => {
    if (!link) return;
    links.forEach(item => item.classList.toggle('is-active', item === link));
    navLinks.style.setProperty('--indicator-y', `${link.offsetTop - navLinks.offsetTop}px`);
    navLinks.style.setProperty('--indicator-height', `${link.offsetHeight}px`);
  };
  if (links.length) setActiveLink(links[0]);
  const navResizeObserver = 'ResizeObserver' in window ? new ResizeObserver(() => {
    const active = links.find(link => link.classList.contains('is-active'));
    if (active) setActiveLink(active);
  }) : null;
  navResizeObserver?.observe(navLinks);
  let scrollFrame = 0;
  addEventListener('scroll', () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = 0;
      const range = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${range > 0 ? Math.min(1, scrollY / range) : 0})`;
    });
  }, {passive:true});
  const spy = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) setActiveLink(links.find(link => link.getAttribute('href') === '#'+e.target.id));
  }), {rootMargin:'-45% 0px -50% 0px'});
  document.querySelectorAll('main section[id]').forEach(s => spy.observe(s));
  let resizeTimer = 0;
  addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const active = links.find(link => link.classList.contains('is-active'));
      if (active) setActiveLink(active);
    }, 120);
  }, {passive:true});

  const menu = $('#navLinks');
  const menuToggle = $('#burger');
  menuToggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });
  menu.addEventListener('click', e => {
    if (e.target.closest('a')) {
      menu.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });

  const sidebarCollapse = $('#sidebarCollapse');
  let sidebarCollapsed = false;
  try { sidebarCollapsed = localStorage.getItem('sidebar-collapsed') === 'true'; } catch (error) { console.warn('Sidebar preference could not be restored.', error); }
  document.body.classList.toggle('sidebar-collapsed', sidebarCollapsed);
  sidebarCollapse.setAttribute('aria-pressed', String(sidebarCollapsed));
  sidebarCollapse.setAttribute('aria-label', sidebarCollapsed ? 'Expand sidebar' : 'Minimize sidebar');
  sidebarCollapse.addEventListener('click', () => {
    const collapsed = document.body.classList.toggle('sidebar-collapsed');
    sidebarCollapse.setAttribute('aria-pressed', String(collapsed));
    sidebarCollapse.setAttribute('aria-label', collapsed ? 'Expand sidebar' : 'Minimize sidebar');
    try { localStorage.setItem('sidebar-collapsed', String(collapsed)); } catch (error) { console.warn('Sidebar preference could not be saved.', error); }
  });

  const modal = $('#certModal'), modalClose = $('#certModalClose');
  let lastCertTrigger = null;
  $('#certGallery').addEventListener('click', e => {
    if (e.target.closest('[data-cert]')) lastCertTrigger = e.target.closest('[data-cert]');
  });
  const closeCert = () => {
    if (modal.hidden) return;
    modal.hidden = true;
    $('#certViewer').src = 'about:blank';
    if (lastCertTrigger?.isConnected) lastCertTrigger.focus();
  };
  modalClose.addEventListener('click', closeCert);
  modal.addEventListener('click', e => { if (e.target === modal) closeCert(); });
  const futureTrack = $('#futureTrack');
  const futureStep = () => {
    const card = futureTrack.querySelector('.future-card');
    return card ? card.getBoundingClientRect().width + parseFloat(getComputedStyle(futureTrack).gap) : 320;
  };
  $('#futurePrev').addEventListener('click', () => futureTrack.scrollBy({left: -futureStep(), behavior: 'smooth'}));
  $('#futureNext').addEventListener('click', () => futureTrack.scrollBy({left: futureStep(), behavior: 'smooth'}));
  addEventListener('keydown', e => {
    if (e.key === 'Escape') closeCert();
    if (e.key === 'Tab' && !modal.hidden) {
      const focusable = [...modal.querySelectorAll('button, a[href]')];
      if (e.shiftKey && document.activeElement === focusable[0]) {
        e.preventDefault();
        focusable[focusable.length - 1].focus();
      } else if (!e.shiftKey && document.activeElement === focusable[focusable.length - 1]) {
        e.preventDefault();
        focusable[0].focus();
      }
    }
  });
});
