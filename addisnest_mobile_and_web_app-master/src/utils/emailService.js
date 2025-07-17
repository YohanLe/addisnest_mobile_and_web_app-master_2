const sgMail = require('@sendgrid/mail');

// Initialize SendGrid with API key from environment variables
const apiKey = process.env.SENDGRID_API_KEY;
const isPlaceholder = apiKey && (apiKey.includes('your_sendgrid_api_key_here') || apiKey.includes('placeholder') || apiKey.includes('development_placeholder'));
const isValidApiKey = apiKey && !isPlaceholder && apiKey.startsWith('SG.');

console.log('SendGrid API Key available:', !!apiKey);
console.log('SendGrid API Key value:', apiKey ? apiKey.substring(0, 15) + '...' : 'undefined');
console.log('SendGrid API Key is placeholder:', isPlaceholder);
console.log('SendGrid API Key appears valid:', isValidApiKey);

if (isValidApiKey) {
  console.log('Setting SendGrid API Key:', apiKey.substring(0, 10) + '...');
  sgMail.setApiKey(apiKey);
} else {
  console.warn('No valid SendGrid API Key found. Email sending will be simulated in development mode.');
}

/**
 * Send an email using SendGrid
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text content
 * @param {string} options.html - HTML content
 * @returns {Promise} - SendGrid API response
 */
const sendEmail = async (options) => {
  try {
    console.log('Attempting to send email to:', options.to);
    
    // Use the verified sender email for AddisNest
    const fromEmail = process.env.EMAIL_FROM || 'contact@addisnest.com';
    const msg = {
      to: options.to,
      from: {
        email: fromEmail,
        name: 'AddisNest'
      },
      replyTo: 'contact@addisnest.com',
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    // Check if we have a valid API key before attempting to send
    if (isValidApiKey) {
      try {
        console.log('Sending email with SendGrid to:', options.to);
        const response = await sgMail.send(msg);
        console.log('Email sent successfully with SendGrid to:', options.to);
        console.log('SendGrid response:', response);
        return { success: true };
      } catch (sendgridError) {
        console.error('Error sending email with SendGrid:', sendgridError);
        if (sendgridError.response) {
          console.error('SendGrid error response:', sendgridError.response.body);
        }
        
        // Return a partial success for development environments
        if (process.env.NODE_ENV === 'development') {
          console.warn('Email sending failed but continuing in development mode');
          return { 
            success: true, 
            devMode: true,
            error: sendgridError.message,
            message: 'Email sending failed but continuing in development mode'
          };
        }
        throw sendgridError;
      }
    } else {
      // Simulate successful email sending in development mode
      console.log('Simulating email sending in development mode');
      console.log('Email content that would be sent:');
      console.log('To:', options.to);
      console.log('Subject:', options.subject);
      console.log('Text:', options.text.substring(0, 100) + '...');
      
      if (process.env.NODE_ENV === 'development') {
        return { 
          success: true, 
          devMode: true,
          simulated: true,
          message: 'Email sending simulated in development mode'
        };
      } else {
        throw new Error('Cannot send email: No valid SendGrid API key provided');
      }
    }
  } catch (error) {
    console.error('Email sending failed:', error);
    if (error.response) {
      console.error('Error details:', error.response.body);
    }
    
    // Return a partial success for development environments
    if (process.env.NODE_ENV === 'development') {
      console.warn('Email sending failed but continuing in development mode');
      return { 
        success: true, 
        devMode: true,
        error: error.message,
        message: 'Email sending failed but continuing in development mode'
      };
    }
    
    throw error;
  }
};

/**
 * Send OTP email
 * @param {string} email - Recipient email
 * @param {string} otp - One-time password
 * @param {string} firstName - User's first name
 * @returns {Promise} - SendGrid API response
 */
const sendOTPEmail = async (email, otp, firstName) => {
  const subject = 'Your AddisNest OTP Code';
  const text = `Hello ${firstName || 'there'},\n\nYour OTP code for AddisNest is: ${otp}\n\nThis code will expire in 5 minutes.\n\nIf you did not request this code, please ignore this email.\n\nRegards,\nThe AddisNest Team`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #a4ff2a; padding: 20px; text-align: center;">
        <h1 style="color: #333; margin: 0;">AddisNest</h1>
      </div>
      <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
        <p>Hello ${firstName || 'there'},</p>
        <p>Your one-time password (OTP) code for AddisNest is:</p>
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; margin: 20px 0;">
          <strong>${otp}</strong>
        </div>
        <p>This code will expire in 5 minutes.</p>
        <p>If you did not request this code, please ignore this email.</p>
        <p>Regards,<br>The AddisNest Team</p>
      </div>
      <div style="background-color: #f5f5f5; padding: 10px; text-align: center; font-size: 12px; color: #666;">
        <p>© ${new Date().getFullYear()} AddisNest. All rights reserved.</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject,
    text,
    html
  });
};

module.exports = {
  sendEmail,
  sendOTPEmail
};
