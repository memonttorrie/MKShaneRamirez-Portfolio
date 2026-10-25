window.Anim = {
  split(elements){ const list = elements instanceof Element ? [elements] : [...elements]; list.forEach(el => { const t = el.textContent; el.textContent = ''; [...t].forEach((c,i) => { const s = document.createElement('span'); s.className='ch'; s.style.setProperty('--c',i); s.textContent = c === ' ' ? '\u00A0' : c; el.appendChild(s); }); }); },
  reveal(){ const io = new IntersectionObserver(es => es.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); e.target.querySelectorAll('.bar__fill').forEach(b => b.style.width = b.dataset.w + '%'); } }), {threshold:.12});
    document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el)); },
  counters(){ const io = new IntersectionObserver(es => es.forEach(e => { if(!e.isIntersecting) return; io.unobserve(e.target);
      const el = e.target, end = +el.dataset.count, suf = el.dataset.suffix || '', t0 = performance.now();
      (function tick(t){ const p = Math.min((t-t0)/1500,1), v = Math.round(end*(1-Math.pow(1-p,3))); el.textContent = v.toLocaleString() + suf; if(p<1) requestAnimationFrame(tick); })(t0); }), {threshold:.6});
    document.querySelectorAll('[data-count]').forEach(el => io.observe(el)); },
  tilt(){ if(!matchMedia('(hover:hover)').matches) return;
    document.querySelectorAll('[data-tilt],.card').forEach(el => {
      el.addEventListener('mousemove', e => { const r = el.getBoundingClientRect(), px = (e.clientX-r.left)/r.width-.5, py = (e.clientY-r.top)/r.height-.5; el.style.transform = `perspective(800px) rotateY(${px*8}deg) rotateX(${-py*8}deg) translateY(-4px)`; });
      el.addEventListener('mouseleave', () => el.style.transform = ''); }); },
  magnetic(){ if(!matchMedia('(hover:hover)').matches) return;
    document.querySelectorAll('[data-magnetic]').forEach(el => {
      el.addEventListener('mousemove', e => { const r = el.getBoundingClientRect(); el.style.transform = `translate(${(e.clientX-r.left-r.width/2)*.3}px,${(e.clientY-r.top-r.height/2)*.4}px)`; });
      el.addEventListener('mouseleave', () => el.style.transform = ''); }); }
};
