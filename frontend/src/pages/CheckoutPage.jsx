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
      const payload = {paymentMethod, shippingAddress};
      await checkoutRequest(payload);
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
  <div className="checkout-page">
    <div className="checkout-card">
      <div className="checkout-header">
        <h1>Checkout</h1>
        <p>Revisá tu pedido y completá los datos para finalizar la compra.</p>
      </div>

      {/* GRID: Resumen + Formulario */}
      <div className="checkout-grid">
        {/* Resumen de compra */}
        <div className="checkout-summary">
          <h3>Resumen de la compra</h3>
          <ul className="summary-list">
            {cart.items.map((item) => (
              <li key={item.product._id} className="summary-item">
                <div>
                  <p className="summary-product-name">
                    {item.product.name}
                  </p>
                  <p className="summary-product-detail">
                    Cantidad: {item.quantity}
                  </p>
                </div>
                <p className="summary-product-price">
                  $ {(item.product.price * item.quantity).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
          <div className="summary-total">
            <span>Total</span>
            <span>$ {total.toFixed(2)}</span>
          </div>
        </div>

        {/* Formulario de envío y pago */}
        <div className="checkout-form">
          <form onSubmit={handleSubmit}>
            <h3>Datos de envío</h3>

            <div className="form-row">
              <label>Calle y número</label>
              <input
                type="text"
                name="street"
                value={shippingAddress.street}
                onChange={handleAddressChange}
                required
              />
            </div>

            <div className="form-grid-2">
              <div className="form-row">
                <label>Ciudad</label>
                <input
                  type="text"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleAddressChange}
                  required
                />
              </div>

              <div className="form-row">
                <label>Provincia</label>
                <input
                  type="text"
                  name="province"
                  value={shippingAddress.province}
                  onChange={handleAddressChange}
                  required
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-row">
                <label>Código postal</label>
                <input
                  type="text"
                  name="zip"
                  value={shippingAddress.zip}
                  onChange={handleAddressChange}
                  required
                />
              </div>

              <div className="form-row">
                <label>País</label>
                <input
                  type="text"
                  name="country"
                  value={shippingAddress.country}
                  onChange={handleAddressChange}
                  required
                />
              </div>
            </div>

            <h3 style={{ marginTop: "1rem" }}>Método de pago</h3>
            <div className="form-row">
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="mercado_pago">Mercado Pago</option>
                <option value="transferencia">Transferencia</option>
                <option value="tarjeta">Tarjeta</option>
              </select>
            </div>

            {error && <p className="form-error">{error}</p>}

            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? "Procesando..." : "Confirmar compra"}
            </button>

            <p className="checkout-note">
              Al confirmar la compra aceptás los términos y condiciones del
              servicio.
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
  );
}

export default CheckoutPage;
