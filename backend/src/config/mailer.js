const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendContactEmail = async ({ name, email, subject, message }) => {
  const mailOptions = {
    from: `"Portfolio Contact" <${process.env.EMAIL_FROM}>`,
    to: process.env.EMAIL_TO,
    replyTo: email,
    subject: `[Portfolio Contact] ${subject || 'New Message'}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0F; color: #F5F5F7; padding: 32px; border-radius: 12px; border: 1px solid #2A2A35;">
        <h2 style="color: #FF1B6B; margin-top: 0;">New Contact Form Submission</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #9A9AA5; width: 100px;">From:</td>
            <td style="padding: 8px 0; font-weight: bold;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #9A9AA5;">Email:</td>
            <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #4EA8FF;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #9A9AA5;">Subject:</td>
            <td style="padding: 8px 0;">${subject || 'No subject'}</td>
          </tr>
        </table>
        <hr style="border: 1px solid #2A2A35; margin: 24px 0;" />
        <h3 style="color: #9D4EDD; margin-top: 0;">Message:</h3>
        <p style="line-height: 1.7; white-space: pre-line;">${message}</p>
        <hr style="border: 1px solid #2A2A35; margin: 24px 0;" />
        <p style="color: #9A9AA5; font-size: 12px;">Sent via portfolio contact form at ${new Date().toISOString()}</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

const sendAutoReply = async ({ name, email }) => {
  const mailOptions = {
    from: `"Jeff Developer" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: `Thanks for reaching out, ${name}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0F; color: #F5F5F7; padding: 32px; border-radius: 12px; border: 1px solid #2A2A35;">
        <h2 style="color: #FF1B6B; margin-top: 0;">Message Received ✓</h2>
        <p>Hi <strong>${name}</strong>,</p>
        <p>Thanks for getting in touch! I've received your message and will get back to you as soon as possible — usually within 24–48 hours.</p>
        <p style="color: #9A9AA5;">If your matter is urgent, you can also reach me directly at <a href="mailto:${process.env.EMAIL_TO}" style="color: #4EA8FF;">${process.env.EMAIL_TO}</a>.</p>
        <p>Talk soon,<br /><strong>Jeff</strong></p>
        <hr style="border: 1px solid #2A2A35; margin: 24px 0;" />
        <p style="color: #9A9AA5; font-size: 12px;">This is an automated confirmation. Please do not reply to this email directly.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { transporter, sendContactEmail, sendAutoReply };
