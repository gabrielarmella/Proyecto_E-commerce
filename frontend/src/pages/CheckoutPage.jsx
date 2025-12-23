import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkout } from "../api/orders.api";
import { useCart } from "../context/CartContext";
import Loader from "../components/Loader";
import ErrorAlert from "../components/ErrorAlert";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleCheckout = async () => {
    setLoading(true);
    setError("");
    setMsg("");
    try {
      await checkout({ medioPago: "mercadoPago" });
      await clearCart();
      setMsg("Orden creada correctamente");
      setTimeout(() => navigate("/orders"), 800);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!items.length) return <ErrorAlert message="Carrito vacío" />;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Checkout</h1>
      <ErrorAlert message={error} />
      {msg && <div className="text-green-600 mb-3">{msg}</div>}
      <div className="bg-white shadow rounded p-4 space-y-2">
        {items.map((it) => (
          <div key={it.productId || it.product?._id} className="flex justify-between">
            <span>{it.name || it.product?.name}</span>
            <span>
              {it.quantity} x ${(it.price || it.product?.price).toFixed(2)}
            </span>
          </div>
        ))}
        <div className="flex justify-between font-semibold border-t pt-2">
          <span>Total</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded mt-2 disabled:opacity-50"
        >
          {loading ? "Procesando..." : "Confirmar compra"}
        </button>
      </div>
    </div>
  );
}
