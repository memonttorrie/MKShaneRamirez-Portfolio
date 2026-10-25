(() => {
  const form = document.getElementById('inquiryForm');
  const status = document.getElementById('inquiryStatus');
  if (!form || !status) return;

  // Replace this with Shane's preferred public contact email to enable email drafts.
  const contactEmail = '';

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    if (!contactEmail) {
      status.textContent = 'Thanks for reaching out. The form is ready, but Shane’s email address hasn’t been added yet. Please message her on LinkedIn for now.';
      return;
    }

    const fields = new FormData(form);
    const fullName = `${fields.get('firstName')} ${fields.get('lastName') || ''}`.trim();
    const subject = `Portfolio inquiry from ${fullName}`;
    const body = `From: ${fullName}\nReply to: ${fields.get('email')}\n\n${fields.get('message')}`;
    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    status.textContent = 'Your email draft is ready. Please review it and send it from your mail app.';
  });
})();
