
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth'; 

const ProtectedAdminRoute = ({ children }) => {
  const isAuthenticated = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;
