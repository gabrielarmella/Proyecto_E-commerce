import api from "./client.js";

// LISTA admin
export const getAdminProducts = async (params = {}) => {
    const res = await api.get("/api/admin/products", { params });
    return res.data; // {success, data, pagination}
};

// DETALLE
export const getProductById = async (id) => {
    const res = await api.get(`/api/admin/products/${id}`);
    return res.data; // { success, data }
};

// EDITAR
export const updateProduct = async (id, payload) => {
    const res = await api.put(`/api/admin/products/${id}`, payload);
    return res.data; // { success, data }
};

// CREAR
export const createProduct = async (payload) => {
    const res = await api.post("/api/products", payload);
    return res.data; // { success, data: product }
};


