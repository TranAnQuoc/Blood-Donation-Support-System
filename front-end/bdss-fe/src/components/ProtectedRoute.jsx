import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const userData = JSON.parse(localStorage.getItem('user')); // bạn có thể lấy từ redux nếu muốn
  const token = localStorage.getItem('token');

  if (!token || !userData) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userData.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
