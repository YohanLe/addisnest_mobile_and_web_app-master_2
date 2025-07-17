import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../Redux-store/Slices/AuthSlice";
import { useNavigate } from "react-router-dom";

const LogOutPopup = ({ handlePopup }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    handlePopup();
  };

  return (
    <>
      <div className="logout-popup-main">
        <div className="modal-overlay" onClick={handlePopup}></div>
        <div className="logout-popup-inner">
          <div className="logout-popup-content">
            <h3>Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className="logout-popup-btns">
              <button
                className="btn btn-outline-secondary"
                onClick={handlePopup}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LogOutPopup;
