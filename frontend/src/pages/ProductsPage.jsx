import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import client, {API_BASE_URL} from "../api/client.api.js";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const resolveImageUrl = (value = "") => {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("/uploads")) return `${API_BASE_URL}${value}`;
  if (value.startsWith("uploads/")) return `${API_BASE_URL}/${value}`;
  return value;
}

export default function ProductsPage() {
  const { addItem } = useCart();
  const { id } = useParams();
  const { handleOAuthToken } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await client.get("/api/products");
        const list = data?.data?.products ?? data?.data ?? [];
        setProducts(list);
      } catch {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (!token) return;

    const handle = async () => {
      const ok = await handleOAuthToken(token);
      if (ok) {
        navigate("/products", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    };

    handle();
  }, [location.search, handleOAuthToken, navigate]);

  if (loading) return <div>Cargando productos...</div>;
  if (error) return <div className="form-error">{error}</div>;
  if (!products.length) return <div>Sin productos disponibles.</div>;

return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => {
        const imageUrl =
          resolveImageUrl(product.images?.[0] || product.image || product.Image || "") ||
          "https://via.placeholder.com/600x400.png?text=Producto";

        return (
          <div
            key={product._id}
            className="border rounded p-4 bg-white cursor-pointer"
            onClick={() => navigate(`/products/${product._id}`)}
          >
            <div className="w-full h-44 bg-gray-50 rounded mb-3 flex items-center justify-center overflow-hidden">
              <img
                src={imageUrl}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-sm text-gray-600">${product.price}</p>
            <button className="btn-primary w-full" onClick={async() => {await addItem(product._id, 1, product); navigate("/cart")}}>
              Comprar ahora
            </button>
            <button
              className="btn-primary mt-3"
              onClick={(e) => {
                e.stopPropagation();
                addItem(product._id, 1, product);
              }}
            >
              Añadir al carrito
            </button>
          </div>
        );
      })}
    </div>
  );
}