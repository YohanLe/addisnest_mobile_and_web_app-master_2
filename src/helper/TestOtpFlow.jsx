import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import OtpPopup from "./OtpPopup";

const TestOtpFlow = () => {
    const navigate = useNavigate();
    const [showOtpPopup, setShowOtpPopup] = useState(false);
    const [otpData, setOtpData] = useState(null);
    const [status, setStatus] = useState('idle');

    // If we have login status in localStorage but no popup,
    // assume the OTP verification was successful
    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLogin') === '1';
        const hasToken = localStorage.getItem('addisnest_token');
        
        if (isLoggedIn && hasToken && !showOtpPopup && status === 'completed') {
            // Redirect to home after successful verification
            console.log("Detected successful login state, redirecting to home...");
            
            // Use window.location for a more forceful redirect that doesn't rely on React Router
            setTimeout(() => {
                window.location.href = '/';
            }, 200);
        }
    }, [showOtpPopup, status, navigate]);

    const handleSendVerification = () => {
        console.log("Send verification clicked");
        setStatus('sending');
        
        // Mock data as if it came from the server
        const data = {
            email: "test@example.com",
            otp: "123456", // This would normally come from the server
            pagetype: 'test'
        };
        
        setOtpData(data);
        
        // Force a delay to ensure state is updated before showing popup
        setTimeout(() => {
            setShowOtpPopup(true);
            setStatus('awaiting-verification');
            console.log("OTP popup should be visible now");
        }, 100);
    };
    
    const handleClosePopup = () => {
        setShowOtpPopup(false);
        setStatus('completed');
        console.log("OTP popup closed");
    };
    
    // Debug log when important states change
    useEffect(() => {
        console.log("Status:", status);
        console.log("showOtpPopup state:", showOtpPopup);
        console.log("otpData state:", otpData);
    }, [showOtpPopup, otpData, status]);

    return (
        <div style={{
            padding: '20px',
            maxWidth: '500px',
            margin: '0 auto',
            fontFamily: 'Arial, sans-serif'
        }}>
            <h2>Test OTP Flow</h2>
            <p>Click the button below to simulate sending a verification code</p>
            
            <button 
                onClick={handleSendVerification}
                style={{
                    padding: '12px 20px',
                    background: '#a4ff2a',
                    border: 'none',
                    borderRadius: '4px',
                    color: '#333',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '16px',
                    marginTop: '20px'
                }}
            >
                Send Verification Code
            </button>
            
            {showOtpPopup && (
                <OtpPopup 
                    handlePopup={handleClosePopup} 
                    sendData={otpData} 
                />
            )}
            
            {status === 'completed' && !showOtpPopup && (
                <div style={{
                    marginTop: '20px',
                    padding: '15px',
                    backgroundColor: '#e6f7e6',
                    borderRadius: '5px',
                    border: '1px solid #c3e6cb'
                }}>
                    <p style={{ color: '#155724', fontWeight: 'bold' }}>
                        Verification successful! Redirecting to home page...
                    </p>
                </div>
            )}
        </div>
    );
};

export default TestOtpFlow;
