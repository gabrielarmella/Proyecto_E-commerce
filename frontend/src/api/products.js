import apiClient from "./client";

export const getProducts = async (params = {}) => {
    const res = await apiClient.get("/api/products", { params });
    return res.data; // {success, data, pagination}
};
