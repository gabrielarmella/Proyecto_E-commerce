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
      <div className="page">
        <div className="page-inner">
          <div className="cart-empty">
            <h1>Debes iniciar sesión</h1>
            <p>Inicia sesión para ver y gestionar tu carrito.</p>
            <button onClick={() => navigate("/login")} className="btn-secondary">
              Ir a login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading && !cart) {
    return <p className="page-message">Cargando carrito...</p>;
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
      <div className="page">
        <div className="page-inner">
          <div className="cart-empty">
            <h1>Tu carrito está vacío</h1>
            <p>Agregá productos desde el catálogo para verlos acá.</p>
            <Link to="/" className="btn-secondary">
              Ver productos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-inner">
        <header className="page-header">
          <div>
            <h1>Carrito</h1>
            <p>Revisá los productos antes de finalizar tu compra.</p>
          </div>
          <div>
            <button onClick={clearCart} className="btn-link">
              Vaciar carrito
            </button>
          </div>
        </header>

        {error && (
          <p className="page-message" style={{ color: "red" }}>
            {error}
          </p>
        )}

        <div className="cart-layout">
          {/* Tabla de items */}
          <div className="cart-card">
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio unitario</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const id = item.product?._id || item.product?.id;
                  const price = item.product?.price || 0;
                  const subtotal = price * item.quantity;

                  return (
                    <tr key={id}>
                      <td className="cart-product-cell">
                        <div className="cart-product-info">
                          <span className="cart-product-name">
                            {item.product?.name}
                          </span>
                        </div>
                      </td>
                      <td className="cart-number-cell">
                        ${price.toFixed(2)}
                      </td>
                      <td className="cart-number-cell">
                        <input
                          className="cart-qty-input"
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(id, e.target.value)
                          }
                        />
                      </td>
                      <td className="cart-number-cell">
                        ${subtotal.toFixed(2)}
                      </td>
                      <td className="cart-actions-cell">
                        <button
                          className="cart-remove-btn"
                          onClick={() => removeItem(id)}
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

          {/* Resumen */}
          <aside className="cart-summary-card">
            <h2>Resumen</h2>
            <div className="cart-summary-row">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="cart-summary-row">
              <span>Envío</span>
              <span>A convenir</span>
            </div>
            <div className="cart-summary-total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <Link to="/checkout">
              <button className="btn-primary cart-checkout-btn">
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
