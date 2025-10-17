import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutAdmin } from '../../utils/adminUtils';
import { logout } from '../../Redux-store/Slices/AuthSlice';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Safely access Authentication state with fallback values
  const authState = useSelector((state) => state.Authentication);
  const user = authState?.Details?.data || null;
  
  const handleLogout = () => {
    // Clear admin session data
    logoutAdmin();
    
    // Update Redux state
    dispatch(logout());
    
    // Redirect to admin login
    navigate('/admin/login');
  };

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-header">
        <h2>HomeNest</h2>
        <p>Admin</p>
      </div>
      
      <div className="admin-user-info">
        <div className="admin-user-avatar">
          {user ? `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}` : 'AD'}
        </div>
        <div className="admin-user-details">
          <h4>{user ? `${user.firstName || ''} ${user.lastName || ''}` : 'Admin User'}</h4>
          <p>{user?.email || 'admin@example.com'}</p>
        </div>
      </div>
      
      <nav className="admin-nav">
        <ul>
          <li>
            <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
              <span className="admin-nav-icon">
                <i className="fa-solid fa-chart-line"></i>
              </span>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/listings" className={({ isActive }) => isActive ? 'active' : ''}>
              <span className="admin-nav-icon">
                <i className="fa-solid fa-building"></i>
              </span>
              Listings
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/users" className={({ isActive }) => isActive ? 'active' : ''}>
              <span className="admin-nav-icon">
                <i className="fa-solid fa-users"></i>
              </span>
              Users
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/partnership-requests" className={({ isActive }) => isActive ? 'active' : ''}>
              <span className="admin-nav-icon">
                <i className="fa-solid fa-handshake"></i>
              </span>
              Partnership Requests
            </NavLink>
          </li>
          <li>
            <NavLink to="/" className="back-to-site">
              <span className="admin-nav-icon">
                <i className="fa-solid fa-arrow-left"></i>
              </span>
              Back to Site
            </NavLink>
          </li>
          <li>
            <button onClick={handleLogout} className="admin-logout-btn">
              <span className="admin-nav-icon">
                <i className="fa-solid fa-sign-out-alt"></i>
              </span>
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
