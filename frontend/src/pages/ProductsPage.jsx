import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../api/products.js";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

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
    <div className="page">
      <div className="page-inner">
        {/* Header */}
        <header className="page-header">
          <div>
            <h1>Productos</h1>
            <p>Explorá el catálogo disponible en la tienda.</p>
          </div>

          <form className="products-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Buscar productos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit">Buscar</button>
          </form>
        </header>

        {/* Mensajes */}
        {message && (
          <p className="page-message" style={{ color: "green" }}>
            {message}
          </p>
        )}
        {cartError && (
          <p className="page-message" style={{ color: "red" }}>
            {cartError}
          </p>
        )}

        {loading && <p className="page-message">Cargando productos...</p>}

        {!loading && products.length === 0 && (
          <p className="page-message">No se encontraron productos.</p>
        )}

        {/* Grid de productos */}
        <div className="products-grid">
          {products.map((p) => {
            const id = p._id || p.id;
            return (
              <article key={id} className="product-card">
                {/*Imagen del producto*/}
                {p.images?.length > 0 && (
                  <div className="product-image-wrapper">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="product-image"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                )}

                <div className="product-content">
                  <h3 className="product-title">{p.name}</h3>

                  {p.category && (
                    <span className="product-badge">{p.category}</span>
                  )}

                  <p className="product-description">
                    {p.description
                      ? p.description.slice(0, 80) +
                        (p.description.length > 80 ? "..." : "")
                      : "Sin descripción."}
                  </p>

                  <div className="product-footer">
                    <div className="product-price">
                      <span>${p.price.toFixed(2)}</span>
                      {p.stock !== undefined && (
                        <small>{p.stock} en stock</small>
                      )}
                    </div>
                    <button
                      className="btn-secondary"
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
