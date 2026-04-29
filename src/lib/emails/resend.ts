import { Resend } from 'resend';
import { WelcomeEmail } from './templates/WelcomeEmail';
import { DrawResultsEmail } from './templates/DrawResultsEmail';
import { WinnerAlertEmail } from './templates/WinnerAlertEmail';

// Ensure you have RESEND_API_KEY in your .env.local
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');
const FROM_EMAIL = 'GolfGive <hello@golfgive.com>'; // Replace with verified domain

export async function sendWelcomeEmail(to: string, name: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Welcome to GolfGive! ⛳',
      react: WelcomeEmail({ firstName: name }),
    });
    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('Failed to send welcome email:', err);
    return { success: false, error: err };
  }
}

export async function sendDrawResultsEmail(to: string, name: string, drawDate: string, winningNumbers: number[], matches: number, prizeWon: number) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'GolfGive: Monthly Draw Results are In!',
      react: DrawResultsEmail({ firstName: name, drawDate, winningNumbers, matches, prizeWon }),
    });
    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('Failed to send draw results email:', err);
    return { success: false, error: err };
  }
}

export async function sendWinnerAlertEmail(to: string, name: string, prizeWon: number, winId: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: '🎉 YOU WON! Claim your GolfGive Prize',
      react: WinnerAlertEmail({ firstName: name, prizeWon, winId }),
    });
    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('Failed to send winner alert email:', err);
    return { success: false, error: err };
  }
}
