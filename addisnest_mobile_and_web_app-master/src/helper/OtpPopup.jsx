import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Api from "../Apis/Api";
import { toast } from "react-toastify";
import { AuthUserDetails, login } from "../Redux-store/Slices/AuthSlice";
import { useDispatch } from "react-redux";

const OtpPopup = ({ handlePopup, sendData }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [otpError, setOtpError] = useState('');
    
    const handleOtpChange = (index, value) => {
        // Clear error message when user starts typing
        if (otpError) {
            setOtpError('');
        }
        
        if (value.match(/^[0-9]$/) || value === '') {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            
            // Auto-focus next input if value is entered
            if (value !== '' && index < 5) {
                const nextInput = document.getElementById(`otp-input-${index + 1}`);
                if (nextInput) nextInput.focus();
            }
        }
    };
    
    const handleKeyDown = (index, e) => {
        // Navigate to previous input on backspace
        if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
            const prevInput = document.getElementById(`otp-input-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };
    
    const otpVerifyFun = async () => {
        const otpString = otp.join('');
        
        if (otpString.length !== 6) {
            setOtpError('Please enter a valid 6-digit OTP');
            toast.error('Please enter a valid 6-digit OTP');
            return;
        }
        
        try {
            setLoading(true);
            
            // First check if the user already exists (for registration flow)
            if (sendData?.pagetype === 'register') {
                try {
                    console.log('Checking if user already exists with email:', sendData?.email);
                    const checkResponse = await Api.get(`auth/check-user?email=${sendData?.email}`);
                    
                    if (checkResponse && checkResponse.data && checkResponse.data.exists) {
                        // User already exists, show message and redirect to login
                        setLoading(false);
                        toast.info('You already have an account with this email. Redirecting to login...');
                        
                        // Close the OTP popup
                        handlePopup();
                        
                        // Redirect to login page after a short delay
                        setTimeout(() => {
                            window.location.href = '/login';
                        }, 2000);
                        
                        return;
                    }
                } catch (checkError) {
                    console.error('Error checking if user exists:', checkError);
                    // Continue with OTP verification even if the check fails
                }
            }
            
            let body = {
                email: sendData?.email,
                otp: otpString
            };
            
            console.log('Verifying OTP with data:', sendData); // Debug
            
            if (sendData?.pagetype === 'register') {
                // Normalize role (handle case sensitivity)
                let normalizedRole = 'customer'; // Default role
                if (sendData?.role) {
                    const roleToLower = sendData.role.toLowerCase();
                    if (roleToLower === 'agent' || roleToLower === 'admin') {
                        normalizedRole = roleToLower;
                    } else {
                        normalizedRole = 'customer';
                    }
                }
                
                // Add all registration fields
                body = {
                    ...body,
                    firstName: sendData?.firstName,
                    lastName: sendData?.lastName,
                    password: sendData?.password,
                    phone: sendData?.phone,
                    role: normalizedRole, // Use normalized role
                    regionalState: sendData?.regionalState,
                    // Ensure user is marked as verified
                    isVerified: true,
                    // Add agent-specific fields if registering as an agent
                    ...(normalizedRole === 'agent' && {
                        experience: parseInt(sendData?.experience || '0'),
                        // Use specialties instead of specialization to match the model
                        specialties: sendData?.specialization || [],
                        // Set region to match the model
                        region: sendData?.regionalState
                    })
                };
                
                // Log the registration data being sent
                console.log('Sending registration data:', JSON.stringify(body, null, 2));
            } else if (sendData?.pagetype === 'socialLogin') {
                body = {
                    ...body,
                    provider: sendData?.provider
                };
            }
            
            console.log('Sending data to verify OTP:', body); // Debug
            
            // Use different endpoint for social login verification
            const endpoint = sendData?.pagetype === 'socialLogin' 
                ? "auth/verify-social-login" 
                : "auth/verify-otp";
                
            console.log('Using endpoint:', endpoint); // Debug
            
            console.log('Sending OTP verification request to:', endpoint);
            const response = await Api.post(endpoint, body);
            console.log('OTP verification response:', response); // Debug
            
            if (response && response.data) {
                const { data, message } = response;
                
                localStorage.setItem('addisnest_token', data?.token);
                localStorage.setItem('isLogin', '1');
                localStorage.setItem("userId", data?.user?._id || data?.userId);
                
                // Store user data in localStorage for AuthSlice to use as fallback
                if (data?.user) {
                    try {
                        localStorage.setItem('userData', JSON.stringify(data.user));
                        console.log('Stored user data in localStorage:', data.user);
                        
                        // Directly update Redux store with user data
                        dispatch(login(data.user));
                        
                        // If this is a new user (from registration), ensure they are registered in the database
                        if (sendData?.pagetype === 'register' && !data.user._id) {
                            try {
                                // Create a minimal user registration payload
                                const registrationData = {
                                    email: data.user.email || sendData.email,
                                    firstName: data.user.firstName || sendData.firstName,
                                    lastName: data.user.lastName || sendData.lastName,
                                    password: sendData.password || 'DefaultPassword123',
                                    role: data.user.role || sendData.role || 'customer',
                                    isVerified: true
                                };
                                
                                // Register the user in the database
                                console.log('Registering user in database:', registrationData);
                                const registerResponse = await Api.post('users/register', registrationData);
                                console.log('User registration response:', registerResponse);
                                
                                if (registerResponse.data) {
                                    // Update localStorage with the newly registered user data
                                    localStorage.setItem('userData', JSON.stringify(registerResponse.data));
                                    localStorage.setItem('userId', registerResponse.data._id);
                                    
                                    // Update Redux store
                                    dispatch(login(registerResponse.data));
                                }
                            } catch (registerError) {
                                console.error('Error registering user in database:', registerError);
                                // Continue with the flow even if registration fails
                            }
                        }
                    } catch (storageError) {
                        console.error('Error storing user data in localStorage:', storageError);
                    }
                }
                
                handlePopup();
                dispatch(AuthUserDetails());
                
                // Always redirect to home page after successful authentication
                toast.success(sendData?.pagetype === 'register' 
                    ? "Registration successful!" 
                    : sendData?.pagetype === 'forgot'
                    ? "OTP verified successfully."
                    : sendData?.pagetype === 'socialLogin'
                    ? `${sendData?.provider} login successful!`
                    : "Login successful!");
                
                // Use window.location.href for a full page reload to ensure proper state reset
                // Add a small delay to ensure the toast message is visible
                setTimeout(() => {
                    console.log('Redirecting to home page...');
                    window.location.href = '/';
                }, 1000);
            } else {
                setOtpError('Unexpected response from server. Please try again.');
                toast.error('Unexpected response format from server');
                console.error('Unexpected response format:', response);
            }
            
        } catch (error) {
            console.error('OTP verification error:', error);
            
            // More detailed error handling
            if (error.response) {
                // Server responded with an error status
                const { status, data } = error.response;
                
                if (status === 500) {
                    // Check if the error is related to OTP validation
                    if (data && data.error && data.error.includes('Invalid OTP')) {
                        setOtpError('The OTP code you entered is incorrect. Please try again.');
                        toast.error('The OTP code you entered is incorrect. Please double-check the code from your email and try again.');
                    } 
                    // Check if the error is related to existing user
                    else if (data && data.error && data.error.includes('User already exists')) {
                        setOtpError('This email is already registered. Please use the login option.');
                        toast.error('This email is already registered. Please use the login option instead.');
                        // Close the OTP popup after a short delay
                        setTimeout(() => {
                            handlePopup();
                            // Redirect to login page
                            window.location.href = '/login';
                        }, 2000);
                    } else {
                        setOtpError('Server error. Please try again later.');
                        toast.error('Server error. Please try again later or contact support.');
                        console.error('Server error details:', data);
                    }
                } else if (status === 401) {
                    setOtpError('The OTP code you entered is incorrect. Please try again.');
                    toast.error('The OTP code you entered is incorrect. Please double-check the code from your email and try again.');
                } else if (status === 404) {
                    setOtpError('Your OTP code has expired. Please click "Resend OTP".');
                    toast.error('Your OTP code has expired or is no longer valid. Please click "Resend OTP" to get a new verification code.');
                } else if (data && data.message) {
                    setOtpError(data.message);
                    toast.error(data.message);
                } else {
                    setOtpError(`Error (${status}): Failed to verify OTP. Please try again.`);
                    toast.error(`Error (${status}): Failed to verify OTP. Please try again.`);
                }
            } else if (error.request) {
                // Request was made but no response received
                setOtpError('No response from server. Please check your connection.');
                toast.error('No response from server. Please check your connection and try again.');
            } else {
                // Something else caused the error
                setOtpError('Failed to verify OTP. Please try again.');
                toast.error('Failed to verify OTP. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };
    
    const resendOtpFun = async () => {
        try {
            setLoading(true);
            // Clear any existing error when resending OTP
            setOtpError('');
            
            // Check if email is available
            if (!sendData || !sendData.email) {
                setOtpError('Email address is missing. Please try again.');
                toast.error('Email address is missing. Please try again.');
                return;
            }
            
            console.log('Resending OTP for email:', sendData.email);
            
            // Use the resend-otp endpoint which is specifically for resending OTPs
            const endpoint = "auth/request-otp";
            
            // Create a simple request with just the email
            const requestData = { email: sendData.email };
            console.log('Sending request with data:', requestData);
            
            const response = await Api.post(endpoint, requestData);
            console.log('OTP request response:', response);
            
            // Process the response
            if (response && response.data) {
                // Extract the data from the response
                // In some API implementations, the actual data might be nested in response.data.data
                const responseData = response.data.data || response.data;
                console.log('Response data:', responseData);
                
                // Check if OTP is directly in the response or in a nested data object
                const otpValue = responseData.otp || (responseData.data && responseData.data.otp);
                
                // If OTP is included in the response (development mode), update the sendData
                if (otpValue) {
                    console.log('Updated OTP in sendData:', otpValue);
                    // Force a re-render by updating state
                    setOtp(['', '', '', '', '', '']);
                }
                
                // Get message from appropriate location in response
                const message = responseData.message || 
                               (response.data.message) || 
                               "OTP has been sent to your email";
                
                toast.success(message);
                
                // Display OTP in UI for testing if available
                if (otpValue) {
                    console.log('==================================================');
                    console.log(`DEVELOPMENT OTP CODE: ${otpValue}`);
                    console.log('==================================================');
                }
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Resend OTP error:', error);
            
            // Detailed error logging
            if (error.response) {
                console.error('Error response:', error.response);
                console.error('Error status:', error.response.status);
                console.error('Error data:', error.response.data);
            }
            
            // User-friendly error message
            if (error.response && error.response.data && error.response.data.message) {
                setOtpError(error.response.data.message);
                toast.error(error.response.data.message);
            } else if (error.message) {
                setOtpError(`Error: ${error.message}`);
                toast.error(`Error: ${error.message}`);
            } else {
                setOtpError('Failed to send OTP. Please try again.');
                toast.error('Failed to send OTP. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="main-popup action-modal auth-sign-modal" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div className="lm-outer" style={{
                position: 'relative',
                zIndex: 10,
                maxWidth: '450px',
                width: '100%',
                margin: '0 auto'
            }}>
                <div className="lm-inner" style={{
                    background: '#fff',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                }}>
                    <div className="popup-inner">
                        <div className="popup-header" style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '15px 20px',
                            borderBottom: '1px solid #eee'
                        }}>
                            <div className="back-icon" style={{ cursor: 'pointer' }}>
                                <Link to="#" onClick={handlePopup}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                                    </svg>
                                </Link>
                            </div>
                            <div className="popup-title">
                                <h3 style={{
                                    fontSize: '1.5rem',
                                    fontWeight: '600',
                                    margin: 0
                                }}>Enter OTP</h3>
                            </div>
                            <div style={{ width: '24px' }}></div> {/* Empty space for alignment */}
                        </div>
                        
                        <div className="popup-body" style={{ padding: '20px' }}>
                            <div className="auth-main">
                                <div className="auth-heading" style={{ marginBottom: '20px' }}>
                                    <p style={{ fontSize: '0.95rem', color: '#555', lineHeight: '1.5' }}>
                                        Enter <span style={{ fontWeight: '600' }}>SIX</span> digit code we have sent to your
                                        email address <span style={{ fontWeight: '600' }}>{sendData?.email}</span> to verify your <span style={{ fontWeight: '600' }}>Addisnest</span> account.
                                        {sendData?.note && (
                                            <span style={{ display: 'block', marginTop: '10px', color: '#28a745', padding: '8px', backgroundColor: '#f1f9f1', borderRadius: '4px', border: '1px solid #c3e6cb' }}>
                                                <strong>Note:</strong> {sendData.note}
                                            </span>
                                        )}
                                    </p>
                                </div>
                                
                                <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    gap: '8px', 
                                    marginBottom: otpError ? '10px' : '25px'
                                }}>
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            id={`otp-input-${index}`}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            style={{
                                                width: '45px',
                                                height: '50px',
                                                fontSize: '1.5rem',
                                                textAlign: 'center',
                                                border: `1px solid ${otpError ? '#ff3333' : '#ddd'}`,
                                                borderRadius: '4px',
                                                backgroundColor: otpError ? '#fff0f0' : '#f9f9f9',
                                                outline: 'none',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = otpError ? '#ff3333' : '#a4ff2a'}
                                            onBlur={(e) => e.target.style.borderColor = otpError ? '#ff3333' : '#ddd'}
                                        />
                                    ))}
                                </div>
                                
                                {otpError && (
                                    <div style={{
                                        color: '#ff3333',
                                        fontSize: '0.9rem',
                                        marginBottom: '15px',
                                        padding: '8px 12px',
                                        backgroundColor: '#fff0f0',
                                        borderRadius: '4px',
                                        borderLeft: '3px solid #ff3333',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <line x1="12" y1="8" x2="12" y2="12"></line>
                                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                        </svg>
                                        {otpError}
                                    </div>
                                )}
                                
                                <div style={{ marginBottom: '20px' }}>
                                    <button 
                                        onClick={otpVerifyFun}
                                        style={{
                                            width: '100%',
                                            padding: '12px 15px',
                                            background: '#a4ff2a',
                                            border: 'none',
                                            borderRadius: '4px',
                                            color: '#333',
                                            fontWeight: '600',
                                            fontSize: '0.95rem',
                                            cursor: 'pointer',
                                            transition: 'background 0.3s ease'
                                        }}
                                        onMouseOver={(e) => e.target.style.background = '#98f01c'}
                                        onMouseOut={(e) => e.target.style.background = '#a4ff2a'}
                                        disabled={loading}
                                    >
                                        {loading ? "Verifying..." : "Verify & Continue"}
                                    </button>
                                </div>
                                
                                <div style={{
                                    textAlign: 'center',
                                    fontSize: '0.9rem',
                                    color: '#666'
                                }}>
                                    <p>
                                        Didn't receive code?{' '}
                                        <a 
                                            onClick={resendOtpFun}
                                            style={{
                                                color: '#0066cc',
                                                textDecoration: 'none',
                                                fontWeight: '500',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Resend OTP
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="popup-overlay" onClick={handlePopup} style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(0,0,0,0.5)',
                zIndex: 5
            }}></div>
        </div>
    );
};

export default OtpPopup;
