import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import * as ordersApi from "../api/orders.api.js";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    street: "",
    city: "",
    province: "",
    zip: "",
    country: "Argentina",
    payment: "mercadoPago",
  });

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!items.length) {
      setError("Cart is empty");
      return;
    }
    if (!form.street || !form.city) {
      setError("Street and city are required");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        mediosPago: form.payment,
        direccionEnvio: {
          calle: form.street,
          ciudad: form.city,
          provincia: form.province,
          codigoPostal: form.zip,
          pais: form.country,
        },
      };
      const res = await ordersApi.checkout(payload);
      if (!res?.success) throw new Error(res?.error?.message || "Checkout failed");
      await clearCart();
      navigate("/orders", { replace: true });
    } catch (err) {
      setError(err?.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-card">
        <div className="checkout-header text-center">
          <h1>Resumen de su compra</h1>
          <p>Total: ${total}</p>
        </div>

        {error && <div className="form-error">{error}</div>}

        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Calle</label>
            <input value={form.street} onChange={handleChange("street")} required />
          </div>
          <div className="form-row">
            <label>Ciudad</label>
            <input value={form.city} onChange={handleChange("city")} required />
          </div>
          <div className="form-grid-2">
            <div className="form-row">
              <label>Provincia</label>
              <input value={form.province} onChange={handleChange("province")} />
            </div>
            <div className="form-row">
              <label>Codigo Postal</label>
              <input value={form.zip} onChange={handleChange("zip")} />
            </div>
          </div>
          <div className="form-row">
            <label>País</label>
            <input value={form.country} onChange={handleChange("country")} />
          </div>
          <div className="form-row">
            <label>Medio de Pago</label>
            <select value={form.payment} onChange={handleChange("payment")}>
              <option value="mercadoPago">MercadoPago</option>
              <option value="tarjeta">Tarjeta Credito</option>
              <option value="transferencia">Transfer</option>
            </select>
          </div>
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Processing..." : "Confirm order"}
          </button>
        </form>
      </div>
    </div>
  );
}
