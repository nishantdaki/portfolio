const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required.' });
  }

  const fromAddress = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

  try {
    const data = await resend.emails.send({
      from: `Nishant Daki Portfolio <${fromAddress}>`,
      to: ['nishant.daki@gmail.com'],
      reply_to: email,
      subject: `Portfolio contact from ${name}`,
      html: `
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, '<br />')}</p>
      `
    });

    return res.status(200).json({ success: true, id: data?.id || null });
  } catch (error) {
    console.error('Resend send error:', error);
    return res.status(500).json({
      message: 'Something went wrong while sending your message. Please try again later.'
    });
  }
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
