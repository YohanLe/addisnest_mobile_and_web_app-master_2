import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../../Apis/Api";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { AuthUserDetails } from "../../Redux-store/Slices/AuthSlice";
import { validateLogin } from "../../utils/Validation";

const LogInpopup = ({ isOpen, onClose, onLoginSuccess }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({ isValid: false });
    
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

    const handleForgotPasswordClick = () => {
        onClose();
        navigate('/forgot-password');
    };
    
    const handleRegisterClick = () => {
        onClose();
        navigate('/sign-up');
    };
    
    const Loginfun = async () => {
        const errorMessage = validateLogin(inps);
        if (errorMessage.isValid === false) {
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
                
                // Call login success callback
                if (onLoginSuccess) {
                    onLoginSuccess();
                }
                
                dispatch(AuthUserDetails());
                toast.success("Login successful");

            } catch (error) {
                console.error('Login error:', error);
                setLoading(false);
                
                if (!error.response) {
                    toast.error('Network connection failed. Please check your internet connection.');
                    return;
                }
                
                if (error.response && error.response.data && error.response.data.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error('Login failed. Please check your credentials and try again.');
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

    if (!isOpen) return null;

    return (
        <div className="login-popup-overlay" style={{
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
            <div className="login-popup-container" style={{
                position: 'relative',
                zIndex: 10,
                maxWidth: '450px',
                width: '100%',
                margin: '0 auto'
            }}>
                <div className="login-popup-inner" style={{
                    background: '#fff',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
                }}>
                    <div className="popup-header" style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '15px 20px',
                        borderBottom: '1px solid #eee'
                    }}>
                        <h3 style={{
                            fontSize: '1.5rem',
                            fontWeight: '600',
                            margin: 0
                        }}>Log in to Continue</h3>
                        <button 
                            onClick={onClose}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '1.5rem',
                                padding: '0',
                                lineHeight: '1'
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    
                    <div className="popup-body" style={{
                        padding: '25px'
                    }}>
                        <div className="form-group" style={{
                            marginBottom: '20px'
                        }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontSize: '0.9rem',
                                fontWeight: '500',
                                color: '#444'
                            }}>
                                Email<span style={{color: 'red'}}>*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                onChange={onInpChanged}
                                value={inps?.email}
                                className={`${error.errors?.email ? "alert-input" : ""}`}
                                style={{
                                    width: '100%',
                                    padding: '12px 15px',
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
                        
                        <div className="form-group" style={{
                            marginBottom: '15px'
                        }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontSize: '0.9rem',
                                fontWeight: '500',
                                color: '#444'
                            }}>
                                Password<span style={{color: 'red'}}>*</span>
                            </label>
                            <div style={{
                                position: 'relative'
                            }}>
                                <input
                                    type={isPasswordVisible ? "text" : "password"}
                                    placeholder="Enter your password"
                                    name="password"
                                    onChange={onInpChanged}
                                    onKeyDown={handleKeyDown}
                                    value={inps?.password}
                                    className={`${error.errors?.password ? "alert-input" : ""}`}
                                    style={{
                                        width: '100%',
                                        padding: '12px 15px',
                                        paddingRight: '40px',
                                        border: error.errors?.password ? '1px solid red' : '1px solid #ddd',
                                        borderRadius: '4px',
                                        fontSize: '0.9rem',
                                        color: '#333'
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    style={{ 
                                        position: 'absolute',
                                        top: '50%',
                                        right: '15px',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: 0,
                                        color: '#555'
                                    }}
                                >
                                    {isPasswordVisible ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
                                            <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
                                            <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                                            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {error.errors?.password && <p style={{
                                color: 'red',
                                fontSize: '0.8rem',
                                marginTop: '5px'
                            }}>{error.errors?.password}</p>}
                        </div>
                        
                        <div className="forgot-password" style={{
                            textAlign: 'right',
                            marginBottom: '20px'
                        }}>
                            <button
                                onClick={handleForgotPasswordClick}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    padding: 0,
                                    color: '#0066cc',
                                    textDecoration: 'none',
                                    fontSize: '0.85rem',
                                    fontWeight: '500',
                                    cursor: 'pointer'
                                }}
                            >
                                Forgot Password?
                            </button>
                        </div>
                        
                        <button 
                            onClick={Loginfun} 
                            className="login-button"
                            style={{
                                width: '100%',
                                padding: '14px',
                                background: '#a4ff2a',
                                border: 'none',
                                borderRadius: '6px',
                                color: '#333',
                                fontWeight: '600',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                marginBottom: '20px'
                            }}
                        >
                            {loading ? "Processing..." : "Log In"}
                        </button>
                        
                        <div className="signup-link" style={{
                            textAlign: 'center',
                            fontSize: '0.9rem',
                            color: '#666',
                            marginTop: '15px'
                        }}>
                            <p style={{ margin: 0 }}>
                                Don't have an account?{' '}
                                <button
                                    onClick={handleRegisterClick}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        padding: 0,
                                        color: '#0066cc',
                                        textDecoration: 'none',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Sign Up
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div 
                className="popup-overlay"
                onClick={onClose}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0,0,0,0.5)',
                    zIndex: 5
                }}
            ></div>
        </div>
    );
};

export default LogInpopup;
