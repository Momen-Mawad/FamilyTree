import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import axios from "axios";
import { URL } from "../config";

// Define the shape of our user object
interface User {
  email: string;
  familyId: string;
}

// Define the shape of our context state
interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  user: User | null; // Added the user property
  login: (token: string) => void; // Add a login function to the context
  logout: () => void; // Add a logout function to the context
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .post(`${URL}/verify_token`, { token })
        .then((response) => {
          if (response.data.valid) {
            login(token);
          } else {
            logout();
          }
        })
        .catch(() => {
          logout();
        });
    }
  }, []);

  const login = (token: string): void => {
    try {
      // Decode the JWT token to get user info
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const user = {
        email: decodedToken.userEmail,
        familyId: decodedToken.familyId,
      };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Failed to decode token", error);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsLoggedIn(false);
  };

  const contextValue = {
    isLoggedIn,
    setIsLoggedIn,
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Custom hook to easily use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
