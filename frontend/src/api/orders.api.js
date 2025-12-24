import client from "./client.api.js";

export const checkout = async (payload) => {
  const { data } = await client.post("/api/orders/checkout", payload);
  return data;
};

export const getMyOrders = async () => {
  const { data } = await client.get("/api/orders/my");
  return data;
};
