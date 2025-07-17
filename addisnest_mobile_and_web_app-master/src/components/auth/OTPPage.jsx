import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Api from "../../Apis/Api";
import { AuthImage } from "../../assets/images";

// Note: This component requires the react-otp-input package
// Install with: npm install react-otp-input

const OTPPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;
    const [otp, setOtp] = useState('');
    const [showOtp, setShowOtp] = useState(state?.otp);
    const [loading, setLoading] = useState(false);
    const [holeData, setHoleData] = useState(state);

    // For environments where OTPInput is not available, we'll provide a fallback
    const OTPInputFallback = ({ value, onChange, numInputs }) => {
        const handleChange = (e) => {
            const val = e.target.value;
            if (val.length <= numInputs && /^[0-9]*$/.test(val)) {
                onChange(val);
            }
        };

        return (
            <div className="otp-fallback">
                <input
                    type="text"
                    inputMode="numeric"
                    maxLength={numInputs}
                    value={value}
                    onChange={handleChange}
                    placeholder="Enter verification code"
                    className="otp-fallback-input"
                    pattern="[0-9]*"
                />
            </div>
        );
    };

    // Dynamic import for OTPInput
    const OTPInputComponent = ({ value, onChange, numInputs }) => {
        try {
            // Attempt to use OTPInput if available
            const OTPInput = require('react-otp-input').default;
            return (
                <OTPInput
                    value={value}
                    onChange={onChange}
                    numInputs={numInputs}
                    renderSeparator={""}
                    skipDefaultStyles={true}
                    renderInput={(props) => (
                        <input
                            {...props}
                            placeholder="-"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                        />
                    )}
                />
            );
        } catch (error) {
            // Fallback if OTPInput is not available
            return <OTPInputFallback value={value} onChange={onChange} numInputs={numInputs} />;
        }
    };

    const verifyOtpFun = async () => {
        if (otp === '' || otp.length < 6) {
            toast.error('Please enter a valid 6-digit OTP');
        } else {
            let body = {
                email: holeData?.email,
                otp: otp
            };
            try {
                setLoading(true);
                const response = await Api.post("auth/verify-otp", body);
                const { message } = response;
                setLoading(false);
                navigate('/new-password', { state: { email: holeData.email, otp: otp, fromLogin: true } });
                toast.success(message || "OTP verified successfully");
            } catch (error) {
                setLoading(false);
                const errorMsg = error.response?.data?.message || "Failed to verify OTP. Please try again.";
                toast.error(errorMsg);
            }
        }
    };

    const resendOtp = async () => {
        if (!holeData?.email) {
            toast.error("Email information is missing. Please go back to the forgot password page.");
            return;
        }

        let body = {
            email: holeData.email,
        };
        try {
            setLoading(true);
            const response = await Api.post("auth/request-otp", body);
            const { data, message } = response;
            setLoading(false);
            setShowOtp(data?.otp);
            toast.success(message || "OTP has been resent to your email");
        } catch (error) {
            setLoading(false);
            const errorMsg = error.response?.data?.message || "Failed to resend OTP. Please try again.";
            toast.error(errorMsg);
        }
    };

    if (!state || !state.email) {
        return (
            <div className="auth-wrapper">
                <div className="auth-wrapper-inner">
                    <div className="auth-card">
                        <div className="auth-card-body">
                            <div className="auth-card-body-inner">
                                <div className="login-innerheading">
                                    <h3>Invalid Access</h3>
                                    <p>You've reached this page through an invalid route.</p>
                                </div>
                                <div className="auth-btn">
                                    <button onClick={() => navigate('/forgot-password')} className="btn btn-primary">
                                        Go to Forgot Password
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="auth-wrapper">
                <div className="auth-wrapper-inner">
                    <div className="auth-flex">
                        <div className="auth-flex-50">
                            <div className="auth-main">
                                <div className="auth-card">
                                    <div className="auth-card-body">
                                        <div className="auth-card-body-inner">
                                            <div className="login-innerheading">
                                                <h3>Verification Code</h3>
                                                <p>Enter the code that was sent to: <strong>{holeData?.email}</strong></p>
                                                {showOtp && process.env.NODE_ENV !== 'production' && 
                                                    <p className="dev-otp-display">Development OTP: {showOtp}</p>
                                                }
                                            </div>
                                            <div className="otp-input">
                                                <OTPInputComponent
                                                    value={otp}
                                                    onChange={setOtp}
                                                    numInputs={6}
                                                />
                                            </div>
                                            <div className="auth-btn">
                                                <button 
                                                    onClick={verifyOtpFun} 
                                                    className="btn btn-primary"
                                                    disabled={loading}
                                                >
                                                    {loading ? "Verifying..." : "Verify"}
                                                </button>
                                            </div>
                                            <div className="frgot-btn resend-code">
                                                <a href="#" onClick={(e) => { e.preventDefault(); resendOtp(); }} style={{cursor: 'pointer'}}>
                                                    {loading ? "Sending..." : "Resend code"}
                                                </a>
                                            </div>
                                            <div className="auth-btm">
                                                <p>
                                                    <Link to="/forgot-password">Go back to Forgot Password</Link>
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

export default OTPPage;
