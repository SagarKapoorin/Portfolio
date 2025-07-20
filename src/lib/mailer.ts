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
  console.warn(
    'MAILER: SMTP not configured, falling back to JSON transport for development'
  );
  transporter = nodemailer.createTransport({ jsonTransport: true });
}

export default transporter;