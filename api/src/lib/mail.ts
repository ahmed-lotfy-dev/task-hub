import { Resend } from 'resend';

// Initialize Resend with API key from environment
// Make sure RESEND_API_KEY is set in your .env file
export const resend = new Resend(process.env.RESEND_API_KEY || 're_123'); // Fallback for dev if needed, but should fail if key missing in prod

interface SendInviteEmailParams {
  email: string;
  inviteLink: string;
  inviterName: string;
  contextName: string; // Workspace or Board name
  type: 'workspace' | 'board';
}

export async function sendInviteEmail({
  email,
  inviteLink,
  inviterName,
  contextName,
  type
}: SendInviteEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'TaskHub <onboarding@resend.dev>', // Change this to your verify domain in production
      to: [email],
      subject: `${inviterName} invited you to join ${contextName} on TaskHub`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>You've been invited!</h2>
          <p><strong>${inviterName}</strong> has invited you to collaborate on the <strong>${contextName}</strong> ${type}.</p>
          <p>Click the button below to accept the invitation and get started:</p>
          <a href="${inviteLink}" style="display: inline-block; background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-top: 16px;">Accept Invitation</a>
          <p style="margin-top: 24px; color: #666; font-size: 14px;">This link will expire in 7 days.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending invite email:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Failed to send email:', err);
    return false;
  }
}
