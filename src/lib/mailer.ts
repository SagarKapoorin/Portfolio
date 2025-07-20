import nodemailer, { Transporter } from 'nodemailer';
// Configure SMTP transporter if all SMTP_* vars are set; otherwise fallback to JSON transport
let transporter: Transporter;
const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
if (smtpHost && smtpPort && smtpUser && smtpPass) {
  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: { user: smtpUser, pass: smtpPass },
  });
} else {
  console.warn('MAILER: SMTP not configured, using JSON transport (no-op)');
  transporter = nodemailer.createTransport({ jsonTransport: true });
}

export default transporter;