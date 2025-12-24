import React, { useEffect, useState } from "react";
import * as ordersApi from "../api/orders.api.js";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await ordersApi.getMyOrders();
      setOrders(res?.data || []);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div>Cargando Ordenes...</div>;
  if (!orders.length) return <div>Sin Ordenes todavia.</div>;

  return (
    <div className="bg-white border rounded p-6">
      <h1 className="text-xl font-semibold mb-4">Mis ordenes</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border rounded p-3">
            <div className="font-semibold">Order {order.ticket}</div>
            <div>Status: {order.status}</div>
            <div>Total: ${order.total}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
