import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function CartPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    items,
    cart,
    loading,
    error,
    fetchCart,
    updateItemQuantity,
    removeItem,
    clearCart,
  } = useCart();

  useEffect(() => {
    if (user) fetchCart();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
            <h1 className="text-2xl font-semibold text-slate-900 mb-2">
              Debes iniciar sesión
            </h1>
            <p className="text-slate-600 mb-6">
              Inicia sesión para ver y gestionar tu carrito.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              Ir a login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading && !cart) {
    return (
      <p className="px-4 py-8 text-center text-slate-600">
        Cargando carrito...
      </p>
    );
  }

  const total = items.reduce(
    (acc, it) => acc + (it.product?.price || 0) * it.quantity,
    0
  );

  const handleQuantityChange = async (productId, value) => {
    const qty = Number(value);
    if (!Number.isInteger(qty) || qty <= 0) return;
    await updateItemQuantity(productId, qty);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
            <h1 className="text-2xl font-semibold text-slate-900 mb-2">
              Tu carrito está vacío
            </h1>
            <p className="text-slate-600 mb-6">
              Agregá productos desde el catálogo para verlos acá.
            </p>
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-md border border-indigo-600 px-5 py-2.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
            >
              Ver productos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex flex-col gap-4 items-start justify-between md:flex-row md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
              Carrito
            </h1>
            <p className="text-slate-600 mt-1">
              Revisá los productos antes de finalizar tu compra.
            </p>
          </div>
          <div>
            <button
              onClick={clearCart}
              className="text-sm font-medium text-red-600 hover:text-red-700 hover:underline"
            >
              Vaciar carrito
            </button>
          </div>
        </header>

        {error && (
          <p className="mb-4 inline-flex items-center rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
            {error}
          </p>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Tabla de items */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">
                      Producto
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-700">
                      Precio unitario
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-700">
                      Cantidad
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-700">
                      Subtotal
                    </th>
                    <th className="px-2 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const id = item.product?._id || item.product?.id;
                    const price = item.product?.price || 0;
                    const subtotal = price * item.quantity;

                    return (
                      <tr
                        key={id}
                        className="border-b border-slate-100 last:border-0"
                      >
                        <td className="px-4 py-3 align-middle">
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-900">
                              {item.product?.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right text-slate-700 align-middle">
                          ${price.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-center align-middle">
                          <input
                            className="w-20 rounded-md border border-slate-300 px-2 py-1 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(id, e.target.value)
                            }
                          />
                        </td>
                        <td className="px-4 py-3 text-right text-slate-900 font-medium align-middle">
                          ${subtotal.toFixed(2)}
                        </td>
                        <td className="px-2 py-3 text-center align-middle">
                          <button
                            className="text-slate-400 hover:text-red-500 text-lg leading-none"
                            onClick={() => removeItem(id)}
                            aria-label="Eliminar producto"
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Resumen */}
          <aside className="w-full lg:w-80 bg-white rounded-xl shadow-sm border border-slate-200 p-5 h-fit">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Resumen
            </h2>

            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-slate-600">Subtotal</span>
              <span className="font-medium text-slate-900">
                ${total.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm mb-4">
              <span className="text-slate-600">Envío</span>
              <span className="text-slate-900">A convenir</span>
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 pt-3 mt-2 mb-5">
              <span className="text-sm font-semibold text-slate-900">
                Total
              </span>
              <span className="text-lg font-semibold text-slate-900">
                ${total.toFixed(2)}
              </span>
            </div>

            <Link to="/checkout" className="block">
              <button className="w-full inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2">
                Proceder al checkout
              </button>
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default CartPage;