/**
 * BACKEND EMAIL API EXAMPLE
 * 
 * This file shows how to set up a backend API for sending emails via SMTP.
 * You need to create a separate backend service (Node.js/Express) to handle email sending.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a new Node.js project: npm init -y
 * 2. Install dependencies: npm install express nodemailer cors dotenv
 * 3. Create .env file with your SMTP credentials
 * 4. Run this server: node backend-email-api-example.js
 * 5. Update src/utils/emailService.js with your backend URL
 */

// ============================================
// OPTION 1: Using Gmail SMTP
// ============================================

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Create SMTP transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // or 'outlook', 'yahoo', etc.
  auth: {
    user: process.env.EMAIL_USER, // your-email@gmail.com
    pass: process.env.EMAIL_PASSWORD, // your app password (not regular password!)
  },
});

// Email sending endpoint
app.post('/api/send-email', async (req, res) => {
  try {
    const { to, subject, html, text } = req.body;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent:', info.messageId);
    res.json({ success: true, messageId: info.messageId });
    
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Email API server running on port ${PORT}`);
});

// ============================================
// .env FILE EXAMPLE
// ============================================
/*
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
PORT=3001

# For Gmail:
# 1. Enable 2-factor authentication
# 2. Generate App Password: https://myaccount.google.com/apppasswords
# 3. Use the generated password (not your regular Gmail password)
*/

// ============================================
// OPTION 2: Using SendGrid (Recommended for Production)
// ============================================
/*
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.post('/api/send-email', async (req, res) => {
  try {
    const { to, subject, html, text } = req.body;

    const msg = {
      to,
      from: 'noreply@yourdomain.com', // Must be verified in SendGrid
      subject,
      text,
      html,
    };

    await sgMail.send(msg);
    res.json({ success: true });
    
  } catch (error) {
    console.error('SendGrid error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});
*/

// ============================================
// OPTION 3: Using AWS SES
// ============================================
/*
const AWS = require('aws-sdk');
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

app.post('/api/send-email', async (req, res) => {
  try {
    const { to, subject, html, text } = req.body;

    const params = {
      Source: 'noreply@yourdomain.com',
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Subject: {
          Data: subject,
        },
        Body: {
          Html: {
            Data: html,
          },
          Text: {
            Data: text,
          },
        },
      },
    };

    const result = await ses.sendEmail(params).promise();
    res.json({ success: true, messageId: result.MessageId });
    
  } catch (error) {
    console.error('AWS SES error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});
*/

// ============================================
// TESTING THE API
// ============================================
/*
// Test with curl:
curl -X POST http://localhost:3001/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "employee@example.com",
    "subject": "Test Email",
    "text": "This is a test email",
    "html": "<h1>This is a test email</h1>"
  }'

// Or test with Postman/Insomnia
*/

// ============================================
// DEPLOYMENT OPTIONS
// ============================================
/*
1. Heroku: Easy deployment, free tier available
2. AWS Lambda: Serverless, pay per use
3. Vercel/Netlify: Serverless functions
4. DigitalOcean: VPS hosting
5. Railway: Modern deployment platform

For production, consider:
- Rate limiting to prevent abuse
- Email queue (Bull/Redis) for reliability
- Email templates stored in database
- Logging and monitoring
- Bounce/complaint handling
*/
