/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getMeApi, loginApi, logoutApi, updateProfileApi } from "../api/auth";
import { isAdminUser } from "../constants/permissions";

const AuthContext = createContext(null);

const storedUser = () => {
  try {
    return JSON.parse(localStorage.getItem("ott_user") || "null");
  } catch {
    return null;
  }
};

export // Admin session state is shared at the root so layouts and route guards agree on authorization.
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(storedUser);
  const [loading, setLoading] = useState(true);

  const saveUser = useCallback((value) => {
    setUser(value);
    if (value) {
      localStorage.setItem("ott_user", JSON.stringify(value));
    } else {
      localStorage.removeItem("ott_user");
    }
  }, []);

  const refreshUser = useCallback(
    async (signal) => {
      try {
        const response = await getMeApi(signal);
        const userData = response?.data || response;
        saveUser(userData);
        return userData;
      } catch (error) {
        if (error.name === "CanceledError" || error.code === "ERR_CANCELED") {
          return null;
        }
        if (error.response?.status === 401) {
          saveUser(null);
        }
        return null;
      } finally {
        setLoading(false);
      }
    },
    [saveUser],
  );

  useEffect(() => {
    const handler = () => {
      saveUser(null);
      setLoading(false);
    };
    window.addEventListener("auth:logout", handler);
    return () => window.removeEventListener("auth:logout", handler);
  }, [saveUser]);

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const verifySession = async () => {
      try {
        const response = await getMeApi(controller.signal);
        const userData = response?.data || response;
        if (isMounted) saveUser(userData);
      } catch (error) {
        if (error.name === "CanceledError" || error.code === "ERR_CANCELED")
          return;
        if (error.response?.status === 401 && isMounted) {
          saveUser(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    verifySession();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [saveUser]);

  const login = useCallback(
    async (credentials) => {
      const response = await loginApi(credentials);
      const userData = response?.data || response;
      saveUser(userData);
      return userData;
    },
    [saveUser],
  );

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      // Ignore network errors on logout, proceed with clearing user session
    } finally {
      saveUser(null);
    }
  }, [saveUser]);

  const updateProfile = useCallback(
    async (payload) => {
      const response = await updateProfileApi(payload);
      const updatedUser = response?.data || response;
      saveUser(updatedUser);
      return updatedUser;
    },
    [saveUser],
  );

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      isAdmin: isAdminUser(user),
      login,
      logout,
      refreshUser,
      updateProfile,
    }),
    [user, loading, login, logout, refreshUser, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }
  return context;
};
