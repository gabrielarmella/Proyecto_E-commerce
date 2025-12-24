import client from "./client.api.js";

export const getCart = async () => {
  const { data } = await client.get("/api/cart");
  return data;
};

export const addItem = async (productId, quantity = 1) => {
  const { data } = await client.post("/api/cart/items", { productId, quantity });
  return data;
};

export const updateItem = async (productId, quantity) => {
  const { data } = await client.put(`/api/cart/items/${productId}`, { quantity });
  return data;
};

export const removeItem = async (productId) => {
  const { data } = await client.delete(`/api/cart/items/${productId}`);
  return data;
};

export const clearCart = async () => {
  const { data } = await client.post("/api/cart/clear");
  return data;
};
