import client from "./client.api.js";

export const login = async (payload) => {
  const { data } = await client.post("/api/auth/login", payload);
  return data;
};

export const register = async (payload) => {
  const { data } = await client.post("/api/auth/register", payload);
  return data;
};

export const me = async () => {
  const { data } = await client.get("/api/auth/me");
  return data;
};
