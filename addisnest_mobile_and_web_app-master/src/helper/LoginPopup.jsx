import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Api from "../Apis/Api";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { AuthUserDetails } from "../Redux-store/Slices/AuthSlice";
import { validateLogin } from "../utils/Validation";
import OtpPopup from "./OtpPopup";
import EmailVerificationPopup from "./EmailVerificationPopup";
import CustomerRegisterPopup from "./CustomerRegisterPopup";

const LoginPopup = ({ handlePopup, redirectAfterLogin }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [activeTab, setActiveTab] = useState("customer");
    const [loading, setLoading] = useState(false);
const [error, setError] = useState({ isValid: false });
const [loginError, setLoginError] = useState("");
    const [showOtpPopup, setShowOtpPopup] = useState(false);
    const [showEmailVerificationPopup, setShowEmailVerificationPopup] = useState(false);
    const [showCustomerRegisterPopup, setShowCustomerRegisterPopup] = useState(false);
    const [socialProvider, setSocialProvider] = useState(null);
    const [otpData, setOtpData] = useState(null);
    
    const togglePasswordVisibility = () => {
        setPasswordVisible(!isPasswordVisible);
    };
    
    const [inps, setInps] = useState({
        email: '',
        password: "",
    });

    const onInpChanged = (event) => {
        setError(p => {
            const obj = { ...p }
            obj?.errors && delete obj?.errors[event?.target?.name]
            return obj
        });
        setInps((prevInputs) => ({ ...prevInputs, [event.target.name]: event.target.value }));
    };

    const handleRegisterClick = () => {
        setShowCustomerRegisterPopup(true);
    };
  
    const handleForgotPasswordClick = () => {
        handlePopup();
        navigate('/forgot-password');
    };
    
    // Handler for Google login
    const handleGoogleLogin = () => {
        setSocialProvider('google');
        setShowEmailVerificationPopup(true);
    };
    
    // Handler for Apple login
    const handleAppleLogin = () => {
        setSocialProvider('apple');
        setShowEmailVerificationPopup(true);
    };
    
    const Loginfun = async () => {
        // Clear any previous login errors
        setLoginError("");
        
        const errorMessage = validateLogin(inps);
        if (errorMessage.isValid == false) {
            setError(errorMessage);
        } else {
            try {
                let body = {
                    email: inps.email,
                    password: inps.password,
                }

                setLoading(true);
                const response = await Api.post("auth/login", body);
                const { data, message } = response;
                localStorage.setItem('addisnest_token', data?.token);
                localStorage.setItem('isLogin', '1')
                localStorage.setItem("userId", data?.userId);
                localStorage.setItem("userType", activeTab);
                
                handlePopup();
                dispatch(AuthUserDetails());
                
                // Navigate to different routes based on user type
                if (activeTab === "agent") {
                    // Redirect to agent dashboard
                    window.location.href = `${window.location.origin.replace(':5185', ':3001')}/`;
                } else {
                    // Check if we have a redirect path after login
                    if (redirectAfterLogin) {
                        // If we have a redirect path, navigate to it
                        window.location.href = redirectAfterLogin;
                    } else {
                        // Otherwise, go to home page
                        window.location.href = '/';
                    }
                }
                
                toast.success("Login successful");

            } catch (error) {
                console.error('Login error:', error);
                setLoading(false);
                
                if (!error.response) {
                    setLoginError('Network connection failed. Please check your internet connection.');
                    return;
                }
                
                // Display user-friendly error messages for different error scenarios
                if (error.response) {
                    const { status, data } = error.response;
                    
                    // Check message content first regardless of status code
                    if (data?.message) {
                        if (data.message.toLowerCase().includes('password')) {
                            setLoginError('The password you entered is incorrect. Please try again.');
                        } else if (data.message.toLowerCase().includes('not found') || 
                                  data.message.toLowerCase().includes('not registered') ||
                                  data.message.toLowerCase().includes('email')) {
                            setLoginError('This email is not registered. Please check your email or sign up.');
                        } else if (status === 404) {
                            setLoginError('Account not found. Please check your email or create a new account.');
                        } else if (status === 403) {
                            setLoginError('Your account is locked. Please contact support for assistance.');
                        } else if (status >= 500) {
                            setLoginError('We\'re having a temporary issue with our system. Please try again in a moment or contact support if the problem persists.');
                        } else {
                            setLoginError('Unable to sign in. Please check your credentials and try again.');
                        }
                    } else {
                        // Fallback for cases where no message is provided
                        if (status === 401) {
                            setLoginError('Invalid email or password. Please check your credentials and try again.');
                        } else if (status === 404) {
                            setLoginError('Account not found. Please check your email or create a new account.');
                        } else if (status === 403) {
                            setLoginError('Your account is locked. Please contact support for assistance.');
                        } else if (status >= 500) {
                            setLoginError('We\'re having a temporary issue with our system. Please try again in a moment or contact support if the problem persists.');
                        } else {
                            setLoginError('Login failed. Please try again.');
                        }
                    }
                } else {
                    setLoginError('An error occurred during login. Please try again.');
                }
            } finally {
                setLoading(false);
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            Loginfun();
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
                                    <Link to="#"></Link>
                                </div>
                                <div className="popup-title">
                                    <h3 style={{
                                        fontSize: '1.5rem',
                                        fontWeight: '600',
                                        margin: 0
                                    }}>Log in</h3>
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
                                        }}>Welcome to Addisnest</h4>
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
                                                    name="email"
                                                    placeholder="Enter Your Email Id"
                                                    onChange={onInpChanged}
                                                    value={inps?.email}
                                                    className={`${error.errors?.email ? "alert-input" : ""}`}
                                                    style={{
                                                        width: '100%',
                                                        padding: '10px 15px',
                                                        border: error.errors?.email ? '1px solid red' : '1px solid #ddd',
                                                        borderRadius: '4px',
                                                        fontSize: '0.9rem',
                                                        color: '#333'
                                                    }}
                                                />
                                                {error.errors?.email && <p style={{
                                                    color: 'red',
                                                    fontSize: '0.8rem',
                                                    marginTop: '5px'
                                                }}>{error.errors?.email}</p>}
                                            </div>
                                        </div>
                                        <div className="form-inner-flx-100">
                                            <div className="single-input">
                                                <label style={{
                                                    display: 'block',
                                                    marginBottom: '5px',
                                                    fontSize: '0.9rem',
                                                    fontWeight: '500',
                                                    color: '#444'
                                                }}>
                                                    Password<i style={{color: 'red'}}>*</i>
                                                </label>
                                                <div className="password-inputs" style={{
                                                    position: 'relative'
                                                }}>
                                                    <input
                                                        type={isPasswordVisible ? "text" : "password"}
                                                        placeholder="Enter Your Password"
                                                        name="password"
                                                        onChange={onInpChanged}
                                                        onKeyDown={handleKeyDown}
                                                        value={inps?.password}
                                                        className={`${error.errors?.password ? "alert-input" : ""}`}
                                                        style={{
                                                            width: '100%',
                                                            padding: '10px 15px',
                                                            paddingRight: '40px',
                                                            border: error.errors?.password ? '1px solid red' : '1px solid #ddd',
                                                            borderRadius: '4px',
                                                            fontSize: '0.9rem',
                                                            color: '#333'
                                                        }}
                                                    />
                                                    <div
                                                        className="pwd-icon"
                                                        onClick={togglePasswordVisibility}
                                                        style={{ 
                                                            position: 'absolute',
                                                            top: '50%',
                                                            right: '15px',
                                                            transform: 'translateY(-50%)',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        {isPasswordVisible ? (
                                                            <span>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                                    <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
                                                                    <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
                                                                    <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
                                                                </svg>
                                                            </span>
                                                        ) : (
                                                            <span>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                                                                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                                                                </svg>
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                {error.errors?.password && <p style={{
                                                    color: 'red',
                                                    fontSize: '0.8rem',
                                                    marginTop: '5px'
                                                }}>{error.errors?.password}</p>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="fogot-link" style={{
                                        marginBottom: '20px',
                                        textAlign: 'right'
                                    }}>
                                        <Link to="#" onClick={handleForgotPasswordClick} style={{
                                            color: '#0066cc',
                                            textDecoration: 'none',
                                            fontSize: '0.85rem',
                                            fontWeight: '500'
                                        }}>
                                            Forgot Password?
                                        </Link>
                                            </div>
                                            {loginError && (
                                                <div className="login-error-message" style={{
                                                    padding: '10px 15px',
                                                    marginBottom: '15px',
                                                    background: '#ffebee',
                                                    border: '1px solid #ffcdd2',
                                                    borderRadius: '4px',
                                                    color: '#d32f2f',
                                                    fontSize: '0.9rem',
                                                    textAlign: 'center'
                                                }}>
                                                    <p style={{ margin: '0' }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '5px', verticalAlign: 'middle' }}>
                                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                                            <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
                                                        </svg>
                                                        {loginError}
                                                    </p>
                                                </div>
                                            )}
                                            <div className="auth-btn" style={{
                                                marginBottom: '20px'
                                            }}>
                                        <button 
                                            onClick={Loginfun} 
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
                                        >
                                            {loading ? "Processing..." : "Continue"}
                                        </button>
                                    </div>
                                    <div className="auth-orline" style={{
                                        textAlign: 'center',
                                        position: 'relative',
                                        margin: '25px 0',
                                        height: '1px',
                                        background: '#eee'
                                    }}>
                                        <p style={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            background: '#fff',
                                            padding: '0 15px',
                                            color: '#888',
                                            fontSize: '0.9rem'
                                        }}>OR</p>
                                    </div>
                                    <div className="auth-social-btn" style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '10px',
                                        marginBottom: '20px'
                                    }}>
                                        <button 
                                            onClick={handleGoogleLogin} 
                                            className="auth-google" 
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                padding: '10px 15px',
                                                borderRadius: '4px',
                                                border: '1px solid #ddd',
                                                background: 'white',
                                                color: '#444',
                                                textDecoration: 'none',
                                                fontSize: '0.9rem',
                                                fontWeight: '500',
                                                gap: '10px',
                                                width: '100%',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <span>
                                                <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                                                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                                                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                                                    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                                                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                                                </svg>
                                            </span>
                                            Log in with Google
                                        </button>
                                        <button 
                                            onClick={handleAppleLogin} 
                                            className="auth-apple" 
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                padding: '10px 15px',
                                                borderRadius: '4px',
                                                border: '1px solid #ddd',
                                                background: 'white',
                                                color: '#444',
                                                textDecoration: 'none',
                                                fontSize: '0.9rem',
                                                fontWeight: '500',
                                                gap: '10px',
                                                width: '100%',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <span>
                                                <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                                                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                                                </svg>
                                            </span>
                                            Log in with Apple
                                        </button>
                                    </div>
                                    <div className="auth-btm" style={{
                                        textAlign: 'center',
                                        fontSize: '0.9rem',
                                        color: '#666'
                                    }}>
                                        <p>
                                            Don't have an Account?
                                            <Link onClick={handleRegisterClick} style={{
                                                color: '#0066cc',
                                                textDecoration: 'none',
                                                fontWeight: '500',
                                                marginLeft: '5px'
                                            }}>
                                                Register
                                            </Link>
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
            
            {showOtpPopup && (
                <OtpPopup 
                    handlePopup={() => setShowOtpPopup(false)} 
                    sendData={otpData} 
                />
            )}
            
            {showEmailVerificationPopup && (
                <EmailVerificationPopup 
                    handlePopup={() => {
                        setShowEmailVerificationPopup(false);
                        setSocialProvider(null);
                    }}
                    provider={socialProvider}
                />
            )}

            {showCustomerRegisterPopup && (
                <CustomerRegisterPopup 
                    handlePopup={() => setShowCustomerRegisterPopup(false)}
                    handleLogin={() => setShowCustomerRegisterPopup(false)}
                />
            )}
        </>
    );
};

export default LoginPopup;
