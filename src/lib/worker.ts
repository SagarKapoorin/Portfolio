import { redis } from './redis';
import transporter from './mailer';
import { mailQueueKey } from './queue';
import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';
import mjml2html from 'mjml';


// Sender address and base URL for links
const fromAddress = process.env.EMAIL_FROM;
const baseUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://sagarkapoor.com';
const templatesDir = path.resolve(process.cwd(), 'src/lib/email-templates');
const emailTemplates: Record<string, handlebars.TemplateDelegate> = {};
// Load MJML templates and compile with Handlebars
fs.readdirSync(templatesDir).forEach((file) => {
  if (file.endsWith('.mjml')) {
    const name = path.basename(file, '.mjml');
    const src = fs.readFileSync(path.join(templatesDir, file), 'utf8');
    emailTemplates[name] = handlebars.compile(src);
  }
});

/**
 * Render and compile an MJML template to HTML
 */
function compileEmail(name: string, data: any) {
  const mjmlContent = emailTemplates[name](data);
  const { html, errors } = mjml2html(mjmlContent, { validationLevel: 'strict' });
  if (errors && errors.length > 0) {
    console.error(`MJML errors for template "${name}":`, errors);
  }
  return html;
}

async function processQueue() {
  while (true) {
    try {
      const res = await redis.brPop(mailQueueKey, 0);
      if (!res) continue;
      const payload = Array.isArray(res) ? res[1] : res.element;
      const job = JSON.parse(payload) as { name: string; data: any };
      const { name, data } = job;
      if (name === 'payment-email') {
        const { userEmail, paymentData } = data;
        const year = new Date().getFullYear();
        // Admin notification
        await transporter.sendMail({
          from: fromAddress,
          to: process.env.ADMIN_EMAIL,
          subject: 'Payment Completed',
          html: compileEmail('payment-email-admin', { userEmail, paymentData, year, baseUrl }),
        });
        // User confirmation
        await transporter.sendMail({
          from: fromAddress,
          to: userEmail,
          subject: 'Payment Confirmation',
          html: compileEmail('payment-email-user', { userEmail, paymentData, year, baseUrl }),
        });
      } else if (name === 'hire-email') {
        const { userEmail, title, budget, projectDetail, timePeriod } = data;
        const year = new Date().getFullYear();
        // Admin notification
        await transporter.sendMail({
          from: fromAddress,
          to: process.env.ADMIN_EMAIL,
          subject: `Hire Request: ${title}`,
          html: compileEmail('hire-email-admin', { userEmail, title, budget, projectDetail, timePeriod, year, baseUrl }),
        });
        // User confirmation
        await transporter.sendMail({
          from: fromAddress,
          to: userEmail,
          subject: 'Hire Request Received',
          html: compileEmail('hire-email-user', { userEmail, title, budget, projectDetail, timePeriod, year, baseUrl }),
        });

      }
    } catch (err) {
      console.error('Error processing mail job:', err);
    }
  }
}

processQueue().catch((err) => console.error('Queue processor crashed:', err));