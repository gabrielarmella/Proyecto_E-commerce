import api, { setToken, clearToken } from "./client.js";

export const login = async ({ email, password }) => {
  const res = await api.post("/auth/login", { email, password });
  if (res.token) setToken(res.token); // backend devuelve { token, user }
  return res;
};

export const register = (payload) => api.post("/auth/register", payload);
export const fetchMe = () => api.get("/auth/me");
export const logoutApi = () => {
  clearToken();
  return Promise.resolve();
};
