const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

async function testEmailSending() {
  try {
    console.log('=== TESTING GMAIL SMTP EMAIL SENDING ===');
    console.log('Gmail User:', process.env.GMAIL_USER);
    console.log('Gmail App Password configured:', process.env.GMAIL_APP_PASSWORD ? 'Yes' : 'No');
    
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.log('❌ Gmail credentials not configured');
      return;
    }
    
    // Create Gmail SMTP transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    // Test email content
    const mailOptions = {
      from: `"Addisnest Test" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER, // Send test email to yourself
      subject: 'Test Email - Addisnest Schedule Notification System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c5530;">🎉 Email System Test Successful!</h2>
          <p>Hello,</p>
          
          <p>This is a test email to confirm that the Addisnest email notification system is working correctly.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2c5530; margin-top: 0;">Test Details</h3>
            <p><strong>System:</strong> Addisnest Property Tour Notification</p>
            <p><strong>Email Service:</strong> Gmail SMTP</p>
            <p><strong>Test Time:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Status:</strong> ✅ Email delivery working!</p>
          </div>
          
          <p>When users click "Schedule Now" on property listings, property owners will now receive actual email notifications like this one.</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #666; font-size: 14px;">
            This is a test message from the Addisnest development system.
            <br>
            Email system configured and working properly! 🚀
          </p>
        </div>
      `
    };

    // Send test email
    console.log('Sending test email...');
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Email sent to:', process.env.GMAIL_USER);
    console.log('');
    console.log('🎉 EMAIL SYSTEM IS NOW WORKING!');
    console.log('Property owners will receive actual emails when users schedule tours.');
    
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    console.log('');
    console.log('💡 Troubleshooting tips:');
    console.log('1. Make sure 2-factor authentication is enabled on your Gmail account');
    console.log('2. Generate a new App Password from Google Account settings');
    console.log('3. Use the 16-character app password (with spaces: ajxk rwxd qbca bpaq)');
    console.log('4. Check that "Less secure app access" is not blocking the connection');
  }
}

// Run the test
testEmailSending();
