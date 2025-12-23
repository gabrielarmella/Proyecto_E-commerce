import { useEffect, useState } from "react";
import { getOrders } from "../api/orders.api";
import Loader from "../components/Loader";
import ErrorAlert from "../components/ErrorAlert";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await getOrders();
        setOrders(Array.isArray(res) ? res : res?.orders || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loader />;
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Órdenes</h1>
      <ErrorAlert message={error} />
      {orders.length === 0 ? (
        <p>No tienes órdenes todavía.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id || o._id} className="bg-white shadow rounded p-3">
              <div className="flex justify-between">
                <span>Orden: {o.id || o._id}</span>
                <span className="font-semibold">${o.total}</span>
              </div>
              <div className="text-sm text-gray-600">
                {o.items?.map((it) => (
                  <div key={it.productId || it.product}>
                    {it.quantity} x {it.name || it.product?.name}
                  </div>
                ))}
              </div>
              <div className="text-sm">Estado: {o.status}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
