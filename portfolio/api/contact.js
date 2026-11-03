const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

// Prevents raw HTML/script injection from form submissions
function escapeHtml(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildEmailHtml({ name, email, message }) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");
  const submittedAt = new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>New Portfolio Message</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f3f4f6; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          
          <tr>
            <td style="background-color: #0f172a; padding: 24px 32px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <h1 style="margin: 0; font-size: 18px; font-weight: 600; color: #ffffff;">
                      New Portfolio Enquiry
                    </h1>
                  </td>
                  <td align="right">
                    <span style="font-size: 12px; color: #94a3b8;">${submittedAt}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 24px 32px 16px 32px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-bottom: 1px solid #f1f5f9; padding-bottom: 16px;">
                <tr>
                  <td style="width: 70px; font-size: 13px; font-weight: 600; text-transform: uppercase; color: #64748b; padding-bottom: 8px;">From:</td>
                  <td style="font-size: 15px; font-weight: 600; color: #1e293b; padding-bottom: 8px;">${safeName}</td>
                </tr>
                <tr>
                  <td style="width: 70px; font-size: 13px; font-weight: 600; text-transform: uppercase; color: #64748b;">Email:</td>
                  <td>
                    <a href="mailto:${safeEmail}" style="font-size: 15px; color: #2563eb; text-decoration: none; font-weight: 500;">
                      ${safeEmail}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 8px 32px 32px 32px;">
              <div style="font-size: 12px; font-weight: 600; text-transform: uppercase; color: #64748b; margin-bottom: 8px;">Message:</div>
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px 20px; font-size: 15px; line-height: 1.6; color: #334155;">
                ${safeMessage}
              </div>

              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin-top: 24px;">
                <tr>
                  <td align="center" style="border-radius: 6px; background-color: #0f172a;">
                    <a href="mailto:${safeEmail}?subject=Re:%20Portfolio%20Enquiry" target="_blank" style="display: inline-block; padding: 10px 20px; font-size: 14px; font-weight: 500; color: #ffffff; text-decoration: none; border-radius: 6px;">
                      Reply Directly &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #f1f5f9; padding: 14px 32px; text-align: center; font-size: 12px; color: #94a3b8;">
              Dispatched from your portfolio contact form.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: ["nishant.daki@gmail.com"],
      reply_to: email,
      subject: `Portfolio enquiry from ${name}`,
      html: buildEmailHtml({ name, email, message }),
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Resend delivery failed:", error);
    return res.status(500).json({ message: "Failed to send email." });
  }
};
