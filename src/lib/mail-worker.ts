import { redis } from './redis';
import transporter from './mailer';
import { mailQueueKey } from './queue';
import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';
import mjml2html from 'mjml';

// Sender address and base URL for links in emails
const fromAddress = process.env.EMAIL_FROM;
const baseUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || '';

// Precompile MJML templates
const templatesDir = path.resolve(process.cwd(), 'src/lib/email-templates');
const emailTemplates: Record<string, handlebars.TemplateDelegate> = {};
fs.readdirSync(templatesDir).forEach((file) => {
  if (file.endsWith('.mjml')) {
    const name = path.basename(file, '.mjml');
    const srcContent = fs.readFileSync(path.join(templatesDir, file), 'utf8');
    emailTemplates[name] = handlebars.compile(srcContent);
  }
});

function compileEmail(name: string, data: any): string {
  const mjmlContent = emailTemplates[name](data);
  const { html, errors } = mjml2html(mjmlContent, { validationLevel: 'strict' });
  if (errors && errors.length > 0) {
    console.error(`MJML errors for template "${name}":`, errors);
  }
  return html;
}

/**
 * Process up to `maxJobs` mail jobs from the Redis queue.
 * Returns the number of jobs processed.
 */
export async function processMailQueue(maxJobs = 50): Promise<number> {
  let processed = 0;
  for (let i = 0; i < maxJobs; i++) {
    const payload = await redis.rPop(mailQueueKey);
    if (!payload) break;
    let job: { name: string; data: any };
    try {
      job = JSON.parse(payload);
    } catch (err) {
      console.error('Invalid JSON in mail job payload:', err);
      continue;
    }
    const { name, data } = job;
    const year = new Date().getFullYear();
    try {
      if (name === 'payment-email') {
        const { userEmail, paymentData } = data;
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
        await transporter.sendMail({
          from: fromAddress,
          to: process.env.ADMIN_EMAIL,
          subject: `Hire Request: ${title}`,
          html: compileEmail('hire-email-admin', { userEmail, title, budget, projectDetail, timePeriod, year, baseUrl }),
        });
        await transporter.sendMail({
          from: fromAddress,
          to: userEmail,
          subject: 'Hire Request Received',
          html: compileEmail('hire-email-user', { userEmail, title, budget, projectDetail, timePeriod, year, baseUrl }),
        });
      } else {
        console.warn(`Unknown mail job name: ${name}`);
      }
    } catch (err) {
      console.error(`Error sending mail for job ${name}:`, err);
    }
    processed++;
  }
  return processed;
}