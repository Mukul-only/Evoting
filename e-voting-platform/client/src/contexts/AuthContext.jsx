import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api"; // Axios instance

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Initial loading state

  useEffect(() => {
    const token = localStorage.getItem("evoting_token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      api
        .get("/auth/profile") // Your backend route to get user profile
        .then((response) => {
          setUser(response.data);
        })
        .catch(() => {
          localStorage.removeItem("evoting_token");
          delete api.defaults.headers.common["Authorization"];
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (aadhaarId, password) => {
    const response = await api.post("/auth/login", { aadhaarId, password });
    localStorage.setItem("evoting_token", response.data.token);
    api.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${response.data.token}`;
    setUser(response.data); // response.data should contain user info + token
    return response.data;
  };

  const register = async (userData) => {
    const response = await api.post("/auth/register", userData);
    localStorage.setItem("evoting_token", response.data.token);
    api.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${response.data.token}`;
    setUser(response.data);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("evoting_token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
