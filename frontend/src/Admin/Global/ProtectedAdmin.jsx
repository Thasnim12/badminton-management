import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedAdmin = ({ element }) => {
    
  const user = useSelector((state) => state.adminAuth);

  return user ? element : <Navigate to="/admin/login" />
  
};

export default ProtectedAdmin;
