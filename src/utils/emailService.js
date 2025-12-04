/**
 * Email Service for sending notifications to employees
 * 
 * This is a frontend implementation that would typically call a backend API.
 * For production, you need to set up a backend service with SMTP credentials.
 * 
 * Recommended backend solutions:
 * 1. Node.js with Nodemailer
 * 2. SendGrid API
 * 3. AWS SES
 * 4. Mailgun
 */

// Email configuration (should be in backend environment variables)
const EMAIL_CONFIG = {
  // Backend API endpoint for sending emails
  apiEndpoint: '/api/send-email', // Replace with your actual backend endpoint
  
  // Email templates
  from: 'noreply@visaportal.com',
  companyName: 'Visa Management Portal',
};

/**
 * Send email notification to employee
 * @param {string} to - Employee email address
 * @param {string} subject - Email subject
 * @param {string} message - Email message/body
 * @param {string} type - Notification type (info, success, warning)
 */
export const sendEmailNotification = async (to, subject, message, type = 'info') => {
  try {
    // For now, we'll simulate the email sending
    // In production, this would call your backend API
    
    console.log('📧 Email Notification:', {
      to,
      subject,
      message,
      type,
      timestamp: new Date().toISOString()
    });

    // Simulate API call (replace with actual fetch to your backend)
    /*
    const response = await fetch(EMAIL_CONFIG.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        from: EMAIL_CONFIG.from,
        subject,
        html: generateEmailHTML(subject, message, type),
        text: message,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    return { success: true };
    */

    // For development, just log and return success
    return { success: true, simulated: true };
    
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Generate HTML email template
 */
const generateEmailHTML = (subject, message, type) => {
  const colors = {
    info: '#3B82F6',
    success: '#16A34A',
    warning: '#F59E0B',
  };

  const color = colors[type] || colors.info;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <tr>
                <td style="background-color: ${color}; padding: 30px 40px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">
                    ${EMAIL_CONFIG.companyName}
                  </h1>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  <h2 style="margin: 0 0 20px 0; color: #262626; font-size: 20px;">
                    ${subject}
                  </h2>
                  <p style="margin: 0 0 20px 0; color: #525252; font-size: 16px; line-height: 1.6;">
                    ${message}
                  </p>
                  <div style="margin: 30px 0; padding: 20px; background-color: #f5f5f5; border-radius: 6px; border-left: 4px solid ${color};">
                    <p style="margin: 0; color: #525252; font-size: 14px;">
                      <strong>Next Steps:</strong><br>
                      Please log in to the Visa Management Portal to view details and take necessary actions.
                    </p>
                  </div>
                  <div style="text-align: center; margin-top: 30px;">
                    <a href="http://localhost:5173" style="display: inline-block; padding: 12px 30px; background-color: ${color}; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                      Go to Portal
                    </a>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f5f5f5; padding: 20px 40px; text-align: center; border-top: 1px solid #e5e5e5;">
                  <p style="margin: 0 0 10px 0; color: #737373; font-size: 12px;">
                    This is an automated notification from ${EMAIL_CONFIG.companyName}
                  </p>
                  <p style="margin: 0; color: #a3a3a3; font-size: 12px;">
                    Please do not reply to this email.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

/**
 * Email notification templates for different events
 */
export const EmailTemplates = {
  ACCOUNT_CREATED: (employeeName, email, password) => ({
    subject: 'Welcome to Visa Management Portal - Account Created',
    message: `Dear ${employeeName},\n\nYour account has been created successfully!\n\nLogin Credentials:\nEmail: ${email}\nPassword: ${password}\n\nPlease log in to the portal and upload your documents to begin the visa process.`,
    type: 'success'
  }),

  DOCUMENTS_APPROVED: (employeeName) => ({
    subject: 'Documents Approved - Entry Permit Ready',
    message: `Dear ${employeeName},\n\nGreat news! Your documents have been reviewed and approved by HR.\n\nYou can now download your entry permit from the portal. Please keep it safe for your travel to UAE.`,
    type: 'success'
  }),

  DOCUMENTS_REJECTED: (employeeName, reason) => ({
    subject: 'Action Required - Document Re-upload Needed',
    message: `Dear ${employeeName},\n\nSome of your documents need to be re-uploaded.\n\nReason: ${reason || 'Please check the portal for details'}\n\nPlease log in and upload the required documents again.`,
    type: 'warning'
  }),

  MEDICAL_SCHEDULED: (employeeName, center, date, time) => ({
    subject: 'Medical Appointment Scheduled',
    message: `Dear ${employeeName},\n\nYour medical appointment has been scheduled:\n\nCenter: ${center}\nDate: ${date}\nTime: ${time}\n\nPlease arrive 15 minutes early and bring your passport and entry permit.`,
    type: 'info'
  }),

  CONTRACT_READY: (employeeName) => ({
    subject: 'Employment Contract Ready for Signature',
    message: `Dear ${employeeName},\n\nYour employment contract is ready for review and signature.\n\nPlease log in to the portal to review the contract terms and provide your digital signature.`,
    type: 'info'
  }),

  VISA_SUBMITTED: (employeeName) => ({
    subject: 'Residence Visa Application Submitted',
    message: `Dear ${employeeName},\n\nYour residence visa and Emirates ID application has been submitted to the authorities.\n\nProcessing typically takes 3-5 business days. We'll notify you once it's ready.`,
    type: 'info'
  }),

  MOHRE_APPROVED: (employeeName) => ({
    subject: 'MOHRE Approval Received',
    message: `Dear ${employeeName},\n\nYour employment contract has been approved by MOHRE (Ministry of Human Resources and Emiratisation).\n\nThe visa application process will now proceed to the next stage.`,
    type: 'success'
  }),

  VISA_READY: (employeeName) => ({
    subject: 'Visa Ready - Action Required',
    message: `Dear ${employeeName},\n\nExcellent news! Your residence visa and Emirates ID are ready.\n\nPlease upload the stamped visa page from your passport to complete the process.`,
    type: 'success'
  }),

  PROCESS_COMPLETE: (employeeName) => ({
    subject: 'Congratulations - Visa Process Complete!',
    message: `Dear ${employeeName},\n\nCongratulations! Your visa process has been completed successfully.\n\nWelcome to the team! If you have any questions, please don't hesitate to contact HR.`,
    type: 'success'
  }),
};

/**
 * Send notification with email
 * This combines in-app notification with email notification
 */
export const sendNotificationWithEmail = async (employeeEmail, employeeName, template) => {
  const { subject, message, type } = template;
  
  // Send email
  const result = await sendEmailNotification(employeeEmail, subject, message, type);
  
  if (result.success) {
    console.log(`✅ Email sent to ${employeeEmail}`);
  } else {
    console.error(`❌ Failed to send email to ${employeeEmail}:`, result.error);
  }
  
  return result;
};
