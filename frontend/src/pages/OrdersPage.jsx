// src/pages/OrdersPage.jsx
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
    return <p style={{ padding: "1rem" }}>Cargando órdenes...</p>;
  }

  if (orders.length === 0) {
    return <p style={{ padding: "1rem" }}>Todavía no tenés órdenes.</p>;
  }

  return (
    <div style={{ padding: "1.5rem" }}>
      <h1>Mis órdenes</h1>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
        <thead>
          <tr>
            <th style={{ borderBottom: "1px solid #ddd" }}>ID</th>
            <th style={{ borderBottom: "1px solid #ddd" }}>Fecha</th>
            <th style={{ borderBottom: "1px solid #ddd" }}>Estado</th>
            <th style={{ borderBottom: "1px solid #ddd" }}>Método de pago</th>
            <th style={{ borderBottom: "1px solid #ddd" }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id}>
              <td style={{ padding: "0.5rem 0" }}>{o._id}</td>
              <td>{new Date(o.createdAt).toLocaleString()}</td>
              <td>{o.status}</td>
              <td>{o.paymentMethod}</td>
              <td>Total {o.total?.toFixed(2) ?? o.total?.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrdersPage;
