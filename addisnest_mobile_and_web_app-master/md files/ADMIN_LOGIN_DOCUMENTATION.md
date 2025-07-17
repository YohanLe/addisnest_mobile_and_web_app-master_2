# Admin Login System Documentation

This document provides information about the admin login system implemented for the Addisnest platform.

## Overview

The admin login system provides a secure way for administrators to access the admin dashboard and perform administrative tasks. It includes:

1. A dedicated admin login page
2. Backend authentication with role verification
3. Session management with timeout
4. Protected admin routes

## Admin Credentials

The default admin credentials are:

- **Email**: admin@addisnest.com
- **Password**: Admin@123

> **NOTE**: Based on the login screen, you may also try:
> - **Email**: admin@addisnest.com
> - **Password**: Admin@123

> **IMPORTANT**: For security reasons, please change these credentials after the first login.

### Admin User Setup

The system is configured with hardcoded admin credentials for immediate use. You can log in directly with the default credentials without needing to run any additional setup scripts.

For production environments, you may want to create a permanent admin user in the database. To do this, run one of the following scripts depending on your operating system:

**Windows:**
```
seed-admin-user.bat
```

**macOS/Linux:**
```
chmod +x seed-admin-user.sh
./seed-admin-user.sh
```

This will create an admin user with the default credentials in the database if it doesn't exist, or update the password if the user already exists.

## Features

### Secure Authentication

- Separate admin login endpoint with role verification
- JWT token-based authentication
- Password encryption using bcrypt

### Session Management

- 30-minute session timeout
- Automatic session extension on activity
- Secure session storage

### Protected Routes

- All admin routes are protected and require admin authentication
- Unauthorized users are redirected to the admin login page
- Role-based access control

## How to Use

### Accessing the Admin Panel

1. Navigate to `/admin/login` in your browser
2. Enter your admin credentials
3. Upon successful login, you'll be redirected to the admin dashboard

### Session Management

- Your session will automatically expire after 30 minutes of inactivity
- The session is automatically extended when you interact with the admin panel
- You can manually log out by clicking the "Logout" button in the sidebar

### Changing Admin Password

1. Log in to the admin panel
2. Navigate to the user management section
3. Find your admin user and click "Edit"
4. Update your password and save changes

## Security Considerations

- Admin credentials should be kept secure and not shared
- Regular password changes are recommended
- The system logs all admin login attempts for security auditing
- Failed login attempts are rate-limited to prevent brute force attacks

## Troubleshooting

### Common Issues

1. **"Access denied" error**: Ensure you're using an account with admin privileges
2. **Session expired**: Your session may have timed out; log in again
3. **Cannot access admin routes**: Clear browser cache and cookies, then try again

### Password Recovery

If you've forgotten your admin password:

1. Contact the system administrator
2. Use the database management tools to reset the admin password
3. Log in with the new credentials

## Technical Implementation

The admin login system consists of:

1. Frontend components:
   - `AdminLoginPage.jsx`: Dedicated login page for admins
   - `AdminLayout.jsx`: Layout wrapper with authentication checks
   - `AdminSidebar.jsx`: Navigation sidebar with logout functionality
   - `adminUtils.js`: Utility functions for admin authentication

2. Backend components:
   - `userController.js`: Contains the `adminLogin` method for authentication
   - `authRoutes.js`: Defines the `/admin-login` endpoint
   - `auth.js`: Middleware for protecting routes

3. Redux integration:
   - Uses the existing authentication slice
   - Stores admin-specific flags in localStorage

## Future Enhancements

Planned improvements for the admin authentication system:

1. Two-factor authentication
2. IP-based access restrictions
3. Enhanced audit logging
4. Role-based permissions within admin accounts
