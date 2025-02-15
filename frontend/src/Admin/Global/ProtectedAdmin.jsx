import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedAdmin = ({ element }) => {
  const { adminInfo } = useSelector((state) => state.adminAuth);
  console.log(adminInfo, "user");
  if (!adminInfo) {
    return <Navigate to="/admin/login" />;
  }

  return element; 
};

export default ProtectedAdmin;
