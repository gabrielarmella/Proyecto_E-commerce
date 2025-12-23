import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { login, register, fetchMe, logoutApi } from "../api/auth.api.js";
import { getToken, setToken, clearToken } from "../api/client.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(getToken());
  const [loading, setLoading] = useState(!!token);
  const [error, setError] = useState(null);

  const setTokenBoth = useCallback((t) => {
    setTokenState(t);
    if (t) setToken(t);
    else clearToken();
  }, []);

  const loadUser  = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const me = await fetchMe();
      setUser(me);
    } catch (err) {
      setUser(null);
      setTokenBoth(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, setTokenBoth]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const handleLogin = async (credentials) => {
    setError(null);
    const res = await login(credentials);
    setUser(res.user);
    setTokenBoth(res.token);
    return res.user;
  };

  const handleRegister = async (payload) => {
    setError(null);
    await register(payload);
  };

  const handleLogout = async () => {
    await logoutApi();
    setUser(null);
    setTokenBoth(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        isAuthenticated: !!user,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);