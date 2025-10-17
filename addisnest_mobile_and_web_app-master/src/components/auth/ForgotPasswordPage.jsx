import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Api from "../../Apis/Api";
import { toast } from "react-toastify";
import { validateForgotPassword } from "../../utils/Validation";
import { AuthImage } from "../../assets/images";
import OtpPopup from "../../helper/OtpPopup";

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [Loading, setLoading] = useState(false);
    const [error, setError] = useState({ isValid: false });
    const [emailSent, setEmailSent] = useState(false);
    const [showOtpPopup, setShowOtpPopup] = useState(false);
    const [otpData, setOtpData] = useState(null);

    const [inps, setInps] = useState({
        email: '',
    });

    const onInpChanged = (event) => {
        setError(p => {
            const obj = { ...p }
            obj?.errors && delete obj?.errors[event?.target?.name]
            return obj
        });
        setInps((prevInputs) => ({ ...prevInputs, [event.target.name]: event.target.value }));
    };

    const forgotPasswordFun = async () => {
        const errorMessage = validateForgotPassword(inps);
        if (errorMessage.isValid == false) {
            setError(errorMessage);
        } else {
            try {
                // Prepare OTP data immediately so the popup can be shown right away
                const tempOtpData = {
                    email: inps.email,
                    pagetype: 'forgot'
                };
                
                // Set OTP data and show OTP popup immediately
                setOtpData(tempOtpData);
                setShowOtpPopup(true);
                
                // Then make the API request
                let body = {
                    email: inps.email
                };

                setLoading(true);
                const response = await Api.post("auth/request-otp", body);
                const { data, message } = response;
                
                // Update OTP data with server response
                setOtpData({
                    ...tempOtpData,
                    otp: data?.otp // For testing purposes
                });
                
                setEmailSent(true);
                toast.success(message || "OTP sent to your email");
            } catch (error) {
                console.error('Forgot Password Error:', error);
                
                // Even if there's an error, leave the OTP popup open so user can retry
                const { response } = error;
                let errorMessage = 'Failed to process your request. Please try again.';
                
                if (response) {
                    // Server responded with error
                    const { status, data } = response;
                    
                    if (status === 404) {
                        errorMessage = 'Email not found. Please check your email address.';
                    } else if (status >= 500) {
                        errorMessage = 'Server error. Please try again in a few moments.';
                    } else {
                        errorMessage = data?.message || `Server error (${status}). Please try again.`;
                    }
                } else if (!navigator.onLine) {
                    errorMessage = 'You appear to be offline. Please check your internet connection.';
                } else {
                    // Generic error handling
                    errorMessage = error?.message || 'Network error. Please check your connection and try again.';
                }
                
                toast.error(errorMessage, {
                    autoClose: 5000,
                    hideProgressBar: false,
                });
            } finally {
                setLoading(false);
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            forgotPasswordFun();
        }
    };

    return (
        <>
            {showOtpPopup && (
                <OtpPopup 
                    handlePopup={() => setShowOtpPopup(false)} 
                    sendData={otpData} 
                />
            )}
            <div className="auth-wrapper">
                <div className="auth-wrapper-inner">
                    <div className="auth-flex">
                        <div className="auth-flex-50">
                            <div className="auth-main">
                                <div className="auth-card">
                                    <div className="auth-card-body">
                                        <div className="auth-card-body-inner">
                                            <div className="login-innerheading">
                                                <h3>Forgot Password</h3>
                                                <p>Enter your email to reset your password</p>
                                            </div>
                                            {!emailSent ? (
                                                <>
                                                    <div className="form-flex">
                                                        <div className="form-flex-inner-100">
                                                            <div className="single-input">
                                                                <label htmlFor="">
                                                                    Email<i>*</i>
                                                                </label>
                                                                <input
                                                                    type="email"
                                                                    name="email"
                                                                    placeholder="Enter your email"
                                                                    onChange={onInpChanged}
                                                                    onKeyDown={handleKeyDown}
                                                                    value={inps?.email}
                                                                    className={`${error.errors?.email ? "alert-input" : ""}`}
                                                                />
                                                                {error.errors?.email && <p className="error-input-msg">{error.errors?.email}</p>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="auth-btn">
                                                        <button onClick={forgotPasswordFun} className="btn btn-primary">
                                                            {Loading ? "Processing..." : "Reset Password"}
                                                        </button>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="success-message">
                                                    <p>Password reset instructions have been sent to your email. Please check your inbox.</p>
                                                    <div className="auth-btn mt-3">
                                                        <button onClick={() => navigate('/login')} className="btn btn-primary">
                                                            Back to Login
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="auth-btm">
                                                <p>
                                                    Remember your password? <Link to="/login">Back to Sign In</Link>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="auth-flex-50">
                            <div className="auth-discrption">
                                <div className="auth-discrption-inner">
                                    <div className="auth-discrption-main">
                                        <div className="auth-heading-content">
                                            <h3>
                                                Welcome to Addisnest
                                            </h3>
                                        </div>
                                        <div className="auth-description-image">
                                            <img src={AuthImage} alt="" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ForgotPasswordPage;
