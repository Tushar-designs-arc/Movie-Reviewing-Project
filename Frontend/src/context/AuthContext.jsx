/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

const storedUser = () => {
  try {
    return JSON.parse(window.localStorage.getItem("ott_user") || "null");
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(storedUser);
  const [token, setToken] = useState(() => window.localStorage.getItem("ott_token") || "");
  const [loading, setLoading] = useState(Boolean(token));

  const persistSession = useCallback((nextUser, nextToken) => {
    setUser(nextUser);
    setToken(nextToken);
    window.localStorage.setItem("ott_user", JSON.stringify(nextUser));
    window.localStorage.setItem("ott_token", nextToken);
  }, []);

  const clearSession = useCallback(() => {
    setUser(null);
    setToken("");
    window.localStorage.removeItem("ott_user");
    window.localStorage.removeItem("ott_token");
  }, []);

  useEffect(() => {
    const refreshUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get("/auth/me");
        setUser(data.user);
        window.localStorage.setItem("ott_user", JSON.stringify(data.user));
      } catch {
        clearSession();
      } finally {
        setLoading(false);
      }
    };

    refreshUser();
  }, [token, clearSession]);

  const login = useCallback(async (credentials) => {
    const { data } = await api.post("/auth/login", credentials);
    persistSession(data.user, data.token);
    return data.user;
  }, [persistSession]);

  const signup = useCallback(async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    persistSession(data.user, data.token);
    return data.user;
  }, [persistSession]);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(user && token),
      isAdmin: user?.role === "admin",
      login,
      signup,
      logout: clearSession,
    }),
    [user, token, loading, login, signup, clearSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
};
