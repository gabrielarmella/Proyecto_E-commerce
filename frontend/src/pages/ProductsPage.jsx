import { useEffect, useState } from "react";
import { getProducts } from "../api/products.js";

function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

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

    return (
        <div style={{ padding: "1.5rem" }}>
            <h1>Productos</h1>

            <form onSubmit={handleSearch} style={{ marginBottom: "1rem" }}>
                <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ padding: "0.5rem", marginRight: "0.5rem" }}
                />
                <button type="submit" style={{ padding: "0.5rem 1rem" }}>
                    Buscar
                </button>
            </form>

            {loading && <p>Cargando productos...</p>}

            {!loading && products.length === 0 && <p>No se encontraron productos.</p>}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: "1rem",
                }}
            >
                {products.map((p) => (
                    <div
                        key={p.id}
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            padding: "1rem",
                            textAlign: "center",
                        }}
                    >
                        <h3>{p.name}</h3>
                        <p>
                            <strong>Precio:</strong> ${p.price.toFixed(2)}
                        </p>
                        <p style={{ fontSize: "0.9rem", color: "#555"}}>
                            {p.description?.slice(0, 80)}...
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductsPage;