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
    return <p className="px-4 py-8 text-center text-slate-600">Cargando carrito...</p>;
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
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
            Checkout
          </h1>
          <p className="text-slate-600 mt-1">
            Revisá tu pedido y completá los datos para finalizar la compra.
          </p>
        </header>

        {error && (
          <p className="mb-4 inline-flex items-center rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
            {error}
          </p>
        )}

        {/* GRID: Resumen + Formulario */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Resumen de la compra */}
          <section className="w-full lg:w-72 bg-white rounded-xl shadow-sm border border-slate-200 p-5 h-fit">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">
              Resumen de la compra
            </h3>

            <ul className="space-y-3 mb-4">
              {cart.items.map((item) => (
                <li
                  key={item.product._id}
                  className="flex items-start justify-between gap-3 border-b border-slate-100 pb-2 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      Cantidad: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">
                    $
                    {(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between border-t border-slate-200 pt-3 mt-2">
              <span className="text-sm font-semibold text-slate-900">
                Total
              </span>
              <span className="text-lg font-semibold text-slate-900">
                $ {total.toFixed(2)}
              </span>
            </div>
          </section>

          {/* Formulario de datos */}
          <section className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dirección de envío */}
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-3">
                  Dirección de envío
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Calle y número
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={shippingAddress.street}
                      onChange={handleAddressChange}
                      required
                      className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Ciudad
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleAddressChange}
                      required
                      className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Provincia
                    </label>
                    <input
                      type="text"
                      name="province"
                      value={shippingAddress.province}
                      onChange={handleAddressChange}
                      required
                      className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Código postal
                    </label>
                    <input
                      type="text"
                      name="zip"
                      value={shippingAddress.zip}
                      onChange={handleAddressChange}
                      required
                      className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      País
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={shippingAddress.country}
                      onChange={handleAddressChange}
                      required
                      className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Método de pago */}
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-3">
                  Método de pago
                </h2>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-slate-800">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="mercado_pago"
                      checked={paymentMethod === "mercado_pago"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                    />
                    Mercado Pago
                  </label>

                  <label className="flex items-center gap-2 text-sm text-slate-800">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="transferencia"
                      checked={paymentMethod === "transferencia"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                    />
                    Transferencia bancaria
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-800">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="transferencia"
                      checked={paymentMethod === "tarjeta_credito"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                    />
                    Tarjeta de crédito
                  </label>
                </div>
              </div>

              {/* Botón */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? "Procesando..." : "Finalizar compra"}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;