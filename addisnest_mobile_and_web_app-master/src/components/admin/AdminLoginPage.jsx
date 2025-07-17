import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Api from "../../Apis/Api";
import axios from 'axios';
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { AuthUserDetails, login } from "../../Redux-store/Slices/AuthSlice";
import { validateLogin } from "../../utils/Validation";
import { AuthImage } from "../../assets/images";

const AdminLoginPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({ isValid: false });
    const [loginError, setLoginError] = useState("");
    
    // Check if user is already logged in as admin
    const authState = useSelector((state) => state.Authentication);
    const user = authState?.Details?.data || null;
    
    useEffect(() => {
        // If user is already logged in as admin, redirect to admin dashboard
        if (user && user.role === 'admin') {
            navigate('/admin/dashboard');
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
        setInputs((prevInputs) => ({ ...prevInputs, [event.target.name]: event.target.value }));
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
                
                // Use the regular login endpoint with axios directly
                // For development, hardcode the API base URL to ensure it works
                const API_BASE_URL = 'http://localhost:7000/api';
                
                const response = await axios.post(`${API_BASE_URL}/users/login`, body, {
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
                            <div className="auth-card">
                                <div className="auth-card-body">
                                    <div className="auth-card-body-inner">
                                        <div className="login-innerheading">
                                            <h3>Admin Login</h3>
                                            <p>Administrator Access Only</p>
                                        </div>
                                        <div className="form-flex">
                                            <div className="form-flex-inner-100">
                                                <div className="single-input">
                                                    <label htmlFor="email">
                                                        Email<i>*</i>
                                                    </label>
                                                    <input
                                                        type="email"
                                                        id="email"
                                                        name="email"
                                                        placeholder="Enter Admin Email"
                                                        onChange={onInputChanged}
                                                        value={inputs?.email}
                                                        className={`${error.errors?.email ? "alert-input" : ""}`}
                                                    />
                                                    {error.errors?.email && <p className="error-input-msg">{error.errors?.email}</p>}
                                                </div>
                                            </div>
                                            <div className="form-flex-inner-100">
                                                <div className="single-input">
                                                    <label htmlFor="password">
                                                        Password<i>*</i>
                                                    </label>
                                                    <div className="password-inputs">
                                                        <input
                                                            type={isPasswordVisible ? "text" : "password"}
                                                            id="password"
                                                            placeholder="Enter Admin Password"
                                                            name="password"
                                                            onChange={onInputChanged}
                                                            onKeyDown={handleKeyDown}
                                                            value={inputs?.password}
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
                                        </div>
                                        
                                        {loginError && (
                                            <div className="login-error-message" style={{
                                                padding: '10px 15px',
                                                marginBottom: '15px',
                                                marginTop: '15px',
                                                background: '#ffebee',
                                                border: '1px solid #ffcdd2',
                                                borderRadius: '4px',
                                                color: '#d32f2f',
                                                fontSize: '0.9rem',
                                                textAlign: 'center'
                                            }}>
                                                <p style={{ margin: '0' }}>
                                                    <i className="fa-solid fa-circle-exclamation" style={{ marginRight: '5px' }}></i>
                                                    {loginError}
                                                </p>
                                            </div>
                                        )}
                                        
                                        <div className="auth-btn">
                                            <button onClick={handleAdminLogin} className="btn btn-primary">
                                                {loading ? "Processing..." : "Admin Login"}
                                            </button>
                                        </div>
                                        
                                        <div className="auth-btm">
                                            <p>
                                                <Link to='/login'>
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
                                    <div className="auth-heading-content">
                                        <h3>
                                            Administrator Portal
                                        </h3>
                                        <p>
                                            Secure access for authorized administrators only.
                                            This portal provides tools to manage users, properties, and system settings.
                                        </p>
                                    </div>
                                    <div className="auth-description-image">
                                        <img src={AuthImage} alt="Admin Login" />
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
