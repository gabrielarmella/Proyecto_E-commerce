import { useEffect, useState } from "react";
import { getProducts } from "../api/products.api";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import Loader from "../components/Loader";
import ErrorAlert from "../components/ErrorAlert";

export default function ProductsPage() {
  const { addToCart, loading: cartLoading } = useCart();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async (p = 1) => {
    setLoading(true);
    setError("");
    try {
      const res = await getProducts({
        page: p,
        q: search || undefined,
        category: category || undefined,
      });
      const list = Array.isArray(res?.products) ? res.products : res;
      setProducts(list);
      const totalPages = res?.pagination?.pages || 1;
      setPages(totalPages);
      setPage(p);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchData(1);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Productos</h1>
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          className="border px-3 py-2 rounded w-full"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="px-4 py-2 bg-indigo-600 text-white rounded">Buscar</button>
      </form>

      <ErrorAlert message={error} />
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-4">
            {products.map((p) => (
              <ProductCard
                key={p._id}
                product={p}
                onAdd={() => addToCart({ productId: p._id, quantity: 1 })}
                disabled={cartLoading}
              />
            ))}
          </div>
          <Pagination page={page} pages={pages} onChange={fetchData} />
        </>
      )}
    </div>
  );
}