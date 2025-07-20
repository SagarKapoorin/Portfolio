import { redis } from './redis';
import transporter from './mailer';
import { mailQueueKey } from './queue';
import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';
// Load MJML at runtime to avoid build-time bundler errors
let mjml2html: any;
try {
  // hide require from bundlers
  mjml2html = eval('require')('mjml');
} catch (err) {
  console.warn('MJML not available, templates will not be converted to HTML', err);
  mjml2html = null;
}

// Prepare email templates
const fromAddress = process.env.EMAIL_FROM;
const baseUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://sagarkapoor.com';
const templatesDir = path.resolve(process.cwd(), 'src/lib/email-templates');
const emailTemplates: Record<string, handlebars.TemplateDelegate> = {};
fs.readdirSync(templatesDir).forEach((file) => {
  if (file.endsWith('.mjml')) {
    const name = path.basename(file, '.mjml');
    const src = fs.readFileSync(path.join(templatesDir, file), 'utf8');
    emailTemplates[name] = handlebars.compile(src);
  }
});

// Compile MJML templates to HTML
function compileEmail(name: string, data: any): string {
  const content = emailTemplates[name](data);
  if (mjml2html) {
    const { html, errors } = mjml2html(content, { validationLevel: 'strict' });
    if (errors && errors.length > 0) {
      console.error(`MJML errors for template "${name}":`, errors);
    }
    return html;
  }
  // Fallback: return raw template content
  return content;
}

/**
 * Drain all mail jobs from Redis queue and send emails.
 * @returns number of processed jobs
 */
export async function drainMailQueue(): Promise<number> {
  let count = 0;
  while (true) {
    const payload = await redis.rPop(mailQueueKey);
    if (!payload) break;
    count++;
    try {
      const job = JSON.parse(payload) as { name: string; data: any };
      const { name, data } = job;
      if (name === 'payment-email') {
        const { userEmail, paymentData } = data;
        const year = new Date().getFullYear();
        await transporter.sendMail({
          from: fromAddress,
          to: process.env.ADMIN_EMAIL,
          subject: 'Payment Completed',
          html: compileEmail('payment-email-admin', { userEmail, paymentData, year, baseUrl }),
        });
        await transporter.sendMail({
          from: fromAddress,
          to: userEmail,
          subject: 'Payment Confirmation',
          html: compileEmail('payment-email-user', { userEmail, paymentData, year, baseUrl }),
        });
      } else if (name === 'hire-email') {
        const { userEmail, title, budget, projectDetail, timePeriod } = data;
        const year = new Date().getFullYear();
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
      console.error('Error processing mail job:', err);
    }
  }
  return count;
}