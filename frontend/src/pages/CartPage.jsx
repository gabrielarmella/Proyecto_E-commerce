import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function CartPage() {
  const { items, itemCount, total, loading, error, updateQty, removeItem, clearCart } = useCart();

  const handleIncrease = (item) => {
    const nextQty = Number(item.quantity || 0) + 1;
    updateQty(item.productId, nextQty);
  };

  const handleDecrease = (item) => {
    const nextQty = Number(item.quantity || 0) - 1;
    if (nextQty < 1) return;
    updateQty(item.productId, nextQty);
  };

  if (loading) return <div>Cargando carrito...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Cart</h1>
        <span className="text-sm text-gray-600">Items: {itemCount}</span>
      </div>

      {error && <div className="form-error">{error}</div>}

      {!items.length ? (
        <div className="bg-white border rounded p-6">
          <p>Tu carrito esta vacio.</p>
          <Link className="btn-primary mt-4 inline-block w-auto" to="/products">
            Ver los Productos
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
          <div className="space-y-3">
            {items.map((item) => {
              const imageUrl =
                item.image || item.Image || (Array.isArray(item.images) ? item.images[0] : "");
              const lineTotal = Number(item.price || 0) * Number(item.quantity || 0);

              return (
                <div key={item.productId} className="bg-white border rounded p-4 flex gap-4">
                  {imageUrl ? (
                    <img src={imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded" />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded" />
                  )}

                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">${item.price}</p>

                    <div className="mt-3 flex items-center gap-2">
                      <button
                        className="px-2 py-1 border rounded"
                        onClick={() => handleDecrease(item)}
                        disabled={Number(item.quantity) <= 1}
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button className="px-2 py-1 border rounded" onClick={() => handleIncrease(item)}>
                        +
                      </button>
                      <button
                        className="ml-2 text-sm text-red-600"
                        onClick={() => removeItem(item.productId)}
                      >
                        Quitar
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">${lineTotal}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white border rounded p-4 h-fit">
            <h2 className="font-semibold">Resumen</h2>
            <p className="mt-2">Total: ${total}</p>
            <div className="mt-4 flex flex-col gap-2">
              <Link className="btn-primary text-center" to="/checkout">
                Ir a pagar
              </Link>
              <button className="px-4 py-2 border rounded" onClick={clearCart}>
                Vaciar carrito
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
