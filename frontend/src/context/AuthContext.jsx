import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as authApi from "../api/auth.api.js";
import { extractErrorMessage } from "../api/client.api.js";

const AuthContext = createContext(null);
const TOKEN_KEY = "token";

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(false);
  const [bootstrapping, setBootstrapping] = useState(true);
  const [error, setError] = useState(null);

  const persistToken = (value) => {
    if (value) {
      localStorage.setItem(TOKEN_KEY, value);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
    setToken(value || null);
  };

  const clearSession = () => {
    persistToken(null);
    setUser(null);
  };

  useEffect(() => {
    const bootstrap = async () => {
      const stored = localStorage.getItem(TOKEN_KEY);
      if (!stored) {
        setBootstrapping(false);
        return;
      }
      persistToken(stored);
      try {
        const res = await authApi.me();
        if (res?.success) {
          setUser(res.data);
        } else {
          clearSession();
          navigate("/login", { replace: true });
        }
      } catch {
        clearSession();
        navigate("/login", { replace: true });
      } finally {
        setBootstrapping(false);
      }
    };
    bootstrap();
  }, [navigate]);

  const login = async ({ email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.login({ email, password });
      if (!res?.success) throw new Error(res?.error?.message || "Login failed");
      persistToken(res.data.token);
      setUser(res.data.user);
      navigate("/products", { replace: true });
      return res.data;
    } catch (err) {
      setError(extractErrorMessage(err, "Login failed"));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ name, email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.register({ name, email, password });
      if (!res?.success) throw new Error(res?.error?.message || "Register failed");
      persistToken(res.data.token);
      setUser(res.data.user);
      navigate("/products", { replace: true });
      return res.data;
    } catch (err) {
      setError(extractErrorMessage(err, "Register failed"));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthToken = async (oauthToken) => {
    if (!oauthToken) {
      setError("Missing token");
      return false;
    }
    persistToken(oauthToken);
    try {
      const res = await authApi.me();
      if (res?.success) {
        setUser(res.data);
        return true;
      }
      clearSession();
      return false;
    } catch {
      clearSession();
      return false;
    }
  };

  const logout = () => {
    clearSession();
    navigate("/login", { replace: true });
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      bootstrapping,
      error,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === "admin",
      login,
      register,
      logout,
      handleOAuthToken,
      setError,
    }),
    [user, token, loading, bootstrapping, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
