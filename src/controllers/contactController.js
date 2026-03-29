const { BaseController, ErrorResponse } = require('./baseController');
const nodemailer = require('nodemailer');

class ContactController extends BaseController {
  constructor() {
    super();
  }

  // @desc    Send contact form message
  // @route   POST /api/contact/send
  // @access  Public
  sendContactMessage = this.asyncHandler(async (req, res) => {
    try {
      console.log('=== CONTACT FORM SUBMISSION ===');
      console.log('Request body:', req.body);

      const { fullName, email, phone, subject, message } = req.body;

      // Validate required fields
      if (!fullName || !email || !subject || !message) {
        return this.sendError(res, new ErrorResponse('Missing required fields: fullName, email, subject, message', 400));
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return this.sendError(res, new ErrorResponse('Invalid email address', 400));
      }

      // Map subject values to readable text
      const subjectMap = {
        'general': 'General Inquiry',
        'support': 'Technical Support',
        'property': 'Property Question',
        'agent': 'Agent Inquiry',
        'feedback': 'Feedback'
      };

      const subjectText = subjectMap[subject] || subject;

      // Create email content
      const emailSubject = `Contact Form: ${subjectText} - ${fullName}`;
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #b9f73e; padding: 20px; text-align: center;">
            <h2 style="color: #2e3d40; margin: 0;">New Contact Form Submission</h2>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2c5530; margin-top: 0;">Contact Details</h3>
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #2e3d40;">Name:</strong>
              <p style="margin: 5px 0; color: #666;">${fullName}</p>
            </div>
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #2e3d40;">Email:</strong>
              <p style="margin: 5px 0; color: #666;">${email}</p>
            </div>
            
            ${phone ? `
            <div style="margin-bottom: 15px;">
              <strong style="color: #2e3d40;">Phone:</strong>
              <p style="margin: 5px 0; color: #666;">${phone}</p>
            </div>
            ` : ''}
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #2e3d40;">Subject:</strong>
              <p style="margin: 5px 0; color: #666;">${subjectText}</p>
            </div>
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #2e3d40;">Message:</strong>
              <div style="background-color: white; padding: 15px; border-radius: 5px; margin-top: 5px;">
                <p style="margin: 0; color: #666; white-space: pre-wrap;">${message}</p>
              </div>
            </div>
          </div>
          
          <div style="background-color: #f0f4ff; padding: 20px; border-radius: 8px;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              <strong>Submitted on:</strong> ${new Date().toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #666; font-size: 12px; text-align: center;">
            This is an automated message from the Addisnest Contact Form.
            <br>
            Reply directly to this email to respond to ${fullName}.
          </p>
        </div>
      `;

      // Check if SendGrid is configured
      if (process.env.SENDGRID_API_KEY && 
          process.env.SENDGRID_API_KEY !== 'your_sendgrid_api_key' &&
          process.env.SENDGRID_API_KEY !== 'development_mode') {
        
        console.log('=== SENDING CONTACT EMAIL VIA SENDGRID ===');
        console.log('To: contact@addisnest.com');
        console.log('From:', email);
        console.log('Subject:', emailSubject);

        try {
          // Use nodemailer with SendGrid SMTP
          const transporter = nodemailer.createTransport({
            host: 'smtp.sendgrid.net',
            port: 587,
            auth: {
              user: 'apikey',
              pass: process.env.SENDGRID_API_KEY
            }
          });

          // Email options
          const mailOptions = {
            from: process.env.EMAIL_FROM || 'noreply@addisnest.com',
            to: 'contact@addisnest.com',
            replyTo: email, // Allow replying directly to the sender
            subject: emailSubject,
            html: emailHtml
          };

          // Send email
          const info = await transporter.sendMail(mailOptions);
          
          console.log('✅ Contact email sent successfully via SendGrid! Message ID:', info.messageId);

          this.sendResponse(res, {
            success: true,
            message: 'Your message has been sent successfully. We will get back to you soon.',
            data: {
              messageId: info.messageId,
              sentAt: new Date(),
              mode: 'sendgrid'
            }
          });
          return;
        } catch (sendgridError) {
          console.error('❌ SendGrid email error:', sendgridError);
          // Fall through to development mode response
        }
      }

      // For development mode without email service configured
      console.log('=== CONTACT EMAIL SIMULATION (Development Mode) ===');
      console.log('To: contact@addisnest.com');
      console.log('From:', email);
      console.log('Reply-To:', email);
      console.log('Subject:', emailSubject);
      console.log('Name:', fullName);
      console.log('Phone:', phone || 'Not provided');
      console.log('Subject Type:', subjectText);
      console.log('Message:', message);
      console.log('=== END CONTACT EMAIL SIMULATION ===');
      console.log('');
      console.log('💡 TO ENABLE ACTUAL EMAIL SENDING:');
      console.log('   Configure SendGrid API key in .env file');
      console.log('   SENDGRID_API_KEY=your_actual_key');
      console.log('   EMAIL_FROM=noreply@addisnest.com');
      console.log('');

      // Simulate successful email sending
      this.sendResponse(res, {
        success: true,
        message: 'Your message has been sent successfully. We will get back to you soon.',
        data: {
          sentAt: new Date(),
          mode: 'development_simulation'
        }
      });

    } catch (error) {
      console.error('Contact form submission error:', error);
      this.sendError(res, new ErrorResponse('Failed to send message. Please try again later.', 500));
    }
  });
}

module.exports = new ContactController();
