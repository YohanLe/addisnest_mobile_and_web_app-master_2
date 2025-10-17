import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Api from "../../Apis/Api";
import { toast } from "react-toastify";
import { ValidateResetpassword } from "../../utils/Validation";
import { AuthImage } from "../../assets/images";

const NewPasswordPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;

    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [error, setError] = useState({ isValid: false });
    const [loading, setLoading] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!isPasswordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!isConfirmPasswordVisible);
    };

    const [inps, setInps] = useState({
        password: "",
        confirm_password: ""
    });

    const onInpChanged = (event) => {
        setError(p => {
            const obj = { ...p }
            obj?.errors && delete obj?.errors[event?.target?.name]
            return obj
        });
        setInps((prevInputs) => ({ ...prevInputs, [event.target.name]: event.target.value }));
    };

    const resetPasswordFun = async () => {
        const errorMessage = ValidateResetpassword(inps);
        if (errorMessage.isValid == false) {
            setError(errorMessage);
        } else {
            try {
                let body = {
                    email: state?.email,
                    password: inps?.password,
                    confirm_password: inps?.confirm_password,
                };
                
                if (!state?.email) {
                    toast.error("Email information is missing. Please go back to the forgot password page.");
                    return;
                }

                setLoading(true);
                const response = await Api.post("auth/reset-password", body);
                const { message } = response;
                setLoading(false);
                toast.success(message || "Password has been successfully reset");
                navigate('/login');
            } catch (error) {
                console.error('Reset Password Error:', error);
                setLoading(false);
                
                const { response } = error;
                let errorMessage = 'Failed to reset password. Please try again.';
                
                if (response) {
                    // Server responded with error
                    const { status, data } = response;
                    
                    if (status === 400) {
                        errorMessage = data?.message || 'Invalid password format. Please try again.';
                    } else if (status === 404) {
                        errorMessage = 'Reset token is invalid or has expired. Please request a new password reset.';
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
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            resetPasswordFun();
        }
    };

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
                                                <h3>New Password</h3>
                                                <p>Please enter and confirm your new password.</p>
                                            </div>
                                            <div className="form-flex">
                                                <div className="form-flex-inner-100">
                                                    <div className="single-input">
                                                        <label>
                                                            Password<i>*</i>
                                                        </label>
                                                        <div className="password-inputs">
                                                            <input
                                                                type={isPasswordVisible ? "text" : "password"}
                                                                placeholder="Enter Your Password"
                                                                name="password"
                                                                onChange={onInpChanged}
                                                                onKeyDown={handleKeyDown}
                                                                value={inps.password}
                                                                className={`${error.errors?.password ? "alert-input" : ""}`}
                                                            />
                                                            <div
                                                                className="pwd-icon"
                                                                onClick={togglePasswordVisibility}
                                                                style={{ cursor: "pointer" }}
                                                            >
                                                                {isPasswordVisible ? (
                                                                    <span>
                                                                        <i className="fa-regular fa-eye-slash"></i>
                                                                    </span>
                                                                ) : (
                                                                    <span>
                                                                        <i className="fa-regular fa-eye"></i>
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {error.errors?.password && <p className="error-input-msg">{error.errors?.password}</p>}
                                                    </div>
                                                </div>
                                                <div className="form-flex-inner-100">
                                                    <div className="single-input">
                                                        <label>
                                                            Confirm Password<i>*</i>
                                                        </label>
                                                        <div className="password-inputs">
                                                            <input
                                                                type={isConfirmPasswordVisible ? "text" : "password"}
                                                                placeholder="Enter Your Password"
                                                                name="confirm_password"
                                                                onChange={onInpChanged}
                                                                onKeyDown={handleKeyDown}
                                                                value={inps.confirm_password}
                                                                className={`${error.errors?.confirm_password ? "alert-input" : ""}`}
                                                            />
                                                            <div
                                                                className="pwd-icon"
                                                                onClick={toggleConfirmPasswordVisibility}
                                                                style={{ cursor: "pointer" }}
                                                            >
                                                                {isConfirmPasswordVisible ? (
                                                                    <span>
                                                                        <i className="fa-regular fa-eye-slash"></i>
                                                                    </span>
                                                                ) : (
                                                                    <span>
                                                                        <i className="fa-regular fa-eye"></i>
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {error.errors?.confirm_password && <p className="error-input-msg">{error.errors?.confirm_password}</p>}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="auth-btn">
                                                <button onClick={resetPasswordFun} className="btn btn-primary">
                                                    {loading ? "Processing..." : "Reset Password"}
                                                </button>
                                            </div>
                                            <div className="auth-btm">
                                                <p>
                                                    Remember your password? <Link to="/login">Back to Login</Link>
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

export default NewPasswordPage;
