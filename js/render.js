(() => {
  const D = window.DATA, $ = id => document.getElementById(id);
  const skillGroups = [
    ['DATA PREPARATION','Make data ready','Cleaning, organizing, and working with structured information.',['Python (pandas, scikit-learn)','Data cleaning and visualization','Microsoft Excel','MySQL'],'--orange'],
    ['ANALYSIS & VISUALIZATION','Find useful patterns','Explore data and present findings in a clear, practical way.',['Data cleaning and visualization','Microsoft Excel','Power BI'],'--blue'],
    ['MACHINE LEARNING','Evaluate experiments','Build and assess coursework and project models with care.',['Python (pandas, scikit-learn)','PyTorch','Model evaluation (F1, confusion matrix)'],'--violet'],
    ['TEXT & LANGUAGE','Explore NLP','Classify and compare approaches to text-based questions.',['NLP and text classification','Python (pandas, scikit-learn)','Model evaluation (F1, confusion matrix)'],'--orange']
  ];
  const skillLookup = new Map(D.skills.map(([name, level]) => [name, level]));
  $('skillCards').innerHTML = skillGroups.map(([label,title,description,names,color], index) => {
    const items = names.map(name => `<div class="skill-card__item"><span>${name}</span><output>Self-rated · ${skillLookup.get(name)}%</output></div>`).join('');
    const node = ['prepare','analyze','model','language'][index];
    return `<article class="skill-card" data-flow-node="${node}" data-reveal style="--skill-color:var(${color})"><span class="skills-flowchart__step">${String(index + 1).padStart(2,'0')} · ${label}</span><h3>${title}</h3><p>${description}</p><div class="skill-card__items">${items}</div></article>`;
  }).join('');
  $('skillTools').innerHTML = D.tools.map(tool => `<span>${tool}</span>`).join('');

  const flow = $('skillFlow');
  const flowWires = $('skillFlowWires');
  const drawSkillFlow = () => {
    const rect = flow.getBoundingClientRect();
    if (!rect.width) return;
    flowWires.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`);
    flowWires.setAttribute('width', rect.width);
    flowWires.setAttribute('height', rect.height);
    flowWires.querySelectorAll('.skills-flowchart__path,.skills-flowchart__particle').forEach(item => item.remove());
    const nodes = Object.fromEntries([...flow.querySelectorAll('[data-flow-node]')].map(node => [node.dataset.flowNode, node]));
    const stacked = nodes.prepare.getBoundingClientRect().left === nodes.analyze.getBoundingClientRect().left;
    const routes = stacked
      ? [['prepare','analyze'],['analyze','model'],['model','language'],['language','communicate']]
      : [['prepare','analyze'],['analyze','model'],['analyze','language'],['model','communicate'],['language','communicate']];
    routes.forEach(([from,to], routeIndex) => {
      const a = nodes[from].getBoundingClientRect(), b = nodes[to].getBoundingClientRect();
      const ax = a.left - rect.left + a.width / 2, ay = a.top - rect.top + a.height / 2;
      const bx = b.left - rect.left + b.width / 2, by = b.top - rect.top + b.height / 2;
      let sx=ax, sy=ay, ex=bx, ey=by;
      const horizontal = from === 'prepare' && to === 'analyze' && !stacked;
      if (horizontal) {
        sx = a.right - rect.left; sy = ay;
        ex = b.left - rect.left; ey = by;
      } else if (stacked) {
        sy = a.bottom - rect.top; ey = b.top - rect.top;
      } else {
        const sourceSide = to === 'model' ? .3 : to === 'language' ? .7 : from === 'model' ? .8 : .2;
        const targetSide = to === 'communicate' ? (from === 'model' ? .35 : .65) : from === 'analyze' ? (to === 'model' ? .8 : .2) : .5;
        sx = a.left - rect.left + a.width * sourceSide;
        sy = a.bottom - rect.top;
        ex = b.left - rect.left + b.width * targetSide;
        ey = b.top - rect.top;
      }
      const bend = Math.max(24, Math.min(88, Math.abs(ey - sy) * .44));
      const path = document.createElementNS('http://www.w3.org/2000/svg','path');
      path.setAttribute('class','skills-flowchart__path');
      path.id = `skillFlowPath${routeIndex}`;
      path.setAttribute('marker-end','url(#skillFlowArrow)');
      const d = horizontal
        ? `M${sx} ${sy} C${sx + 44} ${sy},${ex - 44} ${ey},${ex} ${ey}`
        : `M${sx} ${sy} C${sx} ${sy + bend},${ex} ${ey - bend},${ex} ${ey}`;
      path.setAttribute('d', d);
      const particle = document.createElementNS('http://www.w3.org/2000/svg','circle');
      particle.setAttribute('class','skills-flowchart__particle');
      particle.setAttribute('r','5');
      const motion = document.createElementNS('http://www.w3.org/2000/svg','animateMotion');
      motion.setAttribute('dur',`${2.8 + routeIndex * .18}s`);
      motion.setAttribute('begin',`${routeIndex * .32}s`);
      motion.setAttribute('repeatCount','indefinite');
      motion.setAttribute('path',d);
      particle.append(motion);
      flowWires.append(path,particle);
    });
  };
  const scheduleSkillFlow = () => requestAnimationFrame(drawSkillFlow);
  new ResizeObserver(scheduleSkillFlow).observe(flow);
  window.addEventListener('load', scheduleSkillFlow, {once:true});
  scheduleSkillFlow();
  $('softSkills').innerHTML = D.soft.map(([n,s,d]) => `<div data-reveal><b>${s}</b><h4>${n}</h4><p class="muted">${d}</p></div>`).join('');
  const toolsTrack = $('toolsTrack');
  // Keep logos with the site so the ticker works without third-party image requests.
  const toolMarks = {
    'Slack':['assets/images/slack.svg','--violet','wordmark'],
    'Visual Studio Code':['assets/images/visual-studio-code.svg','--blue','wordmark'],
    'Hugging Face':['assets/images/hugging-face.svg','--orange','wordmark'],
    'Canva':['assets/images/canva.svg','--blue','wordmark'],
    'HubSpot':['assets/images/hubspot.svg','--orange','wordmark'],
    'Google Workspace':['assets/images/google-workspace.svg','--blue','wordmark'],
    'MySQL':['assets/images/mysql.svg','--blue','wordmark'],
    'Excel':['assets/images/excel.svg','--blue','wordmark'],
    'Power BI':['assets/images/power-bi.svg','--orange','wordmark'],
    'Supabase':['assets/images/supabase.svg','--blue','wordmark'],
    'Apify Console':['assets/images/apify.svg','--orange','wordmark'],
    'Apollo':['assets/images/apollo.svg','--orange','wordmark'],
    'Mailchimp':['assets/images/mailchimp.svg','--orange','wordmark']
  };
  const toolGroup = `<div class="daily-tools__group">${D.tools.map(tool => {
    const [logo,color,kind] = toolMarks[tool] || [null,'--blue','mark'];
    if (kind === 'wordmark') return `<span class="tool-pill tool-pill--wordmark"><img class="tool-pill__wordmark" src="${logo}" alt="${tool}" width="170" height="34" loading="lazy" decoding="async"><span class="tool-pill__wordmark-fallback" hidden>${tool}</span></span>`;
    const mark = logo
      ? `<img src="${logo}" alt="" width="19" height="19" loading="lazy" decoding="async"><span class="tool-pill__fallback" aria-hidden="true" hidden>${tool[0]}</span>`
      : `<span aria-hidden="true">${tool[0]}</span>`;
    return `<span class="tool-pill"><i class="tool-pill__mark" style="--tool-color:var(${color})">${mark}</i>${tool}</span>`;
  }).join('')}</div>`;
  toolsTrack.innerHTML = toolGroup + toolGroup.replace('<div class="daily-tools__group">', '<div class="daily-tools__group" aria-hidden="true">');
  toolsTrack.querySelectorAll('.tool-pill img').forEach(logo => logo.addEventListener('error', () => {
    logo.hidden = true;
    const fallback = logo.nextElementSibling;
    if (fallback) fallback.hidden = false;
  }, {once:true}));
  $('toolsList').textContent = `Tools and platforms used: ${D.tools.join(', ')}.`;
  const projectArt = [
    `<div class="project-art project-art--nlp"><span class="project-art__eyebrow">TAGLISH TEXT → CLASSIFICATION</span><div class="project-art__quote">Listings + buyer inquiries</div><div class="project-art__flow"><span>TF-IDF</span><i>↔</i><span>LOGISTIC REGRESSION + SVM</span><i>↔</i><b>XLM-RoBERTa</b></div><div class="project-art__spark"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div>`,
    `<div class="project-art project-art--vision"><span class="project-art__eyebrow">IMAGE CLASSIFICATION</span><div class="project-art__tiles"><i><b>01</b></i><i><b>02</b></i><i><b>03</b></i><i><b>04</b></i></div><div class="project-art__caption">WASTE CATEGORY DETECTION <span>PYTORCH CNN</span></div></div>`,
    `<div class="project-art project-art--dsp"><span class="project-art__eyebrow">SIGNAL PROCESSING / LIVE DETECTION</span><div class="project-art__face"><i></i><b></b><em></em></div><div class="project-art__filters"><span>GAUSSIAN</span><span>MEDIAN</span><span>FFT</span></div></div>`,
    `<div class="project-art project-art--prediction"><span class="project-art__eyebrow">STUDENT PERFORMANCE / MODEL COMPARISON</span><div class="project-art__models"><span>LINEAR REGRESSION</span><span>LOGISTIC REGRESSION</span><span>KNN</span></div><div class="project-art__bars"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="project-art__axis"><span>SURVEY DATA</span><span>MODEL EVALUATION</span></div></div>`,
    `<div class="project-art project-art--excel"><span class="project-art__eyebrow">REAL ESTATE LEADS / EXCEL</span><div class="project-art__sheet"><b>LEAD</b><b>REGION</b><b>DATA</b><i>01</i><i>US</i><i>• • •</i><i>02</i><i>AU</i><i>• • •</i><i>03</i><i>US</i><i>• • •</i></div><div class="project-art__excel-mark">X</div></div>`,
    `<div class="project-art project-art--textile"><span class="project-art__eyebrow">COMPUTER VISION / TEXTILE SORTING</span><div class="project-art__fabric"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="project-art__caption">POST-CONSUMER GARMENTS <span>REUSE / RECYCLING</span></div></div>`
  ];
  $('projectGrid').innerHTML = D.projects.map(([c,t,d,tags,url],i) => {
    const preview = url?.includes('funnelcast')
      ? '<img src="assets/images/funnelcast-preview.svg" alt="" width="1068" height="668" loading="lazy" decoding="async">'
      : url?.includes('suiteline-ph-funnel')
      ? '<img src="assets/images/suiteline-preview.svg" alt="" width="1068" height="668" loading="lazy" decoding="async">'
      : url?.includes('real-estate-funnel')
        ? '<img src="assets/images/real-estate-preview.svg" alt="" width="900" height="560" loading="lazy" decoding="async">'
        : projectArt[i % projectArt.length];
    const projectNumber = String(i + 1).padStart(2,'0');
    return `
      <${url ? 'a' : 'article'} class="project-card${url ? ' project-card--linked' : ''}" data-reveal${url ? ` href="${url}" aria-label="Open ${t}"` : ''}>
        <div class="project-card__preview ${url ? 'project-card__preview--image' : ''}" aria-hidden="true"><span class="project-card__index">PROJECT / ${projectNumber}</span>${url ? '<span class="project-card__open" aria-hidden="true">↗</span>' : ''}${preview}</div>
        <div class="project-card__body"><small>${c}</small><h3>${t}</h3><p>${d}</p><div class="tags">${tags.map(x=>`<span>${x}</span>`).join('')}</div></div>
      </${url ? 'a' : 'article'}>`;
  }).join('');
  $('futureTrack').innerHTML = D.futureProjects.map(([category,title,description,tags],i) => `
    <article class="future-card" data-reveal>
      <div class="future-card__top"><span class="future-card__number">${String(i + 1).padStart(2,'0')}</span><span class="future-card__arrow" aria-hidden="true">↗</span></div>
      <p class="eyebrow">${category}</p><h3>${title}</h3><p class="muted">${description}</p>
      <div class="tags">${tags.map(x=>`<span>${x}</span>`).join('')}</div>
      <span class="future-card__status"><i></i> IN THE WORKS</span>
    </article>`).join('');
  const companyLogos = [
    { name: 'Prince Jun Development Corporation', match: 'prince jun', src: 'assets/images/companies/prince-jun.svg' },
    { name: 'Landco Pacific Corporation', match: 'landco pacific', src: 'assets/images/companies/landco-pacific.svg' },
    { name: 'Inspiro Relia Inc.', match: 'inspiro', src: 'assets/images/companies/inspiro.svg' },
    { name: 'YLT Construction Services', match: 'ylt construction', src: 'assets/images/companies/ylt-construction.svg' }
  ];
  const logoGroup = `<div class="company-showcase__group" aria-hidden="true">${companyLogos.map(({name,src}) => `<div class="company-logo"><img src="${src}" alt="" width="280" height="72" loading="lazy" decoding="async"></div>`).join('')}</div>`;
  $('companyTrack').innerHTML = logoGroup + logoGroup;
  $('companyList').innerHTML = companyLogos.map(({name}) => `<li>${name}</li>`).join('');
  $('timeline').innerHTML = D.experience.map(([when,role,org,d]) => {
    const company = companyLogos.find(({match}) => org.toLowerCase().includes(match));
    const companyMark = company ? `<img class="timeline__logo" src="${company.src}" alt="" width="64" height="32" loading="lazy" decoding="async">` : '';
    return `<li data-reveal><time>${when}</time><h3>${role}</h3><p class="muted timeline__company">${companyMark}<span>${org}</span></p>${d?`<p>${d}</p>`:''}</li>`;
  }).join('');
  const certGallery = $('certGallery');
  const renderCerts = key => {
    certGallery.innerHTML = D.certs[key].map(([title,issuer,file],index) => `
      <article class="cert-card" data-cert="${key}:${index}">
        <span class="cert-card__tilt">
          <iframe class="cert-card__preview" src="${file}#page=1&amp;view=FitH&amp;toolbar=0&amp;navpanes=0" title="Preview of ${title}" loading="eager" tabindex="-1"></iframe>
          <button class="cert-card__open" type="button" data-cert-open="${key}:${index}" aria-label="Open ${title} certificate">VIEW CERTIFICATE <span aria-hidden="true">↗</span></button>
        </span>
        <span class="cert-card__caption"><span><b>${title}</b><small>${issuer}</small></span><span class="cert-card__caption-arrow" aria-hidden="true">↗</span></span>
      </article>`).join('');
  };
  renderCerts('tech');
  document.querySelectorAll('.tab[data-tab]').forEach(tab => tab.addEventListener('click', () => {
    document.querySelectorAll('.tab[data-tab]').forEach(item => {
      item.classList.toggle('is-active', item === tab);
      item.setAttribute('aria-selected', String(item === tab));
    });
    renderCerts(tab.dataset.tab);
  }));
  certGallery.addEventListener('click', event => {
    const card = event.target.closest('[data-cert-open]');
    if (!card) return;
    const [category,index] = card.dataset.certOpen.split(':');
    const [title,issuer,file] = D.certs[category][Number(index)];
    const modal = $('certModal');
    $('certModalTitle').textContent = title;
    $('certModalMeta').textContent = issuer;
    $('certViewer').src = `${file}#view=FitH`;
    $('certDownload').href = file;
    $('certDownload').setAttribute('download', file.split('/').pop());
    modal.hidden = false;
    $('certModalClose').focus();
  });
})();

