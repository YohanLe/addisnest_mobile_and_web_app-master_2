import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Api from "../../Apis/Api";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { AuthUserDetails, login } from "../../Redux-store/Slices/AuthSlice";
import { validateLogin } from "../../utils/Validation";
import { AuthImage } from "../../assets/images";

const SigninPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [redirectPath, setRedirectPath] = useState('/');
    
    // Check if there's a redirect path in the location state
    useEffect(() => {
        if (location.state?.from) {
            setRedirectPath(location.state.from);
            console.log('Redirect path set to:', location.state.from);
        }
    }, [location.state]);
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [Loading, setLoading] = useState(false);
    const [error, setError] = useState({ isValid: false });
    const [loginError, setLoginError] = useState("");
    const togglePasswordVisibility = () => {
        setPasswordVisible(!isPasswordVisible);
    };

    const [inps, setInps] = useState({
        email: '',
        password: "",
    })

    const onInpChanged = (event) => {
        setError(p => {
            const obj = { ...p }
            obj?.errors && delete obj?.errors[event?.target?.name]
            return obj
        })
        setInps((prevInputs) => ({ ...prevInputs, [event.target.name]: event.target.value }));
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

                console.log('🔐 Starting login process...');
                console.log('📧 Email:', inps.email);
                console.log('🌐 API Base URL:', import.meta.env.VITE_BASEURL);
                console.log('🔗 Full Login URL:', import.meta.env.VITE_BASEURL + 'auth/login');
                console.log('📱 Online Status:', navigator.onLine);

                setLoading(true);
                
                // Test network connectivity first
                if (!navigator.onLine) {
                    throw new Error('No internet connection detected. Please check your network settings.');
                }

                const response = await Api.post("auth/login", body);
                console.log('✅ Login successful:', response);
                
                localStorage.setItem('addisnest_token', response?.token);
                localStorage.setItem('isLogin', '1');
                localStorage.setItem("userId", response?._id);
                
                // Directly update Redux store with user data
                if (response?.user) {
                    dispatch(login(response.user));
                }
                
                dispatch(AuthUserDetails());
                setLoading(false);
                
                // Redirect to the specified path or home page
                if (redirectPath && redirectPath !== '/') {
                    // If we have a specific tab to activate, include it in the state
                    if (location.state?.activeTab) {
                        window.location.href = `${redirectPath}?activeTab=${location.state.activeTab}`;
                    } else {
                        window.location.href = redirectPath;
                    }
                } else {
                    // Default redirect to home page
                    window.location.href = '/';
                }
                toast.success("Login Successful");

            } catch (error) {
                console.error('❌ Login Error Details:', {
                    status: error?.response?.status,
                    statusText: error?.response?.statusText,
                    message: error?.message,
                    data: error?.response?.data,
                    code: error?.code,
                    name: error?.name
                });

                setLoading(false);
                
                // Display user-friendly error messages for different error scenarios
                if (error.response) {
                    const { status, data } = error.response;
                    
                    if (status === 401) {
                        if (data?.message?.toLowerCase().includes('password')) {
                            setLoginError('Incorrect password. Please try again.');
                        } else if (data?.message?.toLowerCase().includes('not found') || 
                                  data?.message?.toLowerCase().includes('not registered') ||
                                  data?.message?.toLowerCase().includes('email')) {
                            setLoginError('This email is not registered. Please check your email or sign up.');
                        } else {
                            setLoginError('Invalid email or password. Please check your credentials.');
                        }
                    } else if (status === 404) {
                        setLoginError('Account not found. Please check your email or create a new account.');
                    } else if (status === 403) {
                        setLoginError('Your account is locked. Please contact support for assistance.');
                    } else if (status === 429) {
                        setLoginError('Too many login attempts. Please try again later.');
                    } else if (status >= 500) {
                        setLoginError('Server error. Please try again in a few moments.');
                    } else {
                        setLoginError(data?.message || `Server error (${status}). Please try again.`);
                    }
                } else if (error?.code === 'NETWORK_ERROR' || error?.message === 'Network Error') {
                    setLoginError('Network connection failed. Please check your internet connection and try again.');
                } else if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
                    setLoginError('Connection timed out. Please check your internet connection and try again.');
                } else if (error?.name === 'TypeError' && error?.message?.includes('fetch')) {
                    setLoginError('Unable to connect to server. Please check if the server is running and try again.');
                } else if (!navigator.onLine) {
                    setLoginError('You appear to be offline. Please check your internet connection.');
                } else {
                    // Generic error handling
                    setLoginError(error?.message || 'Network error. Please check your connection and try again.');
                }
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
            <div className="auth-wrapper">
                <div className="auth-wrapper-inner">
                    <div className="auth-flex">
                        <div className="auth-flex-50">
                            <div className="auth-main">
                                <div className="auth-card">
                                    <div className="auth-card-body">
                                        <div className="auth-card-body-inner">
                                            <div className="login-innerheading">
                                                <h3>Login</h3>
                                                <p>Welcome to Addisnest </p>
                                            </div>
                                            <div className="form-flex">
                                                <div className="form-flex-inner-100">
                                                    <div className="single-input">
                                                        <label htmlFor="">
                                                            Email<i>*</i>
                                                        </label>
                                                        <input
                                                            type="email"
                                                            name="email"
                                                            placeholder="Enter Your Email ID"
                                                            onChange={onInpChanged}
                                                            value={inps?.email}
                                                            className={`${error.errors?.email ? "alert-input" : ""}`}
                                                        />
                                                        {error.errors?.email && <p className="error-input-msg">{error.errors?.email}</p>}
                                                    </div>
                                                </div>
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
                                                                value={inps?.password}
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
                                            <div className="frgot-btn">
                                                <Link to="/forgot-password">Forgot Password?</Link>
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
                                                <button onClick={Loginfun} className="btn btn-primary">
                                                    {Loading ? "Processing..." : "Login"}
                                                </button>
                                            </div>
                                            <div className="auth-btm">
                                                <p>
                                                    Don't have an Account?
                                                    <Link to='/sign-up'>
                                                        Register
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

export default SigninPage;
