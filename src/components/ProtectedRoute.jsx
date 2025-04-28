import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [showRedirect, setShowRedirect] = useState(false);

  useEffect(() => {
    if (!user) {
      // toast.warn("You must be logged in to view this page");

      // Delay the redirect slightly so toast can render
      const timeout = setTimeout(() => {
        setShowRedirect(true);
      }, 80); 

      return () => clearTimeout(timeout);
    }
  }, [user]);

  if (!user && showRedirect) {
    return <Navigate to="/login" />;
  }

  if (!user) {
    return null; 
  }

  return children;
};

export default ProtectedRoute;
