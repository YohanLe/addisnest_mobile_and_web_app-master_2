import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AdminSidebar from './AdminSidebar';
import './admin.css';

// Session timeout duration in milliseconds (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000;

const AdminLayout = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  
  // Safely access Authentication state with fallback values
  const authState = useSelector((state) => state.Authentication);
  const user = authState?.Details?.data || null;
  const pending = authState?.Details?.pending || false;

  useEffect(() => {
    // Check if user is logged in and has admin role
    if (!pending) {
      // First check localStorage for token and admin flag
      const token = localStorage.getItem('addisnest_token');
      const isAdmin = localStorage.getItem('isAdmin');
      
      console.log('AdminLayout - Checking localStorage values:');
      console.log('addisnest_token:', token);
      console.log('isLogin:', localStorage.getItem('isLogin'));
      console.log('userId:', localStorage.getItem('userId'));
      console.log('isAdmin:', isAdmin);
      console.log('adminSessionExpiry:', localStorage.getItem('adminSessionExpiry'));
      
      if (!token || !isAdmin) {
        console.log('No admin token found in localStorage');
        navigate('/admin/login');
        return;
      }
      
      // If we have Redux user data, also verify it
      if (user && user.role !== 'admin') {
        console.log('Access denied: User is not an admin');
        navigate('/admin/login');
        return;
      }
      
      // Check for session timeout
      const checkSessionTimeout = () => {
        const expiryTime = localStorage.getItem('adminSessionExpiry');
        if (expiryTime) {
          const currentTime = new Date().getTime();
          if (currentTime > parseInt(expiryTime)) {
            // Session expired
            console.log('Admin session expired');
            localStorage.removeItem('adminSessionExpiry');
            navigate('/admin/login');
          } else {
            // Extend session on activity
            const newExpiryTime = new Date().getTime() + SESSION_TIMEOUT;
            localStorage.setItem('adminSessionExpiry', newExpiryTime.toString());
          }
        } else {
          // Set initial session timeout
          const newExpiryTime = new Date().getTime() + SESSION_TIMEOUT;
          localStorage.setItem('adminSessionExpiry', newExpiryTime.toString());
        }
      };
      
      // Check session timeout on mount
      checkSessionTimeout();
      
      // Set up interval to check session timeout
      const intervalId = setInterval(checkSessionTimeout, 60000); // Check every minute
      
      // Set up activity listeners to extend session
      const activityHandler = () => {
        const newExpiryTime = new Date().getTime() + SESSION_TIMEOUT;
        localStorage.setItem('adminSessionExpiry', newExpiryTime.toString());
      };
      
      window.addEventListener('click', activityHandler);
      window.addEventListener('keypress', activityHandler);
      window.addEventListener('scroll', activityHandler);
      window.addEventListener('mousemove', activityHandler);
      
      // Clean up
      return () => {
        clearInterval(intervalId);
        window.removeEventListener('click', activityHandler);
        window.removeEventListener('keypress', activityHandler);
        window.removeEventListener('scroll', activityHandler);
        window.removeEventListener('mousemove', activityHandler);
      };
    }
    
    console.log("AdminLayout mounted - User:", user);
  }, [user, pending, navigate]);

  if (pending) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Allow access if we have valid localStorage values, even if Redux state is not yet updated
  const token = localStorage.getItem('addisnest_token');
  const isAdmin = localStorage.getItem('isAdmin');
  
  if ((!user || user.role !== 'admin') && (!token || !isAdmin)) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-content-inner">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
