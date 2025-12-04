# Email Notification Setup Guide

## Overview
The Visa Management Portal now sends email notifications to employees for important updates. This guide explains how to set up the email service.

## Current Status
✅ **Frontend Ready** - Email service integrated in the app
⚠️ **Backend Required** - You need to set up a backend API for actual email sending

## Quick Start

### Option 1: Gmail SMTP (Easiest for Testing)

1. **Create Backend Service**
   ```bash
   mkdir email-service
   cd email-service
   npm init -y
   npm install express nodemailer cors dotenv
   ```

2. **Create `.env` file**
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   PORT=3001
   ```

3. **Get Gmail App Password**
   - Go to Google Account → Security
   - Enable 2-Factor Authentication
   - Generate App Password: https://myaccount.google.com/apppasswords
   - Use this password in `.env` (NOT your regular Gmail password)

4. **Copy Backend Code**
   - Use the code from `backend-email-api-example.js`
   - Save as `server.js`

5. **Run Backend**
   ```bash
   node server.js
   ```

6. **Update Frontend**
   - Open `src/utils/emailService.js`
   - Change `apiEndpoint` to `'http://localhost:3001/api/send-email'`
   - Uncomment the fetch code in `sendEmailNotification()`

### Option 2: SendGrid (Recommended for Production)

1. **Sign up for SendGrid**
   - Go to https://sendgrid.com
   - Free tier: 100 emails/day

2. **Get API Key**
   - Dashboard → Settings → API Keys
   - Create API Key with "Mail Send" permission

3. **Install SendGrid**
   ```bash
   npm install @sendgrid/mail
   ```

4. **Use SendGrid Code**
   - See Option 2 in `backend-email-api-example.js`

### Option 3: AWS SES (Best for Scale)

1. **Set up AWS Account**
   - Go to AWS Console → SES
   - Verify your domain or email

2. **Get Credentials**
   - Create IAM user with SES permissions
   - Get Access Key ID and Secret Access Key

3. **Use AWS SES Code**
   - See Option 3 in `backend-email-api-example.js`

## Email Notifications Sent

### Employees Receive Emails For:

1. ✅ **Account Created** - Welcome email with login credentials
2. ✅ **Documents Approved** - Entry permit ready
3. ✅ **Documents Rejected** - Re-upload required
4. ✅ **Medical Scheduled** - Appointment details
5. ✅ **Contract Ready** - Signature required
6. ✅ **Visa Submitted** - Application in progress
7. ✅ **MOHRE Approved** - Contract approved
8. ✅ **Visa Ready** - Upload stamped visa
9. ✅ **Process Complete** - Congratulations!

### HR Does NOT Receive Emails
- HR only gets in-app notifications
- They're always logged in to the portal

## Email Templates

All emails include:
- Professional HTML design
- Company branding
- Clear call-to-action button
- Mobile-responsive layout
- Unsubscribe footer

## Testing

### Test Email Sending (Console)
Currently, emails are logged to console:
```javascript
console.log('📧 Email Notification:', {
  to: 'employee@example.com',
  subject: 'Welcome to Portal',
  message: '...',
  type: 'success'
});
```

### Test with Backend
Once backend is running:
```bash
curl -X POST http://localhost:3001/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test Email",
    "text": "This is a test",
    "html": "<h1>Test Email</h1>"
  }'
```

## Production Deployment

### Recommended Stack:
- **Frontend**: Vercel/Netlify
- **Backend**: Railway/Heroku/AWS Lambda
- **Email Service**: SendGrid/AWS SES

### Environment Variables:
```env
# Backend
EMAIL_USER=noreply@yourdomain.com
EMAIL_PASSWORD=your-password
SENDGRID_API_KEY=your-key
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_REGION=us-east-1

# Frontend
VITE_EMAIL_API_URL=https://your-backend.com/api/send-email
```

### Security Best Practices:
1. ✅ Never commit `.env` files
2. ✅ Use environment variables
3. ✅ Enable rate limiting
4. ✅ Validate email addresses
5. ✅ Use HTTPS only
6. ✅ Implement email queue for reliability
7. ✅ Monitor bounce rates
8. ✅ Handle unsubscribe requests

## Troubleshooting

### Gmail "Less Secure Apps" Error
- Solution: Use App Password, not regular password
- Enable 2FA first

### SendGrid "Sender Not Verified"
- Solution: Verify your sender email/domain in SendGrid

### Emails Going to Spam
- Solution: 
  - Set up SPF, DKIM, DMARC records
  - Use verified domain
  - Avoid spam trigger words

### Rate Limiting
- Gmail: 500 emails/day
- SendGrid Free: 100 emails/day
- AWS SES: 200 emails/day (sandbox)

## Cost Estimates

### Free Tiers:
- **Gmail**: Free (500/day limit)
- **SendGrid**: Free (100/day)
- **AWS SES**: $0 for first 62,000 emails/month

### Paid Plans:
- **SendGrid**: $19.95/month (50,000 emails)
- **AWS SES**: $0.10 per 1,000 emails
- **Mailgun**: $35/month (50,000 emails)

## Support

For issues:
1. Check console logs
2. Verify backend is running
3. Test with curl/Postman
4. Check email service status
5. Review SMTP credentials

## Next Steps

1. ✅ Choose email service (Gmail/SendGrid/AWS SES)
2. ✅ Set up backend API
3. ✅ Configure environment variables
4. ✅ Test email sending
5. ✅ Deploy to production
6. ✅ Monitor email delivery

---

**Note**: Email notifications are currently simulated in development. Set up a backend service to enable actual email sending.
