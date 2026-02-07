import { Resend } from 'resend';

// Initialize Resend with API key from environment
// Make sure RESEND_API_KEY is set in your .env file
export const resend = new Resend(process.env.RESEND_API_KEY || '');

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
  console.log(`[Mail] Attempting to invite ${email} to ${contextName}`);

  if (!process.env.RESEND_API_KEY) {
    console.error("[Mail] CRITICAL: RESEND_API_KEY is missing in environment variables!");
    return false;
  }

  // Obfuscate API key for logs
  const apiKey = process.env.RESEND_API_KEY;
  const obfuscatedKey = `${apiKey.slice(0, 7)}...${apiKey.slice(-4)}`;
  const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'no-reply@ahmedlotfy.site';

  console.log(`[Mail] Using API Key: ${obfuscatedKey}`);
  console.log(`[Mail] DEBUG: FROM_EMAIL variable is: "${FROM_EMAIL}"`);
  const finalFrom = `TaskHub <${FROM_EMAIL}>`;
  console.log(`[Mail] DEBUG: Final 'from' header: "${finalFrom}"`);
  console.log(`[Mail] DEBUG: Sending to: "${email}"`);

  try {
    const payload = {
      from: finalFrom,
      to: [email],
      subject: `${inviterName} invited you to join ${contextName} on TaskHub`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #f8fafc;">
          <div style="background-color: white; border-radius: 12px; padding: 32px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #1a1a1a; font-size: 24px; margin-bottom: 16px;">You've been invited! 🎉</h2>
            <p style="color: #4a5568; line-height: 1.6; margin-bottom: 8px;">
              <strong>${inviterName}</strong> has invited you to collaborate on the <strong>${contextName}</strong> ${type}.
            </p>
            <p style="color: #4a5568; line-height: 1.6; margin-bottom: 24px;">
              Click the button below to accept the invitation and get started:
            </p>
            <a href="${inviteLink}" style="display: inline-block; background-color: #0070f3; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 16px;">Accept Invitation</a>
            <p style="margin-top: 32px; color: #718096; font-size: 14px;">This link will expire in 7 days.</p>
          </div>
          <p style="text-align: center; color: #a0aec0; font-size: 12px; margin-top: 16px;">
            TaskHub - Manage tasks with a human touch
          </p>
        </div>
      `,
    };

    console.log("[Mail] DEBUG: Full Payload (excluding HTML):", JSON.stringify({ ...payload, html: '...' }, null, 2));

    const response = await resend.emails.send(payload);

    console.log("[Mail] Resend Response:", JSON.stringify(response, null, 2));

    if (response.error) {
      console.error('[Mail] Error sending invite email:', response.error);
      console.error('[Mail] Error details:', JSON.stringify(response.error, null, 2));
      return false;
    }

    console.log(`[Mail] ✅ Email successfully sent to ${email}. ID: ${response.data?.id}`);
    return true;
  } catch (err) {
    console.error('[Mail] Exception while sending email:', err);
    console.error('[Mail] Error stack:', err instanceof Error ? err.stack : 'No stack trace');
    return false;
  }
}

// Check for API key on startup
if (!process.env.RESEND_API_KEY) {
  console.warn("⚠️ RESEND_API_KEY is not set. Emails will fail to send.");
  console.warn("⚠️ Get your API key from https://resend.com/api-keys");
} else {
  console.log("✅ RESEND_API_KEY is configured");
}