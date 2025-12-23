import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../api/products.api";
import { useCart } from "../context/CartContext";
import Loader from "../components/Loader";
import ErrorAlert from "../components/ErrorAlert";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await getProductById(id);
        setProduct(res);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <ErrorAlert message={error} />;
  if (!product) return <ErrorAlert message="Producto no encontrado" />;

  return (
    <div className="bg-white shadow rounded p-4">
      <h1 className="text-2xl font-semibold mb-2">{product.name}</h1>
      <p className="text-gray-700 mb-3">{product.description}</p>
      <p className="text-xl font-bold text-indigo-600 mb-4">${product.price}</p>
      <div className="flex items-center gap-2 mb-4">
        <label>Cantidad</label>
        <input
          type="number"
          min="1"
          className="border px-3 py-2 rounded w-24"
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
        />
      </div>
      <button
        className="bg-indigo-600 text-white px-4 py-2 rounded"
        onClick={() => addToCart({ productId: product._id, quantity: qty })}
      >
        Agregar al carrito
      </button>
    </div>
  );
}
