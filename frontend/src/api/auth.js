import apiClient from "./client.js";

export const registerRequest = async (data) => {
    const res = await apiClient.post("/api/auth/register", data);
    return res.data;
};

export const loginRequest = async (data) => {
    const res = await apiClient.post("/api/auth/login", data);
    return res.data;
};

export const getMeRequest = async () => {
    const res = await apiClient.get("/api/auth/me");
    return res.data;
};

