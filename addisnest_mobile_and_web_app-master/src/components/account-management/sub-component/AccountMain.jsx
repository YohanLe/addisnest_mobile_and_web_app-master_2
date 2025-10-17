import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { isAuthenticated } from "../../../utils/tokenHandler";
import {
    SvgMake1Icon as SvgAccountIcon,
    SvgLogOutIcon,
    SvgPasswordIcon,
    SvgLocationIcon as SvgPropertyAlertIcon,
    SvgRightIcon as SvgMessagesIcon
} from "../../../assets/svg-files/SvgFiles";
import MyProfileTab from "./account-tab/MyProfileTab";
import PasswordTab from "./account-tab/PasswordTab";
import Messages from "./account-tab/Messages";
// FIXED: Import the fixed PropertyAlert component
import PropertyAlert from "./account-tab/PropertyAlertFixed";
import AgentInfo from "./account-tab/AgentInfo";
import LogOutPopup from "../../../helper/LogOutPopup";
import "./account-management.css";
import "./mobile-account-management.css";

const AccountMain = () => {
    const location = useLocation();
    const navigate = useNavigate();
    // Set Messages tab (index 0) as the default active tab
    const [activeTab, setActiveTab] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [testModeEnabled, setTestModeEnabled] = useState(false);
    const [testModeCollapsed, setTestModeCollapsed] = useState(true);
    const [chartCollapsed, setChartCollapsed] = useState(false);
    
    // Check if user is authenticated
    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login', { state: { from: '/account-management' } });
        }
    }, [navigate]);
    
    // Sample agent info - in a real app, this would come from authentication context or API
    const agentInfo = {
        name: "agent",
        email: "agent121@gmail.com"
    };
    
    // Toggle sidebar for mobile
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };
    
    // Toggle test mode
    const toggleTestMode = () => {
        setTestModeEnabled(!testModeEnabled);
    };
    
    // Toggle test mode widget collapse
    const toggleTestModeWidget = () => {
        setTestModeCollapsed(!testModeCollapsed);
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
        
        // Check if activeTab is specified in location state
        if (location.state?.activeTab) {
            console.log("Active tab specified in navigation:", location.state.activeTab);
            
            // Map the tab name to the corresponding index
            if (location.state.activeTab === 'property-listings') {
                console.log("Setting active tab to Property Alert (property listings)");
                setActiveTab(1); // Index 1 is the "Listed Property Alert" tab
            } else if (location.state.activeTab === 'messages') {
                setActiveTab(0);
            } else if (location.state.activeTab === 'profile') {
                setActiveTab(2);
            } else if (location.state.activeTab === 'password') {
                setActiveTab(3);
            }
        }
        // Check if we need to show the property alert tab (for backward compatibility)
        else if (location.state?.showPropertyAlert) {
            console.log("Setting active tab to Property Alert");
            setActiveTab(1); // Index 1 is the "Listed Property Alert" tab
        }
    }, [location.state, navigate]);
    
    const tabs = [
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
            title: "My profile",
            ProfileIcon: <SvgAccountIcon />,
            content: <MyProfileTab />,
        },
        {
            ProfileIcon: <SvgPasswordIcon />,
            title: "Change password",
            content: <PasswordTab />,
        },
    ];
    const [showLogOutPopup, setLogOutPopup] = useState(false);
    const handleLogOutPopupToggle = () => {
        setLogOutPopup((prev) => !prev);
    };
    return (
        <>
            <section className="account-management">
                {/* Mobile Header - Hidden on desktop */}
                <div className="mobile-account-header desktop-hidden">
                    <button className="hamburger-menu" onClick={toggleSidebar}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 12H21" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M3 6H21" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M3 18H21" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                    <h1 className="mobile-header-title">Account Management</h1>
                    <div className="user-icon">
                        {agentInfo.name.charAt(0).toUpperCase()}
                    </div>
                </div>
                
                {/* Sidebar Overlay */}
                <div 
                    className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} 
                    onClick={toggleSidebar}
                ></div>
                
                {/* Sidebar */}
                <div className={`account-sidebar ${sidebarOpen ? 'open' : ''}`}>
                    <button className="sidebar-close" onClick={toggleSidebar}>×</button>
                    <div className="account-list">
                        <ul>
                            {tabs.map((tab, index) => (
                                <li key={index} onClick={() => {
                                    setActiveTab(index);
                                    setSidebarOpen(false);
                                }}>
                                    <div
                                        className={`account-tab-title ${index == activeTab ? "active" : ""}`}
                                        data-tab={
                                            index === 1 ? "property-alert" : ""
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
                
                {/* Test Mode Widget */}
                <div 
                    className={`test-mode-widget ${testModeCollapsed ? 'collapsed' : ''}`}
                    onClick={testModeCollapsed ? toggleTestModeWidget : null}
                >
                    <div className="test-mode-icon">🧪</div>
                    {!testModeCollapsed && (
                        <>
                            <span className="test-mode-label">Test Mode</span>
                            <label className="test-mode-toggle">
                                <input 
                                    type="checkbox" 
                                    checked={testModeEnabled}
                                    onChange={toggleTestMode}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </>
                    )}
                </div>
            </section>
            {showLogOutPopup && <LogOutPopup handlePopup={handleLogOutPopupToggle} />}
        </>
    );
};

export default AccountMain;
