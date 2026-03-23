# Contact Form Setup with Resend

This project includes a contact form that uses the Resend API to send emails.

## Setup Instructions

### 1. Get Your Resend API Key

1. Go to [Resend](https://resend.com) and create an account
2. Navigate to [API Keys](https://resend.com/api-keys)
3. Create a new API key
4. Copy the API key (it starts with `re_`)

### 2. Configure the API Key

Open the `.env` file in the root of the project and replace `re_xxxxxxxxx` with your real API key:

```env
RESEND_API_KEY="re_your_actual_api_key_here"
```

### 3. Configure Email Settings

By default, emails are sent to `louis.antoine5@icloud.com`. To change this:

1. Open `app/api/contact/route.ts`
2. Update the `to` field in the `resend.emails.send()` call:

```typescript
const { data, error } = await resend.emails.send({
  from: 'onboarding@resend.dev',
  to: 'your-email@example.com', // Change this
  subject: `Contact Portfolio: ${validatedData.subject}`,
  // ...
});
```

### 4. Verify Domain (Optional but Recommended)

For production use, you should verify your own domain with Resend:

1. Go to [Resend Domains](https://resend.com/domains)
2. Add and verify your domain
3. Update the `from` field in `app/api/contact/route.ts`:

```typescript
from: 'contact@yourdomain.com', // Use your verified domain
```

### 5. Test the Form

1. Start the development server: `npm run dev`
2. Navigate to the contact section on your homepage
3. Fill out and submit the form
4. Check your email inbox for the test message

## Features

- ✅ Form validation with Zod
- ✅ Loading states during submission
- ✅ Success/error messages
- ✅ Styled to match your portfolio theme
- ✅ Fully responsive design
- ✅ Accessible form fields

## API Route

The contact form submits to `/api/contact` which:
- Validates form data with Zod
- Sends email via Resend API
- Returns appropriate success/error responses

## Troubleshooting

### "Service de messagerie non configuré" error
- Make sure `RESEND_API_KEY` is set in your `.env` file
- Restart your development server after adding the environment variable

### Email not received
- Check that the recipient email is correct
- Verify your Resend API key is valid
- Check the Resend dashboard for delivery logs
- Ensure you haven't exceeded your free tier limits

### Form validation errors
- All fields are required
- Email must be valid
- Name must be at least 2 characters
- Subject must be at least 5 characters
- Message must be at least 10 characters

## Free Tier Limits

Resend offers:
- 100 emails per day on the free tier
- 3,000 emails per month on the free tier

For higher volumes, check [Resend Pricing](https://resend.com/pricing).
