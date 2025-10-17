import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import MyProfileTab from "./sub-component/account-tab/MyProfileTab";
import "./sub-component/account-management.css";
import { isAuthenticated } from "../../utils/tokenHandler";

const MyProfilePage = () => {
  const navigate = useNavigate();
  
  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: '/my-profile' } });
    }
  }, [navigate]);
  
  return (
    <>
      <div className="main-wrapper">
        <section className="account-management">
          {/* Page Header */}
          <div className="profile-page-header" style={{
            padding: "20px 0",
            marginBottom: "30px",
            borderBottom: "1px solid #eaeaea",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <div>
              <h1 style={{
                fontSize: "28px",
                fontWeight: "700",
                color: "#333",
                marginBottom: "8px"
              }}>My Profile</h1>
              <p style={{
                fontSize: "16px",
                color: "#666"
              }}>Manage your personal information and preferences</p>
            </div>
            <Link 
              to="/account-management" 
              style={{
                textDecoration: "none",
                color: "#4a6cf7",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                border: "1px solid #4a6cf7",
                borderRadius: "8px",
                transition: "all 0.2s ease"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#f0f4ff";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
              </svg>
              Back to Account
            </Link>
          </div>
          
          <div className="account-content" style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
            padding: "30px",
            maxWidth: "1000px",
            margin: "0 auto"
          }}>
            <div className="account-tab-detail">
              <div className="account-tab-list">
                <MyProfileTab />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default MyProfilePage;
