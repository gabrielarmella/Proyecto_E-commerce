import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Loader from "../components/Loader";
import ErrorAlert from "../components/ErrorAlert";

export default function CartPage() {
  const { items, loading, error, updateQty, removeItem, subtotal } = useCart();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Carrito</h1>
      <ErrorAlert message={error} />
      {loading ? (
        <Loader />
      ) : items.length === 0 ? (
        <p>No hay productos en el carrito.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.productId || item.product?._id}
              className="bg-white shadow rounded p-3 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{item.name || item.product?.name}</p>
                <p className="text-gray-600">${item.price || item.product?.price}</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  className="border px-2 py-1 w-20 rounded"
                  value={item.quantity}
                  onChange={(e) =>
                    updateQty({
                      productId: item.productId || item.product?._id,
                      quantity: Number(e.target.value),
                    })
                  }
                />
                <button
                  className="text-sm text-red-500"
                  onClick={() => removeItem(item.productId || item.product?._id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
          <div className="flex justify-between items-center font-semibold">
            <span>Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <Link
            to="/checkout"
            className="inline-block bg-green-600 text-white px-4 py-2 rounded"
          >
            Checkout
          </Link>
        </div>
      )}
    </div>
  );
}
