import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    SvgMake1Icon as SvgAccountIcon,
    SvgLogOutIcon,
    SvgPasswordIcon,
    SvgReviewRatingIcon,
    SvgMake2Icon as SvgDashboardIcon,
    SvgLocationIcon as SvgPropertyAlertIcon,
    SvgRightIcon as SvgMessagesIcon,
    SvgMake3Icon as SvgContactIcon
} from "../../../assets/svg-files/SvgFiles";
import MyProfileTab from "./account-tab/MyProfileTab";
import PasswordTab from "./account-tab/PasswordTab";
import ReviewAndRatingTab from "./account-tab/ReviewAndRatingTab";
import Dashboard from "./account-tab/Dashboard";
import Messages from "./account-tab/Messages";
import PropertyAlert from "./account-tab/PropertyAlert";
import ContactUs from "./account-tab/ContactUs";
import AgentInfo from "./account-tab/AgentInfo";
import LogOutPopup from "../../../helper/LogOutPopup";
import "./account-management.css";

const AccountMain = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(0);
    // Sample agent info - in a real app, this would come from authentication context or API
    const agentInfo = {
        name: "agent",
        email: "agent121@gmail.com"
    };

    useEffect(() => {
        // Check if we need to redirect to my-property-listings
        if (location.state?.fromPromotion && location.state?.redirectToMyListings) {
            console.log("Detected redirect to my listings from promotion page");
            
            // Instead of just setting active tab, redirect to the my-property-listings page
            navigate('/my-property-listings', { 
                state: { 
                    fromPromotion: true,
                    propertyData: location.state?.propertyData
                },
                replace: true // Replace the current entry in history to prevent back navigation issues
            });
        }
        
        // Check if we need to show the property alert tab
        if (location.state?.showPropertyAlert) {
            console.log("Setting active tab to Property Alert");
            setActiveTab(2); // Index 2 is the "Listed Property Alert" tab
        }
    }, [location.state, navigate]);
    
    const tabs = [
        {
            title: "Dashboard",
            ProfileIcon: <SvgDashboardIcon />,
            content: <Dashboard />,
        },
        {
            title: "Messages",
            ProfileIcon: <SvgMessagesIcon />,
            content: <Messages />,
        },
        {
            title: "Listed Property Alert",
            ProfileIcon: <SvgPropertyAlertIcon />,
            content: <PropertyAlert />,
        },
        {
            title: "Contact Us",
            ProfileIcon: <SvgContactIcon />,
            content: <ContactUs />,
        },
        {
            title: "My profile",
            ProfileIcon: <SvgAccountIcon />,
            content: <MyProfileTab />,
        },
        {
            ProfileIcon: <SvgPasswordIcon />,
            title: "Change password",
            content: <PasswordTab />,
        },
        {
            ProfileIcon: <SvgReviewRatingIcon />,
            title: "Review & Ratings",
            content: <ReviewAndRatingTab />,
        },
    ];
    const [showLogOutPopup, setLogOutPopup] = useState(false);
    const handleLogOutPopupToggle = () => {
        setLogOutPopup((prev) => !prev);
    };
    return (
        <>
            <section className="account-management">
                {/* Sidebar */}
                <div className="account-sidebar">
                    <h3 className="sidebar-title">Account management</h3>
                    <div className="account-list">
                        <ul>
                            {tabs.map((tab, index) => (
                                <li key={index} onClick={() => setActiveTab(index)}>
                                    <div
                                        className={`account-tab-title ${index == activeTab ? "active" : ""}`}
                                        data-tab={
                                            index === 0 ? "dashboard" : 
                                            index === 2 ? "property-alert" : 
                                            index === 3 ? "contact-us" : 
                                            index === 6 ? "reviews" : ""
                                        }
                                    >
                                        <em>{tab.ProfileIcon}</em>
                                        <span className="tab-title">{tab.title}</span>
                                    </div>
                                </li>
                            ))}
                            <li>
                                <div
                                    className="account-tab-title"
                                    onClick={handleLogOutPopupToggle}
                                >
                                    <em>
                                        <SvgLogOutIcon />
                                    </em>
                                    <span className="tab-title">Logout</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                    {/* Agent info at bottom of sidebar */}
                    <div className="sidebar-agent-info">
                        <div className="agent-avatar">
                            {agentInfo.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="agent-details">
                            <p className="agent-name">{agentInfo.name}</p>
                            <p className="agent-email">{agentInfo.email}</p>
                        </div>
                    </div>
                </div>
                
                {/* Content Area */}
                <div className="account-content">
                    <div className="account-tab-detail">
                        <div className="account-tab-list">
                            {tabs[activeTab].content}
                        </div>
                    </div>
                </div>
            </section>
            {showLogOutPopup && <LogOutPopup handlePopup={handleLogOutPopupToggle} />}
        </>
    );
};

export default AccountMain;
