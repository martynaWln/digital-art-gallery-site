import React, { createContext, useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const logoutTimer = useRef(null); 

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
        startAutoLogout(); 
      } catch {
        setUser(null);
      }
    }
  }, []);

  const startAutoLogout = () => {
  
    if (logoutTimer.current) {
      clearTimeout(logoutTimer.current);
    }

 
    logoutTimer.current = setTimeout(() => {
      logout();
    }, 30 * 60 * 1000); 
  };

  const login = (token) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    setUser(decoded);
    startAutoLogout(); 
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    if (logoutTimer.current) {
      clearTimeout(logoutTimer.current);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
