# Email Setup Guide

This project uses [Resend](https://resend.com) for sending invitation emails.

## Quick Setup

### 1. Get a Resend API Key

1. Go to [https://resend.com/api-keys](https://resend.com/api-keys)
2. Create a new API key
3. Copy the API key (starts with `re_`)

### 2. Configure Environment Variables

Add the following to your `api/.env` file:

```env
# Email Configuration
RESEND_API_KEY=re_your-api-key-here
RESEND_FROM_EMAIL=onboarding@resend.dev
FRONTEND_URL=https://your-frontend-domain.com
```

### 3. Test Email Configuration

Start your API server and test the email configuration:

```bash
# Test endpoint
curl http://localhost:8000/api/invitations/test-email
```

Or set a test email in your `.env`:

```env
TEST_EMAIL=your-email@example.com
```

## Production Setup

### 1. Verify Your Domain

For production, you should use your own domain instead of `onboarding@resend.dev`:

1. Go to [https://resend.com/domains](https://resend.com/domains)
2. Add your domain (e.g., `ahmedlotfy.site`)
3. Add the DNS records provided by Resend to your domain's DNS settings
4. Wait for DNS propagation (usually a few minutes)
5. Once verified, update your `.env`:

```env
RESEND_FROM_EMAIL=no-reply@ahmedlotfy.site
```

### 2. Update Frontend URL

Make sure `FRONTEND_URL` points to your production frontend:

```env
FRONTEND_URL=https://task-hub.ahmedlotfy.site
```

## Troubleshooting

### Email Not Sending

1. **Check API Key**: Ensure `RESEND_API_KEY` is set and valid
2. **Check Logs**: Look for `[Mail]` prefixed logs in your server output
3. **Verify Domain**: From email must be verified in Resend dashboard
4. **Check Quota**: Free Resend account has 3,000 emails/month limit

### Common Errors

- **"Missing API key"**: Add `RESEND_API_KEY` to `.env`
- **"Invalid from address"**: Verify the sender domain in Resend dashboard
- **"Rate limit exceeded"**: Upgrade your Resend plan or wait for quota reset

## Email Template

The invitation email includes:
- Inviter's name
- Workspace/Board name
- Accept invitation button
- 7-day expiration notice

You can customize the email template in `api/src/lib/mail.ts`.

## Security Notes

- The `.env` file is in `.gitignore` and should never be committed
- API keys are sensitive - keep them secret
- Use environment variables for all configuration
- Consider using a secrets manager in production (e.g., AWS Secrets Manager, Vercel Environment Variables)
