(() => {
  const D = window.DATA, $ = id => document.getElementById(id);
  const skillGroups = [
    ['DATA PREPARATION','Make data ready','Cleaning, organizing, and working with structured information.',['Python (pandas, scikit-learn)','Data cleaning and visualization','Microsoft Excel','MySQL'],'--orange'],
    ['ANALYSIS & VISUALIZATION','Find useful patterns','Explore data and present findings in a clear, practical way.',['Data cleaning and visualization','Microsoft Excel','Power BI'],'--blue'],
    ['MACHINE LEARNING','Evaluate experiments','Build and assess coursework and project models with care.',['Python (pandas, scikit-learn)','PyTorch','Model evaluation (F1, confusion matrix)'],'--violet'],
    ['TEXT & LANGUAGE','Explore NLP','Classify and compare approaches to text-based questions.',['NLP and text classification','Python (pandas, scikit-learn)','Model evaluation (F1, confusion matrix)'],'--orange'],
    ['TOOLS & PLATFORMS','Work across tools','Platforms used in projects, learning, and professional workflows.',[],'--blue']
  ];
  const skillLookup = new Map(D.skills.map(([name, level]) => [name, level]));
  $('skillCards').innerHTML = skillGroups.map(([label,title,description,names,color]) => {
    const items = names.length
      ? names.map(name => `<div class="skill-card__item"><span>${name}</span><output>Self-rated · ${skillLookup.get(name)}%</output><span class="skill-card__meter"><i style="--skill-level:${skillLookup.get(name)}%"></i></span></div>`).join('')
      : `<div class="tags">${D.tools.map(tool => `<span>${tool}</span>`).join('')}</div>`;
    return `<article class="skill-card" style="--skill-color:var(${color})"><span class="skill-card__eyebrow">${label}</span><h3>${title}</h3><p>${description}</p><div class="skill-card__items">${items}</div></article>`;
  }).join('');
  $('softSkills').innerHTML = D.soft.map(([n,s,d]) => `<div><b>${s}</b><h4>${n}</h4><p class="muted">${d}</p></div>`).join('');
  const toolsTrack = $('toolsTrack');
  const toolMarks = {'Hugging Face':['🤗','--orange'],'Matplotlib':['M','--blue'],'Google Workspace':['G','--violet'],'Microsoft 365':['365','--blue'],'HubSpot':['H','--orange'],'Canva':['C','--violet']};
  const toolGroup = `<div class="daily-tools__group">${D.tools.map(tool => {
    const [mark,color] = toolMarks[tool] || [tool[0], '--blue'];
    return `<span class="tool-pill"><i class="tool-pill__mark" style="--tool-color:var(${color})">${mark}</i>${tool}</span>`;
  }).join('')}</div>`;
  toolsTrack.innerHTML = toolGroup + toolGroup.replace('<div class="daily-tools__group">', '<div class="daily-tools__group" aria-hidden="true">');
  $('toolsList').textContent = `Tools and platforms used: ${D.tools.join(', ')}.`;
  $('projectGrid').innerHTML = D.projects.map(([c,t,d,tags],i) => `
    <article class="project-card" data-reveal>
      <div class="project-window project-window--${i % 4}">
        <div class="project-window__bar" aria-hidden="true"><span></span><span></span><span></span><div class="project-window__address">shane-ramirez.dev / project-${String(i + 1).padStart(2,'0')}</div></div>
        <div class="project-window__screen">
          <div class="project-window__screen-top"><span>${c}</span><span class="project-window__status">PROJECT ${String(i + 1).padStart(2,'0')}</span></div>
          <div class="project-window__mock-title">${t}</div>
          <div class="project-visual" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><b></b></div>
          <div class="project-window__screen-foot"><span>DATA / ANALYSIS</span><span>↗</span></div>
        </div>
      </div>
      <div class="project-card__body"><small>${c}</small><span class="project-card__arrow" aria-hidden="true">↗</span><h3>${t}</h3><p>${d}</p><div class="tags">${tags.map(x=>`<span>${x}</span>`).join('')}</div></div>
    </article>`).join('');
  $('futureTrack').innerHTML = D.futureProjects.map(([category,title,description,tags],i) => `
    <article class="future-card">
      <div class="future-card__top"><span class="future-card__number">${String(i + 1).padStart(2,'0')}</span><span class="future-card__arrow" aria-hidden="true">↗</span></div>
      <p class="eyebrow">${category}</p><h3>${title}</h3><p class="muted">${description}</p>
      <div class="tags">${tags.map(x=>`<span>${x}</span>`).join('')}</div>
      <span class="future-card__status"><i></i> IN THE WORKS</span>
    </article>`).join('');
  $('timeline').innerHTML = D.experience.map(([when,role,org,d]) => `<li><time>${when}</time><h3>${role}</h3><p class="muted">${org}</p>${d?`<p>${d}</p>`:''}</li>`).join('');
  const certGallery = $('certGallery');
  const renderCerts = key => {
    certGallery.innerHTML = D.certs[key].map(([title,issuer,file],index) => `
      <article class="cert-card" data-cert="${key}:${index}">
        <span class="cert-card__tilt">
          <iframe class="cert-card__preview" src="${file}#toolbar=0&amp;navpanes=0&amp;scrollbar=0&amp;view=FitH" title="Preview of ${title}" loading="lazy" tabindex="-1"></iframe>
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
