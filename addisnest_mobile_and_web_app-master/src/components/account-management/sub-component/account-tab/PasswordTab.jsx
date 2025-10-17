import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../../../../Apis/Api";
import { logout } from "../../../../Redux-store/Slices/AuthSlice";
import { ValidateChangePassword } from "../../../../utils/Validation";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
const PasswordTab = () => {
    const dispatch = useDispatch();
   
    const [isOldPasswordVisible, setOldPasswordVisible] = useState(false);
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const navigate = useNavigate();
    const [error, setError] = useState({ isValid: false });
    const [Loading, setLoading] = useState(false);
    const togglePasswordVisibility = () => {
        setPasswordVisible(!isPasswordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!isConfirmPasswordVisible);
    };

    const toggleOldPasswordVisibility = () => {
        setOldPasswordVisible(!isOldPasswordVisible);
    };

    const [Inps, setInps] = useState({
        old_password: "",
        new_password: "",
        confirm_new_password: ""
    });

    const onInpChanged = (event) => {
        setError(p => {
            const obj = { ...p }
            obj?.errors && delete obj?.errors[event?.target?.name]
            return obj
        })
        setInps((prevInputs) => ({ ...prevInputs, [event.target.name]: event.target.value }));
    };

    const ChangePasswordFun = async () => {
        const errorMessage = ValidateChangePassword(Inps);
        setError(errorMessage);
        if (errorMessage.isValid == true) {
            let body = {
                current_password: Inps?.old_password,
                new_password: Inps?.new_password,
                confirm_password: Inps?.confirm_new_password
            }
            try {
                setLoading(true)
                const response = await Api.postWithtoken("auth/changePassword", body);
                let data = response;
                setLoading(false)
                dispatch(logout())
                navigate('/');
                localStorage.clear()
                toast.success(data.message);

            } catch (error) {
                setLoading(false)
                toast.error(error.message);
            }
        }
    };
    return (
        <div className="password-section">
            <div className="card-body">
                <div className="password-heading">
                    <h3>Change Password</h3>
                </div>
                <div className="form-flex">
                    <div className="form-inner-flex-100">
                        <div className="single-input">
                            <label for="">
                                Current Password<i>*</i>
                            </label>
                            <div className="password-inputs">
                                <input
                                    type={isOldPasswordVisible ? "text" : "password"}
                                    name="old_password"
                                    placeholder="Enter your full name"
                                    onChange={onInpChanged}
                                    value={Inps?.old_password}
                                    className={`${error.errors?.old_password ? "alert-input" : ""}`}
                                />
                                <div
                                    className="pwd-icon"
                                    onClick={toggleOldPasswordVisibility}
                                    style={{ cursor: "pointer" }}
                                >
                                    {isOldPasswordVisible ? (
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
                            {error.errors?.old_password && <p className="error-input-msg">{error.errors?.old_password}</p>}
                        </div>
                    </div>
                    <div className="form-inner-flex-50">
                        <div className="single-input">
                            <label>
                                New Password<i>*</i>
                            </label>
                            <div className="password-inputs">
                                <input
                                    type={isPasswordVisible ? "text" : "password"}
                                    placeholder="Enter Your Password"
                                    name="new_password"
                                    onChange={onInpChanged}
                                    value={Inps?.new_password}
                                    className={`${error.errors?.new_password ? "alert-input" : ""}`}
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
                            {error.errors?.new_password && <p className="error-input-msg">{error.errors?.new_password}</p>}
                        </div>
                    </div>
                    <div className="form-inner-flex-50">
                        <div className="single-input">
                            <label>
                                Confirm Password<i>*</i>
                            </label>
                            <div className="password-inputs">
                                <input
                                    type={isConfirmPasswordVisible ? "text" : "password"}
                                    placeholder="Enter Your Password"
                                    name="confirm_new_password"
                                    onChange={onInpChanged}
                                    value={Inps?.confirm_new_password}
                                    className={`${error.errors?.confirm_new_password ? "alert-input" : ""}`}
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
                            {error.errors?.confirm_new_password && <p className="error-input-msg">{error.errors?.confirm_new_password}</p>}
                        </div>
                    </div>
                </div>
                <div className="password-btn">
                    <button className="btn btn-secondary">Cancel</button>
                    <button onClick={ChangePasswordFun} className="btn btn-primary">Update Password</button>
                </div>
            </div>
        </div>
    );
};

export default PasswordTab;
