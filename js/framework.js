document.addEventListener('DOMContentLoaded', () => {
  const $ = selector => document.querySelector(selector);
  const data = window.FRAMEWORK;
  const nav = $('#stageNav');
  const list = $('#stageList');
  const stages = data.stages;

  Anim.split($('[data-split]'));
  document.querySelectorAll('.reveal-load').forEach((element, index) => element.style.setProperty('--i', index));
  Anim.reveal();
  Anim.magnetic();

  nav.innerHTML = stages.map(([title], index) =>
    `<li><button type="button" data-stage="${index}" class="${index === 0 ? 'is-active' : ''}">${String(index + 1).padStart(2, '0')} · ${title}</button></li>`
  ).join('');
  list.innerHTML = stages.map(([title, description, tags], index) =>
    `<article class="fw-stage" id="stage-${index}" data-stage-card="${index}"><div class="fw-stage__top"><span class="fw-stage__number">${String(index + 1).padStart(2, '0')}</span><h3>${title}</h3></div><p>${description}</p><div class="fw-stage__meta">${tags.map(tag => `<span>${tag}</span>`).join('')}</div></article>`
  ).join('');

  nav.addEventListener('click', event => {
    const button = event.target.closest('button[data-stage]');
    if (!button) return;
    $('#stage-' + button.dataset.stage).scrollIntoView({behavior: 'smooth', block: 'center'});
  });

  const stageButtons = [...nav.querySelectorAll('button')];
  const stageObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const index = Number(entry.target.dataset.stageCard);
      stageButtons.forEach((button, buttonIndex) => button.classList.toggle('is-active', buttonIndex === index));
      $('#stageProg').style.width = `${((index + 1) / stages.length) * 100}%`;
    });
  }, {rootMargin: '-35% 0px -50% 0px'});
  list.querySelectorAll('.fw-stage').forEach(stage => stageObserver.observe(stage));

  const loop = $('#loop-ring');
  const note = $('#loopNote');
  const loopDescriptions = [
    'A well-framed question keeps the analysis connected to a real need.',
    'Careful preparation makes data quality and limitations visible before drawing conclusions.',
    'Exploration and evaluation help distinguish useful patterns from assumptions.',
    'Clear communication turns the result into something people can act on—and learn from.'
  ];
  loop.innerHTML = stages.map(([title], index) =>
    `<button class="loop__step${index === 0 ? ' is-active' : ''}" type="button" data-loop="${index}" aria-pressed="${index === 0}"><span class="loop__number">${String(index + 1).padStart(2, '0')}</span><span class="loop__title">${title}</span>${index < stages.length - 1 ? '<span class="loop__arrow" aria-hidden="true">→</span>' : '<span class="loop__arrow" aria-hidden="true">↻</span>'}</button>`
  ).join('');
  loop.addEventListener('click', event => {
    const button = event.target.closest('button[data-loop]');
    if (!button) return;
    loop.querySelectorAll('.loop__step').forEach(step => {
      const active = step === button;
      step.classList.toggle('is-active', active);
      step.setAttribute('aria-pressed', String(active));
    });
    note.textContent = loopDescriptions[Number(button.dataset.loop)];
  });

  $('#expertiseGrid').innerHTML = data.areas.map(([number, title, description, tags]) =>
    `<article class="expertise-card" data-reveal><span class="expertise-card__icon" aria-hidden="true">${number}</span><h3>${title}</h3><p>${description}</p><div class="tags">${tags.map(tag => `<span>${tag}</span>`).join('')}</div></article>`
  ).join('');
  Anim.reveal();

  const menu = $('#navLinks');
  const menuToggle = $('#burger');
  menuToggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });
  menu.addEventListener('click', event => {
    if (event.target.closest('a')) {
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
});
