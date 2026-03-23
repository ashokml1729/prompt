import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendFeedbackEmail({ name, email, message }) {
  // In Resend free tier without a verified domain,
  // you can only send TO your own verified email address
  // and must use onboarding@resend.dev as sender.
  const toEmail = process.env.FEEDBACK_EMAIL || 'ashokbd369@gmail.com';

  try {
    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: toEmail,
      subject: `Prompt Feedback from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed;">New Feedback — Prompt</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <hr style="border: 1px solid #e5e7eb;" />
          <p><strong>Message:</strong></p>
          <p style="background: #f3f4f6; padding: 16px; border-radius: 8px;">${message}</p>
        </div>
      `,
    });
    console.log('Feedback email sent:', result);
    return result;
  } catch (err) {
    console.error('Resend error details:', err);
    throw err;
  }
}