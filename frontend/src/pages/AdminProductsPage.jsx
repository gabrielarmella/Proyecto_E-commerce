import { useEffect, useState } from "react";
import { getProducts } from "../api/products.api";
import api from "../api/client";
import Loader from "../components/Loader";
import ErrorAlert from "../components/ErrorAlert";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: 0, stock: 0 });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getProducts();
      const list = Array.isArray(res?.products) ? res.products : res;
      setProducts(list);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    try {
      await api.post("/products", form);
      setMsg("Producto creado");
      setForm({ name: "", price: 0, stock: 0 });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Loader />;
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Admin Productos</h1>
      <ErrorAlert message={error} />
      {msg && <div className="text-green-600 mb-3">{msg}</div>}

      <form onSubmit={onSubmit} className="bg-white shadow rounded p-3 mb-4 space-y-2">
        <input
          className="border px-3 py-2 rounded w-full"
          placeholder="Nombre"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="number"
          className="border px-3 py-2 rounded w-full"
          placeholder="Precio"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
        />
        <input
          type="number"
          className="border px-3 py-2 rounded w-full"
          placeholder="Stock"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
        />
        <button className="bg-indigo-600 text-white px-4 py-2 rounded">Crear</button>
      </form>

      <div className="grid md:grid-cols-2 gap-3">
        {products.map((p) => (
          <div key={p._id} className="bg-white shadow rounded p-3 flex justify-between">
            <div>
              <p className="font-semibold">{p.name}</p>
              <p className="text-sm text-gray-600">
                ${p.price} - stock: {p.stock}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
