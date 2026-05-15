import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Backend base URL
axios.defaults.baseURL = "http://localhost:3000";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is stored in localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("sensorUser");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      if (parsedUser.token) {
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${parsedUser.token}`;
      }
    }

    setLoading(false);
  }, []);

  // LOGIN
  const login = async (email, password) => {
    try {
      const response = await axios.post("/api/auth/login", {
        email,
        password,
      });

      const data = response.data;

      localStorage.setItem("sensorUser", JSON.stringify(data));

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${data.token}`;

      setUser(data);

      return data;
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      throw error;
    }
  };

  // REGISTER
  const register = async (name, email, password) => {
    try {
      const response = await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });

      const data = response.data;

      localStorage.setItem("sensorUser", JSON.stringify(data));

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${data.token}`;

      setUser(data);

      return data;
    } catch (error) {
      console.error("Register error:", error.response?.data || error.message);
      throw error;
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("sensorUser");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);