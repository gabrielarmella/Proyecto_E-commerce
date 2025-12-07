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
      <div style={{ padding: "1.5rem" }}>
        <p>Debes iniciar sesión para ver tu carrito.</p>
        <button onClick={() => navigate("/login")}>Ir a login</button>
      </div>
    );
  }

  if (loading && !cart) {
    return <p style={{ padding: "1.5rem" }}>Cargando carrito...</p>;
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

  return (
    <div style={{ padding: "1.5rem" }}>
      <h1>Tu carrito</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {items.length === 0 ? (
        <div>
          <p>No tienes productos en el carrito.</p>
          <Link to="/">Ver productos</Link>
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
            {items.map((item) => (
              <div
                key={item.product?._id || item.product?.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "0.75rem 1rem",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <div>
                  <h3 style={{ margin: 0 }}>{item.product?.name}</h3>
                  <p style={{ margin: "0.25rem 0" }}>
                    Precio: ${item.product?.price?.toFixed(2)}
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <label>
                    Cantidad:
                    <input
                      style={{ marginLeft: "0.4rem", width: "60px" }}
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.product?._id || item.product?.id, e.target.value)
                      }
                    />
                  </label>
                  <button
                    onClick={() =>
                      removeItem(item.product?._id || item.product?.id)
                    }
                  >
                    Eliminar
                  </button>
                </div>
                <div>
                  <strong>
                    Subtotal: ${(item.product?.price || 0 * item.quantity).toFixed(2)}
                  </strong>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: "1.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h3>Total: ${total.toFixed(2)}</h3>
            </div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button onClick={clearCart}>Vaciar carrito</button>
              <Link to="/checkout">
                <button disabled={!items.length}>Proceder al checkout</button>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );

}

export default CartPage;
