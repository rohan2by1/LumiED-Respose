import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,         // e.g. smtp.gmail.com
  port: Number(process.env.SMTP_PORT), // 587 for TLS, 465 for SSL
  secure: process.env.SMTP_PORT == 465,// true for port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Sends an email using nodemailer
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} [options.from] - Optional custom sender
 */
export async function sendMail({ to, data }) {
  try {
    const info = await transporter.sendMail({
      from: `"LumiEd" <${process.env.SMTP_USER}>`,
      to,
      subject: data.subject,
      html: data.body,
    });
    // console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error: error.message };
  }
}
