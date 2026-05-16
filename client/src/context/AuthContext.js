import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import api from "../api/axious";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("sensorUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      if (parsedUser.token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${parsedUser.token}`;
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post("/api/auth/login", { email, password });
      const data = response.data;
      localStorage.setItem("sensorUser", JSON.stringify(data));
      api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      setUser(data);
      return data;
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await api.post("/api/auth/register", { name, email, password });
      const data = response.data;
      localStorage.setItem("sensorUser", JSON.stringify(data));
      api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      setUser(data);
      return data;
    } catch (error) {
      console.error("Register error:", error.response?.data || error.message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("sensorUser");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);