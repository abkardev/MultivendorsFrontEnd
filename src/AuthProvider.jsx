import React, { createContext, useContext, useEffect, useState } from "react";
import api, { setAuthToken } from "./api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token);
      api.get("/user/profile").then((r) => setUser(r.data.data)).catch(() => {});
    }
  }, []);

  async function login(credentials) {
    const res = await api.post("/user/login", credentials);
    const token = res.data.token || res.data.data?.token || res.data.data?.accessToken;
    if (token) {
      localStorage.setItem("token", token);
      setAuthToken(token);
      const profile = await api.get("/user/profile");
      setUser(profile.data.data);
    }
    return res;
  }

  async function register(payload) {
    const res = await api.post("/user/register", payload);
    return res;
  }

  function logout() {
    localStorage.removeItem("token");
    setAuthToken(null);
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, setUser, login, register, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
