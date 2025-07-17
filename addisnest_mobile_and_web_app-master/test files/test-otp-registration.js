const axios = require('axios');

async function testOtpRegistration() {
  try {
    console.log('Testing OTP registration flow...');
    
    // Generate a unique email for this test
    const testEmail = `otp-test-${Date.now()}@example.com`;
    console.log(`Using test email: ${testEmail}`);
    
    // Step 1: Request OTP
    console.log('\nStep 1: Requesting OTP...');
    const otpResponse = await axios.post('http://localhost:7000/api/auth/request-otp', {
      email: testEmail
    });
    
    console.log('OTP request response status:', otpResponse.status);
    
    // Extract OTP from response (in development mode)
    let otp = null;
    if (otpResponse.data && otpResponse.data.otp) {
      otp = otpResponse.data.otp;
      console.log(`Received OTP: ${otp}`);
    } else {
      throw new Error('No OTP received in response. Make sure NODE_ENV is set to development');
    }
    
    // Step 2: Verify OTP with registration data
    console.log('\nStep 2: Verifying OTP with registration data...');
    const verifyData = {
      email: testEmail,
      otp: otp,
      firstName: 'OTP',
      lastName: 'Test',
      password: 'Password123',
      role: 'customer',
      pagetype: 'register'
    };
    
    const verifyResponse = await axios.post('http://localhost:7000/api/auth/verify-otp', verifyData);
    
    console.log('OTP verification response status:', verifyResponse.status);
    console.log('OTP verification response data:', verifyResponse.data);
    
    // Step 3: Check if user exists in database
    console.log('\nStep 3: Checking if user exists in database...');
    
    // Wait a moment for database operations to complete
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Extract token from verify response
    const token = verifyResponse.data.token;
    
    // Check user by email with authentication
    const checkResponse = await axios.get(
      `http://localhost:7000/api/auth/profile`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    console.log('User check response status:', checkResponse.status);
    console.log('User check response data:', checkResponse.data);
    
    if (checkResponse.data && checkResponse.data.result) {
      const userData = checkResponse.data.result;
      console.log('\n✅ SUCCESS: User found in database!');
      console.log(`User ID: ${userData._id}`);
      console.log(`User email: ${userData.email}`);
      console.log(`User name: ${userData.firstName} ${userData.lastName}`);
      console.log(`User role: ${userData.role}`);
      console.log(`User verified: ${userData.isVerified}`);
      
      // Compare with the user data from the OTP verification response
      console.log('\nComparing with OTP verification response:');
      const otpUser = verifyResponse.data.user;
      console.log(`OTP User ID: ${otpUser._id}`);
      console.log(`OTP User email: ${otpUser.email}`);
      
      if (userData._id === otpUser._id) {
        console.log('\n✅ MATCH CONFIRMED: The user in the database is the same as the one registered during OTP verification!');
      } else {
        console.log('\n❌ MISMATCH: The user IDs do not match!');
      }
    } else {
      console.log('\n❌ ERROR: User not found in database!');
    }
    
  } catch (error) {
    console.error('\n❌ Error during test:');
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

testOtpRegistration();
