import apiClient from "./client.js";

export const checkoutRequest = async (payload) => {
  const res = await apiClient.post("/api/orders/checkout", payload);
  return res.data; // { success, data: order }
};

export const getMyOrdersRequest = async () => {
  const res = await apiClient.get("/api/orders/my");
  return res.data; // { success, data: [orders] }
};
