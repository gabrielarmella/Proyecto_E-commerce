// src/pages/CheckoutPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { checkoutRequest } from "../api/orders.js";

function CheckoutPage() {
  const { user } = useAuth();
  const { cart, loading: cartLoading, clearCart } = useCart();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("mercado_pago");
  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    city: "",
    province: "",
    zip: "",
    country: "Argentina",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // si no hay usuario, redirigir a login
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // si no hay carrito o está vacío, mandamos al carrito
  useEffect(() => {
    if (!cartLoading && (!cart || cart.items.length === 0)) {
      navigate("/cart");
    }
  }, [cart, cartLoading, navigate]);

  if (!user) return null; // mientras redirige

  if (cartLoading || !cart) {
    return <p style={{ padding: "1rem" }}>Cargando carrito...</p>;
  }

  const total = cart.items.reduce(
    (acc, it) => acc + it.quantity * (it.product.price || 0),
    0
  );

  const handleAddressChange = (e) => {
    setShippingAddress((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        paymentMethod,
        shippingAddress,
      };

      const res = await checkoutRequest(payload);
      console.log("ORDER CREATED =>", res);

      // vaciar carrito
      await clearCart();

      // redirigir a historial de órdenes
      navigate("/orders");
    } catch (err) {
      console.error("CHECKOUT ERROR =>", err);
      setError(
        err.response?.data?.message ||
          "Ocurrió un error al procesar el checkout."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: "1.5rem", maxWidth: "700px", margin: "0 auto" }}>
      <h1>Checkout</h1>

      <h3 style={{ marginTop: "1rem" }}>Resumen de la compra</h3>
      <ul>
        {cart.items.map((item) => (
          <li key={item.product._id}>
            {item.product.name} x{item.quantity} — price{" "}
            {(item.product.price * item.quantity).toFixed(2)}
          </li>
        ))}
      </ul>
      <h3>Total: {total.toFixed(2)}</h3>

      <form onSubmit={handleSubmit} style={{ marginTop: "1.5rem" }}>
        <h3>Datos de envío</h3>

        <div style={{ marginBottom: "0.5rem" }}>
          <label>Calle y número</label>
          <input
            type="text"
            name="street"
            value={shippingAddress.street}
            onChange={handleAddressChange}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <div style={{ marginBottom: "0.5rem" }}>
          <label>Ciudad</label>
          <input
            type="text"
            name="city"
            value={shippingAddress.city}
            onChange={handleAddressChange}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <div style={{ marginBottom: "0.5rem" }}>
          <label>Provincia</label>
          <input
            type="text"
            name="province"
            value={shippingAddress.province}
            onChange={handleAddressChange}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <div style={{ marginBottom: "0.5rem" }}>
          <label>Código postal</label>
          <input
            type="text"
            name="zip"
            value={shippingAddress.zip}
            onChange={handleAddressChange}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <div style={{ marginBottom: "0.5rem" }}>
          <label>País</label>
          <input
            type="text"
            name="country"
            value={shippingAddress.country}
            onChange={handleAddressChange}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <h3 style={{ marginTop: "1rem" }}>Método de pago</h3>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          style={{ padding: "0.5rem", marginBottom: "1rem" }}
        >
          <option value="mercado_pago">Mercado Pago</option>
          <option value="transferencia">Transferencia</option>
          <option value="tarjeta">Tarjeta</option>
        </select>

        {error && (
          <p style={{ color: "red", marginBottom: "0.5rem" }}>{error}</p>
        )}

        <button type="submit" disabled={submitting}>
          {submitting ? "Procesando..." : "Confirmar compra"}
        </button>
      </form>
    </div>
  );
}

export default CheckoutPage;
