import { redis } from './redis';
import transporter from './mailer';
import { mailQueueKey } from './queue';
import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';

// Admin recipient email (where we send alerts)
const adminRecipient = process.env.ADMIN_EMAIL!;
// From address for outgoing emails (fallback to MAIL_USER or adminRecipient)
const fromAddress = process.env.EMAIL_FROM || process.env.MAIL_USER || adminRecipient;
const templatesDir = path.resolve(process.cwd(), 'src/lib/email-templates');
const emailTemplates: Record<string, handlebars.TemplateDelegate> = {};
fs.readdirSync(templatesDir).forEach((file) => {
  if (file.endsWith('.hbs')) {
    const name = path.basename(file, '.hbs');
    const src = fs.readFileSync(path.join(templatesDir, file), 'utf8');
    emailTemplates[name] = handlebars.compile(src);
  }
});

console.log('Mail worker started, waiting for jobs...');
async function processQueue() {
  while (true) {
    try {
      // BRPOP returns [queueKey, payload]
      const res = await redis.brPop(mailQueueKey, 0);
      if (!res) continue;
      const payload = Array.isArray(res) ? res[1] : res.element;
      const job = JSON.parse(payload) as { name: string; data: any };
      const { name, data } = job;
      if (name === 'payment-email') {
        const { userEmail, paymentData } = data;
        // Send to admin
        await transporter.sendMail({
          from: fromAddress,
          to: adminRecipient,
          subject: 'Payment Completed',
          html: emailTemplates['payment-email-admin']({ userEmail, paymentData }),
        });
        // Send to user
        await transporter.sendMail({
          from: fromAddress,
          to: userEmail,
          subject: 'Thank you for your payment',
          html: emailTemplates['payment-email-user']({ userEmail, paymentData }),
        });
      } else if (name === 'hire-email') {
        const { userEmail, title, budget, projectDetail, timePeriod } = data;
        // Send to admin
        const result= await transporter.sendMail({
          from: fromAddress,
          to: adminRecipient,
          subject: `Hire Request: ${title}`,
          html: emailTemplates['hire-email-admin']({ userEmail, title, budget, projectDetail, timePeriod }),
        });
        // Send confirmation to user
        const result2=await transporter.sendMail({
          from: fromAddress,
          to: userEmail,
          subject: 'We received your hire request',
          html: emailTemplates['hire-email-user']({ userEmail, title, budget, projectDetail, timePeriod }),
        });
        console.log('Email sent successfully',result,result2);

      }
      console.log(`Processed job: ${name} with data`, data);
    } catch (err) {
      console.error('Error processing mail job:', err);
      // continue processing next jobs
    }
  }
}

processQueue().catch((err) => console.error('Queue processor crashed:', err));