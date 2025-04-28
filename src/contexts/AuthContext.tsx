import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: string;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userRole: "",
  login: () => {},
  logout: () => {},
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Check if token exists and is valid on initial load
  useEffect(() => {
    const validateToken = () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsAuthenticated(false);
          setUserRole("");
          return false;
        }

        // Simple validation - in production you might want more checks
        const decoded: any = jwtDecode(token);

        // Check if token is expired
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          setIsAuthenticated(false);
          setUserRole("");
          return false;
        }

        setUserRole(decoded.role || "");
        setIsAuthenticated(true);
        return true;
      } catch (error) {
        console.error("Error validating token:", error);
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setUserRole("");
        return false;
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    try {
      const decoded: any = jwtDecode(token);
      setUserRole(decoded.role || "");
    } catch (error) {
      console.error("Error decoding token during login:", error);
    }
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUserRole("");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userRole, login, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
