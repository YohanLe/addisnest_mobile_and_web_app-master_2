import React, { useState } from "react";
import { Link } from "react-router-dom";
import Api from "../Apis/Api";
import { toast } from "react-toastify";
import OtpPopup from "./OtpPopup";

const EmailVerificationPopup = ({ handlePopup, provider }) => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showOtpPopup, setShowOtpPopup] = useState(false);
    const [otpData, setOtpData] = useState(null);

    const validateEmail = (email) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (error) setError("");
    };

    const sendOtp = async () => {
        // Validate email
        if (!email) {
            setError("Email is required");
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }

        try {
            setLoading(true);
            
            // Prepare OTP data first before sending the API request
            // This ensures we can show the OTP popup immediately
            const tempOtpData = {
                email,
                provider, // 'google' or 'apple'
                pagetype: 'socialLogin'
            };
            
            // Set OTP data immediately so it's available for the popup
            setOtpData(tempOtpData);
            
            // Show OTP popup immediately
            setShowOtpPopup(true);
            
            // Then send request to backend to send OTP
            const response = await Api.post("auth/request-otp", { 
                email,
                provider // 'google' or 'apple'
            });
            
            const { data, message } = response;
            
            // Update OTP data with the server response
            setOtpData({
                ...tempOtpData,
                otp: data?.otp, // For testing purposes
                note: data?.note // Include the note from the API response
            });
            
            toast.success(message || "OTP sent to your email");
            
        } catch (error) {
            console.error('Error sending OTP:', error);
            
            // Even if there's an error, leave the OTP popup open so user can retry
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Failed to send OTP. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            sendOtp();
        }
    };

    return (
        <>
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
                                <div className="back-icon">
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
                                    }}>
                                        Verify Your Email
                                    </h3>
                                </div>
                                <div className="close-icon" onClick={handlePopup} style={{
                                    cursor: 'pointer'
                                }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </div>
                            </div>
                            
                            <div className="popup-body" style={{
                                padding: '20px'
                            }}>
                                <div className="auth-main">
                                    <div className="auth-heading">
                                        <h4 style={{
                                            fontSize: '1.1rem',
                                            fontWeight: '500',
                                            marginBottom: '20px',
                                            color: '#555'
                                        }}>
                                            Confirm your email for {provider === 'google' ? 'Google' : 'Apple'} login
                                        </h4>
                                        <p style={{
                                            fontSize: '0.9rem',
                                            color: '#666',
                                            marginBottom: '20px'
                                        }}>
                                            Please enter your email address. We'll send you a verification code to continue.
                                        </p>
                                    </div>
                                    
                                    <div className="form-flex" style={{
                                        marginBottom: '20px'
                                    }}>
                                        <div className="form-inner-flx-100" style={{
                                            marginBottom: '15px'
                                        }}>
                                            <div className="single-input">
                                                <label style={{
                                                    display: 'block',
                                                    marginBottom: '5px',
                                                    fontSize: '0.9rem',
                                                    fontWeight: '500',
                                                    color: '#444'
                                                }}>
                                                    Email<i style={{color: 'red'}}>*</i>
                                                </label>
                                                <input
                                                    type="email"
                                                    placeholder="Enter Your Email Id"
                                                    value={email}
                                                    onChange={handleEmailChange}
                                                    onKeyDown={handleKeyDown}
                                                    style={{
                                                        width: '100%',
                                                        padding: '10px 15px',
                                                        border: error ? '1px solid red' : '1px solid #ddd',
                                                        borderRadius: '4px',
                                                        fontSize: '0.9rem',
                                                        color: '#333'
                                                    }}
                                                />
                                                {error && <p style={{
                                                    color: 'red',
                                                    fontSize: '0.8rem',
                                                    marginTop: '5px'
                                                }}>{error}</p>}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="auth-btn" style={{
                                        marginBottom: '20px'
                                    }}>
                                        <button 
                                            onClick={sendOtp} 
                                            className="btn btn-primary"
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
                                            {loading ? "Sending..." : "Send Verification Code"}
                                        </button>
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
            
            {showOtpPopup && (
                <OtpPopup 
                    handlePopup={() => setShowOtpPopup(false)} 
                    sendData={otpData} 
                />
            )}
        </>
    );
};

export default EmailVerificationPopup;
