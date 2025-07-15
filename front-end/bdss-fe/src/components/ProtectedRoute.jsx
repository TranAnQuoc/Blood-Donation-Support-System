import React from 'react';
import { Navigate } from 'react-router-dom';
import { WebSocketProvider } from '../hooks/useWebSocket';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const userData = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  if (!token || !userData) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userData.role)) {
    return <Navigate to="/login" replace />;
  }

  if (userData.role === 'STAFF') {
    return <WebSocketProvider>{children}</WebSocketProvider>;
  }

  return children;
};

export default ProtectedRoute;
