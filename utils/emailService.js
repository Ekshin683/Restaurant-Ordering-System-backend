import nodemailer from 'nodemailer';

const requiredSmtpKeys = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'];

const assertSmtpConfig = () => {
  const missing = requiredSmtpKeys.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Email service is not configured. Missing env vars: ${missing.join(', ')}. ` +
      'Set SMTP_USER to your sender email and SMTP_PASS to an app password.'
    );
  }
};

const createTransporter = () => {
  assertSmtpConfig();

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export const sendPasswordResetEmail = async ({ to, name, resetUrl }) => {
  const transporter = createTransporter();
  await transporter.verify();
  const fromAddress = process.env.EMAIL_FROM || process.env.SMTP_USER;

  const info = await transporter.sendMail({
    from: fromAddress,
    to,
    subject: 'Reset your Bawarchi password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #222;">
        <h2 style="color: #a33722;">Password Reset Request</h2>
        <p>Hello ${name || 'Guest'},</p>
        <p>We received a request to reset your Bawarchi account password.</p>
        <p style="margin: 24px 0;">
          <a href="${resetUrl}" style="background: #a33722; color: #fff; padding: 12px 18px; border-radius: 8px; text-decoration: none; font-weight: 700;">Reset Password</a>
        </p>
        <p>This link is valid for 15 minutes.</p>
        <p>If you did not request this, you can safely ignore this email.</p>
      </div>
    `,
  });

  return info;
};
