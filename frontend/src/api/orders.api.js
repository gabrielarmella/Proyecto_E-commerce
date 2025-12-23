import api from "./client.js";

export const checkout = ({ mediosPago, direccionEnvio }) =>
  api.post("/orders/checkout", { mediosPago, direccionEnvio });

export const getOrders = () => api.get("/orders/my");