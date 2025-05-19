import nodemailer from 'nodemailer';
import fs from 'fs';
import handlebars from 'handlebars';
import path from 'path';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendResetPasswordEmail = async (to: string, token: string) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
  const html = `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 15 minutes.</p>`;

  await transporter.sendMail({
    from: `"No Reply" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Reset your password',
    html,
  });
};

export const sendVerificationEmail = async (to: string, token: string, name: string) => {
  try {
    const templatePath = path.join(__dirname, '../templates/verify-email.hbs');
    const source = fs.readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(source);

    const verifyUrl = `${process.env.CLIENT_URL}/verify-account?token=${token}`;
    const html = template({ name, verifyUrl });

    await transporter.sendMail({
      from: `"No Reply" <${process.env.SMTP_USER}>`,
      to,
      subject: 'Verify your account',
      html,
    });
  } catch (err) {
    console.error('Error sending verification email:', err);
    throw new Error('Failed to send verification email');
  }
};
