import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ element }) => {
    
  const { userInfo } = useSelector((state) => state.userAuth);
   
   if (!userInfo) {
     return <Navigate to="/login" />;
   }
 
   return element; 
};

export default ProtectedRoute;
