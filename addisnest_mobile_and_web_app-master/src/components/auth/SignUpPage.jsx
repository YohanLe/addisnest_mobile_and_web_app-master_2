import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Api from "../../Apis/Api";
import { toast } from "react-toastify";
import { validateRegister } from "../../utils/Validation";
import { AuthImage } from "../../assets/images";
import OtpPopup from "../../helper/OtpPopup";

const SignUpPage = () => {
    const navigate = useNavigate();
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [Loading, setLoading] = useState(false);
    const [error, setError] = useState({ isValid: false });
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [showOtpPopup, setShowOtpPopup] = useState(false);
    const [otpData, setOtpData] = useState(null);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!isPasswordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!isConfirmPasswordVisible);
    };

    const [userType, setUserType] = useState('CUSTOMER'); // Default to CUSTOMER
    const [inps, setInps] = useState({
        name: '',
        email: '',
        phone: '',
        password: "",
        confirm_password: "",
        // Agent-specific fields
        licenseNumber: '',
        agency: '',
        experience: '',
        specialization: []
    });

    const onInpChanged = (event) => {
        setError(p => {
            const obj = { ...p }
            obj?.errors && delete obj?.errors[event?.target?.name]
            return obj
        });
        setInps((prevInputs) => ({ ...prevInputs, [event.target.name]: event.target.value }));
    };

    const RegisterFun = async () => {
        if (!acceptTerms) {
            toast.error("Please accept the terms and conditions");
            return;
        }

        // Add agent-specific validation if needed
        if (userType === 'AGENT') {
            if (!inps.licenseNumber) {
                setError(prev => ({
                    ...prev,
                    errors: {
                        ...prev.errors,
                        licenseNumber: 'License number is required for agents'
                    }
                }));
                return;
            }
            
            if (!inps.experience) {
                setError(prev => ({
                    ...prev,
                    errors: {
                        ...prev.errors,
                        experience: 'Years of experience is required'
                    }
                }));
                return;
            }
            
            if (inps.specialization.length === 0) {
                setError(prev => ({
                    ...prev,
                    errors: {
                        ...prev.errors,
                        specialization: 'Please select at least one specialization'
                    }
                }));
                return;
            }
        }

        const errorMessage = validateRegister(inps);
        if (errorMessage.isValid == false) {
            setError(errorMessage);
        } else {
            try {
                // Split name into first and last name
                const nameParts = inps.name.split(' ');
                const firstName = nameParts[0] || '';
                const lastName = nameParts.slice(1).join(' ') || '';

                // Prepare OTP data first before sending the API request
                const tempOtpData = {
                    firstName: firstName,
                    lastName: lastName,
                    email: inps.email,
                    phone: inps.phone,
                    password: inps.password,
                    role: userType,
                    pagetype: 'register'
                };
                
                // Add agent-specific fields to OTP data if registering as agent
                if (userType === 'AGENT') {
                    tempOtpData.licenseNumber = inps.licenseNumber;
                    tempOtpData.agency = inps.agency;
                    tempOtpData.experience = inps.experience;
                    tempOtpData.specialization = inps.specialization;
                }
                
                // Set OTP data and show OTP popup immediately
                setOtpData(tempOtpData);
                setShowOtpPopup(true);

                // Then make the API request
                let body = {
                    firstName: firstName,
                    lastName: lastName,
                    email: inps.email,
                    phone: inps.phone,
                    password: inps.password,
                    role: userType
                };
                
                // Add agent-specific fields to request body if registering as agent
                if (userType === 'AGENT') {
                    body.licenseNumber = inps.licenseNumber;
                    body.agency = inps.agency;
                    body.experience = parseInt(inps.experience);
                    body.specialization = inps.specialization;
                }

                setLoading(true);
                const response = await Api.post("auth/register", body);
                const { data, message } = response;
                
                // Update OTP data with the server response
                setOtpData({
                    ...tempOtpData,
                    otp: data?.otp // For testing purposes
                });
                
                toast.success(message || "OTP sent to your email");
            } catch (error) {
                console.error('Registration Error:', error);
                
                // Even if there's an error, leave the OTP popup open so user can retry
                const { response } = error;
                let errorMessage = 'Registration failed. Please try again.';
                
                if (response) {
                    // Server responded with error
                    const { status, data } = response;
                    
                    if (status === 400) {
                        errorMessage = data?.message || 'Invalid registration data. Please check your inputs.';
                    } else if (status === 409) {
                        errorMessage = 'This email is already registered. Please use a different email or login.';
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
            RegisterFun();
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
                                                <h3>Create Account</h3>
                                                <p>Join Addisnest to find your perfect property</p>
                                            </div>
                                            <div className="form-flex">
                                                <div className="form-flex-inner-100">
                                                    <div className="single-input">
                                                        <label>Account Type<i>*</i></label>
                                                        <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
                                                            <label className="radio-container" style={{ display: 'flex', alignItems: 'center' }}>
                                                                <input
                                                                    type="radio"
                                                                    name="userType"
                                                                    value="CUSTOMER"
                                                                    checked={userType === 'CUSTOMER'}
                                                                    onChange={() => setUserType('CUSTOMER')}
                                                                    style={{ marginRight: '8px' }}
                                                                />
                                                                Customer
                                                            </label>
                                                            <label className="radio-container" style={{ display: 'flex', alignItems: 'center' }}>
                                                                <input
                                                                    type="radio"
                                                                    name="userType"
                                                                    value="AGENT"
                                                                    checked={userType === 'AGENT'}
                                                                    onChange={() => setUserType('AGENT')}
                                                                    style={{ marginRight: '8px' }}
                                                                />
                                                                Agent
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="form-flex-inner-100">
                                                    <div className="single-input">
                                                        <label htmlFor="">
                                                            Full Name<i>*</i>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="name"
                                                            placeholder="Enter your full name"
                                                            onChange={onInpChanged}
                                                            value={inps?.name}
                                                            className={`${error.errors?.name ? "alert-input" : ""}`}
                                                        />
                                                        {error.errors?.name && <p className="error-input-msg">{error.errors?.name}</p>}
                                                    </div>
                                                </div>
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
                                                            value={inps?.email}
                                                            className={`${error.errors?.email ? "alert-input" : ""}`}
                                                        />
                                                        {error.errors?.email && <p className="error-input-msg">{error.errors?.email}</p>}
                                                    </div>
                                                </div>
                                                <div className="form-flex-inner-100">
                                                    <div className="single-input">
                                                        <label htmlFor="">
                                                            Phone Number<i>*</i>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="phone"
                                                            placeholder="Enter your phone number"
                                                            onChange={onInpChanged}
                                                            value={inps?.phone}
                                                            className={`${error.errors?.phone ? "alert-input" : ""}`}
                                                        />
                                                        {error.errors?.phone && <p className="error-input-msg">{error.errors?.phone}</p>}
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
                                                                placeholder="Create a password"
                                                                name="password"
                                                                onChange={onInpChanged}
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
                                                <div className="form-flex-inner-100">
                                                    <div className="single-input">
                                                        <label>
                                                            Confirm Password<i>*</i>
                                                        </label>
                                                        <div className="password-inputs">
                                                            <input
                                                                type={isConfirmPasswordVisible ? "text" : "password"}
                                                                placeholder="Confirm your password"
                                                                name="confirm_password"
                                                                onChange={onInpChanged}
                                                                onKeyDown={handleKeyDown}
                                                                value={inps?.confirm_password}
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
                                                {/* Agent-specific fields - only show if AGENT is selected */}
                                                {userType === 'AGENT' && (
                                                    <>
                                                        <div className="form-flex-inner-100">
                                                            <div className="single-input">
                                                                <label>
                                                                    License Number<i>*</i>
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    name="licenseNumber"
                                                                    placeholder="Enter your real estate license number"
                                                                    onChange={onInpChanged}
                                                                    value={inps?.licenseNumber}
                                                                    className={`${error.errors?.licenseNumber ? "alert-input" : ""}`}
                                                                />
                                                                {error.errors?.licenseNumber && <p className="error-input-msg">{error.errors?.licenseNumber}</p>}
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="form-flex-inner-100">
                                                            <div className="single-input">
                                                                <label>
                                                                    Agency Name
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    name="agency"
                                                                    placeholder="Enter your agency name (if applicable)"
                                                                    onChange={onInpChanged}
                                                                    value={inps?.agency}
                                                                    className={`${error.errors?.agency ? "alert-input" : ""}`}
                                                                />
                                                                {error.errors?.agency && <p className="error-input-msg">{error.errors?.agency}</p>}
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="form-flex-inner-100">
                                                            <div className="single-input">
                                                                <label>
                                                                    Years of Experience<i>*</i>
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    name="experience"
                                                                    placeholder="Enter years of experience"
                                                                    onChange={onInpChanged}
                                                                    value={inps?.experience}
                                                                    min="0"
                                                                    className={`${error.errors?.experience ? "alert-input" : ""}`}
                                                                />
                                                                {error.errors?.experience && <p className="error-input-msg">{error.errors?.experience}</p>}
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="form-flex-inner-100">
                                                            <div className="single-input">
                                                                <label>
                                                                    Specialization<i>*</i>
                                                                </label>
                                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '10px' }}>
                                                                    {['residential', 'commercial', 'rental', 'land', 'luxury'].map(spec => (
                                                                        <label key={spec} style={{ display: 'flex', alignItems: 'center', textTransform: 'capitalize' }}>
                                                                            <input
                                                                                type="checkbox"
                                                                                name={spec}
                                                                                checked={inps.specialization.includes(spec)}
                                                                                onChange={() => {
                                                                                    const updatedSpecs = inps.specialization.includes(spec)
                                                                                        ? inps.specialization.filter(s => s !== spec)
                                                                                        : [...inps.specialization, spec];
                                                                                    setInps({ ...inps, specialization: updatedSpecs });
                                                                                }}
                                                                                style={{ marginRight: '8px' }}
                                                                            />
                                                                            {spec}
                                                                        </label>
                                                                    ))}
                                                                </div>
                                                                {error.errors?.specialization && <p className="error-input-msg">{error.errors?.specialization}</p>}
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                                
                                                <div className="form-flex-inner-100">
                                                    <div className="terms-condition">
                                                        <label className="checkbox-container">
                                                            <input
                                                                type="checkbox"
                                                                checked={acceptTerms}
                                                                onChange={() => setAcceptTerms(!acceptTerms)}
                                                            />
                                                            <span className="checkmark"></span>
                                                            I agree to the <Link to="#">Terms and Conditions</Link>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="auth-btn">
                                                <button onClick={RegisterFun} className="btn btn-primary">
                                                    {Loading ? "Processing..." : "Create Account"}
                                                </button>
                                            </div>
                                            <div className="auth-btm">
                                                <p>
                                                   Already have an Account?
                                                    <Link to="/login">
                                                        Login
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

export default SignUpPage;
