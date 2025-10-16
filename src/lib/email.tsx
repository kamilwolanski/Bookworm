'use server';
import { Resend } from 'resend';
import { WelcomeEmail } from '@/emails/welcome';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(to: string, username: string) {
  if (!to) return;

  const { error } = await resend.emails.send({
    from: `BookWorm <${process.env.EMAIL_FROM!}>`,
    to: to,
    subject: 'Nie odkładaj tej wiadomości na półkę 😉',
    react: <WelcomeEmail username={username} />,
  });

  if (error) {
    console.error('Resend error:', error);
    return;
  }
}
