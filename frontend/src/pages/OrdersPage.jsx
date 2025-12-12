import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getMyOrdersRequest } from "../api/orders";

function OrdersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const load = async () => {
      try {
        const res = await getMyOrdersRequest();
        setOrders(res.data);
      } catch (err) {
        console.error("Error al cargar órdenes", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user, navigate]);

  if (!user) return null;

  if (loading) {
    return <p className="px-4 py-8 text-center text-slate-600">Cargando órdenes...</p>;
  }

  
  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
            <h1 className="text-2xl font-semibold text-slate-900 mb-2">
              Mis órdenes
            </h1>
            <p className="text-slate-600">
              Todavía no tenés órdenes registradas.
            </p>
          </div>
        </div>
      </div>
    );
  }

   return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
            Mis órdenes
          </h1>
          <p className="text-slate-600 mt-1">
            Revisá el historial de compras realizadas en la tienda.
          </p>
        </header>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                    Fecha
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                    Método de pago
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr
                    key={o._id}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="px-4 py-3 align-middle text-slate-900 font-mono text-xs md:text-sm">
                      {o._id}
                    </td>
                    <td className="px-4 py-3 align-middle text-slate-700">
                      {new Date(o.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 capitalize">
                        {o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-middle text-slate-700 capitalize">
                      {o.paymentMethod}
                    </td>
                    <td className="px-4 py-3 align-middle text-right text-slate-900 font-semibold">
                      $
                      {typeof o.total === "number"
                        ? o.total.toFixed(2)
                        : Number(o.total || 0).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrdersPage;