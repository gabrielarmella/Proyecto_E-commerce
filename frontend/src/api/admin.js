import api from "./client.js";

export const uploadProductImage = async (file) => {
    const fd = new FormData();
    fd.append("image", file);

    const res = await api.post("/api/upload/products", fd, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data; // { success, data: { imageUrl } }

};