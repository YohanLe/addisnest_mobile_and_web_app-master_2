import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Api from "../../Apis/Api";
import axios from 'axios';
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { AuthUserDetails, login } from "../../Redux-store/Slices/AuthSlice";
import { validateLogin } from "../../utils/Validation";

const AdminLoginPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({ isValid: false });
    const [loginError, setLoginError] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    
    // Check if user is already logged in as admin
    const authState = useSelector((state) => state.Authentication);
    const user = authState?.Details?.data || null;
    
    useEffect(() => {
        // If user is already logged in as admin, redirect to admin dashboard
        if (user && user.role === 'admin') {
            navigate('/admin/dashboard');
        }
        
        // Check for remembered credentials
        const rememberedEmail = localStorage.getItem('admin_remembered_email');
        if (rememberedEmail) {
            setInputs(prev => ({ ...prev, email: rememberedEmail }));
            setRememberMe(true);
        }
    }, [user, navigate]);
    
    const togglePasswordVisibility = () => {
        setPasswordVisible(!isPasswordVisible);
    };

    const [inputs, setInputs] = useState({
        email: '',
        password: "",
    });

    const onInputChanged = (event) => {
        setError(p => {
            const obj = { ...p }
            obj?.errors && delete obj?.errors[event?.target?.name]
            return obj
        });
        setLoginError(""); // Clear login error when user starts typing
        setInputs((prevInputs) => ({ ...prevInputs, [event.target.name]: event.target.value }));
    };
    
    const handleRememberMeChange = (event) => {
        setRememberMe(event.target.checked);
    };
    
    const handleAdminLogin = async () => {
        // Clear any previous login errors
        setLoginError("");
        
        const errorMessage = validateLogin(inputs);
        if (errorMessage.isValid === false) {
            setError(errorMessage);
        } else {
            try {
                let body = {
                    email: inputs.email,
                    password: inputs.password,
                }

                console.log('🔐 Starting admin login process...');
                setLoading(true);
                
                // Test network connectivity first
                if (!navigator.onLine) {
                    throw new Error('No internet connection detected. Please check your network settings.');
                }

                console.log('Attempting admin login with:', body);
                
                // Use the admin login endpoint
                //const API_BASE_URL = 'http://localhost:7002';

                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://addisnest.com';
                
                const response = await axios.post(`${API_BASE_URL}/auth/admin-login`, body, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                // Extract data from response
                const responseData = response.data;
                console.log('✅ Admin login successful:', response);
                
                console.log('Admin login response:', responseData);
                
                // Check if user has admin role
                if (responseData?.role !== 'admin') {
                    console.log('User role is not admin:', responseData?.role);
                    setLoginError('Access denied. This account does not have administrator privileges.');
                    setLoading(false);
                    return;
                }
                
                // Store token and user info with more explicit debugging
                console.log('Setting localStorage values for admin login');
                localStorage.setItem('addisnest_token', responseData?.token);
                localStorage.setItem('isLogin', '1');
                localStorage.setItem("userId", responseData?._id);
                localStorage.setItem("isAdmin", '1'); // Add admin flag
                
                // Handle remember me functionality
                if (rememberMe) {
                    localStorage.setItem('admin_remembered_email', inputs.email);
                } else {
                    localStorage.removeItem('admin_remembered_email');
                }
                
                // Set session timeout (30 minutes)
                const expiryTime = new Date().getTime() + (30 * 60 * 1000);
                localStorage.setItem('adminSessionExpiry', expiryTime.toString());
                
                // Verify localStorage values were set correctly
                console.log('Verifying localStorage values:');
                console.log('addisnest_token:', localStorage.getItem('addisnest_token'));
                console.log('isLogin:', localStorage.getItem('isLogin'));
                console.log('userId:', localStorage.getItem('userId'));
                console.log('isAdmin:', localStorage.getItem('isAdmin'));
                console.log('adminSessionExpiry:', localStorage.getItem('adminSessionExpiry'));
                
                // Manually update Redux state with the user data
                dispatch(login(responseData));
                setLoading(false);
                
                // Redirect to admin dashboard
                navigate('/admin/dashboard');
                toast.success("Admin Login Successful");

            } catch (error) {
                console.error('❌ Admin Login Error:', error);
                setLoading(false);
                
                // Display user-friendly error messages
                if (error.response) {
                    const { status, data } = error.response;
                    
                    if (status === 401) {
                        if (data?.message?.toLowerCase().includes('password')) {
                            setLoginError('Incorrect password. Please try again.');
                        } else if (data?.message?.toLowerCase().includes('not found') || 
                                  data?.message?.toLowerCase().includes('not registered')) {
                            setLoginError('This email is not registered. Please check your email.');
                        } else if (data?.message?.toLowerCase().includes('access denied') ||
                                  data?.message?.toLowerCase().includes('not authorized') ||
                                  data?.message?.toLowerCase().includes('not admin')) {
                            setLoginError('Access denied. This account does not have administrator privileges.');
                        } else {
                            setLoginError('Invalid email or password. Please check your credentials.');
                        }
                    } else if (status === 403) {
                        setLoginError('Access denied. This account does not have administrator privileges.');
                    } else if (status === 404) {
                        setLoginError('Account not found. Please check your email.');
                    } else if (status >= 500) {
                        setLoginError('Server error. Please try again in a few moments.');
                    } else {
                        setLoginError(data?.message || `Server error (${status}). Please try again.`);
                    }
                } else if (error?.code === 'NETWORK_ERROR' || error?.message === 'Network Error') {
                    setLoginError('Network connection failed. Please check your internet connection and try again.');
                } else if (!navigator.onLine) {
                    setLoginError('You appear to be offline. Please check your internet connection.');
                } else {
                    setLoginError(error?.message || 'Network error. Please check your connection and try again.');
                }
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAdminLogin();
        }
    };
    
    return (
        <div className="auth-wrapper">
            <div className="auth-wrapper-inner">
                <div className="auth-flex">
                    <div className="auth-flex-50">
                        <div className="auth-main">
                            <div className="auth-card" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.1)', borderRadius: '12px' }}>
                                <div className="auth-card-body">
                                    <div className="auth-card-body-inner">
                                        <div className="login-innerheading" style={{ textAlign: 'center', marginBottom: '30px' }}>
                                            <h3 style={{ color: '#2c3e50', fontWeight: '600', marginBottom: '8px' }}>Admin Login</h3>
                                            <p style={{ color: '#7f8c8d', fontSize: '0.95rem' }}>
                                                Administrator Access Only
                                            </p>
                                        </div>
                                        <div className="form-flex">
                                            <div className="form-flex-inner-100">
                                                <div className="single-input">
                                                    <label htmlFor="email" style={{ 
                                                        color: '#2c3e50', 
                                                        fontWeight: '500',
                                                        marginBottom: '8px'
                                                    }}>
                                                        Admin Email<span style={{ color: '#e74c3c' }}>*</span>
                                                    </label>
                                                    <input
                                                        type="email"
                                                        id="email"
                                                        name="email"
                                                        placeholder="Enter your administrator email"
                                                        onChange={onInputChanged}
                                                        value={inputs?.email}
                                                        className={`${error.errors?.email ? "alert-input" : ""}`}
                                                        style={{
                                                            borderRadius: '8px',
                                                            border: '2px solid #e1e8ed',
                                                            padding: '12px 16px',
                                                            fontSize: '16px',
                                                            transition: 'all 0.3s ease',
                                                            backgroundColor: '#f8f9fa',
                                                            width: '100%'
                                                        }}
                                                        onFocus={(e) => {
                                                            e.target.style.borderColor = '#667eea';
                                                            e.target.style.backgroundColor = '#ffffff';
                                                            e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                                        }}
                                                        onBlur={(e) => {
                                                            e.target.style.borderColor = '#e1e8ed';
                                                            e.target.style.backgroundColor = '#f8f9fa';
                                                            e.target.style.boxShadow = 'none';
                                                        }}
                                                    />
                                                    {error.errors?.email && (
                                                        <p className="error-input-msg" style={{
                                                            color: '#e74c3c',
                                                            fontSize: '0.85rem',
                                                            marginTop: '5px'
                                                        }}>
                                                            {error.errors?.email}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="form-flex-inner-100">
                                                <div className="single-input">
                                                    <label htmlFor="password" style={{ 
                                                        color: '#2c3e50', 
                                                        fontWeight: '500',
                                                        marginBottom: '8px'
                                                    }}>
                                                        Password<span style={{ color: '#e74c3c' }}>*</span>
                                                    </label>
                                                    <div className="password-inputs" style={{ position: 'relative' }}>
                                                        <input
                                                            type={isPasswordVisible ? "text" : "password"}
                                                            id="password"
                                                            placeholder="Enter your administrator password"
                                                            name="password"
                                                            onChange={onInputChanged}
                                                            onKeyDown={handleKeyDown}
                                                            value={inputs?.password}
                                                            className={`${error.errors?.password ? "alert-input" : ""}`}
                                                            style={{
                                                                borderRadius: '8px',
                                                                border: '2px solid #e1e8ed',
                                                                padding: '12px 50px 12px 16px',
                                                                fontSize: '16px',
                                                                transition: 'all 0.3s ease',
                                                                backgroundColor: '#f8f9fa',
                                                                width: '100%'
                                                            }}
                                                            onFocus={(e) => {
                                                                e.target.style.borderColor = '#667eea';
                                                                e.target.style.backgroundColor = '#ffffff';
                                                                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                                            }}
                                                            onBlur={(e) => {
                                                                e.target.style.borderColor = '#e1e8ed';
                                                                e.target.style.backgroundColor = '#f8f9fa';
                                                                e.target.style.boxShadow = 'none';
                                                            }}
                                                        />
                                                        <div
                                                            className="pwd-icon"
                                                            onClick={togglePasswordVisibility}
                                                            style={{ 
                                                                cursor: "pointer",
                                                                position: 'absolute',
                                                                right: '15px',
                                                                top: '50%',
                                                                transform: 'translateY(-50%)',
                                                                color: '#667eea',
                                                                fontSize: '18px',
                                                                transition: 'color 0.3s ease'
                                                            }}
                                                        >
                                                            {isPasswordVisible ? "Hide" : "Show"}
                                                        </div>
                                                    </div>
                                                    {error.errors?.password && (
                                                        <p className="error-input-msg" style={{
                                                            color: '#e74c3c',
                                                            fontSize: '0.85rem',
                                                            marginTop: '5px'
                                                        }}>
                                                            {error.errors?.password}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            {/* Remember Me Checkbox */}
                                            <div className="form-flex-inner-100" style={{ marginTop: '15px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <input
                                                        type="checkbox"
                                                        id="rememberMe"
                                                        checked={rememberMe}
                                                        onChange={handleRememberMeChange}
                                                        style={{
                                                            marginRight: '10px',
                                                            transform: 'scale(1.2)',
                                                            accentColor: '#667eea'
                                                        }}
                                                    />
                                                    <label htmlFor="rememberMe" style={{
                                                        color: '#5a6c7d',
                                                        fontSize: '0.9rem',
                                                        cursor: 'pointer',
                                                        userSelect: 'none'
                                                    }}>
                                                        Remember my email for next time
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {loginError && (
                                            <div className="login-error-message" style={{
                                                padding: '15px 20px',
                                                marginBottom: '20px',
                                                marginTop: '20px',
                                                background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
                                                border: '1px solid #ef5350',
                                                borderRadius: '10px',
                                                color: '#c62828',
                                                fontSize: '0.95rem',
                                                textAlign: 'center',
                                                boxShadow: '0 4px 12px rgba(239, 83, 80, 0.15)'
                                            }}>
                                                <p style={{ margin: '0' }}>
                                                    <span style={{ fontWeight: '500' }}>{loginError}</span>
                                                </p>
                                            </div>
                                        )}
                                        
                                        <div className="auth-btn" style={{ marginTop: '25px' }}>
                                            <button 
                                                onClick={handleAdminLogin} 
                                                disabled={loading || !inputs.email || !inputs.password}
                                                style={{
                                                    background: loading || !inputs.email || !inputs.password 
                                                        ? 'linear-gradient(135deg, #bdc3c7 0%, #95a5a6 100%)'
                                                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                    border: 'none',
                                                    borderRadius: '10px',
                                                    padding: '15px 30px',
                                                    color: 'white',
                                                    fontSize: '16px',
                                                    fontWeight: '600',
                                                    cursor: loading || !inputs.email || !inputs.password ? 'not-allowed' : 'pointer',
                                                    width: '100%',
                                                    transition: 'all 0.3s ease',
                                                    boxShadow: loading || !inputs.email || !inputs.password 
                                                        ? 'none' 
                                                        : '0 4px 15px rgba(102, 126, 234, 0.4)',
                                                    transform: loading ? 'scale(0.98)' : 'scale(1)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    minHeight: '50px'
                                                }}
                                            >
                                                {loading ? "Authenticating..." : "Secure Admin Login"}
                                            </button>
                                        </div>
                                        
                                        <div className="auth-btm" style={{ marginTop: '25px', textAlign: 'center' }}>
                                            <div style={{
                                                padding: '15px',
                                                background: '#f8f9fa',
                                                borderRadius: '8px',
                                                marginBottom: '15px'
                                            }}>
                                                <p style={{ 
                                                    margin: '0', 
                                                    color: '#6c757d', 
                                                    fontSize: '0.85rem',
                                                    lineHeight: '1.4'
                                                }}>
                                                    This is a secure administrator portal. Only authorized personnel should access this area.
                                                </p>
                                            </div>
                                            <p style={{ margin: '0' }}>
                                                <Link 
                                                    to='/login'
                                                    style={{
                                                        color: '#667eea',
                                                        textDecoration: 'none',
                                                        fontWeight: '500',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        padding: '8px 16px',
                                                        borderRadius: '6px',
                                                        transition: 'all 0.3s ease',
                                                        border: '1px solid #667eea'
                                                    }}
                                                >
                                                    Return to Regular Login
                                                </Link>
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
                                    <div className="auth-heading-content" style={{ textAlign: 'center', marginBottom: '30px' }}>
                                        <h3 style={{ 
                                            color: 'white', 
                                            fontSize: '28px', 
                                            fontWeight: '700',
                                            marginBottom: '15px',
                                            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                                        }}>
                                            Administrator Portal
                                        </h3>
                                        <p style={{ 
                                            color: 'rgba(255,255,255,0.9)', 
                                            fontSize: '16px',
                                            lineHeight: '1.6',
                                            textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                                        }}>
                                            Secure access for authorized administrators only.
                                            <br />
                                            Manage users, properties, and system settings with confidence.
                                        </p>
                                        
                                        {/* Feature highlights */}
                                        <div style={{ marginTop: '30px' }}>
                                            <div style={{
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(2, 1fr)',
                                                gap: '15px',
                                                textAlign: 'left'
                                            }}>
                                                <div style={{
                                                    background: 'rgba(255,255,255,0.1)',
                                                    padding: '15px',
                                                    borderRadius: '8px',
                                                    backdropFilter: 'blur(10px)'
                                                }}>
                                                    <h4 style={{ color: 'white', fontSize: '14px', margin: '0 0 5px 0' }}>User Management</h4>
                                                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', margin: '0' }}>Manage user accounts</p>
                                                </div>
                                                <div style={{
                                                    background: 'rgba(255,255,255,0.1)',
                                                    padding: '15px',
                                                    borderRadius: '8px',
                                                    backdropFilter: 'blur(10px)'
                                                }}>
                                                    <h4 style={{ color: 'white', fontSize: '14px', margin: '0 0 5px 0' }}>Property Control</h4>
                                                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', margin: '0' }}>Approve & manage listings</p>
                                                </div>
                                                <div style={{
                                                    background: 'rgba(255,255,255,0.1)',
                                                    padding: '15px',
                                                    borderRadius: '8px',
                                                    backdropFilter: 'blur(10px)'
                                                }}>
                                                    <h4 style={{ color: 'white', fontSize: '14px', margin: '0 0 5px 0' }}>Analytics</h4>
                                                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', margin: '0' }}>View system metrics</p>
                                                </div>
                                                <div style={{
                                                    background: 'rgba(255,255,255,0.1)',
                                                    padding: '15px',
                                                    borderRadius: '8px',
                                                    backdropFilter: 'blur(10px)'
                                                }}>
                                                    <h4 style={{ color: 'white', fontSize: '14px', margin: '0 0 5px 0' }}>Security</h4>
                                                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', margin: '0' }}>System security controls</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;
