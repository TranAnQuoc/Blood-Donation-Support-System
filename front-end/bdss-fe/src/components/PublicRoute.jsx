import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = ({ redirectPath = '/staff-dashboard', children }) => {
    const user = useSelector(state => state.user);
    const isLoggedIn = !!user?.token;

    if (isLoggedIn) {
        const userRole = user?.role;
        let actualRedirectPath = redirectPath;
        if (userRole === 'MEMBER') {
            actualRedirectPath = '/member';
        } else if (userRole === 'STAFF') {
            actualRedirectPath = '/staff-dashboard';
        } else if (userRole === 'ADMIN') {
            actualRedirectPath = '/admin-dashboard';
        }
        return <Navigate to={actualRedirectPath} replace />;
    }

    return children ? children : <Outlet />;
};

export default PublicRoute;
