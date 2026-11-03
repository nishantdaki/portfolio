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

document.addEventListener('DOMContentLoaded', () => {
  const revealItems = document.querySelectorAll('.reveal');

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    revealItems.forEach((item) => {
      gsap.fromTo(item, {
        opacity: 0,
        y: 28
      }, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 85%'
        }
      });
    });

    gsap.to('.orb-one', {
      y: -20,
      duration: 5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    gsap.to('.orb-two', {
      y: 18,
      duration: 6,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  } else {
    revealItems.forEach((item) => {
      item.style.opacity = '1';
      item.style.transform = 'none';
    });
  }

  document.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('mousemove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 10;
      const rotateX = (0.5 - (y / rect.height)) * 10;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
});
