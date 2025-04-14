import nodemailer from 'nodemailer';

export const sendResetPasswordEmail = async (to: string, token: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: `"No Reply" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Reset your password',
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 15 minutes.</p>`
  });
};
