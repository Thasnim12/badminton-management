import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ element }) => {
    
  const user = useSelector((state) => state.userInfo);

  return user ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
