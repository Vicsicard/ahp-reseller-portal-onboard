const sgMail = require('@sendgrid/mail');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Create Bluehost SMTP transporter as backup
const smtpTransport = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'box5752.bluehost.com',
  port: process.env.SMTP_PORT || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

/**
 * Send email using SendGrid with Bluehost SMTP as fallback
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.template - Template name (without extension)
 * @param {Object} options.data - Data for template
 * @returns {Promise<Object>} - SendGrid response
 */
const sendEmail = async (options) => {
  try {
    const { to, subject, template, data } = options;
    
    // Get email template
    const templatePath = path.join(__dirname, '../templates/emails', `${template}.html`);
    const templateSource = fs.readFileSync(templatePath, 'utf-8');
    
    // Compile template with Handlebars
    const compiledTemplate = handlebars.compile(templateSource);
    const html = compiledTemplate(data);
    
    const msg = {
      to,
      from: process.env.FROM_EMAIL || 'noreply@aihandshake.org',
      subject,
      html
    };
    
    try {
      // Try SendGrid first
      return await sgMail.send(msg);
    } catch (sendgridError) {
      console.error('SendGrid error, falling back to SMTP:', sendgridError);
      
      // Fall back to SMTP if SendGrid fails
      return await smtpTransport.sendMail({
        from: process.env.FROM_EMAIL || 'noreply@aihandshake.org',
        to,
        subject,
        html
      });
    }
  } catch (error) {
    console.error('Email service error:', error);
    throw error;
  }
};

module.exports = sendEmail;
