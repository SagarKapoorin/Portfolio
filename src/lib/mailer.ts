import nodemailer, { Transporter } from 'nodemailer';

// Email transporter: real SMTP if configured, otherwise JSON transport (no-op)
// Configure SMTP transport (Gmail or generic host) or fallback to JSON stub
let transporter: Transporter;
const mailUser = process.env.MAIL_USER;
const mailPass = process.env.MAIL_PASS;
if (mailUser && mailPass) {
  if (process.env.MAIL_HOST?.includes('gmail.com')) {
    // Use Gmail service for convenience
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: mailUser, pass: mailPass },
    });
  } else {
    // Generic SMTP
    transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT || '587', 10),
      secure: process.env.MAIL_SECURE === 'true',
      auth: { user: mailUser, pass: mailPass },
    });
  }
} else {
  console.warn('MAILER: SMTP not configured, using JSON transport (no-op)');
  transporter = nodemailer.createTransport({ jsonTransport: true });
}

export default transporter;