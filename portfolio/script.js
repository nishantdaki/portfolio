tailwind.config = {
  theme: {
    extend: {
      colors: {
        night: '#020817',
        panel: '#0f172a',
        accent: '#7c3aed',
        mint: '#34d399',
        sky: '#38bdf8'
      },
      boxShadow: {
        glow: '0 0 30px rgba(124, 58, 237, 0.35)'
      }
    }
  }
};

function openContactModal() {
  const modal = document.getElementById('contact-modal');
  const successMessage = document.getElementById('contact-success');
  const formPanel = document.getElementById('contact-form-panel');

  if (successMessage) {
    successMessage.classList.add('hidden');
    successMessage.classList.remove('visible');
  }
  if (formPanel) formPanel.classList.remove('hidden');
  if (modal) modal.classList.remove('hidden');
}

function closeContactModal() {
  const modal = document.getElementById('contact-modal');
  const successMessage = document.getElementById('contact-success');
  const formPanel = document.getElementById('contact-form-panel');

  if (successMessage) {
    successMessage.classList.add('hidden');
    successMessage.classList.remove('visible');
  }
  if (formPanel) formPanel.classList.remove('hidden');
  if (modal) modal.classList.add('hidden');
}

async function handleContactSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const formPanel = document.getElementById('contact-form-panel');
  const successMessage = document.getElementById('contact-success');
  const submitButton = form.querySelector('button[type="submit"]');

  if (!formPanel || !successMessage || !submitButton) return;

  submitButton.disabled = true;
  submitButton.textContent = 'Sending...';

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: form.name.value,
        email: form.email.value,
        message: form.message.value
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to send message');
    }

    form.reset();
    formPanel.classList.add('hidden');
    successMessage.classList.remove('hidden');
    requestAnimationFrame(() => {
      successMessage.classList.add('visible');
    });

    setTimeout(() => {
      closeContactModal();
    }, 2000);
  } catch (error) {
    alert(error.message || 'Something went wrong while sending your message. Please try again.');
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Send Message';
  }
}
