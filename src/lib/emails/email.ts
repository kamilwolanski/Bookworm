// lib/emails/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(to: string, name?: string) {
  if (!to) return;

  const html = `
    <div style="font-family:Inter,system-ui,Arial">
      <h1>Witaj${name ? `, ${name}` : ''}!</h1>
      <p>Dzięki za założenie konta. Miłego korzystania z aplikacji 🎉</p>
    </div>
  `;

  const { data, error } = await resend.emails.send({
    from: `BookWorm <${process.env.EMAIL_FROM!}>`, // np. "TwojaAplikacja <onboarding@resend.dev>"
    to: to,
    subject: 'Witamy na pokładzie!',
    html,
    
  });

  if (error) {
    console.error('Resend error:', error);
    // opcjonalnie: wrzuć do logów/monitoringu
    return;
  }

  // opcjonalnie: console.log('Resend message id:', data?.id);
}
