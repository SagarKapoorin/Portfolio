import nodemailer, { Transporter } from 'nodemailer';
let transporter: Transporter;
const mailUser = process.env.ADMIN_EMAIL;
const mailPass = process.env.MAIL_PASS;
if (mailUser && mailPass) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: mailUser, pass: mailPass },
    });

} else {
  console.warn('MAILER: SMTP not configured, using JSON transport (no-op)');
  throw new Error('SMTP configuration is required for email functionality');
}

export default transporter;