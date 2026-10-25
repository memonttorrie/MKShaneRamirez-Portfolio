document.addEventListener('DOMContentLoaded', () => {
  const launcher = document.getElementById('chatLauncher');
  const panel = document.getElementById('chatPanel');
  const closeButton = document.getElementById('chatClose');
  const form = document.getElementById('chatForm');
  const input = document.getElementById('chatInput');
  const messages = document.getElementById('chatMessages');
  const prompt = document.getElementById('chatPrompt');
  const knowledge = window.PORTFOLIO_KNOWLEDGE;
  const MAX_HISTORY = 6;
  const MAX_MESSAGE_CHARS = 1400;
  // Add the deployed Worker URL here after deployment. No API secret belongs in this file.
  const API_URL = window.CHAT_API_URL || '';
  const history = [];
  let promptDismissed = false;
  let replyPending = false;
  let promptTimer;
  let returnFocus = launcher;

  const hidePrompt = () => {
    prompt.classList.remove('is-visible');
    clearTimeout(promptTimer);
  };
  const showPrompt = () => {
    if (panel.hidden && !promptDismissed) prompt.classList.add('is-visible');
  };
  const open = () => {
    returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : launcher;
    panel.hidden = false;
    panel.setAttribute('aria-hidden', 'false');
    launcher.setAttribute('aria-expanded', 'true');
    promptDismissed = true;
    hidePrompt();
    input.focus();
  };
  const close = () => {
    panel.hidden = true;
    panel.setAttribute('aria-hidden', 'true');
    launcher.setAttribute('aria-expanded', 'false');
    (returnFocus?.isConnected ? returnFocus : launcher).focus();
  };
  const appendContactActions = message => {
    const actions = document.createElement('span');
    actions.className = 'chat-message__actions';
    const resume = document.createElement('a');
    resume.href = 'resume/Resume_ShaneRamirez.pdf';
    resume.textContent = 'Get my resume';
    const contact = document.createElement('a');
    contact.href = 'index.html#contact';
    contact.textContent = 'Get in touch';
    actions.append(resume, contact);
    message.append(actions);
  };
  const addMessage = (reply, sender) => {
    const message = document.createElement('div');
    message.className = `chat-message chat-message--${sender} chat-message--enter`;
    const content = typeof reply === 'string' ? { text: reply } : reply;
    message.append(document.createTextNode(content.text || ''));
    if (sender === 'bot' && content.showContact) appendContactActions(message);
    if (sender === 'bot' && content.followUp?.question && Array.isArray(content.followUp.options) && content.followUp.options.length) {
      const followUp = document.createElement('div');
      followUp.className = 'chat-followup';
      const question = document.createElement('p');
      question.textContent = content.followUp.question;
      const options = document.createElement('div');
      options.className = 'chat-followup__options';
      for (const option of content.followUp.options.slice(0, 3)) {
        if (typeof option !== 'string' || !option.trim()) continue;
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = option;
        options.append(button);
      }
      if (options.childElementCount) {
        followUp.append(question, options);
        message.append(followUp);
      }
    }
    messages.append(message);
    messages.scrollTop = messages.scrollHeight;
    setTimeout(() => message.classList.remove('chat-message--enter'), 350);
    return content.text || '';
  };
  const cleanText = text => text.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, ' ').replace(/\s+/g, ' ').trim();
  const fallbackFollowUp = (question, reply) => {
    const q = cleanText(question);
    const answer = cleanText(reply?.text || '');
    if (!q || /^(help|something|can you help|i need help|tell me more|what do you think)$/.test(q) || /not sure i have enough context|what are you trying to figure out|is your question about/.test(answer)) {
      return { question: 'What would be most useful right now?', options: ['Explore projects', 'See skills and tools', 'Ask about internships'] };
    }
    if (/\b(recruit|hire|hiring|internship|intern|candidate|resume|cv)\b/.test(q)) {
      return { question: 'What would help you evaluate the fit?', options: ['Relevant projects', 'Technical skills', 'Resume and contact'] };
    }
    if (/\b(project|projects|built|portfolio|work sample)\b/.test(q)) {
      return { question: 'Which area would you like to explore?', options: ['Taglish NLP project', 'Computer vision project', 'Excel real-estate leads database'] };
    }
    if (/\b(skill|skills|tools|tool|python|sql|excel|power bi|mysql)\b/.test(q)) {
      return { question: 'What would you like to connect those skills to?', options: ['Python and SQL project examples', 'Current experience', 'Internship availability'] };
    }
    if (/\b(learn|learning|begin|start|study|career|interview|job search)\b/.test(q)) {
      return { question: 'What would be most helpful as a next step?', options: ['How do I start learning data analytics?', 'Suggest a first portfolio project', 'How should I prepare for a data interview?'] };
    }
    return null;
  };
  const isSensitiveOrHarmful = text => /(\b(address|phone|mobile|personal details|private details)\b|password|api key|credit card|ssn|social security|\b(make|build|create|write)\b.{0,35}\b(bomb|explosive|malware|ransomware|weapon|virus|poison)\b|\b(steal credentials|phish|dox|swat)\b|hack (?:someone|a person|an account)|\b(hurt|kill|harm|attack) (?:someone|her|him|shane|a person)\b)/i.test(text);
  const findFallback = question => {
    const q = cleanText(question);
    if (!q || q.length < 3 || /^(help|something|can you help|i need help|tell me more|what do you think)$/.test(q)) {
      return { text: 'Sure — what are you trying to figure out? You can share a little context, and I’ll help from there.' };
    }
    if (/\b(email|e-mail)\b/.test(q)) {
      const contact = (knowledge?.fallbackAnswers || []).find(entry => entry.topic === 'contact');
      return { text: contact?.answer || 'The email button on the site is currently a placeholder. LinkedIn or GitHub is the reliable way to reach Shane.', showContact: true };
    }
    if (isSensitiveOrHarmful(q)) {
      return { text: 'I can’t help with private details or harmful requests. I can help with public information about Shane’s work, or with a question about learning data analytics.' };
    }
    if (/\b(hi|hello|hey|good morning|good afternoon)\b/.test(q)) {
      return { text: 'Hi, I’m glad you stopped by. What would you like to know about Shane’s work or internship interests?' };
    }
    if (/\b(thanks|thank you|ty)\b/.test(q)) return { text: 'You’re welcome. What else would be useful to know?' };
    if (/(who is|tell me about|about shane|what does shane do|what is shane studying|what is she studying)/.test(q)) {
      return { text: knowledge?.person?.about || 'Shane is a Computer Engineering student building experience in data analytics and machine-learning projects.' };
    }

    const answers = knowledge?.fallbackAnswers || [];
    const queryWords = new Set(q.split(' ').filter(word => word.length > 2));
    let best = null;
    let bestScore = 0;
    for (const entry of answers) {
      let score = 0;
      for (const rawKeyword of entry.keywords) {
        const keyword = cleanText(rawKeyword);
        if (q.includes(keyword)) score += keyword.includes(' ') ? 4 : 2;
        else if (keyword.includes(' ')) {
          const matches = keyword.split(' ').filter(word => word.length > 2 && queryWords.has(word)).length;
          if (matches > 1) score += matches;
        } else if ([...queryWords].some(word => word === keyword || (keyword.length > 4 && word.startsWith(keyword)))) score += 1;
      }
      if (score > bestScore) { best = entry; bestScore = score; }
    }
    if (best && bestScore >= 2) {
      const greeting = ['Sure. ', 'Good question. ', 'From the portfolio: '][Math.floor(Math.random() * 3)];
      return {
        text: `${greeting}${best.answer}`,
        showContact: ['internship', 'contact'].includes(best.topic) || /recruit|hire|intern|interview|\brole\b/.test(q)
      };
    }

    if (/(learn|learning|begin|start|study|tool|tools).*(data|analytics|excel|python|sql)|(data|analytics).*(learn|learning|begin|start|study|tool|tools)/.test(q)) {
      if (/\bsql\b/.test(q)) return { text: 'A good way to learn SQL is to practice SELECTs, filters, joins, and grouped summaries on a small dataset, then explain what you found. Build up one query at a time; understanding why each join changes the rows matters more than memorizing syntax.' };
      if (/\bpython\b/.test(q)) return { text: 'Start with a small dataset and practice loading it, checking missing values, grouping rows, and making one clear chart. Python becomes easier when each step answers a question you care about, instead of learning every library at once.' };
      const answer = answers.find(entry => entry.topic === 'learning advice');
      return { text: answer?.answer || 'Start with one small question and a dataset you can understand. Clean it, explore it, and explain what you learned and what you still don’t know.' };
    }
    if (/\b(avoid false positives|false alarms|precision)\b/.test(q)) {
      return { text: 'Precision tells you how often a positive prediction is correct. If false alarms are costly, compare precision across models at the threshold you would actually use; raising the threshold often reduces false positives but can also miss more real cases.' };
    }
    if (/\b(catch more true cases|false negatives|recall)\b/.test(q)) {
      return { text: 'Recall measures how many of the real positive cases the model catches. If missing a true case is costly, prioritize recall, then check how many false alarms that creates and whether the trade-off is acceptable.' };
    }
    if (/\b(class balance|class imbalance)\b/.test(q)) {
      return { text: 'With imbalanced classes, a model can look accurate by mostly predicting the majority class. Check the class counts and confusion matrix, and compare per-class precision, recall, and F1 against a simple baseline.' };
    }
    if (/\b(find trends|summarize trends)\b/.test(q)) {
      return { text: 'For a trend, check how the measure changes over a consistent time interval, confirm the underlying counts are comparable, and look for seasonality or missing periods before explaining the cause. A trend shows movement; it does not by itself prove what caused it.' };
    }
    if (/\b(compare groups|compare categories)\b/.test(q)) {
      return { text: 'For a fair group comparison, define the same outcome and time window for each group, inspect group sizes, and compare both rates and raw counts. Differences can be misleading if the groups have different mixes or exposure.' };
    }
    if (/\b(build a prediction|predict an outcome|make a prediction)\b/.test(q)) {
      return { text: 'Before building a prediction, define what decision it should support and what counts as a costly mistake. Start with a simple baseline, hold out data the model never sees during training, then compare metrics that match those error costs.' };
    }
    if (/\b(accuracy|precision|recall|f1|confusion matrix|classification metric|which metric|model performance)\b/.test(q)) {
      return {
        text: 'Accuracy alone can hide important mistakes, especially when classes are uneven. I’d compare a simple baseline with precision, recall, F1, and the confusion matrix on held-out data, then choose based on which error matters most in practice.',
        followUp: { question: 'Which trade-off matters most for your use case?', options: ['Avoid false positives', 'Catch more true cases', 'Check class balance'] }
      };
    }
    if (/\b(analy[sz]e|analysis|insight|interpret|dataset|data)\b/.test(q) && /\b(how|what|why|should|which|good|best|start)\b/.test(q)) {
      return {
        text: 'I’d start with the decision the analysis needs to support, then check what each column means, how complete the data is, and what a simple summary shows. From there, compare the relevant groups or time periods and be careful not to treat a pattern as proof of cause.',
        followUp: { question: 'What kind of answer are you looking for?', options: ['Find trends', 'Compare groups', 'Build a prediction'] }
      };
    }
    if (/(career|interview|portfolio|job search|job-search|confidence|motivation)/.test(q)) {
      return { text: 'A practical next step is to choose one role you want, compare its requirements with your current skills, then build or describe one project that shows how you think. What role are you aiming for?' };
    }
    if (/(data|analytics).*(career|job|role|resume|skills)|(career|job|role|resume|skills).*(data|analytics)/.test(q)) {
      return { text: 'For a data role, focus on the work employers can see: clean a dataset, answer a concrete question with SQL or Python, then explain the result and its limits. One clear project is often more useful than a long list of tools. What kind of data role are you aiming for?' };
    }
    if (/(^|\s)(you are|ur) (stupid|dumb|useless)|\bshut up\b/.test(q)) {
      return { text: 'I hear you. I’m here to help if you have a question about Shane’s portfolio, her internship interests, or learning data analytics.' };
    }
    return { text: 'I’m not sure I have enough context to answer that well. Is your question about Shane’s projects, skills, experience, or something else?' };
  };
  const askAI = async text => {
    if (!API_URL || !knowledge || API_URL.includes('YOUR-WORKER')) throw new Error('Chat Worker URL is not configured');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...history, { role: 'user', content: text }].slice(-MAX_HISTORY) }),
        signal: controller.signal
      });
      if (!response.ok) throw new Error(`Chat Worker returned ${response.status}`);
      const result = await response.json();
      if (typeof result.reply !== 'string' || !result.reply.trim()) throw new Error('Empty assistant reply');
      const options = Array.isArray(result.followUp?.options)
        ? result.followUp.options.filter(option => typeof option === 'string' && option.trim()).slice(0, 3)
        : [];
      const followUp = typeof result.followUp?.question === 'string' && options.length > 1
        ? { question: result.followUp.question.slice(0, 180), options: options.map(option => option.slice(0, 80)) }
        : null;
      return { text: result.reply.trim(), showContact: result.showContact === true, followUp };
    } finally {
      clearTimeout(timeout);
    }
  };
  const send = async question => {
    const text = question.trim();
    if (!text || replyPending) return;
    if (text.length > MAX_MESSAGE_CHARS) {
      addMessage(`Please keep your message under ${MAX_MESSAGE_CHARS} characters so I can respond clearly.`, 'bot');
      return;
    }
    messages.querySelector('.chat-suggestions')?.remove();
    addMessage(text, 'user');
    const typing = document.createElement('div');
    typing.className = 'chat-typing';
    typing.setAttribute('role', 'status');
    typing.setAttribute('aria-label', 'Moana is thinking');
    typing.innerHTML = '<i></i><i></i><i></i>';
    messages.append(typing);
    messages.scrollTop = messages.scrollHeight;
    replyPending = true;
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    input.disabled = true;

    const naturalDelay = new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 500));
    let reply;
    try {
      [reply] = await Promise.all([askAI(text), naturalDelay]);
    } catch (error) {
      if (API_URL) console.warn('Chat Worker unavailable; using local knowledge fallback.', error);
      reply = findFallback(text);
      await naturalDelay;
    }

    if (!reply.followUp) reply.followUp = fallbackFollowUp(text, reply);

    history.push({ role: 'user', content: text }, { role: 'assistant', content: reply.text });
    if (history.length > MAX_HISTORY) history.splice(0, history.length - MAX_HISTORY);
    typing.remove();
    addMessage(reply, 'bot');
    replyPending = false;
    submitButton.disabled = false;
    input.disabled = false;
    input.focus();
  };

  launcher.addEventListener('click', () => panel.hidden ? open() : close());
  launcher.addEventListener('pointerenter', () => { promptTimer = setTimeout(showPrompt, 350); });
  launcher.addEventListener('pointerleave', hidePrompt);
  launcher.addEventListener('focus', showPrompt);
  closeButton.addEventListener('click', close);
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (replyPending) return;
    const value = input.value;
    input.value = '';
    send(value);
  });
  messages.addEventListener('click', event => {
    const option = event.target.closest('.chat-suggestions button, .chat-followup__options button');
    if (!option) return;
    option.closest('.chat-followup, .chat-suggestions')?.remove();
    send(option.textContent);
  });
  panel.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const focusable = [...panel.querySelectorAll('button:not(:disabled),input:not(:disabled),a[href]')];
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || promptDismissed) return;
    clearTimeout(promptTimer);
    if (event.target.closest('a,button,input,textarea,summary')) { hidePrompt(); return; }
    promptTimer = setTimeout(showPrompt, 1400);
  }, { passive: true });
  addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) close();
  });
});
