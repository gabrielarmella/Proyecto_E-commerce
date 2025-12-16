import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../api/products.js";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [addingId, setAddingId] = useState(null);

  const navigate = useNavigate();
  const { addItem, loading: cartLoading, error: cartError } = useCart();
  const { user } = useAuth();

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts({ search, page: 1, limit: 20 });
      setProducts(data.data);
    } catch (err) {
      console.error("Error al cargar productos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    loadProducts();
  };

  const handleAddToCart = async (productId) => {
    setMessage("");
    setAddingId(productId);

    const res = await addItem(productId, 1);

    setAddingId(null);

    if (res?.needsAuth) {
      navigate("/login");
      return;
    }
    if (res?.success) {
      setMessage("✅ Producto agregado al carrito.");
    } else if (res?.message) {
      setMessage(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex flex-col gap-4 items-start justify-between md:flex-row md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
              Productos
            </h1>
            <p className="text-slate-600 mt-1">
              Explorá el catálogo disponible en la tienda.
            </p>
          </div>

          <form
            className="w-full md:w-auto flex gap-2"
            onSubmit={handleSearch}
          >
            <input
              type="text"
              placeholder="Buscar productos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-64 rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              Buscar
            </button>
          </form>
        </header>

        {/* Mensajes */}
        {message && (
          <p className="mb-3 inline-flex items-center rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
            {message}
          </p>
        )}

        {cartError && (
          <p className="mb-3 inline-flex items-center rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
            {cartError}
          </p>
        )}

        {loading && (
          <p className="text-sm text-slate-600 mb-4">Cargando productos...</p>
        )}

        {!loading && products.length === 0 && (
          <p className="text-sm text-slate-600 mb-4">
            No se encontraron productos.
          </p>
        )}

        {/* Grid de productos */}
        <div className="mt-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => {
            const id = p._id || p.id;
            return (
              <article
                key={id}
                className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col"
              >
                {/* Imagen del producto */}
                {p.images?.length > 0 && (
                  <div className="w-full h-48 bg-slate-100 rounded-t-xl overflow-hidden flex items-center justify-center">
                    <img
                      src={`${API_URL}${p.images[0]}`}
                      alt={p.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/600x400?text=Sin+imagen";
                      }}
                    />
                  </div>
                )}

                <div className="p-4 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-semibold text-slate-900">
                      {p.name}
                    </h3>

                    {p.category && (
                      <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700">
                        {p.category}
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-sm text-slate-600 flex-1">
                    {p.description
                      ? p.description.slice(0, 80) +
                        (p.description.length > 80 ? "..." : "")
                      : "Sin descripción."}
                  </p>

                  <div className="mt-4 flex items-end justify-between gap-3">
                    <div className="flex flex-col">
                      <span className="text-lg font-semibold text-slate-900">
                        ${p.price.toFixed(2)}
                      </span>
                      {p.stock !== undefined && (
                        <small className="text-[11px] text-slate-500">
                          {p.stock} en stock
                        </small>
                      )}
                    </div>

                    <button
                      className="inline-flex items-center justify-center rounded-md border border-indigo-600 px-3 py-2 text-xs sm:text-sm font-medium text-indigo-600 hover:bg-indigo-50 disabled:opacity-60 disabled:cursor-not-allowed"
                      onClick={() => handleAddToCart(id)}
                      disabled={cartLoading && addingId === id}
                    >
                      {cartLoading && addingId === id
                        ? "Agregando..."
                        : user
                        ? "Agregar al carrito"
                        : "Inicia sesión para comprar"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;