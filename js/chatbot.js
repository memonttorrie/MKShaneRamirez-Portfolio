document.addEventListener('DOMContentLoaded', () => {
  const launcher = document.getElementById('chatLauncher');
  const panel = document.getElementById('chatPanel');
  const closeButton = document.getElementById('chatClose');
  const form = document.getElementById('chatForm');
  const input = document.getElementById('chatInput');
  const messages = document.getElementById('chatMessages');
  const prompt = document.getElementById('chatPrompt');
  const data = window.DATA || {};
  let promptDismissed = false;
  let replyPending = false;
  let promptTimer;
  let typingTimer;
  let businessStage = '';
  const businessAnswers = {};

  const hidePrompt = () => {
    prompt.classList.remove('is-visible');
    clearTimeout(promptTimer);
  };
  const showPrompt = () => {
    if (panel.hidden && !promptDismissed) prompt.classList.add('is-visible');
  };
  const open = () => {
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
    launcher.focus();
  };
  const setBusinessStage = (stage, reply) => {
    businessStage = stage;
    return reply;
  };
  const assessBusiness = question => {
    if (businessStage === 'business') {
      businessAnswers.business = question;
      return setBusinessStage('challenge', 'Thanks. What feels most difficult right now—finding customers, following up with leads, understanding sales, organizing data, or something else?');
    }
    if (businessStage === 'challenge') {
      businessAnswers.challenge = question;
      return setBusinessStage('process', 'Got it. How do you handle that today? For example, what tools, spreadsheets, or manual steps are involved?');
    }
    if (businessStage === 'process') {
      businessAnswers.process = question;
      return setBusinessStage('goal', 'What would a helpful improvement look like for you—fewer manual steps, clearer reporting, better follow-up, or another outcome?');
    }
    if (businessStage === 'goal') {
      businessAnswers.goal = question;
      businessStage = '';
      const challenge = businessAnswers.challenge.toLowerCase();
      let relevantExperience = 'data preparation and analysis projects';
      if (/(lead|customer|sales|follow.?up|prospect)/.test(challenge)) relevantExperience = 'lead generation work and a real-estate leads database project';
      else if (/(report|dashboard|data|spreadsheet|number|insight)/.test(challenge)) relevantExperience = 'Excel lead tracking, data analysis, and visualization coursework';
      else if (/(text|message|review|language)/.test(challenge)) relevantExperience = 'Taglish text-classification and NLP projects';
      else if (/(image|photo|visual|sorting|waste|garment)/.test(challenge)) relevantExperience = 'computer-vision projects, including waste image classification and textile sorting';
      return {
        text: `Thanks for sharing. I understood that your business is ${businessAnswers.business}; the main challenge is ${businessAnswers.challenge}; the current process is ${businessAnswers.process}; and you’d like ${businessAnswers.goal}. The closest experience shown on Shane’s portfolio is ${relevantExperience}. This is only an initial fit check—not a promise of a specific result, timeline, or service. If it sounds relevant, you can use the Contact section to discuss the details with Shane.`,
        contact: true
      };
    }
    return null;
  };
  const replyTo = question => {
    const q = question.toLowerCase();
    const businessAnswer = assessBusiness(question);
    if (businessAnswer) return businessAnswer;
    if (/\b(hi|hello|hey|good morning|good afternoon)\b/.test(q)) {
      return 'Hi! I can share what’s on this portfolio about Shane’s projects, skills, experience, certificates, and career interests. If you’re exploring a business need, tell me what your business does.';
    }
    if (/(business|company|my shop|my team).*(help|support|work|improve|need)|(help|support|work).*(my business|my company)/.test(q)) {
      return setBusinessStage('business', 'Possibly, depending on the problem and scope. Shane’s portfolio shows data analytics, Python/SQL/Excel work, machine-learning projects, and lead-generation experience. What does your business do?');
    }
    if (/(project|built|portfolio|work sample)/.test(q)) {
      const projects = data.projects || [];
      return `Shane’s projects include ${projects.map(([, title]) => title).join('; ')}. These are student and portfolio projects; open the Work section to see their scope and tools.`;
    }
    if (/(skill|tool|technology|python|sql|excel|power bi|machine learning|nlp)/.test(q)) {
      const skills = data.skills || [];
      return `The portfolio lists experience with ${skills.map(([name]) => name).join(', ')}. Tools also include ${(data.tools || []).join(', ')}. These are developing skills and project experience, not a claim of expert-level proficiency.`;
    }
    if (/(experience|job|career|lead generation|customer service)/.test(q)) {
      return 'Shane has experience in lead generation, real-estate property support, construction liaison work, and customer service. The Experience section has role details.';
    }
    if (/(certificate|certification|credential|course)/.test(q)) {
      const count = Object.values(data.certs || {}).reduce((total, items) => total + items.length, 0);
      return `There are ${count} certificates listed, including AWS Academy, Cisco, Google Data Analytics, Enactus, and LinkedIn Learning. Select a certificate to preview its PDF or download it.`;
    }
    if (/(service|help|offer|expertise|framework|process|how.*work)/.test(q)) {
      return 'Shane is building experience in data preparation, analysis and visualization, machine-learning exploration, NLP, computer vision, lead operations, and communication. The Skills Framework page explains the project workflow. This portfolio does not promise a specific paid service.';
    }
    if (/(future|roadmap|plan|next project)/.test(q)) {
      return `Planned explorations include ${(data.futureProjects || []).map(([, title]) => title).join(', ')}. They’re roadmap ideas, not completed projects.`;
    }
    if (/(contact|email|hire|resume|reach)/.test(q)) {
      return 'Use the Contact section to connect with Shane on LinkedIn or GitHub, or download the resume from the sidebar. The email link is also in the Contact section.';
    }
    return 'I can answer portfolio questions or help you check whether Shane’s listed experience may relate to a business need. What would you like to know?';
  };
  const addMessage = (reply, sender) => {
    const message = document.createElement('div');
    message.className = `chat-message chat-message--${sender}`;
    if (typeof reply === 'string') {
      message.textContent = reply;
    } else {
      message.append(document.createTextNode(reply.text));
      if (reply.contact) {
        const link = document.createElement('a');
        link.href = 'index.html#contact';
        link.textContent = ' Go to Contact ↗';
        message.append(link);
      }
    }
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
  };
  const send = question => {
    const text = question.trim();
    if (!text || replyPending) return;
    messages.querySelector('.chat-suggestions')?.remove();
    addMessage(text, 'user');
    const typing = document.createElement('div');
    typing.className = 'chat-typing';
    typing.setAttribute('role', 'status');
    typing.setAttribute('aria-label', 'Moana is thinking');
    typing.innerHTML = '<i></i><i></i><i></i>';
    messages.appendChild(typing);
    messages.scrollTop = messages.scrollHeight;
    replyPending = true;
    form.querySelector('button[type="submit"]').disabled = true;
    input.disabled = true;
    const reply = replyTo(text);
    typingTimer = setTimeout(() => {
      typing.remove();
      addMessage(reply, 'bot');
      replyPending = false;
      form.querySelector('button[type="submit"]').disabled = false;
      input.disabled = false;
      input.focus();
    }, Math.min(1000, Math.max(600, String(reply.text || reply).length * 3)));
  };

  launcher.addEventListener('click', () => panel.hidden ? open() : close());
  launcher.addEventListener('pointerenter', () => {
    promptTimer = setTimeout(showPrompt, 350);
  });
  launcher.addEventListener('pointerleave', hidePrompt);
  launcher.addEventListener('focus', showPrompt);
  closeButton.addEventListener('click', close);
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (replyPending) return;
    send(input.value);
    input.value = '';
  });
  messages.addEventListener('click', event => {
    const suggestion = event.target.closest('.chat-suggestions button');
    if (!suggestion) return;
    send(suggestion.textContent);
  });
  addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || promptDismissed) return;
    clearTimeout(promptTimer);
    if (event.target.closest('a,button,input,textarea,summary')) {
      hidePrompt();
      return;
    }
    promptTimer = setTimeout(showPrompt, 1400);
  }, {passive: true});
  addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) close();
  });
  addEventListener('pagehide', () => clearTimeout(typingTimer), {once: true});
});
