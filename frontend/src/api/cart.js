import apiClient from "./client";

export const getCart = async () => {
  const res = await apiClient.get("/api/cart");
  return res.data; // { success, data: cart }
};

export const addToCart = async (productId, quantity = 1) => {
  const res = await apiClient.post("/api/cart/add", { productId, quantity });
  return res.data; // { success, data: cart }
};

export const updateCartItem = async (productId, quantity) => {
  const res = await apiClient.put(`/api/cart/item/${productId}`, { quantity });
  return res.data;
};

export const removeCartItem = async (productId) => {
  const res = await apiClient.delete(`/api/cart/item/${productId}`);
  return res.data;
};

export const clearCart = async () => {
  const res = await apiClient.post("/api/cart/clear");
  return res.data;
};
