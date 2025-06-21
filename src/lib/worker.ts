import { redis } from './redis';
import transporter from './mailer';
import { mailQueueKey } from './queue';
import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';


const fromAddress = process.env.EMAIL_FROM;
const templatesDir = path.resolve(process.cwd(), 'src/lib/email-templates');
const emailTemplates: Record<string, handlebars.TemplateDelegate> = {};
fs.readdirSync(templatesDir).forEach((file) => {
  if (file.endsWith('.hbs')) {
    const name = path.basename(file, '.hbs');
    const src = fs.readFileSync(path.join(templatesDir, file), 'utf8');
    emailTemplates[name] = handlebars.compile(src);
  }
});

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
        await transporter.sendMail({
          from: fromAddress,
          to: process.env.ADMIN_EMAIL,
          subject: 'Payment Completed',
          html: emailTemplates['payment-email-admin']({ userEmail, paymentData }),
        });
        await transporter.sendMail({
          from: fromAddress,
          to: userEmail,
          subject: 'Thank you for your payment',
          html: emailTemplates['payment-email-user']({ userEmail, paymentData }),
        });
      } else if (name === 'hire-email') {
        const { userEmail, title, budget, projectDetail, timePeriod } = data;
        await transporter.sendMail({
          from: fromAddress,
          to: process.env.ADMIN_EMAIL,
          subject: `Hire Request: ${title}`,
          html: emailTemplates['hire-email-admin']({ userEmail, title, budget, projectDetail, timePeriod }),
        });
        await transporter.sendMail({
          from: fromAddress,
          to: userEmail,
          subject: 'We received your hire request',
          html: emailTemplates['hire-email-user']({ userEmail, title, budget, projectDetail, timePeriod }),
        });

      }
    } catch (err) {
      console.error('Error processing mail job:', err);
    }
  }
}

processQueue().catch((err) => console.error('Queue processor crashed:', err));