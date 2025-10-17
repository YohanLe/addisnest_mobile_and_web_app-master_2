import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { AuthUserDetails } from '../Redux-store/Slices/AuthSlice';
import Api, { checkAuthStatus }  from "../Apis/Api";

const ProtectedRoute = ({ children }) => {
    const dispatch = useDispatch();
    let location = useLocation();
    const [isChecking, setIsChecking] = useState(true);
    const [isAuth, setIsAuth] = useState(false);
    
    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Check authentication status
                const { isAuthenticated } = checkAuthStatus();
                
                if (isAuthenticated) {
                    // Dispatch to update Redux state with user details
                    await dispatch(AuthUserDetails());
                    setIsAuth(true);
                }
                
                setIsChecking(false);
            } catch (error) {
                console.error("Auth check failed:", error);
                setIsChecking(false);
            }
        };
        
        checkAuth();
    }, [dispatch]);
    
    // Show loading state while checking
    if (isChecking) {
        return <div>Checking authentication...</div>;
    }
    
    // Redirect to login if not authenticated
    if (!isAuth) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    // Render children if authenticated
    return children;
};

export default ProtectedRoute;
