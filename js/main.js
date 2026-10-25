document.addEventListener('DOMContentLoaded', () => {
  const $ = s => document.querySelector(s);
  Anim.split(document.querySelectorAll('[data-split]'));
  document.querySelectorAll('.reveal-load').forEach((el,i) => el.style.setProperty('--i', i));
  Anim.reveal(); Anim.counters(); Anim.tilt(); Anim.magnetic();
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

  const bar = $('#progress'), links = [...document.querySelectorAll('.nav__links a[href^="#"]')];
  addEventListener('scroll', () => { bar.style.width = (scrollY/(document.body.scrollHeight-innerHeight)*100) + '%'; }, {passive:true});
  const spy = new IntersectionObserver(es => es.forEach(e => { if(e.isIntersecting) links.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === '#'+e.target.id)); }), {rootMargin:'-45% 0px -50% 0px'});
  document.querySelectorAll('main section[id]').forEach(s => spy.observe(s));

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
